import React from "react";
import Home from "../pages/Home";
import PlaceDetail from "../pages/PlaceDetail";
import CategoryIndex from "../pages/CategoryIndex";
import NotFound from "../NotFound";
import { CATEGORIES } from "../data/categories";
import SearchPage from "../pages/SearchPage";
import CardLanding from "../pages/CardLanding";
import CardBuy from "../pages/CardBuy";
import MyCard from "../pages/MyCard";
import CardVerify from "../pages/CardVerify";
import MasterIndex from "../pages/MasterIndex";

const cfg = (key) => CATEGORIES.find((c) => c.key === key);

export const routes = [
  { path: "/", element: <Home /> },
  { path: "/master-index", element: <MasterIndex /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/card", element: <CardLanding /> },
  { path: "/card/buy", element: <CardBuy /> },
  { path: "/card/my", element: <MyCard /> },
  { path: "/card/verify", element: <CardVerify /> },
  { path: "/card/verify/:cardId", element: <CardVerify /> },
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
