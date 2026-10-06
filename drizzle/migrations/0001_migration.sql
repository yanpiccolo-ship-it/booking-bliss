DROP POLICY IF EXISTS "Signed-in users can view memberships" ON public.memberships;
CREATE POLICY "Signed-in users can view membership plans" ON public.memberships
  FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);