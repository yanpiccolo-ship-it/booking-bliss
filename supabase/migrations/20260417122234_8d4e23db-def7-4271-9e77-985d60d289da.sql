
-- Re-define functions with fixed search_path (already had it but reinforce)
CREATE OR REPLACE FUNCTION public.flowcore_create_reservation(
  p_business_id UUID, p_service_id UUID, p_requested_date DATE, p_requested_time TIME,
  p_party_size INT DEFAULT 1, p_customer_id UUID DEFAULT NULL,
  p_customer_name TEXT DEFAULT NULL, p_customer_email TEXT DEFAULT NULL,
  p_customer_phone TEXT DEFAULT NULL, p_source TEXT DEFAULT 'web', p_notes TEXT DEFAULT NULL
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_resource_id UUID; v_duration INT; v_end_time TIME; v_reservation_id UUID;
BEGIN
  SELECT duration_minutes INTO v_duration FROM public.services WHERE id = p_service_id;
  IF v_duration IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'service_not_found'); END IF;
  v_end_time := p_requested_time + (v_duration || ' minutes')::INTERVAL;
  v_resource_id := public.assign_best_resource(p_business_id, p_service_id, p_requested_date, p_requested_time, p_party_size);
  IF v_resource_id IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'no_availability'); END IF;
  INSERT INTO public.reservations (business_id, service_id, resource_id, reservation_date, reservation_time,
    customer_id, customer_name, customer_email, customer_phone, party_size, status, source, notes)
  VALUES (p_business_id, p_service_id, v_resource_id, p_requested_date, p_requested_time,
    p_customer_id, p_customer_name, p_customer_email, p_customer_phone, p_party_size, 'confirmed', p_source, p_notes)
  RETURNING id INTO v_reservation_id;
  RETURN jsonb_build_object('success', true, 'reservation_id', v_reservation_id, 'resource_id', v_resource_id, 'end_time', v_end_time);
END; $$;

-- Tighten the open INSERT policies
DROP POLICY IF EXISTS "customers_create_waitlist" ON public.waitlists;
CREATE POLICY "customers_create_waitlist" ON public.waitlists FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.is_active = true)
    AND (customer_email IS NOT NULL OR customer_name IS NOT NULL)
  );

DROP POLICY IF EXISTS "customers_create_orders" ON public.orders;
CREATE POLICY "customers_create_orders" ON public.orders FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.is_active = true)
    AND (customer_email IS NOT NULL OR customer_name IS NOT NULL OR customer_id IS NOT NULL)
  );

DROP POLICY IF EXISTS "customers_insert_items" ON public.order_items;
CREATE POLICY "customers_insert_items" ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.business_id = order_items.business_id)
  );
