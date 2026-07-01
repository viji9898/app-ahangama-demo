import React, { useEffect, useMemo, useState } from "react";

function getVerificationCode() {
  const search = window.location.search || "";
  const params = new URLSearchParams(search);
  const explicitCode = params.get("code") || params.get("id") || params.get("pass");

  if (explicitCode) {
    return explicitCode.trim();
  }

  return search.replace(/^\?/, "").split("&")[0]?.trim() || "";
}

function formatDate(value) {
  if (!value) {
    return "Not set";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatVenue(slug) {
  return String(slug || "")
    .replace("lighthouse-hotel", "Lighthouse")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "Ahangama";
}

export default function PassValidityPage() {
  const code = useMemo(() => getVerificationCode(), []);
  const [state, setState] = useState({ status: "loading", data: null, error: "" });

  useEffect(() => {
    if (!code) {
      setState({ status: "error", data: null, error: "No pass code was provided." });
      return;
    }

    let cancelled = false;

    async function validatePass() {
      try {
        const response = await fetch(
          `/.netlify/functions/validate-pass?code=${encodeURIComponent(code)}`,
          { cache: "no-store" },
        );
        const payload = await response.json().catch(() => ({}));

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          setState({
            status: "error",
            data: payload,
            error: payload.error || "Pass could not be verified.",
          });
          return;
        }

        setState({ status: "ready", data: payload, error: "" });
      } catch {
        if (!cancelled) {
          setState({ status: "error", data: null, error: "Pass could not be verified." });
        }
      }
    }

    validatePass();

    return () => {
      cancelled = true;
    };
  }, [code]);

  const data = state.data;
  const isValid = data?.isValid;
  const statusLabel = state.status === "loading" ? "Checking" : isValid ? "Valid" : "Expired";
  const statusColor = state.status === "loading" ? "#6b7280" : isValid ? "#047857" : "#b91c1c";

  return (
    <main style={{ minHeight: "100vh", background: "#f6f1e8", padding: "24px 16px", color: "#111" }}>
      <section style={{ maxWidth: 520, margin: "0 auto", background: "#fff", border: "2px solid #111", padding: 22 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: "#ff6f61", marginBottom: 10 }}>
          Ahangama Pass Verification
        </div>
        <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 44, lineHeight: 0.95, margin: "0 0 16px", color: statusColor }}>
          {statusLabel}
        </h1>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "#555", marginBottom: 20 }}>
          Code {code || "missing"}
        </div>

        {state.status === "loading" ? (
          <p style={{ margin: 0, fontSize: 15 }}>Checking this pass now.</p>
        ) : state.status === "error" ? (
          <p style={{ margin: 0, fontSize: 15 }}>{state.error}</p>
        ) : (
          <div>
            <dl style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: "10px 12px", margin: 0, fontSize: 14 }}>
              <dt style={{ fontWeight: 800 }}>Passholder</dt>
              <dd style={{ margin: 0 }}>{data.passholder?.name || "Guest"}</dd>
              <dt style={{ fontWeight: 800 }}>Venue</dt>
              <dd style={{ margin: 0 }}>{formatVenue(data.pass?.sourceHotelSlug)}</dd>
              <dt style={{ fontWeight: 800 }}>Start date</dt>
              <dd style={{ margin: 0 }}>{formatDate(data.pass?.validFrom)}</dd>
              <dt style={{ fontWeight: 800 }}>End date</dt>
              <dd style={{ margin: 0 }}>{formatDate(data.pass?.validUntil)}</dd>
              <dt style={{ fontWeight: 800 }}>Days left</dt>
              <dd style={{ margin: 0 }}>{data.pass?.daysRemaining ?? 0}</dd>
            </dl>
          </div>
        )}
      </section>
    </main>
  );
}
