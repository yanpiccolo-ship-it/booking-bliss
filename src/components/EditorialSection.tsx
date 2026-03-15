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
      <div className="relative aspect-[4/5] sm:aspect-[3/4] flex items-end">
        <div className="absolute inset-0">
          <img
            src={editorialFoodImage}
            alt="Restaurant ambiance"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
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

      {/* Second Panel - Grid with NO gap, photos stuck together, uniform height */}
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="relative aspect-[4/5] sm:aspect-[3/4]">
          <img
            src={editorialHospitality}
            alt="Hotel lobby"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="absolute bottom-0 left-0 p-5 sm:p-6 lg:p-8"
          >
            <span className="text-background/70 text-[10px] sm:text-xs font-medium tracking-widest uppercase">
              Hospitality
            </span>
            <h3 className="font-display text-lg sm:text-xl lg:text-2xl font-bold text-background mt-1">
              {t.editorial.panel2.left.title}
            </h3>
          </motion.div>
        </div>

        <div className="relative aspect-[4/5] sm:aspect-[3/4]">
          <img
            src={editorialWellness}
            alt="Wellness experience"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="absolute bottom-0 left-0 p-5 sm:p-6 lg:p-8"
          >
            <span className="text-background/70 text-[10px] sm:text-xs font-medium tracking-widest uppercase">
              Wellness
            </span>
            <h3 className="font-display text-lg sm:text-xl lg:text-2xl font-bold text-background mt-1">
              {t.editorial.panel2.right.title}
            </h3>
          </motion.div>
        </div>
      </div>

      {/* Third Panel - Full width, SAME height as above panels, NO margin/gap */}
      <div className="relative aspect-[4/5] sm:aspect-[2/1] lg:aspect-[21/9]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80"
            alt="Travel experience"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="absolute bottom-0 left-0 z-10 p-5 sm:p-6 lg:p-8 max-w-2xl"
        >
          <span className="text-background/70 text-[10px] sm:text-xs font-medium tracking-widest uppercase">
            Travel & Experiences
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-background mt-1 mb-2">
            {t.editorial.panel3.title}
          </h2>
          <p className="text-sm sm:text-base text-background/80 max-w-lg">
            {t.editorial.panel3.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default EditorialSection;
