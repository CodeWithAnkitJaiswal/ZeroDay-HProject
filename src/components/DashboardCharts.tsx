import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--foreground)",
};

export function WeeklyCharts({ completedDays, currentDay, xp }: { completedDays: number[]; currentDay: number; xp: number }) {
  const weekly = useMemo(() => {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const start = Math.max(1, currentDay - 6);
    return labels.map((label, i) => {
      const day = start + i;
      const done = completedDays.includes(day);
      return { label, xp: done ? 220 + ((day * 37) % 120) : day < currentDay ? 60 : 0, done: done ? 1 : 0 };
    });
  }, [completedDays, currentDay]);

  const xpTrend = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        week: `W${i + 1}`,
        xp: Math.round((xp / 8) * (i + 1) * (0.75 + ((i * 13) % 7) / 20)),
      })),
    [xp],
  );

  return (
    <div className="space-y-4">
      <div className="glass rounded-3xl p-4">
        <p className="mb-3 text-sm font-semibold">XP earned this week</p>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={weekly}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)", opacity: 0.3 }} />
            <Bar dataKey="xp" fill="var(--violet)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass rounded-3xl p-4">
        <p className="mb-3 text-sm font-semibold">XP progression</p>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={xpTrend}>
            <defs>
              <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--emerald)" stopOpacity={0.55} />
                <stop offset="100%" stopColor="var(--emerald)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="xp" stroke="var(--emerald)" strokeWidth={2.5} fill="url(#xpFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="glass rounded-3xl p-4">
        <p className="mb-3 text-sm font-semibold">Streak history</p>
        <ResponsiveContainer width="100%" height={130}>
          <LineChart data={weekly.map((w, i) => ({ label: w.label, streak: Math.max(0, i + (w.done ? 2 : 0)) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="streak" stroke="var(--orange)" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ContributionCalendar({ completedDays, currentDay }: { completedDays: number[]; currentDay: number }) {
  return (
    <div className="glass rounded-3xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold">Challenge calendar</p>
        <p className="text-[11px] text-muted-foreground">{completedDays.length}/60 days</p>
      </div>
      <div className="grid grid-cols-10 gap-1.5">
        {Array.from({ length: 60 }, (_, i) => i + 1).map((d) => {
          const done = completedDays.includes(d);
          const isToday = d === currentDay;
          const missed = !done && d < currentDay;
          return (
            <div
              key={d}
              title={`Day ${d}`}
              className={cn(
                "aspect-square rounded-[5px] transition-colors",
                done && "bg-emerald",
                missed && "bg-rose/40",
                isToday && "bg-violet ring-2 ring-violet/40",
                !done && !missed && !isToday && "bg-secondary",
              )}
            />
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <i className="size-2.5 rounded-[3px] bg-emerald" /> Done
        </span>
        <span className="inline-flex items-center gap-1">
          <i className="size-2.5 rounded-[3px] bg-violet" /> Today
        </span>
        <span className="inline-flex items-center gap-1">
          <i className="size-2.5 rounded-[3px] bg-rose/40" /> Missed
        </span>
        <span className="inline-flex items-center gap-1">
          <i className="size-2.5 rounded-[3px] bg-secondary" /> Upcoming
        </span>
      </div>
    </div>
  );
}
