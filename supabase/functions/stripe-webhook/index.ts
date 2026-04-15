import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const log = (step: string, details?: any) => {
  console.log(`[STRIPE-WEBHOOK] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`);
};

const PRODUCT_TIER_MAP: Record<string, string> = {
  prod_U0ze0JqoMCb5Up: "basico",
  prod_U0zg0kxz3sqccL: "avanzado",
  prod_U0zhQ6qsR6xoSz: "personalizado",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    let event: Stripe.Event;

    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      log("Webhook verified", { type: event.type });
    } else {
      // Fallback: parse without verification (dev mode)
      event = JSON.parse(body) as Stripe.Event;
      log("Webhook parsed (unverified)", { type: event.type });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(stripe, supabase, session);
        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        log("Invoice paid", { customer: invoice.customer, subscription: invoice.subscription });
        // Subscription renewal — ensure status stays active
        if (invoice.subscription) {
          await updateSubscriptionStatus(supabase, invoice.customer as string, "active");
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        log("Payment failed", { customer: invoice.customer });
        await updateSubscriptionStatus(supabase, invoice.customer as string, "past_due");
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        log("Subscription cancelled", { customer: sub.customer });
        await updateSubscriptionStatus(supabase, sub.customer as string, "cancelled");
        break;
      }
      default:
        log("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    log("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

async function handleCheckoutCompleted(
  stripe: Stripe,
  supabase: any,
  session: Stripe.Checkout.Session
) {
  const email = session.customer_email || session.customer_details?.email;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!email) {
    log("No email found in checkout session");
    return;
  }

  log("Processing checkout", { email, customerId, subscriptionId });

  // 1. Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  let userId: string | null = null;
  const existingUser = existingUsers?.users?.find(
    (u: any) => u.email === email
  );

  if (existingUser) {
    userId = existingUser.id;
    log("Existing user found", { userId });
  } else {
    // 2. Create user with temporary password
    const tempPassword = `FB_${crypto.randomUUID().slice(0, 12)}!`;
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    });
    if (createError) {
      log("Error creating user", { error: createError.message });
      return;
    }
    userId = newUser.user.id;
    log("User created", { userId });

    // 3. Create profile
    await supabase.from("profiles").insert({
      user_id: userId,
      display_name: session.customer_details?.name || email.split("@")[0],
      language: "es",
    });

    // 4. Assign business_owner role
    await supabase.from("user_roles").insert({
      user_id: userId,
      role: "business_owner",
    });
  }

  // 5. Get subscription details to determine tier
  let tierName = "basico";
  if (subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const productId = subscription.items.data[0]?.price?.product as string;
      tierName = PRODUCT_TIER_MAP[productId] || "basico";
      log("Determined tier", { productId, tierName });
    } catch (e) {
      log("Could not retrieve subscription", { error: String(e) });
    }
  }

  // 6. Check if business exists
  const { data: existingBusiness } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", userId)
    .maybeSingle();

  let businessId: string;

  if (existingBusiness) {
    businessId = existingBusiness.id;
    log("Existing business found", { businessId });
  } else {
    // Create business
    const businessName = session.customer_details?.name
      ? `${session.customer_details.name}'s Business`
      : `Business ${email.split("@")[0]}`;

    const { data: newBusiness, error: bizError } = await supabase
      .from("businesses")
      .insert({
        owner_id: userId,
        name: businessName,
        vertical: "servicios_profesionales",
        is_active: true,
      })
      .select("id")
      .single();

    if (bizError) {
      log("Error creating business", { error: bizError.message });
      return;
    }
    businessId = newBusiness.id;

    // Link profile to business
    await supabase
      .from("profiles")
      .update({ business_id: businessId })
      .eq("user_id", userId);

    log("Business created", { businessId });
  }

  // 7. Find membership record
  const { data: membership } = await supabase
    .from("memberships")
    .select("id")
    .eq("tier", tierName)
    .maybeSingle();

  if (!membership) {
    log("No membership found for tier", { tierName });
    return;
  }

  // 8. Upsert business_membership
  const { data: existingMembership } = await supabase
    .from("business_memberships")
    .select("id")
    .eq("business_id", businessId)
    .maybeSingle();

  const now = new Date().toISOString();
  const membershipData = {
    business_id: businessId,
    membership_id: membership.id,
    status: "active",
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    start_date: now,
  };

  if (existingMembership) {
    await supabase
      .from("business_memberships")
      .update({ ...membershipData, updated_at: now })
      .eq("id", existingMembership.id);
  } else {
    await supabase.from("business_memberships").insert(membershipData);
  }

  log("Subscription activated", { businessId, tierName, status: "active" });
}

async function updateSubscriptionStatus(
  supabase: any,
  stripeCustomerId: string,
  status: string
) {
  const { data: membership } = await supabase
    .from("business_memberships")
    .select("id")
    .eq("stripe_customer_id", stripeCustomerId)
    .maybeSingle();

  if (membership) {
    await supabase
      .from("business_memberships")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", membership.id);
    log("Subscription status updated", { stripeCustomerId, status });
  }
}
