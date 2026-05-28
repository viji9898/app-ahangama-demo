import React from "react";
import { useParams } from "react-router-dom";
import NotFound from "../NotFound";
import ProductTwelveMustDoThingsPage from "./ProductTwelveMustDoThingsPage";
import ProductFreeAhangamaPassPage from "./ProductFreeAhangamaPassPage";
import Product5UsdAhangamaPassPage from "./Product5UsdAhangamaPassPage";

export default function ProductPage() {
  const { slug } = useParams();

  if (!slug) {
    return <NotFound />;
  }

  if (slug === "12-must-do-things") {
    return <ProductTwelveMustDoThingsPage />;
  }

  if (slug === "free-ahangama-pass") {
    return <ProductFreeAhangamaPassPage />;
  }

  if (slug === "5usd-ahangama-pass") {
    return <Product5UsdAhangamaPassPage />;
  }

  return <NotFound />;
}
