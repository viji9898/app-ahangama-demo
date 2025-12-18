import React, { useMemo } from "react";
import { Row, Col, Typography } from "antd";
import PlaceCard from "./PlaceCard";

const { Title } = Typography;

export default function RelatedPlaces({
  place,
  allPlaces,
  basePath,
  limit = 3,
}) {
  const related = useMemo(() => {
    const tags = new Set([...(place.bestFor || []), ...(place.tags || [])]);

    const scored = allPlaces
      .filter((p) => p.category === place.category && p.id !== place.id)
      .map((p) => {
        const t = new Set([...(p.bestFor || []), ...(p.tags || [])]);
        let score = 0;
        tags.forEach((x) => {
          if (t.has(x)) score += 1;
        });
        return { p, score };
      })
      .sort((a, b) => b.score - a.score);

    // fall back to same category even if score is 0
    return scored.slice(0, limit).map((x) => x.p);
  }, [place, allPlaces, limit]);

  if (!related.length) return null;

  return (
    <div style={{ marginTop: 14 }}>
      <Title level={4} style={{ marginTop: 0 }}>
        Related
      </Title>
      <Row gutter={[12, 12]}>
        {related.map((p) => (
          <Col xs={24} md={8} key={p.id}>
            <PlaceCard place={p} basePath={basePath} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
