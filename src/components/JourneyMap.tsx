import { motion } from "motion/react";
import { Lock, Sparkles } from "lucide-react";
import { MILESTONES, accentClasses } from "@/lib/gamify";
import { cn } from "@/lib/utils";

export function JourneyMap({ completedDays, currentDay }: { completedDays: number[]; currentDay: number }) {
  return (
    <div className="space-y-3">
      {MILESTONES.map((m, i) => {
        const [start, end] = m.range;
        const total = end - start + 1;
        const done = completedDays.filter((d) => d >= start && d <= end).length;
        const pct = Math.round((done / total) * 100);
        const isCurrent = currentDay >= start && currentDay <= end;
        const isLocked = currentDay < start;
        const a = accentClasses[m.accent]!;
        const remaining = Math.max(0, end - Math.max(currentDay - 1, start - 1));

        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className={cn(
              "relative overflow-hidden rounded-3xl border p-4",
              isCurrent ? cn(a.border, "glass-strong") : "glass border-border",
              isLocked && "opacity-70",
            )}
          >
            <div className={cn("absolute inset-x-0 top-0 h-24 bg-gradient-to-b opacity-40", a.grad)} />
            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Days {start}–{end}
                  </p>
                  <h3 className="truncate text-lg font-bold">{m.title}</h3>
                </div>
                {isLocked ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground">
                    <Lock className="size-3" /> Locked
                  </span>
                ) : (
                  <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold", a.bg, a.text)}>
                    {pct}%
                  </span>
                )}
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full rounded-full bg-[image:var(--gradient-violet)]"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                />
              </div>

              <p className="mt-3 text-sm italic text-muted-foreground">"{m.message}"</p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold", a.bg, a.text)}>
                  <Sparkles className="size-3" /> {m.reward}
                </span>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-muted-foreground">
                  {done}/{total} days
                </span>
                {isCurrent && (
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-muted-foreground">
                    ~{remaining} days remaining
                  </span>
                )}
                {pct === 100 && (
                  <span className="rounded-full bg-emerald/15 px-2.5 py-1 font-semibold text-emerald">
                    🏅 Badge earned
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
