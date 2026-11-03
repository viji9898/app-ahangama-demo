import { useCallback, useEffect, useState } from "react";

export const ADMIN_PASSWORD_STORAGE_KEY = "ahangama-guide-admin-password";

const ACCESS_PROBE_URL = "/api/venue-stats?check=1";

function readStoredPassword() {
  try {
    return sessionStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

/**
 * Shared admin password gate used by the guide dashboard and the venue
 * statistics pages. The password is kept in sessionStorage only and sent
 * to protected Netlify functions via the X-Admin-Password header.
 *
 * When `VENUE_STATS_AUTH_DISABLED=1` is set for a non-production
 * environment, the API answers the lightweight `?check=1` probe with 200
 * even without a password. `openAccess` then lets the pages skip the gate
 * without weakening production, where the probe still returns 401.
 */
export default function useAdminPassword() {
  const [password, setPassword] = useState(readStoredPassword);
  const [openAccess, setOpenAccess] = useState(false);
  const [probeDone, setProbeDone] = useState(
    () => Boolean(readStoredPassword()),
  );

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    fetch(ACCESS_PROBE_URL, { signal: controller.signal })
      .then((response) => {
        if (!cancelled) setOpenAccess(response.ok);
      })
      .catch(() => {
        if (!cancelled) setOpenAccess(false);
      })
      .finally(() => {
        if (!cancelled) setProbeDone(true);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [password]);

  const accessChecked = Boolean(password) || probeDone;

  const remember = useCallback((value) => {
    const normalized = String(value || "");
    try {
      if (normalized) {
        sessionStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, normalized);
      } else {
        sessionStorage.removeItem(ADMIN_PASSWORD_STORAGE_KEY);
      }
    } catch {
      // The in-memory state still works when storage is blocked.
    }
    setPassword(normalized);
  }, []);

  const forget = useCallback(() => {
    setOpenAccess(false);
    remember("");
  }, [remember]);

  const authorizedFetch = useCallback(
    (url, options = {}) => {
      const headers = new Headers(options.headers || {});
      headers.set("X-Admin-Password", password);
      return fetch(url, { ...options, headers });
    },
    [password],
  );

  return {
    password,
    remember,
    forget,
    authorizedFetch,
    openAccess,
    accessChecked,
  };
}
