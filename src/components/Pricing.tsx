import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for single-location businesses",
    setupFee: "€1,500",
    monthlyFee: "€299",
    features: [
      "1 Business Location",
      "AI Concierge (24/7)",
      "3 Languages Supported",
      "Google Calendar Sync",
      "Stripe Payments",
      "Basic Analytics",
      "Email Support",
    ],
    highlighted: false,
  },
  {
    name: "Professional",
    description: "For growing businesses with multiple services",
    setupFee: "€2,500",
    monthlyFee: "€499",
    features: [
      "Up to 3 Locations",
      "AI Concierge (24/7)",
      "All Languages",
      "Google + Outlook Sync",
      "Stripe + Custom Payments",
      "Advanced Analytics",
      "Priority Support",
      "Custom AI Training",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "Custom solutions for large organizations",
    setupFee: "Custom",
    monthlyFee: "Custom",
    features: [
      "Unlimited Locations",
      "Dedicated AI Instance",
      "All Languages + Custom",
      "Full Calendar Integration",
      "Custom Payment Gateway",
      "White-label Dashboard",
      "24/7 Phone Support",
      "API Access",
      "SLA Guarantee",
    ],
    highlighted: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 lg:py-32 bg-background">
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
            Pricing
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
            Simple, transparent{" "}
            <span className="text-gradient">pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            One-time setup, predictable monthly costs. No hidden fees, no surprises.
            Your AI concierge pays for itself with increased bookings.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-3xl p-8 ${
                plan.highlighted
                  ? "bg-gradient-primary text-primary-foreground shadow-glow scale-105"
                  : "bg-card border border-border shadow-soft"
              }`}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-card text-foreground text-sm font-semibold rounded-full shadow-medium">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <h3 className={`font-display font-bold text-2xl mb-2 ${
                  plan.highlighted ? "text-primary-foreground" : "text-foreground"
                }`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${
                  plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}>
                  {plan.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="mb-8">
                <div className="mb-4">
                  <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    One-time setup
                  </span>
                  <div className={`text-3xl font-bold font-display ${
                    plan.highlighted ? "text-primary-foreground" : "text-foreground"
                  }`}>
                    {plan.setupFee}
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold font-display ${
                    plan.highlighted ? "text-primary-foreground" : "text-foreground"
                  }`}>
                    {plan.monthlyFee}
                  </span>
                  {plan.monthlyFee !== "Custom" && (
                    <span className={`${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      /month
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      plan.highlighted ? "text-primary-foreground" : "text-primary"
                    }`} />
                    <span className={`text-sm ${
                      plan.highlighted ? "text-primary-foreground/90" : "text-muted-foreground"
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                variant={plan.highlighted ? "heroOutline" : "hero"}
                size="lg"
                className={`w-full ${
                  plan.highlighted 
                    ? "bg-card text-foreground hover:bg-card/90 border-0" 
                    : ""
                }`}
              >
                {plan.monthlyFee === "Custom" ? "Contact Sales" : "Get Started"}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            💰 30-day money-back guarantee on all plans. No questions asked.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
