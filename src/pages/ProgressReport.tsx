import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Phase {
  id: string;
  name: string;
  status: "done" | "partial" | "pending";
  percent: number;
  items: { label: string; done: boolean }[];
}

const phases: Phase[] = [
  {
    id: "infra",
    name: "Infraestructura Base",
    status: "done",
    percent: 100,
    items: [
      { label: "Multi-tenant Supabase + RLS", done: true },
      { label: "Auth + Roles (admin/business_owner/end_customer)", done: true },
      { label: "Profiles & Business CRUD", done: true },
      { label: "i18n 6 idiomas", done: true },
      { label: "Landing editorial + SEO", done: true },
    ],
  },
  {
    id: "payments",
    name: "Stripe & Membresías",
    status: "done",
    percent: 100,
    items: [
      { label: "3 tiers (Básico/Avanzado/Personalizado)", done: true },
      { label: "Checkout + Webhooks", done: true },
      { label: "Customer Portal", done: true },
      { label: "Subscription gating por módulo", done: true },
    ],
  },
  {
    id: "dashboard",
    name: "Dashboard iPhone-style",
    status: "done",
    percent: 100,
    items: [
      { label: "Home con stats + actividad", done: true },
      { label: "Grid de Apps con plan gating", done: true },
      { label: "Micro-sitio público (/b/:slug)", done: true },
      { label: "Booking Calendar widget", done: true },
    ],
  },
  {
    id: "agents",
    name: "Agentes IA (Fase 2)",
    status: "done",
    percent: 100,
    items: [
      { label: "agent-chat Edge Function (SSE streaming)", done: true },
      { label: "Context injection (business + services)", done: true },
      { label: "4 agentes: Atención, Reservas, Ventas, Admin", done: true },
      { label: "AgentChat UI con selección de agente", done: true },
      { label: "AgentManager CRUD en Admin Panel", done: true },
    ],
  },
  {
    id: "voice",
    name: "Agente de Voz (Fase 2)",
    status: "done",
    percent: 100,
    items: [
      { label: "RODES system prompt políglota", done: true },
      { label: "voice-booking-webhook para Make.com/Vapi", done: true },
      { label: "VoiceBookingManager UI tiempo real", done: true },
      { label: "Recepcionista IA (Voz) en ai_agents", done: true },
    ],
  },
  {
    id: "b2b",
    name: "Ventas B2B (Fase 3)",
    status: "done",
    percent: 100,
    items: [
      { label: "Agente B2B con prospección por ciudad/CP/rubro", done: true },
      { label: "Sistema de autorización (Autorizar/Rechazar)", done: true },
      { label: "Propuestas adaptadas por vertical", done: true },
    ],
  },
  {
    id: "multiday",
    name: "Hito 3 — Multi-Day Booking",
    status: "done",
    percent: 100,
    items: [
      { label: "Tabla room_types con amenidades", done: true },
      { label: "Columnas multi-day en reservations", done: true },
      { label: "Trigger auto-cálculo noches/precio", done: true },
      { label: "RoomTypeManager UI (CRUD)", done: true },
      { label: "MultiDayBookingForm (check-in/out)", done: true },
      { label: "Integración en Dashboard > Alojamiento", done: true },
    ],
  },
  {
    id: "flowcore",
    name: "FlowCore Engine",
    status: "partial",
    percent: 25,
    items: [
      { label: "Availability Engine (resource_types, resources, availability_rules)", done: false },
      { label: "Resource Assignment Engine (auto-assign)", done: false },
      { label: "Reservation Engine (validación antes de insert)", done: false },
      { label: "Conflict detection & overbooking prevention", done: false },
      { label: "Buffer times (before/after)", done: false },
      { label: "Multi-day availability check integrado", done: true },
      { label: "Capacity validation (party_size vs resource)", done: true },
    ],
  },
  {
    id: "analytics",
    name: "Analytics Intelligence Engine",
    status: "pending",
    percent: 0,
    items: [
      { label: "Dashboard de métricas reales (ingresos, ocupación)", done: false },
      { label: "Reportes por periodo/servicio/recurso", done: false },
      { label: "Predicción de demanda con IA", done: false },
      { label: "Exportación CSV/PDF", done: false },
    ],
  },
  {
    id: "automation",
    name: "Automation Engine",
    status: "pending",
    percent: 0,
    items: [
      { label: "Confirmación automática por email/WhatsApp", done: false },
      { label: "Recordatorios pre-reserva", done: false },
      { label: "No-show detection & follow-up", done: false },
      { label: "Webhooks salientes a terceros", done: false },
    ],
  },
];

const statusColor = (s: Phase["status"]) =>
  s === "done" ? "hsl(142, 71%, 45%)" : s === "partial" ? "hsl(38, 92%, 50%)" : "hsl(var(--muted-foreground))";

const ProgressReport = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const totalItems = phases.reduce((a, p) => a + p.items.length, 0);
  const doneItems = phases.reduce((a, p) => a + p.items.filter((i) => i.done).length, 0);
  const globalPercent = Math.round((doneItems / totalItems) * 100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 200;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const r = 80;
    const lw = 12;

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "hsl(0,0%,90%)";
    ctx.lineWidth = lw;
    ctx.lineCap = "round";
    ctx.stroke();

    // Animated fill
    let frame = 0;
    const target = globalPercent / 100;
    const animate = () => {
      frame += 0.02;
      const progress = Math.min(frame, target);
      ctx.clearRect(0, 0, size, size);

      // BG
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "hsl(0,0%,90%)";
      ctx.lineWidth = lw;
      ctx.lineCap = "round";
      ctx.stroke();

      // Fill
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, "hsl(142, 71%, 45%)");
      gradient.addColorStop(1, "hsl(199, 89%, 48%)");
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = lw;
      ctx.lineCap = "round";
      ctx.stroke();

      // Text
      ctx.fillStyle = "hsl(0,0%,10%)";
      ctx.font = "bold 36px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${Math.round(progress * 100)}%`, cx, cy - 8);
      ctx.font = "12px system-ui";
      ctx.fillStyle = "hsl(0,0%,50%)";
      ctx.fillText("completado", cx, cy + 16);

      if (progress < target) requestAnimationFrame(animate);
    };
    animate();
  }, [globalPercent]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">FlowBooking Progress</h1>
            <p className="text-sm text-muted-foreground">
              {doneItems}/{totalItems} tareas completadas
            </p>
          </div>
        </div>

        {/* D3-style donut */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-10"
        >
          <canvas ref={canvasRef} />
        </motion.div>

        {/* Phase bars */}
        <div className="space-y-6">
          {phases.map((phase, i) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: statusColor(phase.status) }}
                  />
                  <h3 className="text-sm font-semibold text-foreground">{phase.name}</h3>
                </div>
                <span className="text-xs font-medium text-muted-foreground">{phase.percent}%</span>
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full bg-muted mb-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${phase.percent}%` }}
                  transition={{ duration: 0.8, delay: i * 0.06 }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      phase.status === "done"
                        ? "linear-gradient(90deg, hsl(142,71%,45%), hsl(160,84%,39%))"
                        : phase.status === "partial"
                        ? "linear-gradient(90deg, hsl(38,92%,50%), hsl(45,93%,47%))"
                        : "hsl(var(--muted-foreground))",
                  }}
                />
              </div>

              {/* Items */}
              <div className="space-y-1 pl-5">
                {phase.items.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        item.done
                          ? "bg-emerald-500 text-white"
                          : "border border-border text-muted-foreground"
                      }`}
                    >
                      {item.done ? "✓" : ""}
                    </span>
                    <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-10 mb-6">
          {[
            { label: "Completado", color: "hsl(142,71%,45%)" },
            { label: "Parcial", color: "hsl(38,92%,50%)" },
            { label: "Pendiente", color: "hsl(0,0%,70%)" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressReport;
