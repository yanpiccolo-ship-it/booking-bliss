-- =============================================
-- BOOKING INTELLIGENCE - DATABASE SCHEMA
-- Multi-tenant SaaS with RLS Security
-- =============================================

-- 1. Create ENUM for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'business_owner', 'end_customer');

-- 2. Create ENUM for reservation status
CREATE TYPE public.reservation_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'no_show');

-- 3. Create ENUM for membership tiers
CREATE TYPE public.membership_tier AS ENUM ('basico', 'avanzado', 'personalizado');

-- 4. Create ENUM for business verticals
CREATE TYPE public.business_vertical AS ENUM (
  'hospitality', 'gastronomia', 'travel', 'experiencias', 'espacios_culturales',
  'servicios_profesionales', 'restaurante', 'hotel', 'hostel', 'retiro',
  'workshop', 'coworking', 'coaching', 'terapias_alternativas', 'gym',
  'yoga', 'pilates', 'tour', 'clases_particulares', 'personal_shopper',
  'veterinaria', 'estetica', 'peluqueria', 'peluqueria_canina', 'spa', 'clinica'
);

-- =============================================
-- USER ROLES TABLE (Required for RLS)
-- =============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'end_customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- SECURITY DEFINER FUNCTIONS (Prevent RLS recursion)
-- =============================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Check if current user is business owner
CREATE OR REPLACE FUNCTION public.is_business_owner()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'business_owner')
$$;

-- =============================================
-- MEMBERSHIPS TABLE (Subscription tiers)
-- =============================================
CREATE TABLE public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tier membership_tier NOT NULL UNIQUE,
  price_cents INTEGER NOT NULL, -- Price in cents (€1500 = 150000)
  monthly_fee_cents INTEGER NOT NULL DEFAULT 9900, -- €99/month
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  max_rubros INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- Insert default membership tiers
INSERT INTO public.memberships (name, tier, price_cents, features, max_rubros, description) VALUES
  ('Básico', 'basico', 150000, '["1 rubro", "Soporte WhatsApp", "Panel básico", "Agente AI básico"]'::jsonb, 1, 'Plan inicial para negocios pequeños'),
  ('Avanzado', 'avanzado', 250000, '["Rubros múltiples", "Menú digital", "PDFs", "QR", "Programación", "Stock/Proveedores", "Multi-idioma", "Backend sofisticado"]'::jsonb, 5, 'Plan completo con todas las funcionalidades'),
  ('Personalizado', 'personalizado', 300000, '["Escalable", "Módulos ilimitados", "Automatización total", "AI avanzado", "Soporte prioritario"]'::jsonb, -1, 'Plan enterprise personalizado');

-- =============================================
-- BUSINESSES TABLE (Client businesses)
-- =============================================
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  vertical business_vertical NOT NULL,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'ES',
  contact_email TEXT,
  contact_phone TEXT,
  contact_whatsapp TEXT,
  logo_url TEXT,
  language TEXT DEFAULT 'es',
  timezone TEXT DEFAULT 'Europe/Madrid',
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- =============================================
-- BUSINESS MEMBERSHIPS (Subscription tracking)
-- =============================================
CREATE TABLE public.business_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  membership_id UUID REFERENCES public.memberships(id) ON DELETE RESTRICT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'pending', -- pending, active, cancelled, past_due
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(business_id)
);

ALTER TABLE public.business_memberships ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROFILES TABLE (Extended user info)
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  language TEXT DEFAULT 'es',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- SERVICES/ACTIVITIES TABLE
-- =============================================
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price_cents INTEGER NOT NULL DEFAULT 0,
  capacity INTEGER NOT NULL DEFAULT 1,
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  category TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RESERVATIONS TABLE
-- =============================================
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  status reservation_status DEFAULT 'pending',
  notes TEXT,
  stripe_payment_id TEXT,
  amount_paid_cents INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- =============================================
-- CONVERSATIONS TABLE (AI Sales Bot)
-- =============================================
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  lead_name TEXT,
  lead_email TEXT,
  lead_phone TEXT,
  lead_business_name TEXT,
  lead_vertical business_vertical,
  status TEXT DEFAULT 'active', -- active, converted, abandoned
  language TEXT DEFAULT 'es',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- =============================================
-- CONVERSATION MESSAGES TABLE
-- =============================================
CREATE TABLE public.conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HELPER FUNCTIONS FOR RLS
-- =============================================

-- Check if user owns a specific business
CREATE OR REPLACE FUNCTION public.owns_business(_business_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.businesses
    WHERE id = _business_id AND owner_id = auth.uid()
  )
$$;

-- Check if user is admin or owns business
CREATE OR REPLACE FUNCTION public.is_admin_or_owns_business(_business_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin() OR public.owns_business(_business_id)
$$;

-- =============================================
-- RLS POLICIES
-- =============================================

-- USER_ROLES policies
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.is_admin());

-- MEMBERSHIPS policies (public read, admin write)
CREATE POLICY "Anyone can view memberships" ON public.memberships
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage memberships" ON public.memberships
  FOR ALL USING (public.is_admin());

-- BUSINESSES policies
CREATE POLICY "Users can view own business" ON public.businesses
  FOR SELECT USING (owner_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can create own business" ON public.businesses
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own business" ON public.businesses
  FOR UPDATE USING (owner_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins can delete businesses" ON public.businesses
  FOR DELETE USING (public.is_admin());

-- BUSINESS_MEMBERSHIPS policies
CREATE POLICY "View own business membership" ON public.business_memberships
  FOR SELECT USING (public.is_admin_or_owns_business(business_id));

CREATE POLICY "Create own business membership" ON public.business_memberships
  FOR INSERT WITH CHECK (public.is_admin_or_owns_business(business_id));

CREATE POLICY "Update own business membership" ON public.business_memberships
  FOR UPDATE USING (public.is_admin_or_owns_business(business_id));

CREATE POLICY "Admin can delete memberships" ON public.business_memberships
  FOR DELETE USING (public.is_admin());

-- PROFILES policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- SERVICES policies
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (is_active = true OR public.is_admin_or_owns_business(business_id));

CREATE POLICY "Business owners can manage services" ON public.services
  FOR INSERT WITH CHECK (public.is_admin_or_owns_business(business_id));

CREATE POLICY "Business owners can update services" ON public.services
  FOR UPDATE USING (public.is_admin_or_owns_business(business_id));

CREATE POLICY "Business owners can delete services" ON public.services
  FOR DELETE USING (public.is_admin_or_owns_business(business_id));

-- RESERVATIONS policies
CREATE POLICY "View own reservations" ON public.reservations
  FOR SELECT USING (
    customer_id = auth.uid() 
    OR public.is_admin_or_owns_business(business_id)
  );

CREATE POLICY "Create reservations" ON public.reservations
  FOR INSERT WITH CHECK (
    customer_id = auth.uid() 
    OR customer_id IS NULL -- Allow guest bookings
    OR public.is_admin_or_owns_business(business_id)
  );

CREATE POLICY "Update reservations" ON public.reservations
  FOR UPDATE USING (
    customer_id = auth.uid() 
    OR public.is_admin_or_owns_business(business_id)
  );

CREATE POLICY "Delete reservations" ON public.reservations
  FOR DELETE USING (
    customer_id = auth.uid() 
    OR public.is_admin_or_owns_business(business_id)
  );

-- CONVERSATIONS policies (Admin and public for sales bot)
CREATE POLICY "View conversations" ON public.conversations
  FOR SELECT USING (
    public.is_admin() 
    OR (business_id IS NOT NULL AND public.owns_business(business_id))
  );

CREATE POLICY "Create conversations" ON public.conversations
  FOR INSERT WITH CHECK (true); -- Anyone can start a conversation with sales bot

CREATE POLICY "Update conversations" ON public.conversations
  FOR UPDATE USING (
    public.is_admin() 
    OR (business_id IS NOT NULL AND public.owns_business(business_id))
  );

-- CONVERSATION_MESSAGES policies
CREATE POLICY "View conversation messages" ON public.conversation_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (public.is_admin() OR (c.business_id IS NOT NULL AND public.owns_business(c.business_id)))
    )
    OR EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id AND c.session_id IS NOT NULL
    )
  );

CREATE POLICY "Create conversation messages" ON public.conversation_messages
  FOR INSERT WITH CHECK (true); -- Allow messages to be added to any conversation

-- =============================================
-- TRIGGERS FOR updated_at
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_memberships_updated_at
  BEFORE UPDATE ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_memberships_updated_at
  BEFORE UPDATE ON public.business_memberships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_businesses_owner_id ON public.businesses(owner_id);
CREATE INDEX idx_business_memberships_business_id ON public.business_memberships(business_id);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_business_id ON public.profiles(business_id);
CREATE INDEX idx_services_business_id ON public.services(business_id);
CREATE INDEX idx_reservations_business_id ON public.reservations(business_id);
CREATE INDEX idx_reservations_customer_id ON public.reservations(customer_id);
CREATE INDEX idx_reservations_service_id ON public.reservations(service_id);
CREATE INDEX idx_reservations_date ON public.reservations(reservation_date);
CREATE INDEX idx_conversations_business_id ON public.conversations(business_id);
CREATE INDEX idx_conversations_session_id ON public.conversations(session_id);
CREATE INDEX idx_conversation_messages_conversation_id ON public.conversation_messages(conversation_id);