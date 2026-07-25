-- Desafio Content Sprint: progresso (dias concluídos) por usuário

CREATE TABLE public.sprint_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, day)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sprint_progress TO authenticated;
GRANT ALL ON public.sprint_progress TO service_role;
ALTER TABLE public.sprint_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own sprint all" ON public.sprint_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
