import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Result,
  Button,
  Spin,
  Alert,
  QRCode,
  Space,
  Divider,
  Tag,
  Row,
  Col,
} from "antd";
import {
  CheckCircleOutlined,
  WhatsAppOutlined,
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  CopyOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import QRCodeLib from "qrcode";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { verifyCardByCode } from "../app/cardStore";

const { Title, Paragraph, Text } = Typography;

const CardPass = () => {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [passData, setPassData] = useState(null);
  const [error, setError] = useState(null);

  // Use cardId directly as the QR code
  const qrCode = cardId;

  useEffect(() => {
    if (!qrCode) {
      setError("No pass code provided");
      setLoading(false);
      return;
    }

    try {
      const result = verifyCardByCode(qrCode);

      if (!result.purchase) {
        setError(result.error || "Invalid pass code");
        setLoading(false);
        return;
      }

      const purchase = result.purchase;
      const nextPassData = {
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
            (new Date(purchase.expiryDate) - new Date()) /
              (1000 * 60 * 60 * 24),
          ),
        ),
      };

      setPassData(nextPassData);
      if (!result.valid) {
        setError(result.error || "This pass has expired.");
      }
    } catch (err) {
      console.error("Error loading pass data:", err);
      setError("Failed to load pass data");
    } finally {
      setLoading(false);
    }
  }, [qrCode]);

  const handleWhatsAppContact = () => {
    const message = `Hi! I need help with my Ahangama Pass. My pass code is: ${qrCode}`;
    const whatsappUrl = `https://wa.me/94777908790?text=${encodeURIComponent(
      message,
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(qrCode);
    // You could add a notification here
  };

  const generatePassPDF = async () => {
    if (!passData) return;

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
      `https://ahangama.com/card/verify?qr=${passData.qrCode}`,
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
    const qrCodeId = passData.qrCode.split("-").pop() || passData.qrCode;
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
    pdf.text(passData.productName, margin + 20, currentY);
    currentY += 8;

    // Customer
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text("NAME:", margin, currentY);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    const customerName =
      passData.customerName.length > 22
        ? passData.customerName.substring(0, 22) + "..."
        : passData.customerName;
    pdf.text(customerName, margin + 20, currentY);
    currentY += 8;

    // Validity
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text("VALID:", margin, currentY);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${passData.validityDays} days`, margin + 20, currentY);
    currentY += 8;

    // Dates on same line to save space
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

    // Add extra bottom padding to prevent cutting
    currentY += 10;

    // Save with simple filename
    const filename = `ahangama-pass-${qrCodeId}.pdf`;
    pdf.save(filename);
  };

  if (loading) {
    return (
      <SiteLayout>
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <Spin size="large" />
          <Paragraph style={{ marginTop: 16 }}>Loading your pass...</Paragraph>
        </div>
      </SiteLayout>
    );
  }

  if (error || !passData) {
    return (
      <SiteLayout>
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
          <Result
            status="error"
            title="Pass Not Found"
            subTitle={error || "The pass code you provided is not valid."}
            extra={
              <Button type="primary" onClick={() => navigate("/card")}>
                Get a New Pass
              </Button>
            }
          />
        </div>
      </SiteLayout>
    );
  }

  const isExpired = new Date() > new Date(passData.expiryDate);
  const remainingDays = Math.max(
    0,
    Math.ceil(
      (new Date(passData.expiryDate) - new Date()) / (1000 * 60 * 60 * 24),
    ),
  );

  return (
    <>
      <Seo
        title="Your Ahangama Pass"
        description="View your digital Ahangama Pass and QR code for exclusive local experiences."
      />
      <SiteLayout>
        <div className="dm-heroCut" />
        <div className="dm-canvas">
          <div className="dm-wrap">
            <div style={{ padding: "0 12px" }}>
              {/* Page Header */}
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <Title
                  level={2}
                  style={{
                    color: "var(--dm-ink)",
                    letterSpacing: "-0.02em",
                    marginBottom: "8px",
                  }}
                >
                  🏝️ Your Ahangama Pass
                </Title>
                <Paragraph
                  style={{
                    color: "var(--ink-muted)",
                    fontSize: "15px",
                    marginBottom: "0",
                  }}
                >
                  Show this QR code at participating venues to unlock exclusive
                  benefits
                </Paragraph>
              </div>

              <Row gutter={[24, 24]}>
                {/* QR Code Section */}
                <Col xs={24} md={12}>
                  <Card
                    title={
                      <Space>
                        <CheckCircleOutlined style={{ color: "#52c41a" }} />
                        QR Code Pass
                      </Space>
                    }
                    className="ahg-feature"
                    bodyStyle={{
                      backgroundImage:
                        "url('https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hero.jpg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      position: "relative",
                      minHeight: "300px",
                      padding: "0",
                    }}
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(255, 255, 255, 0.85)",
                        borderRadius: "0 0 8px 8px",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        flexDirection: "column",
                        padding: "24px",
                        position: "relative",
                        zIndex: 1,
                        minHeight: "300px",
                      }}
                    >
                      <div
                        style={{
                          padding: "20px",
                          background: "rgba(255, 255, 255, 0.9)",
                          borderRadius: "var(--dm-radius-lg)",
                          border: "1px solid var(--dm-line)",
                          marginBottom: "20px",
                        }}
                      >
                        <QRCode
                          value={`https://ahangama.com/card/verify?qr=${passData.qrCode}`}
                          size={200}
                        />
                      </div>
                      <Paragraph
                        style={{ textAlign: "center", marginBottom: "0" }}
                      >
                        <Text
                          strong
                          style={{ fontSize: "16px", color: "var(--dm-ink)" }}
                        >
                          Pass Code: {passData.qrCode}
                        </Text>
                        <Button
                          type="text"
                          icon={<CopyOutlined />}
                          size="small"
                          onClick={handleCopyCode}
                          style={{ marginLeft: "8px" }}
                        />
                      </Paragraph>
                    </div>
                  </Card>
                </Col>

                {/* Pass Details Section */}
                <Col xs={24} md={12}>
                  <Card
                    title="Pass Details"
                    className="ahg-feature"
                    style={{ height: "100%" }}
                  >
                    <Row gutter={[16, 20]}>
                      {/* Left Column */}
                      <Col xs={12} sm={12}>
                        <Space
                          direction="vertical"
                          style={{ width: "100%" }}
                          size="medium"
                        >
                          <div>
                            <Text type="secondary" style={{ fontSize: "15px" }}>
                              Pass Type
                            </Text>
                            <div>
                              <Text strong style={{ fontSize: "18px" }}>
                                {passData.productName}
                              </Text>
                            </div>
                          </div>

                          <div>
                            <Text type="secondary" style={{ fontSize: "15px" }}>
                              <UserOutlined /> Customer
                            </Text>
                            <div>
                              <Text strong style={{ fontSize: "18px" }}>
                                {passData.customerName}
                              </Text>
                            </div>
                          </div>

                          <div>
                            <Text type="secondary" style={{ fontSize: "15px" }}>
                              <CalendarOutlined /> Valid From
                            </Text>
                            <div>
                              <Text
                                strong
                                style={{ color: "#52c41a", fontSize: "18px" }}
                              >
                                {new Date(
                                  passData.purchaseDate,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </Text>
                            </div>
                          </div>

                          <div>
                            <Text type="secondary" style={{ fontSize: "15px" }}>
                              <CalendarOutlined /> Purchase Date
                            </Text>
                            <div>
                              <Text style={{ fontSize: "18px" }}>
                                {new Date(
                                  passData.purchaseDate,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </Text>
                            </div>
                          </div>
                        </Space>
                      </Col>

                      {/* Right Column */}
                      <Col xs={12} sm={12}>
                        <Space
                          direction="vertical"
                          style={{ width: "100%" }}
                          size="medium"
                        >
                          <div>
                            <Text type="secondary" style={{ fontSize: "15px" }}>
                              <ClockCircleOutlined /> Valid Until
                            </Text>
                            <div>
                              <Text style={{ fontSize: "18px" }}>
                                {new Date(
                                  passData.expiryDate,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </Text>
                            </div>
                          </div>

                          {passData.customerEmail && (
                            <div>
                              <Text
                                type="secondary"
                                style={{ fontSize: "15px" }}
                              >
                                <MailOutlined /> Email
                              </Text>
                              <div>
                                <Text style={{ fontSize: "18px" }}>
                                  {passData.customerEmail}
                                </Text>
                              </div>
                            </div>
                          )}

                          {passData.customerPhone && (
                            <div>
                              <Text
                                type="secondary"
                                style={{ fontSize: "15px" }}
                              >
                                <PhoneOutlined /> Phone
                              </Text>
                              <div>
                                <Text style={{ fontSize: "18px" }}>
                                  {passData.customerPhone}
                                </Text>
                              </div>
                            </div>
                          )}
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>

              <Divider style={{ margin: "32px 0" }} />

              {/* Action Buttons */}
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <Space size="large" wrap>
                  <Button
                    type="primary"
                    icon={<WhatsAppOutlined />}
                    size="large"
                    onClick={handleWhatsAppContact}
                    style={{
                      background: "#25d366",
                      borderColor: "#25d366",
                      fontSize: "16px",
                      height: "50px",
                      padding: "0 30px",
                      borderRadius: "999px",
                    }}
                  >
                    WhatsApp Support
                  </Button>

                  <Button
                    icon={<DownloadOutlined />}
                    size="large"
                    onClick={generatePassPDF}
                    style={{
                      fontSize: "16px",
                      height: "50px",
                      padding: "0 30px",
                      borderRadius: "999px",
                      background: "var(--dm-card)",
                      borderColor: "var(--dm-line)",
                    }}
                  >
                    Download PDF Pass
                  </Button>

                  <Button
                    type="default"
                    size="large"
                    onClick={() =>
                      window.open("https://ahangama.com", "_blank")
                    }
                    style={{
                      fontSize: "16px",
                      height: "50px",
                      padding: "0 30px",
                      borderRadius: "999px",
                      background: "var(--dm-card)",
                      borderColor: "var(--dm-line)",
                    }}
                  >
                    🌐 View All Venues
                  </Button>
                </Space>
              </div>

              {/* How to Use Section */}
              <Card
                title="📱 How to Use Your Pass"
                className="ahg-feature"
                style={{ marginBottom: "24px" }}
              >
                <ol
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.8",
                    color: "var(--dm-ink)",
                  }}
                >
                  <li>
                    <strong>Show the QR code</strong> above or from the
                    downloaded PDF at any participating venue
                  </li>
                  <li>
                    <strong>Ask staff to scan your code</strong> - they'll
                    verify your pass instantly
                  </li>
                  <li>
                    <strong>Enjoy your exclusive benefit</strong> - each venue
                    offers unique perks and discounts!
                  </li>
                </ol>

                <Alert
                  message="💡 Pro Tip"
                  description="Save this page to your phone's bookmarks or home screen for quick access to your pass!"
                  type="info"
                  showIcon
                  style={{
                    marginTop: "20px",
                    borderRadius: "var(--dm-radius-md)",
                    background: "rgba(79, 111, 134, 0.05)",
                    border: "1px solid rgba(79, 111, 134, 0.15)",
                  }}
                />
              </Card>

              {/* Benefits Section */}
              <Card title="🎁 What Your Pass Unlocks" className="ahg-feature">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <ul
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.6",
                        color: "var(--dm-ink)",
                      }}
                    >
                      <li>
                        <strong>Exclusive Discounts</strong> at curated
                        restaurants and cafes
                      </li>
                      <li>
                        <strong>Special Perks</strong> at wellness and
                        experience venues
                      </li>
                      <li>
                        <strong>VIP Treatment</strong> at selected
                        accommodations
                      </li>
                    </ul>
                  </Col>
                  <Col xs={24} sm={12}>
                    <ul
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.6",
                        color: "var(--dm-ink)",
                      }}
                    >
                      <li>
                        <strong>Free Items</strong> and upgrades at partner
                        locations
                      </li>
                      <li>
                        <strong>Local Insider Access</strong> to hidden gems
                      </li>
                      <li>
                        <strong>Priority Service</strong> at participating
                        venues
                      </li>
                    </ul>
                  </Col>
                </Row>
              </Card>
            </div>
          </div>
        </div>
      </SiteLayout>
    </>
  );
};

export default CardPass;
