import frontend from "./frontend-60-day-coding-challenge.json";
import backend from "./backend-60-day-coding-challenge.json";
import aiml from "./ai-ml-60-day-coding-challenge.json";
import cyber from "./cybersecurity-60-day-challenge.json";
import dsa from "./dsa-60-day-challenge.json";
import messages from "./dashboardMessages.json";

export type ChallengeDay = {
  day: number;
  phase: string;
  topic: string;
  subtopic: string[];
  task: string;
  time: string;
  difficulty: string;
};

export type TrackId = "frontend" | "backend" | "aiml" | "cyber" | "dsa";

export type TrackMeta = {
  id: TrackId;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  accent: "violet" | "blue" | "emerald" | "orange" | "rose";
  difficulty: string;
  projects: number;
  skills: string[];
  days: ChallengeDay[];
};

export const TRACKS: TrackMeta[] = [
  {
    id: "frontend",
    name: "Frontend",
    tagline: "Interfaces people love",
    description: "HTML, CSS, JavaScript and React — ship pixel-perfect, responsive products.",
    icon: "Layout",
    accent: "violet",
    difficulty: "Beginner → Advanced",
    projects: 8,
    skills: ["HTML", "CSS", "JavaScript", "React", "Tailwind"],
    days: frontend as ChallengeDay[],
  },
  {
    id: "backend",
    name: "Backend",
    tagline: "APIs that scale",
    description: "Node.js, Express, databases, auth and deployment fundamentals.",
    icon: "Server",
    accent: "blue",
    difficulty: "Beginner → Advanced",
    projects: 7,
    skills: ["Node.js", "Express", "MongoDB", "SQL", "Auth"],
    days: backend as ChallengeDay[],
  },
  {
    id: "aiml",
    name: "AI / ML",
    tagline: "Models that think",
    description: "Python, NumPy, Pandas, ML algorithms and deep learning projects.",
    icon: "Brain",
    accent: "emerald",
    difficulty: "Intermediate",
    projects: 6,
    skills: ["Python", "NumPy", "Pandas", "Scikit-learn", "Deep Learning"],
    days: aiml as ChallengeDay[],
  },
  {
    id: "cyber",
    name: "Cyber Security",
    tagline: "Break it. Then defend it.",
    description: "Networking, Linux, cryptography, pentesting and blue-team defense.",
    icon: "ShieldCheck",
    accent: "orange",
    difficulty: "Intermediate",
    projects: 6,
    skills: ["Linux", "Networking", "Crypto", "Pentesting", "SIEM"],
    days: cyber as ChallengeDay[],
  },
  {
    id: "dsa",
    name: "DSA",
    tagline: "Crack the interview",
    description: "Arrays to graphs to DP — build the problem-solving muscle recruiters test.",
    icon: "Binary",
    accent: "rose",
    difficulty: "Beginner → Advanced",
    projects: 5,
    skills: ["Arrays", "Trees", "Graphs", "DP", "Complexity"],
    days: dsa as ChallengeDay[],
  },
];

export const getTrack = (id: TrackId | string | undefined): TrackMeta =>
  TRACKS.find((t) => t.id === id) ?? (TRACKS[0] as TrackMeta);

export const getDay = (trackId: TrackId | string | undefined, day: number): ChallengeDay | undefined =>
  getTrack(trackId).days.find((d) => d.day === day);

type Messages = {
  randomMessages: { id: number; category: string; message: string }[];
  dayMessages: { day: number; phase: number; message: string }[];
  streakMessages: { streak: number; message: string }[];
  timeBasedMessages: { title: string; message: string }[];
  completionMessages: { percent: number; message: string }[];
  achievementMessages: { id: number; achievement: string; message: string }[];
  weekendMessages: { id: number; message: string }[];
};

export const MESSAGES = messages as unknown as Messages;

export const randomMessage = (seed?: number) => {
  const list = MESSAGES.randomMessages;
  const i = seed === undefined ? Math.floor(Math.random() * list.length) : seed % list.length;
  return list[i]?.message ?? "Keep building.";
};

export const dayMessage = (day: number) =>
  MESSAGES.dayMessages.find((d) => d.day === day)?.message ?? randomMessage(day);

export const streakMessage = (streak: number) => {
  const found = [...MESSAGES.streakMessages].reverse().find((s) => streak >= s.streak);
  return found?.message ?? "Start your streak today.";
};
