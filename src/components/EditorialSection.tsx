import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import editorialFoodImage from "@/assets/editorial-food.jpg";
import editorialWellness from "@/assets/editorial-wellness.jpg";
import editorialHospitality from "@/assets/editorial-hospitality.jpg";

const EditorialSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      {/* First Panel - Full bleed image with text overlay */}
      <div className="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src={editorialFoodImage}
            alt="Restaurant ambiance"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="text-background/70 text-xs sm:text-sm font-medium tracking-widest uppercase">
              {t.editorial.panel1.title.split(' ')[0]}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-background mt-4 mb-4 sm:mb-6 leading-[1.1]">
              {t.editorial.panel1.title}
            </h2>
            <p className="text-base sm:text-lg text-background/80 mb-6 sm:mb-8 max-w-lg">
              {t.editorial.panel1.description}
            </p>
            <button className="flex items-center gap-2 text-background font-semibold group">
              {t.editorial.panel1.cta}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Second Panel - Split layout */}
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[50vh] sm:min-h-[60vh] lg:min-h-[80vh]">
          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80"
            alt="Hotel lobby"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12"
          >
            <span className="text-background/70 text-xs font-medium tracking-widest uppercase">
              Hospitality
            </span>
            <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-background mt-2">
              {t.editorial.panel2.left.title}
            </h3>
          </motion.div>
        </div>

        <div className="relative min-h-[50vh] sm:min-h-[60vh] lg:min-h-[80vh]">
          <img
            src={editorialWellness}
            alt="Wellness experience"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12"
          >
            <span className="text-background/70 text-xs font-medium tracking-widest uppercase">
              Wellness
            </span>
            <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-background mt-2">
              {t.editorial.panel2.right.title}
            </h3>
          </motion.div>
        </div>
      </div>

      {/* Third Panel - Full width with centered text */}
      <div className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80"
            alt="Travel experience"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/50" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10 text-center px-4"
        >
          <span className="text-background/70 text-xs sm:text-sm font-medium tracking-widest uppercase">
            Travel & Experiences
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-bold text-background mt-4 mb-4 sm:mb-6">
            {t.editorial.panel3.title}
          </h2>
          <p className="text-base sm:text-lg text-background/80 max-w-xl mx-auto mb-8">
            {t.editorial.panel3.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default EditorialSection;
