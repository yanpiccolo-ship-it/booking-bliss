CREATE TABLE public.business_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL,
  provider text NOT NULL CHECK (provider IN ('apify','notion','smtp')),
  config_ciphertext text NOT NULL,
  public_info jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (business_id, provider)
);
GRANT ALL ON public.business_integrations TO service_role;
ALTER TABLE public.business_integrations ENABLE ROW LEVEL SECURITY;