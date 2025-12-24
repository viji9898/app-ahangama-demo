import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, Typography, Result, Button, Spin, Alert, QRCode } from "antd";
import {
  CheckCircleOutlined,
  WhatsAppOutlined,
  MailOutlined,
} from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { verifyPayment } from "../services/stripe";

const { Title, Paragraph, Text } = Typography;

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No payment session found");
      setLoading(false);
      return;
    }

    const verifyAndLoadPayment = async () => {
      try {
        const data = await verifyPayment(sessionId);
        setPaymentData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyAndLoadPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <SiteLayout>
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
          <Text style={{ display: "block", marginTop: 16 }}>
            Verifying your payment...
          </Text>
        </div>
      </SiteLayout>
    );
  }

  if (error || !paymentData) {
    return (
      <SiteLayout>
        <Result
          status="error"
          title="Payment Verification Failed"
          subTitle={
            error || "Unable to verify your payment. Please contact support."
          }
          extra={[
            <Button type="primary" key="home" href="/">
              Go Home
            </Button>,
            <Button key="support" href="/contact">
              Contact Support
            </Button>,
          ]}
        />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <Seo
        title="Payment Successful"
        description="Your Ahangama Pass purchase was successful"
        noIndex={true}
      />

      <Result
        icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
        status="success"
        title="Payment Successful!"
        subTitle={`Thank you for purchasing the ${paymentData.productName}`}
      />

      <Card
        style={{ borderRadius: 16, marginBottom: 24 }}
        bodyStyle={{ padding: 24 }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3}>Your Ahangama Pass</Title>
          <Text type="secondary">
            Save this QR code or use the one sent to your WhatsApp/Email
          </Text>
        </div>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <QRCode
            value={paymentData.qrCode}
            size={200}
            style={{ marginBottom: 16 }}
          />
          <Text
            copyable={{ text: paymentData.qrCode }}
            code
            style={{ display: "block", fontSize: 12 }}
          >
            {paymentData.qrCode}
          </Text>
        </div>

        <div
          style={{
            background: "#f5f5f5",
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <Title level={5} style={{ marginBottom: 8 }}>
            Pass Details
          </Title>
          <Text strong>{paymentData.productName}</Text>
          <br />
          <Text>Valid for {paymentData.validityDays} days</Text>
          <br />
          <Text>
            Purchase Date:{" "}
            {new Date(paymentData.purchaseDate).toLocaleDateString()}
          </Text>
          <br />
          <Text>
            Expires: {new Date(paymentData.expiryDate).toLocaleDateString()}
          </Text>
        </div>

        <Alert
          message="QR Code Delivery"
          description={
            <div>
              <div style={{ marginBottom: 8 }}>
                <WhatsAppOutlined
                  style={{ color: "#25D366", marginRight: 8 }}
                />
                WhatsApp message sent to: {paymentData.customerPhone}
              </div>
              <div>
                <MailOutlined style={{ color: "#1890ff", marginRight: 8 }} />
                Email sent to: {paymentData.customerEmail}
              </div>
            </div>
          }
          type="success"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <div style={{ textAlign: "center" }}>
          <Button
            type="primary"
            size="large"
            href="/card/my"
            style={{ marginRight: 8 }}
          >
            View My Passes
          </Button>
          <Button size="large" href="/">
            Explore Venues
          </Button>
        </div>
      </Card>
    </SiteLayout>
  );
}
