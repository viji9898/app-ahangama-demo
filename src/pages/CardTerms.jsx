import React from "react";
import { Card, Typography, Divider, Space, Button } from "antd";
import { ArrowLeftOutlined, SafetyOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Title, Paragraph, Text } = Typography;

const CardTerms = () => {
  const canonical = absUrl("/card/terms");

  return (
    <SiteLayout>
      <Seo
        title="Card Terms & Conditions - Ahangama Pass"
        description="Terms and conditions for the Ahangama Pass card including usage policies, refund terms, and partner conditions."
        canonical={canonical}
      />

      <div className="dm-heroCut" />
      <div className="dm-canvas">
        <div className="dm-wrap">
          {/* BACK BUTTON & HEADER */}
          <div style={{ marginBottom: 32 }}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              href="/card"
              style={{ marginBottom: 16, padding: 0 }}
            >
              Back to Card Options
            </Button>

            <Card
              style={{
                borderRadius: 18,
                border: "1px solid rgba(0,0,0,0.06)",
                background:
                  "linear-gradient(135deg, rgba(255,248,220,0.3) 0%, rgba(255,255,255,0.8) 100%)",
              }}
              bodyStyle={{ padding: 32 }}
            >
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
                  <SafetyOutlined style={{ color: "white" }} />
                </div>
                <div>
                  <Title level={1} style={{ margin: 0, fontSize: "28px" }}>
                    Terms & Conditions
                  </Title>
                  <Text type="secondary" style={{ fontSize: "16px" }}>
                    Ahangama Pass Card
                  </Text>
                </div>
              </div>

              <Paragraph
                style={{
                  fontSize: "16px",
                  lineHeight: 1.6,
                  color: "#5A6C7D",
                  marginBottom: 0,
                }}
              >
                Please read these terms and conditions carefully before
                purchasing or using your Ahangama Pass card. Last updated:
                January 2, 2026
              </Paragraph>
            </Card>
          </div>

          {/* TERMS CONTENT */}
          <div style={{ maxWidth: "800px" }}>
            {/* Card Usage Terms */}
            <Card
              style={{
                marginBottom: 24,
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.06)",
              }}
              bodyStyle={{ padding: 24 }}
            >
              <Title
                level={2}
                style={{
                  fontSize: "20px",
                  marginBottom: "16px",
                  color: "#8B4513",
                }}
              >
                1. Card Usage & Validity
              </Title>

              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <div>
                  <Text strong style={{ color: "#8B4513" }}>
                    Validity Period:
                  </Text>
                  <Paragraph style={{ marginBottom: 8, marginTop: 4 }}>
                    • Standard Pass: Valid for 30 days from date of purchase
                    <br />
                    • Premium Pass: Valid for 60 days from date of purchase
                    <br />• Digital passes expire at 11:59 PM on the last valid
                    day
                  </Paragraph>
                </div>

                <div>
                  <Text strong style={{ color: "#8B4513" }}>
                    Usage Requirements:
                  </Text>
                  <Paragraph style={{ marginBottom: 8, marginTop: 4 }}>
                    • Pass must be presented (digitally or physically) at
                    participating venues
                    <br />
                    • Valid government-issued photo ID may be required alongside
                    your pass
                    <br />
                    • One discount per visit per venue unless otherwise
                    specified
                    <br />• Cannot be combined with other promotional offers
                  </Paragraph>
                </div>

                <div>
                  <Text strong style={{ color: "#8B4513" }}>
                    Digital Pass:
                  </Text>
                  <Paragraph style={{ marginBottom: 0, marginTop: 4 }}>
                    • QR code must be scanned by venue staff for discount
                    validation
                    <br />
                    • Screenshots or photocopies are not valid - live digital
                    pass required
                    <br />• Pass holder is responsible for ensuring device
                    battery and connectivity
                  </Paragraph>
                </div>
              </Space>
            </Card>

            {/* Partner Venue Terms */}
            <Card
              style={{
                marginBottom: 24,
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.06)",
              }}
              bodyStyle={{ padding: 24 }}
            >
              <Title
                level={2}
                style={{
                  fontSize: "20px",
                  marginBottom: "16px",
                  color: "#8B4513",
                }}
              >
                2. Partner Venue Conditions
              </Title>

              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <div>
                  <Text strong style={{ color: "#8B4513" }}>
                    Discount Limitations:
                  </Text>
                  <Paragraph style={{ marginBottom: 8, marginTop: 4 }}>
                    • Discounts apply only to items specified by each venue
                    <br />
                    • Some exclusions may apply (alcohol, special menu items,
                    etc.)
                    <br />
                    • Venues reserve the right to modify offers with 24-hour
                    notice
                    <br />• Peak season or special event restrictions may apply
                  </Paragraph>
                </div>

                <div>
                  <Text strong style={{ color: "#8B4513" }}>
                    Venue Policies:
                  </Text>
                  <Paragraph style={{ marginBottom: 8, marginTop: 4 }}>
                    • All venue-specific terms and conditions apply
                    <br />
                    • Venues may refuse service for any legitimate business
                    reason
                    <br />
                    • Reservations may be required at some locations
                    <br />• Operating hours and availability subject to venue
                    schedules
                  </Paragraph>
                </div>

                <div>
                  <Text strong style={{ color: "#8B4513" }}>
                    Network Changes:
                  </Text>
                  <Paragraph style={{ marginBottom: 0, marginTop: 4 }}>
                    • Partner venues may be added or removed from the network
                    <br />
                    • We will provide reasonable notice of significant network
                    changes
                    <br />• Temporary closures or unavailability not grounds for
                    refund
                  </Paragraph>
                </div>
              </Space>
            </Card>

            {/* Purchase & Refund Policy */}
            <Card
              style={{
                marginBottom: 24,
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.06)",
              }}
              bodyStyle={{ padding: 24 }}
            >
              <Title
                level={2}
                style={{
                  fontSize: "20px",
                  marginBottom: "16px",
                  color: "#8B4513",
                }}
              >
                3. Purchase & Refund Policy
              </Title>

              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <div>
                  <Text strong style={{ color: "#8B4513" }}>
                    Payment:
                  </Text>
                  <Paragraph style={{ marginBottom: 8, marginTop: 4 }}>
                    • All purchases processed securely through Stripe
                    <br />
                    • Prices listed in USD and subject to applicable taxes
                    <br />
                    • Payment confirmation required before pass activation
                    <br />• We do not store credit card information
                  </Paragraph>
                </div>

                <div>
                  <Text strong style={{ color: "#8B4513" }}>
                    Refund Conditions:
                  </Text>
                  <Paragraph style={{ marginBottom: 8, marginTop: 4 }}>
                    • Full refund available within 24 hours of purchase if
                    unused
                    <br />
                    • No refunds available once pass has been used at any venue
                    <br />
                    • Refunds processed to original payment method within 5-10
                    business days
                    <br />• Administrative fee of $2 USD may apply to refund
                    processing
                  </Paragraph>
                </div>

                <div>
                  <Text strong style={{ color: "#8B4513" }}>
                    Non-Transferable:
                  </Text>
                  <Paragraph style={{ marginBottom: 0, marginTop: 4 }}>
                    • Passes are non-transferable between individuals
                    <br />
                    • Each pass tied to purchaser's email address
                    <br />• Sharing or selling passes to others is prohibited
                  </Paragraph>
                </div>
              </Space>
            </Card>

            {/* User Responsibilities */}
            <Card
              style={{
                marginBottom: 24,
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.06)",
              }}
              bodyStyle={{ padding: 24 }}
            >
              <Title
                level={2}
                style={{
                  fontSize: "20px",
                  marginBottom: "16px",
                  color: "#8B4513",
                }}
              >
                4. User Responsibilities
              </Title>

              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <div>
                  <Text strong style={{ color: "#8B4513" }}>
                    Proper Usage:
                  </Text>
                  <Paragraph style={{ marginBottom: 8, marginTop: 4 }}>
                    • Use pass only for personal consumption and experiences
                    <br />
                    • Treat partner venue staff with respect and courtesy
                    <br />
                    • Follow all local laws and venue-specific rules
                    <br />• Do not attempt to manipulate or duplicate digital
                    passes
                  </Paragraph>
                </div>

                <div>
                  <Text strong style={{ color: "#8B4513" }}>
                    Account Security:
                  </Text>
                  <Paragraph style={{ marginBottom: 8, marginTop: 4 }}>
                    • Keep login credentials secure and confidential
                    <br />
                    • Report lost or compromised passes immediately
                    <br />
                    • Notify us of any unauthorized usage
                    <br />• Provide accurate contact information for pass
                    delivery
                  </Paragraph>
                </div>

                <div>
                  <Text strong style={{ color: "#8B4513" }}>
                    Prohibited Activities:
                  </Text>
                  <Paragraph style={{ marginBottom: 0, marginTop: 4 }}>
                    • Commercial resale or redistribution of passes
                    <br />
                    • Fraudulent use or attempted system manipulation
                    <br />
                    • Harassment of venue staff or other customers
                    <br />• Any activity that damages our reputation or
                    relationships
                  </Paragraph>
                </div>
              </Space>
            </Card>

            {/* Limitation of Liability */}
            <Card
              style={{
                marginBottom: 24,
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.06)",
              }}
              bodyStyle={{ padding: 24 }}
            >
              <Title
                level={2}
                style={{
                  fontSize: "20px",
                  marginBottom: "16px",
                  color: "#8B4513",
                }}
              >
                5. Limitation of Liability
              </Title>

              <Paragraph style={{ marginBottom: 16 }}>
                <Text strong style={{ color: "#8B4513" }}>
                  Service Availability:
                </Text>
                <br />
                We strive to maintain consistent service but cannot guarantee
                uninterrupted access to partner venues or digital services.
                System maintenance, technical issues, or partner availability
                may temporarily affect service.
              </Paragraph>

              <Paragraph style={{ marginBottom: 16 }}>
                <Text strong style={{ color: "#8B4513" }}>
                  Third-Party Services:
                </Text>
                <br />
                Partner venues are independent businesses. We are not
                responsible for their service quality, policies, or any
                incidents that occur on their premises. Direct any
                venue-specific concerns to the establishment.
              </Paragraph>

              <Paragraph style={{ marginBottom: 0 }}>
                <Text strong style={{ color: "#8B4513" }}>
                  Maximum Liability:
                </Text>
                <br />
                Our total liability is limited to the amount paid for your pass.
                We are not liable for indirect, incidental, or consequential
                damages arising from pass usage.
              </Paragraph>
            </Card>

            {/* Contact & Changes */}
            <Card
              style={{
                marginBottom: 40,
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.06)",
                background:
                  "linear-gradient(135deg, rgba(139,69,19,0.05) 0%, rgba(210,105,30,0.05) 100%)",
              }}
              bodyStyle={{ padding: 24 }}
            >
              <Title
                level={2}
                style={{
                  fontSize: "20px",
                  marginBottom: "16px",
                  color: "#8B4513",
                }}
              >
                6. Changes & Contact
              </Title>

              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <div>
                  <Text strong style={{ color: "#8B4513" }}>
                    Terms Updates:
                  </Text>
                  <Paragraph style={{ marginBottom: 8, marginTop: 4 }}>
                    We may update these terms periodically. Significant changes
                    will be communicated via email to active pass holders.
                    Continued use of the service constitutes acceptance of
                    updated terms.
                  </Paragraph>
                </div>

                <div>
                  <Text strong style={{ color: "#8B4513" }}>
                    Governing Law:
                  </Text>
                  <Paragraph style={{ marginBottom: 8, marginTop: 4 }}>
                    These terms are governed by the laws of Sri Lanka. Any
                    disputes will be resolved through local jurisdiction or
                    binding arbitration as appropriate.
                  </Paragraph>
                </div>

                <Divider />

                <div style={{ textAlign: "center" }}>
                  <Text strong style={{ color: "#8B4513", fontSize: "16px" }}>
                    Questions or Concerns?
                  </Text>
                  <Paragraph style={{ marginTop: 8, marginBottom: 16 }}>
                    Contact our support team for assistance with your pass or
                    these terms.
                  </Paragraph>

                  <Space size="middle">
                    <Button
                      type="primary"
                      href="mailto:support@ahangamapass.com?subject=Card Terms Question"
                    >
                      Email Support
                    </Button>
                    <Button
                      href="https://wa.me/94777123456?text=I have a question about the card terms"
                      target="_blank"
                      style={{ color: "#25D366", borderColor: "#25D366" }}
                    >
                      WhatsApp
                    </Button>
                  </Space>
                </div>
              </Space>
            </Card>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};

export default CardTerms;
