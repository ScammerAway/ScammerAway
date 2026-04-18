import { Link, useLocation } from "react-router-dom";
import { Shield, BookOpen, MessageSquare, Trophy, Target, LogIn, LogOut, Book } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { to: "/app", label: "Home", icon: Shield },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/practice", label: "Practice", icon: MessageSquare },
  { to: "/test", label: "Test", icon: Target },
  { to: "/resources", label: "Resources", icon: Book}
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const { progress, user, signOut } = useProgress();
  const audClass = progress.audience === "senior" ? "a-senior" : "";

  return (
    <div className={cn("min-h-screen bg-warm flex flex-col", audClass)}>
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Shield className="h-4 w-4" />
            </span>
            ScammerAway
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const Icon = l.icon;
              const active = loc.pathname.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8 md:py-12">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden sticky bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur">
        <div className="flex justify-around">
          {links.map((l) => {
            const Icon = l.icon;
            const active = loc.pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 px-3 text-[10px] font-medium",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
