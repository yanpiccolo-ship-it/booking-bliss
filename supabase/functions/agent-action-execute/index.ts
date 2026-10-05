import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return json({ error: "Unauthorized" }, 401);

    const { action_id, decision } = await req.json();
    if (!action_id || !["approve", "reject"].includes(decision)) return json({ error: "action_id and decision required" }, 400);

    const { data: action } = await supabase.from("agent_actions").select("*").eq("id", action_id).maybeSingle();
    if (!action) return json({ error: "Action not found" }, 404);

    const { data: biz } = await supabase.from("businesses").select("owner_id").eq("id", action.business_id).maybeSingle();
    const { data: admin } = await supabase.from("user_roles").select("id").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!biz || (biz.owner_id !== user.id && !admin)) return json({ error: "Forbidden" }, 403);
    if (action.status !== "pending") return json({ error: "Action already decided", status: action.status }, 409);

    const now = new Date().toISOString();
    if (decision === "reject") {
      await supabase.from("agent_actions").update({ status: "rejected", decided_by: user.id, decided_at: now }).eq("id", action_id);
      await supabase.from("automation_logs").insert({ business_id: action.business_id, trigger_event: "agent_action_rejected", payload: { action_id }, result: "rejected" });
      return json({ status: "rejected" });
    }

    let status = "executed";
    let result: Record<string, unknown> = {};
    const p = action.payload || {};

    if (action.action_type === "create_booking") {
      const { data, error } = await supabase.rpc("flowcore_create_reservation", {
        p_business_id: action.business_id, p_service_id: p.service_id, p_requested_date: p.date,
        p_requested_time: p.time, p_party_size: Number(p.party_size) || 1, p_customer_name: p.customer_name || null,
        p_customer_email: p.customer_email || null, p_customer_phone: p.customer_phone || null, p_source: "ai_agent", p_notes: action.summary,
      });
      if (error || !data?.success) {
        // Fallback: direct insert when no resource engine is configured
        if (data?.error === "no_availability" || error) {
          const { data: ins, error: insErr } = await supabase.from("reservations").insert({
            business_id: action.business_id, service_id: p.service_id, reservation_date: p.date, reservation_time: p.time,
            party_size: Number(p.party_size) || 1, customer_name: p.customer_name, customer_email: p.customer_email,
            customer_phone: p.customer_phone, status: "pending", source: "ai_agent", notes: action.summary,
          }).select("id").single();
          if (insErr) { status = "failed"; result = { error: insErr.message }; }
          else result = { reservation_id: ins.id, note: "Saved as pending (no automatic resource match)" };
        } else { status = "failed"; result = { error: data?.error || "unknown" }; }
      } else result = data;
    } else {
      // Messaging: real delivery requires a verified email domain / WhatsApp. Logged and handed to the owner.
      result = { queued: true, note: "Approved. Real delivery requires a verified email domain or WhatsApp connection.", to: p.to };
    }

    await supabase.from("agent_actions").update({ status, result, decided_by: user.id, decided_at: now }).eq("id", action_id);
    await supabase.from("automation_logs").insert({ business_id: action.business_id, trigger_event: "agent_action_approved", payload: { action_id, type: action.action_type }, result: status });
    return json({ status, result });
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
