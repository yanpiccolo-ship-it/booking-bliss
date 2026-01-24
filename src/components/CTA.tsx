import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Cpu } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const CTA = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-16 sm:py-24 lg:py-32 bg-background relative overflow-hidden">
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
          <div className="bg-foreground text-background rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-16 text-center shadow-float">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 mb-6 sm:mb-8"
            >
              <Cpu className="w-4 h-4 text-background" />
              <span className="text-xs sm:text-sm font-medium text-background">
                {t.cta.badge}
              </span>
            </motion.div>

            {/* Heading */}
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-background mb-4 sm:mb-6 leading-display">
              {t.cta.title}{" "}
              <span className="text-background/70">{t.cta.titleHighlight}</span>
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-background/80 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              {t.cta.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
              <Button 
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 h-12 sm:h-14 px-6 sm:px-8"
              >
                {t.cta.primaryBtn}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-background/30 text-background hover:bg-background/10 h-12 sm:h-14 px-6 sm:px-8"
              >
                {t.cta.secondaryBtn}
              </Button>
            </div>

            {/* Key Points */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-background/70">
              {t.cta.points.map((point) => (
                <div key={point} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-background/50" />
                  {point}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Evolution Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 sm:mt-16 text-center max-w-2xl mx-auto"
        >
          <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground mb-4">
            {t.cta.evolutionTitle}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            {t.cta.evolutionDescription}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
