import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Cpu, LogOut, Users, CreditCard, BarChart3, Settings,
  Calendar, ShoppingBag, Utensils, Hotel, Plane, Dumbbell,
  BookOpen, Package, MessageSquare, Bell, Shield,
  ChevronRight, TrendingUp, CheckCircle, XCircle, Clock,
  LayoutGrid, Search, Menu, X, Star, Zap, Globe, Bot
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AgentManager from "@/components/dashboard/AgentManager";

// Department app definition
interface DepartmentApp {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  tiers: string[]; // which tiers unlock this
  status: "active" | "inactive" | "coming-soon";
}

const departmentApps: DepartmentApp[] = [
  { id: "bookings", name: "Reservas", description: "Gestión completa de reservas y calendario", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50", tiers: ["basic", "professional", "premium"], status: "active" },
  { id: "payments", name: "Pagos", description: "Cobros, facturas y seguimiento financiero", icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50", tiers: ["basic", "professional", "premium"], status: "active" },
  { id: "clients", name: "Clientes", description: "Base de datos y CRM de clientes", icon: Users, color: "text-violet-600", bg: "bg-violet-50", tiers: ["basic", "professional", "premium"], status: "active" },
  { id: "reports", name: "Reportes", description: "Métricas, analytics y reportes avanzados", icon: BarChart3, color: "text-orange-600", bg: "bg-orange-50", tiers: ["professional", "premium"], status: "active" },
  { id: "restaurant", name: "Restaurante", description: "Menús, QR, PDF y pedidos", icon: Utensils, color: "text-amber-600", bg: "bg-amber-50", tiers: ["basic", "professional", "premium"], status: "active" },
  { id: "hospitality", name: "Alojamiento", description: "Hotel, hostal y gestión de habitaciones", icon: Hotel, color: "text-cyan-600", bg: "bg-cyan-50", tiers: ["professional", "premium"], status: "active" },
  { id: "wellness", name: "Wellness & Spa", description: "Tratamientos, turnos y profesionales", icon: Dumbbell, color: "text-rose-600", bg: "bg-rose-50", tiers: ["professional", "premium"], status: "active" },
  { id: "travel", name: "Travel & Tours", description: "Itinerarios, paquetes y experiencias", icon: Plane, color: "text-sky-600", bg: "bg-sky-50", tiers: ["premium"], status: "active" },
  { id: "workshops", name: "Cursos & Talleres", description: "Inscripciones, sesiones y horarios", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50", tiers: ["professional", "premium"], status: "active" },
  { id: "inventory", name: "Inventario", description: "Stock, proveedores y alertas", icon: Package, color: "text-yellow-600", bg: "bg-yellow-50", tiers: ["premium"], status: "active" },
  { id: "marketing", name: "Marketing", description: "Campañas, email y WhatsApp masivo", icon: MessageSquare, color: "text-pink-600", bg: "bg-pink-50", tiers: ["professional", "premium"], status: "active" },
  { id: "ecommerce", name: "E-commerce", description: "Tienda online y productos", icon: ShoppingBag, color: "text-teal-600", bg: "bg-teal-50", tiers: ["premium"], status: "coming-soon" },
  { id: "notifications", name: "Notificaciones", description: "Alertas automáticas y comunicaciones", icon: Bell, color: "text-red-600", bg: "bg-red-50", tiers: ["basic", "professional", "premium"], status: "active" },
  { id: "multilanguage", name: "Multi-idioma", description: "Plataforma en 6 idiomas", icon: Globe, color: "text-green-600", bg: "bg-green-50", tiers: ["professional", "premium"], status: "active" },
  { id: "settings", name: "Configuración", description: "Perfil, integraciones y preferencias", icon: Settings, color: "text-slate-600", bg: "bg-slate-50", tiers: ["basic", "professional", "premium"], status: "active" },
];

// Mock users for admin management
const mockUsers = [
  { id: "1", email: "maria@restaurante.com", name: "María García", tier: "professional", active: true, paid: true, joined: "2024-01-15" },
  { id: "2", email: "hotel@example.com", name: "Hotel Milano", tier: "premium", active: true, paid: true, joined: "2024-01-10" },
  { id: "3", email: "spa@wellness.com", name: "Wellness Center", tier: "basic", active: false, paid: false, joined: "2024-02-01" },
  { id: "4", email: "travel@tours.com", name: "Tours & Viajes", tier: "professional", active: true, paid: true, joined: "2024-01-20" },
];

const tierLabels: Record<string, { label: string; color: string }> = {
  basic: { label: "Plan Básico", color: "bg-slate-100 text-slate-700" },
  professional: { label: "Plan Profesional", color: "bg-blue-100 text-blue-700" },
  premium: { label: "Premium / Enterprise", color: "bg-amber-100 text-amber-700" },
};

type AdminView = "apps" | "users" | "metrics" | "agents" | "settings";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<AdminView>("apps");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [users, setUsers] = useState(mockUsers);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      // Check admin role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");
      
      if (!roles || roles.length === 0) {
        toast({ variant: "destructive", title: "Acceso denegado", description: "No tienes permisos de administrador." });
        navigate("/dashboard");
        return;
      }
      setLoading(false);
    };
    checkAdmin();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleToggleUserAccess = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, active: !u.active } : u));
    toast({ title: "Estado actualizado", description: "El acceso del usuario ha sido actualizado." });
  };

  const handleChangeTier = (userId: string, tier: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, tier, paid: true, active: true } : u));
    toast({ title: "Plan actualizado", description: `Plan cambiado a ${tierLabels[tier]?.label}.` });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center animate-pulse">
            <Shield className="w-6 h-6 text-background" />
          </div>
          <p className="text-muted-foreground text-sm">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  const navItems: { icon: React.ElementType; label: string; view: AdminView }[] = [
    { icon: LayoutGrid, label: "Departamentos", view: "apps" },
    { icon: Users, label: "Usuarios", view: "users" },
    { icon: Bot, label: "Agentes IA", view: "agents" },
    { icon: BarChart3, label: "Métricas", view: "metrics" },
    { icon: Settings, label: "Configuración", view: "settings" },
  ];

  const filteredApps = departmentApps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted/20 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-card border-r border-border z-50 flex flex-col transform transition-transform duration-300 lg:translate-x-0 lg:static lg:flex ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
              <Cpu className="w-5 h-5 text-background" />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-foreground">FlowBooking</span>
              <div className="flex items-center gap-1 mt-0.5">
                <Shield className="w-3 h-3 text-amber-500" />
                <span className="text-xs text-amber-600 font-semibold">Admin Panel</span>
              </div>
            </div>
            <button className="lg:hidden ml-auto" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => { setActiveView(item.view); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeView === item.view
                  ? "bg-foreground text-background shadow-soft"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {activeView === item.view && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Stats summary */}
        <div className="p-4 border-t border-border">
          <div className="bg-muted rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resumen</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Usuarios", value: users.length.toString() },
                { label: "Activos", value: users.filter(u => u.active).toString() },
                { label: "Pagados", value: users.filter(u => u.paid).length.toString() },
                { label: "Apps", value: departmentApps.length.toString() },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-lg font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sign out */}
        <div className="p-4 border-t border-border">
          <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 bg-card/90 backdrop-blur-xl border-b border-border z-30 px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 flex items-center gap-3">
            <h1 className="font-display font-bold text-lg text-foreground">
              {navItems.find(n => n.view === activeView)?.label}
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-muted rounded-xl px-4 py-2 w-56">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm outline-none w-full"
            />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <AnimatePresence mode="wait">
            {/* APPS VIEW — Tablet-style grid */}
            {activeView === "apps" && (
              <motion.div
                key="apps"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-1">Centro de Departamentos</h2>
                  <p className="text-muted-foreground text-sm">Gestiona los módulos activos de la plataforma</p>
                </div>

                {/* Tier sections */}
                {["basic", "professional", "premium"].map((tier) => {
                  const tierApps = filteredApps.filter(app => app.tiers.includes(tier) && (!app.tiers.includes(tier === "basic" ? "" : tier === "professional" ? "basic" : "professional")));
                  const allApps = filteredApps.filter(app => {
                    if (tier === "basic") return app.tiers[0] === "basic";
                    if (tier === "professional") return app.tiers[0] === "professional";
                    return app.tiers[0] === "premium";
                  });
                  if (allApps.length === 0) return null;
                  return (
                    <div key={tier} className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tierLabels[tier]?.color}`}>
                          {tierLabels[tier]?.label}
                        </span>
                        <span className="text-xs text-muted-foreground">{allApps.length} módulos</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                        {allApps.map((app, i) => (
                          <motion.div
                            key={app.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.04 }}
                            className={`relative group cursor-pointer rounded-2xl p-4 bg-card border border-border shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all duration-200 ${
                              app.status === "coming-soon" ? "opacity-60" : ""
                            }`}
                          >
                            {app.status === "coming-soon" && (
                              <div className="absolute top-2 right-2">
                                <span className="text-[9px] font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">Pronto</span>
                              </div>
                            )}
                            <div className={`w-12 h-12 rounded-xl ${app.bg} flex items-center justify-center mb-3`}>
                              <app.icon className={`w-6 h-6 ${app.color}`} />
                            </div>
                            <h3 className="font-semibold text-sm text-foreground leading-tight mb-1">{app.name}</h3>
                            <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{app.description}</p>
                            <div className={`mt-2 w-2 h-2 rounded-full ${app.status === "active" ? "bg-emerald-400" : "bg-slate-300"}`} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* AGENTS VIEW */}
            {activeView === "agents" && (
              <motion.div
                key="agents"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                <AgentManager />
              </motion.div>
            )}


            {activeView === "users" && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-1">Gestión de Usuarios</h2>
                    <p className="text-muted-foreground text-sm">Administra planes, accesos y pagos manualmente</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {users.filter(u =>
                    !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    u.email.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((user) => (
                    <motion.div
                      key={user.id}
                      className="bg-card rounded-2xl border border-border shadow-soft p-4 sm:p-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Avatar + Info */}
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center text-background font-bold text-lg flex-shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Desde {user.joined}</p>
                          </div>
                        </div>

                        {/* Status badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${tierLabels[user.tier]?.color}`}>
                            {tierLabels[user.tier]?.label}
                          </span>
                          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${user.paid ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                            {user.paid ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {user.paid ? "Pagado" : "Sin pago"}
                          </span>
                          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${user.active ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                            {user.active ? <Zap className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {user.active ? "Activo" : "Inactivo"}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <select
                            value={user.tier}
                            onChange={(e) => handleChangeTier(user.id, e.target.value)}
                            className="text-xs bg-muted border border-border rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-muted/80 transition-colors"
                          >
                            <option value="basic">Básico</option>
                            <option value="professional">Profesional</option>
                            <option value="premium">Premium</option>
                          </select>
                          <Button
                            size="sm"
                            variant={user.active ? "destructive" : "default"}
                            className="rounded-xl text-xs"
                            onClick={() => handleToggleUserAccess(user.id)}
                          >
                            {user.active ? "Desactivar" : "Activar"}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* METRICS VIEW */}
            {activeView === "metrics" && (
              <motion.div
                key="metrics"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-1">Métricas Globales</h2>
                  <p className="text-muted-foreground text-sm">Visión general de la plataforma</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Usuarios Totales", value: users.length.toString(), change: "+2 este mes", icon: Users, color: "bg-blue-500" },
                    { label: "Usuarios Activos", value: users.filter(u => u.active).length.toString(), change: "de " + users.length + " totales", icon: TrendingUp, color: "bg-emerald-500" },
                    { label: "Revenue MRR", value: "€696", change: "+€149 este mes", icon: CreditCard, color: "bg-violet-500" },
                    { label: "Módulos Activos", value: departmentApps.filter(a => a.status === "active").length.toString(), change: "de " + departmentApps.length + " totales", icon: Star, color: "bg-orange-500" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-card rounded-2xl border border-border shadow-soft p-5"
                    >
                      <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-2xl font-bold font-display text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                      <div className="text-xs text-muted-foreground/70 mt-0.5">{stat.change}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Tier distribution */}
                <div className="bg-card rounded-2xl border border-border shadow-soft p-6">
                  <h3 className="font-display font-bold text-lg text-foreground mb-4">Distribución por Plan</h3>
                  <div className="space-y-3">
                    {["basic", "professional", "premium"].map(tier => {
                      const count = users.filter(u => u.tier === tier).length;
                      const pct = Math.round((count / users.length) * 100);
                      return (
                        <div key={tier}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-foreground font-medium">{tierLabels[tier]?.label}</span>
                            <span className="text-muted-foreground">{count} usuarios ({pct}%)</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className={`h-full rounded-full ${tier === "premium" ? "bg-amber-500" : tier === "professional" ? "bg-blue-500" : "bg-slate-400"}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* SETTINGS VIEW */}
            {activeView === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-1">Configuración del Sistema</h2>
                  <p className="text-muted-foreground text-sm">Ajustes globales de la plataforma</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { title: "Integraciones", desc: "Stripe, Google Calendar, WhatsApp API", icon: Zap },
                    { title: "Seguridad", desc: "RLS, roles, autenticación y GDPR", icon: Shield },
                    { title: "Idiomas", desc: "Gestión de traducciones y localización", icon: Globe },
                    { title: "Notificaciones", desc: "Email, push y alertas del sistema", icon: Bell },
                  ].map((item) => (
                    <div key={item.title} className="bg-card rounded-2xl border border-border shadow-soft p-6 flex items-start gap-4 cursor-pointer hover:shadow-medium transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-background" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto mt-0.5" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
