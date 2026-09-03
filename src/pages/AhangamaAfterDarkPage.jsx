import React from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Paragraph, Text, Title } = Typography;

export const AHANGAMA_AFTER_DARK_PATH = "/ahangama-after-dark";

const LIGHTHOUSE_IMAGES = "/Light House Webpage images";
const HERO_IMAGE = `${LIGHTHOUSE_IMAGES}/light-house-beach-view-hero.webp`;
const ROOFTOP_IMAGE = `${LIGHTHOUSE_IMAGES}/people-enjoying-cocktails-in-the-rooftop-portrait.webp`;
const COCKTAIL_IMAGE = `${LIGHTHOUSE_IMAGES}/light-house-staff-making-cocktails-portrait.webp`;
const WIDE_IMAGE = `${LIGHTHOUSE_IMAGES}/cocktail-4-wide-feature.webp`;
const LIVE_MUSIC_IMAGE =
  "/Images for Events Calendar/Kai - Live Music - Venue Image.png";

const publishDate = "2026-09-02T09:00:00.000Z";

const NEXT_ARTICLE = {
  href: "/best-sunsets-in-ahangama",
  kicker: "Read Next",
  title: "The Best Sunsets in Ahangama",
  image:
    "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/best-sunsets/Hero+Image+-+2400+x+1600+px.webp",
};

const articleIntroduction = [
  "Ahangama does not switch off when the surfboards come out of the water. It changes tempo. The last light draws people toward rooftops and the beach, dinner tables begin to fill, and a town that felt scattered through the afternoon suddenly becomes social.",
  "There is no single nightlife strip and no reason to follow one fixed circuit. A good evening might be one careful cocktail above the ocean, live music over dinner, or a late DJ set that was only decided on after sunset.",
  "The useful rule is simple: choose the mood before the venue. Ahangama works best after dark when the night still has room to change.",
];

const articleSections = [
  {
    eyebrow: "Golden hour",
    title: "Let Sunset Be the Beginning",
    body: [
      "The evening starts before dark. Rooftops and beachfront venues begin filling as the heat drops, usually with enough time for a drink before the horizon changes. Lighthouse is one of the clearest versions of this ritual: elevated ocean views, cocktails, and a crowd that moves easily from sunset into dinner.",
      "Hakuna Matata and Surf Club Midigama offer a looser beach-led energy when music matters as much as the view. Arrive early enough to settle in rather than racing the sun, then decide whether the same place should carry the rest of the night.",
    ],
    quote:
      "In Ahangama, the best night out often begins while there is still salt on your skin.",
  },
  {
    eyebrow: "Dinner first",
    title: "Choose a Table That Can Become an Evening",
    body: [
      "Some nights need no hard transition between dinner and going out. Kai Ahangama regularly pairs food with live music, making it a useful choice when the group wants atmosphere without committing to a late finish. Samba has a similarly easy social quality: start with a meal, stay for another drink, and see where the room goes.",
      "For a quieter opening, choose a more considered dinner or a small bar before moving on. Ahangama's distances are short, but the road can make constant venue-hopping feel less effortless than it looks on a map. One strong dinner stop and one later destination is usually enough.",
    ],
  },
  {
    eyebrow: "Music nights",
    title: "Follow the Calendar, Not a Fixed Routine",
    body: [
      "The town's music rhythm changes through the week. Kai leans into recurring live performances, while Mono is a stronger fit for electronic sets and later energy. Kurundu, Ceylon Sliders, Hakuna Matata, and Surf Club Midigama often build nights around sundown sessions, guest DJs, or weekend parties.",
      "Line-ups, start times, entry prices, and even the busiest night can change with the season. Check the Ahangama events calendar on the day, then confirm the latest details with the venue before travelling. That small check is more useful than treating any weekly schedule as permanent.",
    ],
    cta: true,
  },
  {
    eyebrow: "Pick your pace",
    title: "Three Ways to Spend the Night",
    body: [
      "For something quiet, begin on a rooftop, stay through the afterglow, and book a table nearby. For something social, choose live music with dinner and leave the next stop undecided. For a proper late night, eat first, check the DJ line-up, and arrange the ride home before the room gets busy.",
      "Ahangama after dark is most enjoyable when it does not become a checklist. Wear what feels comfortable, carry cash as a backup, keep an eye on your drink, and use a trusted tuk-tuk or driver if the evening moves beyond walking distance.",
    ],
  },
];

const FEATURED_PLACES = [
  {
    name: "Lighthouse",
    note: "Ocean-view rooftop drinks and an easy sunset-to-dinner transition.",
    href: "https://www.google.com/maps/search/?api=1&query=Lighthouse+Ahangama",
  },
  {
    name: "Kai Ahangama",
    note: "Dinner and recurring live music in a relaxed setting.",
    href: "https://www.google.com/maps/search/?api=1&query=Kai+Ahangama",
  },
  {
    name: "Hakuna Matata",
    note: "Sunset music, cocktails, and livelier weekly sessions.",
    href: "https://www.google.com/maps/search/?api=1&query=Hakuna+Matata+Ahangama",
  },
  {
    name: "Mono",
    note: "Electronic music and a later-night atmosphere.",
    href: "https://www.google.com/maps/search/?api=1&query=Mono+Ahangama",
  },
  {
    name: "Kurundu",
    note: "Sundown sessions that can continue well into the night.",
    href: "https://www.google.com/maps/search/?api=1&query=Kurundu+Ahangama",
  },
  {
    name: "Surf Club Midigama",
    note: "Beachside sunset sessions a short ride west of Ahangama.",
    href: "https://www.google.com/maps/search/?api=1&query=Surf+Club+Midigama",
  },
];

const MENTIONED_PLACE_LINKS = FEATURED_PLACES.map((place) => ({
  label: place.name,
  href: place.href,
}));

function renderVenueLinkedText(text) {
  const sortedLinks = [...MENTIONED_PLACE_LINKS].sort(
    (left, right) => right.label.length - left.label.length,
  );
  const matches = [];

  sortedLinks.forEach((link) => {
    let searchIndex = 0;

    while (searchIndex < text.length) {
      const foundIndex = text.indexOf(link.label, searchIndex);

      if (foundIndex === -1) break;

      const overlaps = matches.some(
        (match) =>
          foundIndex < match.end &&
          foundIndex + link.label.length > match.start,
      );

      if (!overlaps) {
        matches.push({
          ...link,
          start: foundIndex,
          end: foundIndex + link.label.length,
        });
      }

      searchIndex = foundIndex + link.label.length;
    }
  });

  if (!matches.length) return text;

  matches.sort((left, right) => left.start - right.start);

  const segments = [];
  let cursor = 0;

  matches.forEach((match) => {
    if (cursor < match.start) {
      segments.push(text.slice(cursor, match.start));
    }

    segments.push(
      <a
        key={`${match.label}-${match.start}`}
        href={match.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#2f2a24",
          textDecoration: "none",
          borderBottom: "1px solid rgba(176, 142, 98, 0.9)",
          paddingBottom: 1,
        }}
      >
        {match.label}
      </a>,
    );

    cursor = match.end;
  });

  if (cursor < text.length) {
    segments.push(text.slice(cursor));
  }

  return segments;
}

function EditorialImage({ src, alt, aspectRatio = "4 / 5" }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      style={{
        display: "block",
        width: "100%",
        aspectRatio,
        objectFit: "cover",
        boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
      }}
    />
  );
}

export default function AhangamaAfterDarkPage() {
  const canonical = absUrl(AHANGAMA_AFTER_DARK_PATH);

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Ahangama After Dark"
        description="An editorial guide to sunset drinks, live music, dinner spots and late-night events in Ahangama, Sri Lanka."
        canonical={canonical}
        ogImage={HERO_IMAGE}
        ogType="article"
        author="Ahangama Guide Editorial Team"
        publishDate={publishDate}
      />

      <div
        className="dm-canvas"
        style={{
          marginTop: 0,
          paddingTop: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          background: "#ffffff",
        }}
      >
        <div className="dm-wrap">
          <div
            className="ahg-hero"
            style={{
              width: "100vw",
              marginLeft: "calc(50% - 50vw)",
              marginRight: "calc(50% - 50vw)",
              borderRadius: 0,
              background: "#171714",
              boxShadow: "none",
            }}
          >
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                minHeight: "100svh",
              }}
            >
              <div
                aria-hidden="true"
                className="home-hero-media-layer"
                style={{ position: "absolute", inset: 0, overflow: "hidden" }}
              >
                <img
                  className="home-hero-image"
                  src={HERO_IMAGE}
                  alt=""
                  fetchPriority="high"
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center center",
                  }}
                />
                <div
                  className="home-hero-overlay"
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 2,
                    background:
                      "linear-gradient(90deg, rgba(8,10,10,0.88) 0%, rgba(8,10,10,0.68) 30%, rgba(8,10,10,0.28) 62%, rgba(8,10,10,0.08) 100%)",
                    pointerEvents: "none",
                  }}
                />
              </div>

              <div
                style={{
                  position: "relative",
                  zIndex: 3,
                  width: "100%",
                  maxWidth: 1100,
                  margin: "0 auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    minHeight: "100svh",
                    maxWidth: 720,
                    padding:
                      "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 36px",
                  }}
                >
                  <Text
                    style={{
                      marginBottom: 18,
                      color: "#ffffff",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1.6,
                      textTransform: "uppercase",
                    }}
                  >
                    Nightlife Guide / Ahangama Editorial
                  </Text>
                  <Title
                    className="home-hero-title"
                    style={{
                      margin: 0,
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
                      Ahangama
                    </span>
                    <span
                      className="home-hero-titleLine"
                      style={{ color: "#ffffff" }}
                    >
                      After Dark
                    </span>
                  </Title>
                  <Text
                    style={{
                      display: "block",
                      marginTop: 14,
                      color: "#ffffff",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1.6,
                      textTransform: "uppercase",
                    }}
                  >
                    By the Ahangama Guide Editorial Team
                  </Text>
                  <Paragraph
                    style={{
                      marginTop: 24,
                      marginBottom: 22,
                      maxWidth: 570,
                      color: "#ffffff",
                      fontSize: "clamp(16px, 1.45vw, 19px)",
                      lineHeight: 1.72,
                    }}
                  >
                    Sunset drinks, dinner that becomes a night out, live music,
                    and the places to follow when the town changes tempo.
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="dm-wrap" style={{ paddingTop: 36 }}>
          <div style={{ maxWidth: 920, paddingBottom: 28 }}>
            {articleIntroduction.map((paragraph, index) => (
              <Paragraph
                key={paragraph}
                style={{
                  marginBottom: 18,
                  color: index < 2 ? "#2f2a24" : "#55514b",
                  fontSize: index === 0 ? 22 : 18,
                  lineHeight: index === 0 ? 1.7 : 1.85,
                }}
              >
                {renderVenueLinkedText(paragraph)}
              </Paragraph>
            ))}
          </div>

          <EditorialImage
            src={WIDE_IMAGE}
            alt="Cocktail served against the evening sky at Lighthouse Ahangama"
            aspectRatio="3 / 2"
          />

          {articleSections.map((section, index) => (
            <React.Fragment key={section.title}>
              <section
                style={{
                  maxWidth: 920,
                  margin: "0 auto",
                  padding: "clamp(48px, 7vw, 84px) 0",
                }}
              >
                <Text
                  style={{
                    display: "block",
                    marginBottom: 12,
                    color: "#9b7748",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                  }}
                >
                  {section.eyebrow}
                </Text>
                <Title
                  level={2}
                  style={{
                    maxWidth: 760,
                    margin: "0 0 24px",
                    color: "#2f2a24",
                    fontFamily:
                      '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    fontSize: "clamp(38px, 5vw, 64px)",
                    fontWeight: 500,
                    lineHeight: 1,
                    letterSpacing: 0,
                  }}
                >
                  {section.title}
                </Title>
                {section.body.map((paragraph) => (
                  <Paragraph
                    key={paragraph}
                    style={{
                      marginBottom: 18,
                      color: "#55514b",
                      fontSize: 18,
                      lineHeight: 1.85,
                    }}
                  >
                    {renderVenueLinkedText(paragraph)}
                  </Paragraph>
                ))}
                {section.quote ? (
                  <blockquote
                    style={{
                      margin: "36px 0 0",
                      padding: "8px 0 8px 28px",
                      borderLeft: "2px solid #b08e62",
                      color: "#2f2a24",
                      fontFamily:
                        '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                      fontSize: "clamp(28px, 3vw, 40px)",
                      lineHeight: 1.2,
                    }}
                  >
                    {section.quote}
                  </blockquote>
                ) : null}
                {section.cta ? (
                  <a
                    href="/events"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      marginTop: 14,
                      color: "#2f2a24",
                      fontSize: 15,
                      fontWeight: 700,
                      textDecoration: "none",
                      borderBottom: "1px solid #b08e62",
                      paddingBottom: 4,
                    }}
                  >
                    See what is on this week <ArrowRightOutlined />
                  </a>
                ) : null}
              </section>

              {index === 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                    gap: 24,
                    marginBottom: 12,
                  }}
                >
                  <EditorialImage
                    src={ROOFTOP_IMAGE}
                    alt="Friends enjoying cocktails on the Lighthouse rooftop in Ahangama"
                  />
                  <EditorialImage
                    src={COCKTAIL_IMAGE}
                    alt="Bartender preparing cocktails at Lighthouse Ahangama"
                  />
                </div>
              ) : null}

              {index === 2 ? (
                <EditorialImage
                  src={LIVE_MUSIC_IMAGE}
                  alt="Live music performance at Kai Ahangama"
                  aspectRatio="3 / 2"
                />
              ) : null}
            </React.Fragment>
          ))}

          <section
            style={{
              margin: "20px 0 56px",
              padding: "clamp(32px, 5vw, 56px)",
              background: "#f3f0e9",
            }}
          >
            <Text
              style={{
                color: "#9b7748",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              Places Mentioned
            </Text>
            <Title
              level={2}
              style={{
                margin: "12px 0 28px",
                color: "#2f2a24",
                fontFamily:
                  '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                fontSize: "clamp(36px, 4vw, 54px)",
                fontWeight: 500,
                letterSpacing: 0,
              }}
            >
              Start with the mood, then choose the room.
            </Title>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
                gap: 24,
              }}
            >
              {FEATURED_PLACES.map((place) => (
                <a
                  key={place.name}
                  href={place.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    paddingTop: 18,
                    color: "inherit",
                    textDecoration: "none",
                    borderTop: "1px solid rgba(47,42,36,0.18)",
                  }}
                >
                  <Text
                    strong
                    style={{ display: "block", color: "#2f2a24", fontSize: 17 }}
                  >
                    {place.name} <ArrowRightOutlined style={{ fontSize: 12 }} />
                  </Text>
                  <Text
                    style={{
                      display: "block",
                      marginTop: 8,
                      color: "#666057",
                      lineHeight: 1.65,
                    }}
                  >
                    {place.note}
                  </Text>
                </a>
              ))}
            </div>
          </section>

          <aside
            style={{
              maxWidth: 920,
              margin: "0 auto clamp(48px, 7vw, 76px)",
              paddingTop: 24,
              borderTop: "1px solid rgba(47,42,36,0.14)",
            }}
          >
            <Text
              style={{
                display: "block",
                color: "#9b7748",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              A small extra
            </Text>
            <Paragraph
              style={{
                maxWidth: 700,
                margin: "10px 0 0",
                color: "#666057",
                fontSize: 16,
                lineHeight: 1.75,
              }}
            >
              Among the places mentioned here, the current Ahangama Pass perks
              include 10% off food, drinks, and bookings at Lighthouse
              Ahangama, 10% off the daily special at Hakuna Matata, and 10% off
              the total bill at Surf Club. Show your pass when ordering or
              paying, and check the current list before heading out, as offers
              can change. {" "}
              <a
                href="/pass-perks"
                style={{
                  color: "#2f2a24",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(176, 142, 98, 0.9)",
                  paddingBottom: 1,
                }}
              >
                View current pass perks
              </a>
              .
            </Paragraph>
          </aside>

          <EditorialNextArticle {...NEXT_ARTICLE} />
        </main>
      </div>
    </SiteLayout>
  );
}