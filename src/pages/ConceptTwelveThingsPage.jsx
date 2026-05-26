import React from "react";
import { Card, Col, Divider, List, Row, Space, Tag, Typography } from "antd";
import {
  CameraOutlined,
  CheckCircleOutlined,
  CompassOutlined,
  FileTextOutlined,
  GlobalOutlined,
  InstagramOutlined,
  QrcodeOutlined,
  ReadOutlined,
  RocketOutlined,
  StarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ConceptWorkspaceLayout from "../components/concept/ConceptWorkspaceLayout";

const { Paragraph, Text, Title } = Typography;

const sections = [
  { id: "overview", label: "Overview", hint: "Core strategy shift" },
  { id: "focus", label: "Central Idea", hint: "What everything supports" },
  { id: "vishmi", label: "Vishmi", hint: "Curated Experiences Lead" },
  { id: "faizan", label: "Faizan", hint: "Visual & Guide Lead" },
  { id: "ishaq", label: "Ishaq", hint: "Instagram & Promotion Lead" },
  { id: "minosha", label: "Minosha", hint: "Partnerships & Discovery" },
  {
    id: "blog-strategy",
    label: "Blog Strategy",
    hint: "One post per experience",
  },
  {
    id: "launch-goal",
    label: "Launch Goal",
    hint: "What success must look like",
  },
];

const shortcutActions = [
  {
    key: "12-things",
    label: "12 Things",
    href: "/concept/12-things",
    isActive: true,
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

const strategyChannels = [
  "Website",
  "Instagram",
  "Blog content",
  "Guide",
  "QR touchpoints",
  "Ahangama Pass",
  "Promotions",
  "Experience bundles",
];

const principles = [
  "We are no longer trying to manage hundreds of scattered offers.",
  "We are building a curated tourism discovery platform focused on premium, memorable experiences in Ahangama.",
  "Everything should reinforce: 12 Must Do Things in Ahangama.",
];

const teamLeads = [
  {
    id: "vishmi",
    name: "Vishmi",
    role: "Curated Experiences Lead",
    icon: <StarOutlined />,
    summary:
      "Own the final shortlist of top venues and shape the core experience list that becomes the foundation of the website, guide, blog strategy, bundles, and storytelling.",
    deliverables: [
      "Final shortlist of venues",
      "One core experience per venue",
      "Pricing",
      "Discounts and perks",
      "Vendor approvals",
      "Short write-up for each experience",
      "Finalized 12 Must Do list",
    ],
    focus: [
      "High quality experiences",
      "Visually appealing venues",
      "Tourist-friendly offerings",
      "Memorable moments",
      "Balance across wellness, food, activity, lifestyle, and culture",
      "Not just discounts",
    ],
  },
  {
    id: "faizan",
    name: "Faizan",
    role: "Visual & Guide Lead",
    icon: <CameraOutlined />,
    summary:
      "Build the full visual world around 12 Must Do Things in Ahangama and make the experiences feel premium, editorial, and visually coherent across formats.",
    deliverables: [
      "Guide concepts",
      "Experience cards",
      "Blog banner system",
      "QR stand visuals",
      "Social media templates",
      "Visual layouts for all experiences",
    ],
    focus: [
      "Ahangama guide visuals",
      "Experience layouts",
      "Blog visuals",
      "QR collateral",
      "PDF guide",
      "Social templates",
      "Editorial design system",
      "Clean, minimal, editorial, premium travel aesthetic",
      "Modern Sri Lanka",
      "Visually consistent",
    ],
  },
  {
    id: "ishaq",
    name: "Ishaq",
    role: "Instagram & Promotion Lead",
    icon: <InstagramOutlined />,
    summary:
      "Promote 12 Must Do Things in Ahangama as a curated travel guide and tourism discovery platform built around premium local experiences.",
    deliverables: [
      "Instagram content roadmap",
      "Posting schedule",
      "Reel concepts",
      "Story concepts",
      "Launch campaign ideas",
      "Venue-by-venue promotion plan",
    ],
    focus: [
      "Reels",
      "Experience clips",
      "Venue storytelling",
      "Day in Ahangama style content",
      "Team and founder credibility content",
      "Short-form travel recommendations",
      "A curated travel guide feel",
      "Insider recommendations",
    ],
  },
  {
    id: "minosha",
    name: "Minosha",
    role: "Experience Partnerships & Discovery Lead",
    icon: <CompassOutlined />,
    summary:
      "Expand and operationalize the ecosystem around 12 Must Do Things in Ahangama by finding new premium experiences, building relationships, and supporting delivery.",
    deliverables: [
      "Discover unique new experiences",
      "Build and manage partner relationships",
      "Coordinate collaborations",
      "Expand partnerships",
      "Help shape bundled experiences",
      "Coordinate operational logistics",
      "Support venue research, founder stories, and experience details",
    ],
    focus: [
      "Pottery workshops",
      "Sunset dinners",
      "Tea tastings",
      "Surf photography",
      "Boutique wellness experiences",
      "Creator collaborations",
      "Local artist experiences",
      "Ask constantly: what new experience would make Ahangama feel more exciting, premium, and discoverable?",
    ],
  },
];

const blogExamples = [
  "Best Pilates Class in Ahangama",
  "Best Ice Bath in Ahangama",
  "Best Surf Experiences in Ahangama",
  "Best Coffee Spots in Ahangama",
  "Best Wellness Experiences in Ahangama",
];

const launchGoals = [
  "A curated tourism discovery platform",
  "Strong visual identity",
  "Strong Instagram presence",
  "SEO and blog foundation",
  "Premium guide",
  "High-quality experiences people genuinely want",
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

export default function ConceptTwelveThingsPage() {
  const canonical = absUrl("/concept/12-things");

  return (
    <>
      <Seo
        title="12 Must Do Things in Ahangama — Team Strategy Workspace"
        description="Internal strategy workspace for aligning the Ahangama team around 12 Must Do Things in Ahangama, including team responsibilities, blog direction, experience curation, promotion, and launch goals."
        canonical={canonical}
      />

      <ConceptWorkspaceLayout
        sections={sections}
        status="Execution focus"
        lastUpdated="May 2026"
        shortcutActions={shortcutActions}
      >
        <section id="overview" className="concept-heroSection concept-section">
          <Card
            className="concept-card concept-heroCard concept-strategyHero"
            bordered={false}
          >
            <div className="concept-heroGrid">
              <div>
                <Text className="concept-heroEyebrow">
                  12 Must Do Things in Ahangama
                </Text>
                <Title className="concept-heroTitle">
                  One central idea should now drive the entire platform.
                </Title>
                <Paragraph className="concept-heroCopy">
                  This page exists so the team can align execution around one
                  clear strategy: aggressively narrow focus around a curated set
                  of premium, memorable experiences in Ahangama.
                </Paragraph>
                <Space wrap size={[10, 10]}>
                  <Tag className="concept-pill">Internal strategy</Tag>
                  <Tag className="concept-pill">Team alignment</Tag>
                  <Tag className="concept-pill">Execution brief</Tag>
                </Space>
              </div>

              <div className="concept-focusPanel concept-strategyPanel">
                <Text className="concept-focusLabel">Current mandate</Text>
                <Title level={4} className="concept-focusTitle">
                  Aggressively narrow focus
                </Title>
                <div className="concept-focusList">
                  {principles.map((item) => (
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

        <SectionCard
          id="focus"
          eyebrow="Central idea"
          title="Everything must support 12 Must Do Things in Ahangama"
        >
          <Paragraph className="concept-bodyCopy">
            Moving forward, the website, Instagram, blog content, guide, QR
            touchpoints, Ahangama Pass, promotions, and bundled experiences
            should all reinforce one concentrated tourism-discovery story.
          </Paragraph>
          <Row gutter={[16, 16]}>
            {strategyChannels.map((channel) => (
              <Col xs={24} sm={12} md={8} key={channel}>
                <div className="concept-strategyChannel">
                  <RocketOutlined />
                  <span>{channel}</span>
                </div>
              </Col>
            ))}
          </Row>
        </SectionCard>

        {teamLeads.map((lead) => (
          <SectionCard
            key={lead.id}
            id={lead.id}
            eyebrow="Core team responsibility"
            title={`${lead.name} — ${lead.role}`}
          >
            <Paragraph className="concept-bodyCopy">{lead.summary}</Paragraph>
            <Row gutter={[18, 18]}>
              <Col xs={24} md={11}>
                <Card
                  className="concept-card concept-subCard concept-strategySubCard"
                  bordered={false}
                >
                  <Space
                    align="center"
                    size={10}
                    className="concept-strategySubHeader"
                  >
                    {lead.icon}
                    <Text className="concept-sectionEyebrow">
                      Key deliverables
                    </Text>
                  </Space>
                  <List
                    dataSource={lead.deliverables}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                    className="concept-strategyList"
                  />
                </Card>
              </Col>
              <Col xs={24} md={13}>
                <Card
                  className="concept-card concept-subCard concept-strategySubCard"
                  bordered={false}
                >
                  <Space
                    align="center"
                    size={10}
                    className="concept-strategySubHeader"
                  >
                    <TeamOutlined />
                    <Text className="concept-sectionEyebrow">Focus areas</Text>
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

        <SectionCard
          id="blog-strategy"
          eyebrow="Entire team"
          title="Blog Strategy"
        >
          <Paragraph className="concept-bodyCopy">
            The blog system now needs one post for every experience or venue.
            The goal is tourism discovery content that ranks on Google, feels
            editorial rather than sales-focused, and naturally pushes the
            Ahangama Pass through real experience-led storytelling.
          </Paragraph>

          <Row gutter={[18, 18]}>
            <Col xs={24} md={12}>
              <Card
                className="concept-card concept-subCard concept-strategySubCard"
                bordered={false}
              >
                <Space
                  align="center"
                  size={10}
                  className="concept-strategySubHeader"
                >
                  <ReadOutlined />
                  <Text className="concept-sectionEyebrow">Example posts</Text>
                </Space>
                <List
                  dataSource={blogExamples}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                  className="concept-strategyList"
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                className="concept-card concept-subCard concept-strategySubCard"
                bordered={false}
              >
                <Space
                  align="center"
                  size={10}
                  className="concept-strategySubHeader"
                >
                  <GlobalOutlined />
                  <Text className="concept-sectionEyebrow">
                    Content requirements
                  </Text>
                </Space>
                <List
                  dataSource={[
                    "Rank on Google",
                    "Support tourism discovery",
                    "Naturally push the Ahangama Pass",
                    "Include images and video",
                    "Feel editorial, not sales-focused",
                  ]}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                  className="concept-strategyList"
                />
              </Card>
            </Col>
          </Row>
        </SectionCard>

        <SectionCard
          id="launch-goal"
          eyebrow="Final goal"
          title="What launch must deliver"
        >
          <Paragraph className="concept-bodyCopy">
            By launch, this should not feel like a messy pass product with too
            many scattered offers. It should feel like a curated tourism
            discovery platform with a strong visual identity, strong Instagram
            presence, a credible SEO base, a premium guide, and experiences
            people genuinely want.
          </Paragraph>

          <Row gutter={[16, 16]}>
            {launchGoals.map((goal) => (
              <Col xs={24} sm={12} md={8} key={goal}>
                <Card
                  className="concept-card concept-subCard concept-strategyGoalCard"
                  bordered={false}
                >
                  <div className="concept-strategyGoalIcon">
                    <FileTextOutlined />
                  </div>
                  <Paragraph
                    className="concept-bodyCopy"
                    style={{ marginBottom: 0 }}
                  >
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
                  <Text className="concept-summaryLabel">QR touchpoints</Text>
                  <strong>Support discovery, not clutter</strong>
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="concept-strategyFooterStat">
                <InstagramOutlined />
                <div>
                  <Text className="concept-summaryLabel">Content system</Text>
                  <strong>Travel-guide tone, premium local experiences</strong>
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="concept-strategyFooterStat">
                <CompassOutlined />
                <div>
                  <Text className="concept-summaryLabel">Execution filter</Text>
                  <strong>Does this reinforce 12 Must Do Things?</strong>
                </div>
              </div>
            </Col>
          </Row>
        </SectionCard>
      </ConceptWorkspaceLayout>
    </>
  );
}
