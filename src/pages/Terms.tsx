import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-5 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Términos y Condiciones</h1>
        <p className="text-sm text-muted-foreground mb-10">Última actualización: Abril 2026</p>

        <div className="prose prose-sm max-w-none text-foreground/80 space-y-8">
          <section>
            <h2 className="font-display text-lg font-bold text-foreground">1. Uso del Servicio</h2>
            <p>FlowBooking es una plataforma SaaS de gestión de reservas, automatización y atención al cliente impulsada por inteligencia artificial. Al registrarte y usar el servicio, aceptas estos términos.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground">2. Uso de Inteligencia Artificial</h2>
            <p>
              El Servicio incluye agentes de inteligencia artificial que pueden interactuar con clientes en nombre del Usuario. El Usuario autoriza expresamente este uso al activar dichos módulos desde su panel de control.
            </p>
            <p>
              FlowBooking no garantiza la precisión absoluta de las respuestas generadas por IA. El Usuario es responsable de revisar y ajustar el comportamiento de los agentes según sus necesidades de negocio.
            </p>
            <p>
              Las conversaciones gestionadas por IA pueden ser almacenadas para mejorar el servicio, de acuerdo con nuestra Política de Privacidad.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground">3. Suscripción y Renovación</h2>
            <p>
              La suscripción se renueva automáticamente al inicio de cada período facturado (mensual o anual) hasta que el Usuario la cancele. El cobro se realiza mediante el método de pago registrado.
            </p>
            <p>
              En caso de impago, el acceso al Servicio se suspenderá automáticamente a los 7 días de la fecha de vencimiento. Los datos del Usuario se conservarán durante 30 días adicionales para facilitar la reactivación.
            </p>
            <p>
              El Usuario puede cancelar su suscripción en cualquier momento desde <strong>Configuración → Plan → Cancelar suscripción</strong>, sin penalización.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground">4. Automatizaciones</h2>
            <p>
              Este sistema incluye automatizaciones de atención, reservas y gestión básica activadas por defecto para que tu negocio funcione desde el primer día. Puedes pausar, ajustar o desactivar cualquier función en cualquier momento desde tu panel de control.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground">5. Mantenimiento</h2>
            <p>El fee mensual de mantenimiento cubre:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hosting y estabilidad del sistema (uptime garantizado)</li>
              <li>Actualizaciones de seguridad y parches técnicos</li>
              <li>Optimización continua de automatizaciones y agentes IA</li>
              <li>Ajustes menores de contenido (textos, imágenes, precios)</li>
              <li>Soporte técnico por email con respuesta en 24–48h hábiles</li>
              <li>Monitoreo de flujos activos y alertas ante fallos</li>
              <li>1 hora mensual de mejoras o nuevas configuraciones incluida</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              No incluye: desarrollo de nuevas funcionalidades, integraciones con terceros no contratados, ni soporte en herramientas externas.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground">6. Limitación de Responsabilidad</h2>
            <p>FlowBooking no se responsabiliza de pérdidas derivadas de interrupciones del servicio, errores en las respuestas de IA o decisiones comerciales tomadas basándose en datos del sistema.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground">7. Contacto</h2>
            <p>Para cualquier consulta legal, contactar a: <a href="mailto:legal@flowbooking.com" className="text-primary underline">legal@flowbooking.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
