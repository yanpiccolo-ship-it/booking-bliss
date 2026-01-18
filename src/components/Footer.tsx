import { Sparkles } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Product: ["Features", "Pricing", "Integrations", "API Docs"],
    Company: ["About Us", "Careers", "Blog", "Press"],
    Industries: ["Spa & Wellness", "Medical Clinics", "Legal Services", "Restaurants"],
    Support: ["Help Center", "Contact", "Status", "Terms & Privacy"],
  };

  return (
    <footer id="about" className="bg-foreground text-background py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-background">
                Booking<span className="text-primary">Intelligence</span>
              </span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed mb-4">
              AI-powered booking and sales concierge for appointment-based businesses. 
              Available 24/7 in multiple languages.
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
              <h4 className="font-semibold text-background mb-4">{category}</h4>
              <ul className="space-y-3">
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

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/40 text-sm">
            © {new Date().getFullYear()} Booking Intelligence. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-background/40 hover:text-background/60 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-background/40 hover:text-background/60 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-background/40 hover:text-background/60 text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
