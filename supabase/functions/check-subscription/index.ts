import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TIER_MAP: Record<string, string> = {
  prod_U0ze0JqoMCb5Up: "basico",
  prod_U0zg0kxz3sqccL: "avanzado",
  prod_U0zhQ6qsR6xoSz: "personalizado",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      // No Stripe customer — ensure DB reflects inactive
      await syncSubscriptionToDb(supabaseClient, user.id, null, null, null, null);
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const hasActiveSub = subscriptions.data.length > 0;
    let productId: string | null = null;
    let subscriptionEnd: string | null = null;
    let stripeSubId: string | null = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      productId = subscription.items.data[0].price.product as string;
      stripeSubId = subscription.id;
    }

    // Sync to business_memberships table
    await syncSubscriptionToDb(supabaseClient, user.id, productId, customerId, stripeSubId, subscriptionEnd);

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      product_id: productId,
      subscription_end: subscriptionEnd,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function syncSubscriptionToDb(
  supabase: any,
  userId: string,
  productId: string | null,
  stripeCustomerId: string | null,
  stripeSubId: string | null,
  subscriptionEnd: string | null,
) {
  // Find user's business
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", userId)
    .maybeSingle();

  if (!business) return; // No business yet, nothing to sync

  // Find matching membership tier
  const tierName = productId ? TIER_MAP[productId] : null;
  let membershipId: string | null = null;

  if (tierName) {
    const { data: membership } = await supabase
      .from("memberships")
      .select("id")
      .eq("tier", tierName)
      .maybeSingle();
    membershipId = membership?.id || null;
  }

  // Check existing business_membership
  const { data: existing } = await supabase
    .from("business_memberships")
    .select("id")
    .eq("business_id", business.id)
    .maybeSingle();

  const now = new Date().toISOString();

  if (productId && membershipId) {
    // Active subscription — upsert
    if (existing) {
      await supabase
        .from("business_memberships")
        .update({
          status: "active",
          membership_id: membershipId,
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubId,
          start_date: now,
          end_date: subscriptionEnd,
          updated_at: now,
        })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("business_memberships")
        .insert({
          business_id: business.id,
          membership_id: membershipId,
          status: "active",
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubId,
          start_date: now,
          end_date: subscriptionEnd,
        });
    }
  } else if (existing) {
    // No active subscription — mark inactive
    await supabase
      .from("business_memberships")
      .update({ status: "inactive", updated_at: now })
      .eq("id", existing.id);
  }
}
