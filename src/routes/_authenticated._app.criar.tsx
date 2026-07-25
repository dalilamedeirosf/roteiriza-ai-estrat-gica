import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { toast } from "sonner";
import { CONTENT_TYPES, OBJECTIVES, FORMATS, labelOf } from "@/lib/roteiriza-constants";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sparkles,
  Film,
  GalleryHorizontalEnd,
  Smartphone,
  TrendingUp,
  Heart,
  ShoppingBag,
  Video,
  Captions,
  Mic,
  Layers,
  Drama,
  Coffee,
  Flame,
  AudioLines,
  BookOpen,
  Columns2,
  AlertTriangle,
  Scale,
  List,
  HeartHandshake,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/_app/criar")({
  component: CriarPage,
});

type Icon = typeof Sparkles;

const TYPE_ICON: Record<string, Icon> = {
  reels: Film,
  carrossel: GalleryHorizontalEnd,
  stories: Smartphone,
};
const OBJ_ICON: Record<string, Icon> = {
  crescimento: TrendingUp,
  engajamento: Heart,
  vendas: ShoppingBag,
};
const FMT_ICON: Record<string, Icon> = {
  "lo-fi": Video,
  "leia-legenda": Captions,
  "fala-dinamica": Mic,
  serie: Layers,
  sketch: Drama,
  rotina: Coffee,
  "pauta-quente": Flame,
  narrado: AudioLines,
  storytelling: BookOpen,
  dualidade: Columns2,
  "erro-comum": AlertTriangle,
  "jeito-certo-errado": Scale,
  lista: List,
  conexao: HeartHandshake,
  desejo: Sparkles,
  "narrativa-vendas": ShoppingBag,
  "conteudo-premium": Crown,
  outro: Sparkles,
};

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
          <div className="hidden text-xs text-muted-foreground md:block">Etapa {step + 1} de 3</div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        {step === 0 && (
          <>
            <StepTitle title="Escolha o tipo de conteúdo" />
            <StepGrid>
              {CONTENT_TYPES.map((t) => (
                <ChoiceCard
                  key={t.id}
                  icon={TYPE_ICON[t.id]}
                  active={type === t.id}
                  title={t.label}
                  desc={t.desc}
                  onClick={() => setType(t.id)}
                />
              ))}
            </StepGrid>
          </>
        )}

        {step === 1 && !isStories && (
          <>
            <StepTitle title="Qual é o objetivo?" sub="Isso muda o gancho, a linguagem e o CTA." />
            <StepGrid>
              {OBJECTIVES.map((o) => (
                <ChoiceCard
                  key={o.id}
                  icon={OBJ_ICON[o.id]}
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
            <div className="relative mt-6 px-10">
              <Carousel opts={{ align: "start" }}>
                <CarouselContent>
                  {formats.map((f) => {
                    const Ic = FMT_ICON[f.id] ?? Sparkles;
                    const isActive = format === f.id;
                    return (
                      <CarouselItem key={f.id} className="basis-1/2 md:basis-1/3">
                        <button
                          onClick={() => setFormat(f.id)}
                          className={cn(
                            "flex h-full w-full flex-col rounded-2xl border bg-card p-5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-editorial",
                            isActive && "border-violet ring-2 ring-violet/30",
                          )}
                        >
                          <IconBox active={isActive}>
                            <Ic className="h-5 w-5" />
                          </IconBox>
                          <div className="editorial-title mt-3 text-base">{f.label}</div>
                          {f.desc && <div className="mt-1 text-xs text-muted-foreground">{f.desc}</div>}
                        </button>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </Carousel>
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
              Gerar {labelOf(CONTENT_TYPES, type)}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function IconBox({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
        active ? "bg-violet text-violet-foreground" : "bg-secondary text-foreground",
      )}
    >
      {children}
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
  icon: Icon,
  active,
  title,
  desc,
  onClick,
}: {
  icon?: Icon;
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
      {Icon && (
        <IconBox active={active}>
          <Icon className="h-5 w-5" />
        </IconBox>
      )}
      <div className="editorial-title mt-3 text-xl">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
    </button>
  );
}
