import React from "react";
import { Grid, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Paragraph, Text, Title } = Typography;
const { useBreakpoint } = Grid;

export const WELLNESS_GUIDE_PATH =
  "/blogs/the-ultimate-wellness-guide-to-ahangama-yoga-gyms-pilates-ice-baths-spas";

const wellnessGlance = [
  { label: "Yoga Studios", value: "8+" },
  { label: "Pilates & Mobility", value: "5+" },
  { label: "Ice Baths & Recovery", value: "5+" },
  { label: "Gyms & Fitness", value: "6+" },
  { label: "Spas & Treatments", value: "10+" },
];

const featuredPlaces = [
  {
    name: "Senses",
    note: "A strong pick for slower mornings, yoga sessions and a softer retreat rhythm.",
  },
  {
    name: "Shramalaya",
    note: "One of the clearest choices for mindfulness, meditation and a more grounded wellness tone.",
  },
  {
    name: "Frosty's",
    note: "The recovery-led option people mention most for ice baths, reset sessions and post-surf recovery.",
  },
];

export default function WellnessGuideSection() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  return (
    <section
      style={{
        borderRadius: 30,
        border: "1px solid rgba(47,62,58,0.08)",
        background: "linear-gradient(180deg, #fffdf9 0%, #edf3ee 100%)",
        boxShadow: "0 18px 40px rgba(47,62,58,0.05)",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: isMobile ? 22 : 32 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "minmax(0, 1fr)"
              : "minmax(320px, 0.9fr) minmax(0, 1.1fr)",
            gap: isMobile ? 26 : 34,
            alignItems: "start",
          }}
        >
          <div>
            <Text
              style={{
                display: "block",
                marginBottom: 12,
                color: "#7A8D7C",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.8,
                textTransform: "uppercase",
              }}
            >
              Wellness / Guide Preview
            </Text>

            <Title
              level={2}
              style={{
                margin: 0,
                color: "#2F3E3A",
                fontSize: isMobile ? 32 : 44,
                lineHeight: isMobile ? 1.06 : 1.02,
                fontFamily:
                  '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                letterSpacing: "-0.025em",
                maxWidth: 520,
              }}
            >
              The Ultimate Wellness Guide to Ahangama
            </Title>

            <Paragraph
              style={{
                margin: "14px 0 0",
                color: "#556057",
                fontSize: isMobile ? 14 : 16,
                lineHeight: 1.72,
                maxWidth: 470,
              }}
            >
              A practical guide to yoga, Pilates, fitness, recovery and wellness
              across Ahangama.
            </Paragraph>
            <Paragraph
              style={{
                margin: "12px 0 0",
                color: "#556057",
                fontSize: 14,
                lineHeight: 1.7,
                maxWidth: 500,
              }}
            >
              The shape of wellness here is flexible rather than programmatic.
              People build it around surf, remote work, long breakfasts and the
              pace of the coast instead of following a strict retreat schedule.
            </Paragraph>

            <div
              style={{
                marginTop: 24,
                paddingTop: 18,
                borderTop: "1px solid rgba(47,62,58,0.1)",
              }}
            >
              <Text
                style={{
                  display: "block",
                  marginBottom: 10,
                  color: "#7A8D7C",
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
                  fontSize: isMobile ? 24 : 34,
                  lineHeight: isMobile ? 1.14 : 1.08,
                  fontFamily:
                    '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                  letterSpacing: "-0.02em",
                  maxWidth: 560,
                }}
              >
                "Most visitors combine Pilates, surf and recovery experiences
                rather than committing to a full retreat."
              </Paragraph>
              <Paragraph
                style={{
                  margin: "12px 0 0",
                  color: "#556057",
                  fontSize: 14,
                  lineHeight: 1.7,
                  maxWidth: 500,
                }}
              >
                That makes Ahangama feel different from destination wellness
                resorts. It is less about disappearing into a program and more
                about weaving movement, treatments and recovery into everyday
                coastal life.
              </Paragraph>
            </div>

            <div
              style={{
                marginTop: 26,
                paddingTop: 18,
                borderTop: "1px solid rgba(47,62,58,0.1)",
                display: "grid",
                gap: 12,
                justifyItems: "start",
              }}
            >
              <a
                href={WELLNESS_GUIDE_PATH}
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
                Explore All Wellness Experiences <ArrowRightOutlined />
              </a>
            </div>
          </div>

          <div>
            <div
              style={{
                padding: isMobile ? 20 : 24,
                borderRadius: 26,
                background: "rgba(255,251,245,0.76)",
                border: "1px solid rgba(47,62,58,0.08)",
                boxShadow: "0 14px 28px rgba(47,62,58,0.05)",
              }}
            >
              <Text
                style={{
                  display: "block",
                  color: "#7A8D7C",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.8,
                  textTransform: "uppercase",
                }}
              >
                Wellness At A Glance
              </Text>

              <div
                style={{
                  marginTop: 14,
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "minmax(0, 1fr)"
                    : "repeat(2, minmax(0, 1fr))",
                  gap: "10px 18px",
                }}
              >
                {wellnessGlance.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: 12,
                      paddingBottom: 8,
                      borderBottom: "1px solid rgba(47,62,58,0.08)",
                    }}
                  >
                    <Text
                      style={{
                        color: "#556057",
                        fontSize: 13,
                        letterSpacing: "0.01em",
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={{
                        color: "#2F3E3A",
                        fontSize: 18,
                        fontWeight: 600,
                        fontFamily:
                          '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                      }}
                    >
                      {item.value}
                    </Text>
                  </div>
                ))}
              </div>

              <Paragraph
                style={{
                  margin: "18px 0 0",
                  color: "#556057",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                Ahangama&apos;s wellness scene is strongest when you read it as
                a mix of categories rather than a checklist of treatments. The
                best stays usually combine one anchor place with a few lighter
                supporting rituals.
              </Paragraph>

              <Text
                style={{
                  display: "block",
                  marginTop: 22,
                  marginBottom: 10,
                  color: "#7A8D7C",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.8,
                  textTransform: "uppercase",
                }}
              >
                Most Popular
              </Text>
              <div style={{ display: "grid", gap: 0 }}>
                {featuredPlaces.map((item, index) => (
                  <div
                    key={item.name}
                    style={{
                      padding: index === 0 ? "0 0 16px" : "16px 0",
                      borderTop:
                        index === 0
                          ? "1px solid rgba(47,62,58,0.1)"
                          : "1px solid rgba(47,62,58,0.1)",
                    }}
                  >
                    <Text
                      style={{
                        display: "block",
                        color: "#2F3E3A",
                        fontSize: 16,
                        fontWeight: 600,
                        marginBottom: 4,
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        color: "#556057",
                        fontSize: 14,
                        lineHeight: 1.65,
                      }}
                    >
                      {item.note}
                    </Text>
                    {item.name === "Frosty's" ? (
                      <Text
                        style={{
                          display: "block",
                          marginTop: 10,
                          color: "#2F3E3A",
                          fontSize: 13,
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                        }}
                      >
                        + 8 More Wellness
                      </Text>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
