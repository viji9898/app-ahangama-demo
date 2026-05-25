import React from "react";
import { Card, Col, Row, Space, Tag, Typography } from "antd";
import {
  BookOutlined,
  DeploymentUnitOutlined,
  EditOutlined,
  FileTextOutlined,
  GiftOutlined,
  ReadOutlined,
  RocketOutlined,
  StarOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ConceptWorkspaceLayout from "../components/concept/ConceptWorkspaceLayout";

const { Paragraph, Text, Title } = Typography;

const sections = [
  { id: "overview", label: "Overview", hint: "What this index is for" },
  { id: "routes", label: "Strategy Routes", hint: "Jump to each workspace" },
  {
    id: "system",
    label: "System",
    hint: "How the strategy pages fit together",
  },
];

const strategyRoutes = [
  {
    key: "12-things",
    title: "12 Things",
    href: "/concept/12-things",
    icon: <StarOutlined />,
    owner: "Vishmi + Faizan",
    status: "In progress",
    summary:
      "The curated experience shortlist that shapes the destination story and what should be recommended first.",
    tags: ["Curation", "Destination story", "Experience shortlist"],
  },
  {
    key: "free-pass",
    title: "Free Pass",
    href: "/concept/free-pass",
    icon: <GiftOutlined />,
    owner: "Veronika + Ishaq",
    status: "Active planning",
    summary:
      "The acquisition engine that captures travelers, builds direct communication channels, and feeds the funnel.",
    tags: ["Acquisition", "WhatsApp", "Wallet pass"],
  },
  {
    key: "distribution",
    title: "Distribution",
    href: "/concept/distribution",
    icon: <DeploymentUnitOutlined />,
    owner: "Veronika",
    status: "Active planning",
    summary:
      "The partner and channel system that keeps hotels, venues, creators, and outbound communications active.",
    tags: ["Partners", "CRM", "Growth channels"],
  },
  {
    key: "premium-pass",
    title: "Premium Pass",
    href: "/concept/premium-pass",
    icon: <WalletOutlined />,
    owner: "Viji",
    status: "Planned",
    summary:
      "The paid product layer that turns curated Ahangama experiences into a coherent, monetizable bundle.",
    tags: ["Monetization", "Bundles", "Upsell"],
  },
  {
    key: "blog-strategy",
    title: "Blog Strategy",
    href: "/concept/blog-strategy",
    icon: <EditOutlined />,
    owner: "Courtney + Ishaq",
    status: "In progress",
    summary:
      "The editorial system that makes the destination searchable, trustworthy, and reusable across guide, blog, QR, and social.",
    tags: ["Editorial", "SEO", "Guide 26/27"],
  },
  {
    key: "guide-26-27",
    title: "Guide 26/27",
    href: "/concept/guide-26-27",
    icon: <BookOutlined />,
    owner: "Faizan",
    status: "Planned",
    summary:
      "The definitive Ahangama guide product spanning web, PDF, print, social, and pass-led discovery.",
    tags: ["Guide", "Editorial product", "Destination trust"],
  },
];

const systemCards = [
  {
    title: "Discovery and curation",
    icon: <StarOutlined />,
    body: "12 Things defines what matters most in Ahangama, giving the rest of the system a clear editorial and product spine.",
  },
  {
    title: "Acquisition and retention",
    icon: <GiftOutlined />,
    body: "The Free Pass captures travelers and starts the owned relationship layer through WhatsApp, email, and wallet-based recall.",
  },
  {
    title: "Distribution and reach",
    icon: <DeploymentUnitOutlined />,
    body: "Distribution ensures the pass and content are present across partners, physical touchpoints, newsletters, and creator channels.",
  },
  {
    title: "Story and trust",
    icon: <ReadOutlined />,
    body: "Blog Strategy turns raw recommendations into destination credibility, searchable stories, and reusable guide assets.",
  },
  {
    title: "Guide product",
    icon: <BookOutlined />,
    body: "Guide 26/27 packages the strongest destination knowledge into a clear editorial artifact that can live across formats and touchpoints.",
  },
  {
    title: "Monetization",
    icon: <WalletOutlined />,
    body: "Premium Pass converts high-intent travelers into buyers of curated Ahangama experiences instead of loose one-off offers.",
  },
];

export default function ConceptIndexPage() {
  return (
    <>
      <Seo
        title="Ahangama Pass Strategy Index"
        description="Internal strategy index for the Ahangama Pass concept system, linking curation, acquisition, distribution, editorial, and premium product planning."
        canonical={absUrl("/concept")}
      />

      <ConceptWorkspaceLayout
        sections={sections}
        status="Strategy index"
        lastUpdated="May 2026"
        shortcutActions={strategyRoutes.map((route) => ({
          key: route.key,
          label: route.title,
          href: route.href,
          isActive: false,
        }))}
      >
        <section id="overview" className="concept-strategyHero concept-section">
          <div>
            <Text className="concept-sectionEyebrow">Concept Index</Text>
            <Title className="concept-heroTitle">
              One entry point into the full Ahangama strategy system.
            </Title>
            <Paragraph className="concept-bodyCopy concept-heroParagraph">
              `/concept` should work as the index for the internal strategy
              pages, not as a long undifferentiated workspace. This page gives
              the team a clean starting point for the six strategy routes that
              now define the main operating layers of the Ahangama Pass project.
            </Paragraph>
          </div>

          <Space wrap>
            <Tag className="concept-pillTag">Internal only</Tag>
            <Tag className="concept-pillTag">Strategy map</Tag>
            <Tag className="concept-pillTag">Route index</Tag>
          </Space>
        </section>

        <section id="routes" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">Strategy Routes</Text>
            <Title level={2} className="concept-sectionTitle">
              Jump into the right workspace
            </Title>
            <Row gutter={[16, 16]}>
              {strategyRoutes.map((route) => (
                <Col xs={24} md={12} xl={8} key={route.key}>
                  <Card
                    className="concept-strategyGoalCard"
                    bordered={false}
                    hoverable
                  >
                    <Space align="center">
                      <span className="concept-strategyGoalIcon">
                        {route.icon}
                      </span>
                      <Title level={4} className="concept-strategySubHeader">
                        {route.title}
                      </Title>
                    </Space>
                    <Space wrap size={[8, 8]}>
                      <Tag className="concept-pillTag">
                        Owner: {route.owner}
                      </Tag>
                      <Tag className="concept-pillTag">{route.status}</Tag>
                    </Space>
                    <Paragraph className="concept-bodyCopy">
                      {route.summary}
                    </Paragraph>
                    <Space wrap>
                      {route.tags.map((tag) => (
                        <Tag className="concept-pillTag" key={tag}>
                          {tag}
                        </Tag>
                      ))}
                    </Space>
                    <a href={route.href} className="concept-shortcutButton">
                      Open workspace
                    </a>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </section>

        <section id="system" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">System</Text>
            <Title level={2} className="concept-sectionTitle">
              How the pages fit together
            </Title>
            <Paragraph className="concept-bodyCopy">
              The strategy routes are not separate ideas. They form one
              connected operating system: curate the right experiences, capture
              the right travelers, distribute the product broadly, tell the
              story well, and convert the strongest intent into premium
              products.
            </Paragraph>
            <Row gutter={[16, 16]}>
              {systemCards.map((item) => (
                <Col xs={24} md={12} xl={8} key={item.title}>
                  <Card className="concept-strategySubCard" bordered={false}>
                    <Space align="center">
                      <span className="concept-strategyGoalIcon">
                        {item.icon}
                      </span>
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
            <Card
              className="concept-strategyGoalCard"
              bordered={false}
              style={{ marginTop: 16 }}
            >
              <Space align="center">
                <RocketOutlined className="concept-strategyGoalIcon" />
                <div>
                  <Text className="concept-sectionEyebrow">Operating rule</Text>
                  <Title level={4} className="concept-strategySubHeader">
                    Use `/concept` as the map, then work inside the specific
                    route.
                  </Title>
                </div>
              </Space>
              <Paragraph
                className="concept-bodyCopy"
                style={{ marginBottom: 0 }}
              >
                This keeps the strategy system clearer: the index explains the
                structure, and each slugged page holds the detailed working
                brief for that slice.
              </Paragraph>
            </Card>
          </Card>
        </section>
      </ConceptWorkspaceLayout>
    </>
  );
}
