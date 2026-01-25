import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface UseSalesChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isConnected: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

// Generate unique session ID
const getSessionId = (): string => {
  const key = "sales_chat_session_id";
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
};

export const useSalesChat = (): UseSalesChatReturn => {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const conversationIdRef = useRef<string | null>(null);
  const sessionId = useRef(getSessionId());
  const hasGreeted = useRef(false);

  // Send initial greeting when chat opens
  useEffect(() => {
    if (!hasGreeted.current && messages.length === 0) {
      hasGreeted.current = true;
      
      // Add initial greeting with typing animation
      const greetingId = `greeting_${Date.now()}`;
      setMessages([{
        id: greetingId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isTyping: true
      }]);

      // After "typing", show the greeting
      setTimeout(() => {
        setMessages([{
          id: greetingId,
          role: "assistant",
          content: t.salesChat?.greeting || "¡Hola! 👋 Soy el asistente de Booking Intelligence. ¿En qué puedo ayudarte hoy?",
          timestamp: new Date(),
          isTyping: false
        }]);
      }, 1200);
    }
  }, [t.salesChat?.greeting, messages.length]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessageId = `user_${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: content.trim(),
      timestamp: new Date()
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Add typing indicator
    const typingId = `typing_${Date.now()}`;
    setMessages(prev => [...prev, {
      id: typingId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isTyping: true
    }]);

    try {
      const { data, error } = await supabase.functions.invoke("sales-chat", {
        body: {
          session_id: sessionId.current,
          message: content.trim(),
          conversation_id: conversationIdRef.current,
          language
        }
      });

      if (error) {
        console.error("Chat error:", error);
        setIsConnected(false);
        // Remove typing indicator and show error
        setMessages(prev => prev.filter(m => m.id !== typingId).concat({
          id: `error_${Date.now()}`,
          role: "assistant",
          content: t.salesChat?.errorMessage || "Lo siento, hubo un error. Por favor intenta de nuevo.",
          timestamp: new Date()
        }));
        return;
      }

      setIsConnected(true);
      
      // Store conversation ID for future messages
      if (data.conversation_id) {
        conversationIdRef.current = data.conversation_id;
      }

      // Replace typing indicator with actual response
      setMessages(prev => prev.filter(m => m.id !== typingId).concat({
        id: `assistant_${Date.now()}`,
        role: "assistant",
        content: data.message,
        timestamp: new Date()
      }));

    } catch (error) {
      console.error("Chat request failed:", error);
      setIsConnected(false);
      setMessages(prev => prev.filter(m => !m.isTyping).concat({
        id: `error_${Date.now()}`,
        role: "assistant",
        content: t.salesChat?.errorMessage || "Lo siento, hubo un error de conexión.",
        timestamp: new Date()
      }));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, language, t.salesChat?.errorMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
    conversationIdRef.current = null;
    hasGreeted.current = false;
    // Generate new session
    sessionId.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("sales_chat_session_id", sessionId.current);
  }, []);

  return {
    messages,
    isLoading,
    isConnected,
    sendMessage,
    clearChat
  };
};
