import { useRef } from "react";
import { toast } from "sonner";
import { Award, Copy, Download, Linkedin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { accentClasses, type Milestone } from "@/lib/gamify";
import { cn } from "@/lib/utils";

export type CertificateData = {
  name: string;
  track: string;
  milestone: Milestone;
  days: string;
  xp: number;
  level: string;
  streak: number;
  achievements: string[];
  date: string;
};

function drawCertificate(c: CertificateData): HTMLCanvasElement {
  const W = 1600;
  const H = 1100;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0b0b18");
  bg.addColorStop(0.5, "#141033");
  bg.addColorStop(1, "#0b0b18");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W / 2, 120, 40, W / 2, 120, 720);
  glow.addColorStop(0, "rgba(139,92,246,0.35)");
  glow.addColorStop(1, "rgba(139,92,246,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, 700);

  const border = ctx.createLinearGradient(0, 0, W, 0);
  border.addColorStop(0, "#8b5cf6");
  border.addColorStop(0.5, "#38bdf8");
  border.addColorStop(1, "#f59e0b");
  ctx.strokeStyle = border;
  ctx.lineWidth = 6;
  ctx.strokeRect(46, 46, W - 92, H - 92);
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  ctx.strokeRect(70, 70, W - 140, H - 140);

  const center = (text: string, y: number, font: string, color: string) => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(text, W / 2, y);
  };

  center("AB TALKS", 175, "bold 40px Inter, Arial, sans-serif", "#c4b5fd");
  center("60 DAYS CODING CHALLENGE", 222, "600 26px Inter, Arial, sans-serif", "rgba(255,255,255,0.65)");
  center("CERTIFICATE OF ACHIEVEMENT", 320, "bold 62px Inter, Arial, sans-serif", "#ffffff");
  center("This certificate is proudly presented to", 392, "22px Inter, Arial, sans-serif", "rgba(255,255,255,0.6)");

  const nameGrad = ctx.createLinearGradient(W / 2 - 420, 0, W / 2 + 420, 0);
  nameGrad.addColorStop(0, "#a78bfa");
  nameGrad.addColorStop(1, "#38bdf8");
  center(c.name, 480, "bold 76px Inter, Arial, sans-serif", nameGrad as unknown as string);

  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 320, 510);
  ctx.lineTo(W / 2 + 320, 510);
  ctx.stroke();

  center(
    `for successfully completing the "${c.milestone.title}" milestone`,
    570,
    "26px Inter, Arial, sans-serif",
    "rgba(255,255,255,0.82)",
  );
  center(`Days ${c.days} of the ${c.track} track`, 612, "24px Inter, Arial, sans-serif", "rgba(255,255,255,0.6)");

  const stats: [string, string][] = [
    ["XP EARNED", String(c.xp)],
    ["LEVEL", c.level],
    ["BEST STREAK", `${c.streak} days`],
    ["BADGES", String(c.achievements.length)],
  ];
  const boxW = 300;
  const gap = 24;
  const totalW = stats.length * boxW + (stats.length - 1) * gap;
  let x = (W - totalW) / 2;
  stats.forEach(([k, v]) => {
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, 680, boxW, 120, 20);
    ctx.fill();
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.font = "600 18px Inter, Arial, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillText(k, x + boxW / 2, 720);
    ctx.font = "bold 40px Inter, Arial, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(v, x + boxW / 2, 770);
    x += boxW + gap;
  });

  if (c.achievements.length) {
    center(
      `Achievements: ${c.achievements.slice(0, 6).join(" · ")}`,
      858,
      "22px Inter, Arial, sans-serif",
      "rgba(255,255,255,0.7)",
    );
  }

  ctx.textAlign = "left";
  ctx.font = "20px Inter, Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillText(`Issued on ${c.date}`, 140, 985);
  ctx.textAlign = "right";
  ctx.font = "italic 30px Georgia, serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("AB Talks", W - 140, 965);
  ctx.font = "18px Inter, Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillText("Program Mentor", W - 140, 992);

  return canvas;
}

export function CertificateModal({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: CertificateData;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const a = accentClasses[data.milestone.accent]!;

  const shareText = `🎓 Milestone unlocked: ${data.milestone.title} (Days ${data.days}) of the AB Talks 60 Days Coding Challenge!\n\n• Track: ${data.track}\n• XP: ${data.xp} · Level: ${data.level}\n• Best streak: ${data.streak} days\n• Badges: ${data.achievements.slice(0, 5).join(", ") || "—"}\n\n${data.milestone.message}\n\n#60DaysOfCode #ABTalks #CodingChallenge`;

  const download = () => {
    const canvas = drawCertificate(data);
    const link = document.createElement("a");
    link.download = `abtalks-certificate-${data.milestone.id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Certificate downloaded");
  };

  const copy = async () => {
    await navigator.clipboard.writeText(shareText);
    toast.success("LinkedIn post copied");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="size-5 text-amber" /> {data.milestone.title} certificate
          </DialogTitle>
        </DialogHeader>

        <div
          ref={ref}
          className={cn("relative overflow-hidden rounded-2xl border p-6 text-center", a.border, "glass-strong")}
        >
          <div className={cn("absolute inset-x-0 top-0 h-28 bg-gradient-to-b opacity-60", a.grad)} />
          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-violet">AB Talks</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">60 Days Coding Challenge</p>
            <h3 className="mt-4 text-xl font-black uppercase tracking-wide">Certificate of Achievement</h3>
            <p className="mt-3 text-xs text-muted-foreground">Proudly presented to</p>
            <p className="mt-1 text-3xl font-black">{data.name}</p>
            <div className="mx-auto my-3 h-px w-2/3 bg-border" />
            <p className="text-sm">
              for completing the <strong>{data.milestone.title}</strong> milestone
            </p>
            <p className="text-xs text-muted-foreground">
              Days {data.days} · {data.track} track
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ["XP", String(data.xp)],
                ["Level", data.level],
                ["Best streak", `${data.streak}d`],
                ["Badges", String(data.achievements.length)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border/60 bg-secondary/40 p-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
                  <p className="text-base font-bold">{v}</p>
                </div>
              ))}
            </div>
            {data.achievements.length > 0 && (
              <p className="mt-3 text-[11px] text-muted-foreground">
                Achievements: {data.achievements.slice(0, 6).join(" · ")}
              </p>
            )}
            <div className="mt-5 flex items-end justify-between text-left">
              <p className="text-[11px] text-muted-foreground">Issued {data.date}</p>
              <div className="text-right">
                <p className="font-serif text-lg italic">AB Talks</p>
                <p className="text-[10px] text-muted-foreground">Program Mentor</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="premium" className="flex-1" onClick={download}>
            <Download className="size-4" /> Download PNG
          </Button>
          <Button variant="glass" className="flex-1" onClick={() => void copy()}>
            <Copy className="size-4" /> Copy LinkedIn post
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => window.open("https://www.linkedin.com/feed/?shareActive=true", "_blank", "noopener")}
          >
            <Linkedin className="size-4" /> Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}