import React, { useMemo, useState } from "react";
import { Empty, Typography } from "antd";
import { ArrowRightOutlined, BookOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { usePlaces } from "../app/placesContext";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { shouldShowPlace } from "../data/placeStatus";

const { Paragraph, Text, Title } = Typography;

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80";
const STORY_IMAGE =
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80";
const TIP_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";
const FALLBACK_IMAGE = HERO_IMAGE;

const FEATURED_SLUGS = [
  "kaffi-ahangama",
  "maria-bonita-sri-lanka",
  "patels-ahangama",
];

const FEATURED_SLUG_FALLBACKS = {
  "kaffi-ahangama": ["kaffi-ag"],
};

const FEATURED_EDITORIAL_LINES = {
  "kaffi-ahangama": {
    title: "The town's unofficial living room.",
    sentence: "Coffee, conversation and a morning crowd that makes Ahangama feel instantly legible.",
  },
  "kaffi-ag": {
    title: "The town's unofficial living room.",
    sentence: "Coffee, conversation and a morning crowd that makes Ahangama feel instantly legible.",
  },
  "maria-bonita-sri-lanka": {
    title: "Long lunches that turn into sunset drinks.",
    sentence: "One of the easier places to start at lunch and stay through the golden hour.",
  },
  "patels-ahangama": {
    title: "A local institution.",
    sentence: "Ahangama comfort food with the kind of familiarity that keeps people coming back.",
  },
};

const MOOD_FILTERS = [
  { label: "Breakfast", matchers: ["breakfast", "brunch", "pastry"] },
  { label: "Coffee", matchers: ["coffee", "cafe", "espresso", "latte"] },
  {
    label: "Work Friendly",
    matchers: ["work", "workspace", "cowork", "remote", "laptop"],
  },
  { label: "Healthy", matchers: ["healthy", "salad", "juice", "wellness", "vegan"] },
  { label: "Local Food", matchers: ["local", "rice", "curry", "sri lanka", "traditional"] },
  { label: "Date Night", matchers: ["date", "dinner", "romantic", "evening"] },
  { label: "Sunset Drinks", matchers: ["sunset", "cocktail", "drink", "bar", "beachside"] },
  { label: "More", matchers: ["lunch", "restaurant", "bistro", "social", "dinner"] },
];

function normalize(value) {
  return (value || "").toLowerCase().trim();
}

function splitSentences(value) {
  return (value || "")
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanSentence(value) {
  return (value || "")
    .replace(/\b\d+%\s*off\b/gi, "")
    .replace(/\bfree\s+(prosecco|drink|cocktail|tea|coffee)\b/gi, "")
    .replace(/\b(pass holders?|pass holder|card holders?|card holder|ahangama pass|ahangama card)\b/gi, "")
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
      place.area,
      place.excerpt,
      place.description,
      place.price,
      ...(place.bestFor || []),
      ...(place.tags || []),
    ].join(" "),
  );
}

function buildEditorialSentence(place) {
  const candidates = [place.excerpt, place.description].flatMap(splitSentences);
  const usable = candidates
    .map(cleanSentence)
    .find((sentence) => sentence.length >= 24 && !/discount|offer|perk|pass|card/i.test(sentence));

  if (usable) {
    return usable;
  }

  const fallbackTag = (place.bestFor || place.tags || []).find(Boolean);
  const fallbackArea = place.area ? ` in ${place.area}` : " in Ahangama";

  if (fallbackTag) {
    return `${place.name} is a reliable spot for ${fallbackTag.toLowerCase()}${fallbackArea}.`;
  }

  return `${place.name} is one of Ahangama's dependable places to stop, settle in, and eat well.`;
}

function buildFeaturedCopy(place) {
  return (
    FEATURED_EDITORIAL_LINES[place.slug] || {
      title: cleanSentence(splitSentences(place.excerpt || place.description)[0]) || `${place.name}, edited for slower meals.`,
      sentence: buildEditorialSentence(place),
    }
  );
}

function getPlaceImage(place) {
  return place.image || place.ogImage || place.logo || FALLBACK_IMAGE;
}

function getPlaceTags(place, limit = 3) {
  return Array.from(new Set([...(place.bestFor || []), ...(place.tags || [])]))
    .filter(Boolean)
    .filter((tag) => !/discount|offer|perk|pass|free/i.test(tag))
    .slice(0, limit);
}

function pickFeaturedPlaces(places) {
  const bySlug = new Map(places.map((place) => [place.slug, place]));
  const featured = FEATURED_SLUGS.map((slug) => {
    const direct = bySlug.get(slug);
    if (direct) return direct;

    return (FEATURED_SLUG_FALLBACKS[slug] || [])
      .map((fallbackSlug) => bySlug.get(fallbackSlug))
      .find(Boolean);
  }).filter(Boolean);

  if (featured.length >= 3) {
    return featured.slice(0, 3);
  }

  const featuredIds = new Set(featured.map((place) => place.id));
  const fallback = places.filter((place) => !featuredIds.has(place.id)).slice(0, 3 - featured.length);
  return [...featured, ...fallback];
}

export default function EatIndex() {
  const { places: allPlaces } = usePlaces();
  const [activeMood, setActiveMood] = useState(null);

  const places = useMemo(
    () =>
      allPlaces
        .filter((place) => place.destinationSlug === "ahangama" && place.category === "eat")
        .filter((place) => shouldShowPlace(place)),
    [allPlaces],
  );

  const filteredPlaces = useMemo(() => {
    if (!activeMood) {
      return places;
    }

    const chip = MOOD_FILTERS.find((item) => item.label === activeMood);
    if (!chip) {
      return places;
    }

    return places.filter((place) => {
      const haystack = buildSearchText(place);
      return chip.matchers.some((matcher) => haystack.includes(normalize(matcher)));
    });
  }, [activeMood, places]);

  const featuredPlaces = useMemo(
    () => pickFeaturedPlaces(filteredPlaces),
    [filteredPlaces],
  );

  const canonical = absUrl("/eat");

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Eat in Ahangama",
    itemListElement: filteredPlaces.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: p.name,
      url: absUrl(`/eat/${p.slug}`),
    })),
  };

  return (
    <SiteLayout>
      <Seo
        title="Eat in Ahangama"
        description="From sunrise coffee to long lunches and beachside dinners. An editorial guide to where Ahangama eats."
        canonical={canonical}
        ogImage={featuredPlaces[0] ? getPlaceImage(featuredPlaces[0]) : HERO_IMAGE}
        jsonLd={itemListJsonLd}
      />

      <div className="dm-canvas eat-editorialCanvas">
        <div className="dm-wrap eat-editorialWrap">
          <section className="eat-editorialHero">
            <div className="eat-editorialHeroCopy">
              <Text className="eat-editorialBreadcrumb">EAT / AHANGAMA</Text>
              <Title level={1} className="eat-editorialHeroTitle">
                Eat in Ahangama
              </Title>
              <Paragraph className="eat-editorialStandfirst">
                From sunrise coffee to long lunches and beachside dinners. A guide to where the town eats.
              </Paragraph>
              <Text className="eat-editorialCuratedBy">Curated by Ahangama.com</Text>
            </div>

            <div className="eat-editorialHeroMedia">
              <img src={HERO_IMAGE} alt="Editorial coffee scene for Ahangama dining guide" />
            </div>
          </section>

          <section className="eat-editorialFilters" id="eat-mood-filters">
            <div className="eat-editorialSectionHead">
              <Text className="eat-editorialSectionKicker">LOOKING FOR SOMETHING SPECIFIC?</Text>
            </div>
            <div className="eat-editorialChipRow">
              {MOOD_FILTERS.map((chip) => {
                const isActive = activeMood === chip.label;

                return (
                  <button
                    key={chip.label}
                    type="button"
                    className={`eat-editorialChip${isActive ? " is-active" : ""}`}
                    onClick={() => setActiveMood(isActive ? null : chip.label)}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="eat-editorialSection">
            <div className="eat-editorialSectionHead">
              <Text className="eat-editorialSectionKicker">Editor's Picks</Text>
            </div>

            <div className="eat-featuredGrid">
              {featuredPlaces.map((place) => {
                const editorial = buildFeaturedCopy(place);

                return (
                  <a key={place.id} href={`/eat/${place.slug}`} className="eat-featuredCard">
                    <div className="eat-featuredImageWrap">
                      <img src={getPlaceImage(place)} alt={place.name} className="eat-featuredImage" />
                    </div>
                    <div className="eat-featuredBody">
                      <div className="eat-cardTopRow">
                        <Text className="eat-featuredName">{place.name}</Text>
                        <span className="eat-savePlaceholder" aria-hidden="true">
                          <BookOutlined />
                        </span>
                      </div>
                      <Title level={3} className="eat-featuredTitle">
                        {editorial.title}
                      </Title>
                      <Paragraph className="eat-featuredCopy">
                        {editorial.sentence}
                      </Paragraph>
                      <div className="eat-tagRow">
                        {getPlaceTags(place).map((tag) => (
                          <span key={`${place.slug}-${tag}`} className="eat-tagPill">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          <section className="eat-storyStrip">
            <div className="eat-storyStripCopy">
              <Text className="eat-editorialSectionKicker">Story</Text>
              <Title level={2} className="eat-storyStripTitle">
                The Coffee Trail
              </Title>
              <Paragraph className="eat-storyStripText">
                Ahangama runs on coffee. Follow our favourite spots for flat whites, iced lattes and slow mornings that turn into productive afternoons.
              </Paragraph>
              <a href="/blogs" className="eat-storyStripLink">
                Read the story <ArrowRightOutlined />
              </a>
            </div>
            <div className="eat-storyStripMedia">
              <img src={STORY_IMAGE} alt="Coffee trail editorial story" />
            </div>
          </section>

          {filteredPlaces.length ? (
            <aside className="eat-localTipBanner">
              <div className="eat-localTipImageWrap">
                <img src={TIP_IMAGE} alt="Ahangama sunset tip" />
              </div>
              <div className="eat-localTipCopy">
                <Text className="eat-editorialSectionKicker">Local Tip</Text>
                <Title level={2} className="eat-localTipTitle">
                  Stay for sunset.
                </Title>
                <Paragraph className="eat-localTipText">
                  Some of the best moments in Ahangama happen after 5pm. These spots have front-row seats.
                </Paragraph>
                <a href="#eat-mood-filters" className="eat-storyStripLink">
                  See sunset spots <ArrowRightOutlined />
                </a>
              </div>
            </aside>
          ) : (
            <div className="eat-editorialEmptyState">
              <Empty description="No places match that mood yet." />
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
