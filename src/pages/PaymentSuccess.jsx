import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Typography, Button, Spin, QRCode } from "antd";
import { CheckCircleOutlined, MailOutlined, DownloadOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import QRCodeLib from "qrcode";
import { sendPassEmailViaFunction } from "../services/emailService";
import { Seo } from "../app/seo";
import { getPromoPurchaseBySession, verifyPayment } from "../services/stripe";
import { issuePurchasedCard, normalizeQrCode } from "../app/cardStore";
import { trackPassPurchase } from "../analytics";
import palmTreeIcon from "../assets/receipt_icons/palm-tree-icon.svg";
import giftIcon from "../assets/receipt_icons/gift-icon.svg";

const { Title, Text } = Typography;
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

const formatDisplayDate = (value) => {
  if (!value) {
    return "Not specified";
  }

  return new Date(value).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

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
      <div className="qr-page qr-successPage">
        <div className="qr-shell">
          <section className="qr-receiptCard">
            <div className="qr-receiptPaper qr-successReceiptPaper">
              <div className="qr-receiptBrandBlock">
                <img
                  src={palmTreeIcon}
                  alt=""
                  className="qr-receiptBrandIcon"
                  aria-hidden="true"
                />
                <div className="qr-receiptBrandTitle">AHANGAMA PASS</div>
                <div className="qr-receiptBrandTagline">PAYMENT CONFIRMATION</div>
              </div>
              <div className="qr-receiptDivider qr-receiptDivider--brand" />
              <div className="qr-receiptEyebrow">PREPARING YOUR PASS</div>
              <div className="qr-successLoadingBlock">
                <Spin size="large" />
                <Title level={3} className="qr-successLoadingTitle">
                  Verifying Payment
                </Title>
                <Text className="qr-successLoadingText">
                  We are preparing your digital pass.
                </Text>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="qr-page qr-successPage">
        <div className="qr-shell">
          <section className="qr-receiptCard">
            <div className="qr-receiptPaper qr-successReceiptPaper qr-successReceiptPaper--error">
              <div className="qr-receiptBrandBlock">
                <img
                  src={palmTreeIcon}
                  alt=""
                  className="qr-receiptBrandIcon"
                  aria-hidden="true"
                />
                <div className="qr-receiptBrandTitle">AHANGAMA PASS</div>
                <div className="qr-receiptBrandTagline">PAYMENT CONFIRMATION</div>
              </div>
              <div className="qr-receiptDivider qr-receiptDivider--brand" />
              <div className="qr-receiptEyebrow">CHECKOUT ISSUE</div>
              <div className="qr-successStatusBadge qr-successStatusBadge--error">
                PAYMENT VERIFICATION FAILED
              </div>
              <div className="qr-successStatusSummary">
                {error || "Unable to verify your payment. Please contact support."}
              </div>
              <div className="qr-successActionStack">
                <Button className="qr-receiptButton" href="/" block>
                  Go Home
                </Button>
                <Button className="qr-successSecondaryButton" href="/partners" block>
                  Contact Support
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo
        title="Payment Successful"
        description="Your Ahangama Pass purchase was successful"
        noIndex={true}
      />
      <div className="qr-page qr-successPage">
        <div className="qr-shell">
          <section className="qr-receiptCard">
            <div className="qr-receiptPaper qr-successReceiptPaper">
              <div className="qr-receiptBrandBlock">
                <img
                  src={palmTreeIcon}
                  alt=""
                  className="qr-receiptBrandIcon"
                  aria-hidden="true"
                />
                <div className="qr-receiptBrandTitle">AHANGAMA PASS</div>
                <div className="qr-receiptBrandTagline">PAYMENT CONFIRMATION</div>
              </div>

              <div className="qr-receiptDivider qr-receiptDivider--brand" />
              <div className="qr-receiptEyebrow">ORDER COMPLETE</div>
              <div className="qr-successStatusBadge qr-successStatusBadge--success">
                PAYMENT SUCCESSFUL
              </div>
              <div className="qr-successStatusSummary">
                Thank you for purchasing the {paymentData.productName}
              </div>

              <div className="qr-receiptDivider" />

              <div className="qr-successQrBlock">
                <div className="qr-successQrCard">
                  <QRCode value={buildVerifyUrl(paymentData.qrCode)} size={190} />
                </div>
                <div className="qr-successQrHint">
                  Show QR CODE to Staff to Redeem Promotion
                </div>
              </div>

              <div className="qr-receiptDivider qr-receiptDivider--summary" />

              <div className="qr-successReceiptSection">
                <div className="qr-successReceiptSectionTitle">PASS DETAILS</div>

                <div className="qr-successReceiptRow">
                  <span className="qr-successReceiptLabel">Pass Type</span>
                  <strong className="qr-successReceiptValue">
                    {paymentData.productName}
                  </strong>
                </div>
                <div className="qr-successReceiptRow">
                  <span className="qr-successReceiptLabel">PASS CODE</span>
                  <strong className="qr-successReceiptValue qr-successReceiptValue--code">
                    {paymentData.qrCode}
                  </strong>
                </div>
                <div className="qr-successReceiptRow">
                  <span className="qr-successReceiptLabel">Validity</span>
                  <strong className="qr-successReceiptValue">
                    {paymentData.validityDays} days
                  </strong>
                </div>
                <div className="qr-successReceiptRow">
                  <span className="qr-successReceiptLabel">Purchase Date</span>
                  <strong className="qr-successReceiptValue">
                    {formatDisplayDate(paymentData.purchaseDate)}
                  </strong>
                </div>
                <div className="qr-successReceiptRow">
                  <span className="qr-successReceiptLabel">Expires</span>
                  <strong className="qr-successReceiptValue qr-successReceiptValue--success">
                    {formatDisplayDate(paymentData.expiryDate)}
                  </strong>
                </div>
                {paymentData.chargedPriceUsd ? (
                  <div className="qr-successReceiptRow">
                    <span className="qr-successReceiptLabel">Paid</span>
                    <strong className="qr-successReceiptValue">
                      ${Number(paymentData.chargedPriceUsd).toFixed(2)}
                    </strong>
                  </div>
                ) : null}
              </div>

              <div className="qr-receiptSectionDivider" />

              <div className="qr-receiptPromoNote qr-successDeliveryNote">
                <div className="qr-receiptPromoIconWrap">
                  <img
                    src={giftIcon}
                    alt=""
                    className="qr-receiptPromoIcon"
                    aria-hidden="true"
                  />
                </div>
                <div className="qr-receiptPromoCopy">
                  <div className="qr-receiptPromoTitle">
                    {emailSending
                      ? "Sending your pass"
                      : emailSent
                        ? "Pass delivered"
                        : emailError
                          ? "Email delivery issue"
                          : "Pass delivery in progress"}
                  </div>
                  <div className="qr-receiptPromoMeta">
                    {emailSending
                      ? "Generating and sending your PDF pass now."
                      : emailSent
                        ? `Sent to ${paymentData.customerEmail}`
                        : emailError
                          ? `Could not send email: ${emailError}`
                          : `Check your email: ${paymentData.customerEmail}`}
                  </div>
                </div>
              </div>

              <div className="qr-successActionStack">
                <Button
                  className="qr-receiptButton"
                  href={
                    paymentData.passkitUrl ||
                    paymentData.passUrl ||
                    `/card/pass/${paymentData.qrCode}`
                  }
                  block
                >
                  Add to Digital Wallet
                </Button>
                <Button
                  className="qr-successSecondaryButton"
                  icon={<DownloadOutlined />}
                  onClick={() => generatePassPDF(paymentData)}
                  block
                >
                  Download PDF Pass
                </Button>
                <Button className="qr-successSecondaryButton" href="/" block>
                  Explore Venues
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
