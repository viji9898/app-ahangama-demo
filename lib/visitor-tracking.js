export function createTrackedLink({
  guestId,
  passId,
  type,
  contentId,
  action,
  source,
  redirectUrl,
} = {}) {
  const params = new URLSearchParams();

  params.set("guestId", String(guestId || ""));
  params.set("passId", String(passId || ""));
  params.set("type", String(type || ""));
  params.set("contentId", String(contentId || ""));
  params.set("action", String(action || ""));

  if (source) {
    params.set("source", String(source));
  }

  params.set("redirect", String(redirectUrl || ""));

  return `/.netlify/functions/track-click?${params.toString()}`;
}
