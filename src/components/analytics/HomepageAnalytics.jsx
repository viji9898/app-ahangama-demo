import { useEffect } from "react";
import { trackHomeEvent } from "../../analytics";

const VISIBILITY_THRESHOLD = 0.5;
const VISIBILITY_DURATION = 1000;

function getContentParameters(element) {
  const position = Number(element.dataset.homePosition);

  return {
    content_id: element.dataset.homeContentId,
    content_title: element.dataset.homeContentTitle,
    content_type: element.dataset.homeContentType || "link",
    home_section: element.dataset.homeSection,
    component_location: element.dataset.homeSection,
    ...(Number.isFinite(position) && position > 0 ? { position } : {}),
  };
}

function getLinkType(link) {
  const hostname = new URL(link.href, window.location.origin).hostname;

  if (hostname.includes("instagram.com")) return "instagram";
  if (hostname === "wa.me" || hostname.includes("whatsapp.com")) {
    return "whatsapp";
  }

  return "website";
}

function isExternalLink(link) {
  return new URL(link.href, window.location.origin).origin !== window.location.origin;
}

export default function HomepageAnalytics({ pageRootRef }) {
  useEffect(() => {
    const pageRoot = pageRootRef.current;
    if (!pageRoot || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const visibilityTimers = new WeakMap();
    const pendingTimers = new Set();
    const observedElements = new WeakSet();
    const impressedSections = new Set();
    const impressedContent = new Set();

    const clearVisibilityTimer = (element) => {
      const timer = visibilityTimers.get(element);
      if (timer) {
        window.clearTimeout(timer);
        pendingTimers.delete(timer);
      }
      visibilityTimers.delete(element);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target;
          const isVisible =
            entry.isIntersecting &&
            entry.intersectionRatio >= VISIBILITY_THRESHOLD;

          if (!isVisible) {
            clearVisibilityTimer(element);
            return;
          }

          if (visibilityTimers.has(element)) return;

          const sectionId = element.dataset.homeSectionView;
          const contentId = element.dataset.homeContentId;
          const parameters = contentId ? getContentParameters(element) : null;
          const impressionKey = parameters
            ? `${parameters.home_section}:${contentId}:${parameters.position || ""}`
            : "";

          if (
            (sectionId && impressedSections.has(sectionId)) ||
            (impressionKey && impressedContent.has(impressionKey))
          ) {
            observer.unobserve(element);
            return;
          }

          const timer = window.setTimeout(() => {
            visibilityTimers.delete(element);
            pendingTimers.delete(timer);

            if (sectionId && !impressedSections.has(sectionId)) {
              impressedSections.add(sectionId);
              trackHomeEvent("home_section_view", {
                home_section: sectionId,
                component_location: sectionId,
              });
            }

            if (parameters && !impressedContent.has(impressionKey)) {
              impressedContent.add(impressionKey);
              trackHomeEvent("home_content_impression", parameters);
            }

            observer.unobserve(element);
          }, VISIBILITY_DURATION);

          visibilityTimers.set(element, timer);
          pendingTimers.add(timer);
        });
      },
      { threshold: VISIBILITY_THRESHOLD },
    );

    const observeTrackableElements = (root = pageRoot) => {
      const candidates = [];

      if (root instanceof Element && root.matches("[data-home-section-view], [data-home-content-id]")) {
        candidates.push(root);
      }

      candidates.push(
        ...root.querySelectorAll("[data-home-section-view], [data-home-content-id]"),
      );

      candidates.forEach((element) => {
        if (observedElements.has(element)) return;
        observedElements.add(element);
        observer.observe(element);
      });
    };

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) observeTrackableElements(node);
        });
      });
    });

    const handleClick = (event) => {
      const control = event.target.closest("[data-home-control]");
      if (control && pageRoot.contains(control)) {
        trackHomeEvent("home_control_select", {
          control_name: control.dataset.homeControl,
          home_section: control.dataset.homeSection,
          component_location: control.dataset.homeSection,
        });
      }

      const content = event.target.closest("[data-home-content-id]");
      if (!content || !pageRoot.contains(content)) return;

      const parameters = getContentParameters(content);
      const link = content.closest("a[href]");

      if (link && isExternalLink(link)) {
        trackHomeEvent("home_outbound_click", {
          ...parameters,
          destination_url: link.href,
          link_type: getLinkType(link),
        });
        return;
      }

      trackHomeEvent("home_content_select", {
        ...parameters,
        ...(link ? { destination_url: link.href } : {}),
      });
    };

    observeTrackableElements();
    mutationObserver.observe(pageRoot, { childList: true, subtree: true });
    pageRoot.addEventListener("click", handleClick);

    return () => {
      pendingTimers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
      mutationObserver.disconnect();
      pageRoot.removeEventListener("click", handleClick);
    };
  }, [pageRootRef]);

  return null;
}