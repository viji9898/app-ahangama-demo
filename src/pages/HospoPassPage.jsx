import React, { useEffect, useRef, useState } from "react";
import {
  BankOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  HomeOutlined,
  LockOutlined,
  MobileOutlined,
  ReadOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Grid,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import {
  DEFAULT_WHATSAPP_COUNTRY_CODE,
  PHONE_COUNTRY_CODES,
} from "../data/phoneCountryCodes";
import ahangamaPassMobileWallet from "../assets/ahangama-pass-mobie-wallet.jpg";
import addToAppleWalletLogo from "../assets/add_to_apple_wallet.png";
import addToGoogleWalletLogo from "../assets/add_to_google_wallet.png";

const { Paragraph, Text, Title } = Typography;
const { TextArea } = Input;

export const HOSPO_PASS_PATH = "/hospo";
export const COMP_PASS_PATH = "/comp-pass";

const HOSPO_META_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hospo_complimentry_pass.jpg";
const COMP_PASS_META_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/ogImgw-comp-pass.jpg";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HOSPO_PASS_ENDPOINT = "/.netlify/functions/create-hotel-guest-pass";
const HOSPO_PROFILE_ENDPOINT = "/.netlify/functions/send-hospo-pass-profile";
const HOSPO_SOURCE_HOTEL_SLUG = "ahangama-hospo";
const COMP_PASS_SOURCE_HOTEL_SLUG = "ahangama-comp-pass";
const HOSPO_DESTINATION = "ahangama";
const FORM_STEP_DETAILS = "details";
const FORM_STEP_PROFILE = "profile";
const FORM_STEP_SUCCESS = "success";
const DEFAULT_PASS_VALIDITY_DAYS = 365;
const PASS_VALIDITY_LABEL = "one year";
const DEFAULT_WHATSAPP_COUNTRY_OPTION =
  PHONE_COUNTRY_CODES.find(
    (option) => option.value === DEFAULT_WHATSAPP_COUNTRY_CODE,
  ) || PHONE_COUNTRY_CODES[0];

const PASS_PAGE_CONFIGS = {
  hospo: {
    passContext: "hospo",
    sourceHotelSlug: HOSPO_SOURCE_HOTEL_SLUG,
    seoTitle: "Ahangama Pass | Exclusive for Hospo Community",
    seoDescription:
      "Claim the free Ahangama Pass | Exclusive for Southside Hospo Community members - Unlock Perks and Benefits in Ahangama.",
    ogImage: HOSPO_META_IMAGE,
    eyebrow: "Exclusive for Southside Hospo Community",
    intro:
      "Exclusive access to the Hospo Community. Get the pass, try it out and let us know what you think.",
    detailsCopy:
      "This first step matches the current complimentary pass flow.",
    profileCopy:
      "These details help the Ahangama team understand who is using the complimentary pass.",
    successCopy: "Your profile details have been sent to the Ahangama team.",
    consentCopy:
      "By receiving the complimentary pass, you agree to receive thoughtful insights and updates about all things Ahangama.",
  },
  compPass: {
    passContext: "comp-pass",
    sourceHotelSlug: COMP_PASS_SOURCE_HOTEL_SLUG,
    seoTitle: "Ahangama Pass | Complimentary Pass Signup",
    seoDescription:
      "Sign up for a complimentary Ahangama Pass and unlock local perks, picks, and benefits around Ahangama.",
    ogImage: COMP_PASS_META_IMAGE,
    eyebrow: "Complimentary Ahangama Pass",
    intro:
      "Claim the pass, add it to your wallet, and tell us what would make Ahangama more useful to you.",
    detailsCopy:
      "Start here and we will create your complimentary Ahangama Pass.",
    profileCopy:
      "A few extra details help the Ahangama team tailor updates, recommendations, and partner opportunities.",
    successCopy:
      "Your complimentary pass profile has been sent to the Ahangama team.",
    consentCopy:
      "By receiving the complimentary pass, you agree to receive thoughtful Ahangama updates, local recommendations, and partner news.",
  },
};

const AUDIENCE_OPTIONS = [
  {
    value: "business_owner",
    label: "Business owner",
    description: "I run or manage a business in Ahangama.",
    Icon: BankOutlined,
  },
  {
    value: "resident",
    label: "Resident",
    description: "I live in or spend regular time in Ahangama.",
    Icon: HomeOutlined,
  },
  {
    value: "tourist",
    label: "Tourist",
    description: "I am visiting Ahangama and want local recommendations.",
    Icon: UserOutlined,
  },
];

const HOSPO_PASS_STATS = [
  {
    value: "150+",
    title: "Curated Places",
    detail: "Handpicked by locals",
    Icon: EnvironmentOutlined,
  },
  {
    value: "100+",
    title: "Exclusive Perks",
    detail: "Save across Ahangama",
    Icon: GiftOutlined,
  },
  {
    value: "1",
    title: "Digital Pass",
    detail: "Always with you",
    Icon: MobileOutlined,
  },
  {
    value: "Ahangama Guide",
    title: "2026/27 Season",
    detail: "Local picks and perks",
    Icon: ReadOutlined,
  },
];

const INTEREST_OPTIONS = [
  "Cafes & Coffee",
  "Food & Local Dining",
  "Surfing",
  "Wellness & Yoga",
  "Events",
  "Shopping & Design",
  "Community",
  "Remote Work",
  "Nature",
  "Nightlife",
];

const GOAL_OPTIONS = [
  "Discover local places",
  "Receive WhatsApp recommendations",
  "Find events",
  "Get business visibility",
  "Join partner opportunities",
  "Meet the local community",
];

const STAY_LENGTH_OPTIONS = [
  "1-3 nights",
  "4-7 nights",
  "8-14 nights",
  "15-30 nights",
  "1 month+",
];

const TRAVEL_GROUP_OPTIONS = [
  "Solo",
  "Partner / Couple",
  "Friends",
  "Family",
  "Work / Remote Work",
];

function buildWhatsappPhoneNumber(countryCode, phone) {
  const normalizedCountryCode = String(countryCode || "").trim();
  const normalizedDigits = String(phone || "").replace(/\D/g, "");
  const localDigits = normalizedDigits.replace(/^0+/, "");

  if (!normalizedCountryCode || !localDigits) {
    return "";
  }

  return `${normalizedCountryCode}${localDigits}`;
}

function validateGuestDetails(values) {
  const errors = {};
  const email = String(values.email || "")
    .trim()
    .toLowerCase();
  const localPhoneDigits = String(values.phone || "").replace(/\D/g, "");

  if (!String(values.fullName || "").trim()) {
    errors.fullName = "Please enter your full name";
  }

  if (!email) {
    errors.email = "Please enter your email address";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!String(values.countryCode || "").trim()) {
    errors.phone = "Please choose a country code";
  } else if (!localPhoneDigits) {
    errors.phone = "Please enter your WhatsApp number";
  } else if (localPhoneDigits.length < 7) {
    errors.phone = "Please enter a valid WhatsApp number";
  }

  if (!buildWhatsappPhoneNumber(values.countryCode, values.phone)) {
    errors.phone = errors.phone || "Please enter a valid WhatsApp number";
  }

  return errors;
}

function validateProfile(profile) {
  const errors = {};

  if (!profile.audienceType) {
    errors.audienceType = "Please choose one option";
  }

  if (
    profile.audienceType === "business_owner" &&
    !String(profile.businessName || "").trim()
  ) {
    errors.businessName = "Please enter your business name";
  }

  if (
    profile.audienceType === "resident" &&
    !String(profile.residentArea || "").trim()
  ) {
    errors.residentArea = "Please enter your area in or around Ahangama";
  }

  if (profile.interests.length < 1) {
    errors.interests = "Please choose at least one interest";
  }

  return errors;
}

function formatDisplayDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function FieldError({ children }) {
  return children ? (
    <Text type="danger" style={{ display: "block", marginTop: 6 }}>
      {children}
    </Text>
  ) : null;
}

function FormLabel({ children }) {
  return (
    <Text style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
      {children}
    </Text>
  );
}

function AudienceCard({ option, selected }) {
  const Icon = option.Icon;

  return (
    <Radio
      className={`hospo-audience-card${selected ? " is-selected" : ""}`}
      value={option.value}
    >
      <span className="hospo-audience-icon" aria-hidden="true">
        <Icon />
      </span>
      <span className="hospo-audience-copy">
        <span className="hospo-audience-title">{option.label}</span>
        <span className="hospo-audience-description">{option.description}</span>
      </span>
    </Radio>
  );
}

export default function HospoPassPage({ variant = "hospo" }) {
  const pageConfig = PASS_PAGE_CONFIGS[variant] || PASS_PAGE_CONFIGS.hospo;
  const screens = Grid.useBreakpoint();
  const isTabletUp = Boolean(screens.md);
  const previewExpiryDate = formatDisplayDate(
    new Date(
      Date.now() + DEFAULT_PASS_VALIDITY_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString(),
  );
  const passReadySectionRef = useRef(null);
  const [formStep, setFormStep] = useState(FORM_STEP_DETAILS);
  const [detailsError, setDetailsError] = useState("");
  const [profileError, setProfileError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [profileFieldErrors, setProfileFieldErrors] = useState({});
  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [createdPassState, setCreatedPassState] = useState(null);
  const [guestDetails, setGuestDetails] = useState({
    fullName: "",
    email: "",
    countryCode: DEFAULT_WHATSAPP_COUNTRY_OPTION.value,
    phone: "",
  });
  const [profileDraft, setProfileDraft] = useState({
    audienceType: "",
    businessName: "",
    businessCategory: "",
    businessLocation: "",
    residentArea: "",
    residentConnection: "",
    stayLength: "",
    travelGroup: "",
    interests: [],
    goals: [],
    whatsappOptIn: true,
    wantsPartnerUpdates: true,
    notes: "",
  });

  useEffect(() => {
    if (formStep !== FORM_STEP_SUCCESS) {
      return undefined;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      passReadySectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [formStep]);

  function handleGuestDetailsChange(field, value) {
    setGuestDetails((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field] && !(field === "countryCode" && current.phone)) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      if (field === "countryCode") {
        delete next.phone;
      }
      return next;
    });
    setDetailsError("");
  }

  function handleProfileChange(field, value) {
    setProfileDraft((current) => ({ ...current, [field]: value }));
    setProfileFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
    setProfileError("");
  }

  async function handleGuestDetailsSubmit() {
    const nextErrors = validateGuestDetails(guestDetails);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setIsSubmittingDetails(true);
    setDetailsError("");

    try {
      const response = await fetch(HOSPO_PASS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: guestDetails.fullName.trim(),
          email: guestDetails.email.trim().toLowerCase(),
          phone: buildWhatsappPhoneNumber(
            guestDetails.countryCode,
            guestDetails.phone,
          ),
          sourceHotelSlug: pageConfig.sourceHotelSlug,
          destination: HOSPO_DESTINATION,
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
        passkitPending: Boolean(payload.passkitPending),
        passkitError: payload.passkitError || "",
      });
      setFormStep(FORM_STEP_PROFILE);
    } catch {
      setDetailsError("We couldn't reach the pass service. Please try again.");
    } finally {
      setIsSubmittingDetails(false);
    }
  }

  async function handleProfileSubmit() {
    const nextErrors = validateProfile(profileDraft);

    if (Object.keys(nextErrors).length > 0) {
      setProfileFieldErrors(nextErrors);
      return;
    }

    setIsSubmittingProfile(true);
    setProfileError("");

    try {
      const response = await fetch(HOSPO_PROFILE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest: createdPassState?.guest,
          pass: createdPassState?.pass,
          sourceHotelSlug: pageConfig.sourceHotelSlug,
          passContext: pageConfig.passContext,
          profile: profileDraft,
        }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setProfileError(
          payload.error ||
            "We couldn't send your details just now. Please try again.",
        );
        return;
      }

      setFormStep(FORM_STEP_SUCCESS);
    } catch {
      setProfileError(
        "We couldn't reach the profile service. Please try again.",
      );
    } finally {
      setIsSubmittingProfile(false);
    }
  }

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title={pageConfig.seoTitle}
        description={pageConfig.seoDescription}
        ogImage={pageConfig.ogImage}
      />

      <main style={{ background: "#f6f3ed", color: "#201e1b" }}>
        <section
          style={{
            minHeight: "100vh",
            padding: "clamp(96px, 12vw, 150px) 18px clamp(54px, 8vw, 92px)",
            background:
              "linear-gradient(180deg, rgba(246,243,237,0.78), #f6f3ed 60%), url('https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/comp_pass/light-house-beach-view-wide.webp') center/cover",
          }}
        >
          <div style={{ width: "min(100%, 1160px)", margin: "0 auto" }}>
            <Row gutter={[32, 32]} align="top">
              <Col xs={24} lg={13}>
                <Text
                  style={{
                    display: "block",
                    marginBottom: 18,
                    color: "#8b6a42",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: 1.8,
                    textTransform: "uppercase",
                  }}
                >
                  {pageConfig.eyebrow}
                </Text>
                <Title
                  style={{
                    margin: 0,
                    color: "#201e1b",
                    fontFamily:
                      '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    fontSize: isTabletUp ? 60 : "clamp(36px, 10vw, 48px)",
                    lineHeight: 0.9,
                    fontWeight: 500,
                  }}
                >
                  {isTabletUp ? (
                    <span style={{ whiteSpace: "nowrap" }}>
                      Claim your Complimentary
                    </span>
                  ) : (
                    <>
                      Claim your
                      <br />
                      Complimentary
                    </>
                  )}
                  <br />
                  Ahangama Pass
                </Title>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isTabletUp
                      ? "repeat(2, minmax(0, 1fr))"
                      : "repeat(2, minmax(0, 1fr))",
                    gap: isTabletUp ? 12 : 10,
                    marginTop: 26,
                    maxWidth: 570,
                  }}
                >
                  {HOSPO_PASS_STATS.map(({ value, title, detail, Icon: StatIcon }) => (
                    <div
                      key={`${title}-${value}`}
                      style={{
                        display: "flex",
                        flexDirection: isTabletUp ? "row" : "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: isTabletUp ? 12 : 8,
                        minHeight: isTabletUp ? 136 : 150,
                        padding: isTabletUp ? "16px 14px" : "14px 10px",
                        border: "1px solid rgba(32,30,27,0.08)",
                        borderRadius: 18,
                        background: "rgba(255,255,255,0.72)",
                        boxShadow: "0 14px 34px rgba(70,54,28,0.07)",
                        textAlign: isTabletUp ? "left" : "center",
                      }}
                    >
                      {React.createElement(StatIcon, {
                        style: {
                          fontSize: isTabletUp ? 26 : 24,
                          color: "#B08E62",
                          flex: "0 0 auto",
                        },
                      })}
                      <div>
                        <div
                          style={{
                            color: "#A47F49",
                            fontSize: isTabletUp ? 24 : 22,
                            lineHeight: 1,
                            fontWeight: 500,
                            fontFamily:
                              '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                          }}
                        >
                          {value}
                        </div>
                        <div
                          style={{
                            marginTop: isTabletUp ? 8 : 7,
                            color: "#2F2A24",
                            fontSize: isTabletUp ? 14 : 13,
                            fontWeight: 700,
                            lineHeight: 1.3,
                          }}
                        >
                          {title}
                        </div>
                        <div
                          style={{
                            marginTop: 3,
                            color: "#6E675F",
                            fontSize: isTabletUp ? 12 : 11,
                            lineHeight: 1.45,
                          }}
                        >
                          {detail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    display: "grid",
                    justifyItems: "center",
                    gap: 14,
                    marginTop: 24,
                    maxWidth: 570,
                    padding: isTabletUp ? "22px 24px" : "20px 18px",
                    borderRadius: 24,
                    border: "1px solid rgba(32,30,27,0.08)",
                    background:
                      "linear-gradient(180deg, rgba(255,253,249,0.92) 0%, rgba(244,237,228,0.9) 100%)",
                    boxShadow: "0 20px 54px rgba(42,38,31,0.1)",
                  }}
                >
                  <div
                    style={{
                      width: isTabletUp ? 186 : 168,
                      padding: 9,
                      borderRadius: 32,
                      background: "#111111",
                      boxShadow: "0 24px 44px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: 25,
                        background: "#FFFFFF",
                        aspectRatio: "9 / 19.5",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 9,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 112,
                          height: 21,
                          background: "#111111",
                          borderRadius: 14,
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
                          padding: 12,
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
                            borderRadius: 16,
                            transform: "scale(1.1)",
                            transformOrigin: "top center",
                          }}
                        />
                      </div>
                      <div
                        aria-label={`Preview expiry ${previewExpiryDate}`}
                        style={{
                          position: "absolute",
                          top: "35.2%",
                          right: "9.5%",
                          zIndex: 3,
                          width: "39%",
                          minHeight: 22,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          padding: "1px 0 2px 8px",
                          background: "#68A9CA",
                          color: "#FFFFFF",
                          fontSize: 10,
                          fontWeight: 300,
                          lineHeight: 1,
                          letterSpacing: 0,
                          fontFamily:
                            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                          pointerEvents: "none",
                        }}
                      >
                        {previewExpiryDate}
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          left: 11,
                          right: 11,
                          bottom: 13,
                          zIndex: 3,
                          display: "grid",
                          gridTemplateColumns: "1fr",
                          gap: 6,
                          justifyItems: "center",
                          padding: "9px 7px",
                          borderRadius: 15,
                          background: "rgba(255, 255, 255, 0.92)",
                          boxShadow: "0 10px 22px rgba(32, 30, 27, 0.16)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <img
                          src={addToAppleWalletLogo}
                          alt="Apple Wallet"
                          style={{
                            display: "block",
                            height: 28,
                            width: "auto",
                          }}
                        />
                        <img
                          src={addToGoogleWalletLogo}
                          alt="Google Wallet"
                          style={{
                            display: "block",
                            height: 28,
                            width: "auto",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <Text
                    style={{
                      color: "#5f574d",
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: 1.2,
                      textTransform: "uppercase",
                    }}
                  >
                    Ahangama Pass Preview
                  </Text>
                </div>
                <Paragraph
                  style={{
                    maxWidth: 570,
                    margin: "24px 0 0",
                    color: "#5f574d",
                    fontSize: "clamp(17px, 2vw, 21px)",
                    lineHeight: 1.75,
                  }}
                >
                  {pageConfig.intro}
                </Paragraph>
                <Space
                  size={10}
                  align="center"
                  style={{ marginTop: 28, color: "#5f574d" }}
                >
                  <LockOutlined style={{ color: "#8b6a42" }} />
                  <Text style={{ color: "#5f574d", fontWeight: 700 }}>
                    No app required. Works with Apple Wallet and Google Wallet.
                  </Text>
                </Space>
              </Col>

              <Col xs={24} lg={11} style={{ paddingTop: isTabletUp ? 118 : 0 }}>
                <Card
                  ref={
                    formStep === FORM_STEP_SUCCESS ? passReadySectionRef : null
                  }
                  style={{
                    border: "1px solid rgba(32,30,27,0.08)",
                    borderRadius: 28,
                    background: "rgba(255,255,255,0.95)",
                    boxShadow: "0 26px 80px rgba(42,38,31,0.16)",
                    backdropFilter: "blur(14px)",
                  }}
                  styles={{ body: { padding: isTabletUp ? 32 : 20 } }}
                >
                  <Text
                    style={{
                      display: "block",
                      marginBottom: 10,
                      color: "#B08E62",
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: 1.6,
                      textTransform: "uppercase",
                    }}
                  >
                    {formStep === FORM_STEP_DETAILS
                      ? "Step 1 of 2"
                      : formStep === FORM_STEP_PROFILE
                        ? "Step 2 of 2"
                        : "Pass Ready"}
                  </Text>
                  <Title
                    level={2}
                    style={{
                      margin: 0,
                      color: "#201E1B",
                      fontFamily:
                        '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                      fontSize:
                        formStep === FORM_STEP_DETAILS
                          ? "clamp(28px, 2.5vw, 38px)"
                          : "clamp(30px, 3vw, 44px)",
                      lineHeight: 0.98,
                      fontWeight: 500,
                    }}
                  >
                    {formStep === FORM_STEP_DETAILS ? (
                      <>
                        Sign up here for your
                        <br />
                        complimentary pass
                      </>
                    ) : formStep === FORM_STEP_PROFILE ? (
                      "Tell us who you are"
                    ) : (
                      "Your Ahangama Pass is ready"
                    )}
                  </Title>
                  <Paragraph
                    style={{
                      margin: "10px 0 22px",
                      color: "#6D655B",
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}
                  >
                    {formStep === FORM_STEP_DETAILS
                      ? pageConfig.detailsCopy
                      : formStep === FORM_STEP_PROFILE
                        ? pageConfig.profileCopy
                        : pageConfig.successCopy}
                  </Paragraph>

                  {formStep === FORM_STEP_DETAILS ? (
                    <div style={{ display: "grid", gap: 18 }}>
                      {detailsError ? (
                        <Alert type="error" showIcon message={detailsError} />
                      ) : null}

                      <div>
                        <FormLabel>Full name</FormLabel>
                        <Input
                          size="large"
                          placeholder="Enter your full name"
                          value={guestDetails.fullName}
                          status={fieldErrors.fullName ? "error" : ""}
                          onChange={(event) =>
                            handleGuestDetailsChange(
                              "fullName",
                              event.target.value,
                            )
                          }
                        />
                        <FieldError>{fieldErrors.fullName}</FieldError>
                      </div>

                      <div>
                        <FormLabel>Email address</FormLabel>
                        <Input
                          size="large"
                          type="email"
                          placeholder="Enter your email"
                          value={guestDetails.email}
                          status={fieldErrors.email ? "error" : ""}
                          onChange={(event) =>
                            handleGuestDetailsChange(
                              "email",
                              event.target.value,
                            )
                          }
                        />
                        <FieldError>{fieldErrors.email}</FieldError>
                      </div>

                      <div>
                        <FormLabel>WhatsApp number</FormLabel>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: isTabletUp
                              ? "minmax(132px, 160px) minmax(0, 1fr)"
                              : "minmax(112px, 128px) minmax(0, 1fr)",
                            gap: 10,
                          }}
                        >
                          <Select
                            size="large"
                            showSearch
                            value={guestDetails.countryCode}
                            status={fieldErrors.phone ? "error" : ""}
                            optionFilterProp="searchText"
                            onChange={(value) =>
                              handleGuestDetailsChange("countryCode", value)
                            }
                            options={PHONE_COUNTRY_CODES.map((option) => ({
                              value: option.value,
                              label: option.value,
                              searchText: option.searchText,
                            }))}
                          />
                          <Input
                            size="large"
                            placeholder="Enter your WhatsApp number"
                            inputMode="tel"
                            value={guestDetails.phone}
                            status={fieldErrors.phone ? "error" : ""}
                            onChange={(event) =>
                              handleGuestDetailsChange(
                                "phone",
                                event.target.value,
                              )
                            }
                          />
                        </div>
                        <FieldError>{fieldErrors.phone}</FieldError>
                      </div>

                      <Button
                        type="primary"
                        size="large"
                        block
                        loading={isSubmittingDetails}
                        onClick={handleGuestDetailsSubmit}
                        style={{
                          height: 52,
                          borderRadius: 999,
                          background: "#1E1814",
                          borderColor: "#1E1814",
                          fontWeight: 700,
                        }}
                      >
                        Get My Complimentary Pass
                      </Button>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 10,
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={addToAppleWalletLogo}
                          alt="Apple Wallet"
                          style={{ height: 36, width: "auto" }}
                        />
                        <img
                          src={addToGoogleWalletLogo}
                          alt="Google Wallet"
                          style={{ height: 36, width: "auto" }}
                        />
                      </div>
                    </div>
                  ) : null}

                  {formStep === FORM_STEP_PROFILE ? (
                    <div style={{ display: "grid", gap: 22 }}>
                      {profileError ? (
                        <Alert type="error" showIcon message={profileError} />
                      ) : null}

                      <div>
                        <FormLabel>I am a...</FormLabel>
                        <Radio.Group
                          value={profileDraft.audienceType}
                          onChange={(event) =>
                            handleProfileChange(
                              "audienceType",
                              event.target.value,
                            )
                          }
                          className="hospo-audience-group"
                        >
                          <div className="hospo-audience-grid">
                            {AUDIENCE_OPTIONS.map((option) => (
                              <AudienceCard
                                key={option.value}
                                option={option}
                                selected={
                                  profileDraft.audienceType === option.value
                                }
                              />
                            ))}
                          </div>
                        </Radio.Group>
                        <FieldError>
                          {profileFieldErrors.audienceType}
                        </FieldError>
                      </div>

                      {profileDraft.audienceType === "business_owner" ? (
                        <Row gutter={[14, 14]}>
                          <Col xs={24} md={12}>
                            <FormLabel>Business name</FormLabel>
                            <Input
                              size="large"
                              value={profileDraft.businessName}
                              status={
                                profileFieldErrors.businessName ? "error" : ""
                              }
                              placeholder="e.g. Kaffi"
                              onChange={(event) =>
                                handleProfileChange(
                                  "businessName",
                                  event.target.value,
                                )
                              }
                            />
                            <FieldError>
                              {profileFieldErrors.businessName}
                            </FieldError>
                          </Col>
                          <Col xs={24} md={12}>
                            <FormLabel>Business category</FormLabel>
                            <Input
                              size="large"
                              value={profileDraft.businessCategory}
                              placeholder="Cafe, hotel, retail, wellness..."
                              onChange={(event) =>
                                handleProfileChange(
                                  "businessCategory",
                                  event.target.value,
                                )
                              }
                            />
                          </Col>
                          <Col xs={24}>
                            <FormLabel>Business location</FormLabel>
                            <Input
                              size="large"
                              value={profileDraft.businessLocation}
                              placeholder="Ahangama, Weligama, Mirrisa etc..?"
                              onChange={(event) =>
                                handleProfileChange(
                                  "businessLocation",
                                  event.target.value,
                                )
                              }
                            />
                          </Col>
                        </Row>
                      ) : null}

                      {profileDraft.audienceType === "resident" ? (
                        <Row gutter={[14, 14]}>
                          <Col xs={24} md={12}>
                            <FormLabel>Area</FormLabel>
                            <Input
                              size="large"
                              value={profileDraft.residentArea}
                              status={
                                profileFieldErrors.residentArea ? "error" : ""
                              }
                              placeholder="Ahangama, Midigama, Kabalana..."
                              onChange={(event) =>
                                handleProfileChange(
                                  "residentArea",
                                  event.target.value,
                                )
                              }
                            />
                            <FieldError>
                              {profileFieldErrors.residentArea}
                            </FieldError>
                          </Col>
                          <Col xs={24} md={12}>
                            <FormLabel>Connection to Ahangama</FormLabel>
                            <Input
                              size="large"
                              value={profileDraft.residentConnection}
                              placeholder="Living here, seasonal, local team..."
                              onChange={(event) =>
                                handleProfileChange(
                                  "residentConnection",
                                  event.target.value,
                                )
                              }
                            />
                          </Col>
                        </Row>
                      ) : null}

                      {profileDraft.audienceType === "tourist" ? (
                        <Row gutter={[14, 14]}>
                          <Col xs={24} md={12}>
                            <FormLabel>Length of stay</FormLabel>
                            <Select
                              size="large"
                              value={profileDraft.stayLength || undefined}
                              placeholder="Choose stay length"
                              onChange={(value) =>
                                handleProfileChange("stayLength", value)
                              }
                              options={STAY_LENGTH_OPTIONS.map((value) => ({
                                value,
                                label: value,
                              }))}
                            />
                          </Col>
                          <Col xs={24} md={12}>
                            <FormLabel>Travelling with</FormLabel>
                            <Select
                              size="large"
                              value={profileDraft.travelGroup || undefined}
                              placeholder="Choose travel group"
                              onChange={(value) =>
                                handleProfileChange("travelGroup", value)
                              }
                              options={TRAVEL_GROUP_OPTIONS.map((value) => ({
                                value,
                                label: value,
                              }))}
                            />
                          </Col>
                        </Row>
                      ) : null}

                      <div>
                        <FormLabel>What are you interested in?</FormLabel>
                        <Checkbox.Group
                          value={profileDraft.interests}
                          onChange={(value) =>
                            handleProfileChange("interests", value)
                          }
                          style={{ width: "100%" }}
                        >
                          <div className="hospo-chip-grid hospo-interest-chip-grid">
                            {INTEREST_OPTIONS.map((value) => (
                              <Checkbox
                                className="hospo-chip"
                                key={value}
                                value={value}
                              >
                                {value}
                              </Checkbox>
                            ))}
                          </div>
                        </Checkbox.Group>
                        <FieldError>{profileFieldErrors.interests}</FieldError>
                      </div>

                      <div>
                        <FormLabel>
                          What would you like from Ahangama.com?
                        </FormLabel>
                        <Checkbox.Group
                          value={profileDraft.goals}
                          onChange={(value) =>
                            handleProfileChange("goals", value)
                          }
                          style={{ width: "100%" }}
                        >
                          <div className="hospo-chip-grid">
                            {GOAL_OPTIONS.map((value) => (
                              <Checkbox
                                className="hospo-chip"
                                key={value}
                                value={value}
                              >
                                {value}
                              </Checkbox>
                            ))}
                          </div>
                        </Checkbox.Group>
                      </div>

                      <div>
                        <FormLabel>Anything else we should know?</FormLabel>
                        <TextArea
                          rows={4}
                          value={profileDraft.notes}
                          placeholder="Tell us what would make the pass or Ahangama.com useful to you."
                          onChange={(event) =>
                            handleProfileChange("notes", event.target.value)
                          }
                        />
                      </div>

                      <Text
                        style={{
                          display: "block",
                          color: "#6d655b",
                          fontSize: 13,
                          fontWeight: 600,
                          lineHeight: 1.6,
                        }}
                      >
                        {pageConfig.consentCopy}
                      </Text>

                      <Button
                        type="primary"
                        size="large"
                        block
                        loading={isSubmittingProfile}
                        icon={<SendOutlined />}
                        onClick={handleProfileSubmit}
                        style={{
                          height: 52,
                          borderRadius: 999,
                          background: "#1E1814",
                          borderColor: "#1E1814",
                          fontWeight: 700,
                        }}
                      >
                        Send My Details
                      </Button>
                    </div>
                  ) : null}

                  {formStep === FORM_STEP_SUCCESS ? (
                    <div style={{ display: "grid", gap: 18 }}>
                      {createdPassState?.passkitPending &&
                      createdPassState?.passkitError ? (
                        <Alert
                          type="warning"
                          showIcon
                          message={createdPassState.passkitError}
                        />
                      ) : null}
                      <Card
                        style={{
                          borderRadius: 20,
                          border: "1px solid rgba(176,142,98,0.18)",
                          background:
                            "linear-gradient(180deg, #fffaf1 0%, #f6ebd9 100%)",
                        }}
                        styles={{ body: { padding: 18 } }}
                      >
                        <Text
                          style={{
                            display: "block",
                            color: "#7A5B32",
                            fontSize: 12,
                            fontWeight: 800,
                            letterSpacing: 1.2,
                            textTransform: "uppercase",
                            marginBottom: 8,
                          }}
                        >
                          Install Pass
                        </Text>
                        <Paragraph
                          style={{
                            marginBottom: 10,
                            color: "#5A554D",
                            lineHeight: 1.7,
                          }}
                        >
                          Your details have been sent to the Ahangama team. Add
                          your pass to Apple Wallet or Google Wallet below.
                        </Paragraph>
                        {createdPassState?.pass?.validFrom ? (
                          <Text
                            style={{
                              display: "block",
                              marginTop: 8,
                              color: "#5A554D",
                              lineHeight: 1.7,
                            }}
                          >
                            Starts{" "}
                            {formatDisplayDate(createdPassState.pass.validFrom)}{" "}
                            and stays active for {PASS_VALIDITY_LABEL}.
                          </Text>
                        ) : null}
                        {createdPassState?.pass?.passkitInstallUrl ? (
                          <>
                            <Button
                              type="primary"
                              size="large"
                              block
                              href={createdPassState.pass.passkitInstallUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                marginTop: 18,
                                width: "100%",
                                minHeight: 52,
                              }}
                            >
                              Add to Apple Wallet / Google Wallet
                            </Button>
                            <a
                              href={createdPassState.pass.passkitInstallUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 10,
                                flexWrap: "wrap",
                                marginTop: 12,
                              }}
                            >
                              <img
                                src={addToAppleWalletLogo}
                                alt="Apple Wallet"
                                style={{
                                  display: "block",
                                  height: 38,
                                  width: "auto",
                                }}
                              />
                              <img
                                src={addToGoogleWalletLogo}
                                alt="Google Wallet"
                                style={{
                                  display: "block",
                                  height: 38,
                                  width: "auto",
                                }}
                              />
                            </a>
                          </>
                        ) : null}
                      </Card>
                    </div>
                  ) : null}
                </Card>
              </Col>
            </Row>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
