import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Flame, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTrack, randomMessage } from "@/data/tracks";
import { useApp } from "@/lib/store";
import { difficultyAccent, trackAccent } from "@/lib/gamify";
import { Confetti, EmptyState, Pill } from "@/components/common";
import { DayChecklist } from "@/components/DayChecklist";
import { SubmissionCard } from "@/components/SubmissionCard";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/day/$day")({
  head: ({ params }) => ({
    meta: [
      { title: `Day ${params.day} Challenge — ABTalks 60 Days` },
      { name: "description", content: `Your Day ${params.day} coding task, checklist and submission for the ABTalks 60 Days Challenge.` },
      { property: "og:title", content: `Day ${params.day} — ABTalks 60 Days Challenge` },
      { property: "og:description", content: "Complete the task, commit to GitHub, post on LinkedIn and keep your streak alive." },
    ],
  }),
  component: DayPage,
});

function DayPage() {
  const { day: dayParam } = Route.useParams();
  const { state, hydrated } = useApp();
  const navigate = useNavigate();
  const [confetti, setConfetti] = useState(false);

  const day = Number(dayParam);
  const track = getTrack(state.track);
  const data = track.days.find((d) => d.day === day);

  if (!hydrated) return <div className="min-h-screen bg-background" />;

  if (!data || day < 1 || day > 60) {
    return (
      <div className="hero-bg flex min-h-screen items-center justify-center px-4 pb-28">
        <EmptyState
          icon="SearchX"
          title="Day not found"
          description="Pick a day between 1 and 60."
          action={
            <Button variant="premium" asChild>
              <Link to="/dashboard">Back to dashboard</Link>
            </Button>
          }
        />
        <BottomNav />
      </div>
    );
  }

  const locked = day > state.currentDay;
  const submitted = Boolean(state.dailySubmissions[day]?.submittedAt);

  return (
    <div className="hero-bg min-h-screen pb-28">
      <Confetti show={confetti} />
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto grid max-w-3xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
          <Button variant="glass" size="icon" aria-label="Back" onClick={() => void navigate({ to: "/dashboard" })}>
            <ArrowLeft className="size-[18px]" />
          </Button>
          <div className="min-w-0 text-center">
            <p className="truncate text-sm font-bold">Day {day} of 60</p>
            <p className="truncate text-[11px] text-muted-foreground">{track.name}</p>
          </div>
          <Pill accent="orange">
            <Flame className="size-3" /> {state.streak}
          </Pill>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-5 px-4 py-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-strong relative overflow-hidden rounded-3xl p-4">
          <div className="absolute inset-x-0 top-0 h-24 bg-[image:var(--gradient-hero)] opacity-60" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-1.5">
              <Pill accent={trackAccent[state.track]}>{data.phase}</Pill>
              <Pill accent={difficultyAccent(data.difficulty)}>{data.difficulty}</Pill>
              {submitted && (
                <Pill accent="emerald">
                  <CheckCircle2 className="size-3" /> Submitted
                </Pill>
              )}
            </div>
            <h1 className="mt-2.5 text-2xl font-bold leading-tight">{data.topic}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" /> {data.time}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {data.subtopic.map((s) => (
                <span key={s} className="rounded-full bg-secondary/70 px-2.5 py-1 text-[11px]">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {locked ? (
          <EmptyState
            icon="Lock"
            title={`Day ${day} is locked`}
            description={`Finish Day ${state.currentDay} first — the challenge unlocks one day at a time.`}
            action={
              <Button variant="premium" asChild>
                <Link to="/day/$day" params={{ day: String(state.currentDay) }}>
                  Go to Day {state.currentDay} <ArrowRight className="size-4" />
                </Link>
              </Button>
            }
          />
        ) : (
          <>
            <div className="glass rounded-3xl p-4">
              <p className="text-sm font-semibold">Your task today</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{data.task}</p>
            </div>

            <div className="glass rounded-3xl p-4">
              <p className="mb-3 text-sm font-semibold">Daily checklist</p>
              <DayChecklist day={day} />
            </div>

            <SubmissionCard
              day={day}
              mode={day < state.currentDay ? "readonly" : "editable"}
              onSubmitted={() => {
                setConfetti(true);
                setTimeout(() => setConfetti(false), 2800);
              }}
            />

            <div className="glass rounded-3xl p-4 text-center text-sm italic text-muted-foreground">
              "{randomMessage()}"
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          <Button variant="glass" disabled={day <= 1} asChild={day > 1}>
            {day > 1 ? (
              <Link to="/day/$day" params={{ day: String(day - 1) }}>
                <ArrowLeft className="size-4" /> Day {day - 1}
              </Link>
            ) : (
              <span>
                <ArrowLeft className="size-4" /> Previous
              </span>
            )}
          </Button>
          <Button variant="glass" disabled={day >= 60} asChild={day < 60}>
            {day < 60 ? (
              <Link to="/day/$day" params={{ day: String(day + 1) }}>
                {day + 1 > state.currentDay ? <Lock className="size-4" /> : null} Day {day + 1}
                <ArrowRight className="size-4" />
              </Link>
            ) : (
              <span>
                Next <ArrowRight className="size-4" />
              </span>
            )}
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
