import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { languages } from "@/i18n/translations";

interface LanguageSelectorProps {
  isScrolled?: boolean;
}

const LanguageSelector = ({ isScrolled = true }: LanguageSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-1.5 px-2 py-1 text-xs font-medium transition-all duration-300 rounded-full ${
          isScrolled
            ? "text-muted-foreground hover:text-foreground"
            : "text-background/70 hover:text-background"
        }`}
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="uppercase tracking-wide">{language}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 top-full mt-2 z-50"
          >
            <div className="bg-background/95 backdrop-blur-xl border border-border/60 rounded-xl shadow-lg overflow-hidden min-w-[160px]">
              <div className="flex flex-col py-1" role="listbox">
                {languages.map((lang) => {
                  const active = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        setLanguage(lang.code);
                        setOpen(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-muted/70 ${
                        active ? "text-foreground font-semibold" : "text-muted-foreground"
                      }`}
                    >
                      <span className="w-6 text-[10px] uppercase tracking-wider opacity-60">
                        {lang.label}
                      </span>
                      <span className="flex-1 text-left">{lang.name}</span>
                      {active && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
