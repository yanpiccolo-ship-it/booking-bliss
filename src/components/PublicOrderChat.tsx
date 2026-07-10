import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

interface PublicOrderChatProps {
  businessId: string;
  businessName?: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const PublicOrderChat = ({ businessId, businessName }: PublicOrderChatProps) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: `Hi! I'm ${businessName ?? "the"} assistant. I can show you our menu, take orders, or answer questions. How can I help?`,
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const r = await fetch(`${SUPABASE_URL}/functions/v1/public-order-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PUBLISHABLE_KEY}`,
          apikey: PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ businessId, messages: next }),
      });
      const data = await r.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.reply ?? data.error ?? "Sorry, something went wrong.",
        },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-foreground text-background shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm h-[560px] bg-background rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-foreground text-background">
            <div>
              <p className="text-sm font-semibold">{businessName ?? "Assistant"}</p>
              <p className="text-xs opacity-70">AI · Online</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-foreground text-background rounded-br-sm"
                      : "bg-background border border-border rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-background border border-border rounded-2xl px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" /> Thinking…
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="p-3 border-t border-border bg-background flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
              placeholder="Ask about the menu or place an order…"
              className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={loading}
            />
            <Button size="icon" onClick={send} disabled={loading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicOrderChat;
