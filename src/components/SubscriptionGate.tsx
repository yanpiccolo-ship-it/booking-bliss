import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Cpu, Lock, ArrowRight, CheckCircle } from "lucide-react";

interface SubscriptionGateProps {
  children: React.ReactNode;
}

const SubscriptionGate = ({ children }: SubscriptionGateProps) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "active" | "inactive">("loading");

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // First check if admin — admins always have access
      const { data: adminRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (adminRole) {
        setStatus("active");
        return;
      }

      // Check subscription status
      const { data: sub } = await supabase
        .from("business_subscriptions")
        .select("is_active, setup_paid")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (sub?.is_active && sub?.setup_paid) {
        setStatus("active");
      } else {
        setStatus("inactive");
      }
    };
    check();
  }, [navigate]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-foreground animate-pulse flex items-center justify-center">
          <Cpu className="w-5 h-5 text-background" />
        </div>
      </div>
    );
  }

  if (status === "inactive") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-md w-full bg-card rounded-3xl border border-border shadow-float p-8 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-3">
            Acceso pendiente de activación
          </h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Tu cuenta está pendiente de pago. Una vez completado el proceso de pago, 
            tu panel de control será activado automáticamente.
          </p>
          <div className="bg-muted rounded-2xl p-4 mb-6 text-left space-y-2">
            {["Pago de activación", "Configuración del plan", "Acceso al dashboard"].map((step, i) => (
              <div key={step} className="flex items-center gap-2 text-sm">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${i === 0 ? "bg-foreground" : "bg-border"}`}>
                  {i === 0 ? <CheckCircle className="w-3 h-3 text-background" /> : <span className="text-xs text-muted-foreground">{i + 1}</span>}
                </div>
                <span className={i === 0 ? "text-foreground font-medium" : "text-muted-foreground"}>{step}</span>
              </div>
            ))}
          </div>
          <Button
            onClick={() => navigate("/#pricing")}
            className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-xl h-12"
          >
            Ver planes y precios
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Volver al inicio
          </button>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SubscriptionGate;
