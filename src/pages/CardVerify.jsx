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
import { usePlaces } from "../app/placesContext";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import VerifyStatusPanel from "../components/ui/VerifyStatusPanel";
import { normalizeQrCode, redeemCard, verifyCardByCode } from "../app/cardStore";
import { getPromoPassById, redeemPromoPass } from "../services/stripe";
import palmTreeIcon from "../assets/receipt_icons/palm-tree-icon.svg";

const { Title, Paragraph, Text } = Typography;

const normalizePromoVerificationResult = (purchase) => {
  const expiryDate = purchase.expiryDate || purchase.validTo || null;
  const startDate = purchase.startDate || purchase.validFrom || null;
  const now = Date.now();
  const expiryTime = Date.parse(expiryDate || 0);
  const startTime = Date.parse(startDate || 0);
  const expired = Number.isFinite(expiryTime) ? now > expiryTime : false;
  const notYetActive = Number.isFinite(startTime) ? now < startTime : false;
  const alreadyRedeemed = Boolean(purchase.isRedeemedAtVenue);
  const valid = !expired && !notYetActive;

  return {
    valid,
    expired,
    redeemable: valid && !alreadyRedeemed,
    error: expired
      ? "Card expired"
      : notYetActive
        ? "Card not active yet"
        : null,
    purchase: {
      qrCode: purchase.passId,
      cardId: purchase.passId,
      customerName: purchase.customerName,
      customerEmail: purchase.customerEmail,
      customerPhone: purchase.customerPhone,
      productName: purchase.productName,
      startDate,
      expiryDate,
      maxPeople: purchase.maxPeople || 1,
      venueSlug: purchase.venueSlug || "",
      venueName: purchase.venueName || purchase.venueSlug || "",
      redemptionCount: Number(purchase.redemptionCount || 0),
      isPromo: true,
      isRedeemedAtVenue: alreadyRedeemed,
      redemptionVenueSlug:
        purchase.redemptionVenueSlug || purchase.venueSlug || "",
      redeemedAt: purchase.redeemedAt || null,
    },
  };
};

async function getVerificationResultForCode(targetCode) {
  const promoPass = await getPromoPassById(targetCode);
  return promoPass?.passId
    ? normalizePromoVerificationResult(promoPass)
    : verifyCardByCode(targetCode);
}

export default function CardVerify() {
  const { places: allPlaces } = usePlaces();
  const params = useParams();
  const prefill = params.cardId ? decodeURIComponent(params.cardId) : "";

  const parseQrFromLocation = () => {
    const rawSearch = window.location.search || "";
    const urlParams = new URLSearchParams(rawSearch);
    const qrParam = urlParams.get("qr");

    if (qrParam) {
      return normalizeQrCode(qrParam);
    }

    const rawValue = rawSearch.replace(/^\?/, "").trim();
    if (rawValue && !rawValue.includes("=")) {
      return normalizeQrCode(rawValue);
    }

    return "";
  };

  const qrFromUrl = parseQrFromLocation();
  const directVerifyCode = normalizeQrCode(prefill || qrFromUrl || "");

  const [qrCode, setQrCode] = useState(directVerifyCode);
  const [loading, setLoading] = useState(Boolean(directVerifyCode));
  const [isVendorView, setIsVendorView] = useState(Boolean(directVerifyCode));
  const [showRedemptionModal, setShowRedemptionModal] = useState(false);
  const [redemptionForm] = Form.useForm();

  // result state
  const [verificationResult, setVerificationResult] = useState(null);
  const [redemptionResult, setRedemptionResult] = useState(null);

  // Auto-verify when QR code is present in URL (vendor scanning workflow)
  useEffect(() => {
    if (directVerifyCode) {
      setIsVendorView(true);
      setQrCode(directVerifyCode);

      const runAutoVerify = async () => {
        setLoading(true);
        setVerificationResult(null);
        setRedemptionResult(null);

        try {
          const result = await getVerificationResultForCode(directVerifyCode);
          setVerificationResult(result);
        } catch {
          setVerificationResult({
            valid: false,
            error: "Failed to verify QR code. Please try again.",
          });
        } finally {
          setLoading(false);
        }
      };

      runAutoVerify();
    }
  }, [directVerifyCode]);

  // Get venues from places data (only venues that have offers)
  const venues = useMemo(() => {
    return allPlaces
      .filter((place) => place.offer)
      .map((place) => ({
        id: place.slug || place.id,
        slug: place.slug || place.id,
        name: place.name,
        category: place.category,
        offer: place.offer,
        pin: "1234", // Default PIN for demo - in production this would be secure
      }));
  }, [allPlaces]);

  useEffect(() => {
    if (!showRedemptionModal || !verificationResult?.purchase) {
      return;
    }

    if (verificationResult.purchase.isPromo && verificationResult.purchase.venueSlug) {
      redemptionForm.setFieldsValue({
        venueId: verificationResult.purchase.venueSlug,
        redemptionType: redemptionForm.getFieldValue("redemptionType") || "discount",
      });
    }
  }, [showRedemptionModal, verificationResult, redemptionForm]);

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
      ? `/verify/${encodeURIComponent(prefill)}`
      : "/verify",
  );

  // QR Code verification function
  const verifyQRCode = async (codeToVerify = null) => {
    const targetCode = normalizeQrCode(codeToVerify || qrCode);
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
      const result = await getVerificationResultForCode(targetCode);
      setVerificationResult(result);
    } catch {
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
      const selectedVenue = venues.find(
        (venue) => venue.id === formData.venueId || venue.slug === formData.venueId,
      );

      if (verificationResult?.purchase?.isPromo) {
        const promoVenueSlug = verificationResult.purchase.venueSlug;
        const promoVenueName =
          selectedVenue?.name ||
          verificationResult.purchase.venueName ||
          promoVenueSlug;

        const result = await redeemPromoPass({
          passId: verificationResult.purchase.cardId,
          venueSlug: promoVenueSlug,
          venueName: promoVenueName,
          redemptionType: formData.redemptionType,
          offerUsed:
            formData.customOffer ||
            (Array.isArray(selectedVenue?.offer)
              ? selectedVenue.offer.join(", ")
              : selectedVenue?.offer) ||
            "Offer redeemed",
          vendorPin: formData.pin,
        });

        setRedemptionResult(result);
        setVerificationResult(
          await getVerificationResultForCode(verificationResult.purchase.cardId),
        );

        if (result.success) {
          redemptionForm.resetFields();
        }

        return;
      }

      const result = redeemCard({
        qrCode,
        venueId: selectedVenue.id,
        venueName: selectedVenue.name,
        venueCategory: selectedVenue.category,
        redemptionType: formData.redemptionType,
        customOffer: formData.customOffer || null,
        offerUsed: Array.isArray(selectedVenue.offer)
          ? selectedVenue.offer.join(", ")
          : selectedVenue.offer,
        vendorPin: formData.pin,
      });

      if (!result.success) {
        throw new Error(result.error || "Unable to redeem this pass.");
      }

      setRedemptionResult(result);
      setVerificationResult(verifyCardByCode(qrCode));

      if (result.success) {
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
      showRedemptionModal,
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
          {/* Show redemption result within the modal */}
          {redemptionResult && (
            <div style={{ marginBottom: 16 }}>
              {redemptionResult.success ? (
                <Alert
                  message="Pass Redeemed Successfully!"
                  description={redemptionResult.message}
                  type="success"
                  showIcon
                  closable
                  onClose={() => {
                    setRedemptionResult(null);
                    setShowRedemptionModal(false);
                    setVerificationResult(null);
                  }}
                  action={
                    <Button
                      size="small"
                      type="text"
                      onClick={() => {
                        setRedemptionResult(null);
                        setShowRedemptionModal(false);
                        setVerificationResult(null);
                      }}
                    >
                      Done
                    </Button>
                  }
                  style={{ borderRadius: 8 }}
                />
              ) : (
                <Alert
                  message="Redemption Failed"
                  description={
                    redemptionResult.error || "Unable to redeem this pass."
                  }
                  type="error"
                  showIcon
                  closable
                  onClose={() => setRedemptionResult(null)}
                  style={{ borderRadius: 8 }}
                />
              )}
            </div>
          )}

          <Form.Item
            label="Venue"
            name="venueId"
            rules={[{ required: true, message: "Please select a venue" }]}
          >
            <Select
              placeholder="Select your venue"
              disabled={Boolean(verificationResult?.purchase?.isPromo)}
              options={
                verificationResult?.purchase?.isPromo
                  ? [
                      {
                        value: verificationResult.purchase.venueSlug,
                        label: verificationResult.purchase.venueName,
                      },
                    ]
                  : venues.map((v) => ({
                      value: v.id,
                      label: `${v.name} (${v.category})`,
                    }))
              }
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
  if (isVendorView && loading) {
    return (
      <div className="qr-page qr-verifyPage">
        <div className="qr-shell">
          <section className="qr-receiptCard">
            <div className="qr-receiptPaper qr-verifyReceiptPaper">
              <div className="qr-receiptBrandBlock">
                <img
                  src={palmTreeIcon}
                  alt=""
                  className="qr-receiptBrandIcon"
                  aria-hidden="true"
                />
                <div className="qr-receiptBrandTitle">AHANGAMA PASS</div>
                <div className="qr-receiptBrandTagline">VERIFYING PASS</div>
              </div>

              <div className="qr-receiptDivider qr-receiptDivider--brand" />
              <div className="qr-receiptEyebrow">VERIFY RESULT</div>

              <div className="qr-verifyLoadingBlock">
                <Spin size="large" />
                <Title level={3} className="qr-verifyLoadingTitle">
                  Checking Pass
                </Title>
                <Text className="qr-verifyLoadingText">
                  Looking up {qrCode}
                </Text>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (isVendorView && verificationResult) {
    const isValid = verificationResult.valid && !verificationResult.expired;
    const isRedeemedAtVenue = Boolean(
      verificationResult.purchase?.isRedeemedAtVenue,
    );
    const canRedeem = isValid && !isRedeemedAtVenue;
    const matchedVenue = venues.find(
      (venue) =>
        venue.slug === verificationResult.purchase?.venueSlug ||
        venue.id === verificationResult.purchase?.venueSlug,
    );
    const venueLabel =
      matchedVenue?.name ||
      verificationResult.purchase?.venueName ||
      verificationResult.purchase?.redemptionVenueSlug ||
      verificationResult.purchase?.venueSlug ||
      "This venue";
    const statusTitle = verificationResult.expired
      ? "EXPIRED PASS"
      : isValid
        ? "VALID PASS"
        : "INVALID PASS";
    const statusToneClass = isValid
      ? "qr-verifyStatusBadge--valid"
      : "qr-verifyStatusBadge--invalid";
    const statusSummary = !isValid
      ? verificationResult.error || "This QR code is not valid or has expired."
      : null;
    const formatDisplayDate = (value, options = {}) => {
      if (!value) {
        return "Not specified";
      }

      return new Date(value).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        ...options,
      });
    };

    return (
      <>
        {/* Redemption Modal - needed in vendor view too */}
        <RedemptionModal />

        <div className="qr-page qr-verifyPage">
          <div className="qr-shell">
            <section className="qr-receiptCard">
              <div
                className={`qr-receiptPaper qr-verifyReceiptPaper ${
                  isValid
                    ? "qr-verifyReceiptPaper--valid"
                    : "qr-verifyReceiptPaper--invalid"
                }`}
              >
                <div className="qr-receiptBrandBlock">
                  <img
                    src={palmTreeIcon}
                    alt=""
                    className="qr-receiptBrandIcon"
                    aria-hidden="true"
                  />
                  <div className="qr-receiptBrandTitle">AHANGAMA PASS</div>
                  <div className="qr-receiptBrandTagline">VENDOR VERIFY</div>
                </div>

                <div className="qr-receiptDivider qr-receiptDivider--brand" />
                <div className="qr-receiptEyebrow">VERIFY RESULT</div>
                <div className={`qr-verifyStatusBadge ${statusToneClass}`}>
                  {statusTitle}
                </div>
                {statusSummary ? (
                  <div className="qr-verifyStatusSummary">{statusSummary}</div>
                ) : null}

            {isValid ? (
              <>
                {redemptionResult && (
                  <Alert
                    style={{ marginTop: 18, marginBottom: 22, textAlign: "left" }}
                    type={redemptionResult.success ? "success" : "error"}
                    message={
                      redemptionResult.success
                        ? "Redemption logged"
                        : "Redemption failed"
                    }
                    description={
                      redemptionResult.success
                        ? redemptionResult.message
                        : redemptionResult.error || "Unable to redeem this pass."
                    }
                    showIcon
                  />
                )}

                <div className="qr-receiptDivider" />

                <div className="qr-verifyReceiptSection">
                  <div className="qr-verifyReceiptSectionTitle">PASS DETAILS</div>

                  <div className="qr-verifyReceiptRow">
                    <span className="qr-verifyReceiptLabel">Pass Type</span>
                    <strong className="qr-verifyReceiptValue">
                      {verificationResult.purchase?.productName}
                    </strong>
                  </div>
                  <div className="qr-verifyReceiptRow">
                    <span className="qr-verifyReceiptLabel">Starts</span>
                    <strong className="qr-verifyReceiptValue qr-verifyReceiptValue--accent">
                      {formatDisplayDate(verificationResult.purchase?.startDate)}
                    </strong>
                  </div>
                  <div className="qr-verifyReceiptRow">
                    <span className="qr-verifyReceiptLabel">Expires</span>
                    <strong className="qr-verifyReceiptValue qr-verifyReceiptValue--success">
                      {formatDisplayDate(verificationResult.purchase?.expiryDate)}
                    </strong>
                  </div>
                  <div className="qr-verifyReceiptRow">
                    <span className="qr-verifyReceiptLabel">Max People</span>
                    <strong className="qr-verifyReceiptValue">
                      {verificationResult.purchase?.maxPeople}{" "}
                      {verificationResult.purchase?.maxPeople === 1
                        ? "person"
                        : "people"}
                    </strong>
                  </div>
                  {verificationResult.purchase?.redemptionCount > 0 && (
                    <div className="qr-verifyReceiptRow">
                      <span className="qr-verifyReceiptLabel">Previous Uses</span>
                      <strong className="qr-verifyReceiptValue">
                        {verificationResult.purchase.redemptionCount} times
                      </strong>
                    </div>
                  )}
                </div>

                <div className="qr-receiptSectionDivider" />

                <div className="qr-verifyReceiptSection">
                  <div className="qr-verifyReceiptSectionTitle">CUSTOMER DETAILS</div>

                  <div className="qr-verifyReceiptRow">
                    <span className="qr-verifyReceiptLabel">Name</span>
                    <strong className="qr-verifyReceiptValue">
                      {verificationResult.purchase?.customerName}
                    </strong>
                  </div>
                  <div className="qr-verifyReceiptRow">
                    <span className="qr-verifyReceiptLabel">Email</span>
                    <strong className="qr-verifyReceiptValue">
                      {verificationResult.purchase?.customerEmail}
                    </strong>
                  </div>
                  {verificationResult.purchase?.customerPhone ? (
                    <div className="qr-verifyReceiptRow">
                      <span className="qr-verifyReceiptLabel">Phone</span>
                      <strong className="qr-verifyReceiptValue">
                        {verificationResult.purchase.customerPhone}
                      </strong>
                    </div>
                  ) : null}
                </div>

                <div className="qr-receiptDivider qr-receiptDivider--summary" />

                <div className="qr-receiptSummaryRow">
                  <span>{venueLabel.toUpperCase()} REDEMPTION</span>
                  <strong>
                    {isRedeemedAtVenue ? "Redeemed" : "Available"}
                  </strong>
                </div>
                {verificationResult.purchase?.redeemedAt ? (
                  <div className="qr-verifyStatusMeta">
                    Redeemed {new Date(
                      verificationResult.purchase.redeemedAt,
                    ).toLocaleString()}
                  </div>
                ) : null}

                <div className="qr-verifyReceiptAction">
                    {canRedeem ? (
                      <Button
                        className="qr-receiptButton"
                        size="large"
                        icon={<GiftOutlined />}
                        loading={loading}
                        onClick={() =>
                          redeemPass({
                            venueId:
                              verificationResult.purchase?.venueSlug ||
                              verificationResult.purchase?.redemptionVenueSlug,
                            redemptionType: "discount",
                            pin: "1234",
                          })
                        }
                        block
                      >
                        Redeem {venueLabel} Offer
                      </Button>
                    ) : (
                      <Button size="large" disabled block>
                        {isRedeemedAtVenue
                          ? `${venueLabel} Offer Redeemed`
                          : "Redemption unavailable"}
                      </Button>
                    )}
                  </div>
              </>
            ) : (
              <>
                <div className="qr-receiptDivider" />

                <div className="qr-verifyReceiptSection">
                  <div className="qr-verifyReceiptSectionTitle">STATUS</div>
                  <div className="qr-verifyInvalidCopy">
                    {verificationResult.error ||
                      "This QR code is not valid or has expired."}
                  </div>
                </div>

                {verificationResult.expired && verificationResult.purchase && (
                  <>
                    <div className="qr-receiptSectionDivider" />
                    <div className="qr-verifyReceiptSection">
                      <div className="qr-verifyReceiptRow">
                        <span className="qr-verifyReceiptLabel">Customer</span>
                        <strong className="qr-verifyReceiptValue">
                          {verificationResult.purchase.customerName}
                        </strong>
                      </div>
                      <div className="qr-verifyReceiptRow">
                        <span className="qr-verifyReceiptLabel">Expired</span>
                        <strong className="qr-verifyReceiptValue qr-verifyReceiptValue--invalid">
                          {formatDisplayDate(verificationResult.purchase.expiryDate, {
                            weekday: undefined,
                          })}
                        </strong>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

                <div className="qr-verifyFooterCode">QR Code: {qrCode}</div>
              </div>
            </section>
          </div>
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
                  {verificationResult.purchase?.startDate && (
                    <>
                      <Text>
                        Starts:{" "}
                        {new Date(
                          verificationResult.purchase.startDate,
                        ).toLocaleDateString()}
                      </Text>
                      <br />
                    </>
                  )}
                  <Text>
                    Expires:{" "}
                    {new Date(
                      verificationResult.purchase?.expiryDate,
                    ).toLocaleDateString()}
                  </Text>
                  {verificationResult.purchase?.isPromo && (
                    <>
                      <br />
                      <Text>
                        {verificationResult.purchase?.venueName ||
                          verificationResult.purchase?.redemptionVenueSlug ||
                          verificationResult.purchase?.venueSlug}{" "}
                        redemption:{" "}
                        {verificationResult.purchase?.isRedeemedAtVenue
                          ? "Redeemed"
                          : "Available"}
                      </Text>
                    </>
                  )}
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
              onChange={(event) => setQrCode(normalizeQrCode(event.target.value))}
              placeholder="Scan QR code or enter manually"
              allowClear
            />
          </div>

          <Space wrap>
            <Button
              type="primary"
              size="large"
              onClick={() => verifyQRCode()}
              loading={loading}
              disabled={!qrCode}
            >
              Verify QR Code
            </Button>

            {verificationResult?.valid &&
              !verificationResult.purchase?.isRedeemedAtVenue && (
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
