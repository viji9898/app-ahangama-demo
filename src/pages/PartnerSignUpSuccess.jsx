import React from "react";
import { Link } from "react-router-dom";
import { Result, Button, Card, Typography, Space } from "antd";
import {
  CheckCircleOutlined,
  WhatsAppOutlined,
  MailOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";

const { Title, Text, Paragraph } = Typography;

export default function PartnerSignUpSuccess() {
  return (
    <SiteLayout>
      <div
        style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto" }}
      >
        <Result
          status="success"
          title={
            <Title level={2} style={{ color: "#52c41a", marginBottom: 0 }}>
              🎉 Welcome to the Ahangama Pass Partner Network!
            </Title>
          }
          subTitle={
            <div style={{ marginTop: "24px" }}>
              <Paragraph style={{ fontSize: "16px", marginBottom: "24px" }}>
                Thank you for joining our partner program! Your venue is now{" "}
                <strong>live as an Ahangama Pass partner</strong>.
              </Paragraph>
            </div>
          }
          extra={[
            <Link key="home" to="/">
              <Button type="primary" size="large" icon={<HomeOutlined />}>
                Back to Home
              </Button>
            </Link>,
            <Link key="partners" to="/partners">
              <Button size="large">View All Partners</Button>
            </Link>,
          ]}
        />

        <div style={{ marginTop: "40px" }}>
          <Card>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div>
                <Title level={4}>
                  <CheckCircleOutlined
                    style={{ color: "#52c41a", marginRight: "8px" }}
                  />
                  What's Next?
                </Title>
                <Paragraph>
                  You'll receive a confirmation email with onboarding details,
                  next steps, partner terms, and support contact information.
                </Paragraph>
              </div>

              <div>
                <Title level={4}>
                  <MailOutlined
                    style={{ color: "#1890ff", marginRight: "8px" }}
                  />
                  Confirmation Email Sent
                </Title>
                <Paragraph>
                  We've sent a welcome email to your address with next steps,
                  onboarding guidance, partner terms, and support contact
                  details. Please check your inbox and spam folder.
                </Paragraph>
              </div>

              <div>
                <Title level={4}>
                  <WhatsAppOutlined
                    style={{ color: "#25d366", marginRight: "8px" }}
                  />
                  Partner Support
                </Title>
                <Paragraph>
                  Need help or have questions? Our partner support team is ready
                  to assist:
                </Paragraph>
                <div
                  style={{
                    background: "#f0f9ff",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid #d1ecf1",
                  }}
                >
                  <Text strong style={{ fontSize: "16px" }}>
                    📱 WhatsApp: +94 77 790 8790
                  </Text>
                  <br />
                  <Text type="secondary">
                    Available for offer updates, marketing materials, staff
                    guidance, and any questions
                  </Text>
                </div>
              </div>

              <div>
                <Title level={4}>Venue Visibility</Title>
                <Paragraph>
                  Your venue will be featured across{" "}
                  <strong>Ahangama.com</strong> and our visitor touchpoints,
                  giving you increased visibility among local and international
                  travelers.
                </Paragraph>
              </div>

              <div
                style={{
                  background: "#fff7e6",
                  padding: "20px",
                  borderRadius: "8px",
                  border: "1px solid #ffd591",
                  textAlign: "center",
                }}
              >
                <Title
                  level={4}
                  style={{ color: "#fa8c16", marginBottom: "12px" }}
                >
                  🌟 Thank You for Supporting Local Ahangama
                </Title>
                <Text>
                  We're excited to drive thoughtful, high-quality visitors your
                  way and build something valuable for Ahangama together.
                </Text>
              </div>
            </Space>
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}
