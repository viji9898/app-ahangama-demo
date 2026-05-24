import React from "react";
import { Card, Col, Progress, Row, Space, Tag, Typography } from "antd";
import {
  AimOutlined,
  FlagOutlined,
  FundOutlined,
  RocketOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ConceptWorkspaceLayout from "../components/concept/ConceptWorkspaceLayout";

const { Paragraph, Text, Title } = Typography;

const sections = [
  { id: "overview", label: "Overview", hint: "Project snapshot" },
  { id: "why", label: "Why This Exists", hint: "Problem and opportunity" },
  { id: "product", label: "Product", hint: "What the pass is" },
  { id: "objectives", label: "Objectives", hint: "What success looks like" },
  { id: "workstreams", label: "Workstreams", hint: "What needs doing now" },
  { id: "milestones", label: "Milestones", hint: "Shipped and next" },
  { id: "owners", label: "Owners", hint: "Who is accountable" },
  { id: "questions", label: "Open Questions", hint: "Decisions still needed" },
];

const kpis = [
  {
    label: "Partner venues live",
    value: "25+",
    note: "Target for the first strong network effect point.",
  },
  {
    label: "Active pass usage rate",
    value: "60%+",
    note: "Buyers should redeem quickly enough to feel immediate value.",
  },
  {
    label: "Purchase to first redemption",
    value: "< 48h",
    note: "The product should pay back its promise within two days.",
  },
];

const workstreams = [
  {
    title: "Product & redemption flow",
    status: "In Progress",
    focus:
      "Make the pass purchase, delivery, verification, and redemption journey reliable and easy for staff and customers.",
    needs: [
      "Tighten the onboarding-to-redemption experience",
      "Reduce edge-case friction on payment success and wallet delivery",
      "Make staff verification flows faster and harder to misuse",
    ],
  },
  {
    title: "Partner network quality",
    status: "In Progress",
    focus:
      "Grow the partner set deliberately, with offers that are worth buying the pass for.",
    needs: [
      "Define offer standards and venue qualification rules",
      "Prioritize anchor venues by category and influence",
      "Clarify onboarding and reporting expectations for partners",
    ],
  },
  {
    title: "Growth & narrative",
    status: "Next",
    focus:
      "Make the pass easy to understand in one screen and measurable across channels.",
    needs: [
      "Clarify why the pass is compelling beyond discounts",
      "Refine QR and campaign funnels",
      "Align offer framing across site, QR pages, and checkout",
    ],
  },
  {
    title: "Ops & analytics",
    status: "Next",
    focus:
      "Create operational confidence in reporting, support, and milestone tracking.",
    needs: [
      "Keep purchase attribution consistent through to GA4 purchase events",
      "Define owner-level review rhythms",
      "Create one reliable view of milestones and current blockers",
    ],
  },
];

const milestones = [
  {
    phase: "Shipped",
    items: [
      "Core pass purchase and verification flow",
      "Promo QR landing experiments",
      "Email and digital wallet delivery",
    ],
  },
  {
    phase: "In Progress",
    items: [
      "Reliable promo funnel measurement",
      "Cleaner internal visibility on milestones and responsibilities",
      "Offer quality and partner rollout standards",
    ],
  },
  {
    phase: "Next",
    items: [
      "Sharpen the core product story for team and partners",
      "Turn milestone tracking into a weekly operating rhythm",
      "Define launch criteria for a stronger public push",
    ],
  },
];

const owners = [
  {
    stream: "Product",
    owner: "Product lead",
    responsibility: "Customer journey, redemption UX, pass reliability",
  },
  {
    stream: "Partnerships",
    owner: "Partnership lead",
    responsibility: "Venue quality, offers, partner onboarding",
  },
  {
    stream: "Growth",
    owner: "Growth lead",
    responsibility: "Messaging, campaign structure, QR acquisition",
  },
  {
    stream: "Operations & analytics",
    owner: "Ops / analytics lead",
    responsibility: "Reporting trust, KPI reviews, support feedback loop",
  },
];

const openQuestions = [
  "What is the clearest one-line value proposition for the pass today?",
  "Which partner categories are essential for the product to feel complete?",
  "What launch milestone tells us the pass is ready for a broader push?",
  "Which metrics should be reviewed weekly, and who owns each one?",
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
                  This page should act as the team's shared operating view: what
                  the product is, why it matters, what success looks like, and
                  what needs attention now.
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
                  Make the pass clearly valuable, operationally reliable, and easy for the team to steer.
                </Title>
                <div className="concept-focusList">
                  <div className="concept-focusItem">
                    <RocketOutlined />
                    <span>Clarify the pass story and core promise</span>
                  </div>
                  <div className="concept-focusItem">
                    <AimOutlined />
                    <span>Focus workstreams around activation and partner quality</span>
                  </div>
                  <div className="concept-focusItem">
                    <FundOutlined />
                    <span>Make milestones and KPI ownership visible every week</span>
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
                  <strong>Turn the pass into a repeatable product</strong>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="concept-summaryStat">
                  <Text className="concept-summaryLabel">Decision rhythm</Text>
                  <strong>Use this page in weekly planning</strong>
                </div>
              </Col>
            </Row>
          </Card>
        </section>

        <SectionCard id="why" eyebrow="Why this exists" title="Why the project matters">
          <Row gutter={[20, 20]}>
            <Col xs={24} lg={12}>
              <Paragraph className="concept-bodyCopy">
                The Ahangama Pass should not just be a discount card. It should
                be a compact product that helps people discover trusted local
                venues, feel immediate value after purchase, and build a real
                connection between partner businesses and quality visitors.
              </Paragraph>
            </Col>
            <Col xs={24} lg={12}>
              <Paragraph className="concept-bodyCopy">
                The team needs a shared frame for what the pass is becoming,
                what outcomes matter, and where attention should go next. This
                workspace exists to keep product, partnerships, growth, and ops
                aligned around that.
              </Paragraph>
            </Col>
          </Row>
        </SectionCard>

        <SectionCard id="product" eyebrow="Product" title="What the Ahangama Pass is">
          <Row gutter={[20, 20]}>
            <Col xs={24} md={8}>
              <Card className="concept-card concept-subCard" bordered={false}>
                <Title level={4}>Core promise</Title>
                <Paragraph className="concept-bodyCopy">
                  One pass that gives visitors immediate value across a curated
                  set of local venues and experiences.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="concept-card concept-subCard" bordered={false}>
                <Title level={4}>Who it serves</Title>
                <Paragraph className="concept-bodyCopy">
                  Independent travelers, longer-stay visitors, and anyone who
                  wants a trusted shortcut into the best of Ahangama.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="concept-card concept-subCard" bordered={false}>
                <Title level={4}>How it works</Title>
                <Paragraph className="concept-bodyCopy">
                  Purchase the pass, receive digital delivery, redeem with staff
                  at partner venues, and experience value quickly.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </SectionCard>

        <SectionCard id="objectives" eyebrow="Objectives" title="What success looks like">
          <Row gutter={[20, 20]}>
            {kpis.map((kpi) => (
              <Col xs={24} md={8} key={kpi.label}>
                <Card className="concept-card concept-kpiCard" bordered={false}>
                  <Text className="concept-kpiLabel">{kpi.label}</Text>
                  <div className="concept-kpiValue">{kpi.value}</div>
                  <Paragraph className="concept-kpiNote">{kpi.note}</Paragraph>
                  <Progress percent={64} showInfo={false} strokeColor="#345c53" />
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard id="workstreams" eyebrow="Current priorities" title="Workstreams">
          <Row gutter={[20, 20]}>
            {workstreams.map((stream) => (
              <Col xs={24} lg={12} key={stream.title}>
                <Card className="concept-card concept-workstreamCard" bordered={false}>
                  <div className="concept-workstreamHeader">
                    <Title level={4}>{stream.title}</Title>
                    <Tag className="concept-statusPill">{stream.status}</Tag>
                  </div>
                  <Paragraph className="concept-bodyCopy">{stream.focus}</Paragraph>
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