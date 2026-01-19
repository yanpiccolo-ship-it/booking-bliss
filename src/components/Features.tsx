import { motion } from "framer-motion";
import { 
  FileText, 
  UtensilsCrossed, 
  CalendarRange, 
  Send,
  Compass,
  ChefHat,
  FileOutput,
  Mic
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Gestión de Contenido",
    description: "Menús, cartas, programas, workshops, eventos y ofertas. Input por texto, voz o WhatsApp.",
    output: "PDF • WhatsApp • QR",
  },
  {
    icon: ChefHat,
    title: "Menú del Día",
    description: "Chef envía nota de voz → Agente interpreta → Genera menú estructurado con precios y diseño estético.",
    output: "Automático en minutos",
  },
  {
    icon: CalendarRange,
    title: "Programación Anticipada",
    description: "Programa menús, talleres y eventos por días, semanas o meses. Ideal para compras y logística.",
    output: "Planificación avanzada",
  },
  {
    icon: Send,
    title: "Comunicación a Comunidades",
    description: "Envío automático de menús, promociones y lanzamientos. Integración directa con WhatsApp.",
    output: "Listas y grupos",
  },
  {
    icon: Compass,
    title: "Travel & Experiencias",
    description: "Itinerarios, programas, horarios y precios para safaris, retiros, travesías y experiencias.",
    output: "Documentos premium",
  },
  {
    icon: Mic,
    title: "Input por Voz",
    description: "Dicta el contenido por nota de voz. El agente transcribe, interpreta y genera el output final.",
    output: "Manos libres",
  },
  {
    icon: FileOutput,
    title: "Exportación Multi-formato",
    description: "Cada contenido genera automáticamente versión digital, PDF, WhatsApp y código QR.",
    output: "4 formatos",
  },
  {
    icon: UtensilsCrossed,
    title: "Módulos Especializados",
    description: "Cada vertical tiene módulos específicos: stock, proveedores, alertas, métricas y más.",
    output: "Personalizable",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Módulos Backend
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 leading-display">
            El backend más{" "}
            <span className="text-gradient-premium">sofisticado y fácil</span>{" "}
            de usar
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Diseño premium inspirado en Apple. Minimalista, uso inteligente del color, 
            tipografía clara y animaciones suaves. Flujo guiado y modular.
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
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-medium transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-background" />
              </div>

              {/* Content */}
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {feature.description}
              </p>
              
              {/* Output Tag */}
              <span className="text-xs font-medium text-foreground bg-muted px-3 py-1.5 rounded-full">
                {feature.output}
              </span>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Example Flow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="bg-foreground text-background rounded-3xl p-8 lg:p-12">
            <h3 className="font-display font-bold text-2xl lg:text-3xl mb-8 text-center">
              Ejemplo: Menú del Día
            </h3>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              {[
                { step: "1", label: "Chef envía", desc: "Nota de voz o texto" },
                { step: "2", label: "AI interpreta", desc: "Estructura el contenido" },
                { step: "3", label: "Genera menú", desc: "Precios + diseño" },
                { step: "4", label: "Exporta", desc: "PDF • WhatsApp • QR" },
              ].map((item, i) => (
                <div key={item.step} className="relative">
                  <div className="w-10 h-10 rounded-full bg-background text-foreground font-bold flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <p className="font-semibold text-background mb-1">{item.label}</p>
                  <p className="text-sm text-background/70">{item.desc}</p>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-5 left-[60%] w-[80%] h-px bg-background/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
