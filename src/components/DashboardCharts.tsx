import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--foreground)",
  boxShadow: "var(--shadow-soft)",
};

const PALETTE = [
  "var(--violet)",
  "var(--blue)",
  "var(--emerald)",
  "var(--orange)",
  "var(--cyan)",
  "var(--pink)",
  "var(--amber)",
];

function Panel({
  title,
  hint,
  children,
  className,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass rounded-3xl p-4", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="truncate text-sm font-semibold">{title}</p>
        {hint && <p className="shrink-0 text-[11px] text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

export function WeeklyCharts({
  completedDays,
  currentDay,
  xp,
}: {
  completedDays: number[];
  currentDay: number;
  xp: number;
}) {
  const weekly = useMemo(() => {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const start = Math.max(1, currentDay - 6);
    return labels.map((label, i) => {
      const day = start + i;
      const done = completedDays.includes(day);
      return {
        label,
        day,
        xp: done ? 220 + ((day * 37) % 120) : day < currentDay ? 60 : 0,
        minutes: done ? 45 + ((day * 23) % 60) : day < currentDay ? 15 : 0,
        done: done ? 1 : 0,
      };
    });
  }, [completedDays, currentDay]);

  const xpTrend = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        week: `W${i + 1}`,
        xp: Math.round((xp / 8) * (i + 1) * (0.75 + ((i * 13) % 7) / 20)),
        target: Math.round((xp / 8) * (i + 1) * 1.1),
      })),
    [xp],
  );

  const done = completedDays.length;
  const missed = Math.max(0, currentDay - 1 - done);
  const upcoming = Math.max(0, 60 - done - missed);
  const split = [
    { name: "Completed", value: done, color: "var(--emerald)" },
    { name: "Missed", value: missed, color: "var(--rose)" },
    { name: "Upcoming", value: upcoming, color: "var(--blue)" },
  ].filter((d) => d.value > 0);

  const rings = [
    { name: "Days", value: Math.round((done / 60) * 100), fill: "var(--violet)" },
    { name: "Week", value: Math.round((weekly.filter((w) => w.done).length / 7) * 100), fill: "var(--emerald)" },
    { name: "XP goal", value: Math.min(100, Math.round((xp / 6000) * 100)), fill: "var(--orange)" },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="XP earned this week" hint="last 7 days">
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={weekly} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} width={38} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)", opacity: 0.35 }} />
            <Bar dataKey="xp" radius={[10, 10, 4, 4]}>
              {weekly.map((d, i) => (
                <Cell key={d.label} fill={PALETTE[i % PALETTE.length]} fillOpacity={d.xp ? 1 : 0.25} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Goal rings" hint="progress %">
        <ResponsiveContainer width="100%" height={190}>
          <RadialBarChart data={rings} innerRadius="35%" outerRadius="100%" startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "var(--muted)" }} />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }}
              formatter={(_, entry, i) => `${rings[i]?.name} · ${rings[i]?.value}%`}
            />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
          </RadialBarChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="XP progression" hint="8 weeks">
        <ResponsiveContainer width="100%" height={190}>
          <AreaChart data={xpTrend} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--violet)" stopOpacity={0.6} />
                <stop offset="100%" stopColor="var(--violet)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="targetFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--cyan)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--cyan)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} width={38} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }} />
            <Area type="monotone" name="Target" dataKey="target" stroke="var(--cyan)" strokeWidth={2} fill="url(#targetFill)" />
            <Area type="monotone" name="Your XP" dataKey="xp" stroke="var(--violet)" strokeWidth={2.5} fill="url(#xpFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="60 day split" hint={`${done} completed`}>
        <ResponsiveContainer width="100%" height={190}>
          <PieChart>
            <Pie data={split} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="82%" paddingAngle={3} stroke="none">
              {split.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n) => [`${v} days`, n as string]} />
          </PieChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Coding minutes" hint="this week" className="lg:col-span-2">
        <ResponsiveContainer width="100%" height={170}>
          <LineChart data={weekly} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="minStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--orange)" />
                <stop offset="50%" stopColor="var(--pink)" />
                <stop offset="100%" stopColor="var(--violet)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} width={38} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v} min`} />
            <Line
              type="monotone"
              name="Minutes"
              dataKey="minutes"
              stroke="url(#minStroke)"
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--background)", strokeWidth: 2, stroke: "var(--pink)" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Panel>
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
      <div className="grid grid-cols-10 gap-1.5 sm:grid-cols-12 lg:grid-cols-15">
        {Array.from({ length: 60 }, (_, i) => i + 1).map((d) => {
          const done = completedDays.includes(d);
          const isToday = d === currentDay;
          const missed = !done && d < currentDay;
          const upcoming = !done && !missed && !isToday;
          const label = missed
            ? `Day ${d} — missed`
            : done
              ? `Day ${d} — completed`
              : isToday
                ? `Day ${d} — today`
                : `Day ${d} — upcoming`;
          return (
            <Link
              key={d}
              to="/day/$day"
              params={{ day: String(d) }}
              title={label}
              aria-label={label}
              className={cn(
                "grid aspect-square place-items-center rounded-lg text-[11px] font-semibold tabular-nums transition-transform hover:scale-[1.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                done && "bg-emerald text-background",
                missed && "bg-rose text-background ring-1 ring-rose/50",
                isToday && "bg-violet text-background ring-2 ring-violet/40",
                upcoming && "bg-secondary text-muted-foreground",
              )}
            >
              {d}
            </Link>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <i className="size-2.5 rounded-[3px] bg-emerald" /> Done
        </span>
        <span className="inline-flex items-center gap-1">
          <i className="size-2.5 rounded-[3px] bg-violet" /> Today
        </span>
        <span className="inline-flex items-center gap-1">
          <i className="size-2.5 rounded-[3px] bg-rose" /> Missed
        </span>
        <span className="inline-flex items-center gap-1">
          <i className="size-2.5 rounded-[3px] bg-secondary" /> Upcoming
        </span>
        <span className="ml-auto">Tap any day to open it</span>
      </div>
    </div>
  );
}
