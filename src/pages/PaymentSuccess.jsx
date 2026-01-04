import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, Typography, Result, Button, Spin, Alert, QRCode } from "antd";
import {
  CheckCircleOutlined,
  WhatsAppOutlined,
  MailOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import QRCodeLib from "qrcode";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { verifyPayment } from "../services/stripe";

const { Title, Paragraph, Text } = Typography;

const generatePassPDF = async (paymentData) => {
  // Create A5 PDF (148mm x 210mm = 5.83in x 8.27in at 72dpi = 420px x 595px)
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a5",
  });

  // Generate QR Code as data URL
  const qrCodeDataUrl = await QRCodeLib.toDataURL(paymentData.qrCode, {
    width: 150,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });

  // Set up the document
  pdf.setFillColor(255, 248, 220); // Light cream background
  pdf.rect(0, 0, 148, 210, "F");

  // Header with gradient-like effect
  pdf.setFillColor(139, 69, 19); // Brown
  pdf.rect(0, 0, 148, 40, "F");

  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.text("AHANGAMA PASS", 74, 18, { align: "center" });

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text("Your Digital Experience Card", 74, 28, { align: "center" });

  // QR Code
  pdf.addImage(qrCodeDataUrl, "PNG", 24, 50, 40, 40);

  // Pass details section
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Pass Details", 74, 60);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");

  // Pass information
  let yPos = 70;
  const details = [
    ["Pass Type:", paymentData.productName],
    ["QR Code:", paymentData.qrCode],
    ["Valid for:", `${paymentData.validityDays} days`],
    ["Purchase Date:", new Date(paymentData.purchaseDate).toLocaleDateString()],
    ["Expires:", new Date(paymentData.expiryDate).toLocaleDateString()],
    ["Customer:", `${paymentData.customerEmail}`],
    ["Phone:", `${paymentData.customerPhone || "Not provided"}`],
  ];

  details.forEach(([label, value]) => {
    pdf.setFont("helvetica", "bold");
    pdf.text(label, 74, yPos);
    pdf.setFont("helvetica", "normal");
    pdf.text(value, 74, yPos + 4);
    yPos += 12;
  });

  // How to use section
  yPos += 10;
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("How to Use Your Pass", 74, yPos, { align: "center" });

  yPos += 10;
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  const instructions = [
    "• Show this QR code at participating venues",
    "• Scan with any QR code reader or show to staff",
    "• Valid for discounts and perks at listed locations",
    "• Keep this pass safe - each code is unique",
    "• Check ahangama.com for full venue list",
  ];

  instructions.forEach((instruction) => {
    pdf.text(instruction, 15, yPos);
    yPos += 6;
  });

  // Footer
  pdf.setFillColor(139, 69, 19);
  pdf.rect(0, 180, 148, 30, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "italic");
  pdf.text("Visit ahangama.com for venue locations", 74, 190, {
    align: "center",
  });
  pdf.text("© 2026 Ahangama Pass - Curated Local Experiences", 74, 200, {
    align: "center",
  });

  // Save the PDF
  const filename = `ahangama-pass-${paymentData.qrCode.split("-").pop()}.pdf`;
  pdf.save(filename);
};

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

        <div
          style={{
            textAlign: "center",
            marginBottom: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
              {/* <div style={{ marginBottom: 8 }}>
                <WhatsAppOutlined
                  style={{ color: "#25D366", marginRight: 8 }}
                />
                WhatsApp message sent to: {paymentData.customerPhone}
              </div> */}
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
            icon={<DownloadOutlined />}
            onClick={() => generatePassPDF(paymentData)}
            style={{
              marginRight: 8,
              marginBottom: 8,
              background: "linear-gradient(135deg, #8B4513, #D2691E)",
              borderColor: "#8B4513",
            }}
          >
            Download PDF Pass
          </Button>
          <br />
          <Button size="large" href="/">
            Explore Venues
          </Button>
        </div>
      </Card>
    </SiteLayout>
  );
}
