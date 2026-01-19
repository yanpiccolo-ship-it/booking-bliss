import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "El sistema de agentes AI ha transformado cómo gestionamos nuestro restaurante. Los menús del día se generan en minutos.",
    author: "María García",
    role: "Chef Ejecutiva, Barcelona",
    avatar: "MG",
  },
  {
    quote: "La programación anticipada nos permite planificar semanas enteras. La logística y las compras nunca fueron tan fáciles.",
    author: "Alessandro Rossi",
    role: "Director de Hotel, Milano",
    avatar: "AR",
  },
  {
    quote: "Finalmente una plataforma que entiende hospitality. El soporte multilingüe es excepcional para nuestros huéspedes internacionales.",
    author: "James Mitchell",
    role: "Gerente de Retiros, Ibiza",
    avatar: "JM",
  },
];

const stats = [
  { value: "24/7", label: "Atención continua" },
  { value: "6", label: "Idiomas soportados" },
  { value: "∞", label: "Escalabilidad" },
  { value: "AI", label: "Agentes especializados" },
];

const SocialProof = () => {
  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
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
              <div className="text-4xl lg:text-5xl font-bold font-display text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm lg:text-base">
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
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Testimonios
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 leading-display">
            Negocios que{" "}
            <span className="text-gradient-premium">confían en nosotros</span>
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-8 border border-border shadow-soft hover:shadow-medium transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-muted-foreground/30 mb-4" />

              {/* Quote */}
              <blockquote className="text-foreground leading-relaxed mb-8 text-lg">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center text-background font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-muted-foreground">
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
