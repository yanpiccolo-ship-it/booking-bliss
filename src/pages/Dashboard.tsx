import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Cpu, LogOut, Calendar, CreditCard, BarChart3, Settings,
  Bell, ChevronRight, TrendingUp, Users,
  Clock, DollarSign, Crown, ExternalLink, RefreshCw, Loader2,
  Plus, FileText, MessageSquare, Star, Home, User as UserIcon,
  Utensils, Hotel, Plane, Dumbbell, BookOpen, Package, Globe, Bot,
  ShoppingBag, Zap, Sparkles, ArrowUpRight, X, Link2, Mic
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import { STRIPE_TIERS, getTierByProductId, type StripeTier } from "@/lib/stripe-config";
import IntegrationsPanel from "@/components/dashboard/IntegrationsPanel";
import VoiceBookingManager from "@/components/dashboard/VoiceBookingManager";
import AgentChat from "@/components/dashboard/AgentChat";

// Feature definitions per plan
const PLAN_FEATURES: Record<StripeTier, string[]> = {
  basic: ["bookings", "payments", "clients", "voice", "agents", "notifications", "settings"],
  professional: ["bookings", "payments", "clients", "voice", "agents", "reports", "restaurant", "hospitality", "wellness", "workshops", "marketing", "multilanguage", "notifications", "settings"],
  premium: ["bookings", "payments", "clients", "voice", "agents", "reports", "restaurant", "hospitality", "wellness", "travel", "workshops", "inventory", "marketing", "ecommerce", "multilanguage", "notifications", "settings"],
};

interface AppItem {
  id: string;
  name: string;
  icon: React.ElementType;
  gradient: string;
  iconColor: string;
  minTier: StripeTier;
  badge?: string;
}

const apps: AppItem[] = [
  { id: "bookings", name: "Reservas", icon: Calendar, gradient: "from-blue-500 to-blue-600", iconColor: "text-white", minTier: "basic" },
  { id: "payments", name: "Pagos", icon: CreditCard, gradient: "from-emerald-500 to-emerald-600", iconColor: "text-white", minTier: "basic" },
  { id: "clients", name: "Clientes", icon: Users, gradient: "from-violet-500 to-violet-600", iconColor: "text-white", minTier: "basic" },
  { id: "reports", name: "Reportes", icon: BarChart3, gradient: "from-orange-500 to-orange-600", iconColor: "text-white", minTier: "professional" },
  { id: "restaurant", name: "Restaurante", icon: Utensils, gradient: "from-amber-500 to-amber-600", iconColor: "text-white", minTier: "basic" },
  { id: "hospitality", name: "Alojamiento", icon: Hotel, gradient: "from-cyan-500 to-cyan-600", iconColor: "text-white", minTier: "professional" },
  { id: "wellness", name: "Wellness", icon: Dumbbell, gradient: "from-rose-500 to-rose-600", iconColor: "text-white", minTier: "professional" },
  { id: "travel", name: "Travel", icon: Plane, gradient: "from-sky-500 to-sky-600", iconColor: "text-white", minTier: "premium" },
  { id: "workshops", name: "Cursos", icon: BookOpen, gradient: "from-indigo-500 to-indigo-600", iconColor: "text-white", minTier: "professional" },
  { id: "inventory", name: "Inventario", icon: Package, gradient: "from-yellow-500 to-yellow-600", iconColor: "text-white", minTier: "premium" },
  { id: "marketing", name: "Marketing", icon: MessageSquare, gradient: "from-pink-500 to-pink-600", iconColor: "text-white", minTier: "professional" },
  { id: "ecommerce", name: "Tienda", icon: ShoppingBag, gradient: "from-teal-500 to-teal-600", iconColor: "text-white", minTier: "premium", badge: "Pronto" },
  { id: "multilanguage", name: "Idiomas", icon: Globe, gradient: "from-green-500 to-green-600", iconColor: "text-white", minTier: "professional" },
  { id: "notifications", name: "Alertas", icon: Bell, gradient: "from-red-500 to-red-600", iconColor: "text-white", minTier: "basic" },
  { id: "voice", name: "Voz IA", icon: Mic, gradient: "from-violet-500 to-purple-600", iconColor: "text-white", minTier: "basic" },
  { id: "agents", name: "Agentes IA", icon: Bot, gradient: "from-cyan-500 to-blue-600", iconColor: "text-white", minTier: "basic" },
  { id: "integrations", name: "Integrar", icon: Link2, gradient: "from-indigo-400 to-blue-500", iconColor: "text-white", minTier: "basic" },
  { id: "settings", name: "Ajustes", icon: Settings, gradient: "from-slate-500 to-slate-600", iconColor: "text-white", minTier: "basic" },
];

type Tab = "home" | "apps" | "activity" | "plan" | "profile";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState<StripeTier | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [openApp, setOpenApp] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessSlug, setBusinessSlug] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  const unlockedApps = subscriptionTier ? PLAN_FEATURES[subscriptionTier] : PLAN_FEATURES.basic;

  const loadBusinessData = useCallback(async (userId: string) => {
    // Get business owned by this user
    const { data: biz } = await supabase
      .from("businesses")
      .select("id, slug, name")
      .eq("owner_id", userId)
      .limit(1)
      .maybeSingle();
    
    if (biz) {
      setBusinessId(biz.id);
      setBusinessSlug(biz.slug);
      setBusinessName(biz.name);
      
      // Load recent reservations & services
      const [resRes, svcRes] = await Promise.all([
        supabase.from("reservations").select("*, services(name)").eq("business_id", biz.id).order("created_at", { ascending: false }).limit(20),
        supabase.from("services").select("*").eq("business_id", biz.id).eq("is_active", true),
      ]);
      setReservations(resRes.data || []);
      setServices(svcRes.data || []);
    }
  }, []);

  const checkSubscription = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) return;
      if (data?.subscribed && data?.product_id) {
        setSubscribed(true);
        setSubscriptionTier(getTierByProductId(data.product_id));
      } else {
        setSubscribed(false);
        setSubscriptionTier(null);
      }
    } catch {}
  }, []);

  // Handle ?checkout=success param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      toast({ title: "¡Pago completado!", description: "Tu suscripción está activa." });
      window.history.replaceState({}, "", "/dashboard");
      checkSubscription();
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      setLoading(false);
      if (!sess) navigate("/auth");
      if (sess) {
        checkSubscription();
        loadBusinessData(sess.user.id);
      }
    });

    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      setLoading(false);
      if (!sess) navigate("/auth");
      if (sess) {
        checkSubscription();
        loadBusinessData(sess.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, checkSubscription]);

  useEffect(() => {
    if (!session) return;
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [session, checkSubscription]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleCheckout = async (priceId: string) => {
    setCheckingOut(priceId);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", { body: { priceId } });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {
      toast({ variant: "destructive", title: "Error", description: "No se pudo iniciar el pago." });
    } finally {
      setCheckingOut(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {
      toast({ variant: "destructive", title: "Error", description: "No se pudo abrir el portal de facturación." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-foreground to-foreground/80 flex items-center justify-center shadow-medium">
            <Cpu className="w-8 h-8 text-background" />
          </div>
          <div className="w-8 h-1 rounded-full bg-muted animate-pulse" />
        </motion.div>
      </div>
    );
  }

  const displayName = user?.user_metadata?.display_name || "Usuario";
  const greeting = new Date().getHours() < 12 ? "Buenos días" : new Date().getHours() < 18 ? "Buenas tardes" : "Buenas noches";

  const stats = [
    { label: "Reservas", value: "156", change: "+12%", icon: Calendar, color: "from-blue-500 to-blue-600" },
    { label: "Ingresos", value: "€4,250", change: "+8%", icon: DollarSign, color: "from-emerald-500 to-emerald-600" },
    { label: "Clientes", value: "48", change: "+5%", icon: Users, color: "from-violet-500 to-violet-600" },
    { label: "Duración", value: "45min", change: "+2%", icon: Clock, color: "from-orange-500 to-orange-600" },
  ];

  const recentActivity = [
    { title: "Nueva reserva confirmada", subtitle: "Sarah M. — Masaje", time: "2 min", icon: Calendar, color: "bg-blue-500" },
    { title: "Pago recibido €85", subtitle: "James K. — Corte", time: "1h", icon: CreditCard, color: "bg-emerald-500" },
    { title: "Nuevo cliente registrado", subtitle: "Emma R.", time: "3h", icon: Users, color: "bg-violet-500" },
    { title: "Servicio actualizado", subtitle: "Facial Premium", time: "5h", icon: Star, color: "bg-amber-500" },
  ];

  // ─── Tab content renderers ────────────────────────────────────

  const renderHome = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24">
      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground">{greeting}</p>
            <h1 className="font-display text-2xl font-bold text-foreground">{displayName} 👋</h1>
          </div>
          <button 
            onClick={() => setActiveTab("profile")}
            className="w-11 h-11 rounded-full bg-gradient-to-br from-foreground to-foreground/80 flex items-center justify-center text-background font-bold text-sm shadow-soft"
          >
            {displayName.charAt(0).toUpperCase()}
          </button>
        </div>

        {/* Plan badge */}
        {subscribed && subscriptionTier && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground text-background text-xs font-semibold">
              <Crown className="w-3 h-3" />
              Plan {STRIPE_TIERS[subscriptionTier].name}
            </span>
          </motion.div>
        )}
      </div>

      {/* Stats carousel */}
      <div className="px-5 mb-8">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="min-w-[140px] flex-shrink-0 rounded-2xl bg-card border border-border p-4 shadow-soft"
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-xl font-bold font-display text-foreground">{stat.value}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />{stat.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick apps row */}
      <div className="px-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-foreground">Acceso rápido</h2>
          <button onClick={() => setActiveTab("apps")} className="text-xs text-muted-foreground flex items-center gap-1">
            Ver todas <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {apps.slice(0, 4).map((app, i) => {
            const locked = !unlockedApps.includes(app.id);
            return (
              <motion.button
                key={app.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => !locked && setOpenApp(app.id)}
                className={`flex flex-col items-center gap-2 ${locked ? "opacity-40" : ""}`}
              >
                <div className={`w-14 h-14 rounded-[16px] bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-soft`}>
                  <app.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[11px] font-medium text-foreground leading-tight">{app.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Micro-site card */}
      {businessId && (
        <div className="px-5 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-4 shadow-soft"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Mi Micro-sitio</p>
                <p className="text-xs text-muted-foreground">{businessName || "Tu página pública de reservas"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={`/b/${businessSlug || businessId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Ver sitio
              </a>
              <button
                onClick={() => setOpenApp("integrations")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                <Link2 className="w-4 h-4" />
                Integrar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Recent reservations */}
      {reservations.length > 0 && (
        <div className="px-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-foreground">Reservas recientes</h2>
            <button onClick={() => setOpenApp("bookings")} className="text-xs text-muted-foreground flex items-center gap-1">
              Ver todas <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {reservations.slice(0, 3).map((res, i) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border shadow-xs"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  res.status === "confirmed" ? "bg-emerald-500" : res.status === "pending" ? "bg-amber-500" : "bg-muted"
                }`}>
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{res.customer_name || "Sin nombre"}</p>
                  <p className="text-xs text-muted-foreground truncate">{res.services?.name} · {res.reservation_date} {res.reservation_time?.slice(0, 5)}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  res.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                  res.status === "pending" ? "bg-amber-100 text-amber-700" :
                  res.status === "cancelled" ? "bg-red-100 text-red-700" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {res.status === "confirmed" ? "Confirmada" : res.status === "pending" ? "Pendiente" : res.status === "cancelled" ? "Cancelada" : res.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="px-5">
        <h2 className="font-display font-bold text-foreground mb-3">Actividad reciente</h2>
        <div className="space-y-2">
          {recentActivity.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border shadow-xs"
            >
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderApps = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24">
      <div className="px-5 pt-14 pb-4">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Mis Apps</h1>
        <p className="text-sm text-muted-foreground">
          {subscribed && subscriptionTier 
            ? `${unlockedApps.length} módulos activos · Plan ${STRIPE_TIERS[subscriptionTier].name}`
            : "Elige un plan para desbloquear más módulos"}
        </p>
      </div>

      <div className="px-5">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-5">
          {apps.map((app, i) => {
            const locked = !unlockedApps.includes(app.id);
            return (
              <motion.button
                key={app.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => !locked && setOpenApp(app.id)}
                className={`flex flex-col items-center gap-2 py-2 ${locked ? "opacity-30 grayscale" : ""}`}
              >
                <div className="relative">
                  <div className={`w-16 h-16 rounded-[18px] bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-soft active:scale-95 transition-transform`}>
                    <app.icon className="w-7 h-7 text-white" />
                  </div>
                  {app.badge && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-foreground text-background text-[8px] font-bold">
                      {app.badge}
                    </span>
                  )}
                  {locked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-foreground/80 flex items-center justify-center">
                        <Crown className="w-3 h-3 text-background" />
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-medium text-foreground leading-tight text-center">{app.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );

  const renderActivity = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24">
      <div className="px-5 pt-14 pb-4">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Actividad</h1>
        <p className="text-sm text-muted-foreground">Últimas acciones en tu negocio</p>
      </div>

      {/* Today */}
      <div className="px-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Hoy</p>
        <div className="space-y-2 mb-6">
          {recentActivity.slice(0, 2).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border shadow-xs"
            >
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              </div>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </motion.div>
          ))}
        </div>

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Ayer</p>
        <div className="space-y-2">
          {recentActivity.slice(2).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border shadow-xs"
            >
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              </div>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderPlan = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24">
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-1">Mi Plan</h1>
            <p className="text-sm text-muted-foreground">
              {subscribed ? "Gestiona tu suscripción" : "Elige un plan para empezar"}
            </p>
          </div>
          <button onClick={checkSubscription} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Current plan card */}
      {subscribed && subscriptionTier && (
        <div className="px-5 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-gradient-to-br from-foreground to-foreground/80 p-6 text-background shadow-strong"
          >
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="font-display font-bold text-lg">Plan {STRIPE_TIERS[subscriptionTier].name}</span>
            </div>
            <div className="mb-5">
              <span className="text-4xl font-bold font-display">€{STRIPE_TIERS[subscriptionTier].monthlyPrice}</span>
              <span className="text-background/60 text-sm">/mes</span>
            </div>
            <button
              onClick={handleManageSubscription}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background/20 text-background text-sm font-medium hover:bg-background/30 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Gestionar suscripción
            </button>
          </motion.div>
        </div>
      )}

      {/* Plan cards */}
      <div className="px-5 space-y-3">
        {(Object.entries(STRIPE_TIERS) as [StripeTier, typeof STRIPE_TIERS[StripeTier]][]).map(([tier, config], i) => {
          const isCurrent = subscriptionTier === tier;
          const featureCount = PLAN_FEATURES[tier].length;
          return (
            <motion.div
              key={tier}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl border-2 p-5 transition-all ${
                isCurrent 
                  ? "border-foreground bg-card shadow-medium" 
                  : "border-border bg-card shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full bg-foreground text-background text-[10px] font-bold">ACTUAL</span>
                  )}
                  <h3 className="font-display font-bold text-foreground">{config.name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-display text-foreground">€{config.monthlyPrice}</span>
                  <span className="text-xs text-muted-foreground">/mes</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-4">{featureCount} módulos incluidos</p>
              {!isCurrent && (
                <Button
                  onClick={() => handleCheckout(config.price_id)}
                  disabled={checkingOut === config.price_id}
                  className="w-full rounded-xl h-11"
                  variant={tier === "professional" ? "default" : "outline"}
                >
                  {checkingOut === config.price_id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : subscribed ? "Cambiar plan" : "Suscribirse"}
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  const renderProfile = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24">
      <div className="px-5 pt-14 pb-6">
        {/* Profile header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-foreground to-foreground/80 flex items-center justify-center text-background text-2xl font-bold mb-3 shadow-medium">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <h1 className="font-display text-xl font-bold text-foreground">{displayName}</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          {subscribed && subscriptionTier && (
            <span className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-foreground text-background text-xs font-semibold">
              <Crown className="w-3 h-3" /> {STRIPE_TIERS[subscriptionTier].name}
            </span>
          )}
        </div>

        {/* Settings list */}
        <div className="space-y-2">
          {[
            { label: "Perfil del negocio", desc: "Nombre, dirección, contacto", icon: Users },
            { label: "Servicios", desc: "Gestiona tus servicios y precios", icon: Star },
            { label: "Notificaciones", desc: "Email y preferencias push", icon: Bell },
            { label: "Integraciones", desc: "Calendario, WhatsApp, Stripe", icon: Zap },
            { label: "Mi plan", desc: "Gestiona tu suscripción", icon: Crown, action: () => setActiveTab("plan") },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border shadow-xs hover:shadow-soft transition-shadow text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="mt-6 w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </motion.div>
  );

  // ─── App detail sheet ─────────────────────────────────────────

  const renderAppSheet = () => {
    if (!openApp) return null;
    const app = apps.find(a => a.id === openApp);
    if (!app) return null;

    return (
      <AnimatePresence>
        <motion.div
          key="app-sheet"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-50 bg-background"
        >
          {/* App header */}
          <div className="sticky top-0 bg-background/90 backdrop-blur-xl border-b border-border z-10">
            <div className="flex items-center justify-between px-5 h-14">
              <button onClick={() => setOpenApp(null)} className="text-sm font-medium text-primary">
                ← Volver
              </button>
              <h2 className="font-display font-bold text-foreground">{app.name}</h2>
              <div className="w-14" />
            </div>
          </div>

          {/* App content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(100vh - 56px)" }}>
            {app.id === "integrations" ? (
              <IntegrationsPanel businessId={businessId || user?.id || null} onClose={() => setOpenApp(null)} />
            ) : app.id === "agents" ? (
              <AgentChat businessId={businessId} onBack={() => setOpenApp(null)} />
            ) : app.id === "voice" && businessId ? (
              <VoiceBookingManager businessId={businessId} />
            ) : app.id === "bookings" && businessId ? (
              <div className="space-y-6">
                {/* Link to micro-site booking */}
                <div className="p-4 rounded-2xl border border-border bg-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Calendario público</p>
                      <p className="text-xs text-muted-foreground">Así ven tus clientes el sistema de reservas</p>
                    </div>
                  </div>
                  <a
                    href={`/b/${businessSlug || businessId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ver micro-sitio con calendario
                  </a>
                </div>

                {/* Reservations list */}
                <div>
                  <h3 className="font-display font-bold text-foreground mb-3">Todas las reservas</h3>
                  {reservations.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Aún no tienes reservas</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {reservations.map((res) => (
                        <div key={res.id} className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            res.status === "confirmed" ? "bg-emerald-500" : res.status === "pending" ? "bg-amber-500" : res.status === "cancelled" ? "bg-red-500" : "bg-muted"
                          }`}>
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{res.customer_name || "Sin nombre"}</p>
                            <p className="text-xs text-muted-foreground truncate">{res.services?.name} · {res.reservation_date} {res.reservation_time?.slice(0, 5)}</p>
                            {res.customer_email && <p className="text-xs text-muted-foreground truncate">{res.customer_email}</p>}
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                            res.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                            res.status === "pending" ? "bg-amber-100 text-amber-700" :
                            res.status === "cancelled" ? "bg-red-100 text-red-700" :
                            res.status === "completed" ? "bg-blue-100 text-blue-700" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {res.status === "confirmed" ? "Confirmada" : res.status === "pending" ? "Pendiente" : res.status === "cancelled" ? "Cancelada" : res.status === "completed" ? "Completada" : res.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className={`w-20 h-20 rounded-[22px] bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-medium mb-6`}>
                  <app.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{app.name}</h3>
                <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
                  Módulo en desarrollo. Pronto podrás gestionar todo desde aquí.
                </p>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                  <Sparkles className="w-3 h-3" />
                  Próximamente disponible
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // ─── Tab bar items ────────────────────────────────────────────

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "home", label: "Inicio", icon: Home },
    { id: "apps", label: "Apps", icon: Cpu },
    { id: "activity", label: "Actividad", icon: Clock },
    { id: "plan", label: "Plan", icon: Crown },
    { id: "profile", label: "Perfil", icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === "home" && renderHome()}
          {activeTab === "apps" && renderApps()}
          {activeTab === "activity" && renderActivity()}
          {activeTab === "plan" && renderPlan()}
          {activeTab === "profile" && renderProfile()}
        </motion.div>
      </AnimatePresence>

      {/* iOS-style bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-lg mx-auto">
          <div className="bg-card/90 backdrop-blur-xl border-t border-border px-2 pb-[env(safe-area-inset-bottom,8px)] pt-2">
            <div className="flex items-center justify-around">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <tab.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                    <span className={`text-[10px] font-medium ${isActive ? "text-primary" : ""}`}>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* App detail sheet overlay */}
      {openApp && renderAppSheet()}
    </div>
  );
};

export default Dashboard;
