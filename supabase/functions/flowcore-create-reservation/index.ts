import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const body = await req.json();
    const {
      business_id, service_id, requested_date, requested_time,
      party_size = 1, customer_id, customer_name, customer_email,
      customer_phone, source = "web", notes,
    } = body;

    if (!business_id || !service_id || !requested_date || !requested_time) {
      return new Response(
        JSON.stringify({ success: false, error: "missing_required_fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase.rpc("flowcore_create_reservation", {
      p_business_id: business_id,
      p_service_id: service_id,
      p_requested_date: requested_date,
      p_requested_time: requested_time,
      p_party_size: party_size,
      p_customer_id: customer_id ?? null,
      p_customer_name: customer_name ?? null,
      p_customer_email: customer_email ?? null,
      p_customer_phone: customer_phone ?? null,
      p_source: source,
      p_notes: notes ?? null,
    });

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: data?.success ? 200 : 409,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
