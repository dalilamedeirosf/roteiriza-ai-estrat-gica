import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/roteiriza/logo";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const searchSchema = z.object({
  mode: z.enum(["login", "signup", "forgot"]).catch("login").optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Entrar — Roteiriza" },
      { name: "description", content: "Acesse sua conta Roteiriza e continue criando conteúdo." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">(search.mode ?? "login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", whatsapp: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: form.email.trim(),
          password: form.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: form.full_name.trim(), whatsapp: form.whatsapp.trim() },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Vamos ao seu briefing.");
        navigate({ to: "/briefing" });
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email.trim(),
          password: form.password,
        });
        if (error) throw error;
        toast.success("Bem-vindo(a) de volta.");
        navigate({ to: "/criar" });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(form.email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Se o email existir, você receberá um link para redefinir a senha.");
        setMode("login");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Algo deu errado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground md:flex">
        <Logo className="text-primary-foreground" />
        <div>
          <p className="editorial-title text-4xl leading-tight">
            "Não é sobre postar mais.<br />É sobre postar <em className="text-violet-soft not-italic">no ponto</em>."
          </p>
          <p className="mt-4 text-sm opacity-70">
            Estrategista de conteúdo com IA para o Instagram.
          </p>
        </div>
        <span className="text-xs opacity-50">© {new Date().getFullYear()} Roteiriza</span>
      </aside>

      <main className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          <div className="md:hidden mb-8">
            <Logo />
          </div>
          <h1 className="editorial-title text-3xl">
            {mode === "signup" ? "Criar conta" : mode === "forgot" ? "Redefinir senha" : "Entrar"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signup"
              ? "Comece em minutos. Grátis pra testar."
              : mode === "forgot"
              ? "Enviaremos um link para você criar uma nova senha."
              : "Bem-vindo(a) de volta ao Roteiriza."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="full_name">Nome</Label>
                  <Input
                    id="full_name"
                    required
                    value={form.full_name}
                    onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                    placeholder="Como você quer ser chamado(a)"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    required
                    value={form.whatsapp}
                    onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                    placeholder="(11) 90000-0000"
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="voce@email.com"
              />
            </div>

            {mode !== "forgot" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Esqueci
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full rounded-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "signup" ? "Criar conta" : mode === "forgot" ? "Enviar link" : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? (
              <>
                Já tem conta?{" "}
                <button className="text-foreground underline underline-offset-4" onClick={() => setMode("login")}>
                  Entrar
                </button>
              </>
            ) : mode === "login" ? (
              <>
                Novo por aqui?{" "}
                <button className="text-foreground underline underline-offset-4" onClick={() => setMode("signup")}>
                  Criar conta
                </button>
              </>
            ) : (
              <button className="text-foreground underline underline-offset-4" onClick={() => setMode("login")}>
                Voltar para entrar
              </button>
            )}
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
              ← Voltar para o início
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
