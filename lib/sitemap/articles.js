import {
  createSitemapEntry,
  extractImageUrls,
  fileLastmod,
  tryQueryRows,
} from "./utils.js";

const STATIC_ARTICLES = [
  {
    pathname: "/the-living-room-concept-store",
    source: "src/pages/TheLivingRoomConceptStorePage.jsx",
  },
  {
    pathname:
      "/staff-pick-experience-a-day-that-slowly-erases-your-plan-in-ahangama",
    source: "src/pages/StaffPickExperienceAhangamaPage.jsx",
  },
  {
    pathname: "/best-sunsets-in-ahangama",
    source: "src/pages/BestSunsetsInAhangamaPage.jsx",
  },
  {
    pathname: "/ahangama-after-dark",
    source: "src/pages/AhangamaAfterDarkPage.jsx",
  },
  {
    pathname: "/ahangama-sri-lanka",
    source: "src/pages/AhangamaSriLankaPage.jsx",
  },
  {
    pathname: "/community-market-in-ahangama",
    source: "src/pages/CommunityMarketInAhangamaPage.jsx",
  },
  {
    pathname:
      "/where-ahangama-gathers-for-sunset-stairway-rooftop-bar-at-lighthouse-hotel",
    source: "src/pages/WhereAhangamaGathersForSunsetPage.jsx",
  },
  {
    pathname: "/inside-the-launch-of-ahangama-circle",
    source: "src/pages/InsideTheLaunchOfAhangamaCirclePage.jsx",
  },
  {
    pathname: "/gusta-groceries-good-food-and-more-in-ahangama",
    source: "src/pages/GustaGroceriesAhangamaPage.jsx",
  },
  {
    pathname: "/petals-ahangama-a-dream-rooted-in-legacy",
    source: "src/pages/PetalsAhangamaLegacyPage.jsx",
  },
  { pathname: "/dulasiri-uncle", source: "src/pages/DulasiriUnclePage.jsx" },
  {
    pathname: "/3-days-in-ahangama",
    source: "src/pages/ThreeDaysInAhangamaPage.jsx",
  },
  {
    pathname: "/getting-around-ahangama-scooters-tuk-tuks-airport-transfers",
    source: "src/pages/GettingAroundAhangamaPage.jsx",
  },
  {
    pathname: "/sri-lankas-most-interesting-coastal-town",
    source: "src/pages/SriLankasMostInterestingCoastalTownPage.jsx",
  },
  {
    pathname: "/where-to-stay-on-sri-lankas-southern-coast",
    source: "src/pages/WhereToStayOnSriLankasSouthernCoastPage.jsx",
  },
  {
    pathname: "/why-surfing-changed-everything-in-ahangama",
    source: "src/pages/WhySurfingChangedEverythingInAhangamaPage.jsx",
  },
];

async function loadDatabaseArticles() {
  const rows = await tryQueryRows(`
    SELECT
      slug,
      updated_at,
      published_at,
      created_at,
      featured_image,
      TO_JSONB(articles.*) AS raw
    FROM articles
    WHERE slug IS NOT NULL
      AND editorial_status <> 'hidden'
      AND (status = 'published' OR published = TRUE)
    ORDER BY updated_at DESC NULLS LAST, published_at DESC NULLS LAST, slug ASC
  `);

  return rows || [];
}

export async function generateArticlesSitemap({ siteUrl, rootDir }) {
  const staticEntries = STATIC_ARTICLES.map((article) =>
    createSitemapEntry({
      pathname: article.pathname,
      siteUrl,
      lastmod: fileLastmod(rootDir, article.source),
    }),
  );
  const databaseEntries = (await loadDatabaseArticles()).map((article) =>
    createSitemapEntry({
      pathname: `/${article.slug}`,
      siteUrl,
      lastmod: article.updated_at || article.published_at || article.created_at,
      images: extractImageUrls(article.raw || article, siteUrl),
    }),
  );

  return [...staticEntries, ...databaseEntries];
}
