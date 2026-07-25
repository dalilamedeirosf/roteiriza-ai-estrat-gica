import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { sprintGenerate } from "@/lib/ai.functions";
import { SPRINT_DAYS } from "@/lib/roteiriza-constants";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Check, Sparkles, Copy, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/_app/desafio")({
  component: DesafioPage,
});

function DesafioPage() {
  const { user } = useSession();
  const gen = useServerFn(sprintGenerate);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<number | null>(null);
  const [ideas, setIdeas] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("sprint_progress").select("day").eq("user_id", user.id);
      if (data) setDone(new Set(data.map((d) => d.day)));
    })();
  }, [user]);

  async function open(day: number) {
    if (busy) return;
    setSelected(day);
    setIdeas(null);
    setBusy(true);
    try {
      const res = await gen({ data: { day } });
      setIdeas(res.ideas);
      setDone((s) => new Set(s).add(day));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao gerar o dia.");
    } finally {
      setBusy(false);
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Ideias copiadas!");
    } catch {
      toast.error("Não consegui copiar.");
    }
  }

  const pct = (done.size / SPRINT_DAYS.length) * 100;
  const sel = SPRINT_DAYS.find((x) => x.day === selected);

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-violet">
            <Zap className="h-3.5 w-3.5" /> Content Sprint · 15 dias
          </div>
          <h1 className="editorial-title mt-1 text-2xl">Desafio Sprint</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            3 ideias de conteúdo por dia, personalizadas pro seu perfil — pra crescer com consistência.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Progress value={pct} className="h-1.5 flex-1" />
            <span className="shrink-0 text-xs text-muted-foreground">
              {done.size}/{SPRINT_DAYS.length} concluídos
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {SPRINT_DAYS.map((d) => {
            const isDone = done.has(d.day);
            const isSel = selected === d.day;
            return (
              <button
                key={d.day}
                onClick={() => open(d.day)}
                className={cn(
                  "rounded-2xl border bg-card p-4 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-editorial",
                  isSel && "border-violet ring-2 ring-violet/30",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="editorial-title text-xl">{String(d.day).padStart(2, "0")}</span>
                  {isDone && <Check className="h-4 w-4 text-violet" />}
                </div>
                <div className="mt-2 text-sm font-medium leading-tight">{d.title}</div>
                <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">{d.objective}</div>
              </button>
            );
          })}
        </div>

        {sel && (
          <section className="mt-8 rounded-2xl border bg-card p-6 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-violet">Dia {sel.day}</div>
                <h2 className="editorial-title text-xl">{sel.title}</h2>
              </div>
              {ideas && (
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => copy(ideas)}>
                  <Copy className="mr-1 h-3.5 w-3.5" /> Copiar
                </Button>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{sel.focus}</p>
            <div className="mt-4">
              {busy ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 animate-pulse text-violet" /> Gerando suas 3 ideias…
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{ideas}</div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
