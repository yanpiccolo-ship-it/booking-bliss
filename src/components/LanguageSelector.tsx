import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { languages } from "@/i18n/translations";

interface LanguageSelectorProps {
  isScrolled?: boolean;
}

const LanguageSelector = ({ isScrolled = true }: LanguageSelectorProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { language, setLanguage } = useLanguage();

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Trigger Button - Minimal & Subtle */}
      <button
        className={`flex items-center gap-1 px-2 py-1 text-xs font-medium transition-all duration-300 rounded-full ${
          isScrolled 
            ? "text-muted-foreground hover:text-foreground" 
            : "text-background/70 hover:text-background"
        }`}
      >
        <Globe className={`w-3 h-3 transition-transform duration-300 ${isHovered ? 'rotate-12 scale-110' : ''}`} />
        <span className="uppercase tracking-wide">{language}</span>
      </button>

      {/* Dropdown - Appears on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ 
              duration: 0.2, 
              ease: [0.4, 0, 0.2, 1] 
            }}
            className="absolute right-0 top-full mt-1 z-50"
          >
            {/* Glass Card */}
            <motion.div 
              className="glass border border-border/50 rounded-xl shadow-medium overflow-hidden backdrop-blur-xl"
              initial={{ backdropFilter: "blur(0px)" }}
              animate={{ backdropFilter: "blur(20px)" }}
            >
              <div className="flex flex-col py-1">
                {languages.map((lang, index) => (
                  <motion.button
                    key={lang.code}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.15 }}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs transition-all duration-200 hover:bg-muted/50 min-w-[100px] ${
                      language === lang.code 
                        ? "bg-muted/70 text-foreground font-semibold" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="w-5 font-semibold text-[10px] uppercase tracking-wider opacity-60">
                      {lang.label}
                    </span>
                    <span className="text-xs">{lang.name}</span>
                    {language === lang.code && (
                      <motion.div
                        layoutId="activeLanguage"
                        className="ml-auto w-1 h-1 rounded-full bg-foreground"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
