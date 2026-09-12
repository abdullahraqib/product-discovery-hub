ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_variants jsonb;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;