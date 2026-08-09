import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  Check,
  Flame,
  Github,
  Instagram,
  Linkedin,
  MessageCircle,
  Rocket,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { TRACKS } from "@/data/tracks";
import { FAQS, TESTIMONIALS } from "@/data/community";
import { accentClasses } from "@/lib/gamify";
import { Counter, FloatingBackdrop, Icon, Pill, SectionTitle } from "@/components/common";
import { OnboardingSheet } from "@/components/OnboardingSheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LeaderboardList } from "@/components/LeaderboardList";
import { BottomNav } from "@/components/BottomNav";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ABTalks 60 Days Coding Challenge — Become Job Ready" },
      {
        name: "description",
        content:
          "Build every day for 60 days. Daily coding tasks, GitHub commits, LinkedIn posts and a portfolio recruiters actually notice. Free for Indian college students.",
      },
      { property: "og:title", content: "ABTalks 60 Days Coding Challenge" },
      {
        property: "og:description",
        content: "One commit every day. One better developer every day. Pick a track and start your streak.",
      },
    ],
  }),
  component: Landing,
});

const STEPS = [
  { title: "Choose your track", desc: "Frontend, Backend, AI/ML, Cyber or DSA.", icon: "Compass", accent: "violet" },
  { title: "Complete today's task", desc: "60–120 focused minutes. That's it.", icon: "Target", accent: "blue" },
  { title: "Push a GitHub commit", desc: "Proof of work, every single day.", icon: "Github", accent: "emerald" },
  { title: "Post on LinkedIn", desc: "Build visibility while you learn.", icon: "Linkedin", accent: "blue" },
  { title: "Build your portfolio", desc: "Ship real projects, not tutorials.", icon: "FolderGit2", accent: "orange" },
  { title: "Become recruiter ready", desc: "Streak + repos + posts = interviews.", icon: "BriefcaseBusiness", accent: "rose" },
];

const BENEFITS = [
  { title: "Build Portfolio", icon: "FolderGit2", accent: "violet" },
  { title: "Daily Consistency", icon: "Flame", accent: "orange" },
  { title: "GitHub Growth", icon: "Github", accent: "emerald" },
  { title: "LinkedIn Visibility", icon: "Linkedin", accent: "blue" },
  { title: "Interview Prep", icon: "MessagesSquare", accent: "rose" },
  { title: "Resume Projects", icon: "FileCode2", accent: "violet" },
  { title: "Community", icon: "Users", accent: "emerald" },
  { title: "Recruiter Visibility", icon: "Eye", accent: "orange" },
];

function Landing() {
  const [open, setOpen] = useState(false);
  const { state } = useApp();

  return (
    <div className="hero-bg relative min-h-screen pb-28">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-violet)]">
              <Rocket className="size-4 text-primary-foreground" />
            </div>
            <p className="truncate text-sm font-bold">
              ABTalks <span className="text-muted-foreground">· 60 Days</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            {state.user ? (
              <Button size="sm" variant="premium" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button size="sm" variant="premium" onClick={() => setOpen(true)}>
                Start
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-14 pt-10">
        <FloatingBackdrop />
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Pill accent="emerald" className="mb-4">
              <Flame className="size-3" /> 25,000+ students building daily
            </Pill>
            <h1 className="text-[34px] font-bold leading-[1.08] sm:text-6xl">
              Build Every Day.
              <br />
              <span className="gradient-text">Get Hired Faster.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-[15px] text-muted-foreground sm:text-lg">
              One task, one commit and one LinkedIn post a day for 60 days. You finish with a portfolio, a streak and a
              GitHub graph recruiters can't ignore.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:justify-center"
          >
            <Button size="xl" variant="premium" className="w-full sm:w-auto" onClick={() => setOpen(true)}>
              Start 60 Day Challenge <ArrowRight className="size-4" />
            </Button>
            <Button size="xl" variant="glass" className="w-full sm:w-auto" asChild>
              <a href="#tracks">View Tracks</a>
            </Button>
          </motion.div>

          <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
            {[
              { label: "Students", value: 25000, suffix: "+" },
              { label: "GitHub commits", value: 120000, suffix: "+" },
              { label: "LinkedIn posts", value: 86000, suffix: "+" },
              { label: "Projects built", value: 41000, suffix: "+" },
              { label: "Satisfaction", value: 95, suffix: "%" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="glass rounded-2xl px-3 py-3 text-left last:col-span-2 sm:last:col-span-1"
              >
                <Counter to={s.value} suffix={s.suffix} className="text-xl font-bold gradient-text" />
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <SectionTitle eyebrow="How it works" title="Six steps. Sixty days." subtitle="A loop simple enough to repeat daily." />
          <div className="relative">
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-violet via-blue to-emerald sm:hidden" />
            <div className="grid gap-3 sm:grid-cols-3">
              {STEPS.map((s, i) => {
                const a = accentClasses[s.accent]!;
                return (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="glass relative flex items-start gap-3 rounded-2xl p-3.5"
                  >
                    <div className={cn("grid size-10 shrink-0 place-items-center rounded-xl", a.bg)}>
                      <Icon name={s.icon} className={cn("size-5", a.text)} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Step {i + 1}
                      </p>
                      <p className="truncate font-semibold">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* TRACKS */}
      <section id="tracks" className="scroll-mt-16 px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <SectionTitle eyebrow="Tracks" title="Pick your 60 days" subtitle="Five career tracks. Same daily rhythm." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TRACKS.map((t, i) => {
              const a = accentClasses[t.accent]!;
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass group relative overflow-hidden rounded-3xl p-4"
                >
                  <div className={cn("absolute inset-x-0 top-0 h-28 bg-gradient-to-b opacity-50", a.grad)} />
                  <div className="relative">
                    <div className={cn("grid size-11 place-items-center rounded-2xl", a.bg)}>
                      <Icon name={t.icon} className={cn("size-5", a.text)} />
                    </div>
                    <h3 className="mt-3 text-lg font-bold">{t.name}</h3>
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {t.skills.slice(0, 4).map((s) => (
                        <span key={s} className="rounded-full bg-secondary/70 px-2 py-0.5 text-[10px] text-muted-foreground">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      {[
                        { k: "Days", v: "60" },
                        { k: "Projects", v: String(t.projects) },
                        { k: "Level", v: t.difficulty.split(" ")[0] ?? "Beginner" },
                      ].map((m) => (
                        <div key={m.k} className="rounded-xl bg-secondary/50 py-1.5">
                          <p className="text-sm font-bold">{m.v}</p>
                          <p className="text-[10px] text-muted-foreground">{m.k}</p>
                        </div>
                      ))}
                    </div>
                    <Button variant="glass" className="mt-3 w-full" onClick={() => setOpen(true)}>
                      Start {t.name} <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <SectionTitle eyebrow="Benefits" title="What 60 days actually gives you" />
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {BENEFITS.map((b, i) => {
              const a = accentClasses[b.accent]!;
              return (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="glass flex flex-col items-start gap-2 rounded-2xl p-3.5"
                >
                  <div className={cn("grid size-9 place-items-center rounded-xl", a.bg)}>
                    <Icon name={b.icon} className={cn("size-4", a.text)} />
                  </div>
                  <p className="text-sm font-semibold leading-tight">{b.title}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LEADERBOARD */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <SectionTitle eyebrow="Leaderboard" title="This week's top builders" subtitle="XP is earned, never bought." />
          <LeaderboardList limit={5} />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <SectionTitle eyebrow="Students" title="Real streaks. Real offers." />
          <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent>
              {TESTIMONIALS.map((t) => (
                <CarouselItem key={t.name} className="basis-[85%] sm:basis-1/2">
                  <div className="glass h-full rounded-3xl p-4">
                    <div className="flex items-center gap-3">
                      <img src={t.avatar} alt="" className="size-11 rounded-xl bg-secondary" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{t.name}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{t.college}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-0.5">
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <Star key={i} className="size-3.5 fill-orange text-orange" />
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">"{t.review}"</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* COMMUNITY STATS */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <SectionTitle eyebrow="Community" title="You won't be building alone" />
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {[
              { label: "Students joined", value: 25400, icon: "Users", accent: "violet" },
              { label: "Projects built", value: 41200, icon: "FolderGit2", accent: "emerald" },
              { label: "GitHub commits", value: 120500, icon: "Github", accent: "blue" },
              { label: "LinkedIn posts", value: 86300, icon: "Linkedin", accent: "blue" },
              { label: "Daily active", value: 7800, icon: "Flame", accent: "orange" },
              { label: "Countries", value: 14, icon: "Globe2", accent: "rose" },
            ].map((s, i) => {
              const a = accentClasses[s.accent]!;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl p-3.5"
                >
                  <Icon name={s.icon} className={cn("size-4", a.text)} />
                  <Counter to={s.value} suffix="+" className="mt-2 block text-xl font-bold" />
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <SectionTitle eyebrow="FAQ" title="Questions students ask" />
          <Accordion type="single" collapsible className="glass rounded-3xl px-4">
            {FAQS.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-border">
                <AccordionTrigger className="text-left text-sm font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 py-10">
        <div className="glass-strong relative mx-auto max-w-3xl overflow-hidden rounded-3xl p-6 text-center">
          <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-70" />
          <div className="relative">
            <Zap className="mx-auto size-7 text-orange" />
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Day 1 starts the moment you decide</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              No fees, no signup wall, no excuses. Just 60 days of showing up.
            </p>
            <Button size="xl" variant="premium" className="mt-5 w-full sm:w-auto" onClick={() => setOpen(true)}>
              Start 60 Day Challenge <ArrowRight className="size-4" />
            </Button>
            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              {["100% free", "Beginner friendly", "Mobile first", "Certificate on Day 60"].map((x) => (
                <span key={x} className="inline-flex items-center gap-1">
                  <Check className="size-3 text-emerald" /> {x}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 px-4 py-8">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-xl bg-[image:var(--gradient-violet)]">
                <Rocket className="size-4 text-primary-foreground" />
              </div>
              <p className="font-bold">ABTalks</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Helping Indian college students become consistent, employable developers — 60 days at a time.
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Useful links</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>
                <a href="#tracks" className="hover:text-foreground">
                  Tracks
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-foreground">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/day/$day" params={{ day: "12" }} className="hover:text-foreground">
                  Today's challenge
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact</p>
            <p className="text-sm text-muted-foreground">hello@abtalks.in</p>
            <div className="mt-3 flex gap-2">
              {[Github, Linkedin, Instagram, MessageCircle].map((I, i) => (
                <span key={i} className="glass grid size-9 place-items-center rounded-xl">
                  <I className="size-4 text-muted-foreground" />
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-5xl text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} ABTalks. Built for students who show up.
        </p>
      </footer>

      <OnboardingSheet open={open} onOpenChange={setOpen} />
      <BottomNav />
    </div>
  );
}
