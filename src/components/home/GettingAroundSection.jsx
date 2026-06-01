import React from "react";
import { Grid, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Paragraph, Text, Title } = Typography;
const { useBreakpoint } = Grid;

const GUIDE_PATH =
  "/getting-around-ahangama-scooters-tuk-tuks-airport-transfers";

const transportBlocks = [
  {
    title: "Airport Transfers",
    time: "2.5-3 Hours",
    cost: "LKR 15,000-20,000",
    bestFor: ["First arrivals", "Families", "Luggage"],
    providers: ["Happy Tours", "Nova Rent a Car"],
    note: "Usually the easiest option after a long flight. Most visitors arrange this before arriving in Sri Lanka.",
  },
  {
    title: "Scooter Rental",
    cost: "LKR 2,500-4,500/day",
    bestFor: ["Beach hopping", "Surf checks", "Cafes"],
    providers: ["GIK Bike Rentals", "Scooty Rent Service"],
    note: "The most popular way to explore Ahangama and the easiest way to move between beaches through the day.",
  },
  {
    title: "Tuk Tuks",
    cost: "LKR 500-1,500/ride",
    bestFor: ["Short stays", "Evenings", "Local trips"],
    providers: ["Happy Tours"],
    note: "Ideal for visitors staying only one or two days, or for evenings when you do not want to drive back.",
  },
  {
    title: "Car Rental",
    cost: "LKR 12,000-20,000/day",
    bestFor: ["Families", "Galle trips", "Longer journeys"],
    providers: ["Nova Rent a Car"],
    note: "Worth considering if travelling with children or planning longer day trips beyond Ahangama.",
  },
];

export default function GettingAroundSection() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <section
      style={{
        borderRadius: 28,
        border: "1px solid rgba(47,62,58,0.06)",
        background:
          "linear-gradient(180deg, rgba(255,253,249,0.97) 0%, rgba(246,239,229,0.92) 100%)",
        boxShadow: "0 18px 36px rgba(47,62,58,0.04)",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: isMobile ? 22 : 34 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "minmax(0, 1fr)"
              : "minmax(0, 1.4fr) minmax(220px, 0.6fr)",
            gap: isMobile ? 20 : 36,
            alignItems: "end",
            paddingBottom: isMobile ? 20 : 24,
            borderBottom: "1px solid rgba(47,62,58,0.1)",
          }}
        >
          <div>
            <Text
              style={{
                display: "block",
                marginBottom: 12,
                color: "#8B5A3C",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.8,
                textTransform: "uppercase",
              }}
            >
              Getting Around / Guidebook Notes
            </Text>
            <Title
              level={2}
              style={{
                margin: 0,
                color: "#2F3E3A",
                fontSize: isMobile ? 34 : 46,
                lineHeight: isMobile ? 1.08 : 1.02,
                fontFamily:
                  '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                letterSpacing: "-0.02em",
                maxWidth: 760,
              }}
            >
              Getting Around Ahangama: Scooters, Tuk Tuks & Airport Transfers
            </Title>
            <Paragraph
              style={{
                margin: "14px 0 0",
                color: "#5B564E",
                fontSize: isMobile ? 14 : 16,
                lineHeight: 1.78,
                maxWidth: 700,
              }}
            >
              A practical editorial guide to how transport actually works here,
              including when to rent a scooter, when tuk tuks are enough, what
              airport transfers usually cost, and which local providers we
              would actually recommend.
            </Paragraph>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: isMobile ? "flex-start" : "flex-end",
              alignItems: "flex-end",
            }}
          >
            <a
              href={GUIDE_PATH}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "#2F3E3A",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.01em",
                textTransform: "uppercase",
              }}
            >
              View full guide <ArrowRightOutlined />
            </a>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "minmax(0, 1fr)"
              : "minmax(0, 1.34fr) minmax(260px, 0.66fr)",
            gap: isMobile ? 28 : 44,
            paddingTop: isMobile ? 24 : 30,
          }}
        >
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "minmax(0, 1fr)"
                  : "repeat(2, minmax(0, 1fr))",
                columnGap: isMobile ? 0 : 28,
                rowGap: isMobile ? 24 : 28,
              }}
            >
              {transportBlocks.map((item) => (
                <article
                  key={item.title}
                  style={{
                    paddingBottom: isMobile ? 22 : 26,
                    borderBottom: "1px solid rgba(47,62,58,0.1)",
                  }}
                >
                  <Text
                    style={{
                      display: "block",
                      marginBottom: 14,
                      color: "#8B5A3C",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1.8,
                      textTransform: "uppercase",
                    }}
                  >
                    {item.title}
                  </Text>

                  {item.time ? (
                    <div style={{ marginBottom: 18 }}>
                      <Text
                        style={{
                          display: "block",
                          marginBottom: 4,
                          color: "#7A746B",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: 1.5,
                          textTransform: "uppercase",
                        }}
                      >
                        Travel Time
                      </Text>
                      <Text
                        style={{
                          display: "block",
                          color: "#2F3E3A",
                          fontSize: isMobile ? 28 : 34,
                          lineHeight: 1,
                          fontWeight: 600,
                          fontFamily:
                            '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {item.time}
                      </Text>
                    </div>
                  ) : null}

                  <div style={{ marginBottom: 18 }}>
                    <Text
                      style={{
                        display: "block",
                        marginBottom: 4,
                        color: "#7A746B",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                      }}
                    >
                      Typical Cost
                    </Text>
                    <Text
                      style={{
                        display: "block",
                        color: "#2F3E3A",
                        fontSize: isMobile ? 30 : 38,
                        lineHeight: 0.96,
                        fontWeight: 600,
                        fontFamily:
                          '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                        letterSpacing: "-0.025em",
                      }}
                    >
                      {item.cost}
                    </Text>
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <Text
                      style={{
                        display: "block",
                        marginBottom: 8,
                        color: "#7A746B",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                      }}
                    >
                      Best For
                    </Text>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {item.bestFor.map((point) => (
                        <Text
                          key={point}
                          style={{ color: "#2F3E3A", fontSize: 14, lineHeight: 1.5 }}
                        >
                          ✓ {point}
                        </Text>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <Text
                      style={{
                        display: "block",
                        marginBottom: 8,
                        color: "#7A746B",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                      }}
                    >
                      Recommended Providers
                    </Text>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {item.providers.map((provider) => (
                        <Text
                          key={provider}
                          style={{ color: "#5B564E", fontSize: 14, lineHeight: 1.5 }}
                        >
                          {provider}
                        </Text>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Text
                      style={{
                        display: "block",
                        marginBottom: 8,
                        color: "#7A746B",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                      }}
                    >
                      Editorial Note
                    </Text>
                    <Paragraph
                      style={{
                        margin: 0,
                        color: "#4E4942",
                        fontSize: 14,
                        lineHeight: 1.75,
                        maxWidth: 340,
                      }}
                    >
                      {item.note}
                    </Paragraph>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <div
              style={{
                paddingTop: 2,
                borderTop: "1px solid rgba(47,62,58,0.1)",
              }}
            >
              <Text
                style={{
                  display: "block",
                  marginTop: 16,
                  marginBottom: 12,
                  color: "#8B5A3C",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.8,
                  textTransform: "uppercase",
                }}
              >
                Good To Know
              </Text>
              <Paragraph
                style={{
                  margin: 0,
                  color: "#4E4942",
                  fontSize: 15,
                  lineHeight: 1.8,
                  fontFamily:
                    '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                }}
              >
                Most beaches, cafes and surf breaks in Ahangama are within a
                5-10 minute scooter ride of each other, and most scooter rental
                companies will deliver directly to your accommodation.
              </Paragraph>
            </div>

            <div
              style={{
                paddingTop: 18,
                borderTop: "1px solid rgba(47,62,58,0.1)",
              }}
            >
              <Text
                style={{
                  display: "block",
                  marginBottom: 12,
                  color: "#8B5A3C",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.8,
                  textTransform: "uppercase",
                }}
              >
                Local Insight
              </Text>
              <Paragraph
                style={{
                  margin: 0,
                  color: "#2F3E3A",
                  fontSize: isMobile ? 22 : 28,
                  lineHeight: 1.18,
                  fontFamily:
                    '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                  letterSpacing: "-0.015em",
                }}
              >
                "Most visitors staying longer than three days rent scooters.
                Short-stay visitors usually rely on tuk tuks."
              </Paragraph>
            </div>

            <div
              style={{
                paddingTop: 18,
                borderTop: "1px solid rgba(47,62,58,0.1)",
              }}
            >
              <Text
                style={{
                  display: "block",
                  marginBottom: 12,
                  color: "#8B5A3C",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.8,
                  textTransform: "uppercase",
                }}
              >
                Need Help Getting Around?
              </Text>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {["Transfers", "Scooters", "Tuk Tuks", "Day Trips"].map(
                  (item) => (
                    <Text
                      key={item}
                      style={{ color: "#2F3E3A", fontSize: 14, lineHeight: 1.5 }}
                    >
                      ✓ {item}
                    </Text>
                  ),
                )}
              </div>
              <a
                href="https://wa.me/94777908790?text=Hi%2C%20need%20help%20getting%20around%20Ahangama."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 14,
                  color: "#2F3E3A",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                WhatsApp Us <ArrowRightOutlined />
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
