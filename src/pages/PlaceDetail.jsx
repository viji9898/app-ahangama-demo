import React from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Button,
  Divider,
  Breadcrumb,
} from "antd";
import { EnvironmentOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { PLACES } from "../data/places";
import { absUrl } from "../app/siteUrl";
import RelatedPlaces from "../components/ui/RelatedPlaces";

const { Title, Paragraph, Text } = Typography;

export default function PlaceDetail({ category }) {
  const { slug } = useParams();

  const place = PLACES.find(
    (p) =>
      p.destinationSlug === "ahangama" &&
      p.category === category &&
      p.slug === slug
  );

  if (!place) {
    return (
      <SiteLayout>
        <Card
          style={{ borderRadius: 16, border: "1px solid #eee" }}
          bodyStyle={{ padding: 20 }}
        >
          <Title level={3} style={{ marginTop: 0 }}>
            Not found
          </Title>
          <Button href={`/${category}`} icon={<ArrowLeftOutlined />}>
            Back
          </Button>
        </Card>
      </SiteLayout>
    );
  }

  const basePath = `/${category}`;
  const canonical = absUrl(`${basePath}/${place.slug}`);
  const categoryUrl = absUrl(basePath);
  const homeUrl = absUrl("/");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ahangama",
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category, // or a human title if you prefer
        item: categoryUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: place.name,
        item: canonical,
      },
    ],
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: place.name,
    areaServed: "Ahangama, Sri Lanka",
    url: canonical,
    image: place.ogImage || place.image,
  };

  // Provide both schemas in one script
  const jsonLd = [breadcrumbJsonLd, localBusinessJsonLd];

  return (
    <SiteLayout>
      <Seo
        title={`${place.name} — Ahangama`}
        description={place.excerpt}
        canonical={canonical}
        ogImage={place.ogImage || place.image}
        jsonLd={jsonLd}
      />

      <Card
        style={{ borderRadius: 16, border: "1px solid #eee" }}
        bodyStyle={{ padding: 12 }}
      >
        <Row justify="space-between" align="middle" gutter={[12, 12]}>
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item>
                <a href="/">Ahangama</a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <a href={`/${category}`}>{category}</a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{place.name}</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col>
            <Button href={`/${category}`} icon={<ArrowLeftOutlined />}>
              Back
            </Button>
          </Col>
        </Row>
      </Card>

      <Card
        style={{ marginTop: 14, borderRadius: 16, border: "1px solid #eee" }}
        bodyStyle={{ padding: 20 }}
      >
        <Row gutter={[16, 16]} align="top">
          <Col xs={24} md={14}>
            <Title level={1} style={{ marginTop: 0 }}>
              {place.name}
            </Title>
            <Paragraph style={{ fontSize: 16 }}>{place.description}</Paragraph>

            <Space wrap size={[6, 6]} style={{ marginBottom: 10 }}>
              {place.bestFor?.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </Space>

            {place.cardPerk && <Tag color="green">{place.cardPerk}</Tag>}

            <Divider />

            <Text>
              <strong>Area:</strong> {place.area}
            </Text>
            <br />
            <Text>
              <strong>Hours:</strong> {place.hours}
            </Text>
            <br />
            <Text>
              <strong>Price:</strong> {place.price}
            </Text>

            <div style={{ marginTop: 14 }}>
              <Button
                type="primary"
                icon={<EnvironmentOutlined />}
                href={place.mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open in Google Maps
              </Button>
            </div>
          </Col>

          <Col xs={24} md={10}>
            <div
              style={{
                height: 280,
                borderRadius: 16,
                background: `url(${place.image}) center/cover no-repeat`,
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            />
            <div style={{ marginTop: 12 }}>
              <Title level={5} style={{ marginTop: 0 }}>
                Vibe
              </Title>
              <Space wrap size={[6, 6]}>
                {place.tags?.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </Space>
            </div>
          </Col>
        </Row>
      </Card>
      <RelatedPlaces
        place={place}
        allPlaces={PLACES.filter((p) => p.destinationSlug === "ahangama")}
        basePath={basePath}
      />
    </SiteLayout>
  );
}
