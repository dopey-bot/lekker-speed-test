import { forwardRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SAFlag } from "./SAFlag";
import { formatMbps } from "@/lib/utils";
import { bucketFor } from "@/lib/speed-bucket";
import type { Slogan } from "@/types/database";

interface ResultCardProps {
  downloadMbps: number;
  uploadMbps: number;
  pingMs: number;
  slogan: Slogan | null;
}

export const ResultCard = forwardRef<HTMLDivElement, ResultCardProps>(
  ({ downloadMbps, uploadMbps, pingMs, slogan }, ref) => {
    const info = bucketFor(downloadMbps);
    return (
      <Card
        ref={ref}
        className="overflow-hidden shadow-lg border-2"
      >
        <div className="h-2 bg-gradient-to-r from-sa-green via-sa-gold to-sa-red" />
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SAFlag className="h-6 w-9 rounded-sm" />
              <span className="font-semibold">Lekker Speed Test</span>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
              {info.label}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <Metric label="Download" value={formatMbps(downloadMbps)} unit="Mbps" />
            <Metric label="Upload" value={formatMbps(uploadMbps)} unit="Mbps" />
            <Metric label="Ping" value={Math.round(pingMs).toString()} unit="ms" />
          </div>

          {slogan && (
            <div className="rounded-lg bg-muted p-5 text-center">
              <p className="text-lg font-medium italic">&ldquo;{slogan.text}&rdquo;</p>
              {slogan.language !== "en" && (
                <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">
                  {slogan.language}
                </p>
              )}
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground">
            lekkerspeedtest.co.za
          </p>
        </CardContent>
      </Card>
    );
  }
);
ResultCard.displayName = "ResultCard";

function Metric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold tabular-nums mt-1 text-primary">{value}</p>
      <p className="text-xs text-muted-foreground">{unit}</p>
    </div>
  );
}