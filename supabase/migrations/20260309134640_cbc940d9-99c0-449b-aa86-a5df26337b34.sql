-- Add slug and micro-site fields to businesses
ALTER TABLE public.businesses 
  ADD COLUMN IF NOT EXISTS slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS gallery_urls jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS theme_color text DEFAULT '#10b981';

-- Create reviews table for testimonials
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text,
  rating integer NOT NULL DEFAULT 5 CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_visible boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view visible reviews
CREATE POLICY "Anyone can view visible reviews" ON public.reviews
  FOR SELECT USING (is_visible = true OR is_admin_or_owns_business(business_id));

-- Business owners can manage reviews  
CREATE POLICY "Owners manage reviews" ON public.reviews
  FOR ALL USING (is_admin_or_owns_business(business_id));

-- Authenticated users can create reviews
CREATE POLICY "Auth users create reviews" ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Allow public to view active businesses for micro-site
CREATE POLICY "Public can view active businesses" ON public.businesses
  FOR SELECT USING (is_active = true);