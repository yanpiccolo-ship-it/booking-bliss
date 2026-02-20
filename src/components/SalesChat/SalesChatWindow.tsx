import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSalesChat, ChatMessage } from "@/hooks/useSalesChat";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

const TypingIndicator = () => (
  <div className="flex gap-1 py-1 px-2">
    <motion.span 
      className="w-2 h-2 rounded-full bg-muted-foreground/50"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
    />
    <motion.span 
      className="w-2 h-2 rounded-full bg-muted-foreground/50"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
    />
    <motion.span 
      className="w-2 h-2 rounded-full bg-muted-foreground/50"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
    />
  </div>
);

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isBot = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn("flex gap-2", isBot ? "justify-start" : "justify-end")}
    >
      {isBot && (
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] px-3 py-2.5 rounded-2xl text-sm whitespace-pre-wrap",
          isBot
            ? "bg-muted text-foreground rounded-bl-md"
            : "bg-primary text-primary-foreground rounded-br-md"
        )}
      >
        {message.isTyping ? <TypingIndicator /> : message.content}
      </div>
      {!isBot && (
        <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </motion.div>
  );
};

const SalesChatWindow = () => {
  const { t } = useLanguage();
  const { messages, isLoading, isConnected, sendMessage, clearChat } = useSalesChat();
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue("");
    await sendMessage(message);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Quick action suggestions
  const quickActions = [
    t.salesChat?.quickAction1 || "I want to know more",
    t.salesChat?.quickAction2 || "Request a demo",
    t.salesChat?.quickAction3 || "See pricing"
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages Area */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>

          {/* Quick actions - show only at start */}
          {messages.length <= 1 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2 mt-4"
            >
              {quickActions.map((action, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs rounded-full"
                  onClick={() => sendMessage(action)}
                >
                  {action}
                </Button>
              ))}
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Connection Status */}
      {!isConnected && (
        <div className="px-4 py-2 bg-destructive/10 text-destructive text-xs flex items-center justify-between">
          <span>{t.salesChat?.connectionError || "Connection lost"}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={clearChat}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            {t.salesChat?.retry || "Retry"}
          </Button>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.salesChat?.inputPlaceholder || "Type your message..."}
            disabled={isLoading}
            className="flex-1 rounded-full bg-muted border-0 focus-visible:ring-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!inputValue.trim() || isLoading}
            className="h-10 w-10 rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Powered by footer */}
        <p className="text-center text-xs text-muted-foreground mt-3">
          {t.salesChat?.poweredBy || "Powered by"} FlowBooking AI
        </p>
      </form>
    </div>
  );
};

export default SalesChatWindow;
