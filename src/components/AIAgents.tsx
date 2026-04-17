import { motion } from "framer-motion";
import { 
  Cpu, 
  FileText, 
  Palette, 
  MessageCircle, 
  CalendarClock, 
  Headphones,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const AIAgents = () => {
  const { t } = useLanguage();

  const agents = [
    {
      icon: Cpu,
      name: t.agents.items.operational.name,
      description: t.agents.items.operational.description,
      capabilities: t.agents.items.operational.capabilities,
      color: "bg-blue-500",
    },
    {
      icon: FileText,
      name: t.agents.items.content.name,
      description: t.agents.items.content.description,
      capabilities: t.agents.items.content.capabilities,
      color: "bg-emerald-500",
    },
    {
      icon: Palette,
      name: t.agents.items.design.name,
      description: t.agents.items.design.description,
      capabilities: t.agents.items.design.capabilities,
      color: "bg-violet-500",
    },
    {
      icon: MessageCircle,
      name: t.agents.items.communication.name,
      description: t.agents.items.communication.description,
      capabilities: t.agents.items.communication.capabilities,
      color: "bg-orange-500",
    },
    {
      icon: CalendarClock,
      name: t.agents.items.scheduling.name,
      description: t.agents.items.scheduling.description,
      capabilities: t.agents.items.scheduling.capabilities,
      color: "bg-cyan-500",
    },
    {
      icon: Headphones,
      name: t.agents.items.support.name,
      description: t.agents.items.support.description,
      capabilities: t.agents.items.support.capabilities,
      color: "bg-rose-500",
    },
  ];

  return (
    <section id="agents" className="py-16 sm:py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50 pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/[0.03] border border-border mb-4 sm:mb-6">
            <Sparkles className="w-4 h-4 text-foreground" />
            <span className="text-xs sm:text-sm font-medium text-foreground">
              {t.agents.sectionLabel}
            </span>
          </div>
          
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-display">
            {t.agents.sectionTitle}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t.agents.sectionSubtitle}
          </p>
        </motion.div>

        {/* Agents Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-soft hover:shadow-strong transition-all duration-500"
            >
              {/* Icon */}
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${agent.color} flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <agent.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-display font-bold text-lg sm:text-xl text-foreground mb-2 sm:mb-3">
                {agent.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 sm:mb-5">
                {agent.description}
              </p>

              {/* Capabilities */}
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="px-2.5 sm:px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full"
                  >
                    {cap}
                  </span>
                ))}
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-foreground text-background text-sm sm:text-base">
            <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium">{t.agents.evolutionNote}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIAgents;
