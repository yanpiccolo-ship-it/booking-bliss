import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Plus, AlertTriangle } from "lucide-react";

interface InventarioAppProps { businessId: string; }
interface Producto { id: string; nombre: string; stock: number; minimo: number; categoria: string; precio: number; }

const MOCK_PRODUCTOS: Producto[] = [
  { id: "1", nombre: "Aceite de masaje", stock: 15, minimo: 5, categoria: "Insumos", precio: 12 },
  { id: "2", nombre: "Toallas premium", stock: 3, minimo: 10, categoria: "Lencería", precio: 8 },
  { id: "3", nombre: "Crema facial", stock: 20, minimo: 8, categoria: "Cosméticos", precio: 25 },
];

const InventarioApp = ({ businessId }: InventarioAppProps) => {
  const [productos, setProductos] = useState<Producto[]>(MOCK_PRODUCTOS);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ nombre: "", stock: 0, minimo: 5, categoria: "", precio: 0 });
  const { toast } = useToast();

  const handleSave = () => {
    if (!form.nombre) return;
    setProductos(prev => [...prev, { id: Date.now().toString(), ...form }]);
    toast({ title: "Producto agregado ✅" });
    setOpenDialog(false);
  };

  const bajoStock = productos.filter(p => p.stock <= p.minimo);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center">
          <Package className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold">Inventario</h2>
          <p className="text-xs text-muted-foreground">Stock · Alertas · Proveedores</p>
        </div>
      </div>
      {bajoStock.length > 0 && (
        <Card className="rounded-2xl border border-red-200 bg-red-50">
          <CardContent className="p-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-700 font-medium">{bajoStock.length} producto(s) con stock bajo</p>
          </CardContent>
        </Card>
      )}
      <div className="grid grid-cols-3 gap-2">
        <Card className="rounded-2xl border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-amber-500">{productos.length}</p>
            <p className="text-xs text-muted-foreground">Productos</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-red-500">{bajoStock.length}</p>
            <p className="text-xs text-muted-foreground">Stock bajo</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-emerald-500">€{productos.reduce((a, p) => a + (p.stock * p.precio), 0)}</p>
            <p className="text-xs text-muted-foreground">Valor total</p>
          </CardContent>
        </Card>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white gap-1">
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
              <div className="space-y-1"><Label>Stock actual</Label>
                <Input type="number" min={0} value={form.stock}
                  onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="space-y-1"><Label>Stock mínimo</Label>
                <Input type="number" min={0} value={form.minimo}
                  onChange={e => setForm({ ...form, minimo: parseInt(e.target.value) || 5 })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label>Categoría</Label>
                <Input placeholder="Insumos..." value={form.categoria}
                  onChange={e => setForm({ ...form, categoria: e.target.value })} />
              </div>
              <div className="space-y-1"><Label>Precio (€)</Label>
                <Input type="number" min={0} value={form.precio}
                  onChange={e => setForm({ ...form, precio: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
            <Button className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white" onClick={handleSave}>
              Agregar producto
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
                <p className="text-xs text-muted-foreground mt-1">{p.categoria}</p>
              </div>
              <div className="text-right">
                <Badge className={p.stock <= p.minimo ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}>
                  {p.stock} uds
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">min. {p.minimo}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default InventarioApp;
