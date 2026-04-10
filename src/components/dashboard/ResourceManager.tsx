import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Layers, Box, Clock, Users } from "lucide-react";

interface ResourceManagerProps {
  businessId: string;
}

interface ResourceType {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
}

interface Resource {
  id: string;
  name: string;
  capacity: number;
  status: string;
  resource_type_id: string;
  resource_types?: { name: string } | null;
}

interface AvailabilityRule {
  id: string;
  resource_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  buffer_before: number;
  buffer_after: number;
  is_active: boolean;
}

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const ResourceManager = ({ businessId }: ResourceManagerProps) => {
  const { toast } = useToast();
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [loading, setLoading] = useState(true);

  // Type form
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeName, setTypeName] = useState("");
  const [typeCapacity, setTypeCapacity] = useState(1);

  // Resource form
  const [resOpen, setResOpen] = useState(false);
  const [resName, setResName] = useState("");
  const [resCapacity, setResCapacity] = useState(1);
  const [resTypeId, setResTypeId] = useState("");

  // Rule form
  const [ruleOpen, setRuleOpen] = useState(false);
  const [ruleResourceId, setRuleResourceId] = useState("");
  const [ruleDow, setRuleDow] = useState(1);
  const [ruleStart, setRuleStart] = useState("09:00");
  const [ruleEnd, setRuleEnd] = useState("18:00");

  useEffect(() => {
    loadAll();
  }, [businessId]);

  const loadAll = async () => {
    setLoading(true);
    const [typesRes, resRes, rulesRes] = await Promise.all([
      supabase.from("resource_types").select("*").eq("business_id", businessId),
      supabase.from("resources").select("*, resource_types(name)").eq("business_id", businessId),
      supabase.from("availability_rules").select("*").eq("business_id", businessId),
    ]);
    setResourceTypes((typesRes.data as any) || []);
    setResources((resRes.data as any) || []);
    setRules((rulesRes.data as any) || []);
    setLoading(false);
  };

  const createType = async () => {
    if (!typeName.trim()) return;
    const { error } = await supabase.from("resource_types").insert({
      business_id: businessId,
      name: typeName.trim(),
      capacity: typeCapacity,
    } as any);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Tipo creado ✅" });
      setTypeOpen(false);
      setTypeName("");
      loadAll();
    }
  };

  const createResource = async () => {
    if (!resName.trim() || !resTypeId) return;
    const { error } = await supabase.from("resources").insert({
      business_id: businessId,
      resource_type_id: resTypeId,
      name: resName.trim(),
      capacity: resCapacity,
    } as any);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Recurso creado ✅" });
      setResOpen(false);
      setResName("");
      loadAll();
    }
  };

  const createRule = async () => {
    if (!ruleResourceId) return;
    const { error } = await supabase.from("availability_rules").insert({
      business_id: businessId,
      resource_id: ruleResourceId,
      day_of_week: ruleDow,
      start_time: ruleStart,
      end_time: ruleEnd,
    } as any);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Regla creada ✅" });
      setRuleOpen(false);
      loadAll();
    }
  };

  const deleteItem = async (table: string, id: string) => {
    if (!confirm("¿Eliminar?")) return;
    await supabase.from(table).delete().eq("id", id);
    loadAll();
  };

  if (loading) {
    return <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 rounded-2xl bg-muted animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Resource Types */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Layers className="w-4 h-4 text-violet-400" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Tipos de Recurso</h3>
          </div>
          <Dialog open={typeOpen} onOpenChange={setTypeOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="rounded-xl gap-1"><Plus className="w-3 h-3" />Nuevo</Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl max-w-sm">
              <DialogHeader><DialogTitle>Nuevo tipo de recurso</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                <div><Label>Nombre</Label><Input placeholder="Ej: Mesa, Habitación, Staff..." value={typeName} onChange={e => setTypeName(e.target.value)} /></div>
                <div><Label>Capacidad por defecto</Label><Input type="number" min={1} value={typeCapacity} onChange={e => setTypeCapacity(+e.target.value || 1)} /></div>
                <Button className="w-full rounded-xl" onClick={createType}>Crear</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {resourceTypes.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">Sin tipos configurados</p>
        ) : (
          <div className="space-y-2">
            {resourceTypes.map(rt => (
              <div key={rt.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                <div>
                  <p className="text-sm font-medium text-foreground">{rt.name}</p>
                  <p className="text-xs text-muted-foreground">Capacidad: {rt.capacity}</p>
                </div>
                <button onClick={() => deleteItem("resource_types", rt.id)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-red-500/20">
                  <Trash2 className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Resources */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Box className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Recursos</h3>
          </div>
          <Dialog open={resOpen} onOpenChange={setResOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="rounded-xl gap-1" disabled={resourceTypes.length === 0}><Plus className="w-3 h-3" />Nuevo</Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl max-w-sm">
              <DialogHeader><DialogTitle>Nuevo recurso</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                <div><Label>Tipo</Label>
                  <Select value={resTypeId} onValueChange={setResTypeId}>
                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                    <SelectContent>{resourceTypes.map(rt => <SelectItem key={rt.id} value={rt.id}>{rt.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Nombre</Label><Input placeholder="Ej: Mesa 1, Room 101..." value={resName} onChange={e => setResName(e.target.value)} /></div>
                <div><Label>Capacidad</Label><Input type="number" min={1} value={resCapacity} onChange={e => setResCapacity(+e.target.value || 1)} /></div>
                <Button className="w-full rounded-xl" onClick={createResource}>Crear</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {resources.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">Sin recursos configurados</p>
        ) : (
          <div className="space-y-2">
            {resources.map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{r.name}</p>
                    <Badge variant={r.status === "active" ? "default" : "secondary"} className="text-[10px] px-1.5 py-0 rounded-full">{r.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" />{r.capacity} · {(r as any).resource_types?.name || "Sin tipo"}
                  </p>
                </div>
                <button onClick={() => deleteItem("resources", r.id)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-red-500/20">
                  <Trash2 className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Availability Rules */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Horarios de disponibilidad</h3>
          </div>
          <Dialog open={ruleOpen} onOpenChange={setRuleOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="rounded-xl gap-1" disabled={resources.length === 0}><Plus className="w-3 h-3" />Nuevo</Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl max-w-sm">
              <DialogHeader><DialogTitle>Nueva regla de disponibilidad</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                <div><Label>Recurso</Label>
                  <Select value={ruleResourceId} onValueChange={setRuleResourceId}>
                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                    <SelectContent>{resources.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Día</Label>
                  <Select value={String(ruleDow)} onValueChange={v => setRuleDow(+v)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>{DAY_NAMES.map((d, i) => <SelectItem key={i} value={String(i)}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Desde</Label><Input type="time" value={ruleStart} onChange={e => setRuleStart(e.target.value)} /></div>
                  <div><Label>Hasta</Label><Input type="time" value={ruleEnd} onChange={e => setRuleEnd(e.target.value)} /></div>
                </div>
                <Button className="w-full rounded-xl" onClick={createRule}>Crear</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {rules.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">Sin horarios configurados</p>
        ) : (
          <div className="space-y-2">
            {rules.map(rule => {
              const res = resources.find(r => r.id === rule.resource_id);
              return (
                <div key={rule.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                  <div>
                    <p className="text-sm font-medium text-foreground">{res?.name || "?"} — {DAY_NAMES[rule.day_of_week]}</p>
                    <p className="text-xs text-muted-foreground">{rule.start_time?.slice(0, 5)} – {rule.end_time?.slice(0, 5)}</p>
                  </div>
                  <button onClick={() => deleteItem("availability_rules", rule.id)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-red-500/20">
                    <Trash2 className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ResourceManager;
