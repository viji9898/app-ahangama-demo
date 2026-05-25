import React from "react";
import {
  Card,
  Col,
  Divider,
  List,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  CheckCircleOutlined,
  CompassOutlined,
  FileTextOutlined,
  GlobalOutlined,
  InstagramOutlined,
  MessageOutlined,
  QrcodeOutlined,
  ReadOutlined,
  RocketOutlined,
  StarOutlined,
  TeamOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ConceptWorkspaceLayout from "../components/concept/ConceptWorkspaceLayout";

const { Paragraph, Text, Title } = Typography;

const sections = [
  { id: "overview", label: "Overview", hint: "Purpose of the free pass" },
  { id: "funnel", label: "Funnel", hint: "Acquisition to upsell path" },
  { id: "vishmi", label: "Vishmi", hint: "Venue and experience acquisition" },
  { id: "faizan", label: "Faizan", hint: "Visual identity and UX" },
  { id: "ishaq", label: "Ishaq", hint: "Acquisition and Instagram growth" },
  { id: "minosha", label: "Minosha", hint: "Partnerships and ecosystem ops" },
  { id: "veronika", label: "Veronika", hint: "Coordination and accountability" },
  { id: "blog-strategy", label: "Content", hint: "Blog and discovery strategy" },
  { id: "main-goal", label: "Main Goal", hint: "What the free pass really is" },
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
    isActive: true,
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
];

const passRoles = [
  "our acquisition engine",
  "our tourism discovery layer",
  "our direct communication channel with travelers",
  "our onboarding funnel into premium products and experiences",
];

const passOutcomes = [
  "build direct relationships with travelers",
  "capture user intent and interests",
  "communicate through WhatsApp and email",
  "guide tourists through Ahangama",
  "upsell premium experiences, bundles, merchandise and concierge services",
];

const funnelSteps = [
  "QR Scan / Instagram / Hotel",
  "Free Pass Signup",
  "Wallet Pass",
  "WhatsApp Onboarding",
  "Recommendations & Guide",
  "Engagement",
  "Premium Upsells",
];

const leads = [
  {
    id: "vishmi",
    name: "Vishmi",
    role: "Venue & Experience Acquisition Lead",
    icon: <StarOutlined />,
    summary:
      "Ensure the Free Pass has enough high-quality venues and experiences to make it genuinely valuable for tourists from day one.",
    responsibilities: [
      "Finalize top 10–15 venues",
      "Expand high-quality venue partnerships",
      "Secure perks and benefits",
      "Improve discounts and offers",
      "Build 12 Must Do Things in Ahangama",
      "Coordinate venue onboarding",
      "Help define premium experience opportunities",
    ],
    focus: [
      "Quality over quantity",
      "Memorable experiences",
      "Tourist appeal",
      "Diverse categories: wellness, surf, food, coworking, lifestyle",
      "You are shaping the core product tourists interact with",
    ],
  },
  {
    id: "faizan",
    name: "Faizan",
    role: "Visual Identity & User Experience Lead",
    icon: <WalletOutlined />,
    summary:
      "Make the Free Pass ecosystem visually premium, simple, mobile-first, and desirable across every touchpoint the traveler sees.",
    responsibilities: [
      "Wallet pass visuals",
      "QR stand designs",
      "Guide layouts",
      "Mobile-first landing page visuals",
      "Blog visuals",
      "Experience cards",
      "Editorial design system",
      "Promotional assets",
    ],
    focus: [
      "Modern",
      "Minimal",
      "Premium",
      "Travel-focused",
      "Curated",
      "Easy to understand",
      "Design the entire visual world around the pass",
    ],
  },
  {
    id: "ishaq",
    name: "Ishaq",
    role: "Acquisition & Instagram Growth Lead",
    icon: <InstagramOutlined />,
    summary:
      "Drive awareness and acquisition into the Free Pass funnel, using social-first tourism discovery to bring travelers into the ecosystem.",
    responsibilities: [
      "Instagram growth",
      "Reels promoting experiences",
      "12 Must Do Things in Ahangama",
      "Creator-style destination content",
      "Venue storytelling",
      "Social-first tourism discovery",
      "WhatsApp funnel promotion",
    ],
    focus: [
      "Get travelers to discover Ahangama",
      "Get travelers to scan QR codes",
      "Get travelers to sign up for the Free Pass",
      "Get travelers to engage with recommendations",
      "Instagram should feel like a curated travel discovery platform for Ahangama",
    ],
  },
  {
    id: "minosha",
    name: "Minosha",
    role: "Partnerships, Discovery & Ecosystem Operations Lead",
    icon: <CompassOutlined />,
    summary:
      "Expand and operationalize the ecosystem around the Free Pass by identifying partnerships, discovering new experiences, and supporting on-the-ground execution.",
    responsibilities: [
      "Discover unique new experiences",
      "Build relationships with venues and creators",
      "Coordinate onboarding",
      "Expand strategic partnerships",
      "Identify collaboration opportunities",
      "Help coordinate merchandise and gifts",
      "Assist with operational logistics",
      "Support hotel and villa relationships",
      "Coordinate collection and redemption systems",
    ],
    focus: [
      "Tea tins",
      "Postcards",
      "Tote bags",
      "Local artist collaborations",
      "Creator partnerships",
      "Boutique experiences",
      "Wellness collaborations",
      "Ask constantly: what would make Ahangama feel more exciting, premium and discoverable for tourists?",
    ],
  },
  {
    id: "veronika",
    name: "Veronika",
    role: "Coordination & Accountability Lead",
    icon: <TeamOutlined />,
    summary:
      "Keep execution aligned and moving by tracking deliverables, following up across the team, and driving launch readiness.",
    responsibilities: [
      "Follow up on all deliverables",
      "Track deadlines",
      "Coordinate communication across the team",
      "Ensure launch readiness",
      "Help manage operational timelines",
      "Keep tasks organized and moving",
    ],
    focus: [
      "Critical to keeping execution aligned and on schedule",
      "Turn strategy into accountable weekly movement",
    ],
  },
];

const contentExamples = [
  "Best Wellness Experiences in Ahangama",
  "Best Coffee Spots in Ahangama",
  "Best Surf Experiences in Ahangama",
  "12 Must Do Things in Ahangama",
  "Where to Work Remotely in Ahangama",
];

const contentRequirements = [
  "Rank on Google",
  "Support discovery",
  "Push travelers into the funnel naturally",
  "Encourage Free Pass signups",
  "Build trust and authority",
];

const mainGoals = [
  "a tourism discovery platform",
  "a communication layer with tourists",
  "a recommendation engine",
  "a premium experience ecosystem",
  "a long-term travel brand",
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

export default function ConceptFreePassPage() {
  const canonical = absUrl("/concept/free-pass");

  return (
    <>
      <Seo
        title="Free Ahangama Pass — Team Strategy Workspace"
        description="Internal strategy workspace for aligning the team around the Free Ahangama Pass as the acquisition engine, tourism discovery layer, communication channel, and funnel into premium products and experiences."
        canonical={canonical}
      />

      <ConceptWorkspaceLayout
        sections={sections}
        status="Acquisition focus"
        lastUpdated="May 2026"
        shortcutActions={shortcutActions}
      >
        <section id="overview" className="concept-heroSection concept-section">
          <Card className="concept-card concept-heroCard concept-strategyHero" bordered={false}>
            <div className="concept-heroGrid">
              <div>
                <Text className="concept-heroEyebrow">Free Ahangama Pass</Text>
                <Title className="concept-heroTitle">
                  This is not a discount card. It is the front door to the ecosystem.
                </Title>
                <Paragraph className="concept-heroCopy">
                  The Free Ahangama Pass should rapidly onboard tourists into the
                  Ahangama ecosystem through a frictionless mobile-first
                  experience and then move them toward recommendations,
                  engagement, and premium products.
                </Paragraph>
                <Space wrap size={[10, 10]}>
                  <Tag className="concept-pill">Acquisition engine</Tag>
                  <Tag className="concept-pill">Discovery layer</Tag>
                  <Tag className="concept-pill">Communication channel</Tag>
                </Space>
              </div>

              <div className="concept-focusPanel concept-strategyPanel">
                <Text className="concept-focusLabel">What the free pass is</Text>
                <Title level={4} className="concept-focusTitle">
                  The funnel matters most
                </Title>
                <div className="concept-focusList">
                  {passRoles.map((item) => (
                    <div key={item} className="concept-focusItem">
                      <CheckCircleOutlined />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </section>

        <SectionCard id="funnel" eyebrow="Execution funnel" title="Everything should support the Free Pass journey">
          <Paragraph className="concept-bodyCopy">
            Every QR scan, Instagram impression, hotel touchpoint, and content
            asset should move travelers through the same funnel: discover,
            sign up, receive the wallet pass, enter WhatsApp onboarding, get
            recommendations, stay engaged, and naturally see premium upsells.
          </Paragraph>

          <Row gutter={[16, 16]}>
            {funnelSteps.map((step) => (
              <Col xs={24} sm={12} md={8} key={step}>
                <div className="concept-strategyChannel">
                  <RocketOutlined />
                  <span>{step}</span>
                </div>
              </Col>
            ))}
          </Row>

          <Divider />

          <List
            dataSource={passOutcomes}
            renderItem={(item) => (
              <List.Item className="concept-strategyInlineItem">
                <MessageOutlined />
                <span>{item}</span>
              </List.Item>
            )}
            className="concept-strategyInlineList"
          />
        </SectionCard>

        {leads.map((lead) => (
          <SectionCard
            key={lead.id}
            id={lead.id}
            eyebrow="Team responsibilities"
            title={`${lead.name} — ${lead.role}`}
          >
            <Paragraph className="concept-bodyCopy">{lead.summary}</Paragraph>
            <Row gutter={[18, 18]}>
              <Col xs={24} md={11}>
                <Card className="concept-card concept-subCard concept-strategySubCard" bordered={false}>
                  <Space align="center" size={10} className="concept-strategySubHeader">
                    {lead.icon}
                    <Text className="concept-sectionEyebrow">Responsibilities</Text>
                  </Space>
                  <List
                    dataSource={lead.responsibilities}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                    className="concept-strategyList"
                  />
                </Card>
              </Col>
              <Col xs={24} md={13}>
                <Card className="concept-card concept-subCard concept-strategySubCard" bordered={false}>
                  <Space align="center" size={10} className="concept-strategySubHeader">
                    <CompassOutlined />
                    <Text className="concept-sectionEyebrow">Focus</Text>
                  </Space>
                  <List
                    dataSource={lead.focus}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                    className="concept-strategyList"
                  />
                </Card>
              </Col>
            </Row>
          </SectionCard>
        ))}

        <SectionCard id="blog-strategy" eyebrow="Entire team" title="Blog & Content Strategy">
          <Paragraph className="concept-bodyCopy">
            The content system should support discovery first and move travelers
            naturally into the Free Pass funnel. That means one blog post per
            venue, one per experience, strong destination content, and a
            visible path into signups, trust, and authority.
          </Paragraph>

          <Row gutter={[18, 18]}>
            <Col xs={24} md={12}>
              <Card className="concept-card concept-subCard concept-strategySubCard" bordered={false}>
                <Space align="center" size={10} className="concept-strategySubHeader">
                  <ReadOutlined />
                  <Text className="concept-sectionEyebrow">Example content</Text>
                </Space>
                <List
                  dataSource={contentExamples}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                  className="concept-strategyList"
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className="concept-card concept-subCard concept-strategySubCard" bordered={false}>
                <Space align="center" size={10} className="concept-strategySubHeader">
                  <GlobalOutlined />
                  <Text className="concept-sectionEyebrow">Content requirements</Text>
                </Space>
                <List
                  dataSource={contentRequirements}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                  className="concept-strategyList"
                />
              </Card>
            </Col>
          </Row>
        </SectionCard>

        <SectionCard id="main-goal" eyebrow="Main goal" title="Discover Ahangama Better">
          <Paragraph className="concept-bodyCopy">
            The free pass should make the brand feel like a tourism discovery
            platform, a communication layer with tourists, a recommendation
            engine, a premium experience ecosystem, and a long-term travel
            brand. Not just a discount pass.
          </Paragraph>

          <Row gutter={[16, 16]}>
            {mainGoals.map((goal) => (
              <Col xs={24} sm={12} md={8} key={goal}>
                <Card className="concept-card concept-subCard concept-strategyGoalCard" bordered={false}>
                  <div className="concept-strategyGoalIcon">
                    <FileTextOutlined />
                  </div>
                  <Paragraph className="concept-bodyCopy" style={{ marginBottom: 0 }}>
                    {goal}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <div className="concept-strategyFooterStat">
                <QrcodeOutlined />
                <div>
                  <Text className="concept-summaryLabel">Acquisition</Text>
                  <strong>QR, Instagram, hotels, frictionless signup</strong>
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="concept-strategyFooterStat">
                <WalletOutlined />
                <div>
                  <Text className="concept-summaryLabel">Product layer</Text>
                  <strong>Wallet pass, guide, onboarding, recommendations</strong>
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="concept-strategyFooterStat">
                <MessageOutlined />
                <div>
                  <Text className="concept-summaryLabel">Long-term brand</Text>
                  <strong>Relationships, trust, communication, premium upsells</strong>
                </div>
              </div>
            </Col>
          </Row>
        </SectionCard>
      </ConceptWorkspaceLayout>
    </>
  );
}