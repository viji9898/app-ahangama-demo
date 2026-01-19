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

    // Fetch pass data from the API
    const fetchPassData = async () => {
      try {
        const response = await fetch(
          `/.netlify/functions/qr-verify?qr=${encodeURIComponent(qrCode)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.valid) {
          setError(result.error || "Invalid pass code");
          setLoading(false);
          return;
        }

        // Transform API response to match our component needs
        const purchase = result.purchase;
        const passData = {
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
            Math.ceil((new Date(purchase.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
          ),
        };

        setPassData(passData);
      } catch (err) {
        console.error("Error fetching pass data:", err);
        setError("Failed to load pass data");
      } finally {
        setLoading(false);
      }
    };

    fetchPassData();
  }, [qrCode]);

  const handleWhatsAppContact = () => {
    const message = `Hi! I need help with my Ahangama Pass. My pass code is: ${qrCode}`;
    const whatsappUrl = `https://wa.me/94777908790?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(qrCode);
    // You could add a notification here
  };

  const generatePassPDF = async () => {
    if (!passData) return;

    // Create A5 PDF (148mm x 210mm)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a5",
    });

    // Generate QR Code as data URL
    const qrCodeDataUrl = await QRCodeLib.toDataURL(`https://ahangama.com/card/verify?qr=${passData.qrCode}`, {
      width: 150,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    // Set up tropical beach background
    pdf.setFillColor(255, 218, 185); // Warm peach base
    pdf.rect(0, 0, 148, 210, "F");

    // Header with coral gradient
    pdf.setFillColor(255, 127, 80); // Coral sunset
    pdf.rect(0, 0, 148, 28, "F");

    // Title
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("🏝️ Ahangama Pass", 74, 14, { align: "center" });

    // Subtitle
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text("Show QR code at participating venues", 74, 23, { align: "center" });

    // QR Code
    const qrSize = 65;
    const qrX = (148 - qrSize) / 2;
    const qrY = 38;

    // QR code background
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(1);
    pdf.rect(qrX - 3, qrY - 3, qrSize + 6, qrSize + 6, "FD");

    pdf.addImage(qrCodeDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

    // QR Code ID
    pdf.setTextColor(45, 52, 54);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    const qrCodeId = passData.qrCode.split("-").pop();
    pdf.text(qrCodeId, 74, qrY + qrSize + 12, { align: "center" });

    // Details card
    const cardY = qrY + qrSize + 22;
    const cardHeight = 85;

    // Card background with shadow
    pdf.setFillColor(240, 240, 240);
    pdf.rect(11, cardY + 1, 126, cardHeight, "F");
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.5);
    pdf.rect(10, cardY, 128, cardHeight, "FD");

    // Pass details
    let detailY = cardY + 10;
    const labelFontSize = 8;
    const valueFontSize = 10;

    // Pass Type
    pdf.setTextColor(120, 120, 120);
    pdf.setFontSize(labelFontSize);
    pdf.text("PASS TYPE", 16, detailY);
    pdf.setTextColor(44, 62, 80);
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.text(passData.productName, 16, detailY + 8);
    detailY += 18;

    // Divider
    pdf.setDrawColor(235, 235, 235);
    pdf.setLineWidth(0.3);
    pdf.line(16, detailY, 132, detailY);
    detailY += 8;

    // Two columns
    const leftColX = 16;
    const rightColX = 80;

    // Customer name
    pdf.setTextColor(120, 120, 120);
    pdf.setFontSize(labelFontSize);
    pdf.setFont("helvetica", "normal");
    pdf.text("CUSTOMER", leftColX, detailY);
    pdf.setTextColor(44, 62, 80);
    pdf.setFontSize(valueFontSize);
    pdf.setFont("helvetica", "bold");
    pdf.text(passData.customerName, leftColX, detailY + 8);

    // Validity
    pdf.setTextColor(120, 120, 120);
    pdf.setFontSize(labelFontSize);
    pdf.setFont("helvetica", "normal");
    pdf.text("VALID FOR", rightColX, detailY);
    pdf.setTextColor(44, 62, 80);
    pdf.setFontSize(valueFontSize);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${passData.validityDays} days`, rightColX, detailY + 8);

    detailY += 16;

    // Start date
    pdf.setTextColor(120, 120, 120);
    pdf.setFontSize(labelFontSize);
    pdf.setFont("helvetica", "normal");
    pdf.text("STARTS", leftColX, detailY);
    pdf.setTextColor(44, 62, 80);
    pdf.setFontSize(valueFontSize);
    pdf.setFont("helvetica", "bold");
    const startDate = new Date(passData.purchaseDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    pdf.text(startDate, leftColX, detailY + 8);

    // Expires
    pdf.setTextColor(120, 120, 120);
    pdf.setFontSize(labelFontSize);
    pdf.setFont("helvetica", "normal");
    pdf.text("EXPIRES", rightColX, detailY);
    pdf.setTextColor(44, 62, 80);
    pdf.setFontSize(valueFontSize);
    pdf.setFont("helvetica", "bold");
    const expiryDate = new Date(passData.expiryDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    pdf.text(expiryDate, rightColX, detailY + 8);

    // Footer
    const footerStartY = cardY + cardHeight + 15;

    // Website info
    pdf.setTextColor(100, 149, 237);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("🌐 ahangama.com - Discover all venues", 74, footerStartY, {
      align: "center",
    });

    // WhatsApp button
    const whatsappY = footerStartY + 12;
    const buttonWidth = 75;
    const buttonHeight = 20;
    const buttonX = (148 - buttonWidth) / 2;

    // Button shadow
    pdf.setFillColor(200, 200, 200);
    pdf.rect(buttonX + 1, whatsappY + 1, buttonWidth, buttonHeight, "F");

    // Main button
    pdf.setFillColor(37, 211, 102);
    pdf.rect(buttonX, whatsappY, buttonWidth, buttonHeight, "F");

    // Button text
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("💬 WhatsApp Support", 74, whatsappY + 8, { align: "center" });

    // Phone number
    pdf.setTextColor(120, 120, 120);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text("+94 777 908 790", 74, whatsappY + 15, { align: "center" });

    // Add clickable link
    const whatsappUrl = `https://wa.me/94777908790?text=Hi!%20I%20need%20help%20with%20my%20Ahangama%20Pass`;
    pdf.link(buttonX, whatsappY, buttonWidth, buttonHeight, { url: whatsappUrl });

    // Contact details
    const contactY = whatsappY + 25;
    pdf.setTextColor(120, 120, 120);
    pdf.setFontSize(8);

    if (passData.customerEmail) {
      pdf.text("📧 " + passData.customerEmail, 74, contactY, { align: "center" });
    }

    if (passData.customerPhone) {
      pdf.text("📱 " + passData.customerPhone, 74, contactY + 6, { align: "center" });
    }

    // Save PDF
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
    Math.ceil((new Date(passData.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
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
                <Title level={2} style={{ 
                  color: "var(--dm-ink)",
                  letterSpacing: "-0.02em",
                  marginBottom: "8px"
                }}>
                  🏝️ Your Ahangama Pass
                </Title>
                <Paragraph style={{ 
                  color: "var(--ink-muted)", 
                  fontSize: "15px",
                  marginBottom: "0"
                }}>
                  Show this QR code at participating venues to unlock exclusive benefits
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
                      backgroundImage: "url('https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hero.jpg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      position: "relative",
                      minHeight: "300px",
                      padding: "0"
                    }}
                    style={{ 
                      height: "100%",
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "rgba(255, 255, 255, 0.85)",
                      borderRadius: "0 0 8px 8px"
                    }} />
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "center", 
                      alignItems: "center",
                      flex: 1,
                      flexDirection: "column",
                      padding: "24px",
                      position: "relative",
                      zIndex: 1,
                      minHeight: "300px"
                    }}>
                      <div style={{
                        padding: "20px",
                        background: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "var(--dm-radius-lg)",
                        border: "1px solid var(--dm-line)",
                        marginBottom: "20px"
                      }}>
                        <QRCode
                          value={`https://ahangama.com/card/verify?qr=${passData.qrCode}`}
                          size={200}
                        />
                      </div>
                      <Paragraph style={{ textAlign: "center", marginBottom: "0" }}>
                        <Text strong style={{ fontSize: "16px", color: "var(--dm-ink)" }}>
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
                    <Space direction="vertical" style={{ width: "100%" }} size="medium">
                      <div>
                        <Text type="secondary" style={{ fontSize: "15px" }}>Pass Type</Text>
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
                          <Text strong style={{ fontSize: "18px" }}>{passData.customerName}</Text>
                        </div>
                      </div>

                      <div>
                        <Text type="secondary" style={{ fontSize: "15px" }}>
                          <CalendarOutlined /> Valid From
                        </Text>
                        <div>
                          <Text strong style={{ color: "#52c41a", fontSize: "18px" }}>
                            {new Date(passData.purchaseDate).toLocaleDateString("en-US", {
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
                            {new Date(passData.purchaseDate).toLocaleDateString("en-US", {
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
                    <Space direction="vertical" style={{ width: "100%" }} size="medium">
                      <div>
                        <Text type="secondary" style={{ fontSize: "15px" }}>
                          <ClockCircleOutlined /> Valid Until
                        </Text>
                        <div>
                          <Text style={{ fontSize: "18px" }}>
                            {new Date(passData.expiryDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </Text>
                        </div>
                      </div>

                      {passData.customerEmail && (
                        <div>
                          <Text type="secondary" style={{ fontSize: "15px" }}>
                            <MailOutlined /> Email
                          </Text>
                          <div>
                            <Text style={{ fontSize: "18px" }}>{passData.customerEmail}</Text>
                          </div>
                        </div>
                      )}

                      {passData.customerPhone && (
                        <div>
                          <Text type="secondary" style={{ fontSize: "15px" }}>
                            <PhoneOutlined /> Phone
                          </Text>
                          <div>
                            <Text style={{ fontSize: "18px" }}>{passData.customerPhone}</Text>
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
                      borderRadius: "999px"
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
                      borderColor: "var(--dm-line)"
                    }}
                  >
                    Download PDF Pass
                  </Button>

                  <Button
                    type="default"
                    size="large"
                    onClick={() => window.open("https://ahangama.com", "_blank")}
                    style={{
                      fontSize: "16px",
                      height: "50px",
                      padding: "0 30px",
                      borderRadius: "999px",
                      background: "var(--dm-card)",
                      borderColor: "var(--dm-line)"
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
                <ol style={{ fontSize: "16px", lineHeight: "1.8", color: "var(--dm-ink)" }}>
                  <li>
                    <strong>Show the QR code</strong> above or from the downloaded PDF at any participating venue
                  </li>
                  <li>
                    <strong>Ask staff to scan your code</strong> - they'll verify your pass instantly
                  </li>
                  <li>
                    <strong>Enjoy your exclusive benefit</strong> - each venue offers unique perks and discounts!
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
                    border: "1px solid rgba(79, 111, 134, 0.15)"
                  }}
                />
              </Card>

              {/* Benefits Section */}
              <Card
                title="🎁 What Your Pass Unlocks"
                className="ahg-feature"
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--dm-ink)" }}>
                      <li><strong>Exclusive Discounts</strong> at curated restaurants and cafes</li>
                      <li><strong>Special Perks</strong> at wellness and experience venues</li>
                      <li><strong>VIP Treatment</strong> at selected accommodations</li>
                    </ul>
                  </Col>
                  <Col xs={24} sm={12}>
                    <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--dm-ink)" }}>
                      <li><strong>Free Items</strong> and upgrades at partner locations</li>
                      <li><strong>Local Insider Access</strong> to hidden gems</li>
                      <li><strong>Priority Service</strong> at participating venues</li>
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