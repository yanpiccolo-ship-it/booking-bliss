import { motion } from "framer-motion";
import { 
  UtensilsCrossed, 
  Hotel, 
  Sparkles,
  GraduationCap
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Verticals = () => {
  const { t } = useLanguage();

  const verticals = [
    {
      icon: UtensilsCrossed,
      title: t.verticals.items.hospitality.title,
      description: t.verticals.items.hospitality.description,
      examples: t.verticals.items.hospitality.examples,
    },
    {
      icon: Hotel,
      title: t.verticals.items.accommodation.title,
      description: t.verticals.items.accommodation.description,
      examples: t.verticals.items.accommodation.examples,
    },
    {
      icon: Sparkles,
      title: t.verticals.items.wellness.title,
      description: t.verticals.items.wellness.description,
      examples: t.verticals.items.wellness.examples,
    },
    {
      icon: GraduationCap,
      title: t.verticals.items.professional.title,
      description: t.verticals.items.professional.description,
      examples: t.verticals.items.professional.examples,
    },
  ];

  return (
    <section id="verticals" className="py-16 sm:py-24 lg:py-32 bg-muted/30">
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
            {t.verticals.sectionLabel}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mt-4 mb-4 sm:mb-6 leading-display">
            {t.verticals.sectionTitle}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t.verticals.sectionSubtitle}
          </p>
        </motion.div>

        {/* Verticals Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
              
              <div className="p-5 sm:p-6">
                {/* Icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-foreground flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
                  <vertical.icon className="w-5 h-5 sm:w-6 sm:h-6 text-background" />
                </div>

                {/* Content */}
                <h3 className="font-display font-bold text-base sm:text-lg text-foreground mb-2 leading-tight">
                  {vertical.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 sm:mb-5">
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
      </div>
    </section>
  );
};

export default Verticals;
