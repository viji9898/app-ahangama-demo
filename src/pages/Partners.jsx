import React from "react";
import { Card, Row, Col, Typography, Button, Space, Tag, Divider } from "antd";
import {
  ShopOutlined,
  TeamOutlined,
  TrophyOutlined,
  GlobalOutlined,
  MailOutlined,
  WhatsAppOutlined,
  ArrowRightOutlined,
  ThunderboltOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Title, Paragraph, Text } = Typography;

const Partners = () => {
  const canonical = absUrl("/partners");

  const partnershipTypes = [
    {
      icon: <ShopOutlined style={{ fontSize: "2rem", color: "#8B4513" }} />,
      title: "Local Businesses",
      description:
        "Join our curated network of restaurants, cafes, and shops. Offer exclusive deals to pass holders and reach travelers who value authentic experiences.",
      benefits: [
        "Increased foot traffic",
        "Premium customer base",
        "Marketing support",
        "Digital visibility",
      ],
    },
    {
      icon: <TeamOutlined style={{ fontSize: "2rem", color: "#D2691E" }} />,
      title: "Accommodation Partners",
      description:
        "Hotels, guesthouses, and unique stays that align with our curated travel philosophy. Provide value-added experiences for our community.",
      benefits: [
        "Quality guest referrals",
        "Partnership marketing",
        "Seasonal promotions",
        "Brand association",
      ],
    },
    {
      icon: <TrophyOutlined style={{ fontSize: "2rem", color: "#CD853F" }} />,
      title: "Experience Providers",
      description:
        "Surf schools, yoga studios, tour operators, and activity providers. Share your passion with travelers seeking authentic Sri Lankan experiences.",
      benefits: [
        "Targeted audience",
        "Repeat customers",
        "Cross-promotion",
        "Community building",
      ],
    },
    {
      icon: <GlobalOutlined style={{ fontSize: "2rem", color: "#A0522D" }} />,
      title: "Regional Expansion",
      description:
        "Help us expand to new destinations. Local knowledge and partnerships to bring the Ahangama Pass concept to other coastal towns.",
      benefits: [
        "Revenue sharing",
        "Brand licensing",
        "Operational support",
        "Marketing assistance",
      ],
    },
  ];

  return (
    <SiteLayout>
      <Seo
        title="Partner with Us - Ahangama"
        description="Join our curated network of local businesses, accommodations, and experience providers. Partner with Ahangama Pass to reach quality-focused travelers and grow your business."
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
                      🤝
                    </div>
                    <div>
                      <Title level={1} style={{ margin: 0, fontSize: "28px" }}>
                        Partner with Us
                      </Title>
                      <Text type="secondary" style={{ fontSize: "16px" }}>
                        Join our curated network
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
                    We're building a community of travelers and local businesses
                    committed to authentic, sustainable tourism experiences.
                    Join our curated network and connect with travelers who
                    value quality over quantity.
                  </Paragraph>

                  <Space wrap size={12}>
                    <Tag
                      icon={<ThunderboltOutlined />}
                      style={{ padding: "4px 12px", fontSize: "13px" }}
                    >
                      Quality-focused
                    </Tag>
                    <Tag
                      icon={<HeartOutlined />}
                      style={{ padding: "4px 12px", fontSize: "13px" }}
                    >
                      Sustainable tourism
                    </Tag>
                    <Tag style={{ padding: "4px 12px", fontSize: "13px" }}>
                      Local partnerships
                    </Tag>
                  </Space>
                </Col>
                <Col xs={24} lg={8}>
                  <div style={{ textAlign: "center" }}>
                    <Space
                      direction="vertical"
                      size={12}
                      style={{ width: "100%" }}
                    >
                      <Button
                        type="primary"
                        size="large"
                        icon={<MailOutlined />}
                        style={{ width: "100%" }}
                        href="mailto:partners@ahangamapass.com"
                      >
                        Get in Touch
                      </Button>
                      <Button
                        size="large"
                        icon={<WhatsAppOutlined />}
                        style={{
                          width: "100%",
                          color: "#25D366",
                          borderColor: "#25D366",
                        }}
                        href="https://wa.me/94777123456?text=Hi! I'm interested in partnering with Ahangama Pass"
                        target="_blank"
                      >
                        WhatsApp Us
                      </Button>
                    </Space>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>

          {/* PARTNERSHIP TYPES */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <Title
                level={2}
                style={{ fontSize: "24px", marginBottom: "8px" }}
              >
                Partnership Opportunities
              </Title>
              <Text type="secondary" style={{ fontSize: "16px" }}>
                We're looking for like-minded partners who share our commitment
                to quality and authenticity.
              </Text>
            </div>

            <Row gutter={[24, 24]}>
              {partnershipTypes.map((type, index) => (
                <Col xs={24} md={12} key={index}>
                  <Card
                    style={{
                      height: "100%",
                      borderRadius: 16,
                      border: "1px solid rgba(0,0,0,0.06)",
                      transition: "all 0.3s ease",
                    }}
                    bodyStyle={{ padding: 24 }}
                    hoverable
                  >
                    <div style={{ marginBottom: "20px", textAlign: "center" }}>
                      {type.icon}
                    </div>
                    <Title
                      level={3}
                      style={{
                        textAlign: "center",
                        marginBottom: "16px",
                        fontSize: "20px",
                      }}
                    >
                      {type.title}
                    </Title>
                    <Paragraph
                      style={{
                        marginBottom: "20px",
                        color: "#5A6C7D",
                        lineHeight: 1.6,
                      }}
                    >
                      {type.description}
                    </Paragraph>
                    <div>
                      <Text strong style={{ color: "#8B4513" }}>
                        Key Benefits:
                      </Text>
                      <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                        {type.benefits.map((benefit, idx) => (
                          <li
                            key={idx}
                            style={{ marginBottom: "6px", color: "#5A6C7D" }}
                          >
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* WHY PARTNER */}
          <div style={{ marginBottom: 48 }}>
            <Card
              style={{
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.06)",
                background: "#fafafa",
              }}
              bodyStyle={{ padding: 32 }}
            >
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <Title
                  level={2}
                  style={{ fontSize: "24px", marginBottom: "8px" }}
                >
                  Why Partner With Ahangama?
                </Title>
                <Text type="secondary" style={{ fontSize: "16px" }}>
                  More than just a discount card - we're building a sustainable
                  tourism ecosystem.
                </Text>
              </div>

              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} md={6}>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "20px",
                        background: "linear-gradient(135deg, #8B4513, #D2691E)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                        fontSize: "24px",
                      }}
                    >
                      👥
                    </div>
                    <Title
                      level={4}
                      style={{ fontSize: "16px", marginBottom: "12px" }}
                    >
                      Quality Community
                    </Title>
                    <Text style={{ color: "#5A6C7D" }}>
                      Discerning travelers who value authentic, high-quality
                      experiences over mass tourism.
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "20px",
                        background: "linear-gradient(135deg, #8B4513, #D2691E)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                        fontSize: "24px",
                      }}
                    >
                      🌱
                    </div>
                    <Title
                      level={4}
                      style={{ fontSize: "16px", marginBottom: "12px" }}
                    >
                      Sustainable Tourism
                    </Title>
                    <Text style={{ color: "#5A6C7D" }}>
                      Responsible travel that benefits local communities and
                      preserves authentic character.
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "20px",
                        background: "linear-gradient(135deg, #8B4513, #D2691E)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                        fontSize: "24px",
                      }}
                    >
                      📱
                    </div>
                    <Title
                      level={4}
                      style={{ fontSize: "16px", marginBottom: "12px" }}
                    >
                      Marketing Support
                    </Title>
                    <Text style={{ color: "#5A6C7D" }}>
                      Featured placement in our app, social media promotion, and
                      curated travel guides.
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "20px",
                        background: "linear-gradient(135deg, #8B4513, #D2691E)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                        fontSize: "24px",
                      }}
                    >
                      🤝
                    </div>
                    <Title
                      level={4}
                      style={{ fontSize: "16px", marginBottom: "12px" }}
                    >
                      Fair Partnership
                    </Title>
                    <Text style={{ color: "#5A6C7D" }}>
                      Transparent, mutually beneficial terms that support local
                      business growth.
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>

          {/* SUCCESS STORY */}
          <div style={{ marginBottom: 48 }}>
            <Card
              style={{
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.06)",
                textAlign: "center",
              }}
              bodyStyle={{ padding: 32 }}
            >
              <Title
                level={2}
                style={{ fontSize: "24px", marginBottom: "24px" }}
              >
                Partner Success Story
              </Title>

              <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                <blockquote
                  style={{
                    fontSize: "18px",
                    fontStyle: "italic",
                    color: "#5A6C7D",
                    lineHeight: 1.6,
                    margin: "24px 0",
                    padding: "24px",
                    background: "#f9f9f9",
                    borderRadius: "12px",
                    border: "none",
                  }}
                >
                  "Partnering with Ahangama Pass has brought us exactly the kind
                  of customers we want - travelers who appreciate quality food
                  and authentic experiences. Our revenue has increased by 35%
                  since joining, and we love being part of this community."
                </blockquote>
                <div style={{ marginTop: "16px" }}>
                  <Text strong style={{ color: "#8B4513" }}>
                    Maria Santos, Owner of Maria Bonita Restaurant
                  </Text>
                </div>
              </div>
            </Card>
          </div>

          {/* GET STARTED */}
          <div style={{ marginBottom: 48 }}>
            <Card
              style={{
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.06)",
                background:
                  "linear-gradient(135deg, rgba(139,69,19,0.05) 0%, rgba(210,105,30,0.05) 100%)",
                textAlign: "center",
              }}
              bodyStyle={{ padding: 40 }}
            >
              <Title
                level={2}
                style={{ fontSize: "24px", marginBottom: "16px" }}
              >
                Ready to Partner with Us?
              </Title>
              <Paragraph
                style={{
                  fontSize: "16px",
                  color: "#5A6C7D",
                  marginBottom: "32px",
                  maxWidth: "600px",
                  margin: "0 auto 32px",
                }}
              >
                Getting started is simple. Reach out to our partnership team and
                we'll schedule a conversation to discuss how we can work
                together to grow your business and enhance our travelers'
                experiences.
              </Paragraph>

              <div style={{ maxWidth: "500px", margin: "0 auto" }}>
                <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
                  <Col xs={24} md={8}>
                    <div style={{ padding: "16px" }}>
                      <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                        📞
                      </div>
                      <Text strong style={{ color: "#8B4513" }}>
                        Initial Consultation
                      </Text>
                      <br />
                      <Text style={{ color: "#5A6C7D", fontSize: "14px" }}>
                        Discuss your business and partnership benefits
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <div style={{ padding: "16px" }}>
                      <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                        📋
                      </div>
                      <Text strong style={{ color: "#8B4513" }}>
                        Partnership Agreement
                      </Text>
                      <br />
                      <Text style={{ color: "#5A6C7D", fontSize: "14px" }}>
                        Simple, transparent terms for both parties
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <div style={{ padding: "16px" }}>
                      <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                        🚀
                      </div>
                      <Text strong style={{ color: "#8B4513" }}>
                        Launch & Support
                      </Text>
                      <br />
                      <Text style={{ color: "#5A6C7D", fontSize: "14px" }}>
                        Setup help and partnership promotion
                      </Text>
                    </div>
                  </Col>
                </Row>

                <Space size={16}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<MailOutlined />}
                    href="mailto:partners@ahangamapass.com?subject=Partnership Inquiry"
                  >
                    Email Us
                  </Button>
                  <Button
                    size="large"
                    icon={<WhatsAppOutlined />}
                    style={{ color: "#25D366", borderColor: "#25D366" }}
                    href="https://wa.me/94777123456?text=Hi! I'm interested in partnering with Ahangama Pass. Can we schedule a call?"
                    target="_blank"
                  >
                    WhatsApp
                  </Button>
                </Space>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};

export default Partners;
