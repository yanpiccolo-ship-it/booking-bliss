import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const SocialProof = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      quote: t.socialProof.testimonials.t1.quote,
      author: t.socialProof.testimonials.t1.author,
      role: t.socialProof.testimonials.t1.role,
      avatar: "MG",
    },
    {
      quote: t.socialProof.testimonials.t2.quote,
      author: t.socialProof.testimonials.t2.author,
      role: t.socialProof.testimonials.t2.role,
      avatar: "AR",
    },
    {
      quote: t.socialProof.testimonials.t3.quote,
      author: t.socialProof.testimonials.t3.author,
      role: t.socialProof.testimonials.t3.role,
      avatar: "JM",
    },
  ];

  const stats = [
    { value: "24/7", label: t.socialProof.stats.attention },
    { value: "6", label: t.socialProof.stats.languages },
    { value: "∞", label: t.socialProof.stats.scalability },
    { value: "AI", label: t.socialProof.stats.agents },
  ];

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16 sm:mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm lg:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <span className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t.socialProof.sectionLabel}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mt-4 mb-4 sm:mb-6 leading-display">
            {t.socialProof.sectionTitle}
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-soft hover:shadow-medium transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/30 mb-4" />

              {/* Quote */}
              <blockquote className="text-foreground leading-relaxed mb-6 sm:mb-8 text-base sm:text-lg">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-foreground flex items-center justify-center text-background font-semibold text-sm sm:text-base">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm sm:text-base">
                    {testimonial.author}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
