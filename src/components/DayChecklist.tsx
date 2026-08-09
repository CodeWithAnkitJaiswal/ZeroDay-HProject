import { motion } from "motion/react";
import { Check } from "lucide-react";
import { CHECKLIST_ITEMS } from "@/lib/gamify";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function DayChecklist({
  day,
  only,
  disabled,
  onComplete,
}: {
  day: number;
  only?: string[];
  disabled?: boolean;
  onComplete?: () => void;
}) {
  const { state, toggleCheck } = useApp();
  const checked = state.checklists[day] ?? [];
  const items = only ? CHECKLIST_ITEMS.filter((i) => only.includes(i.id)) : [...CHECKLIST_ITEMS];
  const done = items.filter((i) => checked.includes(i.id)).length;
  const pct = Math.round((done / items.length) * 100);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {done} of {items.length} done
        </span>
        <span className="font-semibold text-foreground">{pct}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full bg-[image:var(--gradient-emerald)]"
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 140, damping: 20 }}
        />
      </div>
      {items.map((item) => {
        const active = checked.includes(item.id);
        return (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={() => {
              toggleCheck(day, item.id);
              if (!active && done + 1 === items.length) onComplete?.();
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all disabled:opacity-60",
              active ? "border-emerald/35 bg-emerald/10" : "border-border bg-secondary/40 hover:border-violet/30",
            )}
          >
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-lg border transition-all",
                active ? "border-emerald bg-emerald text-background" : "border-border bg-background/40",
              )}
            >
              {active && <Check className="size-3.5" strokeWidth={3} />}
            </span>
            <span className={cn("flex-1 text-sm", active && "text-muted-foreground line-through")}>{item.label}</span>
            <span className="shrink-0 text-[11px] font-bold text-violet">+{item.xp} XP</span>
          </button>
        );
      })}
    </div>
  );
}
