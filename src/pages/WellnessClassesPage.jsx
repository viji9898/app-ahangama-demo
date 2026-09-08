import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  InstagramOutlined,
  LinkOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Segmented } from "antd";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import "../styles/wellness-classes.css";

export const WELLNESS_CLASSES_PATH = "/wellness-classes";

const FILTER_STORAGE_KEY = "ahangama-wellness-filters";
const COLOMBO_TIME_ZONE = "Asia/Colombo";

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
  "breathwork-and-recovery": "Breathwork & recovery",
  "sound-healing": "Sound healing",
  "strength-and-conditioning": "Strength & conditioning",
  "martial-arts": "Martial arts",
};

function getColomboDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: COLOMBO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

  return new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day), 12));
}

function addCalendarDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

function getWeekday(date) {
  return new Intl.DateTimeFormat("en-GB", { weekday: "long", timeZone: "UTC" }).format(date);
}

function formatCalendarDate(date, options = {}) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...options }).format(date);
}

function getInitialFilters() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    return JSON.parse(window.localStorage.getItem(FILTER_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

const GYM_PASSES = [
  {
    gym: "Sellam",
    passes: [
      { name: "One-session pass", priceLkr: 2000 },
      { name: "Three-session pass", priceLkr: 3500 },
      { name: "Weekly membership", priceLkr: 6000 },
      { name: "Monthly membership", priceLkr: 10000 },
    ],
  },
  {
    gym: "CrossFit Ceylon at PALM Hotel",
    passes: [
      { name: "Drop-in", priceLkr: 4500 },
      { name: "Open gym drop-in", priceLkr: 3000 },
    ],
  },
  {
    gym: "Krozz Fit",
    passes: [
      { name: "Day pass", priceLkr: 2500 },
      { name: "1 month", priceLkr: 10000 },
      { name: "6 months", priceLkr: 55000 },
      { name: "Annual", priceLkr: 100000 },
    ],
  },
  {
    gym: "Loka Lanka",
    passes: [{ name: "Day pass", priceLkr: 4500 }],
  },
];

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
    availabilityLabel: "Walk-ins welcome",
    dropInAvailable: true,
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
    availabilityLabel: "Drop-in available",
    dropInAvailable: true,
    defaultClassPriceLkr: 4500,
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
    availabilityLabel: "Booking recommended",
    defaultClassPriceLkr: 2500,
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
    availabilityLabel: "Confirm with studio",
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
  {
    venueId: "ember-and-ice",
    venueName: "Ember & Ice",
    location: "Ahangama area",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Ember%20%26%20Ice%20Ahangama",
    scheduleType: "weekly-recurring",
    timezone: "Asia/Colombo",
    availabilityLabel: "Confirm with venue",
    days: [
      { day: "Monday", sessions: [
        { time: "10:00", className: "Open Access", category: "breathwork-and-recovery" },
      ] },
      { day: "Tuesday", sessions: [
        { time: "10:00", className: "Breathwork + E&I Experience", category: "breathwork-and-recovery" },
        { time: "10:00", className: "Open Access", category: "breathwork-and-recovery" },
      ] },
      { day: "Wednesday", sessions: [
        { time: "10:00", className: "E&I Ritual", category: "breathwork-and-recovery", availabilityLabel: "No walk-ins" },
        { time: "12:00", className: "Open Access", category: "breathwork-and-recovery" },
      ] },
      { day: "Thursday", sessions: [
        { time: "10:00", className: "Open Access", category: "breathwork-and-recovery" },
        { time: "11:00", className: "Hatha Yoga", category: "yoga" },
      ] },
      { day: "Friday", sessions: [
        { time: "10:00", className: "Open Access", category: "breathwork-and-recovery" },
      ] },
      { day: "Saturday", sessions: [
        { time: "10:00", className: "Open Access", category: "breathwork-and-recovery" },
      ] },
      { day: "Sunday", sessions: [
        { time: "10:00", className: "Hatha Yoga", category: "yoga" },
        { time: "10:00", className: "Open Access", category: "breathwork-and-recovery" },
      ] },
    ],
  },
  {
    venueId: "kurulu-bay",
    venueName: "Kurulu Bay",
    location: "Ahangama area",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kurulu%20Bay%20Ahangama",
    scheduleType: "weekly-recurring",
    timezone: "Asia/Colombo",
    bookingUrl: "https://wa.me/94760950090?text=Hello%2C%20I%27d%20like%20to%20pre-book%20a%20class%20at%20Kurulu%20Bay.",
    availabilityLabel: "Pre-booking required",
    days: [
      { day: "Monday", sessions: [
        { time: "16:30", className: "Yin Yoga", instructor: "Nadeesh", category: "yoga" },
      ] },
      { day: "Tuesday", sessions: [
        { time: "16:30", className: "Yin Yoga", instructor: "Nadeesh", category: "yoga" },
      ] },
      { day: "Wednesday", sessions: [
        { time: "08:30", className: "Hatha Yoga", instructor: "Nadeesh", category: "yoga" },
      ] },
      { day: "Thursday", sessions: [
        { time: "16:30", className: "Yin Yoga", instructor: "Nadeesh", category: "yoga" },
      ] },
      { day: "Friday", sessions: [
        { time: "08:30", className: "Hatha Yoga", instructor: "Nadeesh", category: "yoga" },
        { time: "16:30", className: "Sound Healing", instructor: "Sarala", category: "sound-healing" },
      ] },
      { day: "Saturday", sessions: [
        { time: "16:30", className: "Yin Yoga", instructor: "Nadeesh", category: "yoga" },
        { time: "16:30", className: "Sound Healing", instructor: "Sarala", category: "sound-healing" },
      ] },
      { day: "Sunday", sessions: [] },
    ],
  },
];

const MAPPED_WELLNESS_VENUES = WELLNESS_VENUES.filter((venue) => venue.coordinates);

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

  MAPPED_WELLNESS_VENUES.forEach((venue, index) => {
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
        <p>{MAPPED_WELLNESS_VENUES.length} studios, mapped from the coast road to PALM Hotel.</p>
      </div>

      <div className="wc-mapSection__layout">
        <div className="wc-mapSection__frame">
          {googleMapsApiKey ? (
            <img
              className="wc-mapSection__map"
              src={getGoogleStaticMapUrl(googleMapsApiKey)}
              alt={`Google map showing ${MAPPED_WELLNESS_VENUES.length} wellness studios around Ahangama`}
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
          {MAPPED_WELLNESS_VENUES.map((venue, index) => (
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
  const today = useMemo(() => getColomboDate(), []);
  const tomorrow = useMemo(() => addCalendarDays(today, 1), [today]);
  const dateOptions = useMemo(() => {
    const options = [
      { label: "Today", value: "today" },
      { label: "Tomorrow", value: "tomorrow" },
    ];

    for (let offset = 2; offset <= 6; offset += 1) {
      const date = addCalendarDays(today, offset);
      const weekday = getWeekday(date);
      if (weekday === "Saturday" || weekday === "Sunday") break;
      options.push({ label: weekday, value: `day:${weekday}` });
    }

    options.push(
      { label: "Weekend", value: "weekend" },
      { label: "Full week", value: "full-week" },
    );
    return options;
  }, [today]);
  const [initialFilters] = useState(getInitialFilters);
  const [selectedRange, setSelectedRange] = useState(
    dateOptions.some(({ value }) => value === initialFilters.selectedRange)
      ? initialFilters.selectedRange
      : "today",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    Object.hasOwn(CATEGORY_LABELS, initialFilters.selectedCategory)
      ? initialFilters.selectedCategory
      : "all",
  );
  const [underFiveThousand, setUnderFiveThousand] = useState(Boolean(initialFilters.underFiveThousand));
  const [dropInOnly, setDropInOnly] = useState(Boolean(initialFilters.dropInOnly));
  const [viewMode, setViewMode] = useState(initialFilters.viewMode === "map" ? "map" : "schedule");

  const selectedDays = useMemo(() => {
    if (selectedRange === "full-week") return new Set(WEEKDAYS);
    if (selectedRange === "weekend") return new Set(["Saturday", "Sunday"]);
    if (selectedRange === "tomorrow") return new Set([getWeekday(tomorrow)]);
    if (selectedRange.startsWith("day:")) return new Set([selectedRange.slice(4)]);
    return new Set([getWeekday(today)]);
  }, [selectedRange, today, tomorrow]);

  useEffect(() => {
    window.localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify({
      selectedRange,
      selectedCategory,
      underFiveThousand,
      dropInOnly,
      viewMode,
    }));
  }, [dropInOnly, selectedCategory, selectedRange, underFiveThousand, viewMode]);

  const schedule = useMemo(() => WEEKDAYS.map((day) => {
    const sessions = WELLNESS_VENUES.flatMap((venue) => {
      const venueDay = venue.days.find((item) => item.day === day);
      if (!venueDay) return [];

      return venueDay.sessions
        .map((session) => ({
          ...session,
          venue,
          date: venueDay.date,
          effectivePriceLkr: session.priceLkr || venue.defaultClassPriceLkr,
        }))
        .filter((session) => selectedCategory === "all" || session.category === selectedCategory)
        .filter((session) => !underFiveThousand || (session.effectivePriceLkr && session.effectivePriceLkr < 5000))
        .filter(() => !dropInOnly || venue.dropInAvailable);
    }).sort((first, second) => first.time.localeCompare(second.time));

    return { day, sessions };
  }).filter(({ day, sessions }) => (
    sessions.length > 0 && selectedDays.has(day)
  )), [dropInOnly, selectedCategory, selectedDays, underFiveThousand]);

  const totalClasses = schedule.reduce((total, day) => total + day.sessions.length, 0);
  const selectedRangeLabel = dateOptions.find(({ value }) => value === selectedRange)?.label || "Today";
  const selectedHeading = selectedRange === "today"
    ? `Today — ${formatCalendarDate(today, { weekday: "long", day: "numeric", month: "long" })}`
    : selectedRange === "tomorrow"
      ? `Tomorrow — ${formatCalendarDate(tomorrow, { weekday: "long", day: "numeric", month: "long" })}`
      : selectedRange === "full-week"
        ? "Your week in motion"
        : selectedRangeLabel;
  const weekStart = addCalendarDays(today, -((today.getUTCDay() + 6) % 7));
  const weekEnd = addCalendarDays(weekStart, 6);

  const clearFilters = () => {
    setSelectedCategory("all");
    setUnderFiveThousand(false);
    setDropInOnly(false);
  };

  return (
    <SiteLayout>
      <Seo
        title="Wellness Classes & Weekly Schedule in Ahangama"
        description="Find Pilates, yoga, CrossFit, strength training and martial arts classes in Ahangama, with weekly times, venues, prices and booking links."
        canonical={absUrl(WELLNESS_CLASSES_PATH)}
        ogImage="https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/sept_wellness_schedule_crozz.webp"
      />

      <main className="wc-page">
        <section className="wc-hero">
          <div className="wc-hero__copy">
            <span className="wc-eyebrow">Move well in Ahangama</span>
            <h1>Wellness classes, all in one place.</h1>
            <p>
              The weekly guide to yoga, fitness, Pilates and restorative classes
              across Ahangama.
            </p>
            <div className="wc-hero__utility">
              <span>Updated weekly</span>
              <span>{formatCalendarDate(weekStart, { day: "numeric", month: "short" })}–{formatCalendarDate(weekEnd, { day: "numeric", month: "short", year: "numeric" })}</span>
              <span>Last checked {formatCalendarDate(today, { day: "numeric", month: "long" })}</span>
            </div>
            <div className="wc-hero__stats" aria-label="Schedule overview">
              <div><strong>{totalClasses}</strong><span>classes shown</span></div>
              <div><strong>{WELLNESS_VENUES.length}</strong><span>local studios</span></div>
              <div><strong>GMT+5:30</strong><span>local time</span></div>
            </div>
          </div>
          <a
            className="wc-hero__image"
            href="https://www.instagram.com/purapilatessrilanka/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pura Pilates studio interior. View Pura Pilates on Instagram"
          >
            <span className="wc-hero__credit">Photo: Pura Pilates</span>
          </a>
        </section>

        <section className="wc-controls" aria-label="Schedule filters">
          <div className="wc-controlGroup">
            <span className="wc-controlLabel"><CalendarOutlined /> Day</span>
            <div className="wc-dayScroller">
              <Segmented
                block
                className="wc-dayPicker"
                options={dateOptions}
                value={selectedRange}
                onChange={setSelectedRange}
              />
              <span className="wc-dayScrollCue" aria-hidden="true">
                <RightOutlined />
              </span>
            </div>
          </div>
          <div className="wc-categoryScroller">
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
              <button
                type="button"
                className={underFiveThousand ? "is-active" : ""}
                onClick={() => setUnderFiveThousand((value) => !value)}
              >
                Under LKR 5,000
              </button>
              <button
                type="button"
                className={dropInOnly ? "is-active" : ""}
                onClick={() => setDropInOnly((value) => !value)}
              >
                Drop-in available
              </button>
              {(selectedCategory !== "all" || underFiveThousand || dropInOnly) ? (
                <button type="button" className="wc-clearFilters" onClick={clearFilters}>
                  Clear filters
                </button>
              ) : null}
            </div>
            <span className="wc-categoryScrollCue" aria-hidden="true">
              <RightOutlined />
            </span>
          </div>
          <div className="wc-viewControls">
            <strong>{totalClasses} {totalClasses === 1 ? "class" : "classes"} {selectedRangeLabel.toLowerCase()}</strong>
            <Segmented
              aria-label="Choose schedule or map view"
              options={[
                { label: "Schedule", value: "schedule" },
                { label: "Map", value: "map" },
              ]}
              value={viewMode}
              onChange={setViewMode}
            />
          </div>
        </section>

        {viewMode === "schedule" ? <section className="wc-schedule" aria-live="polite">
          <div className="wc-schedule__heading">
            <div>
              <span className="wc-eyebrow">Ahangama class calendar</span>
              <h2>{selectedHeading}</h2>
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
                        {session.effectivePriceLkr ? <strong>LKR {formatPrice(session.effectivePriceLkr)}</strong> : <span>Price on request</span>}
                        <span>{session.availabilityLabel || session.venue.availabilityLabel}</span>
                      </div>
                    </div>
                    <div className="wc-session__actions">
                      {session.venue.bookingUrl ? (
                        <a href={session.venue.bookingUrl} target="_blank" rel="noopener noreferrer">
                          <LinkOutlined /> Book class
                        </a>
                      ) : (
                        <a
                          href={session.venue.instagram ? getInstagramUrl(session.venue.instagram) : session.venue.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <EnvironmentOutlined /> View studio
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )) : (
            <div className="wc-empty">
              <h3>No classes match these filters.</h3>
              <button type="button" onClick={() => { setSelectedRange("full-week"); clearFilters(); }}>
                Show the full week
              </button>
            </div>
          )}
        </section> : <WellnessVenueMap />}

        <section className="wc-passes" aria-labelledby="wc-passes-title">
          <div className="wc-passes__intro">
            <div>
              <span className="wc-eyebrow">Train your way</span>
              <h2 id="wc-passes-title">Gym passes &amp; memberships.</h2>
            </div>
            <p>Drop in for one session or settle into a longer training rhythm.</p>
          </div>

          <div className="wc-passes__grid">
            {GYM_PASSES.map((gym, index) => (
              <article className="wc-pass" key={gym.gym}>
                <div className="wc-pass__heading">
                  <span>0{index + 1}</span>
                  <h3>{gym.gym}</h3>
                </div>
                <div className="wc-pass__prices">
                  {gym.passes.map((pass) => (
                    <div className="wc-pass__price" key={pass.name}>
                      <span>{pass.name}</span>
                      <strong>LKR {formatPrice(pass.priceLkr)}</strong>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <p className="wc-passes__note">
            Prices are provided by the venues and may change. Confirm current rates before visiting.
          </p>
        </section>

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