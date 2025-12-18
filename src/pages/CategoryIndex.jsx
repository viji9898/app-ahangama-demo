import React, { useMemo, useState } from "react";
import { Row, Col, Empty, Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import PageHeader from "../components/ui/PageHeader";
import PlaceCard from "../components/ui/PlaceCard";
import FiltersBar from "../components/ui/FiltersBar";
import { Seo } from "../app/seo";
import { PLACES } from "../data/places";
import { useSearch } from "../app/searchContext";
import { absUrl } from "../app/siteUrl";

const { Text } = Typography;

function normalize(s) {
  return (s || "").toLowerCase().trim();
}

export default function CategoryIndex({ categoryKey, config }) {
  const { query: globalQuery } = useSearch();

  const [localQuery, setLocalQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [perksOnly, setPerksOnly] = useState(false);

  const basePlaces = useMemo(
    () =>
      PLACES.filter(
        (p) => p.destinationSlug === "ahangama" && p.category === categoryKey
      ),
    [categoryKey]
  );

  const allTags = useMemo(() => {
    const s = new Set();
    basePlaces.forEach((p) => {
      (p.bestFor || []).forEach((t) => s.add(t));
      (p.tags || []).forEach((t) => s.add(t));
    });
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [basePlaces]);

  const filtered = useMemo(() => {
    const gq = normalize(globalQuery);
    const lq = normalize(localQuery);

    return basePlaces.filter((p) => {
      if (perksOnly && !p.cardPerk) return false;

      if (selectedTag) {
        const all = [...(p.bestFor || []), ...(p.tags || [])];
        if (!all.includes(selectedTag)) return false;
      }

      if (!gq && !lq) return true;

      const haystack = normalize(
        [
          p.name,
          p.excerpt,
          p.description,
          p.area,
          p.price,
          ...(p.bestFor || []),
          ...(p.tags || []),
        ].join(" ")
      );

      // both queries must match if both exist
      if (gq && !haystack.includes(gq)) return false;
      if (lq && !haystack.includes(lq)) return false;

      return true;
    });
  }, [basePlaces, globalQuery, localQuery, selectedTag, perksOnly]);

  const canonical = absUrl(config.basePath);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: config.seoTitle,
    itemListElement: filtered.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: p.name,
      url: absUrl(`${config.basePath}/${p.slug}`),
    })),
  };

  return (
    <SiteLayout>
      <Seo
        title={config.seoTitle}
        description={config.seoDescription}
        canonical={canonical}
        ogImage={
          (basePlaces[0] && (basePlaces[0].ogImage || basePlaces[0].image)) ||
          undefined
        }
        jsonLd={itemListJsonLd}
      />

      <PageHeader title={config.title} description={config.description} />

      <FiltersBar
        localQuery={localQuery}
        setLocalQuery={setLocalQuery}
        allTags={allTags}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        perksOnly={perksOnly}
        setPerksOnly={setPerksOnly}
      />

      <Row gutter={[12, 12]} style={{ marginTop: 14 }}>
        {filtered.map((p) => (
          <Col xs={24} md={8} key={p.id}>
            <PlaceCard place={p} basePath={config.basePath} />
          </Col>
        ))}
      </Row>

      {filtered.length === 0 && (
        <div style={{ marginTop: 18 }}>
          <Empty
            description={
              <Text type="secondary">
                No matches. Try removing a tag, turning off “perks only”, or
                clearing search.
              </Text>
            }
          />
        </div>
      )}
    </SiteLayout>
  );
}
