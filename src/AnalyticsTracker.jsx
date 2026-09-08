import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { trackPageView } from "./analytics";

function AnalyticsTracker() {
  const location = useLocation();
  const trackedLocationKey = useRef(null);

  useEffect(() => {
    if (trackedLocationKey.current === location.key) return;

    trackedLocationKey.current = location.key;
    trackPageView(location.pathname);
  }, [location]);

  return null;
}

export default AnalyticsTracker;
