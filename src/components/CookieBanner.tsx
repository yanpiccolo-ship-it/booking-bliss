import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "flowbooking_cookie_consent";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = (level: "all" | "essential" | "custom") => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ level, date: new Date().toISOString() }));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-[100] max-w-lg mx-auto"
        >
          <div className="rounded-2xl bg-card border border-border shadow-strong p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-foreground text-sm mb-1">Cookies</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Usamos cookies para mejorar tu experiencia, analizar el tráfico y personalizar el contenido. Puedes aceptarlas todas, rechazarlas o configurar cuáles permitir.
                </p>
              </div>
              <button onClick={() => accept("essential")} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => accept("all")}
                className="flex-1 rounded-xl h-10 text-xs font-semibold"
              >
                Aceptar todas
              </Button>
              <Button
                variant="outline"
                onClick={() => accept("essential")}
                className="flex-1 rounded-xl h-10 text-xs font-semibold"
              >
                Solo esenciales
              </Button>
              <Button
                variant="ghost"
                onClick={() => accept("custom")}
                className="rounded-xl h-10 text-xs font-semibold px-3"
              >
                Configurar
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground/60 mt-2 text-center">
              Al continuar navegando sin elegir, solo se usarán cookies esenciales.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
