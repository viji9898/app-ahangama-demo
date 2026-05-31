import React, { useRef } from "react";
import { Button, Card, Grid, Space, Tag, Typography } from "antd";
import {
  ArrowRightOutlined,
  HeartOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

const { Paragraph, Text, Title } = Typography;
const { useBreakpoint } = Grid;

export const WELLNESS_GUIDE_PATH =
  "/the-ultimate-wellness-guide-to-ahangama-yoga-gyms-pilates-ice-baths-spas";

const cards = [
  {
    key: "pura",
    title: "Pura Pilates",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/pura_pilates.jpeg",
    copy: "The clearest Pilates-led stop in Ahangama for mobility, structure, and keeping your routine intact between surf sessions.",
    label: "Pilates & mobility",
  },
  {
    key: "senses",
    title: "Senses",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/senses.jpg",
    copy: "A yoga and mindfulness pick for travelers who want calmer mornings, guided movement, and a more retreat-like pace.",
    label: "Yoga & mindfulness",
  },
  {
    key: "frostys",
    title: "Frosty's",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/frostys.jpeg",
    copy: "A recovery-first anchor for ice baths, post-surf reset sessions, and the social side of wellness in Kabalana.",
    label: "Ice baths & recovery",
  },
  {
    key: "krish",
    title: "Krish Combat & Fitness",
    image:
      "https://ahangama-pass.s3.eu-west-2.amazonaws.com/venues/krish-combat-fitness/image.jpg",
    copy: "A stronger fit for gym access, training blocks, martial arts, and visitors who want wellness to include hard sessions too.",
    label: "Gym & training",
  },
  {
    key: "aksaaya",
    title: "Aksaaya Ayurveda Wellness Spa",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+34aksaaya_ayurveda.webp",
    copy: "Traditional Ayurveda and massage in a calmer, treatment-led format when restoration matters more than intensity.",
    label: "Spa & Ayurveda",
  },
];

export default function WellnessGuideSection() {
  const railRef = useRef(null);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  function scrollRail(direction) {
    if (!railRef.current) return;

    railRef.current.scrollBy({
      left: direction * 320,
      behavior: "smooth",
    });
  }

  return (
    <div
      style={{
        borderRadius: 28,
        border: "1px solid rgba(47,62,58,0.08)",
        background: "linear-gradient(180deg, #fffdf9 0%, #eef4ef 100%)",
        boxShadow: "0 18px 40px rgba(47,62,58,0.05)",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: isMobile ? 20 : 26 }}>
        <Space wrap size={[10, 10]} style={{ marginBottom: 10 }}>
          <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>
            New Guide
          </Tag>
          <Text style={{ color: "#6E756E", fontSize: 13 }}>
            Editorial wellness shortlist
          </Text>
        </Space>

        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            justifyContent: "space-between",
            gap: isMobile ? 18 : 24,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <Title
              level={2}
              style={{
                margin: 0,
                color: "#2F3E3A",
                fontSize: isMobile ? 34 : undefined,
                lineHeight: isMobile ? 1.08 : undefined,
              }}
            >
              The Ultimate Wellness Guide to Ahangama: Yoga, Gyms, Pilates, Ice
              Baths & Spas
            </Title>
            <Paragraph
              style={{
                margin: "10px 0 0",
                color: "#556057",
                fontSize: isMobile ? 14 : 15,
                lineHeight: isMobile ? 1.6 : undefined,
                maxWidth: 780,
              }}
            >
              A practical editorial guide to the places that shape Ahangama's
              wellness rhythm, from yoga shalas and Pilates studios to serious
              recovery stops, training spaces, and slower spa afternoons.
            </Paragraph>
            <div
              style={{
                marginTop: 14,
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Button
                size="large"
                href="https://wa.me/94777908790?text=Hi%2C%20need%20help%20booking%20experiences."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  borderRadius: 999,
                  height: 42,
                  paddingInline: 18,
                  width: isMobile ? "100%" : "auto",
                  background: "rgba(255,255,255,0.72)",
                  borderColor: "rgba(47,62,58,0.14)",
                  color: "#556057",
                  boxShadow: "none",
                  fontWeight: 500,
                  fontSize: 14,
                }}
              >
                Need Help Booking Experiences?
              </Button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 10,
                width: isMobile ? "100%" : "auto",
                alignItems: isMobile ? "stretch" : "center",
              }}
            >
              {!isMobile ? (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "flex-start",
                  }}
                >
                  <Button
                    aria-label="Scroll wellness cards left"
                    icon={<LeftOutlined />}
                    onClick={() => scrollRail(-1)}
                    style={{ borderRadius: 999, width: 44, height: 44 }}
                  />
                  <Button
                    aria-label="Scroll wellness cards right"
                    icon={<RightOutlined />}
                    onClick={() => scrollRail(1)}
                    style={{ borderRadius: 999, width: 44, height: 44 }}
                  />
                </div>
              ) : null}
              <Button
                type="primary"
                size="large"
                href={WELLNESS_GUIDE_PATH}
                icon={<ArrowRightOutlined />}
                style={{
                  borderRadius: 999,
                  height: 44,
                  paddingInline: 18,
                  width: isMobile ? "100%" : "auto",
                  background: "#2F3E3A",
                  borderColor: "#2F3E3A",
                  boxShadow: "none",
                }}
              >
                View full guide
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: isMobile ? "0 20px 20px" : "0 26px 26px" }}>
        <div
          ref={railRef}
          style={{
            display: "flex",
            gap: isMobile ? 14 : 18,
            overflowX: "auto",
            paddingBottom: 8,
            scrollSnapType: "x proximity",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "thin",
          }}
        >
          {cards.map((card) => (
            <div
              key={card.key}
              style={{
                flex: isMobile
                  ? "0 0 82vw"
                  : "0 0 clamp(220px, calc((100% - 54px) / 3.5), 320px)",
                maxWidth: isMobile ? 320 : undefined,
                scrollSnapAlign: "start",
              }}
            >
              <Card
                hoverable
                bodyStyle={{ padding: 0 }}
                style={{
                  height: "100%",
                  borderRadius: 22,
                  overflow: "hidden",
                  border: "1px solid rgba(47,62,58,0.08)",
                  background: "#fffaf3",
                  boxShadow: "0 14px 28px rgba(47,62,58,0.08)",
                }}
              >
                <a
                  href={WELLNESS_GUIDE_PATH}
                  style={{
                    display: "block",
                    color: "inherit",
                    textDecoration: "none",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      height: isMobile ? 190 : 220,
                      backgroundImage: `linear-gradient(180deg, rgba(18,25,24,0.04) 0%, rgba(18,25,24,0.42) 100%), url(${card.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div style={{ padding: isMobile ? 16 : 18 }}>
                    <Space align="center" size={8} style={{ marginBottom: 10 }}>
                      <HeartOutlined style={{ color: "#6F8A74" }} />
                      <Text
                        style={{
                          color: "#6F8A74",
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 1.3,
                        }}
                      >
                        {card.label}
                      </Text>
                    </Space>
                    <Title
                      level={3}
                      style={{
                        marginTop: 0,
                        marginBottom: 10,
                        color: "#2F3E3A",
                        fontSize: isMobile ? 20 : 22,
                      }}
                    >
                      {card.title}
                    </Title>
                    <Paragraph
                      style={{
                        color: "#59534B",
                        minHeight: isMobile ? 0 : 96,
                        marginBottom: 0,
                      }}
                    >
                      {card.copy}
                    </Paragraph>
                  </div>
                </a>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
