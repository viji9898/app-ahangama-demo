import React from "react";
import {
  ArrowRightOutlined,
  CoffeeOutlined,
  HeartOutlined,
  LaptopOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Divider, Row, Space, Tag, Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { buildPassCtaUrl } from "../lib/passAttribution";

const { Paragraph, Text, Title } = Typography;

const PAGE_PATH = "/3-days-in-ahangama";

const daySections = [
  {
    day: "Day 1",
    title: "I checked into Samba and let the pace of Ahangama reset me first",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/stays/Asset+33samba.webp",
    moments: [
      {
        label: "Morning",
        body:
          "I based the trip at Samba on the beach road because it immediately solves two things at once: you are staying somewhere with real energy around it, and you are already close to the food-and-work rhythm that makes Ahangama easy. The live venue data positions Samba as a beach-road staple with strong reviews, and for this itinerary I am pricing in a stronger 20% saving on the stay, plus the kind of extra perks that make the place feel generous rather than gimmicky: a free coffee with a brunch order and a free dessert for dinner for two.",
      },
      {
        label: "Afternoon",
        body:
          "After checking in, I kept the first day deliberately light. I took the laptop to Colive for an afternoon work block because it is the cleanest coworking match in the current venue set: a true co-working space in Ahangama, highly rated, and now worth treating as a buy-one-get-one-free desk setup for this story. That makes the work block feel genuinely useful in the budget, not just symbolically discounted.",
      },
      {
        label: "Evening",
        body:
          "I ended the night back at Samba. That is part of the point of staying there. You do not need to over-plan your first evening because the venue already works for dinner, drinks, and an easy social atmosphere on the road. For a short trip, that kind of built-in simplicity matters more than squeezing in one more venue tick-box.",
      },
    ],
    asideTitle: "What made day one work",
    aside: [
      "Samba stay saving: 20% off the room cost in this itinerary.",
      "Samba stay perk: 1 free coffee with a brunch menu order.",
      "Colive perk: buy one get one free coworking.",
    ],
  },
  {
    day: "Day 2",
    title: "The second day became the real wellness-and-work balance",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/co_live.jpg",
    moments: [
      {
        label: "Morning",
        body:
          "This is where I think Ahangama gets interesting for longer-stay travelers. You can do a proper work morning without the whole day feeling like admin. I started with coffee and breakfast, then split the first half of the day between Samba and Daily Dose Cafe. Daily Dose is useful in the live data not just because it is remote-work friendly, but because the pass perk is clean and simple: 10% off all menu items. That makes it a good fallback when you want a laptop session that still feels like part of the trip.",
      },
      {
        label: "Afternoon",
        body:
          "For the active part of the day, I leaned into Krish Combat & Fitness rather than pretending wellness always means a yoga mat and a smoothie. Krish is one of the strongest live wellness partners for training-focused travelers, and for this page I have updated the one-day pass assumption to a much more meaningful 50% off. It is the right choice when you want the body to feel switched on rather than simply pampered.",
      },
      {
        label: "Evening",
        body:
          "After that, the smartest move is contrast. I would book Aksaaya Ayurveda Wellness Spa for a 90-minute treatment package and let the day slow down properly. For this itinerary, I am valuing the pass benefit there as 30 extra minutes on top of a 90-minute booking, which I have priced as LKR 3,000 of added value on an estimated LKR 18,000 treatment. That is the kind of perk that changes the math of a short wellness stay rather than saving you a token amount on a coffee.",
      },
    ],
    asideTitle: "Why day two feels balanced",
    aside: [
      "Daily Dose: 10% off all menu items.",
      "Krish: 50% off a one-day pass.",
      "Aksaaya: 30 minutes free on a 90-minute treatment, valued at LKR 3,000.",
    ],
  },
  {
    day: "Day 3",
    title: "By the third day, the trip stopped feeling like a schedule and started feeling like a rhythm",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/spa_station_midigama.jpg",
    moments: [
      {
        label: "Morning",
        body:
          "The final day is where I would repeat what worked instead of chasing novelty. Another short coworking session at Colive or a quieter desk block at Focus Hub is enough. Focus Hub is still a useful option in the live data because it is explicitly built around coworking and cafe use, with a 10% off perk attached to the pass. On a three-day stay, that kind of second workspace helps the trip feel intentional rather than improvised.",
      },
      {
        label: "Afternoon",
        body:
          "For the last wellness stop, I would head slightly beyond Ahangama proper to Spa Station Midigama. It is one of those practical partner venues that makes sense in real life: dependable, highly rated, and clearly positioned for recovery after surf or travel days. The live offer set is strong too, with 10% off any treatment and a free aromatherapy add-on.",
      },
      {
        label: "Evening",
        body:
          "I would finish the trip back at Samba, because the whole point of this version of Ahangama is not chasing every possible venue. It is staying somewhere lively enough that the town comes to you, then building just enough work, movement, and recovery around that base to leave feeling better than when you arrived.",
      },
    ],
    asideTitle: "The final-day rhythm",
    aside: [
      "Repeat the coworking block instead of changing neighbourhoods.",
      "Use Spa Station as the recovery reset before travel.",
      "Let Samba be the anchor again at the end of the stay.",
    ],
  },
];

const quickReference = [
  {
    label: "Stay",
    value: "Samba",
    note: "20% stay saving in this itinerary, plus coffee and dinner perks.",
  },
  {
    label: "Coworking base",
    value: "Colive",
    note: "Top-rated coworking space in Ahangama with a buy one get one free setup for this itinerary.",
  },
  {
    label: "Work-friendly cafe",
    value: "Daily Dose Cafe",
    note: "10% off all menu items and a remote-work-friendly setup.",
  },
  {
    label: "Training-led wellness",
    value: "Krish Combat & Fitness",
    note: "50% off the one-day pass in this itinerary version.",
  },
  {
    label: "Deep reset",
    value: "Aksaaya Ayurveda Wellness Spa",
    note: "A 30-minute free extension on a 90-minute treatment, valued at LKR 3,000.",
  },
  {
    label: "Recovery stop",
    value: "Spa Station Midigama",
    note: "10% off treatments plus a free aromatherapy add-on.",
  },
];

const costRows = [
  {
    item: "2 nights at Samba",
    assumption: "Estimated at LKR 18,000 per night",
    cost: 36000,
    savings: 7200,
  },
  {
    item: "2 coworking sessions at Colive",
    assumption: "Estimated at LKR 4,000 each",
    cost: 8000,
    savings: 4000,
  },
  {
    item: "2 meals/work blocks at Daily Dose",
    assumption: "Estimated at LKR 3,500 each",
    cost: 7000,
    savings: 700,
  },
  {
    item: "Krish one-day pass",
    assumption: "Estimated at LKR 6,000",
    cost: 6000,
    savings: 3000,
  },
  {
    item: "Aksaaya 90-minute treatment",
    assumption: "Estimated at LKR 18,000, with 30 minutes free valued at LKR 3,000",
    cost: 18000,
    savings: 3000,
  },
  {
    item: "Spa Station recovery treatment",
    assumption: "Estimated at LKR 12,000",
    cost: 12000,
    savings: 1200,
  },
  {
    item: "One dinner back at Samba",
    assumption: "Estimated at LKR 8,500",
    cost: 8500,
    savings: 850,
  },
];

const totalCost = costRows.reduce((sum, row) => sum + row.cost, 0);
const totalSavings = costRows.reduce((sum, row) => sum + row.savings, 0);

function formatLkr(value) {
  return `LKR ${new Intl.NumberFormat("en-LK").format(value)}`;
}

export default function ThreeDaysInAhangamaPage() {
  const canonical = absUrl(PAGE_PATH);
  const passCtaUrl = buildPassCtaUrl();

  return (
    <SiteLayout>
      <Seo
        title="3 Days in Ahangama: A Personal Wellness Stay at Samba"
        description="A personal 3-day Ahangama itinerary built around a stay at Samba, with coworking blocks, wellness sessions, and a practical Ahangama Pass cost breakdown."
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
                "linear-gradient(135deg, rgba(248,242,233,0.98) 0%, rgba(255,252,246,0.98) 100%)",
              overflow: "hidden",
              marginBottom: 28,
            }}
            bodyStyle={{ padding: 30 }}
          >
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} xl={14}>
                <Space wrap size={[8, 8]} style={{ marginBottom: 12 }}>
                  <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>
                    Personal Story
                  </Tag>
                  <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>
                    3-Day Ahangama Guide
                  </Tag>
                  <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>
                    Wellness + Coworking
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
                  3 Days in Ahangama: My Wellness Stay at Samba
                </Title>

                <Paragraph
                  style={{
                    fontSize: 18,
                    lineHeight: 1.8,
                    color: "#5C5953",
                    marginBottom: 18,
                  }}
                >
                  I wanted three days in Ahangama that felt personal, soft, and
                  still slightly useful: enough time to work a little, train a
                  little, recover properly, and still keep the town feeling
                  light. So I based the whole trip at Samba and built the days
                  around the live pass partners that actually improve that kind
                  of stay.
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
                  <Button size="large" href="#cost-breakdown" style={{ borderRadius: 999 }}>
                    Jump to cost breakdown
                  </Button>
                </Space>
              </Col>

              <Col xs={24} xl={10}>
                <div
                  style={{
                    minHeight: 360,
                    borderRadius: 24,
                    backgroundImage:
                      "linear-gradient(180deg, rgba(18,25,24,0.05) 0%, rgba(18,25,24,0.34) 100%), url(https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/stays/Asset+33samba.webp)",
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
                style={{ fontSize: 20, color: "#8B7B63", marginTop: 4 }}
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
                  This page is written as a personal editorial story, but the
                  venue details are grounded in the current live Ahangama data
                  for Samba, Colive, Daily Dose Cafe, Krish Combat & Fitness,
                  Aksaaya Ayurveda Wellness Spa, and Spa Station Midigama. The
                  costs below are practical itinerary estimates layered on top
                  of the current pass offers, because the live venue table
                  contains the perks and descriptions rather than fixed public
                  room or treatment prices.
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
                      "linear-gradient(180deg, #fffdf9 0%, #f6f1e7 100%)",
                  }}
                  bodyStyle={{ padding: 22 }}
                >
                  <Text
                    style={{
                      display: "block",
                      color: "#8B7B63",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 1.2,
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    {item.label}
                  </Text>
                  <Title level={4} style={{ marginTop: 0, marginBottom: 10 }}>
                    {item.value}
                  </Title>
                  <Paragraph style={{ marginBottom: 0, color: "#5C5953" }}>
                    {item.note}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>

          {daySections.map((section, index) => (
            <Card
              key={section.day}
              style={{
                borderRadius: 28,
                border: "1px solid rgba(47,62,58,0.08)",
                background:
                  index % 2 === 0
                    ? "linear-gradient(135deg, rgba(255,251,246,0.98) 0%, rgba(244,239,231,0.98) 100%)"
                    : "linear-gradient(135deg, rgba(248,250,248,0.98) 0%, rgba(242,246,243,0.98) 100%)",
                marginBottom: 24,
                overflow: "hidden",
              }}
              bodyStyle={{ padding: 28 }}
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} xl={15}>
                  <Space direction="vertical" size={12} style={{ width: "100%" }}>
                    <Space wrap size={[8, 8]}>
                      <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>
                        {section.day}
                      </Tag>
                      <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>
                        Personal rhythm
                      </Tag>
                    </Space>

                    <Title level={2} style={{ margin: 0, lineHeight: 1.08 }}>
                      {section.title}
                    </Title>

                    {section.moments.map((moment) => (
                      <div key={moment.label}>
                        <Text
                          style={{
                            display: "block",
                            color: "#8B7B63",
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: 1.2,
                            textTransform: "uppercase",
                            marginBottom: 8,
                          }}
                        >
                          {moment.label}
                        </Text>
                        <Paragraph
                          style={{ marginBottom: 0, color: "#5C5953", lineHeight: 1.8 }}
                        >
                          {moment.body}
                        </Paragraph>
                      </div>
                    ))}
                  </Space>
                </Col>

                <Col xs={24} xl={9}>
                  <div
                    style={{
                      minHeight: 240,
                      borderRadius: 22,
                      backgroundImage: `linear-gradient(180deg, rgba(18,25,24,0.04) 0%, rgba(18,25,24,0.34) 100%), url(${section.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      marginBottom: 18,
                    }}
                  />

                  <Card
                    style={{
                      borderRadius: 22,
                      border: "1px solid rgba(47,62,58,0.08)",
                      background: "rgba(255,255,255,0.72)",
                    }}
                    bodyStyle={{ padding: 20 }}
                  >
                    <Text
                      style={{
                        display: "block",
                        marginBottom: 10,
                        color: "#2F3E3A",
                        fontWeight: 700,
                      }}
                    >
                      {section.asideTitle}
                    </Text>
                    <Space direction="vertical" size={10} style={{ width: "100%" }}>
                      {section.aside.map((item) => (
                        <div key={item} style={{ display: "flex", gap: 10 }}>
                          <HeartOutlined style={{ color: "#8B7B63", marginTop: 4 }} />
                          <Text style={{ color: "#5C5953" }}>{item}</Text>
                        </div>
                      ))}
                    </Space>
                  </Card>
                </Col>
              </Row>
            </Card>
          ))}

          <Card
            style={{
              borderRadius: 28,
              border: "1px solid rgba(47,62,58,0.08)",
              background:
                "linear-gradient(135deg, rgba(245,248,244,0.98) 0%, rgba(255,252,247,0.98) 100%)",
              marginBottom: 24,
            }}
            bodyStyle={{ padding: 28 }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                  <Space align="center" size={10}>
                    <LaptopOutlined style={{ fontSize: 20, color: "#6C7B71" }} />
                    <Title level={3} style={{ margin: 0 }}>
                      The coworking version of a wellness trip
                    </Title>
                  </Space>
                  <Paragraph style={{ margin: 0, color: "#5C5953", lineHeight: 1.8 }}>
                    The reason this itinerary works is that it never treats
                    work as a failure of the holiday. It just gives work a
                    proper container. Colive is the clean desk-day answer.
                    Daily Dose is the laptop-and-coffee answer. Focus Hub is the
                    backup when you want a more classic coworking-cafe hybrid.
                    That means the rest of the day can genuinely be about your
                    body, your mood, and the pace of the town.
                  </Paragraph>
                </Space>
              </Col>
              <Col xs={24} lg={12}>
                <Space direction="vertical" size={10} style={{ width: "100%" }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <CoffeeOutlined style={{ color: "#8B7B63", marginTop: 4 }} />
                    <Text style={{ color: "#5C5953" }}>
                      Use Daily Dose for the lower-pressure work session that
                      still feels social and local.
                    </Text>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <LaptopOutlined style={{ color: "#8B7B63", marginTop: 4 }} />
                    <Text style={{ color: "#5C5953" }}>
                      Use Colive when you need a proper desk block and want the
                      pass to reduce that cost too.
                    </Text>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <HeartOutlined style={{ color: "#8B7B63", marginTop: 4 }} />
                    <Text style={{ color: "#5C5953" }}>
                      Then let the afternoon turn into Krish, Aksaaya, or Spa
                      Station instead of another coffee-fuelled half-work day.
                    </Text>
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>

          <Card
            id="cost-breakdown"
            style={{
              borderRadius: 30,
              border: "1px solid rgba(47,62,58,0.08)",
              marginBottom: 28,
              overflow: "hidden",
            }}
            bodyStyle={{ padding: 28 }}
          >
            <Space direction="vertical" size={10} style={{ width: "100%" }}>
              <Tag style={{ borderRadius: 999, padding: "6px 12px", width: "fit-content" }}>
                Cost Breakdown
              </Tag>
              <Title level={2} style={{ margin: 0 }}>
                What this 3-day stay could cost, and what the pass could save
              </Title>
              <Paragraph style={{ color: "#5C5953", marginBottom: 0, lineHeight: 1.8 }}>
                This is an editorial sample budget for a short Samba-based stay,
                built around the current live pass offers. It is meant to show
                how the Ahangama Pass changes the economics of a wellness trip,
                not to claim these are fixed public rates for every season.
              </Paragraph>
            </Space>

            <Divider />

            <Space direction="vertical" size={14} style={{ width: "100%" }}>
              {costRows.map((row) => (
                <Card
                  key={row.item}
                  style={{ borderRadius: 20, border: "1px solid rgba(47,62,58,0.08)" }}
                  bodyStyle={{ padding: 18 }}
                >
                  <Row gutter={[16, 12]} align="middle">
                    <Col xs={24} md={12}>
                      <Text style={{ display: "block", fontWeight: 700, color: "#2F3E3A" }}>
                        {row.item}
                      </Text>
                      <Text style={{ color: "#6A645D" }}>{row.assumption}</Text>
                    </Col>
                    <Col xs={12} md={6}>
                      <Text style={{ display: "block", color: "#8B7B63", fontSize: 12 }}>
                        Estimated spend
                      </Text>
                      <Text style={{ fontWeight: 700, color: "#2F3E3A" }}>
                        {formatLkr(row.cost)}
                      </Text>
                    </Col>
                    <Col xs={12} md={6}>
                      <Text style={{ display: "block", color: "#8B7B63", fontSize: 12 }}>
                        Pass saving
                      </Text>
                      <Text style={{ fontWeight: 700, color: "#2F6A57" }}>
                        {formatLkr(row.savings)}
                      </Text>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Space>

            <Divider />

            <Row gutter={[20, 20]}>
              <Col xs={24} md={8}>
                <Card
                  style={{
                    borderRadius: 22,
                    border: "1px solid rgba(47,62,58,0.08)",
                    background: "linear-gradient(180deg, #fffdf9 0%, #f6f1e7 100%)",
                  }}
                  bodyStyle={{ padding: 22 }}
                >
                  <Text style={{ display: "block", color: "#8B7B63", marginBottom: 8 }}>
                    Estimated itinerary spend
                  </Text>
                  <Title level={3} style={{ margin: 0 }}>
                    {formatLkr(totalCost)}
                  </Title>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card
                  style={{
                    borderRadius: 22,
                    border: "1px solid rgba(47,62,58,0.08)",
                    background: "linear-gradient(180deg, #f3faf5 0%, #eef7f0 100%)",
                  }}
                  bodyStyle={{ padding: 22 }}
                >
                  <Text style={{ display: "block", color: "#6C7B71", marginBottom: 8 }}>
                    Estimated pass saving
                  </Text>
                  <Title level={3} style={{ margin: 0, color: "#2F6A57" }}>
                    {formatLkr(totalSavings)}
                  </Title>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card
                  style={{
                    borderRadius: 22,
                    border: "1px solid rgba(47,62,58,0.08)",
                    background: "linear-gradient(180deg, #fffaf1 0%, #fff4dd 100%)",
                  }}
                  bodyStyle={{ padding: 22 }}
                >
                  <Text style={{ display: "block", color: "#8B7B63", marginBottom: 8 }}>
                    Why the pass matters here
                  </Text>
                  <Paragraph style={{ marginBottom: 0, color: "#5C5953" }}>
                    This estimate already saves more than the entry price of the
                    pass from a single short stay, and that is before counting
                    the extra value of Samba&apos;s free coffee and Spa Station&apos;s
                    free aromatherapy add-on.
                  </Paragraph>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}