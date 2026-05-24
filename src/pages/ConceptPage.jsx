import React from "react";
import { Card, Col, Progress, Row, Space, Tag, Typography } from "antd";
import {
  AimOutlined,
  ApartmentOutlined,
  DeploymentUnitOutlined,
  EnvironmentOutlined,
  FlagOutlined,
  FundOutlined,
  NodeIndexOutlined,
  PictureOutlined,
  RocketOutlined,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ConceptWorkspaceLayout from "../components/concept/ConceptWorkspaceLayout";

const { Paragraph, Text, Title } = Typography;

const sections = [
  { id: "overview", label: "Overview", hint: "Project snapshot" },
  { id: "why", label: "Why This Exists", hint: "Problem and opportunity" },
  { id: "products", label: "Products", hint: "Free vs Premium" },
  { id: "objectives", label: "Objectives", hint: "What success looks like" },
  { id: "workstreams", label: "Workstreams", hint: "Current priorities" },
  { id: "milestones", label: "Milestones", hint: "Shipped / In Progress / Next" },
  { id: "distribution", label: "Distribution", hint: "Growth channels" },
  { id: "guide", label: "Guide 26/27", hint: "Editorial direction" },
  { id: "touchpoints", label: "Physical Touchpoints", hint: "QR stands and physical branding" },
  { id: "owners", label: "Owners", hint: "Who is accountable" },
  { id: "kpis", label: "KPIs", hint: "Metrics and reporting" },
  { id: "questions", label: "Open Questions", hint: "Decisions still needed" },
];

const objectiveCards = [
  {
    label: "Partner Venues",
    value: "100+",
    note: "A network large enough to make the pass feel everywhere.",
  },
  {
    label: "Free Pass Users",
    value: "5,000+",
    note: "Audience scale for distribution, retention, and upsell.",
  },
  {
    label: "Premium Pass Sales",
    value: "200/mo",
    note: "The first recurring benchmark for premium product demand.",
  },
  {
    label: "First Redemption Time",
    value: "<48h",
    note: "The product should prove value almost immediately after purchase.",
  },
  {
    label: "QR Scans",
    value: "Up only",
    note: "Physical and digital touchpoints should show weekly acquisition growth.",
  },
  {
    label: "Goal",
    value: "Iconic",
    note: "Become the most recognizable tourism product in Ahangama.",
  },
];

const productCards = [
  {
    title: "Free Ahangama Pass",
    subtitle: "Perks & privileges across Ahangama",
    bullets: [
      "Free digital pass",
      "Unlocks benefits at venues",
      "Used for customer acquisition",
      "Captures WhatsApp and email",
      "Distributed through QR codes and hotels",
      "Builds audience and retargeting capability",
    ],
    metrics: ["Signups", "QR scans", "WhatsApp opt-ins", "Venue engagement"],
  },
  {
    title: "Premium Experience Pass",
    subtitle: "Curated bundled experiences",
    bullets: [
      "Paid product inspired by Go City",
      "Bundle of experiences at discounted pricing",
      'Focused on "10 Must Do Things in Ahangama"',
      "Includes wellness, surf, food, transport, and lifestyle experiences",
    ],
    examples: [
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
    ],
    metrics: ["Pass sales", "Redemption rate", "Revenue", "Experience usage"],
  },
];

const workstreams = [
  {
    title: "Venue & Partner Network",
    status: "In Progress",
    needs: [
      "Increase venue count",
      "Improve onboarding",
      "Build anchor partnerships",
      "Define venue standards",
    ],
  },
  {
    title: "Experience Curation",
    status: "In Progress",
    needs: [
      'Curate "10 Must Do Things"',
      "Negotiate experiences",
      "Create premium bundles",
      "Improve storytelling",
    ],
  },
  {
    title: "Ahangama Guide 2026/27",
    status: "Next",
    needs: [
      "Build digital guide",
      "Editorial recommendations",
      "Maps",
      "Local insights",
      "Downloadable guidebook",
    ],
  },
  {
    title: "Distribution & Partnerships",
    status: "Next",
    needs: [
      "Hotels",
      "Villas",
      "OTAs",
      "Tourist board",
      "Travel agents",
      "Influencers",
      "Google Ads",
    ],
  },
  {
    title: "Physical Touchpoints",
    status: "Planning",
    needs: [
      "QR stands",
      "Posters",
      "Plastic displays",
      "Counter cards",
      "Maps",
      "Postcards",
    ],
  },
  {
    title: "Analytics & Operations",
    status: "In Progress",
    needs: [
      "Funnel tracking",
      "Redemption analytics",
      "QR attribution",
      "Revenue tracking",
      "Partner reporting",
    ],
  },
];

const milestones = [
  {
    phase: "Shipped",
    items: [
      "Stripe checkout",
      "Wallet pass",
      "QR landing pages",
      "Initial partner onboarding",
      "Venue tracking",
    ],
  },
  {
    phase: "In Progress",
    items: [
      "Free pass rollout",
      "Experience negotiations",
      "QR stand deployment",
      "Guide planning",
      "Distribution partnerships",
    ],
  },
  {
    phase: "Next",
    items: [
      "100+ venue rollout",
      "OTA partnerships",
      "Paid acquisition",
      "Ahangama Guide launch",
      "Reseller network",
    ],
  },
];

const distributionChannels = [
  "Hotels",
  "Villas",
  "Hostels",
  "Surf Camps",
  "Travel Agents",
  "Tour Operators",
  "OTAs",
  "Google Ads",
  "Instagram",
  "WhatsApp",
  "QR Stands",
  "Tourist Board",
];

const acquisitionFlow = [
  "QR Scan",
  "Free Pass Signup",
  "WhatsApp Capture",
  "Local Discovery",
  "Premium Pass Upsell",
];

const guidePillars = [
  "Cafes",
  "Surf",
  "Wellness",
  "Sunset spots",
  "Remote work",
  "Nature",
  "Culture",
  "Hidden gems",
  "Day itineraries",
  "Local recommendations",
];

const guideOutputs = [
  "Digital Guide",
  "Printed Guide",
  "Instagram Editorial",
  "PDF Download",
  "Interactive Map",
];

const touchpoints = [
  "QR code plastic stands",
  "Cafe counter displays",
  "Posters",
  "Table cards",
  "Tote bags",
  "Postcards",
  "Stickers",
  "Hotel room cards",
];

const owners = [
  {
    stream: "Product",
    owner: "Product",
    responsibility: "Owns UX, checkout, wallet pass, redemption",
  },
  {
    stream: "Partnerships",
    owner: "Partnerships",
    responsibility: "Owns venues, onboarding, commercial agreements",
  },
  {
    stream: "Growth",
    owner: "Growth",
    responsibility: "Owns QR acquisition, ads, WhatsApp funnel",
  },
  {
    stream: "Content & Guide",
    owner: "Content & Guide",
    responsibility: "Owns editorial, storytelling, photography",
  },
  {
    stream: "Operations & analytics",
    owner: "Operations & Analytics",
    responsibility: "Owns reporting, KPIs, support systems",
  },
];

const dashboardKpis = [
  { label: "Weekly QR scans", value: "1,240", progress: 72 },
  { label: "Free pass conversions", value: "18%", progress: 58 },
  { label: "Premium pass conversions", value: "3.6%", progress: 41 },
  { label: "Active venues", value: "34", progress: 34 },
  { label: "Top performing venues", value: "Kaffi / Pura / Living", progress: 80 },
  { label: "WhatsApp subscribers", value: "2,180", progress: 64 },
  { label: "Revenue", value: "$4.8k", progress: 52 },
  { label: "Redemption volume", value: "312", progress: 49 },
];

const openQuestions = [
  "What are the flagship experiences?",
  "What pricing model works best?",
  "Which venues are anchor partners?",
  "How should the guide be monetized?",
  "How do we maintain curation quality while scaling?",
  "What makes the pass iconic?",
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

export default function ConceptPage() {
  const canonical = absUrl("/concept");

  return (
    <>
      <Seo
        title="Ahangama Pass Concept Workspace"
        description="Internal concept workspace for the Ahangama Pass project, including product framing, objectives, workstreams, milestones, and owners."
        canonical={canonical}
      />

      <ConceptWorkspaceLayout
        sections={sections}
        status="Active planning"
        lastUpdated="May 2026"
      >
        <section id="overview" className="concept-heroSection concept-section">
          <Card className="concept-card concept-heroCard" bordered={false}>
            <div className="concept-heroGrid">
              <div>
                <Text className="concept-heroEyebrow">Ahangama Pass</Text>
                <Title className="concept-heroTitle">
                  A focused workspace for aligning the product, the team, and the next milestones.
                </Title>
                <Paragraph className="concept-heroCopy">
                  This workspace acts as the shared operating layer for Ahangama Pass — aligning product, partnerships, growth, distribution, and execution.
                </Paragraph>
                <Space wrap size={[10, 10]}>
                  <Tag className="concept-pill">Internal only</Tag>
                  <Tag className="concept-pill">Single source of truth</Tag>
                  <Tag className="concept-pill">Weekly decision surface</Tag>
                </Space>
              </div>

              <div className="concept-focusPanel">
                <Text className="concept-focusLabel">Current focus</Text>
                <Title level={4} className="concept-focusTitle">
                  Strategic focus
                </Title>
                <div className="concept-focusList">
                  <div className="concept-focusItem">
                    <RocketOutlined />
                    <span>Clarify Free vs Premium positioning</span>
                  </div>
                  <div className="concept-focusItem">
                    <AimOutlined />
                    <span>Increase partner venue count</span>
                  </div>
                  <div className="concept-focusItem">
                    <FundOutlined />
                    <span>Curate flagship experiences</span>
                  </div>
                  <div className="concept-focusItem">
                    <TrophyOutlined />
                    <span>Build Ahangama Guide 2026/27</span>
                  </div>
                  <div className="concept-focusItem">
                    <DeploymentUnitOutlined />
                    <span>Expand distribution channels</span>
                  </div>
                  <div className="concept-focusItem">
                    <NodeIndexOutlined />
                    <span>Roll out QR touchpoints across Ahangama</span>
                  </div>
                </div>
              </div>
            </div>

            <Row gutter={[16, 16]} className="concept-summaryRow">
              <Col xs={24} md={8}>
                <div className="concept-summaryStat">
                  <Text className="concept-summaryLabel">Project phase</Text>
                  <strong>Build and align</strong>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="concept-summaryStat">
                  <Text className="concept-summaryLabel">Primary job</Text>
                  <strong>Turn the pass into a scalable tourism product</strong>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="concept-summaryStat">
                  <Text className="concept-summaryLabel">Decision rhythm</Text>
                  <strong>Used in weekly planning and team alignment</strong>
                </div>
              </Col>
            </Row>
          </Card>
        </section>

        <SectionCard id="why" eyebrow="Why this exists" title="Why the project matters">
          <Paragraph className="concept-bodyCopy">
            The Ahangama Pass should become more than a discount product. It should act as the tourism operating layer for Ahangama — helping visitors discover trusted places, helping venues acquire customers, and helping the destination feel connected.
          </Paragraph>
          <Paragraph className="concept-bodyCopy" style={{ marginBottom: 0 }}>
            The opportunity is to create a product that combines discovery, experiences, commerce, storytelling, and distribution into one recognizable ecosystem.
          </Paragraph>
        </SectionCard>

        <SectionCard id="products" eyebrow="Products" title="Free vs Premium">
          <Row gutter={[20, 20]}>
            {productCards.map((product) => (
              <Col xs={24} lg={12} key={product.title}>
                <Card className="concept-card concept-productCard" bordered={false}>
                  <Text className="concept-sectionEyebrow">{product.subtitle}</Text>
                  <Title level={3} className="concept-productTitle">
                    {product.title}
                  </Title>
                  <ul className="concept-list concept-listSpacious">
                    {product.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  {product.examples ? (
                    <>
                      <Text className="concept-miniLabel">Example experiences</Text>
                      <div className="concept-chipGrid">
                        {product.examples.map((example) => (
                          <span className="concept-chip" key={example}>
                            {example}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : null}
                  <Text className="concept-miniLabel">Key metrics</Text>
                  <div className="concept-chipGrid">
                    {product.metrics.map((metric) => (
                      <span className="concept-chip concept-chipStrong" key={metric}>
                        {metric}
                      </span>
                    ))}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard id="objectives" eyebrow="Objectives" title="What success looks like">
          <Row gutter={[20, 20]}>
            {objectiveCards.map((kpi) => (
              <Col xs={24} md={12} xl={8} key={kpi.label}>
                <Card className="concept-card concept-kpiCard" bordered={false}>
                  <Text className="concept-kpiLabel">{kpi.label}</Text>
                  <div className="concept-kpiValue">{kpi.value}</div>
                  <Paragraph className="concept-kpiNote">{kpi.note}</Paragraph>
                  <Progress percent={kpi.value === "Iconic" ? 82 : 64} showInfo={false} strokeColor="#345c53" />
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard id="workstreams" eyebrow="Current priorities" title="Workstreams">
          <Row gutter={[20, 20]}>
            {workstreams.map((stream) => (
              <Col xs={24} lg={12} xl={8} key={stream.title}>
                <Card className="concept-card concept-workstreamCard" bordered={false}>
                  <div className="concept-workstreamHeader">
                    <Title level={4}>{stream.title}</Title>
                    <Tag className="concept-statusPill">{stream.status}</Tag>
                  </div>
                  <ul className="concept-list">
                    {stream.needs.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard id="distribution" eyebrow="Distribution" title="Growth channels">
          <Row gutter={[20, 20]}>
            <Col xs={24} xl={15}>
              <Card className="concept-card concept-subCard" bordered={false}>
                <div className="concept-distributionGrid">
                  {distributionChannels.map((channel) => (
                    <div className="concept-channelCard" key={channel}>
                      {channel}
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
            <Col xs={24} xl={9}>
              <Card className="concept-card concept-subCard" bordered={false}>
                <Text className="concept-miniLabel">Customer acquisition flow</Text>
                <div className="concept-flowSteps">
                  {acquisitionFlow.map((step, index) => (
                    <React.Fragment key={step}>
                      <div className="concept-flowStep">{step}</div>
                      {index < acquisitionFlow.length - 1 ? (
                        <div className="concept-flowArrow">→</div>
                      ) : null}
                    </React.Fragment>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </SectionCard>

        <SectionCard id="guide" eyebrow="Guide 26/27" title="Ahangama Guide 2026/27">
          <Row gutter={[20, 20]}>
            <Col xs={24} xl={15}>
              <Card className="concept-card concept-subCard" bordered={false}>
                <Text className="concept-guideSubhead">The definitive guide to Ahangama.</Text>
                <div className="concept-chipGrid">
                  {guidePillars.map((pillar) => (
                    <span className="concept-chip" key={pillar}>
                      {pillar}
                    </span>
                  ))}
                </div>
              </Card>
            </Col>
            <Col xs={24} xl={9}>
              <Card className="concept-card concept-guideOutputCard" bordered={false}>
                <div className="concept-guideOutputHeader">
                  <PictureOutlined />
                  <Title level={4}>Editorial outputs</Title>
                </div>
                <div className="concept-outputList">
                  {guideOutputs.map((output) => (
                    <div className="concept-outputItem" key={output}>
                      {output}
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </SectionCard>

        <SectionCard id="touchpoints" eyebrow="Physical touchpoints" title="QR stands and physical branding">
          <Row gutter={[16, 16]}>
            {touchpoints.map((item) => (
              <Col xs={12} md={8} xl={6} key={item}>
                <Card className="concept-card concept-touchpointCard" bordered={false}>
                  <div className="concept-touchpointMock">
                    <EnvironmentOutlined />
                  </div>
                  <Text className="concept-touchpointLabel">{item}</Text>
                </Card>
              </Col>
            ))}
          </Row>
          <Paragraph className="concept-bodyCopy concept-sectionNote">
            The physical layer is critical. Visitors should constantly encounter the Ahangama Pass throughout the town.
          </Paragraph>
        </SectionCard>

        <SectionCard id="milestones" eyebrow="Milestones" title="Progress and next steps">
          <Row gutter={[20, 20]}>
            {milestones.map((milestone) => (
              <Col xs={24} md={8} key={milestone.phase}>
                <Card className="concept-card concept-milestoneCard" bordered={false}>
                  <div className="concept-milestoneHeader">
                    <FlagOutlined />
                    <Title level={4}>{milestone.phase}</Title>
                  </div>
                  <ul className="concept-list">
                    {milestone.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard id="owners" eyebrow="Accountability" title="Owners and responsibilities">
          <Row gutter={[20, 20]}>
            {owners.map((entry) => (
              <Col xs={24} md={12} key={entry.stream}>
                <Card className="concept-card concept-ownerCard" bordered={false}>
                  <div className="concept-ownerHeader">
                    <TeamOutlined />
                    <div>
                      <Title level={4}>{entry.stream}</Title>
                      <Text className="concept-ownerName">{entry.owner}</Text>
                    </div>
                  </div>
                  <Paragraph className="concept-bodyCopy">
                    {entry.responsibility}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard id="kpis" eyebrow="KPIs" title="Metrics and reporting">
          <Row gutter={[16, 16]}>
            {dashboardKpis.map((metric) => (
              <Col xs={24} md={12} xl={6} key={metric.label}>
                <Card className="concept-card concept-dashboardCard" bordered={false}>
                  <Text className="concept-kpiLabel">{metric.label}</Text>
                  <div className="concept-dashboardValue">{metric.value}</div>
                  <Progress percent={metric.progress} showInfo={false} strokeColor="#2e5c53" />
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard id="questions" eyebrow="Open questions" title="Decisions still needed">
          <Card className="concept-card concept-subCard" bordered={false}>
            <ul className="concept-list concept-listSpacious">
              {openQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </Card>
        </SectionCard>
      </ConceptWorkspaceLayout>
    </>
  );
}