import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Plus, TrendingUp, Users, Target } from "lucide-react";

interface MarketingAppProps { businessId: string; }
interface Campana { id: string; nombre: string; canal: string; leads: number; conversiones: number; estado: "activa" | "pausada" | "finalizada"; }

const MOCK_CAMPANAS: Campana[] = [
  { id: "1", nombre: "Promo Verano 2026", canal: "Email", leads: 245, conversiones: 32, estado: "activa" },
  { id: "2", nombre: "Descuento primera visita", canal: "WhatsApp", leads: 120, conversiones: 18, estado: "activa" },
  { id: "3", nombre: "Black Friday", canal: "SMS", leads: 480, conversiones: 67, estado: "finalizada" },
];

const ESTADO_COLORS = {
  activa: "bg-emerald-100 text-emerald-700",
  pausada: "bg-amber-100 text-amber-700",
  finalizada: "bg-muted text-muted-foreground",
};

const MarketingApp = ({ businessId }: MarketingAppProps) => {
  const [campanas, setCampanas] = useState<Campana[]>(MOCK_CAMPANAS);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ nombre: "", canal: "Email" });
  const { toast } = useToast();

  const handleSave = () => {
    if (!form.nombre) return;
    setCampanas(prev => [...prev, { id: Date.now().toString(), ...form, leads: 0, conversiones: 0, estado: "activa" }]);
    toast({ title: "Campaña creada ✅" });
    setOpenDialog(false);
  };

  const totalLeads = campanas.reduce((a, c) => a + c.leads, 0);
  const totalConversiones = campanas.reduce((a, c) => a + c.conversiones, 0);
  const tasaConversion = totalLeads > 0 ? Math.round((totalConversiones / totalLeads) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-pink-500/20 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-pink-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold">Marketing</h2>
          <p className="text-xs text-muted-foreground">Campañas · Leads · Conversiones</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Card className="rounded-2xl border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-pink-500">{totalLeads}</p>
            <p className="text-xs text-muted-foreground">Leads</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-emerald-500">{totalConversiones}</p>
            <p className="text-xs text-muted-foreground">Conversiones</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-violet-500">{tasaConversion}%</p>
            <p className="text-xs text-muted-foreground">Tasa conv.</p>
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
          <DialogHeader><DialogTitle>Nueva campaña</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1"><Label>Nombre *</Label>
              <Input placeholder="Nombre de la campaña" value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div className="space-y-1"><Label>Canal</Label>
              <Input placeholder="Email, WhatsApp, SMS..." value={form.canal}
                onChange={e => setForm({ ...form, canal: e.target.value })} />
            </div>
            <Button className="w-full rounded-xl bg-pink-500 hover:bg-pink-600 text-white" onClick={handleSave}>
              Crear campaña
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="space-y-2">
        {campanas.map(c => (
          <Card key={c.id} className="rounded-2xl border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{c.nombre}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Target className="w-3 h-3" />{c.canal}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.leads} leads</span>
                  <span className="flex items-center gap-1 text-pink-500 font-semibold"><TrendingUp className="w-3 h-3" />{c.conversiones}</span>
                </div>
              </div>
              <Badge className={ESTADO_COLORS[c.estado]}>{c.estado}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default MarketingApp;
