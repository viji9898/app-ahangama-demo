import React from "react";
import { Row, Col, Typography, Space, Button, Divider } from "antd";

const { Text } = Typography;

export default function FooterBar() {
  return (
    <div
      style={{
        background: "var(--bg-sand, #f4f1ec)",
        padding: "32px 16px 24px 16px",
        marginTop: "48px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Main Footer Card */}
        <div
          style={{
            background: "var(--bg-card, #faf8f4)",
            borderRadius: "22px",
            padding: "32px",
            border: "1px solid rgba(31, 42, 36, 0.08)",
            boxShadow: "0 12px 32px rgba(31, 42, 36, 0.08)",
            marginBottom: "24px",
          }}
        >
          <Row gutter={[32, 24]}>
            <Col xs={24} md={10}>
              <Space direction="vertical" size={16}>
                <div>
                  <Text
                    strong
                    style={{
                      fontSize: "24px",
                      color: "var(--ink-primary, #1f2a24)",
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: 700,
                    }}
                  >
                    ahangama.com
                  </Text>
                  <Text
                    style={{
                      color: "var(--ink-muted, #6b6f6a)",
                      fontSize: "16px",
                      lineHeight: "1.6",
                    }}
                  >
                    Curated destination guides + local privileges for
                    independent travellers.
                  </Text>
                </div>
              </Space>
            </Col>

            <Col xs={24} md={8}>
              <Space direction="vertical" size={16}>
                <Text
                  strong
                  style={{
                    color: "var(--ink-primary, #1f2a24)",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  Quick Links
                </Text>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <a
                    href="/about"
                    style={{
                      color: "var(--ink-muted, #6b6f6a)",
                      textDecoration: "none",
                      fontSize: "15px",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = "var(--ocean-blue, #4f6f86)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = "var(--ink-muted, #6b6f6a)")
                    }
                  >
                    About
                  </a>
                  <a
                    href="/partners"
                    style={{
                      color: "var(--ink-muted, #6b6f6a)",
                      textDecoration: "none",
                      fontSize: "15px",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = "var(--ocean-blue, #4f6f86)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = "var(--ink-muted, #6b6f6a)")
                    }
                  >
                    Partner with us
                  </a>
                  <a
                    href="/card/terms"
                    style={{
                      color: "var(--ink-muted, #6b6f6a)",
                      textDecoration: "none",
                      fontSize: "15px",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = "var(--ocean-blue, #4f6f86)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = "var(--ink-muted, #6b6f6a)")
                    }
                  >
                    Card terms
                  </a>
                  {/* <a
                    href="/contact"
                    style={{
                      color: "var(--ink-muted, #6b6f6a)",
                      textDecoration: "none",
                      fontSize: "15px",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = "var(--ocean-blue, #4f6f86)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = "var(--ink-muted, #6b6f6a)")
                    }
                  >
                    Contact
                  </a> */}
                </div>
              </Space>
            </Col>

            <Col xs={24} md={6}>
              <Space direction="vertical" style={{ width: "100%" }} size={16}>
                <Text
                  strong
                  style={{
                    color: "var(--ink-primary, #1f2a24)",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  Connect
                </Text>
                <Button
                  block
                  href="https://www.instagram.com/ahan.gama/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(31, 42, 36, 0.12)",
                    color: "var(--ink-muted, #6b6f6a)",
                    borderRadius: "16px",
                    height: "44px",
                    fontSize: "15px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "var(--ocean-blue, #4f6f86)";
                    e.target.style.color = "var(--ocean-blue, #4f6f86)";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 4px 12px rgba(79, 111, 134, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "rgba(31, 42, 36, 0.12)";
                    e.target.style.color = "var(--ink-muted, #6b6f6a)";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  Instagram
                </Button>
                <Button
                  block
                  type="primary"
                  href="/card"
                  style={{
                    background: "var(--ocean-blue, #4f6f86)",
                    border: "none",
                    borderRadius: "16px",
                    height: "44px",
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(79, 111, 134, 0.25)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background =
                      "var(--ocean-blue-hover, #435f73)";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 6px 20px rgba(79, 111, 134, 0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "var(--ocean-blue, #4f6f86)";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 4px 12px rgba(79, 111, 134, 0.25)";
                  }}
                >
                  Get the Card
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Copyright */}
        <div style={{ textAlign: "center" }}>
          <Text
            style={{
              fontSize: "14px",
              color: "var(--ink-muted, #6b6f6a)",
              opacity: 0.8,
            }}
          >
            © {new Date().getFullYear()} ahangama.com -{" "}
            <a
              href="https://viji.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "14px",
                color: "var(--ink-muted, #6b6f6a)",
                opacity: 0.8,
              }}
            >
              VIJI -
            </a>
          </Text>
        </div>
      </div>
    </div>
  );
}
