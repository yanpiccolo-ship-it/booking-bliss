import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const pricingPlans = [
  {
    name: "Básico",
    subtitle: "Booking + Chat",
    description: "Atención 24/7 y gestión manual de reservas",
    setupFee: "€1,500",
    monthlyFee: "€299",
    features: [
      "Atención 24/7 vía chat web y WhatsApp",
      "Creación manual de reservas y citas",
      "Menús y documentos vía WhatsApp/PDF",
      "Flujos de atención básica",
      "PDF de bienvenida y material multimedia",
      "Soporte por email",
    ],
    highlighted: false,
    example: "Chef envía nota de voz → Menú digital listo para enviar",
  },
  {
    name: "Avanzado",
    subtitle: "Automatización Parcial",
    description: "Multi-actividades y gestión de comunidades",
    setupFee: "€2,000",
    monthlyFee: "€499",
    features: [
      "Todo lo del plan Básico",
      "Menús y eventos parcialmente automatizados",
      "QR dinámicos para mesas y reservas",
      "Gestión de múltiples actividades/rubros",
      "Historial de reservas y envíos",
      "Segmentación por grupos (VIP, general)",
      "Material educativo en el panel",
      "Soporte prioritario",
    ],
    highlighted: true,
    example: "Segmenta clientes VIP y envía promociones exclusivas automáticamente",
  },
  {
    name: "Personalizado",
    subtitle: "Automatización Completa",
    description: "Escalabilidad total y flujos avanzados",
    setupFee: "€2,500+",
    monthlyFee: "Custom",
    features: [
      "Todo lo del plan Avanzado",
      "Automatización total de menús diarios",
      "Programación semanal/mensual",
      "Gestión de stock y proveedores",
      "Envío automático a comunidades WhatsApp",
      "Flujos de venta con upselling multi-idioma",
      "Integración Stripe + calendarios externos",
      "Entrenamiento personalizado de agentes",
      "Reportes y métricas avanzadas",
      "QR y materiales generados automáticamente",
    ],
    highlighted: false,
    example: "Planifica menús del mes, stock se ajusta automáticamente",
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 lg:py-32 bg-background">
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
            Pricing
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
            Planes que escalan{" "}
            <span className="text-gradient">contigo</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Desde atención básica hasta automatización completa. 
            Cada actividad adicional: €300. Sin sorpresas.
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
                  ? "bg-gradient-primary text-primary-foreground shadow-glow scale-105"
                  : "bg-card border border-border shadow-soft"
              }`}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-card text-foreground text-sm font-semibold rounded-full shadow-medium">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className={`font-display font-bold text-2xl mb-1 ${
                  plan.highlighted ? "text-primary-foreground" : "text-foreground"
                }`}>
                  {plan.name}
                </h3>
                <span className={`text-xs font-semibold uppercase tracking-wider ${
                  plan.highlighted ? "text-primary-foreground/70" : "text-primary"
                }`}>
                  {plan.subtitle}
                </span>
                <p className={`text-sm mt-2 ${
                  plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}>
                  {plan.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="mb-8">
                <div className="mb-4">
                  <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    One-time setup
                  </span>
                  <div className={`text-3xl font-bold font-display ${
                    plan.highlighted ? "text-primary-foreground" : "text-foreground"
                  }`}>
                    {plan.setupFee}
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold font-display ${
                    plan.highlighted ? "text-primary-foreground" : "text-foreground"
                  }`}>
                    {plan.monthlyFee}
                  </span>
                  {plan.monthlyFee !== "Custom" && (
                    <span className={`${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      /month
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      plan.highlighted ? "text-primary-foreground" : "text-primary"
                    }`} />
                    <span className={`text-sm leading-tight ${
                      plan.highlighted ? "text-primary-foreground/90" : "text-muted-foreground"
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Example */}
              <div className={`p-3 rounded-xl mb-6 ${
                plan.highlighted 
                  ? "bg-primary-foreground/10" 
                  : "bg-muted/50"
              }`}>
                <p className={`text-xs italic ${
                  plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}>
                  💡 {plan.example}
                </p>
              </div>

              {/* CTA Button */}
              <Button
                variant={plan.highlighted ? "heroOutline" : "hero"}
                size="lg"
                className={`w-full ${
                  plan.highlighted 
                    ? "bg-card text-foreground hover:bg-card/90 border-0" 
                    : ""
                }`}
              >
                {plan.monthlyFee === "Custom" ? "Contact Sales" : "Get Started"}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Value Propositions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="text-3xl mb-3">🍽️</div>
              <h4 className="font-semibold text-foreground mb-2">Menús del día</h4>
              <p className="text-sm text-muted-foreground">
                Chef envía nota de voz → Agente genera menú digital + PDF + WhatsApp + QR
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="text-3xl mb-3">📅</div>
              <h4 className="font-semibold text-foreground mb-2">Programación avanzada</h4>
              <p className="text-sm text-muted-foreground">
                Planifica menús, talleres y eventos por días, semanas o meses
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="text-3xl mb-3">📈</div>
              <h4 className="font-semibold text-foreground mb-2">Upselling inteligente</h4>
              <p className="text-sm text-muted-foreground">
                Cada actividad extra: €300. Activa nuevos servicios desde tu panel
              </p>
            </div>
          </div>
        </motion.div>

        {/* Money Back Guarantee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            💰 30 días de garantía en todos los planes. Sin preguntas.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
