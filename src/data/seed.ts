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

/** Each demo student codes at a different time of day (drives their persona). */
const HOUR_PROFILES: Record<string, number[]> = {
  s1: [22, 23, 23, 21, 23, 22, 23],
  s2: [6, 5, 7, 6, 8, 6, 7],
  s3: [19, 20, 18, 21, 19, 20, 18],
  s4: [9, 10, 11, 9, 10, 8, 11],
  s5: [23, 1, 0, 23, 2, 23, 1],
  s6: [14, 15, 13, 16, 14, 15, 13],
};

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
    const hours = HOUR_PROFILES[student.id] ?? [20, 21, 19, 22, 18, 20, 21];
    const at = new Date(now - daysAgo * 86400000);
    at.setHours(hours[d % hours.length] ?? 20, (d * 17) % 60, 0, 0);
    dailySubmissions[d] = {
      day: d,
      github: `https://github.com/${user}/60-days-${student.track}/tree/main/day-${String(d).padStart(2, "0")}`,
      linkedin: `https://linkedin.com/posts/${user}-dev_day${d}-60dayschallenge-abtalks`,
      notes: `${topic} — ${REFLECTIONS[d % REFLECTIONS.length]}`,
      submittedAt: at.toISOString(),
    };
    checklists[d] = ["understand", "task", "test", "github", "linkedin", "reflect"];
  }

  return { completedDays, dailySubmissions, checklists };
}