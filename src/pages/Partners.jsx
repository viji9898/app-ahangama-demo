import React, { useState } from "react";
import {
  BookOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  HomeOutlined,
  InstagramOutlined,
  MailOutlined,
  MenuOutlined,
  NotificationOutlined,
  ReadOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ahangamaPassMobileWallet from "../assets/ahangama-pass-mobie-wallet.jpg";
import whatsappConciergeImage from "../assets/whatsapp-concierge.jpg";
import postcardStandKumbukImage from "../assets/postcard-stand-kumbuk.jpeg";
import postcardStandThilenisImage from "../assets/postcard-stand-thilenis.jpeg";
import denitsaPortrait from "../assets/temp/denitsa.jpg";
import kaffiImage from "../assets/temp/kaffi_image.jpg";
import muktiStudioImage from "../assets/temp/mukit_studio.jpg";
import sistersImage from "../assets/temp/sisters_image.jpg";

const { Paragraph, Text, Title } = Typography;

const HERO_IMAGE =
  "https://polarsteps.s3.amazonaws.com/user_images/steps/large_thumb/u_8317798/3f3fcfc3-61bc-44c9-9e07-5bc8d35ab99c_455b553f-d99d-40ca-ad04-3a5774a62cef.jpg";

const HOME_PAGE_HERO_IMAGE =
  "https://images.suitcasemag.com/wp-content/uploads/2025/05/01113553/Hero-AhanagamaGuide-SriLanka.jpeg";

const AHANGAMA_GOOGLE_MAP_URL =
  "https://maps.app.goo.gl/nh4DYnE3haE3euCT6";
const AHANGAMA_GOOGLE_MAP_EMBED_URL =
  "https://www.google.com/maps?q=Ahangama,Sri%20Lanka&z=14&output=embed";
const AHANGAMA_GUIDE_PREVIEW_URL = "/guide";
const PLASTIC_STANDS_IMAGE = postcardStandThilenisImage;
const POSTCARDS_IMAGE = postcardStandKumbukImage;

const PRODUCT_TIERS = [
  {
    name: "Pass Partner",
    price: "Free",
    billing: "",
    summary: "Join the Ahangama Pass network and offer a benefit to visitors.",
    intro: "Perfect for venues wanting exposure without any commitment.",
    points: [
      "Venue profile",
      "Pass offer displayed",
      "Map listing",
      "Website, WhatsApp and Instagram links",
      "Inclusion in pass search",
      "Pass partner badge",
      "Basic analytics",
    ],
  },
  {
    name: "Ahangama Circle",
    price: "$29",
    billing: "/month",
    summary: "For venues looking to increase visibility and foot traffic.",
    intro: "Everything in Pass Partner plus:",
    points: [
      "Featured category placement",
      "Weekly visitor newsletter inclusion",
      "What's On This Week inclusion",
      "Event submissions",
      "Priority search placement",
      "Access to Ahangama Circle business community",
      "Monthly performance summary",
    ],
  },
  {
    name: "Ahangama Circle Plus",
    price: "$79",
    billing: "/month",
    summary:
      "For businesses wanting stronger visibility and editorial support.",
    intro: "Everything in Circle plus:",
    points: [
      "Recommended by Ahangama.com",
      "Inclusion in Ahangama Season Guide 2026/27",
      "Dedicated venue story",
      "Priority newsletter placement",
      "Concierge referrals",
      "Social media features",
      "Quarterly spotlight",
      "Seasonal campaigns",
    ],
  },
  {
    name: "Premium Partner",
    price: "$199",
    billing: "/month",
    summary: "Maximum exposure across the Ahangama ecosystem.",
    intro: "Everything in Circle Plus plus:",
    points: [
      "Homepage features",
      "Arrival email campaigns",
      "Featured newsletter placements",
      "Dedicated marketing campaigns",
      "Priority concierge referrals",
      "New venue launch support",
      "Seasonal destination features",
      "Premium guide placement",
    ],
  },
];

const PLATFORM_AREAS = [
  "Stays, villas and hospitality brands",
  "Restaurants, cafes and beach clubs",
  "Surf, wellness and experience-led operators",
  "Retail, culture and destination businesses",
];

const GUEST_TOUCH_POINTS = [
  {
    title: "Hotel Welcome Pack",
    subtitle: "Complimentary Pass",
    description:
      "Pass included in welcome packs at partner hotels and villas to reach guests at check-in.",
    points: [
      "Ideal for capturing visitors at arrival",
      "Works through partner hotel and villa distribution",
      "Introduces the Pass at a high-attention moment",
    ],
  },
  {
    title: "Plastic Stands",
    subtitle: "In Venues & Shops",
    image: PLASTIC_STANDS_IMAGE,
    description:
      "Table and counter displays featuring the map, guide and Pass offers in high-traffic venues.",
    points: [
      "Placed inside cafes, restaurants, shops and partner venues",
      "Combines brand presence with QR-led discovery",
      "Supports ongoing scans throughout the day",
    ],
  },
  {
    title: "Coasters",
    subtitle: "On Tables",
    description:
      "Branded coasters with QR-led discovery prompts placed in cafes, bars and restaurants.",
    points: [
      "Sits directly in front of seated guests",
      "Useful for repeated passive exposure",
      "Encourages quick scans in food and drink settings",
    ],
  },
  {
    title: "Stickers on Venues",
    subtitle: "Windows & Doors",
    description:
      "Partner venue stickers that signal trust, drive scans and increase walk-in awareness.",
    points: [
      "Visible from outside and at entry points",
      "Builds recognition across the town",
      "Signals participation in the Ahangama ecosystem",
    ],
  },
  {
    title: "Tuk Tuk Advertising",
    subtitle: "On the Move",
    description:
      "Back-of-tuk placements that create repeated visibility around Ahangama and nearby areas.",
    points: [
      "Mobile awareness while visitors move around town",
      "Strong visibility in traffic and at pickup points",
      "Good for broad repeated impressions",
    ],
  },
  {
    title: "Postcards",
    subtitle: "In Shops & Venues",
    image: POSTCARDS_IMAGE,
    description:
      "Takeaway postcards with map and offer prompts that visitors can keep and carry with them.",
    points: [
      "Easy physical takeaway format",
      "Combines utility with keepsake value",
      "Extends visibility beyond the venue itself",
    ],
  },
  {
    title: "Surf Shop Displays",
    subtitle: "High Intent Traffic",
    description:
      "Display stands inside surf retail environments targeting active travellers already in-market.",
    points: [
      "Targets a relevant and active travel segment",
      "Useful for surf-led and lifestyle audiences",
      "Connects discovery with retail footfall",
    ],
  },
  {
    title: "Events & Pop-Ups",
    subtitle: "Local Engagement",
    description:
      "Ahangama Pass presence at markets, activations and seasonal events throughout the year.",
    points: [
      "Useful for live engagement and direct sign-ups",
      "Flexible across seasonal activations",
      "Builds local and visitor awareness simultaneously",
    ],
  },
];

const AUDIENCE_REACH_CHANNELS = [
  {
    label: "Ahangama.com",
    icon: HomeOutlined,
    description:
      "The leading independent guide to Ahangama, helping visitors discover where to stay, eat, work, surf, and explore.",
    reach: [
      "50,000+ annual website visitors",
      "150,000+ annual page views",
      "Visitors from 80+ countries",
      "High-intent travel audience planning trips to Sri Lanka",
      "These are estimated figures. We will invest monthly in Google Search Ads and paid targeted promotion to reach high-intent audiences.",
    ],
  },
  {
    label: "Ahangama Pass",
    icon: TagOutlined,
    description:
      "A visitor membership programme connecting travellers with local businesses through exclusive offers, experiences, and recommendations.",
    reach: [
      "3,000+ pass holders annually",
      "15,000+ offer views per month",
      "Visitors actively seeking places to spend during their stay",
      "Direct exposure at the point of decision-making",
      "Primary distribution via hotel partners and travel agents",
    ],
  },
  {
    label: "Ahangama Map",
    icon: EnvironmentOutlined,
    description:
      "The most comprehensive visitor map of Ahangama, featuring curated venues, experiences, services, and local recommendations.",
    reach: [
      "25,000+ annual map views",
      "Frequently accessed by visitors already in destination",
      "Used for navigation and venue discovery",
      "Strong visibility across mobile devices",
    ],
  },
  {
    label: "Ahangama Guide 2026/27",
    icon: BookOutlined,
    description:
      "A printed and digital editorial guide showcasing the best of Ahangama through stories, recommendations, and local insights.",
    reach: [
      "5,000 printed copies annually",
      "Distributed through hotels, cafes, villas, surf camps, and partner venues",
      "Long shelf life and repeated readership",
      "Premium publication designed to be kept, not discarded",
    ],
  },
  {
    label: "Visitor Email Campaigns",
    icon: MailOutlined,
    description:
      "Targeted communications sent to visitors before, during, and after their stay in Ahangama.",
    reach: [
      "10,000+ subscriber database",
      "Monthly editorial newsletters",
      "Seasonal destination guides",
      "Dedicated partner features and recommendations",
    ],
  },
  {
    label: "Hotel Partnerships",
    icon: HomeOutlined,
    description:
      "A network of accommodation partners introducing guests to Ahangama experiences, venues, and offers.",
    reach: [
      "100+ hotel and villa partners",
      "Direct access to guests during trip planning and arrival",
      "Visibility at reception desks, guest welcome packs, and concierge recommendations",
      "Estimated 50,000+ annual guest impressions",
    ],
  },
  {
    label: "Bank Partnerships",
    icon: NotificationOutlined,
    description:
      "Strategic bank partnerships that place Ahangama.com offers, guides and partner recommendations in front of cardholders and travel-ready audiences. Example: /pabc.",
    reach: [
      "Exposure through bank customer channels and travel-facing campaigns",
      "Targeted placement for audiences planning leisure and lifestyle spending",
      "Potential integration with cardholder perks, destination offers and partner benefits",
      "A scalable acquisition channel for high-intent visitors before arrival",
    ],
  },
  {
    label: "Concierge Recommendations",
    icon: NotificationOutlined,
    description:
      "Personalised recommendations provided to visitors seeking trusted local advice.",
    reach: [
      "High-intent travellers actively looking for places to visit",
      "Direct referrals from concierge teams and hospitality partners",
      "Strong conversion due to trusted recommendation format",
      "Premium audience segment with higher spending potential",
    ],
  },
  {
    label: "Instagram & Social Media",
    icon: InstagramOutlined,
    description:
      "Daily destination content featuring local businesses, experiences, events, and editorial recommendations.",
    reach: [
      "100,000+ monthly impressions",
      "Destination-focused audience",
      "Reels, stories, venue features, and editorial content",
      "Strong engagement from visitors currently travelling in Sri Lanka",
    ],
  },
  {
    label: "Editorial Features",
    icon: ReadOutlined,
    description:
      "Long-form stories, guides, interviews, and curated recommendations highlighting exceptional businesses and experiences.",
    reach: [
      "Featured permanently within Ahangama.com",
      "Shared across newsletter and social channels",
      "Search engine visibility throughout the year",
      "Builds credibility through trusted editorial endorsement",
    ],
  },
];

const PROMOTIONAL_PRODUCTS = [
  {
    name: "Featured Venue of the Week",
    price: "$50",
    icon: NotificationOutlined,
  },
  { name: "Newsletter Sponsor", price: "$25", icon: MailOutlined },
  { name: "Event Promotion", price: "$25", icon: CalendarOutlined },
  { name: "Seasonal Campaign", price: "$100", icon: TagOutlined },
  { name: "Dedicated Editorial Story", price: "$250", icon: ReadOutlined },
  { name: "New Venue Launch Package", price: "$250", icon: BookOutlined },
  { name: "Homepage Feature", price: "$250 /month", icon: HomeOutlined },
];

const EMAIL_CAMPAIGN_STAGES = [
  {
    label: "Newsletter on sign up",
    eyebrow: "Arrival Sequence",
    kicker: "Welcome to Ahangama",
    title: "A warm first note sent the moment a visitor signs up.",
    paragraphs: [
      "This dummy version introduces the destination, explains what the subscriber will receive, and sets the tone for the stay ahead.",
      "It highlights a few useful links, frames Ahangama as a curated destination, and opens the relationship with a considered editorial voice.",
    ],
    featureLabel: "Included Blocks",
    featureTitle: "What this sign-up email could contain.",
    features: [
      {
        label: "Welcome Note",
        title: "A short editorial introduction",
        body: "A lightweight opening message that explains the purpose of the emails and builds trust immediately.",
      },
      {
        label: "Quick Links",
        title: "Map, guide and pass in one place",
        body: "Fast access to the most useful Ahangama products for a visitor who has just entered the ecosystem.",
      },
      {
        label: "Partner Spotlight",
        title: "A featured business placement",
        body: "A simple hero recommendation that gives one partner premium visibility at the highest-attention moment.",
      },
    ],
    storiesLabel: "Dummy Modules",
    storiesTitle: "Example placements in the welcome email.",
    stories: [
      {
        title: "Where to Start in Ahangama",
        body: "A short editorial card guiding the visitor toward a first set of trusted recommendations.",
        meta: "Hero placement",
        image: kaffiImage,
      },
      {
        title: "Your Pass Benefits",
        body: "A secondary block outlining the value of joining the Ahangama Pass network on arrival.",
        meta: "Support module",
        image: muktiStudioImage,
      },
    ],
  },
  {
    label: "Day 1 Newsletter",
    eyebrow: "Arrival Sequence",
    kicker: "First Full Day",
    title: "A practical first-day email for visitors settling into town.",
    paragraphs: [
      "This dummy version is more utility-led: where to eat first, how to orient yourself, and what to bookmark for the rest of the trip.",
      "It is designed to drive immediate foot traffic to selected partners during the visitor's highest-intent discovery window.",
    ],
    featureLabel: "Suggested Structure",
    featureTitle: "What the Day 1 email could prioritise.",
    features: [
      {
        label: "Breakfast + Coffee",
        title: "Morning recommendations near where visitors stay",
        body: "A concise set of practical suggestions that converts quickly because it meets immediate needs.",
      },
      {
        label: "Orientation",
        title: "Map-based discovery prompts",
        body: "A supporting block that nudges users to open the map, save spots and begin navigating the destination.",
      },
      {
        label: "Featured Partner",
        title: "A premium venue recommendation",
        body: "A highlighted partner card positioned as a trusted starting point for the day.",
      },
    ],
    storiesLabel: "Dummy Modules",
    storiesTitle: "Example content for a Day 1 send.",
    stories: [
      {
        title: "Best First Stops After Arrival",
        body: "A simple round-up of places a visitor can act on immediately after checking in.",
        meta: "Utility feature",
        image: sistersImage,
      },
      {
        title: "Three Places to Book Today",
        body: "An action-oriented recommendation block meant to create quick conversion for partner venues.",
        meta: "Partner module",
        image: kaffiImage,
      },
    ],
  },
  {
    label: "Day 2 Newsletter",
    eyebrow: "In-Stay Sequence",
    kicker: "Deepen Discovery",
    title: "A second-day email focused on exploration and stronger recommendations.",
    paragraphs: [
      "This dummy version assumes the visitor is now oriented and ready for more selective editorial suggestions, bookings and discoveries.",
      "It can move beyond basics into wellness, experiences, shopping, evening plans and higher-value partner exposure.",
    ],
    featureLabel: "Suggested Structure",
    featureTitle: "What the Day 2 email could contain.",
    features: [
      {
        label: "Experiences",
        title: "Surf, wellness and activity recommendations",
        body: "A curated list of bookable options that helps visitors spend more intentionally around town.",
      },
      {
        label: "Editorial Picks",
        title: "More selective local favourites",
        body: "A tighter, taste-led set of recommendations positioned as trusted Ahangama edits.",
      },
      {
        label: "Premium Partner",
        title: "A stronger sponsored feature",
        body: "A more immersive partner story with image-led presentation and a direct action prompt.",
      },
    ],
    storiesLabel: "Dummy Modules",
    storiesTitle: "Example content for the second-day send.",
    stories: [
      {
        title: "A Slower Wellness Day in Ahangama",
        body: "A themed content block showing how a premium partner could appear inside an editorial journey.",
        meta: "Editorial feature",
        image: muktiStudioImage,
      },
      {
        title: "After-Surf Places Worth Knowing",
        body: "A second content card for food, retail or sunset-facing recommendations later in the stay.",
        meta: "Curated list",
        image: sistersImage,
      },
    ],
  },
  {
    label: "Last Day Newsletter",
    eyebrow: "Departure Sequence",
    kicker: "Before You Leave",
    title: "A final email designed for last-day bookings, souvenirs and keeping the relationship alive.",
    paragraphs: [
      "This dummy version encourages one last round of spending while also nudging the visitor into longer-term brand connection after departure.",
      "It can support retail partners, gift-led offers, final meals, and prompts to follow Ahangama.com after the trip.",
    ],
    featureLabel: "Suggested Structure",
    featureTitle: "What the last-day email could prioritise.",
    features: [
      {
        label: "One Last Visit",
        title: "A final dining or experience recommendation",
        body: "A high-intent prompt aimed at converting visitors before they leave the destination.",
      },
      {
        label: "Take Ahangama Home",
        title: "Retail and keepsake partner placements",
        body: "A useful slot for stores, gifts and products that fit the end of a trip.",
      },
      {
        label: "Stay Connected",
        title: "Post-trip relationship building",
        body: "A closing module that keeps Ahangama.com present after departure through editorial and future-trip hooks.",
      },
    ],
    storiesLabel: "Dummy Modules",
    storiesTitle: "Example blocks in the departure email.",
    stories: [
      {
        title: "Last Night in Ahangama",
        body: "A final recommendation card for dinner, drinks or one memorable end-of-trip stop.",
        meta: "Conversion slot",
        image: kaffiImage,
      },
      {
        title: "A Few Things Worth Taking Home",
        body: "A retail-focused block showing how local product brands could be woven into the final email.",
        meta: "Retail placement",
        image: denitsaPortrait,
      },
    ],
  },
];

export default function Partners() {
  const canonical = absUrl("/partners");
  const [activeReachChannel, setActiveReachChannel] = useState(
    AUDIENCE_REACH_CHANNELS[0].label,
  );
  const [activeGuestTouchPoint, setActiveGuestTouchPoint] = useState(
    GUEST_TOUCH_POINTS[0].title,
  );
  const [activeEmailCampaignStage, setActiveEmailCampaignStage] = useState(
    EMAIL_CAMPAIGN_STAGES[0].label,
  );
  const selectedReachChannel =
    AUDIENCE_REACH_CHANNELS.find((item) => item.label === activeReachChannel) ??
    AUDIENCE_REACH_CHANNELS[0];
  const selectedGuestTouchPoint =
    GUEST_TOUCH_POINTS.find((item) => item.title === activeGuestTouchPoint) ??
    GUEST_TOUCH_POINTS[0];
  const selectedEmailCampaignStage =
    EMAIL_CAMPAIGN_STAGES.find(
      (item) => item.label === activeEmailCampaignStage,
    ) ?? EMAIL_CAMPAIGN_STAGES[0];
  const showAhangamaWebsitePreview =
    selectedReachChannel.label === "Ahangama.com";
  const showAhangamaPassPreview =
    selectedReachChannel.label === "Ahangama Pass";
  const showAhangamaMapPreview = selectedReachChannel.label === "Ahangama Map";
  const showAhangamaGuidePreview =
    selectedReachChannel.label === "Ahangama Guide 2026/27";
  const showVisitorEmailCampaignsPreview =
    selectedReachChannel.label === "Visitor Email Campaigns";
  const showConciergeRecommendationsPreview =
    selectedReachChannel.label === "Concierge Recommendations";

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Ahangama.com Platform"
        description="Ahangama.com is positioned as the customer acquisition and distribution platform for tourism businesses in Ahangama."
        canonical={canonical}
        ogImage={HERO_IMAGE}
      />

      <div
        className="dm-canvas"
        style={{
          marginTop: 0,
          paddingTop: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          background: "#ffffff",
        }}
      >
        <div className="dm-wrap">
          <div>
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
                        "linear-gradient(90deg, rgba(10,14,18,0.82) 0%, rgba(10,14,18,0.74) 20%, rgba(10,14,18,0.5) 38%, rgba(10,14,18,0.2) 56%, rgba(10,14,18,0.04) 74%, rgba(10,14,18,0) 100%)",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  />
                  <img
                    className="home-hero-image"
                    src={HERO_IMAGE}
                    alt="Ahangama coastline hero"
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
                    maxWidth: 1100,
                    margin: "0 auto",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      minHeight: "100svh",
                      maxWidth: 700,
                      padding:
                        "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 36px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 12,
                        marginBottom: 18,
                      }}
                    >
                      {[
                        "Ahangama.com",
                        "Customer Acquisition",
                        "Distribution Platform",
                      ].map((item) => (
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
                    </div>

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
                        Ahangama.com
                      </span>
                      <span
                        className="home-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        for Tourism
                      </span>
                      <span
                        className="home-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        Businesses
                      </span>
                    </Title>

                    <Text
                      style={{
                        display: "block",
                        marginTop: 14,
                        color: "#FFFFFF",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 1.6,
                        textTransform: "uppercase",
                      }}
                    >
                      Platform Overview
                    </Text>

                    <Paragraph
                      style={{
                        marginTop: 24,
                        marginBottom: 0,
                        maxWidth: 580,
                        color: "#FFFFFF",
                        fontSize: "clamp(16px, 1.45vw, 19px)",
                        lineHeight: 1.72,
                      }}
                    >
                      Ahangama.com is positioned as the customer acquisition and
                      distribution platform for tourism businesses in Ahangama,
                      connecting visitors with the town&apos;s most relevant
                      stays, experiences, food, retail and wellness brands
                      through a tiered commercial product.
                    </Paragraph>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dm-wrap" style={{ paddingTop: 40, paddingBottom: 72 }}>
          <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <div style={{ maxWidth: 820, marginBottom: 40 }}>
              <Text
                style={{
                  display: "block",
                  marginBottom: 10,
                  color: "#8A7B68",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.6,
                  textTransform: "uppercase",
                }}
              >
                Positioning
              </Text>
              <Title
                level={2}
                style={{
                  marginBottom: 16,
                  color: "#2F2A24",
                  fontFamily:
                    '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                  fontSize: "clamp(34px, 4vw, 52px)",
                  lineHeight: 1.02,
                }}
              >
                A commercial layer for discovering, promoting and distributing
                tourism products in Ahangama.
              </Title>
              <Paragraph
                style={{
                  marginBottom: 0,
                  color: "#55514B",
                  fontSize: 18,
                  lineHeight: 1.8,
                  maxWidth: 760,
                }}
              >
                This page reframes Ahangama.com as more than a guide. It is a
                platform model designed to help local tourism businesses earn
                attention, generate qualified traffic and convert that demand
                into direct commercial outcomes across different product tiers.
              </Paragraph>
            </div>

            <div style={{ marginBottom: 52 }}>
              <div style={{ textAlign: "left", marginBottom: 26 }}>
                <Text
                  style={{
                    display: "block",
                    marginBottom: 10,
                    color: "#8A7B68",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1.6,
                    textTransform: "uppercase",
                  }}
                >
                  Audience Reach
                </Text>
                <Paragraph
                  style={{
                    margin: 0,
                    color: "#55514B",
                    fontSize: 18,
                    lineHeight: 1.7,
                    maxWidth: 760,
                  }}
                >
                  We connect your business with visitors across multiple trusted
                  channels.
                </Paragraph>
              </div>

              <Row gutter={[24, 24]} align="top">
                <Col xs={24} lg={10}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: 18,
                    }}
                  >
                    {AUDIENCE_REACH_CHANNELS.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        item.label === selectedReachChannel.label;

                      return (
                        <div key={item.label}>
                          <button
                            type="button"
                            onClick={() => setActiveReachChannel(item.label)}
                            style={{
                              height: "100%",
                              textAlign: "left",
                              width: "100%",
                              padding: "18px 18px",
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              borderRadius: 18,
                              border: isActive
                                ? "1px solid rgba(86, 72, 57, 0.26)"
                                : "1px solid rgba(86, 72, 57, 0.1)",
                              background: "#FFFFFF",
                              boxShadow: isActive
                                ? "0 14px 32px rgba(47, 42, 36, 0.08)"
                                : "0 8px 18px rgba(47, 42, 36, 0.04)",
                              cursor: "pointer",
                            }}
                          >
                            <Icon
                              style={{
                                fontSize: 34,
                                color: "#61766A",
                                display: "block",
                                flex: "0 0 auto",
                              }}
                            />
                            <Text
                              style={{
                                color: "#2F2A24",
                                fontSize: 16,
                                lineHeight: 1.4,
                                fontWeight: 600,
                                display: "block",
                              }}
                            >
                              {item.label}
                            </Text>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </Col>

                <Col xs={24} lg={14}>
                  <Card
                    style={{
                      borderRadius: "20px",
                      background: "#FFFFFF",
                      border: "1px solid rgba(86, 72, 57, 0.12)",
                      boxShadow: "0 14px 36px rgba(47, 42, 36, 0.06)",
                    }}
                    bodyStyle={{ padding: "26px 24px" }}
                  >
                    {showAhangamaWebsitePreview ||
                    showAhangamaPassPreview ||
                    showAhangamaMapPreview ||
                    showAhangamaGuidePreview ||
                    showVisitorEmailCampaignsPreview ||
                    showConciergeRecommendationsPreview ? (
                      <div>
                        <Text
                          style={{
                            display: "block",
                            marginBottom: 10,
                            color: "#8A7B68",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 1.6,
                            textTransform: "uppercase",
                          }}
                        >
                          Selected Channel
                        </Text>
                        <Row gutter={[28, 28]} align="top">
                          <Col xs={24} md={10}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  width: "min(100%, 240px)",
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
                                    background: "#0f1713",
                                    aspectRatio: "9 / 19.5",
                                    width: "100%",
                                  }}
                                >
                                  {showAhangamaWebsitePreview ? (
                                    <>
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
                                          zIndex: 5,
                                        }}
                                      />
                                      <div
                                        style={{
                                          position: "relative",
                                          zIndex: 3,
                                          padding: "28px 16px 0",
                                          color: "#FFFFFF",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginTop: 10,
                                            marginBottom: 170,
                                          }}
                                        >
                                          <div
                                            style={{
                                              fontFamily:
                                                '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                                              fontSize: 19,
                                              lineHeight: 1,
                                              letterSpacing: 0.2,
                                              color: "#FFFFFF",
                                            }}
                                          >
                                            AHANGAMA
                                          </div>
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 16,
                                            }}
                                          >
                                            <HeartOutlined
                                              style={{
                                                color: "#FFFFFF",
                                                fontSize: 17,
                                              }}
                                            />
                                            <MenuOutlined
                                              style={{
                                                color: "#FFFFFF",
                                                fontSize: 20,
                                              }}
                                            />
                                          </div>
                                        </div>

                                        <div
                                          style={{
                                            display: "flex",
                                            gap: 16,
                                            marginBottom: 18,
                                            flexWrap: "wrap",
                                            color: "#FFFFFF",
                                            fontSize: 9,
                                            fontWeight: 700,
                                            letterSpacing: 1.4,
                                            textTransform: "uppercase",
                                          }}
                                        >
                                          <span>Week 24</span>
                                          <span>Updated Weekly</span>
                                        </div>

                                        <div
                                          style={{
                                            fontFamily:
                                              '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                                            fontSize: 34,
                                            lineHeight: 0.86,
                                            color: "#FFFFFF",
                                            marginBottom: 8,
                                          }}
                                        >
                                          <div>This Week In</div>
                                          <div>Ahangama</div>
                                        </div>

                                        <div
                                          style={{
                                            marginBottom: 20,
                                            color: "#FFFFFF",
                                            fontSize: 9,
                                            fontWeight: 700,
                                            letterSpacing: 1.4,
                                            textTransform: "uppercase",
                                          }}
                                        >
                                          From the Editor
                                        </div>

                                        <div
                                          style={{
                                            maxWidth: 200,
                                            color: "rgba(255,255,255,0.96)",
                                            fontSize: 10,
                                            lineHeight: 1.45,
                                            marginBottom: 18,
                                          }}
                                        >
                                          A curated guide to cafes, stays,
                                          wellness, surf, food and local
                                          experiences across Ahangama. Written
                                          and updated by a local team who live
                                          here.
                                        </div>

                                        <div
                                          style={{
                                            marginBottom: 12,
                                            color: "#FFFFFF",
                                            fontSize: 9,
                                            fontWeight: 700,
                                            letterSpacing: 1.4,
                                            textTransform: "uppercase",
                                          }}
                                        >
                                          Member Benefits
                                        </div>
                                        <div
                                          style={{
                                            color: "#FFFFFF",
                                            fontSize: 13,
                                            lineHeight: 1.3,
                                            fontWeight: 600,
                                          }}
                                        >
                                          Get the Ahangama Pass -&gt;
                                        </div>
                                      </div>
                                      <img
                                        src={HOME_PAGE_HERO_IMAGE}
                                        alt="Ahangama homepage hero preview"
                                        style={{
                                          position: "absolute",
                                          inset: 0,
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                          objectPosition: "right 72%",
                                        }}
                                      />
                                      <div
                                        style={{
                                          position: "absolute",
                                          inset: 0,
                                          background:
                                            "linear-gradient(180deg, rgba(11,16,13,0.26) 0%, rgba(11,16,13,0.22) 18%, rgba(11,16,13,0.48) 46%, rgba(11,16,13,0.72) 72%, rgba(11,16,13,0.9) 100%)",
                                        }}
                                      />
                                    </>
                                  ) : showAhangamaMapPreview ? (
                                    <div
                                      style={{
                                        position: "absolute",
                                        inset: 0,
                                        background: "#F2F0EA",
                                      }}
                                    >
                                      <div
                                        style={{
                                          position: "absolute",
                                          top: 18,
                                          left: 16,
                                          right: 16,
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          zIndex: 3,
                                        }}
                                      >
                                        <div
                                          style={{
                                            padding: "8px 10px",
                                            borderRadius: 999,
                                            background:
                                              "rgba(255,255,255,0.88)",
                                            color: "#2F2A24",
                                            fontSize: 10,
                                            fontWeight: 700,
                                            letterSpacing: 1.2,
                                            textTransform: "uppercase",
                                          }}
                                        >
                                          Ahangama Map
                                        </div>
                                      </div>

                                      <iframe
                                        title="Ahangama Google Map preview"
                                        src={AHANGAMA_GOOGLE_MAP_EMBED_URL}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        style={{
                                          position: "absolute",
                                          inset: "0 6px 6px 6px",
                                          width: "calc(100% - 12px)",
                                          height: "calc(100% - 6px)",
                                          border: 0,
                                          borderRadius: 22,
                                          background: "#FFFFFF",
                                          boxShadow:
                                            "0 16px 32px rgba(47, 42, 36, 0.12)",
                                        }}
                                      />
                                    </div>
                                  ) : showAhangamaGuidePreview ? (
                                    <div
                                      style={{
                                        position: "absolute",
                                        inset: 0,
                                        background: "#F6F1E8",
                                      }}
                                    >
                                      <iframe
                                        title="Ahangama Guide preview"
                                        src={AHANGAMA_GUIDE_PREVIEW_URL}
                                        loading="lazy"
                                        style={{
                                          position: "absolute",
                                          inset: "-1% -1.5%",
                                          width: "103%",
                                          height: "102%",
                                          border: 0,
                                          borderRadius: 28,
                                          background: "#FFFFFF",
                                          transform: "scale(1.01)",
                                          transformOrigin: "top center",
                                          boxShadow:
                                            "0 16px 32px rgba(47, 42, 36, 0.12)",
                                        }}
                                      />
                                    </div>
                                  ) : showConciergeRecommendationsPreview ? (
                                    <div
                                      style={{
                                        position: "absolute",
                                        inset: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: 8,
                                        background: "#E8F1EC",
                                      }}
                                    >
                                      <img
                                        src={whatsappConciergeImage}
                                        alt="Concierge WhatsApp preview"
                                        style={{
                                          display: "block",
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                          objectPosition: "top center",
                                          borderRadius: 22,
                                          background: "#FFFFFF",
                                        }}
                                      />
                                    </div>
                                  ) : showVisitorEmailCampaignsPreview ? (
                                    <div
                                      style={{
                                        position: "absolute",
                                        inset: 0,
                                        padding: 0,
                                        background: "#FFFFFF",
                                      }}
                                    >
                                      <div
                                        style={{
                                          height: "100%",
                                          borderRadius: 0,
                                          background: "#FFFFFF",
                                          overflow: "hidden",
                                          boxShadow: "none",
                                        }}
                                      >
                                        <div
                                          style={{
                                            padding: "12px 14px",
                                            background: "#FFFFFF",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 10,
                                          }}
                                        >
                                          <div
                                            style={{
                                              color: "#2F2A24",
                                              fontSize: 10,
                                              fontWeight: 700,
                                              letterSpacing: 1.2,
                                              textTransform: "uppercase",
                                            }}
                                          >
                                            The Ahangama Dispatch
                                          </div>
                                          <MailOutlined
                                            style={{
                                              color: "#61766A",
                                              fontSize: 14,
                                            }}
                                          />
                                        </div>

                                        <div
                                          style={{
                                            height: "calc(100% - 39px)",
                                            overflowY: "auto",
                                            padding: 14,
                                            display: "grid",
                                            gap: 18,
                                            scrollbarWidth: "none",
                                          }}
                                        >
                                          <div
                                            style={{
                                              display: "grid",
                                              gap: 8,
                                            }}
                                          >
                                            <div
                                              style={{
                                                fontSize: 9,
                                                fontWeight: 700,
                                                letterSpacing: 1.2,
                                                textTransform: "uppercase",
                                                color: "#8A7B68",
                                              }}
                                            >
                                              Editor&apos;s Letter
                                            </div>
                                            <div
                                              style={{
                                                color: "#207886",
                                                fontSize: 9,
                                                fontWeight: 700,
                                                letterSpacing: 1.2,
                                                textTransform: "uppercase",
                                              }}
                                            >
                                              {selectedEmailCampaignStage.kicker}
                                            </div>
                                            <div
                                              style={{
                                                color: "#2F2A24",
                                                fontFamily:
                                                  '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                                                fontSize: 22,
                                                lineHeight: 0.95,
                                              }}
                                            >
                                              {selectedEmailCampaignStage.title}
                                            </div>
                                            {[
                                              selectedEmailCampaignStage.eyebrow,
                                              ...selectedEmailCampaignStage.paragraphs,
                                            ].map((item) => (
                                              <div
                                                key={item}
                                                style={{
                                                  color: "#303030",
                                                  fontSize: 10,
                                                  lineHeight: 1.55,
                                                }}
                                              >
                                                {item}
                                              </div>
                                            ))}
                                          </div>

                                          <div
                                            style={{
                                              borderRadius: 18,
                                              overflow: "hidden",
                                              background: "#F3ECE1",
                                            }}
                                          >
                                            <div style={{ position: "relative" }}>
                                              <img
                                                src={denitsaPortrait}
                                                alt="Portrait from Ahangama"
                                                style={{
                                                  display: "block",
                                                  width: "100%",
                                                  aspectRatio: "4 / 5",
                                                  objectFit: "cover",
                                                  filter: "grayscale(100%)",
                                                }}
                                              />
                                              <div
                                                style={{
                                                  position: "absolute",
                                                  inset: 0,
                                                  background:
                                                    "linear-gradient(180deg, rgba(24, 23, 20, 0.04) 0%, rgba(24, 23, 20, 0.52) 100%)",
                                                }}
                                              />
                                              <div
                                                style={{
                                                  position: "absolute",
                                                  left: 12,
                                                  right: 12,
                                                  bottom: 12,
                                                  color: "#FFFFFF",
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    letterSpacing: 0.2,
                                                  }}
                                                >
                                                  Portrait from Ahangama
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div style={{ display: "grid", gap: 10 }}>
                                            <div
                                              style={{
                                                color: "#8A7B68",
                                                fontSize: 9,
                                                fontWeight: 700,
                                                letterSpacing: 1.2,
                                                textTransform: "uppercase",
                                              }}
                                            >
                                              {selectedEmailCampaignStage.featureLabel}
                                            </div>
                                            <div
                                              style={{
                                                color: "#2F2A24",
                                                fontFamily:
                                                  '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                                                fontSize: 20,
                                                lineHeight: 0.98,
                                              }}
                                            >
                                              {selectedEmailCampaignStage.featureTitle}
                                            </div>
                                            {selectedEmailCampaignStage.features.map((item) => (
                                              <div
                                                key={item.label}
                                                style={{
                                                  display: "grid",
                                                  gap: 4,
                                                  paddingBottom: 10,
                                                  borderBottom:
                                                    "1px solid rgba(86, 72, 57, 0.12)",
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    color: "#207886",
                                                    fontSize: 9,
                                                    fontWeight: 700,
                                                    letterSpacing: 1.1,
                                                    textTransform: "uppercase",
                                                  }}
                                                >
                                                  {item.label}
                                                </div>
                                                <div
                                                  style={{
                                                    color: "#2F2A24",
                                                    fontFamily:
                                                      '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                                                    fontSize: 16,
                                                    lineHeight: 1,
                                                  }}
                                                >
                                                  {item.title}
                                                </div>
                                                <div
                                                  style={{
                                                    color: "#3E3E3E",
                                                    fontSize: 10,
                                                    lineHeight: 1.5,
                                                  }}
                                                >
                                                  {item.body}
                                                </div>
                                              </div>
                                            ))}
                                          </div>

                                          <div style={{ display: "grid", gap: 10 }}>
                                            <div
                                              style={{
                                                color: "#8A7B68",
                                                fontSize: 9,
                                                fontWeight: 700,
                                                letterSpacing: 1.2,
                                                textTransform: "uppercase",
                                              }}
                                            >
                                              {selectedEmailCampaignStage.storiesLabel}
                                            </div>
                                            <div
                                              style={{
                                                color: "#2F2A24",
                                                fontFamily:
                                                  '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                                                fontSize: 20,
                                                lineHeight: 0.98,
                                              }}
                                            >
                                              {selectedEmailCampaignStage.storiesTitle}
                                            </div>
                                            {selectedEmailCampaignStage.stories.map((item) => (
                                              <div
                                                key={item.title}
                                                style={{
                                                  display: "grid",
                                                  gap: 4,
                                                  padding: "0 0 10px",
                                                  borderBottom:
                                                    "1px solid rgba(86, 72, 57, 0.12)",
                                                }}
                                              >
                                                <img
                                                  src={item.image}
                                                  alt={item.title}
                                                  style={{
                                                    display: "block",
                                                    width: "100%",
                                                    aspectRatio: "16 / 9",
                                                    objectFit: "cover",
                                                    borderRadius: 12,
                                                    marginBottom: 8,
                                                  }}
                                                />
                                                <div
                                                  style={{
                                                    color: "#2F2A24",
                                                    fontFamily:
                                                      '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                                                    fontSize: 16,
                                                    lineHeight: 1,
                                                  }}
                                                >
                                                  {item.title}
                                                </div>
                                                <div
                                                  style={{
                                                    color: "#3E3E3E",
                                                    fontSize: 10,
                                                    lineHeight: 1.5,
                                                  }}
                                                >
                                                  {item.body}
                                                </div>
                                                <div
                                                  style={{
                                                    color: "#6B655E",
                                                    fontSize: 9,
                                                    fontWeight: 600,
                                                  }}
                                                >
                                                  {item.meta}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
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
                                  )}
                                </div>
                              </div>
                            </div>
                          </Col>

                          <Col xs={24} md={14}>
                            <Paragraph
                              style={{
                                marginBottom: 18,
                                color: "#55514B",
                                fontSize: 17,
                                lineHeight: 1.75,
                                maxWidth: 760,
                              }}
                            >
                              {selectedReachChannel.description}
                            </Paragraph>
                            <div style={{ maxWidth: 760 }}>
                              {selectedReachChannel.reach.map((point) => (
                                <div
                                  key={point}
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 10,
                                    marginBottom: 10,
                                  }}
                                >
                                  <CheckCircleOutlined
                                    style={{
                                      color: "#6A8A71",
                                      fontSize: 16,
                                      marginTop: 3,
                                    }}
                                  />
                                  <div style={{ display: "grid", gap: 12 }}>
                                    <Text
                                      style={{
                                        color: "#2F2A24",
                                        fontSize: 15,
                                        lineHeight: 1.6,
                                      }}
                                    >
                                      {point}
                                    </Text>
                                    {showAhangamaMapPreview &&
                                    point ===
                                      "Strong visibility across mobile devices" ? (
                                      <div style={{ display: "grid", gap: 12 }}>
                                        <a
                                          href={AHANGAMA_GOOGLE_MAP_URL}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            justifySelf: "start",
                                            padding: "12px 18px",
                                            borderRadius: 999,
                                            background: "#2F2A24",
                                            color: "#FFFFFF",
                                            fontSize: 14,
                                            fontWeight: 600,
                                            lineHeight: 1,
                                            textDecoration: "none",
                                            boxShadow:
                                              "0 14px 30px rgba(47, 42, 36, 0.14)",
                                          }}
                                        >
                                          Open in Google Maps
                                        </a>
                                        <div
                                          style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 10,
                                          }}
                                        >
                                          {[
                                            "Best Cafes",
                                            "Best Hotels",
                                            "Best of Wellness",
                                          ].map((item) => (
                                            <a
                                              key={item}
                                              href={AHANGAMA_GOOGLE_MAP_URL}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                padding: "10px 16px",
                                                borderRadius: 999,
                                                border:
                                                  "1px solid rgba(86, 72, 57, 0.14)",
                                                background: "#FBF8F2",
                                                color: "#2F2A24",
                                                fontSize: 13,
                                                fontWeight: 600,
                                                lineHeight: 1,
                                                cursor: "pointer",
                                                textDecoration: "none",
                                                boxShadow:
                                                  "0 8px 18px rgba(47, 42, 36, 0.05)",
                                              }}
                                            >
                                              {item}
                                            </a>
                                          ))}
                                        </div>
                                      </div>
                                    ) : showAhangamaGuidePreview &&
                                      point ===
                                        "Premium publication designed to be kept, not discarded" ? (
                                      <a
                                        href={AHANGAMA_GUIDE_PREVIEW_URL}
                                        style={{
                                          display: "inline-flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          justifySelf: "start",
                                          padding: "12px 18px",
                                          borderRadius: 999,
                                          background: "#2F2A24",
                                          color: "#FFFFFF",
                                          fontSize: 14,
                                          fontWeight: 600,
                                          lineHeight: 1,
                                          textDecoration: "none",
                                          boxShadow:
                                            "0 14px 30px rgba(47, 42, 36, 0.14)",
                                        }}
                                      >
                                        View Guide
                                      </a>
                                    ) : showVisitorEmailCampaignsPreview &&
                                      point ===
                                        "Dedicated partner features and recommendations" ? (
                                      <div
                                        style={{
                                          display: "flex",
                                          flexWrap: "wrap",
                                          gap: 10,
                                        }}
                                      >
                                        {[
                                          "Newsletter on sign up",
                                          "Day 1 Newsletter",
                                          "Day 2 Newsletter",
                                          "Last Day Newsletter",
                                        ].map((item) => (
                                          <button
                                            key={item}
                                            type="button"
                                            onClick={() =>
                                              setActiveEmailCampaignStage(item)
                                            }
                                            style={{
                                              display: "inline-flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              padding: "10px 16px",
                                              borderRadius: 999,
                                              border:
                                                item === activeEmailCampaignStage
                                                  ? "1px solid rgba(47, 42, 36, 0.28)"
                                                  : "1px solid rgba(86, 72, 57, 0.14)",
                                              background:
                                                item === activeEmailCampaignStage
                                                  ? "#2F2A24"
                                                  : "#FBF8F2",
                                              color:
                                                item === activeEmailCampaignStage
                                                  ? "#FFFFFF"
                                                  : "#2F2A24",
                                              fontSize: 13,
                                              fontWeight: 600,
                                              lineHeight: 1.2,
                                              cursor: "pointer",
                                              boxShadow:
                                                "0 8px 18px rgba(47, 42, 36, 0.05)",
                                            }}
                                          >
                                            {item}
                                          </button>
                                        ))}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    ) : (
                      <div>
                        <Text
                          style={{
                            display: "block",
                            marginBottom: 10,
                            color: "#8A7B68",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 1.6,
                            textTransform: "uppercase",
                          }}
                        >
                          Selected Channel
                        </Text>
                        <Title
                          level={3}
                          style={{
                            marginBottom: 12,
                            color: "#2F2A24",
                            fontFamily:
                              '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                            fontSize: "clamp(28px, 3vw, 36px)",
                            lineHeight: 1.05,
                          }}
                        >
                          {selectedReachChannel.label}
                        </Title>
                        <Paragraph
                          style={{
                            marginBottom: 18,
                            color: "#55514B",
                            fontSize: 17,
                            lineHeight: 1.75,
                            maxWidth: 760,
                          }}
                        >
                          {selectedReachChannel.description}
                        </Paragraph>
                        <div style={{ maxWidth: 760 }}>
                          {selectedReachChannel.reach.map((point) => (
                            <div
                              key={point}
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 10,
                                marginBottom: 10,
                              }}
                            >
                              <CheckCircleOutlined
                                style={{
                                  color: "#6A8A71",
                                  fontSize: 16,
                                  marginTop: 3,
                                }}
                              />
                              <div style={{ display: "grid", gap: 12 }}>
                                <Text
                                  style={{
                                    color: "#2F2A24",
                                    fontSize: 15,
                                    lineHeight: 1.6,
                                  }}
                                >
                                  {point}
                                </Text>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </Col>
              </Row>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ marginBottom: 52 }}>
                <div style={{ textAlign: "left", marginBottom: 26 }}>
                  <Text
                    style={{
                      display: "block",
                      marginBottom: 10,
                      color: "#8A7B68",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1.6,
                      textTransform: "uppercase",
                    }}
                  >
                    Guest Touch Points
                  </Text>
                  <Paragraph
                    style={{
                      margin: 0,
                      color: "#55514B",
                      fontSize: 18,
                      lineHeight: 1.7,
                      maxWidth: 860,
                    }}
                  >
                    Physical placements across Ahangama that put the Pass,
                    map, guide and partner messaging directly in front of
                    visitors while they move through the destination.
                  </Paragraph>
                </div>

                <Row gutter={[24, 24]} align="top">
                  <Col xs={24} lg={10}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: 18,
                      }}
                    >
                      {GUEST_TOUCH_POINTS.map((item) => {
                        const isActive = item.title === selectedGuestTouchPoint.title;

                        return (
                          <div key={item.title}>
                            <button
                              type="button"
                              onClick={() => setActiveGuestTouchPoint(item.title)}
                              style={{
                                height: "100%",
                                textAlign: "left",
                                width: "100%",
                                padding: "18px 18px",
                                display: "grid",
                                gap: 6,
                                borderRadius: 18,
                                border: isActive
                                  ? "1px solid rgba(86, 72, 57, 0.26)"
                                  : "1px solid rgba(86, 72, 57, 0.1)",
                                background: "#FFFFFF",
                                boxShadow: isActive
                                  ? "0 14px 32px rgba(47, 42, 36, 0.08)"
                                  : "0 8px 18px rgba(47, 42, 36, 0.04)",
                                cursor: "pointer",
                              }}
                            >
                              <Text
                                style={{
                                  color: "#2F2A24",
                                  fontSize: 16,
                                  lineHeight: 1.4,
                                  fontWeight: 600,
                                  display: "block",
                                }}
                              >
                                {item.title}
                              </Text>
                              <Text
                                style={{
                                  color: "#8A7B68",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  letterSpacing: 1.2,
                                  textTransform: "uppercase",
                                  display: "block",
                                }}
                              >
                                {item.subtitle}
                              </Text>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </Col>

                  <Col xs={24} lg={14}>
                    <Card
                      style={{
                        borderRadius: "20px",
                        background: "#FFFFFF",
                        border: "1px solid rgba(86, 72, 57, 0.12)",
                        boxShadow: "0 14px 36px rgba(47, 42, 36, 0.06)",
                      }}
                      bodyStyle={{ padding: "26px 24px" }}
                    >
                      <Text
                        style={{
                          display: "block",
                          marginBottom: 10,
                          color: "#8A7B68",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 1.6,
                          textTransform: "uppercase",
                        }}
                      >
                        Selected Touch Point
                      </Text>
                      <Row gutter={[24, 24]} align="top">
                        {selectedGuestTouchPoint.image ? (
                          <Col xs={24} md={10}>
                            <img
                              src={selectedGuestTouchPoint.image}
                              alt={selectedGuestTouchPoint.title}
                              style={{
                                display: "block",
                                width: "100%",
                                aspectRatio: "4 / 5",
                                objectFit: "cover",
                                borderRadius: 16,
                              }}
                            />
                          </Col>
                        ) : null}
                        <Col xs={24} md={selectedGuestTouchPoint.image ? 14 : 24}>
                          <Title
                            level={3}
                            style={{
                              marginBottom: 8,
                              color: "#2F2A24",
                              fontFamily:
                                '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                              fontSize: "clamp(28px, 3vw, 36px)",
                              lineHeight: 1.02,
                            }}
                          >
                            {selectedGuestTouchPoint.title}
                          </Title>
                          <Text
                            style={{
                              display: "block",
                              marginBottom: 16,
                              color: "#8A7B68",
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: 1.3,
                              textTransform: "uppercase",
                            }}
                          >
                            {selectedGuestTouchPoint.subtitle}
                          </Text>
                          <Paragraph
                            style={{
                              marginBottom: 18,
                              color: "#55514B",
                              fontSize: 17,
                              lineHeight: 1.75,
                              maxWidth: 760,
                            }}
                          >
                            {selectedGuestTouchPoint.description}
                          </Paragraph>
                          <div style={{ maxWidth: 760 }}>
                            {selectedGuestTouchPoint.points.map((point) => (
                              <div
                                key={point}
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 10,
                                  marginBottom: 10,
                                }}
                              >
                                <CheckCircleOutlined
                                  style={{
                                    color: "#6A8A71",
                                    fontSize: 16,
                                    marginTop: 3,
                                  }}
                                />
                                <Text
                                  style={{
                                    color: "#2F2A24",
                                    fontSize: 15,
                                    lineHeight: 1.6,
                                  }}
                                >
                                  {point}
                                </Text>
                              </div>
                            ))}
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              </div>

              <Text
                style={{
                  display: "block",
                  marginBottom: 10,
                  color: "#8A7B68",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.6,
                  textTransform: "uppercase",
                }}
              >
                Partnership Options
              </Text>
            </div>

            <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
              {PRODUCT_TIERS.map((tier) => (
                <Col xs={24} md={12} xl={6} key={tier.name}>
                  <Card
                    style={{
                      height: "100%",
                      borderRadius: "24px",
                      background: "#F7F1E8",
                      border: "1px solid rgba(86, 72, 57, 0.12)",
                      boxShadow: "0 18px 42px rgba(47, 42, 36, 0.08)",
                    }}
                    bodyStyle={{ padding: "28px 24px" }}
                  >
                    <Text
                      style={{
                        display: "block",
                        marginBottom: 12,
                        color: "#8A7B68",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                      }}
                    >
                      Product Tier
                    </Text>
                    <Title
                      level={3}
                      style={{
                        marginBottom: 10,
                        color: "#2F2A24",
                        fontFamily:
                          '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                        fontSize: 26,
                        lineHeight: 1,
                      }}
                    >
                      {tier.name}
                    </Title>
                    <div style={{ marginBottom: 14 }}>
                      <Text
                        style={{
                          color: "#234731",
                          fontSize: 18,
                          fontWeight: 700,
                        }}
                      >
                        {tier.price}
                      </Text>
                      {tier.billing ? (
                        <Text
                          style={{
                            color: "#55514B",
                            fontSize: 14,
                            marginLeft: 4,
                          }}
                        >
                          {tier.billing}
                        </Text>
                      ) : null}
                    </div>
                    <Paragraph
                      style={{
                        color: "#55514B",
                        fontSize: 15,
                        lineHeight: 1.7,
                        marginBottom: 16,
                      }}
                    >
                      {tier.summary}
                    </Paragraph>
                    <Paragraph
                      style={{
                        color: "#2F2A24",
                        fontSize: 15,
                        lineHeight: 1.65,
                        marginBottom: 16,
                        fontWeight: 600,
                      }}
                    >
                      {tier.intro}
                    </Paragraph>
                    {tier.points.map((point) => (
                      <div
                        key={point}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          marginBottom: 10,
                        }}
                      >
                        <CheckCircleOutlined
                          style={{
                            color: "#6A8A71",
                            fontSize: 16,
                            marginTop: 3,
                          }}
                        />
                        <Text
                          style={{
                            color: "#2F2A24",
                            fontSize: 15,
                            lineHeight: 1.55,
                          }}
                        >
                          {point}
                        </Text>
                      </div>
                    ))}
                  </Card>
                </Col>
              ))}
            </Row>

            <div style={{ marginBottom: 52 }}>
              <div style={{ textAlign: "center", marginBottom: 26 }}>
                <Text
                  style={{
                    display: "block",
                    marginBottom: 10,
                    color: "#8A7B68",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1.6,
                    textTransform: "uppercase",
                  }}
                >
                  Additional Promotional Products
                </Text>
              </div>

              <Row gutter={[18, 18]}>
                {PROMOTIONAL_PRODUCTS.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Col xs={24} sm={12} md={8} xl={24 / 7} key={item.name}>
                      <Card
                        style={{
                          height: "100%",
                          borderRadius: "20px",
                          background: "#FBF8F2",
                          border: "1px solid rgba(86, 72, 57, 0.1)",
                          boxShadow: "0 12px 30px rgba(47, 42, 36, 0.05)",
                        }}
                        bodyStyle={{
                          padding: "24px 18px",
                          textAlign: "center",
                        }}
                      >
                        <Icon
                          style={{
                            fontSize: 30,
                            color: "#61766A",
                            marginBottom: 14,
                          }}
                        />
                        <Title
                          level={4}
                          style={{
                            marginBottom: 12,
                            color: "#2F2A24",
                            fontSize: 18,
                            lineHeight: 1.2,
                          }}
                        >
                          {item.name}
                        </Title>
                        <Text
                          style={{
                            color: "#234731",
                            fontSize: 18,
                            fontWeight: 700,
                          }}
                        >
                          {item.price}
                        </Text>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(86, 72, 57, 0.12)",
                paddingTop: 28,
                maxWidth: 920,
              }}
            >
              <Text
                style={{
                  display: "block",
                  marginBottom: 14,
                  color: "#8A7B68",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.6,
                  textTransform: "uppercase",
                }}
              >
                Best Fit
              </Text>
              <Title
                level={3}
                style={{
                  marginBottom: 18,
                  color: "#2F2A24",
                  fontFamily:
                    '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                  fontSize: "clamp(28px, 3vw, 40px)",
                  lineHeight: 1.05,
                }}
              >
                Built for the businesses shaping the Ahangama destination.
              </Title>
              <Row gutter={[16, 16]}>
                {PLATFORM_AREAS.map((item) => (
                  <Col xs={24} sm={12} key={item}>
                    <Card
                      style={{
                        borderRadius: "20px",
                        background: "#FFFFFF",
                        border: "1px solid rgba(86, 72, 57, 0.12)",
                        boxShadow: "0 12px 30px rgba(47, 42, 36, 0.05)",
                      }}
                      bodyStyle={{ padding: "18px 20px" }}
                    >
                      <Text
                        style={{
                          color: "#2F2A24",
                          fontSize: 16,
                          lineHeight: 1.5,
                        }}
                      >
                        {item}
                      </Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
