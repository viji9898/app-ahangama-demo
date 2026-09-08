import React from "react";
import { trackArticleEvent } from "../../analytics";
import useTrackedImpression from "../../hooks/useTrackedImpression";

function getContentId(href = "") {
  return href.split(/[?#]/)[0].replace(/^\/+|\/+$/g, "");
}

function normalizeCategory(category = "") {
  return category.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

export default function TrackedArticleLink({
  article,
  componentLocation,
  position,
  impressedArticleIds,
  children,
  ...anchorProps
}) {
  const contentId = getContentId(article.href);
  const impressionKey = `${componentLocation}:${contentId}`;
  const pageType = componentLocation.startsWith("articles_")
    ? "articles_index"
    : "homepage";
  const impressionRef = useTrackedImpression({
    itemId: impressionKey,
    impressedItemIds: impressedArticleIds,
    onImpression: () =>
      trackArticleEvent("article_card_impression", {
        content_id: contentId,
        content_title: article.title,
        article_category: normalizeCategory(article.category),
        component_location: componentLocation,
        page_type: pageType,
        position,
      }),
  });

  return (
    <a
      {...anchorProps}
      ref={impressionRef}
      href={article.href}
      onClick={(event) => {
        anchorProps.onClick?.(event);
        if (event.defaultPrevented) return;

        trackArticleEvent("article_select", {
          content_id: contentId,
          content_title: article.title,
          article_category: normalizeCategory(article.category),
          component_location: componentLocation,
          page_type: pageType,
          position,
        });
      }}
    >
      {children}
    </a>
  );
}