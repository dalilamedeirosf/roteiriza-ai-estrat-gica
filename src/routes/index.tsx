import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/roteiriza/logo";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, PenLine, Layers } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Roteiriza — Roteiros de Instagram com IA, do seu jeito" },
      {
        name: "description",
        content:
          "A estrategista de conteúdo com IA que conhece o seu nicho, o seu público e a sua oferta. Roteiros de Reels, Carrossel e Stories prontos pra postar.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="flex items-center gap-3">
          <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground">
            Entrar
          </Link>
          <Button asChild size="sm" className="rounded-full">
            <Link to="/auth" search={{ mode: "signup" }}>
              Começar
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="pt-16 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground shadow-soft">
              <Sparkles className="h-3.5 w-3.5 text-violet" />
              Sua estrategista de conteúdo com IA
            </span>
            <h1 className="editorial-title mt-6 text-5xl leading-[1.05] text-foreground md:text-7xl">
              Roteiros de Instagram <em className="text-violet not-italic">no ponto</em>, feitos pra você.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Roteiriza conhece o seu nicho, o seu público e a sua oferta. Gera Reels, Carrossel e Stories
              hiperpersonalizados — com gancho, identificação e CTA — prontos pra postar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-primary">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Criar minha conta
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/auth">Já tenho conta</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 pb-24 md:grid-cols-3">
          {[
            { icon: PenLine, title: "Reels que param o scroll", desc: "Gancho + identificação + CTA em camadas, no seu tom de voz." },
            { icon: Layers, title: "Carrossel estruturado", desc: "Slides que carregam a leitura até o CTA e legenda que salva." },
            { icon: Sparkles, title: "Estratégia de Stories", desc: "Sequência de conexão, desejo e vendas, com direção de foto." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border bg-card p-6 shadow-soft">
              <f.icon className="h-5 w-5 text-violet" />
              <h3 className="editorial-title mt-4 text-xl">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Roteiriza</span>
          <span className="editorial-title">Feito com cuidado.</span>
        </div>
      </footer>
    </div>
  );
}
