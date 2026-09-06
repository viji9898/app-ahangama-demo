import { useEffect, useEffectEvent, useRef } from "react";

export default function useTrackedImpression({
  itemId,
  impressedItemIds,
  onImpression,
  threshold = 0.5,
  visibleDuration = 1000,
}) {
  const elementRef = useRef(null);
  const timerRef = useRef(null);
  const emitImpression = useEffectEvent(onImpression);

  useEffect(() => {
    const element = elementRef.current;

    if (
      !element ||
      !itemId ||
      impressedItemIds.current.has(itemId) ||
      typeof IntersectionObserver === "undefined"
    ) {
      return undefined;
    }

    const clearVisibilityTimer = () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible =
          entry.isIntersecting && entry.intersectionRatio >= threshold;

        if (!isVisible) {
          clearVisibilityTimer();
          return;
        }

        if (timerRef.current !== null) return;

        timerRef.current = window.setTimeout(() => {
          timerRef.current = null;

          if (impressedItemIds.current.has(itemId)) return;

          impressedItemIds.current.add(itemId);
          emitImpression();
          observer.disconnect();
        }, visibleDuration);
      },
      { threshold },
    );

    observer.observe(element);

    return () => {
      clearVisibilityTimer();
      observer.disconnect();
    };
  }, [impressedItemIds, itemId, threshold, visibleDuration]);

  return elementRef;
}