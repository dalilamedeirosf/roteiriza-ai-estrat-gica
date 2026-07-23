import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Shield, BookOpen, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/_app/memoria")({
  component: MemoriaPage,
});

type Rule = { id: string; content: string; active: boolean };
type Story = { id: string; title: string | null; content: string };

function isMissingTable(msg?: string) {
  return !!msg && /relation|does not exist|schema cache|could not find the table/i.test(msg);
}

function MemoriaPage() {
  const { user } = useSession();
  const [rules, setRules] = useState<Rule[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [tablesMissing, setTablesMissing] = useState(false);
  const [newRule, setNewRule] = useState("");
  const [newStoryTitle, setNewStoryTitle] = useState("");
  const [newStory, setNewStory] = useState("");
  const [savingRule, setSavingRule] = useState(false);
  const [savingStory, setSavingStory] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: r, error: er } = await supabase
        .from("ai_rules")
        .select("id, content, active")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      const { data: s } = await supabase
        .from("stories")
        .select("id, title, content")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (isMissingTable(er?.message)) setTablesMissing(true);
      setRules((r ?? []) as Rule[]);
      setStories((s ?? []) as Story[]);
      setLoading(false);
    })();
  }, [user]);

  async function addRule() {
    if (!user || !newRule.trim()) return;
    setSavingRule(true);
    const { data, error } = await supabase
      .from("ai_rules")
      .insert({ user_id: user.id, content: newRule.trim() })
      .select("id, content, active")
      .single();
    setSavingRule(false);
    if (error) {
      if (isMissingTable(error.message)) setTablesMissing(true);
      toast.error(isMissingTable(error.message) ? "Tabelas da Memória ainda não criadas no banco." : error.message);
      return;
    }
    setRules((x) => [...x, data as Rule]);
    setNewRule("");
    toast.success("Regra adicionada.");
  }

  async function toggleRule(id: string, active: boolean) {
    setRules((x) => x.map((r) => (r.id === id ? { ...r, active } : r)));
    const { error } = await supabase.from("ai_rules").update({ active }).eq("id", id);
    if (error) toast.error("Não consegui atualizar a regra.");
  }

  async function delRule(id: string) {
    setRules((x) => x.filter((r) => r.id !== id));
    await supabase.from("ai_rules").delete().eq("id", id);
  }

  async function addStory() {
    if (!user || !newStory.trim()) return;
    setSavingStory(true);
    const { data, error } = await supabase
      .from("stories")
      .insert({ user_id: user.id, title: newStoryTitle.trim() || null, content: newStory.trim() })
      .select("id, title, content")
      .single();
    setSavingStory(false);
    if (error) {
      if (isMissingTable(error.message)) setTablesMissing(true);
      toast.error(isMissingTable(error.message) ? "Tabelas da Memória ainda não criadas no banco." : error.message);
      return;
    }
    setStories((x) => [data as Story, ...x]);
    setNewStory("");
    setNewStoryTitle("");
    toast.success("História adicionada.");
  }

  async function delStory(id: string) {
    setStories((x) => x.filter((s) => s.id !== id));
    await supabase.from("stories").delete().eq("id", id);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Personalização</div>
          <h1 className="editorial-title text-2xl">Memória da IA</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            O que a IA precisa respeitar e as histórias reais que ela usa como matéria-prima.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-8 px-6 py-8">
        {tablesMissing && (
          <div className="rounded-xl border border-violet/40 bg-violet-soft px-4 py-3 text-sm text-foreground">
            As tabelas da Memória ainda não existem no banco. Rode a migração
            <code className="mx-1 rounded bg-background/70 px-1">supabase/migrations/…_memoria_regras_historias.sql</code>
            no seu Supabase pra ativar esta área.
          </div>
        )}

        {/* Regras Manuais */}
        <section className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-violet" />
            <h2 className="editorial-title text-xl">Regras Manuais</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Prioridade absoluta — a IA é obrigada a seguir. Ex.: <em>“Nunca use a palavra ‘vender’; prefira ‘faturar’.”</em>
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Input
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addRule()}
              placeholder="Escreva uma regra que a IA deve sempre respeitar…"
            />
            <Button onClick={addRule} disabled={savingRule || !newRule.trim()} className="rounded-full sm:w-auto">
              {savingRule ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              <span className="ml-1">Adicionar</span>
            </Button>
          </div>

          <div className="mt-4 space-y-2">
            {rules.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma regra ainda.</p>}
            {rules.map((r) => (
              <div key={r.id} className="flex items-start gap-3 rounded-xl border bg-background p-3">
                <Switch checked={r.active} onCheckedChange={(v) => toggleRule(r.id, v)} className="mt-0.5" />
                <p className={"flex-1 text-sm " + (r.active ? "" : "text-muted-foreground line-through")}>{r.content}</p>
                <button onClick={() => delRule(r.id)} className="text-muted-foreground transition-colors hover:text-destructive" aria-label="Excluir regra">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Banco de Histórias */}
        <section className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-violet" />
            <h2 className="editorial-title text-xl">Banco de Histórias</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Histórias reais suas. A IA usa como matéria-prima pra deixar o conteúdo autêntico.
          </p>

          <div className="mt-4 space-y-2">
            <Input
              value={newStoryTitle}
              onChange={(e) => setNewStoryTitle(e.target.value)}
              placeholder="Título (opcional). Ex.: Meu começo difícil"
            />
            <Textarea
              value={newStory}
              onChange={(e) => setNewStory(e.target.value)}
              placeholder="Conte a história real, com detalhes concretos…"
              rows={4}
            />
            <div className="flex justify-end">
              <Button onClick={addStory} disabled={savingStory || !newStory.trim()} className="rounded-full">
                {savingStory ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Plus className="mr-1 h-4 w-4" />}
                Adicionar história
              </Button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {stories.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma história ainda.</p>}
            {stories.map((s) => (
              <div key={s.id} className="rounded-xl border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-violet">
                    <Sparkles className="h-3 w-3" />
                    {s.title || "História"}
                  </div>
                  <button onClick={() => delStory(s.id)} className="text-muted-foreground transition-colors hover:text-destructive" aria-label="Excluir história">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{s.content}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
