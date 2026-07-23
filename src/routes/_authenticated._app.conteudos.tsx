import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { CONTENT_TYPES, labelOf, formatLabel } from "@/lib/roteiriza-constants";
import { Loader2, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/_app/conteudos")({
  component: ConteudosPage,
});

type Row = {
  id: string;
  title: string | null;
  content_type: string;
  format: string | null;
  created_at: string;
};

function ConteudosPage() {
  const { user } = useSession();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("conversations")
        .select("id, title, content_type, format, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setItems((data ?? []) as Row[]);
      setLoading(false);
    })();
  }, [user]);

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Histórico</div>
            <h1 className="editorial-title text-2xl">Meus Conteúdos</h1>
          </div>
          <Button asChild className="rounded-full">
            <Link to="/criar">
              <Sparkles className="mr-2 h-4 w-4" /> Novo conteúdo
            </Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border bg-card p-12 text-center shadow-soft">
            <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
            <h2 className="editorial-title mt-4 text-xl">Nada por aqui ainda</h2>
            <p className="mt-1 text-sm text-muted-foreground">Crie seu primeiro roteiro pra ele aparecer aqui.</p>
            <Button asChild className="mt-6 rounded-full">
              <Link to="/criar">Criar meu primeiro conteúdo</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {items.map((r) => (
              <Link
                key={r.id}
                to="/chat/$id"
                params={{ id: r.id }}
                className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-editorial"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-violet">
                    <span>{labelOf(CONTENT_TYPES, r.content_type)}</span>
                    {r.format && <span className="text-muted-foreground">· {formatLabel(r.content_type, r.format)}</span>}
                  </div>
                  <div className="editorial-title mt-1 truncate text-lg">{r.title || "Sem título ainda"}</div>
                </div>
                <div className="ml-4 shrink-0 text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString("pt-BR")}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
