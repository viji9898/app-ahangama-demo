import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Input,
  Button,
  Space,
  Select,
  Divider,
  Tag,
  Alert,
  Spin,
  Result,
  Modal,
  Form,
} from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ShopOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { PLACES } from "../data/places";
import VerifyStatusPanel from "../components/ui/VerifyStatusPanel";

const { Title, Paragraph, Text } = Typography;

export default function CardVerify() {
  const params = useParams();
  const prefill = params.cardId ? decodeURIComponent(params.cardId) : "";

  // Get QR code from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const qrFromUrl = urlParams.get("qr");

  const [qrCode, setQrCode] = useState(prefill || qrFromUrl || "");
  const [loading, setLoading] = useState(false);
  const [autoVerified, setAutoVerified] = useState(false);
  const [isVendorView, setIsVendorView] = useState(false);
  const [showRedemptionModal, setShowRedemptionModal] = useState(false);
  const [redemptionForm] = Form.useForm();

  // result state
  const [verificationResult, setVerificationResult] = useState(null);
  const [redemptionResult, setRedemptionResult] = useState(null);

  // Auto-verify when QR code is present in URL (vendor scanning workflow)
  useEffect(() => {
    if (qrFromUrl && qrFromUrl.trim()) {
      setIsVendorView(true);
      setQrCode(qrFromUrl);
      verifyQRCode(qrFromUrl);
    }
  }, [qrFromUrl]);

  // Get venues from places data (only venues that have offers)
  const venues = useMemo(() => {
    return PLACES.filter((place) => place.offer).map((place) => ({
      id: place.id || place.slug,
      name: place.name,
      category: place.category,
      offer: place.offer,
      pin: "1234", // Default PIN for demo - in production this would be secure
    }));
  }, []);

  // Redemption types based on venue categories
  const redemptionTypes = [
    {
      value: "discount",
      label: "🎯 Discount/Offer",
      categories: ["eat", "stay", "surf", "shop"],
    },
    { value: "free-item", label: "🎁 Free Item", categories: ["eat", "shop"] },
    {
      value: "upgrade",
      label: "⭐ Upgrade Service",
      categories: ["stay", "surf"],
    },
    {
      value: "welcome-drink",
      label: "🥤 Welcome Drink",
      categories: ["eat", "stay"],
    },
    {
      value: "priority-access",
      label: "🚀 Priority Access",
      categories: ["surf", "activity"],
    },
    {
      value: "custom",
      label: "🔧 Custom Offer",
      categories: ["eat", "stay", "surf", "shop", "activity"],
    },
  ];

  const canonical = absUrl(
    params.cardId
      ? `/card/verify/${encodeURIComponent(prefill)}`
      : "/card/verify"
  );

  // QR Code verification function
  const verifyQRCode = async (codeToVerify = null) => {
    const targetCode = codeToVerify || qrCode;
    if (!targetCode) {
      setVerificationResult({
        valid: false,
        error: "Please enter a QR code",
      });
      return;
    }

    setLoading(true);
    setVerificationResult(null);
    setRedemptionResult(null);

    try {
      const response = await fetch(
        `/.netlify/functions/qr-verify?qr=${encodeURIComponent(targetCode)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setVerificationResult(result);
    } catch (error) {
      setVerificationResult({
        valid: false,
        error: "Failed to verify QR code. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Redeem pass at venue
  const redeemPass = async (formData) => {
    if (!qrCode) return;

    setLoading(true);
    setRedemptionResult(null);

    try {
      const selectedVenue = venues.find((v) => v.id === formData.venueId);

      const response = await fetch("/.netlify/functions/log-redemption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qrCode,
          venueId: selectedVenue.id,
          venueName: selectedVenue.name,
          venueCategory: selectedVenue.category,
          redemptionType: formData.redemptionType,
          customOffer: formData.customOffer || null,
          offerUsed: selectedVenue.offer,
          vendorPin: formData.pin,
        }),
      });

      if (!response.ok) {
        // Try to get the error message from the server response
        const errorResponse = await response.json().catch(() => ({}));
        const errorMessage =
          errorResponse.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setRedemptionResult(result);

      // Close modal and clear verification result after successful redemption
      if (result.success) {
        setShowRedemptionModal(false);
        setVerificationResult(null);
        redemptionForm.resetFields();
      }
    } catch (error) {
      setRedemptionResult({
        success: false,
        error: error.message || "Failed to redeem pass. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Redemption Modal Component - defined early to avoid hoisting issues
  const RedemptionModal = () => {
    console.log(
      "RedemptionModal rendering, showRedemptionModal:",
      showRedemptionModal
    );
    return (
      <Modal
        title={
          <Space>
            <ShopOutlined />
            Log Redemption
          </Space>
        }
        open={showRedemptionModal}
        onCancel={() => {
          setShowRedemptionModal(false);
          redemptionForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={redemptionForm}
          layout="vertical"
          onFinish={redeemPass}
          initialValues={{
            redemptionType: "discount",
          }}
        >
          <Form.Item
            label="Venue"
            name="venueId"
            rules={[{ required: true, message: "Please select a venue" }]}
          >
            <Select
              placeholder="Select your venue"
              options={venues.map((v) => ({
                value: v.id,
                label: `${v.name} (${v.category})`,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Redemption Type"
            name="redemptionType"
            rules={[
              { required: true, message: "Please select redemption type" },
            ]}
          >
            <Select
              placeholder="Select redemption type"
              options={redemptionTypes.map((type) => ({
                value: type.value,
                label: type.label,
              }))}
            />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.redemptionType !== currentValues.redemptionType
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("redemptionType") === "custom" ? (
                <Form.Item
                  label="Custom Offer Description"
                  name="customOffer"
                  rules={[
                    {
                      required: true,
                      message: "Please describe the custom offer",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={2}
                    placeholder="Describe the specific offer provided..."
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item
            label="Venue PIN"
            name="pin"
            rules={[{ required: true, message: "Please enter venue PIN" }]}
          >
            <Input.Password placeholder="Enter your venue PIN" />
          </Form.Item>

          <div style={{ color: "#8c8c8c", fontSize: 12, marginBottom: 16 }}>
            Demo PIN: 1234 (for all venues)
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  setShowRedemptionModal(false);
                  redemptionForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ background: "#52c41a", borderColor: "#52c41a" }}
              >
                Complete Redemption
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  // Special vendor view when QR code is scanned directly
  if (isVendorView && verificationResult) {
    const isValid = verificationResult.valid && !verificationResult.expired;
    const bgColor = isValid ? "#f6ffed" : "#fff2f0";
    const borderColor = isValid ? "#52c41a" : "#ff4d4f";

    return (
      <>
        {/* Redemption Modal - needed in vendor view too */}
        <RedemptionModal />

        <div
          style={{
            minHeight: "100vh",
            backgroundColor: bgColor,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card
            style={{
              width: "100%",
              maxWidth: 500,
              borderRadius: 16,
              border: `2px solid ${borderColor}`,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
            bodyStyle={{ padding: 32, textAlign: "center" }}
          >
            {isValid ? (
              <>
                <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                <Title level={2} style={{ color: "#52c41a", marginBottom: 8 }}>
                  VALID PASS
                </Title>

                <div style={{ marginTop: 24, textAlign: "left" }}>
                  <Title
                    level={4}
                    style={{ marginBottom: 16, color: "#262626" }}
                  >
                    Customer Details:
                  </Title>

                  <Space
                    direction="vertical"
                    size={12}
                    style={{ width: "100%" }}
                  >
                    <div>
                      <Text strong style={{ color: "#595959" }}>
                        Name:
                      </Text>
                      <div style={{ fontSize: 18, fontWeight: 500 }}>
                        {verificationResult.purchase?.customerName}
                      </div>
                    </div>

                    <div>
                      <Text strong style={{ color: "#595959" }}>
                        Email:
                      </Text>
                      <div style={{ fontSize: 16 }}>
                        {verificationResult.purchase?.customerEmail}
                      </div>
                    </div>

                    <div>
                      <Text strong style={{ color: "#595959" }}>
                        Phone:
                      </Text>
                      <div style={{ fontSize: 16 }}>
                        {verificationResult.purchase?.customerPhone ||
                          "Not provided"}
                      </div>
                    </div>

                    <Divider />

                    <div>
                      <Text strong style={{ color: "#595959" }}>
                        Pass Type:
                      </Text>
                      <div style={{ fontSize: 16 }}>
                        {verificationResult.purchase?.productName}
                      </div>
                    </div>

                    <div>
                      <Text strong style={{ color: "#595959" }}>
                        Expires:
                      </Text>
                      <div
                        style={{
                          fontSize: 16,
                          color: "#52c41a",
                          fontWeight: 500,
                        }}
                      >
                        {new Date(
                          verificationResult.purchase?.expiryDate
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>

                    <div>
                      <Text strong style={{ color: "#595959" }}>
                        Max People:
                      </Text>
                      <div style={{ fontSize: 16 }}>
                        {verificationResult.purchase?.maxPeople}{" "}
                        {verificationResult.purchase?.maxPeople === 1
                          ? "person"
                          : "people"}
                      </div>
                    </div>

                    {verificationResult.purchase?.redemptionCount > 0 && (
                      <div>
                        <Text strong style={{ color: "#595959" }}>
                          Previous Uses:
                        </Text>
                        <div style={{ fontSize: 16 }}>
                          {verificationResult.purchase.redemptionCount} times
                        </div>
                      </div>
                    )}
                  </Space>

                  {/* Add redemption button for valid passes */}
                  <Button
                    type="primary"
                    size="large"
                    icon={<GiftOutlined />}
                    onClick={() => {
                      console.log("Redemption button clicked");
                      setShowRedemptionModal(true);
                    }}
                    style={{
                      marginTop: 24,
                      width: "100%",
                      height: 48,
                      fontSize: 16,
                      background: "#52c41a",
                      borderColor: "#52c41a",
                    }}
                  >
                    Log Redemption
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 64, marginBottom: 16 }}>❌</div>
                <Title level={2} style={{ color: "#ff4d4f", marginBottom: 8 }}>
                  {verificationResult.expired ? "EXPIRED PASS" : "INVALID PASS"}
                </Title>

                <Text style={{ fontSize: 16, color: "#8c8c8c" }}>
                  {verificationResult.error ||
                    "This QR code is not valid or has expired."}
                </Text>

                {verificationResult.expired && verificationResult.purchase && (
                  <div style={{ marginTop: 24, textAlign: "left" }}>
                    <Text strong style={{ color: "#595959" }}>
                      Customer:
                    </Text>
                    <div style={{ fontSize: 16 }}>
                      {verificationResult.purchase.customerName}
                    </div>

                    <Text
                      strong
                      style={{
                        color: "#595959",
                        marginTop: 12,
                        display: "block",
                      }}
                    >
                      Expired:
                    </Text>
                    <div style={{ fontSize: 16, color: "#ff4d4f" }}>
                      {new Date(
                        verificationResult.purchase.expiryDate
                      ).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </>
            )}

            <Button
              type="primary"
              size="large"
              style={{ marginTop: 32, width: "100%" }}
              onClick={() => window.location.reload()}
            >
              Scan Another Pass
            </Button>
          </Card>

          <Text style={{ marginTop: 16, color: "#8c8c8c", fontSize: 14 }}>
            QR Code: {qrCode}
          </Text>
        </div>
      </>
    );
  }

  return (
    <SiteLayout>
      <Seo
        title="Vendor Verify — Ahangama Pass"
        description="Verify and redeem Ahangama Pass QR codes"
        canonical={canonical}
      />

      {/* Redemption Modal */}
      <RedemptionModal />

      <Card
        style={{ borderRadius: 16, border: "1px solid #eee" }}
        bodyStyle={{ padding: 18 }}
      >
        <Title level={2} style={{ marginTop: 0, marginBottom: 4 }}>
          Vendor Verify
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Scan QR code → verify pass → log redemption with venue details.
        </Paragraph>
      </Card>

      {/* Verification Result */}
      {verificationResult && (
        <div style={{ marginTop: 14 }}>
          {verificationResult.valid ? (
            <Alert
              message="Valid Pass Found!"
              description={
                <div>
                  <Text strong>{verificationResult.purchase?.productName}</Text>
                  <br />
                  <Text>
                    Customer: {verificationResult.purchase?.customerName}
                  </Text>
                  <br />
                  <Text>
                    Valid for: {verificationResult.purchase?.maxPeople}{" "}
                    {verificationResult.purchase?.maxPeople === 1
                      ? "person"
                      : "people"}
                  </Text>
                  <br />
                  <Text>
                    Expires:{" "}
                    {new Date(
                      verificationResult.purchase?.expiryDate
                    ).toLocaleDateString()}
                  </Text>
                </div>
              }
              type="success"
              icon={<CheckCircleOutlined />}
              showIcon
              style={{ borderRadius: 8 }}
            />
          ) : (
            <Alert
              message="Invalid QR Code"
              description={
                verificationResult.error ||
                "This QR code is not valid or has expired."
              }
              type="error"
              icon={<ExclamationCircleOutlined />}
              showIcon
              style={{ borderRadius: 8 }}
            />
          )}
        </div>
      )}

      {/* Redemption Result */}
      {redemptionResult && (
        <div style={{ marginTop: 14 }}>
          {redemptionResult.success ? (
            <Result
              status="success"
              title="Pass Redeemed Successfully!"
              subTitle={redemptionResult.message}
              extra={[
                <Button
                  key="verify"
                  onClick={() => {
                    setQrCode("");
                    setVerificationResult(null);
                    setRedemptionResult(null);
                  }}
                >
                  Verify Another Pass
                </Button>,
              ]}
            />
          ) : (
            <Alert
              message="Redemption Failed"
              description={
                redemptionResult.error || "Unable to redeem this pass."
              }
              type="error"
              showIcon
              style={{ borderRadius: 8 }}
            />
          )}
        </div>
      )}

      <Card
        style={{ marginTop: 14, borderRadius: 16, border: "1px solid #eee" }}
        bodyStyle={{ padding: 16 }}
      >
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <div>
            <Text strong>QR Code</Text>
            <Input
              style={{ marginTop: 6 }}
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
              placeholder="Scan QR code or enter manually"
              allowClear
            />
          </div>

          <Space wrap>
            <Button
              type="primary"
              size="large"
              onClick={verifyQRCode}
              loading={loading}
              disabled={!qrCode}
            >
              Verify QR Code
            </Button>

            {verificationResult?.valid && (
              <Button
                type="default"
                size="large"
                onClick={() => {
                  console.log("Regular redemption button clicked");
                  setShowRedemptionModal(true);
                }}
                loading={loading}
                disabled={!qrCode}
                icon={<GiftOutlined />}
                style={{
                  background: "#52c41a",
                  borderColor: "#52c41a",
                  color: "white",
                }}
              >
                Log Redemption
              </Button>
            )}

            <Button
              onClick={() => {
                setQrCode("");
                setVerificationResult(null);
                setRedemptionResult(null);
              }}
            >
              Clear
            </Button>
          </Space>
        </Space>
      </Card>
    </SiteLayout>
  );
}
