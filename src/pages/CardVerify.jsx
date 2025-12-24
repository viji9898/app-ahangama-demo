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
} from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
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

  const [venueId, setVenueId] = useState("");
  const [pin, setPin] = useState("");
  const [qrCode, setQrCode] = useState(prefill || qrFromUrl || "");
  const [loading, setLoading] = useState(false);
  const [autoVerified, setAutoVerified] = useState(false);
  const [isVendorView, setIsVendorView] = useState(false);

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
      pin: "1234", // Default PIN for demo - in production this would be secure
    }));
  }, []);

  const venue = useMemo(
    () => venues.find((v) => v.id === venueId) || null,
    [venueId, venues]
  );

  const canonical = absUrl(
    params.cardId
      ? `/card/verify/${encodeURIComponent(prefill)}`
      : "/card/verify"
  );

  const isAuthed = useMemo(() => {
    if (!venue) return false;
    return pin === venue.pin;
  }, [pin, venue]);

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
  const redeemPass = async () => {
    if (!venue || !isAuthed || !qrCode) return;

    setLoading(true);
    setRedemptionResult(null);

    try {
      const response = await fetch("/.netlify/functions/qr-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qrCode,
          venueId: venue.id,
          venueName: venue.name,
          venueCategory: venue.category,
          offerUsed:
            PLACES.find((p) => (p.id || p.slug) === venue.id)?.offer ||
            "Standard offer",
        }),
      });

      const result = await response.json();
      setRedemptionResult(result);

      // Clear verification result after successful redemption
      if (result.success) {
        setVerificationResult(null);
      }
    } catch (error) {
      setRedemptionResult({
        success: false,
        error: "Failed to redeem pass. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Special vendor view when QR code is scanned directly
  if (isVendorView && verificationResult) {
    const isValid = verificationResult.valid && !verificationResult.expired;
    const bgColor = isValid ? "#f6ffed" : "#fff2f0";
    const borderColor = isValid ? "#52c41a" : "#ff4d4f";

    return (
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
                <Title level={4} style={{ marginBottom: 16, color: "#262626" }}>
                  Customer Details:
                </Title>

                <Space direction="vertical" size={12} style={{ width: "100%" }}>
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
    );
  }

  return (
    <SiteLayout>
      <Seo
        title="Vendor Verify — Ahangama Pass"
        description="Verify and redeem Ahangama Pass QR codes"
        canonical={canonical}
      />

      <Card
        style={{ borderRadius: 16, border: "1px solid #eee" }}
        bodyStyle={{ padding: 18 }}
      >
        <Title level={2} style={{ marginTop: 0, marginBottom: 4 }}>
          Vendor Verify
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Select venue → enter PIN → scan QR → verify → redeem.
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
            <Text strong>Venue</Text>
            <Select
              style={{ width: "100%", marginTop: 6 }}
              value={venueId}
              onChange={(value) => {
                setVenueId(value);
                setVerificationResult(null);
                setRedemptionResult(null);
              }}
              placeholder="Select your venue"
              options={venues.map((v) => ({
                value: v.id,
                label: `${v.name} (${v.category})`,
              }))}
            />
          </div>

          <div>
            <Text strong>Venue PIN</Text>
            <Input.Password
              style={{ marginTop: 6 }}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter venue PIN"
              disabled={!venue}
            />
            <Text
              type="secondary"
              style={{ fontSize: 12, display: "block", marginTop: 4 }}
            >
              Demo PIN: 1234 (for all venues)
            </Text>
          </div>

          <Divider style={{ margin: "8px 0" }} />

          <div>
            <Text strong>QR Code</Text>
            <Input
              style={{ marginTop: 6 }}
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
              placeholder="Scan QR code or enter manually"
              allowClear
              disabled={!isAuthed}
            />
          </div>

          <Space wrap>
            <Button
              type="primary"
              size="large"
              onClick={verifyQRCode}
              loading={loading}
              disabled={!isAuthed || !qrCode}
            >
              Verify QR Code
            </Button>

            {verificationResult?.valid && (
              <Button
                type="default"
                size="large"
                onClick={redeemPass}
                loading={loading}
                disabled={!isAuthed || !qrCode}
                style={{
                  background: "#52c41a",
                  borderColor: "#52c41a",
                  color: "white",
                }}
              >
                Redeem Pass
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

          {!isAuthed && venue && (
            <Alert
              message="Enter PIN to continue"
              description={`Please enter the PIN for ${venue.name} to verify passes.`}
              type="warning"
              showIcon
            />
          )}
        </Space>
      </Card>
    </SiteLayout>
  );
}
