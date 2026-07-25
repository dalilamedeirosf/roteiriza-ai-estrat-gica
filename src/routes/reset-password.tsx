import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/roteiriza/logo";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Redefinir senha — Roteiriza" }, { name: "description", content: "Defina uma nova senha." }],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Senha atualizada.");
      navigate({ to: "/criar" });
    } catch (err) {
      const msg = err instanceof Error ? err.message.toLowerCase() : "";
      if (msg.includes("weak") || msg.includes("pwned") || msg.includes("easy to guess") || msg.includes("compromised"))
        toast.error("Senha muito comum/fraca. Use 8+ caracteres, com letras, números e um símbolo.");
      else if (msg.includes("at least") || msg.includes("should be"))
        toast.error("Senha curta demais. Use pelo menos 8 caracteres.");
      else toast.error(err instanceof Error ? err.message : "Erro ao redefinir.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Logo />
        <h1 className="editorial-title mt-6 text-3xl">Nova senha</h1>
        <p className="mt-1 text-sm text-muted-foreground">Escolha uma senha nova para acessar sua conta.</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pw">Nova senha</Label>
            <div className="relative">
              <Input
                id="pw"
                type={showPw ? "text" : "password"}
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <p className="text-[11px] text-muted-foreground">Use 8+ caracteres, com letras, números e um símbolo. Evite senhas comuns.</p>
          </div>
          <Button disabled={loading} className="w-full rounded-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Atualizar senha
          </Button>
        </form>
      </div>
    </div>
  );
}
