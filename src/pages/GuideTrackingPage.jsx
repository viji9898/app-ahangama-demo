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

function normalizePath(path) {
  if (typeof path !== "string") return "";
  return path.replace(/\/+$/, "") || "/";
}

const AUTOMATED_TESTS = Object.freeze([
  ["guide_pass_cta_click", "Pass CTA"],
  ["guide_contents_select", "Contents navigation"],
  ["guide_map_filter_select", "Map filter"],
  ["guide_map_marker_select", "Map marker"],
  ["guide_map_popup_navigate", "Map navigation"],
  ["venue_impression", "Venue impression"],
  ["guide_lightbox_open", "Lightbox open"],
  ["guide_outbound_click", "Outbound click"],
]);

function waitForElement(root, selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const findElement = () => {
      const element = root.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }
      if (Date.now() - startedAt >= timeout) {
        reject(new Error(`Could not find ${selector}`));
        return;
      }
      requestAnimationFrame(findElement);
    };
    findElement();
  });
}

function clickTestElement(element, preventNavigation = false) {
  element.scrollIntoView({ block: "center" });
  if (preventNavigation) {
    element.addEventListener("click", (event) => event.preventDefault(), {
      capture: true,
      once: true,
    });
  }
  element.click();
}

function validateEvent(eventName, params, duplicate) {
  const missing = [...BASE_FIELDS, ...(EVENT_RULES[eventName] || [])].filter(
    (field) => params[field] === undefined || params[field] === "",
  );
  const issues = missing.map((field) => `Missing ${field}`);

  if (normalizePath(params.page_path) !== "/guide") {
    issues.push(`page_path must resolve to /guide; received ${params.page_path}`);
  }
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
  const frameLoadResolverRef = useRef(null);
  const eventWaitersRef = useRef([]);
  const [frameKey, setFrameKey] = useState(0);
  const [previewReady, setPreviewReady] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [testStatuses, setTestStatuses] = useState({});
  const [auditScope, setAuditScope] = useState({
    sections: { complete: 0, total: 0, failed: 0 },
    venues: { complete: 0, total: 0, failed: 0 },
    locations: { complete: 0, total: 0, failed: 0 },
  });
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const receiveEvent = (message) => {
      if (
        message.origin !== window.location.origin ||
        message.source !== frameRef.current?.contentWindow ||
        message.data?.type !== "ahangama:guide-tracking"
      ) {
        return;
      }

      const waiterIndex = eventWaitersRef.current.findIndex(
        (waiter) =>
          waiter.eventName === message.data.eventName &&
          waiter.predicate(message.data),
      );
      if (waiterIndex >= 0) {
        const [waiter] = eventWaitersRef.current.splice(waiterIndex, 1);
        clearTimeout(waiter.timeoutId);
        waiter.resolve(message.data);
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
        return [nextEvent, ...currentEvents].slice(0, 500);
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

  const waitForTrackedEvent = (
    eventName,
    predicate = () => true,
    timeout = 5000,
  ) =>
    new Promise((resolve, reject) => {
      const waiter = {
        eventName,
        predicate,
        resolve,
        timeoutId: window.setTimeout(() => {
          eventWaitersRef.current = eventWaitersRef.current.filter(
            (candidate) => candidate !== waiter,
          );
          reject(new Error(`No ${eventName} event received`));
        }, timeout),
      };
      eventWaitersRef.current.push(waiter);
    });

  const reloadPreviewForTest = () =>
    new Promise((resolve) => {
      frameLoadResolverRef.current = resolve;
      setPreviewReady(false);
      setFrameKey((key) => key + 1);
    });

  const runFullTest = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setEvents([]);
    setSelectedId(null);
    setAuditScope({
      sections: { complete: 0, total: 0, failed: 0 },
      venues: { complete: 0, total: 0, failed: 0 },
      locations: { complete: 0, total: 0, failed: 0 },
    });
    setTestStatuses(
      Object.fromEntries(AUTOMATED_TESTS.map(([eventName]) => [eventName, "pending"])),
    );

    try {
      await reloadPreviewForTest();
      const frameDocument = frameRef.current?.contentDocument;
      if (!frameDocument) throw new Error("Guide preview is unavailable");

      const captureValidEvent = async (
        eventName,
        action,
        predicate = () => true,
        timeout = 5000,
      ) => {
        const eventPromise = waitForTrackedEvent(eventName, predicate, timeout);
        await action();
        const capturedEvent = await eventPromise;
        const validation = validateEvent(
          capturedEvent.eventName,
          capturedEvent.params,
          false,
        );
        if (validation.issues.length) {
          throw new Error(validation.issues.join(", "));
        }
        return capturedEvent;
      };

      const runStep = async (eventName, action, timeout) => {
        setTestStatuses((statuses) => ({
          ...statuses,
          [eventName]: "running",
        }));
        try {
          await captureValidEvent(eventName, action, () => true, timeout);
          setTestStatuses((statuses) => ({
            ...statuses,
            [eventName]: "pass",
          }));
        } catch (error) {
          setTestStatuses((statuses) => ({
            ...statuses,
            [eventName]: "fail",
            [`${eventName}:message`]: error.message,
          }));
        }
      };

      await runStep("guide_pass_cta_click", async () => {
        const element = await waitForElement(frameDocument, ".eag-cover-cta a");
        clickTestElement(element, true);
      });

      const sectionItems = [
        ...frameDocument.querySelectorAll(
          ".eag-contents-item[data-track-target-section]",
        ),
      ];
      let sectionFailures = 0;
      setAuditScope((scope) => ({
        ...scope,
        sections: { complete: 0, total: sectionItems.length, failed: 0 },
      }));
      setTestStatuses((statuses) => ({
        ...statuses,
        guide_contents_select: "running",
      }));
      for (const item of sectionItems) {
        const targetSection = item.dataset.trackTargetSection;
        try {
          await captureValidEvent(
            "guide_contents_select",
            async () => clickTestElement(item),
            (event) => event.params.target_section === targetSection,
          );
        } catch {
          sectionFailures += 1;
        }
        setAuditScope((scope) => ({
          ...scope,
          sections: {
            complete: scope.sections.complete + 1,
            total: sectionItems.length,
            failed: sectionFailures,
          },
        }));
      }
      setTestStatuses((statuses) => ({
        ...statuses,
        guide_contents_select: sectionFailures ? "fail" : "pass",
        ...(sectionFailures
          ? {
              "guide_contents_select:message": `${sectionFailures} section checks failed`,
            }
          : {}),
      }));

      await runStep("guide_map_filter_select", async () => {
        const element = await waitForElement(
          frameDocument,
          ".eag-guide-map-filters button:nth-child(2)",
        );
        clickTestElement(element);
      });
      await runStep("guide_map_marker_select", async () => {
        const element = await waitForElement(frameDocument, ".leaflet-marker-icon");
        clickTestElement(element);
      });
      await runStep("guide_map_popup_navigate", async () => {
        const element = await waitForElement(
          frameDocument,
          ".eag-guide-map-popup-nav",
        );
        clickTestElement(element, true);
      });
      await runStep("venue_impression", async () => {
        const element = await waitForElement(frameDocument, ".eag-card-item");
        element.scrollIntoView({ block: "center" });
      }, 7000);

      const venueCards = [
        ...new Map(
          [...frameDocument.querySelectorAll(".eag-card-item[data-track-venue-id]")]
            .map((card) => [card.dataset.trackVenueId, card]),
        ).values(),
      ];
      let venueFailures = 0;
      let lightboxFailures = 0;
      let outboundFailures = 0;
      let locationFailures = 0;
      setAuditScope((scope) => ({
        ...scope,
        venues: { complete: 0, total: venueCards.length, failed: 0 },
        locations: { complete: 0, total: venueCards.length, failed: 0 },
      }));
      setTestStatuses((statuses) => ({
        ...statuses,
        guide_lightbox_open: "running",
        guide_outbound_click: "running",
      }));

      for (const card of venueCards) {
        const venueId = card.dataset.trackVenueId;
        let venueFailed = false;
        let venueOutboundFailed = false;
        try {
          const image = card.querySelector(".eag-card-img");
          if (!image) throw new Error("Venue image is unavailable");
          await captureValidEvent(
            "guide_lightbox_open",
            async () => clickTestElement(image),
            (event) => event.params.venue_id === venueId,
          );
        } catch {
          lightboxFailures += 1;
          venueFailed = true;
        }

        try {
          await waitForElement(
            frameDocument,
            ".eag-lightbox-insta, .eag-lightbox-map, .eag-lightbox-website",
            1500,
          );
          const links = [
            ...frameDocument.querySelectorAll(
              ".eag-lightbox-social a[href]",
            ),
          ];
          const locationLink = links.find((link) =>
            link.classList.contains("eag-lightbox-map"),
          );

          if (!locationLink) {
            locationFailures += 1;
            venueOutboundFailed = true;
          }

          for (const link of links) {
            const expectedUrl = link.href;
            try {
              await captureValidEvent(
                "guide_outbound_click",
                async () => clickTestElement(link, true),
                (event) =>
                  event.params.venue_id === venueId &&
                  new URL(
                    event.params.destination_url,
                    window.location.origin,
                  ).href === expectedUrl,
              );
            } catch {
              venueOutboundFailed = true;
              if (link === locationLink) locationFailures += 1;
            }
          }
        } catch {
          venueOutboundFailed = true;
          locationFailures += 1;
        }

        if (venueOutboundFailed) {
          outboundFailures += 1;
          venueFailed = true;
        }

        frameDocument.querySelector(".eag-lightbox-close")?.click();
        if (venueFailed) venueFailures += 1;
        setAuditScope((scope) => ({
          ...scope,
          venues: {
            complete: scope.venues.complete + 1,
            total: venueCards.length,
            failed: venueFailures,
          },
          locations: {
            complete: scope.locations.complete + 1,
            total: venueCards.length,
            failed: locationFailures,
          },
        }));
      }

      setTestStatuses((statuses) => ({
        ...statuses,
        guide_lightbox_open: lightboxFailures ? "fail" : "pass",
        guide_outbound_click: outboundFailures ? "fail" : "pass",
        ...(lightboxFailures
          ? {
              "guide_lightbox_open:message": `${lightboxFailures} venue lightbox checks failed`,
            }
          : {}),
        ...(outboundFailures
          ? {
              "guide_outbound_click:message": `${outboundFailures} venue outbound checks failed`,
            }
          : {}),
      }));
    } finally {
      setIsRunning(false);
    }
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
          {auditScope.sections.total ? (
            <span>
              {auditScope.sections.complete}/{auditScope.sections.total} sections
            </span>
          ) : null}
          {auditScope.venues.total ? (
            <span>
              {auditScope.venues.complete}/{auditScope.venues.total} venues
            </span>
          ) : null}
          {auditScope.locations.total ? (
            <span>
              {auditScope.locations.complete}/{auditScope.locations.total} locations
            </span>
          ) : null}
        </div>
        <div className="gt-actions">
          <button type="button" onClick={runFullTest} disabled={isRunning}>
            {isRunning ? "Running..." : "Run full test"}
          </button>
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
            onLoad={() => {
              setPreviewReady(true);
              frameLoadResolverRef.current?.();
              frameLoadResolverRef.current = null;
            }}
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
                  className={
                    testStatuses[eventName]
                      ? `is-${testStatuses[eventName]}`
                      : coveredEvents.has(eventName)
                        ? "is-covered"
                        : ""
                  }
                  key={eventName}
                  title={testStatuses[`${eventName}:message`] || undefined}
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