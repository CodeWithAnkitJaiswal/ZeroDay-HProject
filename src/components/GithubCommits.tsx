import { useEffect, useState } from "react";
import { Github, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

type Result = { byDate: Record<string, number>; total: number; limited: boolean };

const parseUser = (v: string) =>
  v
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/^github\.com\//, "")
    .replace(/\/.*$/, "")
    .replace(/^@/, "");

const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

async function fetchCommits(user: string): Promise<Result> {
  const byDate: Record<string, number> = {};
  let total = 0;
  let limited = false;
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/events/public?per_page=100&page=${page}`);
    if (res.status === 404) throw new Error("GitHub user not found");
    if (res.status === 403) {
      limited = true;
      break;
    }
    if (!res.ok) throw new Error(`GitHub API error (${res.status})`);
    const events = (await res.json()) as { type: string; created_at: string; payload?: { commits?: unknown[] } }[];
    if (!events.length) break;
    for (const e of events) {
      if (e.type !== "PushEvent") continue;
      const n = e.payload?.commits?.length ?? 0;
      const k = key(new Date(e.created_at));
      byDate[k] = (byDate[k] ?? 0) + n;
      total += n;
    }
    if (events.length < 100) break;
  }
  return { byDate, total, limited };
}

export function GithubCommits() {
  const { state, update } = useApp();
  const saved = state.profile.github ? parseUser(state.profile.github) : "";
  const [value, setValue] = useState(saved);
  const [user, setUser] = useState(saved);
  const [data, setData] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchCommits(user)
      .then((r) => !cancelled && setData(r))
      .catch((e: Error) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [user]);

  const day = Math.min(60, Math.max(1, state.currentDay || 1));
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (day - 1));

  const days = Array.from({ length: 60 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return { day: i + 1, date: d, commits: data?.byDate[key(d)] ?? 0 };
  });
  const inRange = days.filter((d) => d.day <= day);
  const windowTotal = inRange.reduce((a, b) => a + b.commits, 0);
  const activeDays = inRange.filter((d) => d.commits > 0).length;

  const submit = () => {
    const u = parseUser(value);
    if (!u) return;
    setUser(u);
    update({ profile: { ...state.profile, github: `github.com/${u}` } });
  };

  return (
    <div className="glass rounded-3xl p-4">
      <div className="mb-3 flex items-center gap-2">
        <Github className="size-4" />
        <p className="text-sm font-semibold">GitHub commits across your 60 days</p>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="your-github-username"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <Button variant="premium" onClick={submit} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />} Fetch
        </Button>
      </div>

      {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
      {data?.limited && (
        <p className="mt-3 text-xs text-muted-foreground">
          GitHub rate limit reached — showing what we could load. Try again in a few minutes.
        </p>
      )}

      {user && !error && (
        <>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { k: "Commits", v: windowTotal },
              { k: "Active days", v: activeDays },
              { k: "Avg / day", v: day ? (windowTotal / day).toFixed(1) : "0" },
            ].map((m) => (
              <div key={m.k} className="rounded-2xl border border-border/60 bg-secondary/40 py-2">
                <p className="text-base font-bold tabular-nums">{m.v}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.k}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-10 gap-1.5 sm:grid-cols-12 lg:grid-cols-15">
            {days.map((d) => {
              const level = d.commits === 0 ? 0 : d.commits < 3 ? 1 : d.commits < 6 ? 2 : 3;
              const future = d.day > day;
              return (
                <div
                  key={d.day}
                  title={`Day ${d.day} · ${d.date.toLocaleDateString("en-IN")} · ${d.commits} commits`}
                  className={cn(
                    "grid aspect-square place-items-center rounded-lg text-[10px] font-semibold tabular-nums",
                    future && "bg-secondary/40 text-muted-foreground/50",
                    !future && level === 0 && "bg-secondary text-muted-foreground",
                    level === 1 && "bg-emerald/35 text-foreground",
                    level === 2 && "bg-emerald/65 text-background",
                    level === 3 && "bg-emerald text-background",
                  )}
                >
                  {d.day}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Public push events only — GitHub's public API covers roughly the last 90 days.
          </p>
        </>
      )}
    </div>
  );
}
