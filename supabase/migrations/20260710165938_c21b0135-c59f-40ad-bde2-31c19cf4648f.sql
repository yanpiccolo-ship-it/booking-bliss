
-- 1) Tighten always-true INSERT policies
DROP POLICY IF EXISTS "Create conversations" ON public.conversations;
CREATE POLICY "Create conversations" ON public.conversations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Create conversation messages" ON public.conversation_messages;
CREATE POLICY "Create conversation messages" ON public.conversation_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
    )
  );

DROP POLICY IF EXISTS "Auth users create reviews" ON public.reviews;
CREATE POLICY "Auth users create reviews" ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- 2) Fix mutable search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 3) Revoke public/anon/authenticated EXECUTE on internal SECURITY DEFINER helpers.
--    These are called from RLS policies (which run with elevated context) and from
--    edge functions (service_role). They must NOT be callable via the public REST API.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_admin_or_owns_business(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_business_owner() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.owns_business(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.assign_best_resource(uuid, uuid, date, time, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_resource_availability(uuid, date, time, time) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_customer_score() FROM PUBLIC, anon, authenticated;

-- Keep flowcore_create_reservation callable (public widget / microsite booking flow),
-- but drop anon to signed-in only for now to reduce abuse surface.
REVOKE EXECUTE ON FUNCTION public.flowcore_create_reservation(uuid, uuid, date, time, integer, uuid, text, text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.flowcore_create_reservation(uuid, uuid, date, time, integer, uuid, text, text, text, text, text) TO authenticated, service_role;
