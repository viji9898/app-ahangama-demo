import React, { useEffect, useMemo, useRef, useState } from "react";
import { Seo } from "../app/seo";
import "../styles/guide-tracking.css";

export const GUIDE_TRACKING_PATH = "/guide/track";

const EVENT_RULES = Object.freeze({
  venue_impression: [
    "venue_id",
    "venue_slug",
    "venue_name",
    "guide_section",
    "component_location",
    "position",
  ],
  guide_outbound_click: [
    "link_type",
    "component_location",
    "destination_url",
  ],
  guide_lightbox_open: [
    "venue_id",
    "venue_slug",
    "venue_name",
    "guide_section",
    "component_location",
  ],
  guide_map_marker_select: [
    "venue_id",
    "venue_slug",
    "venue_name",
    "guide_section",
    "map_category",
    "component_location",
  ],
  guide_map_filter_select: ["selected_filter", "component_location"],
  guide_map_popup_navigate: [
    "venue_id",
    "venue_slug",
    "venue_name",
    "guide_section",
    "component_location",
    "destination_url",
  ],
  guide_contents_select: ["target_section", "component_location"],
  guide_pass_cta_click: ["cta_location", "destination_url"],
});

const EVENT_LABELS = Object.freeze({
  venue_impression: "Venue impression",
  guide_outbound_click: "Outbound click",
  guide_lightbox_open: "Lightbox open",
  guide_map_marker_select: "Map marker",
  guide_map_filter_select: "Map filter",
  guide_map_popup_navigate: "Map navigation",
  guide_contents_select: "Contents navigation",
  guide_pass_cta_click: "Pass CTA",
});

const BASE_FIELDS = ["event_category", "source_domain", "page_path"];

function validateEvent(eventName, params, duplicate) {
  const missing = [...BASE_FIELDS, ...(EVENT_RULES[eventName] || [])].filter(
    (field) => params[field] === undefined || params[field] === "",
  );
  const issues = missing.map((field) => `Missing ${field}`);

  if (params.page_path !== "/guide") issues.push("page_path must be /guide");
  if (params.destination_url) {
    try {
      new URL(params.destination_url, window.location.origin);
    } catch {
      issues.push("Invalid destination_url");
    }
  }

  const venuePlacement = ["venue_card", "venue_lightbox"].includes(
    params.component_location,
  );
  if (eventName === "guide_outbound_click" && venuePlacement) {
    ["venue_id", "venue_slug", "venue_name", "guide_section"].forEach(
      (field) => {
        if (!params[field]) issues.push(`Missing ${field}`);
      },
    );
  }

  if (!EVENT_RULES[eventName]) issues.push("Unrecognised guide event");

  return {
    issues,
    status: issues.length ? "fail" : duplicate ? "warning" : "pass",
  };
}

function getEventSignature(eventName, params) {
  return `${eventName}:${JSON.stringify(params)}`;
}

function GuideTrackingPage() {
  const frameRef = useRef(null);
  const [frameKey, setFrameKey] = useState(0);
  const [previewReady, setPreviewReady] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const receiveEvent = (message) => {
      if (
        message.origin !== window.location.origin ||
        message.source !== frameRef.current?.contentWindow ||
        message.data?.type !== "ahangama:guide-tracking"
      ) {
        return;
      }

      setEvents((currentEvents) => {
        const signature = getEventSignature(
          message.data.eventName,
          message.data.params,
        );
        const duplicate = currentEvents.some(
          (event) =>
            event.signature === signature &&
            message.data.timestamp - event.timestamp < 1000,
        );
        const validation = validateEvent(
          message.data.eventName,
          message.data.params,
          duplicate,
        );
        const nextEvent = {
          id: `${message.data.timestamp}-${crypto.randomUUID()}`,
          signature,
          duplicate,
          ...message.data,
          ...validation,
        };
        setSelectedId(nextEvent.id);
        return [nextEvent, ...currentEvents].slice(0, 200);
      });
    };

    window.addEventListener("message", receiveEvent);
    return () => window.removeEventListener("message", receiveEvent);
  }, []);

  const selectedEvent = events.find((event) => event.id === selectedId);
  const summary = useMemo(
    () => ({
      pass: events.filter((event) => event.status === "pass").length,
      warning: events.filter((event) => event.status === "warning").length,
      fail: events.filter((event) => event.status === "fail").length,
    }),
    [events],
  );
  const coveredEvents = new Set(events.map((event) => event.eventName));

  const reloadPreview = () => {
    setPreviewReady(false);
    setFrameKey((key) => key + 1);
  };

  return (
    <main className="gt-page">
      <Seo
        title="Guide Tracking Diagnostics"
        description="Internal diagnostics for Ahangama Guide analytics events."
        noindex
      />

      <header className="gt-header">
        <div>
          <span className="gt-kicker">Internal diagnostics</span>
          <h1>Guide tracking</h1>
        </div>
        <div className="gt-summary" aria-label="Validation summary">
          <span className={previewReady ? "is-live" : ""}>
            {previewReady ? "Preview connected" : "Connecting"}
          </span>
          <strong>{events.length} events</strong>
          <span>{summary.pass} passed</span>
          <span>{summary.warning} duplicates</span>
          <span>{summary.fail} failed</span>
        </div>
        <div className="gt-actions">
          <button type="button" onClick={reloadPreview}>Reload preview</button>
          <button
            type="button"
            onClick={() => {
              setEvents([]);
              setSelectedId(null);
            }}
          >
            Clear log
          </button>
        </div>
      </header>

      <div className="gt-workspace">
        <section className="gt-preview" aria-label="Live guide preview">
          <div className="gt-panel-heading">
            <div>
              <span>Live source</span>
              <h2>/guide</h2>
            </div>
            <strong>Custom GA events suppressed</strong>
          </div>
          <iframe
            key={frameKey}
            ref={frameRef}
            src="/guide?tracking_debug=1"
            title="Ahangama Guide tracking preview"
            onLoad={() => setPreviewReady(true)}
          />
        </section>

        <aside className="gt-inspector" aria-label="Tracking event inspector">
          <section className="gt-coverage">
            <div className="gt-panel-heading">
              <div>
                <span>Test matrix</span>
                <h2>Coverage</h2>
              </div>
              <strong>{coveredEvents.size}/{Object.keys(EVENT_RULES).length}</strong>
            </div>
            <div className="gt-coverage-grid">
              {Object.entries(EVENT_LABELS).map(([eventName, label]) => (
                <div
                  className={coveredEvents.has(eventName) ? "is-covered" : ""}
                  key={eventName}
                >
                  <i aria-hidden="true" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="gt-event-log">
            <div className="gt-panel-heading">
              <div>
                <span>Captured locally</span>
                <h2>Event log</h2>
              </div>
            </div>
            <div className="gt-event-list">
              {events.length ? (
                events.map((event) => (
                  <button
                    type="button"
                    className={`gt-event-row is-${event.status}${selectedId === event.id ? " is-selected" : ""}`}
                    key={event.id}
                    onClick={() => setSelectedId(event.id)}
                  >
                    <i aria-hidden="true" />
                    <span>
                      <strong>{event.eventName}</strong>
                      <small>
                        {event.params.venue_name ||
                          event.params.target_section ||
                          event.params.selected_filter ||
                          event.params.component_location ||
                          "Guide"}
                      </small>
                    </span>
                    <time>
                      {new Date(event.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </time>
                  </button>
                ))
              ) : (
                <div className="gt-empty">No guide events captured</div>
              )}
            </div>
          </section>

          <section className="gt-payload">
            <div className="gt-panel-heading">
              <div>
                <span>Selected event</span>
                <h2>Payload</h2>
              </div>
              {selectedEvent ? (
                <strong className={`is-${selectedEvent.status}`}>
                  {selectedEvent.status}
                </strong>
              ) : null}
            </div>
            {selectedEvent ? (
              <>
                {selectedEvent.issues.length ? (
                  <ul>
                    {selectedEvent.issues.map((issue) => (
                      <li key={issue}>{issue}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Required parameters are present and valid.</p>
                )}
                {selectedEvent.duplicate ? (
                  <p className="gt-duplicate">Duplicate payload within one second.</p>
                ) : null}
                <pre>{JSON.stringify(selectedEvent.params, null, 2)}</pre>
              </>
            ) : (
              <div className="gt-empty">Select an event to inspect its payload</div>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}

export default GuideTrackingPage;