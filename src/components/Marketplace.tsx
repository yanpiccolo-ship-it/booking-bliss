import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

const tiers = [
  {
    name: "Listed",
    price: "€29",
    period: "/month",
    tagline: "Get discovered.",
    features: [
      "Public supplier profile",
      "Category & region tags",
      "Contact form + email leads",
      "Basic analytics",
    ],
    highlight: false,
  },
  {
    name: "Featured",
    price: "€89",
    period: "/month",
    tagline: "Stand out in your category.",
    features: [
      "Everything in Listed",
      "Priority ranking in search",
      "Editorial cover photo",
      "Verified badge",
      "Direct chat with buyers",
    ],
    highlight: true,
  },
  {
    name: "Signature",
    price: "€249",
    period: "/month",
    tagline: "Full editorial treatment.",
    features: [
      "Everything in Featured",
      "Homepage rotation",
      "Custom brand page",
      "Dedicated editorial feature",
      "Concierge account manager",
    ],
    highlight: false,
  },
];

const Marketplace = () => {
  return (
    <section id="marketplace" className="py-20 sm:py-28 bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-14"
        >
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Marketplace
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-foreground">
            The premium directory of hospitality suppliers.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
            A curated network of makers, growers, designers and service providers —
            connected directly with the venues that trust FlowBooking.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative rounded-3xl p-8 flex flex-col ${
                tier.highlight
                  ? "bg-foreground text-background shadow-2xl scale-[1.02]"
                  : "bg-background border border-border"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 bg-background text-foreground text-[11px] font-semibold tracking-wider uppercase rounded-full border border-border">
                  <Sparkles className="w-3 h-3" /> Most popular
                </div>
              )}
              <div>
                <p className={`text-[11px] tracking-[0.2em] uppercase ${tier.highlight ? "opacity-70" : "text-muted-foreground"}`}>
                  {tier.name}
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-5xl font-serif">{tier.price}</span>
                  <span className={`text-sm ${tier.highlight ? "opacity-70" : "text-muted-foreground"}`}>
                    {tier.period}
                  </span>
                </div>
                <p className={`mt-2 text-base ${tier.highlight ? "opacity-80" : "text-muted-foreground"}`}>
                  {tier.tagline}
                </p>
              </div>

              <ul className="mt-8 space-y-3 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${tier.highlight ? "" : "text-foreground"}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`mt-8 inline-flex items-center justify-center px-5 py-3 rounded-full text-sm font-medium transition-opacity hover:opacity-90 ${
                  tier.highlight
                    ? "bg-background text-foreground"
                    : "bg-foreground text-background"
                }`}
              >
                Join as supplier
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Marketplace;
