import { Cpu } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  const footerLinks = {
    [t.footer.categories.platform.title]: t.footer.categories.platform.links,
    [t.footer.categories.industries.title]: t.footer.categories.industries.links,
    [t.footer.categories.company.title]: t.footer.categories.company.links,
    [t.footer.categories.legal.title]: t.footer.categories.legal.links,
  };

  return (
    <footer id="about" className="bg-foreground text-background py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center">
                <Cpu className="w-5 h-5 text-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-background">
                Flow<span className="text-background/60">Booking</span>
              </span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed mb-6">
              {t.footer.description}
            </p>
            <div className="flex gap-3">
              {["twitter", "linkedin", "instagram"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-background/60 rounded" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-background mb-4 text-sm sm:text-base">{category}</h4>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-background/60 hover:text-background transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/40 text-sm text-center md:text-left">
              {t.footer.copyright}
            </p>
            <div className="flex gap-4 sm:gap-6 text-sm">
              <a href="/terms" className="text-background/40 hover:text-background/70 transition-colors">Términos</a>
              <a href="/privacy" className="text-background/40 hover:text-background/70 transition-colors">Privacidad</a>
              <span className="text-background/20">|</span>
              <span className="text-background/40">EN</span>
              <span className="text-background/40">ES</span>
              <span className="text-background/40">IT</span>
              <span className="text-background/40">FR</span>
              <span className="text-background/40">PT</span>
              <span className="text-background/40">DE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
