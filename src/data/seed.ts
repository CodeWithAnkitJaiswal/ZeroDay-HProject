import type { Submission } from "@/lib/store";
import type { DemoStudent } from "./community";
import { getTrack } from "./tracks";

const REFLECTIONS = [
  "Took me longer than expected, but the concept finally clicked.",
  "Broke it three times before it worked. Debugging is the real lesson.",
  "Shipped a small demo and posted it — the feedback was motivating.",
  "Revised yesterday's notes first, then built today's task from scratch.",
  "Struggled with edge cases, wrote tests and everything got clearer.",
  "Kept it simple today. Consistency over intensity.",
  "Paired with a friend from the community, learnt two new tricks.",
];

const slug = (name: string) => name.split(" ")[0]?.toLowerCase() ?? "student";

/**
 * Builds a realistic history for a demo student: every completed day gets a
 * submission, and the student's missed days stay empty (shown red).
 */
export function buildDemoProgress(student: DemoStudent): {
  completedDays: number[];
  dailySubmissions: Record<number, Submission>;
  checklists: Record<number, string[]>;
} {
  const track = getTrack(student.track);
  const missed = new Set(student.missedDays);
  const completedDays: number[] = [];
  const dailySubmissions: Record<number, Submission> = {};
  const checklists: Record<number, string[]> = {};
  const user = slug(student.name);
  const now = Date.now();

  for (let d = 1; d < student.currentDay; d++) {
    if (missed.has(d)) continue;
    completedDays.push(d);
    const topic = track.days.find((x) => x.day === d)?.topic ?? `Day ${d}`;
    const daysAgo = student.currentDay - d;
    dailySubmissions[d] = {
      day: d,
      github: `https://github.com/${user}/60-days-${student.track}/tree/main/day-${String(d).padStart(2, "0")}`,
      linkedin: `https://linkedin.com/posts/${user}-dev_day${d}-60dayschallenge-abtalks`,
      notes: `${topic} — ${REFLECTIONS[d % REFLECTIONS.length]}`,
      submittedAt: new Date(now - daysAgo * 86400000).toISOString(),
    };
    checklists[d] = ["understand", "task", "test", "github", "linkedin", "reflect"];
  }

  return { completedDays, dailySubmissions, checklists };
}