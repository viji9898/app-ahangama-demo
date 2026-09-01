import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  EnvironmentOutlined,
  InstagramOutlined,
  RightOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Drawer } from "antd";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import {
  GUIDE_PLACES_BY_SLUG,
  GUIDE_SECTIONS,
  INITIAL_GUIDE_PAGES,
} from "../features/print-guide/guideData";
import {
  GUIDE_AREAS,
  GUIDE_EDIT_PLACES,
  GUIDE_ITINERARIES,
  GUIDE_KEY_ITEMS,
  GUIDE_TOWN_STORY_CHAPTERS,
} from "../features/print-guide/openingGuideData";
import SiteLayout from "../components/layout/SiteLayout";
import "../styles/print-guide-online.css";

export const PRINT_GUIDE_ONLINE_PATH = "/print-guide-online";

const GUIDE_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Hero-AhanagamaGuide-SriLanka.webp";
const GUIDE_MAP_CENTER = [5.973, 80.3628];
const GUIDE_MAP_BOUNDS = {
  south: 5.93,
  west: 80.3,
  north: 6.04,
  east: 80.42,
};

const SECTION_ORDER = [
  "stay",
  "eat-drink",
  "surf",
  "experiences",
  "wellness",
  "shopping",
  "born",
  "essentials",
];

const ONLINE_SECTIONS = SECTION_ORDER.map((key) => {
  const pages = INITIAL_GUIDE_PAGES.filter((page) => page.section === key);
  const opener = pages.find((page) => /Opener/.test(page.template)) || pages[0];
  const venueGroups = pages
    .filter(
      (page) =>
        page.pageType !== "section-opener" &&
        !page.commercial.enabled &&
        page.content.venueSlugs?.length,
    )
    .map((page) => ({
      key: page.pageType,
      headline: page.content.headline,
      subheadline: page.content.subheadline,
      venues: page.content.venueSlugs
        .map((slug) => GUIDE_PLACES_BY_SLUG.get(slug))
        .filter(Boolean),
    }))
    .filter((group) => group.venues.length);
  const venueCount = new Set(
    venueGroups.flatMap((group) => group.venues.map((venue) => venue.slug)),
  ).size;

  return {
    key,
    label: GUIDE_SECTIONS[key]?.label || key,
    color: GUIDE_SECTIONS[key]?.color || "#315847",
    headline: opener?.content.headline,
    subheadline: opener?.content.subheadline,
    body: opener?.content.body,
    image: opener?.content.image || GUIDE_IMAGE,
    venueGroups,
    venueCount,
  };
});

const OPENING_PAGES = new Map(
  INITIAL_GUIDE_PAGES.filter(
    ({ pageNumber }) => pageNumber >= 3 && pageNumber <= 11,
  ).map((page) => [page.pageNumber, page]),
);

const GUIDE_PLACES_BY_NAME = new Map(
  [...GUIDE_PLACES_BY_SLUG.values()].map((venue) => [
    venue.name.toLowerCase(),
    venue,
  ]),
);

const GUIDE_EDIT_VENUE_ALIASES = {
  abrazo: "abrazo-ahangama",
  marshmellow: "marshmellow-surf-cafe",
};

const GUIDE_EDIT_PLACES_BY_NAME = new Map(
  GUIDE_EDIT_PLACES.map(([name, description], index) => [
    name,
    { name, description, number: index + 1 },
  ]),
);

const GUIDE_EDIT_GROUPS = [
  {
    label: "Eat & Drink",
    description: "From first coffee to dinner with a crowd.",
    places: [
      "Cactus",
      "Marshmellow",
      "Sisters Kabalana",
      "Abrazo",
      "Jam House",
      "Petals",
      "Folklore Ahangama",
      "Cafe Wave",
    ],
  },
  {
    label: "Stay & Slow Down",
    description: "Places with a distinct rhythm and reason to linger.",
    places: ["The Kip", "Kurulu Bay", "Fi Midigama"],
  },
  {
    label: "Surf & Wellness",
    description: "For waves, movement, restoration and a slower pace.",
    places: [
      "Unsung",
      "Surf Club Midigama",
      "The Nuga House",
      "White Lotus Spa",
      "Pura Pilates",
    ],
  },
  {
    label: "Shop & Local Life",
    description: "Creative spaces, useful stops and locally minded finds.",
    places: [
      "Kumbuk Community",
      "Daydream",
      "Living Room Concept Store",
      "Gusta",
    ],
  },
];

function instagramUrl(value) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://www.instagram.com/${value.replace(/^@/, "")}/`;
}

function mapUrl(venue) {
  if (venue.mapUrl) return venue.mapUrl;
  if (venue.lat && venue.lng) {
    return `https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`;
  }
  return null;
}

function MapResizer() {
  const map = useMap();

  useEffect(() => {
    const timeout = setTimeout(() => map.invalidateSize(), 400);
    return () => clearTimeout(timeout);
  }, [map]);

  return null;
}

function GuideMapFitBounds({ places }) {
  const map = useMap();

  useEffect(() => {
    const timeout = setTimeout(() => {
      map.invalidateSize();

      if (!places.length) {
        map.setView(GUIDE_MAP_CENTER, 12);
      } else if (places.length === 1) {
        map.setView([places[0].lat, places[0].lng], 15);
      } else {
        map.fitBounds(
          places.map((place) => [place.lat, place.lng]),
          { padding: [28, 28] },
        );
      }
    }, 180);

    return () => clearTimeout(timeout);
  }, [map, places]);

  return null;
}

function getGuideMapIconSvg(categoryKey) {
  const common =
    'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';

  switch (categoryKey) {
    case "stay":
      return `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${common} d="M4 11.5 12 5l8 6.5"/><path ${common} d="M6.5 10.5V19h11v-8.5"/><path ${common} d="M10 19v-4.5h4V19"/></svg>`;
    case "eat-drink":
      return `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${common} d="M7 4v7M10 4v7M7 7h3M8.5 11v9M15 4v16M15 4c2 1.2 3 3.1 3 5.5S17 13.8 15 15"/></svg>`;
    case "surf":
      return `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${common} d="M3 15c2.2-2 4.4-2 6.6 0s4.4 2 6.6 0 4.4-2 5.8-.7M4 10.5c2-1.7 4-1.7 6 0s4 1.7 6 0 4-1.7 5.5-.7"/></svg>`;
    case "experiences":
      return `<svg viewBox="0 0 24 24" aria-hidden="true"><circle ${common} cx="12" cy="12" r="7.5"/><path ${common} d="m12 8 2.2 4.3 4.3.7-3.4 3.1.8 4.4-3.9-2-3.9 2 .8-4.4L5.5 13l4.3-.7L12 8Z"/></svg>`;
    case "wellness":
      return `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${common} d="M12 20c4.8-3.2 7-6 7-9.3 0-2.4-1.8-4.2-4.1-4.2-1.4 0-2.4.6-2.9 1.6-.5-1-1.5-1.6-2.9-1.6C6.8 6.5 5 8.3 5 10.7 5 14 7.2 16.8 12 20Z"/></svg>`;
    case "shopping":
    case "born":
      return `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${common} d="M7 9V7.5A5 5 0 0 1 12 3a5 5 0 0 1 5 4.5V9"/><path ${common} d="M6 9h12l-1 11H7L6 9Z"/></svg>`;
    default:
      return `<svg viewBox="0 0 24 24" aria-hidden="true"><circle ${common} cx="12" cy="12" r="4.5"/></svg>`;
  }
}

function createGuideMapIcon(categoryKey, color) {
  const svg = getGuideMapIconSvg(categoryKey);

  return L.divIcon({
    className: "",
    html: `<div class="pgo-mapMarker" style="--pgo-marker:${color}"><span>${svg}</span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function EssentialGuideMap({ onSelectVenue }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const categories = useMemo(
    () =>
      ONLINE_SECTIONS.map((section) => ({
        key: section.key,
        label: section.label,
        color: section.color,
        venues: [
          ...new Map(
            section.venueGroups
              .flatMap((group) => group.venues)
              .map((venue) => [venue.slug, venue]),
          ).values(),
        ],
      })).filter((category) => category.venues.length),
    [],
  );
  const iconMap = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category) => [
          category.key,
          createGuideMapIcon(category.key, category.color),
        ]),
      ),
    [categories],
  );
  const allPlaces = useMemo(
    () =>
      categories.flatMap((category) =>
        category.venues.map((venue) => ({
          ...venue,
          categoryKey: category.key,
          categoryLabel: category.label,
        })),
      ),
    [categories],
  );
  const categoryPlaces =
    activeCategory === "all"
      ? allPlaces
      : allPlaces.filter((place) => place.categoryKey === activeCategory);
  const visiblePlaces = categoryPlaces.filter(
    (place) =>
      typeof place.lat === "number" &&
      typeof place.lng === "number" &&
      place.lat >= GUIDE_MAP_BOUNDS.south &&
      place.lat <= GUIDE_MAP_BOUNDS.north &&
      place.lng >= GUIDE_MAP_BOUNDS.west &&
      place.lng <= GUIDE_MAP_BOUNDS.east,
  );

  return (
    <div className="pgo-guideMapShell">
      <div className="pgo-guideMapFilters" aria-label="Filter map places">
        <button
          type="button"
          className={activeCategory === "all" ? "is-active" : undefined}
          onClick={() => setActiveCategory("all")}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            type="button"
            className={
              activeCategory === category.key ? "is-active" : undefined
            }
            key={category.key}
            onClick={() => setActiveCategory(category.key)}
          >
            {category.label}
          </button>
        ))}
      </div>
      <div className="pgo-guideMap">
        <MapContainer
          center={GUIDE_MAP_CENTER}
          zoom={12}
          scrollWheelZoom={false}
          attributionControl={false}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapResizer />
          <GuideMapFitBounds places={visiblePlaces} />
          {visiblePlaces.map((place) => (
            <Marker
              key={`${place.categoryKey}-${place.slug}`}
              position={[place.lat, place.lng]}
              icon={iconMap[place.categoryKey]}
            >
              <Popup>
                <div className="pgo-guideMapPopup">
                  <small>{place.categoryLabel}</small>
                  <strong>{place.name}</strong>
                  {place.excerpt || place.description ? (
                    <p>{place.excerpt || place.description}</p>
                  ) : null}
                  <button type="button" onClick={() => onSelectVenue(place)}>
                    View details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <p className="pgo-guideMapMeta">
        {visiblePlaces.length} mapped places shown
      </p>
    </div>
  );
}

function ContentsRibbon() {
  const [expanded, setExpanded] = useState(false);
  const items = [
    { id: "guide-cover", label: "Cover", number: 1 },
    { id: "guide-intro", label: "Welcome", number: 2 },
    { id: "guide-start", label: "Start here", number: 3 },
    ...ONLINE_SECTIONS.flatMap((section, sectionIndex) => [
      {
        id: `guide-${section.key}`,
        label: section.label,
        number: sectionIndex + 4,
      },
      ...section.venueGroups.map((group) => ({
        id: `guide-${section.key}-${group.key}`,
        label: group.headline,
        subsection: true,
      })),
    ]),
    { id: "guide-closing", label: "Closing", number: 12 },
  ];

  return (
    <aside
      className={`pgo-toc${expanded ? " is-expanded" : ""}`}
      aria-label="Guide contents"
      onMouseEnter={() => {
        if (window.matchMedia("(min-width: 761px)").matches) setExpanded(true);
      }}
      onMouseLeave={() => {
        if (window.matchMedia("(min-width: 761px)").matches) setExpanded(false);
      }}
    >
      <button
        type="button"
        className="pgo-tocTab"
        aria-expanded={expanded}
        aria-controls="pgo-contents-panel"
        onClick={() => setExpanded((current) => !current)}
      >
        Contents
      </button>
      <nav className="pgo-tocPanel" id="pgo-contents-panel">
        <div className="pgo-tocScroll">
          <span>Jump to section</span>
          {items.map((item) => (
            <a
              href={`#${item.id}`}
              key={item.id}
              className={item.subsection ? "is-subsection" : undefined}
              onClick={() => setExpanded(false)}
            >
              <small>
                {item.subsection ? "-" : String(item.number).padStart(2, "0")}
              </small>
              {item.label}
            </a>
          ))}
        </div>
      </nav>
      <button
        type="button"
        className="pgo-tocClose"
        aria-label="Close guide contents"
        onClick={() => setExpanded(false)}
      >
        Close
      </button>
    </aside>
  );
}

export default function PrintGuideOnlinePage() {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const selectedMapUrl = selectedVenue ? mapUrl(selectedVenue) : null;
  const selectedInstagramUrl = instagramUrl(selectedVenue?.instagram);

  return (
    <SiteLayout navOverlayHero showNav={false} showFooter={false}>
      <Seo
        title="Ahangama Guide 2026/27 | Read Online"
        description="Read the Ahangama Guide online: a mobile-first local guide to the best places to stay, eat, surf, shop and explore on Sri Lanka's south coast."
        canonical={absUrl(PRINT_GUIDE_ONLINE_PATH)}
        ogImage={GUIDE_IMAGE}
        ogImageWidth={1960}
        ogImageHeight={1100}
        author="Ahangama Guide Editorial Team"
      />
      <ContentsRibbon />
      <main className="pgo-webGuide">
        <header className="pgo-hero" id="guide-cover">
          <img
            src={GUIDE_IMAGE}
            alt="The coast and everyday life in Ahangama"
          />
          <div className="pgo-heroShade" aria-hidden="true" />
          <div className="pgo-heroCopy">
            <span>Ahangama Guide · 2026/27</span>
            <h1>
              The south coast,
              <br />
              selected slowly.
            </h1>
            <p>Stay, eat, surf, move and meet the people shaping Ahangama.</p>
            <a href="#guide-intro">
              Begin the guide <ArrowDownOutlined />
            </a>
          </div>
          <div className="pgo-heroEdition">
            Issue 01 · Independent and local
          </div>
        </header>

        <nav className="pgo-chapterNav" aria-label="Guide chapters">
          <div>
            <a href="#guide-start">Start here</a>
            {ONLINE_SECTIONS.map((section) => (
              <a href={`#guide-${section.key}`} key={section.key}>
                {section.label}
              </a>
            ))}
          </div>
        </nav>

        <section className="pgo-intro" id="guide-intro">
          <span className="pgo-kicker">
            A field guide for curious travellers
          </span>
          <div className="pgo-introGrid">
            <h2>
              Know the place,
              <br />
              not just the postcode.
            </h2>
            <div>
              <p>
                Ahangama rewards people who look beyond the main road. This
                online edition brings together the places, people and useful
                details we would share with a friend arriving tomorrow.
              </p>
              <p>
                Every recommendation is locally edited. Open a place to find its
                pass perk, directions, Instagram and the practical details worth
                having close at hand.
              </p>
            </div>
          </div>
        </section>

        <section className="pgo-opening" id="guide-start">
          <header className="pgo-openingHeader">
            <span className="pgo-kicker">Pages 03–11 · Before you begin</span>
            <h2>{OPENING_PAGES.get(3)?.content.headline}</h2>
            <p>{OPENING_PAGES.get(3)?.content.subheadline}</p>
            <div className="pgo-welcomeCopy">
              <p>{OPENING_PAGES.get(3)?.content.body}</p>
              <p>
                This guide is edited for travellers who would rather know a
                place than simply pass through it. Carry it, mark it, and let it
                lead you off the main road.
              </p>
              <strong>The Ahangama.com editors</strong>
            </div>
          </header>

          <div className="pgo-openingBlock pgo-guideKey">
            <div className="pgo-openingTitle">
              <span>04</span>
              <h3>{OPENING_PAGES.get(4)?.content.headline}</h3>
              <p>{OPENING_PAGES.get(4)?.content.subheadline}</p>
            </div>
            <div className="pgo-guideKeyGrid">
              {GUIDE_KEY_ITEMS.map(([number, title, description]) => (
                <article key={number}>
                  <span>{number}</span>
                  <h4>{title}</h4>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="pgo-openingBlock pgo-neighbourhoods">
            <div className="pgo-openingTitle">
              <span>05</span>
              <h3>{OPENING_PAGES.get(5)?.content.headline}</h3>
              <p>{OPENING_PAGES.get(5)?.content.subheadline}</p>
            </div>
            <div className="pgo-neighbourhoodGrid">
              {GUIDE_AREAS.map(
                ([name, summary, description, bestFor], index) => (
                  <article key={name}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h4>{name}</h4>
                    <strong>{summary}</strong>
                    <p>{description}</p>
                    <small>Best for · {bestFor}</small>
                  </article>
                ),
              )}
            </div>
          </div>

          <div className="pgo-openingBlock pgo-mapFeature">
            <div className="pgo-openingTitle">
              <span>06–07</span>
              <h3>{OPENING_PAGES.get(6)?.content.headline}</h3>
              <p>{OPENING_PAGES.get(6)?.content.subheadline}</p>
            </div>
            <EssentialGuideMap onSelectVenue={setSelectedVenue} />
          </div>

          <div className="pgo-openingBlock pgo-itineraries">
            {[8, 9].map((pageNumber) => (
              <article className="pgo-itinerary" key={pageNumber}>
                <div className="pgo-openingTitle">
                  <span>0{pageNumber}</span>
                  <h3>{OPENING_PAGES.get(pageNumber)?.content.headline}</h3>
                  <p>{OPENING_PAGES.get(pageNumber)?.content.subheadline}</p>
                </div>
                <div>
                  {GUIDE_ITINERARIES[pageNumber].map(
                    ([time, title, description]) => (
                      <section key={time}>
                        <time>{time}</time>
                        <div>
                          <h4>{title}</h4>
                          <p>{description}</p>
                        </div>
                      </section>
                    ),
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="pgo-openingBlock pgo-townStory">
            <div className="pgo-openingTitle">
              <span>10</span>
              <h3>{OPENING_PAGES.get(10)?.content.headline}</h3>
              <p>{OPENING_PAGES.get(10)?.content.subheadline}</p>
            </div>
            <div>
              {GUIDE_TOWN_STORY_CHAPTERS.map(([title, description], index) => (
                <article key={title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h4>{title}</h4>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="pgo-openingBlock pgo-edit">
            <div className="pgo-openingTitle">
              <span>11</span>
              <h3>{OPENING_PAGES.get(11)?.content.headline}</h3>
              <p>{OPENING_PAGES.get(11)?.content.subheadline}</p>
            </div>
            <div className="pgo-editGroups">
              {GUIDE_EDIT_GROUPS.map((group) => (
                <section className="pgo-editGroup" key={group.label}>
                  <header>
                    <span>Our edit</span>
                    <h4>{group.label}</h4>
                    <p>{group.description}</p>
                  </header>
                  <div className="pgo-editGrid">
                    {group.places.map((placeName) => {
                      const place = GUIDE_EDIT_PLACES_BY_NAME.get(placeName);
                      const normalizedName = place.name.toLowerCase();
                      const venue =
                        GUIDE_PLACES_BY_NAME.get(normalizedName) ||
                        GUIDE_PLACES_BY_SLUG.get(
                          GUIDE_EDIT_VENUE_ALIASES[normalizedName],
                        );
                      const content = (
                        <>
                          <span>{String(place.number).padStart(2, "0")}</span>
                          <strong>{place.name}</strong>
                          <small>{place.description}</small>
                          {venue ? <RightOutlined /> : null}
                        </>
                      );
                      return venue ? (
                        <button
                          type="button"
                          key={place.name}
                          onClick={() => setSelectedVenue(venue)}
                        >
                          {content}
                        </button>
                      ) : (
                        <article key={place.name}>{content}</article>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        {ONLINE_SECTIONS.map((section, sectionIndex) => (
          <section
            className="pgo-chapter"
            id={`guide-${section.key}`}
            key={section.key}
            style={{ "--pgo-accent": section.color }}
          >
            <header className="pgo-chapterHero">
              <img src={section.image} alt="" loading="lazy" />
              <div className="pgo-chapterShade" aria-hidden="true" />
              <div className="pgo-chapterTitle">
                <span>
                  {String(sectionIndex + 1).padStart(2, "0")} · {section.label}
                </span>
                <h2>{section.headline}</h2>
                <p>{section.subheadline}</p>
              </div>
            </header>

            <div className="pgo-chapterBody">
              <div className="pgo-chapterLead">
                <span>Our edit</span>
                <p>{section.body}</p>
              </div>
              {section.venueGroups.length ? (
                <div className="pgo-venues">
                  {section.venueGroups.map((group, groupIndex) => (
                    <section
                      className="pgo-venueGroup"
                      id={`guide-${section.key}-${group.key}`}
                      key={group.key}
                    >
                      <div className="pgo-venuesHeading">
                        <div>
                          <span className="pgo-kicker">
                            {groupIndex === 0
                              ? `${section.venueCount} places in this chapter`
                              : section.label}
                          </span>
                          <h3>{group.headline}</h3>
                          <p>{group.subheadline}</p>
                        </div>
                        <span>{group.venues.length} recommendations</span>
                      </div>
                      <div className="pgo-venueGrid">
                        {group.venues.map((venue) => (
                          <button
                            type="button"
                            className="pgo-venueCard"
                            key={venue.slug}
                            onClick={() => setSelectedVenue(venue)}
                          >
                            <span className="pgo-venueImage">
                              <img
                                src={venue.image || section.image}
                                alt=""
                                loading="lazy"
                              />
                              {venue.cardPerk ? <em>Pass perk</em> : null}
                            </span>
                            <span className="pgo-venueMeta">
                              <span>
                                {venue.area || "Ahangama"}
                                {venue.stars ? (
                                  <>
                                    {" "}
                                    · <StarFilled /> {venue.stars}
                                  </>
                                ) : null}
                              </span>
                              <RightOutlined />
                            </span>
                            <strong>{venue.name}</strong>
                            <small>{venue.excerpt || venue.description}</small>
                          </button>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ))}

        <section className="pgo-closing" id="guide-closing">
          <span className="pgo-kicker">Keep exploring</span>
          <h2>
            Let the road
            <br />
            change the plan.
          </h2>
          <p>
            The live Ahangama guide is updated as the town changes, with new
            openings, events and local recommendations.
          </p>
          <a href="/">
            Explore all of Ahangama <ArrowRightOutlined />
          </a>
        </section>
      </main>

      <Drawer
        className="pgo-venueDrawer"
        rootClassName="pgo-venueDrawerRoot"
        open={Boolean(selectedVenue)}
        onClose={() => setSelectedVenue(null)}
        width="90vw"
        title={null}
        destroyOnHidden
      >
        {selectedVenue ? (
          <article className="pgo-venueDetail">
            <div className="pgo-detailHero">
              <img
                src={selectedVenue.image || GUIDE_IMAGE}
                alt={selectedVenue.name}
              />
              <span>{selectedVenue.category}</span>
            </div>
            <div className="pgo-detailBody">
              <div className="pgo-detailHeading">
                <div>
                  <span>{selectedVenue.area || "Ahangama"}</span>
                  <h2>{selectedVenue.name}</h2>
                </div>
                {selectedVenue.stars ? (
                  <strong>
                    <StarFilled /> {selectedVenue.stars}
                    <small>
                      {selectedVenue.reviews
                        ? `${selectedVenue.reviews} reviews`
                        : "Guest rating"}
                    </small>
                  </strong>
                ) : null}
              </div>
              <p className="pgo-detailDescription">
                {selectedVenue.description || selectedVenue.excerpt}
              </p>
              {selectedVenue.cardPerk ? (
                <section className="pgo-detailPerk">
                  <span>Ahangama Pass perk</span>
                  <h3>{selectedVenue.cardPerk}</h3>
                  {selectedVenue.howToClaim ? (
                    <p>{selectedVenue.howToClaim}</p>
                  ) : null}
                </section>
              ) : null}
              {selectedVenue.bestFor?.length ? (
                <div className="pgo-detailTags">
                  {selectedVenue.bestFor.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              ) : null}
              <div className="pgo-detailActions">
                {selectedMapUrl ? (
                  <a href={selectedMapUrl} target="_blank" rel="noreferrer">
                    <EnvironmentOutlined /> Google Maps
                  </a>
                ) : null}
                {selectedInstagramUrl ? (
                  <a
                    href={selectedInstagramUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <InstagramOutlined /> Instagram
                  </a>
                ) : null}
              </div>
              <dl className="pgo-detailFacts">
                {selectedVenue.price ? (
                  <div>
                    <dt>Price</dt>
                    <dd>{selectedVenue.price}</dd>
                  </div>
                ) : null}
                {selectedVenue.hours ? (
                  <div>
                    <dt>Hours</dt>
                    <dd>{selectedVenue.hours}</dd>
                  </div>
                ) : null}
                {selectedVenue.restrictions ? (
                  <div>
                    <dt>Good to know</dt>
                    <dd>{selectedVenue.restrictions}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </article>
        ) : null}
      </Drawer>
    </SiteLayout>
  );
}
