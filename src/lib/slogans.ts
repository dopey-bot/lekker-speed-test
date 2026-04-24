import { supabase, hasSupabase } from "./supabase";
import type { Language, Slogan } from "@/types/database";
import { FALLBACK_SLOGANS } from "./fallback-slogans";

export interface PickSloganOptions {
  downloadMbps: number;
  language?: Language | null;
}

/**
 * Pick a random active slogan matching the user's speed bucket.
 * Falls back to a built-in bank if Supabase is unavailable — the site
 * should never show "no slogan" on a successful test.
 */
export async function pickSlogan({
  downloadMbps,
  language,
}: PickSloganOptions): Promise<Slogan | null> {
  if (!hasSupabase) return pickFromFallback(downloadMbps, language);

  let query = supabase
    .from("slogans")
    .select("*")
    .eq("active", true)
    .lte("speed_bucket_min_mbps", downloadMbps)
    .gte("speed_bucket_max_mbps", downloadMbps);

  if (language) query = query.eq("language", language);

  const { data, error } = await query.limit(100);

  if (error || !data || data.length === 0) {
    return pickFromFallback(downloadMbps, language);
  }

  return data[Math.floor(Math.random() * data.length)] as Slogan;
}

function pickFromFallback(
  downloadMbps: number,
  language?: Language | null
): Slogan {
  let pool = FALLBACK_SLOGANS.filter(
    (s) =>
      s.speed_bucket_min_mbps <= downloadMbps &&
      s.speed_bucket_max_mbps >= downloadMbps &&
      (!language || s.language === language)
  );
  if (pool.length === 0) pool = FALLBACK_SLOGANS;
  return pool[Math.floor(Math.random() * pool.length)];
}