import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Logo } from "@/components/roteiriza/logo";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2, Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/briefing")({
  component: BriefingPage,
});

type BriefingState = {
  handle: string;
  niche: string;
  subniche: string;
  about: string;
  audience_who: string;
  audience_pains: string;
  audience_desires: string;
  differential: string;
  tone_of_voice: string;
  story: string;
  results: string;
  offer: string;
};

const EMPTY: BriefingState = {
  handle: "",
  niche: "",
  subniche: "",
  about: "",
  audience_who: "",
  audience_pains: "",
  audience_desires: "",
  differential: "",
  tone_of_voice: "",
  story: "",
  results: "",
  offer: "",
};

const STEPS = [
  { key: "nicho", title: "Nicho", desc: "Onde você joga.", fields: ["handle", "niche", "subniche", "about"] as const },
  { key: "publico", title: "Público", desc: "Pra quem você fala.", fields: ["audience_who", "audience_pains", "audience_desires"] as const },
  { key: "posicionamento", title: "Posicionamento", desc: "Como você entrega.", fields: ["differential", "tone_of_voice"] as const },
  { key: "autoridade", title: "Autoridade", desc: "Por que confiar em você.", fields: ["story", "results", "offer"] as const },
];

function scoreDim(fields: readonly (keyof BriefingState)[], state: BriefingState) {
  const filled = fields.filter((f) => state[f].trim().length > 10).length;
  return Math.round((filled / fields.length) * 100);
}

function BriefingPage() {
  const navigate = useNavigate();
  const { user } = useSession();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<BriefingState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("briefings").select("*").eq("user_id", user.id).maybeSingle();
      if (data) {
        setState({
          handle: data.handle ?? "",
          niche: data.niche ?? "",
          subniche: data.subniche ?? "",
          about: data.about ?? "",
          audience_who: data.audience_who ?? "",
          audience_pains: data.audience_pains ?? "",
          audience_desires: data.audience_desires ?? "",
          differential: data.differential ?? "",
          tone_of_voice: data.tone_of_voice ?? "",
          story: data.story ?? "",
          results: data.results ?? "",
          offer: data.offer ?? "",
        });
      }
      setLoading(false);
    })();
  }, [user]);

  const scores = STEPS.map((s) => scoreDim(s.fields, state));
  const totalScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const stepProgress = ((step + 1) / STEPS.length) * 100;

  function setField(k: keyof BriefingState, v: string) {
    setState((s) => ({ ...s, [k]: v }));
  }

  async function save(complete: boolean) {
    if (!user) return;
    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        ...state,
        score: totalScore,
        score_nicho: scores[0],
        score_publico: scores[1],
        score_posicionamento: scores[2],
        score_autoridade: scores[3],
        completed: complete,
      };
      const { error } = await supabase.from("briefings").upsert(payload, { onConflict: "user_id" });
      if (error) throw error;
      if (complete) {
        toast.success("Briefing salvo. Bora criar!");
        navigate({ to: "/criar" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const cur = STEPS[step];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Nota do Briefing</span>
            <div className="editorial-title text-xl text-violet">{totalScore}<span className="text-sm text-muted-foreground">/100</span></div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <Progress value={stepProgress} className="h-1" />
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Etapa {step + 1} de {STEPS.length}</span>
            <span>{STEPS.map((s, i) => (i <= step ? s.title : null)).filter(Boolean).join(" · ")}</span>
          </div>
        </div>

        <h1 className="editorial-title text-4xl">{cur.title}</h1>
        <p className="mt-2 text-muted-foreground">{cur.desc}</p>

        <div className="mt-8 space-y-5">
          {step === 0 && (
            <>
              <Field label="@ do Instagram" value={state.handle} onChange={(v) => setField("handle", v)} placeholder="@seuperfil" />
              <Field label="Nicho" value={state.niche} onChange={(v) => setField("niche", v)} placeholder="Ex.: Finanças pessoais" />
              <Field label="Subnicho" value={state.subniche} onChange={(v) => setField("subniche", v)} placeholder="Ex.: Investimentos para iniciantes" />
              <FieldTA label="Sobre você" value={state.about} onChange={(v) => setField("about", v)} placeholder="Como você se apresenta hoje?" />
            </>
          )}
          {step === 1 && (
            <>
              <FieldTA label="Quem é o seu público" value={state.audience_who} onChange={(v) => setField("audience_who", v)} placeholder="Idade, momento de vida, contexto..." />
              <FieldTA label="Dores" value={state.audience_pains} onChange={(v) => setField("audience_pains", v)} placeholder="O que tira o sono dessa pessoa?" />
              <FieldTA label="Desejos" value={state.audience_desires} onChange={(v) => setField("audience_desires", v)} placeholder="O que ela sonha em conquistar?" />
            </>
          )}
          {step === 2 && (
            <>
              <FieldTA label="Diferencial" value={state.differential} onChange={(v) => setField("differential", v)} placeholder="Por que você e não outro criador?" />
              <FieldTA label="Tom de voz" value={state.tone_of_voice} onChange={(v) => setField("tone_of_voice", v)} placeholder="Ex.: direto, provocador, acolhedor, técnico..." />
            </>
          )}
          {step === 3 && (
            <>
              <FieldTA label="Sua história" value={state.story} onChange={(v) => setField("story", v)} placeholder="De onde você veio até chegar aqui." />
              <FieldTA label="Resultados & prova" value={state.results} onChange={(v) => setField("results", v)} placeholder="Números, cases, transformações." />
              <FieldTA label="Oferta / produto" value={state.offer} onChange={(v) => setField("offer", v)} placeholder="O que você vende ou vai vender?" />
            </>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              className="rounded-full"
              onClick={async () => {
                await save(false);
                setStep((s) => s + 1);
              }}
              disabled={saving}
            >
              Continuar <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button className="rounded-full" onClick={() => save(true)} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-1 h-4 w-4" />}
              Finalizar briefing
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function FieldTA({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={4} />
    </div>
  );
}
