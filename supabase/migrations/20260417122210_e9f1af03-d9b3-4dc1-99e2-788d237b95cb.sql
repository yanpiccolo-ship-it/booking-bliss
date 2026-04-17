
-- ============================================================
-- FlowCore Engine — Hitos 4-9 (Consolidado)
-- ============================================================

-- =========== HITO 4: No-Show & Overbooking ===========
CREATE TABLE IF NOT EXISTS public.reservation_confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL,
  business_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | confirmed | no_response
  sent_at TIMESTAMPTZ DEFAULT now(),
  responded_at TIMESTAMPTZ,
  channel TEXT DEFAULT 'email', -- email | whatsapp | sms
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.reservation_confirmations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_confirmations" ON public.reservation_confirmations
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));

CREATE TABLE IF NOT EXISTS public.customer_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  customer_id UUID,
  customer_email TEXT,
  reliability_score NUMERIC NOT NULL DEFAULT 100,
  total_reservations INT DEFAULT 0,
  no_shows INT DEFAULT 0,
  cancellations INT DEFAULT 0,
  completed INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.customer_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_scores" ON public.customer_scores
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));

CREATE TABLE IF NOT EXISTS public.overbooking_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL UNIQUE,
  resource_type_id UUID,
  overbooking_percentage NUMERIC DEFAULT 0, -- e.g. 5 = 5%
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.overbooking_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_overbooking" ON public.overbooking_settings
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));

-- =========== HITO 5: Waitlist Engine ===========
CREATE TABLE IF NOT EXISTS public.waitlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  service_id UUID,
  customer_id UUID,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  requested_date DATE,
  requested_time TIME,
  party_size INT DEFAULT 1,
  priority INT DEFAULT 0,
  status TEXT DEFAULT 'waiting', -- waiting | notified | converted | expired
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.waitlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_waitlists" ON public.waitlists
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));
CREATE POLICY "customers_create_waitlist" ON public.waitlists
  FOR INSERT WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.waitlist_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  waitlist_id UUID NOT NULL,
  business_id UUID NOT NULL,
  channel TEXT DEFAULT 'email',
  sent_at TIMESTAMPTZ DEFAULT now(),
  responded BOOLEAN DEFAULT false,
  response_action TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);
ALTER TABLE public.waitlist_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_waitlist_notif" ON public.waitlist_notifications
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));

-- =========== HITO 6: Hospitality Commerce ===========
CREATE TABLE IF NOT EXISTS public.menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  valid_from DATE,
  valid_to DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_menus" ON public.menus
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));
CREATE POLICY "public_view_active_menus" ON public.menus
  FOR SELECT USING (is_active = true);

CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID NOT NULL,
  business_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INT NOT NULL DEFAULT 0,
  category TEXT,
  image_url TEXT,
  allergens JSONB DEFAULT '[]'::jsonb,
  is_available BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_menu_items" ON public.menu_items
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));
CREATE POLICY "public_view_available_items" ON public.menu_items
  FOR SELECT USING (is_available = true);

CREATE TABLE IF NOT EXISTS public.qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  code TEXT NOT NULL UNIQUE,
  type TEXT DEFAULT 'menu', -- menu | table | review
  target_id UUID,
  label TEXT,
  scans INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_qr" ON public.qr_codes
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));
CREATE POLICY "public_view_qr" ON public.qr_codes
  FOR SELECT USING (is_active = true);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  reservation_id UUID,
  customer_id UUID,
  customer_name TEXT,
  customer_email TEXT,
  table_number TEXT,
  status TEXT DEFAULT 'pending', -- pending | preparing | ready | delivered | paid | cancelled
  total_cents INT DEFAULT 0,
  payment_status TEXT DEFAULT 'unpaid',
  payment_id TEXT,
  notes TEXT,
  source TEXT DEFAULT 'qr',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_orders" ON public.orders
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));
CREATE POLICY "customers_create_orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  menu_item_id UUID,
  business_id UUID NOT NULL,
  name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price_cents INT NOT NULL DEFAULT 0,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_order_items" ON public.order_items
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));
CREATE POLICY "customers_insert_items" ON public.order_items
  FOR INSERT WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_suppliers" ON public.suppliers
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));

CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  supplier_id UUID,
  name TEXT NOT NULL,
  sku TEXT,
  unit TEXT DEFAULT 'unit',
  current_stock NUMERIC DEFAULT 0,
  min_stock NUMERIC DEFAULT 0,
  max_stock NUMERIC,
  unit_cost_cents INT DEFAULT 0,
  last_restock_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_inventory" ON public.inventory_items
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));

CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  supplier_id UUID NOT NULL,
  status TEXT DEFAULT 'draft', -- draft | sent | received | cancelled
  total_cents INT DEFAULT 0,
  ordered_at TIMESTAMPTZ,
  expected_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ,
  notes TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_po" ON public.purchase_orders
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));

-- =========== HITO 7: Smart Automation Engine ===========
CREATE TABLE IF NOT EXISTS public.automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  trigger_event TEXT NOT NULL, -- e.g. low_inventory | reservation_cancelled | no_show | new_reservation
  conditions JSONB DEFAULT '{}'::jsonb,
  actions JSONB DEFAULT '[]'::jsonb, -- e.g. [{type:'send_whatsapp',template:'...'}]
  is_active BOOLEAN DEFAULT true,
  last_executed_at TIMESTAMPTZ,
  execution_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_automation" ON public.automation_rules
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));

CREATE TABLE IF NOT EXISTS public.automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  rule_id UUID,
  trigger_event TEXT,
  payload JSONB,
  result TEXT, -- success | failed
  error_message TEXT,
  executed_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_view_automation_logs" ON public.automation_logs
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));

-- =========== HITO 8: KDS & Delivery ===========
CREATE TABLE IF NOT EXISTS public.kitchen_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT, -- grill | cold | bar | pastry
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.kitchen_stations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_stations" ON public.kitchen_stations
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));

CREATE TABLE IF NOT EXISTS public.kitchen_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  order_id UUID NOT NULL,
  station_id UUID,
  status TEXT DEFAULT 'queued', -- queued | preparing | ready | served
  priority INT DEFAULT 0,
  started_at TIMESTAMPTZ,
  ready_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.kitchen_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_kitchen_orders" ON public.kitchen_orders
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));

CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  vehicle TEXT,
  status TEXT DEFAULT 'available', -- available | on_route | offline
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_drivers" ON public.drivers
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));

CREATE TABLE IF NOT EXISTS public.delivery_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  order_id UUID NOT NULL,
  driver_id UUID,
  delivery_address TEXT,
  delivery_lat NUMERIC,
  delivery_lng NUMERIC,
  status TEXT DEFAULT 'pending', -- pending | assigned | picked_up | delivered | cancelled
  assigned_at TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  estimated_minutes INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.delivery_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_deliveries" ON public.delivery_orders
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));

-- =========== HITO 9: Analytics Intelligence ===========
CREATE TABLE IF NOT EXISTS public.dynamic_pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  service_id UUID,
  name TEXT,
  day_of_week INT,
  start_time TIME,
  end_time TIME,
  start_date DATE,
  end_date DATE,
  base_multiplier NUMERIC DEFAULT 1.0,
  event_multiplier NUMERIC DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.dynamic_pricing_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_pricing" ON public.dynamic_pricing_rules
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));

CREATE TABLE IF NOT EXISTS public.demand_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  service_id UUID,
  predicted_date DATE NOT NULL,
  predicted_demand INT,
  confidence_score NUMERIC,
  model_version TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.demand_predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_predictions" ON public.demand_predictions
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));

CREATE TABLE IF NOT EXISTS public.pricing_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  service_id UUID,
  adjustment_time TIMESTAMPTZ DEFAULT now(),
  old_price NUMERIC,
  new_price NUMERIC,
  applied_by TEXT DEFAULT 'system',
  reason TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);
ALTER TABLE public.pricing_adjustments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_adjustments" ON public.pricing_adjustments
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));

CREATE TABLE IF NOT EXISTS public.analytics_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  metric_type TEXT NOT NULL, -- occupancy | revenue | operation_time | conversion
  metric_value NUMERIC,
  dimensions JSONB DEFAULT '{}'::jsonb,
  recorded_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.analytics_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_analytics_logs" ON public.analytics_logs
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));

-- =========== HITO 6 (extra): seasonal_pricing for hotels ===========
CREATE TABLE IF NOT EXISTS public.seasonal_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  room_type_id UUID,
  name TEXT,
  start_date DATE,
  end_date DATE,
  price_per_night NUMERIC,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.seasonal_pricing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owners_manage_seasonal" ON public.seasonal_pricing
  FOR ALL USING (is_admin_or_owns_business(business_id))
  WITH CHECK (is_admin_or_owns_business(business_id));
CREATE POLICY "public_view_seasonal" ON public.seasonal_pricing
  FOR SELECT USING (is_active = true);

-- =========== Support tickets (24/7 support) ===========
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID,
  user_id UUID,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open', -- open | in_progress | resolved | closed
  priority TEXT DEFAULT 'normal', -- low | normal | high | critical
  category TEXT,
  assigned_to UUID,
  resolved_at TIMESTAMPTZ,
  satisfaction_score INT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_create_own_tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "users_view_own_tickets" ON public.support_tickets
  FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "admins_manage_tickets" ON public.support_tickets
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE TABLE IF NOT EXISTS public.support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL,
  sender_id UUID,
  sender_role TEXT, -- user | agent | bot
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ticket_owners_view_messages" ON public.support_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.support_tickets t
            WHERE t.id = ticket_id AND (t.user_id = auth.uid() OR is_admin()))
  );
CREATE POLICY "ticket_owners_create_messages" ON public.support_messages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.support_tickets t
            WHERE t.id = ticket_id AND (t.user_id = auth.uid() OR is_admin()))
  );

-- =========== FlowCore RPC: createReservation centralizado ===========
CREATE OR REPLACE FUNCTION public.flowcore_create_reservation(
  p_business_id UUID,
  p_service_id UUID,
  p_requested_date DATE,
  p_requested_time TIME,
  p_party_size INT DEFAULT 1,
  p_customer_id UUID DEFAULT NULL,
  p_customer_name TEXT DEFAULT NULL,
  p_customer_email TEXT DEFAULT NULL,
  p_customer_phone TEXT DEFAULT NULL,
  p_source TEXT DEFAULT 'web',
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_resource_id UUID;
  v_duration INT;
  v_end_time TIME;
  v_reservation_id UUID;
BEGIN
  SELECT duration_minutes INTO v_duration FROM services WHERE id = p_service_id;
  IF v_duration IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'service_not_found');
  END IF;

  v_end_time := p_requested_time + (v_duration || ' minutes')::INTERVAL;

  v_resource_id := assign_best_resource(
    p_business_id, p_service_id, p_requested_date, p_requested_time, p_party_size
  );

  IF v_resource_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'no_availability');
  END IF;

  INSERT INTO reservations (
    business_id, service_id, resource_id,
    reservation_date, reservation_time,
    customer_id, customer_name, customer_email, customer_phone,
    party_size, status, source, notes
  ) VALUES (
    p_business_id, p_service_id, v_resource_id,
    p_requested_date, p_requested_time,
    p_customer_id, p_customer_name, p_customer_email, p_customer_phone,
    p_party_size, 'confirmed', p_source, p_notes
  )
  RETURNING id INTO v_reservation_id;

  RETURN jsonb_build_object(
    'success', true,
    'reservation_id', v_reservation_id,
    'resource_id', v_resource_id,
    'end_time', v_end_time
  );
END;
$$;

-- =========== Helper: update customer_score after reservation status changes ===========
CREATE OR REPLACE FUNCTION public.update_customer_score()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_score_id UUID;
BEGIN
  IF NEW.customer_email IS NULL THEN RETURN NEW; END IF;
  IF OLD.status = NEW.status THEN RETURN NEW; END IF;

  SELECT id INTO v_score_id FROM customer_scores
   WHERE business_id = NEW.business_id AND customer_email = NEW.customer_email
   LIMIT 1;

  IF v_score_id IS NULL THEN
    INSERT INTO customer_scores (business_id, customer_id, customer_email, total_reservations)
    VALUES (NEW.business_id, NEW.customer_id, NEW.customer_email, 1)
    RETURNING id INTO v_score_id;
  END IF;

  IF NEW.status = 'no_show' THEN
    UPDATE customer_scores
       SET no_shows = no_shows + 1,
           reliability_score = GREATEST(0, reliability_score - 15),
           updated_at = now()
     WHERE id = v_score_id;
  ELSIF NEW.status = 'cancelled' THEN
    UPDATE customer_scores
       SET cancellations = cancellations + 1,
           reliability_score = GREATEST(0, reliability_score - 5),
           updated_at = now()
     WHERE id = v_score_id;
  ELSIF NEW.status = 'completed' THEN
    UPDATE customer_scores
       SET completed = completed + 1,
           reliability_score = LEAST(100, reliability_score + 2),
           updated_at = now()
     WHERE id = v_score_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_customer_score ON public.reservations;
CREATE TRIGGER trg_update_customer_score
AFTER UPDATE OF status ON public.reservations
FOR EACH ROW EXECUTE FUNCTION public.update_customer_score();

-- =========== Indexes for performance ===========
CREATE INDEX IF NOT EXISTS idx_orders_business_status ON public.orders(business_id, status);
CREATE INDEX IF NOT EXISTS idx_kitchen_orders_station ON public.kitchen_orders(station_id, status);
CREATE INDEX IF NOT EXISTS idx_waitlists_business_status ON public.waitlists(business_id, status);
CREATE INDEX IF NOT EXISTS idx_inventory_low_stock ON public.inventory_items(business_id) WHERE current_stock <= min_stock;
CREATE INDEX IF NOT EXISTS idx_analytics_logs_business_time ON public.analytics_logs(business_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status, created_at DESC);
