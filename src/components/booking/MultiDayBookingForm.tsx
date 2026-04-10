import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Moon, Euro, Users, CheckCircle2 } from "lucide-react";
import { differenceInDays, format, addDays } from "date-fns";
import { es } from "date-fns/locale";

interface RoomType {
  id: string;
  name: string;
  base_price: number;
  currency: string;
  capacity: number;
  check_in_time: string;
  check_out_time: string;
}

interface MultiDayBookingFormProps {
  businessId: string;
  serviceId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const today = format(new Date(), "yyyy-MM-dd");
const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

export const MultiDayBookingForm = ({
  businessId,
  serviceId,
  onSuccess,
  onCancel,
}: MultiDayBookingFormProps) => {
  const { toast } = useToast();
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string>("");
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [partySize, setPartySize] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Single-day fields
  const [bookingDate, setBookingDate] = useState(today);
  const [bookingTime, setBookingTime] = useState("12:00");

  useEffect(() => {
    loadRoomTypes();
  }, [businessId]);

  const loadRoomTypes = async () => {
    const { data } = await supabase
      .from("room_types")
      .select("id, name, base_price, currency, capacity, check_in_time, check_out_time")
      .eq("business_id", businessId)
      .eq("is_active", true);
    setRoomTypes(data || []);
  };

  const selectedRoom = roomTypes.find((r) => r.id === selectedRoomTypeId);

  const nights =
    isMultiDay && checkIn && checkOut
      ? Math.max(0, differenceInDays(new Date(checkOut), new Date(checkIn)))
      : 0;

  const totalPrice =
    isMultiDay && selectedRoom ? selectedRoom.base_price * nights : 0;

  const handleSubmit = async () => {
    if (!customerName.trim()) {
      toast({ title: "Nombre del cliente requerido", variant: "destructive" });
      return;
    }
    if (isMultiDay && nights <= 0) {
      toast({ title: "Las fechas no son válidas", variant: "destructive" });
      return;
    }

    setSaving(true);

    const payload: Record<string, unknown> = {
      business_id: businessId,
      service_id: serviceId || null,
      party_size: partySize,
      status: "pending",
      source: "dashboard",
      notes: notes || null,
      is_multi_day: isMultiDay,
    };

    // Datos del cliente (nombre como notas si no hay customer_id)
    if (customerName) payload.notes = `${customerName}${customerEmail ? ` | ${customerEmail}` : ""}${customerPhone ? ` | ${customerPhone}` : ""}${notes ? ` | ${notes}` : ""}`;

    if (isMultiDay) {
      payload.check_in_date = checkIn;
      payload.check_out_date = checkOut;
      payload.nights_count = nights;
      payload.room_type_id = selectedRoomTypeId || null;
      payload.price_per_night = selectedRoom?.base_price || 0;
      payload.total_price = totalPrice;
      // start_time como referencia
      payload.start_time = `${checkIn}T${selectedRoom?.check_in_time || "15:00"}:00`;
      payload.end_time = `${checkOut}T${selectedRoom?.check_out_time || "11:00"}:00`;
    } else {
      payload.start_time = `${bookingDate}T${bookingTime}:00`;
      payload.end_time = `${bookingDate}T${bookingTime}:00`;
    }

    const { error } = await supabase.from("reservations").insert(payload);

    if (error) {
      toast({ title: "Error al crear reserva", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Reserva creada ✅" });
      onSuccess?.();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      {/* Toggle Multi-día */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border">
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-blue-400" />
          <div>
            <p className="text-sm font-medium">Reserva multi-día</p>
            <p className="text-xs text-muted-foreground">Hotel, apartamento, alquiler largo</p>
          </div>
        </div>
        <Switch checked={isMultiDay} onCheckedChange={setIsMultiDay} />
      </div>

      {/* Fechas */}
      {isMultiDay ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Check-in
              </Label>
              <Input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (e.target.value >= checkOut) {
                    setCheckOut(format(addDays(new Date(e.target.value), 1), "yyyy-MM-dd"));
                  }
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Check-out
              </Label>
              <Input
                type="date"
                value={checkOut}
                min={format(addDays(new Date(checkIn), 1), "yyyy-MM-dd")}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>

          {/* Resumen de noches */}
          {nights > 0 && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <span className="text-sm text-blue-400 flex items-center gap-1.5">
                <Moon className="w-4 h-4" />
                {nights} noche{nights !== 1 ? "s" : ""}
              </span>
              {totalPrice > 0 && (
                <span className="text-sm font-semibold text-blue-400 flex items-center gap-1">
                  <Euro className="w-3.5 h-3.5" />
                  {totalPrice.toFixed(2)} {selectedRoom?.currency || "EUR"}
                </span>
              )}
            </div>
          )}

          {/* Tipo de habitación */}
          {roomTypes.length > 0 && (
            <div className="space-y-1.5">
              <Label>Tipo de habitación / recurso</Label>
              <Select value={selectedRoomTypeId} onValueChange={setSelectedRoomTypeId}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Seleccionar tipo..." />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((rt) => (
                    <SelectItem key={rt.id} value={rt.id}>
                      {rt.name} — {rt.base_price} {rt.currency}/noche
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      ) : (
        /* Single day */
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Fecha</Label>
            <Input
              type="date"
              value={bookingDate}
              min={today}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Hora</Label>
            <Input
              type="time"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Datos del cliente */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Datos del cliente
        </Label>
        <Input
          placeholder="Nombre completo *"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Email"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
          <Input
            placeholder="Teléfono"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>
      </div>

      {/* Personas + Notas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Personas
          </Label>
          <Input
            type="number"
            min={1}
            value={partySize}
            onChange={(e) => setPartySize(parseInt(e.target.value) || 1)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Notas</Label>
          <Input
            placeholder="Peticiones especiales..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-2 pt-1">
        {onCancel && (
          <Button variant="outline" className="flex-1 rounded-xl" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button
          className="flex-1 rounded-xl bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? "Creando..." : (
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Crear reserva
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MultiDayBookingForm;
