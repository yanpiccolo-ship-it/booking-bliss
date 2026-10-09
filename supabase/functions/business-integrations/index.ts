import { createClient } from "npm:@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.14";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

async function aesKey() {
  const raw = Deno.env.get("INTEGRATIONS_ENCRYPTION_KEY");
  if (!raw) throw new Error("Encryption key missing");
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return crypto.subtle.importKey("raw", hash, "AES-GCM", false, ["encrypt", "decrypt"]);
}
async function encrypt(obj: unknown) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await aesKey(), new TextEncoder().encode(JSON.stringify(obj))));
  const buf = new Uint8Array(12 + ct.length); buf.set(iv); buf.set(ct, 12);
  return btoa(String.fromCharCode(...buf));
}
async function decrypt(s: string) {
  const buf = Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: buf.subarray(0, 12) }, await aesKey(), buf.subarray(12));
  return JSON.parse(new TextDecoder().decode(pt));
}

const PROVIDERS = ["apify", "notion", "smtp"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    const authClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: `Bearer ${token}` } } });
    const { data: claims } = token ? await authClient.auth.getClaims(token) : { data: null };
    const userId = claims?.claims?.sub as string | undefined;
    if (!userId) return json({ error: "Unauthorized" }, 401);

    const body = await req.json().catch(() => ({}));
    const { action, business_id, provider } = body;
    if (typeof business_id !== "string") return json({ error: "business_id required" }, 400);
    const { data: biz } = await admin.from("businesses").select("owner_id, name").eq("id", business_id).maybeSingle();
    const { data: isAdmin } = await admin.from("user_roles").select("id").eq("user_id", userId).eq("role", "admin").maybeSingle();
    if (!biz || (biz.owner_id !== userId && !isAdmin)) return json({ error: "Forbidden" }, 403);

    const load = async (p: string) => {
      const { data } = await admin.from("business_integrations").select("config_ciphertext").eq("business_id", business_id).eq("provider", p).maybeSingle();
      return data ? await decrypt(data.config_ciphertext) : null;
    };

    if (action === "status") {
      const { data } = await admin.from("business_integrations").select("provider, public_info, updated_at").eq("business_id", business_id);
      return json({ items: data ?? [] });
    }

    if (action === "save") {
      if (!PROVIDERS.includes(provider)) return json({ error: "Invalid provider" }, 400);
      const c = body.config || {};
      let pub: Record<string, unknown> = {};
      if (provider === "apify" || provider === "notion") {
        if (typeof c.api_key !== "string" || c.api_key.length < 10) return json({ error: "API key required" }, 400);
        pub = { hint: "••••" + c.api_key.slice(-4) };
      } else {
        for (const f of ["host", "port", "user", "pass", "from_email"]) if (!c[f]) return json({ error: `${f} required` }, 400);
        pub = { host: c.host, port: Number(c.port), user: c.user, from_email: c.from_email, from_name: c.from_name || biz.name };
      }
      const { error } = await admin.from("business_integrations").upsert(
        { business_id, provider, config_ciphertext: await encrypt(c), public_info: pub, updated_at: new Date().toISOString() },
        { onConflict: "business_id,provider" });
      if (error) throw error;
      return json({ ok: true });
    }

    if (action === "remove") {
      await admin.from("business_integrations").delete().eq("business_id", business_id).eq("provider", provider);
      return json({ ok: true });
    }

    if (action === "test") {
      const c = await load(provider);
      if (!c) return json({ error: "Not configured" }, 400);
      if (provider === "apify") {
        const r = await fetch("https://api.apify.com/v2/users/me", { headers: { Authorization: `Bearer ${c.api_key}` } });
        return json({ ok: r.ok, detail: r.ok ? "Apify connected" : await r.text() });
      }
      if (provider === "notion") {
        const r = await fetch("https://api.notion.com/v1/users/me", { headers: { Authorization: `Bearer ${c.api_key}`, "Notion-Version": "2022-06-28" } });
        return json({ ok: r.ok, detail: r.ok ? "Notion connected" : await r.text() });
      }
      const t = nodemailer.createTransport({ host: c.host, port: Number(c.port), secure: Number(c.port) === 465, auth: { user: c.user, pass: c.pass } });
      await t.verify();
      return json({ ok: true, detail: "Mail server connected" });
    }

    if (action === "apify_search") {
      const c = await load("apify");
      if (!c) return json({ error: "Connect Apify first" }, 400);
      const { business_type, city, postal_code } = body;
      if (!business_type || !city) return json({ error: "business_type and city required" }, 400);
      const limit = Math.min(Number(body.limit) || 15, 40);
      const r = await fetch(`https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?timeout=240`, {
        method: "POST",
        headers: { Authorization: `Bearer ${c.api_key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ searchStringsArray: [business_type], locationQuery: [postal_code, city].filter(Boolean).join(" "), maxCrawledPlacesPerSearch: limit, language: "en", scrapeContacts: true }),
      });
      if (!r.ok) return json({ error: "Apify error", status: r.status, details: (await r.text()).slice(0, 500) }, 502);
      const items = await r.json();
      const rows = (items as any[]).slice(0, limit).map((p) => ({
        business_id, name: String(p.title || "Unknown").slice(0, 200), business_type, city, postal_code: postal_code || null,
        website: p.website || null, email: (p.emails && p.emails[0]) || null, phone: p.phone || null,
        notes: [p.categoryName, p.totalScore ? `★ ${p.totalScore} (${p.reviewsCount || 0})` : null, p.address].filter(Boolean).join(" · "),
        status: "new",
      }));
      if (rows.length) await admin.from("b2b_leads").insert(rows);
      return json({ inserted: rows.length });
    }

    if (action === "notion_search") {
      const c = await load("notion");
      if (!c) return json({ error: "Connect Notion first" }, 400);
      const r = await fetch("https://api.notion.com/v1/search", {
        method: "POST",
        headers: { Authorization: `Bearer ${c.api_key}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
        body: JSON.stringify({ query: body.query || "", page_size: 20 }),
      });
      if (!r.ok) return json({ error: "Notion error", details: (await r.text()).slice(0, 500) }, 502);
      const d = await r.json();
      const pages = (d.results || []).map((x: any) => {
        const tp = Object.values(x.properties || {}).find((v: any) => v.type === "title") as any;
        return { id: x.id, type: x.object, url: x.url, title: tp?.title?.[0]?.plain_text || x.title?.[0]?.plain_text || "Untitled" };
      });
      return json({ pages });
    }

    if (action === "send_email") {
      const c = await load("smtp");
      if (!c) return json({ error: "Connect your mail server first" }, 400);
      const { to, subject, text, lead_id } = body;
      if (typeof to !== "string" || !/^\S+@\S+\.\S+$/.test(to) || !subject || !text) return json({ error: "to, subject, text required" }, 400);
      const t = nodemailer.createTransport({ host: c.host, port: Number(c.port), secure: Number(c.port) === 465, auth: { user: c.user, pass: c.pass } });
      await t.sendMail({ from: `"${c.from_name || biz.name}" <${c.from_email}>`, to, subject: String(subject).slice(0, 200), text: String(text).slice(0, 10000) });
      if (lead_id) await admin.from("b2b_leads").update({ status: "sent" }).eq("id", lead_id).eq("business_id", business_id);
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
