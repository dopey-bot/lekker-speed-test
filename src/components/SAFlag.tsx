import { cn } from "@/lib/utils";

/** Tasteful SVG rendition of the SA flag — used as an accent, not a background. */
export function SAFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 150 100"
      className={cn("block", className)}
      aria-label="South African flag"
      role="img"
    >
      <rect width="150" height="100" fill="#007A4D" />
      <path d="M0,0 L55,50 L0,100 Z" fill="#000" />
      <path d="M0,0 L75,50 L0,100" fill="none" stroke="#FFB612" strokeWidth="14" />
      <path d="M0,0 L150,0 L150,30 L65,30 Z" fill="#DE3831" />
      <path d="M0,100 L150,100 L150,70 L65,70 Z" fill="#002395" />
      <path d="M55,50 L150,0 L150,30 Z" fill="#FFF" opacity="0" />
      <path
        d="M55,50 L150,0 M55,50 L150,100"
        stroke="#FFF"
        strokeWidth="10"
        fill="none"
      />
    </svg>
  );
}