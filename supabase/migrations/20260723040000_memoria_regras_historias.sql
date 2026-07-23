-- Memória da IA: Regras Manuais + Banco de Histórias

-- Regras Manuais (prioridade absoluta) — a IA é obrigada a seguir
CREATE TABLE public.ai_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_rules TO authenticated;
GRANT ALL ON public.ai_rules TO service_role;
ALTER TABLE public.ai_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own rules all" ON public.ai_rules FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX ai_rules_user_idx ON public.ai_rules(user_id, created_at DESC);

-- Banco de Histórias — histórias reais do usuário, usadas como matéria-prima
CREATE TABLE public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stories TO authenticated;
GRANT ALL ON public.stories TO service_role;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own stories all" ON public.stories FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX stories_user_idx ON public.stories(user_id, created_at DESC);
