import React, { useState } from "react";
import {
  BookOutlined,
  CalendarOutlined,
  DownOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  HeartOutlined,
  LockOutlined,
  MessageOutlined,
  MobileOutlined,
  SearchOutlined,
  TeamOutlined,
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
const MAX_INTEREST_SELECTIONS = 3;
const DISPLAY_DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const DEFAULT_WHATSAPP_COUNTRY_OPTION =
  PHONE_COUNTRY_CODES.find(
    (option) => option.value === DEFAULT_WHATSAPP_COUNTRY_CODE,
  ) || PHONE_COUNTRY_CODES[0];

function formatDisplayDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return DISPLAY_DATE_FORMATTER.format(date);
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

function formatCountryOptionLabel(option) {
  if (!option) {
    return "";
  }

  return option.value;
}

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
const HERO_BADGE_YEAR = "2026 / 27";

const PASS_LOVE_STATS = [
  {
    value: "150+",
    title: "Curated Places",
    detail: "Handpicked by locals",
    Icon: EnvironmentOutlined,
  },
  {
    value: "50+",
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
    value: "Local",
    title: "Support",
    detail: "Real people, real help if you need it",
    Icon: TeamOutlined,
  },
  {
    value: "0",
    title: "Planning Stress",
    detail: "We've got you covered",
    Icon: HeartOutlined,
  },
];

const LIGHTHOUSE_GUIDE_SECTION_CARDS = [
  {
    label: "AHANGAMA GUIDE",
    title: "12 Things to Do",
    href: "/12-things",
    image:
      "https://hips.hearstapps.com/hmg-prod/images/exploring-ahangama-the-surfing-sweet-spot-on-sri-lanka-s-southern-coast-66475f779dc88.jpg?crop=0.6672958942897593xw:1xh;center,top&resize=640:*",
  },
  {
    label: "WELLNESS STAY",
    title: "My Weekend at Lighthouse",
    href: "",
    image:
      "https://q-xx.bstatic.com/xdata/images/hotel/max500/504932003.jpg?k=dea775aa5ed58cbc819897a662ae336aa36e75e2ce5c63e6bf382fa496bfc78b&o=",
  },
  {
    label: "WELLNESS GUIDE",
    title: "Wellness in Ahangama",
    href: "",
    image:
      "https://images.squarespace-cdn.com/content/v1/687779bfeb67b07ba252ad9e/1765200138172-E21VJEEVSEA0JQ1ZDW90/Jungle+Shala+Launch-45+2.jpg",
  },
  {
    label: "TRANSPORT GUIDE",
    title: "Getting Around",
    href: "/getting-around-ahangama-scooters-tuk-tuks-airport-transfers",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/93/b1/58/caption.jpg?w=500&h=500&s=1",
  },
];

const LIGHTHOUSE_GUIDE_SECTION_PALETTE = [
  {
    card: "#f7f1e7",
    ink: "#1f1d1a",
    line: "rgba(31,29,26,0.72)",
    media: "rgba(176, 142, 98, 0.14)",
  },
  {
    card: "#ebe5d8",
    ink: "#1f1d1a",
    line: "rgba(31,29,26,0.72)",
    media: "rgba(106, 114, 85, 0.16)",
  },
  {
    card: "#dfe5d6",
    ink: "#1f1d1a",
    line: "rgba(31,29,26,0.72)",
    media: "rgba(97, 111, 79, 0.16)",
  },
  {
    card: "#e8d6ca",
    ink: "#1f1d1a",
    line: "rgba(31,29,26,0.72)",
    media: "rgba(136, 92, 64, 0.14)",
  },
];

const STAY_LENGTH_OPTIONS = [
  "1–3 nights",
  "4–7 nights",
  "8–14 nights",
  "15–30 nights",
  "1 month+",
];

const INTEREST_OPTIONS = [
  "Cafés & Coffee",
  "Food & Local Dining",
  "Surfing",
  "Wellness & Yoga",
  "Fitness & Sports",
  "Shopping & Design",
  "Photography",
  "Nightlife & Social",
  "Nature & Wildlife",
  "Culture & Local Life",
  "Luxury Experiences",
  "Remote Work & Coworking",
  "Family-Friendly Activities",
];

const TRAVEL_GROUP_OPTIONS = [
  "Solo",
  "Partner / Couple",
  "Friends",
  "Family",
  "Work / Remote Work",
];

const SERVICE_OPTIONS = [
  "Airport Transfers",
  "Scooter Rental",
  "Surf Lessons",
  "Wellness Treatments",
  "Tours & Experiences",
  "Private Driver",
  "Coworking Passes",
  "Accommodation Deals",
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

  if (!String(values.countryCode || "").trim()) {
    errors.phone = "Please choose a country code";
  }

  const localPhoneDigits = String(values.phone || "").replace(/\D/g, "");

  if (!localPhoneDigits) {
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
  const screens = Grid.useBreakpoint();
  const isTabletUp = Boolean(screens.md);
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
    countryCode: DEFAULT_WHATSAPP_COUNTRY_CODE,
    phone: "",
    startDate: getTodayInputValue(),
  });
  const [preferencesDraft, setPreferencesDraft] = useState({
    country: "",
    stayLength: "",
    interests: [],
    travelGroup: "",
    whatsappOptIn: false,
    servicesInterestedIn: [],
  });
  const [countrySearchQuery, setCountrySearchQuery] = useState(
    formatCountryOptionLabel(DEFAULT_WHATSAPP_COUNTRY_OPTION),
  );
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const [isCountryInputActive, setIsCountryInputActive] = useState(false);

  const selectedCountryOption =
    PHONE_COUNTRY_CODES.find(
      (option) => option.value === guestDetails.countryCode,
    ) || DEFAULT_WHATSAPP_COUNTRY_OPTION;
  const filteredCountryOptions = PHONE_COUNTRY_CODES.filter((option) =>
    option.searchText.toLowerCase().includes(countrySearchQuery.toLowerCase()),
  ).slice(0, 12);

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
      if (field === "countryCode" && next.phone) {
        delete next.phone;
      }
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

    if (preferencesError) {
      setPreferencesError("");
    }
  };

  const handleInterestsChange = (value) => {
    handlePreferencesChange(
      "interests",
      Array.isArray(value) ? value.slice(0, MAX_INTEREST_SELECTIONS) : [],
    );
  };

  const handleCountrySearchFocus = () => {
    setIsCountryInputActive(true);
    setCountrySearchQuery("");
    setIsCountryMenuOpen(true);
  };

  const handleCountrySearchBlur = () => {
    setIsCountryInputActive(false);
    window.setTimeout(() => {
      setIsCountryMenuOpen(false);
      setCountrySearchQuery(formatCountryOptionLabel(selectedCountryOption));
    }, 120);
  };

  const handleCountrySearchChange = (value) => {
    setCountrySearchQuery(value);
    setIsCountryMenuOpen(true);
  };

  const handleCountrySelect = (option) => {
    handleGuestDetailsChange("countryCode", option.value);
    setCountrySearchQuery(formatCountryOptionLabel(option));
    setIsCountryMenuOpen(false);
    setIsCountryInputActive(false);
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
          phone: buildWhatsappPhoneNumber(
            guestDetails.countryCode,
            guestDetails.phone,
          ),
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
          travelGroup: preferencesDraft.travelGroup,
          whatsappOptIn: preferencesDraft.whatsappOptIn,
          servicesInterestedIn: preferencesDraft.servicesInterestedIn,
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

  const hasReachedInterestLimit =
    preferencesDraft.interests.length >= MAX_INTEREST_SELECTIONS;

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
      bodyStyle={{ padding: isTabletUp ? 32 : 20 }}
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
            <input
              aria-hidden="true"
              tabIndex={-1}
              autoComplete="username"
              style={{
                position: "absolute",
                opacity: 0,
                pointerEvents: "none",
                height: 0,
                width: 0,
              }}
            />
            <input
              aria-hidden="true"
              tabIndex={-1}
              autoComplete="new-password"
              style={{
                position: "absolute",
                opacity: 0,
                pointerEvents: "none",
                height: 0,
                width: 0,
              }}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isTabletUp
                  ? "minmax(146px, 172px) minmax(0, 1fr)"
                  : "minmax(122px, 132px) minmax(0, 1fr)",
                gap: 10,
              }}
            >
              <div style={{ position: "relative" }}>
                <Input
                  size="large"
                  name="whatsapp-country-search"
                  aria-label="WhatsApp country code"
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  readOnly={!isCountryInputActive}
                  value={
                    isCountryInputActive
                      ? countrySearchQuery
                      : formatCountryOptionLabel(selectedCountryOption)
                  }
                  status={fieldErrors.phone ? "error" : ""}
                  onFocus={handleCountrySearchFocus}
                  onBlur={handleCountrySearchBlur}
                  onChange={(event) =>
                    handleCountrySearchChange(event.target.value)
                  }
                  suffix={
                    isCountryMenuOpen ? (
                      <SearchOutlined style={{ color: "#b8b2aa" }} />
                    ) : (
                      <DownOutlined style={{ color: "#b8b2aa" }} />
                    )
                  }
                  styles={{
                    input: {
                      textAlign: isCountryInputActive ? "left" : "right",
                    },
                  }}
                  style={{ borderRadius: 14, minHeight: 46 }}
                />

                {isCountryMenuOpen ? (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: 0,
                      width: "min(360px, 100%)",
                      maxHeight: 280,
                      overflowY: "auto",
                      borderRadius: 16,
                      border: "1px solid rgba(32,30,27,0.08)",
                      background: "#FFFFFF",
                      boxShadow: "0 18px 40px rgba(32,30,27,0.12)",
                      zIndex: 30,
                    }}
                  >
                    {filteredCountryOptions.length > 0 ? (
                      filteredCountryOptions.map((option) => (
                        <button
                          key={`${option.iso2}-${option.value}`}
                          type="button"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            handleCountrySelect(option);
                          }}
                          style={{
                            display: "block",
                            width: "100%",
                            padding: "12px 14px",
                            border: "none",
                            borderBottom: "1px solid rgba(32,30,27,0.06)",
                            background: "#FFFFFF",
                            color: "#201E1B",
                            textAlign: "left",
                            cursor: "pointer",
                          }}
                        >
                          <span
                            style={{
                              display: "block",
                              fontSize: 15,
                              fontWeight: 600,
                              lineHeight: 1.4,
                            }}
                          >
                            {option.label}
                          </span>
                          <span
                            style={{
                              display: "block",
                              marginTop: 2,
                              color: "#7A746D",
                              fontSize: 13,
                              lineHeight: 1.4,
                            }}
                          >
                            {option.value}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div
                        style={{
                          padding: "12px 14px",
                          color: "#7A746D",
                          fontSize: 14,
                        }}
                      >
                        No matching country code.
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              <Input
                size="large"
                placeholder="Enter your WhatsApp number"
                value={guestDetails.phone}
                inputMode="tel"
                status={fieldErrors.phone ? "error" : ""}
                onChange={(event) =>
                  handleGuestDetailsChange("phone", event.target.value)
                }
                style={{ borderRadius: 14, minHeight: 46 }}
              />
            </div>
            <Text
              style={{
                display: "block",
                marginTop: 6,
                color: "#7A746D",
                fontSize: 12,
                lineHeight: 1.5,
              }}
            >
              Search by country name or dial code, for example Sri Lanka or +94.
            </Text>
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
                gridTemplateColumns: isTabletUp
                  ? "repeat(5, minmax(0, 1fr))"
                  : "repeat(2, minmax(0, 1fr))",
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
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              What are you most interested in during your stay?
            </Text>
            <Text
              style={{ display: "block", marginBottom: 10, color: "#7A746D" }}
            >
              Select up to 3.
            </Text>
            <Checkbox.Group
              value={preferencesDraft.interests}
              onChange={handleInterestsChange}
              style={{ width: "100%" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isTabletUp
                    ? "repeat(4, minmax(0, 1fr))"
                    : "repeat(2, minmax(0, 1fr))",
                  gap: "14px 24px",
                  width: "100%",
                }}
              >
                {INTEREST_OPTIONS.map((option) => (
                  <div key={option} style={{ minWidth: 0 }}>
                    <Checkbox
                      value={option}
                      disabled={
                        hasReachedInterestLimit &&
                        !preferencesDraft.interests.includes(option)
                      }
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

          <div style={{ gridColumn: "1 / -1" }}>
            <Text
              style={{
                display: "block",
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              Who are you travelling with?
            </Text>
            <Radio.Group
              value={preferencesDraft.travelGroup}
              onChange={(event) =>
                handlePreferencesChange("travelGroup", event.target.value)
              }
              style={{
                display: "grid",
                gridTemplateColumns: isTabletUp
                  ? "repeat(5, minmax(0, 1fr))"
                  : "repeat(2, minmax(0, 1fr))",
                gap: 10,
              }}
            >
              {TRAVEL_GROUP_OPTIONS.map((option) => (
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

          <Checkbox
            checked={preferencesDraft.whatsappOptIn}
            onChange={(event) =>
              handlePreferencesChange("whatsappOptIn", event.target.checked)
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
              Interested in help with?
            </Text>
            <Checkbox.Group
              value={preferencesDraft.servicesInterestedIn}
              onChange={(value) =>
                handlePreferencesChange("servicesInterestedIn", value)
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
            width: "100%",
          }}
        >
          <Card
            style={{
              width: "100%",
              borderRadius: 20,
              border: "1px solid rgba(176,142,98,0.18)",
              background: "linear-gradient(180deg, #fffaf1 0%, #f6ebd9 100%)",
            }}
            bodyStyle={{ padding: 18 }}
          >
            {createdPassState?.passkitPending &&
            createdPassState?.passkitError ? (
              <Text
                style={{
                  display: "block",
                  color: "#8C6B3B",
                  marginBottom: 12,
                }}
              >
                {createdPassState.passkitError}
              </Text>
            ) : null}

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
                ? "Add your pass to Apple Wallet or Google Wallet below."
                : "We&apos;ll guide you to wallet installation as soon as the next step is ready."}
            </Paragraph>

            {createdPassState?.pass?.passkitInstallUrl &&
            createdPassState?.pass?.validFrom ? (
              <Text
                style={{
                  display: "block",
                  marginTop: 8,
                  color: "#5A554D",
                  lineHeight: 1.7,
                }}
              >
                {`Starts ${formatDisplayDate(createdPassState.pass.validFrom)} and stays active for ${DEFAULT_PASS_VALIDITY_DAYS} days.`}
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
                minHeight: isTabletUp ? "100svh" : "auto",
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
                    minHeight: isTabletUp ? "100svh" : "auto",
                    display: "flex",
                    alignItems: "center",
                    padding: isTabletUp
                      ? "clamp(108px, 12vw, 152px) clamp(28px, 4.8vw, 72px) clamp(42px, 5vw, 60px)"
                      : "112px 20px 36px",
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
                        gridTemplateColumns: isTabletUp
                          ? "repeat(auto-fit, minmax(96px, 1fr))"
                          : "repeat(2, minmax(0, 1fr))",
                        gap: isTabletUp ? 18 : 14,
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
                        flexWrap: "wrap",
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
          ></div>
        </div>
      </div>

      <div className="dm-canvas">
        <div className="dm-wrap" style={{ paddingTop: 18, paddingBottom: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background:
                  "linear-gradient(90deg, rgba(176,142,98,0.08) 0%, rgba(176,142,98,0.45) 100%)",
                minWidth: isTabletUp ? 0 : 72,
              }}
            />
            <Title
              level={2}
              style={{
                margin: 0,
                color: "#2F2A24",
                textAlign: "center",
                fontFamily:
                  '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                fontSize: "clamp(26px, 3.2vw, 44px)",
                lineHeight: 1,
                fontWeight: 500,
                whiteSpace: "normal",
                flex: isTabletUp ? "0 1 auto" : "1 1 100%",
              }}
            >
              Why Lighthouse Guests Love Their Pass
            </Title>
            <div
              style={{
                flex: 1,
                height: 1,
                background:
                  "linear-gradient(90deg, rgba(176,142,98,0.45) 0%, rgba(176,142,98,0.08) 100%)",
                minWidth: isTabletUp ? 0 : 72,
              }}
            />
          </div>

          <Card
            style={{
              borderRadius: 28,
              border: "1px solid rgba(32,30,27,0.08)",
              background: "linear-gradient(180deg, #fffefb 0%, #fbf6ee 100%)",
              boxShadow: "0 18px 40px rgba(70,54,28,0.06)",
            }}
            bodyStyle={{ padding: 0 }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              }}
            >
              {PASS_LOVE_STATS.map(({ value, title, detail, Icon }, index) => (
                <div
                  key={`${title}-${value}`}
                  style={{
                    display: "flex",
                    gap: 18,
                    alignItems: "center",
                    padding: "28px 24px",
                    borderRight: isTabletUp
                      ? index === PASS_LOVE_STATS.length - 1
                        ? "none"
                        : "1px solid rgba(32,30,27,0.08)"
                      : "none",
                    borderBottom:
                      !isTabletUp && index !== PASS_LOVE_STATS.length - 1
                        ? "1px solid rgba(32,30,27,0.08)"
                        : "none",
                  }}
                >
                  <Icon
                    style={{ fontSize: 34, color: "#B08E62", flex: "0 0 auto" }}
                  />
                  <div>
                    <div
                      style={{
                        color: "#A47F49",
                        fontSize: 26,
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
                        marginTop: 10,
                        color: "#2F2A24",
                        fontSize: 15,
                        fontWeight: 700,
                        lineHeight: 1.35,
                      }}
                    >
                      {title}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        color: "#6E675F",
                        fontSize: 13,
                        lineHeight: 1.55,
                      }}
                    >
                      {detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="dm-canvas">
        <div className="dm-wrap" style={{ paddingTop: 28, paddingBottom: 8 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isTabletUp
                ? "minmax(280px, 360px) minmax(0, 1fr)"
                : "minmax(0, 1fr)",
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
              <div style={{ marginBottom: 28 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                    marginBottom: 18,
                  }}
                >
                  <div>
                    <Text
                      style={{
                        display: "block",
                        color: "#B08E62",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: 1.8,
                        textTransform: "uppercase",
                        marginBottom: 10,
                      }}
                    >
                      2. Guide Sections
                    </Text>
                    <Paragraph
                      style={{
                        margin: 0,
                        color: "#4B463F",
                        fontSize: 16,
                        lineHeight: 1.7,
                      }}
                    >
                      Editorial guides for navigating Ahangama.
                    </Paragraph>
                  </div>

                  <a
                    href="/blogs"
                    style={{
                      color: "#2F2A24",
                      fontSize: 14,
                      fontWeight: 700,
                      textDecoration: "none",
                      borderBottom: "1px solid rgba(47,42,36,0.35)",
                      paddingBottom: 2,
                    }}
                  >
                    See All
                  </a>
                </div>

                <div
                  aria-hidden="true"
                  style={{
                    height: 1,
                    background: "rgba(32,30,27,0.1)",
                    marginBottom: 20,
                  }}
                />

                <div
                  style={{
                    display: isTabletUp ? "grid" : "flex",
                    alignItems: "stretch",
                    overflowX: isTabletUp ? "visible" : "auto",
                    overscrollBehaviorX: isTabletUp ? "auto" : "contain",
                    scrollSnapType: isTabletUp ? "none" : "x proximity",
                    gridTemplateColumns: isTabletUp
                      ? "repeat(auto-fit, minmax(220px, 1fr))"
                      : undefined,
                    gap: isTabletUp ? 18 : 14,
                    paddingBottom: isTabletUp ? 0 : 8,
                  }}
                >
                  {LIGHTHOUSE_GUIDE_SECTION_CARDS.map((guide, index) => {
                    const palette =
                      LIGHTHOUSE_GUIDE_SECTION_PALETTE[
                        index % LIGHTHOUSE_GUIDE_SECTION_PALETTE.length
                      ];
                    const CardTag = guide.href ? "a" : "div";

                    return (
                      <CardTag
                        key={guide.href || guide.title}
                        href={guide.href || undefined}
                        style={{
                          display: isTabletUp ? "block" : "flex",
                          flex: isTabletUp ? undefined : "0 0 248px",
                          minWidth: 0,
                          height: "100%",
                          textDecoration: "none",
                          scrollSnapAlign: isTabletUp ? "none" : "start",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            height: "100%",
                            minHeight: isTabletUp ? undefined : 392,
                            borderRadius: 18,
                            padding: isTabletUp ? 16 : 14,
                            background: palette.card,
                            color: palette.ink,
                            border: "1px solid rgba(31,29,26,0.08)",
                            boxShadow: "0 8px 20px rgba(31,29,26,0.04)",
                          }}
                        >
                          <Text
                            style={{
                              display: "block",
                              paddingBottom: 6,
                              marginBottom: 10,
                              borderBottom: `1px solid ${palette.line}`,
                              color: palette.ink,
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: 1.5,
                              textTransform: "uppercase",
                            }}
                          >
                            {guide.label}
                          </Text>

                          <Title
                            level={3}
                            style={{
                              margin: "0 0 16px",
                              color: palette.ink,
                              fontSize: isTabletUp
                                ? "clamp(22px, 1.9vw, 34px)"
                                : "28px",
                              lineHeight: 0.98,
                              letterSpacing: -0.8,
                              fontFamily:
                                '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                            }}
                          >
                            {guide.title}
                          </Title>

                          <div
                            style={{
                              marginTop: "auto",
                              aspectRatio: "1 / 1.12",
                              overflow: "hidden",
                              background: palette.media,
                              border: "1px solid rgba(31,29,26,0.08)",
                            }}
                          >
                            <img
                              src={guide.image}
                              alt={guide.title}
                              style={{
                                display: "block",
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                              }}
                            />
                          </div>
                        </div>
                      </CardTag>
                    );
                  })}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </SiteLayout>
  );
}
