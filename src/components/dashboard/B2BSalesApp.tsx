import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, FileText, ShieldCheck, Copy, Mail, Globe, Phone } from "lucide-react";

interface Lead {
  id: string; name: string; business_type: string | null; city: string | null;
  website: string | null; email: string | null; phone: string | null;
  notes: string | null; proposal: string | null; status: string;
}

const STATUS_LABEL: Record<string, string> = {
  new: "Nuevo", proposal_drafted: "Propuesta lista", authorized: "Autorizado", sent: "Enviado", replied: "Respondió",
};

const B2BSalesApp = ({ businessId }: { businessId: string | null }) => {
  const { toast } = useToast();
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [type, setType] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    if (!businessId) return;
    const { data } = await supabase.from("b2b_leads").select("*").eq("business_id", businessId).order("created_at", { ascending: false });
    setLeads((data as Lead[]) || []);
  };
  useEffect(() => { load(); }, [businessId]);

  const call = async (body: Record<string, unknown>, key: string) => {
    setBusy(key);
    const { data, error } = await supabase.functions.invoke("b2b-prospect", { body: { business_id: businessId, ...body } });
    setBusy(null);
    if (error || data?.error) { toast({ variant: "destructive", title: "Error", description: data?.error || error?.message }); return null; }
    return data;
  };

  const search = async () => {
    if (!city || !type) { toast({ title: "Indica ciudad y rubro" }); return; }
    const d = await call({ mode: "search", city, postal_code: postal, business_type: type }, "search");
    if (d) { toast({ title: `${d.inserted} contactos encontrados` }); load(); }
  };

  const setStatus = async (id: string, status: string) => {
    const patch: Record<string, string> = { status };
    if (status === "authorized") patch.authorized_at = new Date().toISOString();
    if (status === "sent") patch.sent_at = new Date().toISOString();
    await supabase.from("b2b_leads").update(patch).eq("id", id);
    load();
  };

  const send = (l: Lead) => {
    const text = l.proposal || "";
    const subject = text.match(/^Subject:\s*(.*)$/m)?.[1] || "Propuesta";
    const body = text.replace(/^Subject:.*$/m, "").trim();
    if (l.email) window.location.href = `mailto:${l.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    else { navigator.clipboard.writeText(text); toast({ title: "Propuesta copiada" }); }
    setStatus(l.id, "sent");
  };

  if (!businessId) return <p className="text-sm text-muted-foreground p-6">Crea tu negocio para usar el agente de ventas B2B.</p>;

  return (
    <div className="space-y-5">
      <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
        <h3 className="font-display font-bold text-foreground">Buscar negocios</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input value={city} onChange={e => setCity(e.target.value)} placeholder="Ciudad" className="px-4 py-2.5 rounded-xl bg-muted text-sm outline-none" />
          <input value={postal} onChange={e => setPostal(e.target.value)} placeholder="Código postal (opcional)" className="px-4 py-2.5 rounded-xl bg-muted text-sm outline-none" />
          <input value={type} onChange={e => setType(e.target.value)} placeholder="Rubro (ej. spa, hotel)" className="px-4 py-2.5 rounded-xl bg-muted text-sm outline-none" />
        </div>
        <button onClick={search} disabled={busy === "search"} className="px-4 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium flex items-center gap-2 disabled:opacity-50">
          {busy === "search" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Buscar
        </button>
        <p className="text-[11px] text-muted-foreground">Solo datos de contacto públicos. Nada se envía sin tu autorización.</p>
      </div>

      <div className="space-y-3">
        {leads.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Aún no hay contactos.</p>}
        {leads.map(l => (
          <div key={l.id} className="p-4 rounded-2xl bg-card border border-border space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-sm text-foreground">{l.name}</p>
                <p className="text-xs text-muted-foreground">{l.business_type} · {l.city}</p>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground">{STATUS_LABEL[l.status] || l.status}</span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {l.website && <a href={l.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline"><Globe className="w-3 h-3" />Web</a>}
              {l.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{l.email}</span>}
              {l.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{l.phone}</span>}
            </div>
            {l.notes && <p className="text-xs text-muted-foreground">{l.notes}</p>}
            {l.proposal && <pre className="whitespace-pre-wrap text-xs bg-muted rounded-xl p-3 font-sans">{l.proposal}</pre>}
            <div className="flex flex-wrap gap-2">
              <button onClick={async () => { if (await call({ mode: "proposal", lead_id: l.id }, l.id)) load(); }} disabled={busy === l.id}
                className="px-3 py-2 rounded-xl bg-muted text-xs font-medium flex items-center gap-1.5 disabled:opacity-50">
                {busy === l.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />} {l.proposal ? "Rehacer propuesta" : "Redactar propuesta"}
              </button>
              {l.status === "proposal_drafted" && (
                <button onClick={() => setStatus(l.id, "authorized")} className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Autorizar
                </button>
              )}
              {l.status === "authorized" && (
                <button onClick={() => send(l)} className="px-3 py-2 rounded-xl bg-foreground text-background text-xs font-semibold flex items-center gap-1.5">
                  {l.email ? <Mail className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Enviar
                </button>
              )}
              {l.status === "sent" && (
                <button onClick={() => setStatus(l.id, "replied")} className="px-3 py-2 rounded-xl bg-muted text-xs font-medium">Marcar como respondido</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default B2BSalesApp;
