import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Language } from "@/i18n/translations";

type QA = { q: string; a: string };
type FAQContent = {
  title: string;
  subtitle: string;
  groups: { heading: string; items: QA[] }[];
};

const CONTENT: Record<Language, FAQContent> = {
  en: {
    title: "Frequently Asked Questions",
    subtitle:
      "Everything you need to know about AI agents, chatbots, automation, digital menus, websites, and connected communication channels.",
    groups: [
      {
        heading: "General",
        items: [
          {
            q: "What is App Booking Intelligence?",
            a: "App Booking Intelligence is an AI-powered platform that helps businesses create, connect, and manage AI chatbots and intelligent agents across multiple communication channels. You can connect AI-powered conversations to WhatsApp, social media, websites, custom chatbots, digital menus, and other digital experiences from one central platform.",
          },
          {
            q: "Who is the platform for?",
            a: "The platform is designed for businesses, hospitality companies, restaurants, hotels, travel businesses, service providers, agencies, and any organization that wants to automate customer communication and improve its digital experience with AI.",
          },
          {
            q: "Do I need technical knowledge to use the platform?",
            a: "No. The platform is designed to make it easier to create and connect AI-powered tools without requiring advanced technical knowledge. Depending on the integration, some technical configuration may be required.",
          },
        ],
      },
      {
        heading: "AI Chatbots and Agents",
        items: [
          {
            q: "What is the difference between an AI chatbot and an AI agent?",
            a: "An AI chatbot primarily communicates with users and provides automated responses. An AI agent can perform more advanced tasks, follow instructions, use connected information, and support more complex workflows. The right solution depends on your business needs and the level of automation you want to achieve.",
          },
          {
            q: "Can I create my own AI chatbot?",
            a: "Yes. You can create and customize AI-powered chatbots according to your business needs, brand, content, and communication objectives.",
          },
          {
            q: "Can I create AI agents for my business?",
            a: "Yes. You can create AI agents designed to assist with customer communication, support, lead generation, information retrieval, reservations, and other business workflows.",
          },
          {
            q: "Can I customize the behavior of my AI chatbot or agent?",
            a: "Yes. You can define how your AI chatbot or agent communicates, what information it should use, what type of responses it should provide, and how it should interact with users.",
          },
          {
            q: "Can my AI agent use my business information?",
            a: "Yes. AI tools can be connected to relevant business information and content so they can provide more accurate and useful responses. The available capabilities depend on the specific configuration and integrations used.",
          },
        ],
      },
      {
        heading: "WhatsApp and Social Media",
        items: [
          {
            q: "Can I connect my AI chatbot to WhatsApp?",
            a: "Yes. The platform is designed to support AI-powered conversations through WhatsApp, subject to the requirements and availability of the relevant integration.",
          },
          {
            q: "Can I connect AI agents to social media?",
            a: "Yes. AI-powered chatbots and agents can be connected to supported social media channels and digital communication platforms. The available channels may depend on the specific integration and configuration.",
          },
          {
            q: "Can I manage multiple communication channels?",
            a: "The platform is designed to help businesses centralize AI-powered communication across different channels, including websites, messaging platforms, social media, and other connected digital experiences.",
          },
          {
            q: "Can the same AI agent be used across different channels?",
            a: "Depending on the configuration, the same business knowledge and AI logic can be adapted to support multiple channels. Each channel may require its own specific integration and technical configuration.",
          },
        ],
      },
      {
        heading: "Websites and Web Chatbots",
        items: [
          {
            q: "Can I add an AI chatbot to my website?",
            a: "Yes. You can connect an AI chatbot or AI agent to your website to help visitors find information, answer questions, generate leads, and support customer communication.",
          },
          {
            q: "Can I create a website with the platform?",
            a: "Yes. The platform may include the ability to create a website as an optional external tool. The website can be used as a digital presence for your business and can be connected to other platform capabilities, such as AI chatbots and agents.",
          },
          {
            q: "Is the website builder mandatory?",
            a: "No. The website creation tool is optional. You can use the platform's AI and automation capabilities without necessarily creating a website through the platform.",
          },
          {
            q: "Can I connect my existing website?",
            a: "Depending on the available integrations, you may be able to connect AI chatbots, agents, widgets, or other digital tools to an existing website.",
          },
        ],
      },
      {
        heading: "Digital Menus",
        items: [
          {
            q: "Can I connect a digital menu?",
            a: "Yes. You can connect a digital menu to your digital ecosystem and use it as part of your customer experience. This can be especially useful for restaurants, hotels, hospitality businesses, and other businesses that need to display products, services, menus, or information digitally.",
          },
          {
            q: "Can an AI chatbot interact with my digital menu?",
            a: "Depending on the configuration, an AI chatbot or agent can help users navigate information related to a connected digital menu. The exact capabilities depend on the integration and setup.",
          },
        ],
      },
      {
        heading: "Automation and Business Workflows",
        items: [
          {
            q: "What can AI agents help my business with?",
            a: "AI agents can help with tasks such as answering frequently asked questions, customer support, lead generation, product and service information, reservation-related communication, customer qualification, information retrieval, automated conversations, and digital assistance. Available capabilities depend on the configuration and connected tools.",
          },
          {
            q: "Can AI agents automate repetitive conversations?",
            a: "Yes. AI agents can help automate repetitive questions and conversations, allowing businesses to provide faster responses and reduce manual work.",
          },
          {
            q: "Can I connect different tools and services?",
            a: "The platform is designed to support connections between AI tools, communication channels, websites, digital menus, and other digital services. The exact integrations available may vary depending on the platform configuration and supported services.",
          },
        ],
      },
      {
        heading: "Security and Control",
        items: [
          {
            q: "Can I control what my AI agent can do?",
            a: "Yes. AI agents should be configured with clear instructions, permissions, and limitations according to their intended use.",
          },
          {
            q: "Can I update my chatbot or AI agent?",
            a: "Yes. You can update its instructions, information, configuration, and connected tools as your business evolves.",
          },
          {
            q: "Can I have different AI agents for different purposes?",
            a: "Yes. Different AI agents can be created for different business needs, departments, channels, or workflows.",
          },
        ],
      },
      {
        heading: "Getting Started",
        items: [
          {
            q: "How do I get started?",
            a: "Start by defining what you want to automate. You can then choose the appropriate AI chatbot, AI agent, communication channel, website, digital menu, or integration for your needs.",
          },
          {
            q: "Do I need to use every feature?",
            a: "No. The platform is modular. You can use only the tools and integrations that are relevant to your business.",
          },
          {
            q: "Can I expand my setup later?",
            a: "Yes. You can start with a simple chatbot or AI workflow and expand your setup over time by connecting additional channels, agents, websites, digital tools, and integrations.",
          },
        ],
      },
    ],
  },
  es: {
    title: "Preguntas frecuentes",
    subtitle:
      "Todo lo que necesitas saber sobre agentes de IA, chatbots, automatización, menús digitales, sitios web y canales de comunicación conectados.",
    groups: [
      {
        heading: "General",
        items: [
          { q: "¿Qué es App Booking Intelligence?", a: "App Booking Intelligence es una plataforma impulsada por IA que ayuda a las empresas a crear, conectar y gestionar chatbots y agentes inteligentes en múltiples canales de comunicación. Puedes conectar conversaciones con IA a WhatsApp, redes sociales, sitios web, chatbots personalizados, menús digitales y otras experiencias digitales desde una plataforma central." },
          { q: "¿Para quién es la plataforma?", a: "Está diseñada para empresas, hoteles, restaurantes, negocios de viajes, proveedores de servicios, agencias y cualquier organización que quiera automatizar la comunicación con clientes y mejorar su experiencia digital con IA." },
          { q: "¿Necesito conocimientos técnicos para usarla?", a: "No. La plataforma facilita crear y conectar herramientas con IA sin necesidad de conocimientos técnicos avanzados. Según la integración, puede requerir alguna configuración técnica." },
        ],
      },
      {
        heading: "Chatbots y agentes de IA",
        items: [
          { q: "¿Cuál es la diferencia entre un chatbot y un agente de IA?", a: "Un chatbot comunica y da respuestas automatizadas. Un agente puede realizar tareas más complejas, seguir instrucciones y usar información conectada. La solución correcta depende de tu negocio y el nivel de automatización." },
          { q: "¿Puedo crear mi propio chatbot de IA?", a: "Sí. Puedes crear y personalizar chatbots según las necesidades, marca y objetivos de tu negocio." },
          { q: "¿Puedo crear agentes de IA para mi negocio?", a: "Sí. Puedes crear agentes para atención al cliente, generación de leads, información, reservas y otros flujos de trabajo." },
          { q: "¿Puedo personalizar el comportamiento del chatbot o agente?", a: "Sí. Puedes definir cómo se comunica, qué información utiliza, qué respuestas ofrece y cómo interactúa con los usuarios." },
          { q: "¿Puede mi agente usar la información de mi negocio?", a: "Sí. Las herramientas de IA pueden conectarse a información relevante para dar respuestas más precisas. Las capacidades dependen de la configuración e integraciones utilizadas." },
        ],
      },
      {
        heading: "WhatsApp y redes sociales",
        items: [
          { q: "¿Puedo conectar mi chatbot a WhatsApp?", a: "Sí. La plataforma admite conversaciones con IA a través de WhatsApp, sujeto a los requisitos de la integración correspondiente." },
          { q: "¿Puedo conectar agentes a redes sociales?", a: "Sí. Los chatbots y agentes se pueden conectar a los canales soportados. Los canales disponibles dependen de la integración." },
          { q: "¿Puedo gestionar múltiples canales?", a: "Sí. La plataforma centraliza la comunicación con IA a través de webs, mensajería, redes sociales y otras experiencias digitales conectadas." },
          { q: "¿Puedo usar el mismo agente en distintos canales?", a: "Sí. Según la configuración, el mismo conocimiento y lógica pueden adaptarse a varios canales; cada uno puede requerir su integración específica." },
        ],
      },
      {
        heading: "Sitios web y chatbots web",
        items: [
          { q: "¿Puedo añadir un chatbot a mi sitio web?", a: "Sí. Puedes conectar un chatbot o agente para ayudar a los visitantes, responder preguntas, captar leads y dar soporte." },
          { q: "¿Puedo crear un sitio web con la plataforma?", a: "Sí. La plataforma incluye la posibilidad de crear un sitio como herramienta externa opcional, conectable con otras capacidades." },
          { q: "¿Es obligatorio el creador de sitios?", a: "No. Es opcional. Puedes usar la IA y la automatización sin crear un sitio en la plataforma." },
          { q: "¿Puedo conectar mi web existente?", a: "Sí. Según las integraciones disponibles, puedes conectar chatbots, agentes, widgets u otras herramientas a un sitio existente." },
        ],
      },
      {
        heading: "Menús digitales",
        items: [
          { q: "¿Puedo conectar un menú digital?", a: "Sí. Puedes conectar un menú digital como parte de la experiencia del cliente. Útil para restaurantes, hoteles y negocios de hospitalidad." },
          { q: "¿Puede un chatbot interactuar con mi menú digital?", a: "Sí. Según la configuración, un chatbot o agente puede ayudar a navegar la información del menú conectado." },
        ],
      },
      {
        heading: "Automatización y flujos de trabajo",
        items: [
          { q: "¿En qué pueden ayudar los agentes de IA?", a: "En preguntas frecuentes, soporte, generación de leads, información de productos, comunicación de reservas, calificación de clientes, recuperación de información, conversaciones automatizadas y asistencia digital." },
          { q: "¿Automatizan conversaciones repetitivas?", a: "Sí. Los agentes ayudan a automatizar preguntas y conversaciones repetitivas, ofreciendo respuestas más rápidas y reduciendo trabajo manual." },
          { q: "¿Puedo conectar diferentes herramientas y servicios?", a: "Sí. La plataforma admite conexiones entre herramientas de IA, canales, webs, menús y otros servicios digitales." },
        ],
      },
      {
        heading: "Seguridad y control",
        items: [
          { q: "¿Puedo controlar lo que hace mi agente?", a: "Sí. Los agentes se configuran con instrucciones, permisos y límites claros según su uso previsto." },
          { q: "¿Puedo actualizar mi chatbot o agente?", a: "Sí. Puedes actualizar instrucciones, información, configuración y herramientas conectadas." },
          { q: "¿Puedo tener distintos agentes para distintos fines?", a: "Sí. Puedes crear agentes distintos por necesidad, departamento, canal o flujo." },
        ],
      },
      {
        heading: "Primeros pasos",
        items: [
          { q: "¿Cómo empiezo?", a: "Define qué quieres automatizar y elige el chatbot, agente, canal, web, menú o integración adecuados." },
          { q: "¿Necesito usar todas las funciones?", a: "No. La plataforma es modular; usa solo las herramientas relevantes para tu negocio." },
          { q: "¿Puedo ampliar mi configuración más adelante?", a: "Sí. Puedes comenzar simple y luego añadir canales, agentes, webs, herramientas e integraciones." },
        ],
      },
    ],
  },
  it: {
    title: "Domande frequenti",
    subtitle: "Tutto quello che devi sapere su agenti AI, chatbot, automazione, menu digitali, siti web e canali di comunicazione connessi.",
    groups: [
      { heading: "Generale", items: [
        { q: "Cos'è App Booking Intelligence?", a: "È una piattaforma basata sull'AI che aiuta le aziende a creare, connettere e gestire chatbot e agenti intelligenti su più canali di comunicazione, tra cui WhatsApp, social media, siti web, chatbot personalizzati e menu digitali." },
        { q: "A chi è rivolta la piattaforma?", a: "A imprese, hotel, ristoranti, aziende di viaggi, fornitori di servizi, agenzie e qualsiasi organizzazione che voglia automatizzare la comunicazione con i clienti tramite AI." },
        { q: "Servono competenze tecniche?", a: "No. La piattaforma è pensata per essere semplice da usare. Alcune integrazioni possono richiedere configurazione tecnica." },
      ] },
      { heading: "Chatbot e agenti AI", items: [
        { q: "Differenza tra chatbot e agente AI?", a: "Un chatbot comunica e fornisce risposte automatiche; un agente esegue attività più avanzate, segue istruzioni e supporta flussi complessi." },
        { q: "Posso creare il mio chatbot AI?", a: "Sì. Puoi crearli e personalizzarli in base al tuo brand e ai tuoi obiettivi." },
        { q: "Posso creare agenti AI per la mia attività?", a: "Sì. Per assistenza clienti, lead generation, informazioni, prenotazioni e altri flussi." },
        { q: "Posso personalizzare il comportamento?", a: "Sì. Definisci come comunica, quali informazioni utilizza e come interagisce." },
        { q: "L'agente può usare le informazioni della mia attività?", a: "Sì. Può essere connesso ai contenuti aziendali per risposte più accurate." },
      ] },
      { heading: "WhatsApp e social media", items: [
        { q: "Posso collegare il chatbot a WhatsApp?", a: "Sì, secondo i requisiti dell'integrazione." },
        { q: "Posso collegare agenti ai social?", a: "Sì, sui canali supportati." },
        { q: "Posso gestire più canali?", a: "Sì. La piattaforma centralizza la comunicazione AI su più canali." },
        { q: "Stesso agente su canali diversi?", a: "Sì, con la configurazione adeguata per ciascun canale." },
      ] },
      { heading: "Siti web e chatbot web", items: [
        { q: "Posso aggiungere un chatbot al sito?", a: "Sì, per aiutare i visitatori, rispondere e generare lead." },
        { q: "Posso creare un sito con la piattaforma?", a: "Sì, come strumento esterno opzionale connesso alle altre funzionalità." },
        { q: "Il website builder è obbligatorio?", a: "No, è opzionale." },
        { q: "Posso collegare un sito esistente?", a: "Sì, tramite chatbot, widget e altre integrazioni." },
      ] },
      { heading: "Menu digitali", items: [
        { q: "Posso collegare un menu digitale?", a: "Sì, come parte dell'esperienza cliente." },
        { q: "Il chatbot può interagire con il menu?", a: "Sì, secondo la configurazione." },
      ] },
      { heading: "Automazione e flussi", items: [
        { q: "In cosa aiutano gli agenti AI?", a: "FAQ, supporto, lead, prodotti, prenotazioni, qualificazione, ricerca informazioni, conversazioni automatiche." },
        { q: "Automatizzano conversazioni ripetitive?", a: "Sì, riducendo il lavoro manuale." },
        { q: "Posso collegare diversi strumenti?", a: "Sì, la piattaforma supporta molteplici integrazioni." },
      ] },
      { heading: "Sicurezza e controllo", items: [
        { q: "Posso controllare cosa fa l'agente?", a: "Sì, con istruzioni, permessi e limiti chiari." },
        { q: "Posso aggiornare il chatbot?", a: "Sì, in ogni momento." },
        { q: "Posso avere più agenti?", a: "Sì, uno per ogni scopo o canale." },
      ] },
      { heading: "Inizia", items: [
        { q: "Come inizio?", a: "Definisci cosa vuoi automatizzare e scegli chatbot, agente, canale, sito, menu o integrazione." },
        { q: "Devo usare tutte le funzioni?", a: "No, la piattaforma è modulare." },
        { q: "Posso espandere in seguito?", a: "Sì, aggiungendo canali, agenti e integrazioni." },
      ] },
    ],
  },
  fr: {
    title: "Questions fréquentes",
    subtitle: "Tout ce que vous devez savoir sur les agents IA, chatbots, automatisation, menus numériques, sites web et canaux de communication connectés.",
    groups: [
      { heading: "Général", items: [
        { q: "Qu'est-ce qu'App Booking Intelligence ?", a: "Une plateforme d'IA qui aide les entreprises à créer, connecter et gérer des chatbots et agents intelligents sur plusieurs canaux : WhatsApp, réseaux sociaux, sites web, chatbots personnalisés, menus numériques et autres." },
        { q: "À qui s'adresse-t-elle ?", a: "Aux entreprises, hôtels, restaurants, agences de voyage, prestataires de services et toute organisation souhaitant automatiser la communication client avec l'IA." },
        { q: "Faut-il des connaissances techniques ?", a: "Non. Certaines intégrations peuvent nécessiter une configuration technique." },
      ] },
      { heading: "Chatbots et agents IA", items: [
        { q: "Différence entre chatbot et agent IA ?", a: "Un chatbot répond automatiquement ; un agent exécute des tâches plus avancées et suit des instructions." },
        { q: "Puis-je créer mon chatbot IA ?", a: "Oui, personnalisé selon votre marque et vos objectifs." },
        { q: "Puis-je créer des agents IA ?", a: "Oui, pour le support, la génération de leads, les réservations, etc." },
        { q: "Puis-je personnaliser le comportement ?", a: "Oui, communication, informations et interactions sont configurables." },
        { q: "L'agent peut-il utiliser mes données métier ?", a: "Oui, pour des réponses plus précises." },
      ] },
      { heading: "WhatsApp et réseaux sociaux", items: [
        { q: "Connecter mon chatbot à WhatsApp ?", a: "Oui, selon les exigences de l'intégration." },
        { q: "Connecter des agents aux réseaux sociaux ?", a: "Oui, sur les canaux pris en charge." },
        { q: "Gérer plusieurs canaux ?", a: "Oui, la plateforme centralise la communication IA." },
        { q: "Même agent sur différents canaux ?", a: "Oui, avec la configuration adéquate." },
      ] },
      { heading: "Sites et chatbots web", items: [
        { q: "Ajouter un chatbot à mon site ?", a: "Oui, pour aider les visiteurs et générer des leads." },
        { q: "Créer un site avec la plateforme ?", a: "Oui, comme outil externe optionnel." },
        { q: "Le créateur de site est-il obligatoire ?", a: "Non, il est optionnel." },
        { q: "Connecter un site existant ?", a: "Oui, via chatbots, widgets et intégrations." },
      ] },
      { heading: "Menus numériques", items: [
        { q: "Connecter un menu numérique ?", a: "Oui, comme partie de l'expérience client." },
        { q: "Le chatbot peut-il interagir avec le menu ?", a: "Oui, selon la configuration." },
      ] },
      { heading: "Automatisation", items: [
        { q: "En quoi les agents aident-ils ?", a: "FAQ, support, leads, produits, réservations, qualification, recherche, conversations automatiques." },
        { q: "Automatiser les conversations répétitives ?", a: "Oui." },
        { q: "Connecter différents outils ?", a: "Oui, la plateforme prend en charge de nombreuses intégrations." },
      ] },
      { heading: "Sécurité et contrôle", items: [
        { q: "Puis-je contrôler l'agent ?", a: "Oui, avec instructions, permissions et limites." },
        { q: "Puis-je mettre à jour le chatbot ?", a: "Oui, à tout moment." },
        { q: "Différents agents pour différents usages ?", a: "Oui." },
      ] },
      { heading: "Démarrer", items: [
        { q: "Comment commencer ?", a: "Définissez ce que vous voulez automatiser et choisissez les outils appropriés." },
        { q: "Dois-je utiliser toutes les fonctions ?", a: "Non, la plateforme est modulaire." },
        { q: "Puis-je étendre plus tard ?", a: "Oui, ajoutez canaux, agents et intégrations progressivement." },
      ] },
    ],
  },
  pt: {
    title: "Perguntas frequentes",
    subtitle: "Tudo o que precisa de saber sobre agentes de IA, chatbots, automação, menus digitais, sites e canais de comunicação conectados.",
    groups: [
      { heading: "Geral", items: [
        { q: "O que é App Booking Intelligence?", a: "Uma plataforma de IA que ajuda empresas a criar, conectar e gerir chatbots e agentes inteligentes em múltiplos canais: WhatsApp, redes sociais, sites, chatbots personalizados e menus digitais." },
        { q: "A quem se destina?", a: "A empresas, hotéis, restaurantes, viagens, serviços, agências e organizações que queiram automatizar comunicação com IA." },
        { q: "Preciso de conhecimentos técnicos?", a: "Não. Algumas integrações podem exigir configuração técnica." },
      ] },
      { heading: "Chatbots e agentes IA", items: [
        { q: "Diferença entre chatbot e agente?", a: "O chatbot responde automaticamente; o agente executa tarefas mais complexas." },
        { q: "Posso criar o meu chatbot?", a: "Sim, personalizado à sua marca." },
        { q: "Posso criar agentes IA?", a: "Sim, para suporte, leads, reservas e outros fluxos." },
        { q: "Personalizar o comportamento?", a: "Sim, comunicação, informações e interações." },
        { q: "O agente pode usar dados do negócio?", a: "Sim, para respostas mais precisas." },
      ] },
      { heading: "WhatsApp e redes sociais", items: [
        { q: "Ligar chatbot ao WhatsApp?", a: "Sim, conforme os requisitos de integração." },
        { q: "Ligar agentes às redes sociais?", a: "Sim, nos canais suportados." },
        { q: "Gerir vários canais?", a: "Sim, centralizado numa só plataforma." },
        { q: "Mesmo agente em canais diferentes?", a: "Sim, com a configuração adequada." },
      ] },
      { heading: "Sites e chatbots web", items: [
        { q: "Adicionar chatbot ao meu site?", a: "Sim, para ajudar visitantes e gerar leads." },
        { q: "Criar site com a plataforma?", a: "Sim, ferramenta externa opcional." },
        { q: "O criador de sites é obrigatório?", a: "Não, é opcional." },
        { q: "Ligar site existente?", a: "Sim, via chatbots, widgets e integrações." },
      ] },
      { heading: "Menus digitais", items: [
        { q: "Ligar um menu digital?", a: "Sim, como parte da experiência do cliente." },
        { q: "O chatbot interage com o menu?", a: "Sim, conforme configuração." },
      ] },
      { heading: "Automação", items: [
        { q: "Em que ajudam os agentes?", a: "FAQ, suporte, leads, produtos, reservas, qualificação, informação, conversas automáticas." },
        { q: "Automatizar conversas repetitivas?", a: "Sim." },
        { q: "Ligar diferentes ferramentas?", a: "Sim, várias integrações disponíveis." },
      ] },
      { heading: "Segurança e controlo", items: [
        { q: "Controlar o que o agente faz?", a: "Sim, com instruções, permissões e limites." },
        { q: "Posso atualizar o chatbot?", a: "Sim, a qualquer momento." },
        { q: "Diferentes agentes para diferentes fins?", a: "Sim." },
      ] },
      { heading: "Começar", items: [
        { q: "Como começo?", a: "Defina o que quer automatizar e escolha as ferramentas." },
        { q: "Preciso usar todas as funcionalidades?", a: "Não, a plataforma é modular." },
        { q: "Posso expandir mais tarde?", a: "Sim, adicionando canais, agentes e integrações." },
      ] },
    ],
  },
  de: {
    title: "Häufig gestellte Fragen",
    subtitle: "Alles, was Sie über KI-Agenten, Chatbots, Automatisierung, digitale Menüs, Websites und verbundene Kommunikationskanäle wissen müssen.",
    groups: [
      { heading: "Allgemein", items: [
        { q: "Was ist App Booking Intelligence?", a: "Eine KI-Plattform, die Unternehmen hilft, Chatbots und intelligente Agenten über mehrere Kanäle zu erstellen, zu verbinden und zu verwalten – WhatsApp, Social Media, Websites, individuelle Chatbots und digitale Menüs." },
        { q: "Für wen ist die Plattform?", a: "Für Unternehmen, Hotels, Restaurants, Reiseanbieter, Dienstleister, Agenturen und alle, die Kundenkommunikation mit KI automatisieren wollen." },
        { q: "Sind technische Kenntnisse nötig?", a: "Nein. Manche Integrationen können technische Konfiguration erfordern." },
      ] },
      { heading: "KI-Chatbots und Agenten", items: [
        { q: "Unterschied Chatbot und Agent?", a: "Ein Chatbot antwortet automatisch; ein Agent führt komplexere Aufgaben und Arbeitsabläufe aus." },
        { q: "Kann ich meinen eigenen Chatbot erstellen?", a: "Ja, an Marke und Ziele angepasst." },
        { q: "Kann ich KI-Agenten erstellen?", a: "Ja, für Support, Leads, Reservierungen und weitere Prozesse." },
        { q: "Kann ich das Verhalten anpassen?", a: "Ja, Kommunikation, Informationen und Interaktion sind konfigurierbar." },
        { q: "Kann der Agent meine Geschäftsdaten nutzen?", a: "Ja, für präzisere Antworten." },
      ] },
      { heading: "WhatsApp und Social Media", items: [
        { q: "Chatbot mit WhatsApp verbinden?", a: "Ja, gemäß Anforderungen der Integration." },
        { q: "Agenten mit Social Media verbinden?", a: "Ja, auf unterstützten Kanälen." },
        { q: "Mehrere Kanäle verwalten?", a: "Ja, zentralisiert auf einer Plattform." },
        { q: "Gleicher Agent auf mehreren Kanälen?", a: "Ja, mit passender Konfiguration." },
      ] },
      { heading: "Websites und Web-Chatbots", items: [
        { q: "Chatbot auf meiner Website?", a: "Ja, um Besucher zu unterstützen und Leads zu generieren." },
        { q: "Website mit der Plattform erstellen?", a: "Ja, als optionales externes Werkzeug." },
        { q: "Ist der Website-Builder Pflicht?", a: "Nein, optional." },
        { q: "Bestehende Website verbinden?", a: "Ja, via Chatbots, Widgets und Integrationen." },
      ] },
      { heading: "Digitale Menüs", items: [
        { q: "Digitales Menü verbinden?", a: "Ja, als Teil des Kundenerlebnisses." },
        { q: "Kann der Chatbot mit dem Menü interagieren?", a: "Ja, je nach Konfiguration." },
      ] },
      { heading: "Automatisierung", items: [
        { q: "Wobei helfen KI-Agenten?", a: "FAQ, Support, Leads, Produkte, Reservierungen, Qualifizierung, Informationssuche, automatisierte Gespräche." },
        { q: "Wiederkehrende Gespräche automatisieren?", a: "Ja." },
        { q: "Verschiedene Tools verbinden?", a: "Ja, viele Integrationen möglich." },
      ] },
      { heading: "Sicherheit und Kontrolle", items: [
        { q: "Kontrolle über den Agenten?", a: "Ja, mit klaren Anweisungen, Rechten und Grenzen." },
        { q: "Chatbot aktualisieren?", a: "Ja, jederzeit." },
        { q: "Verschiedene Agenten für verschiedene Zwecke?", a: "Ja." },
      ] },
      { heading: "Erste Schritte", items: [
        { q: "Wie fange ich an?", a: "Definieren Sie, was automatisiert werden soll, und wählen Sie passende Werkzeuge." },
        { q: "Muss ich alle Funktionen nutzen?", a: "Nein, die Plattform ist modular." },
        { q: "Kann ich später erweitern?", a: "Ja, um Kanäle, Agenten und Integrationen." },
      ] },
    ],
  },
};

const FAQ = () => {
  const { language } = useLanguage();
  const content = CONTENT[language] ?? CONTENT.en;

  // Build FAQPage JSON-LD from EN source for SEO consistency.
  const enItems = CONTENT.en.groups.flatMap((g) => g.items);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: enItems.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-16 sm:py-24 lg:py-32 bg-background border-t border-border/60"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            FAQ
          </span>
          <h2
            id="faq-heading"
            className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mt-4 mb-4 sm:mb-6 leading-display"
          >
            {content.title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {content.subtitle}
          </p>
        </motion.div>

        <div className="space-y-10">
          {content.groups.map((group, gi) => (
            <div key={`${group.heading}-${gi}`}>
              <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-4">
                {group.heading}
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {group.items.map((item, i) => {
                  const value = `faq-${gi}-${i}`;
                  return (
                    <AccordionItem key={value} value={value} className="border-border">
                      <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
};

export default FAQ;
