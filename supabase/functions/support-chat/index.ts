import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Eres el asistente de soporte 24/7 de FlowBooking.
Responde de forma breve, profesional y útil. Detecta el idioma del usuario y responde en el mismo.
Conoces FlowBooking: SaaS de reservas multi-rubro con módulos para restaurantes, hotelería, wellness, travel, cursos, marketing, inventario y ecommerce.
Si el problema es complejo o requiere acción humana, ofrece crear un ticket y escalar a un agente.
FAQ frecuentes: planes (Básico €390 setup + €49/mo, Profesional €990 + €149/mo, Premium €2900 + €299/mo), pago con Stripe, soporte WhatsApp, integración voz con Vapi.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const { messages, ticket_id, user_id } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      return new Response(JSON.stringify({ error: errText }), {
        status: aiResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResponse.json();
    const reply = data.choices?.[0]?.message?.content || "Lo siento, no pude procesar tu consulta.";

    // Persist if a ticket exists
    if (ticket_id) {
      const lastUserMsg = messages[messages.length - 1];
      if (lastUserMsg?.content) {
        await supabase.from("support_messages").insert([
          { ticket_id, sender_id: user_id ?? null, sender_role: "user", content: lastUserMsg.content },
          { ticket_id, sender_role: "bot", content: reply },
        ]);
      }
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
