import { createSitemapEntry, fileLastmod } from "./utils.js";

const STATIC_PAGES = [
  { pathname: "/", source: "src/pages/Home.jsx" },
  { pathname: "/new", source: "src/pages/NewHomePage.jsx" },
  { pathname: "/guide", source: "src/pages/ExperienceAhangamaGuide.jsx" },
  { pathname: "/map", source: "src/pages/Map.jsx" },
  { pathname: "/search", source: "src/pages/SearchPage.jsx" },
  { pathname: "/about", source: "src/pages/About.jsx" },
  { pathname: "/site-map", source: "src/pages/SiteMapPage.jsx" },
  { pathname: "/offers", source: "src/pages/FullListPage.jsx" },
  { pathname: "/products", source: "src/pages/ProductsIndexPage.jsx" },
  { pathname: "/blogs", source: "src/pages/BlogsPage.jsx" },
  { pathname: "/eat", source: "src/pages/EatEditorialPage.jsx" },
  { pathname: "/stays", source: "src/pages/CategoryIndex.jsx" },
  { pathname: "/best-airbnbs", source: "src/pages/BestAirbnbsPage.jsx" },
  { pathname: "/transport", source: "src/pages/TransportPage.jsx" },
  { pathname: "/wellness", source: "src/pages/CategoryIndex.jsx" },
  { pathname: "/retail", source: "src/pages/CategoryIndex.jsx" },
  { pathname: "/shops", source: "src/pages/ShopsEditorialPage.jsx" },
  { pathname: "/events", source: "src/pages/EventsPage.jsx" },
  { pathname: "/editors-picks", source: "src/pages/EditorsPicksPage.jsx" },
  { pathname: "/local-intelligence", source: "src/pages/LocalIntelligencePage.jsx" },
  { pathname: "/newsletter", source: "src/pages/NewsletterLandingPage.jsx" },
  { pathname: "/partners", source: "src/pages/Partners.jsx" },
  { pathname: "/card", source: "src/pages/CardLanding.jsx" },
  { pathname: "/card/buy", source: "src/pages/CardBuy.jsx" },
  { pathname: "/card/terms", source: "src/pages/CardTerms.jsx" },
  { pathname: "/what-is-ahangama-pass", source: "src/pages/WhatIsAhangamaPassPage.jsx" },
  { pathname: "/pass-perks", source: "src/pages/PassPerksPage.jsx" },
  { pathname: "/comp-pass", source: "src/pages/HospoPassPage.jsx" },
  { pathname: "/12-things", source: "src/pages/TwelveThingsPage.jsx" },
  { pathname: "/lighthouse", source: "src/pages/LighthousePage.jsx" },
  { pathname: "/mosvold", source: "src/pages/MosvoldPage.jsx" },
  { pathname: "/pabc", source: "src/pages/PabcPage.jsx" },
  { pathname: "/kaffi", source: "src/pages/LighthousePage.jsx" },
  { pathname: "/gusta", source: "src/pages/LighthousePage.jsx" },
  { pathname: "/surf-club", source: "src/pages/LighthousePage.jsx" },
  { pathname: "/tahini", source: "src/pages/LighthousePage.jsx" },
  { pathname: "/living-room", source: "src/pages/LighthousePage.jsx" },
];

export async function generatePagesSitemap({ siteUrl, rootDir }) {
  return STATIC_PAGES.map((page) =>
    createSitemapEntry({
      pathname: page.pathname,
      siteUrl,
      lastmod: fileLastmod(rootDir, page.source),
    }),
  );
}
