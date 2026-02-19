import React from "react";
import Home from "../pages/Home";
import HomeV2 from "../pages/HomeV2";
import HomeMobile from "../pages/HomeMobile";
import About from "../pages/About";
import Partners from "../pages/Partners";
import PlaceDetail from "../pages/PlaceDetail";
import CategoryIndex from "../pages/CategoryIndex";
import NotFound from "../NotFound";
import { CATEGORIES } from "../data/categories";
import SearchPage from "../pages/SearchPage";
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
const cfg = (key) => CATEGORIES.find((c) => c.key === key);
export const routes = [
  { path: "/home-v-2", element: <HomeV2 /> },
  { path: "/home-mobile", element: <HomeMobile /> },
  { path: "/home-desktop", element: <HomeDesktop /> },
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/partners", element: <Partners /> },
  { path: "/master-index", element: <MasterIndex /> },
  { path: "/map", element: <MapPage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/map-google", element: <MapGoogle /> },
  { path: "/vendors", element: <Vendors /> },
  { path: "/card", element: <CardLanding /> },
  { path: "/card/buy", element: <CardBuy /> },
  { path: "/card/terms", element: <CardTerms /> },
  { path: "/card/success", element: <PaymentSuccess /> },
  { path: "/card/my", element: <MyCard /> },
  { path: "/card/pass/:cardId", element: <CardPass /> },
  { path: "/card/verify", element: <CardVerify /> },
  { path: "/card/verify/:cardId", element: <CardVerify /> },
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/partner-signup", element: <PartnerSignUp /> },
  { path: "/partner-signup/success", element: <PartnerSignUpSuccess /> },
  { path: "/places", element: <PlacesTable /> },
  {
    path: "/eat",
    element: <CategoryIndex categoryKey="eat" config={cfg("eat")} />,
  },
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
