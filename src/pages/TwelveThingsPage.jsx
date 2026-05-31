import React from "react";
import { Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import { ArrowRightOutlined, CompassOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { buildPassCtaUrl } from "../lib/passAttribution";

const { Paragraph, Text, Title } = Typography;

const experiences = [
  {
    number: "01",
    title: "Ride the Coast on Two Wheels",
    body: [
      "The best way to understand Ahangama is on a scooter, wind-whipped and slightly lost, taking a wrong turn that leads to a better beach.",
      "GIK Rental Bikes make it easy and affordable, guests booking through us receive 25% off, and their fleet is well-maintained. Follow the shore south in the early morning before the heat builds, stop where the fishing boats are pulled up, and consider it your orientation.",
      "For a real adventure GIK also offers self-drive tuk-tuk adventures; three wheels, no air conditioning, maximum local credibility.",
    ],
    imageLabel: "Scooter coast ride image placeholder",
  },
  {
    number: "02",
    title: "Unknot Everything at White Lotus Spa & Wellness",
    body: [
      "Long-haul travel exacts a toll. The right response is not to push through it — it is to surrender, horizontal, to the capable hands at White Lotus Spa & Wellness, where holistic therapies, therapeutic massages and deeply personalised wellness rituals form the antidote to every hour spent in a middle seat.",
      "The treatments draw on traditional Sri Lankan healing alongside broader Eastern practices, and the effect is cumulative: you leave lighter than you arrived.",
      "Book through us for 15% off.",
    ],
    imageLabel: "Wellness ritual image placeholder",
  },
  {
    number: "03",
    title: "Claim Your Square of Beach (For free!)",
    body: [
      "Kabalana Beach requires no budget. Simply show up, lay something down and stare at the Indian Ocean until your nervous system resets.",
      "Not far along, explore the not-so-secret beach — known to locals, known to regulars, somehow still beautiful despite being neither undiscovered nor uncrowded — offers a sheltered cove and excellent reef for snorkelling.",
      "Bring your own fins, leave your phone on the towel, and remember that moments like this are precisely why you came.",
    ],
    imageLabel: "Beach cove image placeholder",
  },
  {
    number: "04",
    title: "Catch a Wave (Or Learn How)",
    body: [
      "The waves at Ahangama have a reputation among those who know: consistent, forgiving enough for intermediates, occasionally thrilling for those who've been at it a while.",
      "If you simply want to borrow a board and paddle out, The Board Hut has you covered, with exclusive deals for our guests. If you want to go all in, to spend a week living, breathing and dreaming of surfing, Global Surf Lodge offers the complete experience: stays, yoga, surf coaching, and packages calibrated for every level from tentative beginner to seasoned regular.",
      "Book through us for 10% off all packages. The kind of place you check out of already planning your return.",
    ],
    imageLabel: "Surf session image placeholder",
  },
  {
    number: "05",
    title: "Check Into Unu Boutique",
    body: [
      "There are hotels that are merely places to sleep, and then there is Unu Boutique.",
      "This small, design-led 11-room property on Sri Lanka's south coast is where everyday island life meets a mix of Scandinavian clarity and Japanese calm.",
      "It is small enough that you will know the staff by name within a day, and beautiful enough that you will resist leaving for the beach until mid-morning. For travellers who regard where they stay as part of the experience rather than a backdrop to it, Unu is the answer.",
    ],
    imageLabel: "Boutique hotel image placeholder",
  },
  {
    number: "06",
    title: "Cook Like a Local, Eat Like One Too",
    body: [
      "Some meals feed you. This one does something more.",
      "Kumbuk Kitchen & Art Space is a quiet village kitchen and creative space, a quiet rebellion against the changing landscape of Ahangama. Here the cooking class is led by Amma — a keeper of ancestral recipes, healing spices, and an unhurried kitchen wisdom that was never written down because it was never meant to be.",
      "Learn to cook with a connection to a place, to a tradition, to the people who built it. By the time you sit down to eat the pol sambol and slow-braised fish curry it will taste like more than lunch.",
    ],
    imageLabel: "Cooking class image placeholder",
  },
  {
    number: "07",
    title: "Discover the Local Art Scene",
    body: [
      "A short ride from the coast, Siriniwasa Freedom Gallery has recently opened its doors in Ahangama to artists, wanderers, and lovers of slow culture.",
      "Eclectic art, live music, poetry, and a commitment to the kind of experimental originality that thrives precisely because no one is trying to scale it.",
      "Check their Instagram for upcoming events and exhibitions. Go without a plan. Stay longer than you meant to.",
    ],
    imageLabel: "Gallery image placeholder",
  },
  {
    number: "08",
    title: "Melt It. Shape It. Wear It.",
    body: [
      "There is a quiet satisfaction in wearing something you made yourself, particularly when it involves flame.",
      "Olive Yu's silver ring workshop is one of the places where you can let your creative outlet fly. You melt the metal, carve the form, cast the piece, and walk away with a ring that fits your finger because you shaped it that way.",
      "The skill transfers. The ring stays with you. Bring a friend, or come alone and enjoy the rare pleasure of making rather than consuming.",
    ],
    imageLabel: "Jewellery workshop image placeholder",
  },
  {
    number: "09",
    title: "Shop (and Stay a While) at Living Room Concept Store",
    body: [
      "Living Room is one of those rare shops that functions equally well as a destination and a refuge.",
      "Tastefully curated, unhurried, stocked with the kind of objects and clothing that you will reach for long after you return home. Buy something beautiful — a piece of handmade ceramic, a linen thing, a candle that smells like somewhere warm.",
      "Then order a coffee and a cookie and stay at one of the tables. The wifi is good. The vibe is better. Guests booking through us receive 10% off.",
    ],
    imageLabel: "Concept store image placeholder",
  },
  {
    number: "10",
    title: "Spend a Night at Monos",
    body: [
      "There are bars, and then there is Monos.",
      "Open only on Friday, Saturday and Sunday — which somehow makes it more worth the wait — this intimate, music-first cocktail bar in Ahangama operates on a philosophy: that a night out should mean something.",
      "Cocktails are taken seriously. The South Indian food is great. Vinyl, CDs and cassettes are around to explore. Art exhibitions rotate on the walls. The sound system is the point. Come late, stay until the music stops.",
    ],
    imageLabel: "Cocktail bar image placeholder",
  },
  {
    number: "11",
    title: "Learn the Art of Batik at Sarana",
    body: [
      "There are souvenirs, and then there are the things you made yourself.",
      "Sarana Lanka is a platform dedicated to keeping Sri Lanka's living craft traditions in the hands of people who care, connecting curious travellers with the local artisans who have spent lifetimes perfecting them. Their batik workshop is one of the most rewarding afternoons you can spend on the south coast: an introduction to one of Sri Lanka's oldest and most meditative art forms, where wax, dye and patience combine into something genuinely beautiful.",
      "You will leave with a piece that took time and attention to make — which is precisely what makes it worth keeping. Book through us for 20% off.",
    ],
    imageLabel: "Batik workshop image placeholder",
  },
  {
    number: "12",
    title: "End Every Evening at the Lighthouse",
    body: [
      "Ahangama Lighthouse at rooftop sunset is not a secret, and it does not need to be.",
      "It is simply one of those reliable, unhurried pleasures that a place like this offers freely: the light going golden, the sea going copper, the kind of view that makes two weeks feel simultaneously like too long and not nearly enough.",
      "Our guests receive 10% off food and beverages, a reason to order that second sundowner and stay until the stars come out.",
    ],
    imageLabel: "Lighthouse sunset image placeholder",
  },
];

const PLACEHOLDER_VARIANTS = [
  {
    frame:
      "linear-gradient(135deg, rgba(222,205,182,0.95) 0%, rgba(245,236,222,0.95) 100%)",
    accent: "#7C5A43",
    shape: "circle",
    align: "flex-end",
  },
  {
    frame:
      "linear-gradient(135deg, rgba(203,220,214,0.92) 0%, rgba(244,248,244,0.96) 100%)",
    accent: "#43655B",
    shape: "panel",
    align: "center",
  },
  {
    frame:
      "linear-gradient(135deg, rgba(233,220,198,0.94) 0%, rgba(251,245,235,0.98) 100%)",
    accent: "#9A6B2F",
    shape: "stripe",
    align: "flex-start",
  },
  {
    frame:
      "linear-gradient(135deg, rgba(215,208,225,0.90) 0%, rgba(247,244,250,0.98) 100%)",
    accent: "#61517F",
    shape: "stack",
    align: "center",
  },
];

function getPlaceholderVariant(index) {
  return PLACEHOLDER_VARIANTS[index % PLACEHOLDER_VARIANTS.length];
}

function PlaceholderArtwork({ variant }) {
  if (variant.shape === "circle") {
    return (
      <div
        style={{
          width: "78%",
          aspectRatio: "4 / 5",
          borderRadius: 999,
          background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.72), transparent 30%), linear-gradient(180deg, ${variant.accent} 0%, rgba(255,255,255,0.18) 100%)`,
          border: "1px solid rgba(255,255,255,0.45)",
          boxShadow: "0 24px 40px rgba(47,62,58,0.14)",
        }}
      />
    );
  }

  if (variant.shape === "panel") {
    return (
      <div style={{ width: "86%", display: "grid", gap: 10 }}>
        <div
          style={{
            height: 150,
            borderRadius: 28,
            background: `linear-gradient(135deg, ${variant.accent} 0%, rgba(255,255,255,0.2) 100%)`,
            boxShadow: "0 24px 40px rgba(47,62,58,0.12)",
          }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.35fr",
            gap: 10,
          }}
        >
          <div
            style={{
              height: 110,
              borderRadius: 22,
              background: "rgba(255,255,255,0.58)",
              border: "1px solid rgba(47,62,58,0.08)",
            }}
          />
          <div
            style={{
              height: 110,
              borderRadius: 22,
              background: `linear-gradient(180deg, rgba(255,255,255,0.25) 0%, ${variant.accent} 100%)`,
            }}
          />
        </div>
      </div>
    );
  }

  if (variant.shape === "stripe") {
    return (
      <div style={{ width: "88%", display: "grid", gap: 10 }}>
        <div
          style={{
            height: 210,
            borderRadius: 26,
            background: `linear-gradient(90deg, ${variant.accent} 0%, ${variant.accent} 22%, rgba(255,255,255,0.28) 22%, rgba(255,255,255,0.28) 42%, rgba(255,255,255,0.72) 42%, rgba(255,255,255,0.72) 100%)`,
            boxShadow: "0 24px 40px rgba(47,62,58,0.10)",
          }}
        />
        <div
          style={{
            width: "52%",
            height: 58,
            borderRadius: 999,
            background: `linear-gradient(90deg, rgba(255,255,255,0.85), ${variant.accent})`,
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ width: "84%", position: "relative", height: 240 }}>
      <div
        style={{
          position: "absolute",
          inset: "0 0 54px 42px",
          borderRadius: 26,
          background: `linear-gradient(135deg, ${variant.accent} 0%, rgba(255,255,255,0.2) 100%)`,
          boxShadow: "0 24px 40px rgba(47,62,58,0.10)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "58px 42px 0 0",
          borderRadius: 26,
          background: "rgba(255,255,255,0.74)",
          border: "1px solid rgba(47,62,58,0.08)",
        }}
      />
    </div>
  );
}

function PlaceholderImage({ label, tall = false, variant, compact = false }) {
  return (
    <div
      style={{
        minHeight: compact ? 220 : tall ? 360 : 280,
        borderRadius: 24,
        border: "1px dashed rgba(47,62,58,0.24)",
        background: variant.frame,
        display: "flex",
        alignItems: variant.align,
        justifyContent: "center",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 18,
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.28)",
          pointerEvents: "none",
        }}
      />
      <PlaceholderArtwork variant={variant} />
      <div
        style={{
          position: "absolute",
          left: 18,
          right: 18,
          bottom: 18,
          padding: "10px 12px",
          borderRadius: 16,
          background: "rgba(255,251,245,0.84)",
          border: "1px solid rgba(47,62,58,0.08)",
          textAlign: "left",
        }}
      >
        <Text
          style={{
            display: "block",
            color: variant.accent,
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1.4,
            marginBottom: 6,
          }}
        >
          Image Placeholder
        </Text>
        <Text style={{ color: "#5F5A53", fontSize: 14 }}>{label}</Text>
      </div>
    </div>
  );
}

export default function TwelveThingsPage() {
  const canonical = absUrl("/12-things");
  const passCtaUrl = buildPassCtaUrl();
  const heroVariant = PLACEHOLDER_VARIANTS[2];

  return (
    <SiteLayout>
      <Seo
        title="12 Things to Do in Ahangama in Two Weeks (or Less)"
        description="A long-form editorial guide to Ahangama: surf, design-led stays, workshops, vinyl bars, craft, wellness, and the places that make two weeks feel like too little time."
        canonical={canonical}
      />

      <div className="dm-heroCut" />
      <div className="dm-canvas">
        <div className="dm-wrap">
          <div style={{ marginBottom: 32 }}>
            <Card
              style={{
                borderRadius: 28,
                border: "1px solid rgba(47,62,58,0.08)",
                background:
                  "linear-gradient(135deg, rgba(245,236,225,0.92) 0%, rgba(255,251,245,0.98) 100%)",
                overflow: "hidden",
              }}
              bodyStyle={{ padding: 28 }}
            >
              <Row gutter={[24, 24]} align="middle">
                <Col xs={24} xl={14}>
                  <Space wrap size={[8, 8]} style={{ marginBottom: 12 }}>
                    <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>
                      Editorial Guide
                    </Tag>
                    <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>
                      Two Weeks or Less
                    </Tag>
                  </Space>

                  <Title
                    level={1}
                    style={{
                      marginTop: 0,
                      marginBottom: 12,
                      fontSize: 42,
                      lineHeight: 1.02,
                    }}
                  >
                    12 Things to Do in Ahangama in Two Weeks (or Less)
                  </Title>

                  <Paragraph
                    style={{
                      fontSize: 18,
                      lineHeight: 1.8,
                      color: "#5C5953",
                      marginBottom: 18,
                    }}
                  >
                    A surf town with secrets. Find out a few things about
                    Ahangama from its design-led guesthouses and hands-on
                    workshops to music bars spinning vinyl on a Sunday night.
                    The sea is warm. The food is better. And if you know where
                    to look, two weeks will not feel like enough.
                  </Paragraph>

                  <Space wrap size={12}>
                    <Button
                      type="primary"
                      size="large"
                      href={passCtaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<ArrowRightOutlined />}
                      style={{
                        borderRadius: 999,
                        background: "#2F3E3A",
                        borderColor: "#2F3E3A",
                      }}
                    >
                      Get The Ahangama Pass
                    </Button>
                    <Button
                      size="large"
                      href="#guide-note"
                      style={{ borderRadius: 999 }}
                    >
                      Read the guide note
                    </Button>
                  </Space>
                </Col>

                <Col xs={24} xl={10}>
                  <PlaceholderImage
                    label="Hero image placeholder"
                    tall
                    variant={heroVariant}
                  />
                </Col>
              </Row>
            </Card>
          </div>

          <div style={{ marginBottom: 28 }}>
            <Card
              style={{
                borderRadius: 22,
                border: "1px solid rgba(47,62,58,0.08)",
              }}
              bodyStyle={{ padding: 22 }}
            >
              <Space align="start" size={12}>
                <CompassOutlined
                  style={{ fontSize: 20, color: "#8B5A3C", marginTop: 4 }}
                />
                <div>
                  <Text
                    style={{
                      display: "block",
                      color: "#2F3E3A",
                      fontWeight: 700,
                      marginBottom: 6,
                    }}
                  >
                    A compact orientation
                  </Text>
                  <Paragraph style={{ margin: 0, color: "#5C5953" }}>
                    This page is written as a proper editorial itinerary rather
                    than a directory. Every section leaves room for imagery, and
                    every recommendation is meant to feel like a friend passing
                    you the best version of their Ahangama list.
                  </Paragraph>
                </div>
              </Space>
            </Card>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {experiences.map((item, index) => {
              const reverse = index % 2 === 1;
              const variant = getPlaceholderVariant(index);
              const compact = index >= 6;

              return (
                <Card
                  key={item.number}
                  style={{
                    borderRadius: 26,
                    border: "1px solid rgba(47,62,58,0.08)",
                    background:
                      "linear-gradient(180deg, #fffdf9 0%, #faf4eb 100%)",
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <Row
                    gutter={[24, 24]}
                    align="middle"
                    style={{ flexDirection: reverse ? "row-reverse" : "row" }}
                  >
                    <Col xs={24} lg={10}>
                      <PlaceholderImage
                        label={item.imageLabel}
                        tall={index < 2}
                        compact={compact}
                        variant={variant}
                      />
                    </Col>
                    <Col xs={24} lg={14}>
                      <Text
                        style={{
                          display: "block",
                          color: "#8B5A3C",
                          fontSize: 13,
                          fontWeight: 700,
                          letterSpacing: 1.6,
                          textTransform: "uppercase",
                          marginBottom: 10,
                        }}
                      >
                        {item.number}
                      </Text>
                      <Title
                        level={2}
                        style={{ marginTop: 0, marginBottom: 14 }}
                      >
                        {item.title}
                      </Title>
                      {item.body.map((paragraph) => (
                        <Paragraph
                          key={paragraph}
                          style={{
                            fontSize: 16,
                            lineHeight: 1.8,
                            color: "#55514B",
                          }}
                        >
                          {paragraph}
                        </Paragraph>
                      ))}
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </div>

          <div id="guide-note" style={{ marginTop: 32, marginBottom: 36 }}>
            <Card
              style={{
                borderRadius: 28,
                border: "1px solid rgba(47,62,58,0.08)",
                background:
                  "linear-gradient(135deg, rgba(47,62,58,0.98) 0%, rgba(78,55,42,0.98) 100%)",
              }}
              bodyStyle={{ padding: 28 }}
            >
              <Row gutter={[24, 24]} align="middle">
                <Col xs={24} lg={16}>
                  <Text
                    style={{
                      display: "block",
                      color: "rgba(255,247,240,0.72)",
                      textTransform: "uppercase",
                      letterSpacing: 1.5,
                      fontSize: 12,
                      marginBottom: 10,
                    }}
                  >
                    A Note From Your Guide
                  </Text>
                  <Title level={2} style={{ color: "#FFF8F0", marginTop: 0 }}>
                    Written by Urvashi
                  </Title>
                  <Paragraph
                    style={{
                      color: "rgba(255,248,240,0.86)",
                      fontSize: 16,
                      lineHeight: 1.8,
                    }}
                  >
                    Sri Lankan local, proud South Coast migrant, and part of the
                    Ahangama Team.
                  </Paragraph>
                  <Paragraph
                    style={{
                      color: "rgba(255,248,240,0.86)",
                      fontSize: 16,
                      lineHeight: 1.8,
                    }}
                  >
                    We only recommend places we'd genuinely tell a friend about.
                    That's it.
                  </Paragraph>
                  <Paragraph
                    style={{
                      color: "rgba(255,248,240,0.86)",
                      fontSize: 16,
                      lineHeight: 1.8,
                      marginBottom: 0,
                    }}
                  >
                    To unlock every perk, discount and freebie in this guide,
                    grab The Ahangama Pass; from $30, it pays for itself fast.
                    It also gets you onto the Ahangama Collectibles Trail:
                    exclusive tea tins, postcards and collectible sticker cards
                    from select partner spots along the way. Free for a limited
                    time.
                  </Paragraph>
                </Col>

                <Col xs={24} lg={8}>
                  <Card
                    style={{
                      borderRadius: 22,
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                    bodyStyle={{ padding: 20 }}
                  >
                    <Text
                      style={{
                        display: "block",
                        color: "#FFF8F0",
                        fontWeight: 700,
                        marginBottom: 12,
                      }}
                    >
                      The Ahangama Pass
                    </Text>
                    <Paragraph
                      style={{
                        color: "rgba(255,248,240,0.78)",
                        marginBottom: 18,
                      }}
                    >
                      Unlock discounts, freebies, and collectibles across the
                      experiences in this guide.
                    </Paragraph>
                    <Button
                      type="primary"
                      block
                      size="large"
                      href={passCtaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<ArrowRightOutlined />}
                      style={{
                        borderRadius: 999,
                        background: "#FFF8F0",
                        color: "#2F3E3A",
                        borderColor: "#FFF8F0",
                      }}
                    >
                      Get The Pass
                    </Button>
                  </Card>
                </Col>
              </Row>
            </Card>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
