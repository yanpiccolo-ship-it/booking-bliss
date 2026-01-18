import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  typing?: boolean;
}

const ChatPreview = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const conversation: Message[] = [
    { id: 1, text: "¡Hola! 👋 Bienvenido a Wellness Spa. ¿En qué puedo ayudarte hoy?", isBot: true },
    { id: 2, text: "Hi! I'd like to book a massage for this weekend", isBot: false },
    { id: 3, text: "Perfect! I'd love to help you book a massage. We have availability on Saturday at 10am, 2pm, and 4pm. Which works best for you?", isBot: true },
    { id: 4, text: "2pm sounds great!", isBot: false },
    { id: 5, text: "Excellent choice! ✨ Saturday at 2pm is confirmed. To secure your spot, I'll send you a quick payment link. Your relaxation awaits!", isBot: true },
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
      // Reset after conversation ends
      const resetTimer = setTimeout(() => {
        setMessages([]);
        setCurrentStep(0);
      }, 5000);
      return () => clearTimeout(resetTimer);
    }
  }, [currentStep]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="bg-card rounded-2xl shadow-strong border border-border overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-primary px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-primary-foreground font-semibold text-sm">AI Concierge</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
              <span className="text-primary-foreground/80 text-xs">Online 24/7</span>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-72 overflow-y-auto p-4 space-y-3 bg-muted/30">
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
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                    message.isBot
                      ? "bg-card border border-border text-foreground rounded-bl-md"
                      : "bg-gradient-primary text-primary-foreground rounded-br-md"
                  }`}
                >
                  {message.typing ? (
                    <div className="flex gap-1 py-1">
                      <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  ) : (
                    message.text
                  )}
                </div>
                {!message.isBot && (
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Chat Input */}
        <div className="p-3 border-t border-border bg-card">
          <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              disabled
            />
            <button className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
              <Send className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatPreview;
