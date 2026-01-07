import React from "react";
import { Card, Row, Col, Typography, Button, Space } from "antd";
import { WhatsAppOutlined, CheckCircleOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Title, Paragraph, Text } = Typography;

const Partners = () => {
  const canonical = absUrl("/partners");

  return (
    <SiteLayout>
      <Seo
        title="Business Partners - Ahangama Pass"
        description="Join our partnership program. Grant a discount for cardholders, get free marketing exposure, and connect with quality travelers in Ahangama."
        canonical={canonical}
      />

      <div className="dm-heroCut" />
      <div className="dm-canvas">
        <div className="dm-wrap">
          {/* HERO SECTION */}
          <div className="ahg-hero" style={{ marginBottom: 48 }}>
            <div className="ahg-heroInner">
              <Row gutter={[24, 24]} align="middle">
                <Col xs={24} lg={14}>
                  <div className="ahg-pillRow">
                    <span className="ahg-pill-text">
                      🤝 Partnership Program
                    </span>
                    <span className="ahg-pill-text">📈 Free Marketing</span>
                    <span className="ahg-pill-text">👥 Quality Customers</span>
                  </div>

                  <Title
                    className="ahg-h1"
                    style={{ color: "var(--dm-ink)", marginBottom: "16px" }}
                  >
                    Partner with
                    <br />
                    Ahangama Pass
                  </Title>

                  <Paragraph
                    className="ahg-sub"
                    style={{ color: "var(--ink-muted)", marginBottom: "24px" }}
                  >
                    Join our curated network of quality businesses. Offer
                    discounts to our cardholders and get{" "}
                    <strong>free promotion</strong> across our platform and
                    marketing channels.
                  </Paragraph>

                  <Space wrap size={[12, 12]}>
                    <Button
                      size="large"
                      href="https://wa.me/94777908790?text=Hi! I'm interested in partnering with Ahangama Pass"
                      target="_blank"
                      icon={<WhatsAppOutlined />}
                      style={{
                        borderRadius: "12px",
                        borderColor: "#25D366",
                        color: "#25D366",
                      }}
                    >
                      WhatsApp Us
                    </Button>
                  </Space>

                  <div className="ahg-metrics">
                    <div className="ahg-metric">
                      <Text type="secondary">Minimum Discount</Text>
                      <div className="ahg-metricVal">10%</div>
                    </div>
                    <div className="ahg-metric">
                      <Text type="secondary">Marketing</Text>
                      <div className="ahg-metricVal">Free</div>
                    </div>
                    <div className="ahg-metric">
                      <Text type="secondary">Setup Cost</Text>
                      <div className="ahg-metricVal">$0</div>
                    </div>
                  </div>
                </Col>

                <Col xs={24} lg={10}>
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(79,111,134,0.1) 0%, rgba(203,106,58,0.1) 100%)",
                      borderRadius: "18px",
                      padding: "32px 24px",
                      textAlign: "center",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <div style={{ fontSize: "64px", marginBottom: "16px" }}>
                      🤝
                    </div>
                    <Title
                      level={3}
                      style={{ color: "var(--dm-ink)", marginBottom: "12px" }}
                    >
                      Ready to Partner?
                    </Title>
                    <Text
                      style={{ color: "var(--ink-muted)", fontSize: "16px" }}
                    >
                      Join our growing network of quality businesses and start
                      attracting more customers today.
                    </Text>
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          {/* HOW IT WORKS */}
          <div style={{ marginBottom: 64, textAlign: "center" }}>
            <Title
              level={2}
              style={{
                fontSize: "36px",
                marginBottom: "16px",
                color: "var(--dm-ink)",
                letterSpacing: "-0.02em",
              }}
            >
              How it works
            </Title>
            <Paragraph
              style={{
                fontSize: "18px",
                color: "var(--ink-muted)",
                marginBottom: "48px",
                maxWidth: "600px",
                margin: "0 auto 48px auto",
              }}
            >
              Three simple steps to start attracting quality customers and
              growing your business
            </Paragraph>

            <Row gutter={[32, 32]} justify="center">
              <Col xs={24} lg={8}>
                <Card
                  className="partners-feature-card"
                  style={{
                    borderRadius: "var(--dm-radius-lg)",
                    height: "100%",
                    background: "var(--dm-card)",
                    border: "1px solid var(--dm-line)",
                    boxShadow: "var(--dm-shadow)",
                  }}
                  bodyStyle={{ padding: "40px 32px", textAlign: "center" }}
                  hoverable
                >
                  <div
                    style={{
                      fontSize: "56px",
                      marginBottom: "20px",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                  >
                    🤝
                  </div>
                  <Title
                    level={3}
                    style={{
                      color: "var(--dm-ink)",
                      marginBottom: "16px",
                      fontSize: "24px",
                    }}
                  >
                    1. Grant Discount
                  </Title>
                  <Paragraph
                    style={{
                      color: "var(--ink-muted)",
                      fontSize: "16px",
                      lineHeight: "1.6",
                    }}
                  >
                    Simply offer a minimum 10% discount to Ahangama Pass
                    holders. Easy to implement, immediate results.
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card
                  className="partners-feature-card"
                  style={{
                    borderRadius: "var(--dm-radius-lg)",
                    height: "100%",
                    background: "var(--dm-card)",
                    border: "1px solid var(--dm-line)",
                    boxShadow: "var(--dm-shadow)",
                  }}
                  bodyStyle={{ padding: "40px 32px", textAlign: "center" }}
                  hoverable
                >
                  <div
                    style={{
                      fontSize: "56px",
                      marginBottom: "20px",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                  >
                    📢
                  </div>
                  <Title
                    level={3}
                    style={{
                      color: "var(--dm-ink)",
                      marginBottom: "16px",
                      fontSize: "24px",
                    }}
                  >
                    2. Free Promotion
                  </Title>
                  <Paragraph
                    style={{
                      color: "var(--ink-muted)",
                      fontSize: "16px",
                      lineHeight: "1.6",
                    }}
                  >
                    We promote your business at no cost across Ahangama.com, our
                    social media and marketing channels, and through on-ground
                    promotions.
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card
                  className="partners-feature-card"
                  style={{
                    borderRadius: "var(--dm-radius-lg)",
                    height: "100%",
                    background: "var(--dm-card)",
                    border: "1px solid var(--dm-line)",
                    boxShadow: "var(--dm-shadow)",
                  }}
                  bodyStyle={{ padding: "40px 32px", textAlign: "center" }}
                  hoverable
                >
                  <div
                    style={{
                      fontSize: "56px",
                      marginBottom: "20px",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                  >
                    🎉
                  </div>
                  <Title
                    level={3}
                    style={{
                      color: "var(--dm-ink)",
                      marginBottom: "16px",
                      fontSize: "24px",
                    }}
                  >
                    3. Enjoy Results
                  </Title>
                  <Paragraph
                    style={{
                      color: "var(--ink-muted)",
                      fontSize: "16px",
                      lineHeight: "1.6",
                    }}
                  >
                    Watch as travelers visit your business, enjoy the discount,
                    and become loyal customers.
                  </Paragraph>
                </Card>
              </Col>
            </Row>
          </div>

          {/* WHY BECOME A PARTNER */}
          <div style={{ marginBottom: 64 }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <Title
                level={2}
                style={{
                  fontSize: "36px",
                  marginBottom: "16px",
                  color: "var(--dm-ink)",
                  letterSpacing: "-0.02em",
                }}
              >
                Why become an Ahangama Pass Partner?
              </Title>
              <Paragraph
                style={{
                  fontSize: "18px",
                  color: "var(--ink-muted)",
                  maxWidth: "700px",
                  margin: "0 auto",
                }}
              >
                Join a network of quality businesses and unlock growth
                opportunities
              </Paragraph>
            </div>

            <Row gutter={[32, 32]}>
              <Col xs={24} lg={8}>
                <Card
                  className="partners-benefit-card"
                  style={{
                    textAlign: "center",
                    height: "100%",
                    borderRadius: "var(--dm-radius-lg)",
                    background: "var(--dm-card)",
                    border: "1px solid var(--dm-line)",
                    boxShadow: "var(--dm-shadow)",
                  }}
                  bodyStyle={{ padding: "40px 32px" }}
                  hoverable
                >
                  <div
                    style={{
                      fontSize: "56px",
                      marginBottom: "20px",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                  >
                    👥
                  </div>
                  <Title
                    level={3}
                    style={{
                      color: "var(--dm-ink)",
                      marginBottom: "16px",
                      fontSize: "24px",
                    }}
                  >
                    More Customers
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: "16px",
                      color: "var(--ink-muted)",
                      lineHeight: "1.6",
                    }}
                  >
                    Connect with tourists and locals who actively seek authentic
                    experiences and value in Ahangama.
                  </Paragraph>
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card
                  className="partners-benefit-card"
                  style={{
                    textAlign: "center",
                    height: "100%",
                    borderRadius: "var(--dm-radius-lg)",
                    background: "var(--dm-card)",
                    border: "1px solid var(--dm-line)",
                    boxShadow: "var(--dm-shadow)",
                  }}
                  bodyStyle={{ padding: "40px 32px" }}
                  hoverable
                >
                  <div
                    style={{
                      fontSize: "56px",
                      marginBottom: "20px",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                  >
                    📣
                  </div>
                  <Title
                    level={3}
                    style={{
                      color: "var(--dm-ink)",
                      marginBottom: "16px",
                      fontSize: "24px",
                    }}
                  >
                    Free Marketing Exposure
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: "16px",
                      color: "var(--ink-muted)",
                      lineHeight: "1.6",
                    }}
                  >
                    Get featured on our platform and social media channels
                    without any advertising costs.
                  </Paragraph>
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card
                  className="partners-benefit-card"
                  style={{
                    textAlign: "center",
                    height: "100%",
                    borderRadius: "var(--dm-radius-lg)",
                    background: "var(--dm-card)",
                    border: "1px solid var(--dm-line)",
                    boxShadow: "var(--dm-shadow)",
                  }}
                  bodyStyle={{ padding: "40px 32px" }}
                  hoverable
                >
                  <div
                    style={{
                      fontSize: "56px",
                      marginBottom: "20px",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                  >
                    ⭐
                  </div>
                  <Title
                    level={3}
                    style={{
                      color: "var(--dm-ink)",
                      marginBottom: "16px",
                      fontSize: "24px",
                    }}
                  >
                    Mark of Quality
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: "16px",
                      color: "var(--ink-muted)",
                      lineHeight: "1.6",
                    }}
                  >
                    Being an Ahangama Pass partner signals quality and
                    trustworthiness to visitors.
                  </Paragraph>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card
                  className="partners-benefit-card"
                  style={{
                    textAlign: "center",
                    height: "100%",
                    borderRadius: "var(--dm-radius-lg)",
                    background: "var(--dm-card)",
                    border: "1px solid var(--dm-line)",
                    boxShadow: "var(--dm-shadow)",
                  }}
                  bodyStyle={{ padding: "40px 32px" }}
                  hoverable
                >
                  <div
                    style={{
                      fontSize: "56px",
                      marginBottom: "20px",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                  >
                    🚀
                  </div>
                  <Title
                    level={3}
                    style={{
                      color: "var(--dm-ink)",
                      marginBottom: "16px",
                      fontSize: "24px",
                    }}
                  >
                    Direct Bookings & Enquiries
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: "16px",
                      color: "var(--ink-muted)",
                      lineHeight: "1.6",
                    }}
                  >
                    Drive traffic and enquiries directly to your own website.
                  </Paragraph>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card
                  className="partners-benefit-card"
                  style={{
                    textAlign: "center",
                    height: "100%",
                    borderRadius: "var(--dm-radius-lg)",
                    background: "var(--dm-card)",
                    border: "1px solid var(--dm-line)",
                    boxShadow: "var(--dm-shadow)",
                  }}
                  bodyStyle={{ padding: "40px 32px" }}
                  hoverable
                >
                  <div
                    style={{
                      fontSize: "56px",
                      marginBottom: "20px",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                  >
                    📞
                  </div>
                  <Title
                    level={3}
                    style={{
                      color: "var(--dm-ink)",
                      marginBottom: "16px",
                      fontSize: "24px",
                    }}
                  >
                    Direct Customer Contact
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: "16px",
                      color: "var(--ink-muted)",
                      lineHeight: "1.6",
                    }}
                  >
                    Build lasting relationships with customers while we handle
                    the promotional aspects.
                  </Paragraph>
                </Card>
              </Col>
            </Row>

            {/* <div style={{ textAlign: "center", marginTop: "48px" }}>
              <Button
                type="primary"
                size="large"
                href="mailto:partners@ahangama.com?subject=Partnership Application"
                icon={<MailOutlined />}
                style={{
                  fontSize: "18px",
                  height: "48px",
                  padding: "0 32px",
                  borderRadius: "12px",
                }}
              >
                Sign-up as Ahangama Pass Partner
              </Button>
            </div> */}
          </div>

          {/* BASIC TERMS & CONDITIONS */}
          <div style={{ marginBottom: 64 }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <Title
                level={2}
                style={{
                  fontSize: "36px",
                  marginBottom: "16px",
                  color: "var(--dm-ink)",
                  letterSpacing: "-0.02em",
                }}
              >
                Partnership Terms & Conditions
              </Title>
              <Paragraph
                style={{
                  fontSize: "18px",
                  color: "var(--ink-muted)",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Simple, transparent terms for a mutually beneficial partnership
              </Paragraph>
            </div>

            <Row justify="center">
              <Col xs={24} lg={20}>
                <Card
                  style={{
                    borderRadius: "var(--dm-radius-lg)",
                    background: "var(--dm-card)",
                    border: "1px solid var(--dm-line)",
                    boxShadow: "var(--dm-shadow)",
                  }}
                  bodyStyle={{ padding: "48px 40px" }}
                >
                  <Space
                    direction="vertical"
                    size={24}
                    style={{ width: "100%" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "16px",
                      }}
                    >
                      <CheckCircleOutlined
                        style={{
                          color: "var(--ocean-blue)",
                          fontSize: "24px",
                          marginTop: "2px",
                        }}
                      />
                      <Text
                        style={{
                          fontSize: "16px",
                          color: "var(--dm-ink)",
                          lineHeight: "1.6",
                        }}
                      >
                        Cardholders present their valid digital pass to receive
                        the agreed discount
                      </Text>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "16px",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "24px",
                          marginTop: "2px",
                        }}
                      >
                        👥
                      </Text>
                      <Text
                        style={{
                          fontSize: "16px",
                          color: "var(--dm-ink)",
                          lineHeight: "1.6",
                        }}
                      >
                        Each cardholder can include up to 4 additional guests
                        (total: 5 people per card)
                      </Text>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "16px",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "24px",
                          marginTop: "2px",
                        }}
                      >
                        📱
                      </Text>
                      <Text
                        style={{
                          fontSize: "16px",
                          color: "var(--dm-ink)",
                          lineHeight: "1.6",
                        }}
                      >
                        Staff may request to see the digital card for
                        verification
                      </Text>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "16px",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "24px",
                          marginTop: "2px",
                        }}
                      >
                        🕒
                      </Text>
                      <Text
                        style={{
                          fontSize: "16px",
                          color: "var(--dm-ink)",
                          lineHeight: "1.6",
                        }}
                      >
                        Partners may restrict discounts to specific hours,
                        products, or periods (e.g. Happy Hour)
                      </Text>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "16px",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "24px",
                          marginTop: "2px",
                        }}
                      >
                        ✉️
                      </Text>
                      <Text
                        style={{
                          fontSize: "16px",
                          color: "var(--dm-ink)",
                          lineHeight: "1.6",
                        }}
                      >
                        Discount or benefit changes require 1 month's written
                        notice
                      </Text>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "16px",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "24px",
                          marginTop: "2px",
                        }}
                      >
                        🔁
                      </Text>
                      <Text
                        style={{
                          fontSize: "16px",
                          color: "var(--dm-ink)",
                          lineHeight: "1.6",
                        }}
                      >
                        Minimum 10% discount must be maintained at all times
                      </Text>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "16px",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "24px",
                          marginTop: "2px",
                        }}
                      >
                        📅
                      </Text>
                      <Text
                        style={{
                          fontSize: "16px",
                          color: "var(--dm-ink)",
                          lineHeight: "1.6",
                        }}
                      >
                        Partnership can be cancelled by either party with 3
                        months' notice
                      </Text>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "16px",
                      }}
                    >
                      <CheckCircleOutlined
                        style={{
                          color: "var(--ocean-blue)",
                          fontSize: "24px",
                          marginTop: "2px",
                        }}
                      />
                      <Text
                        style={{
                          fontSize: "16px",
                          color: "var(--dm-ink)",
                          lineHeight: "1.6",
                        }}
                      >
                        Active partners are featured on ahangama.com website and
                        listings
                      </Text>
                    </div>

                    <div
                      style={{
                        marginTop: "40px",
                        padding: "32px",
                        background:
                          "linear-gradient(135deg, rgba(79,111,134,0.08) 0%, rgba(203,106,58,0.08) 100%)",
                        borderRadius: "16px",
                        textAlign: "center",
                        border: "1px solid var(--dm-line-2)",
                      }}
                    >
                      <div style={{ marginBottom: "16px" }}>
                        <CheckCircleOutlined
                          style={{
                            color: "var(--ocean-blue)",
                            fontSize: "24px",
                            marginRight: "12px",
                          }}
                        />
                        <Text
                          strong
                          style={{
                            fontSize: "18px",
                            color: "var(--dm-ink)",
                          }}
                        >
                          By submitting your application, you agree to these
                          terms and conditions
                        </Text>
                      </div>
                      <Text
                        style={{
                          fontSize: "14px",
                          color: "var(--ink-muted)",
                        }}
                      >
                        All changes or cancellation requests must be sent to{" "}
                        <a
                          href="mailto:partners@ahangama.com"
                          style={{
                            color: "var(--ocean-blue)",
                            textDecoration: "none",
                            fontWeight: "500",
                          }}
                        >
                          partners@ahangama.com
                        </a>
                      </Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </div>

          {/* FINAL CTA */}
          <div
            style={{
              textAlign: "center",
              marginBottom: 64,
              padding: "48px 32px",
              background:
                "linear-gradient(135deg, rgba(79,111,134,0.05) 0%, rgba(203,106,58,0.05) 100%)",
              borderRadius: "var(--dm-radius-lg)",
              border: "1px solid var(--dm-line)",
            }}
          >
            <div style={{ fontSize: "56px", marginBottom: "24px" }}>🚀</div>
            <Title
              level={2}
              style={{
                fontSize: "32px",
                marginBottom: "16px",
                color: "var(--dm-ink)",
                letterSpacing: "-0.02em",
              }}
            >
              Ready to grow your business?
            </Title>
            <Paragraph
              style={{
                fontSize: "18px",
                color: "var(--ink-muted)",
                marginBottom: "32px",
                maxWidth: "500px",
                margin: "0 auto 32px auto",
              }}
            >
              Join our partnership program today and start attracting quality
              customers
            </Paragraph>
            <Space size={16} wrap>
              {/* <Button
                type="primary"
                size="large"
                href="mailto:partners@ahangama.com?subject=Partnership Application"
                icon={<MailOutlined />}
                style={{
                  borderRadius: "12px",
                  fontSize: "16px",
                  height: "48px",
                  padding: "0 24px",
                }}
              >
                Apply as Partner
              </Button> */}
              <Button
                size="large"
                icon={<WhatsAppOutlined />}
                style={{
                  borderRadius: "12px",
                  fontSize: "16px",
                  height: "48px",
                  padding: "0 24px",
                  color: "#25D366",
                  borderColor: "#25D366",
                }}
                href="https://wa.me/94777908790?text=Hi! I'm interested in partnering with Ahangama Pass"
                target="_blank"
              >
                WhatsApp Us
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};

export default Partners;
