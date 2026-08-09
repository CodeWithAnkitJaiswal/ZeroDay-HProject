import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeMode = "system" | "light" | "dark";
export type AccentId = "violet" | "blue" | "emerald" | "orange" | "rose" | "cyan";

export const ACCENTS: { id: AccentId; name: string; swatch: string }[] = [
  { id: "violet", name: "Violet", swatch: "oklch(0.62 0.2 295)" },
  { id: "blue", name: "Blue", swatch: "oklch(0.62 0.17 250)" },
  { id: "emerald", name: "Emerald", swatch: "oklch(0.62 0.15 163)" },
  { id: "orange", name: "Orange", swatch: "oklch(0.68 0.16 60)" },
  { id: "rose", name: "Rose", swatch: "oklch(0.62 0.19 12)" },
  { id: "cyan", name: "Cyan", swatch: "oklch(0.65 0.14 210)" },
];

export const THEME_KEY = "abtalks.theme.v1";

type Ctx = {
  mode: ThemeMode;
  accent: AccentId;
  resolved: "light" | "dark";
  setMode: (m: ThemeMode) => void;
  setAccent: (a: AccentId) => void;
};

const ThemeContext = createContext<Ctx | null>(null);

const systemDark = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;

export function applyTheme(mode: ThemeMode, accent: AccentId) {
  const root = document.documentElement;
  const dark = mode === "dark" || (mode === "system" && systemDark());
  root.classList.toggle("dark", dark);
  root.dataset["accent"] = accent;
  root.style.colorScheme = dark ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [accent, setAccentState] = useState<AccentId>("violet");
  const [resolved, setResolved] = useState<"light" | "dark">("dark");

  useEffect(() => {
    let m: ThemeMode = "system";
    let a: AccentId = "violet";
    try {
      const raw = window.localStorage.getItem(THEME_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { mode?: ThemeMode; accent?: AccentId };
        if (parsed.mode) m = parsed.mode;
        if (parsed.accent) a = parsed.accent;
      }
    } catch {
      /* ignore */
    }
    setModeState(m);
    setAccentState(a);
    applyTheme(m, a);
    setResolved(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (mode === "system") {
        applyTheme("system", accent);
        setResolved(mq.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode, accent]);

  const persist = useCallback((m: ThemeMode, a: AccentId) => {
    applyTheme(m, a);
    setResolved(document.documentElement.classList.contains("dark") ? "dark" : "light");
    try {
      window.localStorage.setItem(THEME_KEY, JSON.stringify({ mode: m, accent: a }));
    } catch {
      /* ignore */
    }
  }, []);

  const setMode = useCallback(
    (m: ThemeMode) => {
      setModeState(m);
      persist(m, accent);
    },
    [accent, persist],
  );

  const setAccent = useCallback(
    (a: AccentId) => {
      setAccentState(a);
      persist(mode, a);
    },
    [mode, persist],
  );

  return (
    <ThemeContext.Provider value={{ mode, accent, resolved, setMode, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

/** Blocking script: applies stored theme before first paint (no flash). */
export const themeInitScript = `(function(){try{var d=document.documentElement;var s=localStorage.getItem("${THEME_KEY}");var m="system",a="violet";if(s){var p=JSON.parse(s);m=p.mode||m;a=p.accent||a;}var dark=m==="dark"||(m==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);d.classList.toggle("dark",dark);d.dataset.accent=a;d.style.colorScheme=dark?"dark":"light";}catch(e){}})();`;
