import { Helmet } from "react-helmet-async";

export interface SEOProps {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
}

const SITE = import.meta.env.VITE_SITE_URL || "https://lekkerspeedtest.co.za";

export function SEO({
  title,
  description,
  path = "/",
  ogImage,
  noindex,
  jsonLd,
}: SEOProps) {
  const url = `${SITE}${path}`;
  const image = ogImage || `${SITE}/og-default.png`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_ZA" />
      <meta property="og:site_name" content="Lekker Speed Test" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}