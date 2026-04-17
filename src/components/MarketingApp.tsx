import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Plus, TrendingUp, Zap, Target, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MarketingAppProps { businessId: string; }
interface Campana { id: string; nombre: string; canal: string; ejecuciones: number; estado: "activa" | "pausada"; detalle: string; }

const MOCK_CAMPANAS: Campana[] = [
  { id: "1", nombre: "Promo Verano 2026", canal: "Email", ejecuciones: 32, estado: "activa", detalle: "Campaña automatizada de captación" },
  { id: "2", nombre: "Descuento primera visita", canal: "WhatsApp", ejecuciones: 18, estado: "activa", detalle: "Flujo post-reserva" },
  { id: "3", nombre: "Black Friday", canal: "SMS", ejecuciones: 67, estado: "pausada", detalle: "Acción estacional" },
];

const ESTADO_COLORS = {
  activa: "bg-emerald-100 text-emerald-700",
  pausada: "bg-amber-100 text-amber-700",
};

const MarketingApp = ({ businessId }: MarketingAppProps) => {
  const isDemo = businessId === "demo";
  const [campanas, setCampanas] = useState<Campana[]>(MOCK_CAMPANAS);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(!isDemo);
  const [form, setForm] = useState({ nombre: "", canal: "Email" });
  const { toast } = useToast();

  useEffect(() => {
    if (isDemo) return;
    void loadCampaigns();
  }, [businessId, isDemo]);

  const loadCampaigns = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("automation_rules")
      .select("id, name, description, trigger_event, is_active, execution_count")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar las campañas." });
      setCampanas([]);
      setLoading(false);
      return;
    }

    setCampanas((data || []).map((item) => ({
      id: item.id,
      nombre: item.name,
      canal: item.trigger_event?.split(":")[1]?.toUpperCase() || "AUTO",
      ejecuciones: item.execution_count || 0,
      estado: item.is_active ? "activa" : "pausada",
      detalle: item.description || "Automatización de marketing",
    })));
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.nombre) return;

    if (isDemo) {
      setCampanas((prev) => [...prev, { id: Date.now().toString(), nombre: form.nombre, canal: form.canal, ejecuciones: 0, estado: "activa", detalle: `Campaña ${form.canal}` }]);
      toast({ title: "Campaña creada ✅" });
      setOpenDialog(false);
      return;
    }

    const { data, error } = await supabase
      .from("automation_rules")
      .insert({
        business_id: businessId,
        name: form.nombre,
        description: `Campaña ${form.canal}`,
        trigger_event: `marketing:${form.canal.toLowerCase()}`,
        is_active: true,
      })
      .select("id, name, description, trigger_event, is_active, execution_count")
      .single();

    if (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo guardar la campaña." });
      return;
    }

    setCampanas((prev) => [{
      id: data.id,
      nombre: data.name,
      canal: data.trigger_event?.split(":")[1]?.toUpperCase() || form.canal,
      ejecuciones: data.execution_count || 0,
      estado: data.is_active ? "activa" : "pausada",
      detalle: data.description || "Automatización de marketing",
    }, ...prev]);
    toast({ title: "Campaña creada ✅" });
    setOpenDialog(false);
  };

  const activas = campanas.filter((c) => c.estado === "activa").length;
  const ejecuciones = campanas.reduce((a, c) => a + c.ejecuciones, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-pink-500/20 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-pink-500" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">Marketing</h2>
            {isDemo && <Badge className="bg-muted text-muted-foreground">Demo</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">Campañas · Automatizaciones · Ejecuciones</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            <Card className="rounded-2xl border">
              <CardContent className="p-3 text-center">
                <p className="text-xl font-bold text-pink-500">{campanas.length}</p>
                <p className="text-xs text-muted-foreground">Campañas</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border">
              <CardContent className="p-3 text-center">
                <p className="text-xl font-bold text-emerald-500">{activas}</p>
                <p className="text-xs text-muted-foreground">Activas</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border">
              <CardContent className="p-3 text-center">
                <p className="text-xl font-bold text-violet-500">{ejecuciones}</p>
                <p className="text-xs text-muted-foreground">Ejecuciones</p>
              </CardContent>
            </Card>
          </div>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="w-full rounded-xl bg-pink-500 hover:bg-pink-600 text-white gap-1">
                <Plus className="w-4 h-4" /> Nueva campaña
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl max-w-sm">
              <DialogHeader>
                <DialogTitle>Nueva campaña</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-2">
                <div className="space-y-1">
                  <Label>Nombre *</Label>
                  <Input placeholder="Nombre de la campaña" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Canal</Label>
                  <Input placeholder="Email, WhatsApp, SMS..." value={form.canal} onChange={(e) => setForm({ ...form, canal: e.target.value })} />
                </div>
                <Button className="w-full rounded-xl bg-pink-500 hover:bg-pink-600 text-white" onClick={handleSave}>
                  Crear campaña
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="space-y-2">
            {campanas.length === 0 ? (
              <Card className="rounded-2xl border">
                <CardContent className="p-6 text-center text-sm text-muted-foreground">
                  No hay campañas cargadas todavía.
                </CardContent>
              </Card>
            ) : (
              campanas.map((c) => (
                <Card key={c.id} className="rounded-2xl border">
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm">{c.nombre}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                        <span className="flex items-center gap-1"><Target className="w-3 h-3" />{c.canal}</span>
                        <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{c.ejecuciones} ejec.</span>
                        <span className="flex items-center gap-1 text-pink-500 font-semibold"><TrendingUp className="w-3 h-3" />auto</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{c.detalle}</p>
                    </div>
                    <Badge className={ESTADO_COLORS[c.estado]}>{c.estado}</Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MarketingApp;
