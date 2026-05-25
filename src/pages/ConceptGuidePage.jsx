import React from "react";
import { Card, Col, Divider, List, Row, Space, Tag, Typography } from "antd";
import {
  BookOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  CompassOutlined,
  FileTextOutlined,
  GlobalOutlined,
  InstagramOutlined,
  QrcodeOutlined,
  ReadOutlined,
  RocketOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ConceptWorkspaceLayout from "../components/concept/ConceptWorkspaceLayout";

const { Paragraph, Text, Title } = Typography;

const sections = [
  { id: "overview", label: "Overview", hint: "Why the guide matters" },
  { id: "positioning", label: "Positioning", hint: "What the guide should be" },
  { id: "formats", label: "Formats", hint: "Guide outputs" },
  { id: "content", label: "Content", hint: "What goes inside" },
  { id: "ownership", label: "Ownership", hint: "Who drives the guide" },
  {
    id: "distribution",
    label: "Distribution",
    hint: "Where the guide should live",
  },
  { id: "goal", label: "Main Goal", hint: "What success should produce" },
];

const shortcutActions = [
  {
    key: "12-things",
    label: "12 Things",
    href: "/concept/12-things",
    isActive: false,
  },
  {
    key: "free-pass",
    label: "Free Pass",
    href: "/concept/free-pass",
    isActive: false,
  },
  {
    key: "distribution",
    label: "Distribution",
    href: "/concept/distribution",
    isActive: false,
  },
  {
    key: "premium-pass",
    label: "Premium Pass",
    href: "/concept/premium-pass",
    isActive: false,
  },
  {
    key: "blog-strategy",
    label: "Blog Strategy",
    href: "/concept/blog-strategy",
    isActive: false,
  },
  {
    key: "guide-26-27",
    label: "Guide 26/27",
    href: "/concept/guide-26-27",
    isActive: true,
  },
];

const positioningPrinciples = [
  "The definitive guide to Ahangama.",
  "A curated travel guide feel, not a crowded directory.",
  "A product that strengthens destination trust and premium perception.",
  "An editorial wrapper for web, PDF, print, social, and QR-led discovery.",
];

const guideFormats = [
  "Digital Guide",
  "Printed Guide",
  "Instagram Editorial",
  "PDF Download",
  "Interactive Map",
];

const contentPillars = [
  "Where to stay",
  "What to do",
  "Wellness",
  "Surf",
  "Food",
  "Nightlife",
  "Shopping",
  "Local recommendations",
];

const ownershipCards = [
  {
    title: "Vishmi",
    icon: <CompassOutlined />,
    body: "Provide the strongest venue and experience shortlist so the guide reflects genuinely memorable Ahangama recommendations.",
  },
  {
    title: "Faizan",
    icon: <CameraOutlined />,
    body: "Build the visual system for guide layouts, experience cards, and the overall editorial world around the guide.",
  },
  {
    title: "Blog Strategy",
    icon: <FileTextOutlined />,
    body: "Supply the story layer that turns individual experiences into written recommendations and reusable editorial modules.",
  },
  {
    title: "Distribution",
    icon: <QrcodeOutlined />,
    body: "Ensure the guide is not passive content by pushing it through QR touchpoints, partners, email, and WhatsApp channels.",
  },
];

const distributionChannels = [
  {
    title: "Website",
    icon: <GlobalOutlined />,
    description:
      "The searchable destination hub where guide content can rank, educate, and connect users into deeper flows.",
  },
  {
    title: "PDF and print",
    icon: <BookOutlined />,
    description:
      "A portable guide format that can live in hotels, partner venues, and physical touchpoints around town.",
  },
  {
    title: "Instagram",
    icon: <InstagramOutlined />,
    description:
      "A discovery layer that turns guide moments into social proof and pulls people back into the guide system.",
  },
  {
    title: "Pass ecosystem",
    icon: <ShoppingOutlined />,
    description:
      "A supporting asset for the Free Pass and Premium Pass that helps explain what is worth doing in Ahangama.",
  },
];

function SectionCard({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="concept-section">
      <Card className="concept-card concept-cardSection" bordered={false}>
        <Text className="concept-sectionEyebrow">{eyebrow}</Text>
        <Title level={2} className="concept-sectionTitle">
          {title}
        </Title>
        {children}
      </Card>
    </section>
  );
}

export default function ConceptGuidePage() {
  const canonical = absUrl("/concept/guide-26-27");

  return (
    <>
      <Seo
        title="Guide 26/27 Strategy"
        description="Internal strategy workspace for Ahangama Guide 26/27, including positioning, outputs, content pillars, ownership, and distribution."
        canonical={canonical}
      />

      <ConceptWorkspaceLayout
        sections={sections}
        status="Active planning"
        lastUpdated="May 2026"
        shortcutActions={shortcutActions}
      >
        <section className="concept-strategyHero">
          <div>
            <Text className="concept-sectionEyebrow">Guide 26/27</Text>
            <Title className="concept-heroTitle">
              The guide should become the definitive editorial product for
              Ahangama.
            </Title>
            <Paragraph className="concept-bodyCopy concept-heroParagraph">
              The guide is where destination curation, editorial storytelling,
              and product clarity come together. It should make Ahangama easier
              to understand, easier to trust, and easier to navigate across web,
              print, social, and pass-led discovery.
            </Paragraph>
          </div>

          <Space wrap>
            <Tag className="concept-pillTag">Editorial product</Tag>
            <Tag className="concept-pillTag">Guide 26/27</Tag>
            <Tag className="concept-pillTag">Destination credibility</Tag>
          </Space>
        </section>

        <SectionCard
          id="overview"
          eyebrow="Overview"
          title="Why the guide needs its own route"
        >
          <Paragraph className="concept-bodyCopy">
            The guide already shows up across the concept system, but it was
            only being referenced as a supporting theme. Giving it its own route
            turns it into a concrete strategic product with clear purpose,
            outputs, and ownership.
          </Paragraph>

          <Row gutter={[16, 16]}>
            {positioningPrinciples.map((item) => (
              <Col xs={24} md={12} key={item}>
                <Card className="concept-strategySubCard" bordered={false}>
                  <Space align="start">
                    <CheckCircleOutlined className="concept-strategyGoalIcon" />
                    <Text className="concept-bodyCopy">{item}</Text>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard
          id="positioning"
          eyebrow="Positioning"
          title="What the guide should feel like"
        >
          <Paragraph className="concept-bodyCopy">
            This should not feel like a list of promotions. It should feel like
            a premium, modern Sri Lanka travel guide built around the strongest
            local experiences and recommendations. The guide has to create trust
            first, then support product discovery and conversion.
          </Paragraph>
          <Card className="concept-strategyGoalCard" bordered={false}>
            <Space align="center">
              <ReadOutlined className="concept-strategyGoalIcon" />
              <div>
                <Text className="concept-sectionEyebrow">Positioning rule</Text>
                <Title level={4} className="concept-strategySubHeader">
                  Premium local guide, not a directory and not a coupon sheet.
                </Title>
              </div>
            </Space>
          </Card>
        </SectionCard>

        <SectionCard
          id="formats"
          eyebrow="Formats"
          title="Outputs the guide should power"
        >
          <List
            grid={{ gutter: 16, xs: 1, md: 2 }}
            dataSource={guideFormats}
            renderItem={(item) => (
              <List.Item>
                <Card className="concept-strategySubCard" bordered={false}>
                  <Space align="start">
                    <BookOutlined className="concept-strategyGoalIcon" />
                    <Text className="concept-bodyCopy">{item}</Text>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        </SectionCard>

        <SectionCard
          id="content"
          eyebrow="Content"
          title="What the guide should actually contain"
        >
          <Paragraph className="concept-bodyCopy">
            The guide should organize Ahangama clearly across the key categories
            that matter to visitors. That gives the editorial system a stable
            structure and keeps the guide useful across digital and physical
            formats.
          </Paragraph>
          <div className="concept-chipGrid">
            {contentPillars.map((item) => (
              <span className="concept-chip" key={item}>
                {item}
              </span>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          id="ownership"
          eyebrow="Ownership"
          title="Which workstreams feed the guide"
        >
          <Row gutter={[16, 16]}>
            {ownershipCards.map((item) => (
              <Col xs={24} md={12} key={item.title}>
                <Card className="concept-strategyGoalCard" bordered={false}>
                  <Space align="center">
                    {item.icon}
                    <Title level={4} className="concept-strategySubHeader">
                      {item.title}
                    </Title>
                  </Space>
                  <Paragraph className="concept-bodyCopy">
                    {item.body}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard
          id="distribution"
          eyebrow="Distribution"
          title="Where the guide should live"
        >
          <Row gutter={[16, 16]}>
            {distributionChannels.map((channel) => (
              <Col xs={24} md={12} key={channel.title}>
                <Card className="concept-strategyGoalCard" bordered={false}>
                  <Space align="center">
                    {channel.icon}
                    <Title level={4} className="concept-strategySubHeader">
                      {channel.title}
                    </Title>
                  </Space>
                  <Paragraph className="concept-bodyCopy">
                    {channel.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard
          id="goal"
          eyebrow="Main Goal"
          title="What success should produce"
        >
          <Paragraph className="concept-bodyCopy">
            Guide 26/27 should become the clearest destination artifact in the
            Ahangama system: something people can search, save, share, print,
            and use as a trusted entry point into the town and the pass
            ecosystem.
          </Paragraph>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card className="concept-strategyGoalCard" bordered={false}>
                <GlobalOutlined className="concept-strategyGoalIcon" />
                <Title level={4} className="concept-strategySubHeader">
                  Trusted destination guide
                </Title>
                <Paragraph className="concept-bodyCopy">
                  A guide people rely on to understand where to go and what
                  matters.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="concept-strategyGoalCard" bordered={false}>
                <FileTextOutlined className="concept-strategyGoalIcon" />
                <Title level={4} className="concept-strategySubHeader">
                  Reusable editorial infrastructure
                </Title>
                <Paragraph className="concept-bodyCopy">
                  A structure that feeds blog, social, QR, and future guide
                  updates.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="concept-strategyGoalCard" bordered={false}>
                <RocketOutlined className="concept-strategyGoalIcon" />
                <Title level={4} className="concept-strategySubHeader">
                  Stronger product ecosystem
                </Title>
                <Paragraph className="concept-bodyCopy">
                  A guide that improves both discovery and conversion into
                  pass-driven experiences.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </SectionCard>
      </ConceptWorkspaceLayout>
    </>
  );
}
