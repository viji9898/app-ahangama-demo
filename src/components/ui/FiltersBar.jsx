import React from "react";
import { Card, Input, Space, Switch, Tag, Typography } from "antd";

const { Text } = Typography;

export default function FiltersBar({
  localQuery,
  setLocalQuery,
  allTags,
  selectedTag,
  setSelectedTag,
  perksOnly,
  setPerksOnly,
}) {
  return (
    <Card
      style={{ marginTop: 14, borderRadius: 16, border: "1px solid #eee" }}
      bodyStyle={{ padding: 14 }}
    >
      <Space direction="vertical" size={10} style={{ width: "100%" }}>
        <Input
          placeholder="Filter in this category…"
          allowClear
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
        />

        <Space wrap align="center" size={[8, 8]}>
          <Text type="secondary">Tags:</Text>
          <Tag
            color={!selectedTag ? "blue" : "default"}
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedTag(null)}
          >
            All
          </Tag>

          {allTags.map((t) => (
            <Tag
              key={t}
              color={selectedTag === t ? "blue" : "default"}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedTag(t)}
            >
              {t}
            </Tag>
          ))}
        </Space>

        <Space align="center">
          <Switch checked={perksOnly} onChange={setPerksOnly} />
          <Text>Show places with Ahangama Card perks only</Text>
        </Space>
      </Space>
    </Card>
  );
}
