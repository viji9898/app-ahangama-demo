import React from "react";

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
  ogTitle,
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
  const socialTitle = ogTitle || fullTitle;
  const jsonLdEntries = Array.isArray(jsonLd)
    ? [...jsonLd]
    : jsonLd
      ? [jsonLd]
      : [];

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

  const serializedJsonLdEntries = JSON.stringify(
    jsonLdEntries.map((entry) => JSON.stringify(entry)),
  );

  React.useLayoutEffect(() => {
    const head = document.head;
    const appendMeta = (attribute, key, content) => {
      if (!content) return;

      const element = document.createElement("meta");
      element.dataset.runtimeSeo = "true";
      element.setAttribute(attribute, key);
      element.setAttribute("content", String(content));
      head.appendChild(element);
    };

    head
      .querySelectorAll('[data-static-seo="true"], [data-runtime-seo="true"]')
      .forEach((element) => element.remove());

    document.title = fullTitle;

    if (description) appendMeta("name", "description", description);
    if (canonical) {
      const canonicalLink = document.createElement("link");
      canonicalLink.dataset.runtimeSeo = "true";
      canonicalLink.rel = "canonical";
      canonicalLink.href = canonical;
      head.appendChild(canonicalLink);
    }

    appendMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    if (author) {
      appendMeta("name", "author", author);
    }
    if (publishDate) appendMeta("name", "publish_date", publishDate);

    appendMeta("property", "og:title", socialTitle);
    if (description) appendMeta("property", "og:description", description);
    if (canonical) appendMeta("property", "og:url", canonical);
    appendMeta("property", "og:type", ogType);
    if (author) {
      appendMeta("property", "article:author", author);
    }
    if (publishDate) {
      appendMeta("property", "article:published_time", publishDate);
    }
    if (ogImage) {
      appendMeta("property", "og:image", ogImage);
      appendMeta("property", "og:image:secure_url", ogImage);
    }
    if (ogImageWidth) appendMeta("property", "og:image:width", ogImageWidth);
    if (ogImageHeight) {
      appendMeta("property", "og:image:height", ogImageHeight);
    }

    appendMeta(
      "name",
      "twitter:card",
      ogImage ? "summary_large_image" : "summary",
    );
    appendMeta("name", "twitter:title", socialTitle);
    if (description) appendMeta("name", "twitter:description", description);
    if (canonical) appendMeta("name", "twitter:url", canonical);
    if (ogImage) appendMeta("name", "twitter:image", ogImage);

    JSON.parse(serializedJsonLdEntries).forEach((entry) => {
      const script = document.createElement("script");
      script.dataset.runtimeSeo = "true";
      script.type = "application/ld+json";
      script.textContent = entry;
      head.appendChild(script);
    });

    return () => {
      head
        .querySelectorAll('[data-runtime-seo="true"]')
        .forEach((element) => element.remove());
    };
  }, [
    author,
    canonical,
    description,
    fullTitle,
    noindex,
    ogImage,
    ogImageHeight,
    ogImageWidth,
    ogType,
    publishDate,
    serializedJsonLdEntries,
    socialTitle,
  ]);

  return null;
}
