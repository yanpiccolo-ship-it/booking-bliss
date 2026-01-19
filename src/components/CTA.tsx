import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Cpu } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Premium CTA Card */}
          <div className="bg-foreground text-background rounded-3xl p-10 lg:p-16 text-center shadow-float">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 mb-8"
            >
              <Cpu className="w-4 h-4 text-background" />
              <span className="text-sm font-medium text-background">
                Ecosistema Inteligente Premium
              </span>
            </motion.div>

            {/* Heading */}
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-background mb-6 leading-display">
              Preparado para venta.{" "}
              <span className="text-background/70">Diseñado para crecimiento.</span>
            </h2>

            {/* Description */}
            <p className="text-xl text-background/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              No es una app. No es una web. Es un sistema operativo inteligente 
              impulsado por Agentes AI que evoluciona con tu negocio.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="xl"
                className="bg-background text-foreground hover:bg-background/90"
              >
                Solicitar Demo
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                variant="heroOutline" 
                size="xl"
                className="border-background/30 text-background hover:bg-background/10"
              >
                Conocer más
              </Button>
            </div>

            {/* Key Points */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-background/70">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-background/50" />
                Automatizable
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-background/50" />
                Escalable
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-background/50" />
                Evolutivo
              </div>
            </div>
          </div>
        </motion.div>

        {/* Evolution Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center max-w-2xl mx-auto"
        >
          <h3 className="font-display font-bold text-2xl text-foreground mb-4">
            Evolución Continua
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            La plataforma se concibe como un sistema vivo con actualizaciones 
            operativas, evolutivas (AI) y creativas. El sistema mejora con el uso y el tiempo.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
