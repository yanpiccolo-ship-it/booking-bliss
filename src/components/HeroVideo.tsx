import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const HeroVideo = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80"
        >
          <source 
            src="https://player.vimeo.com/external/449623542.sd.mp4?s=1b7c00dd42a3ddb5f50a81b46a5c2f0d8c4f3fb9&profile_id=164&oauth2_token_id=57447761" 
            type="video/mp4" 
          />
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center pt-20 lg:pt-0">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Eyebrow */}
            <span className="inline-block text-background/80 text-xs sm:text-sm font-medium tracking-widest uppercase mb-4 sm:mb-6">
              {t.hero.badge}
            </span>

            {/* Headline - Apple style: large, bold, left-aligned */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-background leading-[1.1] mb-6 sm:mb-8">
              {t.hero.title}
              <br />
              <span className="italic font-light">{t.hero.titleHighlight}</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg lg:text-xl text-background/80 max-w-xl mb-8 sm:mb-10 leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/request-demo")}
                className="bg-background text-foreground hover:bg-background/90 font-semibold px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-base"
              >
                {t.hero.cta}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
              <Link to="/demo">
                <Button 
                  size="lg" 
                  className="border border-background/50 bg-transparent text-background hover:bg-background/10 h-12 sm:h-14 text-sm sm:text-base w-full sm:w-auto"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {t.hero.ctaSecondary}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator - Hidden on mobile */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="hidden sm:block absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-background/40 rounded-full flex justify-center"
          >
            <motion.div 
              className="w-1.5 h-1.5 bg-background/60 rounded-full mt-2"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroVideo;
