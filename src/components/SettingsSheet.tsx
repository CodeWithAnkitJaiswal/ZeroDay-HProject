import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LogOut, RotateCcw, Settings2 } from "lucide-react";
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

export function SettingsSheet() {
  const { state, update, reset } = useApp();
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
