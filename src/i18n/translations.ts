export type Language = 'en' | 'es' | 'it' | 'fr' | 'pt' | 'de';

export const languages: { code: Language; label: string; name: string }[] = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'it', label: 'IT', name: 'Italiano' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'pt', label: 'PT', name: 'Português' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
];

export interface Translations {
  // Navigation
  nav: {
    modules: string;
    industries: string;
    memberships: string;
    contact: string;
    login: string;
    requestDemo: string;
  };
  // Hero
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    cta: string;
    ctaSecondary: string;
    scrollDown: string;
  };
  // Module Carousel
  modules: {
    sectionTitle: string;
    sectionSubtitle: string;
    explore: string;
    items: {
      spa: { title: string; description: string };
      restaurant: { title: string; description: string };
      travel: { title: string; description: string };
      workshop: { title: string; description: string };
      coworking: { title: string; description: string };
      experiences: { title: string; description: string };
    };
  };
  // Editorial Section
  editorial: {
    panel1: {
      title: string;
      description: string;
      cta: string;
    };
    panel2: {
      left: { title: string; description: string };
      right: { title: string; description: string };
    };
    panel3: {
      title: string;
      description: string;
    };
  };
  // AI Agents
  agents: {
    sectionLabel: string;
    sectionTitle: string;
    sectionSubtitle: string;
    evolutionNote: string;
    items: {
      operational: { name: string; description: string; capabilities: string[] };
      content: { name: string; description: string; capabilities: string[] };
      design: { name: string; description: string; capabilities: string[] };
      communication: { name: string; description: string; capabilities: string[] };
      scheduling: { name: string; description: string; capabilities: string[] };
      support: { name: string; description: string; capabilities: string[] };
    };
  };
  // Features
  features: {
    sectionLabel: string;
    sectionTitle: string;
    sectionSubtitle: string;
    items: {
      dailyMenu: { title: string; description: string; output: string };
      smartBooking: { title: string; description: string; output: string };
      activePayments: { title: string; description: string; output: string };
      scheduleProgram: { title: string; description: string; output: string };
      stockManagement: { title: string; description: string; output: string };
      multiLanguage: { title: string; description: string; output: string };
    };
  };
  // Verticals
  verticals: {
    sectionLabel: string;
    sectionTitle: string;
    sectionSubtitle: string;
    items: {
      hospitality: { title: string; description: string; examples: string[] };
      accommodation: { title: string; description: string; examples: string[] };
      wellness: { title: string; description: string; examples: string[] };
      professional: { title: string; description: string; examples: string[] };
    };
  };
  // Social Proof
  socialProof: {
    sectionLabel: string;
    sectionTitle: string;
    stats: {
      attention: string;
      languages: string;
      scalability: string;
      agents: string;
    };
    testimonials: {
      t1: { quote: string; author: string; role: string };
      t2: { quote: string; author: string; role: string };
      t3: { quote: string; author: string; role: string };
    };
  };
  // Pricing
  pricing: {
    sectionLabel: string;
    sectionTitle: string;
    sectionSubtitle: string;
    popular: string;
    setupLabel: string;
    monthlyLabel: string;
    perMonth: string;
    ctaStart: string;
    ctaDemo: string;
    ctaAdvisor: string;
    bonusTitle: string;
    bonusDescription: string;
    installmentTitle: string;
    installmentDescription: string;
    languagesSupported: string;
    plans: {
      basic: {
        name: string;
        description: string;
        features: string[];
      };
      advanced: {
        name: string;
        description: string;
        features: string[];
      };
      custom: {
        name: string;
        description: string;
        features: string[];
      };
    };
  };
  // CTA
  cta: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    primaryBtn: string;
    secondaryBtn: string;
    points: string[];
    evolutionTitle: string;
    evolutionDescription: string;
  };
  // Footer
  footer: {
    description: string;
    categories: {
      platform: { title: string; links: string[] };
      industries: { title: string; links: string[] };
      company: { title: string; links: string[] };
      legal: { title: string; links: string[] };
    };
    copyright: string;
  };
  // Chat Preview
  chat: {
    title: string;
    status: string;
    inputPlaceholder: string;
    messages: {
      greeting: string;
      question: string;
      userResponse: string;
      confirmation: string;
    };
  };
  // Sales Chat Widget
  salesChat: {
    title: string;
    status: string;
    inputPlaceholder: string;
    greeting: string;
    errorMessage: string;
    connectionError: string;
    retry: string;
    poweredBy: string;
    quickAction1: string;
    quickAction2: string;
    quickAction3: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      modules: 'Modules',
      industries: 'Industries',
      memberships: 'Memberships',
      contact: 'Contact',
      login: 'Sign In',
      requestDemo: 'Request Demo',
    },
    hero: {
      badge: 'Intelligent Platform for Business',
      title: 'Your business, powered by',
      titleHighlight: 'AI Agents',
      subtitle: 'Intelligent operating system for hospitality, gastronomy, travel and experiences. Automated reservations, dynamic menus, and scalable growth.',
      cta: 'Request Demo',
      ctaSecondary: 'See in Action',
      scrollDown: 'Scroll to discover',
    },
    modules: {
      sectionTitle: 'Modules',
      sectionSubtitle: 'Every module adapts to your business and works autonomously with specialized AI agents.',
      explore: 'Explore module',
      items: {
        spa: { title: 'Spa & Clinics', description: 'Reservations, treatments, professionals, and wellness services.' },
        restaurant: { title: 'Restaurant', description: 'Daily menus, QR, PDF, WhatsApp, and table reservations.' },
        travel: { title: 'Travel & Tours', description: 'Itineraries, experiences, personalized tours, and multi-day trips.' },
        workshop: { title: 'Workshops & Classes', description: 'Courses, sessions, recurring schedules, and registrations.' },
        coworking: { title: 'Coworking & Events', description: 'Spaces, passes, events, and professional community.' },
        experiences: { title: 'Experiences', description: 'Wellness retreats, gastronomy, nature, and unique moments.' },
      },
    },
    editorial: {
      panel1: {
        title: 'Daily menus in minutes',
        description: 'Send a voice note or text. The AI generates PDFs, WhatsApp messages, and QR codes automatically.',
        cta: 'See how it works',
      },
      panel2: {
        left: { title: 'Smart reservations 24/7', description: 'Automatic booking management for hotels, hostels, and retreats.' },
        right: { title: 'Experiences that sell themselves', description: 'Wellness, gastronomy, and nature with integrated payments.' },
      },
      panel3: {
        title: 'Itineraries that inspire',
        description: 'Multi-day travel experiences with automatic scheduling and instant confirmations.',
      },
    },
    agents: {
      sectionLabel: 'Specialized AI Agents',
      sectionTitle: 'An intelligent team that never rests',
      sectionSubtitle: 'Each agent specializes in a specific area of your business, operating 24/7 with full automation.',
      evolutionNote: 'Agents evolve with your business: they learn, adapt, and optimize continuously.',
      items: {
        operational: { name: 'Operational Agent', description: 'Manages reservations, capacity, and availability in real-time.', capabilities: ['Calendar sync', 'Conflict management', 'Automatic confirmations'] },
        content: { name: 'Content Agent', description: 'Generates menus, descriptions, and promotional materials.', capabilities: ['Daily menus', 'PDF/WhatsApp', 'Dynamic QR'] },
        design: { name: 'Design Agent', description: 'Creates aesthetic visual content adapted to your brand.', capabilities: ['Templates', 'Branding', 'Visual exports'] },
        communication: { name: 'Communication Agent', description: 'Manages customer interactions across all channels.', capabilities: ['Multi-channel', 'Auto-responses', 'Follow-up'] },
        scheduling: { name: 'Scheduling Agent', description: 'Plans and schedules activities in advance.', capabilities: ['Weekly/monthly', 'Recurring', 'Stock link'] },
        support: { name: 'Support Agent', description: 'Answers questions and resolves issues 24/7.', capabilities: ['FAQ', 'Escalation', 'Satisfaction'] },
      },
    },
    features: {
      sectionLabel: 'Core Capabilities',
      sectionTitle: 'Powerful automation',
      sectionSubtitle: 'Advanced features that transform daily operations into automatic processes.',
      items: {
        dailyMenu: { title: 'Daily Menu', description: 'Voice note to PDF, WhatsApp, and QR in seconds.', output: 'PDF + WhatsApp + QR' },
        smartBooking: { title: 'Smart Booking', description: 'Google/Outlook sync, no double bookings.', output: 'Real-time calendar' },
        activePayments: { title: 'Active Payments', description: 'Stripe/Revolut integration for direct sales.', output: 'Automated collection' },
        scheduleProgram: { title: 'Advance Programming', description: 'Weekly/monthly planning with automation.', output: 'Recurring schedule' },
        stockManagement: { title: 'Stock & Suppliers', description: 'Inventory control with automatic alerts.', output: 'Smart management' },
        multiLanguage: { title: 'Multi-language', description: '6 languages with automatic detection.', output: 'Global reach' },
      },
    },
    verticals: {
      sectionLabel: 'Industries',
      sectionTitle: 'Adapted to your sector',
      sectionSubtitle: 'Specialized vocabulary and logic for each type of business.',
      items: {
        hospitality: { title: 'Hospitality', description: 'Restaurants, bars, and gastronomic services.', examples: ['Restaurants', 'Bars', 'Cafés', 'Catering'] },
        accommodation: { title: 'Accommodation', description: 'Hotels, hostels, retreats, and spaces.', examples: ['Hotels', 'Hostels', 'Retreats', 'B&B'] },
        wellness: { title: 'Wellness', description: 'Spa, therapies, yoga, and personal care.', examples: ['Spa', 'Yoga', 'Therapies', 'Gym'] },
        professional: { title: 'Professional', description: 'Workshops, coaching, and specialized services.', examples: ['Workshops', 'Coaching', 'Classes', 'Consulting'] },
      },
    },
    socialProof: {
      sectionLabel: 'Testimonials',
      sectionTitle: 'Businesses that trust us',
      stats: {
        attention: '24/7 Continuous support',
        languages: '6 Supported languages',
        scalability: '∞ Scalability',
        agents: 'AI Specialized agents',
      },
      testimonials: {
        t1: { quote: 'The AI agent system has transformed how we manage our restaurant. Daily menus are generated in minutes.', author: 'María García', role: 'Executive Chef, Barcelona' },
        t2: { quote: 'Advance scheduling allows us to plan entire weeks. Logistics and purchases have never been easier.', author: 'Alessandro Rossi', role: 'Hotel Director, Milano' },
        t3: { quote: 'Finally a platform that understands hospitality. Multi-language support is exceptional for our international guests.', author: 'James Mitchell', role: 'Retreat Manager, Ibiza' },
      },
    },
    pricing: {
      sectionLabel: 'Pricing',
      sectionTitle: 'Plans and Pricing',
      sectionSubtitle: 'Activate your intelligent system in a few days and start automating your business.',
      popular: 'Recommended',
      setupLabel: 'Setup',
      monthlyLabel: 'Monthly',
      perMonth: 'month',
      ctaStart: 'Start now',
      ctaDemo: 'Request demo',
      ctaAdvisor: 'Talk to an advisor',
      bonusTitle: 'Express Activation in 48h included',
      bonusDescription: 'Value €150 — included in all plans.',
      installmentTitle: 'Split payment available',
      installmentDescription: '€190 to start + remainder upon activation (Basic Plan).',
      languagesSupported: 'Languages supported: EN, ES, IT, FR, PT, DE',
      plans: {
        basic: {
          name: 'Basic Plan',
          description: 'Start automating your business essentials.',
          features: ['Automated booking dashboard', 'Confirmations & reminders', '1–2 basic AI agents', 'Basic graphic module', 'Email support'],
        },
        advanced: {
          name: 'Professional Plan',
          description: 'Full automation with advanced AI agents.',
          features: ['Advanced AI agents (voice, WhatsApp, email)', 'Reports & metrics', 'Google Calendar & external integrations', 'Complete marketing module', 'Priority support'],
        },
        custom: {
          name: 'Premium / Enterprise',
          description: 'Complete solution with no limits.',
          features: ['Integrated accounting system', 'HR module', 'Total customization', 'Advanced integrations (POS, ERP)', '24/7 support', 'Personalized training'],
        },
      },
    },
    cta: {
      badge: 'Premium Intelligent Ecosystem',
      title: 'Ready for sales.',
      titleHighlight: 'Designed for growth.',
      description: "It's not an app. It's not a website. It's an intelligent operating system powered by AI Agents that evolves with your business.",
      primaryBtn: 'Request Demo',
      secondaryBtn: 'Learn More',
      points: ['Automatable', 'Scalable', 'Evolutionary'],
      evolutionTitle: 'Continuous Evolution',
      evolutionDescription: 'The platform is conceived as a living system with operational, evolutionary (AI), and creative updates. The system improves with use and time.',
    },
    footer: {
      description: 'Intelligent operating system for businesses, powered by AI Agents. Hospitality, gastronomy, travel, and experiences.',
      categories: {
        platform: { title: 'Platform', links: ['Modules', 'AI Agents', 'Integrations', 'API'] },
        industries: { title: 'Industries', links: ['Restaurants', 'Hotels', 'Travel', 'Experiences'] },
        company: { title: 'Company', links: ['About Us', 'Blog', 'Contact', 'Careers'] },
        legal: { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies', 'GDPR'] },
      },
      copyright: '© 2026 FlowBooking. Design by Just Bee Brand Agency.',
    },
    chat: {
      title: 'AI Assistant',
      status: 'Online',
      inputPlaceholder: 'Write your message...',
      messages: {
        greeting: 'Hi! 👋 I am your AI booking assistant. How can I help you today?',
        question: 'What type of service are you looking for? (restaurant, spa, workshop...)',
        userResponse: 'I want to book a table for 4',
        confirmation: 'Perfect! I have availability for 4 people. What day and time works best for you?',
      },
    },
    salesChat: {
      title: 'AI Sales Assistant',
      status: 'Online',
      inputPlaceholder: 'Type your message...',
      greeting: 'Hi! 👋 I\'m the Flow Booking assistant. How can I help you today?',
      errorMessage: 'Sorry, there was an error. Please try again.',
      connectionError: 'Connection lost',
      retry: 'Retry',
      poweredBy: 'Powered by',
      quickAction1: 'I want to know more',
      quickAction2: 'Request a demo',
      quickAction3: 'See pricing',
    },
  },
  es: {
    nav: {
      modules: 'Módulos',
      industries: 'Industrias',
      memberships: 'Membresías',
      contact: 'Contacto',
      login: 'Iniciar sesión',
      requestDemo: 'Solicitar Demo',
    },
    hero: {
      badge: 'Plataforma Inteligente para Negocios',
      title: 'Tu negocio, impulsado por',
      titleHighlight: 'Agentes AI',
      subtitle: 'Sistema operativo inteligente para hospitality, gastronomía, travel y experiencias. Reservas automatizadas, menús dinámicos y crecimiento escalable.',
      cta: 'Solicitar Demo',
      ctaSecondary: 'Ver en Acción',
      scrollDown: 'Desliza para descubrir',
    },
    modules: {
      sectionTitle: 'Módulos',
      sectionSubtitle: 'Cada módulo se adapta a tu negocio y funciona de forma autónoma con agentes AI especializados.',
      explore: 'Explorar módulo',
      items: {
        spa: { title: 'Spa & Clínicas', description: 'Reservas, tratamientos, profesionales y servicios de bienestar.' },
        restaurant: { title: 'Restaurante', description: 'Menús del día, QR, PDF, WhatsApp y reservas de mesa.' },
        travel: { title: 'Travel & Tours', description: 'Itinerarios, experiencias, tours personalizados y viajes multi-día.' },
        workshop: { title: 'Workshops & Clases', description: 'Cursos, sesiones, horarios recurrentes e inscripciones.' },
        coworking: { title: 'Coworking & Eventos', description: 'Espacios, pases, eventos y comunidad profesional.' },
        experiences: { title: 'Experiencias', description: 'Retiros wellness, gastronomía, naturaleza y momentos únicos.' },
      },
    },
    editorial: {
      panel1: {
        title: 'Menús del día en minutos',
        description: 'Envía una nota de voz o texto. El AI genera PDFs, mensajes de WhatsApp y códigos QR automáticamente.',
        cta: 'Ver cómo funciona',
      },
      panel2: {
        left: { title: 'Reservas inteligentes 24/7', description: 'Gestión automática de reservas para hoteles, hostales y retiros.' },
        right: { title: 'Experiencias que se venden solas', description: 'Wellness, gastronomía y naturaleza con pagos integrados.' },
      },
      panel3: {
        title: 'Itinerarios que inspiran',
        description: 'Experiencias de viaje multi-día con programación automática y confirmaciones instantáneas.',
      },
    },
    agents: {
      sectionLabel: 'Agentes AI Especializados',
      sectionTitle: 'Un equipo inteligente que nunca descansa',
      sectionSubtitle: 'Cada agente se especializa en un área específica de tu negocio, operando 24/7 con automatización total.',
      evolutionNote: 'Los agentes evolucionan con tu negocio: aprenden, se adaptan y optimizan continuamente.',
      items: {
        operational: { name: 'Agente Operativo', description: 'Gestiona reservas, capacidad y disponibilidad en tiempo real.', capabilities: ['Sync calendarios', 'Gestión conflictos', 'Confirmaciones auto'] },
        content: { name: 'Agente de Contenido', description: 'Genera menús, descripciones y material promocional.', capabilities: ['Menús del día', 'PDF/WhatsApp', 'QR dinámicos'] },
        design: { name: 'Agente de Diseño', description: 'Crea contenido visual estético adaptado a tu marca.', capabilities: ['Plantillas', 'Branding', 'Exports visuales'] },
        communication: { name: 'Agente de Comunicación', description: 'Gestiona interacciones con clientes en todos los canales.', capabilities: ['Multi-canal', 'Auto-respuestas', 'Seguimiento'] },
        scheduling: { name: 'Agente de Programación', description: 'Planifica y programa actividades con anticipación.', capabilities: ['Semanal/mensual', 'Recurrente', 'Link stock'] },
        support: { name: 'Agente de Soporte', description: 'Responde preguntas y resuelve problemas 24/7.', capabilities: ['FAQ', 'Escalamiento', 'Satisfacción'] },
      },
    },
    features: {
      sectionLabel: 'Capacidades Core',
      sectionTitle: 'Automatización potente',
      sectionSubtitle: 'Funcionalidades avanzadas que transforman las operaciones diarias en procesos automáticos.',
      items: {
        dailyMenu: { title: 'Menú del Día', description: 'De nota de voz a PDF, WhatsApp y QR en segundos.', output: 'PDF + WhatsApp + QR' },
        smartBooking: { title: 'Reserva Inteligente', description: 'Sync Google/Outlook, sin dobles reservas.', output: 'Calendario real-time' },
        activePayments: { title: 'Pagos Activos', description: 'Integración Stripe/Revolut para venta directa.', output: 'Cobro automatizado' },
        scheduleProgram: { title: 'Programación Anticipada', description: 'Planificación semanal/mensual con automatización.', output: 'Agenda recurrente' },
        stockManagement: { title: 'Stock & Proveedores', description: 'Control de inventario con alertas automáticas.', output: 'Gestión inteligente' },
        multiLanguage: { title: 'Multi-idioma', description: '6 idiomas con detección automática.', output: 'Alcance global' },
      },
    },
    verticals: {
      sectionLabel: 'Industrias',
      sectionTitle: 'Adaptado a tu sector',
      sectionSubtitle: 'Vocabulario y lógica especializados para cada tipo de negocio.',
      items: {
        hospitality: { title: 'Hospitality', description: 'Restaurantes, bares y servicios gastronómicos.', examples: ['Restaurantes', 'Bares', 'Cafés', 'Catering'] },
        accommodation: { title: 'Alojamiento', description: 'Hoteles, hostales, retiros y espacios.', examples: ['Hoteles', 'Hostales', 'Retiros', 'B&B'] },
        wellness: { title: 'Wellness', description: 'Spa, terapias, yoga y cuidado personal.', examples: ['Spa', 'Yoga', 'Terapias', 'Gym'] },
        professional: { title: 'Profesional', description: 'Workshops, coaching y servicios especializados.', examples: ['Workshops', 'Coaching', 'Clases', 'Consultoría'] },
      },
    },
    socialProof: {
      sectionLabel: 'Testimonios',
      sectionTitle: 'Negocios que confían en nosotros',
      stats: {
        attention: '24/7 Atención continua',
        languages: '6 Idiomas soportados',
        scalability: '∞ Escalabilidad',
        agents: 'AI Agentes especializados',
      },
      testimonials: {
        t1: { quote: 'El sistema de agentes AI ha transformado cómo gestionamos nuestro restaurante. Los menús del día se generan en minutos.', author: 'María García', role: 'Chef Ejecutiva, Barcelona' },
        t2: { quote: 'La programación anticipada nos permite planificar semanas enteras. La logística y las compras nunca fueron tan fáciles.', author: 'Alessandro Rossi', role: 'Director de Hotel, Milano' },
        t3: { quote: 'Finalmente una plataforma que entiende hospitality. El soporte multilingüe es excepcional para nuestros huéspedes internacionales.', author: 'James Mitchell', role: 'Gerente de Retiros, Ibiza' },
      },
    },
    pricing: {
      sectionLabel: 'Precios',
      sectionTitle: 'Planes y Precios',
      sectionSubtitle: 'Activa tu sistema inteligente en pocos días y empieza a automatizar tu negocio.',
      popular: 'Recomendado',
      setupLabel: 'Activación',
      monthlyLabel: 'Mensual',
      perMonth: 'mes',
      ctaStart: 'Comenzar ahora',
      ctaDemo: 'Solicitar demo',
      ctaAdvisor: 'Hablar con un asesor',
      bonusTitle: 'Activación Express en 48h incluida',
      bonusDescription: 'Valor 150 € — incluido en todos los planes.',
      installmentTitle: 'Pago fraccionado disponible',
      installmentDescription: '190 € al iniciar + resto al activar (Plan Básico).',
      languagesSupported: 'Idiomas soportados: EN, ES, IT, FR, PT, DE',
      plans: {
        basic: {
          name: 'Plan Básico',
          description: 'Empieza a automatizar lo esencial de tu negocio.',
          features: ['Dashboard de reservas automatizadas', 'Confirmaciones y recordatorios', '1–2 agentes IA básicos', 'Módulo gráfico básico', 'Soporte por email'],
        },
        advanced: {
          name: 'Plan Profesional',
          description: 'Automatización completa con agentes IA avanzados.',
          features: ['Agentes IA avanzados (voz, WhatsApp, email)', 'Reportes y métricas', 'Integración con Google Calendar y sistemas externos', 'Módulo de marketing completo', 'Soporte prioritario'],
        },
        custom: {
          name: 'Premium / Enterprise',
          description: 'Solución completa sin límites.',
          features: ['Sistema contable integrado', 'Módulo de recursos humanos', 'Personalización total', 'Integraciones avanzadas (POS, ERP)', 'Soporte 24/7', 'Entrenamiento personalizado'],
        },
      },
    },
    cta: {
      badge: 'Ecosistema Inteligente Premium',
      title: 'Preparado para venta.',
      titleHighlight: 'Diseñado para crecimiento.',
      description: 'No es una app. No es una web. Es un sistema operativo inteligente impulsado por Agentes AI que evoluciona con tu negocio.',
      primaryBtn: 'Solicitar Demo',
      secondaryBtn: 'Conocer más',
      points: ['Automatizable', 'Escalable', 'Evolutivo'],
      evolutionTitle: 'Evolución Continua',
      evolutionDescription: 'La plataforma se concibe como un sistema vivo con actualizaciones operativas, evolutivas (AI) y creativas. El sistema mejora con el uso y el tiempo.',
    },
    footer: {
      description: 'Sistema operativo inteligente para negocios, impulsado por Agentes AI. Hospitality, gastronomía, travel y experiencias.',
      categories: {
        platform: { title: 'Plataforma', links: ['Módulos', 'Agentes AI', 'Integraciones', 'API'] },
        industries: { title: 'Industrias', links: ['Restaurantes', 'Hoteles', 'Travel', 'Experiencias'] },
        company: { title: 'Empresa', links: ['Nosotros', 'Blog', 'Contacto', 'Carreras'] },
        legal: { title: 'Legal', links: ['Privacidad', 'Términos', 'Cookies', 'GDPR'] },
      },
      copyright: '© 2026 FlowBooking. Design by Just Bee Brand Agency.',
    },
    chat: {
      title: 'Asistente AI',
      status: 'En línea',
      inputPlaceholder: 'Escribe tu mensaje...',
      messages: {
        greeting: '¡Hola! 👋 Soy tu asistente AI de reservas. ¿En qué puedo ayudarte hoy?',
        question: '¿Qué tipo de servicio buscas? (restaurante, spa, workshop...)',
        userResponse: 'Quiero reservar mesa para 4',
        confirmation: '¡Perfecto! Tengo disponibilidad para 4 personas. ¿Qué día y hora te viene mejor?',
      },
    },
    salesChat: {
      title: 'Asistente de Ventas AI',
      status: 'En línea',
      inputPlaceholder: 'Escribe tu mensaje...',
      greeting: '¡Hola! 👋 Soy el asistente de Flow Booking. ¿En qué puedo ayudarte hoy?',
      errorMessage: 'Lo siento, hubo un error. Por favor intenta de nuevo.',
      connectionError: 'Conexión perdida',
      retry: 'Reintentar',
      poweredBy: 'Impulsado por',
      quickAction1: 'Quiero saber más',
      quickAction2: 'Solicitar demo',
      quickAction3: 'Ver precios',
    },
  },
  it: {
    nav: {
      modules: 'Moduli',
      industries: 'Settori',
      memberships: 'Abbonamenti',
      contact: 'Contatti',
      login: 'Accedi',
      requestDemo: 'Richiedi Demo',
    },
    hero: {
      badge: 'Piattaforma Intelligente per Business',
      title: 'Il tuo business, potenziato da',
      titleHighlight: 'Agenti AI',
      subtitle: 'Sistema operativo intelligente per hospitality, gastronomia, travel ed esperienze. Prenotazioni automatizzate, menu dinamici e crescita scalabile.',
      cta: 'Richiedi Demo',
      ctaSecondary: 'Guarda in Azione',
      scrollDown: 'Scorri per scoprire',
    },
    modules: {
      sectionTitle: 'Moduli',
      sectionSubtitle: 'Ogni modulo si adatta al tuo business e funziona in modo autonomo con agenti AI specializzati.',
      explore: 'Esplora modulo',
      items: {
        spa: { title: 'Spa & Cliniche', description: 'Prenotazioni, trattamenti, professionisti e servizi benessere.' },
        restaurant: { title: 'Ristorante', description: 'Menu del giorno, QR, PDF, WhatsApp e prenotazioni tavoli.' },
        travel: { title: 'Travel & Tours', description: 'Itinerari, esperienze, tour personalizzati e viaggi multi-giorno.' },
        workshop: { title: 'Workshop & Corsi', description: 'Corsi, sessioni, orari ricorrenti e iscrizioni.' },
        coworking: { title: 'Coworking & Eventi', description: 'Spazi, pass, eventi e community professionale.' },
        experiences: { title: 'Esperienze', description: 'Ritiri wellness, gastronomia, natura e momenti unici.' },
      },
    },
    editorial: {
      panel1: {
        title: 'Menu del giorno in minuti',
        description: 'Invia una nota vocale o un testo. L\'AI genera PDF, messaggi WhatsApp e codici QR automaticamente.',
        cta: 'Guarda come funziona',
      },
      panel2: {
        left: { title: 'Prenotazioni intelligenti 24/7', description: 'Gestione automatica delle prenotazioni per hotel, ostelli e ritiri.' },
        right: { title: 'Esperienze che si vendono da sole', description: 'Wellness, gastronomia e natura con pagamenti integrati.' },
      },
      panel3: {
        title: 'Itinerari che ispirano',
        description: 'Esperienze di viaggio multi-giorno con programmazione automatica e conferme istantanee.',
      },
    },
    agents: {
      sectionLabel: 'Agenti AI Specializzati',
      sectionTitle: 'Un team intelligente che non riposa mai',
      sectionSubtitle: 'Ogni agente si specializza in un\'area specifica del tuo business, operando 24/7 con automazione totale.',
      evolutionNote: 'Gli agenti evolvono con il tuo business: apprendono, si adattano e ottimizzano continuamente.',
      items: {
        operational: { name: 'Agente Operativo', description: 'Gestisce prenotazioni, capacità e disponibilità in tempo reale.', capabilities: ['Sync calendari', 'Gestione conflitti', 'Conferme auto'] },
        content: { name: 'Agente Contenuti', description: 'Genera menu, descrizioni e materiale promozionale.', capabilities: ['Menu del giorno', 'PDF/WhatsApp', 'QR dinamici'] },
        design: { name: 'Agente Design', description: 'Crea contenuti visivi estetici adattati al tuo brand.', capabilities: ['Template', 'Branding', 'Export visivi'] },
        communication: { name: 'Agente Comunicazione', description: 'Gestisce le interazioni con i clienti su tutti i canali.', capabilities: ['Multi-canale', 'Auto-risposte', 'Follow-up'] },
        scheduling: { name: 'Agente Programmazione', description: 'Pianifica e programma attività in anticipo.', capabilities: ['Settimanale/mensile', 'Ricorrente', 'Link stock'] },
        support: { name: 'Agente Supporto', description: 'Risponde alle domande e risolve problemi 24/7.', capabilities: ['FAQ', 'Escalation', 'Soddisfazione'] },
      },
    },
    features: {
      sectionLabel: 'Funzionalità Core',
      sectionTitle: 'Automazione potente',
      sectionSubtitle: 'Funzionalità avanzate che trasformano le operazioni quotidiane in processi automatici.',
      items: {
        dailyMenu: { title: 'Menu del Giorno', description: 'Da nota vocale a PDF, WhatsApp e QR in secondi.', output: 'PDF + WhatsApp + QR' },
        smartBooking: { title: 'Prenotazione Smart', description: 'Sync Google/Outlook, niente doppie prenotazioni.', output: 'Calendario real-time' },
        activePayments: { title: 'Pagamenti Attivi', description: 'Integrazione Stripe/Revolut per vendita diretta.', output: 'Incasso automatizzato' },
        scheduleProgram: { title: 'Programmazione Anticipata', description: 'Pianificazione settimanale/mensile con automazione.', output: 'Agenda ricorrente' },
        stockManagement: { title: 'Stock & Fornitori', description: 'Controllo inventario con alert automatici.', output: 'Gestione intelligente' },
        multiLanguage: { title: 'Multi-lingua', description: '6 lingue con rilevamento automatico.', output: 'Portata globale' },
      },
    },
    verticals: {
      sectionLabel: 'Settori',
      sectionTitle: 'Adattato al tuo settore',
      sectionSubtitle: 'Vocabolario e logica specializzati per ogni tipo di business.',
      items: {
        hospitality: { title: 'Hospitality', description: 'Ristoranti, bar e servizi gastronomici.', examples: ['Ristoranti', 'Bar', 'Caffè', 'Catering'] },
        accommodation: { title: 'Alloggio', description: 'Hotel, ostelli, ritiri e spazi.', examples: ['Hotel', 'Ostelli', 'Ritiri', 'B&B'] },
        wellness: { title: 'Wellness', description: 'Spa, terapie, yoga e cura personale.', examples: ['Spa', 'Yoga', 'Terapie', 'Palestra'] },
        professional: { title: 'Professionale', description: 'Workshop, coaching e servizi specializzati.', examples: ['Workshop', 'Coaching', 'Corsi', 'Consulenza'] },
      },
    },
    socialProof: {
      sectionLabel: 'Testimonianze',
      sectionTitle: 'Business che si fidano di noi',
      stats: {
        attention: '24/7 Supporto continuo',
        languages: '6 Lingue supportate',
        scalability: '∞ Scalabilità',
        agents: 'AI Agenti specializzati',
      },
      testimonials: {
        t1: { quote: 'Il sistema di agenti AI ha trasformato come gestiamo il nostro ristorante. I menu del giorno si generano in minuti.', author: 'María García', role: 'Chef Esecutivo, Barcelona' },
        t2: { quote: 'La programmazione anticipata ci permette di pianificare settimane intere. Logistica e acquisti non sono mai stati così facili.', author: 'Alessandro Rossi', role: 'Direttore Hotel, Milano' },
        t3: { quote: 'Finalmente una piattaforma che capisce l\'hospitality. Il supporto multilingue è eccezionale per i nostri ospiti internazionali.', author: 'James Mitchell', role: 'Manager Ritiri, Ibiza' },
      },
    },
    pricing: {
      sectionLabel: 'Prezzi',
      sectionTitle: 'Piani e Prezzi',
      sectionSubtitle: 'Attiva il tuo sistema intelligente in pochi giorni e inizia ad automatizzare il tuo business.',
      popular: 'Consigliato',
      setupLabel: 'Attivazione',
      monthlyLabel: 'Mensile',
      perMonth: 'mese',
      ctaStart: 'Inizia ora',
      ctaDemo: 'Richiedi demo',
      ctaAdvisor: 'Parla con un consulente',
      bonusTitle: 'Attivazione Express in 48h inclusa',
      bonusDescription: 'Valore 150 € — incluso in tutti i piani.',
      installmentTitle: 'Pagamento rateale disponibile',
      installmentDescription: '190 € per iniziare + resto all\'attivazione (Piano Base).',
      languagesSupported: 'Lingue supportate: EN, ES, IT, FR, PT, DE',
      plans: {
        basic: {
          name: 'Piano Base',
          description: 'Inizia ad automatizzare gli essenziali del tuo business.',
          features: ['Dashboard prenotazioni automatizzate', 'Conferme e promemoria', '1–2 agenti IA base', 'Modulo grafico base', 'Supporto email'],
        },
        advanced: {
          name: 'Piano Professionale',
          description: 'Automazione completa con agenti IA avanzati.',
          features: ['Agenti IA avanzati (voce, WhatsApp, email)', 'Report e metriche', 'Integrazione Google Calendar e sistemi esterni', 'Modulo marketing completo', 'Supporto prioritario'],
        },
        custom: {
          name: 'Premium / Enterprise',
          description: 'Soluzione completa senza limiti.',
          features: ['Sistema contabile integrato', 'Modulo risorse umane', 'Personalizzazione totale', 'Integrazioni avanzate (POS, ERP)', 'Supporto 24/7', 'Formazione personalizzata'],
        },
      },
    },
    cta: {
      badge: 'Ecosistema Intelligente Premium',
      title: 'Pronto per vendere.',
      titleHighlight: 'Progettato per crescere.',
      description: 'Non è un\'app. Non è un sito. È un sistema operativo intelligente potenziato da Agenti AI che evolve con il tuo business.',
      primaryBtn: 'Richiedi Demo',
      secondaryBtn: 'Scopri di più',
      points: ['Automatizzabile', 'Scalabile', 'Evolutivo'],
      evolutionTitle: 'Evoluzione Continua',
      evolutionDescription: 'La piattaforma è concepita come un sistema vivo con aggiornamenti operativi, evolutivi (AI) e creativi. Il sistema migliora con l\'uso e il tempo.',
    },
    footer: {
      description: 'Sistema operativo intelligente per business, potenziato da Agenti AI. Hospitality, gastronomia, travel ed esperienze.',
      categories: {
        platform: { title: 'Piattaforma', links: ['Moduli', 'Agenti AI', 'Integrazioni', 'API'] },
        industries: { title: 'Settori', links: ['Ristoranti', 'Hotel', 'Travel', 'Esperienze'] },
        company: { title: 'Azienda', links: ['Chi siamo', 'Blog', 'Contatti', 'Carriere'] },
        legal: { title: 'Legale', links: ['Privacy', 'Termini', 'Cookie', 'GDPR'] },
      },
      copyright: '© 2026 FlowBooking. Design by Just Bee Brand Agency.',
    },
    chat: {
      title: 'Assistente AI',
      status: 'Online',
      inputPlaceholder: 'Scrivi il tuo messaggio...',
      messages: {
        greeting: 'Ciao! 👋 Sono il tuo assistente AI per prenotazioni. Come posso aiutarti oggi?',
        question: 'Che tipo di servizio cerchi? (ristorante, spa, workshop...)',
        userResponse: 'Vorrei prenotare un tavolo per 4',
        confirmation: 'Perfetto! Ho disponibilità per 4 persone. Quale giorno e orario preferisci?',
      },
    },
    salesChat: {
      title: 'Assistente Vendite AI',
      status: 'Online',
      inputPlaceholder: 'Scrivi il tuo messaggio...',
      greeting: 'Ciao! 👋 Sono l\'assistente di FlowBooking. Come posso aiutarti oggi?',
      errorMessage: 'Spiacente, si è verificato un errore. Riprova.',
      connectionError: 'Connessione persa',
      retry: 'Riprova',
      poweredBy: 'Powered by',
      quickAction1: 'Voglio saperne di più',
      quickAction2: 'Richiedi demo',
      quickAction3: 'Vedi prezzi',
    },
  },
  fr: {
    nav: {
      modules: 'Modules',
      industries: 'Industries',
      memberships: 'Abonnements',
      contact: 'Contact',
      login: 'Connexion',
      requestDemo: 'Demander Démo',
    },
    hero: {
      badge: 'Plateforme Intelligente pour Business',
      title: 'Votre business, propulsé par',
      titleHighlight: 'Agents IA',
      subtitle: 'Système d\'exploitation intelligent pour l\'hôtellerie, la gastronomie, le voyage et les expériences. Réservations automatisées, menus dynamiques et croissance évolutive.',
      cta: 'Demander Démo',
      ctaSecondary: 'Voir en Action',
      scrollDown: 'Faites défiler pour découvrir',
    },
    modules: {
      sectionTitle: 'Modules',
      sectionSubtitle: 'Chaque module s\'adapte à votre business et fonctionne de manière autonome avec des agents IA spécialisés.',
      explore: 'Explorer module',
      items: {
        spa: { title: 'Spa & Cliniques', description: 'Réservations, traitements, professionnels et services bien-être.' },
        restaurant: { title: 'Restaurant', description: 'Menus du jour, QR, PDF, WhatsApp et réservations de tables.' },
        travel: { title: 'Voyage & Tours', description: 'Itinéraires, expériences, tours personnalisés et voyages multi-jours.' },
        workshop: { title: 'Ateliers & Cours', description: 'Cours, sessions, horaires récurrents et inscriptions.' },
        coworking: { title: 'Coworking & Événements', description: 'Espaces, pass, événements et communauté professionnelle.' },
        experiences: { title: 'Expériences', description: 'Retraites bien-être, gastronomie, nature et moments uniques.' },
      },
    },
    editorial: {
      panel1: {
        title: 'Menus du jour en minutes',
        description: 'Envoyez une note vocale ou un texte. L\'IA génère des PDF, messages WhatsApp et codes QR automatiquement.',
        cta: 'Voir comment ça marche',
      },
      panel2: {
        left: { title: 'Réservations intelligentes 24/7', description: 'Gestion automatique des réservations pour hôtels, auberges et retraites.' },
        right: { title: 'Expériences qui se vendent seules', description: 'Bien-être, gastronomie et nature avec paiements intégrés.' },
      },
      panel3: {
        title: 'Itinéraires qui inspirent',
        description: 'Expériences de voyage multi-jours avec programmation automatique et confirmations instantanées.',
      },
    },
    agents: {
      sectionLabel: 'Agents IA Spécialisés',
      sectionTitle: 'Une équipe intelligente qui ne se repose jamais',
      sectionSubtitle: 'Chaque agent se spécialise dans un domaine spécifique de votre business, opérant 24/7 avec une automatisation totale.',
      evolutionNote: 'Les agents évoluent avec votre business : ils apprennent, s\'adaptent et optimisent continuellement.',
      items: {
        operational: { name: 'Agent Opérationnel', description: 'Gère les réservations, capacité et disponibilité en temps réel.', capabilities: ['Sync calendriers', 'Gestion conflits', 'Confirmations auto'] },
        content: { name: 'Agent Contenu', description: 'Génère des menus, descriptions et matériel promotionnel.', capabilities: ['Menus du jour', 'PDF/WhatsApp', 'QR dynamiques'] },
        design: { name: 'Agent Design', description: 'Crée du contenu visuel esthétique adapté à votre marque.', capabilities: ['Templates', 'Branding', 'Exports visuels'] },
        communication: { name: 'Agent Communication', description: 'Gère les interactions clients sur tous les canaux.', capabilities: ['Multi-canal', 'Auto-réponses', 'Suivi'] },
        scheduling: { name: 'Agent Programmation', description: 'Planifie et programme les activités à l\'avance.', capabilities: ['Hebdo/mensuel', 'Récurrent', 'Lien stock'] },
        support: { name: 'Agent Support', description: 'Répond aux questions et résout les problèmes 24/7.', capabilities: ['FAQ', 'Escalade', 'Satisfaction'] },
      },
    },
    features: {
      sectionLabel: 'Fonctionnalités Core',
      sectionTitle: 'Automatisation puissante',
      sectionSubtitle: 'Fonctionnalités avancées qui transforment les opérations quotidiennes en processus automatiques.',
      items: {
        dailyMenu: { title: 'Menu du Jour', description: 'De note vocale à PDF, WhatsApp et QR en secondes.', output: 'PDF + WhatsApp + QR' },
        smartBooking: { title: 'Réservation Intelligente', description: 'Sync Google/Outlook, pas de double réservation.', output: 'Calendrier temps réel' },
        activePayments: { title: 'Paiements Actifs', description: 'Intégration Stripe/Revolut pour vente directe.', output: 'Encaissement automatisé' },
        scheduleProgram: { title: 'Programmation Anticipée', description: 'Planification hebdo/mensuelle avec automatisation.', output: 'Agenda récurrent' },
        stockManagement: { title: 'Stock & Fournisseurs', description: 'Contrôle inventaire avec alertes automatiques.', output: 'Gestion intelligente' },
        multiLanguage: { title: 'Multi-langue', description: '6 langues avec détection automatique.', output: 'Portée mondiale' },
      },
    },
    verticals: {
      sectionLabel: 'Industries',
      sectionTitle: 'Adapté à votre secteur',
      sectionSubtitle: 'Vocabulaire et logique spécialisés pour chaque type de business.',
      items: {
        hospitality: { title: 'Hôtellerie', description: 'Restaurants, bars et services gastronomiques.', examples: ['Restaurants', 'Bars', 'Cafés', 'Traiteur'] },
        accommodation: { title: 'Hébergement', description: 'Hôtels, auberges, retraites et espaces.', examples: ['Hôtels', 'Auberges', 'Retraites', 'B&B'] },
        wellness: { title: 'Bien-être', description: 'Spa, thérapies, yoga et soins personnels.', examples: ['Spa', 'Yoga', 'Thérapies', 'Gym'] },
        professional: { title: 'Professionnel', description: 'Ateliers, coaching et services spécialisés.', examples: ['Ateliers', 'Coaching', 'Cours', 'Conseil'] },
      },
    },
    socialProof: {
      sectionLabel: 'Témoignages',
      sectionTitle: 'Des entreprises qui nous font confiance',
      stats: {
        attention: '24/7 Support continu',
        languages: '6 Langues supportées',
        scalability: '∞ Évolutivité',
        agents: 'IA Agents spécialisés',
      },
      testimonials: {
        t1: { quote: 'Le système d\'agents IA a transformé la façon dont nous gérons notre restaurant. Les menus du jour sont générés en minutes.', author: 'María García', role: 'Chef Exécutif, Barcelona' },
        t2: { quote: 'La programmation anticipée nous permet de planifier des semaines entières. La logistique et les achats n\'ont jamais été aussi faciles.', author: 'Alessandro Rossi', role: 'Directeur d\'Hôtel, Milano' },
        t3: { quote: 'Enfin une plateforme qui comprend l\'hôtellerie. Le support multilingue est exceptionnel pour nos clients internationaux.', author: 'James Mitchell', role: 'Gérant de Retraites, Ibiza' },
      },
    },
    pricing: {
      sectionLabel: 'Tarifs',
      sectionTitle: 'Plans et Tarifs',
      sectionSubtitle: 'Activez votre système intelligent en quelques jours et commencez à automatiser votre entreprise.',
      popular: 'Recommandé',
      setupLabel: 'Mise en place',
      monthlyLabel: 'Mensuel',
      perMonth: 'mois',
      ctaStart: 'Commencer maintenant',
      ctaDemo: 'Demander une démo',
      ctaAdvisor: 'Parler à un conseiller',
      bonusTitle: 'Activation Express en 48h incluse',
      bonusDescription: 'Valeur 150 € — inclus dans tous les plans.',
      installmentTitle: 'Paiement fractionné disponible',
      installmentDescription: '190 € au départ + reste à l\'activation (Plan Basique).',
      languagesSupported: 'Langues supportées : EN, ES, IT, FR, PT, DE',
      plans: {
        basic: {
          name: 'Plan Basique',
          description: 'Commencez à automatiser les essentiels de votre entreprise.',
          features: ['Dashboard de réservations automatisées', 'Confirmations et rappels', '1–2 agents IA basiques', 'Module graphique basique', 'Support par email'],
        },
        advanced: {
          name: 'Plan Professionnel',
          description: 'Automatisation complète avec agents IA avancés.',
          features: ['Agents IA avancés (voix, WhatsApp, email)', 'Rapports et métriques', 'Intégration Google Calendar et systèmes externes', 'Module marketing complet', 'Support prioritaire'],
        },
        custom: {
          name: 'Premium / Enterprise',
          description: 'Solution complète sans limites.',
          features: ['Système comptable intégré', 'Module RH', 'Personnalisation totale', 'Intégrations avancées (POS, ERP)', 'Support 24/7', 'Formation personnalisée'],
        },
      },
    },
    cta: {
      badge: 'Écosystème Intelligent Premium',
      title: 'Prêt à vendre.',
      titleHighlight: 'Conçu pour croître.',
      description: 'Ce n\'est pas une app. Ce n\'est pas un site. C\'est un système d\'exploitation intelligent propulsé par des Agents IA qui évolue avec votre business.',
      primaryBtn: 'Demander Démo',
      secondaryBtn: 'En savoir plus',
      points: ['Automatisable', 'Évolutif', 'Évolutionnaire'],
      evolutionTitle: 'Évolution Continue',
      evolutionDescription: 'La plateforme est conçue comme un système vivant avec des mises à jour opérationnelles, évolutives (IA) et créatives. Le système s\'améliore avec l\'utilisation et le temps.',
    },
    footer: {
      description: 'Système d\'exploitation intelligent pour business, propulsé par Agents IA. Hôtellerie, gastronomie, voyage et expériences.',
      categories: {
        platform: { title: 'Plateforme', links: ['Modules', 'Agents IA', 'Intégrations', 'API'] },
        industries: { title: 'Industries', links: ['Restaurants', 'Hôtels', 'Voyage', 'Expériences'] },
        company: { title: 'Entreprise', links: ['À propos', 'Blog', 'Contact', 'Carrières'] },
        legal: { title: 'Légal', links: ['Confidentialité', 'Conditions', 'Cookies', 'RGPD'] },
      },
      copyright: '© 2026 FlowBooking. Design by Just Bee Brand Agency.',
    },
    chat: {
      title: 'Assistant IA',
      status: 'En ligne',
      inputPlaceholder: 'Écrivez votre message...',
      messages: {
        greeting: 'Bonjour ! 👋 Je suis votre assistant IA de réservation. Comment puis-je vous aider aujourd\'hui ?',
        question: 'Quel type de service recherchez-vous ? (restaurant, spa, atelier...)',
        userResponse: 'Je voudrais réserver une table pour 4',
        confirmation: 'Parfait ! J\'ai des disponibilités pour 4 personnes. Quel jour et quelle heure vous conviennent ?',
      },
    },
    salesChat: {
      title: 'Assistant Ventes IA',
      status: 'En ligne',
      inputPlaceholder: 'Écrivez votre message...',
      greeting: 'Bonjour ! 👋 Je suis l\'assistant de FlowBooking. Comment puis-je vous aider aujourd\'hui ?',
      errorMessage: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
      connectionError: 'Connexion perdue',
      retry: 'Réessayer',
      poweredBy: 'Propulsé par',
      quickAction1: 'Je veux en savoir plus',
      quickAction2: 'Demander une démo',
      quickAction3: 'Voir les tarifs',
    },
  },
  pt: {
    nav: {
      modules: 'Módulos',
      industries: 'Setores',
      memberships: 'Assinaturas',
      contact: 'Contato',
      login: 'Entrar',
      requestDemo: 'Solicitar Demo',
    },
    hero: {
      badge: 'Plataforma Inteligente para Negócios',
      title: 'Seu negócio, impulsionado por',
      titleHighlight: 'Agentes IA',
      subtitle: 'Sistema operacional inteligente para hospitalidade, gastronomia, viagens e experiências. Reservas automatizadas, menus dinâmicos e crescimento escalável.',
      cta: 'Solicitar Demo',
      ctaSecondary: 'Ver em Ação',
      scrollDown: 'Role para descobrir',
    },
    modules: {
      sectionTitle: 'Módulos',
      sectionSubtitle: 'Cada módulo se adapta ao seu negócio e funciona de forma autônoma com agentes IA especializados.',
      explore: 'Explorar módulo',
      items: {
        spa: { title: 'Spa & Clínicas', description: 'Reservas, tratamentos, profissionais e serviços de bem-estar.' },
        restaurant: { title: 'Restaurante', description: 'Menus do dia, QR, PDF, WhatsApp e reservas de mesas.' },
        travel: { title: 'Viagem & Tours', description: 'Itinerários, experiências, tours personalizados e viagens multi-dia.' },
        workshop: { title: 'Workshops & Aulas', description: 'Cursos, sessões, horários recorrentes e inscrições.' },
        coworking: { title: 'Coworking & Eventos', description: 'Espaços, passes, eventos e comunidade profissional.' },
        experiences: { title: 'Experiências', description: 'Retiros wellness, gastronomia, natureza e momentos únicos.' },
      },
    },
    editorial: {
      panel1: {
        title: 'Menus do dia em minutos',
        description: 'Envie uma nota de voz ou texto. A IA gera PDFs, mensagens de WhatsApp e códigos QR automaticamente.',
        cta: 'Veja como funciona',
      },
      panel2: {
        left: { title: 'Reservas inteligentes 24/7', description: 'Gestão automática de reservas para hotéis, hostels e retiros.' },
        right: { title: 'Experiências que se vendem sozinhas', description: 'Wellness, gastronomia e natureza com pagamentos integrados.' },
      },
      panel3: {
        title: 'Itinerários que inspiram',
        description: 'Experiências de viagem multi-dia com programação automática e confirmações instantâneas.',
      },
    },
    agents: {
      sectionLabel: 'Agentes IA Especializados',
      sectionTitle: 'Uma equipe inteligente que nunca descansa',
      sectionSubtitle: 'Cada agente se especializa em uma área específica do seu negócio, operando 24/7 com automação total.',
      evolutionNote: 'Os agentes evoluem com seu negócio: aprendem, se adaptam e otimizam continuamente.',
      items: {
        operational: { name: 'Agente Operacional', description: 'Gerencia reservas, capacidade e disponibilidade em tempo real.', capabilities: ['Sync calendários', 'Gestão conflitos', 'Confirmações auto'] },
        content: { name: 'Agente de Conteúdo', description: 'Gera menus, descrições e material promocional.', capabilities: ['Menus do dia', 'PDF/WhatsApp', 'QR dinâmicos'] },
        design: { name: 'Agente de Design', description: 'Cria conteúdo visual estético adaptado à sua marca.', capabilities: ['Templates', 'Branding', 'Exports visuais'] },
        communication: { name: 'Agente de Comunicação', description: 'Gerencia interações com clientes em todos os canais.', capabilities: ['Multi-canal', 'Auto-respostas', 'Follow-up'] },
        scheduling: { name: 'Agente de Programação', description: 'Planeja e programa atividades com antecedência.', capabilities: ['Semanal/mensal', 'Recorrente', 'Link estoque'] },
        support: { name: 'Agente de Suporte', description: 'Responde perguntas e resolve problemas 24/7.', capabilities: ['FAQ', 'Escalamento', 'Satisfação'] },
      },
    },
    features: {
      sectionLabel: 'Funcionalidades Core',
      sectionTitle: 'Automação poderosa',
      sectionSubtitle: 'Funcionalidades avançadas que transformam operações diárias em processos automáticos.',
      items: {
        dailyMenu: { title: 'Menu do Dia', description: 'De nota de voz a PDF, WhatsApp e QR em segundos.', output: 'PDF + WhatsApp + QR' },
        smartBooking: { title: 'Reserva Inteligente', description: 'Sync Google/Outlook, sem reservas duplicadas.', output: 'Calendário real-time' },
        activePayments: { title: 'Pagamentos Ativos', description: 'Integração Stripe/Revolut para venda direta.', output: 'Cobrança automatizada' },
        scheduleProgram: { title: 'Programação Antecipada', description: 'Planejamento semanal/mensal com automação.', output: 'Agenda recorrente' },
        stockManagement: { title: 'Estoque & Fornecedores', description: 'Controle de inventário com alertas automáticos.', output: 'Gestão inteligente' },
        multiLanguage: { title: 'Multi-idioma', description: '6 idiomas com detecção automática.', output: 'Alcance global' },
      },
    },
    verticals: {
      sectionLabel: 'Setores',
      sectionTitle: 'Adaptado ao seu setor',
      sectionSubtitle: 'Vocabulário e lógica especializados para cada tipo de negócio.',
      items: {
        hospitality: { title: 'Hospitalidade', description: 'Restaurantes, bares e serviços gastronômicos.', examples: ['Restaurantes', 'Bares', 'Cafés', 'Catering'] },
        accommodation: { title: 'Hospedagem', description: 'Hotéis, hostels, retiros e espaços.', examples: ['Hotéis', 'Hostels', 'Retiros', 'B&B'] },
        wellness: { title: 'Bem-estar', description: 'Spa, terapias, yoga e cuidado pessoal.', examples: ['Spa', 'Yoga', 'Terapias', 'Academia'] },
        professional: { title: 'Profissional', description: 'Workshops, coaching e serviços especializados.', examples: ['Workshops', 'Coaching', 'Aulas', 'Consultoria'] },
      },
    },
    socialProof: {
      sectionLabel: 'Depoimentos',
      sectionTitle: 'Negócios que confiam em nós',
      stats: {
        attention: '24/7 Suporte contínuo',
        languages: '6 Idiomas suportados',
        scalability: '∞ Escalabilidade',
        agents: 'IA Agentes especializados',
      },
      testimonials: {
        t1: { quote: 'O sistema de agentes IA transformou como gerenciamos nosso restaurante. Os menus do dia são gerados em minutos.', author: 'María García', role: 'Chef Executiva, Barcelona' },
        t2: { quote: 'A programação antecipada nos permite planejar semanas inteiras. Logística e compras nunca foram tão fáceis.', author: 'Alessandro Rossi', role: 'Diretor de Hotel, Milano' },
        t3: { quote: 'Finalmente uma plataforma que entende hospitalidade. O suporte multilíngue é excepcional para nossos hóspedes internacionais.', author: 'James Mitchell', role: 'Gerente de Retiros, Ibiza' },
      },
    },
    pricing: {
      sectionLabel: 'Preços',
      sectionTitle: 'Planos e Preços',
      sectionSubtitle: 'Ative seu sistema inteligente em poucos dias e comece a automatizar seu negócio.',
      popular: 'Recomendado',
      setupLabel: 'Ativação',
      monthlyLabel: 'Mensal',
      perMonth: 'mês',
      ctaStart: 'Começar agora',
      ctaDemo: 'Solicitar demo',
      ctaAdvisor: 'Falar com um consultor',
      bonusTitle: 'Ativação Express em 48h incluída',
      bonusDescription: 'Valor 150 € — incluído em todos os planos.',
      installmentTitle: 'Pagamento parcelado disponível',
      installmentDescription: '190 € para começar + restante na ativação (Plano Básico).',
      languagesSupported: 'Idiomas suportados: EN, ES, IT, FR, PT, DE',
      plans: {
        basic: {
          name: 'Plano Básico',
          description: 'Comece a automatizar o essencial do seu negócio.',
          features: ['Dashboard de reservas automatizadas', 'Confirmações e lembretes', '1–2 agentes IA básicos', 'Módulo gráfico básico', 'Suporte por email'],
        },
        advanced: {
          name: 'Plano Profissional',
          description: 'Automação completa com agentes IA avançados.',
          features: ['Agentes IA avançados (voz, WhatsApp, email)', 'Relatórios e métricas', 'Integração Google Calendar e sistemas externos', 'Módulo de marketing completo', 'Suporte prioritário'],
        },
        custom: {
          name: 'Premium / Enterprise',
          description: 'Solução completa sem limites.',
          features: ['Sistema contábil integrado', 'Módulo de RH', 'Personalização total', 'Integrações avançadas (POS, ERP)', 'Suporte 24/7', 'Treinamento personalizado'],
        },
      },
    },
    cta: {
      badge: 'Ecossistema Inteligente Premium',
      title: 'Pronto para vender.',
      titleHighlight: 'Projetado para crescer.',
      description: 'Não é um app. Não é um site. É um sistema operacional inteligente impulsionado por Agentes IA que evolui com seu negócio.',
      primaryBtn: 'Solicitar Demo',
      secondaryBtn: 'Saiba mais',
      points: ['Automatizável', 'Escalável', 'Evolutivo'],
      evolutionTitle: 'Evolução Contínua',
      evolutionDescription: 'A plataforma é concebida como um sistema vivo com atualizações operacionais, evolutivas (IA) e criativas. O sistema melhora com uso e tempo.',
    },
    footer: {
      description: 'Sistema operacional inteligente para negócios, impulsionado por Agentes IA. Hospitalidade, gastronomia, viagens e experiências.',
      categories: {
        platform: { title: 'Plataforma', links: ['Módulos', 'Agentes IA', 'Integrações', 'API'] },
        industries: { title: 'Setores', links: ['Restaurantes', 'Hotéis', 'Viagem', 'Experiências'] },
        company: { title: 'Empresa', links: ['Sobre nós', 'Blog', 'Contato', 'Carreiras'] },
        legal: { title: 'Legal', links: ['Privacidade', 'Termos', 'Cookies', 'LGPD'] },
      },
      copyright: '© 2026 FlowBooking. Design by Just Bee Brand Agency.',
    },
    chat: {
      title: 'Assistente IA',
      status: 'Online',
      inputPlaceholder: 'Escreva sua mensagem...',
      messages: {
        greeting: 'Olá! 👋 Sou seu assistente IA de reservas. Como posso ajudar você hoje?',
        question: 'Que tipo de serviço você procura? (restaurante, spa, workshop...)',
        userResponse: 'Quero reservar uma mesa para 4',
        confirmation: 'Perfeito! Tenho disponibilidade para 4 pessoas. Qual dia e horário prefere?',
      },
    },
    salesChat: {
      title: 'Assistente de Vendas IA',
      status: 'Online',
      inputPlaceholder: 'Escreva sua mensagem...',
      greeting: 'Olá! 👋 Sou o assistente da FlowBooking. Como posso ajudar você hoje?',
      errorMessage: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
      connectionError: 'Conexão perdida',
      retry: 'Tentar novamente',
      poweredBy: 'Powered by',
      quickAction1: 'Quero saber mais',
      quickAction2: 'Solicitar demo',
      quickAction3: 'Ver preços',
    },
  },
  de: {
    nav: {
      modules: 'Module',
      industries: 'Branchen',
      memberships: 'Mitgliedschaften',
      contact: 'Kontakt',
      login: 'Anmelden',
      requestDemo: 'Demo anfordern',
    },
    hero: {
      badge: 'Intelligente Plattform für Unternehmen',
      title: 'Ihr Geschäft, angetrieben von',
      titleHighlight: 'KI-Agenten',
      subtitle: 'Intelligentes Betriebssystem für Gastgewerbe, Gastronomie, Reisen und Erlebnisse. Automatisierte Reservierungen, dynamische Menüs und skalierbares Wachstum.',
      cta: 'Demo anfordern',
      ctaSecondary: 'In Aktion sehen',
      scrollDown: 'Scrollen zum Entdecken',
    },
    modules: {
      sectionTitle: 'Module',
      sectionSubtitle: 'Jedes Modul passt sich Ihrem Geschäft an und arbeitet autonom mit spezialisierten KI-Agenten.',
      explore: 'Modul erkunden',
      items: {
        spa: { title: 'Spa & Kliniken', description: 'Reservierungen, Behandlungen, Fachleute und Wellness-Dienste.' },
        restaurant: { title: 'Restaurant', description: 'Tagesmenüs, QR, PDF, WhatsApp und Tischreservierungen.' },
        travel: { title: 'Reisen & Touren', description: 'Reiserouten, Erlebnisse, personalisierte Touren und mehrtägige Reisen.' },
        workshop: { title: 'Workshops & Kurse', description: 'Kurse, Sitzungen, wiederkehrende Zeiten und Anmeldungen.' },
        coworking: { title: 'Coworking & Events', description: 'Räume, Pässe, Events und professionelle Community.' },
        experiences: { title: 'Erlebnisse', description: 'Wellness-Retreats, Gastronomie, Natur und einzigartige Momente.' },
      },
    },
    editorial: {
      panel1: {
        title: 'Tagesmenüs in Minuten',
        description: 'Senden Sie eine Sprachnachricht oder Text. Die KI generiert automatisch PDFs, WhatsApp-Nachrichten und QR-Codes.',
        cta: 'Sehen Sie wie es funktioniert',
      },
      panel2: {
        left: { title: 'Intelligente Reservierungen 24/7', description: 'Automatische Reservierungsverwaltung für Hotels, Hostels und Retreats.' },
        right: { title: 'Erlebnisse, die sich von selbst verkaufen', description: 'Wellness, Gastronomie und Natur mit integrierten Zahlungen.' },
      },
      panel3: {
        title: 'Reiserouten, die inspirieren',
        description: 'Mehrtägige Reiseerlebnisse mit automatischer Planung und sofortigen Bestätigungen.',
      },
    },
    agents: {
      sectionLabel: 'Spezialisierte KI-Agenten',
      sectionTitle: 'Ein intelligentes Team, das niemals ruht',
      sectionSubtitle: 'Jeder Agent spezialisiert sich auf einen bestimmten Bereich Ihres Geschäfts und arbeitet 24/7 mit vollständiger Automatisierung.',
      evolutionNote: 'Agenten entwickeln sich mit Ihrem Geschäft: Sie lernen, passen sich an und optimieren kontinuierlich.',
      items: {
        operational: { name: 'Operativer Agent', description: 'Verwaltet Reservierungen, Kapazität und Verfügbarkeit in Echtzeit.', capabilities: ['Kalender-Sync', 'Konfliktmanagement', 'Auto-Bestätigungen'] },
        content: { name: 'Content Agent', description: 'Generiert Menüs, Beschreibungen und Werbematerial.', capabilities: ['Tagesmenüs', 'PDF/WhatsApp', 'Dynamische QR'] },
        design: { name: 'Design Agent', description: 'Erstellt ästhetische visuelle Inhalte, angepasst an Ihre Marke.', capabilities: ['Vorlagen', 'Branding', 'Visuelle Exports'] },
        communication: { name: 'Kommunikations-Agent', description: 'Verwaltet Kundeninteraktionen über alle Kanäle.', capabilities: ['Multi-Kanal', 'Auto-Antworten', 'Nachverfolgung'] },
        scheduling: { name: 'Planungs-Agent', description: 'Plant und programmiert Aktivitäten im Voraus.', capabilities: ['Wöchentlich/monatlich', 'Wiederkehrend', 'Lager-Link'] },
        support: { name: 'Support-Agent', description: 'Beantwortet Fragen und löst Probleme 24/7.', capabilities: ['FAQ', 'Eskalation', 'Zufriedenheit'] },
      },
    },
    features: {
      sectionLabel: 'Kernfunktionen',
      sectionTitle: 'Leistungsstarke Automatisierung',
      sectionSubtitle: 'Erweiterte Funktionen, die tägliche Abläufe in automatische Prozesse verwandeln.',
      items: {
        dailyMenu: { title: 'Tagesmenü', description: 'Von Sprachnachricht zu PDF, WhatsApp und QR in Sekunden.', output: 'PDF + WhatsApp + QR' },
        smartBooking: { title: 'Intelligente Buchung', description: 'Google/Outlook Sync, keine Doppelbuchungen.', output: 'Echtzeit-Kalender' },
        activePayments: { title: 'Aktive Zahlungen', description: 'Stripe/Revolut Integration für Direktverkauf.', output: 'Automatisierter Einzug' },
        scheduleProgram: { title: 'Vorausplanung', description: 'Wöchentliche/monatliche Planung mit Automatisierung.', output: 'Wiederkehrende Agenda' },
        stockManagement: { title: 'Lager & Lieferanten', description: 'Bestandskontrolle mit automatischen Warnungen.', output: 'Intelligente Verwaltung' },
        multiLanguage: { title: 'Mehrsprachig', description: '6 Sprachen mit automatischer Erkennung.', output: 'Globale Reichweite' },
      },
    },
    verticals: {
      sectionLabel: 'Branchen',
      sectionTitle: 'Angepasst an Ihren Sektor',
      sectionSubtitle: 'Spezialisiertes Vokabular und Logik für jeden Geschäftstyp.',
      items: {
        hospitality: { title: 'Gastgewerbe', description: 'Restaurants, Bars und gastronomische Dienstleistungen.', examples: ['Restaurants', 'Bars', 'Cafés', 'Catering'] },
        accommodation: { title: 'Unterkunft', description: 'Hotels, Hostels, Retreats und Räume.', examples: ['Hotels', 'Hostels', 'Retreats', 'B&B'] },
        wellness: { title: 'Wellness', description: 'Spa, Therapien, Yoga und persönliche Pflege.', examples: ['Spa', 'Yoga', 'Therapien', 'Fitness'] },
        professional: { title: 'Professionell', description: 'Workshops, Coaching und spezialisierte Dienstleistungen.', examples: ['Workshops', 'Coaching', 'Kurse', 'Beratung'] },
      },
    },
    socialProof: {
      sectionLabel: 'Referenzen',
      sectionTitle: 'Unternehmen, die uns vertrauen',
      stats: {
        attention: '24/7 Kontinuierlicher Support',
        languages: '6 Unterstützte Sprachen',
        scalability: '∞ Skalierbarkeit',
        agents: 'KI Spezialisierte Agenten',
      },
      testimonials: {
        t1: { quote: 'Das KI-Agentensystem hat die Art, wie wir unser Restaurant führen, transformiert. Tagesmenüs werden in Minuten generiert.', author: 'María García', role: 'Executive Chef, Barcelona' },
        t2: { quote: 'Die Vorausplanung ermöglicht es uns, ganze Wochen zu planen. Logistik und Einkäufe waren noch nie so einfach.', author: 'Alessandro Rossi', role: 'Hoteldirektor, Milano' },
        t3: { quote: 'Endlich eine Plattform, die Gastgewerbe versteht. Der mehrsprachige Support ist außergewöhnlich für unsere internationalen Gäste.', author: 'James Mitchell', role: 'Retreat-Manager, Ibiza' },
      },
    },
    pricing: {
      sectionLabel: 'Preise',
      sectionTitle: 'Pläne und Preise',
      sectionSubtitle: 'Aktivieren Sie Ihr intelligentes System in wenigen Tagen und automatisieren Sie Ihr Geschäft.',
      popular: 'Empfohlen',
      setupLabel: 'Einrichtung',
      monthlyLabel: 'Monatlich',
      perMonth: 'Monat',
      ctaStart: 'Jetzt starten',
      ctaDemo: 'Demo anfordern',
      ctaAdvisor: 'Mit einem Berater sprechen',
      bonusTitle: 'Express-Aktivierung in 48h inklusive',
      bonusDescription: 'Wert 150 € — in allen Plänen enthalten.',
      installmentTitle: 'Ratenzahlung verfügbar',
      installmentDescription: '190 € zum Start + Rest bei Aktivierung (Basis-Plan).',
      languagesSupported: 'Unterstützte Sprachen: EN, ES, IT, FR, PT, DE',
      plans: {
        basic: {
          name: 'Basis-Plan',
          description: 'Automatisieren Sie die Grundlagen Ihres Geschäfts.',
          features: ['Dashboard für automatisierte Buchungen', 'Bestätigungen & Erinnerungen', '1–2 grundlegende KI-Agenten', 'Grundlegendes Grafikmodul', 'E-Mail-Support'],
        },
        advanced: {
          name: 'Professioneller Plan',
          description: 'Vollständige Automatisierung mit fortgeschrittenen KI-Agenten.',
          features: ['Fortgeschrittene KI-Agenten (Sprache, WhatsApp, E-Mail)', 'Berichte & Metriken', 'Google Calendar & externe Integrationen', 'Vollständiges Marketing-Modul', 'Prioritäts-Support'],
        },
        custom: {
          name: 'Premium / Enterprise',
          description: 'Komplettlösung ohne Grenzen.',
          features: ['Integriertes Buchhaltungssystem', 'HR-Modul', 'Vollständige Anpassung', 'Erweiterte Integrationen (POS, ERP)', '24/7 Support', 'Personalisiertes Training'],
        },
      },
    },
    cta: {
      badge: 'Premium Intelligentes Ökosystem',
      title: 'Bereit für Verkauf.',
      titleHighlight: 'Konzipiert für Wachstum.',
      description: 'Es ist keine App. Es ist keine Website. Es ist ein intelligentes Betriebssystem, angetrieben von KI-Agenten, das mit Ihrem Geschäft wächst.',
      primaryBtn: 'Demo anfordern',
      secondaryBtn: 'Mehr erfahren',
      points: ['Automatisierbar', 'Skalierbar', 'Evolutionär'],
      evolutionTitle: 'Kontinuierliche Evolution',
      evolutionDescription: 'Die Plattform ist als lebendes System konzipiert mit operativen, evolutiven (KI) und kreativen Updates. Das System verbessert sich durch Nutzung und Zeit.',
    },
    footer: {
      description: 'Intelligentes Betriebssystem für Unternehmen, angetrieben von KI-Agenten. Gastgewerbe, Gastronomie, Reisen und Erlebnisse.',
      categories: {
        platform: { title: 'Plattform', links: ['Module', 'KI-Agenten', 'Integrationen', 'API'] },
        industries: { title: 'Branchen', links: ['Restaurants', 'Hotels', 'Reisen', 'Erlebnisse'] },
        company: { title: 'Unternehmen', links: ['Über uns', 'Blog', 'Kontakt', 'Karriere'] },
        legal: { title: 'Rechtliches', links: ['Datenschutz', 'AGB', 'Cookies', 'DSGVO'] },
      },
      copyright: '© 2026 FlowBooking. Design by Just Bee Brand Agency.',
    },
    chat: {
      title: 'KI-Assistent',
      status: 'Online',
      inputPlaceholder: 'Schreiben Sie Ihre Nachricht...',
      messages: {
        greeting: 'Hallo! 👋 Ich bin Ihr KI-Reservierungsassistent. Wie kann ich Ihnen heute helfen?',
        question: 'Welche Art von Service suchen Sie? (Restaurant, Spa, Workshop...)',
        userResponse: 'Ich möchte einen Tisch für 4 Personen reservieren',
        confirmation: 'Perfekt! Ich habe Verfügbarkeit für 4 Personen. Welcher Tag und welche Uhrzeit passen Ihnen?',
      },
    },
    salesChat: {
      title: 'KI-Verkaufsassistent',
      status: 'Online',
      inputPlaceholder: 'Schreiben Sie Ihre Nachricht...',
      greeting: 'Hallo! 👋 Ich bin der Assistent von FlowBooking. Wie kann ich Ihnen heute helfen?',
      errorMessage: 'Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
      connectionError: 'Verbindung verloren',
      retry: 'Erneut versuchen',
      poweredBy: 'Powered by',
      quickAction1: 'Ich möchte mehr erfahren',
      quickAction2: 'Demo anfordern',
      quickAction3: 'Preise ansehen',
    },
  },
};
