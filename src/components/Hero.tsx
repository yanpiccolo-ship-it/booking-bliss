import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Cpu, Zap, Globe } from "lucide-react";
import ChatPreview from "./ChatPreview";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero pt-20 lg:pt-24 overflow-hidden">
      {/* Premium Background Mesh */}
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
      
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-foreground/[0.02] rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-foreground/[0.02] rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/[0.03] border border-border mb-8"
            >
              <Cpu className="w-4 h-4 text-foreground" />
              <span className="text-sm font-medium text-foreground">
                Sistema Operativo Inteligente para Negocios
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-display mb-6 text-balance">
              La plataforma{" "}
              <span className="text-gradient-premium">evolutiva</span>{" "}
              impulsada por{" "}
              <span className="text-gradient-premium">Agentes AI</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              No es una app. No es una web. Es un ecosistema inteligente premium que automatiza ventas, reservas y operaciones para hospitality, gastronomía y experiencias.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-14">
              <Button variant="hero" size="xl">
                Solicitar Demo
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="heroOutline" size="xl">
                <Play className="w-5 h-5" />
                Ver en acción
              </Button>
            </div>

            {/* Key Differentiators */}
            <div className="grid grid-cols-3 gap-4 lg:gap-8">
              {[
                { icon: Cpu, value: "Agentes AI", label: "Automatización total" },
                { icon: Zap, value: "Evolutivo", label: "Mejora continua" },
                { icon: Globe, value: "6 idiomas", label: "Multilingüe" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center lg:text-left"
                >
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                    <stat.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-base font-semibold text-foreground">{stat.value}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Chat Preview */}
          <div className="relative">
            <ChatPreview />
            
            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="absolute -top-4 -right-4 lg:right-0 bg-card rounded-2xl shadow-float border border-border px-5 py-4 hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                  <span className="text-background text-lg font-bold">✓</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Reserva confirmada</p>
                  <p className="text-xs text-muted-foreground">Pago procesado automáticamente</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="absolute -bottom-4 -left-4 lg:left-0 bg-card rounded-2xl shadow-float border border-border px-5 py-4 hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-foreground border-2 border-card flex items-center justify-center text-xs font-bold text-background">ES</div>
                  <div className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium text-foreground">EN</div>
                  <div className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium text-foreground">IT</div>
                </div>
                <p className="text-sm font-medium text-foreground">AI Multilingüe</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-subtle" />
    </section>
  );
};

export default Hero;
