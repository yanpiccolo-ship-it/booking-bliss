import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Cpu, LogOut, Calendar, CreditCard, BarChart3, Settings,
  Bell, Search, Menu, X, ChevronRight, TrendingUp, Users,
  Clock, DollarSign, Crown, ExternalLink, RefreshCw, Loader2,
  Plus, FileText, MessageSquare, Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import { STRIPE_TIERS, getTierByProductId, type StripeTier } from "@/lib/stripe-config";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<StripeTier | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<string>("overview");

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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) navigate("/auth");
      if (session) checkSubscription();
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) navigate("/auth");
      if (session) checkSubscription();
    });

    return () => subscription.unsubscribe();
  }, [navigate, checkSubscription]);

  // Auto-refresh subscription every 60s
  useEffect(() => {
    if (!session) return;
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [session, checkSubscription]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to sign out." });
    } else {
      navigate("/");
    }
  };

  const handleCheckout = async (priceId: string) => {
    setCheckingOut(priceId);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Could not start checkout." });
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
      toast({ variant: "destructive", title: "Error", description: "Could not open billing portal." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center animate-pulse">
            <Cpu className="w-6 h-6 text-background" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Bookings", value: "156", change: "+12%", icon: Calendar, color: "bg-blue-500" },
    { label: "Revenue", value: "€4,250", change: "+8%", icon: DollarSign, color: "bg-emerald-500" },
    { label: "Active Clients", value: "48", change: "+5%", icon: Users, color: "bg-violet-500" },
    { label: "Avg. Session", value: "45min", change: "+2%", icon: Clock, color: "bg-orange-500" },
  ];

  const menuItems = [
    { icon: BarChart3, label: "Overview", id: "overview" },
    { icon: Calendar, label: "Bookings", id: "bookings" },
    { icon: CreditCard, label: "Payments", id: "payments" },
    { icon: Users, label: "Clients", id: "clients" },
    { icon: Crown, label: "Subscription", id: "subscription" },
    { icon: Settings, label: "Settings", id: "settings" },
  ];

  const renderPanel = () => {
    switch (activePanel) {
      case "subscription":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-1">Subscription</h2>
                <p className="text-muted-foreground">
                  {subscribed 
                    ? `You're on the ${subscriptionTier ? STRIPE_TIERS[subscriptionTier].name : ""} plan` 
                    : "Choose a plan to unlock all features"}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={checkSubscription} className="gap-2">
                <RefreshCw className="w-4 h-4" /> Refresh
              </Button>
            </div>

            {subscribed && (
              <div className="bg-card rounded-2xl border border-border shadow-soft p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="w-6 h-6 text-amber-500" />
                  <span className="font-display font-bold text-lg text-foreground">
                    {subscriptionTier ? STRIPE_TIERS[subscriptionTier].name : "Active"} Plan
                  </span>
                </div>
                <Button onClick={handleManageSubscription} variant="outline" className="gap-2">
                  <ExternalLink className="w-4 h-4" /> Manage Subscription
                </Button>
              </div>
            )}

            <div className="grid sm:grid-cols-3 gap-4">
              {(Object.entries(STRIPE_TIERS) as [StripeTier, typeof STRIPE_TIERS[StripeTier]][]).map(([tier, config]) => (
                <div
                  key={tier}
                  className={`bg-card rounded-2xl border-2 p-6 transition-all ${
                    subscriptionTier === tier 
                      ? "border-foreground shadow-medium" 
                      : "border-border shadow-soft hover:shadow-medium"
                  }`}
                >
                  {subscriptionTier === tier && (
                    <span className="inline-block bg-foreground text-background text-xs font-bold px-3 py-1 rounded-full mb-3">
                      Current Plan
                    </span>
                  )}
                  <h3 className="font-display font-bold text-lg text-foreground">{config.name}</h3>
                  <div className="mt-2 mb-4">
                    <span className="text-3xl font-bold font-display text-foreground">€{config.monthlyPrice}</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                  {subscriptionTier !== tier && (
                    <Button
                      onClick={() => handleCheckout(config.price_id)}
                      disabled={checkingOut === config.price_id}
                      className="w-full rounded-xl"
                    >
                      {checkingOut === config.price_id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : subscribed ? "Switch Plan" : "Subscribe"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        );

      case "bookings":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-foreground">Bookings</h2>
              <Button className="gap-2 rounded-xl"><Plus className="w-4 h-4" /> New Booking</Button>
            </div>
            <div className="space-y-3">
              {[
                { client: "Sarah M.", service: "Deep Tissue Massage", date: "Today, 2:00 PM", status: "confirmed" },
                { client: "James K.", service: "Haircut & Style", date: "Today, 4:30 PM", status: "confirmed" },
                { client: "Emma R.", service: "Facial Treatment", date: "Tomorrow, 10:00 AM", status: "pending" },
                { client: "Lucas P.", service: "Personal Training", date: "Tomorrow, 3:00 PM", status: "confirmed" },
                { client: "Anna W.", service: "Yoga Class", date: "Feb 22, 9:00 AM", status: "pending" },
              ].map((booking, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border shadow-soft p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{booking.client} — {booking.service}</p>
                    <p className="text-xs text-muted-foreground">{booking.date}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    booking.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case "payments":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-foreground">Payments</h2>
              <Button variant="outline" className="gap-2 rounded-xl"><FileText className="w-4 h-4" /> Export</Button>
            </div>
            <div className="space-y-3">
              {[
                { desc: "Deep Tissue Massage — Sarah M.", amount: "€85", date: "Today", status: "paid" },
                { desc: "Haircut & Style — James K.", amount: "€45", date: "Yesterday", status: "paid" },
                { desc: "Personal Training (5 sessions) — Lucas P.", amount: "€250", date: "Feb 18", status: "paid" },
                { desc: "Facial Treatment — Emma R.", amount: "€120", date: "Feb 17", status: "pending" },
              ].map((payment, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border shadow-soft p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{payment.desc}</p>
                    <p className="text-xs text-muted-foreground">{payment.date}</p>
                  </div>
                  <span className="font-bold text-foreground">{payment.amount}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    payment.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case "clients":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-foreground">Clients</h2>
              <Button className="gap-2 rounded-xl"><Plus className="w-4 h-4" /> Add Client</Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Sarah Mitchell", email: "sarah@email.com", bookings: 12, spent: "€1,020" },
                { name: "James Kowalski", email: "james@email.com", bookings: 8, spent: "€360" },
                { name: "Emma Rodriguez", email: "emma@email.com", bookings: 5, spent: "€600" },
                { name: "Lucas Park", email: "lucas@email.com", bookings: 15, spent: "€1,500" },
                { name: "Anna Weber", email: "anna@email.com", bookings: 3, spent: "€180" },
                { name: "David Chen", email: "david@email.com", bookings: 7, spent: "€490" },
              ].map((client, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border shadow-soft p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-background font-bold">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.email}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{client.bookings} bookings</span>
                    <span className="font-semibold text-foreground">{client.spent}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case "settings":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Settings</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Business Profile", desc: "Name, address, contact info", icon: Users },
                { title: "Services", desc: "Manage your services and pricing", icon: Star },
                { title: "Notifications", desc: "Email and push preferences", icon: Bell },
                { title: "Integrations", desc: "Calendar, WhatsApp, Stripe", icon: Settings },
              ].map((item) => (
                <div key={item.title} className="bg-card rounded-2xl border border-border shadow-soft p-5 flex items-start gap-4 cursor-pointer hover:shadow-medium transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-background" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </motion.div>
        );

      default: // overview
        return (
          <>
            {/* Welcome */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                Welcome back{user?.user_metadata?.display_name ? `, ${user.user_metadata.display_name}` : ""}! 👋
              </h2>
              <p className="text-muted-foreground">Here's what's happening with your business today.</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {stats.map((stat, index) => (
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
                  <div className="text-2xl sm:text-3xl font-bold font-display text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions & Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-soft">
                <h3 className="font-display font-bold text-lg text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "New Booking", icon: Calendar, panel: "bookings" },
                    { label: "Add Service", icon: Settings, panel: "settings" },
                    { label: "Send Invoice", icon: CreditCard, panel: "payments" },
                    { label: "View Reports", icon: BarChart3, panel: "overview" },
                  ].map((action) => (
                    <button
                      key={action.label}
                      onClick={() => setActivePanel(action.panel)}
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

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-lg text-foreground">Recent Activity</h3>
                  <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                    View all <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "New booking confirmed", time: "2 min ago", type: "booking" },
                    { title: "Payment received €85", time: "1 hour ago", type: "payment" },
                    { title: "New client registered", time: "3 hours ago", type: "client" },
                    { title: "Service updated", time: "5 hours ago", type: "service" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {activity.type === "booking" && <Calendar className="w-5 h-5 text-blue-500" />}
                        {activity.type === "payment" && <CreditCard className="w-5 h-5 text-emerald-500" />}
                        {activity.type === "client" && <Users className="w-5 h-5 text-violet-500" />}
                        {activity.type === "service" && <Settings className="w-5 h-5 text-orange-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
              <Cpu className="w-5 h-5 text-background" />
            </div>
            <span className="font-display font-bold text-lg">
              Flow<span className="text-muted-foreground">Booking</span>
            </span>
            <button className="lg:hidden ml-auto" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActivePanel(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activePanel === item.id
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

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-background font-semibold">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.user_metadata?.display_name || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64">
        <header className="sticky top-0 bg-card/80 backdrop-blur-xl border-b border-border z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="font-display font-bold text-lg sm:text-xl text-foreground capitalize">{activePanel}</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-muted rounded-xl px-4 py-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Search..." className="bg-transparent text-sm outline-none w-32 lg:w-48" />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {renderPanel()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
