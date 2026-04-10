import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json().catch(() => ({}));
    const action = body.action || "process_all";

    const results: Record<string, any> = {};

    // 1. AUTO-CONFIRM: Pending reservations older than 15 min → confirmed
    if (action === "process_all" || action === "auto_confirm") {
      const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      const { data: toConfirm, error } = await supabase
        .from("reservations")
        .update({ status: "confirmed" })
        .eq("status", "pending")
        .lt("created_at", fifteenMinAgo)
        .select("id, customer_name, customer_email");

      results.auto_confirmed = toConfirm?.length || 0;
    }

    // 2. NO-SHOW DETECTION: Past reservations still "confirmed" → no_show
    if (action === "process_all" || action === "no_show") {
      const today = new Date().toISOString().split("T")[0];
      const now = new Date().toTimeString().slice(0, 5);

      const { data: noShows } = await supabase
        .from("reservations")
        .update({ status: "no_show" })
        .eq("status", "confirmed")
        .lt("reservation_date", today)
        .select("id, customer_name, customer_email");

      results.no_shows_marked = noShows?.length || 0;
    }

    // 3. REMINDERS: Find reservations for tomorrow, return list for notification
    if (action === "process_all" || action === "reminders") {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const { data: tomorrowRes } = await supabase
        .from("reservations")
        .select("id, customer_name, customer_email, customer_phone, reservation_date, reservation_time, services(name), businesses(name, contact_email)")
        .eq("reservation_date", tomorrow)
        .in("status", ["pending", "confirmed"]);

      results.reminders_pending = tomorrowRes?.length || 0;
      results.reminder_list = (tomorrowRes || []).map((r: any) => ({
        id: r.id,
        customer: r.customer_name,
        email: r.customer_email,
        phone: r.customer_phone,
        service: r.services?.name,
        business: r.businesses?.name,
        date: r.reservation_date,
        time: r.reservation_time,
      }));
    }

    // 4. COMPLETION: Past confirmed reservations from today → completed
    if (action === "process_all" || action === "complete") {
      const today = new Date().toISOString().split("T")[0];
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
        .toTimeString()
        .slice(0, 5);

      const { data: completed } = await supabase
        .from("reservations")
        .update({ status: "completed" })
        .eq("status", "confirmed")
        .eq("reservation_date", today)
        .lt("reservation_time", twoHoursAgo)
        .select("id");

      results.completed = completed?.length || 0;
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed_at: new Date().toISOString(),
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
