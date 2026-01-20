import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Cpu } from "lucide-react";
import LanguageSelector from "./LanguageSelector";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Módulos", href: "#modules" },
    { name: "Industrias", href: "#verticals" },
    { name: "Membresías", href: "#pricing" },
    { name: "Contacto", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "glass border-b border-border/50" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-soft transition-colors ${
              isScrolled ? "bg-foreground" : "bg-background/20 backdrop-blur-sm"
            }`}>
              <Cpu className={`w-5 h-5 ${isScrolled ? "text-background" : "text-background"}`} />
            </div>
            <span className={`font-display font-bold text-xl transition-colors ${
              isScrolled ? "text-foreground" : "text-background"
            }`}>
              Booking<span className={isScrolled ? "text-muted-foreground" : "text-background/70"}>Intelligence</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`hover:opacity-100 transition-all duration-200 font-medium text-sm ${
                  isScrolled 
                    ? "text-muted-foreground hover:text-foreground" 
                    : "text-background/80 hover:text-background"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA + Language */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSelector />
            <Button 
              variant="ghost" 
              size="sm" 
              className={isScrolled ? "text-muted-foreground" : "text-background/80 hover:text-background hover:bg-background/10"}
            >
              Iniciar sesión
            </Button>
            <Button 
              size="default"
              className={isScrolled 
                ? "bg-foreground text-background hover:bg-foreground/90" 
                : "bg-background text-foreground hover:bg-background/90"
              }
            >
              Solicitar Demo
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? "hover:bg-muted" : "hover:bg-background/10"
            }`}
          >
            {isOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-background"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-background"}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-border/50"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-border flex flex-col gap-2">
                <Button variant="ghost" className="w-full text-muted-foreground">
                  Iniciar sesión
                </Button>
                <Button className="w-full bg-foreground text-background">
                  Solicitar Demo
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
