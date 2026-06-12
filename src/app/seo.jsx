import React from "react";
import { Helmet } from "react-helmet-async";

export function Seo({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  author,
  publishDate,
  jsonLd,
}) {
  const fullTitle = title ? `${title}` : "ahangama.com";
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {author && <meta name="author" content={author} />}
      {author && <meta property="author" content={author} />}
      {publishDate && <meta name="publish_date" content={publishDate} />}

      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:type" content={ogType} />
      {author && <meta property="article:author" content={author} />}
      {author && <meta name="article:author" content={author} />}
      {publishDate && (
        <meta property="article:published_time" content={publishDate} />
      )}
      {ogImage && <meta property="og:image" content={ogImage} />}

      <meta
        name="twitter:card"
        content={ogImage ? "summary_large_image" : "summary"}
      />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
