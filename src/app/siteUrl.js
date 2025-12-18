export function getSiteUrl() {
  const raw = import.meta.env.VITE_SITE_URL || "http://localhost:5173";
  return raw.replace(/\/$/, "");
}

export function absUrl(pathname = "/") {
  const base = getSiteUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}
