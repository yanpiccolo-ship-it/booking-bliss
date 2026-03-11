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
import { useLanguage } from "@/i18n/LanguageContext";
import moduleSpa from "@/assets/module-spa.jpg";
import moduleRestaurant from "@/assets/module-restaurant.jpg";
import moduleTravel from "@/assets/module-travel.jpg";
import moduleWorkshop from "@/assets/module-workshop.jpg";
import moduleCoworking from "@/assets/module-coworking.jpg";
import moduleExperiences from "@/assets/module-experiences.jpg";

const ModuleCarousel = () => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const modules = [
    {
      id: "spa",
      title: t.modules.items.spa.title,
      description: t.modules.items.spa.description,
      image: moduleSpa,
      icon: Sparkles,
      color: "from-rose-500/20 to-pink-500/20",
    },
    {
      id: "restaurant",
      title: t.modules.items.restaurant.title,
      description: t.modules.items.restaurant.description,
      image: moduleRestaurant,
      icon: UtensilsCrossed,
      color: "from-amber-500/20 to-orange-500/20",
    },
    {
      id: "travel",
      title: t.modules.items.travel.title,
      description: t.modules.items.travel.description,
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
      icon: Compass,
      color: "from-emerald-500/20 to-teal-500/20",
    },
    {
      id: "workshops",
      title: t.modules.items.workshop.title,
      description: t.modules.items.workshop.description,
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80",
      icon: GraduationCap,
      color: "from-violet-500/20 to-purple-500/20",
    },
    {
      id: "coworking",
      title: t.modules.items.coworking.title,
      description: t.modules.items.coworking.description,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
      icon: Building2,
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      id: "experiences",
      title: t.modules.items.experiences.title,
      description: t.modules.items.experiences.description,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
      icon: Palmtree,
      color: "from-lime-500/20 to-green-500/20",
    },
  ];

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
    <section id="modules" className="py-16 sm:py-24 lg:py-32 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Apple style: large, left-aligned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-[1.1] mb-4">
            {t.modules.sectionTitle}
            <br className="hidden sm:block" />
            <span className="text-muted-foreground sm:block">{t.modules.sectionSubtitle.split('.')[0]}.</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mt-4 sm:mt-6">
            {t.modules.sectionSubtitle}
          </p>
        </motion.div>

        {/* Navigation Arrows */}
        <div className="flex justify-end gap-2 mb-4 sm:mb-6">
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
        className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4 snap-x snap-mandatory"
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
            className="shrink-0 w-[280px] sm:w-[320px] lg:w-[380px] snap-start"
          >
            <div className="group relative bg-card rounded-2xl sm:rounded-3xl overflow-hidden border border-border shadow-soft hover:shadow-strong transition-all duration-500 h-[400px] sm:h-[440px] lg:h-[480px]">
              {/* Image */}
              <div className="relative h-[180px] sm:h-[200px] lg:h-[240px] overflow-hidden">
                <img
                  src={module.image}
                  alt={module.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${module.color} opacity-60`} />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                
                {/* Icon Badge */}
                <div className="absolute top-4 left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-medium">
                  <module.icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">
                  {module.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 sm:mb-6">
                  {module.description}
                </p>
                <button className="text-sm font-semibold text-foreground flex items-center gap-2 group/btn">
                  {t.modules.explore}
                  <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-foreground/10 rounded-2xl sm:rounded-3xl transition-colors duration-300 pointer-events-none" />
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
