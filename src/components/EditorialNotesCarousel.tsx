import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const notes = [
  { cat: "Beauty", title: "The new grammar of luxury salons", hue: "from-rose-200 to-rose-50", accent: "text-rose-900" },
  { cat: "Food", title: "Cinematic menus & the return of the ritual", hue: "from-amber-200 to-amber-50", accent: "text-amber-900" },
  { cat: "Lifestyle", title: "Slow tech for fast lives", hue: "from-stone-300 to-stone-100", accent: "text-stone-900" },
  { cat: "Travel", title: "Micro-stays, macro experiences", hue: "from-sky-200 to-sky-50", accent: "text-sky-900" },
  { cat: "Wellness", title: "Silence is the new amenity", hue: "from-emerald-200 to-emerald-50", accent: "text-emerald-900" },
  { cat: "Style", title: "Interiors that book themselves", hue: "from-neutral-300 to-neutral-100", accent: "text-neutral-900" },
];

const EditorialNotesCarousel = () => {
  return (
    <section className="py-20 sm:py-28 bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Editorial
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-foreground max-w-3xl">
            Notes from the hospitality desk.
          </h2>
        </div>
        <a href="#" className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
          View all <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-5 sm:gap-6 px-4 sm:px-6 lg:px-8 pb-4">
          {notes.map((n, i) => (
            <motion.article
              key={n.cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`shrink-0 w-[78vw] sm:w-[360px] aspect-[4/5] rounded-3xl bg-gradient-to-br ${n.hue} p-7 flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition-transform`}
            >
              <span className={`text-[11px] tracking-[0.2em] uppercase ${n.accent}`}>
                {n.cat}
              </span>
              <div>
                <h3 className={`text-2xl sm:text-3xl font-serif leading-tight ${n.accent}`}>
                  {n.title}
                </h3>
                <div className={`mt-6 inline-flex items-center gap-2 text-sm font-medium ${n.accent}`}>
                  Read the note <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EditorialNotesCarousel;
