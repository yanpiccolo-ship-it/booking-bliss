import { motion } from "framer-motion";
import { Sparkles, Stethoscope, Scale } from "lucide-react";

const verticals = [
  {
    icon: Sparkles,
    title: "Spa & Wellness",
    description: "Relaxation-focused conversations that guide clients from inquiry to massage table. The AI understands wellness vocabulary and creates a serene booking experience.",
    services: ["Massages", "Facials", "Body Treatments", "Yoga Classes"],
    color: "from-pink-500 to-rose-400",
    bgColor: "bg-pink-50",
  },
  {
    icon: Stethoscope,
    title: "Medical & Health Clinics",
    description: "Professional, HIPAA-aware conversations for medical appointments. Handles patient sensitivity with care while driving appointment completion.",
    services: ["Consultations", "Check-ups", "Specialists", "Treatments"],
    color: "from-blue-500 to-cyan-400",
    bgColor: "bg-blue-50",
  },
  {
    icon: Scale,
    title: "Legal & Consulting",
    description: "Authority-building dialogues for professional services. The AI qualifies leads, explains service value, and books high-value consultations.",
    services: ["Initial Consultations", "Case Reviews", "Advisory Sessions", "Strategy Calls"],
    color: "from-slate-600 to-slate-500",
    bgColor: "bg-slate-50",
  },
];

const Verticals = () => {
  return (
    <section id="verticals" className="py-20 lg:py-32 bg-muted/30">
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
            Industry Solutions
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
            One platform,{" "}
            <span className="text-gradient">tailored for your industry</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Same powerful AI core, different conversational templates. 
            Each vertical gets industry-specific vocabulary, objection handling, and booking flows.
          </p>
        </motion.div>

        {/* Verticals Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {verticals.map((vertical, index) => (
            <motion.div
              key={vertical.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group relative bg-card rounded-3xl overflow-hidden border border-border shadow-soft hover:shadow-strong transition-all duration-500"
            >
              {/* Top Gradient Bar */}
              <div className={`h-2 bg-gradient-to-r ${vertical.color}`} />
              
              <div className="p-8">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${vertical.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <vertical.icon className={`w-8 h-8 bg-gradient-to-br ${vertical.color} bg-clip-text text-transparent`} style={{ color: `hsl(var(--primary))` }} />
                </div>

                {/* Content */}
                <h3 className="font-display font-bold text-2xl text-foreground mb-3">
                  {vertical.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {vertical.description}
                </p>

                {/* Services Tags */}
                <div className="flex flex-wrap gap-2">
                  {vertical.services.map((service) => (
                    <span
                      key={service}
                      className="px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${vertical.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-muted-foreground mt-12"
        >
          More verticals coming soon: Restaurants, Fitness Studios, Beauty Salons, and more.
        </motion.p>
      </div>
    </section>
  );
};

export default Verticals;
