import { motion } from "framer-motion";
import { 
  UtensilsCrossed, 
  Hotel, 
  Compass, 
  Landmark,
  Waves,
  GraduationCap,
  Building2,
  Settings2
} from "lucide-react";

const verticals = [
  {
    icon: UtensilsCrossed,
    title: "Restaurantes y Bares",
    description: "Menús del día, reservas de mesa, eventos y comunicación con clientes.",
    examples: ["Menú digital", "Reservas", "QR mesas"],
  },
  {
    icon: Hotel,
    title: "Hoteles y Alojamientos",
    description: "Gestión de habitaciones, eventos en hotel, check-in y experiencias.",
    examples: ["Reservas", "Concierge 24/7", "Upselling"],
  },
  {
    icon: Compass,
    title: "Agencias de Viajes",
    description: "Safaris, travesías, itinerarios y experiencias personalizadas.",
    examples: ["Itinerarios", "Programas", "Pagos"],
  },
  {
    icon: Landmark,
    title: "Museos y Cultura",
    description: "Espacios culturales, exposiciones, visitas guiadas y eventos.",
    examples: ["Entradas", "Tours", "Eventos"],
  },
  {
    icon: Waves,
    title: "Surf Camps y Retiros",
    description: "Wellness, yoga, meditación, surf y experiencias transformadoras.",
    examples: ["Programas", "Alojamiento", "Clases"],
  },
  {
    icon: GraduationCap,
    title: "Workshops y Cursos",
    description: "Talleres, charlas, formaciones y experiencias educativas.",
    examples: ["Inscripciones", "Materiales", "Certificados"],
  },
  {
    icon: Building2,
    title: "Co-working y Comunidades",
    description: "Espacios compartidos, membresías, eventos y networking.",
    examples: ["Membresías", "Salas", "Eventos"],
  },
  {
    icon: Settings2,
    title: "Custom Business",
    description: "Categoría personalizada para negocios con necesidades específicas.",
    examples: ["A medida", "Integración", "Escalable"],
  },
];

const Verticals = () => {
  return (
    <section id="verticals" className="py-24 lg:py-32 bg-muted/30">
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
            Tipología de Clientes
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 leading-display">
            Diseñada para{" "}
            <span className="text-gradient-premium">tu industria</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Hospitality, gastronomía, travel, experiencias, espacios culturales 
            y servicios profesionales. El mismo sistema potente, adaptado a tu vertical.
          </p>
        </motion.div>

        {/* Verticals Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {verticals.map((vertical, index) => (
            <motion.div
              key={vertical.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-soft hover:shadow-strong transition-all duration-500"
            >
              {/* Top Accent */}
              <div className="h-1 bg-foreground" />
              
              <div className="p-6">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <vertical.icon className="w-6 h-6 text-background" />
                </div>

                {/* Content */}
                <h3 className="font-display font-bold text-lg text-foreground mb-2 leading-tight">
                  {vertical.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {vertical.description}
                </p>

                {/* Examples */}
                <div className="flex flex-wrap gap-1.5">
                  {vertical.examples.map((example) => (
                    <span
                      key={example}
                      className="px-2.5 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            ✨ Nuevas industrias y módulos agregados continuamente. El sistema es escalable.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Verticals;
