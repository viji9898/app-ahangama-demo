import React, { useState } from "react";
import {
  ArrowRightOutlined,
  BookOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  LockOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Input,
  Radio,
  Row,
  Space,
  Typography,
} from "antd";
import QRCode from "react-qr-code";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ahangamaPassMobileWallet from "../assets/ahangama-pass-mobie-wallet.jpg";
import addToAppleWalletLogo from "../assets/add_to_apple_wallet.png";
import addToGoogleWalletLogo from "../assets/add_to_google_wallet.png";

const { Paragraph, Text, Title } = Typography;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIGHTHOUSE_PASS_ENDPOINT = "/.netlify/functions/create-hotel-guest-pass";
const LIGHTHOUSE_PREFERENCES_ENDPOINT =
  "/.netlify/functions/update-hotel-guest-preferences";
const FORM_STEP_DETAILS = "details";
const FORM_STEP_PREFERENCES = "preferences";
const FORM_STEP_SUCCESS = "success";
const DEFAULT_PASS_VALIDITY_DAYS = 15;

const LIGHTHOUSE_HERO_IMAGE =
  "https://cf.bstatic.com/xdata/images/hotel/max1024x768/399746482.jpg?k=dcf8dd932aa01c5c00a96346f8facccd7e423e187db501a3939e4c971d097c18&o=";

const HERO_FEATURES = [
  {
    title: "Local",
    subtitle: "Recommendations",
    Icon: MessageOutlined,
  },
  {
    title: "What's On",
    subtitle: "This Week",
    Icon: CalendarOutlined,
  },
  {
    title: "Ahangama",
    subtitle: "Guide 2026/27",
    Icon: BookOutlined,
  },
  {
    title: "Curated",
    subtitle: "Local Map",
    Icon: EnvironmentOutlined,
  },
  {
    title: "Exclusive",
    subtitle: "Guest Benefits",
    Icon: GiftOutlined,
  },
];

const HERO_SOCIAL_PROOF = ["LW", "AP", "HN"];

const DISCOVER_CARDS = [
  {
    title: "Ahangama Guide 2026/27",
    description: "Editorial recommendations from the local Ahangama.com team.",
    detail:
      "Best cafes, beaches, surf spots, wellness experiences and places to explore.",
    ctaLabel: "View Guide",
    href: "/guide",
  },
  {
    title: "Curated Ahangama Map",
    description: "Discover:",
    highlights: [
      "Best Breakfasts",
      "Sunset Spots",
      "Beginner Surf",
      "Coffee & Workspaces",
      "Wellness Studios",
      "Date Night Picks",
      "Local Favourites",
    ],
    ctaLabel: "Open Map",
    href: "/map",
  },
];

const PASS_EDITORIAL_NOTES = [
  "A local access pass designed to help Lighthouse Hotel guests experience Ahangama with more depth and less guesswork.",
  "Perks and privileges across cafes, restaurants, wellness studios, surf spaces, retail and everyday essentials throughout town.",
  "Access to a curated guide and map shaped around useful recommendations, local favourites and places actually worth knowing.",
];

const STAY_LENGTH_OPTIONS = [
  "1-3 nights",
  "4-7 nights",
  "8-14 nights",
  "15-30 nights",
  "1 month+",
];

const INTEREST_OPTIONS = [
  "Surfing",
  "Cafes & Coffee",
  "Restaurants",
  "Wellness & Yoga",
  "Fitness & Sports",
  "Nightlife",
  "Coworking",
  "Photography",
  "Shopping",
  "Nature & Wildlife",
  "Families & Kids",
  "Luxury Experiences",
];

const SERVICE_OPTIONS = [
  "Airport Transfers",
  "Scooter Rental",
  "Surf Lessons",
  "Yoga Classes",
  "Massage & Wellness",
  "Private Driver",
  "Accommodation Deals",
  "Tours & Experiences",
  "Coworking Passes",
];

function validateGuestDetails(values) {
  const errors = {};

  if (!String(values.fullName || "").trim()) {
    errors.fullName = "Please enter your full name";
  }

  const email = String(values.email || "")
    .trim()
    .toLowerCase();

  if (!email) {
    errors.email = "Please enter your email address";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!String(values.phone || "").trim()) {
    errors.phone = "Please enter your phone number";
  }

  if (!String(values.startDate || "").trim()) {
    errors.startDate = "Please choose your pass start date";
  }

  return errors;
}

function getTodayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function formatPassDateLabel(value) {
  if (!value) {
    return "";
  }

  const normalized = value.includes("T") ? value : `${value}T00:00:00`;
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function LighthousePage() {
  const canonical = absUrl("/lighthouse");
  const [formStep, setFormStep] = useState(FORM_STEP_DETAILS);
  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [preferencesError, setPreferencesError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [createdPassState, setCreatedPassState] = useState(null);
  const [guestDetails, setGuestDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    startDate: getTodayInputValue(),
  });
  const [preferencesDraft, setPreferencesDraft] = useState({
    country: "",
    stayLength: "",
    interests: [],
    wantsWhatsappRecommendations: false,
    servicesInterested: [],
  });

  const handleGuestDetailsChange = (field, value) => {
    setGuestDetails((current) => ({
      ...current,
      [field]: value,
    }));

    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });

    if (detailsError) {
      setDetailsError("");
    }
  };

  const handlePreferencesChange = (field, value) => {
    setPreferencesDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleGuestDetailsSubmit = async () => {
    const nextErrors = validateGuestDetails(guestDetails);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setIsSubmittingDetails(true);
    setDetailsError("");

    try {
      const response = await fetch(LIGHTHOUSE_PASS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: guestDetails.fullName.trim(),
          email: guestDetails.email.trim().toLowerCase(),
          phone: guestDetails.phone.trim(),
          startDate: guestDetails.startDate,
          sourceHotelSlug: "lighthouse-hotel",
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setDetailsError(
          payload.error ||
            "We couldn't create your pass just now. Please try again.",
        );
        return;
      }

      setCreatedPassState({
        guest: payload.guest,
        pass: payload.pass,
        preferences: payload.preferences,
        passkitPending: Boolean(payload.passkitPending),
        passkitError: payload.passkitError || "",
      });
      setPreferencesError("");
      setFormStep(FORM_STEP_PREFERENCES);
    } catch (error) {
      setDetailsError("We couldn't reach the pass service. Please try again.");
    } finally {
      setIsSubmittingDetails(false);
    }
  };

  const handlePreferencesSubmit = async () => {
    const passId = createdPassState?.pass?.id;

    if (!passId) {
      setPreferencesError(
        "We couldn't find your pass details. Please restart the form.",
      );
      return;
    }

    setIsSavingPreferences(true);
    setPreferencesError("");

    try {
      const response = await fetch(LIGHTHOUSE_PREFERENCES_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          passId,
          country: preferencesDraft.country,
          stayLength: preferencesDraft.stayLength,
          interests: preferencesDraft.interests,
          wantsWhatsappRecommendations:
            preferencesDraft.wantsWhatsappRecommendations,
          servicesInterested: preferencesDraft.servicesInterested,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setPreferencesError(
          payload.error ||
            "We couldn't save your preferences just now. Please try again.",
        );
        return;
      }

      setCreatedPassState((current) => ({
        ...current,
        preferences: payload.preferences || current?.preferences,
      }));
      setFormStep(FORM_STEP_SUCCESS);
    } catch (error) {
      setPreferencesError(
        "We couldn't reach the preferences service. Please try again.",
      );
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const handleSkipPreferences = () => {
    setPreferencesError("");
    setFormStep(FORM_STEP_SUCCESS);
  };

  const passPreviewPanel = (
    <div
      style={{
        display: "grid",
        justifyItems: "center",
        gap: 18,
        padding: "clamp(24px, 3vw, 36px)",
        borderRadius: 28,
        border: "1px solid rgba(32,30,27,0.08)",
        background: "linear-gradient(180deg, #fffdf9 0%, #f4ede4 100%)",
        boxShadow: "0 26px 80px rgba(42,38,31,0.12)",
      }}
    >
      <div
        style={{
          width: "min(100%, 208px)",
          padding: 10,
          borderRadius: 36,
          background: "#111111",
          boxShadow: "0 28px 50px rgba(0, 0, 0, 0.22)",
        }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 28,
            background: "#FFFFFF",
            aspectRatio: "9 / 19.5",
            width: "100%",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 128,
              height: 24,
              background: "#111111",
              borderRadius: 16,
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              padding: 14,
              background: "#FFFFFF",
            }}
          >
            <img
              src={ahangamaPassMobileWallet}
              alt="Ahangama Pass iPhone preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "top center",
                borderRadius: 18,
                transform: "scale(1.1)",
                transformOrigin: "top center",
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", maxWidth: 320 }}>
        <Text
          style={{
            display: "block",
            marginBottom: 8,
            color: "#B08E62",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.6,
            textTransform: "uppercase",
          }}
        >
          Ahangama Pass Preview
        </Text>
        <Paragraph
          style={{
            margin: 0,
            color: "#5A554D",
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          A wallet-ready guest pass with local perks.
        </Paragraph>
      </div>
    </div>
  );

  const signupPanel = (
    <Card
      id="lighthouse-signup-form"
      style={{
        width: "100%",
        borderRadius: 28,
        border: "1px solid rgba(32,30,27,0.08)",
        background: "rgba(255,255,255,0.94)",
        boxShadow: "0 26px 80px rgba(42,38,31,0.16)",
        backdropFilter: "blur(14px)",
      }}
      bodyStyle={{ padding: 32 }}
    >
      {formStep !== FORM_STEP_DETAILS ? (
        <>
          {formStep === FORM_STEP_PREFERENCES ? (
            <Text
              style={{
                display: "block",
                marginBottom: 10,
                color: "#B08E62",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1.4,
                textTransform: "uppercase",
              }}
            >
              Optional Preferences
            </Text>
          ) : formStep === FORM_STEP_SUCCESS ? (
            <Text
              style={{
                display: "block",
                marginBottom: 10,
                color: "#B08E62",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1.8,
                textTransform: "uppercase",
              }}
            >
              {createdPassState?.pass?.passkitInstallUrl
                ? "Pass Ready"
                : "Pass In Progress"}
            </Text>
          ) : null}
          <Title
            level={3}
            style={{
              marginTop: 0,
              marginBottom: 6,
              color: "#201E1B",
              fontFamily:
                '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
              fontSize: "clamp(30px, 3vw, 42px)",
              lineHeight: 0.95,
              fontWeight: 500,
            }}
          >
            {formStep === FORM_STEP_PREFERENCES
              ? "Tell Us A Little More"
              : "Your Ahangama Pass is ready"}
          </Title>
          <Paragraph
            style={{
              color: "#6D655B",
              fontSize: 14,
              lineHeight: 1.7,
              marginBottom: 20,
            }}
          >
            {formStep === FORM_STEP_PREFERENCES
              ? "Optional preferences help us tailor your Ahangama recommendations."
              : "Your complimentary guest access has been prepared."}
          </Paragraph>
        </>
      ) : null}

      {formStep === FORM_STEP_DETAILS ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: 18,
            width: "100%",
          }}
        >
          {detailsError ? (
            <Alert
              type="error"
              showIcon
              message={detailsError}
              style={{ borderRadius: 16, gridColumn: "1 / -1" }}
            />
          ) : null}

          <div>
            <Text
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Full name
            </Text>
            <Input
              size="large"
              placeholder="Enter your full name"
              value={guestDetails.fullName}
              status={fieldErrors.fullName ? "error" : ""}
              onChange={(event) =>
                handleGuestDetailsChange("fullName", event.target.value)
              }
              style={{ borderRadius: 14, minHeight: 46 }}
            />
            {fieldErrors.fullName ? (
              <Text type="danger" style={{ display: "block", marginTop: 6 }}>
                {fieldErrors.fullName}
              </Text>
            ) : null}
          </div>

          <div>
            <Text
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Email address
            </Text>
            <Input
              size="large"
              placeholder="Enter your email"
              value={guestDetails.email}
              status={fieldErrors.email ? "error" : ""}
              onChange={(event) =>
                handleGuestDetailsChange("email", event.target.value)
              }
              style={{ borderRadius: 14, minHeight: 46 }}
            />
            {fieldErrors.email ? (
              <Text type="danger" style={{ display: "block", marginTop: 6 }}>
                {fieldErrors.email}
              </Text>
            ) : null}
          </div>

          <div>
            <Text
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              WhatsApp number
            </Text>
            <Input
              size="large"
              placeholder="Enter your WhatsApp number"
              value={guestDetails.phone}
              status={fieldErrors.phone ? "error" : ""}
              onChange={(event) =>
                handleGuestDetailsChange("phone", event.target.value)
              }
              style={{ borderRadius: 14, minHeight: 46 }}
            />
            {fieldErrors.phone ? (
              <Text type="danger" style={{ display: "block", marginTop: 6 }}>
                {fieldErrors.phone}
              </Text>
            ) : null}
          </div>

          <div>
            <Text
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Pass starts on
            </Text>
            <Input
              size="large"
              type="date"
              value={guestDetails.startDate}
              min={getTodayInputValue()}
              status={fieldErrors.startDate ? "error" : ""}
              onChange={(event) =>
                handleGuestDetailsChange("startDate", event.target.value)
              }
              style={{ borderRadius: 14, minHeight: 46 }}
            />
            {fieldErrors.startDate ? (
              <Text type="danger" style={{ display: "block", marginTop: 6 }}>
                {fieldErrors.startDate}
              </Text>
            ) : (
              <Text
                style={{ display: "block", marginTop: 6, color: "#7A7368" }}
              >
                Valid for {DEFAULT_PASS_VALIDITY_DAYS} days from the selected
                start date.
              </Text>
            )}
          </div>

          <Button
            type="primary"
            size="large"
            block
            loading={isSubmittingDetails}
            style={{
              marginTop: 6,
              height: 52,
              borderRadius: 999,
              background: "#1E1814",
              borderColor: "#1E1814",
              boxShadow: "none",
              fontWeight: 600,
              gridColumn: "1 / -1",
            }}
            onClick={handleGuestDetailsSubmit}
          >
            Get My Complimentary Pass
          </Button>

          <Space
            size={8}
            align="center"
            style={{ marginTop: 4, color: "#6D655B", gridColumn: "1 / -1" }}
          >
            <LockOutlined style={{ color: "#B08E62" }} />
            <Text style={{ color: "#6D655B", fontSize: 13 }}>
              No app required. Works with Apple Wallet & Google Wallet.
            </Text>
          </Space>

          <Space size={10} style={{ marginTop: 4, gridColumn: "1 / -1" }}>
            <img
              src={addToAppleWalletLogo}
              alt="Apple Wallet"
              style={{ display: "block", height: 42, width: "auto" }}
            />
            <img
              src={addToGoogleWalletLogo}
              alt="Google Wallet"
              style={{ display: "block", height: 42, width: "auto" }}
            />
          </Space>
        </div>
      ) : null}

      {formStep === FORM_STEP_PREFERENCES ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: 24,
            width: "100%",
            alignItems: "start",
          }}
        >
          {preferencesError ? (
            <Alert
              type="error"
              showIcon
              message={preferencesError}
              style={{ borderRadius: 16, gridColumn: "1 / -1" }}
            />
          ) : null}

          <div>
            <Text
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Country
            </Text>
            <Input
              size="large"
              placeholder="Where are you visiting from?"
              value={preferencesDraft.country}
              onChange={(event) =>
                handlePreferencesChange("country", event.target.value)
              }
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <Text
              style={{
                display: "block",
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              Length of stay
            </Text>
            <Radio.Group
              value={preferencesDraft.stayLength}
              onChange={(event) =>
                handlePreferencesChange("stayLength", event.target.value)
              }
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                gap: 10,
              }}
            >
              {STAY_LENGTH_OPTIONS.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  style={{ marginInlineEnd: 0, minWidth: 0 }}
                >
                  {option}
                </Radio>
              ))}
            </Radio.Group>
          </div>

          <div>
            <Text
              style={{
                display: "block",
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              Interests
            </Text>
            <Checkbox.Group
              value={preferencesDraft.interests}
              onChange={(value) => handlePreferencesChange("interests", value)}
              style={{ width: "100%" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: "14px 24px",
                  width: "100%",
                }}
              >
                {INTEREST_OPTIONS.map((option) => (
                  <div key={option} style={{ minWidth: 0 }}>
                    <Checkbox
                      value={option}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        lineHeight: 1.45,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          whiteSpace: "normal",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {option}
                      </span>
                    </Checkbox>
                  </div>
                ))}
              </div>
            </Checkbox.Group>
          </div>

          <Checkbox
            checked={preferencesDraft.wantsWhatsappRecommendations}
            onChange={(event) =>
              handlePreferencesChange(
                "wantsWhatsappRecommendations",
                event.target.checked,
              )
            }
            style={{ gridColumn: "1 / -1" }}
          >
            Yes, send me personalised recommendations and local deals via
            WhatsApp
          </Checkbox>

          <div>
            <Text
              style={{
                display: "block",
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              Services interested in
            </Text>
            <Checkbox.Group
              value={preferencesDraft.servicesInterested}
              onChange={(value) =>
                handlePreferencesChange("servicesInterested", value)
              }
              style={{ width: "100%" }}
            >
              <Row gutter={[12, 12]}>
                {SERVICE_OPTIONS.map((option) => (
                  <Col xs={24} sm={12} lg={8} key={option}>
                    <Checkbox value={option}>{option}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </div>

          <Space
            direction="vertical"
            size={10}
            style={{ width: "100%", gridColumn: "1 / -1" }}
          >
            <Button
              type="primary"
              size="large"
              block
              loading={isSavingPreferences}
              onClick={handlePreferencesSubmit}
            >
              Continue
            </Button>
            <Button
              size="large"
              block
              disabled={isSavingPreferences}
              onClick={handleSkipPreferences}
            >
              Skip for now
            </Button>
          </Space>
        </div>
      ) : null}

      {formStep === FORM_STEP_SUCCESS ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            width: "100%",
            alignItems: "start",
          }}
        >
          <div>
            {createdPassState?.pass?.passkitInstallUrl ? (
              <div
                style={{
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 18,
                  padding: 14,
                  borderRadius: 18,
                  background: "#FFFFFF",
                  border: "1px solid rgba(176,142,98,0.16)",
                }}
              >
                <QRCode
                  value={createdPassState.pass.passkitInstallUrl}
                  size={132}
                  bgColor="#FFFFFF"
                  fgColor="#1E1814"
                />
                <Text
                  style={{
                    color: "#7A5B32",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                  }}
                >
                  Scan To Add Pass
                </Text>
              </div>
            ) : null}

            <Paragraph
              style={{
                color: "#5A554D",
                fontSize: 15,
                lineHeight: 1.75,
                marginBottom: 10,
              }}
            >
              {createdPassState?.pass?.passkitInstallUrl
                ? "Add your pass to Apple Wallet or Google Wallet below."
                : "Wallet installation will be available in the next step."}
            </Paragraph>
            {createdPassState?.guest?.fullName ? (
              <Text style={{ color: "#5A554D" }}>
                We have reserved your guest pass for{" "}
                {createdPassState.guest.fullName}.
              </Text>
            ) : null}
            {createdPassState?.pass?.validFrom ? (
              <Text
                style={{
                  display: "block",
                  marginTop: 8,
                  color: "#5A554D",
                }}
              >
                Starts {formatPassDateLabel(createdPassState.pass.validFrom)}{" "}
                and stays active for {DEFAULT_PASS_VALIDITY_DAYS} days.
              </Text>
            ) : null}
            {createdPassState?.passkitPending &&
            createdPassState?.passkitError ? (
              <Text
                style={{
                  display: "block",
                  color: "#8C6B3B",
                  marginTop: 10,
                }}
              >
                {createdPassState.passkitError}
              </Text>
            ) : null}
          </div>

          <Card
            style={{
              borderRadius: 20,
              border: "1px solid rgba(176,142,98,0.18)",
              background: "linear-gradient(180deg, #fffaf1 0%, #f6ebd9 100%)",
            }}
            bodyStyle={{ padding: 18 }}
          >
            <Text
              style={{
                display: "block",
                color: "#7A5B32",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              {createdPassState?.pass?.passkitInstallUrl
                ? "Install Pass"
                : "Next Step"}
            </Text>
            <Paragraph
              style={{
                marginBottom: 10,
                color: "#5A554D",
                lineHeight: 1.7,
              }}
            >
              {createdPassState?.pass?.passkitInstallUrl
                ? "Use the secure PassKit link below to add your pass to Apple Wallet or Google Wallet."
                : "We&apos;ll guide you to wallet installation as soon as the next step is ready."}
            </Paragraph>

            {createdPassState?.pass?.passkitInstallUrl ? (
              <Button
                type="primary"
                size="large"
                block
                href={createdPassState.pass.passkitInstallUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginTop: 14 }}
              >
                Add to Apple Wallet / Google Wallet
              </Button>
            ) : null}
          </Card>
        </div>
      ) : null}
    </Card>
  );

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Lighthouse Guest Pass"
        description="A Lighthouse Hotel guest benefit offering a complimentary Ahangama Pass, with local perks, wallet access, and curated recommendations included with the stay."
        canonical={canonical}
        ogImage={LIGHTHOUSE_HERO_IMAGE}
      />

      <div
        className="dm-canvas"
        style={{
          marginTop: 0,
          paddingTop: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        <div className="dm-wrap">
          <div
            className="ahg-hero"
            style={{
              width: "100vw",
              marginLeft: "calc(50% - 50vw)",
              marginRight: "calc(50% - 50vw)",
              borderRadius: 0,
              background: "#FFFFFF",
              boxShadow: "none",
            }}
          >
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                minHeight: "100svh",
              }}
            >
              <div
                aria-hidden="true"
                className="home-hero-media-layer"
                style={{
                  position: "absolute",
                  inset: 0,
                  overflow: "hidden",
                }}
              >
                <div
                  className="home-hero-overlay"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(90deg, rgba(10,14,18,0.84) 0%, rgba(10,14,18,0.74) 22%, rgba(10,14,18,0.5) 42%, rgba(10,14,18,0.16) 68%, rgba(10,14,18,0.02) 100%)",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
                <img
                  className="home-hero-image"
                  src={LIGHTHOUSE_HERO_IMAGE}
                  alt="Lighthouse Hotel exterior"
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center center",
                  }}
                />
              </div>

              <div
                style={{
                  position: "relative",
                  zIndex: 3,
                  width: "100%",
                  maxWidth: "none",
                  margin: 0,
                }}
              >
                <div
                  style={{
                    minHeight: "100svh",
                    display: "flex",
                    alignItems: "center",
                    padding:
                      "clamp(108px, 12vw, 152px) clamp(28px, 4.8vw, 72px) clamp(42px, 5vw, 60px)",
                  }}
                >
                  <div style={{ maxWidth: 700 }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "8px 14px",
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.82)",
                        border: "1px solid rgba(176,142,98,0.18)",
                        boxShadow: "0 10px 28px rgba(32,30,27,0.08)",
                        marginBottom: 22,
                      }}
                    >
                      <Text
                        style={{
                          color: "#A07843",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 1.4,
                          textTransform: "uppercase",
                        }}
                      >
                        Included With Your Stay At Lighthouse Hotel
                      </Text>
                    </div>

                    <Title
                      className="home-hero-title"
                      style={{
                        margin: 0,
                        color: "#FFFFFF",
                        fontWeight: 500,
                        fontFamily:
                          '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                        fontSize: "clamp(56px, 8vw, 96px)",
                        lineHeight: 0.92,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      <span
                        className="home-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        Complimentary
                      </span>
                      <span
                        className="home-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        Ahangama Pass
                      </span>
                    </Title>

                    <Paragraph
                      style={{
                        marginTop: 18,
                        marginBottom: 16,
                        color: "#A07843",
                        fontSize: "clamp(18px, 2vw, 22px)",
                        lineHeight: 1.45,
                        fontFamily:
                          '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                      }}
                    >
                      Your local companion for Ahangama.
                    </Paragraph>

                    <Paragraph
                      style={{
                        marginTop: 0,
                        marginBottom: 26,
                        maxWidth: 560,
                        color: "#FFFFFF",
                        fontSize: "clamp(16px, 1.45vw, 19px)",
                        lineHeight: 1.72,
                      }}
                    >
                      Local insight, trusted recommendations and exclusive guest
                      benefits, all in one digital pass built for Lighthouse
                      Hotel guests.
                    </Paragraph>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(96px, 1fr))",
                        gap: 18,
                        maxWidth: 650,
                        marginBottom: 28,
                      }}
                    >
                      {HERO_FEATURES.map(({ title, subtitle, Icon }) => (
                        <div
                          key={`${title}-${subtitle}`}
                          style={{ textAlign: "center", color: "#FFFFFF" }}
                        >
                          <div
                            style={{
                              width: 52,
                              height: 52,
                              borderRadius: 999,
                              margin: "0 auto 10px",
                              display: "grid",
                              placeItems: "center",
                              background: "rgba(255,255,255,0.58)",
                              border: "1px solid rgba(176,142,98,0.18)",
                              color: "#A07843",
                              fontSize: 22,
                            }}
                          >
                            <Icon />
                          </div>
                          <Text
                            style={{
                              display: "block",
                              color: "#FFFFFF",
                              fontSize: 13,
                              fontWeight: 600,
                              lineHeight: 1.4,
                            }}
                          >
                            {title}
                          </Text>
                          <Text
                            style={{
                              display: "block",
                              color: "#FFFFFF",
                              fontSize: 13,
                              lineHeight: 1.4,
                            }}
                          >
                            {subtitle}
                          </Text>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                      }}
                    >
                      <div style={{ display: "flex", marginRight: 2 }}>
                        {HERO_SOCIAL_PROOF.map((initials, index) => (
                          <div
                            key={initials}
                            style={{
                              width: 42,
                              height: 42,
                              borderRadius: "50%",
                              display: "grid",
                              placeItems: "center",
                              marginLeft: index === 0 ? 0 : -10,
                              border: "2px solid rgba(255,255,255,0.95)",
                              background:
                                index === 0
                                  ? "#D4B08A"
                                  : index === 1
                                    ? "#B78562"
                                    : "#6E7A63",
                              color: "#FFFFFF",
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: 0.4,
                            }}
                          >
                            {initials}
                          </div>
                        ))}
                      </div>
                      <Text
                        style={{
                          color: "#2F2A24",
                          fontSize: 13,
                          lineHeight: 1.6,
                        }}
                      >
                        Join 1,247+ Lighthouse guests already exploring Ahangama
                        better.
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dm-canvas">
        <div className="dm-wrap" style={{ paddingTop: 36, paddingBottom: 4 }}>
          <div
            style={{
              maxWidth: 860,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <Title
              level={2}
              style={{
                margin: 0,
                color: "#2F2A24",
                fontFamily:
                  '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                fontSize: "clamp(30px, 4.2vw, 50px)",
                lineHeight: 1.04,
                fontWeight: 500,
              }}
            >
              Everything you need for the perfect Ahangama stay.
            </Title>

            <Text
              style={{
                display: "block",
                marginTop: 16,
                color: "#B08E62",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Local Insight + Exclusive Benefits
            </Text>
          </div>
        </div>
      </div>

      <div className="dm-canvas">
        <div className="dm-wrap" style={{ paddingTop: 28, paddingBottom: 8 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(280px, 360px) minmax(0, 1fr)",
              gap: 24,
              width: "100%",
              alignItems: "start",
            }}
          >
            {passPreviewPanel}
            <div style={{ width: "100%", margin: "0 auto" }}>{signupPanel}</div>
          </div>
        </div>
      </div>

      <div className="dm-canvas">
        <div className="dm-wrap" style={{ paddingBottom: 8 }}>
          <Row gutter={[24, 24]} style={{ marginTop: 28 }}>
            <Col xs={24}>
              <Card
                id="lighthouse-benefits"
                style={{
                  borderRadius: 28,
                  border: "1px solid rgba(32,30,27,0.08)",
                  background:
                    "linear-gradient(180deg, #fffdf9 0%, #f7f0e6 100%)",
                }}
                bodyStyle={{ padding: 30 }}
              >
                <Text
                  style={{
                    display: "block",
                    marginBottom: 12,
                    color: "#B08E62",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 1.8,
                    textTransform: "uppercase",
                  }}
                >
                  Included With Your Stay
                </Text>
                <Title
                  level={2}
                  style={{
                    marginTop: 0,
                    marginBottom: 14,
                    color: "#201E1B",
                    fontFamily:
                      '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    fontSize: "clamp(30px, 4vw, 54px)",
                    lineHeight: 0.98,
                    fontWeight: 500,
                  }}
                >
                  A Complimentary Local Access Pass.
                </Title>
                <Paragraph
                  style={{
                    color: "#4B463F",
                    fontSize: 17,
                    lineHeight: 1.8,
                    marginBottom: 16,
                  }}
                >
                  The Ahangama Pass is a curated visitor pass designed to help
                  you experience the best of Ahangama.
                </Paragraph>
                <Paragraph
                  style={{
                    color: "#4B463F",
                    fontSize: 17,
                    lineHeight: 1.8,
                    marginBottom: 16,
                  }}
                >
                  Lighthouse Hotel guests receive complimentary access as part
                  of their stay.
                </Paragraph>
                <Paragraph
                  style={{
                    color: "#4B463F",
                    fontSize: 17,
                    lineHeight: 1.8,
                    marginBottom: 24,
                  }}
                >
                  The pass provides access to exclusive offers, local
                  recommendations and savings across a growing network of
                  independent businesses.
                </Paragraph>

                <Row gutter={[18, 18]}>
                  {DISCOVER_CARDS.map((item) => (
                    <Col xs={24} md={12} key={item.title}>
                      <Card
                        style={{
                          height: "100%",
                          borderRadius: 22,
                          border: "1px solid rgba(32,30,27,0.08)",
                          background: "rgba(255,255,255,0.84)",
                        }}
                        bodyStyle={{ padding: 22 }}
                      >
                        <Title
                          level={3}
                          style={{
                            marginTop: 0,
                            marginBottom: 12,
                            color: "#201E1B",
                            fontFamily:
                              '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                            fontSize: 28,
                            lineHeight: 1.05,
                          }}
                        >
                          {item.title}
                        </Title>
                        <Paragraph
                          style={{
                            color: "#4B463F",
                            lineHeight: 1.8,
                            marginBottom: 10,
                          }}
                        >
                          {item.description}
                        </Paragraph>
                        {item.detail ? (
                          <Paragraph
                            style={{
                              color: "#4B463F",
                              lineHeight: 1.8,
                              marginBottom: 22,
                            }}
                          >
                            {item.detail}
                          </Paragraph>
                        ) : null}
                        {item.highlights ? (
                          <div
                            style={{
                              marginBottom: 22,
                              display: "grid",
                              gap: 6,
                            }}
                          >
                            {item.highlights.map((highlight) => (
                              <Text
                                key={highlight}
                                style={{ color: "#4B463F", lineHeight: 1.7 }}
                              >
                                {`• ${highlight}`}
                              </Text>
                            ))}
                          </div>
                        ) : null}
                        <Button href={item.href} icon={<ArrowRightOutlined />}>
                          {item.ctaLabel}
                        </Button>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>

          <Card
            style={{
              marginTop: 8,
              borderRadius: 28,
              border: "1px solid rgba(32,30,27,0.08)",
              background: "linear-gradient(180deg, #fffdf9 0%, #f7f0e6 100%)",
              boxShadow: "0 22px 54px rgba(47,62,58,0.06)",
            }}
            bodyStyle={{ padding: 30 }}
          >
            <Row gutter={[28, 28]} align="top">
              <Col xs={24} lg={10}>
                <Text
                  style={{
                    display: "block",
                    marginBottom: 12,
                    color: "#B08E62",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 1.8,
                    textTransform: "uppercase",
                  }}
                >
                  What Is The Ahangama Pass
                </Text>
                <Title
                  level={2}
                  style={{
                    marginTop: 0,
                    marginBottom: 14,
                    color: "#201E1B",
                    fontFamily:
                      '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    fontSize: "clamp(34px, 4vw, 58px)",
                    lineHeight: 0.96,
                    fontWeight: 500,
                  }}
                >
                  A considered way into Ahangama.
                </Title>
                <a
                  href="https://ahangama.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#2F3E3A",
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: 0.2,
                  }}
                >
                  Explore Ahangama.com -&gt;
                </a>
              </Col>

              <Col xs={24} lg={14}>
                <div style={{ display: "grid", gap: 18 }}>
                  {PASS_EDITORIAL_NOTES.map((item) => (
                    <Paragraph
                      key={item}
                      style={{
                        margin: 0,
                        color: "#4B463F",
                        fontSize: 17,
                        lineHeight: 1.9,
                        maxWidth: 760,
                      }}
                    >
                      {item}
                    </Paragraph>
                  ))}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: 12,
                      marginTop: 4,
                    }}
                  >
                    {[
                      "150+ venues across Ahangama",
                      "Perks, privileges and everyday savings",
                      "Curated local guide and map",
                      "More authentic local experiences",
                    ].map((item) => (
                      <div
                        key={item}
                        style={{
                          padding: "12px 14px",
                          borderTop: "1px solid rgba(32,30,27,0.12)",
                          color: "#201E1B",
                          fontSize: 14,
                          lineHeight: 1.6,
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}
