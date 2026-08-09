import { useState } from "react";
import { motion } from "motion/react";
import { Trophy } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useApp, type Profile } from "@/lib/store";
import { PROFILE_FIELDS } from "@/lib/gamify";

const FIELDS: { key: keyof Profile; label: string; placeholder: string; area?: boolean }[] = [
  { key: "avatar", label: "Photo URL", placeholder: "https://…" },
  { key: "college", label: "College", placeholder: "IIIT Bhopal" },
  { key: "year", label: "Year", placeholder: "3rd Year" },
  { key: "branch", label: "Branch", placeholder: "Computer Science" },
  { key: "city", label: "City", placeholder: "Bhopal" },
  { key: "github", label: "GitHub", placeholder: "github.com/username" },
  { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/username" },
  { key: "phone", label: "Phone", placeholder: "+91 90000 00000" },
  { key: "codingTime", label: "Preferred coding time", placeholder: "9 PM – 11 PM" },
  { key: "skills", label: "Skills", placeholder: "React, TypeScript, Node" },
  { key: "bio", label: "Bio", placeholder: "Second year CSE student building daily.", area: true },
  { key: "goals", label: "Goals", placeholder: "Land a frontend internship by December.", area: true },
];

export function ProfileModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { state, update, profileCompletion } = useApp();
  const [draft, setDraft] = useState<Profile>(state.profile);

  const filled = PROFILE_FIELDS.filter((f) => !!draft[f]).length;
  const livePercent = Math.round(((filled + (state.user ? 2 : 0)) / (PROFILE_FIELDS.length + 2)) * 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] gap-4 overflow-y-auto rounded-3xl border-border bg-popover sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>Complete your profile</DialogTitle>
          <DialogDescription>Every field adds +10 XP. Hit 100% to unlock the Profile Pro badge.</DialogDescription>
        </DialogHeader>

        <div className="glass rounded-2xl p-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <Trophy className="size-4 text-orange" /> Profile completion
            </span>
            <span className="font-bold text-violet">{livePercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-[image:var(--gradient-violet)]"
              animate={{ width: `${livePercent}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
          {livePercent < 100 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {PROFILE_FIELDS.length - filled} fields left to unlock 🏆 Profile Pro
            </p>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.key} className={f.area ? "sm:col-span-2" : ""}>
              <Label className="mb-1.5 block text-xs" htmlFor={`pf-${f.key}`}>
                {f.label}
              </Label>
              {f.area ? (
                <Textarea
                  id={`pf-${f.key}`}
                  rows={2}
                  placeholder={f.placeholder}
                  value={draft[f.key] ?? ""}
                  onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                />
              ) : (
                <Input
                  id={`pf-${f.key}`}
                  placeholder={f.placeholder}
                  value={draft[f.key] ?? ""}
                  onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Later
          </Button>
          <Button
            variant="premium"
            className="flex-1"
            onClick={() => {
              update({ profile: draft });
              onOpenChange(false);
            }}
          >
            Save {livePercent > profileCompletion ? `(+${(livePercent - profileCompletion) * 1} %)` : ""}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
