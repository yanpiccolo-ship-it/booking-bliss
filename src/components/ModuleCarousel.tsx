import { useRef } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles,
  UtensilsCrossed,
  Compass,
  GraduationCap,
  Building2,
  Palmtree,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const modules = [
  {
    id: "spa",
    title: "Spa & Clínicas",
    description: "Gestión de citas, terapias y tratamientos con agendamiento inteligente.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
    icon: Sparkles,
    color: "from-rose-500/20 to-pink-500/20",
  },
  {
    id: "restaurant",
    title: "Restaurantes",
    description: "Menús del día automáticos, reservas y comunicación con clientes.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
    icon: UtensilsCrossed,
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: "travel",
    title: "Travel & Tours",
    description: "Itinerarios, safaris, travesías y experiencias de viaje premium.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
    icon: Compass,
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    id: "workshops",
    title: "Workshops & Clases",
    description: "Cursos, talleres, coaching y actividades educativas.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80",
    icon: GraduationCap,
    color: "from-violet-500/20 to-purple-500/20",
  },
  {
    id: "coworking",
    title: "Coworking & Eventos",
    description: "Espacios de trabajo, salas de reuniones y eventos corporativos.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    icon: Building2,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "experiences",
    title: "Experiencias",
    description: "Retiros, wellness, surf camps y experiencias personalizadas.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    icon: Palmtree,
    color: "from-lime-500/20 to-green-500/20",
  },
];

const ModuleCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-24 lg:py-32 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Apple style: large, left-aligned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 lg:mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-4">
            Módulos inteligentes
            <br />
            <span className="text-muted-foreground">para cada vertical.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mt-6">
            Cada industria tiene necesidades únicas. Nuestros módulos se adaptan 
            y evolucionan con tu negocio.
          </p>
        </motion.div>

        {/* Navigation Arrows */}
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Left spacer for container alignment */}
        <div className="shrink-0 w-[calc((100vw-1400px)/2-2rem)] hidden 2xl:block" />
        
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="shrink-0 w-[320px] sm:w-[380px] snap-start"
          >
            <div className="group relative bg-card rounded-3xl overflow-hidden border border-border shadow-soft hover:shadow-strong transition-all duration-500 h-[480px]">
              {/* Image */}
              <div className="relative h-[240px] overflow-hidden">
                <img
                  src={module.image}
                  alt={module.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${module.color} opacity-60`} />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                
                {/* Icon Badge */}
                <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-medium">
                  <module.icon className="w-6 h-6 text-foreground" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {module.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {module.description}
                </p>
                <button className="text-sm font-semibold text-foreground flex items-center gap-2 group/btn">
                  Explorar módulo
                  <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-foreground/10 rounded-3xl transition-colors duration-300 pointer-events-none" />
            </div>
          </motion.div>
        ))}
        
        {/* Right spacer */}
        <div className="shrink-0 w-[calc((100vw-1400px)/2-2rem)] hidden 2xl:block" />
      </div>
    </section>
  );
};

export default ModuleCarousel;
