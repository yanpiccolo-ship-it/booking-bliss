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

    const body = await req.json();
    const { business_id, service_id, date, start_time, party_size = 1 } = body;

    if (!business_id || !date || !start_time) {
      return new Response(
        JSON.stringify({ error: "business_id, date, and start_time are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If service_id provided, try auto-assign
    if (service_id) {
      const { data: resourceId } = await supabase.rpc("assign_best_resource", {
        p_business_id: business_id,
        p_service_id: service_id,
        p_date: date,
        p_start_time: start_time,
        p_party_size: party_size,
      });

      return new Response(
        JSON.stringify({
          available: !!resourceId,
          assigned_resource_id: resourceId || null,
          date,
          start_time,
          party_size,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Otherwise, get all available resources for this business at given time
    const { data: resources } = await supabase
      .from("resources")
      .select("id, name, capacity, resource_type_id, resource_types(name)")
      .eq("business_id", business_id)
      .eq("status", "active");

    if (!resources || resources.length === 0) {
      return new Response(
        JSON.stringify({ available: false, resources: [], message: "No resources configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get service duration for end_time calc
    let duration = 60;
    if (service_id) {
      const { data: svc } = await supabase
        .from("services")
        .select("duration_minutes")
        .eq("id", service_id)
        .single();
      if (svc) duration = svc.duration_minutes;
    }

    const endTimeDate = new Date(`2000-01-01T${start_time}`);
    endTimeDate.setMinutes(endTimeDate.getMinutes() + duration);
    const end_time = endTimeDate.toTimeString().slice(0, 5);

    const availableResources = [];
    for (const resource of resources) {
      const { data: isAvailable } = await supabase.rpc("check_resource_availability", {
        p_resource_id: resource.id,
        p_date: date,
        p_start_time: start_time,
        p_end_time: end_time,
      });

      if (isAvailable) {
        availableResources.push({
          id: resource.id,
          name: resource.name,
          capacity: resource.capacity,
          type: (resource as any).resource_types?.name,
        });
      }
    }

    return new Response(
      JSON.stringify({
        available: availableResources.length > 0,
        resources: availableResources,
        date,
        start_time,
        end_time,
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
