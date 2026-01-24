import { motion } from "framer-motion";
import { 
  ChefHat,
  Calendar,
  CreditCard,
  CalendarRange,
  Package,
  Globe
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: ChefHat,
      title: t.features.items.dailyMenu.title,
      description: t.features.items.dailyMenu.description,
      output: t.features.items.dailyMenu.output,
    },
    {
      icon: Calendar,
      title: t.features.items.smartBooking.title,
      description: t.features.items.smartBooking.description,
      output: t.features.items.smartBooking.output,
    },
    {
      icon: CreditCard,
      title: t.features.items.activePayments.title,
      description: t.features.items.activePayments.description,
      output: t.features.items.activePayments.output,
    },
    {
      icon: CalendarRange,
      title: t.features.items.scheduleProgram.title,
      description: t.features.items.scheduleProgram.description,
      output: t.features.items.scheduleProgram.output,
    },
    {
      icon: Package,
      title: t.features.items.stockManagement.title,
      description: t.features.items.stockManagement.description,
      output: t.features.items.stockManagement.output,
    },
    {
      icon: Globe,
      title: t.features.items.multiLanguage.title,
      description: t.features.items.multiLanguage.description,
      output: t.features.items.multiLanguage.output,
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 lg:py-32 bg-background">
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
            {t.features.sectionLabel}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mt-4 mb-4 sm:mb-6 leading-display">
            {t.features.sectionTitle}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t.features.sectionSubtitle}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-soft hover:shadow-medium transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-foreground flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-background" />
              </div>

              {/* Content */}
              <h3 className="font-display font-semibold text-base sm:text-lg text-foreground mb-2">
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
      </div>
    </section>
  );
};

export default Features;
