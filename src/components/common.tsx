import * as LucideIcons from "lucide-react";
import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { accentClasses } from "@/lib/gamify";

type IconName = keyof typeof LucideIcons;

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[name as IconName] ?? LucideIcons.Circle;
  return <Cmp className={className} aria-hidden />;
}

export function Counter({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, to, mv]);

  useEffect(
    () =>
      spring.on("change", (v) =>
        setDisplay(
          v.toLocaleString("en-IN", { maximumFractionDigits: decimals, minimumFractionDigits: decimals }),
        ),
      ),
    [spring, decimals],
  );

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function ProgressRing({
  value,
  size = 168,
  stroke = 12,
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--violet)" />
            <stop offset="60%" stopColor="var(--blue)" />
            <stop offset="100%" stopColor="var(--emerald)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--muted)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (Math.min(100, value) / 100) * c }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className={cn("mb-6 text-center", className)}
    >
      {eyebrow && (
        <span className="inline-block rounded-full border border-border bg-secondary/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-[28px] font-bold leading-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>}
    </motion.div>
  );
}

export function Pill({
  children,
  accent = "violet",
  className,
}: {
  children: ReactNode;
  accent?: string;
  className?: string;
}) {
  const a = accentClasses[accent] ?? accentClasses['violet']!;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        a.bg,
        a.border,
        a.text,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="glass flex flex-col items-center rounded-3xl px-6 py-8 text-center">
      <div className="mb-3 grid size-14 place-items-center rounded-2xl bg-secondary/70">
        <Icon name={icon} className="size-6 text-muted-foreground" />
      </div>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

const CONFETTI_COLORS = ["var(--violet)", "var(--blue)", "var(--emerald)", "var(--orange)", "var(--rose)"];

export function Confetti({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute size-2 rounded-[2px]"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-5%",
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: [1, 1, 0], rotate: 540 }}
          transition={{ duration: 2 + Math.random() * 1.4, delay: Math.random() * 0.4, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

export function FloatingBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-24 top-10 size-64 rounded-full bg-violet/25 blur-3xl animate-blob" />
      <div className="absolute -right-20 top-40 size-72 rounded-full bg-blue/20 blur-3xl animate-blob [animation-delay:3s]" />
      <div className="absolute bottom-0 left-1/3 size-64 rounded-full bg-emerald/15 blur-3xl animate-blob [animation-delay:6s]" />
      {[
        { icon: "Github", top: "12%", left: "8%", d: "0s" },
        { icon: "Linkedin", top: "22%", left: "82%", d: "1.2s" },
        { icon: "Star", top: "52%", left: "6%", d: "2.1s" },
        { icon: "Code2", top: "64%", left: "86%", d: "0.6s" },
        { icon: "GitBranch", top: "38%", left: "70%", d: "1.8s" },
        { icon: "Terminal", top: "78%", left: "20%", d: "2.6s" },
      ].map((f) => (
        <div
          key={f.icon + f.left}
          className="absolute animate-float opacity-25"
          style={{ top: f.top, left: f.left, animationDelay: f.d }}
        >
          <div className="glass grid size-10 place-items-center rounded-xl">
            <Icon name={f.icon} className="size-4 text-foreground/70" />
          </div>
        </div>
      ))}
    </div>
  );
}
