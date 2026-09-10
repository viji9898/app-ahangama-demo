import { useEffect, useLayoutEffect, useRef } from "react";
import { trackArticleEvent } from "../../analytics";
import { EDITORIAL_ARTICLES } from "../../data/editorialArticles";
import useArticleEngagement from "../../hooks/useArticleEngagement";

const SECTION_VISIBILITY_THRESHOLD = 0.5;
const SECTION_VISIBILITY_DURATION = 1000;

function getContentId(href = "") {
  return href.split(/[?#]/)[0].replace(/^\/+|\/+$/g, "");
}

function normalizeCategory(category = "") {
  return category.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

function slugify(value = "") {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function getLinkType(link) {
  const href = link.href;

  if (href.startsWith("mailto:")) return "email";
  if (href.startsWith("tel:")) return "telephone";
  if (href.includes("instagram.com")) return "instagram";
  if (href.includes("google.com/maps") || href.includes("maps.app.goo.gl")) {
    return "map";
  }
  if (href.includes("wa.me") || href.includes("whatsapp.com")) {
    return "whatsapp";
  }

  return "external";
}

function isExternalLink(link) {
  const rawHref = link.getAttribute("href") || "";

  if (/^(mailto:|tel:)/i.test(rawHref)) return true;
  if (!/^https?:/i.test(link.href)) return false;

  return new URL(link.href).origin !== window.location.origin;
}

function findPageRoot() {
  return document.querySelector("main, .dm-canvas");
}

function prepareSections(pageRoot) {
  const usedIds = new Set();
  const sections = [...pageRoot.querySelectorAll("section")].filter(
    (section) =>
      !section.closest("[data-article-next]") &&
      !/hero/i.test(section.className),
  );

  sections.forEach((section, index) => {
    if (section.id) {
      usedIds.add(section.id);
      return;
    }

    const heading = section.querySelector("h2, h3, h4");
    const text = section.textContent.trim();
    const proposedId = text.startsWith("Places Mentioned")
      ? "places-mentioned"
      : slugify(heading?.textContent || section.getAttribute("aria-label") || text.slice(0, 72)) ||
        `article-section-${index + 1}`;
    let sectionId = proposedId;
    let duplicateIndex = 2;

    while (usedIds.has(sectionId)) {
      sectionId = `${proposedId}-${duplicateIndex}`;
      duplicateIndex += 1;
    }

    section.id = sectionId;
    usedIds.add(sectionId);
  });

  return sections;
}

function createArticleBounds(sections, pageRoot) {
  const firstSection = sections[0];
  const lastSection = sections.at(-1);

  return {
    getBoundingClientRect() {
      return (firstSection || pageRoot).getBoundingClientRect();
    },
    get offsetHeight() {
      if (!firstSection || !lastSection) return pageRoot.offsetHeight;

      const firstRect = firstSection.getBoundingClientRect();
      const nextArticle = pageRoot.querySelector("[data-article-next]");
      const bottom = nextArticle
        ? nextArticle.getBoundingClientRect().top
        : lastSection.getBoundingClientRect().bottom;

      return Math.max(0, bottom - firstRect.top);
    },
  };
}

export default function EditorialArticleAnalytics({ href, authorName }) {
  const article = EDITORIAL_ARTICLES.find((entry) => entry.href === href);
  const contentId = getContentId(href);
  const contentTitle = article?.title || contentId;
  const articleCategory = normalizeCategory(article?.category);
  const articleRef = useRef(null);
  const pageRootRef = useRef(null);
  const sectionsRef = useRef([]);

  useLayoutEffect(() => {
    const pageRoot = findPageRoot();
    if (!pageRoot) return;

    const sections = prepareSections(pageRoot);
    pageRootRef.current = pageRoot;
    sectionsRef.current = sections;
    articleRef.current = createArticleBounds(sections, pageRoot);
  }, [href]);

  useArticleEngagement({
    articleRef,
    contentId,
    contentTitle,
    articleCategory,
    authorName,
  });

  useEffect(() => {
    const pageRoot = pageRootRef.current;
    const sections = sectionsRef.current;
    if (!pageRoot) return undefined;

    const baseParameters = {
      content_id: contentId,
      content_title: contentTitle,
      article_category: articleCategory,
      author_name: authorName,
    };
    const impressedSectionIds = new Set();
    const visibilityTimers = new Map();
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                const sectionId = entry.target.id;
                const isVisible =
                  entry.isIntersecting &&
                  entry.intersectionRatio >= SECTION_VISIBILITY_THRESHOLD;

                if (!isVisible) {
                  window.clearTimeout(visibilityTimers.get(sectionId));
                  visibilityTimers.delete(sectionId);
                  return;
                }

                if (
                  impressedSectionIds.has(sectionId) ||
                  visibilityTimers.has(sectionId)
                ) {
                  return;
                }

                const timer = window.setTimeout(() => {
                  visibilityTimers.delete(sectionId);
                  if (impressedSectionIds.has(sectionId)) return;

                  impressedSectionIds.add(sectionId);
                  trackArticleEvent("article_section_view", {
                    ...baseParameters,
                    article_section: sectionId,
                    component_location: "article_body",
                  });
                  observer?.unobserve(entry.target);
                }, SECTION_VISIBILITY_DURATION);

                visibilityTimers.set(sectionId, timer);
              });
            },
            { threshold: SECTION_VISIBILITY_THRESHOLD },
          );

    sections.forEach((section) => observer?.observe(section));

    const handleClick = (event) => {
      const link = event.target.closest("a[href]");
      if (!link || !pageRoot.contains(link)) return;

      const nextArticleLink = link.closest("[data-article-next]");
      if (nextArticleLink) {
        trackArticleEvent("article_next_select", {
          ...baseParameters,
          component_location: "article_footer",
          target_content_id:
            nextArticleLink.dataset.targetContentId || getContentId(link.href),
        });
        return;
      }

      if (!isExternalLink(link)) return;

      const sectionId = link.closest("section[id]")?.id || "introduction";
      trackArticleEvent("article_outbound_click", {
        ...baseParameters,
        article_section: sectionId,
        component_location:
          sectionId === "places-mentioned"
            ? "places_mentioned"
            : "article_body",
        destination_url: link.href,
        link_type: getLinkType(link),
      });
    };

    pageRoot.addEventListener("click", handleClick);

    return () => {
      visibilityTimers.forEach((timer) => window.clearTimeout(timer));
      observer?.disconnect();
      pageRoot.removeEventListener("click", handleClick);
    };
  }, [articleCategory, authorName, contentId, contentTitle]);

  return null;
}