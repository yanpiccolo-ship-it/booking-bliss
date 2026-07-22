import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SalesChatWindow from "./SalesChatWindow";
import { useLanguage } from "@/i18n/LanguageContext";
import heroImg from "@/assets/beeflow-hero.jpg";

const BURGUNDY = "#6b1e2d";
const CREAM = "#f5efe6";

const SalesChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { t } = useLanguage();

  const toggleChat = () => {
    if (isMinimized) setIsMinimized(false);
    else setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      <AnimatePresence>
        {(!isOpen || isMinimized) && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={toggleChat}
              size="lg"
              className="h-14 w-14 rounded-full shadow-float hover:scale-105 transition-all duration-300"
              style={{ backgroundColor: BURGUNDY, color: "#fff" }}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ backgroundColor: `${BURGUNDY}55` }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] h-[640px] max-h-[calc(100vh-80px)] flex flex-col rounded-3xl overflow-hidden shadow-float"
            style={{ backgroundColor: CREAM }}
          >
            {/* Hero image */}
            <div className="relative h-32 w-full overflow-hidden flex-shrink-0">
              <img
                src={heroImg}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Header burgundy band */}
            <div
              className="relative px-5 py-4 flex items-center justify-between flex-shrink-0"
              style={{ backgroundColor: BURGUNDY }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-full border-[3px] border-white flex items-center justify-center flex-shrink-0 -mt-8 shadow-lg"
                  style={{ backgroundColor: CREAM }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#1a1a1a" }}
                  >
                    <div className="w-6 h-[2px] bg-white" />
                  </div>
                </div>
                <div className="text-white">
                  <p className="font-serif text-lg leading-tight">
                    {t.salesChat?.title || "Bee Flow"}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs opacity-80">
                    <span className="w-2 h-2 rounded-full bg-[#c9b98a]" />
                    <span>Online — AI Sales Assistant</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
                  onClick={() => setIsMinimized(true)}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
                  onClick={closeChat}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <SalesChatWindow />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SalesChatWidget;
