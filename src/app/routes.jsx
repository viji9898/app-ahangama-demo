import React from "react";
import Home from "../pages/Home";
import NewHomePage, { NEW_HOME_PATH } from "../pages/NewHomePage";
import HomeV2 from "../pages/HomeV2";
import HomeMobile from "../pages/HomeMobile";
import About from "../pages/About";
import BlogsPage from "../pages/BlogsPage";
import EatEditorialPage from "../pages/EatEditorialPage";
import ConceptPage from "../pages/ConceptPage";
import ProductsIndexPage from "../pages/ProductsIndexPage";
import ProductPage from "../pages/ProductPage";
import Partners from "../pages/Partners";
import TipLandingPage, { TIP_LANDING_PATH } from "../pages/TipLandingPage";
import HospoPassPage, {
  COMP_PASS_PATH,
  HOSPO_PASS_PATH,
} from "../pages/HospoPassPage";
import PlaceDetail from "../pages/PlaceDetail";
import CategoryIndex from "../pages/CategoryIndex";
import NotFound from "../NotFound";
import { CATEGORIES } from "../data/categories";
import SearchPage from "../pages/SearchPage";
import LogoPage from "../pages/LogoPage";
import CardLanding from "../pages/CardLanding";
import CardBuy from "../pages/CardBuy";
import CardTerms from "../pages/CardTerms";
import MyCard from "../pages/MyCard";
import CardPass from "../pages/CardPass";
import CardVerify from "../pages/CardVerify";
import PaymentSuccess from "../pages/PaymentSuccess";
import MasterIndex from "../pages/MasterIndex";
import Vendors from "../pages/Vendors";
import MapPage from "../pages/Map";
import MapGoogle from "../pages/MapGoogle";
import AdminDashboard from "../pages/AdminDashboard";
import PlacesTable from "../pages/PlacesTable";
import PartnerSignUp from "../pages/PartnerSignUp";
import PartnerSignUpSuccess from "../pages/PartnerSignUpSuccess";
import HomeDesktop from "../pages/HomeDesktop";
import Resellers from "../pages/Resellers";
import TwelveThingsPage from "../pages/TwelveThingsPage";
import FullListPage from "../pages/FullListPage";
import ThreeDaysInAhangamaPage from "../pages/ThreeDaysInAhangamaPage";
import GettingAroundAhangamaPage, {
  GETTING_AROUND_AHANGAMA_PATH,
} from "../pages/GettingAroundAhangamaPage";
import SriLankasMostInterestingCoastalTownPage, {
  SRI_LANKAS_MOST_INTERESTING_COASTAL_TOWN_PATH,
} from "../pages/SriLankasMostInterestingCoastalTownPage";
import WhereToStayOnSriLankasSouthernCoastPage, {
  WHERE_TO_STAY_ON_SRI_LANKAS_SOUTHERN_COAST_PATH,
} from "../pages/WhereToStayOnSriLankasSouthernCoastPage";
import WhySurfingChangedEverythingInAhangamaPage, {
  WHY_SURFING_CHANGED_PATH,
} from "../pages/WhySurfingChangedEverythingInAhangamaPage";
import WhatIsAhangamaPassPage from "../pages/WhatIsAhangamaPassPage";
import VenueQrLandingPage from "../pages/VenueQrLandingPage";
import LocalIntelligencePage from "../pages/LocalIntelligencePage";
import EventsPage from "../pages/EventsPage";
import NewsletterDataPage, {
  NEWSLETTER_DATA_PATH,
} from "../pages/NewsletterDataPage";
import NewsletterLandingPage from "../pages/NewsletterLandingPage";
import NewsletterPreferencesPage from "../pages/NewsletterPreferencesPage";
import EmailPreviewPage from "../pages/EmailPreviewPage";
import PassesIssuedPage, {
  PASSES_ISSUED_PATH,
} from "../pages/PassesIssuedPage";
import InteractionsPage, { INTERACTIONS_PATH } from "../pages/InteractionsPage";
import PassValidityPage from "../pages/PassValidityPage";
import ShopsEditorialPage from "../pages/ShopsEditorialPage";
import LighthousePage from "../pages/LighthousePage";
import MosvoldPage from "../pages/MosvoldPage";
import PabcPage from "../pages/PabcPage";
import ExperienceAhangamaGuide from "../pages/ExperienceAhangamaGuide";
import EditorsPicksPage from "../pages/EditorsPicksPage";
import TheLivingRoomConceptStorePage from "../pages/TheLivingRoomConceptStorePage";
import StaffPickExperienceAhangamaPage, {
  STAFF_PICK_EXPERIENCE_AHANGAMA_PATH,
} from "../pages/StaffPickExperienceAhangamaPage";
import BestSunsetsInAhangamaPage, {
  BEST_SUNSETS_IN_AHANGAMA_PATH,
} from "../pages/BestSunsetsInAhangamaPage";
import CommunityMarketInAhangamaPage, {
  COMMUNITY_MARKET_IN_AHANGAMA_PATH,
} from "../pages/CommunityMarketInAhangamaPage";
import WhereAhangamaGathersForSunsetPage, {
  WHERE_AHANGAMA_GATHERS_FOR_SUNSET_PATH,
} from "../pages/WhereAhangamaGathersForSunsetPage";
import InsideTheLaunchOfAhangamaCirclePage, {
  INSIDE_AHANGAMA_CIRCLE_LAUNCH_PATH,
} from "../pages/InsideTheLaunchOfAhangamaCirclePage";
import GustaGroceriesAhangamaPage, {
  GUSTA_GROCERIES_AHANGAMA_PATH,
} from "../pages/GustaGroceriesAhangamaPage";
import PetalsAhangamaLegacyPage, {
  PETALS_AHANGAMA_LEGACY_PATH,
} from "../pages/PetalsAhangamaLegacyPage";
import DulasiriUnclePage, {
  DULASIRI_UNCLE_PATH,
} from "../pages/DulasiriUnclePage";
import ArticleGuidelinePage, {
  ARTICLE_GUIDELINE_PATH,
} from "../pages/ArticleGuidelinePage";
import StaysPage, { STAYS_PATH } from "../pages/StaysPage";
import BestAirbnbsPage, { BEST_AIRBNBS_PATH } from "../pages/BestAirbnbsPage";
import SiteMapPage, { SITE_MAP_PATH } from "../pages/SiteMapPage";
import TransportPage, { TRANSPORT_PATH } from "../pages/TransportPage";
import HostRetreatPage, { HOST_RETREAT_PATH } from "../pages/HostRetreatPage";
import PassPerksPage, { PASS_PERKS_PATH } from "../pages/PassPerksPage";
import ExternalRedirect from "./ExternalRedirect";
import { Navigate } from "react-router-dom";

const WELLNESS_GUIDE_BLOG_PATH =
  "/blogs/the-ultimate-wellness-guide-to-ahangama-yoga-gyms-pilates-ice-baths-spas";

const cfg = (key) => CATEGORIES.find((c) => c.key === key);
const routes = [
  { path: NEW_HOME_PATH, element: <NewHomePage /> },
  { path: "/home-v-2", element: <HomeV2 /> },
  { path: "/home-mobile", element: <HomeMobile /> },
  { path: "/home-desktop", element: <HomeDesktop /> },
  { path: "/qr/:slug", element: <VenueQrLandingPage /> },
  { path: "/", element: <Home /> },
  {
    path: GETTING_AROUND_AHANGAMA_PATH,
    element: <GettingAroundAhangamaPage />,
  },
  {
    path: "/Getting-Around-Ahangama-Scooters,-Tuk-Tuks-Airport-Transfers",
    element: <GettingAroundAhangamaPage />,
  },
  { path: "/3-days-in-ahangama", element: <ThreeDaysInAhangamaPage /> },
  {
    path: SRI_LANKAS_MOST_INTERESTING_COASTAL_TOWN_PATH,
    element: <SriLankasMostInterestingCoastalTownPage />,
  },
  {
    path: "/Sri Lanka's Most Interesting Coastal Town",
    element: <SriLankasMostInterestingCoastalTownPage />,
  },
  {
    path: WHERE_TO_STAY_ON_SRI_LANKAS_SOUTHERN_COAST_PATH,
    element: <WhereToStayOnSriLankasSouthernCoastPage />,
  },
  {
    path: "/Where to Stay on Sri Lanka's Southern Coast",
    element: <WhereToStayOnSriLankasSouthernCoastPage />,
  },
  {
    path: WHY_SURFING_CHANGED_PATH,
    element: <WhySurfingChangedEverythingInAhangamaPage />,
  },
  {
    path: "/Why Surfing Changed Everything in Ahangama",
    element: <WhySurfingChangedEverythingInAhangamaPage />,
  },
  { path: "/local-intelligence", element: <LocalIntelligencePage /> },
  { path: "/events", element: <EventsPage /> },
  { path: NEWSLETTER_DATA_PATH, element: <NewsletterDataPage /> },
  {
    path: "/the-ultimate-wellness-guide-to-ahangama-yoga-gyms-pilates-ice-baths-spas",
    element: <ExternalRedirect to={WELLNESS_GUIDE_BLOG_PATH} />,
  },
  {
    path: "/The-Ultimate-Wellness-Guide-to-Ahangama:-Yoga-Gyms-Pilates-Ice-Baths-Spas",
    element: <ExternalRedirect to={WELLNESS_GUIDE_BLOG_PATH} />,
  },
  { path: "/what-is-ahangama-pass", element: <WhatIsAhangamaPassPage /> },
  { path: "/guide", element: <ExperienceAhangamaGuide /> },
  { path: "/online-guide", element: <Navigate to="/guide" replace /> },
  { path: "/editors-picks", element: <EditorsPicksPage /> },
  {
    path: "/the-living-room-concept-store",
    element: <TheLivingRoomConceptStorePage />,
  },
  {
    path: STAFF_PICK_EXPERIENCE_AHANGAMA_PATH,
    element: <StaffPickExperienceAhangamaPage />,
  },
  {
    path: BEST_SUNSETS_IN_AHANGAMA_PATH,
    element: <BestSunsetsInAhangamaPage />,
  },
  {
    path: COMMUNITY_MARKET_IN_AHANGAMA_PATH,
    element: <CommunityMarketInAhangamaPage />,
  },
  {
    path: WHERE_AHANGAMA_GATHERS_FOR_SUNSET_PATH,
    element: <WhereAhangamaGathersForSunsetPage />,
  },
  {
    path: INSIDE_AHANGAMA_CIRCLE_LAUNCH_PATH,
    element: <InsideTheLaunchOfAhangamaCirclePage />,
  },
  {
    path: GUSTA_GROCERIES_AHANGAMA_PATH,
    element: <GustaGroceriesAhangamaPage />,
  },
  {
    path: PETALS_AHANGAMA_LEGACY_PATH,
    element: <PetalsAhangamaLegacyPage />,
  },
  {
    path: DULASIRI_UNCLE_PATH,
    element: <DulasiriUnclePage />,
  },
  {
    path: ARTICLE_GUIDELINE_PATH,
    element: <ArticleGuidelinePage />,
  },
  { path: STAYS_PATH, element: <StaysPage /> },
  { path: BEST_AIRBNBS_PATH, element: <BestAirbnbsPage /> },
  { path: TRANSPORT_PATH, element: <TransportPage /> },
  { path: HOST_RETREAT_PATH, element: <HostRetreatPage /> },
  { path: "/lighthouse", element: <LighthousePage /> },
  { path: "/mosvold", element: <MosvoldPage /> },
  { path: "/pabc", element: <PabcPage /> },
  {
    path: "/kaffi",
    element: <LighthousePage variant="kaffi" />,
  },
  {
    path: "/gusta",
    element: <LighthousePage variant="gusta" />,
  },
  {
    path: "/surf-club",
    element: <LighthousePage variant="surfClub" />,
  },
  {
    path: "/tahini",
    element: <LighthousePage variant="tahini" />,
  },
  {
    path: "/living-Room",
    element: <LighthousePage variant="livingRoom" />,
  },
  { path: "/offers", element: <FullListPage /> },
  { path: "/full-list", element: <FullListPage /> },
  { path: "/12-things", element: <TwelveThingsPage /> },
  { path: "/about", element: <About /> },
  { path: SITE_MAP_PATH, element: <SiteMapPage /> },
  { path: "/logo", element: <LogoPage /> },
  { path: "/blogs", element: <BlogsPage /> },
  { path: "/blogs/:slug", element: <BlogsPage /> },
  { path: "/concept", element: <ConceptPage /> },
  { path: "/concept/:slug", element: <ConceptPage /> },
  { path: "/products", element: <ProductsIndexPage /> },
  { path: "/product/:slug", element: <ProductPage /> },
  { path: TIP_LANDING_PATH, element: <TipLandingPage /> },
  { path: HOSPO_PASS_PATH, element: <HospoPassPage /> },
  { path: COMP_PASS_PATH, element: <HospoPassPage variant="compPass" /> },
  { path: PASS_PERKS_PATH, element: <PassPerksPage /> },
  { path: "/partners", element: <Partners /> },
  { path: "/master-index", element: <MasterIndex /> },
  { path: "/map", element: <MapPage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/map-google", element: <MapGoogle /> },
  {
    path: "/google-map",
    element: (
      <ExternalRedirect to="https://maps.app.goo.gl/YyrJvehP4y3BSBae6" />
    ),
  },
  { path: "/vendors", element: <Vendors /> },
  { path: "/card", element: <CardLanding /> },
  { path: "/card/buy", element: <CardBuy /> },
  { path: "/card/terms", element: <CardTerms /> },
  { path: "/card/success", element: <PaymentSuccess /> },
  { path: "/card/my", element: <MyCard /> },
  { path: "/card/pass/:cardId", element: <CardPass /> },
  { path: "/verify", element: <CardVerify /> },
  { path: "/verify/:cardId", element: <CardVerify /> },
  { path: "/valid", element: <PassValidityPage /> },
  { path: "/card/verify", element: <CardVerify /> },
  { path: "/card/verify/:cardId", element: <CardVerify /> },
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/partner-signup", element: <PartnerSignUp /> },
  { path: "/partner-signup/success", element: <PartnerSignUpSuccess /> },
  { path: "/resellers", element: <Resellers /> },
  { path: "/places", element: <PlacesTable /> },
  { path: "/eat", element: <EatEditorialPage /> },
  { path: "/shops", element: <ShopsEditorialPage /> },
  { path: "/newsletter", element: <NewsletterLandingPage /> },
  { path: "/newsletter/preferences", element: <NewsletterPreferencesPage /> },
  { path: "/email-preview", element: <EmailPreviewPage /> },
  { path: PASSES_ISSUED_PATH, element: <PassesIssuedPage /> },
  { path: INTERACTIONS_PATH, element: <InteractionsPage /> },
  {
    path: "/stays",
    element: <CategoryIndex categoryKey="stays" config={cfg("stays")} />,
  },
  {
    path: "/wellness",
    element: <CategoryIndex categoryKey="wellness" config={cfg("wellness")} />,
  },
  {
    path: "/retail",
    element: <CategoryIndex categoryKey="retail" config={cfg("retail")} />,
  },
  { path: "/eat/:slug", element: <PlaceDetail category="eat" /> },
  { path: "/stays/:slug", element: <PlaceDetail category="stays" /> },
  { path: "/wellness/:slug", element: <PlaceDetail category="wellness" /> },
  { path: "/retail/:slug", element: <PlaceDetail category="retail" /> },
  { path: "/transport/:slug", element: <PlaceDetail category="transport" /> },
  { path: "/co-working/:slug", element: <PlaceDetail category="co-working" /> },
  {
    path: "/experiences/:slug",
    element: <PlaceDetail category="experiences" />,
  },
  { path: "/surf/:slug", element: <PlaceDetail category="surf" /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
