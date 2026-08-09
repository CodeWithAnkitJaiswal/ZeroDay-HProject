import { useState, type ChangeEvent } from "react";
import { motion } from "motion/react";
import { Github, ImagePlus, Linkedin, Lock, NotebookPen, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/store";
import { EmptyState } from "@/components/common";

export function SubmissionCard({
  day,
  mode,
  onSubmitted,
}: {
  day: number;
  mode: "editable" | "readonly" | "locked";
  onSubmitted?: () => void;
}) {
  const { state, submitDay } = useApp();
  const existing = state.dailySubmissions[day];
  const [github, setGithub] = useState(existing?.github ?? "");
  const [linkedin, setLinkedin] = useState(existing?.linkedin ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [screenshot, setScreenshot] = useState(existing?.screenshot ?? "");
  const [error, setError] = useState("");

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setScreenshot(String(reader.result));
    reader.readAsDataURL(file);
  };

  if (mode === "locked") {
    return (
      <EmptyState
        icon="Lock"
        title={`Day ${day} is locked`}
        description="Complete previous days to unlock this challenge. One day at a time — that is the whole point."
      />
    );
  }

  if (mode === "readonly" && !existing) {
    return (
      <EmptyState
        icon="FileX2"
        title="No submission for this day"
        description="This day passed without a submission. It stays in your history, but you can't edit it now."
      />
    );
  }

  const readonly = mode === "readonly";

  return (
    <div className="space-y-4">
      {readonly && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald/30 bg-emerald/10 px-3 py-2 text-xs text-emerald">
          <Lock className="size-3.5" /> Read-only — submitted on{" "}
          {existing ? new Date(existing.submittedAt).toLocaleDateString("en-IN") : ""}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="sub-gh" className="flex items-center gap-1.5 text-xs">
          <Github className="size-3.5" /> GitHub repository / commit URL
        </Label>
        <Input
          id="sub-gh"
          readOnly={readonly}
          placeholder="https://github.com/you/day-12"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sub-li" className="flex items-center gap-1.5 text-xs">
          <Linkedin className="size-3.5" /> LinkedIn post URL
        </Label>
        <Input
          id="sub-li"
          readOnly={readonly}
          placeholder="https://linkedin.com/posts/…"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sub-notes" className="flex items-center gap-1.5 text-xs">
          <NotebookPen className="size-3.5" /> Reflection
        </Label>
        <Textarea
          id="sub-notes"
          rows={3}
          readOnly={readonly}
          placeholder="What clicked today? What still confuses you?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-xs">
          <ImagePlus className="size-3.5" /> Screenshot
        </Label>
        {screenshot ? (
          <div className="relative overflow-hidden rounded-2xl border border-border">
            <img src={screenshot} alt="Submission screenshot" className="max-h-48 w-full object-cover" />
            {!readonly && (
              <Button
                size="sm"
                variant="glass"
                className="absolute right-2 top-2"
                onClick={() => setScreenshot("")}
              >
                Remove
              </Button>
            )}
          </div>
        ) : readonly ? (
          <p className="text-xs text-muted-foreground">No screenshot uploaded.</p>
        ) : (
          <label className="flex cursor-pointer flex-col items-center gap-1 rounded-2xl border border-dashed border-border bg-secondary/30 px-4 py-6 text-center text-xs text-muted-foreground transition-colors hover:border-violet/40">
            <ImagePlus className="size-5" />
            Tap to upload proof of work
            <input type="file" accept="image/*" className="hidden" onChange={onFile} />
          </label>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!readonly && (
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            size="xl"
            variant="premium"
            className="w-full"
            onClick={() => {
              if (!github.trim()) {
                setError("Add your GitHub link — proof of work is the whole challenge.");
                return;
              }
              setError("");
              submitDay({
                day,
                github: github.trim(),
                linkedin: linkedin.trim(),
                notes: notes.trim(),
                screenshot,
                submittedAt: new Date().toISOString(),
              });
              onSubmitted?.();
            }}
          >
            {existing ? <CheckCircle2 className="size-4" /> : <Send className="size-4" />}
            {existing ? "Update submission" : `Submit Day ${day}`}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
