import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-5 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Política de Privacidad</h1>
        <p className="text-sm text-muted-foreground mb-10">Última actualización: Abril 2026</p>

        <div className="prose prose-sm max-w-none text-foreground/80 space-y-8">
          <section>
            <h2 className="font-display text-lg font-bold text-foreground">1. Datos que Recopilamos</h2>
            <p>Recopilamos datos necesarios para el funcionamiento del servicio: nombre, email, teléfono, datos del negocio, historial de reservas, y conversaciones con agentes IA.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground">2. Uso de los Datos</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gestión de reservas y comunicaciones automatizadas</li>
              <li>Mejora del servicio y entrenamiento de modelos IA</li>
              <li>Generación de informes analíticos para el negocio</li>
              <li>Envío de notificaciones operativas (confirmaciones, recordatorios)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground">3. Almacenamiento de Conversaciones IA</h2>
            <p>
              Las conversaciones gestionadas por agentes de inteligencia artificial pueden ser almacenadas para mejorar la calidad del servicio. El Usuario puede solicitar la eliminación de sus conversaciones en cualquier momento.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground">4. Suscripción y Datos de Pago</h2>
            <p>
              La suscripción se renueva automáticamente al inicio de cada período facturado (mensual o anual) hasta que el Usuario la cancele. El cobro se realiza mediante el método de pago registrado a través de Stripe.
            </p>
            <p>
              En caso de impago, el acceso al Servicio se suspenderá automáticamente a los 7 días de la fecha de vencimiento. Los datos del Usuario se conservarán durante 30 días adicionales para facilitar la reactivación.
            </p>
          </section>

          <section id="cookies">
            <h2 className="font-display text-lg font-bold text-foreground">5. Cookies</h2>
            <p>Usamos cookies para mejorar la experiencia, analizar el tráfico y personalizar el contenido. Puedes gestionar tus preferencias desde el banner de cookies al acceder al sitio.</p>
          </section>

          <section id="gdpr">
            <h2 className="font-display text-lg font-bold text-foreground">6. Derechos del Usuario</h2>
            <p>Conforme al RGPD, tienes derecho de acceso, rectificación, eliminación y portabilidad de tus datos. Para ejercer estos derechos, contacta a: <a href="mailto:privacy@flowbooking.com" className="text-primary underline">privacy@flowbooking.com</a></p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground">7. Seguridad</h2>
            <p>Tus datos se almacenan en servidores seguros con cifrado en tránsito y en reposo. Implementamos medidas técnicas y organizativas para proteger tu información.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
