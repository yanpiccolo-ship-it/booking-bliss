-- RLS policies call these helpers; callers must be able to execute them.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_business_owner() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.owns_business(uuid) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_admin_or_owns_business(uuid) TO authenticated, anon;