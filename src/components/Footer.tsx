import { Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";

// NOTE: Footer copy is locked to English by product decision.
// Do NOT wire this to useLanguage — the base institutional language is EN.

type FooterLink = {
  label: string;
  href: string;
};

const footerSections: Array<{ title: string; links: FooterLink[] }> = [
  {
    title: "Platform",
    links: [
      { label: "Modules", href: "#modules" },
      { label: "AI Agents", href: "#agents" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Roadmap", href: "/progress" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Restaurants", href: "#verticals" },
      { label: "Hotels", href: "#verticals" },
      { label: "Travel", href: "#verticals" },
      { label: "Experiences", href: "#verticals" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Progress", href: "/progress" },
      { label: "Contact", href: "#contact" },
      { label: "Request Demo", href: "/request-demo" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookies", href: "/privacy#cookies" },
      { label: "GDPR", href: "/privacy#gdpr" },
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

const Footer = () => {
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
              Intelligent operating system for businesses, powered by AI Agents. Hospitality,
              gastronomy, travel, and experiences.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-background mb-4 text-sm sm:text-base">
                {section.title}
              </h4>
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
              © 2026 FlowBooking. Design by Just Bee Brand Agency.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <LanguageSelector isScrolled={false} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
