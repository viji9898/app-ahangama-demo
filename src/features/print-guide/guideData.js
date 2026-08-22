import { PLACES } from "../../data/places";

export const GUIDE_RATE_CARD = Object.freeze({
  quarterPage: 350,
  halfPage: 600,
  fullPage: 1000,
  premiumFullPage: 1250,
  sectionOpener: 1500,
  doublePageSpread: 1750,
  insideBackCover: 1750,
  insideFrontCover: 2000,
  backCover: 2500,
  sectionSponsor: 3000,
});

export const COMMERCIAL_LABELS = Object.freeze({
  quarterPage: "Quarter Page",
  halfPage: "Half Page",
  fullPage: "Full Page",
  premiumFullPage: "Premium Full Page",
  doublePageSpread: "Double Page Spread",
  sectionSponsor: "Section Sponsor",
  insideFrontCover: "Inside Front Cover",
  insideBackCover: "Inside Back Cover",
  backCover: "Back Cover",
});

export const COMMERCIAL_EQUIVALENTS = Object.freeze({
  quarterPage: 0.25,
  halfPage: 0.5,
  fullPage: 1,
  premiumFullPage: 1,
  doublePageSpread: 2,
  sectionSponsor: 1,
  insideFrontCover: 1,
  insideBackCover: 1,
  backCover: 1,
});

export const GUIDE_SECTIONS = Object.freeze({
  opening: { label: "Opening", color: "#d95236" },
  stay: { label: "Stay", color: "#2d6651" },
  "eat-drink": { label: "Eat & Drink", color: "#c45432" },
  surf: { label: "Beaches & Surf", color: "#28758a" },
  experiences: { label: "Experiences", color: "#866232" },
  wellness: { label: "Wellness", color: "#687e55" },
  shopping: { label: "Shopping & Local", color: "#a34d54" },
  editorial: { label: "Field Notes", color: "#4d5268" },
  essentials: { label: "Essentials", color: "#3e665f" },
  closing: { label: "Closing", color: "#222222" },
});

const GUIDE_IMAGES = [
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Hero-AhanagamaGuide-SriLanka.webp",
  "https://content.r9cdn.net/rimg/dimg/09/d4/c553223f-city-304822-172c638b4d6.jpg?crop=true&width=1366&height=768&xhint=1254&yhint=1207",
  "https://stokedsurfadventures.com/wp-content/uploads/2024/05/Gota-Dagua-sri-lanka-surf-camp-ahangama-learn-to-surf-coaching-kabalana-stoked-surf-adventures-14-copy.jpg",
  "https://bookinglayer-cdn.ams3.cdn.digitaloceanspaces.com/uploads/businesses/944/images/1440_6e0-1635949941.webp",
];

const SECTION_COPY = {
  stay: {
    headline: "Stay awhile",
    subheadline: "Small hotels, private villas and rooms with a sense of place.",
    body: "The best stays here understand the rhythm of the coast: early swims, long breakfasts and a shaded place to return to after the heat.",
  },
  "eat-drink": {
    headline: "Eat & Drink",
    subheadline: "Where to eat, drink and spend a long afternoon in Ahangama.",
    body: "A new generation of cooks sits alongside short eats, market fruit, family kitchens and the daily catch from the bay.",
  },
  surf: {
    headline: "Beaches & Surf",
    subheadline: "Reef breaks, quiet coves and the changing moods of the Indian Ocean.",
    body: "Read the water, respect the line-up and leave time to find the smaller beaches between the better-known breaks.",
  },
  experiences: {
    headline: "Beyond the beach",
    subheadline: "Lake mornings, village roads and a slower view of the south coast.",
    body: "The most memorable days often begin without a checklist. Follow the back roads, ask questions and stay for tea.",
  },
  wellness: {
    headline: "Wellness",
    subheadline: "Ancient practice, modern movement and room to reset.",
    body: "From Ayurveda and yoga to breathwork and ocean recovery, Ahangama makes looking after yourself feel refreshingly unforced.",
  },
  shopping: {
    headline: "Made & found here",
    subheadline: "Independent shops, useful objects and the people behind them.",
    body: "Look for natural fibres, small-batch food, local craft and pieces made to live well beyond a holiday.",
  },
};

const PAGE_PLAN = [
  ["opening", "cover", "CoverPage", "Ahangama Guide", "2026 / 27"],
  ["opening", "inside-cover", "InsideCoverAd", "Inside Front Cover", "A premium opening position"],
  ["opening", "welcome", "IntroductionPage", "Welcome to Ahangama", "A note from the people who live here"],
  ["opening", "how-to-use", "HowToUsePage", "Keep This With You", "This guide was designed to travel with you. Here's how to get the most from it."],
  ["opening", "area-glance", "AreaGlancePage", "Ahangama at a Glance", "Distances here are short. Don't be afraid to explore beyond the part of Ahangama you're staying in."],
  ["opening", "essential-map-left", "EssentialMapSpreadPage", "The Essential Ahangama Map", "Koggala to Midigama"],
  ["opening", "essential-map-right", "EssentialMapSpreadPage", "The Essential Ahangama Map", "Koggala to Midigama"],
  ["opening", "first-24-hours", "ItineraryPage", "Your First 24 Hours", "Just arrived? Don't overthink it. Here's how we'd spend your first day."],
  ["opening", "48-hours", "ItineraryPage", "Day Two", "48 Hours in Ahangama"],
  ["opening", "town-story", "TownStoryPage", "A Town in Motion", "Surf brought many travellers here. What they found was a place with much more going on beneath the surface."],
  ["opening", "ahangama-edit", "AhangamaEditPage", "20 Places We Love", "If you only bookmark one page, make it this one."],
  ["opening", "people-left", "PeopleSpreadPage", "People of Ahangama", "Four people helping shape this corner of the south coast."],
  ["opening", "people-right", "PeopleSpreadPage", "People of Ahangama", "The Local · The Maker · The Waterman · The New Generation"],
  ["opening", "opening-partner", "OpeningPartnerPage", "Ahangama Guide — Opening Partner", "A premium commercial space for our lead partner."],
  ["stay", "section-opener", "StayOpenerPage", "Stay", "Small hotels, private villas and rooms with a sense of place."],
  ["stay", "hotels-edit", "StayCollectionPage", "Hotels We Love", "Eight dependable addresses, from coast road classics to inland retreats."],
  ["stay", "boutique-hotels", "StayCollectionPage", "Boutique Hotels", "Eight smaller stays with a clear point of view."],
  ["stay", "villas-edit", "StayCollectionPage", "Villas We Love", "Eight private places for space, quiet and longer tables."],
  ["stay", "stay-finder", "StayFinderPage", "Find Your Stay", "Start with the kind of trip you want to have."],
  ["stay", "stay-neighbourhoods", "StayNeighbourhoodPage", "Where Should You Stay?", "Five neighbourhoods, five different ways to experience Ahangama."],
  ["stay", "stay-story", "StayStoryPage", "A Room With Rhythm", "Inside one particularly interesting stay."],
  ["stay", "full-page-ad", "FullPageAd", "Stay Partner", "A premium commercial position for a leading stay partner."],
  ["eat-drink", "section-opener", "EatDrinkOpenerPage", "Eat & Drink", "Where to eat, drink and spend a long afternoon."],
  ["eat-drink", "breakfast", "EatDrinkRecommendationsPage", "Breakfast", "Ten starts to the day, from early coffee to a table worth lingering over."],
  ["eat-drink", "coffee-cafes", "EatDrinkRecommendationsPage", "Coffee & Cafés", "Ten reliable stops for a flat white, a quick reset or a slow morning."],
  ["eat-drink", "lunch", "EatDrinkRecommendationsPage", "Lunch", "Ten places that reward an open afternoon."],
  ["eat-drink", "sri-lankan-food", "EatDrinkRecommendationsPage", "Sri Lankan Food", "Eight kitchens for rice, curry, spice and the flavours of home."],
  ["eat-drink", "dinner", "EatDrinkRecommendationsPage", "Dinner", "Ten tables for the main event."],
  ["eat-drink", "dinner-for-two", "EatDrinkRecommendationsPage", "Dinner for Two", "Eight intimate tables for an evening with fewer distractions."],
  ["eat-drink", "eat-well-for-less", "EatDrinkRecommendationsPage", "Eat Well for Less", "Ten good-value addresses for casual meals and quick bites."],
  ["eat-drink", "sunset-drinks", "EatDrinkRecommendationsPage", "Sunset Drinks", "Eight places to watch the light go and order another."],
  ["eat-drink", "after-dark", "EatDrinkRecommendationsPage", "After Dark", "Eight late addresses for music, drinks and a livelier table."],
  ["eat-drink", "food-culture", "FoodCulturePage", "The New Ahangama Table", "How local ingredients, new ideas and old knowledge are reshaping the way the town eats."],
  ["eat-drink", "full-page-ad", "FullPageAd", "Eat & Drink Partner", "A premium commercial position for a leading food and drink partner."],
  ["surf", "section-opener", "SurfOpenerPage", "Beach & Surf", "Swim, surf and find your place along the coast."],
  ["surf", "beach-comparison", "BeachComparisonPage", "Which Beach Today?", "Compare the coast by swimming, surfing, beginners, families, food, sunset and atmosphere."],
  ["surf", "beaches-edit", "BeachesWeLovePage", "Beaches We Love", "Six stretches of coast, each with a different reason to stop."],
  ["surf", "surf-guide", "SurfAhangamaPage", "Surf Ahangama", "Breaks, levels, tides, season and the basics of sharing the water well."],
  ["surf", "surf-services", "SurfServicesPage", "Surf Schools, Coaches & Board Hire", "Eight useful contacts for learning, improving and finding the right equipment."],
  ["surf", "dawn-patrol", "DawnPatrolPage", "Dawn Patrol", "A photography-led study of the coast before the day begins."],
  ["surf", "full-page-ad", "FullPageAd", "Surf Partner", "A premium commercial position for a leading surf partner."],
  ["experiences", "section-opener", "ExperienceOpenerPage", "Experience Ahangama", "The best days begin beyond the main road."],
  ["experiences", "things-to-do", "ThingsToDoPage", "10 Things You Should Do in Ahangama", "A first list for curious days on the south coast."],
  ["experiences", "beyond-beach", "BeyondBeachPage", "Beyond the Beach", "Nature · Culture · Cooking · Lakes · Wildlife"],
  ["experiences", "half-day-trips", "HalfDayTripsPage", "Half-Day Trips", "Koggala · Galle · Weligama · Inland"],
  ["experiences", "whole-day", "WholeDayPage", "If You Have a Whole Day", "Three routes for seeing more without rushing through it."],
  ["experiences", "your-way", "ExperienceYourWayPage", "Ahangama Your Way", "Couples · Kids · Groups · Solo travellers"],
  ["experiences", "inland-feature", "InlandFeaturePage", "Beyond the Main Road", "An editorial journey into inland Ahangama."],
  ["wellness", "partial-ad", "HalfPageEditorialAd", "Reset by the sea", "Editorial above, partner space below"],
  ["shopping", "section-opener", "SectionOpener", "Shopping & Local", "Independent shops and useful things made here"],
  ["shopping", "venue-grid", "VenueGrid", "The independent edit", "Objects, clothes and provisions"],
  ["shopping", "venue-feature", "VenueFeature", "Made with intention", "Meet a local creative business"],
  ["shopping", "venue-list", "VenueList", "Take something home", "A concise local directory"],
  ["editorial", "editorial-feature", "EditorialFeature", "The new old town", "How Ahangama is changing without losing itself"],
  ["editorial", "premium-ad", "FullPageAd", "Ahangama, presented by", "A premium full-page position"],
  ["editorial", "photo-essay", "PhotoEssay", "People of the coast", "Six portraits, six ways of living here"],
  ["editorial", "editorial-feature", "EditorialFeature", "Twenty-four hours", "A day assembled by locals"],
  ["essentials", "map", "MapPage", "Central Ahangama", "Food, shops and useful landmarks"],
  ["essentials", "map", "MapPage", "Kabalana & Kathaluwa", "Beach, lake and the inland road"],
  ["essentials", "essential-info", "EssentialInfoPage", "Useful numbers", "Health, safety, money and connectivity"],
  ["essentials", "essential-info", "EssentialInfoPage", "Travel better", "Local etiquette and low-impact choices"],
  ["closing", "directory", "DirectoryPage", "Keep exploring", "The complete directory and Ahangama.com"],
  ["closing", "inside-cover", "InsideCoverAd", "Inside Back Cover", "A premium closing position"],
  ["closing", "back-cover", "BackCoverAd", "Back Cover", "The final word"],
];

const COMMERCIAL_BY_PAGE = {
  2: ["insideFrontCover", "available", null],
  14: ["fullPage", "sold", "Trebartha East"],
  22: ["fullPage", "available", null],
  34: ["fullPage", "available", null],
  41: ["fullPage", "available", null],
  49: ["halfPage", "available", null],
  50: ["sectionSponsor", "available", null],
  55: ["premiumFullPage", "available", null],
  63: ["insideBackCover", "available", null],
  64: ["backCover", "sold", "Gusta"],
};

const OPENING_PARTNER_ARTWORK =
  "https://images.suitcasemag.com/wp-content/uploads/2025/03/18160116/Trebartha-Daisy-Wingate-Saul-9234-copy.jpeg";

const STAY_VENUES_BY_PAGE = {
  15: ["palm-hotel"],
  16: ["lighthouse", "palm-hotel", "the-hotel", "sama", "kurulu-bay", "mosvold-villa", "ayurveda-palm-garden-resort", "samba-stay-ahangama"],
  17: ["harding-boutique", "unu-boutique-hotel", "teal-ahangama", "merchant", "the-find", "pebble-alma", "mana", "the-benison-ahangama"],
  18: ["villa-mugatiya", "tea-tree-villa", "southpoint-villa", "villa-queen-fort", "younger-villas-resorts", "surf-villa", "kabalana-house-by-ceilao-villas", "ekuku-lake-house"],
  21: ["trebartha-east-the-roundhouse"],
};

const EAT_DRINK_VENUES_BY_PAGE = {
  23: ["citra-ahangama"],
  24: ["marshmellow-surf-cafe", "sisters-kabalana", "makai-cafe-ahangama", "rollingpin-bakery", "daily-dose-cafe", "lum-cafe", "veda-cafe", "coconut-republik", "maria-bonita-sri-lanka", "living"],
  25: ["cactus-ahangama", "the-kip", "kaffi-ag", "twin-fin-surf-x-coffee", "cafe-ceylon-ahangama", "daily-dose-cafe", "makai-cafe-ahangama", "sisters-kabalana", "lum-cafe", "unsung"],
  26: ["meori-ahangama", "jam-house-ahangama", "patels-ahangama", "tahini", "iluk-ahangama", "aliikai-ahangama", "citra-ahangama", "fruit-cafe-ahangama", "squeeze-me", "paradise-cove-midigama"],
  27: ["manoris-kitchen", "thilenis", "patels-ahangama", "citra-ahangama", "rice-and-spoon", "the-cinnamon-trails-ahangama", "kalage", "soko"],
  28: ["ceylon-sliders", "le-cafe-french-bistro-ahangama", "teddies-ahangama", "samba-ahangama", "moochies-ahangama", "jam-house-ahangama", "tahini", "iluk-ahangama", "donna-ahangama", "aliikai-ahangama"],
  29: ["le-cafe-french-bistro-ahangama", "follow-the-white-rabbit-ahangama", "iluk-ahangama", "aliikai-ahangama", "donna-ahangama", "mora-rooftop-lounge", "citra-ahangama", "meori-ahangama"],
  30: ["rollingpin-bakery", "sandwich-spot", "soko", "crave", "hungry-puppet", "hakuna-matata-ahangama", "cafe-ceylon-ahangama", "kaffi-ag", "chillinguito", "rice-and-spoon"],
  31: ["moochies-ahangama", "mora-rooftop-lounge", "follow-the-white-rabbit-ahangama", "samba-ahangama", "ceylon-sliders", "animals", "folklore-ahangama", "paradise-cove-midigama"],
  32: ["teddies-ahangama", "samba-ahangama", "ceylon-sliders", "moochies-ahangama", "animals", "folklore-ahangama", "mora-rooftop-lounge", "hakuna-matata-ahangama"],
  33: ["manoris-kitchen"],
};

const SURF_VENUES_BY_PAGE = {
  35: ["the-board-hut"],
  39: ["the-board-hut"],
  40: ["the-board-hut"],
};

const EXPERIENCE_VENUES_BY_PAGE = {
  42: ["kumbuk-community"],
  43: ["kumbuk-community", "palm-and-paint", "cristina-ailmentart-school", "aggala", "sarana-ahangama"],
  48: ["kumbuk-community"],
};

const CATEGORY_BY_SECTION = {
  stay: "stays",
  "eat-drink": "eat",
  surf: "surf",
  experiences: "Experiences",
  wellness: "wellness",
  shopping: "retail",
};

const placesBySection = Object.fromEntries(
  Object.entries(CATEGORY_BY_SECTION).map(([section, category]) => [
    section,
    PLACES.filter(
      (place) =>
        place.destinationSlug === "ahangama" && place.category === category,
    ),
  ]),
);

function getSectionPlaces(section, pageNumber) {
  const curatedSlugs = STAY_VENUES_BY_PAGE[pageNumber] || EAT_DRINK_VENUES_BY_PAGE[pageNumber] || SURF_VENUES_BY_PAGE[pageNumber] || EXPERIENCE_VENUES_BY_PAGE[pageNumber];
  if (curatedSlugs) {
    return curatedSlugs
      .map((slug) => PLACES.find((place) => place.slug === slug))
      .filter(Boolean);
  }
  const places = placesBySection[section] || [];
  if (!places.length) return [];
  const offset = pageNumber % places.length;
  return [...places.slice(offset), ...places.slice(0, offset)].slice(0, 6);
}

function getCommercial(pageNumber) {
  const position = COMMERCIAL_BY_PAGE[pageNumber];
  if (!position) {
    return {
      enabled: false,
      type: null,
      rate: 0,
      status: "editorial",
      partner: null,
      internalNotes: "",
    };
  }

  const [type, status, partner] = position;
  return {
    enabled: true,
    type,
    rate: GUIDE_RATE_CARD[type],
    status,
    partner,
    internalNotes: "Initial 2026/27 inventory allocation.",
  };
}

export const INITIAL_GUIDE_PAGES = PAGE_PLAN.map(
  ([section, pageType, template, headline, subheadline], index) => {
    const pageNumber = index + 1;
    const venues = getSectionPlaces(section, pageNumber);
    const sectionCopy = SECTION_COPY[section];
    const fallbackImage = GUIDE_IMAGES[index % GUIDE_IMAGES.length];

    return {
      pageNumber,
      section,
      pageType,
      template,
      content: {
        eyebrow: GUIDE_SECTIONS[section].label,
        headline,
        subheadline,
        body:
          sectionCopy?.body ||
          "A locally edited guide to the places, people and details that make Ahangama worth knowing slowly.",
        image:
          pageNumber === 14
            ? OPENING_PARTNER_ARTWORK
            : pageNumber === 35
              ? GUIDE_IMAGES[2]
              : pageNumber === 40
                ? GUIDE_IMAGES[3]
              : venues.find((venue) => venue.image)?.image || fallbackImage,
        secondaryImage:
          venues.find((venue) => venue.ogImage && venue.ogImage !== venue.image)
            ?.ogImage || GUIDE_IMAGES[(index + 1) % GUIDE_IMAGES.length],
        venueSlugs: venues.map((venue) => venue.slug),
        pullQuote:
          sectionCopy?.subheadline || "The south coast, selected with care.",
      },
      commercial: getCommercial(pageNumber),
    };
  },
);

export const GUIDE_PLACES_BY_SLUG = new Map(
  PLACES.filter((place) => place.destinationSlug === "ahangama").map((place) => [
    place.slug,
    place,
  ]),
);