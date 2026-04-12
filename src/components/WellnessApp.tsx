import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Plus, Clock, DollarSign } from "lucide-react";

interface WellnessAppProps { businessId: string; }
interface Servicio { id: string; nombre: string; duracion: number; precio: number; categoria: string; }

const MOCK_SERVICIOS: Servicio[] = [
  { id: "1", nombre: "Masaje Relajante", duracion: 60, precio: 80, categoria: "Masajes" },
  { id: "2", nombre: "Facial Premium", duracion: 45, precio: 65, categoria: "Facial" },
  { id: "3", nombre: "Yoga Session", duracion: 90, precio: 40, categoria: "Fitness" },
];

const WellnessApp = ({ businessId }: WellnessAppProps) => {
  const [servicios, setServicios] = useState<Servicio[]>(MOCK_SERVICIOS);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ nombre: "", duracion: 60, precio: 0, categoria: "" });
  const { toast } = useToast();

  const handleSave = () => {
    if (!form.nombre) return;
    setServicios(prev => [...prev, { id: Date.now().toString(), ...form }]);
    toast({ title: "Servicio creado ✅" });
    setOpenDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center">
          <Heart className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold">Wellness & Spa</h2>
          <p className="text-xs text-muted-foreground">Servicios · Agenda · Staff</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Card className="rounded-2xl border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-purple-500">{servicios.length}</p>
            <p className="text-xs text-muted-foreground">Servicios</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-emerald-500">€{servicios.reduce((a, s) => a + s.precio, 0)}</p>
            <p className="text-xs text-muted-foreground">Valor total</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-blue-500">
              {Math.round(servicios.reduce((a, s) => a + s.duracion, 0) / servicios.length)}min
            </p>
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
          <DialogHeader><DialogTitle>Nuevo servicio</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1"><Label>Nombre *</Label>
              <Input placeholder="Nombre del servicio" value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label>Duración (min)</Label>
                <Input type="number" min={15} value={form.duracion}
                  onChange={e => setForm({ ...form, duracion: parseInt(e.target.value) || 60 })} />
              </div>
              <div className="space-y-1"><Label>Precio (€)</Label>
                <Input type="number" min={0} value={form.precio}
                  onChange={e => setForm({ ...form, precio: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="space-y-1"><Label>Categoría</Label>
              <Input placeholder="Masajes, Facial..." value={form.categoria}
                onChange={e => setForm({ ...form, categoria: e.target.value })} />
            </div>
            <Button className="w-full rounded-xl bg-purple-500 hover:bg-purple-600 text-white" onClick={handleSave}>
              Crear servicio
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="space-y-2">
        {servicios.map(s => (
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
        ))}
      </div>
    </div>
  );
};
export default WellnessApp;
