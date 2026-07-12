import { motion } from "framer-motion";
import { Check, Sparkles, Utensils, Hotel, Leaf, Ticket, Briefcase, Plus, MapPin, Calendar, Cable, Bot, Wine, Coffee, Cake, Fish, Beef, Salad, Music, Camera, Flower2, Palette, Scissors, Dumbbell, Waves, Mountain, Car, Palmtree, Building2, Gem, ShoppingBag, Shirt, BookOpen, GraduationCap, Baby, Dog, Wrench, Sparkle, ArrowRight } from "lucide-react";

const categories = [
  { icon: Utensils, label: "Gastronomy" },
  { icon: Hotel, label: "Travel & Hospitality" },
  { icon: Leaf, label: "Wellness" },
  { icon: Ticket, label: "Events" },
  { icon: Briefcase, label: "Services" },
  { icon: Plus, label: "Custom category" },
];

const directoryCategories = [
  { icon: Wine, label: "Wineries" },
  { icon: Coffee, label: "Coffee & Tea" },
  { icon: Cake, label: "Bakery & Pastry" },
  { icon: Fish, label: "Seafood" },
  { icon: Beef, label: "Butchers" },
  { icon: Salad, label: "Organic & Farm" },
  { icon: Hotel, label: "Boutique Hotels" },
  { icon: Palmtree, label: "Resorts & Villas" },
  { icon: Mountain, label: "Rural & Retreats" },
  { icon: Waves, label: "Spa & Thermal" },
  { icon: Flower2, label: "Florists" },
  { icon: Palette, label: "Interior Design" },
  { icon: Building2, label: "Architecture" },
  { icon: Music, label: "Live Music & DJ" },
  { icon: Camera, label: "Photo & Video" },
  { icon: Ticket, label: "Events & Weddings" },
  { icon: Scissors, label: "Beauty & Salons" },
  { icon: Dumbbell, label: "Fitness Studios" },
  { icon: Gem, label: "Jewelry & Craft" },
  { icon: Shirt, label: "Fashion & Uniforms" },
  { icon: ShoppingBag, label: "Local Retail" },
  { icon: BookOpen, label: "Cultural Venues" },
  { icon: GraduationCap, label: "Academies" },
  { icon: Baby, label: "Family & Kids" },
  { icon: Dog, label: "Pet-friendly Services" },
  { icon: Car, label: "Transfers & Mobility" },
  { icon: Wrench, label: "Maintenance & Ops" },
  { icon: Sparkle, label: "Cleaning & Linen" },
  { icon: Plus, label: "Custom category" },
];

const capabilities = [
  { icon: MapPin, label: "Region / Country / City / Delivery & operating zones" },
  { icon: Calendar, label: "Google Calendar sync" },
  { icon: Cable, label: "MCP native connection" },
  { icon: Bot, label: "Agent connectivity (Claude, Google, ChatGPT…)" },
];

const tiers = [
  {
    name: "Flow Partner · Basic",
    price: "€49",
    period: "/month",
    tagline: "Get discovered across the FlowBooking network.",
    features: [
      "Public supplier profile",
      "Category tag",
      "Location & contact",
      "Appears in platform search",
      "Black Friday promotions",
    ],
    highlight: false,
  },
  {
    name: "Featured Partner",
    price: "€99",
    period: "/month",
    tagline: "Stand out in your category and region.",
    features: [
      "Everything in Basic",
      "Featured profile placement",
      "Extended image gallery",
      "Portfolio section",
      "Regional priority ranking",
      "Performance analytics",
      "Black Friday promotions",
    ],
    highlight: true,
  },
  {
    name: "Premium Partner",
    price: "€199",
    period: "/month",
    tagline: "Full editorial treatment inside the ecosystem.",
    features: [
      "Everything in Featured",
      "Highlighted in Experiences",
      "Editorial content feature",
      "Cross-ecosystem campaigns",
      "Priority qualified leads",
      "Dedicated account manager",
      "Black Friday promotions",
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
            Marketplace · Experiences, Hospitality &amp; Services
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-foreground">
            The premium directory of hospitality suppliers.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
            A curated network of makers, growers, designers and service providers —
            connected directly with the venues that trust FlowBooking.
          </p>
        </motion.div>

        {/* Categories */}
        <div className="mb-10 flex flex-wrap gap-2 sm:gap-3">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <span
                key={c.label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground"
              >
                <Icon className="w-3.5 h-3.5" />
                {c.label}
              </span>
            );
          })}
        </div>

        {/* Capabilities */}
        <div className="mb-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {capabilities.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className="flex items-start gap-3 rounded-2xl border border-border bg-background/60 p-4"
              >
                <Icon className="w-4 h-4 mt-0.5 text-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">{c.label}</span>
              </div>
            );
          })}
        </div>

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
                href="/request-demo"
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
