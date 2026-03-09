import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Phone, Mail, MessageCircle, Star, Clock, Calendar, ChevronRight, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingCalendar from "@/components/booking/BookingCalendar";

interface BusinessData {
  id: string;
  name: string;
  description: string | null;
  vertical: string;
  address: string | null;
  city: string | null;
  country: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_whatsapp: string | null;
  logo_url: string | null;
  gallery_urls: string[];
  theme_color: string;
  social_links: Record<string, string>;
}

interface ServiceData {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_cents: number;
  capacity: number;
  category: string | null;
}

interface ReviewData {
  id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

const VERTICAL_LABELS: Record<string, string> = {
  restaurante: "Restaurante", hotel: "Hotel", spa: "Spa", gym: "Gimnasio",
  yoga: "Yoga", peluqueria: "Peluquería", clinica: "Clínica", veterinaria: "Veterinaria",
  coaching: "Coaching", workshop: "Taller/Workshop", tour: "Tour", coworking: "Coworking",
};

const BusinessSite = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [activeSection, setActiveSection] = useState<"info" | "services" | "reviews" | "booking">("info");

  useEffect(() => {
    if (businessId) loadBusiness();
  }, [businessId]);

  const loadBusiness = async () => {
    try {
      // Try by slug first, then by id
      let query = supabase.from("businesses").select("*").eq("is_active", true);
      
      // UUID pattern check
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(businessId!);
      if (isUuid) {
        query = query.eq("id", businessId);
      } else {
        query = query.eq("slug", businessId);
      }

      const { data: biz } = await query.single();
      if (!biz) return;
      
      setBusiness({
        ...biz,
        gallery_urls: (biz.gallery_urls as string[] | null) || [],
        theme_color: (biz.theme_color as string) || "#10b981",
        social_links: (biz.social_links as Record<string, string>) || {},
      });

      // Load services and reviews in parallel
      const [servicesRes, reviewsRes] = await Promise.all([
        supabase.from("services").select("*").eq("business_id", biz.id).eq("is_active", true),
        supabase.from("reviews").select("*").eq("business_id", biz.id).eq("is_visible", true).order("created_at", { ascending: false }).limit(10),
      ]);

      setServices(servicesRes.data || []);
      setReviews(reviewsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Negocio no encontrado</h1>
          <p className="text-muted-foreground">El enlace puede ser incorrecto o el negocio no está activo.</p>
        </div>
      </div>
    );
  }

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-56 overflow-hidden" style={{ background: `linear-gradient(135deg, ${business.theme_color}, ${business.theme_color}dd)` }}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
          {business.logo_url && (
            <img src={business.logo_url} alt={business.name} className="w-16 h-16 rounded-2xl object-cover mb-3 border-2 border-white/30" />
          )}
          <h1 className="text-2xl font-bold">{business.name}</h1>
          <div className="flex items-center gap-3 mt-1 text-white/80 text-sm">
            <span>{VERTICAL_LABELS[business.vertical] || business.vertical}</span>
            {avgRating && (
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" />{avgRating} ({reviews.length})
              </span>
            )}
          </div>
          {business.city && (
            <p className="flex items-center gap-1 mt-1 text-white/70 text-xs">
              <MapPin className="w-3 h-3" />{business.city}{business.country ? `, ${business.country}` : ""}
            </p>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-20 bg-background border-b border-border">
        <div className="flex">
          {([
            { key: "info", label: "Info" },
            { key: "services", label: "Servicios" },
            { key: "reviews", label: "Reseñas" },
            { key: "booking", label: "Reservar" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`flex-1 py-3 text-sm font-medium transition-all border-b-2 ${
                activeSection === tab.key
                  ? "border-current text-foreground"
                  : "border-transparent text-muted-foreground"
              }`}
              style={activeSection === tab.key ? { color: business.theme_color } : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pb-24 max-w-lg mx-auto">
        {/* Info Section */}
        {activeSection === "info" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {business.description && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Sobre nosotros</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{business.description}</p>
              </div>
            )}

            {/* Gallery */}
            {business.gallery_urls.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">Galería</h2>
                <div className="grid grid-cols-2 gap-2">
                  {business.gallery_urls.map((url, i) => (
                    <img key={i} src={url} alt={`${business.name} ${i + 1}`} className="rounded-xl aspect-square object-cover w-full" />
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Contacto</h2>
              <div className="space-y-3">
                {business.address && (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(business.address + " " + (business.city || ""))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground">{business.address}{business.city ? `, ${business.city}` : ""}</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
                  </a>
                )}
                {business.contact_phone && (
                  <a href={`tel:${business.contact_phone}`} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">{business.contact_phone}</span>
                  </a>
                )}
                {business.contact_email && (
                  <a href={`mailto:${business.contact_email}`} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">{business.contact_email}</span>
                  </a>
                )}
                {business.contact_whatsapp && (
                  <a href={`https://wa.me/${business.contact_whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <MessageCircle className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">WhatsApp</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Services Section */}
        {activeSection === "services" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground mb-4">Nuestros servicios</h2>
            {services.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No hay servicios disponibles aún.</p>
            ) : (
              services.map((service) => (
                <div key={service.id} className="p-4 rounded-2xl border border-border bg-card">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-foreground">{service.name}</p>
                      {service.description && <p className="text-sm text-muted-foreground mt-1">{service.description}</p>}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{service.duration_minutes} min</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-foreground">€{(service.price_cents / 100).toFixed(2)}</span>
                      <Button
                        size="sm"
                        className="mt-2 rounded-xl text-xs"
                        style={{ backgroundColor: business.theme_color }}
                        onClick={() => setActiveSection("booking")}
                      >
                        Reservar
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Reviews Section */}
        {activeSection === "reviews" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Reseñas</h2>
              {avgRating && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-foreground">{avgRating}</span>
                  <span className="text-muted-foreground">({reviews.length})</span>
                </div>
              )}
            </div>
            {reviews.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">Aún no hay reseñas.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="p-4 rounded-2xl bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ backgroundColor: business.theme_color }}>
                      {review.customer_name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{review.customer_name}</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Booking Section */}
        {activeSection === "booking" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <BookingCalendar businessId={business.id} services={services} themeColor={business.theme_color} />
          </motion.div>
        )}
      </div>

      {/* Floating CTA */}
      {activeSection !== "booking" && services.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
          <Button
            onClick={() => setActiveSection("booking")}
            className="w-full h-14 rounded-2xl text-base font-semibold text-white shadow-lg max-w-lg mx-auto flex"
            style={{ backgroundColor: business.theme_color }}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Reservar ahora
          </Button>
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-4 text-xs text-muted-foreground border-t border-border">
        Powered by <span className="font-medium">FlowBooking</span>
      </div>
    </div>
  );
};

export default BusinessSite;
