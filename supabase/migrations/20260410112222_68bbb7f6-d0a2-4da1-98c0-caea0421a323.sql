
-- ============================================================
-- HITO 3 — Multi-Day Booking & Room Types
-- ============================================================

-- 1. ROOM TYPES table
CREATE TABLE IF NOT EXISTS public.room_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  capacity INT DEFAULT 1,
  base_price NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  amenities JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  check_in_time TIME DEFAULT '15:00',
  check_out_time TIME DEFAULT '11:00',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;

-- 2. New columns on reservations (compatible with existing schema)
ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS is_multi_day BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS check_in_date DATE,
  ADD COLUMN IF NOT EXISTS check_out_date DATE,
  ADD COLUMN IF NOT EXISTS nights_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS room_type_id UUID REFERENCES public.room_types(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS total_price NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS price_per_night NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS party_size INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS end_time TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS resource_id UUID;

-- 3. Trigger: auto-calculate nights_count and total_price, sync reservation_date/time
CREATE OR REPLACE FUNCTION public.sync_multiday_reservation()
RETURNS TRIGGER AS $$
DECLARE
  v_check_in_time TIME := '15:00';
BEGIN
  IF NEW.is_multi_day = true AND NEW.check_in_date IS NOT NULL AND NEW.check_out_date IS NOT NULL THEN
    IF NEW.check_out_date <= NEW.check_in_date THEN
      RAISE EXCEPTION 'check_out_date must be after check_in_date';
    END IF;
    NEW.nights_count := (NEW.check_out_date - NEW.check_in_date);
    IF NEW.price_per_night > 0 THEN
      NEW.total_price := NEW.price_per_night * NEW.nights_count;
    END IF;
    NEW.reservation_date := NEW.check_in_date;
    IF NEW.room_type_id IS NOT NULL THEN
      SELECT check_in_time INTO v_check_in_time
      FROM public.room_types WHERE id = NEW.room_type_id;
    END IF;
    NEW.reservation_time := COALESCE(v_check_in_time, '15:00');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_multiday ON public.reservations;
CREATE TRIGGER trg_sync_multiday
  BEFORE INSERT OR UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.sync_multiday_reservation();

-- 4. Updated_at trigger for room_types
DROP TRIGGER IF EXISTS trg_room_types_updated_at ON public.room_types;
CREATE TRIGGER trg_room_types_updated_at
  BEFORE UPDATE ON public.room_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. RLS Policies for room_types
CREATE POLICY "business_owners_manage_room_types" ON public.room_types
  FOR ALL
  USING (public.is_admin_or_owns_business(business_id))
  WITH CHECK (public.is_admin_or_owns_business(business_id));

CREATE POLICY "public_read_active_room_types" ON public.room_types
  FOR SELECT
  USING (is_active = true);

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_room_types_business_id ON public.room_types(business_id);
CREATE INDEX IF NOT EXISTS idx_room_types_active ON public.room_types(is_active);
CREATE INDEX IF NOT EXISTS idx_reservations_multi_day ON public.reservations(is_multi_day);
CREATE INDEX IF NOT EXISTS idx_reservations_check_in ON public.reservations(check_in_date);
CREATE INDEX IF NOT EXISTS idx_reservations_check_out ON public.reservations(check_out_date);
CREATE INDEX IF NOT EXISTS idx_reservations_room_type ON public.reservations(room_type_id);
