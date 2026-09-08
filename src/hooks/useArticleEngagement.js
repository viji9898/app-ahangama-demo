import { useEffect, useRef } from "react";
import { trackArticleEvent } from "../analytics";

const PROGRESS_MILESTONES = [25, 50, 75];

function getReadProgress(articleElement) {
  if (articleElement) {
    const articleTop = articleElement.getBoundingClientRect().top + window.scrollY;
    const articleHeight = articleElement.offsetHeight;

    if (articleHeight <= 0) return 0;

    return Math.min(
      100,
      Math.max(
        0,
        Math.round(
          ((window.scrollY + window.innerHeight - articleTop) / articleHeight) *
            100,
        ),
      ),
    );
  }

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (scrollableHeight <= 0) return 100;

  return Math.min(
    100,
    Math.max(0, Math.round((window.scrollY / scrollableHeight) * 100)),
  );
}

export default function useArticleEngagement({
  articleRef,
  contentId,
  contentTitle,
  articleCategory,
  authorName,
}) {
  const trackedViewContentId = useRef(null);
  const engagementStateRef = useRef(null);

  useEffect(() => {
    if (!contentId) return undefined;

    const baseParameters = {
      content_id: contentId,
      content_title: contentTitle,
      article_category: articleCategory,
      author_name: authorName,
    };
    if (engagementStateRef.current?.contentId !== contentId) {
      engagementStateRef.current = {
        contentId,
        activeReadSeconds: 0,
        completionEmitted: false,
        emittedMilestones: new Set(),
        engagedReadEmitted: false,
        maximumProgress: getReadProgress(articleRef.current),
      };
    }

    const engagementState = engagementStateRef.current;

    if (trackedViewContentId.current !== contentId) {
      trackedViewContentId.current = contentId;
      trackArticleEvent("article_view", baseParameters);
    }

    const evaluateEngagement = () => {
      engagementState.maximumProgress = Math.max(
        engagementState.maximumProgress,
        getReadProgress(articleRef.current),
      );

      PROGRESS_MILESTONES.forEach((progressPercent) => {
        if (
          engagementState.maximumProgress >= progressPercent &&
          !engagementState.emittedMilestones.has(progressPercent)
        ) {
          engagementState.emittedMilestones.add(progressPercent);
          trackArticleEvent("article_progress", {
            ...baseParameters,
            progress_percent: progressPercent,
            active_read_seconds: engagementState.activeReadSeconds,
          });
        }
      });

      if (
        !engagementState.engagedReadEmitted &&
        engagementState.activeReadSeconds >= 15 &&
        engagementState.maximumProgress >= 25
      ) {
        engagementState.engagedReadEmitted = true;
        trackArticleEvent("article_engaged_read", {
          ...baseParameters,
          progress_percent: engagementState.maximumProgress,
          active_read_seconds: engagementState.activeReadSeconds,
        });
      }

      if (
        !engagementState.completionEmitted &&
        engagementState.activeReadSeconds >= 30 &&
        engagementState.maximumProgress >= 90
      ) {
        engagementState.completionEmitted = true;
        trackArticleEvent("article_complete", {
          ...baseParameters,
          progress_percent: engagementState.maximumProgress,
          active_read_seconds: engagementState.activeReadSeconds,
        });
      }
    };

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible" && document.hasFocus()) {
        engagementState.activeReadSeconds += 1;
        evaluateEngagement();
      }
    }, 1000);

    const handleProgress = () => evaluateEngagement();
    window.addEventListener("scroll", handleProgress, { passive: true });
    window.addEventListener("resize", handleProgress);
    evaluateEngagement();

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("scroll", handleProgress);
      window.removeEventListener("resize", handleProgress);
    };
  }, [articleCategory, articleRef, authorName, contentId, contentTitle]);
}