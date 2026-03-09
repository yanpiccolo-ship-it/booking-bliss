import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Globe, Code, Link2, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface IntegrationsPanelProps {
  businessId: string | null;
  onClose: () => void;
}

const IntegrationsPanel = ({ businessId, onClose }: IntegrationsPanelProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);

  const baseUrl = window.location.origin;
  const directLink = `${baseUrl}/b/${businessId}`;

  const widgetCode = `<!-- FlowBooking Widget -->
<div id="flowbooking-widget"></div>
<script src="${baseUrl}/widget.js" data-business="${businessId}"></script>`;

  const iframeCode = `<iframe 
  src="${directLink}" 
  width="100%" 
  height="700" 
  frameborder="0"
  style="border-radius: 16px; border: 1px solid #e5e7eb;"
></iframe>`;

  useEffect(() => {
    if (businessId) loadSlug();
  }, [businessId]);

  const loadSlug = async () => {
    const { data } = await supabase.from("businesses").select("slug").eq("id", businessId!).single();
    if (data?.slug) setSlug(data.slug);
  };

  const saveSlug = async () => {
    if (!slug.trim() || !businessId) return;
    setSaving(true);
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    const { error } = await supabase.from("businesses").update({ slug: cleanSlug }).eq("id", businessId);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message.includes("unique") ? "Este slug ya está en uso" : error.message });
    } else {
      setSlug(cleanSlug);
      toast({ title: "¡Guardado!", description: `Tu micro-sitio estará en ${baseUrl}/b/${cleanSlug}` });
    }
    setSaving(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast({ title: "Copiado", description: `${label} copiado al portapapeles` });
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyButton = ({ text, label }: { text: string; label: string }) => (
    <button
      onClick={() => copyToClipboard(text, label)}
      className="p-2 rounded-lg hover:bg-muted transition-colors"
    >
      {copied === label ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
    </button>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Integraciones</h2>
      </div>

      {/* Custom Slug */}
      <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-foreground">URL personalizada</h3>
        </div>
        <p className="text-sm text-muted-foreground">Crea un enlace fácil de recordar para tu micro-sitio.</p>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-0 bg-muted rounded-xl overflow-hidden">
            <span className="text-xs text-muted-foreground pl-3 whitespace-nowrap">{baseUrl}/b/</span>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="mi-negocio"
              className="border-0 bg-transparent h-10 pl-0 focus-visible:ring-0"
            />
          </div>
          <Button onClick={saveSlug} disabled={saving} className="rounded-xl" size="sm">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
          </Button>
        </div>
      </div>

      {/* Direct Link */}
      <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-foreground">Link directo</h3>
        </div>
        <p className="text-sm text-muted-foreground">Comparte este enlace en redes sociales, WhatsApp o email.</p>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
          <code className="text-xs text-foreground flex-1 truncate">{slug ? `${baseUrl}/b/${slug}` : directLink}</code>
          <CopyButton text={slug ? `${baseUrl}/b/${slug}` : directLink} label="Link directo" />
        </div>
        <a
          href={slug ? `${baseUrl}/b/${slug}` : directLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Ver micro-sitio <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Embed Widget (iframe) */}
      <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-violet-500" />
          <h3 className="font-semibold text-foreground">Widget embebible</h3>
        </div>
        <p className="text-sm text-muted-foreground">Pega este código en tu web existente para mostrar el sistema de reservas.</p>
        <div className="relative">
          <pre className="text-xs text-foreground bg-muted/50 p-3 rounded-xl overflow-x-auto">{iframeCode}</pre>
          <div className="absolute top-2 right-2">
            <CopyButton text={iframeCode} label="Widget iframe" />
          </div>
        </div>
      </div>

      {/* Script Widget */}
      <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-foreground">Script JS</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">Próximamente</span>
        </div>
        <p className="text-sm text-muted-foreground">Widget JavaScript avanzado con botón flotante y modal.</p>
        <div className="relative opacity-60">
          <pre className="text-xs text-foreground bg-muted/50 p-3 rounded-xl overflow-x-auto">{widgetCode}</pre>
        </div>
      </div>

      {/* WordPress Plugin */}
      <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-foreground">Plugin WordPress</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">Próximamente</span>
        </div>
        <p className="text-sm text-muted-foreground">Instala el plugin de FlowBooking directamente en tu WordPress.</p>
      </div>

      {/* API */}
      <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold text-foreground">API REST</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">Próximamente</span>
        </div>
        <p className="text-sm text-muted-foreground">API documentada para integrar FlowBooking en cualquier plataforma.</p>
      </div>
    </motion.div>
  );
};

export default IntegrationsPanel;
