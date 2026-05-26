import React from "react";
import { Card, Col, Divider, List, Row, Space, Tag, Typography } from "antd";
import {
  CheckCircleOutlined,
  CompassOutlined,
  DollarOutlined,
  GiftOutlined,
  RocketOutlined,
  ShoppingOutlined,
  StarOutlined,
  TeamOutlined,
  TrophyOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ConceptWorkspaceLayout from "../components/concept/ConceptWorkspaceLayout";

const { Paragraph, Text, Title } = Typography;

const sections = [
  { id: "overview", label: "Overview", hint: "What the premium pass is" },
  { id: "product", label: "Product", hint: "Core product definition" },
  { id: "bundles", label: "Bundles", hint: "What goes into the pass" },
  { id: "funnel", label: "Funnel", hint: "Free-to-paid conversion path" },
  { id: "operations", label: "Operations", hint: "What must exist to sell it" },
  { id: "pricing", label: "Pricing", hint: "Commercial model" },
  { id: "kpis", label: "KPIs", hint: "Signals to track" },
  { id: "launch-goal", label: "Launch Goal", hint: "What success looks like" },
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
    key: "hotel-distribution",
    label: "Hotels & Airbnb",
    href: "/concept/hotel-distribution",
    isActive: false,
  },
  {
    key: "plastic-stands",
    label: "Plastic Stands",
    href: "/concept/plastic-stands",
    isActive: false,
  },
  {
    key: "premium-pass",
    label: "Premium Pass",
    href: "/concept/premium-pass",
    isActive: true,
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
    isActive: false,
  },
];

const premiumPassPrinciples = [
  "Paid product inspired by Go City",
  "Curated bundled experiences at discounted pricing",
  'Built around the "10 Must Do Things in Ahangama" concept',
  "Designed to convert high-intent users already acquired through the free pass",
];

const bundleExamples = [
  "Surf lesson",
  "Yoga class",
  "Ice bath",
  "Specialty coffee",
  "Cocktail",
  "Tuk tuk rental",
  "Massage",
  "Coworking day pass",
  "Cooking class",
  "Tea tin collectible",
];

const funnelSteps = [
  "Free Ahangama Pass signup",
  "WhatsApp + wallet pass onboarding",
  "Guide and recommendation engagement",
  "Behavior and interest tracking",
  "Premium Pass upsell",
  "Experience redemption and repeat usage",
];

const operationalNeeds = [
  {
    title: "Experience curation",
    icon: <CompassOutlined />,
    points: [
      'Curate the strongest "10 Must Do Things" experiences',
      "Negotiate experience inclusion with partners",
      "Protect quality so the pass feels genuinely curated",
    ],
  },
  {
    title: "Partner readiness",
    icon: <TeamOutlined />,
    points: [
      "Define anchor partners and flagship inclusions",
      "Set venue standards and redemption expectations",
      "Ensure operational onboarding before launch",
    ],
  },
  {
    title: "Storytelling",
    icon: <GiftOutlined />,
    points: [
      "Position the product as a curated Ahangama experience bundle",
      "Use guide and editorial content to show why each inclusion matters",
      "Make the premium tier feel aspirational, not just discounted",
    ],
  },
];

const pricingGuidelines = [
  "Keep pricing legible against the value of bundled experiences",
  "Use discounted access as proof of value, not the full story",
  "Bundle across wellness, surf, food, transport, and lifestyle so the offer feels complete",
  "Treat the premium pass as a flagship tourism product, not a generic coupon pack",
];

const kpis = [
  {
    label: "Premium pass sales",
    value: "First recurring benchmark",
    note: "Initial signal that the paid tourism product has real demand.",
  },
  {
    label: "Premium conversion rate",
    value: "3-5%",
    note: "Upsell effectiveness from the free pass audience.",
  },
  {
    label: "Redemption rate",
    value: "Track weekly",
    note: "Whether buyers are actually using the experiences.",
  },
  {
    label: "Revenue",
    value: "Growing",
    note: "Proof that curated experiences can become a durable product line.",
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

export default function ConceptPremiumPassPage() {
  const canonical = absUrl("/concept/premium-pass");

  return (
    <>
      <Seo
        title="Premium Experience Pass Strategy"
        description="Internal strategy workspace for the Ahangama Premium Experience Pass, including product framing, bundle design, operations, pricing, and KPI targets."
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
            <Text className="concept-sectionEyebrow">
              Premium Experience Pass
            </Text>
            <Title className="concept-heroTitle">
              A curated paid product, not just a discount stack.
            </Title>
            <Paragraph className="concept-bodyCopy concept-heroParagraph">
              The Premium Experience Pass is the monetization layer that sits on
              top of the Free Ahangama Pass. Its role is to convert high-intent
              travelers into buyers of curated Ahangama experiences by packaging
              the best parts of the town into one intentional, bookable product.
            </Paragraph>
          </div>

          <Space wrap>
            <Tag className="concept-pillTag">Paid flagship product</Tag>
            <Tag className="concept-pillTag">Curated bundles</Tag>
            <Tag className="concept-pillTag">Free-to-paid upsell</Tag>
          </Space>
        </section>

        <SectionCard
          id="overview"
          eyebrow="Overview"
          title="What this product is meant to do"
        >
          <Paragraph className="concept-bodyCopy">
            The premium pass should turn Ahangama discovery into a purchaseable,
            high-value experience layer. It is not the acquisition engine. The
            free pass handles audience growth and relationship capture; the
            premium pass is the paid offer that converts that audience into
            experiences, bundles, revenue, and a stronger sense of destination
            curation.
          </Paragraph>

          <Row gutter={[16, 16]}>
            {premiumPassPrinciples.map((item) => (
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
          id="product"
          eyebrow="Product"
          title="The core premium-pass proposition"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={14}>
              <Paragraph className="concept-bodyCopy">
                The product framing already exists in the concept workspace: a
                paid, Go City-inspired bundle of curated Ahangama experiences
                offered at a discounted package price. The job now is to make
                that framing feel coherent, iconic, and operationally real.
              </Paragraph>
              <Paragraph className="concept-bodyCopy">
                This should feel like the best version of Ahangama in one pass,
                combining discovery, convenience, and curation. If it looks like
                a loose stack of venue discounts, the product will underperform.
              </Paragraph>
            </Col>
            <Col xs={24} lg={10}>
              <Card className="concept-strategyGoalCard" bordered={false}>
                <Space direction="vertical" size={10}>
                  <Space align="center">
                    <WalletOutlined className="concept-strategyGoalIcon" />
                    <Text strong>Product role</Text>
                  </Space>
                  <Text className="concept-bodyCopy">
                    The paid tier that monetizes traveler intent after the free
                    pass has already built discovery, trust, and engagement.
                  </Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </SectionCard>

        <SectionCard
          id="bundles"
          eyebrow="Bundles"
          title="What belongs inside the premium pass"
        >
          <Paragraph className="concept-bodyCopy">
            The existing concept page already points to the kinds of inclusions
            that make this product compelling. The bundle should balance iconic
            activities, daily rituals, and lifestyle utilities so travelers feel
            they are buying a better version of the town, not a single-category
            offer.
          </Paragraph>

          <List
            grid={{ gutter: 16, xs: 1, md: 2 }}
            dataSource={bundleExamples}
            renderItem={(item) => (
              <List.Item>
                <Card className="concept-strategySubCard" bordered={false}>
                  <Space align="start">
                    <StarOutlined className="concept-strategyGoalIcon" />
                    <Text className="concept-bodyCopy">{item}</Text>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        </SectionCard>

        <SectionCard
          id="funnel"
          eyebrow="Funnel"
          title="How the premium pass should be sold"
        >
          <Paragraph className="concept-bodyCopy">
            The repository already defines the free pass as the entry point into
            premium products. That makes the premium pass a downstream
            conversion product, not a standalone first-touch campaign. The
            funnel should look like this:
          </Paragraph>

          <Row gutter={[16, 16]}>
            {funnelSteps.map((step, index) => (
              <Col xs={24} md={12} key={step}>
                <Card className="concept-strategySubCard" bordered={false}>
                  <Text className="concept-sectionEyebrow">
                    Step {index + 1}
                  </Text>
                  <Title level={4} className="concept-strategySubHeader">
                    {step}
                  </Title>
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard
          id="operations"
          eyebrow="Operations"
          title="What must exist before this can scale"
        >
          <Row gutter={[16, 16]}>
            {operationalNeeds.map((item) => (
              <Col xs={24} md={8} key={item.title}>
                <Card className="concept-strategyChannel" bordered={false}>
                  <Space align="center">
                    {item.icon}
                    <Title level={4} className="concept-strategySubHeader">
                      {item.title}
                    </Title>
                  </Space>
                  <Divider />
                  <List
                    dataSource={item.points}
                    renderItem={(point) => (
                      <List.Item>
                        <Text className="concept-bodyCopy">{point}</Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard id="pricing" eyebrow="Pricing" title="Commercial model">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={14}>
              <Paragraph className="concept-bodyCopy">
                Pricing should be simple enough to understand quickly and strong
                enough to make the bundle feel valuable against buying the
                experiences one by one. The discount matters, but the real
                commercial advantage is that the product saves decision-making
                time and makes Ahangama feel easier to experience.
              </Paragraph>
            </Col>
            <Col xs={24} lg={10}>
              <Card className="concept-strategySubCard" bordered={false}>
                <Space direction="vertical" size={10}>
                  {pricingGuidelines.map((item) => (
                    <Space align="start" key={item}>
                      <DollarOutlined className="concept-strategyGoalIcon" />
                      <Text className="concept-bodyCopy">{item}</Text>
                    </Space>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>
        </SectionCard>

        <SectionCard
          id="kpis"
          eyebrow="KPIs"
          title="Signals this strategy is working"
        >
          <Row gutter={[16, 16]}>
            {kpis.map((metric) => (
              <Col xs={24} md={12} key={metric.label}>
                <Card className="concept-strategyGoalCard" bordered={false}>
                  <Text className="concept-sectionEyebrow">{metric.label}</Text>
                  <Title level={3} className="concept-strategySubHeader">
                    {metric.value}
                  </Title>
                  <Paragraph className="concept-bodyCopy">
                    {metric.note}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard
          id="launch-goal"
          eyebrow="Launch Goal"
          title="What success must feel like"
        >
          <Paragraph className="concept-bodyCopy">
            The premium pass should launch as the clearest proof that Ahangama
            can be productized as a curated destination experience. It should
            feel iconic, easy to explain, easy to buy, and clearly better than
            assembling the same experience manually.
          </Paragraph>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card className="concept-strategyGoalCard" bordered={false}>
                <RocketOutlined className="concept-strategyGoalIcon" />
                <Title level={4} className="concept-strategySubHeader">
                  Flagship offer
                </Title>
                <Paragraph className="concept-bodyCopy">
                  A product people can immediately understand as the paid
                  centerpiece of the Ahangama platform.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="concept-strategyGoalCard" bordered={false}>
                <ShoppingOutlined className="concept-strategyGoalIcon" />
                <Title level={4} className="concept-strategySubHeader">
                  Real conversions
                </Title>
                <Paragraph className="concept-bodyCopy">
                  Enough buyer demand and redemption activity to prove the
                  upsell model works beyond concept-stage planning.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="concept-strategyGoalCard" bordered={false}>
                <TrophyOutlined className="concept-strategyGoalIcon" />
                <Title level={4} className="concept-strategySubHeader">
                  Destination signal
                </Title>
                <Paragraph className="concept-bodyCopy">
                  A stronger claim that Ahangama is not only a place to
                  discover, but a place that can package and sell its best
                  experiences intentionally.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </SectionCard>
      </ConceptWorkspaceLayout>
    </>
  );
}
