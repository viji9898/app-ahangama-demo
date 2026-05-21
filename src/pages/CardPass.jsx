import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button, Spin, QRCode } from "antd";
import {
  WhatsAppOutlined,
  CopyOutlined,
  DownloadOutlined,
  BookOutlined,
  UpOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import QRCodeLib from "qrcode";
import { Seo } from "../app/seo";
import { verifyCardByCode } from "../app/cardStore";
import { getPromoPassById } from "../services/stripe";
import palmTreeIcon from "../assets/receipt_icons/palm-tree-icon.svg";

const { Title, Text } = Typography;

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

const isWebhookPromoPassId = (passId) =>
  /^(?:[A-Z0-9]{6}|[A-Z0-9]{8}|AHG-[A-F0-9]{12})$/.test(
    String(passId || "").trim(),
  );

const buildVerifyUrl = (passId) =>
  `https://ahangama.com/verify?${encodeURIComponent(passId || "")}`;

const formatDisplayDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDisplayDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const normalizePromoPassData = (data) => {
  const purchaseDate =
    data.purchaseDate || data.startDate || new Date().toISOString();
  const startDate = data.startDate || purchaseDate;
  const expiryDate = data.expiryDate || purchaseDate;

  return {
    qrCode: data.passId,
    productName: data.productName || "Ahangama Pass",
    customerName:
      data.customerName || data.customerEmail?.split("@")[0] || "Guest",
    customerEmail: data.customerEmail || "",
    customerPhone: data.customerPhone || "",
    validityDays: calculateValidityDays(startDate, expiryDate, 0),
    purchaseDate,
    expiryDate,
    status: data.status || "active",
    remainingDays: Math.max(
      0,
      Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24)),
    ),
    redemptionCount: Number(data.redemptionCount || 0),
    isRedeemedAtVenue: Boolean(data.isRedeemedAtVenue),
    redemptionNumber: data.redemptionNumber || "",
    redemptionVenueSlug: data.redemptionVenueSlug || "",
    redeemedAt: data.redeemedAt || null,
    redemptions: Array.isArray(data.redemptions) ? data.redemptions : [],
    passUrl: data.passUrl || "",
    passkitUrl: data.passkitUrl || "",
  };
};

const normalizeLocalPassData = (purchase, result) => ({
  qrCode: purchase.qrCode,
  productName: purchase.productName,
  customerName: purchase.customerName,
  customerEmail: purchase.customerEmail,
  customerPhone: purchase.customerPhone,
  validityDays: purchase.validityDays,
  purchaseDate: purchase.purchaseDate,
  expiryDate: purchase.expiryDate,
  status: result.valid && !result.expired ? "active" : "expired",
  remainingDays: Math.max(
    0,
    Math.ceil(
      (new Date(purchase.expiryDate) - new Date()) / (1000 * 60 * 60 * 24),
    ),
  ),
  redemptionCount: Number(purchase.redemptionCount || 0),
  isRedeemedAtVenue: Boolean(purchase.isRedeemedAtVenue),
  redemptionNumber: purchase.redemptionNumber || "",
  redemptionVenueSlug: purchase.redemptionVenueSlug || "",
  redeemedAt: purchase.redeemedAt || null,
  redemptions: [],
  passUrl: purchase.passUrl || "",
  passkitUrl: purchase.passkitUrl || "",
});

const HOW_TO_USE_STEPS = [
  {
    title: "Present QR Code",
    description: "Show this QR code to staff at any participating venue.",
  },
  {
    title: "Staff Verification",
    description:
      "Venue staff will scan the code to verify and log the redemption.",
  },
  {
    title: "Enjoy Your Offer",
    description: "Your discount or benefit will be applied instantly.",
  },
  {
    title: "Keep This Pass",
    description: "Keep this page handy so you can access your pass anytime.",
  },
];

const CardPass = () => {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [passData, setPassData] = useState(null);
  const [error, setError] = useState(null);
  const [isHowToExpanded, setIsHowToExpanded] = useState(true);

  const qrCode = cardId;

  useEffect(() => {
    const loadPass = async () => {
      if (!qrCode) {
        setError("No pass code provided");
        setLoading(false);
        return;
      }

      try {
        const promoPass = isWebhookPromoPassId(qrCode)
          ? await getPromoPassById(qrCode)
          : null;

        if (promoPass?.passId) {
          setPassData(normalizePromoPassData(promoPass));
          return;
        }

        const result = verifyCardByCode(qrCode);

        if (!result.purchase) {
          setError(result.error || "Invalid pass code");
          return;
        }

        setPassData(normalizeLocalPassData(result.purchase, result));

        if (!result.valid) {
          setError(result.error || "This pass has expired.");
        }
      } catch (err) {
        console.error("Error loading pass data:", err);
        setError("Failed to load pass data");
      } finally {
        setLoading(false);
      }
    };

    loadPass();
  }, [qrCode]);

  const handleWhatsAppContact = () => {
    const message = `Hi Ahangama I need some help with my pass - ${qrCode}`;
    const whatsappUrl = `https://wa.me/94777908790?text=${encodeURIComponent(
      message,
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(qrCode);
  };

  const generatePassPDF = async () => {
    if (!passData) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [105, 160],
    });

    const pageWidth = 105;
    const margin = 8;

    const qrCodeDataUrl = await QRCodeLib.toDataURL(
      buildVerifyUrl(passData.qrCode),
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

    pdf.setFillColor(255, 127, 80);
    pdf.rect(0, 0, pageWidth, 20, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("AHANGAMA PASS", pageWidth / 2, 13, { align: "center" });

    const qrSize = 45;
    const qrX = pageWidth / 2 - qrSize / 2;
    const qrY = 25;

    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(1);
    pdf.rect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4, "FD");

    pdf.addImage(qrCodeDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    const qrCodeId = passData.qrCode.split("-").pop() || passData.qrCode;
    pdf.text(`ID: ${qrCodeId}`, pageWidth / 2, qrY + qrSize + 8, {
      align: "center",
    });

    let currentY = qrY + qrSize + 20;

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text("PASS:", margin, currentY);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(passData.productName, margin + 20, currentY);
    currentY += 8;

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text("NAME:", margin, currentY);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    const customerName =
      passData.customerName.length > 22
        ? `${passData.customerName.substring(0, 22)}...`
        : passData.customerName;
    pdf.text(customerName, margin + 20, currentY);
    currentY += 8;

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text("VALID:", margin, currentY);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${passData.validityDays} days`, margin + 20, currentY);
    currentY += 8;

    const startDate = new Date(passData.purchaseDate).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      },
    );
    const expiryDate = new Date(passData.expiryDate).toLocaleDateString(
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

    if (passData.customerEmail) {
      pdf.setFontSize(6);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Email: ${passData.customerEmail}`, margin, currentY);
      currentY += 4;
    }

    if (passData.customerPhone) {
      pdf.setFontSize(6);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Phone: ${passData.customerPhone}`, margin, currentY);
      currentY += 4;
    }

    const filename = `ahangama-pass-${qrCodeId}.pdf`;
    pdf.save(filename);
  };

  if (loading) {
    return (
      <div className="qr-page qr-successPage qr-passPage">
        <div className="qr-shell">
          <section className="qr-receiptCard">
            <div className="qr-receiptPaper qr-successReceiptPaper qr-passReceiptPaper">
              <div className="qr-receiptBrandBlock">
                <img
                  src={palmTreeIcon}
                  alt=""
                  className="qr-receiptBrandIcon"
                  aria-hidden="true"
                />
                <div className="qr-receiptBrandTitle">AHANGAMA PASS</div>
                <div className="qr-receiptBrandTagline">DIGITAL PASS</div>
              </div>
              <div className="qr-receiptDivider qr-receiptDivider--brand" />
              <div className="qr-receiptEyebrow">LOADING PASS</div>
              <div className="qr-successLoadingBlock">
                <Spin size="large" />
                <Title level={3} className="qr-successLoadingTitle">
                  Loading Your Pass
                </Title>
                <Text className="qr-successLoadingText">
                  Fetching your pass details and QR code.
                </Text>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error || !passData) {
    return (
      <div className="qr-page qr-successPage qr-passPage">
        <div className="qr-shell">
          <section className="qr-receiptCard">
            <div className="qr-receiptPaper qr-successReceiptPaper qr-successReceiptPaper--error qr-passReceiptPaper">
              <div className="qr-receiptBrandBlock">
                <img
                  src={palmTreeIcon}
                  alt=""
                  className="qr-receiptBrandIcon"
                  aria-hidden="true"
                />
                <div className="qr-receiptBrandTitle">AHANGAMA PASS</div>
                <div className="qr-receiptBrandTagline">DIGITAL PASS</div>
              </div>
              <div className="qr-receiptDivider qr-receiptDivider--brand" />
              <div className="qr-receiptEyebrow">PASS ISSUE</div>
              <div className="qr-successStatusBadge qr-successStatusBadge--error">
                PASS NOT FOUND
              </div>
              <div className="qr-successStatusSummary">
                {error || "The pass code you provided is not valid."}
              </div>
              <div className="qr-successActionStack">
                <Button
                  className="qr-receiptButton"
                  onClick={() => navigate("/card")}
                  block
                >
                  Get a New Pass
                </Button>
                <Button
                  className="qr-successSecondaryButton"
                  icon={<WhatsAppOutlined />}
                  onClick={handleWhatsAppContact}
                  block
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const isExpired =
    passData.status === "expired" || passData.remainingDays <= 0;
  const statusLabel = isExpired ? "EXPIRED" : "ACTIVE";
  const statusBadgeClass = isExpired
    ? "qr-successStatusBadge qr-successStatusBadge--error"
    : "qr-successStatusBadge qr-successStatusBadge--success";
  const redemptions = Array.isArray(passData.redemptions)
    ? passData.redemptions
    : [];

  return (
    <>
      <Seo
        title="Your Ahangama Pass"
        description="View your digital Ahangama Pass and QR code for exclusive local experiences."
      />
      <div className="qr-page qr-successPage qr-passPage">
        <div className="qr-shell">
          <section className="qr-receiptCard">
            <div className="qr-receiptPaper qr-successReceiptPaper qr-passReceiptPaper">
              <div className="qr-receiptBrandBlock">
                <img
                  src={palmTreeIcon}
                  alt=""
                  className="qr-receiptBrandIcon"
                  aria-hidden="true"
                />
                <div className="qr-receiptBrandTitle">AHANGAMA PASS</div>
                <div className="qr-receiptBrandTagline">DIGITAL PASS</div>
              </div>

              <div className="qr-receiptDivider qr-receiptDivider--brand" />
              <div className="qr-receiptEyebrow">PASS READY</div>
              <div className={statusBadgeClass}>{statusLabel}</div>
              <div className="qr-successStatusSummary qr-passStatusSummary">
                Show this receipt and QR code to venue staff when redeeming your
                offer.
              </div>

              <div className="qr-receiptDivider" />

              <div className="qr-successQrBlock">
                <div className="qr-successQrCard qr-passQrCard">
                  <QRCode value={buildVerifyUrl(passData.qrCode)} size={190} />
                </div>
                <div className="qr-successQrHint">
                  Show QR CODE to Staff to Redeem Promotion
                </div>
                {passData.passkitUrl ? (
                  <Button
                    className="qr-successSecondaryButton qr-passWalletButton"
                    href={passData.passkitUrl}
                  >
                    Add to Digital Wallet
                  </Button>
                ) : null}
              </div>

              <div className="qr-receiptDivider qr-receiptDivider--summary" />

              <div className="qr-successReceiptSection">
                <div className="qr-successReceiptSectionTitle">
                  PASS DETAILS
                </div>
                <div className="qr-successReceiptRow">
                  <span className="qr-successReceiptLabel">Pass Type</span>
                  <strong className="qr-successReceiptValue">
                    {passData.productName}
                  </strong>
                </div>
                <div className="qr-successReceiptRow">
                  <span className="qr-successReceiptLabel">PASS CODE</span>
                  <strong className="qr-successReceiptValue qr-successReceiptValue--code">
                    {passData.qrCode}
                  </strong>
                </div>
                <div className="qr-passInlineAction">
                  <Button
                    type="text"
                    className="qr-passCopyButton"
                    icon={<CopyOutlined />}
                    onClick={handleCopyCode}
                  >
                    Copy pass code
                  </Button>
                </div>
                <div className="qr-successReceiptRow">
                  <span className="qr-successReceiptLabel">Pass Holder</span>
                  <strong className="qr-successReceiptValue">
                    {passData.customerName}
                  </strong>
                </div>
                {passData.customerEmail ? (
                  <div className="qr-successReceiptRow">
                    <span className="qr-successReceiptLabel">Email</span>
                    <strong className="qr-successReceiptValue qr-passReceiptValueWrap">
                      {passData.customerEmail}
                    </strong>
                  </div>
                ) : null}
                {passData.customerPhone ? (
                  <div className="qr-successReceiptRow">
                    <span className="qr-successReceiptLabel">Phone</span>
                    <strong className="qr-successReceiptValue">
                      {passData.customerPhone}
                    </strong>
                  </div>
                ) : null}
                <div className="qr-successReceiptRow">
                  <span className="qr-successReceiptLabel">Purchase Date</span>
                  <strong className="qr-successReceiptValue">
                    {formatDisplayDate(passData.purchaseDate)}
                  </strong>
                </div>
                <div className="qr-successReceiptRow">
                  <span className="qr-successReceiptLabel">Expires</span>
                  <strong className="qr-successReceiptValue qr-successReceiptValue--success">
                    {formatDisplayDate(passData.expiryDate)}
                  </strong>
                </div>
                <div className="qr-successReceiptRow">
                  <span className="qr-successReceiptLabel">
                    Redemptions Logged
                  </span>
                  <strong className="qr-successReceiptValue">
                    {passData.redemptionCount || 0}
                  </strong>
                </div>
              </div>

              {redemptions.length ? (
                <>
                  <div className="qr-receiptSectionDivider" />
                  <div className="qr-successReceiptSection">
                    <div className="qr-successReceiptSectionTitle">
                      REDEMPTION HISTORY
                    </div>
                    <div className="qr-passHistoryList">
                      {redemptions.map((redemption) => {
                        const venueLabel =
                          redemption.venueName ||
                          redemption.venueSlug ||
                          "Venue";

                        return (
                          <div
                            key={`${redemption.redeemedAt || "unknown"}-${venueLabel}`}
                            className="qr-passHistoryItem"
                          >
                            <div className="qr-passHistoryRow">
                              <div className="qr-passHistoryVenue">
                                {venueLabel}
                              </div>
                              <div className="qr-passHistoryDate">
                                {formatDisplayDateTime(redemption.redeemedAt)}
                              </div>
                            </div>
                            {redemption.offerUsed ? (
                              <div className="qr-passHistoryMeta">
                                Offer used: {redemption.offerUsed}
                              </div>
                            ) : null}
                            {redemption.redemptionNumber ? (
                              <div className="qr-passHistoryMeta">
                                Redemption No: {redemption.redemptionNumber}
                              </div>
                            ) : null}
                            {redemption.redemptionType ? (
                              <div className="qr-passHistoryMeta">
                                Type: {redemption.redemptionType}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : null}

              <div className="qr-receiptSectionDivider" />

              <div className="qr-successReceiptSection">
                <div className="qr-passHowToCard">
                  <button
                    type="button"
                    className="qr-passHowToHeader"
                    onClick={() => setIsHowToExpanded((value) => !value)}
                    aria-expanded={isHowToExpanded}
                  >
                    <div className="qr-passHowToTitleWrap">
                      <BookOutlined className="qr-passHowToHeaderIcon" />
                      <div className="qr-successReceiptSectionTitle qr-passHowToTitle">
                        HOW TO USE
                      </div>
                    </div>
                    <UpOutlined
                      className={`qr-passHowToChevron${
                        isHowToExpanded ? "" : " qr-passHowToChevron--collapsed"
                      }`}
                    />
                  </button>
                  {isHowToExpanded ? (
                    <div className="qr-passTimeline">
                      {HOW_TO_USE_STEPS.map((step, index) => (
                        <div className="qr-passTimelineItem" key={step.title}>
                          <div className="qr-passTimelineMarkerWrap">
                            <div className="qr-passTimelineMarker">
                              {index + 1}
                            </div>
                            {index < HOW_TO_USE_STEPS.length - 1 ? (
                              <div className="qr-passTimelineLine" />
                            ) : null}
                          </div>
                          <div className="qr-passTimelineContent">
                            <div className="qr-passTimelineTitle">
                              {step.title}
                            </div>
                            <div className="qr-passTimelineDescription">
                              {step.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="qr-receiptSectionDivider" />

              <div className="qr-successReceiptSection">
                <div className="qr-successReceiptSectionTitle">
                  PASS BENEFITS
                </div>
                <div className="qr-passInfoList">
                  <div className="qr-passInfoItem">
                    Exclusive discounts and venue-specific perks across the
                    Ahangama partner network.
                  </div>
                  <div className="qr-passInfoItem">
                    A hosted digital pass link you can reopen from email or your
                    device anytime.
                  </div>
                  <div className="qr-passInfoItem">
                    A downloadable PDF backup in case your connection is weak
                    while redeeming.
                  </div>
                </div>
              </div>

              <div className="qr-successActionStack qr-passActionStack">
                <Button
                  className="qr-receiptButton"
                  icon={<DownloadOutlined />}
                  onClick={generatePassPDF}
                  block
                >
                  Download PDF Pass
                </Button>
                <Button
                  className="qr-successSecondaryButton qr-passWhatsappButton"
                  icon={<WhatsAppOutlined />}
                  onClick={handleWhatsAppContact}
                  block
                >
                  WhatsApp Support
                </Button>
                <Button
                  className="qr-successSecondaryButton"
                  onClick={() => window.open("https://ahangama.com", "_blank")}
                  block
                >
                  View All Venues
                </Button>
              </div>
              <div className="qr-passFooter">objects.Viji</div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default CardPass;
