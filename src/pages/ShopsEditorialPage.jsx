import React, { useMemo, useState } from "react";
import { Button, Empty, Input, Switch, Tag, Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { usePlaces } from "../app/placesContext";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { shouldShowPlace } from "../data/placeStatus";

const { Paragraph, Text, Title } = Typography;

const DIRECTORY_PAGE_SIZE = 12;

const HERO_FALLBACK =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/mukti.jpg";
const PANORAMA_FALLBACK =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hero_ahangama.jpg";

const EDITOR_NOTE =
  "Ahangama's retail scene is at its best when it feels like an extension of the town rather than a separate activity. The strongest shops here are not generic souvenir stops. They reflect the slower, design-aware, locally connected character that now defines much of the south coast. Some are good for gifts, some for practical essentials, and some simply help explain the evolving taste of the place.";

const EDITORS_PICKS_INTRO =
  "Three places that explain the shopping rhythm of Ahangama right now: one design-led stop, one useful everyday address, and one place worth visiting before you leave town.";

const DESIGN_INTRO =
  "The design-led side of Ahangama tends to feel calm, tactile and lightly social. These are the places where retail becomes part of the town's editorial identity, whether through clothing, home objects, or tightly curated selections that reflect south-coast life rather than generic beach-town merchandising.";

const ESSENTIALS_INTRO =
  "Good essential shops matter more than they first appear to. They support longer stays, solve the small practical problems that surface mid-trip, and often become the places visitors return to most because they are genuinely useful. In Ahangama, the best of them still manage to feel local rather than transactional.";

const GIFTS_INTRO =
  "The best take-home finds tend to be simple: tea, spice, locally minded gifts, objects with a sense of place, and items that feel tied to the coast rather than designed for airport shelves. These are the shops worth knowing when you want to leave with something more considered.";

const HOME_INTRO =
  "Ahangama's quieter retail story sits in the details: home pieces, objects, clothing, and stores with a point of view. Even when you are not actively shopping, these are the addresses that help describe the aesthetic shift the town has gone through in recent years.";

const DETOUR_INTRO =
  "Not every good shop is about necessity. Some are simply worth the stop because they add texture to the day, anchor an errand between meals, or give a clearer sense of what contemporary Ahangama is becoming.";

const PULL_QUOTES = [
  "The best shopping here feels more like local discovery than retail therapy.",
  "Ahangama's strongest shops reflect the town's slower, design-aware character.",
  "Practical stops matter just as much as the beautiful ones when you stay longer.",
];

const CONTINUE_EXPLORING = [
  {
    title: "Eats",
    href: "/eat",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+27maria-bonita.webp",
    description:
      "Coffee stops, long lunches, local favourites and dinner addresses worth building a day around.",
  },
  {
    title: "Wellness",
    href: "/wellness",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/pura_pilates.jpeg",
    description:
      "Recovery, yoga, Pilates and slower rituals that sit naturally beside the coastline.",
  },
  {
    title: "Stays",
    href: "/stays",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/merchant.jpg",
    description:
      "Boutique stays, villas and long-stay addresses for people building more than a quick trip.",
  },
  {
    title: "Ahangama This Week",
    href: "/",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hero_ahangama.jpg",
    description:
      "The weekly pulse of openings, local movement and what the town is paying attention to right now.",
  },
];

function normalize(value) {
  return (value || "").toLowerCase().trim();
}

function cleanSentence(value) {
  return (value || "")
    .replace(/\b\d+%\s*off\b/gi, "")
    .replace(
      /\bfree\s+(dessert|pastry|refill|upgrade|coffee|cocktail|drink|smoothie|protein boost)\b/gi,
      "",
    )
    .replace(
      /\b(pass holders?|pass holder|card holders?|card holder|ahangama pass|ahangama card)\b/gi,
      "",
    )
    .replace(/\bdiscounts?\b/gi, "")
    .replace(/\boffers?\b/gi, "")
    .replace(/\bperks?\b/gi, "")
    .replace(/\bwhen ordering\b/gi, "")
    .replace(/\bshow your\b[^.]*\.?/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();
}

function buildSearchText(place) {
  return normalize(
    [
      place.name,
      place.excerpt,
      place.description,
      place.area,
      place.price,
      ...(place.bestFor || []),
      ...(place.tags || []),
    ].join(" "),
  );
}

function isShopPlace(place) {
  return place.category === "retail" || place.category === "shops-essentials";
}

function getInternalPath(place) {
  if (!place?.slug) return null;
  if (isShopPlace(place)) return `/retail/${place.slug}`;
  if (place.category === "eat") return `/eat/${place.slug}`;
  if (place.category === "stays") return `/stays/${place.slug}`;
  if (place.category === "wellness") return `/wellness/${place.slug}`;
  return null;
}

function getPlaceImage(place, fallback = HERO_FALLBACK) {
  return place?.image || place?.ogImage || place?.logo || fallback;
}

function getInstagramUrl(place) {
  if (!place?.instagram) return null;
  return `https://www.instagram.com/${String(place.instagram).replace(/^@/, "")}/`;
}

function getDirectionsUrl(place) {
  if (place?.mapUrl) return place.mapUrl;
  if (typeof place?.lat === "number" && typeof place?.lng === "number") {
    return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
  }
  return null;
}

function getWebsiteUrl(place) {
  return (
    place?.website ||
    place?.url ||
    getInternalPath(place) ||
    `https://www.google.com/search?q=${encodeURIComponent(`${place?.name || "Ahangama shop"} Ahangama`)}`
  );
}

function scorePlaceForKeywords(place, keywords = []) {
  const haystack = buildSearchText(place);
  return keywords.reduce(
    (score, keyword) => score + (haystack.includes(normalize(keyword)) ? 1 : 0),
    0,
  );
}

function buildSectionItems(places, keywords, limit) {
  const sorted = [...places].sort((left, right) => {
    const keywordDelta =
      scorePlaceForKeywords(right, keywords) - scorePlaceForKeywords(left, keywords);
    if (keywordDelta !== 0) return keywordDelta;
    const starDelta = (Number(right.stars) || 0) - (Number(left.stars) || 0);
    if (starDelta !== 0) return starDelta;
    const reviewDelta = (Number(right.reviews) || 0) - (Number(left.reviews) || 0);
    if (reviewDelta !== 0) return reviewDelta;
    return (left.name || "").localeCompare(right.name || "");
  });

  return sorted.slice(0, limit).map((place) => ({
    place,
    image: getPlaceImage(place),
    websiteUrl: getWebsiteUrl(place),
    instagramUrl: getInstagramUrl(place),
    directionsUrl: getDirectionsUrl(place),
  }));
}

function buildDirectoryOneLine(place) {
  return cleanSentence(place.excerpt) || `${place.name} is worth knowing in Ahangama.`;
}

function buildDirectoryBody(place) {
  const description = cleanSentence(place.description);
  if (description && description.length >= 56) return description;
  return `${place.name} is one of the useful retail addresses that helps visitors read Ahangama properly: relaxed, practical and worth fitting into the day whether you need something specific or simply want a better sense of the town.`;
}

function matchesAnyKeyword(place, keywords) {
  const haystack = buildSearchText(place);
  return keywords.some((keyword) => haystack.includes(normalize(keyword)));
}

function SectionHeader({ number, label, intro }) {
  return (
    <div className="eat-guideSectionHead">
      <Text className="eat-guideSectionNumber">{number}</Text>
      <div>
        <Text className="eat-guideSectionLabel">{label}</Text>
        {intro ? <Paragraph className="eat-guideSectionIntro">{intro}</Paragraph> : null}
      </div>
    </div>
  );
}

function EditorialLinks({ websiteUrl, instagramUrl, directionsUrl }) {
  return (
    <div className="eat-guideLinks">
      {websiteUrl ? <a href={websiteUrl} className="eat-guideLink">Website</a> : null}
      {instagramUrl ? <a href={instagramUrl} className="eat-guideLink" target="_blank" rel="noopener noreferrer">Instagram</a> : null}
      {directionsUrl ? <a href={directionsUrl} className="eat-guideLink" target="_blank" rel="noopener noreferrer">Directions</a> : null}
    </div>
  );
}

function QuickReferenceTick({ value }) {
  return <span className={`eat-quickRefTick${value ? " is-active" : ""}`}>{value ? "✓" : "-"}</span>;
}

function DirectoryCard({ place }) {
  return (
    <article className="eat-guideDirectoryCard">
      <div className="eat-guideDirectoryMedia">
        <img src={getPlaceImage(place)} alt={place.name} />
      </div>
      <div className="eat-guideDirectoryBody">
        <Title level={3} className="eat-guideTileTitle">{place.name}</Title>
        <Text className="eat-guideOneLine">{buildDirectoryOneLine(place)}</Text>
        <Paragraph className="eat-guideTileCopy">{buildDirectoryBody(place)}</Paragraph>
        <EditorialLinks websiteUrl={getWebsiteUrl(place)} instagramUrl={getInstagramUrl(place)} directionsUrl={getDirectionsUrl(place)} />
      </div>
    </article>
  );
}

export default function ShopsEditorialPage() {
  const { places: allPlaces } = usePlaces();
  const [directoryQuery, setDirectoryQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [perksOnly, setPerksOnly] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [visibleCount, setVisibleCount] = useState(DIRECTORY_PAGE_SIZE);

  const resetVisibleCount = () => setVisibleCount(DIRECTORY_PAGE_SIZE);

  const places = useMemo(
    () =>
      allPlaces
        .filter((place) => place.destinationSlug === "ahangama")
        .filter((place) => shouldShowPlace(place)),
    [allPlaces],
  );

  const directoryPlaces = useMemo(
    () => places.filter((place) => isShopPlace(place)),
    [places],
  );

  const featuredItems = useMemo(
    () => buildSectionItems(directoryPlaces, ["design", "concept", "studio", "curated", "clothing", "gifts"], 3),
    [directoryPlaces],
  );
  const designItems = useMemo(
    () => buildSectionItems(directoryPlaces, ["design", "concept", "curated", "studio", "home", "clothing"], 4),
    [directoryPlaces],
  );
  const essentialsItems = useMemo(
    () => buildSectionItems(directoryPlaces, ["essential", "grocery", "daily", "tea", "spice", "pharmacy", "local products"], 4),
    [directoryPlaces],
  );
  const giftItems = useMemo(
    () => buildSectionItems(directoryPlaces, ["gift", "souvenir", "tea", "spice", "local products", "artisan"], 4),
    [directoryPlaces],
  );
  const homeItems = useMemo(
    () => buildSectionItems(directoryPlaces, ["home", "object", "interior", "living", "concept", "design"], 3),
    [directoryPlaces],
  );
  const detourItems = useMemo(
    () => buildSectionItems(directoryPlaces, ["retail", "curated", "trendy", "shopping", "local"], 3),
    [directoryPlaces],
  );

  const allTags = useMemo(() => {
    const tagSet = new Set();
    directoryPlaces.forEach((place) => {
      (place.bestFor || []).forEach((tag) => tagSet.add(tag));
      (place.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [directoryPlaces]);

  const filteredDirectoryPlaces = useMemo(() => {
    const query = normalize(directoryQuery);
    return directoryPlaces.filter((place) => {
      if (perksOnly && !place.cardPerk) return false;
      if (selectedTag) {
        const placeTags = [...(place.bestFor || []), ...(place.tags || [])];
        if (!placeTags.includes(selectedTag)) return false;
      }
      if (!query) return true;
      return buildSearchText(place).includes(query);
    });
  }, [directoryPlaces, directoryQuery, perksOnly, selectedTag]);

  const visibleDirectoryPlaces = filteredDirectoryPlaces.slice(0, visibleCount);

  const quickReferenceRows = useMemo(
    () =>
      directoryPlaces.slice(0, 8).map((place) => ({
        slug: place.slug,
        place,
        clothing: matchesAnyKeyword(place, ["clothing", "fashion", "wear", "apparel"]),
        homeware: matchesAnyKeyword(place, ["home", "object", "interior", "furniture"]),
        gifts: matchesAnyKeyword(place, ["gift", "souvenir", "take-home", "trendy"]),
        essentials: matchesAnyKeyword(place, ["essential", "daily", "grocery", "tea", "spice", "pharmacy"]),
        local: matchesAnyKeyword(place, ["local", "ceylon", "artisan", "handmade", "spice", "tea"]),
        design: matchesAnyKeyword(place, ["design", "concept", "curated", "studio"]),
        pass: Boolean(place.cardPerk),
      })),
    [directoryPlaces],
  );

  const heroImage = featuredItems[0]?.image || getPlaceImage(directoryPlaces[0], HERO_FALLBACK);
  const panoramaImage = homeItems[0]?.image || PANORAMA_FALLBACK;

  const canonical = absUrl("/shops");
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Shops in Ahangama",
    itemListElement: featuredItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.place.name,
      url: absUrl(getInternalPath(item.place) || "/shops"),
    })),
  };

  return (
    <SiteLayout>
      <Seo
        title="Shops | Ahangama"
        description="An editorial guide to shops and everyday essentials in Ahangama, from design-led retail and local finds to practical stores worth knowing."
        canonical={canonical}
        ogImage={heroImage}
        jsonLd={itemListJsonLd}
      />

      <div className="dm-canvas eat-guideCanvas">
        <div className="dm-wrap eat-guideWrap">
          <section className="eat-guideHero">
            <div className="eat-guideHeroCopy">
              <Text className="eat-guideEyebrow">Ahangama / Shops Guide</Text>
              <Title level={1} className="eat-guideHeroTitle">Shops</Title>
            </div>
            <div className="eat-guideHeroMedia">
              <img src={heroImage} alt="Editorial shops guide hero for Ahangama" />
            </div>
          </section>

          <section className="eat-guideSection eat-guideSection--note">
            <SectionHeader number="01" label="Editor's Note" intro={EDITOR_NOTE} />
          </section>

          <section className="eat-guideSection">
            <SectionHeader number="02" label="Editor's Picks" intro={EDITORS_PICKS_INTRO} />
            <div className="eat-guideFeatureStack">
              {featuredItems.map((item, index) => (
                <article key={item.place.slug} className={`eat-guideFeature${index % 2 ? " eat-guideFeature--reverse" : ""}`}>
                  <div className="eat-guideFeatureMedia">
                    <img src={item.image} alt={item.place.name} />
                  </div>
                  <div className="eat-guideFeatureBody">
                    <Text className="eat-guideKicker">Retail Pick</Text>
                    <Title level={2} className="eat-guideFeatureTitle">{item.place.name}</Title>
                    <Text className="eat-guideOneLine">{buildDirectoryOneLine(item.place)}</Text>
                    <Paragraph className="eat-guideFeatureCopy">{buildDirectoryBody(item.place)}</Paragraph>
                    <EditorialLinks websiteUrl={item.websiteUrl} instagramUrl={item.instagramUrl} directionsUrl={item.directionsUrl} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="eat-guideSection eat-guideSection--reference">
            <SectionHeader
              number="03"
              label="Quick Reference"
              intro="Use the table when you want to compare the most useful shopping stops quickly before reading the fuller recommendations below."
            />
            <div className="eat-quickRefWrap">
              <table className="eat-quickRefTable">
                <thead>
                  <tr>
                    <th>Venue</th>
                    <th>Clothing</th>
                    <th>Homeware</th>
                    <th>Gifts</th>
                    <th>Essentials</th>
                    <th>Local Products</th>
                    <th>Design-Led</th>
                    <th>Ahangama Pass</th>
                  </tr>
                </thead>
                <tbody>
                  {quickReferenceRows.map((row) => (
                    <tr key={row.slug}>
                      <td>
                        <a href={getWebsiteUrl(row.place)} className="eat-quickRefVenue">
                          {row.place.name}
                        </a>
                      </td>
                      <td><QuickReferenceTick value={row.clothing} /></td>
                      <td><QuickReferenceTick value={row.homeware} /></td>
                      <td><QuickReferenceTick value={row.gifts} /></td>
                      <td><QuickReferenceTick value={row.essentials} /></td>
                      <td><QuickReferenceTick value={row.local} /></td>
                      <td><QuickReferenceTick value={row.design} /></td>
                      <td><QuickReferenceTick value={row.pass} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="eat-guidePullQuote" aria-hidden="true">
            <blockquote>{PULL_QUOTES[0]}</blockquote>
          </section>

          <section className="eat-guideSection">
            <SectionHeader number="04" label="Design-Led Retail" intro={DESIGN_INTRO} />
            <div className="eat-guideGrid eat-guideGrid--medium">
              {designItems.map((item) => (
                <article key={item.place.slug} className="eat-guideTile">
                  <div className="eat-guideTileMedia">
                    <img src={item.image} alt={item.place.name} />
                  </div>
                  <div className="eat-guideTileBody">
                    <Title level={3} className="eat-guideTileTitle">{item.place.name}</Title>
                    <Text className="eat-guideOneLine">{buildDirectoryOneLine(item.place)}</Text>
                    <Paragraph className="eat-guideTileCopy">{buildDirectoryBody(item.place)}</Paragraph>
                    <EditorialLinks websiteUrl={item.websiteUrl} instagramUrl={item.instagramUrl} directionsUrl={item.directionsUrl} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="eat-guideSection">
            <SectionHeader number="05" label="Everyday Essentials" intro={ESSENTIALS_INTRO} />
            <div className="eat-guideRowList">
              {essentialsItems.map((item) => (
                <article key={item.place.slug} className="eat-guideRow">
                  <div className="eat-guideRowMedia">
                    <img src={item.image} alt={item.place.name} />
                  </div>
                  <div className="eat-guideRowBody">
                    <Title level={3} className="eat-guideRowTitle">{item.place.name}</Title>
                    <Text className="eat-guideOneLine">{buildDirectoryOneLine(item.place)}</Text>
                    <Paragraph className="eat-guideRowCopy">{buildDirectoryBody(item.place)}</Paragraph>
                    <EditorialLinks websiteUrl={item.websiteUrl} instagramUrl={item.instagramUrl} directionsUrl={item.directionsUrl} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="eat-guideSection">
            <SectionHeader number="06" label="Gifts & Take-Home Finds" intro={GIFTS_INTRO} />
            <div className="eat-guideLocalList">
              {giftItems.map((item) => (
                <article key={item.place.slug} className="eat-guideLocalItem">
                  <div className="eat-guideLocalMedia">
                    <img src={item.image} alt={item.place.name} />
                  </div>
                  <div className="eat-guideLocalBody">
                    <Title level={3} className="eat-guideTileTitle">{item.place.name}</Title>
                    <Text className="eat-guideOneLine">{buildDirectoryOneLine(item.place)}</Text>
                    <Paragraph className="eat-guideTileCopy">{buildDirectoryBody(item.place)}</Paragraph>
                    <EditorialLinks websiteUrl={item.websiteUrl} instagramUrl={item.instagramUrl} directionsUrl={item.directionsUrl} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="eat-guidePullQuote" aria-hidden="true">
            <blockquote>{PULL_QUOTES[1]}</blockquote>
          </section>

          <section className="eat-guideSection">
            <SectionHeader number="07" label="Home & Objects" intro={HOME_INTRO} />
            <div className="eat-guideGrid eat-guideGrid--work">
              {homeItems.map((item) => (
                <article key={item.place.slug} className="eat-guideWorkCard">
                  <div className="eat-guideWorkMedia">
                    <img src={item.image} alt={item.place.name} />
                  </div>
                  <div className="eat-guideWorkBody">
                    <Title level={3} className="eat-guideTileTitle">{item.place.name}</Title>
                    <Text className="eat-guideOneLine">{buildDirectoryOneLine(item.place)}</Text>
                    <Paragraph className="eat-guideTileCopy">{buildDirectoryBody(item.place)}</Paragraph>
                    <EditorialLinks websiteUrl={item.websiteUrl} instagramUrl={item.instagramUrl} directionsUrl={item.directionsUrl} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="eat-guideSection">
            <SectionHeader number="08" label="Around The Town" intro="These are the shops that sit naturally inside the day: easy to weave into coffee runs, errands, or the slower middle stretch between beach and dinner." />
            <div className="eat-guidePanorama">
              <div className="eat-guidePanoramaMedia">
                <img src={panoramaImage} alt="Shops and essentials in Ahangama" />
              </div>
              <div className="eat-guidePanoramaList">
                {directoryPlaces.slice(0, 3).map((place) => (
                  <article key={place.slug} className="eat-guidePanoramaItem">
                    <Title level={3} className="eat-guidePanoramaTitle">{place.name}</Title>
                    <Text className="eat-guideOneLine">{buildDirectoryOneLine(place)}</Text>
                    <Paragraph className="eat-guideTileCopy">{buildDirectoryBody(place)}</Paragraph>
                    <EditorialLinks websiteUrl={getWebsiteUrl(place)} instagramUrl={getInstagramUrl(place)} directionsUrl={getDirectionsUrl(place)} />
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="eat-guidePullQuote" aria-hidden="true">
            <blockquote>{PULL_QUOTES[2]}</blockquote>
          </section>

          <section className="eat-guideSection">
            <SectionHeader number="09" label="Worth The Detour" intro={DETOUR_INTRO} />
            <div className="eat-guideGrid eat-guideGrid--medium">
              {detourItems.map((item) => (
                <article key={item.place.slug} className="eat-guideTile eat-guideTile--story">
                  <div className="eat-guideTileMedia">
                    <img src={item.image} alt={item.place.name} />
                  </div>
                  <div className="eat-guideTileBody">
                    <Title level={3} className="eat-guideTileTitle">{item.place.name}</Title>
                    <Text className="eat-guideOneLine">{buildDirectoryOneLine(item.place)}</Text>
                    <Paragraph className="eat-guideTileCopy">{buildDirectoryBody(item.place)}</Paragraph>
                    <EditorialLinks websiteUrl={item.websiteUrl} instagramUrl={item.instagramUrl} directionsUrl={item.directionsUrl} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="eat-guideSection eat-guideSection--directory">
            <SectionHeader
              number="10"
              label="Explore All Shops"
              intro="The directory comes last. Use it once you understand the shape of the town and want to narrow down the exact shop, stop or practical address."
            />
            <div className="eat-guideDirectoryControls">
              <div className="eat-guideDirectorySearch">
                <Input
                  placeholder="Search shops, essentials or areas"
                  allowClear
                  value={directoryQuery}
                  onChange={(event) => {
                    setDirectoryQuery(event.target.value);
                    resetVisibleCount();
                  }}
                />
              </div>
              <div className="eat-guideDirectoryToggles">
                <div className="eat-guideDirectoryModes" role="tablist" aria-label="Directory view mode">
                  {[{ key: "grid", label: "Grid" }, { key: "list", label: "List" }].map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      className={`eat-guideModeButton${viewMode === option.key ? " is-active" : ""}`}
                      onClick={() => {
                        setViewMode(option.key);
                        resetVisibleCount();
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <label className="eat-guidePerksToggle">
                  <Switch
                    checked={perksOnly}
                    onChange={(checked) => {
                      setPerksOnly(checked);
                      resetVisibleCount();
                    }}
                    size="small"
                  />
                  <span>Ahangama Pass only</span>
                </label>
              </div>
              <div className="eat-guideTagFilters">
                <Tag
                  className={`eat-guideFilterTag${selectedTag === null ? " is-active" : ""}`}
                  onClick={() => {
                    setSelectedTag(null);
                    resetVisibleCount();
                  }}
                >
                  All
                </Tag>
                {allTags.slice(0, 12).map((tag) => (
                  <Tag
                    key={tag}
                    className={`eat-guideFilterTag${selectedTag === tag ? " is-active" : ""}`}
                    onClick={() => {
                      setSelectedTag(tag);
                      resetVisibleCount();
                    }}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>

            {visibleDirectoryPlaces.length ? (
              <div className={`eat-guideDirectoryCards eat-guideDirectoryCards--${viewMode}`}>
                {visibleDirectoryPlaces.map((place) => (
                  <DirectoryCard key={place.slug} place={place} />
                ))}
              </div>
            ) : (
              <div className="eat-guideDirectoryEmpty">
                <Empty description="No shops match that search yet." />
              </div>
            )}

            {visibleDirectoryPlaces.length < filteredDirectoryPlaces.length ? (
              <div className="eat-guideLoadMoreWrap">
                <Button onClick={() => setVisibleCount((count) => count + DIRECTORY_PAGE_SIZE)}>Load More</Button>
              </div>
            ) : null}
          </section>

          <section className="eat-guideSection eat-guideSection--explore">
            <SectionHeader
              number="11"
              label="Continue Exploring Ahangama"
              intro="The shops chapter should lead naturally into the rest of the town: where to eat, where to stay, how to reset, and what is changing along the coast."
            />
            <div className="eat-guideExploreGrid">
              {CONTINUE_EXPLORING.map((item) => (
                <a key={item.title} href={item.href} className="eat-guideExploreCard">
                  <div className="eat-guideExploreMedia">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="eat-guideExploreBody">
                    <Text className="eat-guideKicker">Next Chapter</Text>
                    <Title level={3} className="eat-guideTileTitle">{item.title}</Title>
                    <Paragraph className="eat-guideTileCopy">{item.description}</Paragraph>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}