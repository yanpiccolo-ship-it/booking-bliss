import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import s1 from "@/assets/showcase-1.jpg.asset.json";
import s2 from "@/assets/showcase-2.jpg.asset.json";
import s3 from "@/assets/showcase-3.jpg.asset.json";
import s4 from "@/assets/showcase-4.jpg.asset.json";
import s5 from "@/assets/showcase-5.jpg.asset.json";
import s6 from "@/assets/showcase-6.jpg.asset.json";

const notes = [
  {
    cat: "Beauty",
    title: "The new grammar of luxury salons",
    excerpt: "Booking rituals, quiet interiors and the return of the personal assistant.",
    image: s5.url,
  },
  {
    cat: "Food",
    title: "Cinematic menus & the return of the ritual",
    excerpt: "Why the world's best restaurants are trading PDFs for editorial digital menus.",
    image: s1.url,
  },
  {
    cat: "Lifestyle",
    title: "Slow tech for fast lives",
    excerpt: "Software that disappears — and gives hospitality teams their attention back.",
    image: s2.url,
  },
  {
    cat: "Travel",
    title: "Micro-stays, macro experiences",
    excerpt: "Independent hotels are winning the weekend with tighter, richer stays.",
    image: s4.url,
  },
  {
    cat: "Wellness",
    title: "Silence is the new amenity",
    excerpt: "How wellness venues design silence into every touchpoint of the guest journey.",
    image: s6.url,
  },
  {
    cat: "Style",
    title: "Interiors that book themselves",
    excerpt: "The rise of design-first venues where the space itself is the reservation.",
    image: s3.url,
  },
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
              className="group shrink-0 w-[78vw] sm:w-[360px] aspect-[4/5] rounded-3xl overflow-hidden relative cursor-pointer"
            >
              <img
                src={n.image}
                alt={n.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
              <div className="relative h-full flex flex-col justify-between p-7 text-white">
                <span className="text-[11px] tracking-[0.2em] uppercase opacity-90">
                  {n.cat}
                </span>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-serif leading-tight">
                    {n.title}
                  </h3>
                  <p className="mt-3 text-sm opacity-85 line-clamp-2">{n.excerpt}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
                    Read the note <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
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
