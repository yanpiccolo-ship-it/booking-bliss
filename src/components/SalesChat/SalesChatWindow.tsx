import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSalesChat, ChatMessage } from "@/hooks/useSalesChat";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import avatarImg from "@/assets/beeflow-avatar.png";

const CREAM = "#f5efe6";
const DARK = "#1a1a1a";

const TypingIndicator = () => (
  <div className="flex gap-1 py-1 px-2">
    {[0, 0.15, 0.3].map((d, i) => (
      <motion.span
        key={i}
        className="w-2 h-2 rounded-full bg-black/30"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, delay: d }}
      />
    ))}
  </div>
);

const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const isBot = message.role === "assistant";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn("flex gap-2 items-end", isBot ? "justify-start" : "justify-end")}
    >
      {isBot && (
        <img
          src={avatarImg}
          alt=""
          width={32}
          height={32}
          className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
          loading="lazy"
        />
      )}
      <div
        className={cn(
          "max-w-[78%] px-4 py-2.5 rounded-3xl text-sm whitespace-pre-wrap shadow-sm",
          isBot
            ? "bg-white text-neutral-900 rounded-bl-md"
            : "text-white rounded-br-md"
        )}
        style={!isBot ? { backgroundColor: DARK } : undefined}
      >
        {message.isTyping ? <TypingIndicator /> : message.content}
      </div>
    </motion.div>
  );
};

const SalesChatWindow = () => {
  const { t } = useLanguage();
  const { messages, isLoading, isConnected, sendMessage, clearChat } = useSalesChat();
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const message = inputValue.trim();
    setInputValue("");
    await sendMessage(message);
    inputRef.current?.focus();
  };

  const quickActions = [
    t.salesChat?.quickAction1 || "What products do you offer?",
    t.salesChat?.quickAction2 || "Pricing & plans",
    t.salesChat?.quickAction3 || "Book a demo",
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: CREAM }}>
      <ScrollArea ref={scrollRef} className="flex-1 px-4 pt-5">
        <div className="space-y-3 pb-2">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Quick actions chips */}
      {messages.length <= 1 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-4 pb-3 pt-2 flex flex-wrap gap-2 justify-center"
        >
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => sendMessage(action)}
              className="text-xs px-3.5 py-2 rounded-full bg-white/70 border border-black/10 text-neutral-800 hover:bg-white transition"
            >
              {action}
            </button>
          ))}
        </motion.div>
      )}

      {!isConnected && (
        <div className="px-4 py-2 bg-destructive/10 text-destructive text-xs flex items-center justify-between">
          <span>{t.salesChat?.connectionError || "Connection lost"}</span>
          <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clearChat}>
            <RefreshCw className="h-3 w-3 mr-1" />
            {t.salesChat?.retry || "Retry"}
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-3 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.salesChat?.inputPlaceholder || "Type your message..."}
            disabled={isLoading}
            className="flex-1 h-12 px-5 rounded-full bg-white/90 border border-black/5 text-sm outline-none placeholder:text-neutral-400 focus:border-black/20"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="h-12 w-12 rounded-2xl flex items-center justify-center text-white disabled:opacity-50 transition hover:scale-105"
            style={{ backgroundColor: DARK }}
            aria-label="Send"
          >
            <Send className="h-5 w-5 -rotate-12" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalesChatWindow;
