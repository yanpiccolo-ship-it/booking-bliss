
-- ============================================================
-- FLOWCORE ENGINE — Resource Types, Resources, Availability
-- ============================================================

-- 1. RESOURCE TYPES (mesa, habitación, sala, staff, equipo)
CREATE TABLE IF NOT EXISTS public.resource_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  capacity INT DEFAULT 1,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.resource_types ENABLE ROW LEVEL SECURITY;

-- 2. RESOURCES (instances: Mesa 1, Room 101, Staff Maria)
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  resource_type_id UUID NOT NULL REFERENCES public.resource_types(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  capacity INT DEFAULT 1,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- 3. AVAILABILITY RULES (recurring schedules)
CREATE TABLE IF NOT EXISTS public.availability_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  buffer_before INT DEFAULT 0,
  buffer_after INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;

-- 4. RESOURCE EXCEPTIONS (holidays, closures, special hours)
CREATE TABLE IF NOT EXISTS public.resource_exceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  exception_date DATE NOT NULL,
  is_closed BOOLEAN DEFAULT true,
  alt_start_time TIME,
  alt_end_time TIME,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.resource_exceptions ENABLE ROW LEVEL SECURITY;

-- 5. Link services to resource_types
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS resource_type_id UUID REFERENCES public.resource_types(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS buffer_before INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS buffer_after INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS capacity_required INT DEFAULT 1;

-- 6. check_availability function
CREATE OR REPLACE FUNCTION public.check_resource_availability(
  p_resource_id UUID,
  p_date DATE,
  p_start_time TIME,
  p_end_time TIME
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_dow INT;
  v_has_rule BOOLEAN;
  v_is_exception BOOLEAN;
  v_exception_closed BOOLEAN;
  v_conflict_count INT;
BEGIN
  v_dow := EXTRACT(DOW FROM p_date)::INT;

  -- Check exceptions first
  SELECT is_closed INTO v_exception_closed
  FROM resource_exceptions
  WHERE resource_id = p_resource_id AND exception_date = p_date
  LIMIT 1;

  IF v_exception_closed IS NOT NULL AND v_exception_closed = true THEN
    RETURN false;
  END IF;

  -- Check availability rules
  SELECT EXISTS(
    SELECT 1 FROM availability_rules
    WHERE resource_id = p_resource_id
      AND day_of_week = v_dow
      AND is_active = true
      AND start_time <= p_start_time
      AND end_time >= p_end_time
  ) INTO v_has_rule;

  IF NOT v_has_rule THEN
    RETURN false;
  END IF;

  -- Check existing reservations for conflicts
  SELECT COUNT(*) INTO v_conflict_count
  FROM reservations r
  WHERE r.resource_id = p_resource_id
    AND r.reservation_date = p_date
    AND r.status IN ('pending', 'confirmed')
    AND (
      (r.reservation_time, r.reservation_time + (
        COALESCE((SELECT duration_minutes FROM services WHERE id = r.service_id), 60) || ' minutes'
      )::INTERVAL)
      OVERLAPS
      (p_start_time, p_end_time)
    );

  RETURN v_conflict_count = 0;
END;
$$;

-- 7. assign_resource function (finds best resource for a booking)
CREATE OR REPLACE FUNCTION public.assign_best_resource(
  p_business_id UUID,
  p_service_id UUID,
  p_date DATE,
  p_start_time TIME,
  p_party_size INT DEFAULT 1
)
RETURNS UUID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_resource_type_id UUID;
  v_duration INT;
  v_end_time TIME;
  v_resource_id UUID;
BEGIN
  -- Get service requirements
  SELECT resource_type_id, duration_minutes
  INTO v_resource_type_id, v_duration
  FROM services WHERE id = p_service_id;

  IF v_resource_type_id IS NULL THEN
    RETURN NULL;
  END IF;

  v_end_time := p_start_time + (v_duration || ' minutes')::INTERVAL;

  -- Find best available resource (smallest capacity that fits)
  SELECT r.id INTO v_resource_id
  FROM resources r
  WHERE r.business_id = p_business_id
    AND r.resource_type_id = v_resource_type_id
    AND r.capacity >= p_party_size
    AND r.status = 'active'
    AND check_resource_availability(r.id, p_date, p_start_time, v_end_time) = true
  ORDER BY r.capacity ASC
  LIMIT 1;

  RETURN v_resource_id;
END;
$$;

-- 8. RLS Policies
CREATE POLICY "owners_manage_resource_types" ON public.resource_types
  FOR ALL USING (public.is_admin_or_owns_business(business_id))
  WITH CHECK (public.is_admin_or_owns_business(business_id));

CREATE POLICY "public_view_resource_types" ON public.resource_types
  FOR SELECT USING (true);

CREATE POLICY "owners_manage_resources" ON public.resources
  FOR ALL USING (public.is_admin_or_owns_business(business_id))
  WITH CHECK (public.is_admin_or_owns_business(business_id));

CREATE POLICY "public_view_active_resources" ON public.resources
  FOR SELECT USING (status = 'active');

CREATE POLICY "owners_manage_availability_rules" ON public.availability_rules
  FOR ALL USING (public.is_admin_or_owns_business(business_id))
  WITH CHECK (public.is_admin_or_owns_business(business_id));

CREATE POLICY "public_view_availability_rules" ON public.availability_rules
  FOR SELECT USING (is_active = true);

CREATE POLICY "owners_manage_resource_exceptions" ON public.resource_exceptions
  FOR ALL USING (public.is_admin_or_owns_business(business_id))
  WITH CHECK (public.is_admin_or_owns_business(business_id));

CREATE POLICY "public_view_resource_exceptions" ON public.resource_exceptions
  FOR SELECT USING (true);

-- 9. Triggers
CREATE TRIGGER trg_resource_types_updated_at
  BEFORE UPDATE ON public.resource_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Indexes
CREATE INDEX IF NOT EXISTS idx_resource_types_business ON public.resource_types(business_id);
CREATE INDEX IF NOT EXISTS idx_resources_business ON public.resources(business_id);
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources(resource_type_id);
CREATE INDEX IF NOT EXISTS idx_resources_status ON public.resources(status);
CREATE INDEX IF NOT EXISTS idx_availability_rules_resource ON public.availability_rules(resource_id);
CREATE INDEX IF NOT EXISTS idx_availability_rules_dow ON public.availability_rules(day_of_week);
CREATE INDEX IF NOT EXISTS idx_resource_exceptions_resource ON public.resource_exceptions(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_exceptions_date ON public.resource_exceptions(exception_date);
CREATE INDEX IF NOT EXISTS idx_services_resource_type ON public.services(resource_type_id);
