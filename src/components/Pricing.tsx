import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, ArrowRight, Zap, Clock } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Pricing = () => {
  const { t } = useLanguage();

  const pricingPlans = [
    {
      name: t.pricing.plans.basic.name,
      description: t.pricing.plans.basic.description,
      setupPrice: "390 €",
      monthlyPrice: "49 €",
      features: t.pricing.plans.basic.features,
      highlighted: false,
    },
    {
      name: t.pricing.plans.advanced.name,
      description: t.pricing.plans.advanced.description,
      setupPrice: "990 €",
      monthlyPrice: "149 €",
      features: t.pricing.plans.advanced.features,
      highlighted: true,
    },
    {
      name: t.pricing.plans.custom.name,
      description: t.pricing.plans.custom.description,
      setupPrice: "2.900 € – 3.900 €",
      monthlyPrice: "299 €",
      features: t.pricing.plans.custom.features,
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-16 sm:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <span className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t.pricing.sectionLabel}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mt-4 mb-4 sm:mb-6 leading-display">
            {t.pricing.sectionTitle}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t.pricing.sectionSubtitle}
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 ${
                plan.highlighted
                  ? "bg-foreground text-background shadow-float lg:scale-[1.02]"
                  : "bg-card border border-border shadow-soft"
              }`}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-background text-foreground text-xs sm:text-sm font-semibold rounded-full shadow-medium">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                    {t.pricing.popular}
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6 sm:mb-8">
                <h3 className={`font-display font-bold text-xl sm:text-2xl mb-2 ${
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

              {/* Pricing - Setup */}
              <div className="mb-4">
                <div className={`text-xs uppercase tracking-wider font-semibold mb-1 ${
                  plan.highlighted ? "text-background/50" : "text-muted-foreground"
                }`}>
                  {t.pricing.setupLabel}
                </div>
                <div className={`text-2xl sm:text-3xl font-bold font-display ${
                  plan.highlighted ? "text-background" : "text-foreground"
                }`}>
                  {plan.setupPrice}
                </div>
              </div>

              {/* Pricing - Monthly */}
              <div className="mb-6 sm:mb-8">
                <div className={`text-xs uppercase tracking-wider font-semibold mb-1 ${
                  plan.highlighted ? "text-background/50" : "text-muted-foreground"
                }`}>
                  {t.pricing.monthlyLabel}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-xl sm:text-2xl font-bold font-display ${
                    plan.highlighted ? "text-background" : "text-foreground"
                  }`}>
                    {plan.monthlyPrice}
                  </span>
                  <span className={`text-sm ${
                    plan.highlighted ? "text-background/60" : "text-muted-foreground"
                  }`}>
                    / {t.pricing.perMonth}
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6 sm:mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 ${
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

              {/* CTA Buttons */}
              <div className="space-y-2">
                <Button
                  size="lg"
                  className={`w-full ${
                    plan.highlighted 
                      ? "bg-background text-foreground hover:bg-background/90" 
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  {t.pricing.ctaStart}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full ${
                    plan.highlighted 
                      ? "text-background/70 hover:text-background hover:bg-background/10" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.pricing.ctaDemo}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bonus & Payment Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 sm:mt-16 max-w-3xl mx-auto"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-card rounded-2xl p-5 border border-border shadow-soft">
              <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-background" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.pricing.bonusTitle}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.pricing.bonusDescription}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-card rounded-2xl p-5 border border-border shadow-soft">
              <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-background" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.pricing.installmentTitle}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.pricing.installmentDescription}</p>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className="rounded-xl">
              {t.pricing.ctaAdvisor}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-6">{t.pricing.languagesSupported}</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
