import React, { useMemo } from "react";
import { Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { usePlaces } from "../app/placesContext";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { shouldShowPlace } from "../data/placeStatus";

const { Paragraph, Text, Title } = Typography;

const HERO_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/maria_bonita.jpg";
const SUNSET_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/lighthouse.jpg";

const INTRO_COPY =
  "Ahangama's dining scene has grown from a handful of surf-town cafes into one of the south coast's most enjoyable places to eat. The best addresses still feel relaxed, but the quality is sharper, the rooms are better designed and there is now enough range to shape a whole trip around breakfast, lunch and sunset drinks. These are the places we come back to again and again.";

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

const BREAKFAST_CONFIG = [
  {
    slug: "kaffi-ag",
    oneLine: "The dependable early-morning default.",
    body:
      "For the days when you want your breakfast stop to be quick, central and familiar, Kaffi remains one of the easiest answers in town.",
  },
  {
    slug: "veda-cafe",
    oneLine: "Fresh, bright and built for slower starts.",
    body:
      "Veda works well when the morning calls for something lighter and greener, with the sort of menu that suits Ahangama's health-conscious rhythm.",
  },
  {
    slug: "sisters-kabalana",
    oneLine: "Best before or after a Kabalana surf.",
    body:
      "Beach-adjacent and always well-positioned, Sisters fits naturally into a pre-surf breakfast or a second coffee after the session.",
  },
  {
    slug: "fruit-cafe-ahangama",
    oneLine: "For lighter bowls and warm-weather appetites.",
    body:
      "Fruit Cafe is the place for fresh, straightforward breakfasts that feel especially right on hotter days when you want something clean and unfussy.",
  },
  {
    slug: "living",
    oneLine: "A homey room for brunch rather than a rush.",
    body:
      "Living Room Concept Store has the softness and comfort of a place where breakfast can easily drift towards an early lunch.",
  },
];

const WORK_CONFIG = [
  {
    slug: "kaffi-ag",
    oneLine: "Best for short laptop sessions between meetings.",
    body:
      "Kaffi is useful when you need a table, a coffee and an hour of focus without committing to a whole day of work.",
  },
  {
    slug: "focus-hub",
    oneLine: "The closest thing Ahangama has to a dedicated work address.",
    body:
      "If work is the point rather than an afterthought, Focus Hub is the cleanest answer: purpose-built, practical and easy to recommend.",
  },
  {
    slug: "veda-cafe",
    oneLine: "A calmer option for emails and a healthy lunch.",
    body:
      "Veda suits lighter working days when you want a pleasant room, natural light and something better than a rushed desk lunch.",
  },
  {
    slug: "maria-bonita-sri-lanka",
    oneLine: "For work that benefits from a slower, more social backdrop.",
    body:
      "Maria Bonita is good for creative work, casual meetings and afternoons where concentration shares space with conversation.",
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
    slug: "citra-ahangama",
    oneLine: "A good choice when you want a proper meal and a settled room.",
    body:
      "Citra's appeal is its steadiness. It works for friends in town, mixed groups and lunches where the table matters almost as much as the food.",
  },
  {
    slug: "donna-ahangama",
    oneLine: "More polished than casual, but never stiff.",
    body:
      "Donna earns its place on this list because it knows how to make a meal feel occasion-worthy even in the middle of the day.",
  },
  {
    slug: "patels-ahangama",
    oneLine: "A straightforward lunch that people return to often.",
    body:
      "Petals belongs in the guide for the simple reason that repeat custom matters. It is easy, familiar and genuinely useful to know about.",
  },
];

const SUNSET_CONFIG = [
  {
    slug: "lighthouse",
    oneLine: "For sea-facing golden hour and a slower final hour of the day.",
    body:
      "Lighthouse is less about a single order and more about what happens once the light starts to soften. Come for the view, stay until the sky has fully turned.",
  },
  {
    slug: "ceylon-sliders",
    oneLine: "Casual, social and easy to fold into the evening.",
    body:
      "Ceylon Sliders suits the kind of sunset plan that slides naturally into dinner, especially when you want something lively rather than hushed.",
  },
  {
    slug: "hakuna-matata-ahangama",
    oneLine: "An easy crowd-pleaser for drinks near the junction.",
    body:
      "Hakuna Matata is best treated as a comfortable, no-fuss stop for groups, familiar faces and evenings that do not need much planning.",
  },
];

const DATE_NIGHT_CONFIG = [
  {
    slug: "donna-ahangama",
    oneLine: "The most obviously date-worthy room in the guide.",
    body:
      "Donna is where we would send people who want Ahangama to feel a little more dressed up. It has enough softness and composure to carry the evening.",
  },
  {
    slug: "iluk-ahangama",
    oneLine: "For dinners that feel quieter and more deliberate.",
    body:
      "Iluk makes sense when the night is about conversation rather than scene. It is the kind of place that rewards arriving with time.",
  },
  {
    slug: "citra-ahangama",
    oneLine: "Less overtly romantic, but reliably good for a long evening.",
    body:
      "Citra works for date night precisely because it avoids trying too hard. The atmosphere is easy, leaving plenty of room for the company to do the work.",
  },
];

const LOCALS_CONFIG = [
  {
    slug: "patels-ahangama",
    oneLine: "A practical local favourite with staying power.",
    body:
      "Places like Petals matter because they are woven into the everyday life of the town. Not every recommendation needs to feel newly discovered.",
  },
  {
    slug: "fruit-cafe-ahangama",
    oneLine: "The sort of healthy stop people build into their weekly rhythm.",
    body:
      "Fruit Cafe has the lightness and repeatability that makes a venue genuinely useful, not merely photogenic.",
  },
  {
    slug: "living",
    oneLine: "A comfortable room that feels part cafe, part neighbourhood fixture.",
    body:
      "Living Room Concept Store earns its place here because it feels lived-in, sociable and more embedded in the town than trend-led spots often do.",
  },
  {
    slug: "hakuna-matata-ahangama",
    oneLine: "Still one of the easier places for casual group meals.",
    body:
      "There is value in a place that works without needing explanation, and Hakuna Matata continues to fill that role for plenty of people in Ahangama.",
  },
];

const QUICK_REFERENCE_ROWS = [
  {
    slug: "kaffi-ag",
    breakfast: true,
    lunch: false,
    dinner: false,
    coffee: true,
    work: true,
    pass: true,
  },
  {
    slug: "veda-cafe",
    breakfast: true,
    lunch: true,
    dinner: false,
    coffee: true,
    work: true,
    pass: true,
  },
  {
    slug: "maria-bonita-sri-lanka",
    breakfast: true,
    lunch: true,
    dinner: false,
    coffee: true,
    work: true,
    pass: true,
  },
  {
    slug: "focus-hub",
    breakfast: false,
    lunch: false,
    dinner: false,
    coffee: true,
    work: true,
    pass: true,
  },
  {
    slug: "citra-ahangama",
    breakfast: false,
    lunch: true,
    dinner: true,
    coffee: false,
    work: false,
    pass: true,
  },
  {
    slug: "donna-ahangama",
    breakfast: false,
    lunch: true,
    dinner: true,
    coffee: false,
    work: false,
    pass: true,
  },
  {
    slug: "patels-ahangama",
    breakfast: false,
    lunch: true,
    dinner: true,
    coffee: false,
    work: false,
    pass: true,
  },
  {
    slug: "ceylon-sliders",
    breakfast: false,
    lunch: false,
    dinner: true,
    coffee: false,
    work: false,
    pass: true,
  },
  {
    slug: "lighthouse",
    breakfast: false,
    lunch: false,
    dinner: true,
    coffee: false,
    work: false,
    pass: true,
  },
  {
    slug: "fruit-cafe-ahangama",
    breakfast: true,
    lunch: true,
    dinner: false,
    coffee: false,
    work: false,
    pass: true,
  },
];

function getInternalPath(place) {
  if (!place?.slug) {
    return null;
  }

  if (place.category === "eat") {
    return `/eat/${place.slug}`;
  }

  if (place.category === "stays") {
    return `/stays/${place.slug}`;
  }

  if (place.category === "wellness") {
    return `/wellness/${place.slug}`;
  }

  if (place.category === "retail") {
    return `/retail/${place.slug}`;
  }

  return null;
}

function getPlaceImage(place, fallback = HERO_IMAGE) {
  return place?.image || place?.ogImage || place?.logo || fallback;
}

function getInstagramUrl(place) {
  if (!place?.instagram) {
    return null;
  }

  return `https://www.instagram.com/${String(place.instagram).replace(/^@/, "")}/`;
}

function getDirectionsUrl(place) {
  if (place?.mapUrl) {
    return place.mapUrl;
  }

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
      if (!place) {
        return null;
      }

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

function EditorialLinks({ websiteUrl, instagramUrl, directionsUrl }) {
  return (
    <div className="eat-guideLinks">
      {websiteUrl ? (
        <a href={websiteUrl} className="eat-guideLink">
          Website
        </a>
      ) : null}
      {instagramUrl ? (
        <a href={instagramUrl} className="eat-guideLink" target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      ) : null}
      {directionsUrl ? (
        <a href={directionsUrl} className="eat-guideLink" target="_blank" rel="noopener noreferrer">
          Directions
        </a>
      ) : null}
    </div>
  );
}

function QuickReferenceTick({ value }) {
  return <span className={`eat-quickRefTick${value ? " is-active" : ""}`}>{value ? "✓" : "-"}</span>;
}

export default function EatIndex() {
  const { places: allPlaces } = usePlaces();

  const places = useMemo(
    () => allPlaces.filter((place) => place.destinationSlug === "ahangama").filter((place) => shouldShowPlace(place)),
    [allPlaces],
  );

  const placesBySlug = useMemo(() => new Map(places.map((place) => [place.slug, place])), [places]);

  const featuredItems = useMemo(() => buildSectionItems(placesBySlug, FEATURED_CONFIG), [placesBySlug]);
  const breakfastItems = useMemo(() => buildSectionItems(placesBySlug, BREAKFAST_CONFIG), [placesBySlug]);
  const workItems = useMemo(() => buildSectionItems(placesBySlug, WORK_CONFIG), [placesBySlug]);
  const lunchItems = useMemo(() => buildSectionItems(placesBySlug, LONG_LUNCH_CONFIG), [placesBySlug]);
  const sunsetItems = useMemo(() => buildSectionItems(placesBySlug, SUNSET_CONFIG), [placesBySlug]);
  const dateNightItems = useMemo(() => buildSectionItems(placesBySlug, DATE_NIGHT_CONFIG), [placesBySlug]);
  const localItems = useMemo(() => buildSectionItems(placesBySlug, LOCALS_CONFIG), [placesBySlug]);

  const quickReferenceRows = useMemo(
    () => QUICK_REFERENCE_ROWS.map((row) => ({ ...row, place: placesBySlug.get(row.slug) })).filter((row) => row.place),
    [placesBySlug],
  );

  const canonical = absUrl("/eat");

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
        description="A Monocle-inspired editorial guide to where to eat in Ahangama, from breakfasts and work cafes to long lunches, sunsets and local favourites."
        canonical={canonical}
        ogImage={featuredItems[0]?.image || HERO_IMAGE}
        jsonLd={itemListJsonLd}
      />

      <div className="dm-canvas eat-guideCanvas">
        <div className="dm-wrap eat-guideWrap">
          <section className="eat-guideHero">
            <div className="eat-guideHeroCopy">
              <Text className="eat-guideEyebrow">Ahangama / Food Guide</Text>
              <Title level={1} className="eat-guideHeroTitle">
                Eats
              </Title>
              <Paragraph className="eat-guideHeroIntro">{INTRO_COPY}</Paragraph>
            </div>

            <div className="eat-guideHeroMedia">
              <img src={HERO_IMAGE} alt="Editorial food guide hero for Ahangama" />
            </div>
          </section>

          <section className="eat-guideSection">
            <div className="eat-guideSectionHead">
              <Text className="eat-guideSectionNumber">1</Text>
              <div>
                <Text className="eat-guideSectionLabel">Editor's Picks</Text>
                <Paragraph className="eat-guideSectionIntro">
                  Three places that explain Ahangama's food scene best right now: one for mornings, one for all-day ease and one for evenings.
                </Paragraph>
              </div>
            </div>

            <div className="eat-guideFeatureStack">
              {featuredItems.map((item, index) => (
                <article key={item.place.slug} className={`eat-guideFeature${index % 2 ? " eat-guideFeature--reverse" : ""}`}>
                  <div className="eat-guideFeatureMedia">
                    <img src={item.image} alt={item.place.name} />
                  </div>
                  <div className="eat-guideFeatureBody">
                    <Text className="eat-guideKicker">{item.eyebrow}</Text>
                    <Title level={2} className="eat-guideFeatureTitle">
                      {item.place.name}
                    </Title>
                    <Text className="eat-guideOneLine">{item.oneLine}</Text>
                    <Paragraph className="eat-guideFeatureCopy">{item.body}</Paragraph>
                    <EditorialLinks
                      websiteUrl={item.websiteUrl}
                      instagramUrl={item.instagramUrl}
                      directionsUrl={item.directionsUrl}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="eat-guideSection">
            <div className="eat-guideSectionHead">
              <Text className="eat-guideSectionNumber">2</Text>
              <div>
                <Text className="eat-guideSectionLabel">Best Breakfasts</Text>
                <Paragraph className="eat-guideSectionIntro">
                  The addresses worth knowing for first coffee, post-surf fuel and mornings that deserve a little more time.
                </Paragraph>
              </div>
            </div>

            <div className="eat-guideGrid eat-guideGrid--medium">
              {breakfastItems.map((item) => (
                <article key={item.place.slug} className="eat-guideTile">
                  <div className="eat-guideTileMedia">
                    <img src={item.image} alt={item.place.name} />
                  </div>
                  <div className="eat-guideTileBody">
                    <Title level={3} className="eat-guideTileTitle">
                      {item.place.name}
                    </Title>
                    <Text className="eat-guideOneLine">{item.oneLine}</Text>
                    <Paragraph className="eat-guideTileCopy">{item.body}</Paragraph>
                    <EditorialLinks
                      websiteUrl={item.websiteUrl}
                      instagramUrl={item.instagramUrl}
                      directionsUrl={item.directionsUrl}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="eat-guideSection">
            <div className="eat-guideSectionHead">
              <Text className="eat-guideSectionNumber">3</Text>
              <div>
                <Text className="eat-guideSectionLabel">Where To Work</Text>
                <Paragraph className="eat-guideSectionIntro">
                  A practical shortlist for laptop hours, meetings and afternoons that need both coffee and a decent seat.
                </Paragraph>
              </div>
            </div>

            <div className="eat-guideGrid eat-guideGrid--work">
              {workItems.map((item) => (
                <article key={item.place.slug} className="eat-guideWorkCard">
                  <div className="eat-guideWorkMedia">
                    <img src={item.image} alt={item.place.name} />
                  </div>
                  <div className="eat-guideWorkBody">
                    <Title level={3} className="eat-guideTileTitle">
                      {item.place.name}
                    </Title>
                    <Text className="eat-guideOneLine">{item.oneLine}</Text>
                    <Paragraph className="eat-guideTileCopy">{item.body}</Paragraph>
                    <EditorialLinks
                      websiteUrl={item.websiteUrl}
                      instagramUrl={item.instagramUrl}
                      directionsUrl={item.directionsUrl}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="eat-guideSection">
            <div className="eat-guideSectionHead">
              <Text className="eat-guideSectionNumber">4</Text>
              <div>
                <Text className="eat-guideSectionLabel">Long Lunches</Text>
                <Paragraph className="eat-guideSectionIntro">
                  These are the places where lunch works best when you let it become the main event.
                </Paragraph>
              </div>
            </div>

            <div className="eat-guideRowList">
              {lunchItems.map((item) => (
                <article key={item.place.slug} className="eat-guideRow">
                  <div className="eat-guideRowMedia">
                    <img src={item.image} alt={item.place.name} />
                  </div>
                  <div className="eat-guideRowBody">
                    <Title level={3} className="eat-guideRowTitle">
                      {item.place.name}
                    </Title>
                    <Text className="eat-guideOneLine">{item.oneLine}</Text>
                    <Paragraph className="eat-guideRowCopy">{item.body}</Paragraph>
                    <EditorialLinks
                      websiteUrl={item.websiteUrl}
                      instagramUrl={item.instagramUrl}
                      directionsUrl={item.directionsUrl}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="eat-guideSection">
            <div className="eat-guideSectionHead">
              <Text className="eat-guideSectionNumber">5</Text>
              <div>
                <Text className="eat-guideSectionLabel">For Sunset</Text>
                <Paragraph className="eat-guideSectionIntro">
                  Come for the light, then decide whether the evening should stop at drinks or continue into dinner.
                </Paragraph>
              </div>
            </div>

            <div className="eat-guidePanorama">
              <div className="eat-guidePanoramaMedia">
                <img src={SUNSET_IMAGE} alt="Sunset drinks in Ahangama" />
              </div>
              <div className="eat-guidePanoramaList">
                {sunsetItems.map((item) => (
                  <article key={item.place.slug} className="eat-guidePanoramaItem">
                    <Title level={3} className="eat-guidePanoramaTitle">
                      {item.place.name}
                    </Title>
                    <Text className="eat-guideOneLine">{item.oneLine}</Text>
                    <Paragraph className="eat-guideTileCopy">{item.body}</Paragraph>
                    <EditorialLinks
                      websiteUrl={item.websiteUrl}
                      instagramUrl={item.instagramUrl}
                      directionsUrl={item.directionsUrl}
                    />
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="eat-guideSection">
            <div className="eat-guideSectionHead">
              <Text className="eat-guideSectionNumber">6</Text>
              <div>
                <Text className="eat-guideSectionLabel">Date Night</Text>
                <Paragraph className="eat-guideSectionIntro">
                  A smaller, more atmospheric shortlist for dinners where the room matters as much as the reservation.
                </Paragraph>
              </div>
            </div>

            <div className="eat-guideGrid eat-guideGrid--medium">
              {dateNightItems.map((item) => (
                <article key={item.place.slug} className="eat-guideTile eat-guideTile--story">
                  <div className="eat-guideTileMedia">
                    <img src={item.image} alt={item.place.name} />
                  </div>
                  <div className="eat-guideTileBody">
                    <Title level={3} className="eat-guideTileTitle">
                      {item.place.name}
                    </Title>
                    <Text className="eat-guideOneLine">{item.oneLine}</Text>
                    <Paragraph className="eat-guideTileCopy">{item.body}</Paragraph>
                    <EditorialLinks
                      websiteUrl={item.websiteUrl}
                      instagramUrl={item.instagramUrl}
                      directionsUrl={item.directionsUrl}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="eat-guideSection">
            <div className="eat-guideSectionHead">
              <Text className="eat-guideSectionNumber">7</Text>
              <div>
                <Text className="eat-guideSectionLabel">Where Locals Actually Go</Text>
                <Paragraph className="eat-guideSectionIntro">
                  Not every useful recommendation needs to feel discovered. These are the dependable names that stay in regular circulation.
                </Paragraph>
              </div>
            </div>

            <div className="eat-guideLocalList">
              {localItems.map((item) => (
                <article key={item.place.slug} className="eat-guideLocalItem">
                  <div className="eat-guideLocalMedia">
                    <img src={item.image} alt={item.place.name} />
                  </div>
                  <div className="eat-guideLocalBody">
                    <Title level={3} className="eat-guideTileTitle">
                      {item.place.name}
                    </Title>
                    <Text className="eat-guideOneLine">{item.oneLine}</Text>
                    <Paragraph className="eat-guideTileCopy">{item.body}</Paragraph>
                    <EditorialLinks
                      websiteUrl={item.websiteUrl}
                      instagramUrl={item.instagramUrl}
                      directionsUrl={item.directionsUrl}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="eat-guideSection eat-guideSection--reference">
            <div className="eat-guideSectionHead">
              <Text className="eat-guideSectionNumber">8</Text>
              <div>
                <Text className="eat-guideSectionLabel">Quick Reference</Text>
                <Paragraph className="eat-guideSectionIntro">
                  The only directory-style part of the page: a fast scan for what each venue is best at.
                </Paragraph>
              </div>
            </div>

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
                      <td><QuickReferenceTick value={row.pass} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}