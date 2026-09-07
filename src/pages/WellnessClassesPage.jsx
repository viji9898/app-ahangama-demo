import React, { useMemo, useState } from "react";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  InstagramOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { Segmented } from "antd";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import "../styles/wellness-classes.css";

export const WELLNESS_CLASSES_PATH = "/wellness-classes";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const CATEGORY_LABELS = {
  all: "All classes",
  pilates: "Pilates",
  yoga: "Yoga",
  "strength-and-conditioning": "Strength & conditioning",
  "martial-arts": "Martial arts",
};

// Shared with the homepage's daily class preview.
// eslint-disable-next-line react-refresh/only-export-components
export const WELLNESS_VENUES = [
  {
    venueId: "pura-pilates-ahangama",
    venueName: "Pura Pilates Ahangama",
    location: "Ahangama",
    coordinates: { lat: 5.980186974839597, lng: 80.36560881118537 },
    googleMapsUrl: "https://maps.app.goo.gl/gkoHq55mmjMBd9hR8",
    scheduleType: "dated",
    timezone: "Asia/Colombo",
    bookingUrl: "https://bookwhen.com/pura",
    instagram: "purapilatessrilanka",
    pricingLkr: { reformer: 6000, matAndYoga: 3000 },
    notes: ["Walk-ins welcome", "Arrive 10 minutes early"],
    days: [
      {
        date: "2026-09-06",
        day: "Sunday",
        sessions: [
          { time: "11:00", className: "Mat Sculpt", instructor: "Grace", category: "pilates", priceLkr: 3000 },
          { time: "12:00", className: "Reformer", instructor: "Grace", category: "pilates", priceLkr: 6000 },
        ],
      },
      {
        date: "2026-09-07",
        day: "Monday",
        sessions: [
          { time: "08:30", className: "Reformer", instructor: "Grace", category: "pilates", priceLkr: 6000 },
          { time: "11:00", className: "Mat Sculpt", instructor: "Grace", category: "pilates", priceLkr: 3000 },
          { time: "12:00", className: "Reformer", instructor: "Grace", category: "pilates", priceLkr: 6000 },
        ],
      },
      {
        date: "2026-09-08",
        day: "Tuesday",
        sessions: [
          { time: "08:30", className: "Reformer", instructor: "Denitsa", category: "pilates", priceLkr: 6000 },
          { time: "09:30", className: "Vinyasa Yoga", instructor: "Udani", category: "yoga", priceLkr: 3000 },
          { time: "11:00", className: "Classical Inspired Mat", instructor: "Denitsa", category: "pilates", priceLkr: 3000 },
          { time: "12:00", className: "Reformer", instructor: "Denitsa", category: "pilates", priceLkr: 6000 },
        ],
      },
    ],
  },
  {
    venueId: "crossfit-ceylon-palm",
    venueName: "CrossFit Ceylon at PALM Hotel",
    location: "PALM Hotel, Ahangama",
    coordinates: { lat: 5.988804340231071, lng: 80.38237393947473 },
    googleMapsUrl: "https://maps.app.goo.gl/h5V3AJ9vZKGQ43UN7",
    scheduleType: "weekly-recurring",
    timezone: "Asia/Colombo",
    notes: ["Open gym is available outside class hours"],
    days: [
      { day: "Monday", sessions: [
        { time: "08:30", className: "CrossFit", category: "strength-and-conditioning" },
        { time: "10:00", className: "Muay Thai", category: "martial-arts" },
      ] },
      { day: "Tuesday", sessions: [
        { time: "08:30", className: "Booty & Abs", category: "strength-and-conditioning" },
        { time: "10:00", className: "CrossFit", category: "strength-and-conditioning" },
      ] },
      { day: "Wednesday", sessions: [
        { time: "08:30", className: "CrossFit", category: "strength-and-conditioning" },
        { time: "10:00", className: "Muay Thai", category: "martial-arts" },
      ] },
      { day: "Thursday", sessions: [
        { time: "08:30", className: "Booty & Abs", category: "strength-and-conditioning" },
        { time: "10:00", className: "CrossFit", category: "strength-and-conditioning" },
        { time: "16:30", className: "CrossFit", category: "strength-and-conditioning" },
      ] },
      { day: "Friday", sessions: [
        { time: "08:30", className: "CrossFit", category: "strength-and-conditioning" },
        { time: "10:00", className: "Muay Thai", category: "martial-arts" },
      ] },
      { day: "Saturday", sessions: [] },
      { day: "Sunday", sessions: [
        { time: "10:00", className: "Muay Thai Kids", category: "martial-arts", audience: "kids" },
      ] },
    ],
  },
  {
    venueId: "krozz-fit-surf-coast",
    venueName: "Krozz Fit Surf Coast",
    location: "Ahangama",
    coordinates: { lat: 5.9773439, lng: 80.3647306 },
    googleMapsUrl: "https://www.google.com/maps/place/Krozz+Fit+Surf+Coast+Gym+Ahangama/@5.9773439,80.3647306,17z",
    scheduleType: "weekly-recurring",
    timezone: "Asia/Colombo",
    bookingUrl: "https://www.krozzfit-gym.com/",
    days: [
      { day: "Monday", sessions: [{ time: "10:00", className: "HYROX", category: "strength-and-conditioning" }] },
      { day: "Tuesday", sessions: [
        { time: "09:00", className: "Functional Training", category: "strength-and-conditioning" },
        { time: "10:00", className: "Kickboxing", category: "martial-arts" },
        { time: "11:00", className: "Booty Building", category: "strength-and-conditioning" },
      ] },
      { day: "Wednesday", sessions: [{ time: "10:00", className: "Krozz Fit", category: "strength-and-conditioning" }] },
      { day: "Thursday", sessions: [
        { time: "10:00", className: "Functional Training", category: "strength-and-conditioning" },
        { time: "15:30", className: "Muay Thai", category: "martial-arts" },
      ] },
      { day: "Friday", sessions: [{ time: "10:00", className: "Kickboxing", category: "martial-arts" }] },
      { day: "Saturday", sessions: [
        { time: "10:00", className: "HIIT Training", category: "strength-and-conditioning" },
        { time: "15:30", className: "Muay Thai", category: "martial-arts" },
      ] },
      { day: "Sunday", sessions: [] },
    ],
  },
  {
    venueId: "ulu-pilates-ahangama",
    venueName: "Ulu Pilates Ahangama",
    location: "Ahangama",
    coordinates: { lat: 5.9734375, lng: 80.3605625 },
    googleMapsUrl: "https://www.google.com/maps/place/ULU+House+of+Pilates+Ahangama/@5.9734375,80.3605625,17z",
    scheduleType: "weekly-recurring",
    timezone: "Asia/Colombo",
    instagram: "ulupilatesrilanka",
    days: [
      { day: "Monday", sessions: [
        { time: "09:00", className: "Power Reformer", level: 2, category: "pilates" },
        { time: "10:00", className: "Power Reformer", level: 1, category: "pilates" },
        { time: "15:00", className: "Arms, Booty & Abs", category: "strength-and-conditioning" },
      ] },
      { day: "Tuesday", sessions: [
        { time: "09:00", className: "Arms, Booty & Abs", category: "strength-and-conditioning" },
        { time: "10:00", className: "Mat Pilates", level: 1, category: "pilates" },
        { time: "16:00", className: "Power Reformer", level: 1, category: "pilates" },
      ] },
      { day: "Wednesday", sessions: [
        { time: "09:00", className: "Mat Pilates", category: "pilates" },
        { time: "10:00", className: "Power Reformer", level: 2, category: "pilates" },
        { time: "15:00", className: "Power Reformer", level: 1, category: "pilates" },
      ] },
      { day: "Thursday", sessions: [
        { time: "08:00", className: "Arms, Booty & Abs", category: "strength-and-conditioning" },
        { time: "09:00", className: "Power Reformer", level: 1, category: "pilates" },
        { time: "16:00", className: "Power Reformer", level: 2, category: "pilates" },
      ] },
      { day: "Friday", sessions: [
        { time: "09:00", className: "Power Reformer", level: 2, category: "pilates" },
        { time: "10:00", className: "Mat Pilates", category: "pilates" },
        { time: "16:00", className: "Power Reformer", level: 2, category: "pilates" },
      ] },
      { day: "Saturday", sessions: [
        { time: "09:00", className: "Power Reformer", level: 1, category: "pilates" },
        { time: "10:00", className: "Arms, Booty & Abs", category: "strength-and-conditioning" },
        { time: "15:00", className: "Power Reformer", level: 1, category: "pilates" },
      ] },
      { day: "Sunday", sessions: [
        { time: "10:00", className: "Power Reformer", level: 1, category: "pilates" },
        { time: "11:00", className: "Mat Pilates", category: "pilates" },
        { time: "16:00", className: "Power Reformer", level: 2, category: "pilates" },
      ] },
    ],
  },
];

function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T00:00:00`));
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-LK").format(price);
}

function getInstagramUrl(handle) {
  return `https://www.instagram.com/${handle.replace(/^@/, "")}/`;
}

function getGoogleStaticMapUrl(apiKey) {
  const parameters = new URLSearchParams({
    center: "5.9811,80.3715",
    zoom: "13",
    size: "640x424",
    scale: "2",
    maptype: "roadmap",
    key: apiKey,
  });

  WELLNESS_VENUES.forEach((venue, index) => {
    parameters.append(
      "markers",
      `color:0xe9624f|label:${index + 1}|${venue.coordinates.lat},${venue.coordinates.lng}`,
    );
  });

  return `https://maps.googleapis.com/maps/api/staticmap?${parameters.toString()}`;
}

function WellnessVenueMap() {
  const googleMapsApiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    || import.meta.env.VITE_GOOGLE_MAPS_KEY
    || "";
  return (
    <section className="wc-mapSection" aria-labelledby="wc-map-title">
      <div className="wc-mapSection__heading">
        <div>
          <span className="wc-eyebrow">Find your class</span>
          <h2 id="wc-map-title">Studios around Ahangama.</h2>
        </div>
        <p>Four studios, mapped from the coast road to PALM Hotel.</p>
      </div>

      <div className="wc-mapSection__layout">
        <div className="wc-mapSection__frame">
          {googleMapsApiKey ? (
            <img
              className="wc-mapSection__map"
              src={getGoogleStaticMapUrl(googleMapsApiKey)}
              alt="Google map showing four wellness studios around Ahangama"
              loading="lazy"
            />
          ) : (
            <div className="wc-mapSection__state">
              <EnvironmentOutlined />
              <strong>Google Maps needs a browser key.</strong>
            </div>
          )}
        </div>

        <div className="wc-mapSection__list">
          {WELLNESS_VENUES.map((venue, index) => (
            <a
              className="wc-mapSection__venue"
              href={venue.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${venue.venueName} in Google Maps`}
              key={venue.venueId}
            >
              <span>0{index + 1}</span>
              <span className="wc-mapSection__venueName">
                <strong>{venue.venueName}</strong>
                <small>{venue.location}</small>
              </span>
              <EnvironmentOutlined aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function WellnessClassesPage() {
  const [selectedDay, setSelectedDay] = useState("All week");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const schedule = useMemo(() => WEEKDAYS.map((day) => {
    const sessions = WELLNESS_VENUES.flatMap((venue) => {
      const venueDay = venue.days.find((item) => item.day === day);
      if (!venueDay) return [];

      return venueDay.sessions
        .filter((session) => selectedCategory === "all" || session.category === selectedCategory)
        .map((session) => ({ ...session, venue, date: venueDay.date }));
    }).sort((first, second) => first.time.localeCompare(second.time));

    return { day, sessions };
  }).filter(({ day, sessions }) => (
    sessions.length > 0 && (selectedDay === "All week" || selectedDay === day)
  )), [selectedCategory, selectedDay]);

  const totalClasses = schedule.reduce((total, day) => total + day.sessions.length, 0);

  return (
    <SiteLayout>
      <Seo
        title="Wellness Classes & Weekly Schedule in Ahangama"
        description="Find Pilates, yoga, CrossFit, strength training and martial arts classes in Ahangama, with weekly times, venues, prices and booking links."
        canonical={absUrl(WELLNESS_CLASSES_PATH)}
      />

      <main className="wc-page">
        <section className="wc-hero">
          <div className="wc-hero__copy">
            <span className="wc-eyebrow">Move well in Ahangama</span>
            <h1>Wellness classes, all in one place.</h1>
            <p>
              This week&apos;s Pilates, yoga, CrossFit and martial arts sessions,
              organised by day and ready to book.
            </p>
            <div className="wc-hero__stats" aria-label="Schedule overview">
              <div><strong>{totalClasses}</strong><span>classes shown</span></div>
              <div><strong>{WELLNESS_VENUES.length}</strong><span>local studios</span></div>
              <div><strong>GMT+5:30</strong><span>local time</span></div>
            </div>
          </div>
          <div className="wc-hero__image" role="img" aria-label="Pilates class in Ahangama" />
        </section>

        <section className="wc-controls" aria-label="Schedule filters">
          <div className="wc-controlGroup">
            <span className="wc-controlLabel"><CalendarOutlined /> Day</span>
            <Segmented
              block
              className="wc-dayPicker"
              options={["All week", ...WEEKDAYS]}
              value={selectedDay}
              onChange={setSelectedDay}
            />
          </div>
          <div className="wc-categoryPicker" aria-label="Filter by activity">
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <button
                type="button"
                className={selectedCategory === value ? "is-active" : ""}
                key={value}
                onClick={() => setSelectedCategory(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="wc-schedule" aria-live="polite">
          <div className="wc-schedule__heading">
            <div>
              <span className="wc-eyebrow">Ahangama class calendar</span>
              <h2>{selectedDay === "All week" ? "Your week in motion" : selectedDay}</h2>
            </div>
            <p>{totalClasses} {totalClasses === 1 ? "session" : "sessions"}</p>
          </div>

          {schedule.length > 0 ? schedule.map(({ day, sessions }) => (
            <section className="wc-day" key={day}>
              <header className="wc-day__header">
                <span>{day.slice(0, 3)}</span>
                <h3>{day}</h3>
                <small>{sessions.length} {sessions.length === 1 ? "class" : "classes"}</small>
              </header>
              <div className="wc-day__sessions">
                {sessions.map((session) => (
                  <article className="wc-session" key={`${session.venue.venueId}-${day}-${session.time}-${session.className}`}>
                    <time><ClockCircleOutlined /> {session.time}</time>
                    <div className="wc-session__main">
                      <div className="wc-session__titleRow">
                        <h4>{session.className}</h4>
                        <span className={`wc-category wc-category--${session.category}`}>{CATEGORY_LABELS[session.category]}</span>
                      </div>
                      <p className="wc-session__venue"><EnvironmentOutlined /> {session.venue.venueName}</p>
                      <div className="wc-session__details">
                        {session.instructor ? <span>with {session.instructor}</span> : null}
                        {session.level ? <span>Level {session.level}</span> : null}
                        {session.audience ? <span>{session.audience}</span> : null}
                        {session.date ? <span>{formatDate(session.date)}</span> : <span>Weekly</span>}
                        {session.priceLkr ? <strong>LKR {formatPrice(session.priceLkr)}</strong> : null}
                      </div>
                    </div>
                    <div className="wc-session__actions">
                      {session.venue.bookingUrl ? (
                        <a href={session.venue.bookingUrl} target="_blank" rel="noopener noreferrer">
                          <LinkOutlined /> Book
                        </a>
                      ) : null}
                      {session.venue.instagram ? (
                        <a
                          className="wc-iconLink"
                          href={getInstagramUrl(session.venue.instagram)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${session.venue.venueName} on Instagram`}
                        >
                          <InstagramOutlined />
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )) : (
            <div className="wc-empty">
              <h3>No classes match these filters.</h3>
              <button type="button" onClick={() => { setSelectedDay("All week"); setSelectedCategory("all"); }}>
                Show all classes
              </button>
            </div>
          )}
        </section>

        <WellnessVenueMap />

        <section className="wc-venues">
          <div className="wc-venues__intro">
            <span className="wc-eyebrow">The studios</span>
            <h2>Know before you go.</h2>
            <p>Schedules can change. Confirm directly with the venue before setting off.</p>
          </div>
          <div className="wc-venues__grid">
            {WELLNESS_VENUES.map((venue, index) => (
              <article className="wc-venue" key={venue.venueId}>
                <span className="wc-venue__number">0{index + 1}</span>
                <h3>{venue.venueName}</h3>
                <p><EnvironmentOutlined /> {venue.location}</p>
                <span className="wc-venue__scheduleType">
                  {venue.scheduleType === "dated" ? "Dated schedule" : "Weekly recurring"}
                </span>
                {venue.notes?.length ? <p className="wc-venue__note">{venue.notes.join(" · ")}</p> : null}
                <div className="wc-venue__links">
                  {venue.bookingUrl ? <a href={venue.bookingUrl} target="_blank" rel="noopener noreferrer">Website <LinkOutlined /></a> : null}
                  {venue.instagram ? <a href={getInstagramUrl(venue.instagram)} target="_blank" rel="noopener noreferrer">Instagram <InstagramOutlined /></a> : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}