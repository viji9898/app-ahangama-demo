import React from "react";
import { Row, Col, Typography, Space, Button, Divider } from "antd";
import { trackPassCtaClick } from "../../analytics";
import { buildPassCtaUrl } from "../../lib/passAttribution";

const { Text } = Typography;

export default function FooterBar() {
  const passCtaUrl = buildPassCtaUrl();

  return (
    <div
      style={{
        background: "transparent",
        padding: "56px 16px 28px 16px",
        marginTop: "72px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Main Footer Card */}
        <div
          style={{
            background: "var(--editorial-surface, #fbf8f2)",
            borderRadius: "28px",
            padding: "36px",
            border: "1px solid var(--editorial-line, rgba(32, 30, 27, 0.08))",
            boxShadow: "var(--editorial-shadow-soft, 0 10px 24px rgba(32, 30, 27, 0.06))",
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
                      fontSize: "28px",
                      color: "var(--ink-primary, #1f2a24)",
                      display: "block",
                      marginBottom: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      fontFamily:
                        '"Cormorant Garamond", "Libre Baskerville", Georgia, serif',
                    }}
                  >
                    ahangama.com
                  </Text>
                  <Text
                    style={{
                      color: "var(--ink-muted, #6b6f6a)",
                      fontSize: "15px",
                      lineHeight: "1.8",
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
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
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
                      letterSpacing: "0.01em",
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
                    href="/partners-knowledge"
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
                    Partner knowledge base
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
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  Connect
                </Text>
                <Button
                  block
                  href="https://www.instagram.com/ahangama.pass"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "rgba(255,255,255,0.58)",
                    border: "1px solid rgba(31, 42, 36, 0.1)",
                    color: "var(--ink-primary, #1f2a24)",
                    borderRadius: "999px",
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
                  href={passCtaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackPassCtaClick({
                      ctaLocation: "footer",
                      destinationUrl: passCtaUrl,
                    });
                  }}
                  style={{
                    background: "#1f1d1a",
                    border: "1px solid rgba(31, 29, 26, 0.12)",
                    borderRadius: "999px",
                    height: "44px",
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    boxShadow: "0 8px 18px rgba(31, 29, 26, 0.12)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#2a2723";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 10px 20px rgba(31, 29, 26, 0.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#1f1d1a";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 8px 18px rgba(31, 29, 26, 0.12)";
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
