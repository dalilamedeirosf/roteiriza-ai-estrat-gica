import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/roteiriza/logo";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos — Roteiriza" },
      { name: "description", content: "Planos do Roteiriza: gere roteiros de Instagram ilimitados com IA, personalizados pro seu nicho." },
    ],
  }),
  component: PlanosPage,
});

const FEATURES = [
  "Geração ilimitada de Reels, Carrossel e Stories",
  "Chat inteligente com memória de contexto",
  "Estrategista (consultoria de conteúdo com IA)",
  "Análise de Perfil com recomendações",
  "Memória da IA (regras, histórias e aprendizado)",
  "Templates de conteúdo e Desafio Sprint de 15 dias",
];

function PlanCard({
  name,
  price,
  suffix,
  note,
  highlight,
  cta,
  extra,
}: {
  name: string;
  price: string;
  suffix?: string;
  note?: string;
  highlight?: boolean;
  cta: string;
  extra?: string[];
}) {
  return (
    <div
      className={
        "flex flex-col rounded-3xl border p-6 shadow-soft " +
        (highlight ? "border-violet bg-card ring-2 ring-violet/30" : "bg-card")
      }
    >
      {highlight && (
        <div className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-violet px-3 py-1 text-[11px] font-medium text-violet-foreground">
          <Sparkles className="h-3 w-3" /> Mais popular
        </div>
      )}
      <div className="editorial-title text-lg">{name}</div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="editorial-title text-4xl">{price}</span>
        {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
      </div>
      {note && <div className="mt-1 text-xs text-muted-foreground">{note}</div>}
      <Button asChild className={"mt-5 rounded-full " + (highlight ? "bg-violet text-violet-foreground hover:bg-violet/90" : "")}>
        <Link to="/auth" search={{ mode: "signup" }}>
          {cta} <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
      <ul className="mt-6 space-y-2 text-sm">
        {FEATURES.map((f) => (
          <li key={f} className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet" />
            <span className="text-foreground/85">{f}</span>
          </li>
        ))}
        {extra?.map((f) => (
          <li key={f} className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet" />
            <span className="font-medium">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlanosPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="flex items-center gap-3">
          <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground">
            Entrar
          </Link>
          <Button asChild size="sm" className="rounded-full">
            <Link to="/auth" search={{ mode: "signup" }}>Começar</Link>
          </Button>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24">
        <section className="py-12 text-center">
          <h1 className="editorial-title text-4xl md:text-5xl">Escolha seu plano</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Roteiros de Instagram ilimitados, personalizados pro seu nicho. Comece hoje e nunca mais fique sem o que postar.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <PlanCard name="Mensal" price="R$ 297" suffix="/mês" note="Flexibilidade total, cancele quando quiser." cta="Assinar Mensal" />
          <PlanCard
            name="Anual"
            price="R$ 250"
            suffix="/mês"
            note="Cobrado R$ 2.997/ano — economia de R$ 567."
            highlight
            cta="Assinar Anual"
            extra={["Bônus: Reels Milionários", "Bônus: Stories Premium", "Bônus: Carrosséis Engajados"]}
          />
          <PlanCard name="Agências" price="Sob consulta" note="A partir de 2 contas. Contas ilimitadas e suporte prioritário." cta="Falar com o time" />
        </section>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Pagamento seguro. Você cria sua conta e ativa o plano em seguida.
        </p>
      </main>
    </div>
  );
}
