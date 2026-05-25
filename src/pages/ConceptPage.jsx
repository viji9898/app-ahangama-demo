import React from "react";
import { useParams } from "react-router-dom";
import NotFound from "../NotFound";
import ConceptBlogStrategyPage from "./ConceptBlogStrategyPage";
import ConceptDistributionPage from "./ConceptDistributionPage";
import ConceptFreePassPage from "./ConceptFreePassPage";
import ConceptGuidePage from "./ConceptGuidePage";
import ConceptIndexPage from "./ConceptIndexPage";
import ConceptPremiumPassPage from "./ConceptPremiumPassPage";
import ConceptTwelveThingsPage from "./ConceptTwelveThingsPage";

export default function ConceptPage() {
  const { slug } = useParams();

  if (!slug) {
    return <ConceptIndexPage />;
  }

  if (slug === "12-things") {
    return <ConceptTwelveThingsPage />;
  }

  if (slug === "free-pass") {
    return <ConceptFreePassPage />;
  }

  if (slug === "distribution") {
    return <ConceptDistributionPage />;
  }

  if (slug === "premium-pass") {
    return <ConceptPremiumPassPage />;
  }

  if (slug === "guide-26-27") {
    return <ConceptGuidePage />;
  }

  if (slug === "blog-strategy") {
    return <ConceptBlogStrategyPage />;
  }

  return <NotFound />;
}
