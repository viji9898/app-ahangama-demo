import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Modal,
  Progress,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
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
  {
    id: "milestones",
    label: "Milestones",
    hint: "Shipped / In Progress / Next",
  },
  { id: "distribution", label: "Distribution", hint: "Growth channels" },
  { id: "guide", label: "Guide 26/27", hint: "Editorial direction" },
  {
    id: "touchpoints",
    label: "Physical Touchpoints",
    hint: "QR stands and physical branding",
  },
  {
    id: "team",
    label: "Team & Responsibilities",
    hint: "Who owns what day to day",
  },
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

const teamMembers = [
  {
    name: "Viji",
    role: "Founder / Strategy",
    category: "Strategy",
    focusArea: "Vision, monetization, and flagship product direction",
    summary:
      "Vision, product direction, monetization, partnerships, and overall strategy.",
    overview:
      "Shapes the long-term direction of Ahangama Pass, defines what the product should become, and aligns revenue, product, partnerships, and destination strategy.",
    responsibilities: [
      "Set strategic direction for Free vs Premium products",
      "Define monetization model and flagship experiences",
      "Lead senior partnerships and destination positioning",
      "Decide what gets prioritized across product and growth",
    ],
    weeklyPriorities: [
      "Review workstream progress and unblock key decisions",
      "Advance high-leverage partnerships",
      "Refine the pass narrative and positioning",
    ],
    kpis: [
      "Partner venue growth",
      "Premium pass sales trajectory",
      "Revenue growth",
      "Strategic milestone completion",
    ],
    dependencies: ["Veronika", "Vishmi", "Minosha"],
    next30Days:
      "Lock product positioning, define flagship experiences, and align the next launch milestones across partnerships, distribution, and growth.",
  },
  {
    name: "Veronika",
    role: "Operations & Executive Coordination",
    category: "Operations",
    focusArea: "Rhythm, follow-through, and accountability",
    summary:
      "Coordinates follow-ups, timelines, meetings, task tracking, accountability, and functions as PA.",
    overview:
      "Keeps the operating system moving by ensuring decisions become actions, meetings become follow-ups, and workstreams stay coordinated across the team.",
    responsibilities: [
      "Coordinate timelines, meetings, and action lists",
      "Track progress against current workstreams and milestones",
      "Ensure follow-ups happen across the team",
      "Support executive coordination and planning",
    ],
    weeklyPriorities: [
      "Update the operating page and milestone status",
      "Run follow-up loops after team meetings",
      "Escalate blockers that are stalling progress",
    ],
    kpis: [
      "Task completion rate",
      "Milestone update consistency",
      "Meeting-to-action follow-through",
      "Blocker resolution speed",
    ],
    dependencies: ["Viji", "Vishmi", "Courtney"],
    next30Days:
      "Create a tighter weekly operating cadence with cleaner accountability on milestones, owners, and overdue actions.",
  },
  {
    name: "Vishmi",
    role: "Partnerships & Distribution Lead",
    category: "Partnerships",
    focusArea: "Venue growth, onboarding, and physical distribution",
    summary:
      "Signs up partners, manages partner relationships, handles venue onboarding, QR stand distribution, and postcard sales.",
    overview:
      "Owns the commercial and relationship layer that gets Ahangama Pass into more venues, touchpoints, and local distribution channels.",
    responsibilities: [
      "Acquire and onboard partner venues",
      "Manage venue relationships and quality standards",
      "Coordinate QR stand distribution and postcard sales",
      "Grow distribution across hospitality and in-town touchpoints",
    ],
    weeklyPriorities: [
      "Sign and onboard new venues",
      "Check venue activation and QR stand placement",
      "Identify anchor partners in priority categories",
    ],
    kpis: [
      "New partner signups",
      "Active venue count",
      "Venue activation rate",
      "Physical distribution footprint",
    ],
    dependencies: ["Viji", "Minosha", "Ishaq"],
    next30Days:
      "Increase partner venue count, deploy more QR stands, and tighten partner onboarding so every signed venue becomes an active pass touchpoint.",
  },
  {
    name: "Minosha",
    role: "Merchandise & Brand Operations",
    category: "Merchandise",
    focusArea: "Physical products, suppliers, and branded rollouts",
    summary:
      "Manages tea tins, merchandise, creative work for postcards, promotions, supplier coordination, and product launches.",
    overview:
      "Owns the merchandise and branded-product layer that makes Ahangama Pass tangible through collectables, physical collateral, and launch execution.",
    responsibilities: [
      "Manage tea tins and merchandise development",
      "Coordinate postcard and promo product production",
      "Work with suppliers on timelines and quality",
      "Support physical product launches and branded assets",
    ],
    weeklyPriorities: [
      "Track supplier timelines and stock readiness",
      "Coordinate postcard and merchandise creative execution",
      "Prepare launch-ready physical assets",
    ],
    kpis: [
      "Merchandise readiness",
      "Supplier delivery reliability",
      "Launch asset completion",
      "Postcard / merchandise sales",
    ],
    dependencies: ["Viji", "Vishmi", "Ishaq"],
    next30Days:
      "Stabilize merchandise operations, support postcard-led distribution, and prepare branded physical products that strengthen the pass identity.",
  },
  {
    name: "Ishaq",
    role: "Digital Design & Campaign Graphics",
    category: "Creative",
    focusArea: "Campaign visuals and in-market creative consistency",
    summary:
      "Creates Instagram graphics, digital campaign assets, promotional visuals, QR stand graphics, and social templates.",
    overview:
      "Owns the visual communication layer for Ahangama Pass across digital growth, QR distribution, partner collateral, and social campaign assets.",
    responsibilities: [
      "Create campaign visuals for paid and organic channels",
      "Design QR stand and promo display graphics",
      "Build reusable social and campaign templates",
      "Keep the brand visually consistent across touchpoints",
    ],
    weeklyPriorities: [
      "Produce campaign assets for growth pushes",
      "Support physical touchpoint design rollout",
      "Refresh reusable social templates",
    ],
    kpis: [
      "Creative delivery velocity",
      "Campaign asset readiness",
      "Brand consistency across touchpoints",
      "Support responsiveness to growth needs",
    ],
    dependencies: ["Vishmi", "Minosha", "Courtney"],
    next30Days:
      "Strengthen the visual system for QR stands, social campaigns, and pass promotions so the brand feels more consistent and recognizable.",
  },
  {
    name: "Faizan",
    role: "Creative Director & Design Lead",
    category: "Creative Leadership",
    focusArea: "Creative direction, visual systems, campaign design",
    summary:
      "Leads the visual identity of Ahangama Pass including QR stands, postcards, promotional graphics, campaigns and brand design systems.",
    overview:
      "Owns the higher-level creative direction for Ahangama Pass, ensuring the brand system, campaign language, and in-market visuals feel consistent, deliberate, and recognizable.",
    responsibilities: [
      "Lead the overall visual identity and creative direction of Ahangama Pass",
      "Define brand systems for QR stands, postcards, campaigns, and promo materials",
      "Guide campaign design quality across digital and physical touchpoints",
      "Align creative execution across design contributors and rollout needs",
    ],
    weeklyPriorities: [
      "Review and direct campaign visuals and brand outputs",
      "Refine reusable design systems for recurring pass materials",
      "Support high-priority launches with senior creative input",
    ],
    kpis: [
      "Brand consistency across touchpoints",
      "Campaign creative readiness",
      "Creative approval speed",
      "Quality of design-system adoption",
    ],
    dependencies: ["Viji", "Ishaq", "Minosha"],
    next30Days:
      "Tighten the Ahangama Pass visual system so campaigns, QR stands, and printed materials all feel part of one stronger and more recognizable brand language.",
  },
  {
    name: "Courtney",
    role: "Social Media Manager",
    category: "Social",
    focusArea: "Publishing rhythm, engagement, and campaign coordination",
    summary:
      "Manages social media publishing, scheduling, community engagement, content planning, and campaign coordination.",
    overview:
      "Owns the publishing and audience engagement layer that turns strategy, creative, and offers into a consistent social presence and campaign output.",
    responsibilities: [
      "Manage publishing calendar and scheduling",
      "Coordinate campaign rollouts across channels",
      "Handle community engagement and response loops",
      "Translate team priorities into social content plans",
    ],
    weeklyPriorities: [
      "Schedule and publish planned content",
      "Coordinate campaign timing with design and partnerships",
      "Track engagement trends and community signals",
    ],
    kpis: [
      "Posting consistency",
      "Engagement rate",
      "Campaign execution quality",
      "Audience growth and response rate",
    ],
    dependencies: ["Ishaq", "Viji", "Veronika"],
    next30Days:
      "Create a more intentional publishing rhythm that supports Free Pass acquisition, premium storytelling, and the Guide 26/27 editorial rollout.",
  },
  {
    name: "Bharshi",
    role: "Accounts Management",
    category: "Finance",
    focusArea: "Accounts, reporting, financial administration",
    summary:
      "Handles company accounts, bookkeeping, financial tracking, payment coordination and operational finance management.",
    overview:
      "Owns day-to-day financial administration so company records, payments, and tracking stay accurate, current, and usable for operational decision-making.",
    responsibilities: [
      "Manage bookkeeping and company account records",
      "Track payments, expenses, and financial admin workflows",
      "Coordinate operational finance requirements across the business",
      "Support recurring financial reporting and reconciliation",
    ],
    weeklyPriorities: [
      "Keep bookkeeping and payment records up to date",
      "Track outstanding financial actions and reconciliations",
      "Prepare current reporting inputs for leadership review",
    ],
    kpis: [
      "Accuracy of financial records",
      "Reporting timeliness",
      "Payment coordination reliability",
      "Reconciliation completion rate",
    ],
    dependencies: ["Viji", "Veronika", "Vijayanthi"],
    next30Days:
      "Stabilize reporting and payment coordination so the business has cleaner visibility into operational finance and current account status.",
  },
  {
    name: "Vijayanthi",
    role: "Financial Systems Contractor",
    category: "Finance",
    focusArea: "Financial systems, process setup, accounting operations",
    summary:
      "Supports financial operations and setup of accounting systems, workflows, financial structures and reporting processes.",
    overview:
      "Supports the financial infrastructure behind Ahangama Pass by setting up systems, workflows, and reporting structures that make finance operations more scalable and reliable.",
    responsibilities: [
      "Set up accounting systems and operational finance workflows",
      "Define reporting structures and process standards",
      "Support financial operations with systems-level improvements",
      "Help formalize finance workflows for scale and consistency",
    ],
    weeklyPriorities: [
      "Improve accounting workflows and reporting structure",
      "Review systems gaps affecting finance operations",
      "Coordinate setup changes with accounts management needs",
    ],
    kpis: [
      "Finance workflow completion",
      "Reporting process reliability",
      "System setup progress",
      "Operational finance efficiency",
    ],
    dependencies: ["Bharshi", "Viji", "Veronika"],
    next30Days:
      "Put stronger accounting systems and reporting workflows in place so finance operations are easier to manage, review, and scale.",
  },
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
  {
    label: "Top performing venues",
    value: "Kaffi / Pura / Living",
    progress: 80,
  },
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
  const [selectedMember, setSelectedMember] = useState(null);

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
                  A focused workspace for aligning the product, the team, and
                  the next milestones.
                </Title>
                <Paragraph className="concept-heroCopy">
                  This workspace acts as the shared operating layer for Ahangama
                  Pass — aligning product, partnerships, growth, distribution,
                  and execution.
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

        <SectionCard
          id="why"
          eyebrow="Why this exists"
          title="Why the project matters"
        >
          <Paragraph className="concept-bodyCopy">
            The Ahangama Pass should become more than a discount product. It
            should act as the tourism operating layer for Ahangama — helping
            visitors discover trusted places, helping venues acquire customers,
            and helping the destination feel connected.
          </Paragraph>
          <Paragraph className="concept-bodyCopy" style={{ marginBottom: 0 }}>
            The opportunity is to create a product that combines discovery,
            experiences, commerce, storytelling, and distribution into one
            recognizable ecosystem.
          </Paragraph>
        </SectionCard>

        <SectionCard id="products" eyebrow="Products" title="Free vs Premium">
          <Row gutter={[20, 20]}>
            {productCards.map((product) => (
              <Col xs={24} lg={12} key={product.title}>
                <Card
                  className="concept-card concept-productCard"
                  bordered={false}
                >
                  <Text className="concept-sectionEyebrow">
                    {product.subtitle}
                  </Text>
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
                      <Text className="concept-miniLabel">
                        Example experiences
                      </Text>
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
                      <span
                        className="concept-chip concept-chipStrong"
                        key={metric}
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard
          id="objectives"
          eyebrow="Objectives"
          title="What success looks like"
        >
          <Row gutter={[20, 20]}>
            {objectiveCards.map((kpi) => (
              <Col xs={24} md={12} xl={8} key={kpi.label}>
                <Card className="concept-card concept-kpiCard" bordered={false}>
                  <Text className="concept-kpiLabel">{kpi.label}</Text>
                  <div className="concept-kpiValue">{kpi.value}</div>
                  <Paragraph className="concept-kpiNote">{kpi.note}</Paragraph>
                  <Progress
                    percent={kpi.value === "Iconic" ? 82 : 64}
                    showInfo={false}
                    strokeColor="#345c53"
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard
          id="workstreams"
          eyebrow="Current priorities"
          title="Workstreams"
        >
          <Row gutter={[20, 20]}>
            {workstreams.map((stream) => (
              <Col xs={24} lg={12} xl={8} key={stream.title}>
                <Card
                  className="concept-card concept-workstreamCard"
                  bordered={false}
                >
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

        <SectionCard
          id="distribution"
          eyebrow="Distribution"
          title="Growth channels"
        >
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
                <Text className="concept-miniLabel">
                  Customer acquisition flow
                </Text>
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

        <SectionCard
          id="guide"
          eyebrow="Guide 26/27"
          title="Ahangama Guide 2026/27"
        >
          <Row gutter={[20, 20]}>
            <Col xs={24} xl={15}>
              <Card className="concept-card concept-subCard" bordered={false}>
                <Text className="concept-guideSubhead">
                  The definitive guide to Ahangama.
                </Text>
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
              <Card
                className="concept-card concept-guideOutputCard"
                bordered={false}
              >
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

        <SectionCard
          id="touchpoints"
          eyebrow="Physical touchpoints"
          title="QR stands and physical branding"
        >
          <Row gutter={[16, 16]}>
            {touchpoints.map((item) => (
              <Col xs={12} md={8} xl={6} key={item}>
                <Card
                  className="concept-card concept-touchpointCard"
                  bordered={false}
                >
                  <div className="concept-touchpointMock">
                    <EnvironmentOutlined />
                  </div>
                  <Text className="concept-touchpointLabel">{item}</Text>
                </Card>
              </Col>
            ))}
          </Row>
          <Paragraph className="concept-bodyCopy concept-sectionNote">
            The physical layer is critical. Visitors should constantly encounter
            the Ahangama Pass throughout the town.
          </Paragraph>
        </SectionCard>

        <SectionCard
          id="team"
          eyebrow="Team & responsibilities"
          title="Team & Responsibilities"
        >
          <Paragraph className="concept-bodyCopy">
            Clear ownership across partnerships, operations, creative, social,
            merchandise, and strategy.
          </Paragraph>
          <Paragraph className="concept-bodyCopy" style={{ marginBottom: 24 }}>
            This section helps the team understand who owns what and how each
            role contributes to the Ahangama Pass ecosystem.
          </Paragraph>

          <Row gutter={[20, 20]}>
            {teamMembers.map((member) => (
              <Col xs={24} key={member.name}>
                <Card
                  className="concept-card concept-teamCard"
                  bordered={false}
                >
                  <div className="concept-teamHeader">
                    <div>
                      <Title level={4} className="concept-teamName">
                        {member.name}
                      </Title>
                      <Text className="concept-teamRole">{member.role}</Text>
                    </div>
                    <Tag className="concept-statusPill">{member.category}</Tag>
                  </div>

                  <Paragraph className="concept-bodyCopy concept-teamSummary">
                    {member.summary}
                  </Paragraph>

                  <div className="concept-teamFocusBox">
                    <Text className="concept-miniLabel">Key focus area</Text>
                    <div className="concept-teamFocusText">
                      {member.focusArea}
                    </div>
                  </div>

                  <Button
                    type="default"
                    className="concept-teamButton"
                    onClick={() => setSelectedMember(member)}
                  >
                    View Role Details
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard
          id="milestones"
          eyebrow="Milestones"
          title="Progress and next steps"
        >
          <Row gutter={[20, 20]}>
            {milestones.map((milestone) => (
              <Col xs={24} md={8} key={milestone.phase}>
                <Card
                  className="concept-card concept-milestoneCard"
                  bordered={false}
                >
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

        <SectionCard
          id="owners"
          eyebrow="Accountability"
          title="Owners and responsibilities"
        >
          <Row gutter={[20, 20]}>
            {owners.map((entry) => (
              <Col xs={24} md={12} key={entry.stream}>
                <Card
                  className="concept-card concept-ownerCard"
                  bordered={false}
                >
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
                <Card
                  className="concept-card concept-dashboardCard"
                  bordered={false}
                >
                  <Text className="concept-kpiLabel">{metric.label}</Text>
                  <div className="concept-dashboardValue">{metric.value}</div>
                  <Progress
                    percent={metric.progress}
                    showInfo={false}
                    strokeColor="#2e5c53"
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard
          id="questions"
          eyebrow="Open questions"
          title="Decisions still needed"
        >
          <Card className="concept-card concept-subCard" bordered={false}>
            <ul className="concept-list concept-listSpacious">
              {openQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </Card>
        </SectionCard>

        <Modal
          open={Boolean(selectedMember)}
          onCancel={() => setSelectedMember(null)}
          footer={null}
          width={760}
          centered
          title={null}
          className="concept-teamModal"
        >
          {selectedMember ? (
            <div className="concept-teamModalContent">
              <div className="concept-teamModalHeader">
                <div>
                  <Text className="concept-sectionEyebrow">
                    {selectedMember.category}
                  </Text>
                  <Title level={3} className="concept-teamModalTitle">
                    {selectedMember.name} — {selectedMember.role}
                  </Title>
                </div>
                <Tag className="concept-statusPill">Next 30 days</Tag>
              </div>

              <div className="concept-modalBlock">
                <Text className="concept-miniLabel">Role overview</Text>
                <Paragraph
                  className="concept-bodyCopy"
                  style={{ marginBottom: 0 }}
                >
                  {selectedMember.overview}
                </Paragraph>
              </div>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <div className="concept-modalBlock">
                    <Text className="concept-miniLabel">
                      Key responsibilities
                    </Text>
                    <ul className="concept-list concept-listSpacious">
                      {selectedMember.responsibilities.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className="concept-modalBlock">
                    <Text className="concept-miniLabel">Weekly priorities</Text>
                    <ul className="concept-list concept-listSpacious">
                      {selectedMember.weeklyPriorities.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className="concept-modalBlock">
                    <Text className="concept-miniLabel">
                      KPIs / success metrics
                    </Text>
                    <ul className="concept-list concept-listSpacious">
                      {selectedMember.kpis.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className="concept-modalBlock">
                    <Text className="concept-miniLabel">Dependencies</Text>
                    <div className="concept-chipGrid">
                      {selectedMember.dependencies.map((item) => (
                        <span className="concept-chip" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="concept-modalBlock concept-modalFocusBlock">
                <Text className="concept-miniLabel">
                  Current focus for the next 30 days
                </Text>
                <Paragraph
                  className="concept-bodyCopy"
                  style={{ marginBottom: 0 }}
                >
                  {selectedMember.next30Days}
                </Paragraph>
              </div>
            </div>
          ) : null}
        </Modal>
      </ConceptWorkspaceLayout>
    </>
  );
}
