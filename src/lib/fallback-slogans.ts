import type { Slogan } from "@/types/database";

/**
 * Built-in slogan bank used when Supabase is unavailable.
 * Keep this in sync with `supabase/seed.sql` at first deploy;
 * after that, the DB is the source of truth.
 */
export const FALLBACK_SLOGANS: Slogan[] = [
  row(
    "Your internet is slower than a Home Affairs queue on a Monday.",
    "en",
    "home_affairs",
    0,
    5
  ),
  row("Eish, this speed is loadshedding in disguise.", "en", "load_shedding", 0, 5),
  row("Jy moet jou ISP bel — hierdie is nie lekker nie.", "af", "isp", 0, 5),
  row("Good enough for WhatsApp voice notes — not much else.", "en", "general", 5, 25),
  row("Hierdie is 'n tannie-met-roomys tempo.", "af", "general", 5, 25),
  row("Lekker! Your speed is braai-ready.", "en", "braai", 25, 100),
  row(
    "Jy kan nou Netflix kyk én WhatsApp op jou Hilux se Apple CarPlay speel.",
    "af",
    "toyota",
    25,
    100
  ),
  row(
    "Faster than a taxi overtaking on the shoulder of the N2.",
    "en",
    "taxi",
    100,
    500
  ),
  row(
    "Hierdie spoed is vinniger as die Bokke se eerste vyf minute.",
    "af",
    "rugby",
    100,
    500
  ),
  row("Speed of a Ferrari on the M1 at 3am.", "en", "cars", 500, 999999),
  row(
    "Dis nou rerig lekker — jy's op Stage 0 se internet.",
    "af",
    "load_shedding",
    500,
    999999
  ),
  row(
    "This is Home Affairs on a good day — blink and it's done.",
    "en",
    "home_affairs",
    500,
    999999
  ),
];

function row(
  text: string,
  language: Slogan["language"],
  topic: string,
  min: number,
  max: number
): Slogan {
  return {
    id: `fallback-${Math.random().toString(36).slice(2, 10)}`,
    text,
    language,
    topic,
    speed_bucket_min_mbps: min,
    speed_bucket_max_mbps: max,
    active: true,
    created_at: new Date().toISOString(),
  };
}