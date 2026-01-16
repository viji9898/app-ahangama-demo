import React, { useMemo } from "react";
import { Typography, Table, Tag, Avatar } from "antd";
import { PLACES } from "../../data/places";
import { PLACE_STATUS, getPlacesByStatus } from "../../data/placeStatus";

const { Title, Text } = Typography;

export default function ComingSoonSection() {
  const comingSoonPlaces = useMemo(() => {
    return getPlacesByStatus(PLACES, PLACE_STATUS.COMING_SOON);
  }, []);

  // Function to get category-specific colors (matching PassUnlocksSection)
  const getTagColors = (category) => {
    if (category === "stays") {
      return {
        background: "#fff4e6",
        color: "#d46b08",
      };
    }
    if (category === "experiences") {
      return {
        background: "#f6f0ff",
        color: "#8B5A96",
      };
    }
    if (category === "culture") {
      return {
        background: "#e6f7ff",
        color: "#1890ff",
      };
    }
    // Default green for eat and other categories
    return {
      background: "#e8f5e8",
      color: "#2d5016",
    };
  };

  if (comingSoonPlaces.length === 0) {
    return null;
  }

  // Define table columns
  const columns = [
    {
      title: "Business",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {record.logo && (
            <Avatar
              size={40}
              src={record.logo}
              style={{
                backgroundColor: "#f5f5f5",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            />
          )}
          <div>
            <div style={{ fontWeight: "500", fontSize: "16px" }}>{text}</div>
            {record.area && (
              <div style={{ fontSize: "12px", color: "#666" }}>
                {record.area}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 150,
      render: (category) =>
        category ? (
          <Tag
            style={{
              fontSize: "12px",
              textTransform: "capitalize",
              border: "none",
              backgroundColor: getTagColors(category).background,
              color: getTagColors(category).color,
              borderRadius: "6px",
              fontWeight: "500",
              padding: "4px 12px",
            }}
          >
            {category.replace("-", " ")}
          </Tag>
        ) : null,
    },
    {
      title: "Description",
      dataIndex: "excerpt",
      key: "excerpt",
      render: (text) => text || "Coming soon...",
      responsive: ["lg"], // Hide on mobile and tablet, show on large screens
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      render: () => (
        <Tag color="orange" style={{ borderRadius: "6px" }}>
          Coming Soon
        </Tag>
      ),
      responsive: ["lg"], // Hide on mobile and tablet, show on large screens
    },
  ];

  return (
    <section style={{ padding: "60px 0", backgroundColor: "#fafafa" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Title level={2} style={{ marginBottom: "8px" }}>
            Coming Soon
          </Title>
          <Text style={{ fontSize: "16px", color: "#666" }}>
            New partners joining the Ahangama Pass network
          </Text>
        </div>

        <Table
          columns={columns}
          dataSource={comingSoonPlaces.map((place, index) => ({
            ...place,
            key: place.id || place.slug || index,
          }))}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} places`,
          }}
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          }}
        />

        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <Text style={{ fontSize: "14px", color: "#999" }}>
            More partners launching soon. Stay tuned for updates!
          </Text>
        </div>
      </div>
    </section>
  );
}
