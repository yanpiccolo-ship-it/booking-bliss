import type { Language } from "./translations";

type Dict = {
  showcase: { label: string; title: string; subtitle: string; items: { eyebrow: string; title: string; subtitle: string }[] };
  editorial: { label: string; title: string; viewAll: string; read: string; notes: { cat: string; title: string; excerpt: string }[] };
  market: {
    label: string; title: string; subtitle: string; popular: string; join: string; perMonth: string;
    dirLabel: string; dirTitle: string; allFeatured: string;
    categories: string[]; capabilities: string[]; directory: string[];
    tiers: { name: string; tagline: string; features: string[] }[];
  };
};

const en: Dict = {
  showcase: {
    label: "Live Products", title: "See it. Touch it. Launch it.",
    subtitle: "Three real products built on FlowBooking. Hover any card to preview, click to open the live demo.",
    items: [
      { eyebrow: "Live Demo", title: "Customize your AI Agent", subtitle: "Design, train and launch your own sales assistant." },
      { eyebrow: "Menu Experience", title: "Taste Flow", subtitle: "Cinematic digital menus for restaurants & hotels." },
      { eyebrow: "Website Template · Branding", title: "Flow Studio", subtitle: "Editorial micro-sites tailored to your brand." },
    ],
  },
  editorial: {
    label: "Editorial", title: "Notes from the hospitality desk.", viewAll: "View all", read: "Read the note",
    notes: [
      { cat: "Beauty", title: "The new grammar of luxury salons", excerpt: "Booking rituals, quiet interiors and the return of the personal assistant." },
      { cat: "Food", title: "Cinematic menus & the return of the ritual", excerpt: "Why the world's best restaurants are trading PDFs for editorial digital menus." },
      { cat: "Lifestyle", title: "Slow tech for fast lives", excerpt: "Software that disappears — and gives hospitality teams their attention back." },
      { cat: "Travel", title: "Micro-stays, macro experiences", excerpt: "Independent hotels are winning the weekend with tighter, richer stays." },
      { cat: "Wellness", title: "Silence is the new amenity", excerpt: "How wellness venues design silence into every touchpoint of the guest journey." },
      { cat: "Style", title: "Interiors that book themselves", excerpt: "The rise of design-first venues where the space itself is the reservation." },
    ],
  },
  market: {
    label: "Marketplace · Experiences, Hospitality & Services",
    title: "The premium directory of hospitality suppliers.",
    subtitle: "A curated network of makers, growers, designers and service providers — connected directly with the venues that trust FlowBooking.",
    popular: "Most popular", join: "Join as supplier", perMonth: "/month",
    dirLabel: "Directory · Categories", dirTitle: "Explore the premium directory of hospitality suppliers.", allFeatured: "All featured profiles",
    categories: ["Gastronomy", "Travel & Hospitality", "Wellness", "Events", "Services", "Custom category"],
    capabilities: ["Region / Country / City / Delivery & operating zones", "Google Calendar sync", "MCP native connection", "Agent connectivity (Claude, Google, ChatGPT…)"],
    directory: ["Wineries", "Coffee & Tea", "Bakery & Pastry", "Seafood", "Butchers", "Organic & Farm", "Boutique Hotels", "Resorts & Villas", "Rural & Retreats", "Spa & Thermal", "Florists", "Interior Design", "Architecture", "Live Music & DJ", "Photo & Video", "Events & Weddings", "Beauty & Salons", "Fitness Studios", "Jewelry & Craft", "Fashion & Uniforms", "Local Retail", "Cultural Venues", "Academies", "Family & Kids", "Pet-friendly Services", "Transfers & Mobility", "Maintenance & Ops", "Cleaning & Linen", "Custom category"],
    tiers: [
      { name: "Flow Partner · Basic", tagline: "Get discovered across the FlowBooking network.", features: ["Public supplier profile", "Category tag", "Location & contact", "Appears in platform search", "Black Friday promotions"] },
      { name: "Featured Partner", tagline: "Stand out in your category and region.", features: ["Everything in Basic", "Featured profile placement", "Extended image gallery", "Portfolio section", "Regional priority ranking", "Performance analytics", "Black Friday promotions"] },
      { name: "Premium Partner", tagline: "Full editorial treatment inside the ecosystem.", features: ["Everything in Featured", "Highlighted in Experiences", "Editorial content feature", "Cross-ecosystem campaigns", "Priority qualified leads", "Dedicated account manager", "Black Friday promotions"] },
    ],
  },
};

const es: Dict = {
  showcase: {
    label: "Productos en vivo", title: "Míralo. Tócalo. Lánzalo.",
    subtitle: "Tres productos reales creados con FlowBooking. Pasa sobre una tarjeta para ver la vista previa y haz clic para abrir la demo.",
    items: [
      { eyebrow: "Demo en vivo", title: "Personaliza tu Agente IA", subtitle: "Diseña, entrena y lanza tu propio asistente de ventas." },
      { eyebrow: "Experiencia de menú", title: "Taste Flow", subtitle: "Menús digitales cinematográficos para restaurantes y hoteles." },
      { eyebrow: "Plantilla web · Branding", title: "Flow Studio", subtitle: "Micrositios editoriales a medida de tu marca." },
    ],
  },
  editorial: {
    label: "Editorial", title: "Notas desde la recepción.", viewAll: "Ver todo", read: "Leer la nota",
    notes: [
      { cat: "Belleza", title: "La nueva gramática de los salones de lujo", excerpt: "Rituales de reserva, interiores serenos y el regreso del asistente personal." },
      { cat: "Gastronomía", title: "Menús cinematográficos y el regreso del ritual", excerpt: "Por qué los mejores restaurantes cambian los PDF por menús digitales editoriales." },
      { cat: "Estilo de vida", title: "Tecnología lenta para vidas rápidas", excerpt: "Software que desaparece y devuelve la atención a los equipos de hostelería." },
      { cat: "Viajes", title: "Micro-estancias, macro-experiencias", excerpt: "Los hoteles independientes ganan el fin de semana con estancias más cortas y ricas." },
      { cat: "Bienestar", title: "El silencio es el nuevo servicio", excerpt: "Cómo los centros de bienestar diseñan el silencio en cada momento del huésped." },
      { cat: "Estilo", title: "Interiores que se reservan solos", excerpt: "El auge de los espacios donde el propio diseño es la reserva." },
    ],
  },
  market: {
    label: "Marketplace · Experiencias, Hostelería y Servicios",
    title: "El directorio premium de proveedores de hostelería.",
    subtitle: "Una red seleccionada de artesanos, productores, diseñadores y proveedores, conectada directamente con los negocios que confían en FlowBooking.",
    popular: "Más popular", join: "Unirme como proveedor", perMonth: "/mes",
    dirLabel: "Directorio · Categorías", dirTitle: "Explora el directorio premium de proveedores de hostelería.", allFeatured: "Todos los perfiles destacados",
    categories: ["Gastronomía", "Viajes y Hostelería", "Bienestar", "Eventos", "Servicios", "Categoría personalizada"],
    capabilities: ["Región / País / Ciudad / Zonas de entrega y operación", "Sincronización con Google Calendar", "Conexión nativa MCP", "Conexión con agentes (Claude, Google, ChatGPT…)"],
    directory: ["Bodegas", "Café y Té", "Panadería y Pastelería", "Pescados y Mariscos", "Carnicerías", "Orgánico y Granja", "Hoteles boutique", "Resorts y Villas", "Rural y Retiros", "Spa y Termas", "Floristerías", "Interiorismo", "Arquitectura", "Música en vivo y DJ", "Foto y Vídeo", "Eventos y Bodas", "Belleza y Salones", "Estudios de fitness", "Joyería y Artesanía", "Moda y Uniformes", "Comercio local", "Espacios culturales", "Academias", "Familia y Niños", "Servicios pet-friendly", "Traslados y Movilidad", "Mantenimiento y Operaciones", "Limpieza y Lencería", "Categoría personalizada"],
    tiers: [
      { name: "Flow Partner · Básico", tagline: "Hazte visible en toda la red FlowBooking.", features: ["Perfil público de proveedor", "Etiqueta de categoría", "Ubicación y contacto", "Aparece en la búsqueda", "Promociones Black Friday"] },
      { name: "Partner Destacado", tagline: "Destaca en tu categoría y región.", features: ["Todo lo del Básico", "Perfil en posición destacada", "Galería de imágenes ampliada", "Sección de portfolio", "Prioridad regional", "Analíticas de rendimiento", "Promociones Black Friday"] },
      { name: "Partner Premium", tagline: "Tratamiento editorial completo en el ecosistema.", features: ["Todo lo del Destacado", "Destacado en Experiencias", "Contenido editorial propio", "Campañas en todo el ecosistema", "Leads cualificados prioritarios", "Gestor de cuenta dedicado", "Promociones Black Friday"] },
    ],
  },
};

const it: Dict = {
  showcase: {
    label: "Prodotti dal vivo", title: "Guardalo. Toccalo. Lancialo.",
    subtitle: "Tre prodotti reali creati con FlowBooking. Passa sopra una scheda per l'anteprima, clicca per aprire la demo.",
    items: [
      { eyebrow: "Demo dal vivo", title: "Personalizza il tuo Agente IA", subtitle: "Progetta, addestra e lancia il tuo assistente vendite." },
      { eyebrow: "Esperienza menu", title: "Taste Flow", subtitle: "Menu digitali cinematografici per ristoranti e hotel." },
      { eyebrow: "Template sito · Branding", title: "Flow Studio", subtitle: "Micro-siti editoriali su misura per il tuo brand." },
    ],
  },
  editorial: {
    label: "Editoriale", title: "Note dalla reception.", viewAll: "Vedi tutto", read: "Leggi la nota",
    notes: [
      { cat: "Bellezza", title: "La nuova grammatica dei saloni di lusso", excerpt: "Rituali di prenotazione, interni silenziosi e il ritorno dell'assistente personale." },
      { cat: "Food", title: "Menu cinematografici e il ritorno del rito", excerpt: "Perché i migliori ristoranti sostituiscono i PDF con menu digitali editoriali." },
      { cat: "Lifestyle", title: "Tecnologia lenta per vite veloci", excerpt: "Software che scompare e restituisce attenzione ai team dell'ospitalità." },
      { cat: "Viaggi", title: "Micro-soggiorni, macro-esperienze", excerpt: "Gli hotel indipendenti vincono il weekend con soggiorni più brevi e ricchi." },
      { cat: "Benessere", title: "Il silenzio è il nuovo servizio", excerpt: "Come i centri benessere progettano il silenzio in ogni momento dell'ospite." },
      { cat: "Stile", title: "Interni che si prenotano da soli", excerpt: "L'ascesa dei luoghi in cui lo spazio stesso è la prenotazione." },
    ],
  },
  market: {
    label: "Marketplace · Esperienze, Ospitalità e Servizi",
    title: "La directory premium dei fornitori dell'ospitalità.",
    subtitle: "Una rete selezionata di artigiani, produttori, designer e fornitori, collegata direttamente alle strutture che scelgono FlowBooking.",
    popular: "Più scelto", join: "Diventa fornitore", perMonth: "/mese",
    dirLabel: "Directory · Categorie", dirTitle: "Esplora la directory premium dei fornitori dell'ospitalità.", allFeatured: "Tutti i profili in evidenza",
    categories: ["Gastronomia", "Viaggi e Ospitalità", "Benessere", "Eventi", "Servizi", "Categoria personalizzata"],
    capabilities: ["Regione / Paese / Città / Zone di consegna e operative", "Sincronizzazione Google Calendar", "Connessione nativa MCP", "Connessione agenti (Claude, Google, ChatGPT…)"],
    directory: ["Cantine", "Caffè e Tè", "Panetteria e Pasticceria", "Pesce e Frutti di mare", "Macellerie", "Bio e Fattoria", "Hotel boutique", "Resort e Ville", "Rurale e Ritiri", "Spa e Terme", "Fioristi", "Interior design", "Architettura", "Musica dal vivo e DJ", "Foto e Video", "Eventi e Matrimoni", "Bellezza e Saloni", "Studi fitness", "Gioielli e Artigianato", "Moda e Divise", "Negozi locali", "Luoghi culturali", "Accademie", "Famiglie e Bambini", "Servizi pet-friendly", "Transfer e Mobilità", "Manutenzione", "Pulizie e Biancheria", "Categoria personalizzata"],
    tiers: [
      { name: "Flow Partner · Base", tagline: "Fatti scoprire in tutta la rete FlowBooking.", features: ["Profilo pubblico fornitore", "Tag di categoria", "Posizione e contatti", "Presente nella ricerca", "Promozioni Black Friday"] },
      { name: "Partner in Evidenza", tagline: "Distinguiti nella tua categoria e regione.", features: ["Tutto del Base", "Profilo in evidenza", "Galleria immagini estesa", "Sezione portfolio", "Priorità regionale", "Analisi delle performance", "Promozioni Black Friday"] },
      { name: "Partner Premium", tagline: "Trattamento editoriale completo nell'ecosistema.", features: ["Tutto dell'Evidenza", "In primo piano in Esperienze", "Contenuto editoriale dedicato", "Campagne in tutto l'ecosistema", "Lead qualificati prioritari", "Account manager dedicato", "Promozioni Black Friday"] },
    ],
  },
};

const fr: Dict = {
  showcase: {
    label: "Produits en direct", title: "Voyez. Touchez. Lancez.",
    subtitle: "Trois vrais produits construits avec FlowBooking. Survolez une carte pour l'aperçu, cliquez pour ouvrir la démo.",
    items: [
      { eyebrow: "Démo en direct", title: "Personnalisez votre Agent IA", subtitle: "Concevez, entraînez et lancez votre assistant commercial." },
      { eyebrow: "Expérience menu", title: "Taste Flow", subtitle: "Menus numériques cinématographiques pour restaurants et hôtels." },
      { eyebrow: "Modèle de site · Branding", title: "Flow Studio", subtitle: "Micro-sites éditoriaux adaptés à votre marque." },
    ],
  },
  editorial: {
    label: "Éditorial", title: "Notes depuis la réception.", viewAll: "Tout voir", read: "Lire la note",
    notes: [
      { cat: "Beauté", title: "La nouvelle grammaire des salons de luxe", excerpt: "Rituels de réservation, intérieurs calmes et retour de l'assistant personnel." },
      { cat: "Gastronomie", title: "Menus cinématographiques et retour du rituel", excerpt: "Pourquoi les meilleurs restaurants remplacent les PDF par des menus éditoriaux." },
      { cat: "Art de vivre", title: "Une tech lente pour des vies rapides", excerpt: "Un logiciel qui s'efface et rend leur attention aux équipes." },
      { cat: "Voyage", title: "Micro-séjours, macro-expériences", excerpt: "Les hôtels indépendants gagnent le week-end avec des séjours plus courts et riches." },
      { cat: "Bien-être", title: "Le silence, nouveau service", excerpt: "Comment les lieux de bien-être intègrent le silence à chaque étape." },
      { cat: "Style", title: "Des intérieurs qui se réservent seuls", excerpt: "L'essor des lieux où l'espace lui-même est la réservation." },
    ],
  },
  market: {
    label: "Marketplace · Expériences, Hôtellerie et Services",
    title: "L'annuaire premium des fournisseurs de l'hôtellerie.",
    subtitle: "Un réseau sélectionné d'artisans, producteurs, designers et prestataires, connecté directement aux établissements qui font confiance à FlowBooking.",
    popular: "Le plus choisi", join: "Devenir fournisseur", perMonth: "/mois",
    dirLabel: "Annuaire · Catégories", dirTitle: "Explorez l'annuaire premium des fournisseurs de l'hôtellerie.", allFeatured: "Tous les profils en vedette",
    categories: ["Gastronomie", "Voyage et Hôtellerie", "Bien-être", "Événements", "Services", "Catégorie personnalisée"],
    capabilities: ["Région / Pays / Ville / Zones de livraison et d'activité", "Synchronisation Google Agenda", "Connexion MCP native", "Connexion aux agents (Claude, Google, ChatGPT…)"],
    directory: ["Domaines viticoles", "Café et Thé", "Boulangerie et Pâtisserie", "Produits de la mer", "Boucheries", "Bio et Ferme", "Hôtels boutique", "Resorts et Villas", "Campagne et Retraites", "Spa et Thermes", "Fleuristes", "Design d'intérieur", "Architecture", "Musique live et DJ", "Photo et Vidéo", "Événements et Mariages", "Beauté et Salons", "Studios fitness", "Bijoux et Artisanat", "Mode et Uniformes", "Commerce local", "Lieux culturels", "Académies", "Famille et Enfants", "Services pet-friendly", "Transferts et Mobilité", "Maintenance", "Nettoyage et Linge", "Catégorie personnalisée"],
    tiers: [
      { name: "Flow Partner · Basique", tagline: "Soyez découvert sur tout le réseau FlowBooking.", features: ["Profil fournisseur public", "Étiquette de catégorie", "Adresse et contact", "Visible dans la recherche", "Promotions Black Friday"] },
      { name: "Partenaire en vedette", tagline: "Démarquez-vous dans votre catégorie et région.", features: ["Tout le Basique", "Profil mis en avant", "Galerie d'images étendue", "Section portfolio", "Priorité régionale", "Statistiques de performance", "Promotions Black Friday"] },
      { name: "Partenaire Premium", tagline: "Traitement éditorial complet dans l'écosystème.", features: ["Tout le Vedette", "Mis en avant dans Expériences", "Contenu éditorial dédié", "Campagnes dans tout l'écosystème", "Leads qualifiés prioritaires", "Gestionnaire de compte dédié", "Promotions Black Friday"] },
    ],
  },
};

const pt: Dict = {
  showcase: {
    label: "Produtos ao vivo", title: "Veja. Toque. Lance.",
    subtitle: "Três produtos reais criados com FlowBooking. Passe sobre um cartão para pré-visualizar, clique para abrir a demo.",
    items: [
      { eyebrow: "Demo ao vivo", title: "Personalize seu Agente IA", subtitle: "Crie, treine e lance seu próprio assistente de vendas." },
      { eyebrow: "Experiência de menu", title: "Taste Flow", subtitle: "Menus digitais cinematográficos para restaurantes e hotéis." },
      { eyebrow: "Modelo de site · Branding", title: "Flow Studio", subtitle: "Micro-sites editoriais sob medida para sua marca." },
    ],
  },
  editorial: {
    label: "Editorial", title: "Notas da recepção.", viewAll: "Ver tudo", read: "Ler a nota",
    notes: [
      { cat: "Beleza", title: "A nova gramática dos salões de luxo", excerpt: "Rituais de reserva, interiores serenos e o retorno do assistente pessoal." },
      { cat: "Gastronomia", title: "Menus cinematográficos e o retorno do ritual", excerpt: "Por que os melhores restaurantes trocam PDFs por menus digitais editoriais." },
      { cat: "Estilo de vida", title: "Tecnologia lenta para vidas rápidas", excerpt: "Software que desaparece e devolve a atenção às equipes." },
      { cat: "Viagem", title: "Micro-estadias, macro-experiências", excerpt: "Hotéis independentes conquistam o fim de semana com estadias mais curtas e ricas." },
      { cat: "Bem-estar", title: "O silêncio é o novo serviço", excerpt: "Como espaços de bem-estar criam silêncio em cada momento do hóspede." },
      { cat: "Estilo", title: "Interiores que se reservam sozinhos", excerpt: "A ascensão dos espaços onde o próprio design é a reserva." },
    ],
  },
  market: {
    label: "Marketplace · Experiências, Hotelaria e Serviços",
    title: "O diretório premium de fornecedores de hotelaria.",
    subtitle: "Uma rede selecionada de artesãos, produtores, designers e prestadores, conectada diretamente aos negócios que confiam na FlowBooking.",
    popular: "Mais popular", join: "Entrar como fornecedor", perMonth: "/mês",
    dirLabel: "Diretório · Categorias", dirTitle: "Explore o diretório premium de fornecedores de hotelaria.", allFeatured: "Todos os perfis em destaque",
    categories: ["Gastronomia", "Viagem e Hotelaria", "Bem-estar", "Eventos", "Serviços", "Categoria personalizada"],
    capabilities: ["Região / País / Cidade / Zonas de entrega e operação", "Sincronização com Google Agenda", "Conexão nativa MCP", "Conexão com agentes (Claude, Google, ChatGPT…)"],
    directory: ["Vinícolas", "Café e Chá", "Padaria e Confeitaria", "Frutos do mar", "Açougues", "Orgânico e Fazenda", "Hotéis boutique", "Resorts e Villas", "Rural e Retiros", "Spa e Termas", "Floriculturas", "Design de interiores", "Arquitetura", "Música ao vivo e DJ", "Foto e Vídeo", "Eventos e Casamentos", "Beleza e Salões", "Estúdios fitness", "Joias e Artesanato", "Moda e Uniformes", "Comércio local", "Espaços culturais", "Academias", "Família e Crianças", "Serviços pet-friendly", "Transfers e Mobilidade", "Manutenção", "Limpeza e Enxoval", "Categoria personalizada"],
    tiers: [
      { name: "Flow Partner · Básico", tagline: "Seja descoberto em toda a rede FlowBooking.", features: ["Perfil público de fornecedor", "Etiqueta de categoria", "Localização e contato", "Aparece na busca", "Promoções Black Friday"] },
      { name: "Parceiro Destaque", tagline: "Destaque-se na sua categoria e região.", features: ["Tudo do Básico", "Perfil em destaque", "Galeria de imagens ampliada", "Seção de portfólio", "Prioridade regional", "Análises de desempenho", "Promoções Black Friday"] },
      { name: "Parceiro Premium", tagline: "Tratamento editorial completo no ecossistema.", features: ["Tudo do Destaque", "Destaque em Experiências", "Conteúdo editorial dedicado", "Campanhas em todo o ecossistema", "Leads qualificados prioritários", "Gerente de conta dedicado", "Promoções Black Friday"] },
    ],
  },
};

const de: Dict = {
  showcase: {
    label: "Live-Produkte", title: "Sehen. Anfassen. Starten.",
    subtitle: "Drei echte Produkte auf Basis von FlowBooking. Karte berühren für die Vorschau, klicken für die Live-Demo.",
    items: [
      { eyebrow: "Live-Demo", title: "Passe deinen KI-Agenten an", subtitle: "Gestalte, trainiere und starte deinen eigenen Verkaufsassistenten." },
      { eyebrow: "Menü-Erlebnis", title: "Taste Flow", subtitle: "Cineastische digitale Menüs für Restaurants und Hotels." },
      { eyebrow: "Website-Vorlage · Branding", title: "Flow Studio", subtitle: "Redaktionelle Micro-Sites passend zu deiner Marke." },
    ],
  },
  editorial: {
    label: "Editorial", title: "Notizen von der Rezeption.", viewAll: "Alle ansehen", read: "Notiz lesen",
    notes: [
      { cat: "Beauty", title: "Die neue Sprache der Luxussalons", excerpt: "Buchungsrituale, ruhige Interieurs und die Rückkehr des persönlichen Assistenten." },
      { cat: "Food", title: "Cineastische Menüs und die Rückkehr des Rituals", excerpt: "Warum Spitzenrestaurants PDFs gegen redaktionelle digitale Menüs tauschen." },
      { cat: "Lifestyle", title: "Langsame Technik für schnelle Leben", excerpt: "Software, die verschwindet und Teams ihre Aufmerksamkeit zurückgibt." },
      { cat: "Reisen", title: "Mikro-Aufenthalte, Makro-Erlebnisse", excerpt: "Unabhängige Hotels gewinnen das Wochenende mit kürzeren, reicheren Aufenthalten." },
      { cat: "Wellness", title: "Stille ist der neue Luxus", excerpt: "Wie Wellness-Häuser Stille in jeden Moment des Gastes einbauen." },
      { cat: "Stil", title: "Räume, die sich selbst buchen", excerpt: "Der Aufstieg von Design-Orten, an denen der Raum selbst die Buchung ist." },
    ],
  },
  market: {
    label: "Marktplatz · Erlebnisse, Gastgewerbe & Services",
    title: "Das Premium-Verzeichnis für Gastgewerbe-Lieferanten.",
    subtitle: "Ein kuratiertes Netzwerk aus Handwerkern, Erzeugern, Designern und Dienstleistern, direkt verbunden mit den Betrieben, die FlowBooking vertrauen.",
    popular: "Am beliebtesten", join: "Als Lieferant beitreten", perMonth: "/Monat",
    dirLabel: "Verzeichnis · Kategorien", dirTitle: "Entdecke das Premium-Verzeichnis für Gastgewerbe-Lieferanten.", allFeatured: "Alle hervorgehobenen Profile",
    categories: ["Gastronomie", "Reisen & Gastgewerbe", "Wellness", "Events", "Services", "Eigene Kategorie"],
    capabilities: ["Region / Land / Stadt / Liefer- und Einsatzgebiete", "Google-Kalender-Sync", "Native MCP-Verbindung", "Agenten-Anbindung (Claude, Google, ChatGPT…)"],
    directory: ["Weingüter", "Kaffee & Tee", "Bäckerei & Konditorei", "Fisch & Meeresfrüchte", "Metzgereien", "Bio & Hof", "Boutique-Hotels", "Resorts & Villen", "Land & Retreats", "Spa & Therme", "Floristen", "Innenarchitektur", "Architektur", "Livemusik & DJ", "Foto & Video", "Events & Hochzeiten", "Beauty & Salons", "Fitnessstudios", "Schmuck & Handwerk", "Mode & Uniformen", "Lokaler Handel", "Kulturorte", "Akademien", "Familie & Kinder", "Haustierfreundliche Services", "Transfers & Mobilität", "Wartung & Betrieb", "Reinigung & Wäsche", "Eigene Kategorie"],
    tiers: [
      { name: "Flow Partner · Basic", tagline: "Werde im gesamten FlowBooking-Netzwerk gefunden.", features: ["Öffentliches Lieferantenprofil", "Kategorie-Tag", "Standort & Kontakt", "Erscheint in der Suche", "Black-Friday-Aktionen"] },
      { name: "Featured Partner", tagline: "Hebe dich in Kategorie und Region ab.", features: ["Alles aus Basic", "Hervorgehobene Platzierung", "Erweiterte Bildergalerie", "Portfolio-Bereich", "Regionale Priorität", "Leistungsanalysen", "Black-Friday-Aktionen"] },
      { name: "Premium Partner", tagline: "Volle redaktionelle Präsenz im Ökosystem.", features: ["Alles aus Featured", "Hervorgehoben in Erlebnisse", "Eigener redaktioneller Beitrag", "Ökosystem-weite Kampagnen", "Bevorzugte qualifizierte Leads", "Persönlicher Account-Manager", "Black-Friday-Aktionen"] },
    ],
  },
};

const dicts: Record<string, Dict> = { en, es, it, fr, pt, de };
export const getSections = (lang: Language): Dict => dicts[lang] ?? en;
