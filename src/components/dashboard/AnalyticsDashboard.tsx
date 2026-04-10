import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart,
} from "recharts";
import { Calendar, DollarSign, Users, TrendingUp, Clock } from "lucide-react";

interface AnalyticsDashboardProps {
  businessId: string;
}

const COLORS = ["hsl(142,71%,45%)", "hsl(38,92%,50%)", "hsl(199,89%,48%)", "hsl(340,82%,52%)", "hsl(262,83%,58%)"];

const AnalyticsDashboard = ({ businessId }: AnalyticsDashboardProps) => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [businessId]);

  const loadData = async () => {
    setLoading(true);
    const [resRes, svcRes] = await Promise.all([
      supabase.from("reservations").select("*, services(name, price_cents)").eq("business_id", businessId).order("created_at", { ascending: false }),
      supabase.from("services").select("*").eq("business_id", businessId),
    ]);
    setReservations(resRes.data || []);
    setServices(svcRes.data || []);
    setLoading(false);
  };

  // --- Computed metrics ---
  const total = reservations.length;
  const confirmed = reservations.filter(r => r.status === "confirmed" || r.status === "completed").length;
  const cancelled = reservations.filter(r => r.status === "cancelled").length;
  const noShow = reservations.filter(r => r.status === "no_show").length;
  const revenue = reservations
    .filter(r => r.status === "confirmed" || r.status === "completed")
    .reduce((sum, r) => sum + ((r.services?.price_cents || r.amount_paid_cents || 0) / 100), 0);

  // Reservations by status (pie)
  const statusData = [
    { name: "Confirmadas", value: confirmed },
    { name: "Pendientes", value: reservations.filter(r => r.status === "pending").length },
    { name: "Canceladas", value: cancelled },
    { name: "No show", value: noShow },
    { name: "Completadas", value: reservations.filter(r => r.status === "completed").length },
  ].filter(d => d.value > 0);

  // Reservations per service (bar)
  const serviceMap: Record<string, number> = {};
  reservations.forEach(r => {
    const name = r.services?.name || "Sin servicio";
    serviceMap[name] = (serviceMap[name] || 0) + 1;
  });
  const serviceBarData = Object.entries(serviceMap)
    .map(([name, count]) => ({ name: name.length > 15 ? name.slice(0, 15) + "…" : name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Reservations over time (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const dailyMap: Record<string, number> = {};
  reservations.forEach(r => {
    const d = r.reservation_date;
    if (d && new Date(d) >= thirtyDaysAgo) {
      dailyMap[d] = (dailyMap[d] || 0) + 1;
    }
  });
  const dailyData = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date: date.slice(5), count }));

  // Revenue by service (horizontal bar)
  const revenueByService: Record<string, number> = {};
  reservations
    .filter(r => r.status === "confirmed" || r.status === "completed")
    .forEach(r => {
      const name = r.services?.name || "Sin servicio";
      const price = (r.services?.price_cents || r.amount_paid_cents || 0) / 100;
      revenueByService[name] = (revenueByService[name] || 0) + price;
    });
  const revenueBarData = Object.entries(revenueByService)
    .map(([name, total]) => ({ name: name.length > 15 ? name.slice(0, 15) + "…" : name, total: Math.round(total) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  const stats = [
    { label: "Total reservas", value: total, icon: Calendar, color: "from-blue-500 to-blue-600" },
    { label: "Ingresos", value: `€${revenue.toFixed(0)}`, icon: DollarSign, color: "from-emerald-500 to-emerald-600" },
    { label: "Tasa confirmación", value: total ? `${Math.round((confirmed / total) * 100)}%` : "—", icon: TrendingUp, color: "from-violet-500 to-violet-600" },
    { label: "Servicios activos", value: services.filter(s => s.is_active).length, icon: Clock, color: "from-orange-500 to-orange-600" },
  ];

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3, 4].map(i => <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl bg-card border border-border p-4 shadow-xs"
          >
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-xl font-bold font-display text-foreground">{stat.value}</div>
            <span className="text-[10px] text-muted-foreground">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Trend Line */}
      {dailyData.length > 1 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl bg-card border border-border p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Reservas últimos 30 días</h4>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(199,89%,48%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(199,89%,48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="hsl(199,89%,48%)" fill="url(#colorCount)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Status Pie + Service Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {statusData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl bg-card border border-border p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">Por estado</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} strokeWidth={2}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 justify-center">
              {statusData.map((d, i) => (
                <span key={d.name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  {d.name} ({d.value})
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {serviceBarData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl bg-card border border-border p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">Por servicio</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={serviceBarData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={90} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(199,89%,48%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      {/* Revenue by service */}
      {revenueBarData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl bg-card border border-border p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Ingresos por servicio (€)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: number) => [`€${v}`, "Ingresos"]} />
              <Bar dataKey="total" fill="hsl(142,71%,45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {total === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">Aún no hay reservas para analizar</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
