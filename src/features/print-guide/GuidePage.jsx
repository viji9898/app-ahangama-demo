import React from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  COMMERCIAL_LABELS,
  GUIDE_PLACES_BY_SLUG,
  GUIDE_SECTIONS,
} from "./guideData";
import { formatCurrency } from "./guideUtils";

function getVenues(page) {
  return (page.content.venueSlugs || [])
    .map((slug) => GUIDE_PLACES_BY_SLUG.get(slug))
    .filter(Boolean);
}

function PageFurniture({ page, inverse = false }) {
  return (
    <footer className={`pg-page-furniture${inverse ? " is-inverse" : ""}`}>
      <span>AHANGAMA GUIDE · 2026/27</span>
      <span>{String(page.pageNumber).padStart(2, "0")}</span>
    </footer>
  );
}

function EditorialLabel({ page, inverse = false }) {
  return (
    <span className={`pg-editorial-label${inverse ? " is-inverse" : ""}`}>
      {GUIDE_SECTIONS[page.section]?.label || page.section}
    </span>
  );
}

function CoverPage({ page }) {
  return (
    <div className="pg-template pg-cover">
      <img src={page.content.image} alt="Ahangama coast" />
      <div className="pg-cover-shade" />
      <div className="pg-cover-copy">
        <span>Independent · Local · South Coast</span>
        <h1>{page.content.headline}</h1>
        <p>{page.content.subheadline}</p>
      </div>
      <span className="pg-cover-edition">A5 FIELD GUIDE · ISSUE 01</span>
    </div>
  );
}

function IntroductionPage({ page }) {
  return (
    <div className="pg-template pg-introduction pg-safe-area">
      <EditorialLabel page={page} />
      <h1>{page.content.headline}</h1>
      <p className="pg-standfirst">{page.content.subheadline}</p>
      <div className="pg-intro-rule" />
      <p className="pg-body-copy">{page.content.body}</p>
      <p className="pg-body-copy">
        This guide is edited for travellers who would rather know a place than
        simply pass through it. Carry it, mark it, and let it lead you off the
        main road.
      </p>
      <div className="pg-signoff">The Ahangama.com editors</div>
      <PageFurniture page={page} />
    </div>
  );
}

function ContentsPage({ page }) {
  const sections = [
    ["10", "Stay"],
    ["18", "Eat & Drink"],
    ["30", "Beaches & Surf"],
    ["36", "Experiences"],
    ["44", "Wellness"],
    ["50", "Shopping & Local"],
    ["54", "Field Notes"],
    ["58", "Maps & Essentials"],
  ];
  return (
    <div className="pg-template pg-contents pg-safe-area">
      <EditorialLabel page={page} />
      <h1>{page.content.headline}</h1>
      <div className="pg-contents-list">
        {sections.map(([number, title]) => (
          <div key={title}>
            <span>{number}</span>
            <strong>{title}</strong>
          </div>
        ))}
      </div>
      <p>{page.content.subheadline}</p>
      <PageFurniture page={page} />
    </div>
  );
}

function HowToUsePage({ page }) {
  const bestForTags = ["Breakfast", "Sunset", "Date night", "Families", "Surf", "Rainy day"];

  return (
    <div className="pg-template pg-how-to-use pg-safe-area">
      <EditorialLabel page={page} />
      <span className="pg-how-to-kicker">How to use this guide</span>
      <h1>{page.content.headline}</h1>
      <p className="pg-standfirst">{page.content.subheadline}</p>
      <div className="pg-how-to-grid">
        <article className="pg-how-to-item">
          <span className="pg-how-to-number">01</span>
          <div>
            <h2>Guide number</h2>
            <p>Every featured place receives a number.</p>
            <strong className="pg-guide-number-example">#027 <b>Petals</b></strong>
            <small>The same number appears in recommendations, the directory and maps.</small>
          </div>
        </article>
        <article className="pg-how-to-item">
          <span className="pg-how-to-number">02</span>
          <div>
            <h2>Editor's pick</h2>
            <p className="pg-editors-pick"><b aria-hidden="true">★</b> Editor's pick</p>
            <small>Places we particularly recommend. This designation cannot be purchased.</small>
          </div>
        </article>
        <article className="pg-how-to-item">
          <span className="pg-how-to-number">03</span>
          <div>
            <h2>Price</h2>
            <p className="pg-price-key"><b>$</b> inexpensive <b>$$</b> moderate <b>$$$</b> special occasion <b>$$$$</b> luxury</p>
          </div>
        </article>
        <article className="pg-how-to-item">
          <span className="pg-how-to-number">04</span>
          <div>
            <h2>Best for</h2>
            <p>Use small tags:</p>
            <div className="pg-best-for-tags">
              {bestForTags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </div>
        </article>
        <article className="pg-how-to-item pg-how-to-qr">
          <span className="pg-how-to-number">05</span>
          <div className="pg-how-to-qr-copy">
            <h2>QR scan for more</h2>
            <p>QR codes connect you to the live guide for:</p>
            <strong>Directions · Current opening hours · Menus · Events · Booking · More recommendations</strong>
          </div>
          <div className="pg-faux-qr" aria-hidden="true" />
        </article>
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function AreaGlancePage({ page }) {
  const areas = [
    {
      name: "Ahangama Town",
      summary: "The centre of things.",
      description: "Restaurants, cafés, shops, the railway station and plenty happening within a relatively small area.",
      bestFor: "Food · Coffee · Convenience · Nightlife",
    },
    {
      name: "Kabalana",
      summary: "Beach days and surf.",
      description: "A broad beach, one of the area's best-known surf zones and an increasingly strong collection of places to eat and stay.",
      bestFor: "Beach · Surf · Breakfast · Staying",
    },
    {
      name: "Kathaluwa",
      summary: "A slower side of the coast.",
      description: "Between Ahangama and Koggala, with access to the lake, quieter roads and a more residential feel.",
      bestFor: "Villas · Exploring · Koggala Lake",
    },
    {
      name: "Goviyapana",
      summary: "The quieter western edge.",
      description: "A coastal stretch between Ahangama and Midigama.",
      bestFor: "Beach · Villas · Slower stays",
    },
    {
      name: "Midigama",
      summary: "Surf first.",
      description: "A neighbouring surf community with several well-known breaks.",
      bestFor: "Surf · Casual food · Backpackers",
    },
    {
      name: "Koggala",
      summary: "Lake, nature and history.",
      description: "The landscape changes around Koggala, with the lake opening up opportunities for boat trips, nature and inland exploration.",
      bestFor: "Nature · Day trips · Experiences",
    },
  ];

  return (
    <div className="pg-template pg-area-glance pg-safe-area">
      <EditorialLabel page={page} />
      <span className="pg-area-glance-kicker">Know the neighbourhoods</span>
      <h1>{page.content.headline}</h1>
      <div className="pg-area-glance-grid">
        {areas.map((area, index) => (
          <article key={area.name}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{area.name}</h2>
              <strong>{area.summary}</strong>
              <p>{area.description}</p>
              <small><b>Best for</b> {area.bestFor}</small>
            </div>
          </article>
        ))}
      </div>
      <p className="pg-area-glance-note">{page.content.subheadline}</p>
      <PageFurniture page={page} />
    </div>
  );
}

const ESSENTIAL_MAP_IMAGE = "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-guide/ahangama-costal-guide.webp";
const LIVE_MAP_URL = "https://ahangama.com/map";

function EssentialMapSpreadPage({ page }) {
  const isLeftPage = page.pageNumber === 6;
  const keyItems = [
    ["●", "Eat & Drink"],
    ["■", "Stay"],
    ["▲", "Surf"],
    ["◆", "Experience"],
    ["+", "Wellness"],
    ["★", "Essential"],
  ];

  return (
    <div className={`pg-template pg-essential-map-spread is-${isLeftPage ? "left" : "right"}`}>
      <div className="pg-essential-map-header">
        {isLeftPage ? (
          <>
            <EditorialLabel page={page} />
            <h1>{page.content.headline}</h1>
            <p>{page.content.subheadline}</p>
            <small className="pg-essential-map-caption">Beaches, surf breaks, food, hotels and essential services along Galle Road and Koggala Lake.</small>
          </>
        ) : (
          <>
            <span className="pg-essential-map-route">Koggala · Ahangama · Midigama</span>
            <div className="pg-essential-map-key" aria-label="Map key">
              {keyItems.map(([symbol, label]) => (
                <span key={label}><b>{symbol}</b>{label}</span>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="pg-essential-map-art">
        <img src={ESSENTIAL_MAP_IMAGE} alt="Illustrated map of the Ahangama coastal corridor from Koggala to Midigama" />
        {!isLeftPage ? (
          <div className="pg-essential-map-qr">
            <QRCodeSVG value={LIVE_MAP_URL} level="M" bgColor="#f7f4ed" fgColor="#171714" />
            <div>
              <strong>Open the live map</strong>
              <p>Scan for directions, current opening hours and all 150 places.</p>
            </div>
          </div>
        ) : null}
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function ItineraryPage({ page }) {
  const isFirstDay = page.pageNumber === 8;
  const items = isFirstDay
    ? [
        ["08:00", "Breakfast", "[Venue] - A perfect introduction to the local morning vibe with exceptional coffee and fresh local ingredients."],
        ["09:30", "Get in the water", "Head to Kabalana beach for a swim or a surf in the crystal clear morning waves."],
        ["12:30", "Lunch", "[Venue]"],
        ["14:00", "Slow down", "Relax by the pool, book a massage, or take a gentle boat trip on Koggala Lake."],
        ["17:00", "Sunset", "[Venue/Location]"],
        ["19:30", "Dinner", "[Venue]"],
        ["22:00", "One more?", "[Bar Recommendation]"],
      ]
    : [
        ["07:30", "Move", "Yoga, Pilates, or a morning surf session."],
        ["09:00", "Coffee", "Find your caffeine fix at a local favourite."],
        ["10:30", "Explore", "Venture inland to Koggala Lake for a cinnamon or cultural experience."],
        ["13:30", "Sri Lankan lunch", "Authentic rice and curry at a traditional spot."],
        ["15:30", "Shop", "Visit independent local shops for unique finds."],
        ["17:30", "Sunset", "Watch the sky change from a different part of town."],
        ["20:00", "Dinner", "A memorable evening meal."],
        ["22:00", "After dark", "Late night drinks and music."],
      ];

  return (
    <div className="pg-template pg-itinerary pg-safe-area">
      <EditorialLabel page={page} />
      <span className="pg-itinerary-kicker">{isFirstDay ? "Start here" : "48 hours in Ahangama"}</span>
      <h1>{page.content.headline}</h1>
      {isFirstDay ? <p className="pg-standfirst">{page.content.subheadline}</p> : null}
      <div className="pg-itinerary-list">
        {items.map(([time, title, description]) => (
          <article key={time}>
            <time>{time}</time>
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>
      {!isFirstDay ? (
        <p className="pg-itinerary-more"><b>Staying longer?</b> Turn to P43 <span aria-hidden="true">→</span> 10 Things You Should Do.</p>
      ) : null}
      <PageFurniture page={page} />
    </div>
  );
}

function TownStoryPage({ page }) {
  const chapters = [
    ["The Town Before the Boom", "A glimpse into the local community, traditional fishing, and life along the railway and coastal road."],
    ["Surf", "Why the breaks of Ahangama, Kabalana, and Midigama became magnets for international travellers."],
    ["The New Arrivals", "The evolution of restaurants, cafés, villas, and wellness spaces led by creative entrepreneurs."],
    ["What Remains", "How Sri Lankan life continues to thrive and ground the visitor economy."],
    ["Where Ahangama Goes Next", "Managing growth while retaining the destination's unique character."],
  ];

  return (
    <div className="pg-template pg-town-story pg-safe-area">
      <EditorialLabel page={page} />
      <span className="pg-town-story-kicker">The Ahangama Story</span>
      <h1>{page.content.headline}</h1>
      <p className="pg-standfirst">{page.content.subheadline}</p>
      <div className="pg-town-story-list">
        {chapters.map(([title, description], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function AhangamaEditPage({ page }) {
  const places = [
    ["Cactus", "For breakfast after the beach."],
    ["Marshmellow", "For a long, social brunch."],
    ["Sisters Kabalana", "For Kabalana mornings."],
    ["Abrazo", "For taco-fueled evenings."],
    ["Jam House", "For dinner with a crowd."],
    ["Petals", "For the local favourite flavour."],
    ["Unsung", "For the Midigama surf community vibe."],
    ["Folklore Ahangama", "For food and drinks with atmosphere."],
    ["The Kip", "For the Ahangama state of mind."],
    ["Kurulu Bay", "For disappearing beside the lake."],
    ["Fi Midigama", "For a surf-town stay."],
    ["The Nuga House", "For slowing everything down."],
    ["White Lotus Spa", "For restoration and recovery."],
    ["Cafe Wave", "For beachside coffee."],
    ["Surf Club Midigama", "For catching the best breaks."],
    ["Kumbuk Community", "For deep cultural connection."],
    ["Pura Pilates", "For movement and balance."],
    ["Daydream", "For thoughtfully curated local finds."],
    ["Living Room Concept Store", "For unique design and coffee culture."],
    ["Gusta", "For everything you need."],
  ];

  return (
    <div className="pg-template pg-ahangama-edit pg-safe-area">
      <EditorialLabel page={page} />
      <span className="pg-ahangama-edit-kicker">The Ahangama Edit</span>
      <h1>{page.content.headline}</h1>
      <p className="pg-standfirst">{page.content.subheadline}</p>
      <div className="pg-ahangama-edit-list">
        {places.map(([name, description], index) => (
          <article key={name}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{name}</h2>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function PeopleSpreadPage({ page }) {
  const isLeftPage = page.pageNumber === 12;
  const profiles = isLeftPage
    ? [
        ["The Local", "A life rooted in the rhythms, relationships and memory of Ahangama."],
        ["The Maker", "Building something thoughtful here, with local materials and a distinct point of view."],
      ]
    : [
        ["The Waterman", "Reading the coast through tides, seasons and years spent close to the ocean."],
        ["The New Generation", "Carrying Ahangama forward while deciding what should never be left behind."],
      ];

  return (
    <div className={`pg-template pg-people-spread pg-safe-area is-${isLeftPage ? "left" : "right"}`}>
      <header className="pg-people-header">
        {isLeftPage ? (
          <>
            <EditorialLabel page={page} />
            <h1>{page.content.headline}</h1>
            <p className="pg-standfirst">{page.content.subheadline}</p>
          </>
        ) : (
          <>
            <span>People of Ahangama · Continued</span>
            <p>The Local · The Maker · The Waterman · The New Generation</p>
          </>
        )}
      </header>
      <div className="pg-people-profiles">
        {profiles.map(([role, introduction], index) => {
          const profileNumber = index + (isLeftPage ? 1 : 3);
          return (
            <article key={role}>
              <div className="pg-portrait-placeholder" role="img" aria-label={`Portrait placeholder for ${role}`}>
                <span>Portrait</span>
                <b>{String(profileNumber).padStart(2, "0")}</b>
              </div>
              <div className="pg-people-profile-copy">
                <span>{String(profileNumber).padStart(2, "0")}</span>
                <h2>{role}</h2>
                <p>{introduction}</p>
                <dl>
                  <div><dt>Perfect morning</dt><dd>[Profile response]</dd></div>
                  <div><dt>Where they take friends</dt><dd>[Profile response]</dd></div>
                  <div><dt>Hope for Ahangama</dt><dd>[Profile response]</dd></div>
                </dl>
              </div>
            </article>
          );
        })}
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function StayOpenerPage({ page }) {
  return (
    <div className="pg-template pg-stay-opener">
      <img src={page.content.image} alt="A considered stay in Ahangama" />
      <div className="pg-stay-opener-shade" />
      <div className="pg-stay-opener-copy">
        <EditorialLabel page={page} inverse />
        <span>02</span>
        <h1>{page.content.headline}</h1>
        <p>{page.content.subheadline}</p>
      </div>
      <PageFurniture page={page} inverse />
    </div>
  );
}

function StayCollectionPage({ page }) {
  const venues = getVenues(page).slice(0, 8);
  return (
    <div className="pg-template pg-stay-collection pg-safe-area">
      <EditorialLabel page={page} />
      <h1>{page.content.headline}</h1>
      <p className="pg-standfirst">{page.content.subheadline}</p>
      <div className="pg-stay-collection-grid">
        {venues.map((venue, index) => (
          <article key={venue.slug}>
            <div>
              <img src={venue.image || page.content.image} alt="" />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h2>{venue.name}</h2>
            <p>{venue.area || "Ahangama"} · {venue.price || "Stay"}</p>
          </article>
        ))}
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function StayFinderPage({ page }) {
  const groups = [
    ["Beachfront", "Abode by the Beach · Lighthouse", "Wake to the ocean and walk straight into the day."],
    ["Under $100", "Mellow Hostel · King Lush Green View", "Simple, friendly bases that leave more room in the budget."],
    ["Couples", "Merchant · The Find", "Intimate rooms, considered details and an unhurried atmosphere."],
    ["Groups", "Southpoint Villa · Villa Mugatiya", "Private space, shared tables and enough room to settle in."],
    ["Long stays", "Tea Tree Villa · Ekuku Lake House", "Kitchen access, calm surroundings and space to unpack."],
  ];
  return (
    <div className="pg-template pg-stay-finder pg-safe-area">
      <EditorialLabel page={page} />
      <h1>{page.content.headline}</h1>
      <p className="pg-standfirst">{page.content.subheadline}</p>
      <div className="pg-stay-finder-list">
        {groups.map(([title, recommendations, copy], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><h2>{title}</h2><p>{copy}</p></div>
            <strong>{recommendations}</strong>
          </article>
        ))}
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function StayNeighbourhoodPage({ page }) {
  const areas = [
    ["Ahangama Central", "Connected", "Cafés, shops and the station close at hand."],
    ["Ahangama Coast", "Oceanfront", "Sunset, swimming and the main coastal rhythm."],
    ["Kabalana", "Surf-led", "A broad beach with breaks for different abilities."],
    ["Midigama", "Low-key", "A smaller surf pocket with an easy village feel."],
    ["Inland", "Quiet", "Gardens, paddy views and more room away from the road."],
  ];
  return (
    <div className="pg-template pg-stay-neighbourhood pg-safe-area">
      <EditorialLabel page={page} />
      <h1>{page.content.headline}</h1>
      <p className="pg-standfirst">{page.content.subheadline}</p>
      <div className="pg-stay-neighbourhood-map" aria-label="Stylised map of Ahangama stay areas">
        <div className="pg-stay-map-sea">Indian Ocean</div>
        <div className="pg-stay-map-road" />
        {areas.map(([name], index) => (
          <span key={name} style={{ left: `${9 + index * 18}%`, top: `${29 + (index % 2) * 22}%` }}>
            <i />{name.replace("Ahangama ", "")}
          </span>
        ))}
      </div>
      <div className="pg-stay-neighbourhood-list">
        {areas.map(([name, mood, description]) => (
          <article key={name}><h2>{name}</h2><strong>{mood}</strong><p>{description}</p></article>
        ))}
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function StayStoryPage({ page }) {
  const [venue] = getVenues(page);
  return (
    <div className="pg-template pg-stay-story">
      <div className="pg-stay-story-image">
        <img src={venue?.image || page.content.image} alt={venue?.name || "Featured Ahangama stay"} />
        <span>Stay story · 01</span>
      </div>
      <div className="pg-stay-story-copy">
        <EditorialLabel page={page} />
        <h1>{page.content.headline}</h1>
        <p className="pg-standfirst">{page.content.subheadline}</p>
        <div>
          <p>{venue?.description || page.content.body}</p>
          <p>Architecture sets the tempo, but the lasting impression is quieter: early light, an open door and a room that changes pace with the day.</p>
        </div>
        <strong>{venue?.name || "Featured stay"} · {venue?.area || "Ahangama"}</strong>
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function SectionOpener({ page }) {
  const partner = page.commercial.partner;
  return (
    <div
      className="pg-template pg-section-opener"
      style={{ "--section-color": GUIDE_SECTIONS[page.section]?.color }}
    >
      <img src={page.content.image} alt="" />
      <div className="pg-section-copy">
        <EditorialLabel page={page} inverse />
        <h1>{page.content.headline}</h1>
        <p>{page.content.subheadline}</p>
        <div className="pg-sponsor-print">
          <span>In partnership with</span>
          <strong>{partner || "Ahangama.com"}</strong>
        </div>
      </div>
      <PageFurniture page={page} inverse />
    </div>
  );
}

function EditorialFeature({ page }) {
  return (
    <div className="pg-template pg-editorial-feature pg-safe-area">
      <EditorialLabel page={page} />
      <h1>{page.content.headline}</h1>
      <p className="pg-standfirst">{page.content.subheadline}</p>
      <img src={page.content.image} alt="" />
      <div className="pg-feature-columns">
        <p>{page.content.body}</p>
        <p>
          The details matter here. Go early, ask what is good today, and leave
          enough room in the plan for an unexpected turn.
        </p>
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function VenueFeature({ page }) {
  const [venue] = getVenues(page);
  return (
    <div className="pg-template pg-venue-feature">
      <div className="pg-venue-feature-image">
        <img src={venue?.image || page.content.image} alt={venue?.name || ""} />
        <span>01 / Local address</span>
      </div>
      <div className="pg-venue-feature-copy">
        <EditorialLabel page={page} />
        <h1>{venue?.name || page.content.headline}</h1>
        <p className="pg-standfirst">{page.content.subheadline}</p>
        <p>{venue?.description || page.content.body}</p>
        <div className="pg-venue-facts">
          <span>{venue?.area || "Ahangama"}</span>
          <span>Selected by locals</span>
        </div>
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function VenueGrid({ page }) {
  const venues = getVenues(page).slice(0, 4);
  return (
    <div className="pg-template pg-venue-grid pg-safe-area">
      <EditorialLabel page={page} />
      <h1>{page.content.headline}</h1>
      <p className="pg-standfirst">{page.content.subheadline}</p>
      <div className="pg-venue-grid-items">
        {venues.map((venue, index) => (
          <article key={venue.slug}>
            <img src={venue.image} alt="" />
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{venue.name}</h2>
            <p>{venue.area || "Ahangama"}</p>
          </article>
        ))}
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function VenueList({ page }) {
  const venues = getVenues(page);
  return (
    <div className="pg-template pg-venue-list pg-safe-area">
      <EditorialLabel page={page} />
      <h1>{page.content.headline}</h1>
      <p className="pg-standfirst">{page.content.subheadline}</p>
      <div className="pg-address-list">
        {venues.map((venue, index) => (
          <article key={venue.slug}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{venue.name}</h2>
              <p>{venue.excerpt || venue.description}</p>
            </div>
            <small>{venue.area || "Ahangama"}</small>
          </article>
        ))}
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function PhotoEssay({ page }) {
  return (
    <div className="pg-template pg-photo-essay">
      <img className="pg-photo-main" src={page.content.image} alt="" />
      <img className="pg-photo-inset" src={page.content.secondaryImage} alt="" />
      <div className="pg-photo-caption">
        <EditorialLabel page={page} inverse />
        <h1>{page.content.headline}</h1>
        <p>{page.content.subheadline}</p>
      </div>
      <PageFurniture page={page} inverse />
    </div>
  );
}

function MapPage({ page }) {
  const labels = ["Ahangama", "Kabalana", "Kathaluwa", "Midigama", "Koggala"];
  return (
    <div className="pg-template pg-map pg-safe-area">
      <EditorialLabel page={page} />
      <h1>{page.content.headline}</h1>
      <p>{page.content.subheadline}</p>
      <div className="pg-map-art" aria-label="Stylised guide map">
        <div className="pg-map-coast" />
        <div className="pg-map-road" />
        {labels.map((label, index) => (
          <span key={label} style={{ left: `${13 + index * 16}%`, top: `${60 - (index % 2) * 15}%` }}>
            <i />{label}
          </span>
        ))}
      </div>
      <div className="pg-map-key">Coast road · Railway · Beaches · Guide selections</div>
      <PageFurniture page={page} />
    </div>
  );
}

function EssentialInfoPage({ page }) {
  const items = [
    ["Move", "Agree tuk-tuk fares before setting off or use a local ride app."],
    ["Pay", "Carry cash for smaller places; ATMs are clustered around town."],
    ["Connect", "Local SIMs are inexpensive and coverage is generally reliable."],
    ["Respect", "Dress modestly at temples and ask before photographing people."],
    ["Ocean", "Conditions change quickly. Swim and surf within your ability."],
  ];
  return (
    <div className="pg-template pg-essential pg-safe-area">
      <EditorialLabel page={page} />
      <h1>{page.content.headline}</h1>
      <p className="pg-standfirst">{page.content.subheadline}</p>
      <div className="pg-essential-list">
        {items.map(([title, copy], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function DirectoryPage({ page }) {
  const venues = Array.from(GUIDE_PLACES_BY_SLUG.values()).slice(0, 18);
  return (
    <div className="pg-template pg-directory pg-safe-area">
      <EditorialLabel page={page} />
      <h1>{page.content.headline}</h1>
      <div className="pg-directory-columns">
        {venues.map((venue) => (
          <div key={venue.slug}>
            <strong>{venue.name}</strong>
            <span>{venue.category} · {venue.area || "Ahangama"}</span>
          </div>
        ))}
      </div>
      <div className="pg-directory-qr">
        <div className="pg-faux-qr" aria-hidden="true" />
        <div><strong>Continue online</strong><span>ahangama.com</span></div>
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function FullPageAd({ page }) {
  const partner = page.commercial.partner || "Your story in Ahangama";
  return (
    <div className="pg-template pg-full-ad">
      <img src={page.content.image} alt="" />
      <div className="pg-full-ad-copy">
        <span>Guide partner</span>
        <h1>{partner}</h1>
        <p>{page.content.subheadline}</p>
      </div>
      <PageFurniture page={page} inverse />
    </div>
  );
}

function OpeningPartnerPage({ page }) {
  const partner = page.commercial.partner || "Opening partner";
  return (
    <div className="pg-template pg-opening-partner">
      <img
        src={page.content.image}
        alt="Trebartha East among the inland landscape near Ahangama"
      />
      <div className="pg-opening-partner-shade" />
      <div className="pg-opening-partner-topline">
        <span>Ahangama Guide</span>
        <span>Opening Partner</span>
      </div>
      <div className="pg-opening-partner-copy">
        <span>In partnership with</span>
        <h1>{partner}</h1>
        <p>{page.content.subheadline}</p>
        <small>High-quality artwork required</small>
      </div>
      <PageFurniture page={page} inverse />
    </div>
  );
}

function PartialPageAd({ page }) {
  const isQuarter = page.commercial.type === "quarterPage";
  return (
    <div className={`pg-template pg-partial-page${isQuarter ? " is-quarter" : ""}`}>
      <div className="pg-partial-editorial pg-safe-area">
        <EditorialLabel page={page} />
        <h1>{page.content.headline}</h1>
        <p>{page.content.subheadline}</p>
        <p className="pg-body-copy">{page.content.body}</p>
      </div>
      <div className="pg-partial-ad-print">
        <img src={page.content.image} alt="" />
        <div><span>In partnership with</span><strong>{page.commercial.partner || "Ahangama.com"}</strong></div>
      </div>
      <PageFurniture page={page} inverse />
    </div>
  );
}

const TEMPLATE_COMPONENTS = {
  CoverPage,
  InsideCoverAd: FullPageAd,
  ContentsPage,
  HowToUsePage,
  AreaGlancePage,
  EssentialMapSpreadPage,
  ItineraryPage,
  TownStoryPage,
  AhangamaEditPage,
  PeopleSpreadPage,
  StayOpenerPage,
  StayCollectionPage,
  StayFinderPage,
  StayNeighbourhoodPage,
  StayStoryPage,
  IntroductionPage,
  SectionOpener,
  EditorialFeature,
  VenueFeature,
  VenueGrid,
  VenueList,
  PhotoEssay,
  MapPage,
  EssentialInfoPage,
  DirectoryPage,
  OpeningPartnerPage,
  FullPageAd,
  HalfPageEditorialAd: PartialPageAd,
  QuarterPageEditorialAd: PartialPageAd,
  SponsoredSection: SectionOpener,
  BackCoverAd: FullPageAd,
};

function ManagementOverlay({ page }) {
  if (!page.commercial.enabled) return null;
  const type = page.commercial.type;
  const partialClass =
    type === "halfPage"
      ? " is-half"
      : type === "quarterPage"
        ? " is-quarter"
        : " is-full";

  return (
    <div className={`pg-commercial-overlay${partialClass}`}>
      <span>Commercial</span>
      <strong>{COMMERCIAL_LABELS[type]}</strong>
      <b>{formatCurrency(page.commercial.rate)}</b>
      <em className={`is-${page.commercial.status}`}>
        {page.commercial.status}
      </em>
      <small>Page {page.pageNumber} · {GUIDE_SECTIONS[page.section]?.label}</small>
    </div>
  );
}

export default function GuidePage({
  page,
  managementMode = false,
  thumbnail = false,
  onEdit,
}) {
  const Template = TEMPLATE_COMPONENTS[page.template] || EditorialFeature;

  return (
    <div
      className={`pg-page-shell${thumbnail ? " is-thumbnail" : ""}${managementMode ? " has-management" : ""}`}
      style={{ "--page-section-color": GUIDE_SECTIONS[page.section]?.color }}
    >
      <div className="pg-print-canvas">
        <Template page={page} />
      </div>
      {managementMode ? (
        <div className="pg-management-layer">
          <div className="pg-page-meta">
            <span>P{String(page.pageNumber).padStart(2, "0")}</span>
            <span>{page.template}</span>
          </div>
          <ManagementOverlay page={page} />
          {!thumbnail && onEdit ? (
            <button type="button" className="pg-edit-page" onClick={() => onEdit(page)}>
              Edit page
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}