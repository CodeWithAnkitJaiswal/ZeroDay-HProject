import { useState } from "react";
import { motion } from "motion/react";
import { Award, Check, Flag, Lock } from "lucide-react";
import { MILESTONES, ACHIEVEMENTS, accentClasses, type Milestone } from "@/lib/gamify";
import { CertificateModal, type CertificateData } from "@/components/CertificateModal";
import { cn } from "@/lib/utils";

export function JourneyTracker({
  currentDay,
  completedDays,
  avatar,
  name,
  track,
  xp,
  level,
  streak,
  unlockedAchievements,
}: {
  currentDay: number;
  completedDays: number[];
  avatar: string;
  name: string;
  track: string;
  xp: number;
  level: string;
  streak: number;
  unlockedAchievements: string[];
}) {
  const [active, setActive] = useState<Milestone | null>(null);
  const pct = Math.min(100, Math.max(0, ((currentDay - 1) / 59) * 100));

  const isEarned = (m: Milestone) => {
    const [s, e] = m.range;
    const total = e - s + 1;
    const done = completedDays.filter((d) => d >= s && d <= e).length;
    if (done >= total) return true;
    // milestone window has fully passed and was mostly completed
    return currentDay > e && done / total >= 0.7;
  };

  const certificate = (m: Milestone): CertificateData => ({
    name,
    track,
    milestone: m,
    days: `${m.range[0]}–${m.range[1]}`,
    xp,
    level,
    streak,
    achievements: ACHIEVEMENTS.filter((a) => unlockedAchievements.includes(a.id)).map((a) => a.name),
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
  });

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">Your 60-day journey</p>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
          Day {currentDay} / 60
        </span>
      </div>

      <div className="relative mt-9 h-2 rounded-full bg-secondary">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-[image:var(--gradient-violet)]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />

        {/* milestone flags */}
        {MILESTONES.map((m) => {
          const left = ((m.range[1] - 1) / 59) * 100;
          const earned = isEarned(m);
          const a = accentClasses[m.accent]!;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => earned && setActive(m)}
              title={earned ? `${m.title} — view certificate` : `${m.title} — locked`}
              className="absolute -top-1.5 -translate-x-1/2"
              style={{ left: `${left}%` }}
            >
              <span
                className={cn(
                  "grid size-5 place-items-center rounded-full border-2 border-background transition-transform",
                  earned ? cn(a.bg, "ring-2 ring-current hover:scale-125", a.text) : "bg-secondary text-muted-foreground",
                )}
              >
                {earned ? <Check className="size-3" /> : <Lock className="size-2.5" />}
              </span>
              <span className="mt-1.5 block whitespace-nowrap text-[9px] font-semibold text-muted-foreground">
                D{m.range[1]}
              </span>
            </button>
          );
        })}

        {/* moving candidate */}
        <motion.div
          className="absolute -top-8 -translate-x-1/2"
          initial={{ left: 0 }}
          animate={{ left: `${pct}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 16 }}
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <img
              src={avatar}
              alt={`${name} progress marker`}
              width={32}
              height={32}
              className="size-8 rounded-full border-2 border-violet bg-secondary object-cover shadow-lg"
            />
            <Flag className="absolute -right-1 -top-1 size-3 text-orange" />
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {MILESTONES.map((m) => {
          const earned = isEarned(m);
          const a = accentClasses[m.accent]!;
          return (
            <button
              key={m.id}
              type="button"
              disabled={!earned}
              onClick={() => setActive(m)}
              className={cn(
                "rounded-2xl border p-2.5 text-left transition-all",
                earned ? cn(a.border, a.bg, "hover:-translate-y-0.5") : "border-border/60 bg-secondary/30 opacity-70",
              )}
            >
              <p className="truncate text-[11px] font-bold">{m.title}</p>
              <p className="text-[10px] text-muted-foreground">
                Days {m.range[0]}–{m.range[1]}
              </p>
              <p
                className={cn(
                  "mt-1 inline-flex items-center gap-1 text-[10px] font-semibold",
                  earned ? a.text : "text-muted-foreground",
                )}
              >
                {earned ? (
                  <>
                    <Award className="size-3" /> Certificate
                  </>
                ) : (
                  <>
                    <Lock className="size-3" /> Locked
                  </>
                )}
              </p>
            </button>
          );
        })}
      </div>

      {active && (
        <CertificateModal open={!!active} onOpenChange={(v) => !v && setActive(null)} data={certificate(active)} />
      )}
    </div>
  );
}