import type { TrackId } from "@/data/tracks";

export const LEVELS = [
  { level: 1, name: "Beginner", min: 0 },
  { level: 2, name: "Builder", min: 500 },
  { level: 3, name: "Developer", min: 1500 },
  { level: 4, name: "Engineer", min: 3500 },
  { level: 5, name: "Creator", min: 6500 },
  { level: 6, name: "Master", min: 10000 },
  { level: 7, name: "Legend", min: 15000 },
];

export const levelFor = (xp: number) => {
  let current = LEVELS[0]!;
  for (const l of LEVELS) if (xp >= l.min) current = l;
  const next = LEVELS.find((l) => l.min > xp);
  const span = (next?.min ?? current.min + 1) - current.min;
  const progress = next ? Math.min(100, Math.round(((xp - current.min) / span) * 100)) : 100;
  return { ...current, next, progress, toNext: next ? next.min - xp : 0 };
};

export const CHECKLIST_ITEMS = [
  { id: "understand", label: "Read & understand the topic", xp: 20 },
  { id: "task", label: "Complete today's task", xp: 100 },
  { id: "test", label: "Test your project / solution", xp: 20 },
  { id: "github", label: "Push GitHub commit", xp: 50 },
  { id: "linkedin", label: "Publish LinkedIn post", xp: 50 },
  { id: "reflect", label: "Write your reflection", xp: 20 },
] as const;

export const DASHBOARD_CHECKLIST = ["understand", "task", "github", "linkedin", "reflect"];

export const PROFILE_FIELDS = [
  "avatar",
  "college",
  "year",
  "branch",
  "city",
  "github",
  "linkedin",
  "bio",
  "skills",
  "goals",
  "codingTime",
  "phone",
] as const;

export type ProfileField = (typeof PROFILE_FIELDS)[number];

export const MILESTONES = [
  {
    id: "foundation",
    title: "Foundation",
    range: [1, 15] as const,
    reward: "Streak Freeze + Foundation Badge",
    message: "Fundamentals are boring until they make everything else easy.",
    accent: "violet" as const,
  },
  {
    id: "skill",
    title: "Skill Building",
    range: [16, 30] as const,
    reward: "Skill Badge + Resume Template",
    message: "This is where beginners quit and developers are born.",
    accent: "blue" as const,
  },
  {
    id: "projects",
    title: "Project Development",
    range: [31, 45] as const,
    reward: "Project Badge + Portfolio Kit",
    message: "Projects are proof. Ship something you would actually demo.",
    accent: "emerald" as const,
  },
  {
    id: "career",
    title: "Portfolio & Career",
    range: [46, 60] as const,
    reward: "60 Day Legend + Certificate",
    message: "Recruiters do not read promises. They read repositories.",
    accent: "orange" as const,
  },
];

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  accent: "violet" | "blue" | "emerald" | "orange" | "rose";
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-commit", name: "First Commit", description: "Submit your very first day", icon: "GitCommitHorizontal", accent: "violet" },
  { id: "streak-7", name: "7 Day Streak", description: "Show up 7 days in a row", icon: "Flame", accent: "orange" },
  { id: "streak-15", name: "15 Day Streak", description: "Two weeks of pure consistency", icon: "Flame", accent: "orange" },
  { id: "streak-30", name: "30 Day Streak", description: "One month unbroken", icon: "Trophy", accent: "emerald" },
  { id: "streak-45", name: "45 Day Streak", description: "Elite consistency", icon: "Crown", accent: "blue" },
  { id: "legend-60", name: "60 Day Legend", description: "Finish the entire challenge", icon: "Sparkles", accent: "rose" },
  { id: "github-beast", name: "GitHub Beast", description: "Push 10 GitHub commits", icon: "Github", accent: "violet" },
  { id: "linkedin-machine", name: "LinkedIn Machine", description: "Publish 10 LinkedIn posts", icon: "Linkedin", accent: "blue" },
  { id: "night-owl", name: "Night Owl", description: "Submit a task after 11 PM", icon: "Moon", accent: "violet" },
  { id: "early-bird", name: "Early Bird", description: "Submit a task before 8 AM", icon: "Sunrise", accent: "orange" },
  { id: "weekend-warrior", name: "Weekend Warrior", description: "Complete a weekend day", icon: "Swords", accent: "emerald" },
];

export const trackAccent: Record<TrackId, "violet" | "blue" | "emerald" | "orange" | "rose"> = {
  frontend: "violet",
  backend: "blue",
  aiml: "emerald",
  cyber: "orange",
  dsa: "rose",
};

export const accentClasses: Record<string, { text: string; bg: string; border: string; grad: string }> = {
  violet: { text: "text-violet", bg: "bg-violet/12", border: "border-violet/30", grad: "from-violet/25 to-blue/10" },
  blue: { text: "text-blue", bg: "bg-blue/12", border: "border-blue/30", grad: "from-blue/25 to-violet/10" },
  emerald: { text: "text-emerald", bg: "bg-emerald/12", border: "border-emerald/30", grad: "from-emerald/25 to-blue/10" },
  orange: { text: "text-orange", bg: "bg-orange/12", border: "border-orange/30", grad: "from-orange/25 to-rose/10" },
  rose: { text: "text-rose", bg: "bg-rose/12", border: "border-rose/30", grad: "from-rose/25 to-violet/10" },
};

export const difficultyAccent = (d: string) =>
  d.toLowerCase().startsWith("beg") ? "emerald" : d.toLowerCase().startsWith("inter") ? "orange" : "rose";
