import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CONTENT_TYPES, OBJECTIVES, FORMATS } from "@/lib/roteiriza-constants";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/_app/criar")({
  component: CriarPage,
});

function CriarPage() {
  const { user } = useSession();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [type, setType] = useState<string>("");
  const [objective, setObjective] = useState<string>("");
  const [format, setFormat] = useState<string>("");
  const [creating, setCreating] = useState(false);

  const isStories = type === "stories";

  async function handleGenerate() {
    if (!user) return;
    setCreating(true);
    try {
      const { data, error } = await supabase
        .from("conversations")
        .insert({
          user_id: user.id,
          content_type: type,
          objective: isStories ? "estrategia" : objective,
          format,
        })
        .select("id")
        .single();
      if (error) throw error;
      navigate({ to: "/chat/$id", params: { id: data.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao iniciar.");
    } finally {
      setCreating(false);
    }
  }

  function next() {
    if (step === 0 && isStories) setStep(2);
    else setStep((s) => s + 1);
  }
  function back() {
    if (step === 2 && isStories) setStep(0);
    else setStep((s) => Math.max(0, s - 1));
  }

  const formats = FORMATS[type] ?? [];

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Criar</div>
            <h1 className="editorial-title text-2xl">O que vamos criar hoje?</h1>
          </div>
          <div className="hidden text-xs text-muted-foreground md:block">
            Etapa {step + 1} de 3
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        {step === 0 && (
          <StepGrid>
            {CONTENT_TYPES.map((t) => (
              <ChoiceCard
                key={t.id}
                active={type === t.id}
                title={t.label}
                desc={t.desc}
                onClick={() => setType(t.id)}
              />
            ))}
          </StepGrid>
        )}

        {step === 1 && !isStories && (
          <>
            <StepTitle title="Qual o objetivo?" sub="Isso muda o gancho, a linguagem e o CTA." />
            <StepGrid>
              {OBJECTIVES.map((o) => (
                <ChoiceCard
                  key={o.id}
                  active={objective === o.id}
                  title={o.label}
                  desc={o.desc}
                  onClick={() => setObjective(o.id)}
                />
              ))}
            </StepGrid>
          </>
        )}

        {step === 2 && (
          <>
            <StepTitle title="Qual o formato?" sub="Escolha o esqueleto do seu roteiro." />
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={cn(
                    "rounded-xl border bg-card p-4 text-left text-sm transition-all shadow-soft hover:shadow-editorial hover:-translate-y-0.5",
                    format === f.id && "border-violet ring-2 ring-violet/30",
                  )}
                >
                  <div className="editorial-title text-base">{f.label}</div>
                  {f.desc && <div className="mt-1 text-xs text-muted-foreground">{f.desc}</div>}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mt-12 flex items-center justify-between">
          <Button variant="ghost" onClick={back} disabled={step === 0}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
          </Button>
          {step < 2 ? (
            <Button
              className="rounded-full"
              onClick={next}
              disabled={(step === 0 && !type) || (step === 1 && !objective)}
            >
              Continuar <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="lg"
              className="rounded-full bg-violet text-violet-foreground hover:bg-violet/90"
              onClick={handleGenerate}
              disabled={!format || creating}
            >
              {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Gerar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div>
      <h2 className="editorial-title text-3xl">{title}</h2>
      {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}

function StepGrid({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">{children}</div>;
}

function ChoiceCard({
  active,
  title,
  desc,
  onClick,
}: {
  active: boolean;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group rounded-2xl border bg-card p-6 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-editorial",
        active && "border-violet ring-2 ring-violet/30",
      )}
    >
      <div className="editorial-title text-xl">{title}</div>
      <div className="mt-2 text-sm text-muted-foreground">{desc}</div>
    </button>
  );
}
