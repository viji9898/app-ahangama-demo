import React, { useEffect, useState } from "react";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import NewsletterSignup from "../components/newsletter/NewsletterSignup";

const { Title, Paragraph, Text } = Typography;

const EVENTS_OG_IMAGE =
  "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786033500/August_Calendar_OG_Image_3_al05rq.webp";

const EVENTS_ENDPOINT = "/.netlify/functions/events";
const LARGE_DETAIL_TEXT = "8th Wednesday 9am Asana & Pranayama.";

const EVENT_CATEGORY_LABELS = {
  arts_culture: "Arts & Culture",
  food_drink: "Food & Drink",
  surf_ocean: "Surf & Ocean",
};

function formatEventCategory(category) {
  const normalizedCategory = String(category || "").trim();

  if (!normalizedCategory) {
    return "";
  }

  return EVENT_CATEGORY_LABELS[normalizedCategory] || normalizedCategory
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildCalendarTitle(days) {
  const monthLabels = days
    .filter((day) => /^\d{4}-\d{2}-\d{2}$/.test(String(day.key)))
    .map((day) => {
      const date = new Date(`${day.key}T00:00:00`);

      return Number.isNaN(date.getTime())
        ? ""
        : new Intl.DateTimeFormat("en-GB", {
            month: "long",
            year: "numeric",
          }).format(date);
    })
    .filter((label, index, labels) => label && labels.indexOf(label) === index);

  if (monthLabels.length === 0) {
    return days.length > 0 ? "Ongoing Events" : "Events";
  }

  if (monthLabels.length === 1) {
    return monthLabels[0];
  }

  return `${monthLabels[0]} - ${monthLabels[monthLabels.length - 1]}`;
}

export default function EventsPage() {
  const canonical = absUrl("/events");
  const [calendarDays, setCalendarDays] = useState([]);
  const [editorPicks, setEditorPicks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const calendarTitle = buildCalendarTitle(calendarDays);
  const datedDays = calendarDays.filter(
    (day) => !day.key.startsWith("ongoing"),
  );
  const weeklyFlowDays = calendarDays.filter(
    (day) => day.key === "ongoing-this-week",
  );
  const localPerksDays = calendarDays.filter(
    (day) => day.key === "ongoing",
  );

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      try {
        const response = await fetch(EVENTS_ENDPOINT);
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load events");
        }

        if (cancelled) {
          return;
        }

        setCalendarDays(Array.isArray(payload.days) ? payload.days : []);
        setEditorPicks(
          Array.isArray(payload.editorPicks) ? payload.editorPicks : [],
        );
      } catch (error) {
        if (!cancelled) {
          console.error("Unable to load events calendar", error);
          setLoadError("The events calendar is temporarily unavailable.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  const renderDay = (day) => (
    <section className="events-agenda-day" key={day.key}>
      <div className="events-agenda-dateColumn">
        <Text className="events-agenda-weekday">{day.weekday}</Text>
        <Text
          className={`events-agenda-dayNumber${day.key.startsWith("ongoing") ? " events-agenda-dayNumber--label" : ""}`}
        >
          {day.dayNumber}
        </Text>
        <Text className="events-agenda-month">{day.month}</Text>
      </div>

      <div className="events-agenda-dayEntries">
        {day.events.map((event) => (
          <article
            className="events-agenda-entry"
            key={`${day.key}-${event.title}`}
            style={{ "--events-agenda-bg": `url(${event.image})` }}
          >
            <div className="events-agenda-imageWrap">
              <picture>
                {event.mobileImage ? (
                  <source media="(max-width: 900px)" srcSet={event.mobileImage} />
                ) : null}
                <img
                  src={event.image}
                  alt={`${event.title} at ${event.venue}`}
                  className="events-agenda-image"
                />
              </picture>
            </div>

            <div className="events-agenda-copy">
              {event.offerImage ? (
                <div className="events-agenda-offer">
                  <img
                    src={event.offerImage}
                    alt="Special offer"
                    className="events-agenda-offerImage"
                  />
                  <div className="events-agenda-offerBody">
                    <span className="events-agenda-offerLabel">Offer</span>
                    {event.offerText ? (
                      <span className="events-agenda-offerText">{event.offerText}</span>
                    ) : null}
                  </div>
                </div>
              ) : null}
              <Title level={2} className="events-agenda-entryTitle">
                {event.title}
              </Title>
              <Text className="events-agenda-venue">{event.venue}</Text>

              <div className="events-agenda-meta">
                <span className="events-agenda-metaItem">
                  <ClockCircleOutlined />
                  <span>{event.time}</span>
                </span>
                <span className="events-agenda-metaDot" aria-hidden="true">
                  •
                </span>
                <Text className="events-agenda-category">
                  {formatEventCategory(event.category)}
                </Text>
              </div>

              {event.description ? (
                <Paragraph className="events-agenda-description">
                  {event.description}
                </Paragraph>
              ) : null}

              {event.expiryDate ? (
                <div className="events-agenda-details">
                  <Text className="events-agenda-expiryDate">
                    Expiry Date: {new Date(`${String(event.expiryDate).slice(0, 10)}T00:00:00`).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </Text>
                </div>
              ) : null}

              {event.venueLinks?.length ? (
                <ul className="events-agenda-details">
                  {event.venueLinks.map((venueLink) => (
                    <li key={venueLink.name}>
                      <Text>{venueLink.name}</Text>
                      <div
                        className="events-agenda-links"
                        style={{ marginTop: 8 }}
                      >
                        {venueLink.instagramUrl ? (
                          <a
                            href={venueLink.instagramUrl}
                            className="events-agenda-link events-agenda-linkInstagram"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Instagram for ${venueLink.name}`}
                          >
                            <InstagramOutlined />
                          </a>
                        ) : null}
                        {venueLink.directionsUrl ? (
                          <a
                            href={venueLink.directionsUrl}
                            className="events-agenda-link events-agenda-linkLocation"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Directions to ${venueLink.name}`}
                          >
                            <EnvironmentOutlined />
                          </a>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}

              {event.details?.length ? (
                <ul className="events-agenda-details">
                  {event.details.map((detail) => (
                    <li
                      key={detail}
                      className={
                        detail === LARGE_DETAIL_TEXT
                          ? "events-agenda-detail--large"
                          : undefined
                      }
                    >
                      {detail}
                    </li>
                  ))}
                </ul>
              ) : null}

              {event.passBenefit ? (
                <div className="events-agenda-passBenefit">
                  <Text className="events-agenda-passBenefitLabel">
                    {event.passBenefit.label}
                  </Text>
                  {event.passBenefit.discount ? (
                    <Text className="events-agenda-passBenefitDiscount">
                      {event.passBenefit.discount}
                    </Text>
                  ) : null}
                  <Text className="events-agenda-passBenefitPerk">
                    {event.passBenefit.perk}
                  </Text>
                </div>
              ) : null}

              {event.instagramUrl || event.directionsUrl ? (
                <div className="events-agenda-links">
                  {event.instagramUrl ? (
                    <a
                      href={event.instagramUrl}
                      className="events-agenda-link events-agenda-linkInstagram"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Instagram for ${event.venue}`}
                    >
                      <InstagramOutlined />
                    </a>
                  ) : null}
                  {event.directionsUrl ? (
                    <a
                      href={event.directionsUrl}
                      className="events-agenda-link events-agenda-linkLocation"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Directions to ${event.venue}`}
                    >
                      <EnvironmentOutlined />
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  return (
    <SiteLayout>
      <Seo
        title="Events | Ahangama Events Agenda"
        description="A daily guide to what's happening around town in Ahangama, with this week's editorial calendar and event highlights."
        canonical={canonical}
        ogImage={EVENTS_OG_IMAGE}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Ahangama Events Agenda",
          url: canonical,
          description:
            "A daily guide to what's happening around town in Ahangama.",
        }}
      />

      <div className="events-agenda-page">
        <div className="events-agenda-shell">
          <header className="events-agenda-header">
            <div>
              <Title className="events-agenda-title">{calendarTitle}</Title>
              <Text className="events-agenda-kicker">
                Ahangama Events Agenda
              </Text>
            </div>
            <Paragraph className="events-agenda-summary">
              A daily guide to what&apos;s happening around town in Ahangama.
            </Paragraph>
          </header>

          {isLoading ? (
            <div className="events-agenda-status" role="status" aria-live="polite">
              <Text>Loading events...</Text>
            </div>
          ) : null}

          {!isLoading && loadError ? (
            <div className="events-agenda-status events-agenda-status--error" role="alert">
              <Text>{loadError}</Text>
            </div>
          ) : null}

          {!isLoading && !loadError && calendarDays.length === 0 ? (
            <div className="events-agenda-status" role="status">
              <Text>No upcoming events are currently published.</Text>
            </div>
          ) : null}

          <div className="events-agenda-list" role="list">
            {datedDays.map((day) => renderDay(day))}
          </div>

          <div className="events-agenda-list" role="list" style={{ marginTop: 40 }}>
            {weeklyFlowDays.map((day) => renderDay(day))}
          </div>

          <div className="events-agenda-list" role="list" style={{ marginTop: 40 }}>
            {localPerksDays.map((day) => renderDay(day))}
          </div>

          {editorPicks.length > 0 ? (
            <section className="events-agenda-editorPicks">
              <Text className="events-agenda-editorPicksLabel">
                Editor&apos;s Picks This Week
              </Text>
              <div className="events-agenda-editorPicksList">
                {editorPicks.map((pick) => (
                  <Text className="events-agenda-editorPick" key={pick}>
                    {pick}
                  </Text>
                ))}
              </div>
            </section>
          ) : null}

          <section className="events-agenda-signup">
            <div className="events-agenda-signupIntro">
              <Text className="events-agenda-signupLabel">
                Stay In The Loop
              </Text>
              <Paragraph className="events-agenda-signupText">
                Subscribe to our weekly newsletter for the latest events and
                stories.
              </Paragraph>
            </div>

            <div className="events-agenda-signupForm">
              <NewsletterSignup
                variant="inline"
                source="events_page_footer"
                label=""
                title=""
                description=""
                placeholder="Your email address"
              />
            </div>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
