-- Memória da IA: Auto-aprendizado (o que a IA aprende sobre o usuário)

CREATE TABLE public.ai_learnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL DEFAULT 'aprendizado' CHECK (kind IN ('aprendizado', 'preferencia', 'estilo')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_learnings TO authenticated;
GRANT ALL ON public.ai_learnings TO service_role;
ALTER TABLE public.ai_learnings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own learnings all" ON public.ai_learnings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX ai_learnings_user_idx ON public.ai_learnings(user_id, created_at DESC);
