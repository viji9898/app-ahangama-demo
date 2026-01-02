import React from "react";
import { Row, Col, Space, Typography, Input, Button, Tag } from "antd";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useSearch } from "../../app/searchContext";

const { Text } = Typography;

export default function TopNav() {
  const { query, setQuery } = useSearch();
  const nav = useNavigate();
  const loc = useLocation();

  const onSearch = (value) => {
    setQuery(value || "");
    // If user searches from elsewhere, jump to a default browse page (eat)
    if (
      !loc.pathname.startsWith("/eat") &&
      !loc.pathname.startsWith("/stays") &&
      !loc.pathname.startsWith("/experiences")
    ) {
      nav("/eat");
    }
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #eee",
        padding: 12,
      }}
    >
      <Row align="middle" justify="space-between" gutter={[12, 12]}>
        <Col>
          <Space align="center" size={10}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "#111",
              }}
            />
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Text strong>DEMO_SITE - LAUNCHING SOON</Text>
            </Link>
            {/* <Tag>Curated</Tag> */}
          </Space>
        </Col>

        {/* <Col flex="auto" style={{ maxWidth: 520 }}>
          <Input
            placeholder="Search places (coffee, surf, long-stay...)"
            allowClear
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onPressEnter={(e) => onSearch(e.currentTarget.value)}
          />
        </Col> */}

        <Col>
          <Button type="primary" href="/card">
            Get the Card
          </Button>
        </Col>
      </Row>
    </div>
  );
}
