import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import s1 from "@/assets/showcase-1.jpg.asset.json";
import s2 from "@/assets/showcase-2.jpg.asset.json";
import s3 from "@/assets/showcase-3.jpg.asset.json";
import s4 from "@/assets/showcase-4.jpg.asset.json";
import s5 from "@/assets/showcase-5.jpg.asset.json";
import s6 from "@/assets/showcase-6.jpg.asset.json";

const items = [
  {
    eyebrow: "Live Demo",
    title: "Customize your AI Agent",
    subtitle: "Design, train and launch your own sales assistant.",
    href: "https://yanpiccolo-ship-it-flow-sales-chatb.vercel.app/",
    front: s3.url,
    back: s4.url,
  },
  {
    eyebrow: "Menu Experience",
    title: "Taste Flow",
    subtitle: "Cinematic digital menus for restaurants & hotels.",
    href: "https://taste-flow-sepia.vercel.app",
    front: s1.url,
    back: s2.url,
  },
  {
    eyebrow: "Website Template · Branding",
    title: "Flow Studio",
    subtitle: "Editorial micro-sites tailored to your brand.",
    href: "https://yanpiccolo-ship-it-flow-sales-chatb.vercel.app/",
    front: s5.url,
    back: s6.url,
  },
];

const ShowcaseTrio = () => {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-14 sm:mb-20"
        >
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Live Products
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-foreground">
            See it. Touch it. Launch it.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
            Three real products built on FlowBooking. Hover any card to preview,
            click to open the live demo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((it, i) => (
            <motion.a
              key={it.title}
              href={it.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative block rounded-3xl overflow-hidden bg-muted aspect-[4/5] shadow-sm hover:shadow-2xl transition-shadow"
            >
              <img
                src={it.front}
                alt={it.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
              />
              <img
                src={it.back}
                alt={`${it.title} preview`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white">
                <p className="text-[11px] tracking-[0.18em] uppercase opacity-80">
                  {it.eyebrow}
                </p>
                <div className="flex items-end justify-between gap-3 mt-1.5">
                  <h3 className="text-2xl font-serif leading-tight">{it.title}</h3>
                  <ArrowUpRight className="w-5 h-5 shrink-0 translate-y-0 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="mt-2 text-sm opacity-85 line-clamp-2">{it.subtitle}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseTrio;
