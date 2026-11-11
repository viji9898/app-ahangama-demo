/**
 * GuideQrLandingPage.jsx
 *
 * Handles all /go/:section QR landing URLs for the Physical Ahangama Guide.
 *
 * Flow
 * ----
 * 1. User scans a printed QR code → browser opens /go/<section>
 * 2. This page renders briefly (shows a lightweight loading state)
 * 3. After mount, fires the GA4 `qr_scan` event (once, deduplicated)
 * 4. Redirects to the section's current destination using window.location
 *    so attribution params survive and the destination page shows in history
 *
 * The redirect destination is controlled centrally in guideQrRedirects.js.
 * To change where a QR code points, edit that file — no need to touch this page.
 */

import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getQrRedirect } from "../data/guideQrRedirects";
import { trackPhysicalGuideQrScan } from "../analytics";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

export const GUIDE_QR_LANDING_PATH = "/go/:section";

// --- minimal inline styles so this page has zero external CSS dependency ---
const styles = {
  page: {
    minHeight: "100dvh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f0e8",
    fontFamily: "'Inter', sans-serif",
    padding: "24px",
    textAlign: "center",
  },
  logo: {
    fontSize: "1.1rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#1f2a24",
    marginBottom: "8px",
    textTransform: "uppercase",
  },
  heading: {
    fontSize: "1.4rem",
    fontWeight: 600,
    color: "#1f2a24",
    margin: "0 0 8px",
  },
  sub: {
    fontSize: "0.95rem",
    color: "#5a6a62",
    margin: 0,
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "3px solid #c8bfaa",
    borderTopColor: "#1f2a24",
    borderRadius: "50%",
    animation: "qr-spin 0.8s linear infinite",
    margin: "24px auto",
  },
  notFound: {
    marginTop: "16px",
    fontSize: "0.9rem",
    color: "#a0836a",
  },
  link: {
    color: "#1f2a24",
    fontWeight: 600,
    textDecoration: "underline",
  },
};

const SPINNER_CSS = `@keyframes qr-spin { to { transform: rotate(360deg); } }`;

function buildDestinationUrl(destination) {
  // If the destination is already absolute, use it as-is.
  if (/^https?:\/\//.test(destination)) {
    return destination;
  }
  // Build an absolute URL preserving the origin so the GA4 linker can work.
  return `${window.location.origin}${destination}`;
}

export default function GuideQrLandingPage() {
  const { section = "" } = useParams();
  const redirect = getQrRedirect(section);
  // Tracks the slug already reported, so StrictMode's double effect invocation
  // and ordinary re-renders cannot send duplicate qr_scan events. It also
  // allows a new slug to be tracked if this route is reused for a new param.
  const trackedSlugRef = useRef(null);

  useEffect(() => {
    if (!redirect) return;

    // Fire the GA4 event once per slug, before the redirect is scheduled.
    if (trackedSlugRef.current !== redirect.slug) {
      trackedSlugRef.current = redirect.slug;
      trackPhysicalGuideQrScan({
        section: redirect.section,
        codeId:  redirect.codeId,
      });
    }

    const destination = buildDestinationUrl(redirect.destination);

    // Small delay (200 ms) lets the gtag beacon get queued before navigation.
    // GA4 uses navigator.sendBeacon so the hit survives page unload, but the
    // brief pause gives gtag time to call sendBeacon on this page.
    //
    // The timer is always scheduled, even on a repeated effect run: under
    // React StrictMode the first timer is cleaned up, so the second run must
    // schedule a replacement or the redirect would never happen.
    const timer = setTimeout(() => {
      window.location.replace(destination);
    }, 200);

    return () => clearTimeout(timer);
  }, [redirect]);

  if (!redirect) {
    return (
      <>
        <style>{SPINNER_CSS}</style>
        <Seo
          title="Ahangama Guide — Page Not Found"
          description="This QR code destination could not be found."
          canonical={absUrl(`/go/${section}`)}
        />
        <div style={styles.page}>
          <div style={styles.logo}>Ahangama.com</div>
          <h1 style={{ ...styles.heading, color: "#b05a2a" }}>
            QR code not recognised
          </h1>
          <p style={styles.sub}>
            This QR code does not match any section in the guide.
          </p>
          <p style={styles.notFound}>
            <a href="/guide" style={styles.link}>Browse the full online guide →</a>
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{SPINNER_CSS}</style>
      <Seo
        title={`${redirect.label} — Ahangama Guide`}
        description={`Opening the ${redirect.label} section of the Ahangama Guide.`}
        canonical={absUrl(`/go/${section}`)}
      />
      <div style={styles.page}>
        <div style={styles.logo}>Ahangama.com</div>
        <h1 style={styles.heading}>{redirect.label}</h1>
        <p style={styles.sub}>Opening the guide…</p>
        <div style={styles.spinner} role="status" aria-label="Loading" />
        <noscript>
          <meta httpEquiv="refresh" content={`0;url=${redirect.destination}`} />
          <p>
            <a href={redirect.destination}>
              Tap here if you are not redirected automatically.
            </a>
          </p>
        </noscript>
      </div>
    </>
  );
}

