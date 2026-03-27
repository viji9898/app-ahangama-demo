import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, Typography, Result, Button, Spin, Alert, QRCode } from "antd";
import {
  CheckCircleOutlined,
  WhatsAppOutlined,
  MailOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import QRCodeLib from "qrcode";
import { sendPassEmailViaFunction } from "../services/emailService";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { verifyPayment } from "../services/stripe";
import { issuePurchasedCard, normalizeQrCode } from "../app/cardStore";

const { Title, Paragraph, Text } = Typography;

const generatePassPDF = async (
  paymentData,
  shouldDownload = true,
  shouldEmail = false,
) => {
  // Create phone-sized PDF (105mm x 160mm - A6 portrait with extra height)
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [105, 160],
  });

  const pageWidth = 105;
  const pageHeight = 160;
  const margin = 8;

  // Generate QR Code as data URL
  const qrCodeDataUrl = await QRCodeLib.toDataURL(
    `https://ahangama.com/card/verify?qr=${paymentData.qrCode}`,
    {
      width: 120,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    },
  );

  // Simple header - no fancy gradients
  pdf.setFillColor(255, 127, 80);
  pdf.rect(0, 0, pageWidth, 20, "F");

  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("AHANGAMA PASS", pageWidth / 2, 13, { align: "center" });

  // QR Code - larger and more prominent for phone viewing
  const qrSize = 45;
  const qrX = pageWidth / 2 - qrSize / 2;
  const qrY = 25;

  // Simple QR background
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(1);
  pdf.rect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4, "FD");

  pdf.addImage(qrCodeDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

  // Pass Code - clearly visible
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  const qrCodeId = paymentData.qrCode.split("-").pop() || paymentData.qrCode;
  pdf.text(`ID: ${qrCodeId}`, pageWidth / 2, qrY + qrSize + 8, {
    align: "center",
  });

  // Pass details in compact format
  let currentY = qrY + qrSize + 20;

  // Pass Type
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text("PASS:", margin, currentY);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text(paymentData.productName, margin + 20, currentY);
  currentY += 8;

  // Customer
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text("NAME:", margin, currentY);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  const customerName = paymentData.customerName
    ? paymentData.customerName.length > 22
      ? paymentData.customerName.substring(0, 22) + "..."
      : paymentData.customerName
    : paymentData.customerEmail;
  pdf.text(customerName, margin + 20, currentY);
  currentY += 8;

  // Validity
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text("VALID:", margin, currentY);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text(`${paymentData.validityDays} days`, margin + 20, currentY);
  currentY += 8;

  // Dates on same line to save space
  const startDate = new Date(paymentData.purchaseDate).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    },
  );
  const expiryDate = new Date(paymentData.expiryDate).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    },
  );

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text("FROM:", margin, currentY);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text(startDate, margin + 20, currentY);

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text("TO:", margin + 55, currentY);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text(expiryDate, margin + 68, currentY);
  currentY += 12;

  // Instructions - simplified
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.5);
  pdf.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 6;

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.text("HOW TO USE:", margin, currentY);
  currentY += 6;

  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.text("• Show QR code to venue staff", margin, currentY);
  currentY += 5;
  pdf.text("• Staff scans code for verification", margin, currentY);
  currentY += 5;
  pdf.text("• Enjoy your benefits!", margin, currentY);
  currentY += 8;

  // Contact info - compact
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 6;

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.text("SUPPORT:", margin, currentY);
  currentY += 6;

  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.text("WhatsApp: +94 777 908 790", margin, currentY);
  currentY += 5;
  pdf.text("Web: ahangama.com", margin, currentY);
  currentY += 8;

  // Customer contact if available
  if (paymentData.customerEmail) {
    pdf.setFontSize(6);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Email: ${paymentData.customerEmail}`, margin, currentY);
    currentY += 4;
  }
  if (paymentData.customerPhone) {
    pdf.setFontSize(6);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Phone: ${paymentData.customerPhone}`, margin, currentY);
    currentY += 4;
  }

  // Add extra bottom padding to prevent cutting
  currentY += 10;

  // Generate filename
  const filename = `ahangama-pass-${paymentData.qrCode.split("-").pop()}.pdf`;

  if (shouldEmail) {
    // Return PDF as base64 for emailing
    const pdfBuffer = pdf.output("arraybuffer");
    const pdfBase64 = pdf.output("datauristring").split(",")[1];
    return { pdfBase64, filename };
  }

  if (shouldDownload) {
    // Save the PDF for download
    pdf.save(filename);
  }

  return { filename };
};

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No payment session found");
      setLoading(false);
      return;
    }

    const verifyAndLoadPayment = async () => {
      try {
        const data = await verifyPayment(sessionId);
        const normalizedData = {
          ...data,
          qrCode: normalizeQrCode(data.qrCode),
          customerName:
            data.customerName || data.customerEmail?.split("@")[0] || "Guest",
          purchaseDate: data.purchaseDate || new Date().toISOString(),
          startDate:
            data.startDate || data.purchaseDate || new Date().toISOString(),
        };

        issuePurchasedCard({
          ...normalizedData,
          sessionId,
        });

        setPaymentData(normalizedData);

        // Auto-send email with PDF
        await sendPassPDF(normalizedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const sendPassPDF = async (data) => {
      try {
        setEmailSending(true);
        const { pdfBase64 } = await generatePassPDF(data, false, true);

        await sendPassEmailViaFunction(
          data.customerEmail,
          data.customerName || data.customerEmail.split("@")[0],
          data.qrCode,
          pdfBase64,
        );

        setEmailSent(true);
      } catch (err) {
        console.error("Failed to send pass email:", err);
        setEmailError(err.message);
      } finally {
        setEmailSending(false);

        // Extract QR code from URL if it's a full URL, otherwise use as-is
        const qrCode = normalizeQrCode(data.qrCode);

        // Redirect immediately to pass page
        navigate(`/card/pass/${qrCode}`);
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
          message={
            emailSending
              ? "📧 Sending your pass..."
              : emailSent
                ? "📧 Pass delivered!"
                : emailError
                  ? "⚠️ Email delivery issue"
                  : "📧 Pass delivery"
          }
          description={
            <div>
              {emailSending && (
                <div style={{ marginBottom: 8 }}>
                  <Text>🔄 Generating and sending your PDF pass...</Text>
                </div>
              )}
              {emailSent && (
                <div style={{ marginBottom: 8 }}>
                  <Text>
                    ✅ PDF pass successfully sent to:{" "}
                    <strong>{paymentData.customerEmail}</strong>
                  </Text>
                </div>
              )}
              {emailError && (
                <div style={{ marginBottom: 8, color: "#ff4d4f" }}>
                  <Text>❌ Could not send email: {emailError}</Text>
                  <br />
                  <Text>
                    Don't worry! You can still download your pass below.
                  </Text>
                </div>
              )}
              <div>
                <MailOutlined style={{ color: "#1890ff", marginRight: 8 }} />
                Check your email: {paymentData.customerEmail}
              </div>
            </div>
          }
          type={
            emailSending
              ? "info"
              : emailSent
                ? "success"
                : emailError
                  ? "warning"
                  : "info"
          }
          showIcon
          style={{ marginBottom: 24 }}
        />

        <div style={{ textAlign: "center" }}>
          <Button
            type="primary"
            size="large"
            href={`/card/pass/${paymentData.qrCode}`}
            style={{
              marginRight: 8,
              marginBottom: 8,
              background: "linear-gradient(135deg, #52c41a, #73d13d)",
              borderColor: "#52c41a",
              fontSize: "16px",
            }}
          >
            📱 View Digital Pass
          </Button>
          <br />
          <Button
            size="large"
            icon={<DownloadOutlined />}
            onClick={() => generatePassPDF(paymentData)}
            style={{
              marginRight: 8,
              marginBottom: 8,
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
