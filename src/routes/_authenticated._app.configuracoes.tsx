import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, PenLine } from "lucide-react";

export const Route = createFileRoute("/_authenticated/_app/configuracoes")({
  component: ConfigPage,
});

function ConfigPage() {
  const { user } = useSession();
  const [profile, setProfile] = useState({ full_name: "", whatsapp: "", email: "" });
  const [briefingScore, setBriefingScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: b }] = await Promise.all([
        supabase.from("profiles").select("full_name, whatsapp, email").eq("id", user.id).maybeSingle(),
        supabase.from("briefings").select("score").eq("user_id", user.id).maybeSingle(),
      ]);
      setProfile({
        full_name: p?.full_name ?? "",
        whatsapp: p?.whatsapp ?? "",
        email: p?.email ?? user.email ?? "",
      });
      setBriefingScore(b?.score ?? 0);
      setLoading(false);
    })();
  }, [user]);

  async function save() {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: profile.full_name, whatsapp: profile.whatsapp })
        .eq("id", user.id);
      if (error) throw error;
      toast.success("Perfil atualizado.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
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
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Conta</div>
          <h1 className="editorial-title text-2xl">Configurações</h1>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-8 px-6 py-8">
        <section className="rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="editorial-title text-xl">Perfil</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Nome" value={profile.full_name} onChange={(v) => setProfile((p) => ({ ...p, full_name: v }))} />
            <Field label="WhatsApp" value={profile.whatsapp} onChange={(v) => setProfile((p) => ({ ...p, whatsapp: v }))} />
            <div className="md:col-span-2">
              <Field label="Email" value={profile.email} onChange={() => {}} disabled />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button className="rounded-full" onClick={save} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar alterações
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="editorial-title text-xl">Briefing</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Quanto mais completo, melhor os roteiros. Sua nota: <span className="text-violet font-medium">{briefingScore ?? 0}/100</span>
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/briefing">
                <PenLine className="mr-2 h-4 w-4" /> Editar briefing
              </Link>
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="editorial-title text-xl">Meu Plano</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Você está no plano <span className="font-medium text-foreground">Teste</span>. Em breve você poderá fazer upgrade
            para gerar sem limites.
          </p>
          <Button disabled className="mt-4 rounded-full">Em breve</Button>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} />
    </div>
  );
}
