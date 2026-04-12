import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Utensils, Plus, Users } from "lucide-react";

interface RestauranteAppProps { businessId: string; }
interface Mesa { id: string; numero: number; capacidad: number; estado: "libre" | "ocupada" | "reservada"; }

const MOCK_MESAS: Mesa[] = [
  { id: "1", numero: 1, capacidad: 4, estado: "libre" },
  { id: "2", numero: 2, capacidad: 2, estado: "ocupada" },
  { id: "3", numero: 3, capacidad: 6, estado: "reservada" },
];

const ESTADO_COLORS = {
  libre: "bg-emerald-100 text-emerald-700",
  ocupada: "bg-red-100 text-red-700",
  reservada: "bg-yellow-100 text-yellow-700",
};

const RestauranteApp = ({ businessId }: RestauranteAppProps) => {
  const [mesas, setMesas] = useState<Mesa[]>(MOCK_MESAS);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ numero: 1, capacidad: 4, estado: "libre" as Mesa["estado"] });
  const { toast } = useToast();

  const handleSave = () => {
    setMesas(prev => [...prev, { id: Date.now().toString(), ...form }]);
    toast({ title: "Mesa creada ✅" });
    setOpenDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-orange-500/20 flex items-center justify-center">
          <Utensils className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold">Restaurante</h2>
          <p className="text-xs text-muted-foreground">Mesas · Menú · Pedidos</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["libre", "ocupada", "reservada"].map(estado => (
          <Card key={estado} className="rounded-2xl border">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold">{mesas.filter(m => m.estado === estado).length}</p>
              <p className="text-xs text-muted-foreground capitalize">{estado}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white gap-1">
            <Plus className="w-4 h-4" /> Nueva mesa
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader><DialogTitle>Nueva mesa</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1"><Label>Número</Label>
              <Input type="number" min={1} value={form.numero}
                onChange={e => setForm({ ...form, numero: parseInt(e.target.value) || 1 })} />
            </div>
            <div className="space-y-1"><Label>Capacidad</Label>
              <Input type="number" min={1} value={form.capacidad}
                onChange={e => setForm({ ...form, capacidad: parseInt(e.target.value) || 2 })} />
            </div>
            <Button className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>
              Crear mesa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="space-y-2">
        {mesas.map(mesa => (
          <Card key={mesa.id} className="rounded-2xl border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">Mesa {mesa.numero}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Users className="w-3 h-3" /> {mesa.capacidad} personas
                </p>
              </div>
              <Badge className={ESTADO_COLORS[mesa.estado]}>{mesa.estado}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default RestauranteApp;

