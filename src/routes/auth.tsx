import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/roteiriza/logo";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

const searchSchema = z.object({
  mode: z.enum(["login", "signup", "forgot"]).catch("login").optional(),
});

function passwordScore(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4);
}
const STRENGTH_LABEL = ["Muito fraca", "Fraca", "Ok", "Boa", "Forte"];
const STRENGTH_COLOR = ["bg-destructive", "bg-destructive", "bg-amber-500", "bg-emerald-500", "bg-emerald-500"];

function friendlyAuthError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  const m = msg.toLowerCase();
  if (m.includes("weak") || m.includes("pwned") || m.includes("known to be") || m.includes("easy to guess") || m.includes("compromised"))
    return "Essa senha é muito comum (aparece em vazamentos). Escolha uma senha única: 8+ caracteres, com letras, números e um símbolo.";
  if (m.includes("at least") || m.includes("minimum") || m.includes("should be"))
    return "Senha curta demais. Use pelo menos 8 caracteres.";
  if (m.includes("already registered") || m.includes("already been") || m.includes("user already"))
    return "Esse e-mail já tem conta. Tente entrar, ou use 'Esqueci' pra redefinir a senha.";
  if (m.includes("invalid login") || m.includes("invalid credentials"))
    return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed"))
    return "E-mail ainda não confirmado. Verifique sua caixa de entrada.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Muitas tentativas. Aguarde um instante e tente de novo.";
  return msg || "Algo deu errado.";
}

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
  const [showPw, setShowPw] = useState(false);
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
      toast.error(friendlyAuthError(err));
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    required
                    minLength={mode === "signup" ? 8 : 6}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPw ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {mode === "signup" && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={
                            "h-1 flex-1 rounded-full transition-colors " +
                            (form.password && passwordScore(form.password) > i
                              ? STRENGTH_COLOR[passwordScore(form.password)]
                              : "bg-muted")
                          }
                        />
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {form.password && (
                        <>
                          Força: <span className="font-medium">{STRENGTH_LABEL[passwordScore(form.password)]}</span> ·{" "}
                        </>
                      )}
                      Use 8+ caracteres, com letras, números e um símbolo. Evite senhas comuns.
                    </p>
                  </div>
                )}
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
