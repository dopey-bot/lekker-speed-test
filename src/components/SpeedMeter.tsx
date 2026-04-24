import { cn } from "@/lib/utils";
import { formatMbps } from "@/lib/utils";

interface SpeedMeterProps {
  label: string;
  value: number | null;
  unit: string;
  accent?: "primary" | "accent" | "destructive";
  pulse?: boolean;
}

const accentClasses = {
  primary: "text-primary",
  accent: "text-accent-foreground",
  destructive: "text-destructive",
};

export function SpeedMeter({
  label,
  value,
  unit,
  accent = "primary",
  pulse,
}: SpeedMeterProps) {
  const display = value == null ? "—" : unit === "ms" ? Math.round(value).toString() : formatMbps(value);
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 text-center transition-shadow",
        pulse && "animate-pulse"
      )}
    >
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("text-4xl font-bold tabular-nums mt-2", accentClasses[accent])}>
        {display}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{unit}</p>
    </div>
  );
}