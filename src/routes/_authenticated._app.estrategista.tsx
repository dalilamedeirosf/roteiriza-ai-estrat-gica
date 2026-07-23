import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { strategistChat } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Send, Compass, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/_app/estrategista")({
  component: EstrategistaPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const QUICK: { label: string; prompt: string }[] = [
  { label: "Analisar meu perfil", prompt: "Analise meu perfil com base no meu briefing e me diga o que está funcionando, o que precisa melhorar e por onde começar." },
  { label: "Planejar minha semana", prompt: "Planeje minha semana de conteúdo: quantos posts, quais formatos (Reels/Carrossel/Stories) e quais temas eu deveria postar." },
  { label: "Revisar posicionamento", prompt: "Revise o meu posicionamento com base no meu briefing e perfil. O que eu poderia deixar mais claro ou forte?" },
  { label: "Ideias de conteúdo agora", prompt: "Me dê 5 ideias de conteúdo (Reels, Carrossel ou Stories) que eu posso gravar essa semana, com um gancho de exemplo em cada." },
  { label: "Melhorar minha bio", prompt: "Melhore a minha bio do Instagram. Me dê 3 versões que comuniquem melhor o que eu faço e pra quem." },
  { label: "Estratégia de vendas", prompt: "Qual a melhor estratégia de venda / campanha que eu posso rodar agora considerando meu perfil e minha oferta?" },
];

function EstrategistaPage() {
  const chat = useServerFn(strategistChat);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function ask(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: t }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await chat({ data: { messages: next } });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao falar com a estrategista.");
    } finally {
      setBusy(false);
    }
  }

  const empty = messages.length === 0;

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col md:h-screen">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-6 py-4">
          <Compass className="h-5 w-5 text-violet" />
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Consultoria</div>
            <div className="editorial-title text-lg">Estrategista</div>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-8">
          {empty ? (
            <div>
              <h1 className="editorial-title text-3xl">Como posso te ajudar hoje?</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Converse abertamente sobre perfil, conteúdo, posicionamento, estratégia e próximos passos. Eu conheço o seu briefing e a sua memória.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {QUICK.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => ask(q.prompt)}
                    className="rounded-2xl border bg-card p-4 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-editorial"
                  >
                    <div className="editorial-title text-base">{q.label}</div>
                    <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{q.prompt}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m, i) => (
                <Bubble key={i} role={m.role} content={m.content} />
              ))}
              {busy && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 animate-pulse text-violet" />
                  Pensando…
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t bg-background">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  ask(input);
                }
              }}
              placeholder="Pergunte qualquer coisa sobre seu perfil, conteúdo, estratégia…"
              rows={2}
              className="min-h-[52px] resize-none rounded-2xl"
              disabled={busy}
            />
            <Button onClick={() => ask(input)} disabled={busy || !input.trim()} className="h-[52px] rounded-2xl px-4">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">Enter envia · Shift+Enter quebra linha</div>
        </div>
      </div>
    </div>
  );
}

function Bubble({ role, content }: { role: string; content: string }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-soft",
          isUser ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md border bg-card",
        )}
      >
        {!isUser && (
          <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-violet">
            <Compass className="h-3 w-3" /> Estrategista
          </div>
        )}
        {content}
      </div>
    </div>
  );
}
