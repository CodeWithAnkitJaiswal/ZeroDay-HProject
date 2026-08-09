import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Flame, Sparkles, Zap } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_STUDENTS } from "@/data/community";
import { TRACKS, type TrackId } from "@/data/tracks";
import { useApp } from "@/lib/store";
import { accentClasses, trackAccent } from "@/lib/gamify";
import { Icon, Pill } from "@/components/common";
import { cn } from "@/lib/utils";

export function OnboardingSheet({
  open,
  onOpenChange,
  presetTrack,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  presetTrack?: TrackId;
}) {
  const { update } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"choose" | "create">("choose");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [track, setTrack] = useState<TrackId>(presetTrack ?? "frontend");
  const [error, setError] = useState("");

  const finish = () => {
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required to start your streak.");
      return;
    }
    update({
      user: { id: crypto.randomUUID(), name: name.trim(), email: email.trim() },
      track,
      currentDay: 1,
      profile: {},
      baseXp: 0,
      streak: 0,
      longestStreak: 0,
      completedDays: [],
      dailySubmissions: {},
      checklists: {},
      lastLogin: new Date().toDateString(),
      loginDays: 1,
    });
    onOpenChange(false);
    void navigate({ to: "/dashboard" });
  };

  const pickDemo = (id: string) => {
    const s = DEMO_STUDENTS.find((d) => d.id === id);
    if (!s) return;
    const completed = Array.from({ length: s.currentDay - 1 }, (_, i) => i + 1);
    update({
      user: { id: s.id, name: s.name, email: s.email },
      track: s.track,
      currentDay: s.currentDay,
      completedDays: completed,
      profile: { avatar: s.avatar, college: s.college, github: `github.com/${s.name.split(" ")[0]?.toLowerCase()}` },
      baseXp: s.xp,
      streak: s.streak,
      longestStreak: s.longestStreak,
      dailySubmissions: {},
      checklists: {},
      lastLogin: new Date().toDateString(),
      loginDays: s.currentDay,
      streakFreeze: 1,
    });
    onOpenChange(false);
    void navigate({ to: "/dashboard" });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh] border-border bg-popover">
        <div className="mx-auto w-full max-w-lg overflow-y-auto px-4 pb-8">
          <DrawerHeader className="px-0 text-left">
            <DrawerTitle className="text-2xl">
              {mode === "choose" ? "Join the 60 Day Challenge" : "Create your profile"}
            </DrawerTitle>
            <DrawerDescription>
              {mode === "choose"
                ? "No password. No signup wall. Pick a demo student or start fresh."
                : "Three fields now. Everything else you can complete later for XP."}
            </DrawerDescription>
          </DrawerHeader>

          <AnimatePresence mode="wait">
            {mode === "choose" ? (
              <motion.div
                key="choose"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-3"
              >
                {DEMO_STUDENTS.map((s, i) => {
                  const a = accentClasses[trackAccent[s.track]]!;
                  return (
                    <motion.button
                      key={s.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => pickDemo(s.id)}
                      className="glass flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors hover:border-violet/40"
                    >
                      <img src={s.avatar} alt="" className="size-12 shrink-0 rounded-xl bg-secondary" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{s.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{s.college}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <Pill accent={trackAccent[s.track]}>{TRACKS.find((t) => t.id === s.track)?.name}</Pill>
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Flame className="size-3 text-orange" />
                            {s.streak}d
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Zap className="size-3 text-violet" />
                            {s.xp.toLocaleString("en-IN")} XP
                          </span>
                        </div>
                      </div>
                      <div className={cn("shrink-0 rounded-xl px-2.5 py-2 text-center", a.bg)}>
                        <p className="text-[10px] uppercase text-muted-foreground">Day</p>
                        <p className={cn("text-base font-bold leading-none", a.text)}>{s.currentDay}</p>
                      </div>
                    </motion.button>
                  );
                })}

                <Button variant="premium" size="lg" className="w-full" onClick={() => setMode("create")}>
                  <Sparkles className="size-4" /> Create New Profile
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="ob-name">Full name</Label>
                  <Input id="ob-name" placeholder="Ankit Sharma" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ob-email">Email</Label>
                  <Input
                    id="ob-email"
                    type="email"
                    placeholder="ankit@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Choose your track</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {TRACKS.map((t) => {
                      const a = accentClasses[t.accent]!;
                      const active = track === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTrack(t.id)}
                          className={cn(
                            "relative rounded-2xl border p-3 text-left transition-all",
                            active ? cn(a.bg, a.border, "glow-ring") : "border-border bg-secondary/40",
                          )}
                        >
                          <Icon name={t.icon} className={cn("size-5", active ? a.text : "text-muted-foreground")} />
                          <p className="mt-2 text-sm font-semibold">{t.name}</p>
                          <p className="text-[11px] text-muted-foreground">{t.tagline}</p>
                          {active && <Check className={cn("absolute right-2 top-2 size-4", a.text)} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="lg" onClick={() => setMode("choose")}>
                    <ArrowLeft className="size-4" /> Back
                  </Button>
                  <Button variant="premium" size="lg" className="flex-1" onClick={finish}>
                    Continue <ArrowRight className="size-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
