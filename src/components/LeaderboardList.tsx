import { motion } from "motion/react";
import { Crown, Flame, Zap } from "lucide-react";
import { LEADERBOARD } from "@/data/community";
import { TRACKS } from "@/data/tracks";
import { trackAccent, accentClasses } from "@/lib/gamify";
import { cn } from "@/lib/utils";

export function LeaderboardList({ limit = 10, you }: { limit?: number; you?: { name: string; xp: number; rank: number } }) {
  const rows = LEADERBOARD.slice(0, limit);
  return (
    <div className="space-y-2">
      {rows.map((r, i) => {
        const a = accentClasses[trackAccent[r.track]]!;
        const medal = ["text-orange", "text-muted-foreground", "text-rose"][i];
        return (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="glass flex items-center gap-3 rounded-2xl p-2.5"
          >
            <div className="grid w-7 shrink-0 place-items-center">
              {i < 3 ? (
                <Crown className={cn("size-4", medal)} />
              ) : (
                <span className="text-xs font-bold text-muted-foreground">{r.rank}</span>
              )}
            </div>
            <img src={r.avatar} alt="" className="size-9 shrink-0 rounded-xl bg-secondary" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{r.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{r.college}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className={cn("text-sm font-bold", a.text)}>{r.xp.toLocaleString("en-IN")}</p>
              <p className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
                <Flame className="size-3 text-orange" />
                {r.streak}d · {TRACKS.find((t) => t.id === r.track)?.name}
              </p>
            </div>
          </motion.div>
        );
      })}
      {you && (
        <div className="flex items-center gap-3 rounded-2xl border border-violet/40 bg-violet/10 p-2.5">
          <div className="grid w-7 shrink-0 place-items-center text-xs font-bold text-violet">#{you.rank}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{you.name} (You)</p>
            <p className="text-[11px] text-muted-foreground">Keep climbing</p>
          </div>
          <p className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-violet">
            <Zap className="size-3.5" />
            {you.xp.toLocaleString("en-IN")}
          </p>
        </div>
      )}
    </div>
  );
}
