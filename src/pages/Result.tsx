import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ResultCard } from "@/components/ResultCard";
import { SEO } from "@/components/SEO";
import { supabase, hasSupabase } from "@/lib/supabase";
import type { Slogan, TestResult } from "@/types/database";
import { toPng } from "html-to-image";
import { Download, Home as HomeIcon } from "lucide-react";
import { formatMbps } from "@/lib/utils";

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<TestResult | null>(null);
  const [slogan, setSlogan] = useState<Slogan | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id || !hasSupabase) {
      setLoading(false);
      setNotFound(!id);
      return;
    }
    (async () => {
      const { data: resultData } = await supabase
        .from("test_results")
        .select("*")
        .eq("id", id)
        .single();
      if (!resultData) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setResult(resultData as TestResult);
      if (resultData.slogan_id) {
        const { data: sloganData } = await supabase
          .from("slogans")
          .select("*")
          .eq("id", resultData.slogan_id)
          .single();
        if (sloganData) setSlogan(sloganData as Slogan);
      }
      setLoading(false);
    })();
  }, [id]);

  async function download() {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `lekker-speed-test-${id}.png`;
    link.href = dataUrl;
    link.click();
  }

  if (loading) {
    return (
      <div className="container py-20 text-center text-muted-foreground">
        Loading result…
      </div>
    );
  }

  if (notFound || !result) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Result not found</h1>
        <p className="text-muted-foreground">
          This result doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/">Take a new test</Link>
        </Button>
      </div>
    );
  }

  const title = slogan
    ? `I got ${formatMbps(result.download_mbps)} Mbps — "${slogan.text.slice(0, 80)}"`
    : `I got ${formatMbps(result.download_mbps)} Mbps on Lekker Speed Test`;

  const description = `Download ${formatMbps(
    result.download_mbps
  )} Mbps · Upload ${formatMbps(
    result.upload_mbps
  )} Mbps · Ping ${Math.round(result.ping_ms)} ms. Test your own on Lekker Speed Test.`;

  return (
    <>
      <SEO
        title={title}
        description={description}
        path={`/result/${id}`}
        ogImage={`${import.meta.env.VITE_SITE_URL || ""}/api/og?id=${id}`}
      />
      <div className="container py-10 md:py-16 max-w-2xl mx-auto space-y-6">
        <ResultCard
          ref={cardRef}
          downloadMbps={result.download_mbps}
          uploadMbps={result.upload_mbps}
          pingMs={result.ping_ms}
          slogan={slogan}
        />

        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={download} variant="accent">
            <Download className="h-4 w-4" />
            Download as image
          </Button>
          <Button asChild variant="outline">
            <Link to="/">
              <HomeIcon className="h-4 w-4" />
              Take your own test
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}