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

        {/* Testimonials Carousel */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="flex gap-5 sm:gap-6 px-4 sm:px-6 lg:px-8 snap-x snap-mandatory">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="snap-start shrink-0 w-[85vw] sm:w-[420px] bg-card rounded-2xl p-6 sm:p-7 border border-border shadow-soft hover:shadow-medium transition-shadow duration-300"
              >
                <Quote className="w-7 h-7 text-muted-foreground/30 mb-3" />
                <blockquote className="text-foreground leading-relaxed mb-6 text-base">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-background font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">
                      {testimonial.author}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
