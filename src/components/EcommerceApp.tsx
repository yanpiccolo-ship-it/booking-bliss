import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingBag, Plus, Package, DollarSign } from "lucide-react";

interface EcommerceAppProps { businessId: string; }
interface Producto { id: string; nombre: string; precio: number; stock: number; categoria: string; ventas: number; }

const MOCK_PRODUCTOS: Producto[] = [
  { id: "1", nombre: "Aceite esencial lavanda", precio: 18, stock: 45, categoria: "Aromas", ventas: 120 },
  { id: "2", nombre: "Vela artesanal", precio: 25, stock: 12, categoria: "Decoración", ventas: 85 },
  { id: "3", nombre: "Kit bienestar", precio: 65, stock: 8, categoria: "Packs", ventas: 42 },
];

const EcommerceApp = ({ businessId }: EcommerceAppProps) => {
  const [productos, setProductos] = useState<Producto[]>(MOCK_PRODUCTOS);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ nombre: "", precio: 0, stock: 0, categoria: "" });
  const { toast } = useToast();

  const handleSave = () => {
    if (!form.nombre) return;
    setProductos(prev => [...prev, { id: Date.now().toString(), ...form, ventas: 0 }]);
    toast({ title: "Producto creado ✅" });
    setOpenDialog(false);
  };

  const totalVentas = productos.reduce((a, p) => a + p.ventas, 0);
  const ingresos = productos.reduce((a, p) => a + (p.ventas * p.precio), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-teal-500/20 flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-teal-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold">Tienda Online</h2>
          <p className="text-xs text-muted-foreground">Productos · Stock · Ventas</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Card className="rounded-2xl border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-teal-500">{productos.length}</p>
            <p className="text-xs text-muted-foreground">Productos</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-emerald-500">{totalVentas}</p>
            <p className="text-xs text-muted-foreground">Ventas</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-violet-500">€{ingresos.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Ingresos</p>
          </CardContent>
        </Card>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button className="w-full rounded-xl bg-teal-500 hover:bg-teal-600 text-white gap-1">
            <Plus className="w-4 h-4" /> Nuevo producto
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader><DialogTitle>Nuevo producto</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1"><Label>Nombre *</Label>
              <Input placeholder="Nombre del producto" value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label>Precio (€)</Label>
                <Input type="number" min={0} value={form.precio}
                  onChange={e => setForm({ ...form, precio: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="space-y-1"><Label>Stock</Label>
                <Input type="number" min={0} value={form.stock}
                  onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="space-y-1"><Label>Categoría</Label>
              <Input placeholder="Aromas, Packs..." value={form.categoria}
                onChange={e => setForm({ ...form, categoria: e.target.value })} />
            </div>
            <Button className="w-full rounded-xl bg-teal-500 hover:bg-teal-600 text-white" onClick={handleSave}>
              Crear producto
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="space-y-2">
        {productos.map(p => (
          <Card key={p.id} className="rounded-2xl border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{p.nombre}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Package className="w-3 h-3" />{p.stock} uds</span>
                  <span className="flex items-center gap-1 text-teal-500 font-semibold"><DollarSign className="w-3 h-3" />€{p.precio}</span>
                  <span>{p.ventas} vendidos</span>
                </div>
              </div>
              <Badge className="bg-teal-100 text-teal-700">{p.categoria}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default EcommerceApp;
