import React, { useDeferredValue, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  CoffeeOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  HomeOutlined,
  ReloadOutlined,
  SearchOutlined,
  ShopOutlined,
  SkinOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Alert, Button, Empty, Input, Skeleton, Typography } from "antd";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { usePlaces } from "../app/placesContext";
import SiteLayout from "../components/layout/SiteLayout";
import { getPassPlaces } from "../lib/passPartners";
import ahangamaPassLogo from "../assets/ahangama-pass-logo.png";
import "../styles/pass-perks-page.css";

const { Paragraph, Text, Title } = Typography;

export const PASS_PERKS_PATH = "/pass-perks";

const PERK_CATEGORIES = [
  { key: "all", label: "All perks", Icon: GiftOutlined },
  { key: "eat", label: "Eat & drink", Icon: CoffeeOutlined },
  { key: "wellness", label: "Wellness", Icon: SkinOutlined },
  { key: "experiences", label: "Things to do", Icon: CompassOutlined },
  { key: "stays", label: "Stays", Icon: HomeOutlined },
  { key: "shopping", label: "Shopping", Icon: ShopOutlined },
  { key: "transport", label: "Getting around", Icon: ThunderboltOutlined },
  { key: "other", label: "More", Icon: GiftOutlined },
];

function normalizedPlaceText(place) {
  return [
    place.category,
    ...(place.categories || []),
    ...(place.bestFor || []),
    ...(place.tags || []),
    place.name,
    place.cardPerk,
    place.offer,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getPerkCategory(place) {
  const text = normalizedPlaceText(place);

  if (/stay|hotel|villa|hostel|guesthouse|accommodation/.test(text)) {
    return "stays";
  }

  if (/wellness|yoga|pilates|spa|massage|recovery|fitness|gym|ice bath/.test(text)) {
    return "wellness";
  }

  if (/restaurant|cafe|coffee|bar|eat|food|drink|brunch|dinner/.test(text)) {
    return "eat";
  }

  if (/retail|shop|store|fashion|jewellery|jewelry|essentials/.test(text)) {
    return "shopping";
  }

  if (/transport|scooter|bike rental|tuk|taxi|airport|transfer/.test(text)) {
    return "transport";
  }

  if (/experience|surf|workshop|tour|adventure|class|activity/.test(text)) {
    return "experiences";
  }

  return "other";
}

function getPlaceHref(place) {
  if (Object.prototype.hasOwnProperty.call(place || {}, "href")) {
    return place.href;
  }

  if (!place?.slug || !place?.category) return null;

  const category = String(place.category).toLowerCase();
  if (category === "shops-essentials" || category === "retail") {
    return `/retail/${place.slug}`;
  }

  return `/${place.category}/${place.slug}`;
}

function getPerkCopy(place) {
  return place.cardPerk || place.offer || place.offers?.[0] || "Pass holder perk available.";
}

function getClaimCopy(place) {
  return place.howToClaim || "Show your Ahangama Pass before ordering or booking.";
}

function PerkCard({ place }) {
  const href = getPlaceHref(place);
  const category = PERK_CATEGORIES.find((item) => item.key === place.perkCategory);
  const CategoryIcon = category?.Icon || GiftOutlined;
  const image = place.image || place.ogImage || place.logo;

  return (
    <article className="passPerks-card">
      <div className="passPerks-cardMedia">
        {image ? (
          <img src={image} alt="" loading="lazy" />
        ) : (
          <div className="passPerks-cardPlaceholder"><CategoryIcon /></div>
        )}
        <span className="passPerks-categoryLabel"><CategoryIcon /> {category?.label || "More"}</span>
      </div>
      <div className="passPerks-cardBody">
        <div className="passPerks-placeMeta">
          <Text>{place.area || "Ahangama"}</Text>
          {place.staffPick ? <Text className="passPerks-staffPick">Staff pick</Text> : null}
        </div>
        <Title level={2}>{place.name}</Title>
        <div className="passPerks-offer">
          <GiftOutlined aria-hidden="true" />
          <strong>{getPerkCopy(place)}</strong>
        </div>
        <div className="passPerks-claim">
          <CheckCircleOutlined aria-hidden="true" />
          <Text>{getClaimCopy(place)}</Text>
        </div>
        {place.restrictions ? (
          <Text className="passPerks-restrictions">{place.restrictions}</Text>
        ) : null}
        <div className="passPerks-cardActions">
          {href ? <Link to={href}>View venue <ArrowRightOutlined /></Link> : <span />}
          {place.mapUrl ? (
            <a href={place.mapUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${place.name} in maps`}>
              <EnvironmentOutlined /> Map
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function PassPerksPage() {
  const { places, loading, error, reload } = usePlaces();
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const passPlaces = getPassPlaces(places).map((place) => ({
    ...place,
    perkCategory: getPerkCategory(place),
  }));
  const categoryCounts = passPlaces.reduce((counts, place) => {
    counts[place.perkCategory] = (counts[place.perkCategory] || 0) + 1;
    return counts;
  }, { all: passPlaces.length });
  const visiblePlaces = passPlaces.filter((place) => {
    const matchesCategory =
      activeCategory === "all" || place.perkCategory === activeCategory;
    const matchesQuery =
      !deferredQuery ||
      `${place.name} ${place.area || ""} ${getPerkCopy(place)} ${normalizedPlaceText(place)}`
        .toLowerCase()
        .includes(deferredQuery);
    return matchesCategory && matchesQuery;
  });

  return (
    <SiteLayout>
      <Seo
        title="Ahangama Pass Perks"
        description="Discover current Ahangama Pass perks across food, wellness, stays, experiences, shopping, and transport."
        canonical={absUrl(PASS_PERKS_PATH)}
        ogImage="https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hero_pass_apple_wallet.png"
      />

      <main className="passPerks-page">
        <header className="passPerks-header">
          <div className="passPerks-headerBrand">
            <img src={ahangamaPassLogo} alt="Ahangama Pass" />
            <Text>Pass holder guide</Text>
          </div>
          <Title>Your perks, all in one place.</Title>
          <Paragraph>
            Browse what your Ahangama Pass unlocks, then show your pass when you order, book, or arrive.
          </Paragraph>
          <div className="passPerks-summary">
            <span><strong>{passPlaces.length}</strong> live perks</span>
            <span><strong>{Math.max(PERK_CATEGORIES.length - 2, 0)}</strong> ways to explore</span>
          </div>
        </header>

        <section className="passPerks-tools" aria-label="Find pass perks">
          <Input
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Search a venue or perk"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search pass perks"
          />
          <div className="passPerks-filters" role="group" aria-label="Filter perks by category">
            {PERK_CATEGORIES.filter((category) => category.key === "all" || categoryCounts[category.key]).map((category) => (
              <button
                type="button"
                className={activeCategory === category.key ? "is-active" : ""}
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                aria-pressed={activeCategory === category.key}
              >
                {React.createElement(category.Icon)}
                <span>{category.label}</span>
                <small>{categoryCounts[category.key] || 0}</small>
              </button>
            ))}
          </div>
        </section>

        {error ? (
          <Alert
            type="error"
            showIcon
            title="We could not load the current perks."
            action={<Button icon={<ReloadOutlined />} onClick={reload}>Try again</Button>}
          />
        ) : null}

        {loading ? (
          <div className="passPerks-loading" aria-label="Loading pass perks">
            {[1, 2, 3, 4].map((item) => <Skeleton key={item} active paragraph={{ rows: 4 }} />)}
          </div>
        ) : null}

        {!loading && !error ? (
          <section className="passPerks-results" aria-live="polite">
            <div className="passPerks-resultsHeader">
              <Title level={2}>{PERK_CATEGORIES.find((item) => item.key === activeCategory)?.label}</Title>
              <Text>{visiblePlaces.length} {visiblePlaces.length === 1 ? "perk" : "perks"}</Text>
            </div>
            {visiblePlaces.length ? (
              <div className="passPerks-grid">
                {visiblePlaces.map((place) => <PerkCard key={place.id || place.slug} place={place} />)}
              </div>
            ) : (
              <Empty description="No perks match that search" />
            )}
          </section>
        ) : null}

        <section className="passPerks-help">
          <div>
            <Text>Using your pass</Text>
            <Title level={2}>Show it before you pay.</Title>
            <Paragraph>
              Open your Ahangama Pass in Apple Wallet or Google Wallet and show it to the venue team before ordering, booking, or checking in. Individual conditions are shown on each perk.
            </Paragraph>
          </div>
          <Link to="/what-is-ahangama-pass">How the pass works <ArrowRightOutlined /></Link>
        </section>
      </main>
    </SiteLayout>
  );
}