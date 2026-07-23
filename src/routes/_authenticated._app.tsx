import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { Logo } from "@/components/roteiriza/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  Sparkles,
  History,
  Settings,
  LogOut,
  Brain,
  LayoutTemplate,
  Compass,
  Menu,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { user } = useSession();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      {/* Sidebar — desktop */}
      <aside className="hidden w-64 shrink-0 md:flex">
        <div className="flex w-64 flex-col border-r bg-sidebar">
          <SidebarInner email={user?.email} onLogout={logout} />
        </div>
      </aside>

      {/* Coluna de conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar — mobile */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background/90 px-3 backdrop-blur md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Abrir menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-0">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <SidebarInner email={user?.email} onLogout={logout} onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <Logo size="sm" />
        </header>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarInner({
  email,
  onLogout,
  onNavigate,
}: {
  email?: string | null;
  onLogout: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="px-6 py-6">
        <Logo size="sm" />
      </div>
      <nav className="flex-1 space-y-1 px-3">
        <NavItem to="/criar" icon={Sparkles} label="Criar" onNavigate={onNavigate} />
        <NavItem to="/conteudos" icon={History} label="Meus Conteúdos" onNavigate={onNavigate} />
        <NavItem to="/configuracoes" icon={Settings} label="Configurações" onNavigate={onNavigate} />
        <Separator className="my-4" />
        <div className="px-3 pb-2 text-xs uppercase tracking-wider text-muted-foreground">Em breve</div>
        <SoonItem icon={Compass} label="Estrategista" />
        <SoonItem icon={LayoutTemplate} label="Templates" />
        <SoonItem icon={Brain} label="Memória da IA" />
      </nav>
      <div className="border-t p-4">
        <div className="mb-3 truncate text-xs text-muted-foreground">{email}</div>
        <Button variant="ghost" size="sm" onClick={onLogout} className="w-full justify-start">
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </div>
    </div>
  );
}

function NavItem({
  to,
  icon: Icon,
  label,
  onNavigate,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  onNavigate?: () => void;
}) {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const active = currentPath === to || currentPath.startsWith(to + "/");
  return (
    <Link
      to={to}
      onClick={onNavigate}
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
