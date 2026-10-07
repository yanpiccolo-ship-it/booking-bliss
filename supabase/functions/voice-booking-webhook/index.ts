import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-webhook-secret",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Send a POST request with JSON body." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const text = await req.text();
    if (!text || text.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Empty body. Send a JSON payload with booking data." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let body: any;
    try {
      body = JSON.parse(text);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Support both flat format and nested Vapi/Retell format
    const customerName =
      body.customer_name ||
      body.customer?.name ||
      body.analysis?.structuredData?.customer_name ||
      "Reserva por voz";

    const phone =
      body.phone ||
      body.customer?.phone ||
      body.phone_number ||
      null;

    const email =
      body.customer_email ||
      body.customer?.email ||
      null;

    const bookingDate =
      body.booking_date ||
      body.analysis?.structuredData?.date ||
      body.date;

    const bookingTime =
      body.booking_time ||
      body.analysis?.structuredData?.time ||
      body.time ||
      "12:00";

    const languageCode =
      body.language_code ||
      body.language ||
      body.analysis?.structuredData?.language ||
      "es";

    const rawTranscript =
      body.raw_transcript ||
      body.analysis?.summary ||
      body.transcript ||
      null;

    const businessId =
      body.business_id ||
      body.businessId;

    const serviceId =
      body.service_id ||
      body.serviceId;

    if (!businessId) {
      return new Response(
        JSON.stringify({ error: "business_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!serviceId) {
      return new Response(
        JSON.stringify({ error: "service_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!bookingDate) {
      return new Response(
        JSON.stringify({ error: "booking_date (or date) is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Real-time availability check (only when the service uses the resource engine)
    const partySize = Number(body.party_size || body.analysis?.structuredData?.party_size) || 1;
    const { data: svc } = await supabase.from("services").select("resource_type_id").eq("id", serviceId).maybeSingle();
    let resourceId: string | null = null;
    if (svc?.resource_type_id) {
      const tryTime = async (t: string) => {
        const { data: r } = await supabase.rpc("assign_best_resource", {
          p_business_id: businessId, p_service_id: serviceId, p_date: bookingDate, p_start_time: t, p_party_size: partySize,
        });
        return r as string | null;
      };
      resourceId = await tryTime(bookingTime);
      if (!resourceId) {
        const [h, m] = String(bookingTime).split(":").map(Number);
        const base = h * 60 + (m || 0);
        const alternatives: string[] = [];
        for (let step = 1; step <= 16 && alternatives.length < 3; step++) {
          for (const sign of [1, -1]) {
            const mins = base + sign * step * 30;
            if (mins < 0 || mins >= 24 * 60 || alternatives.length >= 3) continue;
            const t = `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
            if (await tryTime(t)) alternatives.push(t);
          }
        }
        return new Response(
          JSON.stringify({ success: false, available: false, requested: bookingTime, alternatives: alternatives.sort() }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Allow the voice agent to only check availability before the caller says "yes"
    if (body.check_only === true) {
      return new Response(
        JSON.stringify({ success: true, available: true, requested: bookingTime }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase.from("reservations").insert({
      business_id: businessId,
      service_id: serviceId,
      reservation_date: bookingDate,
      reservation_time: bookingTime,
      customer_name: customerName,
      customer_email: email,
      customer_phone: phone,
      language_code: languageCode,
      raw_transcript: rawTranscript,
      source: "voice",
      status: "confirmed",
      party_size: partySize,
      resource_id: resourceId,
    }).select().single();

    if (error) {
      console.error("Insert error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, reservation: data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Webhook error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
