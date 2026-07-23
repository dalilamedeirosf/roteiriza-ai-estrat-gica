import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { Logo } from "@/components/roteiriza/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  History,
  Settings,
  LogOut,
  Brain,
  LayoutTemplate,
  Compass,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { user } = useSession();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("briefings").select("completed").eq("user_id", user.id).maybeSingle();
      if (!data?.completed) navigate({ to: "/briefing" });
      setChecked(true);
    })();
  }, [user, navigate]);

  async function logout() {
    await supabase.auth.signOut();
    toast.success("Até já.");
    navigate({ to: "/" });
  }

  if (!checked) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar md:flex">
        <div className="px-6 py-6">
          <Logo size="sm" />
        </div>
        <nav className="flex-1 space-y-1 px-3">
          <NavItem to="/criar" icon={Sparkles} label="Criar" />
          <NavItem to="/conteudos" icon={History} label="Meus Conteúdos" />
          <NavItem to="/configuracoes" icon={Settings} label="Configurações" />
          <Separator className="my-4" />
          <div className="px-3 pb-2 text-xs uppercase tracking-wider text-muted-foreground">Em breve</div>
          <SoonItem icon={Compass} label="Estrategista" />
          <SoonItem icon={LayoutTemplate} label="Templates" />
          <SoonItem icon={Brain} label="Memória da IA" />
        </nav>
        <div className="border-t p-4">
          <div className="mb-3 truncate text-xs text-muted-foreground">{user?.email}</div>
          <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </aside>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const active = currentPath === to || currentPath.startsWith(to + "/");
  return (
    <Link
      to={to}
      className={
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors " +
        (active
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground")
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function SoonItem({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/40">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      <span className="ml-auto rounded-full border border-violet/40 bg-violet-soft px-2 py-0.5 text-[10px] font-medium text-violet">em breve</span>
    </div>
  );
}
