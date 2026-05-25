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
  ApartmentOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
  InstagramOutlined,
  MailOutlined,
  MessageOutlined,
  ReadOutlined,
  RocketOutlined,
  ScheduleOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ConceptWorkspaceLayout from "../components/concept/ConceptWorkspaceLayout";

const { Paragraph, Text, Title } = Typography;

const sections = [
  { id: "overview", label: "Overview", hint: "Why distribution matters" },
  { id: "objectives", label: "Objectives", hint: "Core distribution goals" },
  { id: "veronika", label: "Veronika", hint: "Distribution coordination and CRM" },
  { id: "vishmi", label: "Vishmi", hint: "Hotels, venues and tourism partners" },
  { id: "ishaq", label: "Ishaq", hint: "Social and influencer distribution" },
  { id: "minosha", label: "Minosha", hint: "Community and collaboration channels" },
  { id: "jessica", label: "Jessica", hint: "Outreach and communication support" },
  { id: "communication", label: "Communication", hint: "Recurring partner systems" },
  { id: "database", label: "Database", hint: "Centralized relationship tracking" },
  { id: "final-goal", label: "Final Goal", hint: "How channels feed the funnel" },
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
    isActive: true,
  },
];

const ecosystemPrinciples = [
  "a scalable tourism acquisition engine",
  "strong partner relationships",
  "direct communication channels with travelers",
  "repeat engagement systems",
  "a centralized tourism distribution network",
];

const distributionNeeds = [
  "channel ownership",
  "relationship management",
  "consistent communication",
  "comprehensive databases",
  "bi-weekly check-ins",
  "WhatsApp newsletters",
  "email newsletters",
  "ongoing engagement",
];

const coreObjectives = [
  "Build and maintain a centralized partner database",
  "Engage all distribution channels consistently",
  "Keep partners updated regularly",
  "Create recurring communication systems",
  "Drive signups into the Free Ahangama Pass funnel",
  "Expand reach across Ahangama tourism touchpoints",
];

const leads = [
  {
    id: "veronika",
    name: "Veronika",
    role: "Distribution Coordination & CRM Lead",
    icon: <ScheduleOutlined />,
    summary:
      "Ensure the full distribution ecosystem stays organized, active, accountable, and regularly communicated with.",
    responsibilities: [
      "Maintain centralized database",
      "Track all partner relationships",
      "Coordinate bi-weekly check-ins",
      "Organize WhatsApp newsletters",
      "Organize email newsletters",
      "Follow up on pending conversations",
      "Ensure channels remain active",
      "Track onboarding progress",
      "Maintain accountability across the team",
    ],
    deliverables: [
      "Master distribution database",
      "Partner tracking system",
      "Follow-up schedules",
      "Bi-weekly update cadence",
      "Internal reporting structure",
    ],
  },
  {
    id: "vishmi",
    name: "Vishmi",
    role: "Hotels, Venues & Tourism Partnerships Lead",
    icon: <ApartmentOutlined />,
    summary:
      "Own high-value tourism distribution relationships and make sure the pass is visible and actively promoted across physical tourism touchpoints.",
    responsibilities: [
      "Hotels",
      "Villas",
      "Cafes",
      "Wellness studios",
      "Surf camps",
      "Attraction partnerships",
      "Concierge relationships",
      "Venue partnerships",
    ],
    deliverables: [
      "Onboard distribution partners",
      "Ensure venues actively promote the pass",
      "Improve visibility across Ahangama",
      "Strengthen 12 Must Do Things partnerships",
      "Maintain venue communication",
      "Gather feedback and upsell opportunities",
    ],
  },
  {
    id: "ishaq",
    name: "Ishaq",
    role: "Social, Influencer & Content Distribution Lead",
    icon: <InstagramOutlined />,
    summary:
      "Build online discovery and reach so social distribution actively drives scans, signups, and aspirational awareness around Ahangama Pass.",
    responsibilities: [
      "Instagram growth",
      "Influencer relationships",
      "Creator partnerships",
      "Reels distribution",
      "Social storytelling",
      "WhatsApp sharing campaigns",
      "Content amplification",
    ],
    deliverables: [
      "Increase Ahangama Pass awareness",
      "Drive QR scans",
      "Drive signups",
      "Build aspirational travel content",
      "Influencer outreach list",
      "Content partnerships",
      "Reel strategy",
      "Distribution campaigns",
      "Social posting calendar",
    ],
  },
  {
    id: "minosha",
    name: "Minosha",
    role: "Community, Experiences & Collaboration Lead",
    icon: <UsergroupAddOutlined />,
    summary:
      "Expand community-based and lifestyle distribution channels that embed Ahangama Pass into local ecosystems and word-of-mouth partnerships.",
    responsibilities: [
      "Coworking spaces",
      "Wellness communities",
      "Boutique brands",
      "Local creators",
      "Artist collaborations",
      "Experience partnerships",
      "Event partnerships",
      "Community partnerships",
    ],
    deliverables: [
      "Embed Ahangama Pass into local lifestyle ecosystems",
      "Create partnerships people naturally talk about",
      "Build emotional connection around the brand",
      "Identify collaboration opportunities",
      "Coordinate events and activations",
      "Support merchandise integrations",
      "Help create unique tourism experiences",
    ],
  },
  {
    id: "jessica",
    name: "Jessica",
    role: "Outreach & Communications Support Lead",
    icon: <MailOutlined />,
    summary:
      "Support the ongoing communication layer and help keep outreach pipelines active, updated, and coordinated.",
    responsibilities: [
      "Assist with newsletters",
      "Coordinate partner communication",
      "Help maintain outreach pipelines",
      "Support database updates",
      "Assist with onboarding communication",
      "Support hotel and tourism outreach",
      "Help coordinate follow-ups",
    ],
    deliverables: [
      "Help keep the ecosystem active and engaged",
      "Reduce communication gaps across channels",
      "Support recurring outreach cadence",
    ],
  },
];

const whatsappNewsletter = [
  "new experiences",
  "new venues",
  "weekly recommendations",
  "events",
  "offers",
  "updates",
];

const emailNewsletter = [
  "tourism updates",
  "guide content",
  "featured experiences",
  "partner highlights",
  "launch updates",
];

const biWeeklyCheckins = [
  "partner engagement",
  "venue feedback",
  "new opportunities",
  "operational issues",
  "promotion coordination",
];

const databaseEntries = [
  "hotels",
  "villas",
  "cafes",
  "wellness studios",
  "surf camps",
  "influencers",
  "creators",
  "travel agents",
  "tourism operators",
  "concierge contacts",
  "OTA opportunities",
  "community partners",
];

const finalLayers = [
  "the tourism acquisition layer",
  "the communication layer",
  "the discovery layer",
  "the commerce layer for Ahangama tourism",
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

export default function ConceptDistributionPage() {
  const canonical = absUrl("/concept/distribution");

  return (
    <>
      <Seo
        title="Distribution & Growth Channels — Team Strategy Workspace"
        description="Internal strategy workspace for Ahangama Pass distribution and growth channels, including partner databases, communication systems, relationship management, and channel ownership feeding into the Free Ahangama Pass funnel."
        canonical={canonical}
      />

      <ConceptWorkspaceLayout
        sections={sections}
        status="Distribution focus"
        lastUpdated="May 2026"
        shortcutActions={shortcutActions}
      >
        <section id="overview" className="concept-heroSection concept-section">
          <Card className="concept-card concept-heroCard concept-strategyHero" bordered={false}>
            <div className="concept-heroGrid">
              <div>
                <Text className="concept-heroEyebrow">Distribution & Growth Channels</Text>
                <Title className="concept-heroTitle">
                  The Free Ahangama Pass only works if distribution systems are strong.
                </Title>
                <Paragraph className="concept-heroCopy">
                  This is not just marketing. The team is building a tourism
                  distribution ecosystem for Ahangama with active channels,
                  relationship management, recurring communication, and a clear
                  path into the Free Ahangama Pass funnel.
                </Paragraph>
                <Space wrap size={[10, 10]}>
                  <Tag className="concept-pill">Distribution ecosystem</Tag>
                  <Tag className="concept-pill">Channel ownership</Tag>
                  <Tag className="concept-pill">Partner communication</Tag>
                </Space>
              </div>

              <div className="concept-focusPanel concept-strategyPanel">
                <Text className="concept-focusLabel">What we are creating</Text>
                <Title level={4} className="concept-focusTitle">
                  A centralized tourism distribution network
                </Title>
                <div className="concept-focusList">
                  {ecosystemPrinciples.map((item) => (
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

        <SectionCard id="objectives" eyebrow="Core objectives" title="What distribution needs to do now">
          <Paragraph className="concept-bodyCopy">
            Distribution needs operational ownership, recurring communication,
            comprehensive relationship tracking, and consistent partner
            engagement. The objective is to build reach across Ahangama tourism
            touchpoints and drive signups into the Free Ahangama Pass funnel.
          </Paragraph>

          <Row gutter={[16, 16]}>
            {coreObjectives.map((objective) => (
              <Col xs={24} sm={12} md={8} key={objective}>
                <div className="concept-strategyChannel">
                  <RocketOutlined />
                  <span>{objective}</span>
                </div>
              </Col>
            ))}
          </Row>

          <Divider />

          <List
            dataSource={distributionNeeds}
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
            eyebrow="Channel responsibilities"
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
                    <TeamOutlined />
                    <Text className="concept-sectionEyebrow">Deliverables and goals</Text>
                  </Space>
                  <List
                    dataSource={lead.deliverables}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                    className="concept-strategyList"
                  />
                </Card>
              </Col>
            </Row>
          </SectionCard>
        ))}

        <SectionCard id="communication" eyebrow="Communication system" title="Recurring communication keeps the network active">
          <Paragraph className="concept-bodyCopy">
            Every distribution channel needs regular contact. The system should
            not depend on ad hoc follow-up. It should be scheduled, owned, and
            easy to execute through WhatsApp newsletters, email newsletters,
            and bi-weekly check-ins.
          </Paragraph>

          <Row gutter={[18, 18]}>
            <Col xs={24} md={8}>
              <Card className="concept-card concept-subCard concept-strategySubCard" bordered={false}>
                <Space align="center" size={10} className="concept-strategySubHeader">
                  <MessageOutlined />
                  <Text className="concept-sectionEyebrow">WhatsApp newsletters</Text>
                </Space>
                <List
                  dataSource={whatsappNewsletter}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                  className="concept-strategyList"
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="concept-card concept-subCard concept-strategySubCard" bordered={false}>
                <Space align="center" size={10} className="concept-strategySubHeader">
                  <MailOutlined />
                  <Text className="concept-sectionEyebrow">Email newsletters</Text>
                </Space>
                <List
                  dataSource={emailNewsletter}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                  className="concept-strategyList"
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="concept-card concept-subCard concept-strategySubCard" bordered={false}>
                <Space align="center" size={10} className="concept-strategySubHeader">
                  <ScheduleOutlined />
                  <Text className="concept-sectionEyebrow">Bi-weekly check-ins</Text>
                </Space>
                <List
                  dataSource={biWeeklyCheckins}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                  className="concept-strategyList"
                />
              </Card>
            </Col>
          </Row>
        </SectionCard>

        <SectionCard id="database" eyebrow="Centralized database" title="Every relationship needs to be owned and tracked">
          <Paragraph className="concept-bodyCopy">
            The distribution database should become the central source of truth
            across hotels, villas, cafes, wellness studios, creators,
            operators, concierge contacts, and community partners. Every
            relationship should be categorized, assigned an owner, tracked, and
            followed up regularly.
          </Paragraph>

          <Row gutter={[16, 16]}>
            {databaseEntries.map((entry) => (
              <Col xs={24} sm={12} md={8} key={entry}>
                <div className="concept-strategyChannel">
                  <ApartmentOutlined />
                  <span>{entry}</span>
                </div>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard id="final-goal" eyebrow="Final goal" title="Every distribution channel should feed the Free Ahangama Pass">
          <Paragraph className="concept-bodyCopy">
            The full system should feed into the same chain: Free Ahangama Pass,
            then recommendations, engagement, premium experiences, and
            commerce. That is how distribution becomes an acquisition layer,
            communication layer, discovery layer, and commerce layer for
            Ahangama tourism.
          </Paragraph>

          <Row gutter={[16, 16]}>
            {finalLayers.map((layer) => (
              <Col xs={24} sm={12} md={12} key={layer}>
                <Card className="concept-card concept-subCard concept-strategyGoalCard" bordered={false}>
                  <div className="concept-strategyGoalIcon">
                    <GlobalOutlined />
                  </div>
                  <Paragraph className="concept-bodyCopy" style={{ marginBottom: 0 }}>
                    {layer}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24} md={3}>
              <div className="concept-strategyChannel">
                <ReadOutlined />
                <span>Free Ahangama Pass</span>
              </div>
            </Col>
            <Col xs={24} md={3}>
              <div className="concept-strategyChannel">
                <MessageOutlined />
                <span>Recommendations</span>
              </div>
            </Col>
            <Col xs={24} md={3}>
              <div className="concept-strategyChannel">
                <InstagramOutlined />
                <span>Engagement</span>
              </div>
            </Col>
            <Col xs={24} md={3}>
              <div className="concept-strategyChannel">
                <RocketOutlined />
                <span>Premium Experiences</span>
              </div>
            </Col>
            <Col xs={24} md={3}>
              <div className="concept-strategyChannel">
                <ApartmentOutlined />
                <span>Commerce</span>
              </div>
            </Col>
          </Row>
        </SectionCard>
      </ConceptWorkspaceLayout>
    </>
  );
}