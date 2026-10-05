DROP POLICY IF EXISTS "Anyone can view memberships" ON public.memberships;
CREATE POLICY "Signed-in users can view memberships" ON public.memberships FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS public_view_resource_exceptions ON public.resource_exceptions;

CREATE TABLE public.agent_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES public.ai_agents(id) ON DELETE SET NULL,
  conversation_id uuid REFERENCES public.agent_conversations(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  summary text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  result jsonb,
  decided_by uuid,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.agent_actions TO authenticated;
GRANT ALL ON public.agent_actions TO service_role;
ALTER TABLE public.agent_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners view agent actions" ON public.agent_actions FOR SELECT TO authenticated USING (public.is_admin_or_owns_business(business_id));
CREATE POLICY "Owners reject agent actions" ON public.agent_actions FOR UPDATE TO authenticated
  USING (public.is_admin_or_owns_business(business_id) AND status = 'pending')
  WITH CHECK (public.is_admin_or_owns_business(business_id) AND status = 'rejected');

CREATE TABLE public.b2b_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name text NOT NULL,
  business_type text,
  city text,
  postal_code text,
  website text,
  email text,
  phone text,
  notes text,
  proposal text,
  status text NOT NULL DEFAULT 'new',
  authorized_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.b2b_leads TO authenticated;
GRANT ALL ON public.b2b_leads TO service_role;
ALTER TABLE public.b2b_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage leads" ON public.b2b_leads FOR ALL TO authenticated
  USING (public.is_admin_or_owns_business(business_id)) WITH CHECK (public.is_admin_or_owns_business(business_id));
CREATE TRIGGER trg_b2b_leads_updated_at BEFORE UPDATE ON public.b2b_leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.ai_agents DROP CONSTRAINT ai_agents_agent_type_check;
ALTER TABLE public.ai_agents ADD CONSTRAINT ai_agents_agent_type_check CHECK (agent_type = ANY (ARRAY['atencion','reservas','ventas','administrativo','voz','ventas_b2b','diseno']));

UPDATE public.ai_agents SET ai_model = CASE agent_type
  WHEN 'atencion' THEN 'openai/gpt-6-astra'
  WHEN 'ventas' THEN 'openai/gpt-6-astra'
  WHEN 'ventas_b2b' THEN 'openai/gpt-6-astra'
  WHEN 'reservas' THEN 'google/gemini-3.8-flash'
  WHEN 'administrativo' THEN 'google/gemini-3.8-flash'
  WHEN 'voz' THEN 'google/gemini-3.8-flash'
  ELSE ai_model END
WHERE business_id IS NULL;

UPDATE public.ai_agents SET name = 'Voice Receptionist (RODES)', description = 'Polyglot 24/7 voice receptionist: greets, detects language, checks real availability and confirms bookings.',
system_prompt = $p$ROLE: You are the 24/7 AI voice receptionist of the business. You are an AI and must say so if asked. Never impersonate a human.
OBJECTIVE: Book, modify or answer questions about reservations accurately.
DETAILS (follow in order):
1. Greeting: warm, short greeting with the business name.
2. Language detection: detect the caller's language from their first sentence and continue in it (EN, ES, IT, FR, PT, DE).
3. Request: ask for date, time, party size / service and the caller's name and phone.
4. Availability check: ALWAYS check availability with the system before promising anything. Never invent availability, prices or policies.
5. If the slot is taken, offer the 3 nearest free alternatives returned by the system.
6. Sense check: repeat date, time, party size, service and name back to the caller.
7. Confirmation: only confirm after the caller says yes and the system confirms the booking.
EXAMPLE: "Thank you for calling. I'm the AI assistant, how can I help?"
SAFETY: escalate to a human if the request is outside your authority, sensitive or uncertain.$p$
WHERE agent_type = 'voz' AND business_id IS NULL;

INSERT INTO public.ai_agents (name, agent_type, description, system_prompt, ai_model, is_active, created_by, icon, color, requires_authorization)
SELECT 'Design Agent', 'diseno', 'Brand-aligned visual concepts, promotional copy and templates.',
 'You are the Design Agent. Propose brand-aligned visual concepts, layouts and promotional copy. Ask for brand colors, audience and channel first. Never publish anything without explicit authorization.',
 'google/gemini-3.8-flash', true, created_by, 'bot', '#8B3A4A', true
FROM public.ai_agents WHERE business_id IS NULL LIMIT 1;
