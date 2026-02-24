import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Cpu, ArrowLeft, Calendar, CreditCard, BarChart3,
  Settings, Users, Clock, DollarSign, TrendingUp,
  Bell, ChevronRight, Play, Sparkles, X, Check,
  MapPin, Phone, Mail, Star, FileText, Send, Plus,
  ChevronLeft, Package, Zap
} from "lucide-react";

// ─── Static Data ────────────────────────────────────────────────────────────

const demoStats = [
  { label: "Total Bookings", value: "156", change: "+12%", icon: Calendar, color: "bg-blue-500" },
  { label: "Revenue (month)", value: "€4,250", change: "+8%", icon: DollarSign, color: "bg-emerald-500" },
  { label: "Active Clients", value: "48", change: "+5%", icon: Users, color: "bg-violet-500" },
  { label: "Avg. Session", value: "45min", change: "+2%", icon: Clock, color: "bg-orange-500" },
];

const menuItems = [
  { icon: BarChart3, label: "Overview" },
  { icon: Calendar, label: "Bookings" },
  { icon: CreditCard, label: "Payments" },
  { icon: Users, label: "Clients" },
  { icon: Settings, label: "Settings" },
];

const activity = [
  { title: "New booking confirmed", time: "2 min ago", type: "booking" },
  { title: "Payment received €85", time: "1 hour ago", type: "payment" },
  { title: "New client registered", time: "3 hours ago", type: "client" },
  { title: "Service updated", time: "5 hours ago", type: "service" },
];

const bookingRows = [
  { id: "#1042", client: "Sophie Martin", service: "Deep Tissue Massage", date: "Today, 14:00", status: "Confirmed", amount: "€85" },
  { id: "#1041", client: "Marco Rossi", service: "Yoga Class", date: "Today, 11:00", status: "Completed", amount: "€40" },
  { id: "#1040", client: "Emma Wilson", service: "Spa Package", date: "Yesterday, 16:00", status: "Completed", amount: "€180" },
  { id: "#1039", client: "Luca Bianchi", service: "Restaurant – Table for 4", date: "Yesterday, 20:00", status: "Confirmed", amount: "€0" },
  { id: "#1038", client: "Anna Müller", service: "Cooking Workshop", date: "Feb 17, 10:00", status: "Pending", amount: "€65" },
];

const paymentRows = [
  { id: "PAY-891", client: "Sophie Martin", method: "Stripe", date: "Today", amount: "€85", status: "Paid" },
  { id: "PAY-890", client: "Marco Rossi", method: "Revolut", date: "Today", amount: "€40", status: "Paid" },
  { id: "PAY-889", client: "Emma Wilson", method: "Stripe", date: "Yesterday", amount: "€180", status: "Paid" },
  { id: "PAY-888", client: "Anna Müller", method: "Bank Transfer", date: "Pending", amount: "€65", status: "Pending" },
];

const clientRows = [
  { name: "Sophie Martin", email: "sophie@example.com", bookings: 8, total: "€520", since: "Jan 2026" },
  { name: "Marco Rossi", email: "marco@example.com", bookings: 5, total: "€310", since: "Dec 2025" },
  { name: "Emma Wilson", email: "emma@example.com", bookings: 12, total: "€1,200", since: "Oct 2025" },
  { name: "Luca Bianchi", email: "luca@example.com", bookings: 3, total: "€90", since: "Feb 2026" },
];

// ─── Modal Content Components ────────────────────────────────────────────────

const NewBookingModal = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState({ service: "", date: "", time: "" });

  const services = ["Deep Tissue Massage", "Spa Package", "Yoga Class", "Restaurant Table", "Cooking Workshop"];
  const times = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

  return (
    <ModalShell title="New Booking" onClose={onClose}>
      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step >= s ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
            }`}>{step > s ? <Check className="w-3.5 h-3.5" /> : s}</div>
            {s < 3 && <div className={`h-0.5 w-8 transition-colors ${step > s ? "bg-foreground" : "bg-muted"}`} />}
          </div>
        ))}
        <span className="ml-2 text-xs text-muted-foreground">{["Select Service", "Choose Date & Time", "Confirm"][step - 1]}</span>
      </div>

      {step === 1 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground mb-3">Select a service for this booking:</p>
          {services.map((s) => (
            <button key={s} onClick={() => setSelected({ ...selected, service: s })}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                selected.service === s ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/30"
              }`}>
              {s}
            </button>
          ))}
          <Button className="w-full mt-4" disabled={!selected.service} onClick={() => setStep(2)}>
            Continue <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Client name</label>
            <input className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:border-foreground" placeholder="e.g. Sophie Martin" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Date</label>
            <input type="date" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:border-foreground"
              onChange={(e) => setSelected({ ...selected, date: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Time slot</label>
            <div className="grid grid-cols-3 gap-2">
              {times.map((t) => (
                <button key={t} onClick={() => setSelected({ ...selected, time: t })}
                  className={`py-2 rounded-xl text-sm font-medium border transition-all ${
                    selected.time === t ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground/30"
                  }`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}><ChevronLeft className="w-4 h-4 mr-1" />Back</Button>
            <Button className="flex-1" disabled={!selected.time} onClick={() => setStep(3)}>Continue <ChevronRight className="w-4 h-4 ml-1" /></Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="bg-muted rounded-2xl p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="font-medium">{selected.service}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{selected.date || "Today"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">{selected.time}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Confirmation</span><span className="font-medium text-emerald-600">Auto-sent via WhatsApp & Email</span></div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2">
            <Zap className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-emerald-700">AI Agent will send an automatic confirmation and reminder to the client 24h before.</p>
          </div>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setStep(2)}><ChevronLeft className="w-4 h-4 mr-1" />Back</Button>
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onClose}>
              <Check className="w-4 h-4 mr-2" />Confirm Booking
            </Button>
          </div>
        </div>
      )}
    </ModalShell>
  );
};

const AddServiceModal = ({ onClose }: { onClose: () => void }) => {
  const categories = ["Wellness & Spa", "Gastronomy", "Fitness", "Travel & Tours", "Workshops"];
  const [cat, setCat] = useState("");

  return (
    <ModalShell title="Add New Service" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-2">Service name</label>
          <input className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:border-foreground" placeholder="e.g. Aromatherapy Massage" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  cat === c ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground/40"
                }`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-2">Duration</label>
            <select className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none">
              <option>30 min</option><option>45 min</option><option>60 min</option><option>90 min</option><option>120 min</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Price (€)</label>
            <input type="number" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:border-foreground" placeholder="85" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">Description</label>
          <textarea className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:border-foreground h-20 resize-none" placeholder="Describe your service..." />
        </div>
        <div className="bg-muted rounded-xl p-3 flex items-start gap-2">
          <Cpu className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">AI will automatically generate multilingual descriptions and suggest optimal pricing based on your market.</p>
        </div>
        <Button className="w-full" onClick={onClose}>
          <Plus className="w-4 h-4 mr-2" />Add Service
        </Button>
      </div>
    </ModalShell>
  );
};

const SendInvoiceModal = ({ onClose }: { onClose: () => void }) => {
  const [sent, setSent] = useState(false);

  return (
    <ModalShell title="Send Invoice" onClose={onClose}>
      {!sent ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Client</label>
            <select className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none">
              <option>Sophie Martin – sophie@example.com</option>
              <option>Marco Rossi – marco@example.com</option>
              <option>Emma Wilson – emma@example.com</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Services</label>
            <div className="space-y-2">
              {[
                { label: "Deep Tissue Massage × 1", amount: "€85" },
                { label: "Aromatherapy add-on × 1", amount: "€20" },
              ].map((line) => (
                <div key={line.label} className="flex justify-between items-center bg-muted rounded-xl px-4 py-2.5 text-sm">
                  <span>{line.label}</span>
                  <span className="font-semibold">{line.amount}</span>
                </div>
              ))}
              <div className="flex justify-between items-center px-4 pt-2 text-sm font-bold border-t border-border">
                <span>Total</span><span>€105</span>
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Send via</label>
            <div className="grid grid-cols-3 gap-2">
              {[{ icon: Mail, label: "Email" }, { icon: Send, label: "WhatsApp" }, { icon: FileText, label: "PDF" }].map((m) => (
                <button key={m.label} className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-foreground bg-foreground/5 text-xs font-medium">
                  <m.icon className="w-4 h-4" />{m.label}
                </button>
              ))}
            </div>
          </div>
          <Button className="w-full" onClick={() => setSent(true)}>
            <Send className="w-4 h-4 mr-2" />Send Invoice
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center py-8 gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="font-display font-bold text-lg">Invoice sent!</h3>
          <p className="text-sm text-muted-foreground text-center">Sophie Martin will receive the invoice by Email & WhatsApp with a Stripe payment link.</p>
          <Button className="w-full mt-2" onClick={onClose}>Done</Button>
        </div>
      )}
    </ModalShell>
  );
};

const ViewReportsModal = ({ onClose }: { onClose: () => void }) => {
  const bars = [65, 80, 55, 90, 70, 95, 60, 85, 75, 88, 72, 93];
  const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];

  return (
    <ModalShell title="Reports & Analytics" onClose={onClose}>
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "This month", value: "€4,250", sub: "+8% vs last" },
            { label: "Bookings", value: "156", sub: "+12% vs last" },
            { label: "Avg. ticket", value: "€27", sub: "+3% vs last" },
          ].map((s) => (
            <div key={s.label} className="bg-muted rounded-xl p-3 text-center">
              <div className="font-display font-bold text-lg text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-xs text-emerald-600 font-medium mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Mini bar chart */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Monthly Revenue (last 12 months)</p>
          <div className="flex items-end gap-1.5 h-24">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-foreground/80 transition-all hover:bg-foreground"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[9px] text-muted-foreground">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Top Services</p>
          <div className="space-y-2">
            {[
              { name: "Massage & Wellness", pct: 42 },
              { name: "Restaurant Reservations", pct: 28 },
              { name: "Workshops & Classes", pct: 18 },
              { name: "Travel & Tours", pct: 12 },
            ].map((r) => (
              <div key={r.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground font-medium">{r.name}</span>
                  <span className="text-muted-foreground">{r.pct}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-foreground rounded-full" style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button className="w-full" onClick={onClose}>Export PDF Report</Button>
      </div>
    </ModalShell>
  );
};

// ─── Sidebar Panel Views ─────────────────────────────────────────────────────

const BookingsPanel = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-display font-bold text-foreground">Bookings</h2>
      <Button size="sm"><Plus className="w-4 h-4 mr-1" />New Booking</Button>
    </div>
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>{["ID", "Client", "Service", "Date", "Status", "Amount"].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bookingRows.map((r) => (
              <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.id}</td>
                <td className="px-4 py-3 font-medium">{r.client}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.service}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    r.status === "Confirmed" ? "bg-blue-100 text-blue-700" :
                    r.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>{r.status}</span>
                </td>
                <td className="px-4 py-3 font-semibold">{r.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const PaymentsPanel = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-display font-bold text-foreground">Payments</h2>
      <Button size="sm"><Send className="w-4 h-4 mr-1" />Send Invoice</Button>
    </div>
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[{ label: "Collected", value: "€3,850", color: "text-emerald-600" }, { label: "Pending", value: "€400", color: "text-amber-600" }, { label: "Refunded", value: "€0", color: "text-muted-foreground" }].map((s) => (
        <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
          <div className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</div>
          <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
        </div>
      ))}
    </div>
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>{["ID", "Client", "Method", "Date", "Amount", "Status"].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paymentRows.map((r) => (
              <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.id}</td>
                <td className="px-4 py-3 font-medium">{r.client}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.method}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                <td className="px-4 py-3 font-semibold">{r.amount}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    r.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const ClientsPanel = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-display font-bold text-foreground">Clients</h2>
      <Button size="sm"><Plus className="w-4 h-4 mr-1" />Add Client</Button>
    </div>
    <div className="grid gap-4">
      {clientRows.map((c) => (
        <div key={c.name} className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:shadow-soft transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-foreground flex items-center justify-center text-background font-semibold text-sm flex-shrink-0">
              {c.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <p className="font-semibold text-foreground">{c.name}</p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" />{c.email}</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-right">
            <div><div className="font-semibold text-foreground">{c.bookings}</div><div className="text-xs text-muted-foreground">Bookings</div></div>
            <div><div className="font-semibold text-foreground">{c.total}</div><div className="text-xs text-muted-foreground">Total spent</div></div>
            <div><div className="font-semibold text-foreground">{c.since}</div><div className="text-xs text-muted-foreground">Client since</div></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SettingsPanel = () => (
  <div>
    <h2 className="text-2xl font-display font-bold text-foreground mb-6">Settings</h2>
    <div className="space-y-4">
      {[
        { label: "Business Name", value: "My Wellness Studio", icon: Package },
        { label: "Contact Email", value: "hello@mywellness.com", icon: Mail },
        { label: "Phone", value: "+34 612 345 678", icon: Phone },
        { label: "Location", value: "Barcelona, Spain", icon: MapPin },
        { label: "Rating", value: "4.9 ★ (128 reviews)", icon: Star },
      ].map((s) => (
        <div key={s.label} className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <s.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{s.value}</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="text-xs h-8">Edit</Button>
        </div>
      ))}
      <div className="bg-foreground rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="font-semibold text-background">AI Agents</p>
          <p className="text-xs text-background/60 mt-0.5">6 active agents running 24/7</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-background/80 font-medium">Active</span>
        </div>
      </div>
    </div>
  </div>
);

// ─── Shared Modal Shell ───────────────────────────────────────────────────────

const ModalShell = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-card w-full max-w-md rounded-2xl shadow-float border border-border overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-display font-bold text-lg text-foreground">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

// ─── Quick Actions Config ─────────────────────────────────────────────────────

type ModalKey = "newBooking" | "addService" | "sendInvoice" | "viewReports" | null;

const quickActions: { label: string; icon: React.ElementType; modal: ModalKey }[] = [
  { label: "New Booking", icon: Calendar, modal: "newBooking" },
  { label: "Add Service", icon: Settings, modal: "addService" },
  { label: "Send Invoice", icon: CreditCard, modal: "sendInvoice" },
  { label: "View Reports", icon: BarChart3, modal: "viewReports" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

const Demo = () => {
  const [activeMenu, setActiveMenu] = useState("Overview");
  const [openModal, setOpenModal] = useState<ModalKey>(null);

  const renderPanel = () => {
    switch (activeMenu) {
      case "Bookings": return <BookingsPanel />;
      case "Payments": return <PaymentsPanel />;
      case "Clients": return <ClientsPanel />;
      case "Settings": return <SettingsPanel />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Modals */}
      {openModal === "newBooking" && <NewBookingModal onClose={() => setOpenModal(null)} />}
      {openModal === "addService" && <AddServiceModal onClose={() => setOpenModal(null)} />}
      {openModal === "sendInvoice" && <SendInvoiceModal onClose={() => setOpenModal(null)} />}
      {openModal === "viewReports" && <ViewReportsModal onClose={() => setOpenModal(null)} />}

      {/* Demo Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-foreground text-background py-2 px-4 text-center text-sm flex items-center justify-center gap-3">
        <Sparkles className="w-4 h-4" />
        <span className="font-medium">Demo Mode — Interactive control panel preview</span>
        <Link to="/auth">
          <Button size="sm" variant="outline" className="h-7 px-3 text-xs border-background/30 text-background hover:bg-background/10 ml-2">
            Activate my account →
          </Button>
        </Link>
      </div>

      {/* Sidebar */}
      <aside className="fixed top-10 left-0 h-full w-64 bg-card border-r border-border z-40 hidden lg:block">
        <div className="p-6 pt-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
              <Cpu className="w-5 h-5 text-background" />
            </div>
            <span className="font-display font-bold text-lg">
              Flow<span className="text-muted-foreground">Booking</span>
            </span>
          </div>
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
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-background font-semibold text-sm">D</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Demo User</p>
              <p className="text-xs text-muted-foreground">demo@flowbooking.ai</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 pt-10">
        <header className="sticky top-10 bg-card/80 backdrop-blur-xl border-b border-border z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors lg:hidden">
                <ArrowLeft className="w-4 h-4" />Home
              </Link>
              <h1 className="font-display font-bold text-lg sm:text-xl text-foreground">{activeMenu}</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
              </Button>
              <Link to="/auth">
                <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90 hidden sm:flex">
                  <Play className="w-4 h-4 mr-2" />Get started free
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {activeMenu === "Overview" ? (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {/* Welcome */}
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">Welcome to the Demo 👋</h2>
                  <p className="text-muted-foreground">Explore the interactive control panel. Click any action or sidebar section.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                  {demoStats.map((stat, index) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}
                      className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-soft">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                          <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <span className="flex items-center gap-1 text-xs sm:text-sm font-medium text-emerald-600">
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />{stat.change}
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold font-display text-foreground mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions & Activity */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="bg-card rounded-2xl p-6 border border-border shadow-soft">
                    <h3 className="font-display font-bold text-lg text-foreground mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {quickActions.map((action) => (
                        <button key={action.label} onClick={() => setOpenModal(action.modal)}
                          className="flex items-center gap-3 p-4 rounded-xl bg-muted hover:bg-foreground hover:text-background group transition-all text-left">
                          <div className="w-10 h-10 rounded-xl bg-foreground group-hover:bg-background flex items-center justify-center transition-colors">
                            <action.icon className="w-5 h-5 text-background group-hover:text-foreground transition-colors" />
                          </div>
                          <span className="text-sm font-medium text-foreground group-hover:text-background transition-colors">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                    className="bg-card rounded-2xl p-6 border border-border shadow-soft">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-bold text-lg text-foreground">Recent Activity</h3>
                      <button onClick={() => setActiveMenu("Bookings")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                        View all <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {activity.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
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
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                  className="bg-foreground rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-xl text-background mb-1">¿Listo para automatizar tu negocio?</h3>
                    <p className="text-background/70 text-sm">Activa FlowBooking y empieza a recibir reservas en piloto automático.</p>
                  </div>
                  <div className="flex gap-3 flex-shrink-0">
                    <Link to="/#pricing">
                      <Button variant="outline" className="border-background/30 text-background hover:bg-background/10">Ver planes</Button>
                    </Link>
                    <Link to="/auth">
                      <Button className="bg-background text-foreground hover:bg-background/90">
                        <Zap className="w-4 h-4 mr-2" />Activar sistema en tu negocio
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div key={activeMenu} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {renderPanel()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Demo;
