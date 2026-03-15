import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { agent_id, conversation_id, message, business_id } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get agent config
    const { data: agent, error: agentErr } = await supabase
      .from("ai_agents")
      .select("*")
      .eq("id", agent_id)
      .eq("is_active", true)
      .single();

    if (agentErr || !agent) {
      return new Response(JSON.stringify({ error: "Agent not found or inactive" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get or create conversation
    let convId = conversation_id;
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;

    if (authHeader) {
      const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await anonClient.auth.getUser(token);
      userId = user?.id || null;
    }

    if (!convId && userId && business_id) {
      const { data: conv } = await supabase
        .from("agent_conversations")
        .insert({ agent_id, business_id, user_id: userId, status: "active" })
        .select("id")
        .single();
      convId = conv?.id;
    }

    // Get conversation history
    let history: { role: string; content: string }[] = [];
    if (convId) {
      const { data: msgs } = await supabase
        .from("agent_messages")
        .select("role, content")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: true })
        .limit(50);
      history = (msgs || []).map(m => ({ role: m.role, content: m.content }));
    }

    // Save user message
    if (convId) {
      await supabase.from("agent_messages").insert({
        conversation_id: convId,
        role: "user",
        content: message,
      });
    }

    // Get business context if available
    let businessContext = "";
    if (business_id) {
      const { data: biz } = await supabase
        .from("businesses")
        .select("name, vertical, description, contact_phone, contact_email")
        .eq("id", business_id)
        .single();
      
      if (biz) {
        businessContext = `\n\nContexto del negocio:\n- Nombre: ${biz.name}\n- Vertical: ${biz.vertical}\n- Descripción: ${biz.description || "N/A"}\n- Teléfono: ${biz.contact_phone || "N/A"}\n- Email: ${biz.contact_email || "N/A"}`;
      }

      // Get services
      const { data: services } = await supabase
        .from("services")
        .select("name, price_cents, duration_minutes, description")
        .eq("business_id", business_id)
        .eq("is_active", true);
      
      if (services && services.length > 0) {
        businessContext += `\n\nServicios disponibles:\n${services.map(s => `- ${s.name}: €${(s.price_cents / 100).toFixed(2)}, ${s.duration_minutes}min${s.description ? ` (${s.description})` : ""}`).join("\n")}`;
      }
    }

    const systemPrompt = agent.system_prompt + businessContext;

    // Call Lovable AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: agent.ai_model,
        messages: [
          { role: "system", content: systemPrompt },
          ...history,
          { role: "user", content: message },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Payment required for AI usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    // For streaming, we need to also save the full response afterward
    // We'll collect the stream and save it
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            controller.enqueue(new TextEncoder().encode(chunk));

            // Parse SSE to collect full response
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const jsonStr = line.slice(6).trim();
              if (jsonStr === "[DONE]") continue;
              try {
                const parsed = JSON.parse(jsonStr);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) fullResponse += content;
              } catch {}
            }
          }

          // Save assistant response
          if (convId && fullResponse) {
            await supabase.from("agent_messages").insert({
              conversation_id: convId,
              role: "assistant",
              content: fullResponse,
              requires_authorization: agent.requires_authorization && fullResponse.toLowerCase().includes("autorización"),
            });
          }

          controller.close();
        } catch (e) {
          controller.error(e);
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-Conversation-Id": convId || "",
      },
    });

  } catch (e) {
    console.error("agent-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
