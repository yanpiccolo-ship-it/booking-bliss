import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bed,
  Plus,
  Pencil,
  Trash2,
  Users,
  Euro,
  Clock,
  Layers,
} from "lucide-react";

interface RoomType {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  capacity: number;
  base_price: number;
  currency: string;
  amenities: string[] | any;
  is_active: boolean;
  check_in_time?: string;
  check_out_time?: string;
}

interface RoomTypeManagerProps {
  businessId: string;
}

const AMENITY_OPTIONS = [
  "WiFi", "AC", "TV", "Minibar", "Balcón", "Vista al mar",
  "Bañera", "Jacuzzi", "Caja fuerte", "Cocina", "Terraza", "Parking",
];

const emptyForm = {
  name: "",
  description: "",
  capacity: 1,
  base_price: 0,
  currency: "EUR",
  amenities: [] as string[],
  is_active: true,
  check_in_time: "15:00",
  check_out_time: "11:00",
};

export const RoomTypeManager = ({ businessId }: RoomTypeManagerProps) => {
  const { toast } = useToast();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRoomTypes();
  }, [businessId]);

  const loadRoomTypes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("room_types")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setRoomTypes(data || []);
    }
    setLoading(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (rt: RoomType) => {
    setEditingId(rt.id);
    setForm({
      name: rt.name,
      description: rt.description || "",
      capacity: rt.capacity,
      base_price: rt.base_price,
      currency: rt.currency,
      amenities: rt.amenities || [],
      is_active: rt.is_active,
      check_in_time: rt.check_in_time || "15:00",
      check_out_time: rt.check_out_time || "11:00",
    });
    setOpen(true);
  };

  const toggleAmenity = (amenity: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: "Nombre requerido", variant: "destructive" });
      return;
    }
    setSaving(true);

    const payload = {
      business_id: businessId,
      name: form.name.trim(),
      description: form.description.trim() || null,
      capacity: form.capacity,
      base_price: form.base_price,
      currency: form.currency,
      amenities: form.amenities,
      is_active: form.is_active,
      check_in_time: form.check_in_time,
      check_out_time: form.check_out_time,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase
        .from("room_types")
        .update(payload)
        .eq("id", editingId));
    } else {
      ({ error } = await supabase.from("room_types").insert(payload));
    }

    if (error) {
      toast({ title: "Error al guardar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingId ? "Tipo actualizado ✅" : "Tipo creado ✅" });
      setOpen(false);
      loadRoomTypes();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este tipo de habitación/recurso?")) return;
    const { error } = await supabase.from("room_types").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Eliminado" });
      setRoomTypes((prev) => prev.filter((rt) => rt.id !== id));
    }
  };

  const toggleActive = async (rt: RoomType) => {
    const { error } = await supabase
      .from("room_types")
      .update({ is_active: !rt.is_active })
      .eq("id", rt.id);
    if (!error) {
      setRoomTypes((prev) =>
        prev.map((r) => (r.id === rt.id ? { ...r, is_active: !r.is_active } : r))
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Bed className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Tipos de Habitación / Recursos
            </h2>
            <p className="text-xs text-muted-foreground">
              {roomTypes.length} tipo{roomTypes.length !== 1 ? "s" : ""} configurado{roomTypes.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openCreate}
              size="sm"
              className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Nuevo tipo
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar tipo" : "Nuevo tipo de habitación / recurso"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              {/* Nombre */}
              <div className="space-y-1.5">
                <Label>Nombre *</Label>
                <Input
                  placeholder="Ej: Suite Deluxe, Mesa exterior, Sala A..."
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>

              {/* Descripción */}
              <div className="space-y-1.5">
                <Label>Descripción</Label>
                <Textarea
                  placeholder="Describe brevemente este tipo..."
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={2}
                />
              </div>

              {/* Capacidad + Precio */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Capacidad (personas)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.capacity}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, capacity: parseInt(e.target.value) || 1 }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Precio base / noche</Label>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.base_price}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, base_price: parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>

              {/* Check-in / Check-out */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Check-in</Label>
                  <Input
                    type="time"
                    value={form.check_in_time}
                    onChange={(e) => setForm((p) => ({ ...p, check_in_time: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Check-out</Label>
                  <Input
                    type="time"
                    value={form.check_out_time}
                    onChange={(e) => setForm((p) => ({ ...p, check_out_time: e.target.value }))}
                  />
                </div>
              </div>

              {/* Amenidades */}
              <div className="space-y-1.5">
                <Label>Amenidades</Label>
                <div className="flex flex-wrap gap-1.5">
                  {AMENITY_OPTIONS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAmenity(a)}
                      className={`px-2.5 py-1 rounded-full text-xs border transition-all ${
                        form.amenities.includes(a)
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-muted text-muted-foreground border-border hover:border-blue-400"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activo */}
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(v) => setForm((p) => ({ ...p, is_active: v }))}
                />
                <Label>Activo (visible para reservas)</Label>
              </div>

              {/* Botones */}
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 rounded-xl bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : roomTypes.length === 0 ? (
        <Card className="rounded-2xl border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 gap-3">
            <Bed className="w-10 h-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground text-center">
              Sin tipos configurados aún.
              <br />
              Crea el primero para habilitar reservas multi-día.
            </p>
            <Button
              size="sm"
              onClick={openCreate}
              className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-1" /> Crear tipo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {roomTypes.map((rt) => (
            <Card
              key={rt.id}
              className={`rounded-2xl border transition-all ${
                rt.is_active ? "bg-card" : "bg-muted/40 opacity-60"
              }`}
            >
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm font-semibold">{rt.name}</CardTitle>
                      <Badge
                        variant={rt.is_active ? "default" : "secondary"}
                        className="text-xs px-2 py-0 rounded-full"
                      >
                        {rt.is_active ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    {rt.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{rt.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(rt)}
                      className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(rt.id)}
                      className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-4 pb-4">
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {rt.capacity} persona{rt.capacity !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <Euro className="w-3.5 h-3.5" />
                    {rt.base_price} {rt.currency} / noche
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    In: {rt.check_in_time?.slice(0, 5)} · Out: {rt.check_out_time?.slice(0, 5)}
                  </span>
                </div>

                {rt.amenities && rt.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {rt.amenities.map((a) => (
                      <span
                        key={a}
                        className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                )}

                {/* Toggle activo */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                  <Switch
                    checked={rt.is_active}
                    onCheckedChange={() => toggleActive(rt)}
                  />
                  <span className="text-xs text-muted-foreground">
                    {rt.is_active ? "Visible para reservas" : "Oculto"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomTypeManager;
