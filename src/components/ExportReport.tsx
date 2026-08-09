import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Download, FileText, Linkedin, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/lib/store";
import { getTrack } from "@/data/tracks";
import { SCOPES, buildReport, type ReportScope } from "@/lib/report";
import { cn } from "@/lib/utils";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      toast.success(`${label} copied to clipboard`);
      setTimeout(() => setDone(false), 1800);
    } catch {
      toast.error("Clipboard blocked — select the text and copy manually.");
    }
  };
  return (
    <Button variant={done ? "outline" : "premium"} size="sm" onClick={() => void copy()}>
      {done ? <Check className="size-4" /> : <Copy className="size-4" />} {done ? "Copied" : `Copy ${label}`}
    </Button>
  );
}

export function ExportReport({ compact = false }: { compact?: boolean }) {
  const { state, xp, level } = useApp();
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<ReportScope>("all");
  const track = getTrack(state.track);

  const report = useMemo(
    () => buildReport({ state, track, xp, level: level.level, levelName: level.name, scope }),
    [state, track, xp, level, scope],
  );

  const download = (content: string, filename: string, type: string) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {compact ? (
          <Button variant="glass" size="icon" aria-label="Export report">
            <Share2 className="size-[18px]" />
          </Button>
        ) : (
          <Button variant="glass" size="sm">
            <Share2 className="size-4" /> Export report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-popover p-0 sm:max-w-2xl">
        <div className="relative overflow-hidden rounded-t-lg border-b border-border/60 px-5 pb-4 pt-5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[image:var(--gradient-hero)] opacity-60" />
          <DialogHeader className="relative text-left">
            <div className="flex items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-violet/12">
                <Share2 className="size-[18px] text-violet" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-lg">Share your progress</DialogTitle>
                <DialogDescription className="text-xs">
                  Pick a range, download the report or copy a ready-to-post LinkedIn update.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="space-y-4 px-5 pb-5">
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border/60 bg-secondary/30 p-1.5">
          {SCOPES.map((s) => (
            <button
              key={s.id}
              onClick={() => setScope(s.id)}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-left transition-all duration-200",
                scope === s.id
                  ? "border-violet/40 bg-violet/12 shadow-[0_8px_24px_-14px_var(--violet)]"
                  : "border-transparent hover:bg-secondary/70",
              )}
            >
              <p className={cn("text-sm font-semibold", scope === s.id && "text-violet")}>{s.label}</p>
              <p className="truncate text-[11px] text-muted-foreground">{s.hint}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {report.stats.slice(0, 6).map((s) => (
            <div
              key={s.k}
              className="relative overflow-hidden rounded-2xl border border-border/60 bg-secondary/35 px-3 py-2.5 transition-colors hover:bg-secondary/60"
            >
              <span className="absolute inset-y-0 left-0 w-0.5 bg-[image:var(--gradient-violet)] opacity-70" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.k}</p>
              <p className="truncate text-sm font-bold">{s.v}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="report">
          <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-secondary/60">
            <TabsTrigger value="report" className="rounded-xl text-xs">
              <FileText className="size-3.5" /> Report
            </TabsTrigger>
            <TabsTrigger value="post" className="rounded-xl text-xs">
              <Linkedin className="size-3.5" /> LinkedIn post
            </TabsTrigger>
          </TabsList>

          <TabsContent value="report" className="mt-3 space-y-3">
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-2xl border border-border bg-secondary/40 p-3 text-[11px] leading-relaxed text-muted-foreground">
              {report.markdown}
            </pre>
            <div className="flex flex-wrap gap-2">
              <CopyButton text={report.markdown} label="report" />
              <Button variant="outline" size="sm" onClick={() => download(report.markdown, report.filename, "text/markdown")}>
                <Download className="size-4" /> Download .md
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => download(report.markdown, report.filename.replace(/\.md$/, ".txt"), "text/plain")}
              >
                <Download className="size-4" /> Download .txt
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="post" className="mt-3 space-y-3">
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-2xl border border-border bg-secondary/40 p-3 text-[12px] leading-relaxed">
              {report.linkedin}
            </pre>
            <div className="flex flex-wrap gap-2">
              <CopyButton text={report.linkedin} label="post" />
              <Button variant="glass" size="sm" asChild>
                <a href="https://www.linkedin.com/feed/?shareActive=true" target="_blank" rel="noreferrer noopener">
                  <Linkedin className="size-4" /> Open LinkedIn
                </a>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
