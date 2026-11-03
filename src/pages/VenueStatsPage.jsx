import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo } from "../app/seo";
import useAdminPassword from "../hooks/useAdminPassword";
import {
  LINK_TYPES,
  getVenueStats,
} from "../../lib/venue-stats-config.js";
import "../styles/venue-stats.css";

const API_BASE = "/api/venue-stats";
const CONTENT_API = "/api/venue-content";

const RANGE_OPTIONS = [
  { key: "7d", label: "7D", days: 7 },
  { key: "30d", label: "30D", days: 30 },
  { key: "90d", label: "90D", days: 90 },
  { key: "180d", label: "180D", days: 180 },
  { key: "365d", label: "365D", days: 365 },
  { key: "this_month", label: "MTD", period: "this_month" },
  { key: "custom", label: "Custom" },
];

const GRANULARITIES = [
  { key: "day", label: "Daily" },
  { key: "week", label: "Weekly" },
  { key: "month", label: "Monthly" },
];

const EMPTY_POST = {
  id: null,
  postUrl: "",
  postDate: "",
  postType: "post",
  reach: "",
  impressions: "",
  likes: "",
  comments: "",
  shares: "",
  saves: "",
  notes: "",
};

const EMPTY_ARTICLE = {
  id: null,
  title: "",
  url: "",
  publishedAt: "",
};

const numberFormat = new Intl.NumberFormat("en-GB");

function formatNumber(value) {
  return numberFormat.format(Number(value) || 0);
}

function formatPercent(value, digits = 1) {
  const numeric = Number(value) || 0;
  return `${(numeric * 100).toFixed(digits)}%`;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatShortDate(value) {
  if (!value) return "";
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function isoDaysAgo(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - (days - 1));
  return date.toISOString().slice(0, 10);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function buildSeries(daily, granularity) {
  const buckets = new Map();

  for (const entry of daily || []) {
    let key = entry.date;
    if (granularity === "month") key = entry.date.slice(0, 7);
    if (granularity === "week") {
      const date = new Date(`${entry.date}T00:00:00.000Z`);
      const day = (date.getUTCDay() + 6) % 7;
      date.setUTCDate(date.getUTCDate() - day);
      key = date.toISOString().slice(0, 10);
    }

    if (!buckets.has(key)) {
      buckets.set(key, { key, clicks: 0, impressions: 0, users: 0 });
    }
    const bucket = buckets.get(key);
    bucket.clicks += entry.clicks || 0;
    bucket.impressions += entry.impressions || 0;
    bucket.users += entry.users || 0;
  }

  return Array.from(buckets.values())
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((bucket) => ({
      ...bucket,
      label:
        granularity === "month"
          ? new Date(`${bucket.key}-01T00:00:00.000Z`).toLocaleDateString(
              "en-GB",
              { month: "short", year: "numeric", timeZone: "UTC" },
            )
          : granularity === "week"
            ? `w/c ${formatShortDate(bucket.key)}`
            : formatShortDate(bucket.key),
    }));
}

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

function StatsLoader({ label = "Loading report" }) {
  return (
    <div className="vs-loader" role="status" aria-live="polite">
      <span className="vs-loader__icon" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function MetricCard({ label, value, hint, tone = "" }) {
  return (
    <article className={`vs-metric ${tone ? `vs-metric--${tone}` : ""}`}>
      <span className="vs-metric__label">{label}</span>
      <strong className="vs-metric__value">{value}</strong>
      {hint ? <small className="vs-metric__hint">{hint}</small> : null}
    </article>
  );
}

function TrendChart({ series, granularity }) {
  if (!series.length) {
    return (
      <p className="vs-empty">
        No click or impression events recorded for this period yet.
      </p>
    );
  }

  const width = Math.max(720, series.length * 26 + 120);
  const height = 290;
  const padding = { top: 18, right: 58, bottom: 38, left: 52 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const step = plotWidth / series.length;
  const maxClicks = Math.max(1, ...series.map((point) => point.clicks));
  const maxImpressions = Math.max(
    1,
    ...series.map((point) => point.impressions),
  );
  const barWidth = Math.max(4, Math.min(16, step * 0.58));
  const labelStep = Math.max(1, Math.ceil(series.length / 8));
  const lastLabelIndex = Math.floor((series.length - 1) / labelStep) * labelStep;

  const showLabel = (index) => {
    if (index === 0) return true;
    if (index === series.length - 1) {
      return series.length - 1 - lastLabelIndex >= Math.ceil(labelStep / 2);
    }
    return index % labelStep === 0;
  };

  const yForClicks = (value) =>
    padding.top + plotHeight - (value / maxClicks) * plotHeight;
  const yForImpressions = (value) =>
    padding.top + plotHeight - (value / maxImpressions) * plotHeight;
  const xFor = (index) => padding.left + step * index + step / 2;

  const linePoints = series
    .map((point, index) => `${xFor(index)},${yForImpressions(point.impressions)}`)
    .join(" ");

  return (
    <div className="vs-chart">
      <div className="vs-chart__legend">
        <span className="vs-chart__key vs-chart__key--clicks">
          Link clicks <em>left</em>
        </span>
        <span className="vs-chart__key vs-chart__key--impressions">
          Guide impressions <em>right</em>
        </span>
        <span className="vs-chart__granularity">{granularity}</span>
      </div>
      <div className="vs-chart__scroll">
        <svg
          className="vs-chart__svg"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Link clicks and guide impressions by ${granularity}`}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + plotHeight * ratio;
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  className="vs-chart__grid"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="vs-chart__axis"
                >
                  {formatNumber(Math.round(maxClicks * (1 - ratio)))}
                </text>
                <text
                  x={width - padding.right + 10}
                  y={y + 4}
                  textAnchor="start"
                  className="vs-chart__axis vs-chart__axis--right"
                >
                  {formatNumber(Math.round(maxImpressions * (1 - ratio)))}
                </text>
              </g>
            );
          })}

          {series.map((point, index) => {
            const barTop = yForClicks(point.clicks);
            const barHeight = padding.top + plotHeight - barTop;
            return (
              <g key={point.key}>
                <rect
                  x={xFor(index) - barWidth / 2}
                  y={barTop}
                  width={barWidth}
                  height={Math.max(barHeight, point.clicks > 0 ? 2 : 0)}
                  className="vs-chart__bar"
                >
                  <title>
                    {`${point.label}: ${formatNumber(point.clicks)} clicks, ${formatNumber(point.impressions)} impressions`}
                  </title>
                </rect>
                {showLabel(index) ? (
                  <text
                    x={xFor(index)}
                    y={height - 12}
                    textAnchor="middle"
                    className="vs-chart__axis"
                  >
                    {point.label.replace(/^w\/c /, "")}
                  </text>
                ) : null}
              </g>
            );
          })}

          <polyline
            points={linePoints}
            className="vs-chart__line"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}

function LinkBreakdown({ items, totalClicks }) {
  return (
    <div className="vs-links">
      {items.map((item) => {
        const share = totalClicks > 0 ? item.clicks / totalClicks : 0;
        return (
          <article key={item.key} className="vs-link">
            <div className="vs-link__head">
              <div>
                <span className="vs-link__label">{item.label}</span>
                <small className="vs-link__host">
                  {item.url ? hostOf(item.url) : "No link configured"}
                </small>
              </div>
              <strong className="vs-link__value">
                {formatNumber(item.clicks)}
              </strong>
            </div>
            <div className="vs-link__track" aria-hidden="true">
              <span
                className={`vs-link__fill vs-link__fill--${item.key}`}
                style={{ width: `${Math.max(share * 100, item.clicks > 0 ? 2 : 0)}%` }}
              />
            </div>
            <div className="vs-link__foot">
              <span>{formatPercent(share, 0)} of clicks</span>
              <span>{formatNumber(item.users)} unique clickers</span>
            </div>
            {item.url ? (
              <a
                className="vs-link__anchor"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open destination ↗
              </a>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Auth gate                                                           */
/* ------------------------------------------------------------------ */

function StatsLogin({ title, onAuthenticated, authorize }) {
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
      <Seo title={`${title} — Admin`} noindex />
      <div className="vs-gate">
        <p className="vs-kicker">Ahangama · Venue performance</p>
        <h1>{title}</h1>
        <p className="vs-gate__lead">
          This report is restricted to authorised Ahangama administrators.
        </p>
        <form className="vs-gate__form" onSubmit={submit}>
          <label htmlFor="vs-password">Admin password</label>
          <input
            id="vs-password"
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
            {busy ? "Checking…" : "Open report"}
          </button>
        </form>
        <Link className="vs-gate__back" to="/guide">
          ← Back to the guide
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function VenueStatsPage() {
  const { venueSlug } = useParams();
  const config = getVenueStats(venueSlug);
  const {
    password,
    remember,
    forget,
    authorizedFetch,
    openAccess,
    accessChecked,
  } = useAdminPassword();

  const [rangeKey, setRangeKey] = useState("30d");
  const [customStart, setCustomStart] = useState(() => isoDaysAgo(30));
  const [customEnd, setCustomEnd] = useState(() => todayIso());
  const [appliedCustom, setAppliedCustom] = useState({
    start: isoDaysAgo(30),
    end: todayIso(),
  });
  const [granularity, setGranularity] = useState("day");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [postDraft, setPostDraft] = useState(null);
  const [articleDraft, setArticleDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams({ venue: config?.key || "" });
    if (rangeKey === "custom") {
      params.set("start", appliedCustom.start);
      params.set("end", appliedCustom.end);
    } else if (rangeKey === "this_month") {
      params.set("period", "this_month");
    } else {
      const option = RANGE_OPTIONS.find((item) => item.key === rangeKey);
      params.set("days", String(option?.days || 30));
    }
    return params.toString();
  }, [appliedCustom.end, appliedCustom.start, config?.key, rangeKey]);

  const loadStats = useCallback(async () => {
    if (!config || (!password && !openAccess)) return;
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
  }, [authorizedFetch, config, forget, openAccess, password, queryString]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const authorize = useCallback(
    async (candidate) => {
      if (!config) return false;
      const response = await fetch(
        `${API_BASE}?venue=${encodeURIComponent(config.key)}&days=7`,
        { headers: { "X-Admin-Password": candidate } },
      );
      return response.ok;
    },
    [config],
  );

  const savePost = async (event) => {
    event.preventDefault();
    if (!postDraft) return;
    setSaving(true);
    setNotice("");
    try {
      const response = await authorizedFetch(
        `${CONTENT_API}?venue=${encodeURIComponent(config.key)}&type=instagram`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postDraft),
        },
      );
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Could not save the post");
      }
      setPostDraft(null);
      setNotice("Instagram post saved.");
      await loadStats();
    } catch (saveError) {
      setNotice(saveError.message || "Could not save the post");
    } finally {
      setSaving(false);
    }
  };

  const removePost = async (post) => {
    if (!window.confirm(`Remove ${post.postUrl} from this venue?`)) return;
    setSaving(true);
    try {
      await authorizedFetch(
        `${CONTENT_API}?venue=${encodeURIComponent(config.key)}&type=instagram&id=${post.id}`,
        { method: "DELETE" },
      );
      setNotice("Instagram post removed.");
      await loadStats();
    } finally {
      setSaving(false);
    }
  };

  const saveArticle = async (event) => {
    event.preventDefault();
    if (!articleDraft) return;
    setSaving(true);
    setNotice("");
    try {
      const response = await authorizedFetch(
        `${CONTENT_API}?venue=${encodeURIComponent(config.key)}&type=article`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(articleDraft),
        },
      );
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Could not save the article");
      }
      setArticleDraft(null);
      setNotice("Article saved.");
      await loadStats();
    } catch (saveError) {
      setNotice(saveError.message || "Could not save the article");
    } finally {
      setSaving(false);
    }
  };

  const removeArticle = async (article) => {
    if (!window.confirm(`Remove ${article.title} from this venue?`)) return;
    setSaving(true);
    try {
      await authorizedFetch(
        `${CONTENT_API}?venue=${encodeURIComponent(config.key)}&type=article&id=${article.id}`,
        { method: "DELETE" },
      );
      setNotice("Article removed.");
      await loadStats();
    } finally {
      setSaving(false);
    }
  };

  if (!config) {
    return (
      <div className="vs-page vs-page--gate">
        <Seo title="Venue report not found — Admin" noindex />
        <div className="vs-gate">
          <p className="vs-kicker">Ahangama · Venue performance</p>
          <h1>Report not found</h1>
          <p className="vs-gate__lead">
            There is no statistics page for “{venueSlug}”.
          </p>
          <Link className="vs-gate__back" to="/stats">
            ← All venue reports
          </Link>
        </div>
      </div>
    );
  }

  if (!password && !openAccess) {
    if (!accessChecked) {
      return (
        <div className="vs-page vs-page--gate">
          <Seo title={`${config.name} — Venue performance`} noindex />
          <StatsLoader label="Checking access" />
        </div>
      );
    }

    return (
      <StatsLogin
        title={config.name}
        authorize={authorize}
        onAuthenticated={remember}
      />
    );
  }

  const metrics = data?.metrics || {};
  const series = buildSeries(data?.daily || [], granularity);
  const posts = data?.content?.instagram?.posts || [];
  const postTotals = data?.content?.instagram?.totals || {};
  const articles = data?.content?.articles || [];
  const links = data?.linkBreakdown || LINK_TYPES.map((type) => ({
    ...type,
    clicks: 0,
    users: 0,
    url: config[type.key === "google_maps" ? "googleMaps" : type.key],
  }));

  const dimensionError = (data?.errors || []).some(
    (entry) => entry.code === "GA4_DIMENSION_UNAVAILABLE",
  );
  const ga4Configured = data?.ga4?.configured !== false;
  const trackingStarted = metrics.trackingStartedAt;
  const ga4Error = (data?.errors || []).find(
    (entry) =>
      !["GA4_DIMENSION_UNAVAILABLE", "GA4_NOT_CONFIGURED"].includes(
        entry.code,
      ) &&
      !["instagram", "articlesDb"].includes(entry.section),
  );

  return (
    <div className="vs-page">
      <Seo title={`${config.name} — Venue performance`} noindex />

      <header className="vs-header">
        <Link className="vs-brand" to="/stats">
          AHANGAMA
        </Link>
        <nav aria-label="Report sections">
          <a href="#overview">Overview</a>
          <a href="#links">Links</a>
          <a href="#content">Content</a>
          <Link to="/stats">All venues</Link>
        </nav>
      </header>

      <section className="vs-hero">
        <div>
          <p className="vs-kicker">Venue performance</p>
          <h1>
            {config.shortName},<br /> in numbers.
          </h1>
          <div className="vs-hero__meta">
            <span>{config.sectionLabel}</span>
            <span>ahangama.com/guide</span>
          </div>
        </div>
        <div className="vs-hero__aside">
          <p>
            How visitors find {config.shortName} in the Ahangama Digital Guide,
            and what they do once they see it.
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
          {rangeKey === "custom" ? (
            <div className="vs-custom-range">
              <label>
                From
                <input
                  type="date"
                  value={customStart}
                  max={customEnd}
                  onChange={(event) => setCustomStart(event.target.value)}
                />
              </label>
              <label>
                To
                <input
                  type="date"
                  value={customEnd}
                  min={customStart}
                  max={todayIso()}
                  onChange={(event) => setCustomEnd(event.target.value)}
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  setAppliedCustom({ start: customStart, end: customEnd })
                }
              >
                Apply
              </button>
            </div>
          ) : null}
        </div>
      </section>

      {notice ? (
        <p className="vs-notice" role="status">
          {notice}
        </p>
      ) : null}

      {!ga4Configured ? (
        <div className="vs-alert" role="status">
          <strong>GA4 Data API is not connected.</strong> Set
          {" "}<code>GA4_PROPERTY_ID</code> and a service-account credential in
          the Netlify environment. Until then, click and impression figures are
          unavailable and shown as zero.
        </div>
      ) : null}

      {dimensionError ? (
        <div className="vs-alert" role="status">
          <strong>GA4 custom dimensions are not registered yet.</strong> Register
          the event-scoped dimensions <code>venue_id</code>,{" "}
          <code>venue_slug</code>, <code>venue_name</code>,{" "}
          <code>link_type</code> and <code>link_url</code> in GA4 → Admin →
          Custom definitions. Data collected before registration cannot be
          broken down per venue.
        </div>
      ) : null}

      {trackingStarted === null && data && ga4Configured && !dimensionError ? (
        <div className="vs-alert" role="status">
          <strong>No venue link clicks recorded yet.</strong> Tracking starts
          from the first <code>venue_link_click</code> event. Figures before
          that date are not estimated.
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

      <section id="overview" className="vs-section vs-section--overview">
        <div className="vs-section__heading">
          <p>01 / Overview</p>
          <h2>Visibility and engagement.</h2>
          <span className="vs-range-note">
            {data?.range?.label || "Last 30 days"}
          </span>
        </div>

        {loading && !data ? (
          <StatsLoader />
        ) : (
          <div className="vs-metrics">
            <MetricCard
              label="Total link clicks"
              value={formatNumber(metrics.totalClicks)}
              hint={`${formatNumber(metrics.uniqueClickers)} unique clickers`}
              tone="coral"
            />
            <MetricCard
              label="Guide impressions"
              value={formatNumber(metrics.impressions)}
              hint={`${formatNumber(metrics.uniqueExposed)} unique visitors exposed`}
            />
            <MetricCard
              label="Click-through rate"
              value={formatPercent(metrics.ctr)}
              hint="Clicks ÷ guide impressions"
              tone="lime"
            />
            <MetricCard
              label="Guide page views"
              value={formatNumber(metrics.guidePageViews)}
              hint={`${formatNumber(metrics.guideUniqueVisitors)} unique guide visitors`}
            />
            <MetricCard
              label="Instagram clicks"
              value={formatNumber(metrics.instagramClicks)}
              hint={`${formatNumber(metrics.googleMapsClicks)} maps · ${formatNumber(metrics.websiteClicks)} website`}
            />
          </div>
        )}

        <p className="vs-note">
          Guide impressions count a venue card only when it is at least 50%
          visible for one continuous second. They are not Instagram reach.
          {trackingStarted
            ? ` Tracking for this event began on ${formatDate(trackingStarted)}.`
            : ""}
        </p>
      </section>

      <section id="links" className="vs-section">
        <div className="vs-section__heading">
          <p>02 / External links</p>
          <h2>Where visitors go next.</h2>
          <span className="vs-range-note">
            {data?.range?.startDate && data?.range?.endDate
              ? `${formatDate(data.range.startDate)} → ${formatDate(data.range.endDate)}`
              : ""}
          </span>
        </div>

        {loading && !data ? (
          <StatsLoader label="Loading link performance" />
        ) : (
          <>
            <LinkBreakdown items={links} totalClicks={metrics.totalClicks} />
            <div className="vs-chart-panel">
              <div className="vs-chart-panel__head">
                <h3>Performance over time</h3>
                <div className="vs-granularity" role="group" aria-label="Chart grouping">
                  {GRANULARITIES.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      className={granularity === option.key ? "is-active" : ""}
                      onClick={() => setGranularity(option.key)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <TrendChart series={series} granularity={granularity} />
            </div>
          </>
        )}
      </section>

      <section id="content" className="vs-section vs-section--content">
        <div className="vs-section__heading">
          <p>03 / Content</p>
          <h2>What we published.</h2>
          <span className="vs-range-note">
            Instagram metrics are entered manually · article traffic is live GA4
          </span>
        </div>

        <div className="vs-content-block">
          <div className="vs-content-block__head">
            <div>
              <h3>Instagram content</h3>
              <p>
                {posts.length} post{posts.length === 1 ? "" : "s"} ·{" "}
                {formatNumber(postTotals.reach)} reach ·{" "}
                {formatNumber(
                  (postTotals.likes || 0) +
                    (postTotals.comments || 0) +
                    (postTotals.shares || 0) +
                    (postTotals.saves || 0),
                )}{" "}
                interactions
              </p>
            </div>
            <button
              type="button"
              className="vs-btn vs-btn--primary"
              onClick={() => setPostDraft({ ...EMPTY_POST })}
            >
              + Add Instagram post
            </button>
          </div>

          {posts.length === 0 ? (
            <p className="vs-empty">
              No Instagram posts recorded for this venue yet. Add a post to
              track its reach, impressions and interactions.
            </p>
          ) : (
            <div className="vs-table-scroll">
              <table className="vs-table">
                <thead>
                  <tr>
                    <th>Post</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Reach</th>
                    <th>Impr.</th>
                    <th>Likes</th>
                    <th>Comments</th>
                    <th>Shares</th>
                    <th>Saves</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <a
                          href={post.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {post.notes || post.postUrl}
                        </a>
                      </td>
                      <td>{formatDate(post.postDate)}</td>
                      <td className="vs-table__type">{post.postType}</td>
                      <td>{formatNumber(post.reach)}</td>
                      <td>{formatNumber(post.impressions)}</td>
                      <td>{formatNumber(post.likes)}</td>
                      <td>{formatNumber(post.comments)}</td>
                      <td>{formatNumber(post.shares)}</td>
                      <td>{formatNumber(post.saves)}</td>
                      <td className="vs-table__actions">
                        <button
                          type="button"
                          onClick={() => setPostDraft({ ...post })}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="is-danger"
                          onClick={() => removePost(post)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="vs-content-block">
          <div className="vs-content-block__head">
            <div>
              <h3>Ahangama.com articles</h3>
              <p>
                {articles.length} article{articles.length === 1 ? "" : "s"}{" "}
                associated with this venue
              </p>
            </div>
            <button
              type="button"
              className="vs-btn vs-btn--ghost"
              onClick={() => setArticleDraft({ ...EMPTY_ARTICLE })}
            >
              + Add article
            </button>
          </div>

          {articles.length === 0 ? (
            <p className="vs-empty">
              No Ahangama.com articles are linked to this venue yet.
            </p>
          ) : (
            <div className="vs-table-scroll">
              <table className="vs-table">
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Published</th>
                    <th>Page views</th>
                    <th>Unique visitors</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.path || article.url}>
                      <td>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {article.title}
                        </a>
                      </td>
                      <td>{formatDate(article.publishedAt)}</td>
                      <td>{formatNumber(article.pageViews)}</td>
                      <td>{formatNumber(article.uniqueVisitors)}</td>
                      <td className="vs-table__actions">
                        {article.manual ? (
                          <button
                            type="button"
                            className="is-danger"
                            onClick={() => removeArticle(article)}
                          >
                            Remove
                          </button>
                        ) : (
                          <span className="vs-table__static">Linked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="vs-sources">
        <div className="vs-sources__heading">
          <p>04 / Method</p>
          <h2>How this report is measured.</h2>
        </div>
        <div className="vs-sources__list">
          <article>
            <h3>Link clicks</h3>
            <p>
              Every Instagram, Google Maps and website link in the guide sends a
              <code> venue_link_click</code> event with the venue id, link type
              and original destination. No UTM parameters or tracking
              parameters are added.
            </p>
          </article>
          <article>
            <h3>Impressions</h3>
            <p>
              A <code>venue_impression</code> event fires once per venue per page
              render, after the card is 50% visible for one second. It is not
              Instagram reach and not a page view.
            </p>
          </article>
          <article>
            <h3>Page views</h3>
            <p>
              Guide page views and unique visitors come from GA4 for{" "}
              <code>/guide</code>. Article traffic comes from GA4 for each
              associated article URL.
            </p>
          </article>
          <article>
            <h3>Instagram</h3>
            <p>
              Instagram Insights are not available through GA4. Post reach,
              impressions and interactions are entered by an administrator and
              stored in the Ahangama database.
            </p>
          </article>
          <article>
            <h3>History</h3>
            <p>
              Nothing is backfilled or estimated. Periods before tracking began
              show zero, and the report states the first recorded click date.
            </p>
          </article>
        </div>
      </section>

      <footer className="vs-footer">
        <span>{config.shortName}</span>
        <p>
          {data?.generatedAt
            ? `Generated ${new Date(data.generatedAt).toLocaleString("en-GB")}`
            : "Waiting for data"}
        </p>
      </footer>

      {postDraft ? (
        <div className="vs-modal" role="dialog" aria-modal="true" aria-labelledby="vs-post-title">
          <form className="vs-modal__dialog" onSubmit={savePost}>
            <button
              type="button"
              className="vs-modal__close"
              onClick={() => setPostDraft(null)}
              aria-label="Close"
            >
              ×
            </button>
            <p className="vs-modal__eyebrow">
              {postDraft.id ? "Edit Instagram post" : "New Instagram post"}
            </p>
            <h2 id="vs-post-title">Instagram metrics</h2>
            <div className="vs-form-grid">
              <label className="vs-field vs-field--wide">
                Post or reel URL
                <input
                  type="url"
                  required
                  value={postDraft.postUrl}
                  onChange={(event) =>
                    setPostDraft({ ...postDraft, postUrl: event.target.value })
                  }
                  placeholder="https://www.instagram.com/p/..."
                />
              </label>
              <label className="vs-field">
                Post date
                <input
                  type="date"
                  value={postDraft.postDate || ""}
                  onChange={(event) =>
                    setPostDraft({ ...postDraft, postDate: event.target.value })
                  }
                />
              </label>
              <label className="vs-field">
                Post type
                <select
                  value={postDraft.postType || "post"}
                  onChange={(event) =>
                    setPostDraft({ ...postDraft, postType: event.target.value })
                  }
                >
                  <option value="post">Post</option>
                  <option value="reel">Reel</option>
                  <option value="story">Story</option>
                </select>
              </label>
              <label className="vs-field">
                Reach
                <input
                  type="number"
                  min="0"
                  value={postDraft.reach}
                  onChange={(event) =>
                    setPostDraft({ ...postDraft, reach: event.target.value })
                  }
                />
              </label>
              <label className="vs-field">
                Impressions
                <input
                  type="number"
                  min="0"
                  value={postDraft.impressions}
                  onChange={(event) =>
                    setPostDraft({
                      ...postDraft,
                      impressions: event.target.value,
                    })
                  }
                />
              </label>
              <label className="vs-field">
                Likes
                <input
                  type="number"
                  min="0"
                  value={postDraft.likes}
                  onChange={(event) =>
                    setPostDraft({ ...postDraft, likes: event.target.value })
                  }
                />
              </label>
              <label className="vs-field">
                Comments
                <input
                  type="number"
                  min="0"
                  value={postDraft.comments}
                  onChange={(event) =>
                    setPostDraft({ ...postDraft, comments: event.target.value })
                  }
                />
              </label>
              <label className="vs-field">
                Shares
                <input
                  type="number"
                  min="0"
                  value={postDraft.shares}
                  onChange={(event) =>
                    setPostDraft({ ...postDraft, shares: event.target.value })
                  }
                />
              </label>
              <label className="vs-field">
                Saves
                <input
                  type="number"
                  min="0"
                  value={postDraft.saves}
                  onChange={(event) =>
                    setPostDraft({ ...postDraft, saves: event.target.value })
                  }
                />
              </label>
              <label className="vs-field vs-field--wide">
                Note (optional)
                <input
                  type="text"
                  value={postDraft.notes || ""}
                  onChange={(event) =>
                    setPostDraft({ ...postDraft, notes: event.target.value })
                  }
                  placeholder="e.g. Reel — sunset dinner"
                />
              </label>
            </div>
            <div className="vs-modal__actions">
              <button
                type="button"
                className="vs-btn vs-btn--ghost"
                onClick={() => setPostDraft(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="vs-btn vs-btn--primary"
                disabled={saving}
              >
                {saving ? "Saving…" : "Save post"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {articleDraft ? (
        <div className="vs-modal" role="dialog" aria-modal="true" aria-labelledby="vs-article-title">
          <form className="vs-modal__dialog" onSubmit={saveArticle}>
            <button
              type="button"
              className="vs-modal__close"
              onClick={() => setArticleDraft(null)}
              aria-label="Close"
            >
              ×
            </button>
            <p className="vs-modal__eyebrow">Associate an article</p>
            <h2 id="vs-article-title">Ahangama.com article</h2>
            <div className="vs-form-grid">
              <label className="vs-field vs-field--wide">
                Article title
                <input
                  type="text"
                  required
                  value={articleDraft.title}
                  onChange={(event) =>
                    setArticleDraft({
                      ...articleDraft,
                      title: event.target.value,
                    })
                  }
                />
              </label>
              <label className="vs-field vs-field--wide">
                Article URL
                <input
                  type="url"
                  required
                  value={articleDraft.url}
                  onChange={(event) =>
                    setArticleDraft({ ...articleDraft, url: event.target.value })
                  }
                  placeholder="https://ahangama.com/..."
                />
              </label>
              <label className="vs-field">
                Publication date
                <input
                  type="date"
                  value={articleDraft.publishedAt || ""}
                  onChange={(event) =>
                    setArticleDraft({
                      ...articleDraft,
                      publishedAt: event.target.value,
                    })
                  }
                />
              </label>
            </div>
            <div className="vs-modal__actions">
              <button
                type="button"
                className="vs-btn vs-btn--ghost"
                onClick={() => setArticleDraft(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="vs-btn vs-btn--primary"
                disabled={saving}
              >
                {saving ? "Saving…" : "Save article"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
