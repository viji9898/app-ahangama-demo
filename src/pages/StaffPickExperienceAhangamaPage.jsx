import React from "react";
import { Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Paragraph, Text, Title } = Typography;

export const STAFF_PICK_EXPERIENCE_AHANGAMA_PATH =
  "/staff-pick-experience-a-day-that-slowly-erases-your-plan-in-ahangama";

const BASE_IMAGE_URL =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/staff-pick-experience-a-day-that-slowly-erases-your-plan-in-ahangama";

const FEATURE_IMAGE = `${BASE_IMAGE_URL}/Feature+Image_marshmallow-ahangama-beanbag-relaxing-cafe.webp`;
const HERO_IMAGE = `${BASE_IMAGE_URL}/Hero+image+_+ahangama-morning-coffee-hands-cups-close-up.webp`;
const KUMARA_TUKTUK_IMAGE = `${BASE_IMAGE_URL}/Portrait_+kumara-tuktuk+.webp`;
const HOTEL_DE_UNCLES_IMAGE = `${BASE_IMAGE_URL}/Potrait+_+Hotel-de-uncles-couple-dancing.webp`;
const SURFBOARDS_GROUP_IMAGE = `${BASE_IMAGE_URL}/Potrait+_+people-standing-with-surfboards-on-beach-ahangama.webp`;
const CRUST_GUITAR_IMAGE = `${BASE_IMAGE_URL}/Potrait+_+The+crust+-playing+-guitar-live+music.webp`;
const CRUST_DANCING_IMAGE = `${BASE_IMAGE_URL}/Potrait+_Crust-woman-dancing+-with-a+-cocktail.webp`;
const CEYLON_SLIDERS_IMAGE = `${BASE_IMAGE_URL}/Potrait+-+person+-+holding-surfboard+-ceylon+sliders.webp`;
const BEACH_CAFE_IMAGE = `${BASE_IMAGE_URL}/Potrait+-+two-people-cafe-drinks-beach-view-relaxed-morning.webp`;
const COOKING_CLASS_IMAGE = `${BASE_IMAGE_URL}/Potrait_+Cooking+-class-.Squeezing-coconut.webp`;

const publishDate = "2026-06-30T09:00:00.000Z";

const NEXT_ARTICLE = {
  href: "/the-living-room-concept-store",
  kicker: "Read Next",
  title: "The Living Room Concept Store",
  image:
    "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/hero-the-living-room-concept-store.jpeg",
};

const articleIntroduction = [
  "Ahangama does not begin in a fixed place. It begins the moment your plan stops holding shape.",
  "What starts as structure slowly softens into something more intuitive: cafes become pauses, beaches become habits, and the day starts making decisions for you instead of the other way around.",
  "You do not really move through Ahangama. You adjust to it.",
];

const articleSections = [
  {
    title: "Morning Arrives Without Urgency",
    body: [
      "At Kaffi Ahangama, coffee feels like the first real decision of the day, though even that feels gentle. The air is still warm from the ocean, and the coast is already in motion outside.",
      "Some are returning from early surf at Kabalana, others are still deciding whether today will be productive or not. Ahangama does not push either direction. It simply continues.",
    ],
  },
  {
    title: "By Mid-Morning, Comfort Takes Over",
    body: [
      "At Marshmellow Cafe Ahangama, beanbags replace structure. Brunch arrives without urgency. Conversations drift without direction, and somewhere between coffee refills and ocean air, laptops open, work happens softly in the background, and time stretches in a way that does not feel like work at all.",
      "People stay longer than they planned, not because something is happening, but because nothing is asking them to leave.",
      "This is where the day begins to quietly erase itself.",
    ],
  },
  {
    title: "By Midday, Everything Moves Toward the Ocean",
    body: [
      "Kabalana becomes a repeating rhythm: surfers entering and leaving the water in cycles that feel both identical and completely different every time they return. The beach holds a kind of shared attention that does not need coordination.",
      "Along the same coastline, Ceylon Sliders becomes part of the surf itself, not just a place to pause after, but a place to begin from. Surfboards lean against walls, people move between ocean and rooftop, and the boundary between surfing and staying disappears.",
      "Ahangama does not separate movement from pause. It lets them overlap.",
    ],
  },
  {
    title: "The Afternoon Becomes More Grounded",
    body: [
      "Through Kumbuk Community's Traditional Cooking Class - Cooking with Amma, the rhythm shifts from simply observing to taking part. Side by side with a local mother, fresh ingredients are prepared by hand, spices are blended from scratch, and traditional Sri Lankan recipes come to life through generations of knowledge.",
      "It is not a cooking class designed for tourists. It is a genuine invitation into a family tradition.",
      "Around the kitchen, stories are shared as naturally as the meal itself, revealing a side of Ahangama that stretches far beyond its cafes and coastline: warm hospitality, timeless flavours, and a culture that is best experienced around the table.",
    ],
  },
  {
    title: "Movement Is Never Separate",
    body: [
      "Shantha's tuk tuk becomes part of the rhythm, drifting along the coastal road, connecting cafes, beaches, workshops, and evenings without ever breaking the flow of the day.",
      "It does not feel like transport. It feels like a continuation.",
    ],
  },
  {
    title: "Sunset Does Not Arrive. It Spreads.",
    body: [
      "At Thileni's, the light begins to soften everything it touches. People slow down without deciding to. Conversations thin out naturally. The ocean becomes the only fixed point in a changing sky.",
      "Elsewhere along the coast, Ceylon Sliders catches the same light differently: rooftops, silhouettes, and that shared silence that seems to appear everywhere at once.",
      "For a short moment, the entire coastline feels aligned.",
    ],
  },
  {
    title: "Night Begins Gently, Then Shifts",
    body: [
      "At Crust Ahangama, live music fills the space between tables. Pizza, sound, laughter, and rhythm blend into something social but unforced. It feels alive without trying to perform.",
      "Later, Hotel de Uncles shifts the tone completely: karaoke, movement, laughter that builds quickly and unpredictably. People stop being observers and become part of the night itself.",
      "Ahangama at night does not follow structure. It replaces it with energy.",
    ],
    quote:
      "You do not really plan a day in Ahangama. The plan dissolves quietly, until what is left feels more honest than what you started with.",
  },
];

const MENTIONED_PLACE_LINKS = [
  {
    label: "Kumbuk Community's Traditional Cooking Class - Cooking with Amma",
    href: "https://www.instagram.com/kumbuk.community/",
  },
  {
    label: "Kumbuk Community's Traditional Cooking Class",
    href: "https://www.instagram.com/kumbuk.community/",
  },
  {
    label: "Marshmellow Cafe Ahangama",
    href: "https://www.instagram.com/marshmellowcafe.srilanka/?hl=en",
  },
  {
    label: "Kaffi Ahangama",
    href: "https://www.instagram.com/kaffi.ahangama/?hl=en",
  },
  {
    label: "Ceylon Sliders",
    href: "https://www.instagram.com/ceylonsliders/?hl=en",
  },
  {
    label: "Thileni's",
    href: "https://www.instagram.com/thilenis_ahangama/?hl=en",
  },
  {
    label: "Crust Ahangama",
    href: "https://www.instagram.com/crust_ahangama/?hl=en",
  },
  {
    label: "Hotel de Uncles",
    href: "https://www.instagram.com/hoteldeuncles/?hl=en",
  },
];

const FEATURED_VENUES = [
  {
    ...MENTIONED_PLACE_LINKS.find((place) => place.label === "Kaffi Ahangama"),
    note: "The soft start: coffee, coast air and the first loose decision of the day.",
  },
  {
    ...MENTIONED_PLACE_LINKS.find(
      (place) => place.label === "Marshmellow Cafe Ahangama",
    ),
    note: "A slow brunch pause where beanbags, refills and ocean air stretch the morning.",
  },
  {
    ...MENTIONED_PLACE_LINKS.find((place) => place.label === "Ceylon Sliders"),
    note: "Surf culture with a social edge, moving between boards, rooftops and the sea.",
  },
  {
    label: "Kumbuk Community's Traditional Cooking Class / Cooking with Amma",
    href: "https://www.instagram.com/kumbuk.community/",
    note: "A grounded afternoon invitation into family cooking, spice, story and tradition.",
  },
  {
    ...MENTIONED_PLACE_LINKS.find((place) => place.label === "Thileni's"),
    note: "A sunset stop where the light slows the coastline down without asking.",
  },
  {
    ...MENTIONED_PLACE_LINKS.find((place) => place.label === "Crust Ahangama"),
    note: "The evening shift: pizza, live music, cocktails and an easy social rhythm.",
  },
  {
    ...MENTIONED_PLACE_LINKS.find((place) => place.label === "Hotel de Uncles"),
    note: "The late-night turn, where karaoke and movement pull everyone into the room.",
  },
].filter(Boolean);

function renderVenueLinkedText(text, styleOverride = {}) {
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
          borderBottom: "1px solid rgba(214, 178, 102, 0.9)",
          paddingBottom: 1,
          ...styleOverride,
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

function PortraitImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        display: "block",
        width: "100%",
        aspectRatio: "4 / 5",
        objectFit: "cover",
        boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
      }}
    />
  );
}

function ImageGrid({ children, columns = 2 }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: 24,
        margin: "0 auto 28px",
        width: "100%",
        maxWidth: 1224,
      }}
    >
      {children}
    </div>
  );
}

export default function StaffPickExperienceAhangamaPage() {
  const canonical = absUrl(STAFF_PICK_EXPERIENCE_AHANGAMA_PATH);

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Staff Pick Experience: A Day That Slowly Erases Your Plan in Ahangama"
        description="A staff-picked Ahangama day that moves through coffee, surf, cooking, tuk tuks, sunset, live music and the slow pleasure of letting the plan dissolve."
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
          <div>
            <div
              className="ahg-hero"
              style={{
                width: "100vw",
                marginLeft: "calc(50% - 50vw)",
                marginRight: "calc(50% - 50vw)",
                borderRadius: 0,
                background: "#FFFFFF",
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
                  style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="home-hero-overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, rgba(10,14,18,0.82) 0%, rgba(10,14,18,0.74) 20%, rgba(10,14,18,0.5) 38%, rgba(10,14,18,0.2) 56%, rgba(10,14,18,0.04) 74%, rgba(10,14,18,0) 100%)",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  />
                  <img
                    className="home-hero-image"
                    src={HERO_IMAGE}
                    alt="Morning coffee cups in Ahangama"
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
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 12,
                        marginBottom: 18,
                      }}
                    >
                      {["Staff Pick Experience", "Ahangama Editorial"].map(
                        (item) => (
                          <Text
                            key={item}
                            style={{
                              color: "#FFFFFF",
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: 1.6,
                              textTransform: "uppercase",
                            }}
                          >
                            {item}
                          </Text>
                        ),
                      )}
                    </div>

                    <Title
                      className="home-hero-title"
                      style={{
                        margin: 0,
                        color: "#FFFFFF",
                        fontWeight: 500,
                        fontFamily:
                          '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                      }}
                    >
                      <span
                        className="home-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        A Day That
                      </span>
                      <span
                        className="home-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        Slowly Erases
                      </span>
                      <span
                        className="home-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        Your Plan
                      </span>
                    </Title>

                    <Text
                      style={{
                        display: "block",
                        marginTop: 14,
                        color: "#FFFFFF",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 1.6,
                        textTransform: "uppercase",
                      }}
                    >
                      Staff Pick Experience
                    </Text>

                    <Paragraph
                      style={{
                        marginTop: 24,
                        marginBottom: 22,
                        maxWidth: 560,
                        color: "#FFFFFF",
                        fontSize: "clamp(16px, 1.45vw, 19px)",
                        lineHeight: 1.72,
                      }}
                    >
                      Coffee, surf, cooking, tuk tuks, sunset and live music,
                      held together by the quiet pleasure of letting the day
                      decide for you.
                    </Paragraph>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dm-wrap" style={{ paddingTop: 28 }}>
          <div
            style={{
              maxWidth: 920,
              paddingBottom: 12,
            }}
          >
            {articleIntroduction.map((paragraph, index) => (
              <Paragraph
                key={paragraph}
                style={{
                  fontSize: index === 0 ? 22 : 18,
                  lineHeight: index === 0 ? 1.7 : 1.85,
                  color: index < 2 ? "#2f2a24" : "#55514B",
                  marginBottom: 18,
                }}
              >
                {renderVenueLinkedText(paragraph)}
              </Paragraph>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "8px 0 28px",
              width: "100%",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 1400,
                aspectRatio: "3 / 2",
                overflow: "hidden",
                boxShadow: "0 16px 40px rgba(18,24,22,0.12)",
              }}
            >
              <img
                src={FEATURE_IMAGE}
                alt="Beanbag seating at Marshmellow Cafe Ahangama"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center center",
                }}
              />
            </div>
          </div>

          <ImageGrid columns={2}>
            <PortraitImage
              src={BEACH_CAFE_IMAGE}
              alt="Two people with cafe drinks by the beach in Ahangama"
            />
            <PortraitImage
              src={CEYLON_SLIDERS_IMAGE}
              alt="Person holding a surfboard near Ceylon Sliders"
            />
          </ImageGrid>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {articleSections.map((section, index) => (
              <React.Fragment key={section.title}>
                <section
                  style={{
                    padding: index === 0 ? "20px 0 36px" : "36px 0",
                    borderTop:
                      index === 0 ? "none" : "1px solid rgba(47,62,58,0.12)",
                  }}
                >
                  <div style={{ maxWidth: 1180 }}>
                    <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
                      {section.title}
                    </Title>

                    {section.body.map((paragraph) => (
                      <Paragraph
                        key={paragraph}
                        style={{
                          maxWidth: 1200,
                          fontSize: 16,
                          lineHeight: 1.8,
                          color: "#55514B",
                          marginBottom: 18,
                        }}
                      >
                        {renderVenueLinkedText(paragraph)}
                      </Paragraph>
                    ))}

                    {section.quote ? (
                      <blockquote
                        style={{
                          margin: "4px 0 18px",
                          padding: "20px 24px",
                          borderLeft: "3px solid rgba(107,90,78,0.4)",
                          background: "rgba(255,255,255,0.72)",
                          color: "#2f2a24",
                          fontSize: 22,
                          lineHeight: 1.55,
                          fontFamily:
                            '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                        }}
                      >
                        {renderVenueLinkedText(section.quote)}
                      </blockquote>
                    ) : null}
                  </div>
                </section>

                {index === 1 ? (
                  <ImageGrid columns={3}>
                    <PortraitImage
                      src={SURFBOARDS_GROUP_IMAGE}
                      alt="People standing with surfboards on an Ahangama beach"
                    />
                    <PortraitImage
                      src={COOKING_CLASS_IMAGE}
                      alt="Traditional cooking class squeezing coconut"
                    />
                    <PortraitImage
                      src={KUMARA_TUKTUK_IMAGE}
                      alt="Kumara tuk tuk in Ahangama"
                    />
                  </ImageGrid>
                ) : null}

                {index === 4 ? (
                  <ImageGrid columns={2}>
                    <PortraitImage
                      src={CRUST_GUITAR_IMAGE}
                      alt="Live guitar music at The Crust Ahangama"
                    />
                    <PortraitImage
                      src={CRUST_DANCING_IMAGE}
                      alt="Woman dancing with a cocktail at The Crust Ahangama"
                    />
                  </ImageGrid>
                ) : null}

                {index === 6 ? (
                  <ImageGrid columns={1}>
                    <PortraitImage
                      src={HOTEL_DE_UNCLES_IMAGE}
                      alt="Couple dancing at Hotel de Uncles"
                    />
                  </ImageGrid>
                ) : null}
              </React.Fragment>
            ))}
          </div>

          <section
            style={{
              margin: "22px 0 34px",
              paddingTop: 16,
              borderTop: "1px solid rgba(47,62,58,0.08)",
            }}
          >
            <Text
              style={{
                display: "block",
                color: "#6B5A4E",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.4,
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Places Mentioned
            </Text>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "14px 22px",
              }}
            >
              {FEATURED_VENUES.map((venue) => (
                <div
                  key={venue.label}
                  style={{
                    paddingTop: 10,
                    borderTop: "1px solid rgba(47,62,58,0.08)",
                  }}
                >
                  <a
                    href={venue.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      color: "#6B5A4E",
                      fontSize: 13,
                      textDecoration: "none",
                      borderBottom: "1px solid rgba(107,90,78,0.24)",
                      paddingBottom: 1,
                    }}
                  >
                    {venue.label}
                    <ArrowRightOutlined style={{ fontSize: 11 }} />
                  </a>
                  <Text
                    style={{
                      display: "block",
                      marginTop: 7,
                      color: "#55514B",
                      fontSize: 13,
                      lineHeight: 1.55,
                    }}
                  >
                    {venue.note}
                  </Text>
                </div>
              ))}
            </div>
          </section>

          <EditorialNextArticle
            href={NEXT_ARTICLE.href}
            kicker={NEXT_ARTICLE.kicker}
            title={NEXT_ARTICLE.title}
            image={NEXT_ARTICLE.image}
          />
        </div>
      </div>
    </SiteLayout>
  );
}
