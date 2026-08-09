import type { Submission } from "./store";

export type TimingStats = {
  total: number;
  hours: number[];
  buckets: { label: string; value: number; hint: string }[];
  peakHour: number | null;
  title: string;
  emoji: string;
  description: string;
  lateNight: number;
  earlyMorning: number;
  lastMinute: number;
};

const pad = (n: number) => String(n).padStart(2, "0");
export const hourLabel = (h: number) => `${pad(h)}:00`;

export function computeTiming(subs: Submission[]): TimingStats {
  const hours = Array<number>(24).fill(0);
  for (const s of subs) {
    const d = new Date(s.submittedAt);
    if (Number.isNaN(d.getTime())) continue;
    hours[d.getHours()] = (hours[d.getHours()] ?? 0) + 1;
  }
  const total = hours.reduce((a, b) => a + b, 0);
  const sum = (from: number, to: number) => hours.slice(from, to).reduce((a, b) => a + b, 0);

  const buckets = [
    { label: "Early morning", value: sum(4, 8), hint: "04:00 – 08:00" },
    { label: "Morning", value: sum(8, 12), hint: "08:00 – 12:00" },
    { label: "Afternoon", value: sum(12, 17), hint: "12:00 – 17:00" },
    { label: "Evening", value: sum(17, 22), hint: "17:00 – 22:00" },
    { label: "Late night", value: sum(22, 24) + sum(0, 4), hint: "22:00 – 04:00" },
  ];

  let peakHour: number | null = null;
  let best = 0;
  hours.forEach((v, h) => {
    if (v > best) {
      best = v;
      peakHour = h;
    }
  });

  const lateNight = sum(22, 24) + sum(0, 4);
  const earlyMorning = sum(4, 8);
  const lastMinute = sum(23, 24);

  let title = "Steady Builder";
  let emoji = "🧱";
  let description = "You show up at all kinds of hours — consistency beats scheduling.";

  if (total === 0) {
    title = "Fresh Start";
    emoji = "✨";
    description = "Submit a few days and we'll figure out your coding personality.";
  } else if (lastMinute / total >= 0.35) {
    title = "Last Minute Rusher";
    emoji = "⏰";
    description = "Most of your submissions land after 23:00. Deadline pressure is your fuel.";
  } else if (lateNight / total >= 0.4) {
    title = "Night Owl";
    emoji = "🦉";
    description = "You do your best work when the world is asleep.";
  } else if (earlyMorning / total >= 0.35) {
    title = "Early Bird";
    emoji = "🌅";
    description = "Task done before most people open their laptop.";
  } else if (peakHour !== null && peakHour >= 8 && peakHour < 12) {
    title = "Morning Grinder";
    emoji = "☕";
    description = "You front-load the day and keep evenings free.";
  } else if (peakHour !== null && peakHour >= 12 && peakHour < 17) {
    title = "Daylight Shipper";
    emoji = "🌞";
    description = "Afternoon deep-work blocks are where you ship.";
  } else if (peakHour !== null && peakHour >= 17 && peakHour < 22) {
    title = "Evening Shipper";
    emoji = "🌆";
    description = "College by day, code by night — the classic student rhythm.";
  }

  return { total, hours, buckets, peakHour, title, emoji, description, lateNight, earlyMorning, lastMinute };
}
