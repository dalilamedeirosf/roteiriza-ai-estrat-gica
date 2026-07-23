import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { analyzeProfile } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, ScanSearch, Copy, Trash2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/_app/analise-perfil")({
  component: AnalisePage,
});

type Analysis = { id: string; handle: string | null; result: string; created_at: string };

function AnalisePage() {
  const { user } = useSession();
  const analyze = useServerFn(analyzeProfile);
  const [form, setForm] = useState({ handle: "", strategic_name: "", bio: "", highlights: "", content: "" });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [saved, setSaved] = useState<Analysis[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profile_analyses")
        .select("id, handle, result, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setSaved((data ?? []) as Analysis[]);
    })();
  }, [user]);

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function run() {
    if (!form.content.trim()) {
      toast.error("Cole a bio, os posts recentes e as métricas do perfil.");
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      const res = await analyze({
        data: {
          handle: form.handle.trim() || undefined,
          strategic_name: form.strategic_name.trim() || undefined,
          bio: form.bio.trim() || undefined,
          highlights: form.highlights.trim() || undefined,
          content: form.content.trim(),
        },
      });
      setResult(res.analysis);
      if (res.id) {
        setSaved((s) => [{ id: res.id as string, handle: res.handle, result: res.analysis, created_at: new Date().toISOString() }, ...s]);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao analisar.");
    } finally {
      setBusy(false);
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Análise copiada!");
    } catch {
      toast.error("Não consegui copiar.");
    }
  }

  async function del(id: string) {
    setSaved((s) => s.filter((a) => a.id !== id));
    await supabase.from("profile_analyses").delete().eq("id", id);
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Diagnóstico</div>
          <h1 className="editorial-title text-2xl">Análise de Perfil</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cole os dados de um perfil do Instagram e receba uma análise estratégica com recomendações.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-8 px-6 py-8">
        <section className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>@ do perfil</Label>
              <Input value={form.handle} onChange={(e) => set("handle", e.target.value)} placeholder="@nomedousuario" />
            </div>
            <div className="space-y-1.5">
              <Label>Nome estratégico</Label>
              <Input value={form.strategic_name} onChange={(e) => set("strategic_name", e.target.value)} placeholder="Ex.: Especialista em Pele Negra" />
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <Label>Biografia</Label>
            <Textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Cole aqui a bio completa do perfil…" rows={3} />
          </div>
          <div className="mt-4 space-y-1.5">
            <Label>Nomes dos destaques</Label>
            <Input value={form.highlights} onChange={(e) => set("highlights", e.target.value)} placeholder="Ex.: Antes/Depois, Cursos, Depoimentos" />
          </div>
          <div className="mt-4 space-y-1.5">
            <Label>
              Posts recentes e métricas <span className="text-muted-foreground">(obrigatório)</span>
            </Label>
            <Textarea
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder="Cole a descrição dos últimos posts, legendas, e métricas (seguidores, curtidas, comentários, alcance)…"
              rows={6}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={run} disabled={busy} className="rounded-full">
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanSearch className="mr-2 h-4 w-4" />}
              Analisar perfil
            </Button>
          </div>
        </section>

        {busy && (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 animate-pulse text-violet" />
            Analisando o perfil…
          </div>
        )}

        {result && (
          <section className="rounded-2xl border bg-card p-6 shadow-soft">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="editorial-title text-xl">Resultado da análise</h2>
              <Button variant="outline" size="sm" onClick={() => copy(result)} className="rounded-full">
                <Copy className="mr-1 h-3.5 w-3.5" /> Copiar
              </Button>
            </div>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{result}</div>
          </section>
        )}

        {saved.length > 0 && (
          <section>
            <h2 className="editorial-title mb-3 text-lg">Análises salvas</h2>
            <div className="space-y-2">
              {saved.map((a) => (
                <details key={a.id} className="rounded-xl border bg-card shadow-soft">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm">
                    <span className="editorial-title truncate">{a.handle || "Perfil analisado"}</span>
                    <span className="flex items-center gap-3 text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString("pt-BR")}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          del(a.id);
                        }}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        aria-label="Excluir análise"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </span>
                  </summary>
                  <div className="border-t px-4 py-3">
                    <div className="mb-2 flex justify-end">
                      <Button variant="ghost" size="sm" onClick={() => copy(a.result)}>
                        <Copy className="mr-1 h-3.5 w-3.5" /> Copiar
                      </Button>
                    </div>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{a.result}</div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
