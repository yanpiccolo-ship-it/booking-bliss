import { Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageSelector from "./LanguageSelector";

type FooterLink = {
  label: string;
  href: string;
};

const Footer = () => {
  const { t } = useLanguage();

  const footerSections: Array<{ title: string; links: FooterLink[] }> = [
    {
      title: t.footer.categories.platform.title,
      links: [
        { label: t.footer.categories.platform.links[0], href: "#modules" },
        { label: t.footer.categories.platform.links[1], href: "#agents" },
        { label: t.footer.categories.platform.links[2], href: "/dashboard" },
        { label: t.footer.categories.platform.links[3], href: "/progress" },
      ],
    },
    {
      title: t.footer.categories.industries.title,
      links: [
        { label: t.footer.categories.industries.links[0], href: "#verticals" },
        { label: t.footer.categories.industries.links[1], href: "#verticals" },
        { label: t.footer.categories.industries.links[2], href: "#verticals" },
        { label: t.footer.categories.industries.links[3], href: "#verticals" },
      ],
    },
    {
      title: t.footer.categories.company.title,
      links: [
        { label: t.footer.categories.company.links[0], href: "#about" },
        { label: t.footer.categories.company.links[1], href: "/progress" },
        { label: t.footer.categories.company.links[2], href: "#contact" },
        { label: t.footer.categories.company.links[3], href: "/request-demo" },
      ],
    },
    {
      title: t.footer.categories.legal.title,
      links: [
        { label: t.footer.categories.legal.links[0], href: "/privacy" },
        { label: t.footer.categories.legal.links[1], href: "/terms" },
        { label: t.footer.categories.legal.links[2], href: "/privacy#cookies" },
        { label: t.footer.categories.legal.links[3], href: "/privacy#gdpr" },
      ],
    },
  ];

  const renderLink = (link: FooterLink) => {
    if (link.href.startsWith("#")) {
      return (
        <a
          href={link.href}
          className="text-background/60 hover:text-background transition-colors text-sm"
        >
          {link.label}
        </a>
      );
    }

    return (
      <Link
        to={link.href}
        className="text-background/60 hover:text-background transition-colors text-sm"
      >
        {link.label}
      </Link>
    );
  };

  return (
    <footer id="about" className="bg-foreground text-background py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
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
            <div className="rounded-2xl border border-background/10 bg-background/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-background/40 mb-2">
                {t.footer.categories.legal.title}
              </p>
              <div className="space-y-2 text-sm">
                <Link to="/privacy" className="block text-background/70 hover:text-background transition-colors">
                  {t.footer.categories.legal.links[0]}
                </Link>
                <Link to="/terms" className="block text-background/70 hover:text-background transition-colors">
                  {t.footer.categories.legal.links[1]}
                </Link>
              </div>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-background mb-4 text-sm sm:text-base">{section.title}</h4>
              <ul className="space-y-2 sm:space-y-3">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.label}`}>{renderLink(link)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-background/10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-6">
            <p className="text-background/40 text-sm text-center lg:text-left">
              {t.footer.copyright}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link to="/terms" className="text-background/40 hover:text-background/70 transition-colors">
                {t.footer.categories.legal.links[1]}
              </Link>
              <Link to="/privacy" className="text-background/40 hover:text-background/70 transition-colors">
                {t.footer.categories.legal.links[0]}
              </Link>
              <LanguageSelector isScrolled={false} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
