import { motion } from "framer-motion";
import { 
  Bot, 
  Calendar, 
  CreditCard, 
  Globe, 
  Clock, 
  TrendingUp,
  Zap,
  Shield
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Sales Concierge",
    description: "Not just a chatbot—a conversion-focused AI that handles objections, presents value, and guides customers to payment.",
    gradient: "from-primary to-primary/70",
  },
  {
    icon: Calendar,
    title: "Smart Calendar Sync",
    description: "Real-time two-way sync with Google Calendar and Outlook. Never double-book again.",
    gradient: "from-blue-500 to-blue-400",
  },
  {
    icon: Globe,
    title: "Multilingual Magic",
    description: "Auto-detects language and responds in Spanish, English, or Italian. Seamless, natural conversations.",
    gradient: "from-violet-500 to-violet-400",
  },
  {
    icon: CreditCard,
    title: "Instant Payments",
    description: "Stripe integration for deposits or full payments. Bookings confirmed only after payment succeeds.",
    gradient: "from-emerald-500 to-emerald-400",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Your AI never sleeps. Capture bookings at 2am, on holidays, whenever your customers are ready.",
    gradient: "from-amber-500 to-amber-400",
  },
  {
    icon: TrendingUp,
    title: "Conversion Analytics",
    description: "Track conversations, bookings, and revenue. See exactly how AI improves your bottom line.",
    gradient: "from-rose-500 to-rose-400",
  },
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Go live in hours, not weeks. We configure everything for your business vertical.",
    gradient: "from-cyan-500 to-cyan-400",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "GDPR compliant, encrypted data, and secure payment processing. Peace of mind included.",
    gradient: "from-slate-600 to-slate-500",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Features
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
            Everything you need to{" "}
            <span className="text-gradient">maximize bookings</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful AI tools designed specifically for appointment-based businesses. 
            From first contact to confirmed payment.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-medium transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
