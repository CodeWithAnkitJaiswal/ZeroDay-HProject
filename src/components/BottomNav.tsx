import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Home, LayoutDashboard, Target } from "lucide-react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const { state } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const day = Math.min(60, state.currentDay || 1);

  const tabs = [
    { to: "/", label: "Home", icon: Home, match: pathname === "/" },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, match: pathname.startsWith("/dashboard") },
    { to: `/day/${day}`, label: "Today", icon: Target, match: pathname.startsWith("/day") },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-md px-4 pb-3">
        <div className="glass-strong grid grid-cols-3 gap-1 rounded-2xl p-1.5">
          {tabs.map((t) => (
            <Link
              key={t.label}
              to={t.to}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-semibold transition-colors",
                t.match ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {t.match && (
                <motion.span
                  layoutId="navpill"
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet/30 to-blue/20"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <t.icon className="relative size-[18px]" />
              <span className="relative">{t.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
