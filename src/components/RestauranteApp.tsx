import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Utensils, Plus, BookOpen, ShoppingBag, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface RestauranteAppProps { businessId: string; }
interface Plato { id: string; nombre: string; categoria: string; precio: number; disponible: boolean; }

const MOCK_ITEMS: Plato[] = [
  { id: "1", nombre: "Bruschetta", categoria: "Entrante", precio: 8, disponible: true },
  { id: "2", nombre: "Risotto de setas", categoria: "Principal", precio: 19, disponible: true },
  { id: "3", nombre: "Tiramisú", categoria: "Postre", precio: 7, disponible: false },
];

const RestauranteApp = ({ businessId }: RestauranteAppProps) => {
  const isDemo = businessId === "demo";
  const [items, setItems] = useState<Plato[]>(MOCK_ITEMS);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(!isDemo);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [pendingOrders, setPendingOrders] = useState(4);
  const [revenue, setRevenue] = useState(640);
  const [form, setForm] = useState({ nombre: "", categoria: "", precio: 0 });
  const { toast } = useToast();

  useEffect(() => {
    if (isDemo) return;
    void loadRestaurantData();
  }, [businessId, isDemo]);

  const loadRestaurantData = async () => {
    setLoading(true);
    const [{ data: menuData, error: menuError }, { data: itemsData, error: itemsError }, { data: ordersData, error: ordersError }] = await Promise.all([
      supabase.from("menus").select("id").eq("business_id", businessId).eq("is_active", true).limit(1).maybeSingle(),
      supabase.from("menu_items").select("id, name, category, price_cents, is_available").eq("business_id", businessId).order("display_order", { ascending: true }),
      supabase.from("orders").select("id, status, total_cents").eq("business_id", businessId).order("created_at", { ascending: false }).limit(50),
    ]);

    if (menuError || itemsError || ordersError) {
      toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los datos del restaurante." });
      setItems([]);
      setPendingOrders(0);
      setRevenue(0);
      setLoading(false);
      return;
    }

    setActiveMenuId(menuData?.id || null);
    setItems((itemsData || []).map((item) => ({
      id: item.id,
      nombre: item.name,
      categoria: item.category || "General",
      precio: (item.price_cents || 0) / 100,
      disponible: item.is_available ?? true,
    })));

    const orders = ordersData || [];
    setPendingOrders(orders.filter((order) => order.status === "pending").length);
    setRevenue(orders.reduce((sum, order) => sum + ((order.total_cents || 0) / 100), 0));
    setLoading(false);
  };

  const ensureMenu = async () => {
    if (activeMenuId) return activeMenuId;

    const { data, error } = await supabase
      .from("menus")
      .insert({ business_id: businessId, name: "Menú Principal", is_active: true })
      .select("id")
      .single();

    if (error) throw error;
    setActiveMenuId(data.id);
    return data.id;
  };

  const handleSave = async () => {
    if (!form.nombre) return;

    if (isDemo) {
      setItems((prev) => [...prev, { id: Date.now().toString(), nombre: form.nombre, categoria: form.categoria || "General", precio: form.precio, disponible: true }]);
      toast({ title: "Plato creado ✅" });
      setOpenDialog(false);
      return;
    }

    try {
      const menuId = await ensureMenu();
      const { data, error } = await supabase
        .from("menu_items")
        .insert({
          business_id: businessId,
          menu_id: menuId,
          name: form.nombre,
          category: form.categoria || "General",
          price_cents: Math.round(form.precio * 100),
          is_available: true,
        })
        .select("id, name, category, price_cents, is_available")
        .single();

      if (error) throw error;

      setItems((prev) => [{
        id: data.id,
        nombre: data.name,
        categoria: data.category || "General",
        precio: (data.price_cents || 0) / 100,
        disponible: data.is_available ?? true,
      }, ...prev]);
      toast({ title: "Plato creado ✅" });
      setOpenDialog(false);
    } catch {
      toast({ variant: "destructive", title: "Error", description: "No se pudo guardar el plato." });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-orange-500/20 flex items-center justify-center">
          <Utensils className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">Restaurante</h2>
            {isDemo && <Badge className="bg-muted text-muted-foreground">Demo</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">Menú · Pedidos · Operación</p>
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
                <p className="text-xl font-bold text-orange-500">{items.length}</p>
                <p className="text-xs text-muted-foreground">Platos</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border">
              <CardContent className="p-3 text-center">
                <p className="text-xl font-bold text-blue-500">{pendingOrders}</p>
                <p className="text-xs text-muted-foreground">Pedidos</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border">
              <CardContent className="p-3 text-center">
                <p className="text-xl font-bold text-emerald-500">€{revenue}</p>
                <p className="text-xs text-muted-foreground">Facturación</p>
              </CardContent>
            </Card>
          </div>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white gap-1">
                <Plus className="w-4 h-4" /> Nuevo plato
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl max-w-sm">
              <DialogHeader>
                <DialogTitle>Nuevo plato</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-2">
                <div className="space-y-1">
                  <Label>Nombre *</Label>
                  <Input placeholder="Nombre del plato" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Categoría</Label>
                  <Input placeholder="Entrante, Principal..." value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Precio (€)</Label>
                  <Input type="number" min={0} value={form.precio} onChange={(e) => setForm({ ...form, precio: parseFloat(e.target.value) || 0 })} />
                </div>
                <Button className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>
                  Crear plato
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="space-y-2">
            {items.length === 0 ? (
              <Card className="rounded-2xl border">
                <CardContent className="p-6 text-center text-sm text-muted-foreground">
                  No hay platos cargados todavía.
                </CardContent>
              </Card>
            ) : (
              items.map((item) => (
                <Card key={item.id} className="rounded-2xl border">
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm">{item.nombre}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{item.categoria}</span>
                        <span className="flex items-center gap-1"><ShoppingBag className="w-3 h-3" />€{item.precio}</span>
                      </div>
                    </div>
                    <Badge className={item.disponible ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}>
                      {item.disponible ? "disponible" : "oculto"}
                    </Badge>
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

export default RestauranteApp;
