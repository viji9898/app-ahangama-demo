import React from "react";
import Home from "../pages/Home";
import About from "../pages/About";
import Partners from "../pages/Partners";
import PlaceDetail from "../pages/PlaceDetail";
import CategoryIndex from "../pages/CategoryIndex";
import NotFound from "../NotFound";
import { CATEGORIES } from "../data/categories";
import SearchPage from "../pages/SearchPage";
import CardLanding from "../pages/CardLanding";
import CardBuy from "../pages/CardBuy";
import MyCard from "../pages/MyCard";
import CardVerify from "../pages/CardVerify";
import PaymentSuccess from "../pages/PaymentSuccess";
import MasterIndex from "../pages/MasterIndex";
import Vendors from "../pages/Vendors";
import MapPage from "../pages/Map";
import MapGoogle from "../pages/MapGoogle";
import AdminDashboard from "../pages/AdminDashboard";
import PlacesTable from "../pages/PlacesTable";

const cfg = (key) => CATEGORIES.find((c) => c.key === key);

export const routes = [
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
  { path: "/card/success", element: <PaymentSuccess /> },
  { path: "/card/my", element: <MyCard /> },
  { path: "/card/verify", element: <CardVerify /> },
  { path: "/card/verify/:cardId", element: <CardVerify /> },
  { path: "/admin", element: <AdminDashboard /> },
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
    path: "/experiences",
    element: (
      <CategoryIndex categoryKey="experiences" config={cfg("experiences")} />
    ),
  },

  { path: "/eat/:slug", element: <PlaceDetail category="eat" /> },
  { path: "/stays/:slug", element: <PlaceDetail category="stays" /> },
  {
    path: "/experiences/:slug",
    element: <PlaceDetail category="experiences" />,
  },

  { path: "*", element: <NotFound /> },
];
