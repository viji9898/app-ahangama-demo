import React, { useMemo, useState } from "react";
import { Button, Card, Col, Modal, Row, Space, Tag, Typography } from "antd";
import {
  ArrowRightOutlined,
  EnvironmentOutlined,
  InstagramOutlined,
  MailOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { usePlaces } from "../../app/placesContext";
import { shouldShowPlace } from "../../data/placeStatus";

const { Paragraph, Text, Title } = Typography;

const TAG_SLUG = "12-things-to-do";
const MAX_ITEMS = 12;

const CATEGORY_BASE_PATHS = {
  eat: "/eat",
  stays: "/stays",
  wellness: "/wellness",
  retail: "/retail",
  "shops-essentials": "/retail",
};

const CURATED_ORDER = [
  "pura",
  "gik-bike-rentals",
  "coconut-c",
  "frostys-recovery-centre-hangout",
  "kumbuk-community",
  "spa-station-midigama",
  "sarana-ahangama",
  "palm-and-paint",
  "living-r-c-s",
  "yiva-essentials",
  "hakuna-matata-ahangama",
  "qamar-by-zan",
  "global-surf-lodge",
  "gusta",
];

const EXPERIENCE_CONTENT = {
  pura: {
    title: "Reformer & Mat Pilates Experience",
    summary:
      "Recharge your body with premium reformer and mat pilates sessions in a calming studio designed for strength, flexibility, posture, and mindful movement.",
    passOffer: "Usually $26, unlock for $23 with the Ahangama Pass.",
    perk: "Includes 2 complimentary postcards.",
  },
  "gik-bike-rentals": {
    title: "Self-Drive Tuk Tuk Adventure",
    summary:
      "Explore beaches, cafes, village roads, and hidden local spots at your own pace with a self-drive tuk-tuk experience built for discovery.",
    passOffer: "Usually $10, unlock for $7 with the Ahangama Pass.",
    perk: "Includes the Ahangama Collectibles Trail with tea tins, postcards, and sticker cards.",
  },
  "coconut-c": {
    title: "Pickleball Experience",
    summary:
      "A social, easy-going pickleball session designed for fun, movement, and connection in a tropical Ahangama setting.",
    passOffer: "Usually $22, unlock for $16 with the Ahangama Pass.",
    perk: "Includes a complimentary tea tin and Ahangama sticker card.",
  },
  "frostys-recovery-centre-hangout": {
    title: "Sauna & Ice Bath Experience",
    summary:
      "A contrast therapy session combining heat and ice immersion to support recovery, reset the body, and clear the mind.",
    passOffer: "Usually $12, unlock for $10 with the Ahangama Pass.",
    perk: "Wellness-focused savings for a stronger post-surf reset.",
  },
  "kumbuk-community": {
    title: "Traditional Cooking Experience with Amma",
    summary:
      "Step into a village-style clay kitchen to prepare curries, roti, and desserts while connecting with Sri Lankan food traditions, farming, and storytelling.",
    passOffer: "Usually $35, unlock for $31 with the Ahangama Pass.",
    perk: "Includes a masala chai tin and tote bag.",
  },
  "spa-station-midigama": {
    title: "Massage & Spa Treatment",
    summary:
      "A peaceful jungle-surrounded recovery stop for post-surf relaxation, deep reset, and cooling down from the south coast heat.",
    passOffer: "Usually $22, unlock for $18 with the Ahangama Pass.",
    perk: "Includes postcards and an aromatherapy enhancement.",
  },
  "sarana-ahangama": {
    title: "River Journey with Sanjeewa",
    summary:
      "Cruise the Polwatta River through mangroves, birdlife, calm backwaters, and sunset light in a handcrafted boat safari.",
    passOffer: "Usually $16, unlock for $12 with the Ahangama Pass.",
    perk: "A slow curated nature experience with premium pass savings.",
  },
  "palm-and-paint": {
    title: "Creative Painting Experience",
    summary:
      "Choose a tote bag or starfish jewelry dish and turn a laid-back art session into a personalized keepsake from Ahangama.",
    passOffer: "Usually $10, unlock for $8 with the Ahangama Pass.",
    perk: "All materials included for an easy creative session.",
  },
  "living-r-c-s": {
    title: "Co-working & Concept Store Experience",
    summary:
      "Work, browse, connect, and slow down in a beautifully designed lifestyle space that blends productivity with Ahangama's coastal creative culture.",
    passOffer:
      "Enjoy 10% savings on selected purchases with the Ahangama Pass.",
    perk: "Includes 2 postcards and a complimentary tea tin.",
  },
  "yiva-essentials": {
    title: "Shopping Experience",
    summary:
      "Explore a curated concept store of coastal-inspired lifestyle pieces, design objects, and essentials shaped by Ahangama's creative spirit.",
    passOffer:
      "Enjoy 10% savings on selected purchases with the Ahangama Pass.",
    perk: "Includes 2 postcards, a tea tin, and an extra gift on purchases above LKR 15,000.",
  },
  "hakuna-matata-ahangama": {
    title: "Beach Party & Sunset Experience",
    summary:
      "Golden sunsets, music, cocktails, and oceanfront energy come together in one of Ahangama's most social coastal evening settings.",
    passOffer:
      "Enjoy 10% savings on selected purchases with the Ahangama Pass.",
    perk: "Includes 2 cultural postcards and a tropical tea tin.",
  },
  "qamar-by-zan": {
    title: "Design Your Own Jewellery Experience",
    summary:
      "Create a personalized jewelry piece in a guided studio session that turns coastal inspiration into something you can wear home.",
    passOffer:
      "Unlock up to 70% savings on the personalized jewelry experience.",
    perk: "A keepsake-led creative session with strong pass value.",
  },
  "global-surf-lodge": {
    title: "Surf Camp Experience",
    summary:
      "A relaxed Kabalana surf camp with daily group sessions, coaching, board access, and a welcoming route into Sri Lanka's surf lifestyle.",
    passOffer:
      "Enjoy 10% savings on daily surf packages with the Ahangama Pass.",
    perk: "Includes 2 postcards with your experience.",
  },
  gusta: {
    title: "Speciality Grocery Experience",
    summary:
      "Browse premium pantry goods, artisanal finds, and locally inspired essentials in a beautifully designed retail space in central Ahangama.",
    passOffer:
      "Enjoy 5-10% savings on selected specialty grocery items with the Ahangama Pass.",
    perk: "Includes 2 postcards with your purchase.",
  },
};

function normalizeTag(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hasTwelveThingsTag(place) {
  return (place.bestFor || []).some(
    (entry) => normalizeTag(entry) === TAG_SLUG,
  );
}

function getSortScore(place) {
  return (
    (place.isFeatured ? 1000 : 0) +
    (place.staffPick ? 100 : 0) +
    (place.priorityScore || 0) +
    (place.passPriority || 0)
  );
}

function getDetailHref(place) {
  const normalizedCategory = String(place.category || "")
    .trim()
    .toLowerCase();
  const basePath = CATEGORY_BASE_PATHS[normalizedCategory];

  if (basePath && place.slug) {
    return `${basePath}/${place.slug}`;
  }

  return null;
}

function getVisibleTags(place) {
  return (place.bestFor || []).filter(
    (entry) => normalizeTag(entry) !== TAG_SLUG,
  );
}

function getCuratedIndex(place) {
  const index = CURATED_ORDER.indexOf(place.slug);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function formatStepNumber(index) {
  return String(index + 1).padStart(2, "0");
}

function getCardLayout(index) {
  if (index === 0) {
    return {
      imageHeight: 420,
      summaryClamp: 4,
      featured: true,
      overlapBody: false,
    };
  }

  if (index >= 1 && index <= 4) {
    return {
      imageHeight: 280,
      summaryClamp: 4,
      featured: false,
      overlapBody: true,
    };
  }

  return {
    imageHeight: 230,
    summaryClamp: 3,
    featured: false,
    overlapBody: false,
  };
}

const EDITORIAL_ROWS = [
  [{ index: 0, col: { xs: 24, xl: 24 } }],
  [
    { index: 1, col: { xs: 24, md: 14, xl: 14 } },
    { index: 2, col: { xs: 24, md: 10, xl: 10 } },
  ],
  [
    { index: 3, col: { xs: 24, md: 10, xl: 10 } },
    { index: 4, col: { xs: 24, md: 14, xl: 14 } },
  ],
  [
    { index: 5, col: { xs: 24, md: 8, xl: 8 } },
    { index: 6, col: { xs: 24, md: 8, xl: 8 } },
    { index: 7, col: { xs: 24, md: 8, xl: 8 } },
  ],
  [
    { index: 8, col: { xs: 24, md: 12, xl: 12 } },
    { index: 9, col: { xs: 24, md: 12, xl: 12 } },
  ],
  [
    { index: 10, col: { xs: 24, md: 12, xl: 12 } },
    { index: 11, col: { xs: 24, md: 12, xl: 12 } },
  ],
];

export default function TwelveThingsSection() {
  const { places: allPlaces } = usePlaces();
  const [selectedPlace, setSelectedPlace] = useState(null);

  const places = useMemo(() => {
    return allPlaces
      .filter((place) => place.destinationSlug === "ahangama")
      .filter((place) => shouldShowPlace(place))
      .filter(hasTwelveThingsTag)
      .sort((left, right) => {
        const curatedIndexDiff = getCuratedIndex(left) - getCuratedIndex(right);
        if (curatedIndexDiff !== 0) return curatedIndexDiff;

        const scoreDiff = getSortScore(right) - getSortScore(left);
        if (scoreDiff !== 0) return scoreDiff;
        return String(left.name || "").localeCompare(String(right.name || ""));
      })
      .slice(0, MAX_ITEMS);
  }, [allPlaces]);

  if (!places.length) return null;

  const selectedContent = selectedPlace
    ? EXPERIENCE_CONTENT[selectedPlace.slug]
    : null;
  const selectedSummary = selectedPlace
    ? selectedContent?.summary ||
      selectedPlace.description ||
      selectedPlace.excerpt ||
      "Part of the curated 12-things-to-do shortlist in Ahangama."
    : "";
  const selectedDetailHref = selectedPlace
    ? getDetailHref(selectedPlace)
    : null;
  const selectedTags = selectedPlace ? getVisibleTags(selectedPlace) : [];
  const selectedImage = selectedPlace?.image || selectedPlace?.logo;

  const placeByIndex = places.map((place, index) => ({
    place,
    index,
    layout: getCardLayout(index),
  }));

  function renderPlaceCard(place, index, colConfig) {
    const visibleTags = getVisibleTags(place).slice(0, 3);
    const image = place.image || place.logo;
    const curatedContent = EXPERIENCE_CONTENT[place.slug];
    const stepNumber = formatStepNumber(index);
    const layout = getCardLayout(index);
    const summary =
      curatedContent?.summary ||
      place.excerpt ||
      place.description ||
      "Part of the curated 12-things-to-do shortlist in Ahangama.";

    return (
      <Col
        xs={colConfig.xs}
        md={colConfig.md}
        xl={colConfig.xl}
        key={place.id || place.slug || place.name}
      >
        <Card
          hoverable
          onClick={() => setSelectedPlace(place)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setSelectedPlace(place);
            }
          }}
          role="button"
          tabIndex={0}
          style={{
            height: "100%",
            borderRadius: 24,
            border: "1px solid rgba(47,62,58,0.08)",
            background: "linear-gradient(180deg, #fffdf9 0%, #f7f0e7 100%)",
            overflow: "hidden",
            boxShadow: "0 18px 40px rgba(47,62,58,0.08)",
          }}
          bodyStyle={{
            padding: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              position: "relative",
              height: layout.imageHeight,
              background: image
                ? `linear-gradient(180deg, rgba(18,25,24,0.02) 0%, rgba(18,25,24,0.72) 100%), url(${image}) center/cover no-repeat`
                : "linear-gradient(135deg, #E7DED2 0%, #CFC0AE 100%)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                width: 56,
                height: 56,
                borderRadius: 18,
                background: "rgba(255,248,239,0.92)",
                color: "#2F3E3A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 1,
                boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
              }}
            >
              {stepNumber}
            </div>

            <div
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                borderRadius: 999,
                padding: "6px 10px",
                background: "rgba(18,25,24,0.58)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              <Text
                style={{
                  color: "#F8F1E7",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                  fontWeight: 700,
                }}
              >
                Must-do experience
              </Text>
            </div>

            <div
              style={{
                position: "absolute",
                left: 18,
                right: 18,
                bottom: 18,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <Text
                style={{
                  color: "rgba(248,241,231,0.82)",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                }}
              >
                {place.category || "Ahangama"}
              </Text>
              <Title
                level={3}
                style={{
                  color: "#fffaf3",
                  margin: 0,
                  maxWidth: layout.featured ? "72%" : "85%",
                  fontSize: layout.featured ? 34 : undefined,
                  lineHeight: layout.featured ? 1.05 : undefined,
                }}
              >
                {place.name}
              </Title>
              {curatedContent?.title ? (
                <Text
                  style={{
                    color: "rgba(255,250,243,0.88)",
                    fontSize: layout.featured ? 17 : 15,
                    maxWidth: layout.featured ? "76%" : "100%",
                  }}
                >
                  {curatedContent.title}
                </Text>
              ) : null}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              flex: 1,
              padding: 18,
              marginTop: layout.overlapBody ? -34 : 0,
              marginInline: layout.overlapBody ? 14 : 0,
              marginBottom: 14,
              borderRadius: layout.overlapBody ? 22 : 0,
              background: layout.overlapBody
                ? "linear-gradient(180deg, rgba(255,253,249,0.98) 0%, rgba(247,240,231,0.98) 100%)"
                : "transparent",
              boxShadow: layout.overlapBody
                ? "0 16px 34px rgba(47,62,58,0.10)"
                : "none",
              position: "relative",
              zIndex: layout.overlapBody ? 2 : 1,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <Text
                style={{
                  color: "#8A7E6D",
                  fontSize: 12,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Step {stepNumber}
              </Text>
              <Text style={{ color: "#7A746B", fontSize: 12 }}>
                Open quick view
              </Text>
            </div>

            {(typeof place.stars === "number" ||
              typeof place.reviews === "number") && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {typeof place.stars === "number" ? (
                  <>
                    <span style={{ color: "#FFD700", fontSize: 15 }}>★</span>
                    <Text style={{ color: "#2F3E3A", fontWeight: 600 }}>
                      {place.stars.toFixed(1)}
                    </Text>
                  </>
                ) : null}
                {typeof place.reviews === "number" ? (
                  <Text style={{ color: "#7A746B" }}>
                    ({place.reviews.toLocaleString()} reviews)
                  </Text>
                ) : null}
              </div>
            )}

            <Paragraph
              style={{
                color: "#5B564E",
                margin: 0,
                flex: 1,
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: layout.summaryClamp,
                overflow: "hidden",
              }}
            >
              {summary}
            </Paragraph>

            {curatedContent?.passOffer ? (
              <div
                style={{
                  borderRadius: 14,
                  background: "#F6EFE8",
                  border: "1px solid rgba(47,62,58,0.08)",
                  padding: "10px 12px",
                }}
              >
                <Text
                  style={{
                    display: "block",
                    color: "#2F3E3A",
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    marginBottom: 4,
                  }}
                >
                  Ahangama Pass Exclusive
                </Text>
                <Text style={{ color: "#4F4A42", display: "block" }}>
                  {curatedContent.passOffer}
                </Text>
                {curatedContent.perk ? (
                  <Text
                    style={{ color: "#7A746B", display: "block", marginTop: 4 }}
                  >
                    {curatedContent.perk}
                  </Text>
                ) : null}
              </div>
            ) : null}

            <Space wrap size={[6, 6]}>
              {visibleTags.map((tag) => (
                <Tag
                  key={tag}
                  style={{
                    borderRadius: 999,
                    background: "#F4ECE1",
                    border: "1px solid rgba(47,62,58,0.08)",
                    color: "#4F4A42",
                  }}
                >
                  {tag}
                </Tag>
              ))}
            </Space>
          </div>
        </Card>
      </Col>
    );
  }

  return (
    <>
      <Card
        style={{
          borderRadius: 24,
          border: "1px solid rgba(0,0,0,0.06)",
          background:
            "linear-gradient(180deg, rgba(246,239,232,0.98) 0%, rgba(255,255,255,0.98) 100%)",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: 24 }}
      >
        <div style={{ marginBottom: 22 }}>
          <Space size={[8, 8]} wrap style={{ marginBottom: 10 }}>
            <Tag
              style={{
                borderRadius: 999,
                padding: "4px 10px",
                border: "1px solid rgba(47,62,58,0.12)",
                background: "rgba(255,255,255,0.85)",
                color: "#2F3E3A",
                fontWeight: 600,
              }}
            >
              12 Things To Do
            </Tag>
            <Text style={{ color: "#7A746B", fontSize: 13 }}>
              Curated Ahangama shortlist
            </Text>
          </Space>

          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col xs={24} lg={16}>
              <Title level={2} style={{ margin: 0, color: "#2F3E3A" }}>
                12 things to do in Ahangama
              </Title>
              <Paragraph
                style={{
                  margin: "10px 0 0",
                  color: "#5B564E",
                  fontSize: 15,
                  maxWidth: 760,
                }}
              >
                A numbered editorial shortlist under the map so visitors can
                scan the essential Ahangama experiences in order, then open a
                richer quick-view for the venue, perks, and next action.
              </Paragraph>
            </Col>
            <Col xs={24} lg={8}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="primary"
                  size="large"
                  href="/12-things"
                  icon={<ArrowRightOutlined />}
                  style={{
                    borderRadius: 999,
                    height: 44,
                    paddingInline: 18,
                    background: "#2F3E3A",
                    borderColor: "#2F3E3A",
                    boxShadow: "none",
                  }}
                >
                  View full guide
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {EDITORIAL_ROWS.map((row, rowIndex) => {
            const rowItems = row
              .map((item) => {
                const record = placeByIndex[item.index];
                if (!record) return null;

                return renderPlaceCard(record.place, record.index, item.col);
              })
              .filter(Boolean);

            if (!rowItems.length) return null;

            return (
              <Row
                gutter={[18, 18]}
                key={`editorial-row-${rowIndex}`}
                align="stretch"
              >
                {rowItems}
              </Row>
            );
          })}
        </div>
      </Card>

      <Modal
        open={!!selectedPlace}
        onCancel={() => setSelectedPlace(null)}
        footer={null}
        width={760}
        centered
        destroyOnClose
        styles={{
          body: {
            paddingTop: 12,
            paddingBottom: 12,
            overflow: "hidden",
          },
        }}
      >
        {selectedPlace ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Row gutter={[14, 14]} align="stretch">
              <Col xs={0} md={10}>
                <div
                  style={{
                    height: "100%",
                    minHeight: 180,
                    borderRadius: 16,
                    background: selectedImage
                      ? `linear-gradient(180deg, rgba(47,62,58,0.08), rgba(47,62,58,0.28)), url(${selectedImage}) center/cover no-repeat`
                      : "linear-gradient(135deg, #E7DED2 0%, #CFC0AE 100%)",
                  }}
                />
              </Col>
              <Col xs={24} md={14}>
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Space wrap size={[6, 6]}>
                    <Tag style={{ borderRadius: 999 }}>
                      {selectedPlace.category || "Ahangama"}
                    </Tag>
                    {selectedPlace.area ? (
                      <Tag style={{ borderRadius: 999 }}>
                        {selectedPlace.area}
                      </Tag>
                    ) : null}
                    {selectedPlace.price ? (
                      <Tag style={{ borderRadius: 999 }}>
                        {selectedPlace.price}
                      </Tag>
                    ) : null}
                  </Space>

                  <Title
                    level={2}
                    style={{
                      margin: 0,
                      color: "#2F3E3A",
                      fontSize: 28,
                      lineHeight: 1.1,
                    }}
                  >
                    {selectedPlace.name}
                  </Title>
                  {selectedContent?.title ? (
                    <Text style={{ color: "#5B564E", fontSize: 15 }}>
                      {selectedContent.title}
                    </Text>
                  ) : null}

                  {(typeof selectedPlace.stars === "number" ||
                    typeof selectedPlace.reviews === "number") && (
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      {typeof selectedPlace.stars === "number" ? (
                        <>
                          <span style={{ color: "#FFD700", fontSize: 16 }}>
                            ★
                          </span>
                          <Text style={{ color: "#2F3E3A", fontWeight: 600 }}>
                            {selectedPlace.stars.toFixed(1)}
                          </Text>
                        </>
                      ) : null}
                      {typeof selectedPlace.reviews === "number" ? (
                        <Text style={{ color: "#7A746B" }}>
                          ({selectedPlace.reviews.toLocaleString()} reviews)
                        </Text>
                      ) : null}
                    </div>
                  )}

                  <Paragraph
                    style={{ color: "#4F4A42", fontSize: 14, margin: 0 }}
                  >
                    {selectedSummary}
                  </Paragraph>
                </div>
              </Col>
            </Row>

            {selectedContent?.passOffer ? (
              <div
                style={{
                  borderRadius: 14,
                  background: "#F6EFE8",
                  border: "1px solid rgba(47,62,58,0.08)",
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    display: "block",
                    color: "#2F3E3A",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    marginBottom: 4,
                  }}
                >
                  Ahangama Pass Exclusive
                </Text>
                <Text style={{ color: "#4F4A42", display: "block" }}>
                  {selectedContent.passOffer}
                </Text>
                {selectedContent.perk ? (
                  <Text
                    style={{ color: "#7A746B", display: "block", marginTop: 4 }}
                  >
                    {selectedContent.perk}
                  </Text>
                ) : null}
              </div>
            ) : null}

            <Row gutter={[12, 12]}>
              <Col xs={24} lg={12}>
                <Card
                  style={{ borderRadius: 14, height: "100%" }}
                  bodyStyle={{ padding: 14 }}
                >
                  <Text
                    strong
                    style={{
                      display: "block",
                      marginBottom: 8,
                      color: "#2F3E3A",
                    }}
                  >
                    Venue details
                  </Text>
                  {selectedPlace.hours ? (
                    <Text
                      style={{
                        display: "block",
                        color: "#5B564E",
                        marginBottom: 5,
                        fontSize: 13,
                      }}
                    >
                      <strong>Hours:</strong> {selectedPlace.hours}
                    </Text>
                  ) : null}
                  {selectedPlace.cardPerk ? (
                    <Text
                      style={{
                        display: "block",
                        color: "#5B564E",
                        marginBottom: 5,
                        fontSize: 13,
                      }}
                    >
                      <strong>Card perk:</strong> {selectedPlace.cardPerk}
                    </Text>
                  ) : null}
                  {selectedPlace.offer ? (
                    <Text
                      style={{
                        display: "block",
                        color: "#5B564E",
                        marginBottom: 5,
                        fontSize: 13,
                      }}
                    >
                      <strong>Offer:</strong> {selectedPlace.offer}
                    </Text>
                  ) : null}
                  {selectedPlace.howToClaim ? (
                    <Text
                      style={{
                        display: "block",
                        color: "#5B564E",
                        marginBottom: 5,
                        fontSize: 13,
                      }}
                    >
                      <strong>How to claim:</strong> {selectedPlace.howToClaim}
                    </Text>
                  ) : null}
                  {selectedPlace.restrictions ? (
                    <Text
                      style={{
                        display: "block",
                        color: "#5B564E",
                        fontSize: 13,
                      }}
                    >
                      <strong>Restrictions:</strong>{" "}
                      {selectedPlace.restrictions}
                    </Text>
                  ) : null}
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card
                  style={{ borderRadius: 14, height: "100%" }}
                  bodyStyle={{ padding: 14 }}
                >
                  <Text
                    strong
                    style={{
                      display: "block",
                      marginBottom: 8,
                      color: "#2F3E3A",
                    }}
                  >
                    Contact and links
                  </Text>
                  <Space
                    direction="vertical"
                    size={8}
                    style={{ width: "100%" }}
                  >
                    {selectedPlace.mapUrl ? (
                      <Button
                        icon={<EnvironmentOutlined />}
                        href={selectedPlace.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ borderRadius: 999, width: "100%", height: 34 }}
                      >
                        Open in Google Maps
                      </Button>
                    ) : null}
                    {selectedDetailHref ? (
                      <Button
                        href={selectedDetailHref}
                        style={{ borderRadius: 999, width: "100%", height: 34 }}
                      >
                        Open venue page
                      </Button>
                    ) : null}
                    {selectedPlace.instagramUrl ? (
                      <Button
                        icon={<InstagramOutlined />}
                        href={selectedPlace.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ borderRadius: 999, width: "100%", height: 34 }}
                      >
                        Instagram
                      </Button>
                    ) : null}
                    {selectedPlace.whatsApp ? (
                      <Button
                        icon={<WhatsAppOutlined />}
                        href={`https://wa.me/${selectedPlace.whatsApp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ borderRadius: 999, width: "100%", height: 34 }}
                      >
                        WhatsApp
                      </Button>
                    ) : null}
                    {selectedPlace.email ? (
                      <Button
                        icon={<MailOutlined />}
                        href={`mailto:${selectedPlace.email}`}
                        style={{ borderRadius: 999, width: "100%", height: 34 }}
                      >
                        Email venue
                      </Button>
                    ) : null}
                  </Space>
                </Card>
              </Col>
            </Row>

            {selectedTags.length > 0 ? (
              <Space wrap size={[6, 6]}>
                {selectedTags.map((tag) => (
                  <Tag
                    key={tag}
                    style={{
                      borderRadius: 999,
                      background: "#F4ECE1",
                      border: "1px solid rgba(47,62,58,0.08)",
                      color: "#4F4A42",
                    }}
                  >
                    {tag}
                  </Tag>
                ))}
              </Space>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </>
  );
}
