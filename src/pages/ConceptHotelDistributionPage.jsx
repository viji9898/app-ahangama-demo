import React from "react";
import { Card, Col, Collapse, Image, Row, Space, Table, Tag, Typography } from "antd";
import {
  ApartmentOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  MailOutlined,
  MessageOutlined,
  QrcodeOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  TableOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ConceptWorkspaceLayout from "../components/concept/ConceptWorkspaceLayout";

const { Paragraph, Text, Title } = Typography;

const sections = [
  { id: "overview", label: "Overview", hint: "Why the channel matters" },
  { id: "objective", label: "Objective", hint: "What the pass should feel like" },
  { id: "why-stays", label: "Why Stays", hint: "Why hotels and Airbnbs matter" },
  { id: "benefits", label: "Benefits", hint: "What partners gain" },
  {
    id: "infrastructure",
    label: "Infrastructure",
    hint: "Distribution systems and touchpoints",
  },
  {
    id: "technical-flow",
    label: "Technical Flow",
    hint: "Self-activation and attribution",
  },
  { id: "toolkit", label: "Toolkit", hint: "Partner rollout assets" },
  { id: "airbnb", label: "Airbnb", hint: "Host-led distribution strategy" },
  { id: "messaging", label: "Messaging", hint: "Positioning guardrails" },
  { id: "metrics", label: "Metrics", hint: "Success measurement" },
  { id: "vision", label: "Long-Term Vision", hint: "Infrastructure end state" },
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
    isActive: true,
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
    isActive: false,
  },
];

const propertyTypes = [
  { title: "Boutique Hotels", note: "High-trust stays with concierge-like guest expectations." },
  { title: "Villas", note: "Premium private stays where local guidance elevates perceived value." },
  { title: "Surf Camps", note: "Strong guest cohorts looking for recommendations beyond the wave schedule." },
  { title: "Wellness Retreats", note: "Experience-driven guests already primed for curated discovery." },
  { title: "Airbnbs", note: "Hosts answering repeat questions manually become scalable digital concierges." },
];

const heroKpis = [
  { label: "Hotels Onboarded", value: "24", note: "Live or target partner properties" },
  { label: "Guest Activations", value: "1.3k", note: "Pass activations attributed to stays" },
  { label: "WhatsApp Opt-ins", value: "62%", note: "Guests entering direct communication" },
  { label: "Premium Pass Conversions", value: "11%", note: "Upsell path from hotel-distributed guests" },
];

const strategicLayers = [
  "a complimentary guest experience layer",
  "digital concierge infrastructure",
  "a curated local discovery system",
];

const guestValue = [
  "improve guest experience",
  "increase perceived property value",
  "increase engagement with Ahangama",
  "reduce concierge friction",
  "create memorable stays",
];

const whyRows = [
  {
    key: "commitment",
    reason: "Tourists already committed to Ahangama",
    importance: "High intent",
  },
  {
    key: "communication",
    reason: "Hotels already communicate with guests",
    importance: "Existing distribution",
  },
  {
    key: "trust",
    reason: "Trust already exists",
    importance: "Higher conversion",
  },
  {
    key: "recommendations",
    reason: "Guests actively seek recommendations",
    importance: "Strong onboarding moment",
  },
  {
    key: "pre-arrival",
    reason: "Pre-arrival engagement possible",
    importance: "Early funnel entry",
  },
];

const funnelSteps = [
  "Booking Confirmation",
  "Free Pass Activation",
  "Wallet Install",
  "WhatsApp Onboarding",
  "Recommendations",
  "Premium Upsells",
];

const benefits = [
  {
    title: "Better Guest Experience",
    body: "Guests feel guided and looked after from the moment they receive the link.",
  },
  {
    title: "Increased Property Value",
    body: '"Complimentary Ahangama Pass Included" raises perceived value without adding staff workload.',
  },
  {
    title: "Digital Concierge",
    body: "Reduce repetitive recommendation questions through a structured onboarding flow.",
  },
  {
    title: "More Memorable Stays",
    body: "Guests discover more of Ahangama instead of staying inside a narrow property bubble.",
  },
  {
    title: "Better Reviews",
    body: "Better experiences lead to stronger reviews and more destination-specific praise.",
  },
  {
    title: "Local Positioning",
    body: "The property feels deeply connected to Ahangama rather than generic or transactional.",
  },
  {
    title: "Potential Future Revenue Share",
    body: "A future monetization layer can be added without changing the guest-facing experience model.",
  },
];

const infrastructureItems = [
  {
    key: "emails",
    label: "1. Booking Confirmation Emails",
    extra: "Highest priority",
    icon: <MailOutlined />,
    points: [
      "Already automated in most hotel systems.",
      "Every guest receives it.",
      "Zero operational effort once installed.",
    ],
    mockLabel: "Booking email placeholder",
  },
  {
    key: "whatsapp",
    label: "2. WhatsApp Pre-Arrival Messaging",
    extra: "High-open channel",
    icon: <MessageOutlined />,
    points: [
      "Extremely high open rates.",
      "Conversational and natural for travel planning.",
      "Maps cleanly to real tourist behavior before arrival.",
    ],
    mockLabel: "WhatsApp pre-arrival placeholder",
  },
  {
    key: "reception",
    label: "3. Reception QR Stands",
    extra: "Fallback acquisition",
    icon: <QrcodeOutlined />,
    points: [
      "Physical onboarding infrastructure at the desk.",
      "Captures walk-in attention and late arrivals.",
      "Creates a visible product layer inside the property.",
    ],
    mockLabel: "Reception stand placeholder",
  },
  {
    key: "room-cards",
    label: "4. In-Room Cards & Postcards",
    extra: "Premium dwell-time moment",
    icon: <ApartmentOutlined />,
    points: [
      "Slower discovery moment with high dwell time.",
      "Feels premium and hospitality-native.",
      "Supports guests who ignore confirmation and arrival messages.",
    ],
    mockLabel: "In-room card placeholder",
  },
];

const technicalComparison = [
  {
    key: "scale",
    selfActivation: "Scalable",
    hotelManual: "Operational friction",
  },
  {
    key: "crm",
    selfActivation: "Captures CRM",
    hotelManual: "Weak data capture",
  },
  {
    key: "analytics",
    selfActivation: "Better analytics",
    hotelManual: "Poor attribution",
  },
  {
    key: "onboarding",
    selfActivation: "Better onboarding",
    hotelManual: "Staff dependent",
  },
];

const toolkitItems = [
  "Plug-and-play email templates",
  "WhatsApp templates",
  "QR stand artwork",
  "Reception materials",
  "Hotel onboarding links",
  "Analytics dashboard",
  "Partner support",
];

const airbnbTouchpoints = [
  "Automated Airbnb messages",
  "Fridge QR magnets",
  "Welcome booklet QR",
  "Bedside QR cards",
];

const messagingRows = [
  {
    key: "benefit",
    do: "Complimentary guest benefit",
    dont: "Discount card",
  },
  {
    key: "discovery",
    do: "Curated local experiences",
    dont: "Coupon system",
  },
  {
    key: "positioning",
    do: "Insider access",
    dont: "Advertising platform",
  },
  {
    key: "perks",
    do: "Local perks",
    dont: "Tourist flyer",
  },
  {
    key: "concierge",
    do: "Digital concierge",
    dont: "Generic promotion",
  },
];

const successMetrics = [
  "Hotel Signups",
  "Guest Activation Rate",
  "WhatsApp Opt-ins",
  "Premium Conversion Rate",
  "QR Scan Volume",
  "Hotel Retention",
];

const longTermVision = [
  "default tourism onboarding infrastructure",
  "digital concierge layer",
  "local discovery platform",
  "guest engagement system",
];

const whyColumns = [
  {
    title: "Reason",
    dataIndex: "reason",
    key: "reason",
  },
  {
    title: "Strategic Importance",
    dataIndex: "importance",
    key: "importance",
    render: (value) => <Tag className="concept-pillTag">{value}</Tag>,
  },
];

const technicalColumns = [
  {
    title: "Self Activation",
    dataIndex: "selfActivation",
    key: "selfActivation",
  },
  {
    title: "Hotel Manual Issuing",
    dataIndex: "hotelManual",
    key: "hotelManual",
  },
];

const messagingColumns = [
  {
    title: "DO",
    dataIndex: "do",
    key: "do",
  },
  {
    title: "DON'T",
    dataIndex: "dont",
    key: "dont",
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

export default function ConceptHotelDistributionPage() {
  const canonical = absUrl("/concept/hotel-distribution");

  return (
    <>
      <Seo
        title="Hotel & Airbnb Distribution Strategy — Ahangama Pass"
        description="Internal strategy workspace for turning hotels and Airbnbs into Ahangama Pass distribution partners through guest onboarding, WhatsApp engagement, and curated local discovery."
        canonical={canonical}
      />

      <ConceptWorkspaceLayout
        sections={sections}
        status="Stays distribution strategy"
        lastUpdated="May 2026"
        shortcutActions={shortcutActions}
      >
        <section id="overview" className="concept-heroSection concept-section">
          <Card className="concept-card concept-heroCard concept-strategyHero" bordered={false}>
            <div className="concept-heroGrid">
              <div>
                <Text className="concept-heroEyebrow">Hotel & Airbnb Distribution Strategy</Text>
                <Title className="concept-heroTitle">
                  Transform Hotels & Airbnbs Into Ahangama Pass Distribution Partners
                </Title>
                <Paragraph className="concept-heroCopy">
                  Turn every guest stay into a curated Ahangama experience through
                  complimentary pass onboarding, WhatsApp engagement, and local discovery.
                </Paragraph>
                <Space wrap size={[10, 10]}>
                  <Tag className="concept-pill">Internal strategy document</Tag>
                  <Tag className="concept-pill">Onboarding playbook</Tag>
                  <Tag className="concept-pill">Sales alignment page</Tag>
                  <Tag className="concept-pill">Partner acquisition framework</Tag>
                </Space>
              </div>

              <div className="concept-focusPanel concept-strategyPanel">
                <Text className="concept-focusLabel">Channel thesis</Text>
                <Title level={4} className="concept-focusTitle">
                  Every stay is already a distribution environment.
                </Title>
                <div className="concept-focusList">
                  <div className="concept-focusItem">
                    <SafetyCertificateOutlined />
                    <span>Hotels and hosts already have trust, attention, and timing.</span>
                  </div>
                  <div className="concept-focusItem">
                    <WalletOutlined />
                    <span>Self-activation creates a scalable guest onboarding layer.</span>
                  </div>
                  <div className="concept-focusItem">
                    <RocketOutlined />
                    <span>Ahangama Pass becomes invisible tourism infrastructure rather than promotion.</span>
                  </div>
                </div>
              </div>
            </div>

            <Row gutter={[16, 16]} className="concept-summaryRow">
              {propertyTypes.map((item) => (
                <Col xs={24} sm={12} xl={8} key={item.title}>
                  <Card className="concept-touchpointCard concept-hotelTypeCard" bordered={false}>
                    <div className="concept-plasticMockupFrame concept-hotelTypeMock">
                      <EnvironmentOutlined />
                    </div>
                    <Title level={4} className="concept-strategySubHeader">
                      {item.title}
                    </Title>
                    <Paragraph className="concept-bodyCopy" style={{ marginBottom: 0 }}>
                      {item.note}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>

            <Row gutter={[16, 16]} className="concept-summaryRow">
              {heroKpis.map((kpi) => (
                <Col xs={24} sm={12} xl={6} key={kpi.label}>
                  <Card className="concept-kpiCard concept-hotelKpiCard" bordered={false}>
                    <Text className="concept-kpiLabel">{kpi.label}</Text>
                    <div className="concept-kpiValue">{kpi.value}</div>
                    <Paragraph className="concept-kpiNote" style={{ marginBottom: 0 }}>
                      {kpi.note}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </section>

        <SectionCard
          id="objective"
          eyebrow="Strategic Objective"
          title="The goal is not to sell a discount card. The goal is to improve the stay."
        >
          <div className="concept-editorialColumns concept-hotelColumns">
            <Card className="concept-strategySubCard concept-hotelSectionCard" bordered={false}>
              <Text className="concept-sectionEyebrow">Positioning</Text>
              <Title level={4} className="concept-strategySubHeader">
                Ahangama Pass should behave like hospitality infrastructure.
              </Title>
              <Paragraph className="concept-bodyCopy">
                The goal is not to sell hotels a discount card. The goal is to provide a
                complimentary guest experience layer, digital concierge infrastructure,
                and curated local discovery system that makes every stay feel more guided.
              </Paragraph>
              <div className="concept-chipGrid">
                {strategicLayers.map((item) => (
                  <span className="concept-chip concept-chipStrong" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="concept-strategySubCard concept-hotelSectionCard" bordered={false}>
              <Text className="concept-sectionEyebrow">Guest outcome</Text>
              <Title level={4} className="concept-strategySubHeader">
                The pass reduces friction while increasing destination depth.
              </Title>
              <div className="concept-plasticList">
                {guestValue.map((item) => (
                  <div className="concept-plasticListItem" key={item}>
                    <CheckCircleOutlined />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="concept-plasticQuoteBlock concept-hotelQuoteBlock">
            <Text className="concept-miniLabel">Strategic framing</Text>
            <blockquote className="concept-plasticQuote">
              The Ahangama Pass should feel like a complimentary local experience layer — not an advertisement.
            </blockquote>
          </div>
        </SectionCard>

        <SectionCard
          id="why-stays"
          eyebrow="Why Hotels & Airbnbs Matter"
          title="The best distribution partner already owns the guest relationship"
        >
          <div className="concept-tableShell">
            <Table
              columns={whyColumns}
              dataSource={whyRows}
              pagination={false}
              className="concept-hotelTable"
              rowKey="key"
            />
          </div>

          <div className="concept-hotelWorkflowShell">
            <Text className="concept-miniLabel">Guest activation funnel</Text>
            <div className="concept-flowSteps concept-hotelFlowSteps">
              {funnelSteps.map((step, index) => (
                <React.Fragment key={step}>
                  <div className="concept-flowStep">{step}</div>
                  {index < funnelSteps.length - 1 ? (
                    <span className="concept-flowArrow">↓</span>
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          id="benefits"
          eyebrow="What's In It For Hotels"
          title="Partners are not pushing a product. They are upgrading the guest journey."
        >
          <Row gutter={[16, 16]}>
            {benefits.map((benefit) => (
              <Col xs={24} md={12} xl={8} key={benefit.title}>
                <Card className="concept-strategyGoalCard concept-hotelBenefitCard" bordered={false}>
                  <Text className="concept-sectionEyebrow">Partner benefit</Text>
                  <Title level={4} className="concept-strategySubHeader">
                    {benefit.title}
                  </Title>
                  <Paragraph className="concept-bodyCopy" style={{ marginBottom: 0 }}>
                    {benefit.body}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>

          <Card className="concept-card concept-hotelInsightCard" bordered={false}>
            <blockquote className="concept-keyInsightQuote concept-hotelInsightQuote">
              Hotels are not promoting a product — they are enhancing the guest experience.
            </blockquote>
          </Card>
        </SectionCard>

        <SectionCard
          id="infrastructure"
          eyebrow="Recommended Distribution Infrastructure"
          title="Build the pass into the hospitality operating system"
        >
          <Collapse
            className="concept-hotelCollapse"
            items={infrastructureItems.map((item) => ({
              key: item.key,
              label: (
                <div className="concept-hotelCollapseLabel">
                  <Space align="center">
                    <span className="concept-strategyGoalIcon">{item.icon}</span>
                    <span>{item.label}</span>
                  </Space>
                  <Tag className="concept-pillTag">{item.extra}</Tag>
                </div>
              ),
              children: (
                <div className="concept-editorialColumns concept-hotelColumns">
                  <div>
                    <div className="concept-plasticList">
                      {item.points.map((point) => (
                        <div className="concept-plasticListItem" key={point}>
                          <CheckCircleOutlined />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="concept-hotelMockCard">
                    <div className="concept-plasticMockupFrame concept-hotelMockFrame">
                      {item.icon}
                    </div>
                    <Text className="concept-touchpointLabel">{item.mockLabel}</Text>
                  </div>
                </div>
              ),
            }))}
            defaultActiveKey={["emails", "whatsapp"]}
            bordered={false}
          />

          <div className="concept-hotelTouchpointImageBlock">
            <Text className="concept-miniLabel">Multi-touchpoint hotel rollout</Text>
            <Image
              src="https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/internal/stays/touch_points_hotels.jpg"
              alt="Ahangama Pass hotel touch points showing six guest-facing distribution moments"
              className="concept-hotelTouchpointImage"
              preview
            />
            <Paragraph className="concept-sectionNote concept-bodyCopy">
              This 100% width collage represents the six-touchpoint system across email,
              messaging, reception, in-room, printed, and physical discovery moments.
            </Paragraph>
          </div>
        </SectionCard>

        <SectionCard
          id="technical-flow"
          eyebrow="Recommended Technical Flow"
          title="Hotels should never manually issue passes"
        >
          <div className="concept-editorialColumns concept-hotelColumns">
            <Card className="concept-strategySubCard concept-hotelSectionCard" bordered={false}>
              <Text className="concept-sectionEyebrow">Activation model</Text>
              <Title level={4} className="concept-strategySubHeader">
                Guests self-activate via unique hotel onboarding links.
              </Title>
              <Paragraph className="concept-bodyCopy">
                Hotels should not manually issue passes. Guests should self-activate via unique,
                attributable links so Ahangama Pass captures guest data, WhatsApp opt-in,
                analytics, and property-level attribution with zero hotel operational burden.
              </Paragraph>
              <div className="concept-hotelLinkList">
                <span className="concept-channelCard">pass.ahangama.com/h/the-kip</span>
                <span className="concept-channelCard">pass.ahangama.com/h/ceylon-sliders-villas</span>
              </div>
            </Card>

            <Card className="concept-strategySubCard concept-hotelSectionCard" bordered={false}>
              <Text className="concept-sectionEyebrow">Why it matters</Text>
              <div className="concept-plasticList">
                <div className="concept-plasticListItem">
                  <CheckCircleOutlined />
                  <span>Captures guest data.</span>
                </div>
                <div className="concept-plasticListItem">
                  <CheckCircleOutlined />
                  <span>Captures WhatsApp opt-in.</span>
                </div>
                <div className="concept-plasticListItem">
                  <CheckCircleOutlined />
                  <span>Scales cleanly without staff intervention.</span>
                </div>
                <div className="concept-plasticListItem">
                  <CheckCircleOutlined />
                  <span>Improves analytics and attribution.</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="concept-tableShell">
            <Table
              columns={technicalColumns}
              dataSource={technicalComparison}
              pagination={false}
              className="concept-hotelTable"
              rowKey="key"
            />
          </div>

          <div className="concept-plasticQuoteBlock concept-hotelQuoteBlock">
            <Text className="concept-miniLabel">CRM thesis</Text>
            <blockquote className="concept-plasticQuote">
              The free Ahangama Pass is a customer acquisition and CRM layer.
            </blockquote>
          </div>
        </SectionCard>

        <SectionCard
          id="toolkit"
          eyebrow="Hotel Partner Toolkit"
          title="Adoption rises when implementation effort falls"
        >
          <Row gutter={[16, 16]}>
            {toolkitItems.map((item) => (
              <Col xs={24} sm={12} xl={8} key={item}>
                <Card className="concept-strategySubCard concept-hotelToolkitCard" bordered={false}>
                  <div className="concept-guideOutputHeader">
                    <TableOutlined />
                    <Title level={4} className="concept-strategySubHeader">
                      {item}
                    </Title>
                  </div>
                  <Paragraph className="concept-bodyCopy" style={{ marginBottom: 0 }}>
                    Package this as plug-and-play implementation so every property can launch quickly.
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard
          id="airbnb"
          eyebrow="Airbnb Strategy"
          title="Turn the host recommendation burden into a scalable digital concierge"
        >
          <div className="concept-editorialColumns concept-hotelColumns">
            <Card className="concept-strategySubCard concept-hotelSectionCard" bordered={false}>
              <Text className="concept-sectionEyebrow">Why Airbnb matters</Text>
              <Paragraph className="concept-bodyCopy">
                Airbnb hosts answer the same recommendation questions repeatedly. Ahangama Pass turns
                that repeated manual work into a scalable digital concierge layer that keeps hosts helpful
                while standardizing the guest experience.
              </Paragraph>
            </Card>

            <Card className="concept-strategySubCard concept-hotelSectionCard" bordered={false}>
              <Text className="concept-sectionEyebrow">Touchpoints</Text>
              <div className="concept-chipGrid">
                {airbnbTouchpoints.map((item) => (
                  <span className="concept-chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </SectionCard>

        <SectionCard
          id="messaging"
          eyebrow="Key Messaging Principles"
          title="Keep the partner story anchored in guest value, not promotion"
        >
          <div className="concept-tableShell">
            <Table
              columns={messagingColumns}
              dataSource={messagingRows}
              pagination={false}
              className="concept-hotelTable"
              rowKey="key"
            />
          </div>
        </SectionCard>

        <SectionCard
          id="metrics"
          eyebrow="KPI & Success Metrics"
          title="Track the hotel channel like operating infrastructure"
        >
          <Row gutter={[16, 16]}>
            {successMetrics.map((metric) => (
              <Col xs={24} sm={12} xl={8} key={metric}>
                <Card className="concept-kpiCard concept-hotelKpiCard" bordered={false}>
                  <Text className="concept-kpiLabel">Metric</Text>
                  <Title level={4} className="concept-strategySubHeader">
                    {metric}
                  </Title>
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <section id="vision" className="concept-section">
          <Card className="concept-card concept-cardSection concept-keyInsightCard" bordered={false}>
            <Text className="concept-sectionEyebrow">Long-Term Vision</Text>
            <Paragraph className="concept-bodyCopy concept-hotelVisionLead">
              The long-term goal is for Ahangama Pass to become the default tourism onboarding infrastructure,
              digital concierge layer, local discovery platform, and guest engagement system across stays.
            </Paragraph>
            <div className="concept-chipGrid concept-hotelVisionGrid">
              {longTermVision.map((item) => (
                <span className="concept-chip concept-chipStrong" key={item}>
                  {item}
                </span>
              ))}
            </div>
            <blockquote className="concept-keyInsightQuote">
              The best tourism infrastructure is invisible — it simply enhances the stay.
            </blockquote>
          </Card>
        </section>
      </ConceptWorkspaceLayout>
    </>
  );
}