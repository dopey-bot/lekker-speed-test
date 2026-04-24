import { ImageResponse } from "@vercel/og";

export const runtime = "edge";


/**
 * Dynamic Open Graph image for /result/:id.
 * Called by social crawlers. Uses @vercel/og (WASM-based SVG-to-PNG).
 *
 * This deliberately does NOT hit Supabase — for speed and to keep the
 * edge function dependency-light. The client embeds the data it wants
 * rendered as query params:
 *   /api/og?dl=87.3&ul=40.1&ping=12&slogan=Your%20speed%20is%20lekker.
 *
 * If params are missing, falls back to a branded default.
 */
export default async function handler(req: Request) {
  const url = new URL(req.url);
  const dl = url.searchParams.get("dl");
  const ul = url.searchParams.get("ul");
  const ping = url.searchParams.get("ping");
  const slogan = url.searchParams.get("slogan")?.slice(0, 140);

  const hasData = dl && ul && ping;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #007A4D 0%, #004d30 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          padding: 60,
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 32,
              background: "#FFB612",
              borderRadius: 4,
              display: "flex",
            }}
          />
          <div style={{ fontSize: 32, fontWeight: 700 }}>Lekker Speed Test</div>
        </div>

        {hasData ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", gap: 40 }}>
              <Stat label="Download" value={`${dl} Mbps`} />
              <Stat label="Upload" value={`${ul} Mbps`} />
              <Stat label="Ping" value={`${ping} ms`} />
            </div>
            {slogan && (
              <div
                style={{
                  fontSize: 36,
                  fontStyle: "italic",
                  opacity: 0.95,
                  marginTop: 20,
                  display: "flex",
                }}
              >
                &ldquo;{slogan}&rdquo;
              </div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: 64, fontWeight: 800, display: "flex" }}>
            South Africa's Internet Speed Test
          </div>
        )}

        <div style={{ fontSize: 22, opacity: 0.8, display: "flex" }}>
          lekkerspeedtest.co.za
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 20, opacity: 0.7, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: 56, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
