import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const WELCOME_KEY = "flowbooking_welcome_seen";

const WelcomeModal = () => {
  const [visible, setVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(WELCOME_KEY);
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleContinue = () => {
    if (!accepted) return;
    localStorage.setItem(WELCOME_KEY, JSON.stringify({ accepted: true, date: new Date().toISOString() }));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-foreground/50 backdrop-blur-sm px-5"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-sm rounded-3xl bg-card border border-border shadow-strong p-6"
          >
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 shadow-medium">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground mb-2">Tu sistema ya está activo</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tus agentes están listos para atender, tu agenda acepta reservas y tus módulos están configurados para tu tipo de negocio.
              </p>
            </div>

            <div className="rounded-2xl bg-muted/50 p-4 mb-5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Este sistema incluye automatizaciones de atención, reservas y gestión básica activadas por defecto para que tu negocio funcione desde el primer día.
                Puedes pausar, ajustar o desactivar cualquier función en cualquier momento desde tu panel de control. Nada se ejecuta fuera de lo que aquí autorices.
              </p>
            </div>

            <div className="flex items-start gap-3 mb-5">
              <Checkbox
                id="accept-automation"
                checked={accepted}
                onCheckedChange={(checked) => setAccepted(checked === true)}
                className="mt-0.5"
              />
              <label htmlFor="accept-automation" className="text-xs text-foreground leading-relaxed cursor-pointer">
                Entiendo y acepto el funcionamiento automatizado del sistema.
              </label>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleContinue}
                disabled={!accepted}
                className="flex-1 rounded-xl h-11 gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Continuar al panel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;
