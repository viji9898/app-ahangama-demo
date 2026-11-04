import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../app/seo";
import useAdminPassword from "../hooks/useAdminPassword";
import { VENUE_STATS } from "../../lib/venue-stats-config.js";
import "../styles/venue-stats.css";

const API_BASE = "/api/venue-stats";

const RANGE_OPTIONS = [
  { key: "7d", label: "7D", days: 7 },
  { key: "30d", label: "30D", days: 30 },
  { key: "90d", label: "90D", days: 90 },
  { key: "365d", label: "365D", days: 365 },
  { key: "this_month", label: "MTD", period: "this_month" },
];

const numberFormat = new Intl.NumberFormat("en-GB");

function formatNumber(value) {
  return numberFormat.format(Number(value) || 0);
}

function formatPercent(value) {
  return `${((Number(value) || 0) * 100).toFixed(1)}%`;
}

function StatsLogin({ authorize, onAuthenticated }) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const ok = await authorize(value);
      if (!ok) throw new Error("Invalid password");
      onAuthenticated(value);
    } catch {
      setError("That password was not accepted.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="vs-page vs-page--gate">
      <Seo title="Venue performance — Admin" noindex />
      <div className="vs-gate">
        <p className="vs-kicker">Ahangama · Venue performance</p>
        <h1>Venue reports</h1>
        <p className="vs-gate__lead">
          This report is restricted to authorised Ahangama administrators.
        </p>
        <form className="vs-gate__form" onSubmit={submit}>
          <label htmlFor="vs-password-index">Admin password</label>
          <input
            id="vs-password-index"
            type="password"
            autoComplete="current-password"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            required
          />
          {error ? (
            <p className="vs-gate__error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={busy || !value}>
            {busy ? "Checking…" : "Open reports"}
          </button>
        </form>
        <Link className="vs-gate__back" to="/guide">
          ← Back to the guide
        </Link>
      </div>
    </div>
  );
}

export default function VenueStatsIndexPage() {
  const {
    password,
    remember,
    forget,
    authorizedFetch,
    openAccess,
    accessChecked,
  } = useAdminPassword();
  const [rangeKey, setRangeKey] = useState("30d");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams({ scope: "overview" });
    if (rangeKey === "this_month") {
      params.set("period", "this_month");
    } else {
      const option = RANGE_OPTIONS.find((item) => item.key === rangeKey);
      params.set("days", String(option?.days || 30));
    }
    return params.toString();
  }, [rangeKey]);

  const loadStats = useCallback(async () => {
    if (!password && !openAccess) return;
    setLoading(true);
    setError("");
    try {
      const response = await authorizedFetch(`${API_BASE}?${queryString}`);
      if (response.status === 401) {
        forget();
        return;
      }
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Unable to load the report");
      }
      setData(payload);
    } catch (loadError) {
      setError(loadError.message || "Unable to load the report");
    } finally {
      setLoading(false);
    }
  }, [authorizedFetch, forget, openAccess, password, queryString]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const authorize = useCallback(async (candidate) => {
    const response = await fetch(`${API_BASE}?check=1`, {
      headers: { "X-Admin-Password": candidate },
    });
    return response.ok;
  }, []);

  if (!password && !openAccess) {
    if (!accessChecked) {
      return (
        <div className="vs-page vs-page--gate">
          <Seo title="Venue performance — Admin" noindex />
          <div className="vs-loader" role="status" aria-live="polite">
            <span className="vs-loader__icon" aria-hidden="true" />
            <span>Checking access</span>
          </div>
        </div>
      );
    }

    return <StatsLogin authorize={authorize} onAuthenticated={remember} />;
  }

  const venues = data?.venues || VENUE_STATS.map((venue) => ({
    key: venue.key,
    name: venue.name,
    shortName: venue.shortName,
    sectionLabel: venue.sectionLabel,
    totalClicks: 0,
    instagramClicks: 0,
    googleMapsClicks: 0,
    websiteClicks: 0,
    impressions: 0,
    uniqueExposed: 0,
    ctr: 0,
  }));

  const totals = venues.reduce(
    (accumulator, venue) => ({
      clicks: accumulator.clicks + venue.totalClicks,
      impressions: accumulator.impressions + venue.impressions,
      exposed: accumulator.exposed + venue.uniqueExposed,
    }),
    { clicks: 0, impressions: 0, exposed: 0 },
  );

  const guide = data?.guide || { pageViews: 0, uniqueVisitors: 0 };
  const ga4Configured = data?.ga4?.configured !== false;
  const dimensionError = (data?.errors || []).some(
    (entry) => entry.code === "GA4_DIMENSION_UNAVAILABLE",
  );
  const ga4Error = (data?.errors || []).find(
    (entry) =>
      !["GA4_DIMENSION_UNAVAILABLE", "GA4_NOT_CONFIGURED"].includes(
        entry.code,
      ),
  );

  return (
    <div className="vs-page">
      <Seo title="Venue performance — Admin" noindex />

      <header className="vs-header">
        <Link className="vs-brand" to="/stats">
          AHANGAMA
        </Link>
        <nav aria-label="Report sections">
          <a href="#venues">Venues</a>
          <Link to="/guide">Guide</Link>
          <Link to="/admin-guide">Guide admin</Link>
        </nav>
      </header>

      <section className="vs-hero vs-hero--index">
        <div>
          <p className="vs-kicker">Venue performance</p>
          <h1>
            The guide,<br /> in numbers.
          </h1>
          <div className="vs-hero__meta">
            <span>{VENUE_STATS.length} tracked venues</span>
            <span>ahangama.com/guide</span>
          </div>
        </div>
        <div className="vs-hero__aside">
          <p>
            Impressions, outbound clicks and click-through rates for the venues
            featured in the Ahangama Digital Guide.
          </p>
          <div className="vs-period" role="group" aria-label="Reporting period">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                className={rangeKey === option.key ? "is-active" : ""}
                onClick={() => setRangeKey(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {!ga4Configured ? (
        <div className="vs-alert" role="status">
          <strong>GA4 Data API is not connected.</strong> Set{" "}
          <code>GA4_PROPERTY_ID</code> and a service-account credential in the
          Netlify environment. Until then, figures are unavailable and shown as
          zero.
        </div>
      ) : null}

      {dimensionError ? (
        <div className="vs-alert" role="status">
          <strong>GA4 custom dimensions are not registered yet.</strong> Register{" "}
          <code>venue_id</code>, <code>venue_slug</code>, <code>venue_name</code>,{" "}
          <code>link_type</code> and <code>link_url</code> in GA4 → Admin →
          Custom definitions.
        </div>
      ) : null}

      {ga4Error ? (
        <div className="vs-alert" role="status">
          <strong>GA4 report could not be read.</strong> {ga4Error.message}
        </div>
      ) : null}

      {error ? (
        <div className="vs-alert vs-alert--error" role="alert">
          {error}
          <button type="button" onClick={loadStats}>
            Retry
          </button>
        </div>
      ) : null}

      <section className="vs-section vs-section--overview">
        <div className="vs-section__heading">
          <p>01 / Combined</p>
          <h2>All eight venues.</h2>
          <span className="vs-range-note">
            {data?.range?.label || "Last 30 days"}
          </span>
        </div>

        <div className="vs-metrics">
          <article className="vs-metric vs-metric--coral">
            <span className="vs-metric__label">Total link clicks</span>
            <strong className="vs-metric__value">
              {formatNumber(totals.clicks)}
            </strong>
            <small className="vs-metric__hint">Instagram + Maps + website</small>
          </article>
          <article className="vs-metric">
            <span className="vs-metric__label">Guide impressions</span>
            <strong className="vs-metric__value">
              {formatNumber(totals.impressions)}
            </strong>
            <small className="vs-metric__hint">
              {formatNumber(totals.exposed)} unique visitors exposed
            </small>
          </article>
          <article className="vs-metric vs-metric--lime">
            <span className="vs-metric__label">Combined CTR</span>
            <strong className="vs-metric__value">
              {formatPercent(
                totals.impressions > 0 ? totals.clicks / totals.impressions : 0,
              )}
            </strong>
            <small className="vs-metric__hint">Clicks ÷ impressions</small>
          </article>
          <article className="vs-metric">
            <span className="vs-metric__label">Guide page views</span>
            <strong className="vs-metric__value">
              {formatNumber(guide.pageViews)}
            </strong>
            <small className="vs-metric__hint">
              {formatNumber(guide.uniqueVisitors)} unique visitors
            </small>
          </article>
        </div>
      </section>

      <section id="venues" className="vs-section">
        <div className="vs-section__heading">
          <p>02 / Venues</p>
          <h2>Open a report.</h2>
          <span className="vs-range-note">
            {data?.range?.startDate && data?.range?.endDate
              ? `${data.range.startDate} → ${data.range.endDate}`
              : ""}
          </span>
        </div>

        {loading && !data ? (
          <div className="vs-loader" role="status">
            <span className="vs-loader__icon" aria-hidden="true" />
            <span>Loading venues</span>
          </div>
        ) : (
          <div className="vs-venue-grid">
            {venues.map((venue, index) => (
              <Link
                key={venue.key}
                to={`/stats/${venue.key}`}
                className="vs-venue-card"
              >
                <div className="vs-venue-card__top">
                  <span className="vs-venue-card__index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="vs-venue-card__section">
                    {venue.sectionLabel}
                  </span>
                </div>
                <h3>{venue.shortName || venue.name}</h3>
                <div className="vs-venue-card__metrics">
                  <div>
                    <strong>{formatNumber(venue.totalClicks)}</strong>
                    <span>clicks</span>
                  </div>
                  <div>
                    <strong>{formatNumber(venue.impressions)}</strong>
                    <span>impressions</span>
                  </div>
                  <div>
                    <strong>{formatPercent(venue.ctr)}</strong>
                    <span>CTR</span>
                  </div>
                </div>
                <div className="vs-venue-card__breakdown">
                  <span>IG {formatNumber(venue.instagramClicks)}</span>
                  <span>Maps {formatNumber(venue.googleMapsClicks)}</span>
                  <span>Web {formatNumber(venue.websiteClicks)}</span>
                </div>
                <span className="vs-venue-card__cta">Open report →</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="vs-sources">
        <div className="vs-sources__heading">
          <p>03 / Method</p>
          <h2>How this report is measured.</h2>
        </div>
        <div className="vs-sources__list">
          <article>
            <h3>Link clicks</h3>
            <p>
              <code>venue_link_click</code> events are sent from the guide with
              the venue id, link type and original destination. No UTM
              parameters are added.
            </p>
          </article>
          <article>
            <h3>Impressions</h3>
            <p>
              <code>venue_impression</code> fires once per venue per render, once
              the card is 50% visible for one second. This is guide exposure, not
              Instagram reach.
            </p>
          </article>
          <article>
            <h3>Page views</h3>
            <p>
              Guide page views and unique visitors come from GA4 for{" "}
              <code>/guide</code>.
            </p>
          </article>
          <article>
            <h3>History</h3>
            <p>
              Nothing is backfilled or estimated. Periods before tracking began
              show zero.
            </p>
          </article>
        </div>
      </section>

      <footer className="vs-footer">
        <span>Ahangama</span>
        <p>
          {data?.generatedAt
            ? `Generated ${new Date(data.generatedAt).toLocaleString("en-GB")}`
            : "Waiting for data"}
        </p>
      </footer>
    </div>
  );
}
