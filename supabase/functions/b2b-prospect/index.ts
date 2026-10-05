import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

async function callAI(key: string, system: string, user: string, schema?: Record<string, unknown>) {
  const body: Record<string, unknown> = {
    model: "google/gemini-3.8-flash",
    messages: [{ role: "system", content: system }, { role: "user", content: user }],
  };
  if (schema) body.response_format = { type: "json_schema", json_schema: { name: "result", strict: true, schema } };
  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await r.text();
    const err = new Error(r.status === 402 ? "AI credits exhausted." : r.status === 429 ? "Too many requests, try later." : `AI error ${r.status}: ${t.slice(0, 200)}`);
    (err as any).status = r.status;
    throw err;
  }
  const d = await r.json();
  return d.choices?.[0]?.message?.content ?? "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const key = Deno.env.get("LOVABLE_API_KEY")!;
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return json({ error: "Unauthorized" }, 401);

    const { mode, business_id, city, postal_code, business_type, lead_id } = await req.json();
    const { data: biz } = await supabase.from("businesses").select("owner_id, name").eq("id", business_id).maybeSingle();
    const { data: admin } = await supabase.from("user_roles").select("id").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!biz || (biz.owner_id !== user.id && !admin)) return json({ error: "Forbidden" }, 403);

    if (mode === "search") {
      if (!city || !business_type) return json({ error: "city and business_type are required" }, 400);
      const schema = {
        type: "object", additionalProperties: false, required: ["leads"],
        properties: { leads: { type: "array", items: { type: "object", additionalProperties: false,
          required: ["name", "website", "email", "phone", "notes"],
          properties: { name: { type: "string" }, website: { type: ["string", "null"] }, email: { type: ["string", "null"] }, phone: { type: ["string", "null"] }, notes: { type: "string" } } } } },
      };
      const content = await callAI(key,
        "You are a B2B prospecting assistant. Return up to 8 real, publicly known businesses matching the request. Only include contact data that is publicly listed; use null when unsure. Never invent emails or phones. notes = one line on why it's a good fit for an AI booking platform.",
        `Business type: ${business_type}\nCity: ${city}\nPostal code: ${postal_code || "any"}`, schema);
      let leads: any[] = [];
      try { leads = JSON.parse(content).leads || []; } catch { leads = []; }
      const rows = leads.slice(0, 8).map((l) => ({
        business_id, name: String(l.name).slice(0, 200), business_type, city, postal_code: postal_code || null,
        website: l.website, email: l.email, phone: l.phone, notes: l.notes, status: "new",
      }));
      if (rows.length) await supabase.from("b2b_leads").insert(rows);
      return json({ inserted: rows.length });
    }

    if (mode === "proposal") {
      const { data: lead } = await supabase.from("b2b_leads").select("*").eq("id", lead_id).eq("business_id", business_id).maybeSingle();
      if (!lead) return json({ error: "Lead not found" }, 404);
      const text = await callAI(key,
        "Write a concise, personalized B2B email proposal (max 160 words) offering an AI booking & experience platform (24/7 AI assistant, bookings, CRM). Include a subject line on the first line as 'Subject: ...'. Be truthful; no invented stats. Include an opt-out line.",
        `Sender company: ${biz.name}\nLead: ${lead.name} (${lead.business_type}) in ${lead.city}\nNotes: ${lead.notes || ""}`);
      await supabase.from("b2b_leads").update({ proposal: text, status: "proposal_drafted" }).eq("id", lead_id);
      return json({ proposal: text });
    }

    return json({ error: "Unknown mode" }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, (e as any)?.status === 402 ? 402 : (e as any)?.status === 429 ? 429 : 500);
  }
});
