import React, { useMemo, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Input,
  Space,
  Tag,
  Collapse,
  Button,
} from "antd";
import { SearchOutlined, ArrowRightOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { VENDOR_OFFER_FRAMEWORK } from "../data/vendorOfferFramework";

const { Title, Paragraph, Text } = Typography;

function Block({ heading, items }) {
  return (
    <div className="vd-block">
      <Text className="vd-blockTitle">{heading}</Text>
      <ul className="vd-list">
        {items.map((t) => (
          <li key={t} className="vd-li">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Vendors() {
  const canonical = absUrl("/vendors");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return VENDOR_OFFER_FRAMEWORK;

    return VENDOR_OFFER_FRAMEWORK.filter((sec) => {
      const hay = [
        sec.title,
        sec.subtitle,
        sec.why,
        ...sec.blocks.flatMap((b) => [b.heading, ...b.items]),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }, [q]);

  return (
    <SiteLayout>
      <Seo
        title="Vendors — The Travel Pass"
        description="A calm, cost-effective offer framework for vendors partnering with The Travel Pass."
        canonical={canonical}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Vendors — The Travel Pass",
          url: canonical,
        }}
      />

      <div className="vd-wrap">
        <Card className="vd-hero" bodyStyle={{ padding: 20 }}>
          <Tag className="vd-pill">THE TRAVEL PASS</Tag>

          <Row gutter={[14, 14]} align="middle">
            <Col xs={24} md={16}>
              <Title level={2} className="vd-title" style={{ margin: 0 }}>
                Vendor Offer Framework
              </Title>
              <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
                A cost-effective set of perks that feel premium to travellers —
                without turning you into a discount business.
              </Paragraph>
            </Col>

            <Col xs={24} md={8}>
              <Input
                size="large"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                prefix={<SearchOutlined />}
                placeholder="Search offers, categories…"
                className="vd-search"
              />
            </Col>
          </Row>

          <div className="vd-heroCtas">
            <Space wrap size={10}>
              <Button
                type="primary"
                href="/master-index"
                icon={<ArrowRightOutlined />}
              >
                View Master Index
              </Button>
              <Button href="/card">See the Pass</Button>
            </Space>
          </div>
        </Card>

        <div style={{ marginTop: 14 }}>
          <Collapse
            expandIconPosition="end"
            defaultActiveKey={[VENDOR_OFFER_FRAMEWORK[0]?.key]}
            className="vd-collapse"
            items={filtered.map((sec) => ({
              key: sec.key,
              label: (
                <div id={sec.key} className="vd-secLabel">
                  <Text strong>{sec.title}</Text>
                  <Text type="secondary" style={{ marginLeft: 10 }}>
                    {sec.subtitle}
                  </Text>
                </div>
              ),
              children: (
                <div className="vd-secBody">
                  <Row gutter={[14, 14]}>
                    {sec.blocks.map((b) => (
                      <Col key={b.heading} xs={24} md={12}>
                        <Card className="vd-card" bodyStyle={{ padding: 16 }}>
                          <Block heading={b.heading} items={b.items} />
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  <Card className="vd-why" bodyStyle={{ padding: 16 }}>
                    <Text strong>Why vendors like this</Text>
                    <div style={{ height: 6 }} />
                    <Text type="secondary">{sec.why}</Text>
                  </Card>
                </div>
              ),
            }))}
          />
        </div>

        <Card
          className="vd-footer"
          style={{ marginTop: 14 }}
          bodyStyle={{ padding: 18 }}
        >
          <Row gutter={[12, 12]} align="middle" justify="space-between">
            <Col>
              <Title level={4} style={{ margin: 0 }}>
                Want to join the pass?
              </Title>
              <Text type="secondary">
                We’ll help you pick a perk that fits your margins and operating
                style.
              </Text>
            </Col>
            <Col>
              <Button
                type="primary"
                size="large"
                href="/vendors/onboard"
                icon={<ArrowRightOutlined />}
              >
                Vendor onboarding
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
    </SiteLayout>
  );
}
