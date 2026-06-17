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
  summary: "This week's highlights, weekly picks, wellness sessions and late June events around Ahangama.",
  weekLabel: "Ahangama . 18 - 30 June",
  weekDescription: "A curated selection of music, wellness, happy hours and social nights around town.",
};

export const EVENTS_CALENDAR_DAYS = [
  {
    key: "2026-06-18",
    weekday: "Thursday",
    dayNumber: "18",
    month: "June",
    events: [
      enrichEvent({
        title: "🍹 Sunset Happy Hour & Music Night",
        venue: "Hakuna Matata",
        time: "Happy Hour: 5:00 PM - 7:00 PM",
        category: "Weekly Picks",
        image: denitsaImage,
        description: "20% off all cocktails with sunset music and a full night line-up.",
        details: [
          "Music: Skillz Jay, Monamourrr, Mr. Percussion, Hotel De Uncles",
          "Offer: 20% off all cocktails",
        ],
      }),
      enrichEvent({
        title: "🎤 Karaoke Thursday",
        venue: "Hakuna Matata",
        time: "From 6:00 PM",
        category: "Weekly Picks",
        image: kaffiImage,
      }),
      enrichEvent({
        title: "🎵 Live Music with Channa",
        venue: "Kai Ahangama",
        time: "From 5:00 PM",
        category: "Weekly Picks",
        image: sistersImage,
      }),
    ],
  },
  {
    key: "2026-06-19",
    weekday: "Friday",
    dayNumber: "19",
    month: "June",
    events: [
      enrichEvent({
        title: "🎵 Mono — Dante Alchemico Koila",
        venue: "Mono",
        time: "8:00 PM - 10:00 PM; 10:00 PM - Midnight",
        category: "This Week's Highlights",
        image: photoOfWeekImage,
        description: "Electronic live set by Bali-based DJ and producer Dante Alchemico Koila.",
      }),
    ],
  },
  {
    key: "2026-06-20",
    weekday: "Saturday",
    dayNumber: "20",
    month: "June",
    events: [
      enrichEvent({
        title: "🎶 Kurundu Sundown Session",
        venue: "Kurundu",
        time: "4:00 PM - 2:00 AM",
        category: "This Week's Highlights",
        image: denitsaImage,
        description: "Sunset music, cocktails and late-night dancing.",
        details: [
          "Line-up: Adriqus, Banu, Derek, Jayy Vibes b2b Chiruka, Sam, Shamika",
          "Tickets: Rs. 5,000",
        ],
      }),
      enrichEvent({
        title: "🥁 Mono — Drum & Bass Night",
        venue: "Mono",
        time: "8:30 PM - 11:30 PM",
        category: "This Week's Highlights",
        image: photoOfWeekImage,
        description: "Featuring DJ Janaka.",
      }),
      enrichEvent({
        title: "🎸 Live Music with Ashane",
        venue: "Kai Ahangama",
        time: "From 5:00 PM",
        category: "This Week's Highlights",
        image: kaffiImage,
      }),
    ],
  },
  {
    key: "2026-06-21",
    weekday: "Sunday",
    dayNumber: "21",
    month: "June",
    events: [
      enrichEvent({
        title: "🎵 Live Music with Shenal",
        venue: "Kai Ahangama",
        time: "From 5:00 PM",
        category: "Weekly Picks",
        image: kaffiImage,
      }),
    ],
  },
  {
    key: "2026-06-23",
    weekday: "Tuesday",
    dayNumber: "23",
    month: "June",
    events: [
      enrichEvent({
        title: "🧘 Breathwork",
        venue: "Ember & Ice",
        time: "10:00 AM",
        category: "Wellness",
        image: muktiStudioImage,
      }),
    ],
  },
  {
    key: "2026-06-24",
    weekday: "Wednesday",
    dayNumber: "24",
    month: "June",
    events: [
      enrichEvent({
        title: "🔥 Ember & Ice Ritual",
        venue: "Ember & Ice",
        time: "11:00 AM",
        category: "Wellness",
        image: muktiStudioImage,
      }),
    ],
  },
  {
    key: "2026-06-27",
    weekday: "Saturday",
    dayNumber: "27",
    month: "June",
    events: [
      enrichEvent({
        title: "🏄 Claramont Gaali",
        venue: "Surf Club Midigama",
        time: "From 4:00 PM onwards",
        category: "Late June Events",
        image: photoOfWeekImage,
      }),
      enrichEvent({
        title: "🌴 Saturday Session",
        venue: "Ceylon Sliders",
        time: "8:00 PM - 1:00 AM",
        category: "Late June Events",
        image: denitsaImage,
        description: "Featuring Miloh & Sheran.",
        details: [
          "Entry: Free before 8pm",
          "Rs. 1,000 from 8-9pm",
          "Rs. 2,000 from 9pm-12:30am",
          "Rs. 1,000 after 12:30am",
        ],
      }),
    ],
  },
  {
    key: "2026-06-30",
    weekday: "Tuesday",
    dayNumber: "30",
    month: "June",
    events: [
      enrichEvent({
        title: "🧘 Breathwork",
        venue: "Ember & Ice",
        time: "10:00 AM",
        category: "Wellness",
        image: muktiStudioImage,
      }),
    ],
  },
  {
    key: "ongoing",
    weekday: "Ongoing",
    dayNumber: "Daily",
    month: "",
    events: [
      enrichEvent({
        title: "🍷 Daily Happy Hour",
        venue: "Le Café French Bistro",
        time: "5:00 PM - 6:00 PM",
        category: "Ongoing",
        image: sistersImage,
        description:
          "Receive a complimentary charcuterie or cheese bite with every glass of wine or beer.",
      }),
    ],
  },
];

export const EVENTS_EDITOR_PICKS = [
  "Kurundu Sundown Session — biggest event of the week.",
  "Mono: Dante Alchemico Koila — strongest electronic music booking.",
  "Hakuna Matata Sunset Happy Hour — best value night out.",
  "Ember & Ice Breathwork — wellness highlight.",
  "Ceylon Sliders Saturday Session — late June social favourite.",
];

export const THIS_WEEK_EVENTS = EVENTS_CALENDAR_DAYS.flatMap((day) =>
  day.events.map((event) => ({
    ...event,
    date: `${day.weekday.slice(0, 3)} ${day.dayNumber} ${day.month.slice(0, 3)} 2026`,
  })),
).slice(0, 5);