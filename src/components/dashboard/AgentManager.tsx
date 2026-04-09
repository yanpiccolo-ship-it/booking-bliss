import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  Bot, Headphones, Calendar, TrendingUp, Settings as SettingsIcon,
  Plus, Edit3, Trash2, Save, X, Loader2, Sparkles, ToggleLeft, ToggleRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AGENT_ICONS: Record<string, React.ElementType> = {
  headphones: Headphones,
  calendar: Calendar,
  "trending-up": TrendingUp,
  settings: SettingsIcon,
  bot: Bot,
  mic: Mic,
};

const AI_MODELS = [
  { value: "google/gemini-3-flash-preview", label: "Gemini 3 Flash (rápido)" },
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash (balanced)" },
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro (potente)" },
  { value: "openai/gpt-5-mini", label: "GPT-5 Mini (balanced)" },
  { value: "openai/gpt-5", label: "GPT-5 (máxima calidad)" },
  { value: "google/gemini-2.5-flash-image", label: "Nano Banana (imágenes)" },
];

interface Agent {
  id: string;
  name: string;
  agent_type: string;
  description: string | null;
  system_prompt: string;
  ai_model: string;
  is_active: boolean;
  icon: string;
  color: string;
  requires_authorization: boolean;
}

const AgentManager = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  useEffect(() => { loadAgents(); }, []);

  const loadAgents = async () => {
    const { data } = await supabase
      .from("ai_agents")
      .select("*")
      .order("created_at");
    setAgents((data as Agent[]) || []);
    setLoading(false);
  };

  const toggleAgent = async (agent: Agent) => {
    const { error } = await supabase
      .from("ai_agents")
      .update({ is_active: !agent.is_active })
      .eq("id", agent.id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      return;
    }
    setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, is_active: !a.is_active } : a));
  };

  const saveAgent = async () => {
    if (!editingAgent) return;
    const { error } = await supabase
      .from("ai_agents")
      .update({
        name: editingAgent.name,
        description: editingAgent.description,
        system_prompt: editingAgent.system_prompt,
        ai_model: editingAgent.ai_model,
        requires_authorization: editingAgent.requires_authorization,
      })
      .eq("id", editingAgent.id);
    
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      return;
    }
    toast({ title: "Agente actualizado" });
    setEditingAgent(null);
    loadAgents();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Editing view
  if (editingAgent) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-foreground">Editar: {editingAgent.name}</h3>
          <div className="flex gap-2">
            <button onClick={() => setEditingAgent(null)} className="px-3 py-2 rounded-xl bg-muted text-sm font-medium flex items-center gap-1.5">
              <X className="w-4 h-4" /> Cancelar
            </button>
            <button onClick={saveAgent} className="px-3 py-2 rounded-xl bg-foreground text-background text-sm font-medium flex items-center gap-1.5">
              <Save className="w-4 h-4" /> Guardar
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Nombre</label>
            <input
              value={editingAgent.name}
              onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-muted text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Descripción</label>
            <input
              value={editingAgent.description || ""}
              onChange={(e) => setEditingAgent({ ...editingAgent, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-muted text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Modelo IA</label>
            <select
              value={editingAgent.ai_model}
              onChange={(e) => setEditingAgent({ ...editingAgent, ai_model: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-muted text-sm outline-none"
            >
              {AI_MODELS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">System Prompt</label>
            <textarea
              value={editingAgent.system_prompt}
              onChange={(e) => setEditingAgent({ ...editingAgent, system_prompt: e.target.value })}
              rows={12}
              className="w-full px-4 py-3 rounded-xl bg-muted text-sm outline-none resize-y font-mono"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-muted">
            <div>
              <p className="text-sm font-medium text-foreground">Requiere autorización</p>
              <p className="text-xs text-muted-foreground">No automatiza sin consentimiento del cliente</p>
            </div>
            <button
              onClick={() => setEditingAgent({ ...editingAgent, requires_authorization: !editingAgent.requires_authorization })}
              className="text-foreground"
            >
              {editingAgent.requires_authorization ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-muted-foreground" />}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Agent list
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground mb-1">Agentes IA</h2>
        <p className="text-muted-foreground text-sm">Pre-entrenados con prompts controlados por admin</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {agents.map((agent, i) => {
          const Icon = AGENT_ICONS[agent.icon] || Bot;
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-2xl bg-card border border-border shadow-soft p-5 ${!agent.is_active ? "opacity-50" : ""}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: agent.color + "20" }}
                  >
                    <Icon className="w-6 h-6" style={{ color: agent.color }} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">{agent.name}</h3>
                    <p className="text-xs text-muted-foreground">{agent.agent_type}</p>
                  </div>
                </div>
                <button onClick={() => toggleAgent(agent)}>
                  {agent.is_active ? (
                    <ToggleRight className="w-7 h-7 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-muted-foreground" />
                  )}
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{agent.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">{agent.ai_model.split("/")[1]}</span>
                </div>
                <button
                  onClick={() => setEditingAgent(agent)}
                  className="px-3 py-1.5 rounded-lg bg-muted text-xs font-medium text-foreground flex items-center gap-1 hover:bg-muted/80 transition-colors"
                >
                  <Edit3 className="w-3 h-3" /> Editar prompt
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AgentManager;
