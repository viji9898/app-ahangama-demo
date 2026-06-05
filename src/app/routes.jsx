import React from "react";
import Home from "../pages/Home";
import HomeV2 from "../pages/HomeV2";
import HomeMobile from "../pages/HomeMobile";
import About from "../pages/About";
import BlogsPage from "../pages/BlogsPage";
import EatEditorialPage from "../pages/EatEditorialPage";
import ConceptPage from "../pages/ConceptPage";
import ProductsIndexPage from "../pages/ProductsIndexPage";
import ProductPage from "../pages/ProductPage";
import Partners from "../pages/Partners";
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
import WhatIsAhangamaPassPage from "../pages/WhatIsAhangamaPassPage";
import VenueQrLandingPage from "../pages/VenueQrLandingPage";
import LocalIntelligencePage from "../pages/LocalIntelligencePage";
import EventsPage from "../pages/EventsPage";
import NewsletterLandingPage from "../pages/NewsletterLandingPage";
import NewsletterPreferencesPage from "../pages/NewsletterPreferencesPage";
import ShopsEditorialPage from "../pages/ShopsEditorialPage";
import ExternalRedirect from "./ExternalRedirect";

const WELLNESS_GUIDE_BLOG_PATH =
  "/blogs/the-ultimate-wellness-guide-to-ahangama-yoga-gyms-pilates-ice-baths-spas";

const GETTING_AROUND_BLOG_PATH =
  "/blogs/getting-around-ahangama-scooters-tuk-tuks-airport-transfers";

const cfg = (key) => CATEGORIES.find((c) => c.key === key);
const routes = [
  { path: "/home-v-2", element: <HomeV2 /> },
  { path: "/home-mobile", element: <HomeMobile /> },
  { path: "/home-desktop", element: <HomeDesktop /> },
  { path: "/qr/:slug", element: <VenueQrLandingPage /> },
  { path: "/", element: <Home /> },
  {
    path: "/getting-around-ahangama-scooters-tuk-tuks-airport-transfers",
    element: <ExternalRedirect to={GETTING_AROUND_BLOG_PATH} />,
  },
  {
    path: "/Getting-Around-Ahangama-Scooters,-Tuk-Tuks-Airport-Transfers",
    element: <ExternalRedirect to={GETTING_AROUND_BLOG_PATH} />,
  },
  { path: "/3-days-in-ahangama", element: <ThreeDaysInAhangamaPage /> },
  { path: "/local-intelligence", element: <LocalIntelligencePage /> },
  { path: "/events", element: <EventsPage /> },
  {
    path: "/the-ultimate-wellness-guide-to-ahangama-yoga-gyms-pilates-ice-baths-spas",
    element: <ExternalRedirect to={WELLNESS_GUIDE_BLOG_PATH} />,
  },
  {
    path: "/The-Ultimate-Wellness-Guide-to-Ahangama:-Yoga-Gyms-Pilates-Ice-Baths-Spas",
    element: <ExternalRedirect to={WELLNESS_GUIDE_BLOG_PATH} />,
  },
  { path: "/what-is-ahangama-pass", element: <WhatIsAhangamaPassPage /> },
  { path: "/offers", element: <FullListPage /> },
  { path: "/full-list", element: <FullListPage /> },
  { path: "/12-things", element: <TwelveThingsPage /> },
  { path: "/about", element: <About /> },
  { path: "/logo", element: <LogoPage /> },
  { path: "/blogs", element: <BlogsPage /> },
  { path: "/blogs/:slug", element: <BlogsPage /> },
  { path: "/concept", element: <ConceptPage /> },
  { path: "/concept/:slug", element: <ConceptPage /> },
  { path: "/products", element: <ProductsIndexPage /> },
  { path: "/product/:slug", element: <ProductPage /> },
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
  { path: "*", element: <NotFound /> },
];

export default routes;
