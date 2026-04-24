import { useEffect, useState } from "react";
import { supabase, hasSupabase } from "@/lib/supabase";
import type { Ad, AdPlacement } from "@/types/database";
import { cn } from "@/lib/utils";

interface AdBannerProps {
  placement: AdPlacement;
  className?: string;
}

export function AdBanner({ placement, className }: AdBannerProps) {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!hasSupabase) return;
      const nowIso = new Date().toISOString();
      const { data } = await supabase
        .from("ads")
        .select("*")
        .eq("active", true)
        .eq("placement", placement)
        .or(`starts_at.is.null,starts_at.lte.${nowIso}`)
        .or(`ends_at.is.null,ends_at.gte.${nowIso}`)
        .limit(10);
      if (cancelled || !data || data.length === 0) return;
      setAd(data[Math.floor(Math.random() * data.length)] as Ad);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [placement]);

  if (!ad) return null;

  return (
    <a
      href={ad.link_url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={cn("block overflow-hidden rounded-lg border", className)}
    >
      <img
        src={ad.image_url}
        alt="Advertisement"
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </a>
  );
}