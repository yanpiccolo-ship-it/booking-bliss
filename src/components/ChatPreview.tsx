import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Cpu, User } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  typing?: boolean;
}

const ChatPreview = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const conversation: Message[] = [
    { id: 1, text: t.chat.messages.greeting, isBot: true },
    { id: 2, text: t.chat.messages.question, isBot: true },
    { id: 3, text: t.chat.messages.userResponse, isBot: false },
    { id: 4, text: t.chat.messages.confirmation, isBot: true },
  ];

  useEffect(() => {
    if (currentStep < conversation.length) {
      const timer = setTimeout(() => {
        setMessages((prev) => [...prev, { ...conversation[currentStep], typing: true }]);
        
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === conversation[currentStep].id ? { ...msg, typing: false } : msg
            )
          );
          setCurrentStep((prev) => prev + 1);
        }, conversation[currentStep].isBot ? 1200 : 600);
      }, currentStep === 0 ? 1000 : 2000);

      return () => clearTimeout(timer);
    } else {
      const resetTimer = setTimeout(() => {
        setMessages([]);
        setCurrentStep(0);
      }, 5000);
      return () => clearTimeout(resetTimer);
    }
  }, [currentStep, conversation]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="bg-card rounded-2xl sm:rounded-3xl shadow-float border border-border overflow-hidden">
        {/* Chat Header */}
        <div className="bg-foreground px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-background/20 flex items-center justify-center">
            <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-background" />
          </div>
          <div>
            <p className="text-background font-semibold text-sm">{t.chat.title}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-background/70 text-xs">{t.chat.status}</span>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-64 sm:h-72 overflow-y-auto p-3 sm:p-4 space-y-3 bg-muted/20">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-2 ${message.isBot ? "justify-start" : "justify-end"}`}
              >
                {message.isBot && (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
                    <Cpu className="w-3 h-3 sm:w-4 sm:h-4 text-background" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm ${
                    message.isBot
                      ? "bg-card border border-border text-foreground rounded-bl-lg"
                      : "bg-foreground text-background rounded-br-lg"
                  }`}
                >
                  {message.typing ? (
                    <div className="flex gap-1 py-1">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  ) : (
                    message.text
                  )}
                </div>
                {!message.isBot && (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Chat Input */}
        <div className="p-3 sm:p-4 border-t border-border bg-card">
          <div className="flex items-center gap-2 bg-muted rounded-xl px-3 sm:px-4 py-2 sm:py-2.5">
            <input
              type="text"
              placeholder={t.chat.inputPlaceholder}
              className="flex-1 bg-transparent text-xs sm:text-sm outline-none placeholder:text-muted-foreground"
              disabled
            />
            <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-foreground flex items-center justify-center hover:bg-foreground/90 transition-colors">
              <Send className="w-3 h-3 sm:w-4 sm:h-4 text-background" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatPreview;
