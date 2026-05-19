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
import { getPromoPurchaseBySession, verifyPayment } from "../services/stripe";
import { issuePurchasedCard, normalizeQrCode } from "../app/cardStore";
import { trackPassPurchase } from "../analytics";

const { Title, Paragraph, Text } = Typography;
const PURCHASE_TRACKED_STORAGE_PREFIX = "ahangama_purchase_tracked";
const LEGACY_DELIVERY_STORAGE_PREFIX = "ahangama_legacy_delivery";

const calculateValidityDays = (startDate, expiryDate, fallback = 0) => {
  const start = new Date(startDate || 0);
  const end = new Date(expiryDate || 0);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return fallback;
  }

  return Math.max(
    fallback,
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
  );
};

const buildVerifyUrl = (qrCode) =>
  `https://ahangama.com/verify?${encodeURIComponent(qrCode || "")}`;

const normalizePromoPurchaseData = (data) => {
  const purchaseDate = data.createdAt || new Date().toISOString();
  const startDate = data.startDate || purchaseDate;
  const expiryDate = data.expiryDate || purchaseDate;
  const validityDays = calculateValidityDays(
    startDate,
    expiryDate,
    Number(data.validityDays || 0),
  );

  return {
    qrCode: normalizeQrCode(data.passId),
    productName: data.productName || "Ahangama Pass",
    customerName:
      data.customerName || data.customerEmail?.split("@")[0] || "Guest",
    customerEmail: data.customerEmail || "",
    customerPhone: data.customerPhone || "",
    validityDays,
    purchaseDate,
    startDate,
    expiryDate,
    flowType: "promo",
    promoCode: data.promoCode || "",
    venueSlug: data.venueSlug || "",
    priceUsd: data.chargedPriceUsd || data.listPriceUsd || "0",
    chargedPriceUsd: data.chargedPriceUsd || "0",
    listPriceUsd: data.listPriceUsd || "0",
    discountUsd: data.discountUsd || "0",
    passUrl: data.passUrl || "",
    passkitUrl: data.passkitUrl || "",
  };
};

const shouldTrackPurchase = (sessionId) => {
  if (typeof window === "undefined") {
    return true;
  }

  try {
    const storageKey = `${PURCHASE_TRACKED_STORAGE_PREFIX}:${sessionId}`;

    if (window.sessionStorage.getItem(storageKey)) {
      return false;
    }

    window.sessionStorage.setItem(storageKey, "1");
    return true;
  } catch {
    return true;
  }
};

const shouldSendLegacyDelivery = (sessionId) => {
  if (typeof window === "undefined") {
    return true;
  }

  try {
    const storageKey = `${LEGACY_DELIVERY_STORAGE_PREFIX}:${sessionId}`;

    if (window.sessionStorage.getItem(storageKey)) {
      return false;
    }

    window.sessionStorage.setItem(storageKey, "1");
    return true;
  } catch {
    return true;
  }
};

const isInvalidSessionId = (sessionId) => {
  const normalized = String(sessionId || "").trim();

  return (
    !normalized ||
    normalized.includes("CHECKOUT_SESSION_ID") ||
    normalized.startsWith("{") ||
    normalized.startsWith("%7B")
  );
};

const waitForPromoPurchase = async (sessionId, attempts = 5, delayMs = 1200) => {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const promoPurchase = await getPromoPurchaseBySession(sessionId);

    if (promoPurchase?.passId) {
      return promoPurchase;
    }

    if (attempt < attempts - 1) {
      await new Promise((resolve) => {
        window.setTimeout(resolve, delayMs);
      });
    }
  }

  return null;
};

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
  const margin = 8;

  // Generate QR Code as data URL
  const qrCodeDataUrl = await QRCodeLib.toDataURL(
    `https://ahangama.com/verify?${encodeURIComponent(paymentData.qrCode)}`,
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

    if (isInvalidSessionId(sessionId)) {
      setError(
        "Invalid checkout session. Please start a fresh checkout from the promo page.",
      );
      setLoading(false);
      return;
    }

    const verifyAndLoadPayment = async () => {
      try {
        const promoPurchase = await waitForPromoPurchase(sessionId);

        if (promoPurchase?.passId) {
          const normalizedPromoData = normalizePromoPurchaseData(promoPurchase);

          if (shouldTrackPurchase(sessionId)) {
            trackPassPurchase({
              sessionId,
              paymentData: normalizedPromoData,
            });
          }

          setPaymentData(normalizedPromoData);
          setEmailSent(promoPurchase.customerEmailStatus === "sent");
          setEmailError(
            promoPurchase.customerEmailStatus === "failed"
              ? "Email delivery failed."
              : null,
          );
          return;
        }

        const data = await verifyPayment(sessionId);
        const normalizedData = {
          ...data,
          qrCode: normalizeQrCode(data.passId || data.qrCode),
          customerName:
            data.customerName || data.customerEmail?.split("@")[0] || "Guest",
          purchaseDate: data.purchaseDate || new Date().toISOString(),
          startDate:
            data.startDate || data.purchaseDate || new Date().toISOString(),
        };

        if (normalizedData.flowType === "promo" && normalizedData.passId) {
          if (shouldTrackPurchase(sessionId)) {
            trackPassPurchase({
              sessionId,
              paymentData: normalizedData,
            });
          }

          setPaymentData(normalizedData);
          setEmailSent(normalizedData.customerEmailStatus === "sent");
          setEmailError(
            normalizedData.customerEmailStatus === "failed"
              ? "Email delivery failed."
              : null,
          );
          return;
        }

        issuePurchasedCard({
          ...normalizedData,
          sessionId,
        });

        if (shouldTrackPurchase(sessionId)) {
          trackPassPurchase({
            sessionId,
            paymentData: normalizedData,
          });
        }

        setPaymentData(normalizedData);

        // Auto-send email with PDF
        if (shouldSendLegacyDelivery(sessionId)) {
          await sendPassPDF(normalizedData);
        } else {
          navigate(`/card/pass/${normalizedData.qrCode}`);
        }
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
  }, [navigate, sessionId]);

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
            value={buildVerifyUrl(paymentData.qrCode)}
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
            href={
              paymentData.passkitUrl ||
              paymentData.passUrl ||
              `/card/pass/${paymentData.qrCode}`
            }
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
