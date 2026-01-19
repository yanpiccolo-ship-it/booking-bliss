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

const agents = [
  {
    icon: Cpu,
    name: "Agente Operativo",
    description: "Gestiona reservas, citas y operaciones del día a día. Automatiza flujos sin intervención humana.",
    capabilities: ["Reservas automáticas", "Gestión de disponibilidad", "Confirmaciones"],
    color: "bg-blue-500",
  },
  {
    icon: FileText,
    name: "Agente de Contenido",
    description: "Crea menús, programas, itinerarios y material informativo desde texto o voz.",
    capabilities: ["Menús del día", "PDFs automáticos", "QR dinámicos"],
    color: "bg-emerald-500",
  },
  {
    icon: Palette,
    name: "Agente de Diseño",
    description: "Genera documentos estéticos, mantiene la identidad visual y crea materiales premium.",
    capabilities: ["Diseño automático", "Branding consistente", "Templates"],
    color: "bg-violet-500",
  },
  {
    icon: MessageCircle,
    name: "Agente de Comunicación",
    description: "Envía promociones, menús y lanzamientos a clientes y comunidades vía WhatsApp.",
    capabilities: ["Envío segmentado", "Grupos WhatsApp", "Newsletters"],
    color: "bg-orange-500",
  },
  {
    icon: CalendarClock,
    name: "Agente de Programación",
    description: "Planifica menús, eventos y talleres por días, semanas o meses con anticipación.",
    capabilities: ["Programación avanzada", "Calendarios", "Logística"],
    color: "bg-cyan-500",
  },
  {
    icon: Headphones,
    name: "Agente de Soporte",
    description: "Resuelve consultas, escala cuando es necesario y mantiene la satisfacción del cliente.",
    capabilities: ["Atención 24/7", "Escalación inteligente", "FAQ dinámico"],
    color: "bg-rose-500",
  },
];

const AIAgents = () => {
  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50 pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/[0.03] border border-border mb-6">
            <Sparkles className="w-4 h-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">
              Sistema de Agentes AI
            </span>
          </div>
          
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-display">
            Agentes especializados que{" "}
            <span className="text-gradient-premium">trabajan por ti</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Cada agente tiene un rol específico. Pueden crear contenido, consultar al usuario 
            o escalar a intervención humana. El sistema mejora con el uso y el tiempo.
          </p>
        </motion.div>

        {/* Agents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-strong transition-all duration-500"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${agent.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <agent.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-display font-bold text-xl text-foreground mb-3">
                {agent.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                {agent.description}
              </p>

              {/* Capabilities */}
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full"
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
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-foreground text-background">
            <Cpu className="w-5 h-5" />
            <span className="font-medium">Los agentes evolucionan: actualizaciones operativas, cognitivas y creativas continuas</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIAgents;
