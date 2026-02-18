import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Cpu, ArrowLeft, Calendar, CreditCard, BarChart3, 
  Settings, Users, Clock, DollarSign, TrendingUp,
  Bell, ChevronRight, Play, Sparkles
} from "lucide-react";

const demoStats = [
  { label: "Reservas Totales", value: "156", change: "+12%", icon: Calendar, color: "bg-blue-500" },
  { label: "Ingresos (mes)", value: "€4,250", change: "+8%", icon: DollarSign, color: "bg-emerald-500" },
  { label: "Clientes Activos", value: "48", change: "+5%", icon: Users, color: "bg-violet-500" },
  { label: "Sesión media", value: "45min", change: "+2%", icon: Clock, color: "bg-orange-500" },
];

const menuItems = [
  { icon: BarChart3, label: "Resumen", active: true },
  { icon: Calendar, label: "Reservas" },
  { icon: CreditCard, label: "Pagos" },
  { icon: Users, label: "Clientes" },
  { icon: Settings, label: "Ajustes" },
];

const activity = [
  { title: "Nueva reserva confirmada", time: "hace 2 min", type: "booking" },
  { title: "Pago recibido €85", time: "hace 1 hora", type: "payment" },
  { title: "Nuevo cliente registrado", time: "hace 3 horas", type: "client" },
  { title: "Servicio actualizado", time: "hace 5 horas", type: "service" },
];

const Demo = () => {
  const [activeMenu, setActiveMenu] = useState("Resumen");

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Demo Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-foreground text-background py-2 px-4 text-center text-sm flex items-center justify-center gap-3">
        <Sparkles className="w-4 h-4" />
        <span className="font-medium">Modo Demo — Vista previa del panel de control</span>
        <Link to="/auth">
          <Button size="sm" variant="outline" className="h-7 px-3 text-xs border-background/30 text-background hover:bg-background/10 ml-2">
            Activar mi cuenta →
          </Button>
        </Link>
      </div>

      {/* Sidebar */}
      <aside className="fixed top-10 left-0 h-full w-64 bg-card border-r border-border z-40 hidden lg:block">
        <div className="p-6 pt-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
              <Cpu className="w-5 h-5 text-background" />
            </div>
            <span className="font-display font-bold text-lg">
              Flow<span className="text-muted-foreground">Booking</span>
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveMenu(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeMenu === item.label
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Demo User */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-background font-semibold text-sm">
              D
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Demo User</p>
              <p className="text-xs text-muted-foreground">demo@flowbooking.ai</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 pt-10">
        {/* Header */}
        <header className="sticky top-10 bg-card/80 backdrop-blur-xl border-b border-border z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors lg:hidden">
                <ArrowLeft className="w-4 h-4" />
                Inicio
              </Link>
              <h1 className="font-display font-bold text-lg sm:text-xl text-foreground">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
              </Button>
              <Link to="/auth">
                <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90 hidden sm:flex">
                  <Play className="w-4 h-4 mr-2" />
                  Comenzar gratis
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
              Bienvenido al Demo 👋
            </h2>
            <p className="text-muted-foreground">
              Esto es una vista previa de tu panel de control inteligente con Booking Intelligence.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {demoStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-soft"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <span className="flex items-center gap-1 text-xs sm:text-sm font-medium text-emerald-600">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-display text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions & Activity */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-2xl p-6 border border-border shadow-soft"
            >
              <h3 className="font-display font-bold text-lg text-foreground mb-4">
                Acciones rápidas
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Nueva Reserva", icon: Calendar },
                  { label: "Añadir Servicio", icon: Settings },
                  { label: "Enviar Factura", icon: CreditCard },
                  { label: "Ver Informes", icon: BarChart3 },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="flex items-center gap-3 p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                      <action.icon className="w-5 h-5 text-background" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{action.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-2xl p-6 border border-border shadow-soft"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg text-foreground">
                  Actividad reciente
                </h3>
                <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                  Ver todo <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {activity.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      {item.type === "booking" && <Calendar className="w-5 h-5 text-blue-500" />}
                      {item.type === "payment" && <CreditCard className="w-5 h-5 text-emerald-500" />}
                      {item.type === "client" && <Users className="w-5 h-5 text-violet-500" />}
                      {item.type === "service" && <Settings className="w-5 h-5 text-orange-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-foreground rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div>
              <h3 className="font-display font-bold text-xl text-background mb-1">
                ¿Listo para empezar?
              </h3>
              <p className="text-background/70 text-sm">
                Activa tu cuenta y automatiza tu negocio hoy mismo.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link to="/#pricing">
                <Button variant="outline" className="border-background/30 text-background hover:bg-background/10">
                  Ver precios
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-background text-foreground hover:bg-background/90">
                  Crear cuenta
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Demo;
