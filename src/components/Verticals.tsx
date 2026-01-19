import { motion } from "framer-motion";
import { 
  Sparkles, 
  Stethoscope, 
  UtensilsCrossed, 
  Hotel, 
  Calendar, 
  Dumbbell, 
  GraduationCap,
  PawPrint 
} from "lucide-react";

const verticals = [
  {
    icon: Sparkles,
    title: "Spa / Wellness / Masajes",
    description: "Conversaciones relajantes que guían a los clientes desde la consulta hasta la reserva. El AI entiende el vocabulario del bienestar.",
    services: [
      { nombre: "Masajes relajantes", tipo: "cita", duracion: 60, precio: 50 },
      { nombre: "Taller de relajación", tipo: "evento", duracion: 120, precio: 80 }
    ],
    color: "from-pink-500 to-rose-400",
    bgColor: "bg-pink-50",
  },
  {
    icon: Stethoscope,
    title: "Clínicas / Consultorios",
    description: "Conversaciones profesionales y empáticas para citas médicas. Maneja la sensibilidad del paciente con cuidado.",
    services: [
      { nombre: "Consulta médica", tipo: "cita", duracion: 30, precio: 60 },
      { nombre: "Terapias alternativas", tipo: "cita", duracion: 60, precio: 70 }
    ],
    color: "from-blue-500 to-cyan-400",
    bgColor: "bg-blue-50",
  },
  {
    icon: UtensilsCrossed,
    title: "Restaurantes / Bares",
    description: "Reservas de mesa, menús del día y eventos. Envío automático por WhatsApp, PDF y QR dinámicos.",
    services: [
      { nombre: "Reserva de mesa", tipo: "cita", duracion: 90, precio: 0 },
      { nombre: "Menú del día", tipo: "evento", duracion: 0, precio: 0 }
    ],
    color: "from-orange-500 to-amber-400",
    bgColor: "bg-orange-50",
  },
  {
    icon: Hotel,
    title: "Hoteles / Hostels / Alojamientos",
    description: "Gestión de reservas de habitaciones y eventos en el hotel. Integración completa con calendarios.",
    services: [
      { nombre: "Reserva de habitación", tipo: "cita", duracion: 0, precio: 100 },
      { nombre: "Eventos en hotel", tipo: "evento", duracion: 180, precio: 200 }
    ],
    color: "from-indigo-500 to-purple-400",
    bgColor: "bg-indigo-50",
  },
  {
    icon: Calendar,
    title: "Eventos / Workshops / Retiros",
    description: "Organización de talleres, retiros y experiencias. Programación avanzada y gestión de grupos.",
    services: [
      { nombre: "Workshop de cocina", tipo: "evento", duracion: 120, precio: 50 },
      { nombre: "Retiro de meditación", tipo: "evento", duracion: 480, precio: 300 }
    ],
    color: "from-emerald-500 to-teal-400",
    bgColor: "bg-emerald-50",
  },
  {
    icon: GraduationCap,
    title: "Clases / Coaching / Actividades",
    description: "Clases individuales y grupales, coaching personalizado. Flujos de reserva y seguimiento.",
    services: [
      { nombre: "Clase de Yoga", tipo: "cita", duracion: 60, precio: 15 },
      { nombre: "Coaching personalizado", tipo: "evento", duracion: 90, precio: 80 }
    ],
    color: "from-violet-500 to-fuchsia-400",
    bgColor: "bg-violet-50",
  },
  {
    icon: Dumbbell,
    title: "Fitness / Gimnasio / Recreación",
    description: "Clases grupales, reservas de equipamiento y espacios. Gestión de membresías y horarios.",
    services: [
      { nombre: "Clase grupal", tipo: "evento", duracion: 60, precio: 10 },
      { nombre: "Reserva de equipamiento", tipo: "cita", duracion: 60, precio: 5 }
    ],
    color: "from-red-500 to-rose-400",
    bgColor: "bg-red-50",
  },
  {
    icon: PawPrint,
    title: "Pet Care / Veterinarias",
    description: "Peluquerías caninas, consultas veterinarias y servicios para mascotas. Recordatorios automáticos.",
    services: [
      { nombre: "Corte de pelo", tipo: "cita", duracion: 60, precio: 40 },
      { nombre: "Consulta veterinaria", tipo: "cita", duracion: 30, precio: 50 }
    ],
    color: "from-lime-500 to-green-400",
    bgColor: "bg-lime-50",
  },
];

const Verticals = () => {
  return (
    <section id="verticals" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Verticales
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
            Una plataforma,{" "}
            <span className="text-gradient">adaptada a tu industria</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            El mismo motor de IA potente, diferentes plantillas conversacionales. 
            Cada vertical tiene vocabulario, manejo de objeciones y flujos específicos.
          </p>
        </motion.div>

        {/* Verticals Cards - 4 columns grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {verticals.map((vertical, index) => (
            <motion.div
              key={vertical.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-soft hover:shadow-strong transition-all duration-500"
            >
              {/* Top Gradient Bar */}
              <div className={`h-1.5 bg-gradient-to-r ${vertical.color}`} />
              
              <div className="p-5">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${vertical.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <vertical.icon className="w-6 h-6" style={{ color: `hsl(var(--primary))` }} />
                </div>

                {/* Content */}
                <h3 className="font-display font-bold text-lg text-foreground mb-2 leading-tight">
                  {vertical.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {vertical.description}
                </p>

                {/* Services Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {vertical.services.map((service) => (
                    <span
                      key={service.nombre}
                      className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-full"
                    >
                      {service.nombre}
                      {service.precio > 0 && (
                        <span className="ml-1 text-primary">€{service.precio}</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${vertical.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-muted-foreground mt-12"
        >
          ✨ Cada rubro adicional: €300. Activa nuevos servicios desde tu panel.
        </motion.p>
      </div>
    </section>
  );
};

export default Verticals;
