import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CHECKLIST_ITEMS, PROFILE_FIELDS, levelFor } from "./gamify";
import { TRACKS, type TrackId } from "@/data/tracks";
import { LEADERBOARD } from "@/data/community";

export type Profile = {
  avatar?: string;
  college?: string;
  year?: string;
  branch?: string;
  city?: string;
  github?: string;
  linkedin?: string;
  bio?: string;
  skills?: string;
  goals?: string;
  codingTime?: string;
  phone?: string;
};

export type Submission = {
  day: number;
  github: string;
  linkedin: string;
  notes: string;
  screenshot?: string;
  submittedAt: string;
};

export type Settings = {
  reminders: boolean;
  notifications: boolean;
  emailReminders: boolean;
  codingTime: string;
};

export type AppState = {
  user: { id: string; name: string; email: string } | null;
  track: TrackId;
  currentDay: number;
  completedDays: number[];
  profile: Profile;
  baseXp: number;
  streak: number;
  longestStreak: number;
  dailySubmissions: Record<number, Submission>;
  checklists: Record<number, string[]>;
  achievements: string[];
  settings: Settings;
  streakFreeze: number;
  lastLogin: string | null;
  loginDays: number;
  spinDate: string | null;
  spinReward: string | null;
};

const KEY = "abtalks.state.v1";

export const initialState: AppState = {
  user: null,
  track: "frontend",
  currentDay: 1,
  completedDays: [],
  profile: {},
  baseXp: 0,
  streak: 0,
  longestStreak: 0,
  dailySubmissions: {},
  checklists: {},
  achievements: [],
  settings: { reminders: true, notifications: true, emailReminders: false, codingTime: "Evening" },
  streakFreeze: 0,
  lastLogin: null,
  loginDays: 0,
  spinDate: null,
  spinReward: null,
};

const load = (): AppState => {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initialState;
    return { ...initialState, ...(JSON.parse(raw) as AppState) };
  } catch {
    return initialState;
  }
};

type Ctx = {
  state: AppState;
  hydrated: boolean;
  update: (patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
  reset: () => void;
  toggleCheck: (day: number, id: string) => void;
  submitDay: (s: Submission) => void;
  xp: number;
  level: ReturnType<typeof levelFor>;
  profileCompletion: number;
  completionPercent: number;
  rank: number;
  unlockedAchievements: string[];
};

const AppContext = createContext<Ctx | null>(null);

export const computeXp = (s: AppState) => {
  let xp = s.baseXp;
  for (const items of Object.values(s.checklists)) {
    for (const id of items) xp += CHECKLIST_ITEMS.find((c) => c.id === id)?.xp ?? 0;
  }
  xp += Object.keys(s.dailySubmissions).length * 100;
  xp += PROFILE_FIELDS.filter((f) => !!s.profile[f]).length * 10;
  xp += s.loginDays * 5;
  return xp;
};

export const computeProfileCompletion = (s: AppState) => {
  const total = PROFILE_FIELDS.length + 2; // name + email always present after signup
  const filled = PROFILE_FIELDS.filter((f) => !!s.profile[f]).length + (s.user ? 2 : 0);
  return Math.round((filled / total) * 100);
};

const computeAchievements = (s: AppState, xp: number) => {
  const out = new Set(s.achievements);
  const subs = Object.values(s.dailySubmissions);
  if (subs.length >= 1) out.add("first-commit");
  if (s.longestStreak >= 7) out.add("streak-7");
  if (s.longestStreak >= 15) out.add("streak-15");
  if (s.longestStreak >= 30) out.add("streak-30");
  if (s.longestStreak >= 45) out.add("streak-45");
  if (s.completedDays.length >= 60) out.add("legend-60");
  if (subs.filter((x) => x.github).length >= 10) out.add("github-beast");
  if (subs.filter((x) => x.linkedin).length >= 10) out.add("linkedin-machine");
  if (xp >= 3500) out.add("weekend-warrior");
  return [...out];
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = load();
    const today = new Date().toDateString();
    if (loaded.user && loaded.lastLogin !== today) {
      loaded.lastLogin = today;
      loaded.loginDays += 1;
    }
    setState(loaded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }, [state, hydrated]);

  const update: Ctx["update"] = useCallback((patch) => {
    setState((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCheck = useCallback((day: number, id: string) => {
    setState((s) => {
      const list = s.checklists[day] ?? [];
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
      return { ...s, checklists: { ...s.checklists, [day]: next } };
    });
  }, []);

  const submitDay = useCallback((sub: Submission) => {
    setState((s) => {
      const completed = s.completedDays.includes(sub.day) ? s.completedDays : [...s.completedDays, sub.day];
      const streak = s.streak + (s.completedDays.includes(sub.day) ? 0 : 1);
      return {
        ...s,
        dailySubmissions: { ...s.dailySubmissions, [sub.day]: sub },
        completedDays: completed,
        streak,
        longestStreak: Math.max(s.longestStreak, streak),
        currentDay: Math.min(60, Math.max(s.currentDay, sub.day + 1)),
        streakFreeze: streak > 0 && streak % 15 === 0 ? s.streakFreeze + 1 : s.streakFreeze,
      };
    });
  }, []);

  const xp = useMemo(() => computeXp(state), [state]);
  const level = useMemo(() => levelFor(xp), [xp]);
  const profileCompletion = useMemo(() => computeProfileCompletion(state), [state]);
  const completionPercent = Math.round((state.completedDays.length / 60) * 100);
  const unlockedAchievements = useMemo(() => computeAchievements(state, xp), [state, xp]);
  const rank = useMemo(() => {
    const higher = LEADERBOARD.filter((l) => l.xp > xp).length;
    return higher + 1;
  }, [xp]);

  const value: Ctx = {
    state,
    hydrated,
    update,
    reset,
    toggleCheck,
    submitDay,
    xp,
    level,
    profileCompletion,
    completionPercent,
    rank,
    unlockedAchievements,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export const trackName = (id: TrackId) => TRACKS.find((t) => t.id === id)?.name ?? "Frontend";

export const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};
