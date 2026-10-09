import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Expose-Headers": "X-Conversation-Id",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

// Image models cannot chat; fall back to a text model for conversation.
const chatModel = (m: string) => (m.includes("image") ? "google/gemini-3.8-flash" : m);

const ACTION_PROTOCOL = `

ACTIONS (mandatory consent model):
You NEVER execute actions yourself. When you want to perform a real action, explain it briefly and then append exactly one block at the very end of your reply:
\`\`\`action
{"type":"create_booking"|"send_message"|"send_proposal","summary":"one line for the owner","payload":{...}}
\`\`\`
- create_booking payload: {"service_id": "<uuid from the services list>", "date":"YYYY-MM-DD","time":"HH:MM","party_size":1,"customer_name":"","customer_email":"","customer_phone":""}
- send_message / send_proposal payload: {"to":"email or phone","subject":"","body":""}
The owner will see Authorize / Reject buttons. Only propose an action when you have all required data. Never invent availability, prices or IDs. You are an AI and must say so if asked.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { agent_id, conversation_id, message, business_id } = await req.json();
    if (!agent_id || typeof message !== "string" || !message.trim()) return json({ error: "agent_id and message are required" }, 400);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Require a signed-in user
    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    const authClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: `Bearer ${token}` } } });
    const { data: claimsData } = token ? await authClient.auth.getClaims(token) : { data: null };
    const user = claimsData?.claims?.sub ? { id: claimsData.claims.sub as string } : null;
    if (!user) return json({ error: "Please sign in to chat with agents." }, 401);
    const userId = user.id;

    // Verify business access (owner or admin)
    let canUseBusiness = false;
    if (business_id) {
      const { data: biz } = await supabase.from("businesses").select("owner_id").eq("id", business_id).maybeSingle();
      const { data: adminRole } = await supabase.from("user_roles").select("id").eq("user_id", userId).eq("role", "admin").maybeSingle();
      canUseBusiness = !!biz && (biz.owner_id === userId || !!adminRole);
      if (!canUseBusiness) return json({ error: "No access to this business" }, 403);
    }

    const { data: agent } = await supabase.from("ai_agents").select("*").eq("id", agent_id).eq("is_active", true).maybeSingle();
    if (!agent) return json({ error: "Agent not found or inactive" }, 404);

    let convId: string | null = conversation_id || null;
    if (convId) {
      const { data: c } = await supabase.from("agent_conversations").select("user_id").eq("id", convId).maybeSingle();
      if (!c || c.user_id !== userId) convId = null;
    }
    if (!convId && business_id) {
      const { data: conv } = await supabase.from("agent_conversations")
        .insert({ agent_id, business_id, user_id: userId, status: "active" }).select("id").single();
      convId = conv?.id ?? null;
    }

    let history: { role: string; content: string }[] = [];
    if (convId) {
      const { data: msgs } = await supabase.from("agent_messages").select("role, content")
        .eq("conversation_id", convId).order("created_at", { ascending: true }).limit(50);
      history = (msgs || []).map((m) => ({ role: m.role, content: m.content }));
      await supabase.from("agent_messages").insert({ conversation_id: convId, role: "user", content: message });
    }

    let businessContext = "";
    if (business_id) {
      const { data: biz } = await supabase.from("businesses")
        .select("name, vertical, description, contact_phone, contact_email").eq("id", business_id).single();
      if (biz) businessContext = `\n\nBusiness context:\n- Name: ${biz.name}\n- Vertical: ${biz.vertical}\n- Description: ${biz.description || "N/A"}\n- Phone: ${biz.contact_phone || "N/A"}\n- Email: ${biz.contact_email || "N/A"}`;
      const { data: services } = await supabase.from("services")
        .select("id, name, price_cents, duration_minutes").eq("business_id", business_id).eq("is_active", true);
      if (services?.length) businessContext += `\n\nServices:\n${services.map((s) => `- ${s.name} (id: ${s.id}): €${(s.price_cents / 100).toFixed(2)}, ${s.duration_minutes}min`).join("\n")}`;
    }

    const systemPrompt = agent.system_prompt + businessContext + (agent.requires_authorization && business_id ? ACTION_PROTOCOL : "");
    const model = chatModel(agent.ai_model);
    const body: Record<string, unknown> = {
      model,
      messages: [{ role: "system", content: systemPrompt }, ...history, { role: "user", content: message }],
      stream: true,
    };
    if (model.startsWith("openai/")) body.reasoning_effort = "low";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const status = response.status;
      const text = await response.text();
      console.error("gateway error", status, text);
      if (status === 429) return json({ error: "Too many requests. Try again in a moment." }, 429);
      if (status === 402) return json({ error: "AI credits exhausted. Add credits to continue." }, 402);
      return json({ error: `AI service error (${status})` }, status >= 500 ? 502 : status);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let fullResponse = "";
    let buffer = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            let idx: number;
            while ((idx = buffer.indexOf("\n")) !== -1) {
              const line = buffer.slice(0, idx).trim();
              buffer = buffer.slice(idx + 1);
              if (!line.startsWith("data: ")) continue;
              const s = line.slice(6);
              if (s === "[DONE]") continue;
              try {
                const c = JSON.parse(s).choices?.[0]?.delta?.content;
                if (c) fullResponse += c;
              } catch { /* partial */ }
            }
            controller.enqueue(encoder.encode(chunk));
          }

          // Extract proposed action
          let actionRow: Record<string, unknown> | null = null;
          const m = fullResponse.match(/```action\s*([\s\S]*?)```/);
          if (m && convId && business_id && agent.requires_authorization) {
            try {
              const parsed = JSON.parse(m[1]);
              if (["create_booking", "send_message", "send_proposal"].includes(parsed.type)) {
                const { data } = await supabase.from("agent_actions").insert({
                  agent_id, conversation_id: convId, business_id,
                  action_type: parsed.type, summary: String(parsed.summary || parsed.type).slice(0, 300),
                  payload: parsed.payload || {}, status: "pending",
                }).select("id, action_type, summary, payload, status").single();
                actionRow = data;
              }
            } catch (e) { console.error("action parse", e); }
          }

          if (convId && fullResponse) {
            await supabase.from("agent_messages").insert({
              conversation_id: convId, role: "assistant", content: fullResponse,
              requires_authorization: !!actionRow, metadata: actionRow ? { action_id: actionRow.id } : {},
            });
          }
          if (actionRow) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ flow_action: actionRow })}\n\n`));
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "X-Conversation-Id": convId || "" },
    });
  } catch (e) {
    console.error("agent-chat error:", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
