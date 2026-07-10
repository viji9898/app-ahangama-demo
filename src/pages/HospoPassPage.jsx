import React, { useEffect, useRef, useState } from "react";
import {
  BankOutlined,
  HomeOutlined,
  LockOutlined,
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
import { absUrl } from "../app/siteUrl";
import {
  DEFAULT_WHATSAPP_COUNTRY_CODE,
  PHONE_COUNTRY_CODES,
} from "../data/phoneCountryCodes";
import addToAppleWalletLogo from "../assets/add_to_apple_wallet.png";
import addToGoogleWalletLogo from "../assets/add_to_google_wallet.png";

const { Paragraph, Text, Title } = Typography;
const { TextArea } = Input;

export const HOSPO_PASS_PATH = "/hospo";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HOSPO_PASS_ENDPOINT = "/.netlify/functions/create-hotel-guest-pass";
const HOSPO_PROFILE_ENDPOINT = "/.netlify/functions/send-hospo-pass-profile";
const HOSPO_SOURCE_HOTEL_SLUG = "ahangama-hospo";
const HOSPO_DESTINATION = "ahangama";
const FORM_STEP_DETAILS = "details";
const FORM_STEP_PROFILE = "profile";
const FORM_STEP_SUCCESS = "success";
const DEFAULT_PASS_VALIDITY_DAYS = 15;
const DEFAULT_WHATSAPP_COUNTRY_OPTION =
  PHONE_COUNTRY_CODES.find(
    (option) => option.value === DEFAULT_WHATSAPP_COUNTRY_CODE,
  ) || PHONE_COUNTRY_CODES[0];

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

function getTodayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

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
  const email = String(values.email || "").trim().toLowerCase();
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

  if (!String(values.startDate || "").trim()) {
    errors.startDate = "Please choose your pass start date";
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

  if (profile.audienceType === "resident" && !String(profile.residentArea || "").trim()) {
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
        <span className="hospo-audience-description">
          {option.description}
        </span>
      </span>
    </Radio>
  );
}

export default function HospoPassPage() {
  const screens = Grid.useBreakpoint();
  const isTabletUp = Boolean(screens.md);
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
    startDate: getTodayInputValue(),
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
          startDate: guestDetails.startDate,
          sourceHotelSlug: HOSPO_SOURCE_HOTEL_SLUG,
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
          sourceHotelSlug: HOSPO_SOURCE_HOTEL_SLUG,
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
      setProfileError("We couldn't reach the profile service. Please try again.");
    } finally {
      setIsSubmittingProfile(false);
    }
  }

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Ahangama Complimentary Pass | Hospo"
        description="Claim the Ahangama complimentary pass and tell us whether you are a business owner, resident, or visitor so we can shape the right local experience."
        canonical={absUrl(HOSPO_PASS_PATH)}
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
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} lg={11}>
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
                  Ahangama Complimentary Pass
                </Text>
                <Title
                  style={{
                    margin: 0,
                    color: "#201e1b",
                    fontFamily:
                      '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    fontSize: "clamp(48px, 8vw, 92px)",
                    lineHeight: 0.9,
                    fontWeight: 500,
                  }}
                >
                  Claim your local Ahangama pass.
                </Title>
                <Paragraph
                  style={{
                    maxWidth: 570,
                    margin: "24px 0 0",
                    color: "#5f574d",
                    fontSize: "clamp(17px, 2vw, 21px)",
                    lineHeight: 1.75,
                  }}
                >
                  Built for business owners, residents and visitors who want a
                  better way to connect with Ahangama. First we create your
                  complimentary pass, then we collect a few details so the team
                  can understand who is joining.
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

              <Col xs={24} lg={13}>
                <Card
                  ref={formStep === FORM_STEP_SUCCESS ? passReadySectionRef : null}
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
                      fontSize: "clamp(30px, 3vw, 44px)",
                      lineHeight: 0.98,
                      fontWeight: 500,
                    }}
                  >
                    {formStep === FORM_STEP_DETAILS
                      ? "Create your complimentary pass"
                      : formStep === FORM_STEP_PROFILE
                        ? "Tell us who you are"
                        : "Your Ahangama Pass is ready"}
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
                      ? "This first step matches the current complimentary pass flow."
                      : formStep === FORM_STEP_PROFILE
                        ? "For now, these details will be emailed to team@ahangama.com and not stored in a new profile table."
                        : "Your profile details have been sent to the Ahangama team."}
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
                            handleGuestDetailsChange("fullName", event.target.value)
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
                            handleGuestDetailsChange("email", event.target.value)
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
                              handleGuestDetailsChange("phone", event.target.value)
                            }
                          />
                        </div>
                        <FieldError>{fieldErrors.phone}</FieldError>
                      </div>

                      <div>
                        <FormLabel>Pass starts on</FormLabel>
                        <Input
                          size="large"
                          type="date"
                          min={getTodayInputValue()}
                          value={guestDetails.startDate}
                          status={fieldErrors.startDate ? "error" : ""}
                          onChange={(event) =>
                            handleGuestDetailsChange("startDate", event.target.value)
                          }
                        />
                        <FieldError>{fieldErrors.startDate}</FieldError>
                        {!fieldErrors.startDate ? (
                          <Text
                            style={{
                              display: "block",
                              marginTop: 6,
                              color: "#7A7368",
                            }}
                          >
                            Valid for {DEFAULT_PASS_VALIDITY_DAYS} days from the
                            selected start date.
                          </Text>
                        ) : null}
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
                            handleProfileChange("audienceType", event.target.value)
                          }
                          className="hospo-audience-group"
                        >
                          <div className="hospo-audience-grid">
                            {AUDIENCE_OPTIONS.map((option) => (
                              <AudienceCard
                                key={option.value}
                                option={option}
                                selected={profileDraft.audienceType === option.value}
                              />
                            ))}
                          </div>
                        </Radio.Group>
                        <FieldError>{profileFieldErrors.audienceType}</FieldError>
                      </div>

                      {profileDraft.audienceType === "business_owner" ? (
                        <Row gutter={[14, 14]}>
                          <Col xs={24} md={12}>
                            <FormLabel>Business name</FormLabel>
                            <Input
                              size="large"
                              value={profileDraft.businessName}
                              status={profileFieldErrors.businessName ? "error" : ""}
                              placeholder="e.g. Kaffi"
                              onChange={(event) =>
                                handleProfileChange("businessName", event.target.value)
                              }
                            />
                            <FieldError>{profileFieldErrors.businessName}</FieldError>
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
                              placeholder="Where in Ahangama?"
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
                              status={profileFieldErrors.residentArea ? "error" : ""}
                              placeholder="Ahangama, Midigama, Kabalana..."
                              onChange={(event) =>
                                handleProfileChange("residentArea", event.target.value)
                              }
                            />
                            <FieldError>{profileFieldErrors.residentArea}</FieldError>
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
                          onChange={(value) => handleProfileChange("interests", value)}
                          style={{ width: "100%" }}
                        >
                          <div className="hospo-chip-grid">
                            {INTEREST_OPTIONS.map((value) => (
                              <Checkbox className="hospo-chip" key={value} value={value}>
                                {value}
                              </Checkbox>
                            ))}
                          </div>
                        </Checkbox.Group>
                        <FieldError>{profileFieldErrors.interests}</FieldError>
                      </div>

                      <div>
                        <FormLabel>What would you like from Ahangama.com?</FormLabel>
                        <Checkbox.Group
                          value={profileDraft.goals}
                          onChange={(value) => handleProfileChange("goals", value)}
                          style={{ width: "100%" }}
                        >
                          <div className="hospo-chip-grid">
                            {GOAL_OPTIONS.map((value) => (
                              <Checkbox className="hospo-chip" key={value} value={value}>
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

                      <Space direction="vertical" size={10}>
                        <Checkbox
                          checked={profileDraft.whatsappOptIn}
                          onChange={(event) =>
                            handleProfileChange("whatsappOptIn", event.target.checked)
                          }
                        >
                          Yes, send me local recommendations via WhatsApp.
                        </Checkbox>
                        <Checkbox
                          checked={profileDraft.wantsPartnerUpdates}
                          onChange={(event) =>
                            handleProfileChange(
                              "wantsPartnerUpdates",
                              event.target.checked,
                            )
                          }
                        >
                          Yes, keep me updated about Ahangama community and
                          partner opportunities.
                        </Checkbox>
                      </Space>

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
                          style={{ marginBottom: 10, color: "#5A554D", lineHeight: 1.7 }}
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
                            Starts {formatDisplayDate(createdPassState.pass.validFrom)}
                            {" "}and stays active for {DEFAULT_PASS_VALIDITY_DAYS} days.
                          </Text>
                        ) : null}
                        {createdPassState?.pass?.passkitInstallUrl ? (
                          <Button
                            type="primary"
                            size="large"
                            block
                            href={createdPassState.pass.passkitInstallUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginTop: 18, width: "100%", minHeight: 52 }}
                          >
                            Add to Apple Wallet / Google Wallet
                          </Button>
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