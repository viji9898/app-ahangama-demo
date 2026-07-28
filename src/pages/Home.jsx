import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, Row, Col, Typography, Button, Space, Spin, Tag } from "antd";
import QRCode from "react-qr-code";
import {
  CoffeeOutlined,
  HomeOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  HeartOutlined,
  LaptopOutlined,
  QrcodeOutlined,
  ArrowRightOutlined,
  ThunderboltOutlined,
  ExclamationCircleOutlined,
  WhatsAppOutlined,
  CloudOutlined,
  ShopOutlined,
  MessageOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { usePlaces } from "../app/placesContext";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { trackPassCtaClick } from "../analytics";
import { buildPassCtaUrl } from "../lib/passAttribution";
import PassPartnersStrip from "../components/home/PassPartnersStrip";
import HomeMapSection from "../components/home/HomeMapSection";
import HomeMapSectionMobile from "../components/home/HomeMapSectionMobile";
import HomeGoogleMapSection from "../components/home/HomeGoogleMapSection";
import FreeGuideCtaMobile from "../components/home/FreeGuideCtaMobile";
import { PLACES } from "../data/places";
import { shouldShowPlace } from "../data/placeStatus";
import addToAppleWalletLogo from "../assets/add_to_apple_wallet.png";
import addToGoogleWalletLogo from "../assets/add_to_google_wallet.png";
import heroPassAppleWallet from "../assets/hero_pass_apple_wallet.png";
import denitsaImage from "../assets/temp/denitsa.jpg";
import muktiStudioImage from "../assets/temp/mukit_studio.jpg";
import photoOfWeekImage from "../assets/temp/photo_of_week.jpeg";

const { Title, Paragraph, Text } = Typography;

const EVENTS_ENDPOINT = "/.netlify/functions/events";

function formatHomepageEventDate(day) {
  if (String(day.key).startsWith("ongoing")) {
    return "Ongoing";
  }

  const year = String(day.key).slice(0, 4);
  return `${String(day.weekday).slice(0, 3)} ${day.dayNumber} ${String(day.month).slice(0, 3)} ${year}`;
}

function buildHomepageEvents(days) {
  return days
    .flatMap((day) =>
      (day.events || []).map((event) => ({
        ...event,
        date: formatHomepageEventDate(day),
        dayKey: day.key,
      })),
    )
    .slice(0, 5);
}

function buildHomepageEventsLabel(events) {
  const datedEvents = events.filter(
    (event) => !String(event.dayKey).startsWith("ongoing"),
  );

  if (!datedEvents.length) {
    return "Ahangama . Ongoing";
  }

  const formatDate = (event) => event.date
    .replace(/^[A-Za-z]{3} /, "")
    .replace(/ \d{4}$/, "");
  const firstDate = formatDate(datedEvents[0]);
  const lastDate = formatDate(datedEvents[datedEvents.length - 1]);

  return firstDate === lastDate
    ? `Ahangama . ${firstDate}`
    : `Ahangama . ${firstDate} - ${lastDate}`;
}

const TWELVE_THINGS_ORDER = [
  "pura",
  "gik-bike-rentals",
  "coconut-c",
  "frostys-recovery-centre-hangout",
  "kumbuk-community",
  "spa-station-midigama",
  "sarana-ahangama",
  "palm-and-paint",
  "living-r-c-s",
  "yiva-essentials",
  "hakuna-matata-ahangama",
  "qamar-by-zan",
];

const DENITSA_STORY_TAGS = [
  "Ahangama",
  "Personal Story",
  "Digital Nomad",
  "Wellness + Surf",
];

const DENITSA_DAY_CHIPS = [
  "Wellness Focused",
  "Solo Friendly",
  "Walkable",
  "2-4 Day Stay",
];

const DENITSA_FEATURED_PLACES = [
  "Pura Pilates",
  "Oyummy",
  "Rollingpin",
  "Lighthouse",
];

const DENITSA_FEATURED_PLACE_MATCHERS = {
  "Pura Pilates": ["Pura Pilates", "pura"],
  Oyummy: ["Oyummy", "oyummy"],
  Rollingpin: ["Rollingpin", "Rollingpin Bakery", "rollingpin-bakery"],
  Lighthouse: ["Lighthouse", "lighthouse"],
};

const THREE_DAYS_STORY_TAGS = [
  "Ahangama",
  "Personal Story",
  "3 Days",
  "Wellness + Coworking",
];

const THREE_DAYS_HIGHLIGHTS = [
  "Stayed at Samba",
  "Daily Pilates",
  "Morning Coworking",
  "Ice Bath Recovery",
  "Sunset Sessions",
];

const THREE_DAYS_FEATURED_PLACES = [
  "Samba",
  "Pura Pilates",
  "Frosty's",
  "Kaffi",
];

const THIS_WEEK_FEATURES = [
  {
    category: "Editorial",
    title: "Why Surfing Changed Everything in Ahangama",
    href: "/why-surfing-changed-everything-in-ahangama",
    image:
      "https://images.pexels.com/photos/19065606/pexels-photo-19065606.jpeg",
  },
  {
    category: "Editorial",
    title: "Sri Lanka's Most Interesting Coastal Town",
    href: "/sri-lankas-most-interesting-coastal-town",
    image:
      "https://content.r9cdn.net/rimg/dimg/09/d4/c553223f-city-304822-172c638b4d6.jpg?crop=true&width=1366&height=768&xhint=1254&yhint=1207",
  },
  {
    category: "Stay Guide",
    title: "Where to Stay on Sri Lanka's Southern Coast",
    href: "/where-to-stay-on-sri-lankas-southern-coast",
    image:
      "https://images.suitcasemag.com/wp-content/uploads/2025/03/05163113/HERO2-TheFind-SouthCoastSriLanka.jpeg",
  },
];

const WEEKLY_PICKS = [
  {
    category: "Community",
    title: "Inside the Launch of Ahangama Circle",
    date: "This Week",
    href: "/inside-the-launch-of-ahangama-circle",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/inside-the-launch-of-ahangama-circle/hero+-+Guests+networking+at+Surf+Club+Midigama+during+sunset+-+Option+01+.jpeg",
  },
  {
    category: "Shop Guide",
    title: "The Living Room Concept Store",
    date: "This Week",
    href: "/the-living-room-concept-store",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/hero-the-living-room-concept-store.jpeg",
  },
  {
    category: "Community",
    title: "Dulasiri Uncle",
    date: "This Week",
    href: "/dulasiri-uncle",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/dulasiri-uncle/Dulasiri-on-the-beach-holding-a-turtle.jpg",
  },
  {
    category: "Community",
    title: "Community Market",
    date: "Sat 7 Jun",
    href: "/community-market-in-ahangama",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/community-markets-in-ahangama/Hero+image+_+community-markets-ahangama-crowd-stalls.webp",
  },
  {
    category: "Sunset",
    title: "Best Sunset This Week",
    date: "Daily",
    href: "/best-sunsets-in-ahangama",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/best-sunsets/Hero+Image+-+2400+x+1600+px.webp",
  },
  {
    category: "Staff Pick",
    title: "Staff Pick Experience",
    date: "This Weekend",
    href: "/staff-pick-experience-a-day-that-slowly-erases-your-plan-in-ahangama",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/staff-pick-experience-a-day-that-slowly-erases-your-plan-in-ahangama/Hero+image+_+ahangama-morning-coffee-hands-cups-close-up.webp",
  },
];

const AROUND_TOWN_PICKS = [
  {
    category: "Instagram Pick",
    title: "@studio.mukti",
    description: "Beautiful behind-the-scenes look at the opening week.",
    cta: "View on Instagram",
    href: "https://www.instagram.com/studio.mukti/",
    image: muktiStudioImage,
  },
  {
    category: "Blog Pick",
    title: "Sri Lanka's Hippest Beach Spot",
    description: "Maria and Espen Egeland, travel nerds from Norway.",
    cta: "Read article",
    href: "https://nerdnomads.com/ahangama-sri-lanka",
    image: "https://nerdnomads.com/wp-content/uploads/2014/02/about.png",
  },
  {
    category: "Photo of the Week",
    title: "We call them Good Buggers",
    description: "Captured by @hoteldeuncles",
    cta: "View photo",
    href: "https://www.instagram.com/p/DWgGPb8DDzo/?igsh=MTZkeTZtMnQ2d2cwcA%3D%3D",
    image: photoOfWeekImage,
  },
  {
    category: "Creator Spotlight",
    title: "Denitsa",
    description: "Resident Pilates and yoga instructor.",
    cta: "Follow",
    href: "https://www.instagram.com/denitsaloves/",
    image: denitsaImage,
  },
];

const HERO_INTELLIGENCE_ITEMS = [
  {
    key: "surf",
    label: "Surf",
    value: "3-4ft at Marshmallow",
    icon: CompassOutlined,
  },
  {
    key: "weather",
    label: "Weather",
    value: "Mostly sunny",
    icon: CloudOutlined,
  },
  {
    key: "opening",
    label: "New Opening",
    value: "Studio Mukti",
    icon: ShopOutlined,
  },
  {
    key: "discussed",
    label: "Most Discussed",
    value: "Coconut Court Pickleball",
    icon: MessageOutlined,
  },
  {
    key: "note",
    label: "Editor's Note",
    value: "The town feels noticeably busier this week.",
    icon: ReadOutlined,
  },
];

const DESTINATION_CATEGORIES = [
  {
    key: "eat",
    title: "Eat",
    href: "/eat",
    tone: "#efe8dd",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/animals.jpg",
    keywords: ["eat", "restaurant", "cafe", "brunch", "coffee"],
    sublabels: "The best breakfasts, long lunches and dinner spots.",
  },
  {
    key: "drink",
    title: "Drink",
    href: "/eat",
    tone: "#e8dccf",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/unsung.jpg",
    keywords: ["drink", "bar", "cocktail", "prosecco", "music bar", "lounge"],
    sublabels:
      "Cocktails at golden hour, late pours and the bars worth staying for.",
  },
  {
    key: "stay",
    title: "Stay",
    href: "/stays",
    tone: "#ece4d8",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/57/9b/6a/caption.jpg?w=1100&h=1100&s=1",
    keywords: ["stay", "villa", "guesthouse", "boutique hotel", "hotel"],
    sublabels:
      "Boutique stays, private villas and the places built for lingering.",
  },
  {
    key: "surf",
    title: "Surf",
    href: "/blogs",
    tone: "#e4ebde",
    image:
      "https://hips.hearstapps.com/hmg-prod/images/exploring-ahangama-the-surfing-sweet-spot-on-sri-lanka-s-southern-coast-66475f779dc88.jpg?crop=0.6672958942897593xw:1xh;center,top&resize=640:*",
    keywords: ["surf", "surf school", "board rental", "lesson"],
    sublabels: "Schools, board hire and camps for easy days in the water.",
  },
  {
    key: "wellness",
    title: "Wellness",
    href: "/wellness",
    tone: "#dde6d7",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/pura_pilates.jpeg",
    keywords: ["wellness", "yoga", "spa", "pilates", "ice bath", "recovery"],
    sublabels: "Yoga, treatments and recovery rituals for slower mornings.",
  },
  {
    key: "culture",
    title: "Culture",
    href: "/blogs",
    tone: "#e9e0d1",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hero_ahangama.jpg",
    keywords: ["culture", "local experience", "nature", "cooking", "guide"],
    sublabels:
      "Stories, local context and the details that make the town legible.",
  },
  {
    key: "shop",
    title: "Shop",
    href: "/retail",
    tone: "#e7ddd0",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/living_room.jpg",
    keywords: ["retail", "shop", "clothing", "home & gifts", "gifts"],
    sublabels:
      "Clothing, home pieces and the small essentials people actually need.",
  },
  {
    key: "nightlife",
    title: "Nightlife",
    href: "/blogs",
    tone: "#e8d7cd",
    image:
      "https://www.theworlds50best.com/discovery/filestore/jpg/TRAX_exterior.jpg",
    keywords: ["nightlife", "bar", "music", "social", "lounge", "drink"],
    sublabels:
      "Music, late-night energy and the places that still feel social.",
  },
];

const ITINERARY_FEATURES = [
  {
    category: "Short Stay",
    date: "May 21, 2026",
    title: "48 Hours in Ahangama",
    description:
      "A fast but thoughtful south-coast edit covering surf, coffee, one excellent dinner and the right sunset stop.",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hero_ahangama.jpg",
  },
  {
    category: "Surf Trip",
    date: "May 7, 2026",
    title: "5 Day Surf Escape",
    description:
      "A rhythm of dawn sessions, lazy breakfasts, recovery spots and beach-to-beach movement without overplanning it.",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hero-coffee-ocean.jpg",
  },
  {
    category: "Wellness",
    date: "May 6, 2026",
    title: "Wellness Weekend",
    description:
      "Pilates, slow mornings, restorative treatments and the calmest corners of Ahangama for a lighter two-day reset.",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/pura_pilates.jpeg",
  },
];

const LATEST_STORIES = [
  {
    category: "Food",
    title: "New restaurant opens",
    date: "2 Jun 2026",
  },
  {
    category: "Interview",
    title: "Interview with local artist",
    date: "1 Jun 2026",
  },
  {
    category: "Festival",
    title: "Festival announced",
    date: "31 May 2026",
  },
  {
    category: "Surf",
    title: "New surf report",
    date: "30 May 2026",
  },
  {
    category: "Community",
    title: "Community story",
    date: "29 May 2026",
  },
  {
    category: "Wellness",
    title: "Morning recovery ritual at Frosty's",
    date: "28 May 2026",
  },
];

const GETTING_AROUND_PREVIEW = [
  {
    label: "Scooter",
    minLkr: 2500,
    maxLkr: 4500,
    suffix: "/ day",
  },
  {
    label: "Tuk Tuk",
    minLkr: 500,
    maxLkr: 1500,
    suffix: "/ ride",
  },
  {
    label: "Airport Transfer",
    minLkr: 15000,
    maxLkr: 20000,
    suffix: "",
  },
  {
    label: "Car with Driver",
    minLkr: 12000,
    maxLkr: 20000,
    suffix: "/ day",
  },
];

const TRANSPORT_CURRENCIES = ["LKR", "USD", "EUR", "GBP", "INR", "CNY"];

const TRANSPORT_EXCHANGE_RATES = {
  LKR: 1,
  USD: 0.0033,
  EUR: 0.003,
  GBP: 0.0025,
  INR: 0.27,
  CNY: 0.024,
};

const TRANSPORT_CURRENCY_FORMATTERS = {
  LKR: new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }),
  USD: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }),
  EUR: new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }),
  GBP: new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }),
  INR: new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }),
  CNY: new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }),
};

const MINIMAL_GUIDE_CARDS = [
  {
    label: "AHANGAMA GUIDE",
    title: "12 Things to Do",
    href: "/12-things",
    image:
      "https://hips.hearstapps.com/hmg-prod/images/exploring-ahangama-the-surfing-sweet-spot-on-sri-lanka-s-southern-coast-66475f779dc88.jpg?crop=0.6672958942897593xw:1xh;center,top&resize=640:*",
  },
  {
    label: "WELLNESS STAY",
    title: "My Wellness Stay at Samba",
    href: "/3-days-in-ahangama",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/57/9b/6a/caption.jpg?w=1100&h=1100&s=1",
  },
  {
    label: "WELLNESS GUIDE",
    title: "Wellness in Ahangama",
    href: "/blogs/the-ultimate-wellness-guide-to-ahangama-yoga-gyms-pilates-ice-baths-spas",
    image:
      "https://images.squarespace-cdn.com/content/v1/687779bfeb67b07ba252ad9e/1765200138172-E21VJEEVSEA0JQ1ZDW90/Jungle+Shala+Launch-45+2.jpg",
  },
  {
    label: "TRANSPORT GUIDE",
    title: "Getting Around",
    href: "/getting-around-ahangama-scooters-tuk-tuks-airport-transfers",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/93/b1/58/caption.jpg?w=500&h=500&s=1",
  },
];

const GUIDE_SECTION_PALETTE = [
  {
    card: "#f7f1e7",
    ink: "#1f1d1a",
    line: "rgba(31,29,26,0.72)",
    media: "rgba(176, 142, 98, 0.14)",
  },
  {
    card: "#ebe5d8",
    ink: "#1f1d1a",
    line: "rgba(31,29,26,0.72)",
    media: "rgba(106, 114, 85, 0.16)",
  },
  {
    card: "#dfe5d6",
    ink: "#1f1d1a",
    line: "rgba(31,29,26,0.72)",
    media: "rgba(97, 111, 79, 0.16)",
  },
  {
    card: "#e8d6ca",
    ink: "#1f1d1a",
    line: "rgba(31,29,26,0.72)",
    media: "rgba(136, 92, 64, 0.14)",
  },
];

function formatTransportRange(item, currency) {
  const rate = TRANSPORT_EXCHANGE_RATES[currency] || 1;
  const formatter =
    TRANSPORT_CURRENCY_FORMATTERS[currency] ||
    TRANSPORT_CURRENCY_FORMATTERS.LKR;
  const min = Math.round(item.minLkr * rate);
  const max = Math.round(item.maxLkr * rate);
  const formattedRange =
    min === max
      ? formatter.format(min)
      : `${formatter.format(min)} - ${formatter.format(max)}`;

  return `${formattedRange}${item.suffix ? ` ${item.suffix}` : ""}`.trim();
}

const TWELVE_THINGS_GUIDE_META = [
  "12 Experiences",
  "5 Categories",
  "Updated Monthly",
  "Most Read Guide",
];

const TWELVE_THINGS_GUIDE_PREVIEW = [
  "Sauna & Ice Bath",
  "Self Drive Tuk Tuk",
  "Pickleball",
  "Lighthouse Sunset",
];

export default function Home() {
  const { loading, places } = usePlaces();
  const [transportCurrency, setTransportCurrency] = useState("LKR");
  const canonical = absUrl("/");
  const passCtaUrl = buildPassCtaUrl();
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const daysSinceYearStart = Math.floor(
    (now.getTime() - startOfYear.getTime()) / 86400000,
  );
  const currentWeekNumber = Math.ceil(
    (daysSinceYearStart + startOfYear.getDay() + 1) / 7,
  );
  const intelligenceSyncTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const sectionSpacing = 32;
  const editorialSerifFont =
    '"Cormorant Garamond", "Libre Baskerville", Georgia, serif';
  const featureTagRailStyle = {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    paddingBottom: 4,
    marginBottom: 14,
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  };
  const featureTagStyle = {
    borderRadius: 999,
    padding: "6px 10px",
    flex: "0 0 auto",
    marginInlineEnd: 0,
    whiteSpace: "nowrap",
    background: "rgba(255,255,255,0.46)",
    border: "1px solid rgba(32,30,27,0.08)",
    color: "#8B7B63",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  };
  const editorialCardStyle = {
    borderRadius: 30,
    border: "1px solid rgba(32,30,27,0.08)",
    background: "#FFFFFF",
    overflow: "hidden",
    boxShadow: "none",
  };
  const editorialEyebrowStyle = {
    display: "block",
    marginBottom: 10,
    color: "#B08E62",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  };
  const editorialTitleStyle = {
    marginTop: 0,
    marginBottom: 12,
    color: "#1F1D1A",
    lineHeight: 1.02,
    letterSpacing: -0.02,
    fontFamily: editorialSerifFont,
  };
  const editorialCopyStyle = {
    marginBottom: 20,
    color: "#5F574E",
    fontSize: 16,
    lineHeight: 1.8,
    maxWidth: 760,
  };
  const editorialPrimaryButtonStyle = {
    borderRadius: 999,
    height: 44,
    paddingInline: 18,
    boxShadow: "none",
    background: "#2F3E3A",
    borderColor: "#2F3E3A",
  };

  const heroImage =
    "https://images.suitcasemag.com/wp-content/uploads/2025/05/01113553/Hero-AhanagamaGuide-SriLanka.jpeg";
  const showWeeklyPicksSection = true;
  const showLatestStoriesSection = false;
  const weeklyPicksLooped = useMemo(
    () => [...WEEKLY_PICKS, ...WEEKLY_PICKS, ...WEEKLY_PICKS],
    [],
  );
  const twelveThingsMosaic = useMemo(() => {
    const placesBySlug = new Map(
      (places || [])
        .filter((place) => place.destinationSlug === "ahangama")
        .filter((place) => shouldShowPlace(place))
        .map((place) => [place.slug, place]),
    );

    return TWELVE_THINGS_ORDER.map((slug) => placesBySlug.get(slug))
      .filter(Boolean)
      .map((place) => ({
        slug: place.slug,
        image: place.image || place.logo || heroImage,
        name: place.name,
      }));
  }, [places, heroImage]);
  const denitsaFeaturedPlaces = useMemo(() => {
    const sourcePlaces = (places && places.length ? places : PLACES).filter(
      (place) => place.destinationSlug === "ahangama",
    );
    const placesByKey = new Map();

    sourcePlaces.forEach((place) => {
      placesByKey.set(place.name?.toLowerCase(), place);
      placesByKey.set(place.slug?.toLowerCase(), place);
    });

    return DENITSA_FEATURED_PLACES.map((label) => {
      const matchers = DENITSA_FEATURED_PLACE_MATCHERS[label] || [label];
      const place = matchers
        .map((matcher) => placesByKey.get(matcher.toLowerCase()))
        .find(Boolean);

      return {
        label,
        logo: place?.logo || place?.image || null,
        mapUrl: place?.mapUrl || null,
      };
    });
  }, [places]);
  const destinationCategoryCards = useMemo(() => {
    const sourcePlaces = (places && places.length ? places : PLACES)
      .filter((place) => place.destinationSlug === "ahangama")
      .filter((place) => shouldShowPlace(place));

    return DESTINATION_CATEGORIES.map((category) => {
      const count = sourcePlaces.filter((place) => {
        const searchable = [
          place.category,
          ...(place.tags || []),
          ...(place.bestFor || []),
          place.name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return category.keywords.some((keyword) =>
          searchable.includes(keyword),
        );
      }).length;

      return {
        ...category,
        count,
      };
    });
  }, [places]);
  const formatCategoryCount = (count) => {
    if (count >= 10) {
      return `${Math.floor(count / 10) * 10}+ Places`;
    }

    return `${count} Places`;
  };
  const showLegacyHomepageLowerSections = false;
  const whatsOnBoardRailRef = useRef(null);
  const [thisWeekEvents, setThisWeekEvents] = useState([]);
  const [thisWeekEventsLabel, setThisWeekEventsLabel] = useState("Ahangama");
  const [canScrollWhatsOnLeft, setCanScrollWhatsOnLeft] = useState(false);
  const [canScrollWhatsOnRight, setCanScrollWhatsOnRight] = useState(false);
  const weeklyPicksRailRef = useRef(null);
  const isWeeklyPicksAdjustingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      try {
        const response = await fetch(EVENTS_ENDPOINT);
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load events");
        }

        if (cancelled || !Array.isArray(payload.days)) {
          return;
        }

        const homepageEvents = buildHomepageEvents(payload.days);

        if (homepageEvents.length > 0) {
          setThisWeekEvents(homepageEvents);
          setThisWeekEventsLabel(buildHomepageEventsLabel(homepageEvents));
        }
      } catch (error) {
        console.warn("Unable to load homepage events", error);
      }
    }

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const rail = whatsOnBoardRailRef.current;

    if (!rail) {
      return undefined;
    }

    const updateWhatsOnScrollState = () => {
      const maxScrollLeft = rail.scrollWidth - rail.clientWidth - 4;
      setCanScrollWhatsOnLeft(rail.scrollLeft > 4);
      setCanScrollWhatsOnRight(rail.scrollLeft < maxScrollLeft);
    };

    updateWhatsOnScrollState();
    rail.addEventListener("scroll", updateWhatsOnScrollState, {
      passive: true,
    });
    window.addEventListener("resize", updateWhatsOnScrollState);

    return () => {
      rail.removeEventListener("scroll", updateWhatsOnScrollState);
      window.removeEventListener("resize", updateWhatsOnScrollState);
    };
  }, []);

  const handleWhatsOnScrollLeft = () => {
    const rail = whatsOnBoardRailRef.current;

    if (!rail) {
      return;
    }

    const firstItem = rail.querySelector(".whats-on-boardItem");
    const itemWidth = firstItem ? firstItem.getBoundingClientRect().width : 0;

    rail.scrollBy({
      left: -(itemWidth ? itemWidth + 1 : rail.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  const handleWhatsOnScrollRight = () => {
    const rail = whatsOnBoardRailRef.current;

    if (!rail) {
      return;
    }

    const firstItem = rail.querySelector(".whats-on-boardItem");
    const itemWidth = firstItem ? firstItem.getBoundingClientRect().width : 0;

    rail.scrollBy({
      left: itemWidth ? itemWidth + 1 : rail.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const rail = weeklyPicksRailRef.current;

    if (!rail) {
      return undefined;
    }

    const updateWeeklyPicksScrollState = () => {
      const setWidth = rail.scrollWidth / 3;

      if (!setWidth) {
        return;
      }

      if (isWeeklyPicksAdjustingRef.current) {
        return;
      }

      const leftBoundary = setWidth * 0.5;
      const rightBoundary = setWidth * 1.5;

      if (rail.scrollLeft < leftBoundary) {
        isWeeklyPicksAdjustingRef.current = true;
        rail.scrollLeft += setWidth;
        requestAnimationFrame(() => {
          isWeeklyPicksAdjustingRef.current = false;
        });
      } else if (rail.scrollLeft > rightBoundary) {
        isWeeklyPicksAdjustingRef.current = true;
        rail.scrollLeft -= setWidth;
        requestAnimationFrame(() => {
          isWeeklyPicksAdjustingRef.current = false;
        });
      }
    };

    updateWeeklyPicksScrollState();
    rail.addEventListener("scroll", updateWeeklyPicksScrollState, {
      passive: true,
    });
    window.addEventListener("resize", updateWeeklyPicksScrollState);

    return () => {
      rail.removeEventListener("scroll", updateWeeklyPicksScrollState);
      window.removeEventListener("resize", updateWeeklyPicksScrollState);
    };
  }, []);

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Ahangama Guide to Perks & Discounts at the Best Local Spots"
        description="Ahangama guide to perks and discounts at the best cafés, stays, surf spots, and experiences—curated local favourites, unlocked with one pass."
        canonical={canonical}
        ogImage={heroImage}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "ahangama.com",
          url: canonical,
        }}
      />
      {/* DISCLAIMER CARD */}
      {/* <div
        className="dm-canvas"
        style={{ paddingTop: "16px", paddingBottom: "0" }}
      >
        <div className="dm-wrap">
          <Card
            style={{
              marginBottom: "24px",
              border: "2px solid var(--orange)",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #fff9f2 0%, #fff 100%)",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
            >
              <ExclamationCircleOutlined
                style={{
                  color: "var(--orange)",
                  fontSize: "24px",
                  marginTop: "2px",
                }}
              />
              <div style={{ flex: 1 }}>
                <Title
                  level={5}
                  style={{ margin: "0 0 8px 0", color: "var(--dm-ink)" }}
                >
                  Concept Site / Prototype
                </Title>
                <Text
                  style={{
                    color: "var(--ink-muted)",
                    fontSize: "14px",
                    display: "block",
                    marginBottom: "12px",
                  }}
                    <div style={featureTagRailStyle}>
                      <Tag style={featureTagStyle}>
                  pricing, and data shown are for testing purposes only and may
                  not reflect actual businesses or services.
                      <Tag style={featureTagStyle}>
                <Button
                  type="primary"
                      <Tag style={featureTagStyle}>
                  size="small"
                  style={{
                    </div>
                    borderColor: "#25D366",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                  onClick={() => {
                    window.open(
                      "https://wa.me/94777422274?text=Hi!%20I%20have%20concerns%20about%20the%20test%20data%20on%20your%20concept%20site.",
                      "_blank"
                    );
                  }}
                >
                  Have concerns? Contact us
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div> */}
      {/* HERO */}
      <div
        className="dm-canvas"
        style={{
          marginTop: 0,
          paddingTop: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        <div className="dm-wrap">
          <div>
            <div
              className="ahg-hero"
              style={{
                width: "100vw",
                marginLeft: "calc(50% - 50vw)",
                marginRight: "calc(50% - 50vw)",
                borderRadius: 0,
                background: "#FFFFFF",
                boxShadow: "none",
              }}
            >
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  minHeight: "100svh",
                }}
              >
                <div
                  aria-hidden="true"
                  className="home-hero-media-layer"
                  style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="home-hero-overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, rgba(10,14,18,0.82) 0%, rgba(10,14,18,0.74) 20%, rgba(10,14,18,0.5) 38%, rgba(10,14,18,0.2) 56%, rgba(10,14,18,0.04) 74%, rgba(10,14,18,0) 100%)",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  />
                  <img
                    className="home-hero-image"
                    src={heroImage}
                    alt="Ahangama guide editorial hero"
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 1,
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "right 72%",
                    }}
                  />
                </div>

                <div
                  style={{
                    position: "relative",
                    zIndex: 3,
                    width: "100%",
                    maxWidth: 1100,
                    margin: "0 auto",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      minHeight: "100svh",
                      maxWidth: 620,
                      padding:
                        "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 36px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 12,
                        marginBottom: 18,
                      }}
                    >
                      {[`Week ${currentWeekNumber}`, "Updated Weekly"].map(
                        (item) => (
                          <Text
                            key={item}
                            style={{
                              color: "#FFFFFF",
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: 1.6,
                              textTransform: "uppercase",
                            }}
                          >
                            {item}
                          </Text>
                        ),
                      )}
                    </div>

                    <Title
                      className="home-hero-title"
                      style={{
                        margin: 0,
                        color: "#FFFFFF",
                        fontWeight: 500,
                        fontFamily:
                          '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                      }}
                    >
                      <span
                        className="home-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        This Week In
                      </span>
                      <span
                        className="home-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        Ahangama
                      </span>
                    </Title>

                    <Text
                      style={{
                        ...editorialEyebrowStyle,
                        color: "#FFFFFF",
                      }}
                    >
                      From the Editor
                    </Text>

                    <Paragraph
                      style={{
                        marginTop: 24,
                        marginBottom: 22,
                        maxWidth: 520,
                        color: "#FFFFFF",
                        fontSize: "clamp(16px, 1.45vw, 19px)",
                        lineHeight: 1.72,
                      }}
                    >
                      A curated guide to cafes, stays, wellness, surf, food and
                      local experiences across Ahangama. Written and updated by
                      a local team who live here.
                    </Paragraph>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(0, 220px)",
                        gap: 24,
                        maxWidth: 560,
                      }}
                    >
                      <div>
                        <Text
                          style={{
                            ...editorialEyebrowStyle,
                            color: "#FFFFFF",
                          }}
                        >
                          Member Benefits
                        </Text>
                        <a
                          href={passCtaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            trackPassCtaClick({
                              ctaLocation: "hero_text_link",
                              destinationUrl: passCtaUrl,
                            });
                          }}
                          style={{
                            color: "#FFFFFF",
                            textDecoration: "none",
                            fontSize: 16,
                            fontWeight: 600,
                            lineHeight: 1.55,
                          }}
                        >
                          Get the Ahangama Pass <ArrowRightOutlined />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="home-section-divider" aria-hidden="true" />

          <div style={{ marginTop: sectionSpacing }}>
            <div className="whats-on-board">
              <div className="whats-on-boardIntro">
                <Text className="whats-on-boardKicker">
                  What&apos;s On This Week
                </Text>
                <Text className="whats-on-boardLocation">
                  {thisWeekEventsLabel}
                </Text>
                <Paragraph className="whats-on-boardDescription">
                  A curated selection of things happening around town this week.
                </Paragraph>
                <a href="/events" className="whats-on-boardLink">
                  View full calendar <ArrowRightOutlined />
                </a>
              </div>

              <div className="whats-on-boardRailWrap">
                {canScrollWhatsOnLeft ? (
                  <button
                    type="button"
                    className="whats-on-boardArrow whats-on-boardArrow--left"
                    onClick={handleWhatsOnScrollLeft}
                    aria-label="Scroll events left"
                  >
                    <ArrowRightOutlined />
                  </button>
                ) : null}

                <div className="whats-on-boardRail" ref={whatsOnBoardRailRef}>
                  {thisWeekEvents.map((event) => (
                    <div
                      className="whats-on-boardItem"
                      key={`${event.title}-${event.date}`}
                    >
                      {event.image ? (
                        <div className="whats-on-boardImageWrap">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="whats-on-boardImage"
                          />
                        </div>
                      ) : null}
                      <Text className="whats-on-boardDate">{event.date}</Text>
                      <Title level={3} className="whats-on-boardTitle">
                        {event.title}
                      </Title>
                      <Text className="whats-on-boardVenue">{event.venue}</Text>
                      <div className="whats-on-boardMeta">
                        <span className="whats-on-boardMetaTime">
                          <ClockCircleOutlined />
                          <span>{event.time}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {canScrollWhatsOnRight ? (
                  <button
                    type="button"
                    className="whats-on-boardArrow whats-on-boardArrow--right"
                    onClick={handleWhatsOnScrollRight}
                    aria-label="Scroll events right"
                  >
                    <ArrowRightOutlined />
                  </button>
                ) : null}
              </div>

              <a
                href="/events"
                className="whats-on-boardLink whats-on-boardLink--mobile"
              >
                View full calendar <ArrowRightOutlined />
              </a>
            </div>

            <div className="home-section-divider" aria-hidden="true" />
          </div>

          <div style={{ marginTop: 20 }}>
            <div className="weekly-features-heading">
              <Text className="weekly-features-kicker">
                1. Editor&apos;s Picks
              </Text>
              <Paragraph className="weekly-features-description">
                A curated editorial shortlist for the week.
              </Paragraph>
            </div>

            <div
              className="home-section-divider home-section-divider--tight"
              aria-hidden="true"
            />

            <div className="weekly-features-grid">
              {THIS_WEEK_FEATURES.map((feature) => (
                <a
                  key={feature.title}
                  href={feature.href || "#"}
                  onClick={
                    feature.href ? undefined : (event) => event.preventDefault()
                  }
                  className="weekly-features-card"
                >
                  <div className="weekly-features-imageWrap">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="weekly-features-image"
                    />
                  </div>
                  <Text className="weekly-features-tag">
                    {feature.category}
                  </Text>
                  <Title level={3} className="weekly-features-title">
                    {feature.title}
                  </Title>
                </a>
              ))}
            </div>
          </div>

          {showWeeklyPicksSection ? (
            <div style={{ marginTop: 20 }}>
              <div
                className="home-section-divider home-section-divider--tight"
                aria-hidden="true"
              />

              <div className="weekly-picks-heading">
                <div className="weekly-picks-headingCopy">
                  <Text className="weekly-picks-kicker">2. Weekly Picks</Text>
                  <Paragraph className="weekly-picks-description">
                    What&apos;s worth your time this week.
                  </Paragraph>
                </div>
              </div>

              <div
                className="home-section-divider home-section-divider--tight"
                aria-hidden="true"
              />

              <div className="weekly-picks-railWrap">
                <div className="weekly-picks-grid" ref={weeklyPicksRailRef}>
                  {weeklyPicksLooped.map((pick, index) => (
                    <a
                      key={`${pick.title}-${index}`}
                      href={pick.href || "#"}
                      onClick={
                        pick.href
                          ? undefined
                          : (event) => event.preventDefault()
                      }
                      className={`weekly-picks-card${pick.image ? " weekly-picks-card--withImage" : ""}`}
                      style={
                        pick.image
                          ? {
                              "--weekly-picks-image": `url(${pick.image})`,
                            }
                          : undefined
                      }
                    >
                      <Text className="weekly-picks-tag">{pick.category}</Text>
                      <Title level={3} className="weekly-picks-title">
                        {pick.title}
                      </Title>
                    </a>
                  ))}
                </div>
              </div>

              <div className="home-section-divider" aria-hidden="true" />
            </div>
          ) : null}

          <div style={{ marginTop: 20 }}>
            <div className="guide-sections-heading">
              <Text className="guide-sections-kicker">3. Guide Sections</Text>
              <div className="guide-sections-headingRow">
                <Paragraph className="guide-sections-description">
                  Editorial guides for navigating Ahangama.
                </Paragraph>
                <a href="/blogs" className="guide-sections-link">
                  See All
                </a>
              </div>
            </div>

            <div
              className="home-section-divider home-section-divider--tight"
              aria-hidden="true"
            />

            <Row
              className="guide-sections-row"
              gutter={[18, 18]}
              align="stretch"
            >
              {MINIMAL_GUIDE_CARDS.map((guide, index) =>
                (() => {
                  const palette =
                    GUIDE_SECTION_PALETTE[index % GUIDE_SECTION_PALETTE.length];

                  return (
                    <Col
                      className="guide-sections-col"
                      key={guide.href}
                      xs={24}
                      md={12}
                      xl={6}
                    >
                      <a
                        className={`guide-sections-cardLink${index === 0 ? " guide-sections-cardLink--first" : ""}`}
                        href={guide.href}
                        style={{
                          display: "block",
                          height: "100%",
                          paddingLeft: index === 0 ? 0 : 18,
                          borderLeft:
                            index === 0
                              ? "none"
                              : "1px solid rgba(22,20,18,0.14)",
                          textDecoration: "none",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            borderRadius: 18,
                            padding: 16,
                            background: palette.card,
                            color: palette.ink,
                            border: "1px solid rgba(31,29,26,0.08)",
                            boxShadow: "0 8px 20px rgba(31,29,26,0.04)",
                          }}
                        >
                          <Text
                            style={{
                              display: "block",
                              paddingBottom: 6,
                              marginBottom: 10,
                              borderBottom: `1px solid ${palette.line}`,
                              color: palette.ink,
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: 1.5,
                              textTransform: "uppercase",
                            }}
                          >
                            {guide.label}
                          </Text>

                          <Title
                            level={3}
                            style={{
                              margin: "0 0 16px",
                              color: palette.ink,
                              fontSize: "clamp(22px, 1.9vw, 34px)",
                              lineHeight: 0.98,
                              letterSpacing: -0.8,
                            }}
                          >
                            {guide.title}
                          </Title>

                          <div
                            style={{
                              aspectRatio: "1 / 1.12",
                              overflow: "hidden",
                              background: palette.media,
                              border: "1px solid rgba(31,29,26,0.08)",
                            }}
                          >
                            <img
                              src={guide.image}
                              alt={guide.title}
                              style={{
                                display: "block",
                                width: "100%",
                                height: "100%",
                                objectFit:
                                  guide.href === "/what-is-ahangama-pass"
                                    ? "contain"
                                    : "cover",
                                objectPosition: "center",
                                background:
                                  guide.href === "/what-is-ahangama-pass"
                                    ? "rgba(255,255,255,0.9)"
                                    : "transparent",
                              }}
                            />
                          </div>
                        </div>
                      </a>
                    </Col>
                  );
                })(),
              )}
            </Row>

            <div className="home-section-divider" aria-hidden="true" />
          </div>

          <div style={{ marginTop: 20 }}>
            <div className="destination-categories-heading">
              <Text className="destination-categories-kicker">
                3. Categories
              </Text>
              <Paragraph className="destination-categories-description">
                Help visitors navigate the destination.
              </Paragraph>
            </div>

            <div
              className="home-section-divider home-section-divider--tight"
              aria-hidden="true"
            />

            <div className="destination-categories-grid">
              {destinationCategoryCards.map((category) => (
                <a
                  key={category.key}
                  href={category.href}
                  className={`destination-categories-card destination-categories-card--${category.key}`}
                  style={{
                    "--destination-category-tone": category.tone,
                  }}
                >
                  <div className="destination-categories-top">
                    <div className="destination-categories-headerLine">
                      <Text className="destination-categories-label">
                        {category.title} Guide
                      </Text>
                      <Text className="destination-categories-separator">
                        |
                      </Text>
                      <Text className="destination-categories-countInline">
                        {formatCategoryCount(category.count)}
                      </Text>
                    </div>
                    <span className="destination-categories-divider" />
                    <div className="destination-categories-titleRow">
                      <Text className="destination-categories-title">
                        {category.title}
                      </Text>
                    </div>
                  </div>
                  <div className="destination-categories-bottom">
                    <Text className="destination-categories-sublabels">
                      {category.sublabels}
                    </Text>
                    <Text className="destination-categories-cta">
                      Explore <ArrowRightOutlined />
                    </Text>
                  </div>
                </a>
              ))}
            </div>

            <div className="home-section-divider" aria-hidden="true" />
          </div>

          <div style={{ marginTop: 20 }}>
            <div className="itineraries-heading">
              <Text className="itineraries-kicker">4. Itineraries</Text>
              <Paragraph className="itineraries-description">
                Ready-made trip planning.
              </Paragraph>
            </div>

            <div className="itineraries-grid">
              {ITINERARY_FEATURES.map((item) => (
                <a
                  key={item.title}
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="itineraries-card"
                >
                  <div className="itineraries-imageWrap">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="itineraries-image"
                    />
                  </div>
                  <div className="itineraries-body">
                    <Text className="itineraries-date">{item.date}</Text>
                    <Title level={3} className="itineraries-title">
                      {item.title}
                    </Title>
                    <Text className="itineraries-tag">{item.category}</Text>
                  </div>
                </a>
              ))}
            </div>

            <div className="home-section-divider" aria-hidden="true" />
          </div>

          {showLatestStoriesSection ? (
            <div style={{ marginTop: 20 }}>
              <div className="latest-stories-heading">
                <Text className="latest-stories-kicker">6. Latest Stories</Text>
                <Paragraph className="latest-stories-description">
                  Publication heartbeat.
                </Paragraph>
              </div>

              <div
                className="home-section-divider home-section-divider--tight"
                aria-hidden="true"
              />

              <div className="latest-stories-grid">
                {LATEST_STORIES.map((story) => (
                  <a
                    key={`${story.title}-${story.date}`}
                    href="#"
                    onClick={(event) => event.preventDefault()}
                    className="latest-stories-card"
                  >
                    <Text className="latest-stories-tag">{story.category}</Text>
                    <Title level={3} className="latest-stories-title">
                      {story.title}
                    </Title>
                    <Text className="latest-stories-date">{story.date}</Text>
                  </a>
                ))}
              </div>

              <div className="home-section-divider" aria-hidden="true" />
            </div>
          ) : null}

          <div style={{ marginTop: 20 }}>
            <div className="around-town-heading">
              <div className="around-town-headingCopy">
                <Text className="around-town-kicker">5. Around the Town</Text>
                <Paragraph className="around-town-description">
                  What we&apos;re reading, following and loving around Ahangama.
                </Paragraph>
              </div>
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="around-town-link"
              >
                View all picks <ArrowRightOutlined />
              </a>
            </div>

            <div
              className="home-section-divider home-section-divider--tight"
              aria-hidden="true"
            />

            <div className="around-town-grid">
              {AROUND_TOWN_PICKS.map((pick) => (
                <a
                  key={pick.title}
                  href={pick.href}
                  className="around-town-card"
                  target={pick.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    pick.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  <div className="around-town-imageWrap">
                    <img
                      src={pick.image}
                      alt={pick.title}
                      className="around-town-image"
                    />
                  </div>
                  <div className="around-town-cardBody">
                    <Text className="around-town-tag">{pick.category}</Text>
                    <Title level={3} className="around-town-title">
                      {pick.title}
                    </Title>
                    <Paragraph className="around-town-copy">
                      {pick.description}
                    </Paragraph>
                    <Text className="around-town-cta">
                      {pick.cta} <ArrowRightOutlined />
                    </Text>
                  </div>
                </a>
              ))}
            </div>

            <div className="home-section-divider" aria-hidden="true" />
          </div>

          {showLegacyHomepageLowerSections ? (
            <div
              style={{
                marginTop: sectionSpacing,
              }}
            >
              <Row gutter={[24, 24]} align="stretch">
                <Col xs={24} xl={14}>
                  <div style={{ display: "grid", gap: 20, height: "100%" }}>
                    <Card
                      className="perfect-day-card"
                      style={{ ...editorialCardStyle, height: "100%" }}
                      bodyStyle={{ padding: 32, height: "100%" }}
                    >
                      <Row
                        className="perfect-day-row"
                        gutter={[28, 28]}
                        align="top"
                      >
                        <Col
                          xs={{ span: 12, order: 1 }}
                          xl={{ span: 10, order: 1 }}
                        >
                          <div
                            className="perfect-day-media"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 16,
                              maxWidth: 420,
                              margin: "0 auto",
                            }}
                          >
                            <div
                              className="perfect-day-tags"
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 10,
                              }}
                            >
                              {DENITSA_STORY_TAGS.map((item) => (
                                <Text
                                  key={item}
                                  style={{
                                    color: "#8B7B63",
                                    fontSize: 11,
                                    fontWeight: 700,
                                    letterSpacing: 1.5,
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {item}
                                </Text>
                              ))}
                            </div>

                            <div
                              className="perfect-day-hashtags"
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 10,
                              }}
                            >
                              {DENITSA_DAY_CHIPS.map((item) => (
                                <Text
                                  key={item}
                                  style={{
                                    color: "#8B7B63",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    lineHeight: 1.2,
                                  }}
                                >
                                  #{item}
                                </Text>
                              ))}
                            </div>
                          </div>
                        </Col>

                        <Col
                          xs={{ span: 12, order: 2 }}
                          xl={{ span: 14, order: 2 }}
                        >
                          <Title
                            level={2}
                            className="perfect-day-title"
                            style={{
                              ...editorialTitleStyle,
                              marginBottom: 10,
                              fontSize: "clamp(29px, 3vw, 41px)",
                              lineHeight: 0.94,
                            }}
                          >
                            Perfect Day in Ahangama
                          </Title>

                          <Paragraph
                            className="perfect-day-excerpt"
                            style={{
                              marginBottom: 12,
                              color: "#5F574E",
                              fontSize: 16,
                              lineHeight: 1.7,
                              maxWidth: 560,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            Pilates, surf, coffee, a slow afternoon and sunset
                            at Lighthouse. Denitsa shares how she would spend a
                            perfect day in Ahangama.
                          </Paragraph>

                          <div
                            className="perfect-day-chip-group"
                            style={{ marginBottom: 14 }}
                          >
                            <Text style={editorialEyebrowStyle}>
                              Places Featured
                            </Text>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 10,
                              }}
                            >
                              {denitsaFeaturedPlaces.map((item) => (
                                <a
                                  key={item.label}
                                  className="perfect-day-chip"
                                  href={item.mapUrl || undefined}
                                  target={item.mapUrl ? "_blank" : undefined}
                                  rel={
                                    item.mapUrl
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                  aria-label={
                                    item.mapUrl
                                      ? `Open ${item.label} in Google Maps`
                                      : item.label
                                  }
                                  style={{
                                    display: "inline-flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 8,
                                    color: "#2F2A24",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    lineHeight: 1,
                                    textDecoration: "none",
                                    cursor: item.mapUrl ? "pointer" : "default",
                                  }}
                                >
                                  {item.logo ? (
                                    <img
                                      src={item.logo}
                                      alt=""
                                      aria-hidden="true"
                                      style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 999,
                                        objectFit: "cover",
                                        flex: "0 0 auto",
                                      }}
                                    />
                                  ) : null}
                                  <span
                                    style={{
                                      display: "inline-block",
                                      paddingBottom: 2,
                                      borderBottom:
                                        "1px solid rgba(47,42,36,0.42)",
                                      fontSize: 12,
                                      letterSpacing: 0.08,
                                    }}
                                  >
                                    {item.label}
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>

                          <div
                            className="perfect-day-cta"
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <a
                              href="/blogs/Perfect-Day-in-Ahangama"
                              style={{
                                color: "#2F3E3A",
                                textDecoration: "none",
                                fontSize: 16,
                                fontWeight: 600,
                                letterSpacing: 0.1,
                              }}
                            >
                              Read Story <ArrowRightOutlined />
                            </a>
                          </div>
                        </Col>
                      </Row>
                    </Card>

                    <Card
                      className="getting-around-card"
                      style={editorialCardStyle}
                      bodyStyle={{ padding: 24 }}
                    >
                      <Text style={editorialEyebrowStyle}>Getting Around</Text>
                      <Title
                        level={3}
                        className="getting-around-title"
                        style={{
                          ...editorialTitleStyle,
                          marginBottom: 18,
                          fontSize: "clamp(26px, 2vw, 33px)",
                          lineHeight: 1.02,
                          maxWidth: 320,
                        }}
                      >
                        Simple transport options and local costs.
                      </Title>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 6,
                          marginBottom: 12,
                        }}
                      >
                        {TRANSPORT_CURRENCIES.map((currency) => {
                          const isActive = transportCurrency === currency;

                          return (
                            <Button
                              key={currency}
                              size="small"
                              type="text"
                              onClick={() => setTransportCurrency(currency)}
                              style={{
                                height: 26,
                                paddingInline: 8,
                                borderRadius: 999,
                                border: isActive
                                  ? "1px solid rgba(47,62,58,0.18)"
                                  : "1px solid transparent",
                                background: isActive
                                  ? "rgba(47,62,58,0.06)"
                                  : "transparent",
                                color: isActive ? "#2F3E3A" : "#8B7B63",
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: 0.8,
                                boxShadow: "none",
                              }}
                            >
                              {currency}
                            </Button>
                          );
                        })}
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gap: 0,
                          marginBottom: 22,
                        }}
                      >
                        {GETTING_AROUND_PREVIEW.map((item, index) => (
                          <div
                            key={item.label}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "minmax(0, 1fr) auto",
                              gap: 16,
                              alignItems: "center",
                              padding: "14px 0",
                              borderTop:
                                index === 0
                                  ? "1px solid rgba(32,30,27,0.08)"
                                  : "none",
                              borderBottom: "1px solid rgba(32,30,27,0.08)",
                            }}
                          >
                            <Text
                              style={{
                                color: "#2F2A24",
                                fontSize: 15,
                                fontWeight: 600,
                                lineHeight: 1.35,
                              }}
                            >
                              {item.label}
                            </Text>
                            <Text
                              style={{
                                color: "#5F574E",
                                fontSize: 14,
                                fontWeight: 500,
                                lineHeight: 1.35,
                                textAlign: "right",
                              }}
                            >
                              {formatTransportRange(item, transportCurrency)}
                            </Text>
                          </div>
                        ))}
                      </div>

                      <a
                        href="/getting-around-ahangama-scooters-tuk-tuks-airport-transfers"
                        style={{
                          color: "#2F3E3A",
                          textDecoration: "none",
                          fontSize: 16,
                          fontWeight: 600,
                          letterSpacing: 0.1,
                        }}
                      >
                        View Transport Guide <ArrowRightOutlined />
                      </a>
                    </Card>
                  </div>
                </Col>

                <Col xs={24} xl={10}>
                  <div style={{ display: "grid", gap: 20, height: "100%" }}>
                    <Card
                      className="three-days-card"
                      style={editorialCardStyle}
                      bodyStyle={{ padding: 24 }}
                    >
                      <Row gutter={[18, 18]} align="middle">
                        <Col xs={10} sm={9}>
                          <div
                            className="three-days-media"
                            style={{
                              minHeight: 136,
                              borderRadius: 18,
                              backgroundImage:
                                "linear-gradient(180deg, rgba(18,25,24,0.04) 0%, rgba(18,25,24,0.12) 100%), url(https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/pura_pilates.jpeg)",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              border: "1px solid rgba(32,30,27,0.08)",
                            }}
                          />
                        </Col>
                        <Col xs={14} sm={15}>
                          <Text style={editorialEyebrowStyle}>
                            3 Days in Ahangama
                          </Text>
                          <Title
                            level={3}
                            className="three-days-title"
                            style={{
                              ...editorialTitleStyle,
                              marginBottom: 10,
                              fontSize: "clamp(28px, 2.2vw, 36px)",
                              lineHeight: 0.96,
                            }}
                          >
                            My Wellness Stay at Samba
                          </Title>
                          <Paragraph
                            className="three-days-excerpt"
                            style={{
                              marginBottom: 14,
                              color: "#5F574E",
                              fontSize: 16,
                              lineHeight: 1.7,
                            }}
                          >
                            A slow three-day itinerary for rest, movement and
                            good food.
                          </Paragraph>
                          <a
                            href="/3-days-in-ahangama"
                            style={{
                              color: "#2F3E3A",
                              textDecoration: "none",
                              fontSize: 16,
                              fontWeight: 600,
                              letterSpacing: 0.1,
                            }}
                          >
                            Read Itinerary <ArrowRightOutlined />
                          </a>
                        </Col>
                      </Row>
                    </Card>

                    <Card
                      className="twelve-things-card"
                      style={editorialCardStyle}
                      bodyStyle={{ padding: 24 }}
                    >
                      <Row gutter={[18, 18]} align="middle">
                        <Col xs={10} sm={9}>
                          <div
                            className="twelve-things-mosaic"
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                              gap: 6,
                            }}
                          >
                            {twelveThingsMosaic.map((item) => (
                              <a
                                key={item.slug}
                                href="/12-things"
                                title={item.name}
                                aria-label={`Open 12 Things guide from ${item.name}`}
                                style={{
                                  display: "block",
                                  aspectRatio: "1 / 1",
                                  borderRadius: 10,
                                  backgroundImage: `linear-gradient(180deg, rgba(18,25,24,0.04) 0%, rgba(18,25,24,0.18) 100%), url(${item.image})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  textDecoration: "none",
                                  boxShadow:
                                    "inset 0 0 0 1px rgba(255,255,255,0.12)",
                                }}
                              />
                            ))}
                          </div>
                        </Col>
                        <Col xs={14} sm={15}>
                          <Text style={editorialEyebrowStyle}>Guide</Text>
                          <Title
                            level={3}
                            className="twelve-things-title"
                            style={{
                              ...editorialTitleStyle,
                              marginBottom: 10,
                              fontSize: "clamp(28px, 2.2vw, 36px)",
                              lineHeight: 0.96,
                            }}
                          >
                            12 Things to Do in Ahangama
                          </Title>
                          <Paragraph
                            className="twelve-things-excerpt"
                            style={{
                              marginBottom: 14,
                              color: "#5F574E",
                              fontSize: 16,
                              lineHeight: 1.7,
                            }}
                          >
                            Experiences, activities and local favourites.
                          </Paragraph>
                          <a
                            href="/12-things"
                            style={{
                              color: "#2F3E3A",
                              textDecoration: "none",
                              fontSize: 16,
                              fontWeight: 600,
                              letterSpacing: 0.1,
                            }}
                          >
                            Explore Guide <ArrowRightOutlined />
                          </a>
                        </Col>
                      </Row>
                    </Card>

                    <Card
                      className="pass-guide-card"
                      style={editorialCardStyle}
                      bodyStyle={{ padding: 24 }}
                    >
                      <Row gutter={[18, 18]} align="middle">
                        <Col xs={10} sm={9}>
                          <div
                            className="pass-guide-media"
                            style={{
                              minHeight: 146,
                              borderRadius: 18,
                              border: "1px solid rgba(32,30,27,0.08)",
                              background: "#FFFFFF",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: 14,
                            }}
                          >
                            <img
                              src={heroPassAppleWallet}
                              alt="Ahangama Pass displayed in an iPhone with Apple Wallet and Google Wallet"
                              style={{
                                display: "block",
                                maxWidth: "100%",
                                maxHeight: 130,
                                width: "auto",
                                height: "auto",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        </Col>
                        <Col xs={14} sm={15}>
                          <Text style={editorialEyebrowStyle}>
                            Ahangama Pass
                          </Text>
                          <Title
                            level={3}
                            className="pass-guide-title"
                            style={{
                              ...editorialTitleStyle,
                              marginBottom: 10,
                              fontSize: "clamp(28px, 2.2vw, 36px)",
                              lineHeight: 0.96,
                            }}
                          >
                            What is the Ahangama Pass?
                          </Title>
                          <Paragraph
                            className="pass-guide-excerpt"
                            style={{
                              marginBottom: 14,
                              color: "#5F574E",
                              fontSize: 16,
                              lineHeight: 1.7,
                            }}
                          >
                            Unlock perks across 100+ local places.
                          </Paragraph>
                          <a
                            href="/what-is-ahangama-pass"
                            style={{
                              color: "#2F3E3A",
                              textDecoration: "none",
                              fontSize: 16,
                              fontWeight: 600,
                              letterSpacing: 0.1,
                            }}
                          >
                            Learn More <ArrowRightOutlined />
                          </a>
                        </Col>
                      </Row>
                    </Card>

                    <Card
                      className="mukti-story-card"
                      style={editorialCardStyle}
                      bodyStyle={{ padding: 24 }}
                    >
                      <Row gutter={[18, 18]} align="middle">
                        <Col xs={24}>
                          <Text style={editorialEyebrowStyle}>New Story</Text>
                          <Title
                            level={3}
                            style={{
                              ...editorialTitleStyle,
                              marginBottom: 10,
                              fontSize: "clamp(24px, 2vw, 31px)",
                              lineHeight: 0.98,
                            }}
                          >
                            Mukti Studio and the New Face of Ahangama
                          </Title>
                          <Paragraph
                            style={{
                              marginBottom: 14,
                              color: "#5F574E",
                              fontSize: 15,
                              lineHeight: 1.7,
                            }}
                          >
                            A profile of one of the town's most thoughtful new
                            creative businesses and the community around it.
                          </Paragraph>
                          <a
                            href="/blogs/mukti-studio-and-the-new-face-of-ahangama"
                            style={{
                              color: "#2F3E3A",
                              textDecoration: "none",
                              fontSize: 16,
                              fontWeight: 600,
                              letterSpacing: 0.1,
                            }}
                          >
                            Read Story <ArrowRightOutlined />
                          </a>
                        </Col>
                      </Row>
                    </Card>
                  </div>
                </Col>
              </Row>
            </div>
          ) : null}

          <div style={{ marginTop: 20 }}>
            <Row className="guide-cards-row" gutter={[24, 24]} align="stretch">
              <Col xs={24} lg={12} style={{ display: "none" }}>
                <Card
                  className="pass-guide-card"
                  style={{ ...editorialCardStyle, height: "100%" }}
                  bodyStyle={{ padding: 30, height: "100%" }}
                >
                  <Text style={editorialEyebrowStyle}>Field Guide</Text>
                  <div style={featureTagRailStyle}>
                    <Tag style={featureTagStyle}>Pass Guide</Tag>
                    <Tag style={featureTagStyle}>Wallet Ready</Tag>
                    <Tag style={featureTagStyle}>Savings + Perks</Tag>
                  </div>

                  <Row
                    className="pass-guide-row"
                    gutter={[18, 18]}
                    align="middle"
                  >
                    <Col xs={14} xl={15}>
                      <Title
                        level={3}
                        className="pass-guide-title"
                        style={{ ...editorialTitleStyle, fontSize: 38 }}
                      >
                        What is the Ahangama Pass?
                      </Title>

                      <Paragraph
                        className="pass-guide-excerpt"
                        style={{
                          ...editorialCopyStyle,
                          fontSize: 15,
                          maxWidth: 700,
                        }}
                      >
                        A simple local access pass you keep in Apple Wallet or
                        Google Wallet for partner perks, curated
                        recommendations, and extras that can add up fast,
                        including tea tins, postcards, and member savings across
                        Ahangama.
                      </Paragraph>

                      <a
                        href="/what-is-ahangama-pass"
                        style={{
                          color: "#2F3E3A",
                          textDecoration: "none",
                          fontSize: 16,
                          fontWeight: 600,
                          letterSpacing: 0.1,
                        }}
                      >
                        Tell me more <ArrowRightOutlined />
                      </a>
                    </Col>

                    <Col xs={10} xl={9}>
                      <div
                        className="pass-guide-media"
                        style={{
                          minHeight: 240,
                          borderRadius: 24,
                          border: "1px solid rgba(32,30,27,0.08)",
                          background: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 18,
                        }}
                      >
                        <img
                          src={heroPassAppleWallet}
                          alt="Ahangama Pass displayed in an iPhone with Apple Wallet and Google Wallet"
                          style={{
                            display: "block",
                            maxWidth: "100%",
                            maxHeight: 210,
                            width: "auto",
                            height: "auto",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col xs={24} lg={12} style={{ display: "none" }}>
                <Card
                  className="twelve-things-card"
                  style={{ ...editorialCardStyle, height: "100%" }}
                  bodyStyle={{ padding: 32, height: "100%" }}
                >
                  <Row
                    className="twelve-things-row"
                    gutter={[28, 28]}
                    align="middle"
                  >
                    <Col
                      xs={{ span: 12, order: 2 }}
                      xl={{ span: 14, order: 1 }}
                    >
                      <Title
                        level={2}
                        className="twelve-things-title"
                        style={{
                          ...editorialTitleStyle,
                          marginBottom: 14,
                          fontSize: "clamp(36px, 3.5vw, 54px)",
                          lineHeight: 0.96,
                        }}
                      >
                        12 Things to Do in Ahangama
                      </Title>

                      <div
                        className="twelve-things-meta"
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 10,
                          marginBottom: 18,
                        }}
                      >
                        {TWELVE_THINGS_GUIDE_META.map((item) => (
                          <Text
                            key={item}
                            style={{
                              color: "#8B7B63",
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: 1.5,
                              textTransform: "uppercase",
                            }}
                          >
                            {item}
                          </Text>
                        ))}
                      </div>

                      <div
                        className="twelve-things-excerpt"
                        style={{
                          maxWidth: 420,
                          marginBottom: 20,
                        }}
                      >
                        <Text style={editorialEyebrowStyle}>
                          Inside This Guide
                        </Text>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                            paddingTop: 14,
                            borderTop: "1px solid rgba(32,30,27,0.08)",
                          }}
                        >
                          {TWELVE_THINGS_GUIDE_PREVIEW.map((item, index) => (
                            <div
                              key={item}
                              style={{
                                display: "grid",
                                gridTemplateColumns: "32px minmax(0, 1fr)",
                                gap: 10,
                                alignItems: "baseline",
                              }}
                            >
                              <Text
                                style={{
                                  color: "#8B7B63",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  letterSpacing: 1.1,
                                }}
                              >
                                {String(index + 1).padStart(2, "0")}
                              </Text>
                              <Text
                                style={{
                                  color: "#2F2A24",
                                  fontSize: 16,
                                  lineHeight: 1.45,
                                }}
                              >
                                {item}
                              </Text>
                            </div>
                          ))}
                          <Text
                            style={{
                              paddingTop: 2,
                              color: "#8B7B63",
                              fontSize: 12,
                              fontWeight: 700,
                              letterSpacing: 1.2,
                              textTransform: "uppercase",
                            }}
                          >
                            + 8 More Experiences
                          </Text>
                        </div>
                      </div>

                      <div
                        className="twelve-things-cta"
                        style={{ marginTop: 28 }}
                      >
                        <a
                          href="/12-things"
                          style={{
                            color: "#2F3E3A",
                            textDecoration: "none",
                            fontSize: 16,
                            fontWeight: 600,
                            letterSpacing: 0.1,
                          }}
                        >
                          Explore All 12 Experiences <ArrowRightOutlined />
                        </a>
                      </div>
                    </Col>

                    <Col
                      xs={{ span: 12, order: 1 }}
                      xl={{ span: 10, order: 2 }}
                    >
                      <div
                        className="twelve-things-media"
                        style={{
                          minHeight: 300,
                          borderRadius: 26,
                          padding: 12,
                          background: "rgba(255,255,255,0.58)",
                          border: "1px solid rgba(32,30,27,0.08)",
                          boxShadow: "0 16px 34px rgba(32,30,27,0.06)",
                        }}
                      >
                        <div
                          className="twelve-things-mosaic"
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                            gap: 8,
                          }}
                        >
                          {twelveThingsMosaic.map((item) => (
                            <a
                              key={item.slug}
                              href="/12-things"
                              title={item.name}
                              aria-label={`Open 12 Things guide from ${item.name}`}
                              style={{
                                display: "block",
                                aspectRatio: "1 / 1",
                                borderRadius: 12,
                                backgroundImage: `linear-gradient(180deg, rgba(18,25,24,0.04) 0%, rgba(18,25,24,0.18) 100%), url(${item.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                textDecoration: "none",
                                boxShadow:
                                  "inset 0 0 0 1px rgba(255,255,255,0.12)",
                              }}
                            />
                          ))}
                        </div>
                        <Text
                          className="twelve-things-caption"
                          style={{
                            display: "block",
                            marginTop: 12,
                            color: "#8B7B63",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 1.2,
                            textTransform: "uppercase",
                          }}
                        >
                          Open any tile to enter the guide
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>

          {/* FREE GUIDE CTA */}
          <div style={{ marginTop: sectionSpacing }}>
            {/* Desktop version */}
            {/* <div className="desktop-only" style={{ display: "block" }}>
              <Card
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(0,0,0,0.06)",
                  background:
                    "linear-gradient(135deg, rgba(37,211,102,0.05) 0%, rgba(255,255,255,0.9) 100%)",
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Row gutter={[24, 16]} align="middle">
                  <Col xs={24} lg={14}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "12px",
                          background:
                            "linear-gradient(135deg, #25D366, #128C7E)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                        }}
                      >
                        📄
                      </div>
                      <div>
                        <Title
                          level={3}
                          style={{
                            margin: 0,
                            color: "#2F3349",
                            fontSize: "20px",
                          }}
                        >
                          Free Ahangama Guide
                        </Title>
                        <Text type="secondary" style={{ fontSize: "13px" }}>
                          Comprehensive guide
                        </Text>
                      </div>
                    </div>
                    <Paragraph
                      style={{
                        marginBottom: 0,
                        fontSize: "15px",
                        color: "#5A6C7D",
                        lineHeight: 1.6,
                      }}
                    >
                      Our favourite cafés, stays, wellness, and hidden
                      corners — with simple local context so you know where to
                      go, when, and why. Sent straight to WhatsApp for easy
                      access anytime.
                    </Paragraph>
                  </Col>

                  <Col xs={24} lg={10}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div style={{ marginBottom: "8px" }}>
                          <Text
                            strong
                            style={{ fontSize: "13px", color: "#2F3349" }}
                          >
                            Scan to get guide
                          </Text>
                        </div>
                        <div
                          style={{
                            padding: "12px",
                            background: "#fff",
                            borderRadius: "12px",
                            border: "2px solid rgba(37,211,102,0.2)",
                            boxShadow: "0 4px 12px rgba(37,211,102,0.15)",
                            display: "inline-block",
                          }}
                        >
                          <QRCode
                            value="https://wa.me/94777422274?text=please%20send%20me%20the%20Ahangama%20Guide"
                            size={90}
                            level="M"
                            fgColor="#2F3349"
                          />
                        </div>
                      </div>

                      <div style={{ textAlign: "center" }}>
                        <div style={{ marginBottom: "8px" }}>
                          <Text
                            strong
                            style={{ fontSize: "13px", color: "#2F3349" }}
                          >
                            Or click here
                          </Text>
                        </div>
                        <Button
                          type="primary"
                          size="large"
                          onClick={handleFreeGuideClick}
                          style={{
                            background:
                              "linear-gradient(135deg, #25D366, #128C7E)",
                            borderColor: "transparent",
                            borderRadius: "12px",
                            height: "48px",
                            padding: "0 20px",
                            fontWeight: "600",
                            boxShadow: "0 4px 12px rgba(37,211,102,0.25)",
                            border: "none",
                          }}
                          icon={
                            <span
                              style={{ fontSize: "16px", marginRight: "4px" }}
                            >
                              💬
                            </span>
                          }
                        >
                          WhatsApp Guide
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div> */}
            {/* Mobile version */}
            {/* <div className="mobile-only" style={{ display: "none" }}>
              <FreeGuideCtaMobile onGuideClick={handleFreeGuideClick} />
            </div> */}
          </div>

          <div style={{ marginTop: 24 }}>
            {/* Desktop version */}
            {/* <div className="desktop-only" style={{ display: "block" }}>
              <HomeMapSection />
            </div> */}
            {/* Mobile version */}
            {/* <div className="mobile-only" style={{ display: "none" }}>
              <HomeMapSectionMobile />
            </div> */}
          </div>

          {showLegacyHomepageLowerSections ? (
            <>
              <div style={{ marginTop: sectionSpacing - 8 }}>
                {loading ? (
                  <Card
                    style={{
                      borderRadius: 18,
                      border: "1px solid rgba(32,30,27,0.08)",
                      background:
                        "linear-gradient(180deg, rgba(251,248,242,0.96) 0%, rgba(247,243,236,0.96) 100%)",
                    }}
                    bodyStyle={{ padding: 32 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        minHeight: 180,
                      }}
                    >
                      <Spin size="large" />
                      <Text type="secondary">Loading venues...</Text>
                    </div>
                  </Card>
                ) : (
                  <>
                    <PassPartnersStrip destinationSlug="ahangama" />
                  </>
                )}
              </div>

              <div style={{ marginTop: sectionSpacing }}>
                <HomeGoogleMapSection />
              </div>
            </>
          ) : null}

          {/* CARD CTA */}
          <div style={{ marginTop: sectionSpacing - 8 }}>
            <Card
              className="ahg-cardCta"
              style={editorialCardStyle}
              bodyStyle={{ padding: 30 }}
            >
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={16}>
                  <Text style={editorialEyebrowStyle}>Member Access</Text>
                  <Title
                    level={3}
                    style={{
                      ...editorialTitleStyle,
                      marginBottom: 10,
                      fontSize: 38,
                    }}
                  >
                    The Ahangama Card
                  </Title>
                  <Paragraph
                    style={{
                      ...editorialCopyStyle,
                      marginBottom: 16,
                      fontSize: 15,
                    }}
                  >
                    Your key to local perks, member-only offers and experiences
                    across Ahangama.
                  </Paragraph>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={addToAppleWalletLogo}
                      alt="Add to Apple Wallet"
                      style={{
                        display: "block",
                        height: 40,
                        width: "auto",
                      }}
                    />
                    <img
                      src={addToGoogleWalletLogo}
                      alt="Add to Google Wallet"
                      style={{
                        display: "block",
                        height: 40,
                        width: "auto",
                      }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <Button
                    type="primary"
                    size="large"
                    block
                    href={passCtaUrl}
                    icon={<QrcodeOutlined />}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackPassCtaClick({
                        ctaLocation: "home_card_section",
                        destinationUrl: passCtaUrl,
                      });
                    }}
                    style={{ ...editorialPrimaryButtonStyle, width: "100%" }}
                  >
                    Get the Card
                  </Button>
                  {/* <Button style={{ marginTop: 10 }} block href="/card/my">
                    View my QR
                  </Button> */}
                </Col>
              </Row>
            </Card>
          </div>
        </div>{" "}
        {/* dm-wrap */}
      </div>{" "}
      {/* dm-canvas */}
    </SiteLayout>
  );
}
