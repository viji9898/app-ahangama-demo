import React from "react";
import { Row, Col } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import PageHeader from "../components/ui/PageHeader";
import PlaceCard from "../components/ui/PlaceCard";
import { Seo } from "../app/seo";
import { PLACES } from "../data/places";

export default function EatIndex() {
  const places = PLACES.filter(
    (p) => p.destinationSlug === "ahangama" && p.category === "eat"
  );

  const canonical = `${import.meta.env.VITE_SITE_URL}/eat`;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Eat & Drink in Ahangama",
    itemListElement: places.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: p.name,
      url: `${import.meta.env.VITE_SITE_URL}/eat/${p.slug}`,
    })),
  };

  return (
    <SiteLayout>
      <Seo
        title="Eat & Drink in Ahangama"
        description="Curated cafés, restaurants, and bars in Ahangama — no rankings, no noise."
        canonical={canonical}
        ogImage={places[0]?.ogImage}
        jsonLd={itemListJsonLd}
      />

      <PageHeader
        title="Eat & Drink"
        description="A curated selection of cafés, restaurants, and bars in Ahangama — chosen for consistency, atmosphere, and places you’ll actually return to."
      />

      <Row gutter={[12, 12]} style={{ marginTop: 14 }}>
        {places.map((p) => (
          <Col xs={24} md={8} key={p.id}>
            <PlaceCard place={p} basePath="/eat" />
          </Col>
        ))}
      </Row>
    </SiteLayout>
  );
}
