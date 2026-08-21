import React from "react";
import { Helmet } from "react-helmet-async";

function buildAuthorSchema(author) {
  const hasUrl = /^https?:\/\//i.test(author);

  if (hasUrl) {
    return {
      "@type": "Organization",
      name: author,
      url: author,
    };
  }

  if (author.includes(".")) {
    return {
      "@type": "Organization",
      name: author,
      url: `https://${author}`,
    };
  }

  return {
    "@type": "Person",
    name: author,
  };
}

export function Seo({
  title,
  description,
  canonical,
  ogImage,
  ogImageWidth,
  ogImageHeight,
  ogType = "website",
  author,
  publishDate,
  jsonLd,
  noindex = false,
}) {
  const fullTitle = title ? `${title}` : "ahangama.com";
  const jsonLdEntries = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  if (ogType === "article" && author && publishDate) {
    jsonLdEntries.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: fullTitle,
      description,
      author: buildAuthorSchema(author),
      datePublished: publishDate,
      dateModified: publishDate,
      mainEntityOfPage: canonical,
      url: canonical,
      ...(ogImage ? { image: [ogImage] } : {}),
    });
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow"}
      />
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
      {ogImage && <meta property="og:image:secure_url" content={ogImage} />}
      {ogImageWidth && (
        <meta property="og:image:width" content={String(ogImageWidth)} />
      )}
      {ogImageHeight && (
        <meta property="og:image:height" content={String(ogImageHeight)} />
      )}

      <meta
        name="twitter:card"
        content={ogImage ? "summary_large_image" : "summary"}
      />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {jsonLdEntries.map((entry, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  );
}
