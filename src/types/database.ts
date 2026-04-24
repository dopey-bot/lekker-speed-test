export type Language =
  | "en"
  | "af"
  | "zu"
  | "xh"
  | "st"
  | "ts"
  | "tn"
  | "nr"
  | "ss"
  | "ve"
  | "nso";

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "af", label: "Afrikaans" },
  { code: "zu", label: "isiZulu" },
  { code: "xh", label: "isiXhosa" },
  { code: "st", label: "Sesotho" },
  { code: "ts", label: "Xitsonga" },
  { code: "tn", label: "Setswana" },
  { code: "nr", label: "isiNdebele" },
  { code: "ss", label: "siSwati" },
  { code: "ve", label: "Tshivenda" },
  { code: "nso", label: "Sepedi" },
];

export interface Slogan {
  id: string;
  text: string;
  language: Language;
  topic: string | null;
  speed_bucket_min_mbps: number;
  speed_bucket_max_mbps: number;
  active: boolean;
  created_at: string;
}

export interface TestResult {
  id: string;
  download_mbps: number;
  upload_mbps: number;
  ping_ms: number;
  jitter_ms: number | null;
  slogan_id: string | null;
  user_agent: string | null;
  created_at: string;
}

export type AdPlacement = "desktop_left" | "desktop_right" | "mobile";

export interface Ad {
  id: string;
  image_url: string;
  link_url: string;
  placement: AdPlacement;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}