import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LogOut, Monitor, Moon, RotateCcw, Settings2, Sun } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/store";
import { TRACKS, type TrackId } from "@/data/tracks";
import { cn } from "@/lib/utils";
import { accentClasses } from "@/lib/gamify";
import { ACCENTS, useTheme, type ThemeMode } from "@/lib/theme";

export function SettingsSheet() {
  const { state, update, reset } = useApp();
  const { mode, accent, setMode, setAccent } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const s = state.settings;

  const setSetting = (patch: Partial<typeof s>) => update({ settings: { ...s, ...patch } });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="glass" size="icon" aria-label="Settings">
          <Settings2 className="size-[18px]" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[88vw] overflow-y-auto border-border bg-popover sm:max-w-sm">
        <SheetHeader className="text-left">
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Tune your challenge experience.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label className="text-xs">Appearance</Label>
            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-secondary/60 p-1">
              {([
                { id: "light", label: "Light", Icon: Sun },
                { id: "dark", label: "Dark", Icon: Moon },
                { id: "system", label: "System", Icon: Monitor },
              ] as { id: ThemeMode; label: string; Icon: typeof Sun }[]).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setMode(id)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-all",
                    mode === id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">
              System follows your device setting. Saved on this device.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Accent colour</Label>
            <div className="flex flex-wrap gap-2">
              {ACCENTS.map((c) => (
                <button
                  key={c.id}
                  aria-label={c.name}
                  title={c.name}
                  onClick={() => setAccent(c.id)}
                  style={{ background: c.swatch }}
                  className={cn(
                    "size-8 rounded-full transition-all",
                    accent === c.id ? "ring-2 ring-foreground/70 ring-offset-2 ring-offset-popover" : "opacity-70 hover:opacity-100",
                  )}
                />
              ))}
            </div>
          </div>

          <Separator />

          {[
            { key: "reminders" as const, label: "Daily reminder", desc: "Nudge me to complete today's task" },
            { key: "notifications" as const, label: "Notifications", desc: "Streak warnings & badge unlocks" },
            { key: "emailReminders" as const, label: "Email reminders", desc: "Weekly progress recap" },
          ].map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{row.label}</p>
                <p className="text-xs text-muted-foreground">{row.desc}</p>
              </div>
              <Switch checked={s[row.key]} onCheckedChange={(v) => setSetting({ [row.key]: v })} />
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="ct" className="text-xs">
              Preferred coding time
            </Label>
            <Input id="ct" value={s.codingTime} onChange={(e) => setSetting({ codingTime: e.target.value })} />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-xs">Track</Label>
            <div className="grid grid-cols-2 gap-2">
              {TRACKS.map((t) => {
                const a = accentClasses[t.accent]!;
                const active = state.track === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => update({ track: t.id as TrackId })}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all",
                      active ? cn(a.bg, a.border, a.text) : "border-border bg-secondary/40 text-muted-foreground",
                    )}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              update({ completedDays: [], currentDay: 1, streak: 0, dailySubmissions: {}, checklists: {} });
              setOpen(false);
            }}
          >
            <RotateCcw className="size-4" /> Reset progress
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              reset();
              setOpen(false);
              void navigate({ to: "/" });
            }}
          >
            <LogOut className="size-4" /> Log out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
