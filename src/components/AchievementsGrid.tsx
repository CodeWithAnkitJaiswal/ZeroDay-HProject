import { motion } from "motion/react";
import { Lock } from "lucide-react";
import { ACHIEVEMENTS, accentClasses } from "@/lib/gamify";
import { Icon } from "@/components/common";
import { cn } from "@/lib/utils";

export function AchievementsGrid({ unlocked }: { unlocked: string[] }) {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
      {ACHIEVEMENTS.map((a, i) => {
        const isOn = unlocked.includes(a.id);
        const c = accentClasses[a.accent]!;
        return (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center",
              isOn ? cn(c.bg, c.border) : "border-border bg-secondary/30 opacity-60",
            )}
          >
            <div
              className={cn(
                "grid size-10 place-items-center rounded-xl",
                isOn ? "bg-background/40" : "bg-background/20",
              )}
            >
              {isOn ? <Icon name={a.icon} className={cn("size-5", c.text)} /> : <Lock className="size-4 text-muted-foreground" />}
            </div>
            <p className="text-[11px] font-semibold leading-tight">{a.name}</p>
            <p className="text-[10px] leading-tight text-muted-foreground">{a.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
