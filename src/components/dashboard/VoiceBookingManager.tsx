import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Mic, Phone, Calendar, Clock, Globe, ChevronRight } from "lucide-react";

const LANG_FLAGS: Record<string, string> = {
  es: "🇪🇸", en: "🇬🇧", it: "🇮🇹", fr: "🇫🇷", de: "🇩🇪", pt: "🇵🇹",
};

const LANG_NAMES: Record<string, string> = {
  es: "Español", en: "English", it: "Italiano", fr: "Français", de: "Deutsch", pt: "Português",
};

interface VoiceBooking {
  id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  reservation_date: string;
  reservation_time: string;
  language_code: string | null;
  raw_transcript: string | null;
  status: string | null;
  source: string | null;
  created_at: string;
  services?: { name: string } | null;
}

interface VoiceBookingManagerProps {
  businessId: string;
}

const VoiceBookingManager = ({ businessId }: VoiceBookingManagerProps) => {
  const [bookings, setBookings] = useState<VoiceBooking[]>([]);
  const [hasNewBooking, setHasNewBooking] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadVoiceBookings = async () => {
    const { data } = await supabase
      .from("reservations")
      .select("*, services(name)")
      .eq("business_id", businessId)
      .eq("source", "voice")
      .order("created_at", { ascending: false })
      .limit(50);
    setBookings((data as unknown as VoiceBooking[]) || []);
  };

  useEffect(() => {
    loadVoiceBookings();

    // Realtime subscription
    const channel = supabase
      .channel("voice-bookings")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reservations",
          filter: `business_id=eq.${businessId}`,
        },
        (payload) => {
          const newRow = payload.new as any;
          if (newRow.source === "voice") {
            setBookings((prev) => [newRow, ...prev]);
            setHasNewBooking(true);
            setTimeout(() => setHasNewBooking(false), 4000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId]);

  const formatTime = (time: string, lang: string | null) => {
    const [h, m] = time.slice(0, 5).split(":");
    const hour = parseInt(h);
    if (lang === "en") {
      const ampm = hour >= 12 ? "PM" : "AM";
      return `${hour % 12 || 12}:${m} ${ampm}`;
    }
    return `${h}:${m}`;
  };

  return (
    <div className="space-y-6">
      {/* Header with live pulse */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <AnimatePresence>
              {hasNewBooking && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background"
                >
                  <motion.div
                    animate={{ scale: [1, 1.8, 1], opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-full h-full rounded-full bg-emerald-500"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground text-lg">Reservas por Voz</h3>
            <p className="text-xs text-muted-foreground">
              {bookings.length} reserva{bookings.length !== 1 ? "s" : ""} · Tiempo real activo
            </p>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2 h-2 rounded-full bg-emerald-500"
          />
          <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Booking cards - Glassmorphism */}
      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <Phone className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground mb-1">Sin reservas por voz aún</p>
          <p className="text-xs text-muted-foreground">
            Conecta tu agente de voz via webhook para recibir reservas aquí
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {bookings.map((booking, i) => {
              const lang = booking.language_code || "es";
              const flag = LANG_FLAGS[lang] || "🌐";
              const langName = LANG_NAMES[lang] || lang;
              const isExpanded = expandedId === booking.id;

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03 }}
                  layout
                  onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                  className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    {/* Language flag */}
                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-xl flex-shrink-0">
                      {flag}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {booking.customer_name || "Cliente"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {booking.reservation_date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(booking.reservation_time, booking.language_code)}
                        </span>
                      </div>
                    </div>

                    {/* Status + lang */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        booking.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                        booking.status === "pending" ? "bg-amber-100 text-amber-700" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {booking.status === "confirmed" ? "Confirmada" : booking.status === "pending" ? "Pendiente" : booking.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Globe className="w-2.5 h-2.5" /> {langName}
                      </span>
                    </div>

                    <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-3 border-t border-border/50 space-y-2 text-sm">
                          {booking.customer_phone && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Teléfono</span>
                              <span className="text-foreground font-medium">{booking.customer_phone}</span>
                            </div>
                          )}
                          {booking.customer_email && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Email</span>
                              <span className="text-foreground font-medium">{booking.customer_email}</span>
                            </div>
                          )}
                          {booking.services?.name && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Servicio</span>
                              <span className="text-foreground font-medium">{booking.services.name}</span>
                            </div>
                          )}
                          {booking.raw_transcript && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground mb-1">Transcripción</p>
                              <p className="text-xs text-foreground bg-muted/50 rounded-xl p-3 leading-relaxed">
                                {booking.raw_transcript}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Webhook info */}
      <div className="rounded-2xl bg-muted/30 border border-border/40 p-4">
        <p className="text-xs font-semibold text-foreground mb-1">📡 Endpoint del Webhook</p>
        <code className="text-[10px] text-muted-foreground break-all block bg-muted/50 rounded-lg p-2 mt-1">
          {`https://${import.meta.env.VITE_SUPABASE_PROJECT_ID || "tu-proyecto"}.supabase.co/functions/v1/voice-booking-webhook`}
        </code>
        <p className="text-[10px] text-muted-foreground mt-2">
          Configura este URL en Make.com para recibir reservas de tu agente de voz.
        </p>
      </div>
    </div>
  );
};

export default VoiceBookingManager;
