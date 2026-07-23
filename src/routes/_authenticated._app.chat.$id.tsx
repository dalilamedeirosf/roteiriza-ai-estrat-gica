import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { chatGenerate } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CONTENT_TYPES, OBJECTIVES, labelOf, formatLabel } from "@/lib/roteiriza-constants";
import { Loader2, Send, Plus, Sparkles, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/_app/chat/$id")({
  component: ChatPage,
});

type Msg = { id: string; role: string; content: string; created_at?: string };
type Conv = {
  id: string;
  title: string | null;
  content_type: string;
  objective: string | null;
  format: string | null;
};

function ChatPage() {
  const { id } = Route.useParams();
  const { user } = useSession();
  const navigate = useNavigate();
  const generate = useServerFn(chatGenerate);
  const [conv, setConv] = useState<Conv | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [revealId, setRevealId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data: c } = await supabase.from("conversations").select("*").eq("id", id).eq("user_id", user.id).maybeSingle();
      if (cancelled) return;
      if (!c) {
        toast.error("Conversa não encontrada.");
        navigate({ to: "/criar" });
        return;
      }
      setConv(c as Conv);
      const { data: m } = await supabase
        .from("messages")
        .select("id, role, content, created_at")
        .eq("conversation_id", id)
        .order("created_at", { ascending: true });
      if (cancelled) return;
      const list = (m ?? []) as Msg[];
      setMessages(list);
      setInitialLoad(false);
      if (list.length === 0) {
        // Kick off the discovery question
        try {
          setBusy(true);
          const res = await generate({ data: { conversationId: id } });
          if (!cancelled && res.message) {
            const msg = res.message as Msg;
            setMessages((prev) => [...prev, msg]);
            setRevealId(msg.id);
          }
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Erro ao iniciar.");
        } finally {
          setBusy(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, user, navigate, generate]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const optimistic: Msg = { id: `tmp-${Date.now()}`, role: "user", content: text };
    setMessages((m) => [...m, optimistic]);
    setBusy(true);
    try {
      const res = await generate({ data: { conversationId: id, userMessage: text } });
      if (res.message) {
        const msg = res.message as Msg;
        setMessages((m) => [...m, msg]);
        setRevealId(msg.id);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro.");
      setMessages((m) => m.filter((x) => x.id !== optimistic.id));
      setInput(text);
    } finally {
      setBusy(false);
    }
  }

  const header = conv
    ? [
        labelOf(CONTENT_TYPES, conv.content_type),
        conv.objective && conv.objective !== "estrategia" ? labelOf(OBJECTIVES, conv.objective) : "Estratégia",
        conv.format ? formatLabel(conv.content_type, conv.format) : null,
      ].filter(Boolean).join(" · ")
    : "";

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col md:h-screen">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Roteirizando</div>
            <div className="editorial-title text-lg">{header}</div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate({ to: "/criar" })} className="rounded-full">
            <Plus className="mr-1 h-4 w-4" /> Novo conteúdo
          </Button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-8">
          {initialLoad ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  role={m.role}
                  content={m.content}
                  animate={m.id === revealId}
                  onReveal={scrollToBottom}
                />
              ))}
              {busy && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 animate-pulse text-violet" />
                  Sua estrategista está pensando…
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
                  send();
                }
              }}
              placeholder="Responda ou peça um ajuste…"
              rows={2}
              className="min-h-[52px] resize-none rounded-2xl"
              disabled={busy}
            />
            <Button onClick={send} disabled={busy || !input.trim()} className="h-[52px] rounded-2xl px-4">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">Enter envia · Shift+Enter quebra linha</div>
        </div>
      </div>
    </div>
  );
}

// Extrai só a legenda ("Legenda:") do roteiro, parando no próximo marcador de seção.
function extractLegenda(content: string): string | null {
  const idx = content.search(/\blegenda:/i);
  if (idx === -1) return null;
  let rest = content.slice(idx).replace(/\blegenda:\s*/i, "");
  const stop = rest.search(/\n\s*(🎨|💡|Recomendações:|Sugestão de primeira linha|GRAVAÇÃO:)/i);
  if (stop !== -1) rest = rest.slice(0, stop);
  return rest.trim() || null;
}

function MessageBubble({
  role,
  content,
  animate,
  onReveal,
}: {
  role: string;
  content: string;
  animate?: boolean;
  onReveal?: () => void;
}) {
  const isUser = role === "user";
  const [shown, setShown] = useState(() => (animate && !isUser ? 0 : content.length));

  useEffect(() => {
    if (isUser || !animate) {
      setShown(content.length);
      return;
    }
    setShown(0);
    let i = 0;
    const step = Math.max(2, Math.round(content.length / 140)); // termina o "digitar" em ~2s
    const timer = setInterval(() => {
      i += step;
      if (i >= content.length) {
        setShown(content.length);
        clearInterval(timer);
      } else {
        setShown(i);
      }
      onReveal?.();
    }, 16);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate, content, isUser]);

  const revealing = !isUser && shown < content.length;
  const display = isUser ? content : content.slice(0, shown);
  const legenda = !isUser && !revealing ? extractLegenda(content) : null;

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copiado!`);
    } catch {
      toast.error("Não consegui copiar. Selecione e copie manualmente.");
    }
  }

  return (
    <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-soft",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-card border rounded-bl-md",
        )}
      >
        {!isUser && (
          <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-violet">
            <Sparkles className="h-3 w-3" /> Estrategista
          </div>
        )}
        {display}
        {revealing && <span className="ml-0.5 inline-block animate-pulse text-violet">▍</span>}
      </div>
      {!isUser && !revealing && (
        <div className="mt-1.5 flex flex-wrap gap-1 pl-1">
          <button
            type="button"
            onClick={() => copy(content, "Roteiro")}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Copy className="h-3 w-3" /> Copiar roteiro
          </button>
          {legenda && (
            <button
              type="button"
              onClick={() => copy(legenda, "Legenda")}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Copy className="h-3 w-3" /> Copiar legenda
            </button>
          )}
        </div>
      )}
    </div>
  );
}
