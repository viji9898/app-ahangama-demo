import React, { useMemo, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Input,
  Space,
  Tag,
  Switch,
  Collapse,
  Button,
} from "antd";
import { SearchOutlined, ArrowRightOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { MASTER_INDEX } from "../data/masterIndex";

const { Title, Paragraph, Text } = Typography;

function IndexRowCard({ row }) {
  return (
    <div className="mi-rowCard">
      <div className="mi-rowLeft">
        <div className="mi-rowTop">
          <div className="mi-rowTitle">
            <span className="mi-idPill">{row.id}</span>
            <span className="mi-name">{row.name}</span>
          </div>

          <div className="mi-metaRow">
            <span className="mi-metaPill">{row.category}</span>
            <span className="mi-metaPill">{row.area}</span>
          </div>
        </div>

        <div className="mi-whyText">{row.note}</div>
      </div>

      <div className="mi-rowRight">
        {row.offer ? (
          <div className="mi-offerPillPremium">{row.offer}</div>
        ) : (
          <div className="mi-offerMuted">—</div>
        )}
      </div>
    </div>
  );
}

export default function MasterIndex() {
  const canonical = absUrl("/master-index");
  const [q, setQ] = useState("");
  const [offersOnly, setOffersOnly] = useState(false);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return MASTER_INDEX.map((section) => {
      let rows = section.rows;

      if (offersOnly)
        rows = rows.filter((r) => (r.offer || "").trim().length > 0);

      if (query) {
        rows = rows.filter((r) => {
          const hay =
            `${r.id} ${r.name} ${r.category} ${r.area} ${r.note} ${r.offer}`.toLowerCase();
          return hay.includes(query);
        });
      }

      return { ...section, rows };
    }).filter((s) => s.rows.length > 0);
  }, [q, offersOnly]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 110,
      render: (v) => <Tag className="mi-idTag">{v}</Tag>,
    },
    {
      title: "Place",
      dataIndex: "name",
      render: (_, r) => (
        <div className="mi-placeCell">
          <div className="mi-placeTop">
            <Text className="mi-placeName">{r.name}</Text>
            <Space size={8} wrap className="mi-meta">
              <Tag className="mi-metaTag">{r.category}</Tag>
              <Tag className="mi-metaTag">{r.area}</Tag>
            </Space>
          </div>

          <Text className="mi-why">{r.note}</Text>
        </div>
      ),
    },
    {
      title: "Pass offer",
      dataIndex: "offer",
      width: 260,
      render: (v) =>
        v ? (
          <div className="mi-offerWrap">
            <Tag className="mi-offerPill">{v}</Tag>
          </div>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
  ];

  return (
    <SiteLayout>
      <Seo
        title="Master Index — The Travel Pass (Ahangama)"
        description="A calm, curated master list of places included in The Travel Pass — Ahangama."
        canonical={canonical}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Master Index — The Travel Pass (Ahangama)",
          url: canonical,
        }}
      />

      <div className="mi-wrap">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Card className="mi-side" bodyStyle={{ padding: 16 }}>
              <Text
                type="secondary"
                style={{ display: "block", marginBottom: 10 }}
              >
                Jump to section
              </Text>

              <div className="mi-nav">
                {MASTER_INDEX.map((s) => (
                  <a key={s.key} href={`#${s.key}`} className="mi-navLink">
                    {s.title}
                  </a>
                ))}
              </div>

              <div style={{ marginTop: 14 }}>
                <Button block href="/card" icon={<ArrowRightOutlined />}>
                  Get the Pass
                </Button>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={18}>
            <Card className="mi-hero" bodyStyle={{ padding: 18 }}>
              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                <Tag className="mi-pill">THE TRAVEL PASS — AHANGAMA</Tag>
                <Title level={2} className="mi-title" style={{ margin: 0 }}>
                  Master Index
                </Title>
                <Paragraph style={{ margin: 0 }}>
                  A single, clean list of what’s included — designed to be
                  skimmed quickly and trusted.
                </Paragraph>

                <Row gutter={[10, 10]} align="middle" style={{ marginTop: 6 }}>
                  <Col xs={24} md={16}>
                    <Input
                      size="large"
                      placeholder="Search places, areas, offers…"
                      prefix={<SearchOutlined />}
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      className="mi-search"
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <div className="mi-toggle">
                      <Text type="secondary">Offers only</Text>
                      <Switch checked={offersOnly} onChange={setOffersOnly} />
                    </div>
                  </Col>
                </Row>
              </Space>
            </Card>

            <div style={{ marginTop: 14 }}>
              <Collapse
                defaultActiveKey={[MASTER_INDEX[0]?.key]}
                expandIconPosition="end"
                className="mi-collapse"
                items={filtered.map((section) => ({
                  key: section.key,
                  label: (
                    <div id={section.key} className="mi-sectionLabel">
                      <Text strong>{section.title}</Text>
                      <Text type="secondary" style={{ marginLeft: 10 }}>
                        {section.rows.length} places
                      </Text>
                    </div>
                  ),
                  children: (
                    <div className="mi-list">
                      {section.rows.map((r) => (
                        <IndexRowCard key={r.id} row={r} />
                      ))}
                    </div>
                  ),
                }))}
              />
            </div>

            <Card
              className="mi-footerCta"
              style={{ marginTop: 14 }}
              bodyStyle={{ padding: 18 }}
            >
              <Row gutter={[12, 12]} align="middle" justify="space-between">
                <Col>
                  <Title level={4} style={{ margin: 0 }}>
                    Want access to the offers?
                  </Title>
                  <Text type="secondary">
                    Get the pass and use it calmly — once per day per venue
                    (optional).
                  </Text>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    size="large"
                    href="/card"
                    icon={<ArrowRightOutlined />}
                  >
                    Get the Pass
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </SiteLayout>
  );
}
