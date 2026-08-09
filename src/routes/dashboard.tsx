import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  ArrowRight,
  Bell,
  Clock,
  Flame,
  Gift,
  Quote,
  Snowflake,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTrack, randomMessage, streakMessage, type ChallengeDay } from "@/data/tracks";
import { useApp, greeting } from "@/lib/store";
import { DASHBOARD_CHECKLIST, accentClasses, difficultyAccent, trackAccent } from "@/lib/gamify";
import { Confetti, Counter, EmptyState, Icon, Pill, ProgressRing } from "@/components/common";
import { DayChecklist } from "@/components/DayChecklist";
import { JourneyMap } from "@/components/JourneyMap";
import { AchievementsGrid } from "@/components/AchievementsGrid";
import { LeaderboardList } from "@/components/LeaderboardList";
import { ContributionCalendar, WeeklyCharts } from "@/components/DashboardCharts";
import { ProfileModal } from "@/components/ProfileModal";
import { SettingsSheet } from "@/components/SettingsSheet";
import { OnboardingSheet } from "@/components/OnboardingSheet";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Dashboard — ABTalks 60 Days Challenge" },
      { name: "description", content: "Track your streak, XP, level, daily task and 60-day journey in one place." },
      { property: "og:title", content: "Your ABTalks Dashboard" },
      { property: "og:description", content: "Streak, XP, daily task and journey map for your 60 day challenge." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { state, hydrated, xp, level, profileCompletion, completionPercent, rank, unlockedAchievements, update } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const navigate = useNavigate();

  const track = getTrack(state.track);
  const day = Math.min(60, Math.max(1, state.currentDay || 1));
  const today: ChallengeDay | undefined = track.days.find((d) => d.day === day);
  const quote = useMemo(() => randomMessage(), []);
  const a = accentClasses[trackAccent[state.track]]!;

  useEffect(() => {
    if (hydrated && state.user && state.settings.notifications) {
      const t = setTimeout(() => {
        toast(`Today's task is ready — Day ${day}`, { description: today?.topic ?? "Open your challenge" });
      }, 900);
      return () => clearTimeout(t);
    }
    return;
  }, [hydrated, state.user, state.settings.notifications, day, today?.topic]);

  if (!hydrated) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!state.user) {
    return (
      <div className="hero-bg flex min-h-screen flex-col items-center justify-center gap-4 px-4 pb-28">
        <EmptyState
          icon="UserPlus"
          title="No profile yet"
          description="Pick a demo student or create a profile to unlock your dashboard, streak and daily tasks."
          action={
            <Button variant="premium" size="lg" onClick={() => setJoinOpen(true)}>
              Start the challenge <ArrowRight className="size-4" />
            </Button>
          }
        />
        <OnboardingSheet open={joinOpen} onOpenChange={setJoinOpen} />
        <BottomNav />
      </div>
    );
  }

  const checked = state.checklists[day] ?? [];
  const dashDone = DASHBOARD_CHECKLIST.filter((c) => checked.includes(c)).length;
  const nextBadgeDays = [7, 15, 30, 45, 60].find((n) => state.streak < n);
  const canSpin = state.spinDate !== new Date().toDateString();

  const spin = () => {
    const rewards = ["+120 Bonus XP", "🧊 Streak Freeze", "🎖 Mystery Badge", "+60 Bonus XP", "🔥 Double XP Day"];
    const reward = rewards[Math.floor(Math.random() * rewards.length)]!;
    update((s) => ({
      spinDate: new Date().toDateString(),
      spinReward: reward,
      baseXp: s.baseXp + (reward.includes("XP") ? Number(reward.replace(/\D/g, "")) : 0),
      streakFreeze: reward.includes("Freeze") ? s.streakFreeze + 1 : s.streakFreeze,
    }));
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2600);
    toast.success(`Daily reward: ${reward}`);
  };

  return (
    <div className="hero-bg min-h-screen pb-28">
      <Confetti show={confetti} />

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto grid max-w-3xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <p className="truncate text-[13px] text-muted-foreground">{greeting()},</p>
            <h1 className="truncate text-lg font-bold">{state.user.name.split(" ")[0]} 👋</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="glass" size="icon" aria-label="Notifications" onClick={() => toast("Streak warning: submit before midnight to keep your streak alive.")}>
              <Bell className="size-[18px]" />
            </Button>
            <SettingsSheet />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-5 px-4 py-5">
        {/* motivational */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-4">
          <Quote className="size-4 text-violet" />
          <p className="mt-1.5 text-[15px] font-medium italic">"{quote}"</p>
          <p className="mt-1 text-xs text-muted-foreground">{streakMessage(state.streak)}</p>
        </motion.div>

        {/* profile card */}
        <div className="glass-strong relative overflow-hidden rounded-3xl p-4">
          <div className={cn("absolute inset-x-0 top-0 h-28 bg-gradient-to-b opacity-50", a.grad)} />
          <div className="relative">
            <div className="flex items-center gap-3">
              <img
                src={state.profile.avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${state.user.name}`}
                alt=""
                className="size-14 shrink-0 rounded-2xl bg-secondary"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{state.user.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {state.profile.college || "Add your college"} · {track.name}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <Pill accent="orange">
                    <Flame className="size-3" /> {state.streak} day streak
                  </Pill>
                  <Pill accent="violet">Lvl {level.level} · {level.name}</Pill>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center sm:grid-cols-6">
              {[
                { k: "Day", v: day },
                { k: "Streak", v: state.streak },
                { k: "Best", v: state.longestStreak },
                { k: "XP", v: xp },
                { k: "Level", v: level.level },
                { k: "Rank", v: rank },
              ].map((m) => (
                <div key={m.k} className="rounded-2xl bg-secondary/50 py-2">
                  <Counter to={m.v} className="text-base font-bold" />
                  <p className="text-[10px] text-muted-foreground">{m.k}</p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Profile completion</span>
                <span className="font-bold text-violet">{profileCompletion}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full rounded-full bg-[image:var(--gradient-violet)]"
                  animate={{ width: `${profileCompletion}%` }}
                />
              </div>
              {profileCompletion < 100 && (
                <Button variant="glass" size="sm" className="mt-2.5 w-full" onClick={() => setProfileOpen(true)}>
                  <Trophy className="size-4 text-orange" /> Complete profile to unlock 🏆 Profile Pro
                </Button>
              )}
            </div>

            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Level progress</span>
                <span>{level.next ? `${level.toNext} XP to ${level.next.name}` : "Max level"}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                <motion.div className="h-full rounded-full bg-[image:var(--gradient-emerald)]" animate={{ width: `${level.progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* progress ring */}
        <div className="glass flex flex-col items-center gap-3 rounded-3xl p-5 sm:flex-row sm:justify-around">
          <ProgressRing value={completionPercent}>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Day</p>
              <p className="text-4xl font-bold leading-none">{day}</p>
              <p className="mt-1 text-sm font-semibold text-violet">{completionPercent}%</p>
            </div>
          </ProgressRing>
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">{state.completedDays.length} / 60 days completed</p>
            {nextBadgeDays && (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-orange/12 px-3 py-1.5 text-xs font-semibold text-orange">
                <Sparkles className="size-3.5" /> {nextBadgeDays - state.streak} days to the {nextBadgeDays} Day badge
              </p>
            )}
            {state.streakFreeze > 0 && (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue/12 px-3 py-1.5 text-xs font-semibold text-blue">
                <Snowflake className="size-3.5" /> {state.streakFreeze} streak freeze available
              </p>
            )}
          </div>
        </div>

        {/* daily reward */}
        <div className="glass flex items-center gap-3 rounded-3xl p-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-orange/12">
            <Gift className={cn("size-5 text-orange", canSpin && "animate-flame")} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Daily reward</p>
            <p className="truncate text-xs text-muted-foreground">
              {canSpin ? "Spin the wheel once every day" : `Today: ${state.spinReward}`}
            </p>
          </div>
          <Button size="sm" variant={canSpin ? "streak" : "outline"} disabled={!canSpin} onClick={spin}>
            {canSpin ? "Spin" : "Claimed"}
          </Button>
        </div>

        {/* today's task */}
        {today ? (
          <div className="glass-strong relative overflow-hidden rounded-3xl p-4">
            <div className="absolute inset-x-0 top-0 h-24 bg-[image:var(--gradient-hero)] opacity-60" />
            <div className="relative">
              <div className="flex items-center justify-between gap-2">
                <Pill accent={trackAccent[state.track]}>{today.phase}</Pill>
                <Pill accent={difficultyAccent(today.difficulty)}>{today.difficulty}</Pill>
              </div>
              <h2 className="mt-2.5 text-xl font-bold">{today.topic}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5" /> {today.time} · Day {day} of 60
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {today.subtopic.map((s) => (
                  <span key={s} className="rounded-full bg-secondary/70 px-2.5 py-1 text-[11px]">
                    {s}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{today.task}</p>
              <Button
                size="xl"
                variant="premium"
                className="mt-4 w-full"
                onClick={() => void navigate({ to: "/day/$day", params: { day: String(day) } })}
              >
                Open Today's Challenge <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <EmptyState icon="PartyPopper" title="Challenge complete!" description="You finished all 60 days. Legend status unlocked." />
        )}

        {/* consistency nudge */}
        {dashDone < DASHBOARD_CHECKLIST.length && (
          <div className="flex items-center gap-3 rounded-3xl border border-orange/30 bg-orange/10 p-4">
            <Flame className="size-5 shrink-0 animate-flame text-orange" />
            <p className="text-sm">
              You're only <strong>{DASHBOARD_CHECKLIST.length - dashDone} step</strong>
              {DASHBOARD_CHECKLIST.length - dashDone > 1 ? "s" : ""} away from keeping your streak alive today.
            </p>
          </div>
        )}

        {/* checklist */}
        <div className="glass rounded-3xl p-4">
          <p className="mb-3 text-sm font-semibold">Today's checklist</p>
          <DayChecklist day={day} only={DASHBOARD_CHECKLIST} onComplete={() => { setConfetti(true); setTimeout(() => setConfetti(false), 2600); toast.success("Checklist complete! 🎉"); }} />
        </div>

        {/* tabs */}
        <Tabs defaultValue="journey">
          <TabsList className="grid w-full grid-cols-4 rounded-2xl bg-secondary/60">
            <TabsTrigger value="journey" className="rounded-xl text-xs">Journey</TabsTrigger>
            <TabsTrigger value="stats" className="rounded-xl text-xs">Stats</TabsTrigger>
            <TabsTrigger value="badges" className="rounded-xl text-xs">Badges</TabsTrigger>
            <TabsTrigger value="rank" className="rounded-xl text-xs">Rank</TabsTrigger>
          </TabsList>
          <TabsContent value="journey" className="mt-4">
            <JourneyMap completedDays={state.completedDays} currentDay={day} />
          </TabsContent>
          <TabsContent value="stats" className="mt-4 space-y-4">
            <ContributionCalendar completedDays={state.completedDays} currentDay={day} />
            <WeeklyCharts completedDays={state.completedDays} currentDay={day} xp={xp} />
          </TabsContent>
          <TabsContent value="badges" className="mt-4">
            {unlockedAchievements.length === 0 ? (
              <EmptyState icon="Medal" title="No badges yet" description="Submit your first day to unlock the First Commit badge." />
            ) : (
              <AchievementsGrid unlocked={unlockedAchievements} />
            )}
          </TabsContent>
          <TabsContent value="rank" className="mt-4">
            <LeaderboardList limit={10} you={{ name: state.user.name, xp, rank }} />
          </TabsContent>
        </Tabs>

        <div className="glass flex items-center gap-3 rounded-3xl p-4">
          <Zap className="size-5 shrink-0 text-violet" />
          <p className="text-sm text-muted-foreground">
            Keep going —{" "}
            <Link to="/day/$day" params={{ day: String(day) }} className="font-semibold text-foreground underline underline-offset-4">
              Day {day}
            </Link>{" "}
            is waiting.
          </p>
        </div>
      </main>

      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
      <BottomNav />
    </div>
  );
}
