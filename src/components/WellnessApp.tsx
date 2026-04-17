import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Plus, Clock, DollarSign, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WellnessAppProps { businessId: string; }
interface Servicio { id: string; nombre: string; duracion: number; precio: number; categoria: string; }

const MOCK_SERVICIOS: Servicio[] = [
  { id: "1", nombre: "Masaje Relajante", duracion: 60, precio: 80, categoria: "Masajes" },
  { id: "2", nombre: "Facial Premium", duracion: 45, precio: 65, categoria: "Facial" },
  { id: "3", nombre: "Yoga Session", duracion: 90, precio: 40, categoria: "Fitness" },
];

const WellnessApp = ({ businessId }: WellnessAppProps) => {
  const isDemo = businessId === "demo";
  const [servicios, setServicios] = useState<Servicio[]>(MOCK_SERVICIOS);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(!isDemo);
  const [form, setForm] = useState({ nombre: "", duracion: 60, precio: 0, categoria: "" });
  const { toast } = useToast();

  useEffect(() => {
    if (isDemo) return;
    void loadServicios();
  }, [businessId, isDemo]);

  const loadServicios = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("id, name, duration_minutes, price_cents, category")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los servicios." });
      setServicios([]);
      setLoading(false);
      return;
    }

    setServicios((data || []).map((item) => ({
      id: item.id,
      nombre: item.name,
      duracion: item.duration_minutes,
      precio: (item.price_cents || 0) / 100,
      categoria: item.category || "Wellness",
    })));
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.nombre) return;

    if (isDemo) {
      setServicios((prev) => [...prev, { id: Date.now().toString(), ...form }]);
      toast({ title: "Servicio creado ✅" });
      setOpenDialog(false);
      return;
    }

    const { data, error } = await supabase
      .from("services")
      .insert({
        business_id: businessId,
        name: form.nombre,
        duration_minutes: form.duracion,
        price_cents: Math.round(form.precio * 100),
        category: form.categoria || "Wellness",
      })
      .select("id, name, duration_minutes, price_cents, category")
      .single();

    if (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo guardar el servicio." });
      return;
    }

    setServicios((prev) => [{
      id: data.id,
      nombre: data.name,
      duracion: data.duration_minutes,
      precio: (data.price_cents || 0) / 100,
      categoria: data.category || "Wellness",
    }, ...prev]);
    toast({ title: "Servicio creado ✅" });
    setOpenDialog(false);
  };

  const totalValor = servicios.reduce((a, s) => a + s.precio, 0);
  const duracionMedia = servicios.length > 0 ? Math.round(servicios.reduce((a, s) => a + s.duracion, 0) / servicios.length) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center">
          <Heart className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">Wellness & Spa</h2>
            {isDemo && <Badge className="bg-muted text-muted-foreground">Demo</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">Servicios · Agenda · Staff</p>
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
                <p className="text-xl font-bold text-purple-500">{servicios.length}</p>
                <p className="text-xs text-muted-foreground">Servicios</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border">
              <CardContent className="p-3 text-center">
                <p className="text-xl font-bold text-emerald-500">€{totalValor}</p>
                <p className="text-xs text-muted-foreground">Valor total</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border">
              <CardContent className="p-3 text-center">
                <p className="text-xl font-bold text-blue-500">{duracionMedia}min</p>
                <p className="text-xs text-muted-foreground">Duración media</p>
              </CardContent>
            </Card>
          </div>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="w-full rounded-xl bg-purple-500 hover:bg-purple-600 text-white gap-1">
                <Plus className="w-4 h-4" /> Nuevo servicio
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl max-w-sm">
              <DialogHeader>
                <DialogTitle>Nuevo servicio</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-2">
                <div className="space-y-1">
                  <Label>Nombre *</Label>
                  <Input placeholder="Nombre del servicio" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label>Duración (min)</Label>
                    <Input type="number" min={15} value={form.duracion} onChange={(e) => setForm({ ...form, duracion: parseInt(e.target.value) || 60 })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Precio (€)</Label>
                    <Input type="number" min={0} value={form.precio} onChange={(e) => setForm({ ...form, precio: parseFloat(e.target.value) || 0 })} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Categoría</Label>
                  <Input placeholder="Masajes, Facial..." value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />
                </div>
                <Button className="w-full rounded-xl bg-purple-500 hover:bg-purple-600 text-white" onClick={handleSave}>
                  Crear servicio
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="space-y-2">
            {servicios.length === 0 ? (
              <Card className="rounded-2xl border">
                <CardContent className="p-6 text-center text-sm text-muted-foreground">
                  No hay servicios cargados todavía.
                </CardContent>
              </Card>
            ) : (
              servicios.map((s) => (
                <Card key={s.id} className="rounded-2xl border">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{s.nombre}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.duracion}min</span>
                        <span className="flex items-center gap-1 text-purple-500 font-semibold"><DollarSign className="w-3 h-3" />€{s.precio}</span>
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">{s.categoria}</Badge>
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

export default WellnessApp;
