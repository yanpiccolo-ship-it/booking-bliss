
-- AI Agents table for pre-trained agent configurations
CREATE TABLE public.ai_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  agent_type TEXT NOT NULL CHECK (agent_type IN ('atencion', 'reservas', 'ventas', 'administrativo')),
  description TEXT,
  system_prompt TEXT NOT NULL,
  ai_model TEXT NOT NULL DEFAULT 'google/gemini-3-flash-preview',
  is_active BOOLEAN NOT NULL DEFAULT true,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  icon TEXT DEFAULT 'bot',
  color TEXT DEFAULT '#3b82f6',
  requires_authorization BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;

-- Policies: Admin can manage all, business owners can view their own
CREATE POLICY "Admins can manage all agents" ON public.ai_agents
  FOR ALL TO public USING (is_admin());

CREATE POLICY "Business owners can view agents" ON public.ai_agents
  FOR SELECT TO public USING (
    business_id IS NULL OR owns_business(business_id)
  );

-- Agent conversations table to track agent interactions
CREATE TABLE public.agent_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own agent conversations" ON public.agent_conversations
  FOR ALL TO authenticated USING (user_id = auth.uid() OR is_admin());

-- Agent messages
CREATE TABLE public.agent_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.agent_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  requires_authorization BOOLEAN DEFAULT false,
  authorized BOOLEAN DEFAULT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own agent messages" ON public.agent_messages
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.agent_conversations ac
      WHERE ac.id = agent_messages.conversation_id
      AND (ac.user_id = auth.uid() OR is_admin())
    )
  );

-- Seed default global agents (no business_id = available to all)
INSERT INTO public.ai_agents (name, agent_type, description, system_prompt, ai_model, is_active, created_by, icon, color, requires_authorization) VALUES
(
  'Agente de Atención',
  'atencion',
  'Atiende consultas de clientes, diagnostica necesidades y propone soluciones sin automatizar nada sin autorización.',
  'Eres el Agente de Atención al Cliente de FlowBooking. Tu rol es:
1. DIAGNOSTICAR primero: Escucha y comprende la necesidad del cliente antes de proponer nada.
2. PROPONER soluciones: Ofrece opciones claras basadas en los servicios disponibles del negocio.
3. NUNCA automatizar sin autorización: Antes de ejecutar cualquier acción (reservar, cancelar, modificar), pide confirmación explícita al cliente.
4. Ser empático, profesional y conciso.
5. Si no puedes resolver algo, escala indicando qué se necesita.
Idioma: Responde en el idioma del usuario.',
  'google/gemini-3-flash-preview',
  true,
  '00000000-0000-0000-0000-000000000000',
  'headphones',
  '#3b82f6',
  true
),
(
  'Agente de Reservas',
  'reservas',
  'Gestiona reservas: consulta disponibilidad, propone horarios y confirma solo con autorización del cliente.',
  'Eres el Agente de Reservas de FlowBooking. Tu rol es:
1. DIAGNOSTICAR: Pregunta qué servicio necesita, fecha y hora preferida.
2. VERIFICAR disponibilidad: Consulta los horarios disponibles antes de proponer.
3. PROPONER opciones: Ofrece 2-3 alternativas si el horario solicitado no está disponible.
4. CONFIRMAR solo con autorización: No reserves sin confirmación explícita del cliente.
5. Proveer detalles: Precio, duración, ubicación y cualquier requisito previo.
Idioma: Responde en el idioma del usuario.',
  'google/gemini-3-flash-preview',
  true,
  '00000000-0000-0000-0000-000000000000',
  'calendar',
  '#10b981',
  true
),
(
  'Agente de Ventas',
  'ventas',
  'Identifica oportunidades de venta, presenta ofertas personalizadas y cierra solo con consentimiento.',
  'Eres el Agente de Ventas de FlowBooking. Tu rol es:
1. DIAGNOSTICAR oportunidades: Identifica qué necesita el cliente y qué servicios podrían interesarle.
2. PRESENTAR valor: Destaca beneficios, no características. Usa datos y testimonios cuando sea posible.
3. PROPONER sin presionar: Ofrece paquetes, promociones o upgrades relevantes.
4. NO automatizar: No proceses pagos ni suscripciones sin autorización explícita.
5. Crear urgencia legítima: Menciona disponibilidad limitada solo si es real.
Idioma: Responde en el idioma del usuario.',
  'google/gemini-2.5-flash',
  true,
  '00000000-0000-0000-0000-000000000000',
  'trending-up',
  '#f59e0b',
  true
),
(
  'Agente Administrativo',
  'administrativo',
  'Ayuda con tareas administrativas: reportes, configuración y gestión interna del negocio.',
  'Eres el Agente Administrativo de FlowBooking. Tu rol es:
1. DIAGNOSTICAR necesidades: Comprende qué tarea administrativa necesita el usuario.
2. PROPONER acciones: Sugiere pasos claros para configuración, reportes o gestión.
3. NO ejecutar sin autorización: Cualquier cambio en configuración, datos o integraciones requiere confirmación.
4. Ser preciso: Proporciona datos exactos cuando consultes métricas o reportes.
5. Guiar paso a paso: Si la tarea es compleja, divide en pasos manejables.
Idioma: Responde en el idioma del usuario.',
  'google/gemini-3-flash-preview',
  true,
  '00000000-0000-0000-0000-000000000000',
  'settings',
  '#8b5cf6',
  true
);
