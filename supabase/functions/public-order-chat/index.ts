import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

const SYSTEM_PROMPT = `You are FlowBooking's public AI assistant for a business's website.
You help visitors browse the menu / services, take orders, and book reservations.

RULES:
- Detect the user's language automatically and always reply in that language.
- Use tools to fetch real data — never invent items or prices.
- When taking an order, always collect: items (with quantity), customer name, and either email or phone.
- Confirm the order summary before calling create_order.
- Be concise, warm and professional. Never mention that you are Gemini / Lovable / OpenAI.
- If the visitor asks something unrelated to the business, answer briefly and redirect them.`;

const tools = [
  {
    type: "function",
    function: {
      name: "list_menu",
      description: "List available menu items or services for the current business.",
      parameters: {
        type: "object",
        properties: { category: { type: "string", description: "Optional category filter" } },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_order",
      description: "Create a confirmed order for the business with the given items and customer info.",
      parameters: {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                menu_item_id: { type: "string" },
                quantity: { type: "number" },
              },
              required: ["menu_item_id", "quantity"],
            },
          },
          customer_name: { type: "string" },
          customer_email: { type: "string" },
          customer_phone: { type: "string" },
          notes: { type: "string" },
        },
        required: ["items", "customer_name"],
      },
    },
  },
];

async function runTool(name: string, args: any, businessId: string) {
  if (name === "list_menu") {
    let q = supabase
      .from("menu_items")
      .select("id, name, description, category, price_cents, is_available")
      .eq("business_id", businessId)
      .eq("is_available", true)
      .limit(80);
    if (args?.category) q = q.eq("category", args.category);
    const { data, error } = await q;
    if (error) return { error: error.message };
    return {
      items: (data ?? []).map((i) => ({
        id: i.id,
        name: i.name,
        description: i.description,
        category: i.category,
        price: (i.price_cents ?? 0) / 100,
      })),
    };
  }

  if (name === "create_order") {
    const items = args.items ?? [];
    if (!items.length) return { error: "no_items" };
    // Fetch prices
    const ids = items.map((i: any) => i.menu_item_id);
    const { data: menuRows, error: mErr } = await supabase
      .from("menu_items")
      .select("id, name, price_cents")
      .in("id", ids)
      .eq("business_id", businessId);
    if (mErr) return { error: mErr.message };
    const priceMap = new Map(menuRows!.map((r) => [r.id, r]));
    let total = 0;
    for (const it of items) {
      const row = priceMap.get(it.menu_item_id);
      if (!row) return { error: `unknown_item:${it.menu_item_id}` };
      total += (row.price_cents ?? 0) * (it.quantity ?? 1);
    }
    const { data: order, error: oErr } = await supabase
      .from("orders")
      .insert({
        business_id: businessId,
        customer_name: args.customer_name,
        customer_email: args.customer_email ?? null,
        total_cents: total,
        status: "pending",
        source: "public_chat",
        notes: [args.notes, args.customer_phone ? `Phone: ${args.customer_phone}` : null].filter(Boolean).join(" | ") || null,
      })
      .select()
      .single();
    if (oErr) return { error: oErr.message };
    const orderItems = items.map((it: any) => {
      const row = priceMap.get(it.menu_item_id)!;
      return {
        order_id: order.id,
        business_id: businessId,
        menu_item_id: it.menu_item_id,
        quantity: it.quantity,
        unit_price_cents: row.price_cents ?? 0,
        name: row.name,
        status: "pending",
      };
    });
    const { error: iErr } = await supabase.from("order_items").insert(orderItems);
    if (iErr) return { error: iErr.message };
    return {
      success: true,
      order_id: order.id,
      total: total / 100,
      message: "Order created and sent to the business.",
    };
  }

  return { error: "unknown_tool" };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { businessId, messages } = await req.json();
    if (!businessId || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "invalid_body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load business context
    const { data: biz } = await supabase
      .from("businesses")
      .select("name, vertical, description")
      .eq("id", businessId)
      .maybeSingle();
    const bizCtx = biz
      ? `\n\nBUSINESS: ${biz.name} (${biz.vertical})${biz.description ? " — " + biz.description : ""}`
      : "";

    const convo: any[] = [
      { role: "system", content: SYSTEM_PROMPT + bizCtx },
      ...messages,
    ];

    // Agentic loop (max 4 tool cycles)
    for (let step = 0; step < 4; step++) {
      const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: convo,
          tools,
          tool_choice: "auto",
        }),
      });

      if (!resp.ok) {
        const body = await resp.text();
        console.error("Gateway error", resp.status, body);
        return new Response(
          JSON.stringify({ error: "ai_gateway_error", status: resp.status, details: body }),
          { status: resp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const data = await resp.json();
      const msg = data.choices?.[0]?.message;
      if (!msg) break;
      convo.push(msg);

      const toolCalls = msg.tool_calls ?? [];
      if (!toolCalls.length) {
        return new Response(
          JSON.stringify({ reply: msg.content ?? "" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      for (const tc of toolCalls) {
        let parsed: any = {};
        try { parsed = JSON.parse(tc.function.arguments || "{}"); } catch { /* ignore */ }
        const result = await runTool(tc.function.name, parsed, businessId);
        convo.push({
          role: "tool",
          tool_call_id: tc.id,
          content: JSON.stringify(result),
        });
      }
    }

    return new Response(
      JSON.stringify({ reply: "Sorry, I couldn't complete that request. Please try again." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ error: String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
