import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Cpu, ArrowRight, ArrowLeft, Check, Sparkles, Building2, Users,
  Calendar, Zap, ChevronRight, Shield, Clock, Star
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const verticals = [
  { id: "restaurante", label: "Restaurante", icon: "🍽️" },
  { id: "hotel", label: "Hotel / Hostel", icon: "🏨" },
  { id: "spa", label: "Spa / Wellness", icon: "🧖" },
  { id: "peluqueria", label: "Peluquería / Estética", icon: "💇" },
  { id: "gym", label: "Gym / Yoga / Pilates", icon: "🏋️" },
  { id: "clinica", label: "Clínica / Veterinaria", icon: "🏥" },
  { id: "coworking", label: "Coworking", icon: "💻" },
  { id: "tour", label: "Tours / Experiencias", icon: "🗺️" },
  { id: "workshop", label: "Workshops / Clases", icon: "📚" },
  { id: "coaching", label: "Coaching / Terapias", icon: "🧠" },
  { id: "otro", label: "Otro", icon: "✨" },
];

const teamSizes = [
  { id: "solo", label: "Solo yo" },
  { id: "2-5", label: "2–5 personas" },
  { id: "6-15", label: "6–15 personas" },
  { id: "16+", label: "16+ personas" },
];

const RequestDemo = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    vertical: "",
    teamSize: "",
    monthlyBookings: "",
    challenge: "",
  });

  const totalSteps = 3;

  const canProceed = () => {
    if (step === 1) return form.name && form.email && form.businessName;
    if (step === 2) return form.vertical && form.teamSize;
    return true;
  };

  const handleSubmit = () => {
    // Store demo access in sessionStorage
    sessionStorage.setItem("demo_qualified", "true");
    sessionStorage.setItem("demo_lead", JSON.stringify(form));
    navigate("/demo");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center">
              <Cpu className="w-4 h-4 text-background" />
            </div>
            <span className="font-display font-bold text-lg">
              Flow<span className="text-muted-foreground">Booking</span>
            </span>
          </a>
          <button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8 justify-center">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step > s ? "bg-foreground text-background" :
                  step === s ? "bg-foreground text-background shadow-medium" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 3 && <div className={`h-0.5 w-12 sm:w-20 transition-colors ${step > s ? "bg-foreground" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Contact info */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-7 h-7 text-foreground" />
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    Solicitar Demo Estratégica
                  </h1>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Cuéntanos sobre tu negocio y te mostraremos cómo FlowBooking puede automatizar tus reservas y ventas.
                  </p>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Nombre completo *</label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tu nombre" className="rounded-xl" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@email.com" className="rounded-xl" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Nombre del negocio *</label>
                      <Input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} placeholder="Mi Negocio" className="rounded-xl" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Teléfono (opcional)</label>
                      <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+34 612 345 678" className="rounded-xl" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={() => setStep(2)} disabled={!canProceed()} className="bg-foreground text-background hover:bg-foreground/90 rounded-xl h-12 px-8">
                    Continuar <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Qualification */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <Users className="w-7 h-7 text-foreground" />
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    Cuéntanos sobre tu negocio
                  </h1>
                  <p className="text-muted-foreground">Esto nos ayuda a personalizar la demo para tu industria.</p>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-6">
                  {/* Vertical selection */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">¿Cuál es tu rubro? *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {verticals.map((v) => (
                        <button key={v.id} onClick={() => setForm({ ...form, vertical: v.id })}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                            form.vertical === v.id
                              ? "border-foreground bg-foreground/5 text-foreground"
                              : "border-border text-muted-foreground hover:border-foreground/30"
                          }`}>
                          <span>{v.icon}</span>
                          <span className="truncate">{v.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Team size */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">Tamaño del equipo *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {teamSizes.map((t) => (
                        <button key={t.id} onClick={() => setForm({ ...form, teamSize: t.id })}
                          className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                            form.teamSize === t.id
                              ? "border-foreground bg-foreground/5 text-foreground"
                              : "border-border text-muted-foreground hover:border-foreground/30"
                          }`}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Monthly bookings */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Reservas mensuales aproximadas</label>
                    <Input value={form.monthlyBookings} onChange={(e) => setForm({ ...form, monthlyBookings: e.target.value })} placeholder="Ej: 100, 500, 1000+" className="rounded-xl" />
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl h-12 px-6">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Atrás
                  </Button>
                  <Button onClick={() => setStep(3)} disabled={!canProceed()} className="bg-foreground text-background hover:bg-foreground/90 rounded-xl h-12 px-8">
                    Continuar <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Challenge + Submit */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-7 h-7 text-foreground" />
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    Un último paso
                  </h1>
                  <p className="text-muted-foreground">Cuéntanos tu mayor desafío para personalizar la experiencia.</p>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-5">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">¿Cuál es tu mayor desafío con las reservas? (opcional)</label>
                    <Textarea value={form.challenge} onChange={(e) => setForm({ ...form, challenge: e.target.value })} placeholder="Ej: Mis clientes cancelan mucho, pierdo reservas por no contestar a tiempo..." className="rounded-xl resize-none h-24" />
                  </div>

                  {/* What they'll get */}
                  <div className="bg-muted rounded-2xl p-5 space-y-3">
                    <p className="text-sm font-semibold text-foreground">Tu demo incluye:</p>
                    {[
                      { icon: Calendar, text: "Panel de control interactivo adaptado a tu rubro" },
                      { icon: Zap, text: "Simulación de agentes IA en acción" },
                      { icon: Clock, text: "Acceso inmediato — sin esperas" },
                      { icon: Shield, text: "Sin compromiso, sin tarjeta de crédito" },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-3.5 h-3.5 text-foreground" />
                        </div>
                        <span className="text-sm text-foreground">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setStep(2)} className="rounded-xl h-12 px-6">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Atrás
                  </Button>
                  <Button onClick={handleSubmit} className="bg-foreground text-background hover:bg-foreground/90 rounded-xl h-12 px-8 shadow-medium">
                    <Sparkles className="w-4 h-4 mr-2" /> Acceder a mi demo
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-10 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Datos protegidos</span>
            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> Sin compromiso</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Acceso inmediato</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDemo;
