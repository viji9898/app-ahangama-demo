import React from "react";
import { Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Paragraph, Text, Title } = Typography;

export const HOW_TO_GET_FROM_COLOMBO_TO_AHANGAMA_PATH =
  "/how-to-get-from-colombo-to-ahangama";

const HERO_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/ahangama-train-station-sri-Lanka.webp";
const TRANSPORT_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/ahangama-person-on-bike-surfboard-transport-landscape.webp";
const publishDate = "2026-09-06T09:00:00.000Z";

const articleIntroduction = [
  "Ahangama sits roughly 150 kilometres south of Colombo, with the final approach following Sri Lanka's palm-lined southern coast. The best way to make the journey depends less on distance than on where you are starting, how much luggage you have and whether speed, comfort or scenery matters most.",
  "The first distinction is important: Colombo city and Bandaranaike International Airport are not in the same place. The airport is north of Colombo, near Katunayake, so an airport pickup starts farther from Ahangama than a journey from central Colombo.",
  "For most first-time visitors, a pre-booked car is the simplest option. The coastal train is the most memorable. Express buses can be economical, but usually involve an onward tuk-tuk, taxi or local bus for the final leg.",
];

const routeOptions = [
  {
    title: "Private transfer",
    time: "Around 2.5-4 hours",
    bestFor: "Airport arrivals, families, groups and surfboards",
    detail:
      "Door-to-door travel using the southern expressway where practical. Journey time varies with the pickup point and traffic around Colombo and the airport.",
  },
  {
    title: "Coastal train",
    time: "Around 2.5-3.5 hours from Colombo Fort",
    bestFor: "Light luggage, scenery and daytime travel",
    detail:
      "Direct trains are the easiest rail option, but not every southbound service stops at Ahangama. Check the current timetable and stop pattern before travelling.",
  },
  {
    title: "Express bus",
    time: "Allow 3.5-5 hours door to door",
    bestFor: "Budget-conscious travellers with manageable luggage",
    detail:
      "Expressway buses typically run toward Galle or Matara. Continue to Ahangama by local bus, tuk-tuk or taxi from the arrival terminal.",
  },
  {
    title: "Rental car or self-drive",
    time: "Around 2.5-3.5 hours from Colombo",
    bestFor: "Confident drivers planning a wider road trip",
    detail:
      "The expressway makes the long section straightforward, but city traffic, local driving habits and the final coastal roads require attention.",
  },
];

const articleSections = [
  {
    title: "The easiest option: a private transfer",
    body: [
      "A private car is the most practical choice after a long flight. Your driver can meet you at the airport or a Colombo hotel, handle luggage and travel directly to your accommodation in Ahangama.",
      "From Bandaranaike International Airport, allow more time than you would from Colombo city. The route first travels south past the capital before joining the expressway. Traffic near Katunayake and Colombo can change the journey considerably, especially around weekday peaks.",
      "Confirm the total price, vehicle size, pickup point and any charges for expressway tolls before departure. Travellers carrying surfboards should share the board dimensions when booking rather than assuming a standard car can accommodate them.",
    ],
    quote:
      "Landing late, travelling with children or carrying boards? A booked transfer removes the most uncertainty from arrival day.",
  },
  {
    title: "The scenic option: train from Colombo Fort",
    body: [
      "The coastal railway is one of Sri Lanka's classic journeys. South of Colombo, the line runs between towns, beaches and flashes of the Indian Ocean before reaching Ahangama station in the centre of town.",
      "Start at Colombo Fort railway station and look for a southbound service that explicitly stops at Ahangama. Some faster trains skip smaller stations, while others terminate before reaching the south coast. Timetables and carriage classes can change, so check the official Sri Lanka Railways schedule close to travel day.",
      "Reserved seats are useful when available, particularly on weekends and holidays. Unreserved carriages can become crowded, and large suitcases or surfboards make boarding more difficult. From Ahangama station, most hotels are a short tuk-tuk ride away.",
    ],
  },
  {
    title: "The budget option: express bus",
    body: [
      "Expressway buses connect the Colombo area with Galle and Matara. They are faster and more comfortable than taking a local bus along the entire coastal road, but they do not usually deliver you directly to your hotel in Ahangama.",
      "From Galle or Matara, continue along the coast by local bus, tuk-tuk or taxi. Galle is west of Ahangama and Matara is east, so either can work depending on the service you catch. Build in time to change vehicles and keep luggage compact if possible.",
      "Bus terminals, departure points and service frequencies can change. Ask your accommodation to confirm the most convenient current connection before you leave Colombo.",
    ],
  },
  {
    title: "Driving yourself",
    body: [
      "A rental car offers flexibility if Ahangama is one stop in a longer Sri Lankan itinerary. From Colombo, the usual fast route uses the Southern Expressway before joining local roads for the final approach to the coast.",
      "Self-driving is best suited to visitors already comfortable with left-side driving and Sri Lankan road conditions. Motorbikes, buses, pedestrians and animals all share local roads, and journeys after dark demand extra care.",
      "Check that your licence and permit are valid for Sri Lanka, understand the rental insurance, and avoid building a tight arrival-day schedule around an optimistic map estimate.",
    ],
  },
  {
    title: "What to book before you travel",
    body: [
      "For a transfer, send your flight number or Colombo pickup address, arrival time, passenger count and luggage details. Ask for the driver's contact number and meeting instructions before departure.",
      "For the train, verify the date, departure station, destination stop and whether the ticket is reserved or unreserved. Keep enough time to reach Colombo Fort, find the platform and board without rushing.",
      "Whichever route you choose, share your expected arrival time with your Ahangama accommodation. Reception desks at smaller villas are not always staffed around the clock, and a little coordination makes the final few kilometres much easier.",
    ],
  },
];

const usefulLinks = [
  {
    label: "Sri Lanka Railways",
    href: "https://railway.gov.lk/",
    note: "Official railway information and current schedule resources.",
  },
  {
    label: "Ahangama transport and transfers",
    href: "/transport",
    note: "Request airport pickups, private transfers and local transport.",
  },
  {
    label: "Getting Around Ahangama",
    href: "/getting-around-ahangama-scooters-tuk-tuks-airport-transfers",
    note: "Plan scooters, tuk-tuks and onward travel after arrival.",
  },
];

export default function HowToGetFromColomboToAhangamaPage() {
  const canonical = absUrl(HOW_TO_GET_FROM_COLOMBO_TO_AHANGAMA_PATH);

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="How to Get from Colombo to Ahangama"
        description="Compare private transfers, trains, buses and self-drive routes from Colombo or Bandaranaike Airport to Ahangama, with practical arrival advice."
        canonical={canonical}
        ogImage={HERO_IMAGE}
        ogType="article"
        author="Ahangama Guide Editorial Team"
        publishDate={publishDate}
      />

      <main
        className="dm-canvas"
        style={{ marginTop: 0, paddingTop: 0, background: "#ffffff" }}
      >
        <div className="dm-wrap">
          <header
            className="ahg-hero"
            style={{
              width: "100vw",
              marginLeft: "calc(50% - 50vw)",
              marginRight: "calc(50% - 50vw)",
              borderRadius: 0,
              background: "#ffffff",
              boxShadow: "none",
            }}
          >
            <div
              style={{
                position: "relative",
                minHeight: "100svh",
                overflow: "hidden",
              }}
            >
              <div
                className="home-hero-media-layer"
                aria-hidden="true"
                style={{ position: "absolute", inset: 0 }}
              >
                <img
                  className="home-hero-image"
                  src={HERO_IMAGE}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
                <div
                  className="home-hero-overlay"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(90deg, rgba(8,14,16,0.84) 0%, rgba(8,14,16,0.65) 34%, rgba(8,14,16,0.12) 74%)",
                  }}
                />
              </div>

              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  maxWidth: 1100,
                  margin: "0 auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    minHeight: "100svh",
                    maxWidth: 760,
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding:
                      "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 40px",
                  }}
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1.6,
                      textTransform: "uppercase",
                    }}
                  >
                    Practical Travel Guide
                  </Text>
                  <Title
                    className="home-hero-title"
                    style={{
                      margin: "18px 0 0",
                      color: "#ffffff",
                      fontWeight: 500,
                      fontFamily:
                        '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    <span
                      className="home-hero-titleLine"
                      style={{ color: "#ffffff" }}
                    >
                      How to Get from
                    </span>
                    <span
                      className="home-hero-titleLine"
                      style={{ color: "#ffffff" }}
                    >
                      Colombo to
                    </span>
                    <span
                      className="home-hero-titleLine"
                      style={{ color: "#ffffff" }}
                    >
                      Ahangama
                    </span>
                  </Title>
                  <Paragraph
                    style={{
                      maxWidth: 600,
                      margin: "24px 0 0",
                      color: "#ffffff",
                      fontSize: "clamp(16px, 1.45vw, 19px)",
                      lineHeight: 1.72,
                    }}
                  >
                    The practical route south, whether you arrive at the
                    airport, begin in Colombo Fort or travel with a surfboard in
                    tow.
                  </Paragraph>
                </div>
              </div>
            </div>
          </header>
        </div>

        <div className="dm-wrap" style={{ paddingTop: 36 }}>
          <article>
            <div style={{ maxWidth: 920, paddingBottom: 22 }}>
              {articleIntroduction.map((paragraph, index) => (
                <Paragraph
                  key={paragraph}
                  style={{
                    fontSize: index === 0 ? 22 : 18,
                    lineHeight: index === 0 ? 1.7 : 1.85,
                    color: index === 0 ? "#2f2a24" : "#55514b",
                    marginBottom: 18,
                  }}
                >
                  {paragraph}
                </Paragraph>
              ))}
            </div>

            <section
              style={{ padding: "24px 0 42px" }}
              aria-labelledby="route-comparison-title"
            >
              <Text
                style={{
                  color: "#766d63",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                }}
              >
                At a glance
              </Text>
              <Title
                id="route-comparison-title"
                level={2}
                style={{ margin: "8px 0 22px" }}
              >
                Choose the route that fits the trip
              </Title>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 1,
                  background: "rgba(47,62,58,0.14)",
                  border: "1px solid rgba(47,62,58,0.14)",
                }}
              >
                {routeOptions.map((option) => (
                  <div
                    key={option.title}
                    style={{
                      minHeight: 250,
                      padding: 24,
                      background: "#ffffff",
                    }}
                  >
                    <Title
                      level={3}
                      style={{ marginTop: 0, marginBottom: 14, fontSize: 24 }}
                    >
                      {option.title}
                    </Title>
                    <Text
                      strong
                      style={{
                        display: "block",
                        marginBottom: 8,
                        color: "#2f2a24",
                      }}
                    >
                      {option.time}
                    </Text>
                    <Text
                      style={{
                        display: "block",
                        marginBottom: 16,
                        color: "#766d63",
                        fontSize: 13,
                      }}
                    >
                      {option.bestFor}
                    </Text>
                    <Paragraph
                      style={{ margin: 0, color: "#55514b", lineHeight: 1.7 }}
                    >
                      {option.detail}
                    </Paragraph>
                  </div>
                ))}
              </div>
              <Paragraph
                style={{ marginTop: 14, color: "#766d63", fontSize: 13 }}
              >
                Travel times are estimates. Traffic, weather, timetables and
                connections can materially change the journey.
              </Paragraph>
            </section>

            <figure style={{ margin: "0 0 36px", width: "100%" }}>
              <div
                style={{
                  width: "100%",
                  aspectRatio: "3 / 2",
                  overflow: "hidden",
                }}
              >
                <img
                  src={TRANSPORT_IMAGE}
                  alt="Travelling by scooter on Sri Lanka's south coast"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <figcaption
                style={{ marginTop: 10, color: "#766d63", fontSize: 13 }}
              >
                The journey south is only the beginning; local transport shapes
                how you explore after arrival.
              </figcaption>
            </figure>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {articleSections.map((section, index) => (
                <section
                  key={section.title}
                  style={{
                    padding: "36px 0",
                    borderTop:
                      index === 0 ? "none" : "1px solid rgba(47,62,58,0.12)",
                  }}
                >
                  <div style={{ maxWidth: 1100 }}>
                    <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
                      {section.title}
                    </Title>
                    {section.body.map((paragraph) => (
                      <Paragraph
                        key={paragraph}
                        style={{
                          maxWidth: 1000,
                          color: "#55514b",
                          fontSize: 16,
                          lineHeight: 1.8,
                          marginBottom: 18,
                        }}
                      >
                        {paragraph}
                      </Paragraph>
                    ))}
                    {section.quote ? (
                      <blockquote
                        style={{
                          margin: "8px 0 0",
                          padding: "20px 24px",
                          borderLeft: "3px solid rgba(107,90,78,0.4)",
                          background: "#f7f5f1",
                          color: "#2f2a24",
                          fontSize: 22,
                          lineHeight: 1.55,
                          fontFamily:
                            '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                        }}
                      >
                        {section.quote}
                      </blockquote>
                    ) : null}
                  </div>
                </section>
              ))}
            </div>

            <section
              style={{
                padding: "36px 0 56px",
                borderTop: "1px solid rgba(47,62,58,0.12)",
              }}
              aria-labelledby="useful-links-title"
            >
              <Text
                style={{
                  color: "#766d63",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                }}
              >
                Plan the journey
              </Text>
              <Title
                id="useful-links-title"
                level={2}
                style={{ margin: "8px 0 22px" }}
              >
                Useful links
              </Title>
              <div
                style={{
                  display: "grid",
                  gap: 0,
                  borderTop: "1px solid rgba(47,62,58,0.14)",
                }}
              >
                {usefulLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(180px, 0.4fr) 1fr",
                      gap: 24,
                      padding: "18px 0",
                      borderBottom: "1px solid rgba(47,62,58,0.14)",
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    <Text strong style={{ color: "#2f2a24" }}>
                      {link.label}
                    </Text>
                    <Text style={{ color: "#66615b" }}>{link.note}</Text>
                  </a>
                ))}
              </div>
            </section>
          </article>

          <EditorialNextArticle
            href="/getting-around-ahangama-scooters-tuk-tuks-airport-transfers"
            kicker="Continue Planning"
            title="Getting Around Ahangama"
            image={TRANSPORT_IMAGE}
          />
        </div>
      </main>
    </SiteLayout>
  );
}
