import React, { useState } from "react";
import {
  Card,
  Form,
  Select,
  Input,
  Slider,
  Button,
  Table,
  Alert,
  Space,
  Typography,
  Tag,
  Tooltip,
  Empty,
} from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  StarOutlined,
  ExternalLinkOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";

const { Title, Text } = Typography;
const { Option } = Select;

// Place type options for the dropdown
const PLACE_TYPES = [
  { value: "cafe", label: "Cafes", icon: "☕" },
  { value: "restaurant", label: "Restaurants", icon: "🍽️" },
  { value: "bar", label: "Bars", icon: "🍺" },
  { value: "hotel", label: "Hotels", icon: "🏨" },
  { value: "coworking", label: "Coworking", icon: "💻" },
  { value: "gym", label: "Gyms", icon: "💪" },
  { value: "spa", label: "Spas", icon: "🧘" },
];

export default function PlacesTable() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [lastSearch, setLastSearch] = useState(null);

  // Search for places
  const handleSearch = async (values) => {
    setLoading(true);
    setError(null);
    setPlaces([]);

    try {
      const params = new URLSearchParams({
        location: values.location,
        type: values.type,
        radius: values.radius || 2500,
      });

      const response = await fetch(`/.netlify/functions/places?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch places");
      }

      setPlaces(data.places || []);
      setLastSearch({ ...values, resultsCount: data.places?.length || 0, cached: data.cached });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter places based on search text
  const filteredPlaces = places.filter(
    (place) =>
      place.name.toLowerCase().includes(searchText.toLowerCase()) ||
      place.address.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name, record) => (
        <div>
          <Text strong style={{ display: "block" }}>
            {name}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.types.slice(0, 2).join(", ")}
          </Text>
        </div>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 120,
      sorter: (a, b) => b.rating - a.rating,
      defaultSortOrder: "descend",
      render: (rating, record) => (
        <div style={{ textAlign: "center" }}>
          <div>
            <StarOutlined style={{ color: "#faad14", marginRight: 4 }} />
            <Text strong>{rating > 0 ? rating.toFixed(1) : "N/A"}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {record.reviews} reviews
          </Text>
        </div>
      ),
    },
    {
      title: "Reviews",
      dataIndex: "reviews",
      key: "reviews",
      width: 100,
      sorter: (a, b) => b.reviews - a.reviews,
      render: (reviews) => (
        <Text style={{ textAlign: "center", display: "block" }}>
          {reviews.toLocaleString()}
        </Text>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip title={address}>
          <Text>{address}</Text>
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<ExternalLinkOutlined />}
          onClick={() => window.open(record.mapsUrl, "_blank")}
        >
          Maps
        </Button>
      ),
    },
  ];

  return (
    <SiteLayout>
      <div style={{ padding: "24px 0" }}>
        <div className="dm-wrap">
          <Title level={1} style={{ marginBottom: 8 }}>
            Places Search
          </Title>
          <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
            Find cafes, restaurants, hotels, and other places near any location.
          </Text>

          {/* Search Form */}
          <Card
            style={{ marginBottom: 24, borderRadius: 12 }}
            bodyStyle={{ padding: 20 }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSearch}
              initialValues={{
                type: "cafe",
                location: "Ahangama, Sri Lanka",
                radius: 2500,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr auto",
                  gap: 16,
                  alignItems: "end",
                }}
              >
                <Form.Item
                  label="Place Type"
                  name="type"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select place type">
                    {PLACE_TYPES.map((type) => (
                      <Option key={type.value} value={type.value}>
                        <Space>
                          <span>{type.icon}</span>
                          {type.label}
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Location"
                  name="location"
                  rules={[{ required: true }]}
                >
                  <Input
                    prefix={<EnvironmentOutlined />}
                    placeholder="e.g. Ahangama, Sri Lanka"
                  />
                </Form.Item>

                <Form.Item label="Search Radius" name="radius">
                  <div style={{ paddingLeft: 8, paddingRight: 8 }}>
                    <Slider
                      min={500}
                      max={5000}
                      step={100}
                      marks={{
                        500: "500m",
                        2500: "2.5km",
                        5000: "5km",
                      }}
                      tooltip={{
                        formatter: (value) => `${(value / 1000).toFixed(1)}km`,
                      }}
                    />
                  </div>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SearchOutlined />}
                    size="large"
                  >
                    Search
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert
              type="error"
              message="Search Failed"
              description={error}
              style={{ marginBottom: 16 }}
              closable
              onClose={() => setError(null)}
            />
          )}

          {/* Search Results Info */}
          {lastSearch && !loading && (
            <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 12 }}>
              <Space split={<span style={{ color: "#d9d9d9" }}>•</span>}>
                <Text>
                  Found <strong>{lastSearch.resultsCount}</strong> places
                </Text>
                <Text>
                  <strong>{PLACE_TYPES.find(t => t.value === lastSearch.type)?.label}</strong> near{" "}
                  <strong>{lastSearch.location}</strong>
                </Text>
                <Text>
                  Within <strong>{(lastSearch.radius / 1000).toFixed(1)}km</strong>
                </Text>
                {lastSearch.cached && (
                  <Tag color="blue" icon={<ReloadOutlined />}>
                    Cached Results
                  </Tag>
                )}
              </Space>
            </Card>
          )}

          {/* Table Controls */}
          {places.length > 0 && (
            <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 12 }}>
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Input
                  placeholder="Filter by name or address..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300 }}
                  allowClear
                />
                <Text type="secondary">
                  Showing {filteredPlaces.length} of {places.length} places
                </Text>
              </Space>
            </Card>
          )}

          {/* Results Table */}
          <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 0 }}>
            <Table
              columns={columns}
              dataSource={filteredPlaces}
              loading={loading}
              rowKey="placeId"
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} places`,
              }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      lastSearch
                        ? "No places found matching your criteria"
                        : "Search for places to see results here"
                    }
                  />
                ),
              }}
              scroll={{ x: 800 }}
            />
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}