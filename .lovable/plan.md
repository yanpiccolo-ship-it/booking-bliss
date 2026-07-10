# Plan de ejecución (por fases)

Voy a trabajar en 4 fases cortas. Cada fase la ejecuto entera en un turno, muestro qué se hizo y sigo con la siguiente.

## Fase 1 — Footer 100% en inglés (turno actual)

El Footer sigue mostrando texto en español porque las traducciones `t.footer.*` están en español para el idioma `es`, y aunque el idioma base sea `en`, hay claves que quedaron mezcladas. Voy a:

- Forzar todos los textos del Footer (categorías, links, description, copyright) al inglés como fuente única en `translations.ts` para el locale `en`.
- Revisar que las cadenas `categories.platform / industries / company / legal` estén en inglés.
- Verificar visualmente con Playwright headless.

## Fase 2 — SEO base + GEO (siguiente turno)

- `index.html`: `<title>`, `<meta description>`, `og:*`, `twitter:card`, canonical, JSON-LD `Organization` + `SoftwareApplication` + `FAQPage`.
- `public/robots.txt` con `Sitemap:`.
- `scripts/generate-sitemap.ts` + hooks `predev`/`prebuild` con todas las rutas públicas (`/`, `/auth`, `/request-demo`, `/demo`, `/privacy`, `/terms`, `/progress`).
- `react-helmet-async` para `<title>`/`description`/canonical por ruta clave (Privacy, Terms, RequestDemo, Demo, BusinessSite).
- **GEO (respuestas en ChatGPT/Perplexity/Gemini)**: FAQ estructurado (JSON-LD `FAQPage`) en la landing con preguntas frecuentes reales del rubro ("mejor software de reservas para restaurantes con IA", "alternativa a OpenTable/Booksy", etc.), contenido comparativo indexable y `hreflang` para los 6 idiomas.
- Sugerencias adicionales (fuera de código, para tu acción): dar de alta el dominio en Google Search Console, Bing Webmaster, y solicitar listado en G2/Capterra/GetApp — es lo que más impacta en GEO.

## Fase 3 — Auditoría de seguridad (turno siguiente)

- Correr `supabase--linter` sobre las ~44 tablas.
- Correr `security--run_security_scan`.
- Revisar RLS de las tablas nuevas de FlowCore (orders, menu_items, waitlists, kitchen_orders, delivery_orders, etc.) — verificar que ninguna esté expuesta a `anon` sin filtro por `business_id`.
- Activar HIBP (Have I Been Pwned) en Auth para bloquear contraseñas filtradas.
- Corregir hallazgos críticos con migraciones. Documentar los aceptados en `security-memory`.

## Fase 4 — ChatBot público de pedidos (turno siguiente)

- Componente `PublicOrderChat.tsx` embebible en la landing y en `/b/:slug`.
- Edge function `public-order-chat` con Gemini 2.5 Flash + **tool calling**:
  - `list_menu(business_id)` → lee `menu_items`.
  - `create_order(business_id, items, customer)` → inserta en `orders` + `order_items`.
  - `check_availability(business_id, date, time)` → llama a `flowcore-create-reservation`.
- Multiidioma automático (detecta el idioma del usuario).
- RLS: policy pública de INSERT en `orders` solo vía RPC firmado por el edge function con `service_role`.

---

## ¿Ya se puede vender con lo que hay hoy?

**Respuesta honesta:**

- **SÍ para piloto pago con 3–10 clientes seleccionados** (early adopters, precio reducido, contrato con letra "beta"). El core funciona: reservas, dashboard, pagos Stripe, agentes IA básicos, multi-idioma, legales.
- **NO para lanzamiento comercial abierto todavía**. Falta:
  1. Email transaccional con dominio verificado (Resend) — sin esto no llegan confirmaciones.
  2. Twilio (WhatsApp/SMS) — prometido en la landing.
  3. Widget embebible y micrositio 100% funcional — vendidos en la propuesta.
  4. Auditoría de seguridad pasada (Fase 3).
  5. Cron `pg_cron` activando `automation-engine` cada 15 min.
  6. Stripe en modo **live** (no test) con webhook de producción.

Con las Fases 2, 3 y 4 hechas + esos 6 puntos de infraestructura externa (que requieren credenciales tuyas), estás listo para lanzamiento comercial abierto en ~1 semana de trabajo.

---

## Sobre los PDFs adjuntos

Ya revisé anteriormente los SPEC A/B/C/D/E (FlowCore Engine, Automatizaciones, Milestones) — están **implementados a nivel de base de datos y RPCs** (Hitos 1-9 completos: reservations, waitlists, hospitality commerce, KDS, delivery, pricing dinámico, analytics). Lo que falta de esos PDFs es **UI para exponer** esos módulos backend (KDS visual, panel waitlist, editor de reglas de pricing) — eso lo puedo hacer en fases dedicadas después de las 4 anteriores si confirmas prioridad.

El PDF "Checklist reducido para clientes" y "GitHub for Claude Agentes" son guías operativas — no requieren código.

---

## ¿Arranco Fase 1 ahora?

Si dices "sí" o "continúa", ejecuto Fase 1 (Footer EN) inmediatamente y luego sigo con Fase 2 sin esperar más aprobaciones, hasta terminar las 4.
