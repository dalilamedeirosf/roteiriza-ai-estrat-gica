import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Sparkles, LayoutTemplate, Film, Layers, Smartphone, ExternalLink, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { DESIGN_TEMPLATES, templateGradient } from "@/lib/design-templates";

export const Route = createFileRoute("/_authenticated/_app/templates")({
  component: TemplatesPage,
});

type Hook = { name: string; when: string; template: string };
type Structure = { name: string; icon: typeof Film; when: string; template: string };

const HOOKS: Hook[] = [
  { name: "Comparação / Dualidade", when: "Mostrar o contraste entre dois caminhos.", template: "O jeito de quem [faz errado] VS o jeito de quem [faz certo]." },
  { name: "Promessa simples", when: "Sua entrega já é direta e forte.", template: "Eu vou te mostrar como [resultado desejado] com [meio simples]." },
  { name: "Controvérsia", when: "Tema quente que gera opinião.", template: "[Afirmação polêmica] — e eu vou te explicar por quê." },
  { name: "Quebra de expectativa", when: "Gerar curiosidade e surpresa.", template: "Esse [objeto banal] me ensinou tudo sobre [tema do seu nicho]." },
  { name: "História", when: "A história é mais forte que qualquer técnica.", template: "[Fato marcante] aconteceu — e me ensinou [lição]." },
  { name: "Confissão", when: "Criar conexão profunda e humana.", template: "Vou te confessar uma coisa que me travou por [tempo]…" },
  { name: "Interrupção", when: "Cortar uma crença com força.", template: "“Mas eu preciso [crença comum] antes de [objetivo]…” — Não. [vira a chave]" },
  { name: "Promessa quantificada", when: "Promessa agressiva e concreta.", template: "É assim que você faz [resultado] em [número/tempo]." },
  { name: "Aviso / Perda", when: "Ativar o medo de estar perdendo (FOMO).", template: "Se você ainda não está fazendo [X], você está deixando de ganhar [Y]." },
  { name: "Quebra de objeção", when: "Neutralizar o “mas…” antes que ele venha.", template: "Eu sou [objeção: introvertida/iniciante/etc.] e mesmo assim [resultado]." },
  { name: "Problema → Solução", when: "Apresentar dor e solução na sequência.", template: "Com esse problema [dor]? Aqui está a resposta: [solução]." },
  { name: "Jeito certo vs. errado", when: "Mostrar o contraste de execução.", template: "O jeito errado de [tarefa]: [erro]. O jeito certo: [acerto]." },
  { name: "Dar voz à frustração", when: "Espelhar exatamente a dor do público.", template: "Não aguento mais [dor recorrente]. O que eu faço?" },
  { name: "Reação / Opinião", when: "Comentar algo que já está bombando.", template: "[Reage a um conteúdo comum] — isso aqui é um absurdo porque [seu ponto]." },
  { name: "Oportunidade escondida", when: "Mostrar uma chance que o público não vê.", template: "Isso aqui é muito fácil de fazer e gera [benefício] — e quase ninguém aproveita." },
  { name: "Aprendizado", when: "Compartilhar uma lição concreta.", template: "O que eu aprendi sobre [tema] fazendo [experiência real]." },
];

const STRUCTURES: Structure[] = [
  {
    name: "Reels",
    icon: Film,
    when: "Vídeo curto que para o scroll.",
    template: `Estilo Visual: [estética / cenário / áudio sugerido]
[GANCHO] [1ª fala que para o scroll]
[IDENTIFICAÇÃO] [fala que faz a pessoa se ver]
[CONTEÚDO] [desenvolvimento em beats curtos, uma ideia por linha]
[CTA - FINALIZAÇÃO] [chamada final + convite pra seguir]
GRAVAÇÃO: [que cenas gravar, cortes, ordem]
Legenda: [gancho + ⬇️, texto que aprofunda, "Manda esse vídeo pra uma [persona] que…"]`,
  },
  {
    name: "Carrossel",
    icon: Layers,
    when: "Sequência que carrega a leitura até o CTA.",
    template: `Estilo Visual: [paleta, fontes, tipo de foto]
[1] [slide-gancho]
[2] [desenvolvimento]
[…]
[N] [slide final = CTA: seguir / comentar uma palavra / salvar]
Legenda: [1ª linha-gancho + ⬇️]
[história / desenvolvimento]
[a lição / virada de chave]
[CTA: "Salva esse post…" ou "Manda pra uma amiga que…"]`,
  },
  {
    name: "Carrossel — Dualidade",
    icon: Layers,
    when: "Contrastar dois perfis / caminhos.",
    template: `[1] O jeito de quem [A]  VS  o jeito de quem [B]
[2] LADO ESQUERDO — [rótulo A]: [comportamento]
    LADO DIREITO — [rótulo B]: [comportamento]
[…repita o contraste linha a linha…]
[N] CTA: se você quer ser [B], me segue.
Legenda: [gancho de choque + ⬇️] … "Salva pra lembrar de qual lado você quer estar."`,
  },
  {
    name: "Carrossel — Erro Comum",
    icon: Layers,
    when: "Educar corrigindo um erro do público.",
    template: `[1] [Afirmação surpreendente sobre o erro real]
[2] Por que isso acontece / a mentira por trás
[3] O custo desse erro (dinheiro, tempo, clientes)
[4] Como corrigir (passos práticos)
[N] CTA: salva + me segue pra aprender [tema]
Legenda: [gancho "aposto que ninguém te contou…" + ⬇️] … pergunta nos comentários.`,
  },
  {
    name: "Stories — Narrativa de Vendas",
    icon: Smartphone,
    when: "Conduzir da conexão até a oferta.",
    template: `STORY 01 (bastidor/vídeo seu em ação) — gancho
STORY 02 — provocação + [ENQUETE] Opção A / Opção B
STORY 03 — a dor comum do público
STORY 04 — "eu já fui essa [persona]…"
STORY 05 — a virada de chave
STORY 06 — [PRINT DE DEPOIMENTOS] (prova)
STORY 07 — apresenta a solução / oferta
STORY 08 — CTA: "responde com a palavra EU QUERO que eu te mando o link"
Recomendações: intercale vídeo falando + telas de texto.`,
  },
];

function TemplatesPage() {
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Template copiado!");
    } catch {
      toast.error("Não consegui copiar.");
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Biblioteca</div>
          <h1 className="editorial-title text-2xl">Templates</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Designs prontos pra editar no Canva + ganchos e estruturas de roteiro pra copiar.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-10 px-6 py-8">
        {/* Templates de Design (abrem no Canva) */}
        <section>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-violet" />
            <h2 className="editorial-title text-xl">Templates de Design</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Modelos prontos pra usar no Canva — clique pra abrir e editar.</p>
          {DESIGN_TEMPLATES.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              Nenhum template ainda. Adicione os seus em <code className="rounded bg-muted px-1">src/lib/design-templates.ts</code>.
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {DESIGN_TEMPLATES.map((t) => (
                <a
                  key={t.id}
                  href={t.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block overflow-hidden rounded-xl border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-editorial"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
                    {/* placeholder atrás — aparece enquanto o embed carrega */}
                    <div className={cn("absolute inset-0 flex items-center justify-center bg-gradient-to-br", templateGradient(t.id))}>
                      <span className="editorial-title text-3xl text-white/80">{String(t.id).padStart(2, "0")}</span>
                    </div>
                    {t.thumb ? (
                      <img src={t.thumb} alt={t.title ?? `Template ${t.id}`} className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <iframe
                        src={`${t.url}?embed`}
                        loading="lazy"
                        title={`Template ${t.id}`}
                        className="pointer-events-none absolute inset-0 h-full w-full border-0"
                        allowFullScreen
                      />
                    )}
                  </div>
                  <div className="absolute right-2 top-2 rounded-full bg-background/85 p-1.5 text-foreground shadow-soft backdrop-blur transition-colors group-hover:text-violet">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </div>
                  {t.title && <div className="truncate px-3 py-2 text-xs text-muted-foreground">{t.title}</div>}
                </a>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Adicione os seus editando <code className="rounded bg-muted px-1">src/lib/design-templates.ts</code> (link do Canva + miniatura opcional em <code className="rounded bg-muted px-1">/public/templates</code>).
          </p>
        </section>

        {/* Ganchos */}
        <section>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet" />
            <h2 className="editorial-title text-xl">16 ganchos que param o scroll</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">O começo é tudo. Escolha o gancho que promete algo que a pessoa quer muito ou teme perder.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {HOOKS.map((h) => (
              <div key={h.name} className="group rounded-2xl border bg-card p-4 shadow-soft">
                <div className="flex items-start justify-between gap-2">
                  <div className="editorial-title text-base">{h.name}</div>
                  <button
                    onClick={() => copy(h.template)}
                    className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Copiar gancho"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{h.when}</div>
                <div className="mt-2 rounded-lg bg-muted/60 px-3 py-2 text-sm italic text-foreground/80">“{h.template}”</div>
              </div>
            ))}
          </div>
        </section>

        {/* Estruturas */}
        <section>
          <div className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-violet" />
            <h2 className="editorial-title text-xl">Estruturas de roteiro</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">O esqueleto de cada formato — preencha os colchetes e está pronto pra gravar/postar.</p>
          <div className="mt-5 space-y-3">
            {STRUCTURES.map((s) => (
              <div key={s.name} className="rounded-2xl border bg-card p-5 shadow-soft">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <s.icon className="h-4 w-4 text-violet" />
                    <div className="editorial-title text-base">{s.name}</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copy(s.template)} className="rounded-full">
                    <Copy className="mr-1 h-3.5 w-3.5" /> Copiar
                  </Button>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{s.when}</div>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-muted/60 px-3 py-3 font-sans text-sm text-foreground/85">{s.template}</pre>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
