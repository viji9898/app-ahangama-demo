import React from "react";
import { Card, Col, Divider, List, Row, Space, Tag, Typography } from "antd";
import {
  CameraOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  GlobalOutlined,
  InstagramOutlined,
  QrcodeOutlined,
  ReadOutlined,
  RocketOutlined,
  ScheduleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ConceptWorkspaceLayout from "../components/concept/ConceptWorkspaceLayout";

const { Paragraph, Text, Title } = Typography;

const sections = [
  { id: "overview", label: "Overview", hint: "Why editorial matters" },
  { id: "role", label: "Role", hint: "What the blog system supports" },
  { id: "outputs", label: "Outputs", hint: "Formats to produce" },
  { id: "ownership", label: "Ownership", hint: "Who drives what" },
  { id: "rhythm", label: "Rhythm", hint: "Publishing cadence" },
  { id: "distribution", label: "Distribution", hint: "How content spreads" },
  { id: "goal", label: "Main Goal", hint: "What success should create" },
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
    isActive: true,
  },
  {
    key: "guide-26-27",
    label: "Guide 26/27",
    href: "/concept/guide-26-27",
    isActive: false,
  },
];

const editorialPrinciples = [
  "Use editorial content as acquisition and retention fuel.",
  "Support Free Pass acquisition, premium storytelling, and the Guide 26/27 rollout.",
  "Make Ahangama feel curated, trusted, and worth exploring through story-led recommendations.",
  "Turn the strongest experiences into repeatable content assets across blog, guide, QR, and social.",
];

const editorialOutputs = [
  "Digital Guide",
  "Printed Guide",
  "Instagram Editorial",
  "PDF Download",
  "Interactive Map",
  "Experience blog posts",
  "Blog banner system",
  "QR-led story pages",
];

const ownership = [
  {
    name: "Vishmi",
    role: "Experience and venue source material",
    icon: <TeamOutlined />,
    points: [
      "Finalize the shortlist of venues and experiences worth writing about",
      "Provide one core experience angle per venue",
      "Supply pricing, perks, and short write-ups",
      "Keep the editorial system anchored in genuinely strong tourist experiences",
    ],
  },
  {
    name: "Faizan",
    role: "Visual and guide system",
    icon: <CameraOutlined />,
    points: [
      "Create the blog banner and article visual system",
      "Keep guide, blog, QR, and social layouts visually coherent",
      "Make the content feel premium, minimal, and editorial rather than promotional",
      "Turn the written experience system into recognisable travel design assets",
    ],
  },
  {
    name: "Ishaq",
    role: "Social and promotion layer",
    icon: <InstagramOutlined />,
    points: [
      "Translate editorial stories into social distribution",
      "Use blog posts to support discovery and audience growth",
      "Connect Instagram storytelling with the guide and pass ecosystem",
      "Push high-performing experiences into broader reach campaigns",
    ],
  },
  {
    name: "Courtney",
    role: "Publishing rhythm and coordination",
    icon: <ScheduleOutlined />,
    points: [
      "Manage publishing calendar and scheduling",
      "Coordinate campaign rollouts across channels",
      "Create a more intentional publishing rhythm",
      "Keep content timing aligned with product and partnership priorities",
    ],
  },
];

const publishingRhythm = [
  "Build around the strongest Ahangama experiences rather than scattered offers",
  "Create one hero story per core experience or venue cluster",
  "Repurpose each story into guide blocks, QR pages, and Instagram assets",
  "Link editorial output back into Free Pass acquisition and premium intent",
];

const distributionChannels = [
  {
    title: "Website and blog",
    icon: <GlobalOutlined />,
    description:
      "The main searchable archive for trusted Ahangama recommendations and long-form discovery.",
  },
  {
    title: "Guide 26/27",
    icon: <ReadOutlined />,
    description:
      "The editorial wrapper that turns individual stories into the definitive Ahangama guide product.",
  },
  {
    title: "Instagram editorial",
    icon: <InstagramOutlined />,
    description:
      "The visual discovery layer that creates reach, aspiration, and traffic back into deeper content.",
  },
  {
    title: "QR touchpoints",
    icon: <QrcodeOutlined />,
    description:
      "Physical entry points that turn venues, hotels, and in-town touchpoints into story and signup gateways.",
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

export default function ConceptBlogStrategyPage() {
  const canonical = absUrl("/concept/blog-strategy");

  return (
    <>
      <Seo
        title="Blog Strategy Workspace"
        description="Internal concept workspace for Ahangama Pass editorial strategy, including content role, outputs, ownership, publishing rhythm, and distribution channels."
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
            <Text className="concept-sectionEyebrow">Blog Strategy</Text>
            <Title className="concept-heroTitle">
              Editorial is the trust layer for the whole Ahangama ecosystem.
            </Title>
            <Paragraph className="concept-bodyCopy concept-heroParagraph">
              The blog should not operate as a disconnected content channel. It
              exists to make Ahangama feel curated, credible, and discoverable
              while feeding the Guide 26/27, the Free Pass acquisition funnel,
              and the premium product story around experiences.
            </Paragraph>
          </div>

          <Space wrap>
            <Tag className="concept-pillTag">Editorial system</Tag>
            <Tag className="concept-pillTag">Acquisition support</Tag>
            <Tag className="concept-pillTag">Guide 26/27</Tag>
          </Space>
        </section>

        <SectionCard
          id="overview"
          eyebrow="Overview"
          title="Why this deserves its own strategy page"
        >
          <Paragraph className="concept-bodyCopy">
            The current concept workspace already treats editorial as a core
            output, not an optional marketing layer. This page makes that
            explicit: the blog, guide, and editorial assets are what turn venue
            data and experience curation into something people trust, search
            for, share, and act on.
          </Paragraph>

          <Row gutter={[16, 16]}>
            {editorialPrinciples.map((item) => (
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
          id="role"
          eyebrow="Role"
          title="What the editorial system is supposed to support"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={14}>
              <Paragraph className="concept-bodyCopy">
                Editorial content should make the destination legible. It helps
                a traveler understand where to go, why a place matters, what
                kind of experience to expect, and how everything fits together.
                That makes the blog useful on its own, but also much more
                valuable as infrastructure for every other product layer.
              </Paragraph>
            </Col>
            <Col xs={24} lg={10}>
              <Card className="concept-strategyGoalCard" bordered={false}>
                <Space direction="vertical" size={10}>
                  <Space align="center">
                    <FileTextOutlined className="concept-strategyGoalIcon" />
                    <Text strong>Primary jobs</Text>
                  </Space>
                  <Text className="concept-bodyCopy">
                    Build trust, drive search visibility, support discovery,
                    create assets for the guide, and move readers toward pass
                    signup and higher-intent experience decisions.
                  </Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </SectionCard>

        <SectionCard
          id="outputs"
          eyebrow="Outputs"
          title="Formats the team should be producing"
        >
          <Paragraph className="concept-bodyCopy">
            The existing concept page already defines several editorial outputs.
            The blog-strategy page groups them into one system so each story can
            live across web, guide, social, and physical touchpoints.
          </Paragraph>

          <List
            grid={{ gutter: 16, xs: 1, md: 2 }}
            dataSource={editorialOutputs}
            renderItem={(item) => (
              <List.Item>
                <Card className="concept-strategySubCard" bordered={false}>
                  <Space align="start">
                    <ReadOutlined className="concept-strategyGoalIcon" />
                    <Text className="concept-bodyCopy">{item}</Text>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        </SectionCard>

        <SectionCard
          id="ownership"
          eyebrow="Ownership"
          title="Who drives the editorial system"
        >
          <Row gutter={[16, 16]}>
            {ownership.map((person) => (
              <Col xs={24} md={12} key={person.name}>
                <Card className="concept-strategyChannel" bordered={false}>
                  <Space align="center">
                    {person.icon}
                    <div>
                      <Title level={4} className="concept-strategySubHeader">
                        {person.name}
                      </Title>
                      <Text className="concept-bodyCopy">{person.role}</Text>
                    </div>
                  </Space>
                  <Divider />
                  <List
                    dataSource={person.points}
                    renderItem={(item) => (
                      <List.Item>
                        <Text className="concept-bodyCopy">{item}</Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard
          id="rhythm"
          eyebrow="Rhythm"
          title="How publishing should actually work"
        >
          <Paragraph className="concept-bodyCopy">
            Publishing rhythm matters because it is what turns a pile of ideas
            into a coherent brand presence. The aim is not volume for its own
            sake. The aim is to create a repeatable cadence where each strong
            Ahangama experience becomes a story, then a guide asset, then a
            distribution asset.
          </Paragraph>

          <Row gutter={[16, 16]}>
            {publishingRhythm.map((item) => (
              <Col xs={24} md={12} key={item}>
                <Card className="concept-strategySubCard" bordered={false}>
                  <Space align="start">
                    <RocketOutlined className="concept-strategyGoalIcon" />
                    <Text className="concept-bodyCopy">{item}</Text>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard
          id="distribution"
          eyebrow="Distribution"
          title="How stories should travel through the ecosystem"
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
          title="What success should create"
        >
          <Paragraph className="concept-bodyCopy">
            A strong editorial system should make Ahangama easier to understand,
            easier to choose, and easier to remember. If this strategy works,
            the blog becomes more than content: it becomes the narrative engine
            that supports discovery, guide credibility, pass acquisition, and
            eventually premium conversion.
          </Paragraph>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card className="concept-strategyGoalCard" bordered={false}>
                <GlobalOutlined className="concept-strategyGoalIcon" />
                <Title level={4} className="concept-strategySubHeader">
                  Searchable trust
                </Title>
                <Paragraph className="concept-bodyCopy">
                  A destination content archive people can find and rely on.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="concept-strategyGoalCard" bordered={false}>
                <InstagramOutlined className="concept-strategyGoalIcon" />
                <Title level={4} className="concept-strategySubHeader">
                  Reusable story system
                </Title>
                <Paragraph className="concept-bodyCopy">
                  Stories that can move cleanly across blog, guide, QR, and
                  social.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="concept-strategyGoalCard" bordered={false}>
                <TeamOutlined className="concept-strategyGoalIcon" />
                <Title level={4} className="concept-strategySubHeader">
                  Product support
                </Title>
                <Paragraph className="concept-bodyCopy">
                  Editorial that directly strengthens the Free Pass and Premium
                  Pass ecosystem.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </SectionCard>
      </ConceptWorkspaceLayout>
    </>
  );
}
