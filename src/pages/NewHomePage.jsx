import React, { useState } from "react";
import { Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { PLACES } from "../data/places";
import "../styles/new-home-page.css";

const { Paragraph, Text, Title } = Typography;

export const NEW_HOME_PATH = "/new";

const HERO_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Hero-AhanagamaGuide-SriLanka.webp";

const LISTS = [
  {
    title: "Things Happening This Week",
    category: "Events / venues",
    recommendations: [
      "Sunset Sessions at The Lighthouse",
      "Ahangama Community Market",
      "Sunday at The Kip",
      "Live Music at Hotel de Uncles",
      "Open Decks at Cactus",
      "Surf Film Night",
      "Rooftop Sundowners",
      "Local Makers Pop-Up",
      "Saturday Social Club",
      "Full Moon Gathering",
    ],
  },
  {
    title: "Cafés We Love",
    category: "Cafés",
    recommendations: [
      "Black Honey",
      "Marshmellow Surf Café",
      "Cactus",
      "The Kip",
      "Café Ceylon",
      "Moochies",
      "Squeeze Me",
      "Veda Café",
      "Café Wave",
      "Living Room",
    ],
  },
  {
    title: "Restaurants We Love",
    category: "Restaurants",
    recommendations: [
      "The Kip",
      "Ceylon Sliders",
      "Abrazo",
      "Hakuna Matata",
      "Cactus",
      "Maria Bonita",
      "Smoke & Bitters",
      "Trax",
      "Gusto",
      "Hotel de Uncles",
    ],
  },
  {
    title: "Places for Breakfast",
    category: "Cafés / restaurants",
    recommendations: [
      "Black Honey",
      "The Kip",
      "Moochies",
      "Café Ceylon",
      "Squeeze Me",
      "Marshmellow",
      "Cactus",
      "Samba",
      "Café Wave",
      "Veda Café",
    ],
  },
  {
    title: "Places for Dinner",
    category: "Restaurants",
    recommendations: [
      "Abrazo",
      "The Kip",
      "Ceylon Sliders",
      "Maria Bonita",
      "Smoke & Bitters",
      "Trax",
      "Gusto",
      "Hotel de Uncles",
      "Hakuna Matata",
      "Cactus",
    ],
  },
  {
    title: "Places for Drinks",
    category: "Bars / restaurants",
    recommendations: [
      "Stairway Rooftop",
      "Smoke & Bitters",
      "Hotel de Uncles",
      "Trax",
      "Cactus",
      "The Lighthouse",
      "Ceylon Sliders",
      "The Kip",
      "Lamana",
      "Maria Bonita",
    ],
  },
  {
    title: "Hotels We Love",
    category: "Hotels",
    recommendations: [
      "The Kip",
      "PALM",
      "Kurulu Bay",
      "The Lighthouse",
      "Samba",
      "Trebartha East",
      "Mosvold Villa",
      "Harding Boutique Hotel",
      "Kabalana Hotel",
      "Hotel de Uncles",
    ],
  },
  {
    title: "Villas & Airbnbs We Love",
    category: "Villas / property managers",
    recommendations: [
      "Villa Mugatiya",
      "Ekuku Lake House",
      "Pebble",
      "Alma",
      "Villa Vador",
      "The Nuga House",
      "Kabalana House",
      "Meda Gedara",
      "Casa Tikiri",
      "South Point Villa",
    ],
  },
  {
    title: "Places for a Long Stay",
    category: "Villas / coliving",
    recommendations: [
      "Samba",
      "Focus Hub",
      "Mellow Hostel",
      "The Nuga House",
      "Villa Mugatiya",
      "Ekuku Lake House",
      "PALM",
      "Kabalana House",
      "Pebble",
      "Ceylon Sliders",
    ],
  },
  {
    title: "Things You Have to Do",
    category: "Experiences",
    recommendations: [
      "Surf Kabalana",
      "Swim at Secret Beach",
      "Climb the Lighthouse",
      "Visit Koggala Lake",
      "Take a Cooking Class",
      "See the Stilt Fishermen",
      "Explore Galle Fort",
      "Book an Ayurvedic Treatment",
      "Watch Sunset in Midigama",
      "Ride the Coastal Train",
    ],
  },
  {
    title: "Surf Schools & Camps",
    category: "Surf businesses",
    recommendations: [
      "Ticket to Ride",
      "Lapoint",
      "The Surfer",
      "Dreamsea",
      "Surf Spirit",
      "Kabalana Surf School",
      "Marshmellow Surf Camp",
      "Mellow Hostel",
      "Solid Surf House",
      "Ahangama Surf School",
    ],
  },
  {
    title: "Wellness Experiences",
    category: "Wellness businesses",
    recommendations: [
      "Kurulu Bay Ayurveda",
      "The Nuga House",
      "Makahiya",
      "PALM Wellness",
      "The Kip Spa",
      "Ahangama Yoga Shala",
      "Ice Bath Social",
      "Kabalana Breathwork",
      "Koggala Sound Healing",
      "Ocean Therapy",
    ],
  },
  {
    title: "Yoga & Movement Classes",
    category: "Studios / instructors",
    recommendations: [
      "Ahangama Yoga Shala",
      "The Nuga House",
      "PALM Studio",
      "Kurulu Bay Shala",
      "Makahiya Movement",
      "Samba Yoga",
      "Kabalana Beach Yoga",
      "Soul & Surf",
      "Southern Yoga Collective",
      "Sunset Pilates",
    ],
  },
  {
    title: "Massages & Treatments",
    category: "Spas / therapists",
    recommendations: [
      "Kurulu Bay Ayurveda",
      "The Kip Spa",
      "The Nuga House",
      "PALM Wellness",
      "Senses Spa",
      "Ahangama Ayurveda",
      "Kabalana Massage House",
      "Ocean Spa",
      "Secret Root Spa",
      "Southern Therapy Room",
    ],
  },
  {
    title: "Places for Sunset",
    category: "Beach clubs / restaurants",
    recommendations: [
      "Stairway Rooftop",
      "The Lighthouse",
      "Cactus",
      "Trax",
      "Ceylon Sliders",
      "Hotel de Uncles",
      "Marshmellow",
      "Kabalana Beach",
      "Midigama Right",
      "Secret Beach",
    ],
  },
  {
    title: "Places to Go Tonight",
    category: "Bars / events",
    recommendations: [
      "Hotel de Uncles",
      "Trax",
      "Lamana",
      "The Lighthouse",
      "Stairway Rooftop",
      "Cactus",
      "Smoke & Bitters",
      "Ceylon Sliders",
      "The Kip",
      "Ahangama Social Club",
    ],
  },
  {
    title: "Shops Worth Knowing",
    category: "Retail",
    recommendations: [
      "Living Room",
      "Gusta",
      "Mukti",
      "Coconut Republik",
      "Soko",
      "Animals",
      "Unsung",
      "Crave",
      "Folklore",
      "Daydream",
    ],
  },
  {
    title: "Places to Work From",
    category: "Cafés / coworking",
    recommendations: [
      "Focus Hub",
      "Samba",
      "Black Honey",
      "The Kip",
      "Moochies",
      "Café Ceylon",
      "Cactus",
      "Living Room",
      "Marshmellow",
      "Ceylon Sliders",
    ],
  },
  {
    title: "Places Locals Love",
    category: "Mixed",
    recommendations: [
      "Café Wave",
      "Hungry Puppet",
      "Veda Café",
      "Folklore",
      "Gusta",
      "Black Honey",
      "Secret Beach",
      "Koggala Lake",
      "Ahangama Market",
      "Midigama Left",
    ],
  },
  {
    title: "Day Trips from Ahangama",
    category: "Tours / transport",
    recommendations: [
      "Galle Fort",
      "Yala National Park",
      "Udawalawe",
      "Weligama Bay",
      "Mirissa Harbour",
      "Hiriketiya",
      "Sinharaja Forest",
      "Handunugoda Tea Estate",
      "Koggala Lake",
      "Matara Fort",
    ],
  },
  {
    title: "New Places to Know",
    category: "New openings",
    recommendations: [
      "Gusta",
      "Petals",
      "Living Room",
      "Makahiya",
      "Daydream",
      "Unsung",
      "Crave",
      "Focus Hub",
      "Coconut Republik",
      "Folklore",
    ],
  },
];

const LIST_SECTIONS = [
  {
    title: "What's On",
    description: "What is new, notable and worth making plans around right now.",
    listTitles: [
      "Things Happening This Week",
      "Places to Go Tonight",
      "New Places to Know",
    ],
  },
  {
    title: "Eat & Drink",
    description: "From first coffee to dinner, drinks and the best sunset tables.",
    listTitles: [
      "Cafés We Love",
      "Restaurants We Love",
      "Places for Breakfast",
      "Places for Dinner",
      "Places for Drinks",
      "Places for Sunset",
    ],
  },
  {
    title: "Stay",
    description: "Hotels, private villas and places designed for settling in longer.",
    listTitles: [
      "Hotels We Love",
      "Villas & Airbnbs We Love",
      "Places for a Long Stay",
    ],
  },
  {
    title: "Surf & Wellness",
    description: "Ways to move, recover and feel better by the coast.",
    listTitles: [
      "Surf Schools & Camps",
      "Wellness Experiences",
      "Yoga & Movement Classes",
      "Massages & Treatments",
    ],
  },
  {
    title: "Explore & Live",
    description: "Local favourites, useful places and reasons to venture further.",
    listTitles: [
      "Things You Have to Do",
      "Places Locals Love",
      "Day Trips from Ahangama",
      "Shops Worth Knowing",
      "Places to Work From",
    ],
  },
];

const LISTS_BY_TITLE = new Map(LISTS.map((list) => [list.title, list]));
const ORDERED_LISTS = LIST_SECTIONS.flatMap((section) =>
  section.listTitles.map((title) => LISTS_BY_TITLE.get(title)),
);

const PLACE_NAME_ALIASES = {
  abrazo: "abrazo ahangama",
  alma: "pebble alma",
  "black honey": "black honey cafe",
  folklore: "folklore ahangama",
  "living room": "living room concept store",
  marshmellow: "marshmellow surf cafe",
  palm: "palm hotel",
  pebble: "pebble alma",
  "the lighthouse": "lighthouse",
};

function normalizePlaceName(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const PLACES_BY_NAME = new Map(
  PLACES.filter((place) => place.destinationSlug === "ahangama").map((place) => [
    normalizePlaceName(place.name),
    place,
  ]),
);

function findRecommendationPlace(recommendation) {
  const normalizedName = normalizePlaceName(recommendation);
  return (
    PLACES_BY_NAME.get(normalizedName) ||
    PLACES_BY_NAME.get(PLACE_NAME_ALIASES[normalizedName]) ||
    null
  );
}

function buildEditorialDescription(place) {
  const source = String(place.description || place.excerpt || "")
    .replace(/\s+/g, " ")
    .trim();

  if (source.length <= 120) return source;

  const shortened = source.slice(0, 117).replace(/\s+\S*$/, "").trim();
  return `${shortened}...`;
}

function getInstagramUrl(place) {
  if (place.instagramUrl) return place.instagramUrl;
  if (!place.instagram) return null;
  return `https://www.instagram.com/${String(place.instagram).replace(/^@/, "")}/`;
}

function getDirectionsUrl(place) {
  if (place.mapUrl) return place.mapUrl;
  if (typeof place.lat !== "number" || typeof place.lng !== "number") return null;
  return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
}

function RecommendationList({ list, index }) {
  const [expanded, setExpanded] = useState(false);
  const [activeRecommendation, setActiveRecommendation] = useState(() => {
    const linkedRecommendations = list.recommendations
      .slice(0, 5)
      .filter((recommendation) => findRecommendationPlace(recommendation));

    return linkedRecommendations.length
      ? linkedRecommendations[Math.floor(Math.random() * linkedRecommendations.length)]
      : null;
  });
  const listId = `new-home-list-${index + 1}`;
  const visibleRecommendations = expanded
    ? list.recommendations
    : list.recommendations.slice(0, 5);

  return (
    <article className="new-home-list">
      <div className="new-home-list-meta">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{list.category}</span>
      </div>
      <Title level={3}>{list.title}</Title>
      <ol id={listId}>
        {visibleRecommendations.map((recommendation) => {
          const place = findRecommendationPlace(recommendation);
          const detailId = `${listId}-${normalizePlaceName(recommendation).replaceAll(" ", "-")}`;
          const isActive = activeRecommendation === recommendation;
          const instagramUrl = place ? getInstagramUrl(place) : null;
          const directionsUrl = place ? getDirectionsUrl(place) : null;

          return (
            <li className={place ? "is-linked" : undefined} key={recommendation}>
              {place ? (
                <>
                  <button
                    className="new-home-recommendation-trigger"
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={detailId}
                    onClick={() =>
                      setActiveRecommendation((current) =>
                        current === recommendation ? null : recommendation,
                      )
                    }
                  >
                    <span>{recommendation}</span>
                    <span aria-hidden="true">{isActive ? "−" : "+"}</span>
                  </button>
                  {isActive ? (
                    <div className="new-home-recommendation-detail" id={detailId}>
                      <p>{buildEditorialDescription(place)}</p>
                      <div>
                        {directionsUrl ? (
                          <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                            Google Maps
                          </a>
                        ) : null}
                        {instagramUrl ? (
                          <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                            Instagram
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                recommendation
              )}
            </li>
          );
        })}
      </ol>
      <button
        className="new-home-list-toggle"
        type="button"
        aria-expanded={expanded}
        aria-controls={listId}
        onClick={() => {
          setExpanded((current) => !current);
          setActiveRecommendation(null);
        }}
      >
        {expanded ? "Show fewer" : `View all ${list.recommendations.length}`}
      </button>
    </article>
  );
}

export default function NewHomePage() {
  const canonical = absUrl(NEW_HOME_PATH);

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="The Ultimate Guide to Ahangama"
        description="Twenty-one locally curated lists for eating, staying, surfing, shopping and exploring Ahangama."
        canonical={canonical}
        ogImage={HERO_IMAGE}
      />
      <main className="new-home-page">
        <header className="new-home-hero">
          <img src={HERO_IMAGE} alt="Ahangama coastline and palm trees" />
          <div className="new-home-hero-overlay" aria-hidden="true" />
          <div className="new-home-hero-content">
            <Text>Curated by Locals.</Text>
            <Title level={1}>
              <span>Ultimate guide to</span>
              <span>Ahangama</span>
            </Title>
            <Paragraph>
              The places worth knowing, from the people who live here.
            </Paragraph>
          </div>
        </header>

        <section
          className="new-home-lists"
          aria-labelledby="new-home-lists-title"
        >
          <div className="new-home-lists-intro">
            <Text>21 local lists</Text>
            <Title level={2} id="new-home-lists-title">
              Start with what you need.
            </Title>
            <Paragraph>
              Short, useful recommendations for this week, this trip, or
              tonight.
            </Paragraph>
          </div>

          <div className="new-home-list-sections">
            {LIST_SECTIONS.map((section, sectionIndex) => (
              <section className="new-home-list-section" key={section.title}>
                <header className="new-home-section-heading">
                  <Text>{String(sectionIndex + 1).padStart(2, "0")}</Text>
                  <Title level={2}>{section.title}</Title>
                  <Paragraph>{section.description}</Paragraph>
                </header>
                <div className="new-home-list-grid">
                  {section.listTitles.map((title) => {
                    const list = LISTS_BY_TITLE.get(title);
                    const listIndex = ORDERED_LISTS.indexOf(list);

                    return (
                      <RecommendationList
                        key={list.title}
                        list={list}
                        index={listIndex}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
