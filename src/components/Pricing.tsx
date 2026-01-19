import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, ArrowRight } from "lucide-react";

const pricingPlans = [
  {
    name: "Básica",
    description: "Gestión de contenido y atención 24/7",
    price: "Consultar",
    monthlyNote: "Mensual proporcional",
    features: [
      "Gestión de contenido (menús, cartas, programas)",
      "Menú del día manual",
      "Exportación PDF",
      "Envío WhatsApp manual",
      "Soporte AI por WhatsApp 24/7",
      "Material educativo incluido",
    ],
    highlighted: false,
    cta: "Solicitar Demo",
  },
  {
    name: "Avanzada",
    description: "Automatizaciones y agentes especializados",
    price: "€2,500",
    monthlyNote: "Mensual proporcional",
    features: [
      "Todo lo de Básica",
      "Automatizaciones completas",
      "Programación de contenidos",
      "Agentes especializados",
      "Workflows optimizados",
      "QR dinámicos",
      "Segmentación de comunidades",
      "Soporte prioritario",
    ],
    highlighted: true,
    cta: "Comenzar ahora",
  },
  {
    name: "Personalizada",
    description: "Módulos a demanda y agentes dedicados",
    price: "Desde €3,000",
    monthlyNote: "Según necesidades",
    features: [
      "Todo lo de Avanzada",
      "Módulos a demanda",
      "Agentes dedicados",
      "Automatización avanzada",
      "Gestión de stock y proveedores",
      "Métricas y reportes avanzados",
      "Integraciones personalizadas",
      "Escalable hasta €12,000+",
    ],
    highlighted: false,
    cta: "Contactar",
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 lg:py-32 bg-background">
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
            Membresías
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 leading-display">
            Planes que escalan{" "}
            <span className="text-gradient-premium">contigo</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Sin free trial. Demo disponible. Sistema pago con tarjeta. 
            Preparado para venta, diseñado para crecimiento.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-3xl p-8 ${
                plan.highlighted
                  ? "bg-foreground text-background shadow-float scale-[1.02]"
                  : "bg-card border border-border shadow-soft"
              }`}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-background text-foreground text-sm font-semibold rounded-full shadow-medium">
                    <Sparkles className="w-4 h-4" />
                    Más Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <h3 className={`font-display font-bold text-2xl mb-2 ${
                  plan.highlighted ? "text-background" : "text-foreground"
                }`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${
                  plan.highlighted ? "text-background/70" : "text-muted-foreground"
                }`}>
                  {plan.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="mb-8">
                <div className={`text-4xl font-bold font-display mb-1 ${
                  plan.highlighted ? "text-background" : "text-foreground"
                }`}>
                  {plan.price}
                </div>
                <span className={`text-sm ${
                  plan.highlighted ? "text-background/60" : "text-muted-foreground"
                }`}>
                  {plan.monthlyNote}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      plan.highlighted ? "text-background" : "text-foreground"
                    }`} />
                    <span className={`text-sm ${
                      plan.highlighted ? "text-background/90" : "text-muted-foreground"
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                variant={plan.highlighted ? "heroOutline" : "hero"}
                size="lg"
                className={`w-full ${
                  plan.highlighted 
                    ? "bg-background text-foreground hover:bg-background/90 border-0" 
                    : ""
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-foreground" />
              Demo disponible
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-foreground" />
              Pago con tarjeta
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-foreground" />
              Material educativo incluido
            </span>
          </div>
        </motion.div>

        {/* Languages */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">Idiomas soportados:</p>
          <div className="flex justify-center gap-3 flex-wrap">
            {["Inglés", "Español", "Italiano", "Francés", "Portugués", "Alemán"].map((lang) => (
              <span key={lang} className="px-3 py-1.5 bg-muted text-muted-foreground text-sm rounded-full">
                {lang}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
