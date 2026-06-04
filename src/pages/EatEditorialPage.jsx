import React, { useMemo, useState } from "react";
import { Button, Empty, Input, Switch, Tag, Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { usePlaces } from "../app/placesContext";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ShareRow from "../components/ui/ShareRow";
import { shouldShowPlace } from "../data/placeStatus";

const { Paragraph, Text, Title } = Typography;

const HERO_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+27maria-bonita.webp";
const SUNSET_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/lighthouse.jpg";
const DIRECTORY_PAGE_SIZE = 12;

const EDITOR_NOTE =
  "Ahangama's dining scene has evolved from a handful of surf-town cafes into one of Sri Lanka's most interesting food destinations. Alongside long-established local favourites, a new generation of restaurants, bakeries and coffee shops has helped shape the character of the town. The best way to read it is not as a checklist of venues but as a rhythm: coffee first, then a long lunch, a late-afternoon pause, and dinners that often turn into sunset.";

const COFFEE_TRAIL_INTRO =
  "Many visitors arrive in Ahangama expecting surf to define the day, then realise the town now runs just as much on coffee. The strongest cafes here are not interchangeable. Some are quick and central, some are better for settling in with a laptop, and some work best as part of the beach loop between Ahangama and Kabalana. What links them is a certain sociability: coffee in Ahangama is rarely only about caffeine. It is where plans are made, work gets done, surf checks are debated and mornings stretch slightly beyond intention.";

const LONG_LUNCHES_INTRO =
  "Ahangama is best when the middle of the day is allowed to open up. The strongest lunch addresses are not necessarily the most formal ones, but the places where the room invites you to stay, order another round and let the afternoon decide what happens next. This is where the town has become more sophisticated in recent years. Long lunches now feel like part of the destination's identity, sitting somewhere between hospitality, social life and the slower pace that makes people extend their trips.";

const LOCALS_INTRO =
  "The most useful food guides make room for places that are not trying to look like a travel guide at all. Ahangama still has plenty of addresses that matter because they are woven into everyday life: practical, familiar and good enough that people return without making a performance of it. These are the places that keep the town grounded. They offer a useful counterweight to the more polished end of the scene and remind visitors that authenticity is often about repetition, not novelty.";

const WORK_INTRO =
  "Remote work is now part of Ahangama's daily texture, but not every cafe suits a working day. The best options balance comfort, coffee and enough calm to make a few focused hours realistic. Some work best for proper coworking, others for a lighter afternoon of emails and planning. What matters is not just wifi, but atmosphere: a table you want to stay at, a pace that feels unhurried, and enough movement around you to keep the day feeling coastal rather than office-bound.";

const SUNSET_INTRO =
  "By late afternoon, the town shifts again. The most memorable plans are often the least rigid: one drink becomes another round, dinner becomes the natural next step, and the coastline does the rest. Sunset in Ahangama is less about a single bar than a mood, somewhere between sea air, conversation and the instinct to stay outside a little longer than intended.";

const DATE_NIGHT_INTRO =
  "Date night in Ahangama works best when it stays close to the town's character. The right places are atmospheric without being too formal, polished without feeling detached from the beachside setting. A little ceremony helps, but the best addresses still leave room for ease. Think longer tables, softer light and restaurants that know how to let an evening unfold.";

const PULL_QUOTES = [
  "Many visitors arrive for the surf and stay for the breakfast.",
  "Ahangama's cafe culture is less about coffee and more about community.",
  "The best meals are often the ones that turn into sunsets.",
];

const FEATURED_CONFIG = [
  {
    slug: "kaffi-ag",
    eyebrow: "Morning anchor",
    oneLine: "For coffee first, questions later.",
    body:
      "Kaffi feels like the kind of place every good beach town needs: central, unpretentious and always useful. It works whether you are arriving dusty from a surf, meeting someone between errands or settling in for a quick reset before the day begins properly. The room has an easy rhythm to it and the coffee is reliable enough that locals and long-stay visitors treat it as part of their routine rather than a novelty stop. If you only have time for one everyday cafe in Ahangama, this is the one that explains the town best.",
  },
  {
    slug: "maria-bonita-sri-lanka",
    eyebrow: "All-day favourite",
    oneLine: "Long lunches, slow starts and easy afternoons.",
    body:
      "Maria Bonita is one of the places that captures the newer side of Ahangama especially well. It has the atmosphere of a small hospitality hub rather than a quick cafe stop, which means it works equally well for breakfast, a late lunch or an unhurried coffee that becomes another hour at the table. The appeal is as much about mood as menu: airy, considered and just social enough. If you are introducing someone to the town, Maria Bonita is a useful first stop because it makes Ahangama feel polished without losing its ease.",
  },
  {
    slug: "donna-ahangama",
    eyebrow: "Dinner address",
    oneLine: "One for evenings that deserve a little ceremony.",
    body:
      "Donna has the confidence of a place designed for a longer evening. It is better approached as an atmosphere-first recommendation than a checklist of dishes: soft light, a composed room and the sense that dinner here should be allowed to stretch. That makes it especially good for a first night in town, a date or any meal where you want something more elevated than the casual surf-road norm. Ahangama does not need many overtly dressed-up restaurants, but it does need a few places like this that know how to shift the pace after dark.",
  },
];

const COFFEE_TRAIL_CONFIG = [
  {
    slug: "kaffi-ag",
    oneLine: "The dependable town-centre default.",
    body:
      "Kaffi is the place that makes Ahangama's coffee culture legible quickest: central, repeatable and woven into everyday routines rather than special-occasion brunches.",
  },
  {
    slug: "sisters-kabalana",
    oneLine: "Beach-loop coffee with Kabalana energy.",
    body:
      "Sisters makes most sense when the day begins or ends near the beach, and that adjacency gives it a relaxed, surf-town confidence.",
  },
  {
    slug: "focus-hub",
    oneLine: "Purposeful coffee for people with work to do.",
    body:
      "Focus Hub is where Ahangama's coffee culture meets its long-stay working life, giving structure to days that need more than a quick espresso.",
  },
  {
    slug: "veda-cafe",
    oneLine: "A brighter, greener version of the cafe day.",
    body:
      "Veda suits the side of Ahangama that likes natural light, healthier menus and mornings that feel gentle rather than hurried.",
  },
  {
    slug: "black-honey-cafe",
    oneLine: "Worth the detour for a quieter rhythm.",
    body:
      "Black Honey gives the coffee trail a calmer, slightly tucked-away option for people who prefer atmosphere over passing traffic.",
  },
];

const LONG_LUNCH_CONFIG = [
  {
    slug: "maria-bonita-sri-lanka",
    oneLine: "A lunch that can comfortably absorb an afternoon.",
    body:
      "Few places in town handle the long-lunch brief as naturally as Maria Bonita. It has enough atmosphere to feel like a destination, but not so much formality that you feel watched by the clock.",
  },
  {
    slug: "donna-ahangama",
    oneLine: "A more composed room for a slower meal.",
    body:
      "Donna brings a little more polish to the long-lunch brief, but keeps enough ease that the meal never feels overly arranged.",
  },
  {
    slug: "aliikai-ahangama",
    oneLine: "A lunch spot with a stronger sense of occasion.",
    body:
      "Aliikai works when you want the middle of the day to feel a touch more elevated without losing the looseness of the coastline.",
  },
  {
    slug: "le-cafe-french-bistro-ahangama",
    oneLine: "French-bistro polish without overstatement.",
    body:
      "Le Cafe sits nicely in the middle ground between everyday and occasion, which makes it especially good for lunches that deserve a little more structure.",
  },
];

const LOCALS_CONFIG = [
  {
    slug: "patels-ahangama",
    oneLine: "One of the most useful names to know beyond the polished set.",
    body:
      "Patel's matters because it is genuinely embedded in the rhythm of the town. It feels less like a discovery and more like infrastructure for everyday eating.",
  },
  {
    slug: "citra-ahangama",
    oneLine: "Established, busy and useful for mixed groups.",
    body:
      "Citra earns its place through reliability. It is the kind of place people recommend because it works, not because it needs a narrative around it.",
  },
  {
    slug: "hakuna-matata-ahangama",
    oneLine: "Casual, familiar and built for easy group meals.",
    body:
      "Hakuna Matata belongs here because it fills an everyday role well: relaxed, accessible and useful when you need something straightforward that still lands.",
  },
  {
    slug: "tahini",
    oneLine: "Family-run energy and the kind of place people return to.",
    body:
      "Tahini and friends has the warmth and practical appeal that tends to matter more over time than trendier first impressions.",
  },
];

const WORK_CONFIG = [
  {
    slug: "focus-hub",
    oneLine: "The clearest work-first address in town.",
    body:
      "If the day is genuinely about work rather than a light laptop interlude, Focus Hub is the most practical and easiest to recommend.",
  },
  {
    slug: "kaffi-ag",
    oneLine: "Best for a lighter working session over coffee.",
    body:
      "Kaffi works when you want to answer emails, sketch out the day or hold a casual meeting without disappearing into coworking mode.",
  },
  {
    slug: "veda-cafe",
    oneLine: "For slower admin and a better lunch break.",
    body:
      "Veda is the right choice when the working day needs to feel civilised, with healthy food and enough calm to stay a little longer.",
  },
];

const SUNSET_CONFIG = [
  {
    slug: "aliikai-ahangama",
    oneLine: "For evenings that can begin with drinks and stay there.",
    body:
      "Aliikai suits the version of sunset that wants a little more atmosphere from the outset, and it works especially well when dinner may follow naturally.",
  },
  {
    slug: "hakuna-matata-ahangama",
    oneLine: "An easy, sociable stop for groups near the junction.",
    body:
      "Hakuna Matata is best treated as a comfortable, no-fuss stop for familiar faces, casual drinks and evenings that do not need overplanning.",
  },
  {
    slug: "lighthouse",
    oneLine: "When the view is the reason to arrive early.",
    body:
      "Lighthouse is less about a single order and more about what happens once the light starts to soften. Come for the view, stay until the sky has fully turned.",
  },
];

const DATE_NIGHT_CONFIG = [
  {
    slug: "maria-bonita-sri-lanka",
    oneLine: "Soft, sociable and easy to settle into.",
    body:
      "Maria Bonita works for dates because it balances charm with ease. It feels considered, but never so arranged that the evening becomes formal.",
  },
  {
    slug: "le-cafe-french-bistro-ahangama",
    oneLine: "Bistro energy for a slightly more dressed-up night.",
    body:
      "Le Cafe is a good choice when you want the evening to feel gently elevated, with enough atmosphere to justify making a proper booking.",
  },
  {
    slug: "aliikai-ahangama",
    oneLine: "The sunset-to-dinner bridge for an occasion.",
    body:
      "Aliikai suits nights that start with a drink and naturally turn into dinner, with just enough ceremony to make the whole thing feel intentional.",
  },
];

const QUICK_REFERENCE_ROWS = [
  { slug: "kaffi-ag", breakfast: true, lunch: false, dinner: false, coffee: true, work: true, sunset: false, pass: true },
  { slug: "veda-cafe", breakfast: true, lunch: true, dinner: false, coffee: true, work: true, sunset: false, pass: true },
  { slug: "maria-bonita-sri-lanka", breakfast: true, lunch: true, dinner: true, coffee: true, work: true, sunset: false, pass: true },
  { slug: "focus-hub", breakfast: false, lunch: false, dinner: false, coffee: true, work: true, sunset: false, pass: true },
  { slug: "donna-ahangama", breakfast: false, lunch: true, dinner: true, coffee: false, work: false, sunset: false, pass: true },
  { slug: "aliikai-ahangama", breakfast: false, lunch: true, dinner: true, coffee: false, work: false, sunset: true, pass: true },
  { slug: "le-cafe-french-bistro-ahangama", breakfast: false, lunch: true, dinner: true, coffee: true, work: false, sunset: false, pass: true },
  { slug: "patels-ahangama", breakfast: false, lunch: true, dinner: true, coffee: false, work: false, sunset: false, pass: true },
  { slug: "hakuna-matata-ahangama", breakfast: false, lunch: false, dinner: true, coffee: false, work: false, sunset: true, pass: true },
  { slug: "sisters-kabalana", breakfast: true, lunch: false, dinner: false, coffee: true, work: false, sunset: false, pass: true },
  { slug: "black-honey-cafe", breakfast: true, lunch: true, dinner: false, coffee: true, work: false, sunset: false, pass: true },
  { slug: "lighthouse", breakfast: false, lunch: false, dinner: true, coffee: false, work: false, sunset: true, pass: true },
];

const CONTINUE_EXPLORING = [
  {
    title: "Stays",
    href: "/stays",
    image: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/merchant.jpg",
    description: "Boutique stays, villas and longer-stay addresses for building a trip around.",
  },
  {
    title: "Wellness",
    href: "/wellness",
    image: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/pura_pilates.jpeg",
    description: "Yoga, recovery, Pilates and spa-led resets across the coast.",
  },
  {
    title: "Built in Ahangama",
    href: "/about",
    image: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/mukti.jpg",
    description: "Creative businesses, local perspective and the people shaping the town's newer identity.",
  },
  {
    title: "Ahangama This Week",
    href: "/",
    image: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hero_ahangama.jpg",
    description: "The weekly pulse of openings, finds and what the town is paying attention to now.",
  },
];

function normalize(value) {
  return (value || "").toLowerCase().trim();
}

function cleanSentence(value) {
  return (value || "")
    .replace(/\b\d+%\s*off\b/gi, "")
    .replace(/\bfree\s+(dessert|pastry|refill|upgrade|coffee|cocktail|drink|smoothie|protein boost)\b/gi, "")
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
      place.excerpt,
      place.description,
      place.area,
      place.price,
      ...(place.bestFor || []),
      ...(place.tags || []),
    ].join(" "),
  );
}

function getInternalPath(place) {
  if (!place?.slug) return null;
  if (place.category === "eat") return `/eat/${place.slug}`;
  if (place.category === "stays") return `/stays/${place.slug}`;
  if (place.category === "wellness") return `/wellness/${place.slug}`;
  if (place.category === "retail") return `/retail/${place.slug}`;
  return null;
}

function getPlaceImage(place, fallback = HERO_IMAGE) {
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
    `https://www.google.com/search?q=${encodeURIComponent(`${place?.name || "Ahangama venue"} Ahangama`)}`
  );
}

function buildSectionItems(placeMap, config) {
  return config
    .map((item) => {
      const place = placeMap.get(item.slug);
      if (!place) return null;
      return {
        ...item,
        place,
        image: item.image || getPlaceImage(place),
        websiteUrl: getWebsiteUrl(place),
        instagramUrl: getInstagramUrl(place),
        directionsUrl: getDirectionsUrl(place),
      };
    })
    .filter(Boolean);
}

function buildDirectoryOneLine(place) {
  return cleanSentence(place.excerpt) || `${place.name} is worth knowing in Ahangama.`;
}

function buildDirectoryBody(place) {
  const description = cleanSentence(place.description);
  if (description && description.length >= 56) return description;
  return `${place.name} is one of the addresses that helps visitors read Ahangama properly: relaxed, repeatable and easy to fit into the day whether you are passing through or staying for longer.`;
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

export default function EatEditorialPage() {
  const { places: allPlaces } = usePlaces();
  const [directoryQuery, setDirectoryQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [perksOnly, setPerksOnly] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [visibleCount, setVisibleCount] = useState(DIRECTORY_PAGE_SIZE);

  const resetVisibleCount = () => setVisibleCount(DIRECTORY_PAGE_SIZE);

  const places = useMemo(
    () => allPlaces.filter((place) => place.destinationSlug === "ahangama").filter((place) => shouldShowPlace(place)),
    [allPlaces],
  );

  const directoryPlaces = useMemo(
    () => places.filter((place) => place.category === "eat" || ["focus-hub", "black-honey-cafe"].includes(place.slug)),
    [places],
  );

  const placesBySlug = useMemo(() => new Map(places.map((place) => [place.slug, place])), [places]);
  const featuredItems = useMemo(() => buildSectionItems(placesBySlug, FEATURED_CONFIG), [placesBySlug]);
  const coffeeTrailItems = useMemo(() => buildSectionItems(placesBySlug, COFFEE_TRAIL_CONFIG), [placesBySlug]);
  const lunchItems = useMemo(() => buildSectionItems(placesBySlug, LONG_LUNCH_CONFIG), [placesBySlug]);
  const localItems = useMemo(() => buildSectionItems(placesBySlug, LOCALS_CONFIG), [placesBySlug]);
  const workItems = useMemo(() => buildSectionItems(placesBySlug, WORK_CONFIG), [placesBySlug]);
  const sunsetItems = useMemo(() => buildSectionItems(placesBySlug, SUNSET_CONFIG), [placesBySlug]);
  const dateNightItems = useMemo(() => buildSectionItems(placesBySlug, DATE_NIGHT_CONFIG), [placesBySlug]);

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
    () => QUICK_REFERENCE_ROWS.map((row) => ({ ...row, place: placesBySlug.get(row.slug) })).filter((row) => row.place),
    [placesBySlug],
  );

  const canonical = absUrl("/eat");
  const shareTitle = "Eats | Ahangama";

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Eats in Ahangama",
    itemListElement: featuredItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.place.name,
      url: absUrl(getInternalPath(item.place) || "/eat"),
    })),
  };

  return (
    <SiteLayout>
      <Seo
        title="Eats | Ahangama"
        description="An editorial guide to where to eat in Ahangama, from coffee and long lunches to local favourites, sunset drinks and date-night tables."
        canonical={canonical}
        ogImage={featuredItems[0]?.image || HERO_IMAGE}
        jsonLd={itemListJsonLd}
      />

      <div className="dm-canvas eat-guideCanvas">
        <div className="dm-wrap eat-guideWrap">
          <section className="eat-guideHero">
            <div className="eat-guideHeroCopy">
              <Text className="eat-guideEyebrow">Ahangama / Food Guide</Text>
              <Title level={1} className="eat-guideHeroTitle">Eats</Title>
              <Text className="eat-guideByline">
                Words By <span className="eat-guideBylineName">Viji</span>
              </Text>
              <ShareRow
                url={canonical}
                title={shareTitle}
                text="An editorial guide to where to eat in Ahangama."
              />
            </div>
            <div className="eat-guideHeroMedia">
              <img src={HERO_IMAGE} alt="Editorial food guide hero for Ahangama" />
            </div>
          </section>

          <section className="eat-guideSection eat-guideSection--note">
            <SectionHeader number="01" label="Editor's Note" intro={EDITOR_NOTE} />
          </section>

          <section className="eat-guideSection">
            <SectionHeader
              number="02"
              label="Editor's Picks"
              intro="Three places that explain Ahangama's food scene best right now: one for mornings, one for all-day ease and one for evenings."
            />
            <div className="eat-guideFeatureStack">
              {featuredItems.map((item, index) => (
                <article key={item.place.slug} className={`eat-guideFeature${index % 2 ? " eat-guideFeature--reverse" : ""}`}>
                  <div className="eat-guideFeatureMedia">
                    <img src={item.image} alt={item.place.name} />
                  </div>
                  <div className="eat-guideFeatureBody">
                    <Text className="eat-guideKicker">{item.eyebrow}</Text>
                    <Title level={2} className="eat-guideFeatureTitle">{item.place.name}</Title>
                    <Text className="eat-guideOneLine">{item.oneLine}</Text>
                    <Paragraph className="eat-guideFeatureCopy">{item.body}</Paragraph>
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
              intro="The page's only table. Use it when you want to compare the strongest names quickly before reading the fuller recommendations below."
            />
            <div className="eat-quickRefWrap">
              <table className="eat-quickRefTable">
                <thead>
                  <tr>
                    <th>Venue</th>
                    <th>Breakfast</th>
                    <th>Lunch</th>
                    <th>Dinner</th>
                    <th>Coffee</th>
                    <th>Work-Friendly</th>
                    <th>Sunset</th>
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
                      <td><QuickReferenceTick value={row.breakfast} /></td>
                      <td><QuickReferenceTick value={row.lunch} /></td>
                      <td><QuickReferenceTick value={row.dinner} /></td>
                      <td><QuickReferenceTick value={row.coffee} /></td>
                      <td><QuickReferenceTick value={row.work} /></td>
                      <td><QuickReferenceTick value={row.sunset} /></td>
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
            <SectionHeader number="04" label="The Coffee Trail" intro={COFFEE_TRAIL_INTRO} />
            <div className="eat-guideGrid eat-guideGrid--medium">
              {coffeeTrailItems.map((item) => (
                <article key={item.place.slug} className="eat-guideTile">
                  <div className="eat-guideTileMedia">
                    <img src={item.image} alt={item.place.name} />
                  </div>
                  <div className="eat-guideTileBody">
                    <Title level={3} className="eat-guideTileTitle">{item.place.name}</Title>
                    <Text className="eat-guideOneLine">{item.oneLine}</Text>
                    <Paragraph className="eat-guideTileCopy">{item.body}</Paragraph>
                    <EditorialLinks websiteUrl={item.websiteUrl} instagramUrl={item.instagramUrl} directionsUrl={item.directionsUrl} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="eat-guideSection">
            <SectionHeader number="05" label="Long Lunches" intro={LONG_LUNCHES_INTRO} />
            <div className="eat-guideRowList">
              {lunchItems.map((item) => (
                <article key={item.place.slug} className="eat-guideRow">
                  <div className="eat-guideRowMedia">
                    <img src={item.image} alt={item.place.name} />
                  </div>
                  <div className="eat-guideRowBody">
                    <Title level={3} className="eat-guideRowTitle">{item.place.name}</Title>
                    <Text className="eat-guideOneLine">{item.oneLine}</Text>
                    <Paragraph className="eat-guideRowCopy">{item.body}</Paragraph>
                    <EditorialLinks websiteUrl={item.websiteUrl} instagramUrl={item.instagramUrl} directionsUrl={item.directionsUrl} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="eat-guideSection">
            <SectionHeader number="06" label="Where Locals Eat" intro={LOCALS_INTRO} />
            <div className="eat-guideLocalList">
              {localItems.map((item) => (
                <article key={item.place.slug} className="eat-guideLocalItem">
                  <div className="eat-guideLocalMedia">
                    <img src={item.image} alt={item.place.name} />
                  </div>
                  <div className="eat-guideLocalBody">
                    <Title level={3} className="eat-guideTileTitle">{item.place.name}</Title>
                    <Text className="eat-guideOneLine">{item.oneLine}</Text>
                    <Paragraph className="eat-guideTileCopy">{item.body}</Paragraph>
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
            <SectionHeader number="07" label="Where To Work" intro={WORK_INTRO} />
            <div className="eat-guideGrid eat-guideGrid--work">
              {workItems.map((item) => (
                <article key={item.place.slug} className="eat-guideWorkCard">
                  <div className="eat-guideWorkMedia">
                    <img src={item.image} alt={item.place.name} />
                  </div>
                  <div className="eat-guideWorkBody">
                    <Title level={3} className="eat-guideTileTitle">{item.place.name}</Title>
                    <Text className="eat-guideOneLine">{item.oneLine}</Text>
                    <Paragraph className="eat-guideTileCopy">{item.body}</Paragraph>
                    <EditorialLinks websiteUrl={item.websiteUrl} instagramUrl={item.instagramUrl} directionsUrl={item.directionsUrl} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="eat-guideSection">
            <SectionHeader number="08" label="Sunset Drinks" intro={SUNSET_INTRO} />
            <div className="eat-guidePanorama">
              <div className="eat-guidePanoramaMedia">
                <img src={SUNSET_IMAGE} alt="Sunset drinks in Ahangama" />
              </div>
              <div className="eat-guidePanoramaList">
                {sunsetItems.map((item) => (
                  <article key={item.place.slug} className="eat-guidePanoramaItem">
                    <Title level={3} className="eat-guidePanoramaTitle">{item.place.name}</Title>
                    <Text className="eat-guideOneLine">{item.oneLine}</Text>
                    <Paragraph className="eat-guideTileCopy">{item.body}</Paragraph>
                    <EditorialLinks websiteUrl={item.websiteUrl} instagramUrl={item.instagramUrl} directionsUrl={item.directionsUrl} />
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="eat-guidePullQuote" aria-hidden="true">
            <blockquote>{PULL_QUOTES[2]}</blockquote>
          </section>

          <section className="eat-guideSection">
            <SectionHeader number="09" label="Date Night" intro={DATE_NIGHT_INTRO} />
            <div className="eat-guideGrid eat-guideGrid--medium">
              {dateNightItems.map((item) => (
                <article key={item.place.slug} className="eat-guideTile eat-guideTile--story">
                  <div className="eat-guideTileMedia">
                    <img src={item.image} alt={item.place.name} />
                  </div>
                  <div className="eat-guideTileBody">
                    <Title level={3} className="eat-guideTileTitle">{item.place.name}</Title>
                    <Text className="eat-guideOneLine">{item.oneLine}</Text>
                    <Paragraph className="eat-guideTileCopy">{item.body}</Paragraph>
                    <EditorialLinks websiteUrl={item.websiteUrl} instagramUrl={item.instagramUrl} directionsUrl={item.directionsUrl} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="eat-guideSection eat-guideSection--directory">
            <SectionHeader
              number="10"
              label="Explore All Places"
              intro="The directory comes last. Use it when you already understand the character of the town and want to narrow down the exact fit."
            />
            <div className="eat-guideDirectoryControls">
              <div className="eat-guideDirectorySearch">
                <Input
                  placeholder="Search places, moods or areas"
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
                <Empty description="No places match that search yet." />
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
              intro="The food chapter should lead naturally into the rest of the town: where to stay, how to reset, what is opening, and who is shaping the place."
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
