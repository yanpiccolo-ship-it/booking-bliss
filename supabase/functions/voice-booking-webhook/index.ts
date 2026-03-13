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

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();

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
