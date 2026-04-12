import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Plus, Users, Clock, DollarSign } from "lucide-react";

interface CoursesAppProps { businessId: string; }
interface Curso { id: string; nombre: string; nivel: string; duracion: string; precio: number; inscritos: number; capacidad: number; }

const MOCK_CURSOS: Curso[] = [
  { id: "1", nombre: "Yoga para principiantes", nivel: "Básico", duracion: "8 semanas", precio: 120, inscritos: 8, capacidad: 15 },
  { id: "2", nombre: "Cocina mediterránea", nivel: "Intermedio", duracion: "4 semanas", precio: 200, inscritos: 12, capacidad: 12 },
  { id: "3", nombre: "Fotografía digital", nivel: "Avanzado", duracion: "6 semanas", precio: 180, inscritos: 5, capacidad: 10 },
];

const NIVEL_COLORS: Record<string, string> = {
  "Básico": "bg-emerald-100 text-emerald-700",
  "Intermedio": "bg-amber-100 text-amber-700",
  "Avanzado": "bg-violet-100 text-violet-700",
};

const CoursesApp = ({ businessId }: CoursesAppProps) => {
  const [cursos, setCursos] = useState<Curso[]>(MOCK_CURSOS);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ nombre: "", nivel: "Básico", duracion: "", precio: 0, capacidad: 15 });
  const { toast } = useToast();

  const handleSave = () => {
    if (!form.nombre) return;
    setCursos(prev => [...prev, { id: Date.now().toString(), ...form, inscritos: 0 }]);
    toast({ title: "Curso creado ✅" });
    setOpenDialog(false);
  };

  const totalInscritos = cursos.reduce((a, c) => a + c.inscritos, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold">Cursos & Clases</h2>
          <p className="text-xs text-muted-foreground">Clases · Inscripciones · Niveles</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Card className="rounded-2xl border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-indigo-500">{cursos.length}</p>
            <p className="text-xs text-muted-foreground">Cursos</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-emerald-500">{totalInscritos}</p>
            <p className="text-xs text-muted-foreground">Inscritos</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-amber-500">
              {Math.round((totalInscritos / cursos.reduce((a, c) => a + c.capacidad, 0)) * 100)}%
            </p>
            <p className="text-xs text-muted-foreground">Ocupación</p>
          </CardContent>
        </Card>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white gap-1">
            <Plus className="w-4 h-4" /> Nuevo curso
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader><DialogTitle>Nuevo curso</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1"><Label>Nombre *</Label>
              <Input placeholder="Nombre del curso" value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label>Nivel</Label>
                <Input placeholder="Básico" value={form.nivel}
                  onChange={e => setForm({ ...form, nivel: e.target.value })} />
              </div>
              <div className="space-y-1"><Label>Duración</Label>
                <Input placeholder="4 semanas" value={form.duracion}
                  onChange={e => setForm({ ...form, duracion: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label>Precio (€)</Label>
                <Input type="number" min={0} value={form.precio}
                  onChange={e => setForm({ ...form, precio: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="space-y-1"><Label>Capacidad</Label>
                <Input type="number" min={1} value={form.capacidad}
                  onChange={e => setForm({ ...form, capacidad: parseInt(e.target.value) || 15 })} />
              </div>
            </div>
            <Button className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white" onClick={handleSave}>
              Crear curso
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="space-y-2">
        {cursos.map(curso => (
          <Card key={curso.id} className="rounded-2xl border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{curso.nombre}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{curso.inscritos}/{curso.capacidad}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{curso.duracion}</span>
                  <span className="flex items-center gap-1 text-indigo-500 font-semibold"><DollarSign className="w-3 h-3" />€{curso.precio}</span>
                </div>
              </div>
              <Badge className={NIVEL_COLORS[curso.nivel] || "bg-muted text-muted-foreground"}>{curso.nivel}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default CoursesApp;
