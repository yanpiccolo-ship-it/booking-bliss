import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Plus, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface InventarioAppProps { businessId: string; }
interface Producto { id: string; nombre: string; stock: number; minimo: number; unidad: string; precio: number; }

const MOCK_PRODUCTOS: Producto[] = [
  { id: "1", nombre: "Aceite de masaje", stock: 15, minimo: 5, unidad: "botella", precio: 12 },
  { id: "2", nombre: "Toallas premium", stock: 3, minimo: 10, unidad: "unidad", precio: 8 },
  { id: "3", nombre: "Crema facial", stock: 20, minimo: 8, unidad: "tubo", precio: 25 },
];

const InventarioApp = ({ businessId }: InventarioAppProps) => {
  const isDemo = businessId === "demo";
  const [productos, setProductos] = useState<Producto[]>(MOCK_PRODUCTOS);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(!isDemo);
  const [form, setForm] = useState({ nombre: "", stock: 0, minimo: 5, unidad: "unidad", precio: 0 });
  const { toast } = useToast();

  useEffect(() => {
    if (isDemo) return;
    void loadInventory();
  }, [businessId, isDemo]);

  const loadInventory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("inventory_items")
      .select("id, name, current_stock, min_stock, unit, unit_cost_cents")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo cargar el inventario." });
      setProductos([]);
      setLoading(false);
      return;
    }

    setProductos((data || []).map((item) => ({
      id: item.id,
      nombre: item.name,
      stock: Number(item.current_stock || 0),
      minimo: Number(item.min_stock || 0),
      unidad: item.unit || "unidad",
      precio: (item.unit_cost_cents || 0) / 100,
    })));
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.nombre) return;

    if (isDemo) {
      setProductos((prev) => [...prev, { id: Date.now().toString(), ...form }]);
      toast({ title: "Producto agregado ✅" });
      setOpenDialog(false);
      return;
    }

    const { data, error } = await supabase
      .from("inventory_items")
      .insert({
        business_id: businessId,
        name: form.nombre,
        current_stock: form.stock,
        min_stock: form.minimo,
        unit: form.unidad,
        unit_cost_cents: Math.round(form.precio * 100),
      })
      .select("id, name, current_stock, min_stock, unit, unit_cost_cents")
      .single();

    if (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo guardar el producto." });
      return;
    }

    setProductos((prev) => [{
      id: data.id,
      nombre: data.name,
      stock: Number(data.current_stock || 0),
      minimo: Number(data.min_stock || 0),
      unidad: data.unit || "unidad",
      precio: (data.unit_cost_cents || 0) / 100,
    }, ...prev]);
    toast({ title: "Producto agregado ✅" });
    setOpenDialog(false);
  };

  const bajoStock = productos.filter((p) => p.stock <= p.minimo);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center">
          <Package className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">Inventario</h2>
            {isDemo && <Badge className="bg-muted text-muted-foreground">Demo</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">Stock · Alertas · Proveedores</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : (
        <>
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
              <DialogHeader>
                <DialogTitle>Nuevo producto</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-2">
                <div className="space-y-1">
                  <Label>Nombre *</Label>
                  <Input placeholder="Nombre del producto" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label>Stock actual</Label>
                    <Input type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Stock mínimo</Label>
                    <Input type="number" min={0} value={form.minimo} onChange={(e) => setForm({ ...form, minimo: parseInt(e.target.value) || 5 })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label>Unidad</Label>
                    <Input placeholder="unidad" value={form.unidad} onChange={(e) => setForm({ ...form, unidad: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Coste (€)</Label>
                    <Input type="number" min={0} value={form.precio} onChange={(e) => setForm({ ...form, precio: parseFloat(e.target.value) || 0 })} />
                  </div>
                </div>
                <Button className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white" onClick={handleSave}>
                  Agregar producto
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="space-y-2">
            {productos.length === 0 ? (
              <Card className="rounded-2xl border">
                <CardContent className="p-6 text-center text-sm text-muted-foreground">
                  No hay inventario cargado todavía.
                </CardContent>
              </Card>
            ) : (
              productos.map((p) => (
                <Card key={p.id} className="rounded-2xl border">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{p.nombre}</p>
                      <p className="text-xs text-muted-foreground mt-1">{p.unidad}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={p.stock <= p.minimo ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}>
                        {p.stock} uds
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">min. {p.minimo}</p>
                    </div>
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

export default InventarioApp;
