import denitsaImage from "../assets/temp/denitsa.jpg";
import kaffiImage from "../assets/temp/kaffi_image.jpg";
import muktiStudioImage from "../assets/temp/mukit_studio.jpg";
import photoOfWeekImage from "../assets/temp/photo_of_week.jpeg";
import sistersImage from "../assets/temp/sisters_image.jpg";
import { PLACES } from "./places";

function normalizeVenueName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function findVenuePlace(name) {
  const normalizedName = normalizeVenueName(name);
  return PLACES.find(
    (place) => place.destinationSlug === "ahangama" && normalizeVenueName(place.name) === normalizedName,
  );
}

function getInstagramUrl(name) {
  const place = findVenuePlace(name);
  if (place?.instagram) {
    return `https://www.instagram.com/${String(place.instagram).replace(/^@/, "")}/`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(`site:instagram.com ${name} Ahangama`)}`;
}

function getDirectionsUrl(name) {
  const place = findVenuePlace(name);
  if (place?.mapUrl) return place.mapUrl;
  if (typeof place?.lat === "number" && typeof place?.lng === "number") {
    return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} Ahangama`)}`;
}

function enrichEvent(event) {
  return {
    ...event,
    instagramUrl: getInstagramUrl(event.venue),
    directionsUrl: getDirectionsUrl(event.venue),
  };
}

export const EVENTS_CALENDAR_OVERVIEW = {
  monthLabel: "June 2026",
  kicker: "Ahangama Events Agenda",
  summary: "A daily guide to what's happening around town.",
  weekLabel: "Ahangama . 4 - 8 June",
  weekDescription: "A curated selection of things happening around town this week.",
};

export const EVENTS_CALENDAR_DAYS = [
  {
    key: "2026-06-04",
    weekday: "Thursday",
    dayNumber: "4",
    month: "June",
    events: [
      enrichEvent({
        title: "Muay Thai Adult Class",
        venue: "Kushan Muay Thai",
        time: "6:00 PM - 7:00 PM",
        category: "Wellness",
        image: photoOfWeekImage,
      }),
      enrichEvent({
        title: "Vinyasa Yoga",
        venue: "Studio 42",
        time: "7:00 AM - 8:00 AM",
        category: "Wellness",
        image: muktiStudioImage,
      }),
    ],
  },
  {
    key: "2026-06-05",
    weekday: "Friday",
    dayNumber: "5",
    month: "June",
    events: [
      enrichEvent({
        title: "Live Music Night",
        venue: "Kaffi",
        time: "7:30 PM onwards",
        category: "Music",
        image: kaffiImage,
      }),
    ],
  },
  {
    key: "2026-06-06",
    weekday: "Saturday",
    dayNumber: "6",
    month: "June",
    events: [
      enrichEvent({
        title: "Sunset Sessions",
        venue: "Ceylon Sliders",
        time: "7:00 PM onwards",
        category: "Music",
        image: denitsaImage,
      }),
      enrichEvent({
        title: "Art Market",
        venue: "Focus Hub",
        time: "10:00 AM - 2:00 PM",
        category: "Markets",
        image: sistersImage,
      }),
    ],
  },
  {
    key: "2026-06-07",
    weekday: "Sunday",
    dayNumber: "7",
    month: "June",
    events: [
      enrichEvent({
        title: "Sunday Coffee & Vinyl",
        venue: "Kaffi",
        time: "10:00 AM - 1:00 PM",
        category: "Community",
        image: kaffiImage,
      }),
    ],
  },
  {
    key: "2026-06-08",
    weekday: "Monday",
    dayNumber: "8",
    month: "June",
    events: [
      enrichEvent({
        title: "Surf & Connect",
        venue: "Ahangama Surf Club",
        time: "8:00 AM onwards",
        category: "Wellness",
        image: photoOfWeekImage,
      }),
    ],
  },
];

export const THIS_WEEK_EVENTS = EVENTS_CALENDAR_DAYS.flatMap((day) =>
  day.events.map((event) => ({
    ...event,
    date: `${day.weekday.slice(0, 3)} ${day.dayNumber} ${day.month.slice(0, 3)} 2026`,
  })),
).slice(0, 5);