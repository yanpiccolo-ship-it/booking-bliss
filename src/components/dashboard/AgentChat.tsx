import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { 
  Bot, Send, Headphones, Calendar, TrendingUp, Settings as SettingsIcon,
  ArrowLeft, Sparkles, Loader2, Mic, ShieldCheck, ShieldX
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";

const AGENT_ICONS: Record<string, React.ElementType> = {
  headphones: Headphones,
  calendar: Calendar,
  "trending-up": TrendingUp,
  settings: SettingsIcon,
  bot: Bot,
  mic: Mic,
};

interface Agent {
  id: string;
  name: string;
  agent_type: string;
  description: string;
  icon: string;
  color: string;
  ai_model: string;
  requires_authorization: boolean;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  requires_authorization?: boolean;
  authorized?: boolean | null;
  message_id?: string;
}

interface AgentChatProps {
  businessId: string | null;
  onBack: () => void;
}

const AuthorizationBanner = ({ 
  message, 
  onAuthorize, 
  onReject 
}: { 
  message: Message; 
  onAuthorize: () => void; 
  onReject: () => void; 
}) => {
  if (!message.requires_authorization) return null;
  if (message.authorized === true) {
    return (
      <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-medium">
        <ShieldCheck className="w-3.5 h-3.5" /> Autorizado
      </div>
    );
  }
  if (message.authorized === false) {
    return (
      <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-medium">
        <ShieldX className="w-3.5 h-3.5" /> Rechazado
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 mt-3">
      <button
        onClick={onAuthorize}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"
      >
        <ShieldCheck className="w-3.5 h-3.5" /> Autorizar
      </button>
      <button
        onClick={onReject}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/80 transition-colors"
      >
        <ShieldX className="w-3.5 h-3.5" /> Rechazar
      </button>
    </div>
  );
};

const AgentChat = ({ businessId, onBack }: AgentChatProps) => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadAgents(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const loadAgents = async () => {
    const { data } = await supabase
      .from("ai_agents")
      .select("id, name, agent_type, description, icon, color, ai_model, requires_authorization")
      .eq("is_active", true);
    setAgents((data as Agent[]) || []);
    setLoadingAgents(false);
  };

  const selectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setMessages([]);
    setConversationId(null);
    setInput("");
  };

  const handleAuthorization = async (msgIndex: number, authorized: boolean) => {
    setMessages(prev => prev.map((m, i) => i === msgIndex ? { ...m, authorized } : m));
    
    const msg = messages[msgIndex];
    if (msg.message_id) {
      await supabase.from("agent_messages").update({ authorized }).eq("id", msg.message_id);
    }
    
    toast({
      title: authorized ? "Acción autorizada" : "Acción rechazada",
      description: authorized 
        ? "El agente procederá con la acción propuesta." 
        : "El agente no ejecutará esta acción.",
    });
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedAgent || isLoading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-chat`;
      
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          agent_id: selectedAgent.id,
          conversation_id: conversationId,
          message: userMsg.content,
          business_id: businessId,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Error desconocido" }));
        throw new Error(err.error || `Error ${resp.status}`);
      }

      const convId = resp.headers.get("X-Conversation-Id");
      if (convId) setConversationId(convId);

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {}
        }
      }

      // Check if response contains authorization keywords and agent requires authorization
      if (selectedAgent.requires_authorization && assistantContent) {
        const authKeywords = ["autorización", "autorizar", "¿desea que", "¿quiere que", "¿procedemos", "¿confirma", "authorize", "shall i", "should i proceed", "do you want me to"];
        const needsAuth = authKeywords.some(kw => assistantContent.toLowerCase().includes(kw));
        if (needsAuth) {
          setMessages(prev => prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, requires_authorization: true, authorized: null } : m
          ));
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `⚠️ Error: ${e instanceof Error ? e.message : "No se pudo conectar con el agente."}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const AgentIcon = selectedAgent ? (AGENT_ICONS[selectedAgent.icon] || Bot) : Bot;

  // Agent selection screen
  if (!selectedAgent) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
        <div className="flex items-center gap-3 px-5 pt-4 pb-3">
          <button onClick={onBack} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-display font-bold text-lg text-foreground">Agentes IA</h2>
            <p className="text-xs text-muted-foreground">Pre-entrenados · Diagnóstico primero</p>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-5 pb-5">
          {loadingAgents ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {agents.map((agent, i) => {
                const Icon = AGENT_ICONS[agent.icon] || Bot;
                return (
                  <motion.button
                    key={agent.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => selectAgent(agent)}
                    className="text-left p-4 rounded-2xl bg-card border border-border shadow-soft hover:shadow-medium hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: agent.color + "20" }}
                      >
                        <Icon className="w-5 h-5" style={{ color: agent.color }} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display font-bold text-sm text-foreground">{agent.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{agent.description}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <Sparkles className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">{agent.ai_model.split("/")[1]}</span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Chat screen
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-border">
        <button onClick={() => setSelectedAgent(null)} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: selectedAgent.color + "20" }}
        >
          <AgentIcon className="w-5 h-5" style={{ color: selectedAgent.color }} />
        </div>
        <div>
          <h2 className="font-display font-bold text-sm text-foreground">{selectedAgent.name}</h2>
          <p className="text-[10px] text-muted-foreground">
            {isLoading ? "Escribiendo..." : "Diagnóstica · No automatiza sin autorización"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-5 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div
              className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4"
              style={{ backgroundColor: selectedAgent.color + "15" }}
            >
              <AgentIcon className="w-8 h-8" style={{ color: selectedAgent.color }} />
            </div>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Hola, soy {selectedAgent.name}. Cuéntame en qué puedo ayudarte y empezaré diagnosticando tu necesidad.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[85%] ${msg.role === "user" ? "" : ""}`}>
              <div
                className={`rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-foreground text-background rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === "assistant" && (
                <AuthorizationBanner
                  message={msg}
                  onAuthorize={() => handleAuthorization(i, true)}
                  onReject={() => handleAuthorization(i, false)}
                />
              )}
            </div>
          </motion.div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-5 pb-5 pt-2">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="flex items-center gap-2 bg-muted rounded-2xl px-4 py-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta..."
            className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center disabled:opacity-40 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AgentChat;
