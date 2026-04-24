import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SAFlag } from "@/components/SAFlag";
import { SpeedMeter } from "@/components/SpeedMeter";
import { AdBanner } from "@/components/AdBanner";
import { SEO } from "@/components/SEO";
import { useSpeedTest } from "@/hooks/use-speed-test";
import { pickSlogan } from "@/lib/slogans";
import { supabase, hasSupabase } from "@/lib/supabase";
import type { Slogan } from "@/types/database";
import { bucketFor } from "@/lib/speed-bucket";
import { formatMbps } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { status, live, results, error, start, reset } = useSpeedTest();
  const [slogan, setSlogan] = useState<Slogan | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status !== "finished" || !results) return;
    let cancelled = false;
    (async () => {
      setSaving(true);
      const picked = await pickSlogan({ downloadMbps: results.downloadMbps });
      if (cancelled) return;
      setSlogan(picked);

      if (!hasSupabase || !picked || picked.id.startsWith("fallback-")) {
        setSaving(false);
        return;
      }

      const { data, error: insertError } = await supabase
        .from("test_results")
        .insert({
          download_mbps: results.downloadMbps,
          upload_mbps: results.uploadMbps,
          ping_ms: results.pingMs,
          jitter_ms: results.jitterMs,
          slogan_id: picked.id,
          user_agent: navigator.userAgent.slice(0, 200),
        })
        .select("id")
        .single();

      setSaving(false);
      if (!cancelled && data && !insertError) {
        navigate(`/result/${data.id}`);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, results]);

  return (
    <>
      <SEO
        title="Lekker Speed Test — South Africa's Internet Speed Test"
        description="Test your internet speed with Lekker Speed Test — South Africa's speed test with local humour. Check download, upload and ping against Cloudflare's edges in Johannesburg and Cape Town."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Lekker Speed Test",
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: 0, priceCurrency: "ZAR" },
          description:
            "South Africa's internet speed test — measure your download, upload and ping speeds.",
        }}
      />

      <div className="container py-8 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto_1fr] items-start">
          <div className="hidden lg:block sticky top-24">
            <AdBanner placement="desktop_left" className="aspect-[160/600] max-w-[160px] ml-auto" />
          </div>

          <div className="max-w-xl mx-auto w-full space-y-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <SAFlag className="h-10 w-16 rounded-md shadow-md" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Lekker Speed Test
              </h1>
              <p className="text-lg text-muted-foreground">
                South Africa's internet speed test — with local humour.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <SpeedMeter
                label="Download"
                value={live.downloadMbps}
                unit="Mbps"
                accent="primary"
                pulse={live.phase === "download"}
              />
              <SpeedMeter
                label="Upload"
                value={live.uploadMbps}
                unit="Mbps"
                accent="primary"
                pulse={live.phase === "upload"}
              />
              <SpeedMeter
                label="Ping"
                value={live.pingMs}
                unit="ms"
                accent="accent"
                pulse={live.phase === "ping"}
              />
            </div>

            <div className="flex flex-col items-center gap-4">
              {status === "idle" && (
                <Button size="xl" onClick={start} className="w-full max-w-sm">
                  Start test
                </Button>
              )}
              {status === "running" && (
                <Button size="xl" disabled className="w-full max-w-sm">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Testing {live.phase}…
                </Button>
              )}
              {status === "finished" && results && (
                <div className="w-full space-y-4 text-center">
                  <p className="text-xl">
                    You got{" "}
                    <strong className="text-primary">
                      {formatMbps(results.downloadMbps)} Mbps
                    </strong>{" "}
                    —{" "}
                    <span className="italic">
                      {bucketFor(results.downloadMbps).description}
                    </span>
                  </p>
                  {saving && (
                    <p className="text-sm text-muted-foreground">
                      <Loader2 className="inline h-4 w-4 animate-spin mr-1" />
                      Picking a slogan…
                    </p>
                  )}
                  {slogan && (
                    <blockquote className="border-l-4 border-accent pl-4 py-2 italic text-lg">
                      &ldquo;{slogan.text}&rdquo;
                    </blockquote>
                  )}
                  <Button onClick={reset} variant="outline">
                    Test again
                  </Button>
                </div>
              )}
              {status === "error" && (
                <div className="w-full space-y-2 text-center">
                  <p className="text-destructive">Error: {error}</p>
                  <Button onClick={reset} variant="outline">
                    Try again
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block sticky top-24">
            <AdBanner placement="desktop_right" className="aspect-[160/600] max-w-[160px]" />
          </div>
        </div>

        <div className="lg:hidden my-8">
          <AdBanner placement="mobile" className="aspect-[320/100] mx-auto max-w-sm" />
        </div>

        <section className="mt-20 max-w-3xl mx-auto prose prose-slate dark:prose-invert">
          <h2 className="text-2xl font-bold">How fast is my internet?</h2>
          <p>
            Lekker Speed Test measures your download and upload bandwidth and
            ping against Cloudflare's global network, which has edges in
            Johannesburg and Cape Town. That means the test runs against a server
            close to you — not halfway across the Atlantic — so the result
            reflects what you can actually do with your connection.
          </p>

          <h2 className="text-2xl font-bold">What is a good internet speed in South Africa?</h2>
          <p>
            Anything below 5 Mbps is painful. 5–25 Mbps is fine for one HD
            stream. 25–100 Mbps is solid fibre territory and handles a busy
            family home. 100–500 Mbps is fast fibre. 500+ Mbps is show-off
            speed, and honestly, what are you even downloading?
          </p>

          <h2 className="text-2xl font-bold">Fibre vs LTE vs 5G in South Africa</h2>
          <p>
            Fibre is the gold standard: fast and low-latency. LTE is convenient
            and widely available but speeds vary by tower load. 5G where
            available can beat most fibre packages, but coverage is still
            patchy outside the big metros. Bufferbloat (latency under load)
            matters more than raw bandwidth for video calls and gaming — if
            your Zoom breaks up while someone streams Netflix, bufferbloat is
            why.
          </p>
        </section>
      </div>
    </>
  );
}