import React, { useDeferredValue, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightOutlined,
  CompassOutlined,
  FileTextOutlined,
  ReadOutlined,
  SearchOutlined,
  ShopOutlined,
  TeamOutlined,
  ToolOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Empty, Input, Typography } from "antd";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import "../styles/site-map-page.css";

const { Paragraph, Text, Title } = Typography;

export const SITE_MAP_PATH = "/site-map";

const PAGE_GROUPS = [
  {
    id: "discover",
    title: "Discover Ahangama",
    description: "The quickest ways to find a place, event, offer, or area of town.",
    icon: CompassOutlined,
    pages: [
      { title: "Home", path: "/", detail: "The main Ahangama guide and latest recommendations." },
      { title: "Search", path: "/search", detail: "Search across places and local recommendations." },
      { title: "Map", path: "/map", detail: "Explore Ahangama by location." },
      { title: "Where to eat", path: "/eat", detail: "Restaurants, cafes, bars, and local favourites." },
      { title: "Where to stay", path: "/stays", detail: "Boutique hotels, villas, and direct enquiries." },
      { title: "Private villas", path: "/best-airbnbs", detail: "A curated guide to villas and beach houses." },
      { title: "Wellness", path: "/wellness", detail: "Yoga, recovery, fitness, and treatments." },
      { title: "Shops", path: "/shops", detail: "Design stores, local finds, and essentials." },
      { title: "Events", path: "/events", detail: "What is happening around town." },
      { title: "Offers", path: "/offers", detail: "Current Ahangama Pass perks and offers." },
    ],
  },
  {
    id: "guides",
    title: "Guides & Stories",
    description: "Editorial routes for planning a trip and understanding the town.",
    icon: ReadOutlined,
    pages: [
      { title: "12 things to do", path: "/12-things", detail: "The essential Ahangama shortlist." },
      { title: "Online guide", path: "/online-guide", detail: "A compact guide to experiencing Ahangama." },
      { title: "Editor's picks", path: "/editors-picks", detail: "Places and experiences selected by the editorial team." },
      { title: "All stories", path: "/blogs", detail: "Visitor stories, practical guides, and local discoveries." },
      { title: "Three days in Ahangama", path: "/3-days-in-ahangama", detail: "A practical three-day itinerary." },
      { title: "Getting around", path: "/getting-around-ahangama-scooters-tuk-tuks-airport-transfers", detail: "Scooters, tuk-tuks, and airport transfers." },
      { title: "Sri Lanka's most interesting coastal town", path: "/sri-lankas-most-interesting-coastal-town", detail: "The people and culture shaping modern Ahangama." },
      { title: "Where to stay on the southern coast", path: "/where-to-stay-on-sri-lankas-southern-coast", detail: "A wider view of stays across the south coast." },
      { title: "Why surfing changed everything", path: "/why-surfing-changed-everything-in-ahangama", detail: "How surf culture transformed the town." },
      { title: "Best sunsets", path: "/best-sunsets-in-ahangama", detail: "Where to end the day around Ahangama." },
      { title: "Community market", path: "/community-market-in-ahangama", detail: "A closer look at a local gathering place." },
      { title: "The Living Room", path: "/the-living-room-concept-store", detail: "Inside Ahangama's concept store and community space." },
      { title: "The Ahangama Dispatch", path: "/newsletter", detail: "Local recommendations and stories by email." },
    ],
  },
  {
    id: "pass",
    title: "Ahangama Pass",
    description: "Pass information, signup routes, products, and card management.",
    icon: WalletOutlined,
    pages: [
      { title: "What is the Ahangama Pass?", path: "/what-is-ahangama-pass", detail: "How the pass works and what it unlocks." },
      { title: "Pass products", path: "/products", detail: "Compare the available access and travel products." },
      { title: "Get a pass", path: "/card", detail: "Choose and purchase an Ahangama Pass." },
      { title: "Buy a pass", path: "/card/buy", detail: "Go directly to pass checkout." },
      { title: "Complimentary pass", path: "/comp-pass", detail: "Signup for an invited complimentary pass." },
      { title: "Hospo pass", path: "/hospo", detail: "Complimentary access for the hospitality community." },
      { title: "Leave a tip", path: "/tip", detail: "Support the people who made a visit memorable." },
      { title: "Verify a pass", path: "/verify", detail: "Check a pass or card at a partner venue." },
      { title: "Pass validity", path: "/valid", detail: "Review pass validity information." },
    ],
  },
  {
    id: "partners",
    title: "Partners & Business",
    description: "Routes for venues, local businesses, resellers, and collaborators.",
    icon: TeamOutlined,
    pages: [
      { title: "Partners", path: "/partners", detail: "Work with Ahangama.com and the Ahangama Pass." },
      { title: "Become a partner", path: "/partner-signup", detail: "Submit a venue or business partnership application." },
      { title: "Resellers", path: "/resellers", detail: "Pass distribution and reseller information." },
      { title: "Vendors", path: "/vendors", detail: "Venue and vendor resources." },
      { title: "Brand assets", path: "/logo", detail: "Ahangama.com logo and brand references." },
      { title: "About Ahangama.com", path: "/about", detail: "The thinking and team behind the guide." },
    ],
  },
  {
    id: "campaigns",
    title: "Venue Pass Pages",
    description: "Dedicated pass and welcome pages created with local partners.",
    icon: ShopOutlined,
    pages: [
      { title: "Lighthouse", path: "/lighthouse", detail: "Lighthouse guest pass and local guide." },
      { title: "Mosvold", path: "/mosvold", detail: "Mosvold guest pass and local guide." },
      { title: "PABC", path: "/pabc", detail: "PABC guest pass and local guide." },
      { title: "Kaffi", path: "/kaffi", detail: "Kaffi venue pass page." },
      { title: "Gusta", path: "/gusta", detail: "Gusta venue pass page." },
      { title: "Surf Club", path: "/surf-club", detail: "Surf Club venue pass page." },
      { title: "Tahini", path: "/tahini", detail: "Tahini venue pass page." },
      { title: "Living Room", path: "/living-Room", detail: "Living Room venue pass page." },
    ],
  },
  {
    id: "team",
    title: "Team Tools",
    description: "Operational and planning pages intended primarily for the Ahangama team.",
    icon: ToolOutlined,
    internal: true,
    pages: [
      { title: "Strategy workspace", path: "/concept", detail: "Concept, product, and distribution planning." },
      { title: "Master index", path: "/master-index", detail: "Internal product and route overview." },
      { title: "Admin dashboard", path: "/admin", detail: "Pass and guest operations." },
      { title: "Places table", path: "/places", detail: "Structured venue data and management." },
      { title: "Local intelligence", path: "/local-intelligence", detail: "Destination activity and visitor signals." },
      { title: "Passes issued", path: "/passes-issued", detail: "Issued pass reporting." },
      { title: "Interactions", path: "/interactions", detail: "Visitor and content interaction reporting." },
      { title: "Email preview", path: "/email-preview", detail: "Preview operational email templates." },
    ],
  },
];

const TOTAL_PAGES = PAGE_GROUPS.reduce((total, group) => total + group.pages.length, 0);

function PageLink({ page }) {
  return (
    <Link className="siteMap-link" to={page.path}>
      <span>
        <strong>{page.title}</strong>
        <Text>{page.detail}</Text>
      </span>
      <ArrowRightOutlined aria-hidden="true" />
    </Link>
  );
}

export default function SiteMapPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filteredGroups = PAGE_GROUPS.map((group) => ({
    ...group,
    pages: group.pages.filter((page) =>
      `${page.title} ${page.detail} ${page.path}`.toLowerCase().includes(deferredQuery),
    ),
  })).filter((group) => group.pages.length > 0);
  const resultCount = filteredGroups.reduce((total, group) => total + group.pages.length, 0);

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Site Map | Explore Ahangama.com"
        description="A clear, grouped directory of Ahangama.com guides, places, stories, pass pages, partner resources, and team tools."
        canonical={absUrl(SITE_MAP_PATH)}
      />

      <main className="siteMap-page">
        <header className="siteMap-hero">
          <div className="siteMap-heroImage" aria-hidden="true" />
          <div className="siteMap-heroShade" aria-hidden="true" />
          <div className="siteMap-heroContent">
            <Text className="siteMap-eyebrow">Ahangama.com directory</Text>
            <Title>Find your way around.</Title>
            <Paragraph>
              Guides, places, passes, stories, and team resources, organised into one useful overview.
            </Paragraph>
            <div className="siteMap-count"><FileTextOutlined /> {TOTAL_PAGES} key pages across {PAGE_GROUPS.length} groups</div>
          </div>
        </header>

        <section className="siteMap-directory" aria-label="Site directory">
          <div className="siteMap-controls">
            <div>
              <Text className="siteMap-eyebrow siteMap-eyebrowDark">Browse everything</Text>
              <Title level={2}>Where do you want to go?</Title>
            </div>
            <Input
              allowClear
              size="large"
              prefix={<SearchOutlined />}
              placeholder="Search pages, guides, or tools"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search the site directory"
            />
          </div>

          {!deferredQuery ? (
            <nav className="siteMap-jumpNav" aria-label="Jump to a category">
              {PAGE_GROUPS.map((group) => (
                <a key={group.id} href={`#${group.id}`}>{group.title}</a>
              ))}
            </nav>
          ) : (
            <Text className="siteMap-results">{resultCount} {resultCount === 1 ? "page" : "pages"} found</Text>
          )}

          {filteredGroups.length ? (
            <div className="siteMap-groups">
              {filteredGroups.map((group) => {
                const GroupIcon = group.icon;

                return (
                  <section className={`siteMap-group${group.internal ? " siteMap-groupInternal" : ""}`} id={group.id} key={group.id}>
                    <div className="siteMap-groupIntro">
                      <span className="siteMap-groupIcon"><GroupIcon /></span>
                      <Text className="siteMap-groupNumber">{String(PAGE_GROUPS.findIndex((item) => item.id === group.id) + 1).padStart(2, "0")}</Text>
                      <Title level={2}>{group.title}</Title>
                      <Paragraph>{group.description}</Paragraph>
                      {group.internal ? <Text className="siteMap-internalLabel">Primarily for team use</Text> : null}
                    </div>
                    <div className="siteMap-links">
                      {group.pages.map((page) => <PageLink key={page.path} page={page} />)}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <Empty description="No pages match that search" />
          )}
        </section>
      </main>
    </SiteLayout>
  );
}