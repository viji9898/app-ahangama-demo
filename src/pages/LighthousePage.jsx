import React, { useState } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
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
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
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

const LIGHTHOUSE_HERO_IMAGE =
  "https://cf.bstatic.com/xdata/images/hotel/max1024x768/399746482.jpg?k=dcf8dd932aa01c5c00a96346f8facccd7e423e187db501a3939e4c971d097c18&o=";

const HERO_FEATURES = [
  "Complimentary 15-Day Pass",
  "Apple Wallet & Google Wallet Access",
  "Local Discounts & Perks",
  "Ahangama Guide & Map",
];

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

  return errors;
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
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    minHeight: "100svh",
                    maxWidth: 720,
                    padding:
                      "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 44px",
                  }}
                >
                  <Space size={12} wrap style={{ marginBottom: 18 }}>
                    {["Lighthouse Guest Access"].map((item) => (
                      <Text
                        key={item}
                        style={{
                          color: "#FFFFFF",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 1.6,
                          textTransform: "uppercase",
                        }}
                      >
                        {item}
                      </Text>
                    ))}
                  </Space>

                  <Title
                    className="home-hero-title"
                    style={{
                      margin: 0,
                      color: "#FFFFFF",
                      fontWeight: 500,
                      fontFamily:
                        '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
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
                    <span
                      className="home-hero-titleLine"
                      style={{ color: "#FFFFFF", whiteSpace: "normal" }}
                    >
                      For Lighthouse Hotel Guests
                    </span>
                  </Title>

                  <Text
                    style={{
                      display: "block",
                      marginTop: 18,
                      color: "rgba(255,255,255,0.92)",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 1.6,
                      textTransform: "uppercase",
                    }}
                  >
                    A complimentary benefit included with your stay.
                  </Text>

                  <Paragraph
                    style={{
                      marginTop: 24,
                      marginBottom: 22,
                      maxWidth: 560,
                      color: "#FFFFFF",
                      fontSize: "clamp(16px, 1.45vw, 19px)",
                      lineHeight: 1.72,
                    }}
                  >
                    Lighthouse Hotel guests can claim a complimentary Ahangama
                    Pass for local savings, curated recommendations and easier
                    discovery across the best of Ahangama.
                  </Paragraph>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: 10,
                      maxWidth: 620,
                      marginBottom: 26,
                    }}
                  >
                    {HERO_FEATURES.map((item) => (
                      <div
                        key={item}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          color: "rgba(255,255,255,0.94)",
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ color: "#D8C3A0", fontSize: 16 }}>
                          •
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <Space wrap size={12}>
                    <Button
                      size="large"
                      href="#lighthouse-signup-form"
                      style={{
                        background: "#FFFFFF",
                        color: "#201E1B",
                        borderColor: "#FFFFFF",
                        boxShadow: "none",
                      }}
                    >
                      Claim Your Pass
                    </Button>
                  </Space>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dm-canvas">
        <div className="dm-wrap" style={{ paddingBottom: 8 }}>
          <Row gutter={[24, 24]} style={{ marginTop: 28 }}>
            <Col xs={24} lg={14}>
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

            <Col xs={24} lg={10}>
              <Card
                id="lighthouse-signup-form"
                style={{
                  borderRadius: 28,
                  border: "1px solid rgba(32,30,27,0.08)",
                  background: "#FFFFFF",
                  boxShadow: "0 22px 54px rgba(47,62,58,0.08)",
                }}
                bodyStyle={{ padding: 30 }}
              >
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
                  Lighthouse Guest Access
                </Text>
                <Title
                  level={3}
                  style={{
                    marginTop: 0,
                    marginBottom: 10,
                    color: "#201E1B",
                    fontFamily:
                      '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    fontSize: "clamp(30px, 3vw, 42px)",
                    lineHeight: 1,
                    fontWeight: 500,
                  }}
                >
                  Claim Your Complimentary Pass
                </Title>
                <Paragraph
                  style={{
                    color: "#5A554D",
                    fontSize: 15,
                    lineHeight: 1.75,
                    marginBottom: 22,
                  }}
                >
                  Complete the short form below to issue a complimentary pass
                  for Lighthouse Hotel guests.
                </Paragraph>
                <Paragraph
                  style={{
                    color: "#5A554D",
                    fontSize: 15,
                    lineHeight: 1.75,
                    marginBottom: 22,
                  }}
                >
                  Your pass details can be prepared now, with wallet
                  installation available in the next step.
                </Paragraph>

                {formStep === FORM_STEP_DETAILS ? (
                  <Space
                    direction="vertical"
                    size={14}
                    style={{ width: "100%" }}
                  >
                    {detailsError ? (
                      <Alert
                        type="error"
                        showIcon
                        message={detailsError}
                        style={{ borderRadius: 16 }}
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
                        placeholder="Enter guest name"
                        value={guestDetails.fullName}
                        status={fieldErrors.fullName ? "error" : ""}
                        onChange={(event) =>
                          handleGuestDetailsChange(
                            "fullName",
                            event.target.value,
                          )
                        }
                      />
                      {fieldErrors.fullName ? (
                        <Text
                          type="danger"
                          style={{ display: "block", marginTop: 6 }}
                        >
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
                        placeholder="Enter guest email"
                        value={guestDetails.email}
                        status={fieldErrors.email ? "error" : ""}
                        onChange={(event) =>
                          handleGuestDetailsChange("email", event.target.value)
                        }
                      />
                      {fieldErrors.email ? (
                        <Text
                          type="danger"
                          style={{ display: "block", marginTop: 6 }}
                        >
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
                        Phone number
                      </Text>
                      <Input
                        size="large"
                        placeholder="Enter guest number"
                        value={guestDetails.phone}
                        status={fieldErrors.phone ? "error" : ""}
                        onChange={(event) =>
                          handleGuestDetailsChange("phone", event.target.value)
                        }
                      />
                      {fieldErrors.phone ? (
                        <Text
                          type="danger"
                          style={{ display: "block", marginTop: 6 }}
                        >
                          {fieldErrors.phone}
                        </Text>
                      ) : null}
                    </div>

                    <Button
                      type="primary"
                      size="large"
                      block
                      loading={isSubmittingDetails}
                      style={{ marginTop: 6 }}
                      onClick={handleGuestDetailsSubmit}
                    >
                      Get My Complimentary Pass
                    </Button>
                  </Space>
                ) : null}

                {formStep === FORM_STEP_PREFERENCES ? (
                  <Space
                    direction="vertical"
                    size={18}
                    style={{ width: "100%" }}
                  >
                    {preferencesError ? (
                      <Alert
                        type="error"
                        showIcon
                        message={preferencesError}
                        style={{ borderRadius: 16 }}
                      />
                    ) : null}

                    <div>
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
                      <Title
                        level={4}
                        style={{
                          marginTop: 0,
                          marginBottom: 8,
                          color: "#201E1B",
                          fontFamily:
                            '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                          fontSize: "clamp(26px, 2.8vw, 36px)",
                          lineHeight: 1.02,
                          fontWeight: 500,
                        }}
                      >
                        Help us personalise your Ahangama experience
                      </Title>
                      <Paragraph
                        style={{
                          color: "#5A554D",
                          fontSize: 15,
                          lineHeight: 1.75,
                          marginBottom: 0,
                        }}
                      >
                        Optional — takes less than 30 seconds.
                      </Paragraph>
                    </div>

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

                    <div>
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
                          handlePreferencesChange(
                            "stayLength",
                            event.target.value,
                          )
                        }
                        style={{ display: "grid", gap: 10 }}
                      >
                        {STAY_LENGTH_OPTIONS.map((option) => (
                          <Radio key={option} value={option}>
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
                        onChange={(value) =>
                          handlePreferencesChange("interests", value)
                        }
                        style={{ width: "100%" }}
                      >
                        <Row gutter={[12, 12]}>
                          {INTEREST_OPTIONS.map((option) => (
                            <Col xs={24} sm={12} key={option}>
                              <Checkbox value={option}>{option}</Checkbox>
                            </Col>
                          ))}
                        </Row>
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
                    >
                      Yes, send me personalised recommendations and local deals
                      via WhatsApp
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
                            <Col xs={24} sm={12} key={option}>
                              <Checkbox value={option}>{option}</Checkbox>
                            </Col>
                          ))}
                        </Row>
                      </Checkbox.Group>
                    </div>

                    <Space
                      direction="vertical"
                      size={10}
                      style={{ width: "100%" }}
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
                  </Space>
                ) : null}

                {formStep === FORM_STEP_SUCCESS ? (
                  <Space
                    direction="vertical"
                    size={18}
                    style={{ width: "100%" }}
                  >
                    <div>
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
                        Pass In Progress
                      </Text>
                      <Title
                        level={3}
                        style={{
                          marginTop: 0,
                          marginBottom: 10,
                          color: "#201E1B",
                          fontFamily:
                            '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                          fontSize: "clamp(30px, 3vw, 42px)",
                          lineHeight: 1,
                          fontWeight: 500,
                        }}
                      >
                        Your Ahangama Pass is being prepared
                      </Title>
                      <Paragraph
                        style={{
                          color: "#5A554D",
                          fontSize: 15,
                          lineHeight: 1.75,
                          marginBottom: 10,
                        }}
                      >
                        Wallet installation will be available in the next step.
                      </Paragraph>
                      {createdPassState?.guest?.fullName ? (
                        <Text style={{ color: "#5A554D" }}>
                          We have reserved your guest pass for{" "}
                          {createdPassState.guest.fullName}.
                        </Text>
                      ) : null}
                    </div>

                    <Card
                      style={{
                        borderRadius: 20,
                        border: "1px solid rgba(176,142,98,0.18)",
                        background:
                          "linear-gradient(180deg, #fffaf1 0%, #f6ebd9 100%)",
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
                        Next Step
                      </Text>
                      <Paragraph
                        style={{
                          marginBottom: 10,
                          color: "#5A554D",
                          lineHeight: 1.7,
                        }}
                      >
                        We&apos;ll guide you to wallet installation as soon as
                        the next step is ready.
                      </Paragraph>
                      <Space size={8} align="center" style={{ marginTop: 4 }}>
                        <img
                          src={addToAppleWalletLogo}
                          alt="Apple Wallet"
                          style={{
                            display: "block",
                            height: 45,
                            width: "auto",
                          }}
                        />
                        <img
                          src={addToGoogleWalletLogo}
                          alt="Google Wallet"
                          style={{
                            display: "block",
                            height: 45,
                            width: "auto",
                          }}
                        />
                      </Space>
                    </Card>
                  </Space>
                ) : null}

                <Card
                  style={{
                    marginTop: 20,
                    borderRadius: 20,
                    border: "1px solid rgba(176,142,98,0.18)",
                    background:
                      "linear-gradient(180deg, #fffaf1 0%, #f6ebd9 100%)",
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
                    Instant Digital Delivery
                  </Text>
                  <Paragraph
                    style={{
                      marginBottom: 10,
                      color: "#5A554D",
                      lineHeight: 1.7,
                    }}
                  >
                    The first step confirms your guest pass instantly.
                  </Paragraph>
                  <Text
                    style={{
                      display: "block",
                      color: "#5A554D",
                      lineHeight: 1.7,
                    }}
                  >
                    Wallet installation follows in the next step:
                  </Text>
                  <Space size={8} align="center" style={{ marginTop: 14 }}>
                    <img
                      src={addToAppleWalletLogo}
                      alt="Apple Wallet"
                      style={{ display: "block", height: 45, width: "auto" }}
                    />
                    <img
                      src={addToGoogleWalletLogo}
                      alt="Google Wallet"
                      style={{ display: "block", height: 45, width: "auto" }}
                    />
                  </Space>
                  <Paragraph
                    style={{
                      marginTop: 14,
                      marginBottom: 0,
                      color: "#5A554D",
                      lineHeight: 1.7,
                    }}
                  >
                    No app required.
                  </Paragraph>
                  <Paragraph
                    style={{
                      marginTop: 8,
                      marginBottom: 0,
                      color: "#5A554D",
                      lineHeight: 1.7,
                    }}
                  >
                    Simply show your pass when visiting participating venues.
                  </Paragraph>
                </Card>
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
