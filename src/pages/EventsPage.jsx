import React from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import NewsletterSignup from "../components/newsletter/NewsletterSignup";
import {
  EVENTS_CALENDAR_OVERVIEW,
  UPCOMING_EVENTS_CALENDAR_DAYS,
  UPCOMING_EVENTS_EDITOR_PICKS,
} from "../data/eventsCalendar";

const { Title, Paragraph, Text } = Typography;

const EVENTS_OG_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/events_june_ahangama.jpg";

export default function EventsPage() {
  const canonical = absUrl("/events");

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
              <Title className="events-agenda-title">
                {EVENTS_CALENDAR_OVERVIEW.monthLabel}
              </Title>
              <Text className="events-agenda-kicker">
                {EVENTS_CALENDAR_OVERVIEW.kicker}
              </Text>
            </div>
            <Paragraph className="events-agenda-summary">
              {EVENTS_CALENDAR_OVERVIEW.summary}
            </Paragraph>
          </header>

          <div className="events-agenda-list" role="list">
            {UPCOMING_EVENTS_CALENDAR_DAYS.map((day) => (
              <section className="events-agenda-day" key={day.key}>
                <div className="events-agenda-dateColumn">
                  <Text className="events-agenda-weekday">{day.weekday}</Text>
                  <Text
                    className={`events-agenda-dayNumber${day.key === "ongoing" ? " events-agenda-dayNumber--label" : ""}`}
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
                        <img
                          src={event.image}
                          alt={`${event.title} at ${event.venue}`}
                          className="events-agenda-image"
                        />
                      </div>

                      <div className="events-agenda-copy">
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
                          <Text className="events-agenda-category">{event.category}</Text>
                        </div>

                        {event.description ? (
                          <Paragraph className="events-agenda-description">
                            {event.description}
                          </Paragraph>
                        ) : null}

                        {event.details?.length ? (
                          <ul className="events-agenda-details">
                            {event.details.map((detail) => (
                              <li key={detail}>{detail}</li>
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

                        <div className="events-agenda-links">
                          <a
                            href={event.instagramUrl}
                            className="events-agenda-link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Instagram
                          </a>
                          <a
                            href={event.directionsUrl}
                            className="events-agenda-link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Directions
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="events-agenda-editorPicks">
            <Text className="events-agenda-editorPicksLabel">
              Editor&apos;s Picks This Week
            </Text>
            <div className="events-agenda-editorPicksList">
              {UPCOMING_EVENTS_EDITOR_PICKS.map((pick) => (
                <Text className="events-agenda-editorPick" key={pick}>
                  {pick}
                </Text>
              ))}
            </div>
          </section>

          <section className="events-agenda-signup">
            <div className="events-agenda-signupIntro">
              <Text className="events-agenda-signupLabel">Stay In The Loop</Text>
              <Paragraph className="events-agenda-signupText">
                Subscribe to our weekly newsletter for the latest events and stories.
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