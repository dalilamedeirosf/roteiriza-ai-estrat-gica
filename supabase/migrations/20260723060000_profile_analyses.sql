-- Análise de Perfil: histórico de análises geradas pela IA

CREATE TABLE public.profile_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  handle TEXT,
  input TEXT,
  result TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile_analyses TO authenticated;
GRANT ALL ON public.profile_analyses TO service_role;
ALTER TABLE public.profile_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own analyses all" ON public.profile_analyses FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX profile_analyses_user_idx ON public.profile_analyses(user_id, created_at DESC);
