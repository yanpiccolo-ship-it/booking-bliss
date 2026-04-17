import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plane, Plus, MapPin, Clock, DollarSign, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TravelAppProps { businessId: string; }
interface Tour { id: string; nombre: string; destino: string; duracion: string; precio: number; plazas: number; estado: "activo" | "agotado" | "borrador"; }

const MOCK_TOURS: Tour[] = [
  { id: "1", nombre: "Ruta del Vino", destino: "La Rioja", duracion: "2 días", precio: 280, plazas: 12, estado: "activo" },
  { id: "2", nombre: "Senderismo Costa Brava", destino: "Girona", duracion: "3 días", precio: 350, plazas: 0, estado: "agotado" },
  { id: "3", nombre: "City Tour Barcelona", destino: "Barcelona", duracion: "4 horas", precio: 45, plazas: 20, estado: "activo" },
];

const ESTADO_COLORS = {
  activo: "bg-emerald-100 text-emerald-700",
  agotado: "bg-red-100 text-red-700",
  borrador: "bg-muted text-muted-foreground",
};

const TravelApp = ({ businessId }: TravelAppProps) => {
  const isDemo = businessId === "demo";
  const [tours, setTours] = useState<Tour[]>(MOCK_TOURS);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(!isDemo);
  const [form, setForm] = useState({ nombre: "", destino: "", duracion: "", precio: 0, plazas: 10 });
  const { toast } = useToast();

  useEffect(() => {
    if (isDemo) return;
    void loadTours();
  }, [businessId, isDemo]);

  const loadTours = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("id, name, location, duration_minutes, price_cents, capacity, is_active")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los tours." });
      setTours([]);
      setLoading(false);
      return;
    }

    setTours((data || []).map((item) => ({
      id: item.id,
      nombre: item.name,
      destino: item.location || "Destino por definir",
      duracion: `${item.duration_minutes || 0} min`,
      precio: (item.price_cents || 0) / 100,
      plazas: item.capacity || 0,
      estado: item.is_active ? ((item.capacity || 0) > 0 ? "activo" : "agotado") : "borrador",
    })));
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.nombre) return;

    if (isDemo) {
      setTours((prev) => [...prev, { id: Date.now().toString(), ...form, estado: "activo" }]);
      toast({ title: "Tour creado ✅" });
      setOpenDialog(false);
      return;
    }

    const durationValue = parseInt(form.duracion.replace(/\D/g, "")) || 60;
    const { data, error } = await supabase
      .from("services")
      .insert({
        business_id: businessId,
        name: form.nombre,
        location: form.destino,
        duration_minutes: durationValue,
        price_cents: Math.round(form.precio * 100),
        capacity: form.plazas,
        category: "travel",
      })
      .select("id, name, location, duration_minutes, price_cents, capacity, is_active")
      .single();

    if (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo guardar el tour." });
      return;
    }

    setTours((prev) => [{
      id: data.id,
      nombre: data.name,
      destino: data.location || "Destino por definir",
      duracion: `${data.duration_minutes || 0} min`,
      precio: (data.price_cents || 0) / 100,
      plazas: data.capacity || 0,
      estado: data.is_active ? ((data.capacity || 0) > 0 ? "activo" : "agotado") : "borrador",
    }, ...prev]);
    toast({ title: "Tour creado ✅" });
    setOpenDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-sky-500/20 flex items-center justify-center">
          <Plane className="w-5 h-5 text-sky-500" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">Travel & Tours</h2>
            {isDemo && <Badge className="bg-muted text-muted-foreground">Demo</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">Tours · Itinerarios · Reservas</p>
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
                <p className="text-xl font-bold text-sky-500">{tours.length}</p>
                <p className="text-xs text-muted-foreground">Tours</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border">
              <CardContent className="p-3 text-center">
                <p className="text-xl font-bold text-emerald-500">{tours.filter((t) => t.estado === "activo").length}</p>
                <p className="text-xs text-muted-foreground">Activos</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border">
              <CardContent className="p-3 text-center">
                <p className="text-xl font-bold text-amber-500">{tours.reduce((a, t) => a + t.plazas, 0)}</p>
                <p className="text-xs text-muted-foreground">Plazas disp.</p>
              </CardContent>
            </Card>
          </div>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="w-full rounded-xl bg-sky-500 hover:bg-sky-600 text-white gap-1">
                <Plus className="w-4 h-4" /> Nuevo tour
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl max-w-sm">
              <DialogHeader>
                <DialogTitle>Nuevo tour</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-2">
                <div className="space-y-1">
                  <Label>Nombre *</Label>
                  <Input placeholder="Nombre del tour" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Destino</Label>
                  <Input placeholder="Ciudad o región" value={form.destino} onChange={(e) => setForm({ ...form, destino: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label>Duración</Label>
                    <Input placeholder="120 min" value={form.duracion} onChange={(e) => setForm({ ...form, duracion: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Precio (€)</Label>
                    <Input type="number" min={0} value={form.precio} onChange={(e) => setForm({ ...form, precio: parseFloat(e.target.value) || 0 })} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Plazas disponibles</Label>
                  <Input type="number" min={0} value={form.plazas} onChange={(e) => setForm({ ...form, plazas: parseInt(e.target.value) || 0 })} />
                </div>
                <Button className="w-full rounded-xl bg-sky-500 hover:bg-sky-600 text-white" onClick={handleSave}>
                  Crear tour
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="space-y-2">
            {tours.length === 0 ? (
              <Card className="rounded-2xl border">
                <CardContent className="p-6 text-center text-sm text-muted-foreground">
                  No hay tours cargados todavía.
                </CardContent>
              </Card>
            ) : (
              tours.map((tour) => (
                <Card key={tour.id} className="rounded-2xl border">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{tour.nombre}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{tour.destino}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{tour.duracion}</span>
                        <span className="flex items-center gap-1 text-sky-500 font-semibold"><DollarSign className="w-3 h-3" />€{tour.precio}</span>
                      </div>
                    </div>
                    <Badge className={ESTADO_COLORS[tour.estado]}>{tour.estado}</Badge>
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

export default TravelApp;
