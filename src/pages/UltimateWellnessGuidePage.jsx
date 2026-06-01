import React from "react";
import { HeartOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Row, Space, Tag, Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { buildPassCtaUrl } from "../lib/passAttribution";
import ahangamaPassLogo from "../assets/ahangama-pass-logo.png";
import { WELLNESS_GUIDE_PATH } from "../components/home/WellnessGuideSection";

const { Paragraph, Text, Title } = Typography;

const wellnessSections = [
  {
    number: "01",
    title: "Yoga in Ahangama is less about trend and more about rhythm",
    body: [
      "The best yoga choices in Ahangama are the ones that match the pace of your stay. If you want slower mornings and a retreat-like tone, Senses, Shramalaya, and The Nuga House are the clearest fits in the current live venue set.",
      "These are the places that make sense when the brief is simple: move well, breathe properly, and let the day start softer than a surf alarm. They are less about high-volume class hopping and more about building a daily ritual that feels sustainable for a week or two on the coast.",
    ],
    asideTitle: "Best yoga-led picks",
    aside: [
      "Senses for mindful classes and wellness treatments.",
      "Shramalaya for yoga, meditation, and a retreat tone.",
      "The Nuga House for slower routines and gentle movement.",
    ],
  },
  {
    number: "02",
    title: "Pilates and mobility are the cleanest answer for surf-heavy stays",
    body: [
      "If the goal is to balance surfing with better posture, mobility, and some structure, Pura Pilates is the standout name. It feels like the right recommendation for visitors who want wellness to be part of performance, not just a recovery add-on.",
      "Pilates also works especially well in Ahangama because it does not need to compete with the rest of your trip. It sits neatly between surf sessions, co-working blocks, and dinners out, and it makes more sense than overcomplicating your routine with too many different classes in one week.",
    ],
    asideTitle: "Best fit",
    aside: [
      "Pura Pilates for structured sessions focused on mobility and strength.",
      "Coconut Court if you want movement with a more social, active-lifestyle feel.",
    ],
  },
  {
    number: "03",
    title:
      "Gyms and harder sessions matter more here than most short guides admit",
    body: [
      "Ahangama is often marketed as soft wellness only, but plenty of people still want real training while they are here. Krish Combat & Fitness is the strongest match in the current set for gym access, private classes, and more disciplined physical work.",
      "That matters for longer stays. If you are here for two weeks or more, wellness usually stops meaning only massages and yoga. It starts meaning consistency, strength work, and keeping your body feeling capable enough to actually enjoy the trip.",
    ],
    asideTitle: "Training-focused option",
    aside: [
      "Krish Combat & Fitness for gym sessions, martial arts, and day-pass energy.",
      "Use it when you want wellness to include effort, not just recovery.",
    ],
  },
  {
    number: "04",
    title:
      "Recovery culture is real now: ice baths, steam, and reset sessions are part of the town's identity",
    body: [
      "The recovery side of Ahangama has become more defined, and Frosty's is the most obvious entry point if you want that world without ceremony. It is practical, social, and easy to plug into after surfing or training. Banya Steam House takes the mood in a more niche, slower direction, with a stronger emphasis on steam and restoration.",
      "This is the category for people who want a wellness afternoon without needing it to feel spiritual or luxurious. It is about nervous-system reset, easing soreness, and making the next surf or workday feel better than the previous one.",
    ],
    asideTitle: "Recovery picks",
    aside: [
      "Frosty's for ice-bath and recovery-led sessions.",
      "Banya Steam House for steam and slower restorative time.",
      "Spa Station Midigama is also a strong nearby massage-and-recovery stop even though it sits outside the editorial_wellness tag set.",
    ],
  },
  {
    number: "05",
    title:
      "Spas and Ayurveda are where Ahangama shifts from active wellness to restoration",
    body: [
      "When the mood is less about training and more about feeling repaired, the strongest names are Aksaaya Ayurveda Wellness Spa, Sarana, White Lotus Spa & Wellness, and Ayurveda Palm Garden Resort. Each one leans toward a different version of reset, from traditional treatments to more polished resort-style calm.",
      "This is the lane to recommend when someone is arriving tired, needs a mid-trip reset, or wants one anchor experience that makes the holiday feel slower and more intentional. In practical terms, these are also the easiest venues to recommend to couples, parents, and visitors who are not building their trip around surfing.",
    ],
    asideTitle: "Spa-led shortlist",
    aside: [
      "Aksaaya for traditional Ayurveda and high-trust treatments.",
      "Sarana for premium spa-style wellness sessions.",
      "White Lotus for a more luxurious retreat tone.",
      "Ayurveda Palm Garden Resort for stay-led wellness immersion.",
    ],
  },
  {
    number: "06",
    title: "The best wellness itinerary is mixed, not maximal",
    body: [
      "The mistake most visitors make is trying to do too much: yoga every day, surfing every day, treatments every day, and then wondering why the whole trip feels oddly tiring. Ahangama works better when you mix categories. One or two active sessions, one recovery block, one spa treatment, and a few slower mornings usually gives the best result.",
      "That is what makes this place strong. You can train, stretch, recover, socialize, and still keep the trip feeling light. The best wellness guide is not a list of the most options. It is a guide to choosing the right rhythm for the version of Ahangama you actually want.",
    ],
    asideTitle: "Simple weekly mix",
    aside: [
      "2 yoga or Pilates sessions.",
      "1 gym or training block.",
      "1 ice bath or steam recovery session.",
      "1 massage, Ayurveda, or spa treatment.",
    ],
  },
];

const quickReference = [
  {
    label: "Best for yoga",
    value: "Senses, Shramalaya, The Nuga House",
  },
  {
    label: "Best for Pilates",
    value: "Pura Pilates",
  },
  {
    label: "Best for gym sessions",
    value: "Krish Combat & Fitness",
  },
  {
    label: "Best for recovery",
    value: "Frosty's, Banya Steam House",
  },
  {
    label: "Best for spa and Ayurveda",
    value: "Aksaaya, Sarana, White Lotus, Ayurveda Palm Garden Resort",
  },
  {
    label: "Best for active-social wellness",
    value: "Coconut Court",
  },
];

export default function UltimateWellnessGuidePage() {
  const canonical = absUrl(WELLNESS_GUIDE_PATH);
  const passCtaUrl = buildPassCtaUrl();

  return (
    <SiteLayout>
      <Seo
        title="The Ultimate Wellness Guide to Ahangama: Yoga, Gyms, Pilates, Ice Baths & Spas"
        description="A full editorial guide to Ahangama wellness, covering yoga, gyms, Pilates, ice baths, recovery spaces, Ayurveda, spas, and the best places for each style of stay."
        canonical={canonical}
      />

      <div className="dm-heroCut" />
      <div className="dm-canvas">
        <div className="dm-wrap">
          <Card
            style={{
              borderRadius: 30,
              border: "1px solid rgba(47,62,58,0.08)",
              background:
                "linear-gradient(135deg, rgba(233,242,235,0.96) 0%, rgba(255,251,245,0.98) 100%)",
              overflow: "hidden",
              marginBottom: 28,
            }}
            bodyStyle={{ padding: 30 }}
          >
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} xl={14}>
                <Space wrap size={[8, 8]} style={{ marginBottom: 12 }}>
                  <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>
                    Wellness Guide
                  </Tag>
                  <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>
                    Ahangama Editorial
                  </Tag>
                </Space>

                <Title
                  level={1}
                  style={{
                    marginTop: 0,
                    marginBottom: 12,
                    fontSize: 42,
                    lineHeight: 1.03,
                  }}
                >
                  The Ultimate Wellness Guide to Ahangama: Yoga, Gyms, Pilates,
                  Ice Baths & Spas
                </Title>

                <Paragraph
                  style={{
                    fontSize: 18,
                    lineHeight: 1.8,
                    color: "#5C5953",
                    marginBottom: 18,
                  }}
                >
                  The practical editorial version of Ahangama wellness: where to
                  go for yoga, where to train properly, where to recover after
                  surfing, and which spa or Ayurveda stops are actually worth
                  building a slower day around.
                </Paragraph>

                <a
                  href={passCtaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center" }}
                >
                  <img
                    src={ahangamaPassLogo}
                    alt="Ahangama Pass"
                    style={{ display: "block", height: 52, width: "auto" }}
                  />
                </a>
              </Col>

              <Col xs={24} xl={10}>
                <div
                  style={{
                    minHeight: 360,
                    borderRadius: 24,
                    backgroundImage:
                      "linear-gradient(180deg, rgba(18,25,24,0.05) 0%, rgba(18,25,24,0.34) 100%), url(https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/pura_pilates.jpeg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </Col>
            </Row>
          </Card>

          <Card
            style={{
              borderRadius: 24,
              border: "1px solid rgba(47,62,58,0.08)",
              marginBottom: 28,
            }}
            bodyStyle={{ padding: 24 }}
          >
            <Space align="start" size={12}>
              <SafetyCertificateOutlined
                style={{ fontSize: 20, color: "#6F8A74", marginTop: 4 }}
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
                  Guide note
                </Text>
                <Paragraph style={{ margin: 0, color: "#5C5953" }}>
                  This page is grounded in the current live venues tagged under
                  `editorial_wellness` in Ahangama, then shaped into an
                  editorial guide that helps readers choose the right type of
                  session rather than simply listing every possible option.
                </Paragraph>
              </div>
            </Space>
          </Card>

          <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
            {quickReference.map((item) => (
              <Col xs={24} md={12} lg={8} key={item.label}>
                <Card
                  style={{
                    height: "100%",
                    borderRadius: 22,
                    border: "1px solid rgba(47,62,58,0.08)",
                    background:
                      "linear-gradient(180deg, #fffdf9 0%, #f2f7f2 100%)",
                  }}
                  bodyStyle={{ padding: 22 }}
                >
                  <Text
                    style={{
                      display: "block",
                      color: "#6F8A74",
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 8,
                      textTransform: "uppercase",
                      letterSpacing: 1.2,
                    }}
                  >
                    {item.label}
                  </Text>
                  <Paragraph
                    style={{
                      margin: 0,
                      color: "#2F3E3A",
                      fontSize: 16,
                      lineHeight: 1.6,
                    }}
                  >
                    {item.value}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {wellnessSections.map((section) => (
              <Card
                key={section.number}
                style={{
                  borderRadius: 24,
                  border: "1px solid rgba(47,62,58,0.08)",
                  background:
                    "linear-gradient(180deg, #fffdf9 0%, #f4f8f4 100%)",
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={16}>
                    <Text
                      style={{
                        display: "block",
                        color: "#6F8A74",
                        fontSize: 12,
                        fontWeight: 700,
                        marginBottom: 10,
                        textTransform: "uppercase",
                        letterSpacing: 1.4,
                      }}
                    >
                      {section.number}
                    </Text>
                    <Title level={2} style={{ marginTop: 0, marginBottom: 14 }}>
                      {section.title}
                    </Title>
                    {section.body.map((paragraph) => (
                      <Paragraph
                        key={paragraph}
                        style={{
                          color: "#55514B",
                          fontSize: 16,
                          lineHeight: 1.8,
                        }}
                      >
                        {paragraph}
                      </Paragraph>
                    ))}
                  </Col>
                  <Col xs={24} lg={8}>
                    <Card
                      style={{
                        borderRadius: 20,
                        background: "rgba(255,255,255,0.72)",
                        border: "1px solid rgba(47,62,58,0.08)",
                      }}
                      bodyStyle={{ padding: 18 }}
                    >
                      <Space
                        align="center"
                        size={8}
                        style={{ marginBottom: 10 }}
                      >
                        <HeartOutlined style={{ color: "#6F8A74" }} />
                        <Text
                          style={{
                            color: "#6F8A74",
                            fontSize: 12,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 1.2,
                          }}
                        >
                          {section.asideTitle}
                        </Text>
                      </Space>
                      {section.aside.map((item) => (
                        <Paragraph
                          key={item}
                          style={{ marginBottom: 10, color: "#59534B" }}
                        >
                          {item}
                        </Paragraph>
                      ))}
                    </Card>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>

          <Divider style={{ margin: "32px 0" }} />

          <Card
            style={{
              borderRadius: 28,
              border: "1px solid rgba(47,62,58,0.08)",
              background:
                "linear-gradient(135deg, rgba(47,62,58,0.98) 0%, rgba(88,110,92,0.98) 100%)",
              marginBottom: 36,
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
                  Final note
                </Text>
                <Title level={2} style={{ color: "#FFF8F0", marginTop: 0 }}>
                  What to recommend in one sentence
                </Title>
                <Paragraph
                  style={{
                    color: "rgba(255,248,240,0.86)",
                    fontSize: 16,
                    lineHeight: 1.8,
                    marginBottom: 0,
                  }}
                >
                  If you want the best version of wellness in Ahangama, mix one
                  or two strong movement sessions with one real recovery block
                  and one slower spa or Ayurveda stop instead of trying to turn
                  every day into a full retreat schedule.
                </Paragraph>
              </Col>
              <Col xs={24} lg={8}>
                <a
                  href={passCtaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={ahangamaPassLogo}
                    alt="Ahangama Pass"
                    style={{ display: "block", height: 52, width: "auto" }}
                  />
                </a>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}
