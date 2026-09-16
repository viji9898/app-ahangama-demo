export function getSiteUrl() {
  const raw = import.meta.env.VITE_SITE_URL || "https://ahangama.com";

  try {
    const url = new URL(raw);

    if (["localhost", "127.0.0.1", "0.0.0.0"].includes(url.hostname)) {
      return "https://ahangama.com";
    }

    return raw.replace(/\/$/, "");
  } catch {
    return "https://ahangama.com";
  }
}

export function absUrl(pathname = "/") {
  const base = getSiteUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}
