import React from "react";
import { Card, Col, Image, Row, Space, Tag, Typography } from "antd";
import {
  CheckCircleOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  QrcodeOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ConceptWorkspaceLayout from "../components/concept/ConceptWorkspaceLayout";

const { Paragraph, Text, Title } = Typography;

const sections = [
  { id: "overview", label: "Overview", hint: "Why the stands matter" },
  {
    id: "why-design-works",
    label: "Why It Works",
    hint: "Psychology behind the stand design",
  },
  {
    id: "design-direction",
    label: "Design Direction",
    hint: "Visual language and mock placements",
  },
  {
    id: "core-objectives",
    label: "Core Objectives",
    hint: "KPIs the stand network should drive",
  },
  {
    id: "placement-strategy",
    label: "Placement",
    hint: "Where the infrastructure should live",
  },
  {
    id: "key-insight",
    label: "Key Insight",
    hint: "What the team should remember",
  },
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
    isActive: true,
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

const outcomes = [
  "Ahangama Pass signups",
  "WhatsApp leads",
  "Guide engagement",
  "Future premium pass purchases",
];

const psychologyCards = [
  {
    title: "FREE at the Top",
    eyebrow: "Friction removal",
    points: [
      "Lowers friction at the first glance and removes perceived risk.",
      "Increases curiosity because the user feels there is instant upside.",
      "Makes the scan feel like a gain rather than a commitment.",
    ],
    quote:
      "Users are far more likely to scan when there is zero perceived downside.",
  },
  {
    title: "Apple Wallet + Google Wallet Logos",
    eyebrow: "Native trust",
    points: [
      "Creates instant familiarity through mobile-native patterns people already know.",
      "Wallet passes already map to boarding passes, tickets, and event access.",
      "There is no learning curve because the behavior feels standard on arrival.",
    ],
    visual: "wallet",
  },
  {
    title: "Instant Venue Benefit",
    eyebrow: "Contextual value",
    points: [
      "Users need immediate contextual value at the exact venue where they see the stand.",
      "Specific offers such as 10% off here outperform generic discovery messaging.",
      "The venue benefit creates urgency, relevance, and an easy reason to act now.",
    ],
    visual: "promo",
  },
  {
    title: "QR Code Visibility",
    eyebrow: "Scanability",
    points: [
      "The QR should be large, obvious, and readable from an easy standing distance.",
      "Minimal surrounding copy keeps the action clear instead of cognitively heavy.",
      "The interaction should feel frictionless, almost like a reflex rather than a decision.",
    ],
    visual: "qr",
  },
];

const promoChips = [
  "Save 10% Today",
  "Free Drink",
  "Free Upgrade",
  "Members Perk",
];

const moodKeywords = [
  "Shoreditch cafe branding",
  "boutique hotel collateral",
  "Apple Wallet aesthetic",
  "modern coastal",
  "minimalist travel guide",
  "premium surf culture",
];

const mockups = [
  {
    title: "Cafe counter stand",
    note: "Reference examples",
    images: [
      {
        src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/internal/plastic-stands/wihtout-iPhone-Offer-free.jpg",
        alt: "Cafe plastic stand without iPhone offer free layout",
      },
      {
        src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/internal/plastic-stands/iPhone%2BOffer-Free-Pass.jpg",
        alt: "Cafe plastic stand with iPhone and offer free pass layout",
      },
    ],
  },
  {
    title: "Hotel reception stand",
    note: "Placeholder mockup",
  },
  {
    title: "Coworking desk stand",
    note: "Placeholder mockup",
  },
  {
    title: "Surf shop version",
    note: "Placeholder mockup",
  },
  {
    title: "Wellness studio version",
    note: "Placeholder mockup",
  },
];

const objectives = [
  {
    label: "Increase Weekly QR Scans",
    value: "QR volume",
    note: "Treat every stand as a measurable distribution node, not static signage.",
  },
  {
    label: "Capture Tourist Contact Data",
    value: "Lead capture",
    note: "Use wallet signup and messaging entry points to build owned audience data.",
  },
  {
    label: "Drive Ahangama Pass Ownership",
    value: "Pass installs",
    note: "Move casual venue foot traffic into persistent pass ownership on mobile.",
  },
  {
    label: "Increase Venue Redemption",
    value: "Offer usage",
    note: "Close the loop between acquisition and in-venue benefit redemption.",
  },
  {
    label: "Upsell Premium Pass",
    value: "Upgrade intent",
    note: "Use the free scan moment to seed later monetization and bundle conversion.",
  },
  {
    label: "Build Direct Tourist Communication Channels",
    value: "Owned reach",
    note: "Push travelers into WhatsApp, guide content, and repeat editorial touchpoints.",
  },
];

const placementRows = [
  {
    venue: "Cafes",
    visibility: "High",
    conversion: "High",
    intent: "Medium",
  },
  {
    venue: "Hotels",
    visibility: "High",
    conversion: "High",
    intent: "High",
  },
  {
    venue: "Surf Schools",
    visibility: "Medium",
    conversion: "High",
    intent: "High",
  },
  {
    venue: "Wellness Studios",
    visibility: "Medium",
    conversion: "Medium",
    intent: "High",
  },
  {
    venue: "Tuk Tuk Rentals",
    visibility: "Medium",
    conversion: "Medium",
    intent: "Medium",
  },
  {
    venue: "Coworking Spaces",
    visibility: "Medium",
    conversion: "High",
    intent: "High",
  },
  {
    venue: "Beach Clubs",
    visibility: "High",
    conversion: "Medium",
    intent: "Medium",
  },
  {
    venue: "Restaurants",
    visibility: "High",
    conversion: "Medium",
    intent: "Medium",
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

function MetricTag({ children, tone = "default" }) {
  const toneClass = tone === "strong" ? " concept-placementTagStrong" : "";

  return <span className={`concept-placementTag${toneClass}`}>{children}</span>;
}

export default function ConceptPlasticStandsPage() {
  const canonical = absUrl("/concept/plastic-stands");

  return (
    <>
      <Seo
        title="Plastic Stands — Ahangama Pass Strategy Workspace"
        description="Internal strategy workspace for the Ahangama Pass plastic QR stand network as offline-to-online conversion infrastructure across cafes, hotels, surf shops, coworking spaces, wellness studios, and partner venues."
        canonical={canonical}
      />

      <ConceptWorkspaceLayout
        sections={sections}
        status="Physical distribution layer"
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
                <Text className="concept-heroEyebrow">Plastic Stands</Text>
                <Title className="concept-heroTitle">
                  Plastic Stands — Offline to Online Conversion Infrastructure
                </Title>
                <Paragraph className="concept-heroCopy">
                  The plastic QR stands are one of the most important physical
                  distribution channels in the Ahangama Pass ecosystem. They
                  operate as customer acquisition tools, onboarding touchpoints,
                  tourism discovery infrastructure, conversion funnels, and
                  trust-building mechanisms across cafes, hotels, surf shops,
                  coworking spaces, wellness studios, and partner venues.
                </Paragraph>
                <Paragraph className="concept-bodyCopy">
                  The goal is simple: convert real-world foot traffic into owned
                  digital relationships and measurable downstream outcomes for
                  the pass ecosystem.
                </Paragraph>
                <Space wrap size={[10, 10]}>
                  {outcomes.map((item) => (
                    <Tag className="concept-pill" key={item}>
                      {item}
                    </Tag>
                  ))}
                </Space>
              </div>

              <div className="concept-focusPanel concept-strategyPanel">
                <Text className="concept-focusLabel">Infrastructure role</Text>
                <Title level={4} className="concept-focusTitle">
                  Physical touchpoint, digital funnel
                </Title>
                <div className="concept-plasticStatsGrid">
                  <div className="concept-plasticStatCard">
                    <QrcodeOutlined />
                    <div>
                      <Text className="concept-miniLabel">Acquisition</Text>
                      <Paragraph className="concept-focusItem">
                        Turn passing attention into a scan event.
                      </Paragraph>
                    </div>
                  </div>
                  <div className="concept-plasticStatCard">
                    <WalletOutlined />
                    <div>
                      <Text className="concept-miniLabel">Onboarding</Text>
                      <Paragraph className="concept-focusItem">
                        Move the tourist into a familiar wallet-first flow.
                      </Paragraph>
                    </div>
                  </div>
                  <div className="concept-plasticStatCard">
                    <CompassOutlined />
                    <div>
                      <Text className="concept-miniLabel">Discovery</Text>
                      <Paragraph className="concept-focusItem">
                        Use the stand as a trusted starting point for exploring
                        Ahangama.
                      </Paragraph>
                    </div>
                  </div>
                  <div className="concept-plasticStatCard">
                    <RocketOutlined />
                    <div>
                      <Text className="concept-miniLabel">Conversion</Text>
                      <Paragraph className="concept-focusItem">
                        Feed future premium pass demand and direct communication.
                      </Paragraph>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <SectionCard
          id="why-design-works"
          eyebrow="Why This Design Works"
          title="The stand design wins because it reduces friction while signaling trust"
        >
          <Row gutter={[16, 16]}>
            {psychologyCards.map((card) => (
              <Col xs={24} xl={12} key={card.title}>
                <Card className="concept-strategyGoalCard concept-plasticCard" bordered={false}>
                  <Text className="concept-sectionEyebrow">{card.eyebrow}</Text>
                  <Title level={4} className="concept-strategySubHeader">
                    {card.title}
                  </Title>
                  <div className="concept-plasticList">
                    {card.points.map((point) => (
                      <div className="concept-plasticListItem" key={point}>
                        <CheckCircleOutlined />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>

                  {card.quote ? (
                    <div className="concept-plasticQuoteBlock">
                      <Text className="concept-miniLabel">Highlighted insight</Text>
                      <blockquote className="concept-plasticQuote">
                        {card.quote}
                      </blockquote>
                    </div>
                  ) : null}

                  {card.visual === "wallet" ? (
                    <div className="concept-plasticMockArea concept-walletMockArea">
                      <div className="concept-walletLogoRow">
                        <span className="concept-walletLogoPill">Apple Wallet</span>
                        <span className="concept-walletLogoPill">Google Wallet</span>
                      </div>
                      <Text className="concept-miniLabel">Wallet Logos Placement</Text>
                    </div>
                  ) : null}

                  {card.visual === "promo" ? (
                    <div className="concept-plasticMockArea">
                      <Text className="concept-miniLabel">Example venue benefit tags</Text>
                      <div className="concept-chipGrid">
                        {promoChips.map((chip) => (
                          <span className="concept-chip concept-chipStrong" key={chip}>
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {card.visual === "qr" ? (
                    <div className="concept-qrMockWrap">
                      <div className="concept-qrMockBox">
                        <QrcodeOutlined />
                        <Text className="concept-miniLabel">Centered QR Placeholder</Text>
                      </div>
                    </div>
                  ) : null}
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard
          id="design-direction"
          eyebrow="Design Direction"
          title="Editorial, premium, and intentionally minimal"
        >
          <div className="concept-editorialColumns">
            <Card className="concept-strategySubCard concept-plasticCard" bordered={false}>
              <Text className="concept-sectionEyebrow">Mood</Text>
              <Title level={4} className="concept-strategySubHeader">
                The stand should feel like premium startup collateral, not a venue flyer.
              </Title>
              <Paragraph className="concept-bodyCopy">
                Use a restrained palette, strong hierarchy, soft shadows, rounded
                corners, and heavy whitespace. The result should sit naturally in
                a boutique hotel, premium surf venue, or design-forward cafe.
              </Paragraph>
              <div className="concept-chipGrid">
                {moodKeywords.map((keyword) => (
                  <span className="concept-chip" key={keyword}>
                    {keyword}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="concept-strategySubCard concept-plasticCard" bordered={false}>
              <Text className="concept-sectionEyebrow">Visual guardrails</Text>
              <Title level={4} className="concept-strategySubHeader">
                Keep the message legible from a standing distance.
              </Title>
              <div className="concept-plasticGuardrails">
                <div className="concept-modalBlock concept-modalFocusBlock">
                  <Text className="concept-miniLabel">Typography</Text>
                  <Paragraph className="concept-bodyCopy">
                    Large FREE headline, compressed supporting copy, and one
                    obvious CTA path to the QR.
                  </Paragraph>
                </div>
                <div className="concept-modalBlock">
                  <Text className="concept-miniLabel">Surface</Text>
                  <Paragraph className="concept-bodyCopy">
                    Neutral substrates, soft translucency, and premium print-like
                    restraint instead of loud promotional clutter.
                  </Paragraph>
                </div>
              </div>
            </Card>
          </div>

          <Text className="concept-miniLabel">Mockups and references</Text>
          <Row gutter={[16, 16]}>
            {mockups.map((mockup) => (
              <Col xs={24} sm={12} xl={8} key={mockup.title}>
                <Card className="concept-touchpointCard concept-plasticCard" bordered={false}>
                  {mockup.images?.length ? (
                    <Image.PreviewGroup>
                      <div className="concept-plasticImageGallery">
                        {mockup.images.map((image) => (
                          <div className="concept-plasticImageTile" key={image.src}>
                            <Image
                              className="concept-plasticImage"
                              src={image.src}
                              alt={image.alt}
                            />
                          </div>
                        ))}
                      </div>
                    </Image.PreviewGroup>
                  ) : (
                    <div className="concept-plasticMockupFrame">
                      <EnvironmentOutlined />
                    </div>
                  )}
                  <div className="concept-plasticMockupMeta">
                    <Text className="concept-touchpointLabel">{mockup.title}</Text>
                    <Text className="concept-miniLabel">{mockup.note}</Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard
          id="core-objectives"
          eyebrow="Core Objectives"
          title="Measure the stand network like a growth dashboard"
        >
          <Row gutter={[16, 16]}>
            {objectives.map((objective) => (
              <Col xs={24} md={12} xl={8} key={objective.label}>
                <Card className="concept-kpiCard concept-plasticObjectiveCard" bordered={false}>
                  <Text className="concept-kpiLabel">{objective.value}</Text>
                  <Title level={4} className="concept-strategySubHeader">
                    {objective.label}
                  </Title>
                  <Paragraph className="concept-kpiNote">
                    {objective.note}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </SectionCard>

        <SectionCard
          id="placement-strategy"
          eyebrow="Placement Strategy"
          title="Prioritize venue types by visibility, conversion, and tourist intent"
        >
          <Card className="concept-plasticMatrixCard" bordered={false}>
            <div className="concept-placementHeader concept-placementRow">
              <span>Location Type</span>
              <span>Visibility Level</span>
              <span>Conversion Potential</span>
              <span>Tourist Intent Quality</span>
            </div>
            {placementRows.map((row) => (
              <div className="concept-placementRow" key={row.venue}>
                <div className="concept-placementCell concept-placementName">
                  <SafetyCertificateOutlined />
                  <span>{row.venue}</span>
                </div>
                <div className="concept-placementCell">
                  <MetricTag tone={row.visibility === "High" ? "strong" : "default"}>
                    {row.visibility}
                  </MetricTag>
                </div>
                <div className="concept-placementCell">
                  <MetricTag tone={row.conversion === "High" ? "strong" : "default"}>
                    {row.conversion}
                  </MetricTag>
                </div>
                <div className="concept-placementCell">
                  <MetricTag tone={row.intent === "High" ? "strong" : "default"}>
                    {row.intent}
                  </MetricTag>
                </div>
              </div>
            ))}
          </Card>
        </SectionCard>

        <section id="key-insight" className="concept-section">
          <Card className="concept-card concept-cardSection concept-keyInsightCard" bordered={false}>
            <Text className="concept-sectionEyebrow">Key Insight</Text>
            <blockquote className="concept-keyInsightQuote">
              The physical QR stand is not marketing collateral — it is distribution infrastructure.
            </blockquote>
          </Card>
        </section>
      </ConceptWorkspaceLayout>
    </>
  );
}