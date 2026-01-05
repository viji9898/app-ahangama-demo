import React from "react";
import { Card, Row, Col, Typography, Button, Space, Tag, Divider } from "antd";
import {
  HeartOutlined,
  TeamOutlined,
  QrcodeOutlined,
  ArrowRightOutlined,
  ThunderboltOutlined,
  CompassOutlined,
  CoffeeOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  BookOutlined,
} from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Title, Paragraph, Text } = Typography;

export default function About() {
  const canonical = absUrl("/about");

  return (
    <SiteLayout>
      <Seo
        title="About - Ahangama"
        description="Learn about our curated guide to Ahangama - a thoughtful approach to travel that prioritizes quality over quantity, built for independent travelers and long-stay visitors."
        canonical={canonical}
      />
      <div className="dm-heroCut" />
      <div className="dm-canvas">
        <div className="dm-wrap">
          {/* HERO SECTION */}
          <div style={{ marginBottom: 40 }}>
            <Card
              style={{
                borderRadius: 18,
                border: "1px solid rgba(0,0,0,0.06)",
                background:
                  "linear-gradient(135deg, rgba(255,248,220,0.3) 0%, rgba(255,255,255,0.8) 100%)",
              }}
              bodyStyle={{ padding: 32 }}
            >
              <Row gutter={[32, 24]} align="middle">
                <Col xs={24} lg={16}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "16px",
                        background: "linear-gradient(135deg, #8B4513, #D2691E)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                      }}
                    >
                      🏖️
                    </div>
                    <div>
                      <Title level={1} style={{ margin: 0, fontSize: "28px" }}>
                        About Ahangama
                      </Title>
                      <Text type="secondary" style={{ fontSize: "16px" }}>
                        Curated travel, done thoughtfully
                      </Text>
                    </div>
                  </div>

                  <Paragraph
                    style={{
                      fontSize: "17px",
                      lineHeight: 1.7,
                      color: "#5A6C7D",
                      marginBottom: 24,
                    }}
                  >
                    We believe travel should be about quality connections, not
                    endless scrolling through options. Our curated guide to
                    Ahangama focuses on places we'd genuinely recommend to
                    friends — cafés with character, stays with soul, and
                    experiences that matter.
                  </Paragraph>

                  <Space wrap size={12}>
                    <Tag
                      icon={<ThunderboltOutlined />}
                      style={{ padding: "4px 12px", fontSize: "13px" }}
                    >
                      Curated, not comprehensive
                    </Tag>
                    <Tag
                      icon={<HeartOutlined />}
                      style={{ padding: "4px 12px", fontSize: "13px" }}
                    >
                      Quality over quantity
                    </Tag>
                    <Tag
                      icon={<TeamOutlined />}
                      style={{ padding: "4px 12px", fontSize: "13px" }}
                    >
                      Made by travelers
                    </Tag>
                  </Space>
                </Col>

                <Col xs={24} lg={8}>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: "200px",
                        height: "200px",
                        margin: "0 auto",
                        borderRadius: "20px",
                        background:
                          "url('https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800') center/cover",
                        border: "3px solid rgba(139,69,19,0.2)",
                      }}
                    />
                    <Text
                      type="secondary"
                      style={{
                        fontSize: "13px",
                        marginTop: "8px",
                        display: "block",
                      }}
                    >
                      Ahangama's iconic stilt fishermen
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>

          {/* HOW IT WORKS */}
          <div style={{ marginBottom: 32 }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
              How it works
            </Title>

            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <Card
                  style={{
                    borderRadius: 16,
                    height: "100%",
                    textAlign: "center",
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      margin: "0 auto 16px",
                      borderRadius: "16px",
                      background: "linear-gradient(135deg, #c46a3a, #e8945a)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                    }}
                  >
                    <CoffeeOutlined style={{ color: "white" }} />
                  </div>
                  <Title level={4} style={{ marginBottom: 12 }}>
                    Curated Selection
                  </Title>
                  <Paragraph style={{ color: "#5A6C7D", lineHeight: 1.6 }}>
                    Every place is personally visited and vetted. No paid
                    placements, no inflated reviews — just honest
                    recommendations.
                  </Paragraph>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card
                  style={{
                    borderRadius: 16,
                    height: "100%",
                    textAlign: "center",
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      margin: "0 auto 16px",
                      borderRadius: "16px",
                      background: "linear-gradient(135deg, #6b7c5a, #8fa070)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                    }}
                  >
                    <QrcodeOutlined style={{ color: "white" }} />
                  </div>
                  <Title level={4} style={{ marginBottom: 12 }}>
                    The Card
                  </Title>
                  <Paragraph style={{ color: "#5A6C7D", lineHeight: 1.6 }}>
                    Get real perks at our partner venues. $18 gets you
                    discounts, freebies, and priority access that pays for
                    itself.
                  </Paragraph>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card
                  style={{
                    borderRadius: 16,
                    height: "100%",
                    textAlign: "center",
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      margin: "0 auto 16px",
                      borderRadius: "16px",
                      background: "linear-gradient(135deg, #3e5f73, #5a7a8f)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                    }}
                  >
                    <CompassOutlined style={{ color: "white" }} />
                  </div>
                  <Title level={4} style={{ marginBottom: 12 }}>
                    Local Insights
                  </Title>
                  <Paragraph style={{ color: "#5A6C7D", lineHeight: 1.6 }}>
                    Beyond the basics — timing tips, local favorites, and the
                    kind of details you'd want a friend to tell you.
                  </Paragraph>
                </Card>
              </Col>
            </Row>
          </div>

          {/* WHO IT'S FOR */}
          <div style={{ marginBottom: 32 }}>
            <Card
              style={{ borderRadius: 18, border: "1px solid rgba(0,0,0,0.06)" }}
              bodyStyle={{ padding: 32 }}
            >
              <Row gutter={[32, 24]} align="middle">
                <Col xs={24} lg={12}>
                  <Title level={2} style={{ marginBottom: 16 }}>
                    Who this is for
                  </Title>

                  <div style={{ marginBottom: 20 }}>
                    <Title
                      level={4}
                      style={{ color: "#8B4513", marginBottom: 8 }}
                    >
                      Independent travelers
                    </Title>
                    <Paragraph style={{ color: "#5A6C7D", marginBottom: 16 }}>
                      You prefer finding your own rhythm over following tour
                      groups. You value authentic experiences and genuine local
                      connections.
                    </Paragraph>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <Title
                      level={4}
                      style={{ color: "#8B4513", marginBottom: 8 }}
                    >
                      Long-stay visitors
                    </Title>
                    <Paragraph style={{ color: "#5A6C7D", marginBottom: 16 }}>
                      Staying weeks or months? You need more than tourist spots
                      — you need places that work for regular life.
                    </Paragraph>
                  </div>

                  <div>
                    <Title
                      level={4}
                      style={{ color: "#8B4513", marginBottom: 8 }}
                    >
                      Quality seekers
                    </Title>
                    <Paragraph style={{ color: "#5A6C7D", marginBottom: 0 }}>
                      You'd rather have 5 excellent recommendations than 50
                      mediocre ones. Time is precious, especially on vacation.
                    </Paragraph>
                  </div>
                </Col>

                <Col xs={24} lg={12}>
                  <div
                    style={{
                      padding: "24px",
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, rgba(62,95,115,0.1) 0%, rgba(255,255,255,0.8) 100%)",
                      border: "1px solid rgba(62,95,115,0.2)",
                    }}
                  >
                    <div style={{ marginBottom: 16 }}>
                      <EnvironmentOutlined
                        style={{
                          fontSize: "20px",
                          color: "#3e5f73",
                          marginRight: "8px",
                        }}
                      />
                      <Text strong style={{ fontSize: "16px" }}>
                        Perfect for:
                      </Text>
                    </div>

                    <ul
                      style={{ paddingLeft: 20, margin: 0, color: "#5A6C7D" }}
                    >
                      <li style={{ marginBottom: 8 }}>
                        Digital nomads setting up base
                      </li>
                      <li style={{ marginBottom: 8 }}>
                        Couples on extended stays
                      </li>
                      <li style={{ marginBottom: 8 }}>
                        Solo travelers who hate crowds
                      </li>
                      <li style={{ marginBottom: 8 }}>
                        Return visitors wanting deeper experiences
                      </li>
                      <li>Anyone tired of generic travel advice</li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>

          {/* THE STORY */}
          <div style={{ marginBottom: 32 }}>
            <Card
              style={{ borderRadius: 18, border: "1px solid rgba(0,0,0,0.06)" }}
              bodyStyle={{ padding: 32 }}
            >
              <Row gutter={[32, 24]} align="middle">
                <Col xs={24} lg={8}>
                  <div
                    style={{
                      width: "100%",
                      height: "250px",
                      borderRadius: "16px",
                      background:
                        "url('https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800') center/cover",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  />
                </Col>

                <Col xs={24} lg={16}>
                  <Title level={2} style={{ marginBottom: 16 }}>
                    Why we built this
                  </Title>

                  <Paragraph
                    style={{
                      fontSize: "16px",
                      lineHeight: 1.7,
                      color: "#5A6C7D",
                      marginBottom: 16,
                    }}
                  >
                    After spending months in Ahangama, we got tired of the same
                    question: "Where should I eat?" followed by overwhelming
                    lists of every restaurant within 10km.
                  </Paragraph>

                  <Paragraph
                    style={{
                      fontSize: "16px",
                      lineHeight: 1.7,
                      color: "#5A6C7D",
                      marginBottom: 16,
                    }}
                  >
                    Good travel advice shouldn't require research. It should be
                    simple: "Go here, you'll love it." That's what we've built —
                    a guide that cuts through the noise and gets straight to
                    what matters.
                  </Paragraph>

                  <Paragraph
                    style={{
                      fontSize: "16px",
                      lineHeight: 1.7,
                      color: "#5A6C7D",
                      marginBottom: 20,
                    }}
                  >
                    Every recommendation comes from genuine experience. We've
                    eaten at these places, stayed at these guesthouses, and done
                    these activities — not as reviewers, but as residents.
                  </Paragraph>

                  <Text
                    style={{
                      fontSize: "14px",
                      color: "#8B4513",
                      fontStyle: "italic",
                    }}
                  >
                    — The Ahangama team
                  </Text>
                </Col>
              </Row>
            </Card>
          </div>

          {/* CALL TO ACTION */}
          <div style={{ marginBottom: 32 }}>
            <Card
              style={{
                borderRadius: 18,
                border: "2px solid rgba(139,69,19,0.1)",
                background:
                  "linear-gradient(135deg, rgba(255,248,220,0.4) 0%, rgba(255,255,255,0.9) 100%)",
              }}
              bodyStyle={{ padding: 32 }}
            >
              <div style={{ textAlign: "center" }}>
                <Title level={2} style={{ marginBottom: 16, color: "#8B4513" }}>
                  Ready to explore?
                </Title>

                <Paragraph
                  style={{
                    fontSize: "16px",
                    color: "#5A6C7D",
                    marginBottom: 24,
                    maxWidth: "600px",
                    margin: "0 auto 24px",
                  }}
                >
                  Start with our curated recommendations, or get the card for
                  exclusive perks at our partner venues. Either way, you'll
                  experience Ahangama like a local.
                </Paragraph>

                <Space wrap size={16}>
                  <Button
                    type="primary"
                    size="large"
                    href="/eat"
                    icon={<ArrowRightOutlined />}
                    style={{
                      borderRadius: "12px",
                      height: "48px",
                      padding: "0 24px",
                    }}
                  >
                    Browse the guide
                  </Button>

                  <Button
                    size="large"
                    href="/card"
                    icon={<QrcodeOutlined />}
                    style={{
                      borderRadius: "12px",
                      height: "48px",
                      padding: "0 24px",
                    }}
                  >
                    Get the card
                  </Button>

                  <Button
                    size="large"
                    href="https://wa.me/94777908790?text=please%20send%20me%20the%20Ahangama%20Guide"
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<BookOutlined />}
                    style={{
                      borderRadius: "12px",
                      height: "48px",
                      padding: "0 24px",
                      background: "#25D366",
                      borderColor: "#25D366",
                      color: "white",
                    }}
                  >
                    Free PDF guide
                  </Button>
                </Space>
              </div>
            </Card>
          </div>
        </div>{" "}
        {/* dm-wrap */}
      </div>{" "}
      {/* dm-canvas */}
    </SiteLayout>
  );
}
