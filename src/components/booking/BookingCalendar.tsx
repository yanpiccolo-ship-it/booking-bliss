import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock, Check, Loader2, User, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_cents: number;
  capacity: number;
}

interface BookingCalendarProps {
  businessId: string;
  services: Service[];
  themeColor?: string;
}

type BookingStep = "service" | "date" | "time" | "info" | "confirm";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00"
];

const BookingCalendar = ({ businessId, services, themeColor = "#10b981" }: BookingCalendarProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<BookingStep>("service");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();

  useEffect(() => {
    if (selectedDate && selectedService) {
      loadBookedSlots();
    }
  }, [selectedDate, selectedService]);

  const loadBookedSlots = async () => {
    if (!selectedDate || !selectedService) return;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const { data } = await supabase
      .from("reservations")
      .select("reservation_time")
      .eq("business_id", businessId)
      .eq("service_id", selectedService.id)
      .eq("reservation_date", dateStr)
      .in("status", ["pending", "confirmed"]);
    
    setBookedSlots(data?.map(r => r.reservation_time.slice(0, 5)) || []);
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("reservations").insert({
        business_id: businessId,
        service_id: selectedService.id,
        reservation_date: format(selectedDate, "yyyy-MM-dd"),
        reservation_time: selectedTime,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        status: "pending",
      });
      if (error) throw error;
      setStep("confirm");
    } catch {
      toast({ variant: "destructive", title: "Error", description: "No se pudo completar la reserva." });
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = ["service", "date", "time", "info", "confirm"].indexOf(step);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress */}
      {step !== "confirm" && (
        <div className="flex gap-1 mb-6">
          {["Servicio", "Fecha", "Hora", "Datos"].map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className="h-1 rounded-full transition-all duration-300"
                style={{ backgroundColor: i <= stepIndex ? themeColor : "hsl(var(--muted))" }}
              />
              <p className="text-[10px] mt-1 text-center" style={{ color: i <= stepIndex ? themeColor : "hsl(var(--muted-foreground))" }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Step 1: Service */}
        {step === "service" && (
          <motion.div key="service" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Elige un servicio</h3>
            <div className="space-y-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => { setSelectedService(service); setStep("date"); }}
                  className="w-full text-left p-4 rounded-2xl border border-border hover:border-primary/40 bg-card transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-foreground">{service.name}</p>
                      {service.description && <p className="text-sm text-muted-foreground mt-1">{service.description}</p>}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{service.duration_minutes} min</span>
                      </div>
                    </div>
                    <span className="font-semibold text-foreground">€{(service.price_cents / 100).toFixed(2)}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Date */}
        {step === "date" && (
          <motion.div key="date" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <button onClick={() => setStep("service")} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground">
              <ChevronLeft className="w-4 h-4" />Atrás
            </button>
            <h3 className="text-lg font-semibold text-foreground mb-4">Selecciona una fecha</h3>
            
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setWeekStart(addDays(weekStart, -7))} className="p-2 rounded-xl hover:bg-muted">
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <span className="text-sm font-medium text-foreground">
                {format(weekStart, "MMMM yyyy", { locale: es })}
              </span>
              <button onClick={() => setWeekStart(addDays(weekStart, 7))} className="p-2 rounded-xl hover:bg-muted">
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const isPast = day < today && !isSameDay(day, today);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                return (
                  <button
                    key={day.toISOString()}
                    disabled={isPast}
                    onClick={() => { setSelectedDate(day); setStep("time"); }}
                    className={`flex flex-col items-center py-3 rounded-2xl transition-all text-sm ${
                      isPast ? "opacity-30 cursor-not-allowed" :
                      isSelected ? "text-white shadow-lg" :
                      "hover:bg-muted text-foreground"
                    }`}
                    style={isSelected ? { backgroundColor: themeColor } : undefined}
                  >
                    <span className="text-[10px] uppercase">{format(day, "EEE", { locale: es })}</span>
                    <span className="text-lg font-semibold mt-1">{format(day, "d")}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Step 3: Time */}
        {step === "time" && (
          <motion.div key="time" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <button onClick={() => setStep("date")} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground">
              <ChevronLeft className="w-4 h-4" />Atrás
            </button>
            <h3 className="text-lg font-semibold text-foreground mb-1">Elige una hora</h3>
            <p className="text-sm text-muted-foreground mb-4">{selectedDate && format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}</p>
            
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((time) => {
                const isBooked = bookedSlots.includes(time);
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    disabled={isBooked}
                    onClick={() => { setSelectedTime(time); setStep("info"); }}
                    className={`py-3 rounded-xl text-sm font-medium transition-all ${
                      isBooked ? "bg-muted/50 text-muted-foreground/50 cursor-not-allowed line-through" :
                      isSelected ? "text-white shadow-md" :
                      "bg-card border border-border hover:border-primary/40 text-foreground"
                    }`}
                    style={isSelected ? { backgroundColor: themeColor } : undefined}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Step 4: Customer Info */}
        {step === "info" && (
          <motion.div key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <button onClick={() => setStep("time")} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground">
              <ChevronLeft className="w-4 h-4" />Atrás
            </button>
            <h3 className="text-lg font-semibold text-foreground mb-4">Tus datos</h3>
            
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Nombre completo" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="pl-10 h-12 rounded-xl" />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="Email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="pl-10 h-12 rounded-xl" />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="tel" placeholder="Teléfono" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="pl-10 h-12 rounded-xl" />
              </div>

              {/* Summary */}
              <div className="p-4 rounded-2xl bg-muted/50 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Servicio</span><span className="font-medium text-foreground">{selectedService?.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Fecha</span><span className="font-medium text-foreground">{selectedDate && format(selectedDate, "dd/MM/yyyy")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Hora</span><span className="font-medium text-foreground">{selectedTime}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Precio</span><span className="font-semibold text-foreground">€{selectedService && (selectedService.price_cents / 100).toFixed(2)}</span></div>
              </div>

              <Button
                onClick={handleBooking}
                disabled={loading || !customerName || !customerEmail}
                className="w-full h-12 rounded-xl text-base font-semibold"
                style={{ backgroundColor: themeColor }}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmar reserva"}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 5: Confirmed */}
        {step === "confirm" && (
          <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: themeColor }}>
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">¡Reserva confirmada!</h3>
            <p className="text-muted-foreground text-sm mb-1">{selectedService?.name}</p>
            <p className="text-muted-foreground text-sm">
              {selectedDate && format(selectedDate, "EEEE d 'de' MMMM", { locale: es })} a las {selectedTime}
            </p>
            <p className="text-xs text-muted-foreground mt-4">Te enviaremos una confirmación a {customerEmail}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingCalendar;
