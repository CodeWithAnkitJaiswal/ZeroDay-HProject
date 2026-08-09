import type { TrackId } from "./tracks";

export type DemoStudent = {
  id: string;
  name: string;
  email: string;
  college: string;
  track: TrackId;
  avatar: string;
  currentDay: number;
  streak: number;
  longestStreak: number;
  xp: number;
  level: number;
};

const av = (seed: string) =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,ffd5dc,d1d4f9`;

export const DEMO_STUDENTS: DemoStudent[] = [
  {
    id: "s1",
    name: "Ankit Sharma",
    email: "ankit@abtalks.in",
    college: "IIIT Bhopal",
    track: "frontend",
    avatar: av("Ankit"),
    currentDay: 18,
    streak: 12,
    longestStreak: 17,
    xp: 4820,
    level: 4,
  },
  {
    id: "s2",
    name: "Priya Nair",
    email: "priya@abtalks.in",
    college: "NIT Trichy",
    track: "aiml",
    avatar: av("Priya"),
    currentDay: 32,
    streak: 21,
    longestStreak: 24,
    xp: 8140,
    level: 5,
  },
  {
    id: "s3",
    name: "Rohan Verma",
    email: "rohan@abtalks.in",
    college: "VIT Vellore",
    track: "backend",
    avatar: av("Rohan"),
    currentDay: 12,
    streak: 7,
    longestStreak: 9,
    xp: 2960,
    level: 3,
  },
  {
    id: "s4",
    name: "Sneha Iyer",
    email: "sneha@abtalks.in",
    college: "PES University",
    track: "cyber",
    avatar: av("Sneha"),
    currentDay: 45,
    streak: 30,
    longestStreak: 30,
    xp: 11250,
    level: 6,
  },
  {
    id: "s5",
    name: "Aditya Rao",
    email: "aditya@abtalks.in",
    college: "IIT Kharagpur",
    track: "dsa",
    avatar: av("Aditya"),
    currentDay: 27,
    streak: 15,
    longestStreak: 19,
    xp: 6410,
    level: 4,
  },
  {
    id: "s6",
    name: "Fatima Khan",
    email: "fatima@abtalks.in",
    college: "Jamia Millia Islamia",
    track: "frontend",
    avatar: av("Fatima"),
    currentDay: 8,
    streak: 5,
    longestStreak: 5,
    xp: 1580,
    level: 2,
  },
];

export type LeaderRow = {
  rank: number;
  name: string;
  college: string;
  track: TrackId;
  avatar: string;
  streak: number;
  xp: number;
  level: number;
};

export const LEADERBOARD: LeaderRow[] = [
  ["Sneha Iyer", "PES University", "cyber", 30, 11250, 6],
  ["Priya Nair", "NIT Trichy", "aiml", 21, 8140, 5],
  ["Kabir Malhotra", "BITS Pilani", "backend", 24, 7890, 5],
  ["Aditya Rao", "IIT Kharagpur", "dsa", 15, 6410, 4],
  ["Meera Joshi", "COEP Pune", "frontend", 19, 5980, 4],
  ["Ankit Sharma", "IIIT Bhopal", "frontend", 12, 4820, 4],
  ["Tanvi Desai", "DAIICT", "aiml", 14, 4310, 3],
  ["Harsh Patel", "LD College", "backend", 11, 3720, 3],
  ["Rohan Verma", "VIT Vellore", "backend", 7, 2960, 3],
  ["Nikhil Reddy", "IIIT Hyderabad", "dsa", 9, 2540, 2],
].map(([name, college, track, streak, xp, level], i) => ({
  rank: i + 1,
  name: name as string,
  college: college as string,
  track: track as TrackId,
  avatar: av(name as string),
  streak: streak as number,
  xp: xp as number,
  level: level as number,
}));

export const TESTIMONIALS = [
  {
    name: "Ishita Bansal",
    college: "SRM Chennai",
    avatar: av("Ishita"),
    stars: 5,
    review:
      "I never coded daily before. 60 days later I had 9 projects on GitHub and 3 interview calls from LinkedIn.",
  },
  {
    name: "Manav Gupta",
    college: "Thapar University",
    avatar: av("Manav"),
    stars: 5,
    review: "The daily task + commit + post loop is addictive. My GitHub graph finally looks alive.",
  },
  {
    name: "Divya Menon",
    college: "Amrita Coimbatore",
    avatar: av("Divya"),
    stars: 5,
    review: "The DSA track got me from zero to solving mediums. Placed at a product company in my 6th semester.",
  },
  {
    name: "Sarthak Jain",
    college: "IIIT Delhi",
    avatar: av("Sarthak"),
    stars: 4,
    review: "Structured, gamified and honest. The streak pressure is exactly what a lazy student like me needed.",
  },
];

export const FAQS = [
  {
    q: "Is the 60 Days Challenge free?",
    a: "Yes. Every track, every day and every resource is completely free. You only invest 60–120 minutes a day.",
  },
  {
    q: "I am a complete beginner. Can I still join?",
    a: "Absolutely. Each track starts from fundamentals on Day 1 and gradually ramps up into projects by Day 60.",
  },
  {
    q: "What if I miss a day?",
    a: "Your streak resets, but your progress never disappears. You can pick up exactly where you left off — and milestone rewards give you a streak freeze.",
  },
  {
    q: "Why GitHub and LinkedIn every day?",
    a: "Recruiters search both. Daily commits prove consistency and daily posts build visibility. That combination is what gets interviews.",
  },
  {
    q: "Do I get a certificate?",
    a: "Finishing all 60 days unlocks the 60 Day Legend badge and a shareable completion certificate for your resume.",
  },
  {
    q: "Can I switch tracks midway?",
    a: "You can, from Settings inside the dashboard. Your XP stays, but the day timeline restarts for the new track.",
  },
];
