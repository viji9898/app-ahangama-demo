import React from "react";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { PLACES } from "../data/places";
import { shouldShowPlace } from "../data/placeStatus";
import { AHANGAMA_SRI_LANKA_PAGE } from "../data/ahangamaSriLankaPage";
import "../styles/ahangama-sri-lanka.css";

export const AHANGAMA_SRI_LANKA_PATH = "/ahangama-sri-lanka";

const HERO_IMAGE =
  "/12 Experiences Images /Why Ahangama Might Be Sri Lanka_s Most Interesting Coastal Town Right Now/Hero Image - Opening note.webp";
const SURF_IMAGE =
  "/12 Experiences Images /Why Ahangama Might Be Sri Lanka_s Most Interesting Coastal Town Right Now/Surf Culture.jpg";
const INLAND_IMAGE =
  "/12 Experiences Images /Why Ahangama Works Best When You Explore It Slowly/Section 2 - Ahangama_kabalana_beach_football.webp";
const publishDate = "2026-09-02T09:00:00.000Z";

const NEXT_ARTICLE = {
  href: "/getting-around-ahangama-scooters-tuk-tuks-airport-transfers",
  kicker: "Plan the details",
  title: "Getting Around Ahangama",
  image:
    "/12 Experiences Images /Getting around Ahangama/Section 3 - Tuk Tuk Rides.jpg",
};

const surfLevels = [
  {
    title: "Learning",
    text: "Kabalana's shoreward whitewater can work for first sessions on the right day. Use a reputable instructor who can choose a safe zone for the tide and swell.",
  },
  {
    title: "Progressing",
    text: "Marshmallows is often discussed as a more forgiving reef wave, but it is still a reef break. Suitability changes daily and local guidance matters.",
  },
  {
    title: "Experienced",
    text: "The Rock, Sticks and Devil's Island are consequential reef breaks. Entry, current, crowd and reef knowledge should determine whether you paddle out.",
  },
];

const faqs = [
  [
    "Is Ahangama worth visiting?",
    "Yes, particularly if you want surf, independent food, small hotels and a more dispersed town than a conventional beach resort. It is less suitable if you want one pedestrian promenade with everything together.",
  ],
  [
    "What is Ahangama best known for?",
    "Surf breaks, Kabalana Beach, a strong café and restaurant scene, boutique stays, wellness spaces and the contrast between the coast road and quiet inland lanes.",
  ],
  [
    "Which Ahangama beach is best for swimming?",
    "There is no beach that is reliably safest every day. Secret Beach and the small central bay may feel sheltered in suitable conditions, but tide, swell and currents change. Ask locally before entering.",
  ],
  [
    "Is Ahangama suitable for beginner surfers?",
    "It can be, with an instructor who selects the break and timing for the day's conditions. Many named breaks are reefs and are not beginner waves.",
  ],
  [
    "When is the best time to visit Ahangama?",
    "December to March is the usual south-coast high season. April is a transition month, while rain, surf and business schedules vary throughout the year.",
  ],
  [
    "How many days should you spend in Ahangama?",
    "Three or four days covers an introduction; a week gives you time for surf, food, inland exploration and a day trip without compressing every day.",
  ],
  [
    "How do you get to Ahangama from Colombo or the airport?",
    "The coastal railway and south-coast buses connect from Colombo, while a private driver is the simplest door-to-door option from the airport. Check current railway and road conditions before travel.",
  ],
  [
    "Is Ahangama better than Weligama or Mirissa?",
    "Choose Ahangama for a spread-out mix of surf, food and boutique stays; Weligama for its broad beginner-oriented bay and transport links; Mirissa for a denser beach-holiday atmosphere.",
  ],
  [
    "Can you get around Ahangama without a scooter?",
    "Yes. Tuk-tuks cover most local trips and parts of central Ahangama are walkable, though the main road is busy and the town's key areas are spread out.",
  ],
  [
    "Should first-time visitors stay in Kabalana or central Ahangama?",
    "Kabalana suits beach-first trips. Central Ahangama is more convenient for cafés, dinner, the railway station and moving between the north and south of town.",
  ],
];

function resolveVenues(ids, groupName) {
  return ids
    .map((id) => {
      const place = PLACES.find(
        (candidate) =>
          candidate.id === id && candidate.destinationSlug === "ahangama",
      );

      if ((!place || !shouldShowPlace(place)) && import.meta.env.DEV) {
        console.warn(`[Ahangama guide] Omitted ${groupName} venue: ${id}`);
      }

      return place && shouldShowPlace(place) ? place : null;
    })
    .filter(Boolean);
}

function venueHref(place) {
  if (place.category === "shops-essentials") return `/retail/${place.slug}`;
  if (place.category === "co-working") return `/co-working/${place.slug}`;
  if (place.category === "experiences") return `/experiences/${place.slug}`;
  return `/${place.category}/${place.slug}`;
}

function VenueGrid({ venues }) {
  return (
    <div className="asl-venueGrid">
      {venues.map((place) => (
        <a className="asl-venue" href={venueHref(place)} key={place.id}>
          <img src={place.image || place.ogImage} alt={`${place.name} in Ahangama`} />
          <div className="asl-venueCopy">
            <span>{place.area}</span>
            <h3>{place.name}</h3>
            <p>{place.description}</p>
          </div>
        </a>
      ))}
    </div>
  );
}

export default function AhangamaSriLankaPage() {
  const canonical = absUrl(AHANGAMA_SRI_LANKA_PATH);
  const eatVenues = resolveVenues(
    AHANGAMA_SRI_LANKA_PAGE.venueGroups.eat,
    "eat",
  );
  const stayVenues = resolveVenues(
    AHANGAMA_SRI_LANKA_PAGE.venueGroups.stay,
    "stay",
  );
  const shopVenues = resolveVenues(
    AHANGAMA_SRI_LANKA_PAGE.venueGroups.shop,
    "shop",
  );

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Ahangama, Sri Lanka: Beaches, Surf, Food & Stays"
        description="Plan your time in Ahangama with a locally curated guide to beaches, surf breaks, restaurants, boutique stays, shops, events and practical travel advice."
        canonical={canonical}
        ogImage={absUrl(HERO_IMAGE)}
        ogType="article"
        author="Ahangama Guide Editorial Team"
        publishDate={publishDate}
      />

      <main className="asl-page">
        <header className="asl-hero">
          <img src={HERO_IMAGE} alt="The coast and tropical landscape around Ahangama, Sri Lanka" />
          <div className="asl-heroContent">
            <span className="asl-eyebrow">South coast field guide</span>
            <h1>Ahangama, Sri Lanka: The Local Guide</h1>
            <p className="asl-standfirst">
              A practical introduction to a compact south-coast town where surf,
              independent food, small hotels, wellness and village life overlap.
            </p>
            <nav className="asl-actions" aria-label="Guide actions">
              <a className="asl-action" href="/guide">Explore places</a>
              <a className="asl-action" href="/map">Open map</a>
              <a className="asl-action" href="/pass-perks">Get the Ahangama Pass</a>
            </nav>
          </div>
        </header>

        <section className="asl-section">
          <div className="asl-inner">
            <div className="asl-sectionHead">
              <h2>Why Ahangama</h2>
              <p>
                Ahangama rewards visitors who like a place with several centres of
                gravity. The coast moves between exposed surf, small coves and
                sunset stops; a few turns inland lead to gardens, paddy fields and
                quieter stays. Its appeal is the overlap, not a single attraction.
              </p>
            </div>
            <div className="asl-grid">
              {[
                ["Location", "Between Galle and Weligama on Sri Lanka's south coast."],
                ["Usual high season", "December to March, with weather and surf never guaranteed."],
                ["A useful first stay", "Three to seven days, depending on surf and day-trip plans."],
                ["Best for", "Surf, food, design-led stays, wellness and slower local exploration."],
              ].map(([title, text]) => (
                <article className="asl-card" key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="asl-section asl-section--mist">
          <div className="asl-inner">
            <div className="asl-sectionHead">
              <h2>Choose your area</h2>
              <p>
                Ahangama stretches along a busy coast road and into quieter inland
                lanes. Where you stay changes whether the beach, dinner or calm is
                easiest to reach.
              </p>
            </div>
            <div className="asl-grid">
              {AHANGAMA_SRI_LANKA_PAGE.areas.map((area) => (
                <article className="asl-card" key={area.id}>
                  <div className="asl-tags">
                    {area.goFor.map((item) => <span className="asl-tag" key={item}>{item}</span>)}
                  </div>
                  <h3>{area.name}</h3>
                  <p>{area.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="asl-section asl-section--ink">
          <div className="asl-inner">
            <div className="asl-sectionHead">
              <h2>Ahangama beaches</h2>
              <p>
                The beach experience changes by tide, swell and seasonal sand
                movement. Treat these as area guides, not daily safety advice.
              </p>
            </div>
            <div className="asl-beaches">
              {AHANGAMA_SRI_LANKA_PAGE.beaches.map((beach) => (
                <article className="asl-beach" key={beach.id}>
                  <h3>{beach.name}</h3>
                  <strong>Go for</strong><p>{beach.goFor}</p>
                  <strong>Know before you go</strong><p>{beach.know}</p>
                </article>
              ))}
            </div>
            <img className="asl-featureImage" src={INLAND_IMAGE} alt="People playing beside the beach at Kabalana, Ahangama" />
          </div>
        </section>

        <section className="asl-section">
          <div className="asl-inner">
            <div className="asl-sectionHead">
              <h2>Ahangama surf</h2>
              <p>
                Ahangama has beach and reef waves within a short coastal stretch,
                but labels such as beginner or intermediate only describe a rough
                tendency. The day's conditions decide the real level.
              </p>
            </div>
            <div className="asl-surfGrid">
              {surfLevels.map((level) => (
                <article className="asl-card" key={level.title}>
                  <h3>{level.title}</h3><p>{level.text}</p>
                </article>
              ))}
            </div>
            <div className="asl-callout" style={{ color: "#33443a", background: "#eef1eb" }}>
              Conditions change daily. Beginners should use a reputable local
              instructor; reef breaks require local knowledge. Respect line-up
              etiquette, access routes and working fishing activity.
            </div>
            <img className="asl-featureImage" src={SURF_IMAGE} alt="Surfer walking along the coast in Ahangama" />
          </div>
        </section>

        <section className="asl-section asl-section--mist">
          <div className="asl-inner">
            <div className="asl-sectionHead">
              <h2>Where to eat and drink</h2>
              <p>
                Build days by occasion rather than chasing a definitive list:
                breakfast near Kabalana, coffee in town, a lighter lunch, then a
                social dinner farther south. These active listings pull their
                current names, descriptions, areas and images from our places data.
              </p>
            </div>
            <VenueGrid venues={eatVenues} />
            <div className="asl-linkRow"><a href="/eat">See all Ahangama restaurants</a></div>
          </div>
        </section>

        <section className="asl-section">
          <div className="asl-inner">
            <div className="asl-sectionHead">
              <h2>Beyond surfing</h2>
              <p>
                Follow inland lanes through tropical gardens and working paddy
                landscapes, book a wellness session, browse independent shops or
                make a half-day visit to Handunugoda Tea Estate. Tour access, fees
                and hours should be checked directly before setting out.
              </p>
            </div>
            <div className="asl-grid">
              <article className="asl-card"><h3>Inland</h3><p>Walk, cycle or ride slowly, keeping noise down around homes, farms and working land.</p></article>
              <article className="asl-card"><h3>Tea</h3><p>Handunugoda offers an introduction to southern tea production; confirm current visitor arrangements.</p></article>
              <article className="asl-card"><h3>Wellness</h3><p>Yoga, movement, recovery and treatments are spread across the coast and inland areas.</p></article>
              <article className="asl-card"><h3>What's on</h3><p>Markets, music and one-off sessions change weekly, making the live calendar more useful than fixed copy.</p></article>
            </div>
            {shopVenues.length > 0 && <><h3 style={{ marginTop: 46 }}>Independent shopping</h3><VenueGrid venues={shopVenues} /></>}
            <div className="asl-linkRow"><a href="/events">View current events</a><a href="/wellness">Explore wellness</a><a href="/retail">Browse shops</a></div>
          </div>
        </section>

        <section className="asl-section asl-section--mist">
          <div className="asl-inner">
            <div className="asl-sectionHead">
              <h2>Where to stay in Ahangama</h2>
              <p>
                Choose by setting and daily rhythm, not a fixed price label. A
                Kabalana base suits beach-first visits; central and southern stays
                shorten evening journeys; inland properties trade immediacy for calm.
              </p>
            </div>
            <VenueGrid venues={stayVenues} />
            <div className="asl-linkRow"><a href="/stays">See all Ahangama stays</a></div>
          </div>
        </section>

        <section className="asl-section">
          <div className="asl-inner">
            <div className="asl-sectionHead">
              <h2>Day trips</h2>
              <p>Three useful contrasts sit along the same south-coast corridor. Travel times vary considerably with traffic and train schedules.</p>
            </div>
            <div className="asl-dayTrips">
              <article className="asl-card"><h3>Galle Fort</h3><p>Walkable historic streets, museums, galleries, shops and food inside the fortified old town.</p></article>
              <article className="asl-card"><h3>Weligama</h3><p>A broad bay associated with beginner surf, plus stronger transport connections.</p></article>
              <article className="asl-card"><h3>Mirissa</h3><p>A denser beach destination with its own restaurant scene and visitor activities.</p></article>
            </div>
          </div>
        </section>

        <section className="asl-section asl-section--ink">
          <div className="asl-inner">
            <div className="asl-sectionHead">
              <h2>Plan your trip</h2>
              <p>Keep arrangements flexible enough for weather, surf and the realities of the coast road.</p>
            </div>
            <div className="asl-planGrid">
              <article className="asl-card"><h3>When to come</h3><p className="asl-prose">December through March is the usual high season. April often brings more variable weather; no month guarantees dry days or a particular wave.</p></article>
              <article className="asl-card"><h3>Getting here</h3><p className="asl-prose">Use the coastal train or public bus from Colombo, or arrange a private driver for the simplest airport transfer. Check current schedules before departure.</p></article>
              <article className="asl-card"><h3>Getting around</h3><p className="asl-prose">Tuk-tuks are practical for local hops. Scooters and bicycles require confidence in traffic, while walking conditions on the main road vary.</p></article>
            </div>
            <div className="asl-linkRow"><a style={{ color: "#e7b85c" }} href="/getting-around-ahangama-scooters-tuk-tuks-airport-transfers">Read the transport guide</a><a style={{ color: "#e7b85c" }} href="/map">Open the Ahangama map</a><a style={{ color: "#e7b85c" }} href="/pass-perks">See Pass perks</a></div>
          </div>
        </section>

        <section className="asl-section asl-faq">
          <div className="asl-inner">
            <div className="asl-sectionHead"><h2>Frequently asked</h2><p>Short answers for first-time planning. For surf and swimming, same-day local advice takes priority.</p></div>
            {faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
          </div>
        </section>
      </main>

      <EditorialNextArticle {...NEXT_ARTICLE} />
    </SiteLayout>
  );
}