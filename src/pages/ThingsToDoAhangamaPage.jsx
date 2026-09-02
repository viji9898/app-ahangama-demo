import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRightOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { usePlaces } from "../app/placesContext";
import { shouldShowPlace } from "../data/placeStatus";
import { THINGS_TO_DO_AHANGAMA_PAGE } from "../data/thingsToDoAhangamaPage";
import "../styles/things-to-do-ahangama.css";

export const THINGS_TO_DO_AHANGAMA_PATH = "/things-to-do-in-ahangama";

const HERO_IMAGE =
  "/12 Experiences Images /Why Ahangama Might Be Sri Lanka_s Most Interesting Coastal Town Right Now/The Social side - hero image.webp";
const SURF_IMAGE =
  "/12 Experiences Images /Why Ahangama Might Be Sri Lanka_s Most Interesting Coastal Town Right Now/Surf Culture.jpg";
const FOOD_IMAGE =
  "/12 Experiences Images /Why Ahangama Might Be Sri Lanka_s Most Interesting Coastal Town Right Now/Cafes, Food & Creative Culture -Speciality Coffee_.png";
const WELLNESS_IMAGE =
  "/12 Experiences Images /Why Ahangama Might Be Sri Lanka_s Most Interesting Coastal Town Right Now/Wellness & Recovery - Ice bath - Ember & Ice.webp";
const SHOPPING_IMAGE =
  "/12 Experiences Images /Why Ahangama Might Be Sri Lanka_s Most Interesting Coastal Town Right Now/Boutique retail.webp";
const INLAND_IMAGE = "/12 Experiences Images /07 - River Journey.jpg";
const PUBLISH_DATE = "2026-09-03T09:00:00.000Z";
const EVENTS_ENDPOINT = "/.netlify/functions/events";

const ACTIVITY_IMAGES = {
  surf: SURF_IMAGE,
  "kabalana-beach":
    "/12 Experiences Images /Why Ahangama Works Best When You Explore It Slowly/Section 2 - Ahangama_kabalana_beach_football.webp",
  "eat-around-ahangama": FOOD_IMAGE,
  "wellness-and-movement": WELLNESS_IMAGE,
  "shopping-and-makers": SHOPPING_IMAGE,
  "after-dark":
    "/12 Experiences Images /Perfect Day In ahangama/Sunset at Light house .jpg",
  "inland-ahangama": INLAND_IMAGE,
  "creative-time":
    "/12 Experiences Images /Why Ahangama Might Be Sri Lanka_s Most Interesting Coastal Town Right Now/Creative workshop.webp",
};

const NEXT_ARTICLE = {
  href: "/ahangama-sri-lanka",
  kicker: "Plan your stay",
  title: "Ahangama, Sri Lanka: The Local Guide",
  image:
    "/12 Experiences Images /Why Ahangama Might Be Sri Lanka_s Most Interesting Coastal Town Right Now/Hero Image - Opening note.webp",
};

const FAQS = [
  [
    "What are the best things to do in Ahangama?",
    "Start with Kabalana Beach and a surf session suited to the day's conditions, then add independent food, wellness, shops, an inland experience and one current evening event. The right mix depends more on weather and energy than a fixed ranking.",
  ],
  [
    "Is Ahangama worth visiting if you do not surf?",
    "Yes. Food, wellness, independent shops, workshops, beaches, live events and south-coast day trips can easily fill several days without a surf lesson.",
  ],
  [
    "How many days do you need in Ahangama?",
    "Three days gives you a useful introduction. Five days leaves room for weather changes, a slower beach day and one nearby outing without compressing the visit.",
  ],
  [
    "Is Kabalana Beach suitable for swimming?",
    "Sometimes, but not reliably. Swell, currents, tide and seasonal sand movement change the shoreline. Ask locally about the day's safest area before entering.",
  ],
  [
    "Can beginners surf in Ahangama?",
    "Beginners can take lessons at a suitable sandy section when conditions allow. Book a reputable instructor who chooses the location and timing for your ability; the named reef breaks are not beginner waves.",
  ],
  [
    "What can you do in Ahangama at night?",
    "Combine sunset and dinner with live music, a market, a workshop or a ticketed night from the current events calendar. Arrange a tuk-tuk home before venues become busy.",
  ],
  [
    "Are there family-friendly things to do in Ahangama?",
    "Beach time in suitable conditions, cooking and creative workshops, early dinners and short inland outings can work well. Confirm age limits, safety equipment and child pricing directly with each operator.",
  ],
  [
    "What can you do in Ahangama when it rains?",
    "Use a wet spell for a long lunch, massage, movement class, sauna session, workshop or shopping. Heavy rain can affect inland roads and ocean visibility, so avoid forcing an outdoor plan.",
  ],
  [
    "Which activities need to be booked in advance?",
    "Surf lessons, treatments, small-group workshops, diving, safaris and some evening events are the main candidates. Beaches, browsing and casual food stops generally do not need a booking.",
  ],
  [
    "What are the best day trips from Ahangama?",
    "Galle Fort is the easiest cultural half-day. Dalawella and Unawatuna are nearby coastal outings, while Udawalawe is a full-day or overnight journey rather than a local attraction.",
  ],
  [
    "Can you explore Ahangama without a scooter?",
    "Yes. Central clusters can be explored on foot and tuk-tuks cover the gaps. The main road is busy and pavements are inconsistent, so walking between distant areas is not always pleasant.",
  ],
  [
    "When is the best season for Ahangama activities?",
    "December to March is the usual south-coast high season, but rain, swell, wind and business schedules vary. Check conditions and current venue information rather than treating the season as a guarantee.",
  ],
];

const DURATION_OPTIONS = ["Any time", "2 hours", "Half-day", "Full day"];
const TRAVELLER_OPTIONS = ["Anyone", "Solo", "Couple", "Family", "Group"];
const COST_OPTIONS = ["Any spend", "Free", "Low", "Mid", "High"];

function venueHref(place) {
  if (place.category === "shops-essentials") return `/retail/${place.slug}`;
  if (place.category === "co-working") return `/co-working/${place.slug}`;
  if (place.category === "experiences") return `/experiences/${place.slug}`;
  return `/${place.category}/${place.slug}`;
}

function durationMatches(itemDuration, selectedDuration) {
  if (selectedDuration === "Any time") return true;
  if (selectedDuration === "Half-day") return /half/i.test(itemDuration);
  if (selectedDuration === "Full day")
    return /full day|overnight/i.test(itemDuration);
  return /2 hours/i.test(itemDuration);
}

function VenueStrip({ title, introduction, slugs, placesBySlug }) {
  const venues = slugs.map((slug) => placesBySlug.get(slug)).filter(Boolean);

  if (!venues.length) return null;

  return (
    <section className="ttd-section">
      <div className="ttd-inner">
        <div className="ttd-sectionHead">
          <h2>{title}</h2>
          <p>{introduction}</p>
        </div>
        <div className="ttd-venueGrid">
          {venues.map((place) => (
            <a className="ttd-venue" href={venueHref(place)} key={place.id}>
              <img
                src={place.image || place.ogImage || place.logo}
                alt={`${place.name} in ${place.area || "Ahangama"}`}
              />
              <div>
                <span>{place.area || "Ahangama"}</span>
                <h3>{place.name}</h3>
                <p>{place.excerpt || place.description}</p>
                <strong>
                  View place <ArrowRightOutlined />
                </strong>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ThingsToDoAhangamaPage() {
  const canonical = absUrl(THINGS_TO_DO_AHANGAMA_PATH);
  const { places } = usePlaces();
  const [interest, setInterest] = useState("All");
  const [duration, setDuration] = useState("Any time");
  const [traveller, setTraveller] = useState("Anyone");
  const [cost, setCost] = useState("Any spend");
  const [events, setEvents] = useState([]);

  const placesBySlug = useMemo(
    () =>
      new Map(
        places
          .filter(
            (place) =>
              place.destinationSlug === "ahangama" && shouldShowPlace(place),
          )
          .map((place) => [place.slug, place]),
      ),
    [places],
  );

  useEffect(() => {
    THINGS_TO_DO_AHANGAMA_PAGE.localActivities.forEach((activity) => {
      activity.venueSlugs.forEach((slug) => {
        if (!placesBySlug.has(slug) && import.meta.env.DEV && places.length) {
          console.warn(`[Things to do] Omitted unresolved venue: ${slug}`);
        }
      });
    });
  }, [places, placesBySlug]);

  useEffect(() => {
    let cancelled = false;

    fetch(EVENTS_ENDPOINT)
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok)
          throw new Error(payload.error || "Unable to load events");
        return Array.isArray(payload.days) ? payload.days : [];
      })
      .then((days) => {
        if (cancelled) return;
        const nextEvents = days
          .flatMap((day) =>
            day.events.map((event) => ({
              ...event,
              dateLabel: event.date || day.weekday,
            })),
          )
          .filter((event) => {
            const haystack =
              `${event.title} ${event.category} ${event.description}`.toLowerCase();
            return THINGS_TO_DO_AHANGAMA_PAGE.eventTags.some((tag) =>
              haystack.includes(tag),
            );
          })
          .slice(0, 3);
        setEvents(nextEvents);
      })
      .catch((error) => {
        if (!cancelled)
          console.error("Unable to load things-to-do events", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredActivities = useMemo(() => {
    const allItems = [
      ...THINGS_TO_DO_AHANGAMA_PAGE.localActivities,
      ...THINGS_TO_DO_AHANGAMA_PAGE.nearbyTrips.map((trip) => ({
        ...trip,
        area: trip.label,
        travellers: ["Solo", "Couple", "Family", "Group"],
        summary: trip.text,
        varies: "Conditions, access and travel time",
        booking: "Confirm before setting out",
        number: "Away",
      })),
    ];

    return allItems.filter((item) => {
      const matchesInterest = interest === "All" || item.interest === interest;
      const matchesDuration = durationMatches(item.duration, duration);
      const matchesTraveller =
        traveller === "Anyone" || item.travellers.includes(traveller);
      const matchesCost = cost === "Any spend" || item.costLevel === cost;
      return (
        matchesInterest && matchesDuration && matchesTraveller && matchesCost
      );
    });
  }, [cost, duration, interest, traveller]);

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Things to Do in Ahangama: Beaches, Surf, Food & More"
        description="Discover what to do in Ahangama, from surf and beaches to restaurants, wellness, shopping, nightlife and carefully chosen south-coast day trips."
        canonical={canonical}
        ogImage={absUrl(HERO_IMAGE)}
        ogType="article"
        author="Ahangama Guide Editorial Team"
        publishDate={PUBLISH_DATE}
      />

      <main className="ttd-page">
        <header className="ttd-hero">
          <img
            src={HERO_IMAGE}
            alt="Friends gathering by the coast in Ahangama"
          />
          <div className="ttd-heroContent">
            <span className="ttd-eyebrow">The practical local edit</span>
            <h1>Things to Do in Ahangama</h1>
            <p>
              Build a day around beach, surf, food, movement, independent shops
              and whatever is genuinely happening tonight, with longer journeys
              clearly kept outside the town.
            </p>
            <nav className="ttd-actions" aria-label="Guide actions">
              <a href="/map">
                <EnvironmentOutlined /> Open map
              </a>
              <a href="/events">
                <CalendarOutlined /> See what&apos;s on
              </a>
              <a href="/pass-perks">Get the Ahangama Pass</a>
            </nav>
          </div>
        </header>

        <section className="ttd-chooser" aria-labelledby="quick-chooser-title">
          <div className="ttd-inner">
            <div className="ttd-chooserHead">
              <span>Start with an interest</span>
              <h2 id="quick-chooser-title">What suits today?</h2>
            </div>
            <div
              className="ttd-filterRow"
              role="group"
              aria-label="Filter by interest"
            >
              {THINGS_TO_DO_AHANGAMA_PAGE.interests.map((item) => (
                <button
                  aria-pressed={interest === item}
                  className={interest === item ? "is-active" : ""}
                  key={item}
                  onClick={() => setInterest(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="ttd-section ttd-section--day">
          <div className="ttd-inner">
            <div className="ttd-sectionHead">
              <h2>If you only have one day</h2>
              <p>
                Keep the route compact and let conditions decide the details.
                This sequence works for surfers and non-surfers without turning
                the day into a race along the coast road.
              </p>
            </div>
            <div className="ttd-dayGrid">
              {THINGS_TO_DO_AHANGAMA_PAGE.oneDay.map((stop) => (
                <article key={stop.time}>
                  <span>{stop.time}</span>
                  <h3>{stop.title}</h3>
                  <p>{stop.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ttd-section" id="local-experiences">
          <div className="ttd-inner">
            <div className="ttd-sectionHead">
              <h2>Essential Ahangama experiences</h2>
              <p>
                Eight dependable ways into the town, each labelled by time,
                spend and practical constraints. Venue links resolve from the
                current Ahangama places directory.
              </p>
            </div>
            <div className="ttd-activityList">
              {THINGS_TO_DO_AHANGAMA_PAGE.localActivities
                .filter(
                  (activity) =>
                    interest === "All" || activity.interest === interest,
                )
                .map((activity) => (
                  <article className="ttd-activity" key={activity.id}>
                    <img src={ACTIVITY_IMAGES[activity.id]} alt="" />
                    <div className="ttd-activityCopy">
                      <div className="ttd-activityTopline">
                        <span>{activity.number}</span>
                        <strong>{activity.interest}</strong>
                      </div>
                      <h3>{activity.title}</h3>
                      <p className="ttd-summary">{activity.summary}</p>
                      <dl>
                        <div>
                          <dt>Where</dt>
                          <dd>{activity.area}</dd>
                        </div>
                        <div>
                          <dt>Allow</dt>
                          <dd>{activity.duration}</dd>
                        </div>
                        <div>
                          <dt>Spend</dt>
                          <dd>{activity.costLevel}</dd>
                        </div>
                        <div>
                          <dt>Best for</dt>
                          <dd>{activity.travellers.join(", ")}</dd>
                        </div>
                        <div>
                          <dt>Booking</dt>
                          <dd>{activity.booking}</dd>
                        </div>
                        <div>
                          <dt>What varies</dt>
                          <dd>{activity.varies}</dd>
                        </div>
                      </dl>
                      <p>{activity.detail}</p>
                      <div className="ttd-placeLinks">
                        {activity.venueSlugs
                          .map((slug) => placesBySlug.get(slug))
                          .filter(Boolean)
                          .map((place) => (
                            <a href={venueHref(place)} key={place.id}>
                              {place.name} <ArrowRightOutlined />
                            </a>
                          ))}
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </section>

        <section className="ttd-imageBand">
          <img src={SURF_IMAGE} alt="Surfer walking with a board in Ahangama" />
          <div>
            <span>Surf and beach</span>
            <h2>Conditions are the first recommendation</h2>
            <p>
              A named break is not a promise. Ask about tide, entry, reef,
              current and crowd before paddling out; non-surfers should apply
              the same care to swimming.
            </p>
            <a href="/ahangama-sri-lanka">
              Read the wider destination guide <ArrowRightOutlined />
            </a>
          </div>
        </section>

        <VenueStrip
          title="Food and drink"
          introduction="A current selection for breakfast, post-surf lunch, sunset and dinner. Names, images, locations and descriptions come from active place records."
          slugs={THINGS_TO_DO_AHANGAMA_PAGE.venueGroups.food}
          placesBySlug={placesBySlug}
        />

        <VenueStrip
          title="Wellness and movement"
          introduction="Movement, recovery and slower indoor hours. Confirm the day's timetable and book directly where required."
          slugs={THINGS_TO_DO_AHANGAMA_PAGE.venueGroups.wellness}
          placesBySlug={placesBySlug}
        />

        <VenueStrip
          title="Shopping and local makers"
          introduction="A small active edit of independent retail. Ask about provenance and use the events calendar for temporary markets and pop-ups."
          slugs={THINGS_TO_DO_AHANGAMA_PAGE.venueGroups.shopping}
          placesBySlug={placesBySlug}
        />

        <section className="ttd-section ttd-section--night">
          <div className="ttd-inner">
            <div className="ttd-sectionHead">
              <h2>After dark</h2>
            </div>
            {events.length ? (
              <div className="ttd-eventGrid">
                {events.map((event) => (
                  <article
                    key={event.id || `${event.title}-${event.dateLabel}`}
                  >
                    {event.image ? <img src={event.image} alt="" /> : null}
                    <span>
                      {event.dateLabel}
                      {event.time ? ` · ${event.time}` : ""}
                    </span>
                    <h3>{event.title}</h3>
                    <p>{event.venue}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="ttd-eventsEmpty">
                Current events will appear here when matching music, market,
                wellness or workshop records are published.
              </p>
            )}
            <a className="ttd-inlineCta" href="/events">
              Open the full events calendar <ArrowRightOutlined />
            </a>
          </div>
        </section>

        <section className="ttd-inland">
          <img
            src={INLAND_IMAGE}
            alt="Small boat travelling along an inland waterway near Ahangama"
          />
          <div>
            <span>Beyond the coast road</span>
            <h2>Inland Ahangama moves at a different pace</h2>
            <p>
              Follow village lanes carefully and remember that paddy fields,
              temples and riverside homes are working places. River trips need
              direct verification of the operator, route, capacity, safety gear
              and environmental practice before booking.
            </p>
          </div>
        </section>

        <section className="ttd-section ttd-section--trips">
          <div className="ttd-inner">
            <div className="ttd-sectionHead">
              <h2>Worth the journey</h2>
              <p>
                These outings are not in Ahangama. Keep the transfer in the
                plan, allow for traffic and sea conditions, and resist
                compressing a full-day journey into a local afternoon.
              </p>
            </div>
            <div className="ttd-tripGrid">
              {THINGS_TO_DO_AHANGAMA_PAGE.nearbyTrips.map((trip) => (
                <article key={trip.id}>
                  <span>{trip.label}</span>
                  <h3>{trip.title}</h3>
                  <div>
                    {trip.duration} · {trip.costLevel} spend
                  </div>
                  <p>{trip.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ttd-section" id="choose-by-time">
          <div className="ttd-inner">
            <div className="ttd-sectionHead">
              <h2>Choose by time and mood</h2>
              <p>
                Use all four controls together. The result combines local ideas
                and clearly labelled excursions without changing their location.
              </p>
            </div>
            <div className="ttd-planner">
              {[
                ["Time", DURATION_OPTIONS, duration, setDuration],
                ["Company", TRAVELLER_OPTIONS, traveller, setTraveller],
                ["Spend", COST_OPTIONS, cost, setCost],
              ].map(([label, options, value, setter]) => (
                <fieldset key={label}>
                  <legend>{label}</legend>
                  <div>
                    {options.map((option) => (
                      <button
                        aria-pressed={value === option}
                        className={value === option ? "is-active" : ""}
                        key={option}
                        onClick={() => setter(option)}
                        type="button"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
            <p className="ttd-resultCount" aria-live="polite">
              {filteredActivities.length} ideas match your choices
            </p>
            <div className="ttd-resultGrid">
              {filteredActivities.map((item) => (
                <article key={item.id}>
                  <span>{item.area}</span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <small>
                    {item.duration} · {item.costLevel} spend
                  </small>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ttd-section ttd-section--plan">
          <div className="ttd-inner">
            <div className="ttd-sectionHead">
              <h2>Map and practical planning</h2>
              <p>
                Ahangama is spread along a fast coast road. Group Kabalana,
                central Ahangama and inland stops rather than crossing town
                after every activity.
              </p>
            </div>
            <div className="ttd-planGrid">
              <article>
                <h3>Move</h3>
                <p>
                  Use tuk-tuks for short hops, agree the fare before leaving and
                  arrange late pickup in advance. Walking is easiest within one
                  cluster.
                </p>
              </article>
              <article>
                <h3>Watch the weather</h3>
                <p>
                  Rain, wind and swell can change a sensible day. Keep one
                  indoor option and avoid treating a seasonal pattern as a daily
                  forecast.
                </p>
              </article>
              <article>
                <h3>Book selectively</h3>
                <p>
                  Reserve lessons, treatments, workshops, diving and safaris.
                  Leave space around cafés, beaches and browsing so the day can
                  adjust.
                </p>
              </article>
            </div>
            <div className="ttd-mapActions">
              <a href="/map">
                <EnvironmentOutlined /> Open the Ahangama map
              </a>
              <a href="/guide">
                Browse the full guide <ArrowRightOutlined />
              </a>
            </div>
          </div>
        </section>

        <section className="ttd-section ttd-section--faq">
          <div className="ttd-inner">
            <div className="ttd-sectionHead">
              <h2>Things to do in Ahangama: FAQ</h2>
              <p>
                Direct planning answers, with room for daily conditions to
                overrule evergreen advice.
              </p>
            </div>
            <div className="ttd-faq">
              {FAQS.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <EditorialNextArticle {...NEXT_ARTICLE} />
      </main>
    </SiteLayout>
  );
}
