import React, { useState, useEffect, useCallback } from "react";
import {
  Table, Card, Typography, Space, Tag, Button, Modal, Form,
  Input, Select, InputNumber, Tabs, Descriptions, Tooltip, Popconfirm,
  message, Image, Switch, Divider, Badge, Row, Col, Spin, Empty,
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, StarFilled,
  ReloadOutlined, SearchOutlined, EnvironmentOutlined,
  InstagramOutlined, LinkOutlined, SaveOutlined,
  RocketOutlined, PictureOutlined, RiseOutlined,
} from "@ant-design/icons";
import "../styles/admin-guide.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const API_BASE = "/api/guide";

const SECTIONS = [
  { key: "best_stays", label: "Best Stays", color: "#6D8967" },
  { key: "best_eats", label: "Best Eats", color: "#C3783F" },
  { key: "best_cafes", label: "Best Cafes", color: "#AA6846" },
  { key: "best_experiences", label: "Best Experiences", color: "#3C6F7E" },
  { key: "wellness", label: "Wellness", color: "#8A6E8A" },
  { key: "night_life", label: "Night Life", color: "#20455C" },
  { key: "best_retail_stores", label: "Best Retail Stores", color: "#8C6948" },
  { key: "transport", label: "Transport", color: "#5A7A6B" },
];

const CONTENT_SECTIONS = [
  { key: "overview", label: "Overview" },
  { key: "best_season", label: "Best Season" },
  { key: "how_long", label: "How Long" },
  { key: "transport_getting_here", label: "Getting Here" },
  { key: "transport_getting_around", label: "Getting Around" },
];

const AdminGuidePage = () => {
  const [venues, setVenues] = useState([]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionFilter, setSectionFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("venues");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [fetchingRating, setFetchingRating] = useState(false);
  const [venueForm] = Form.useForm();
  const [contentForm] = Form.useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [venuesRes, contentRes] = await Promise.all([
        fetch(`${API_BASE}/venues`),
        fetch(`${API_BASE}/content`),
      ]);
      const venuesData = await venuesRes.json();
      const contentData = await contentRes.json();
      if (venuesData.ok) setVenues(venuesData.venues);
      if (contentData.ok) setContent(contentData.content);
    } catch {
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredVenues = venues.filter((v) => {
    const matchSection = !sectionFilter || v.section === sectionFilter;
    const matchSearch = !searchTerm ||
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchSection && matchSearch;
  });

  const stats = {
    total: venues.length,
    active: venues.filter((v) => v.status === "active").length,
    sections: SECTIONS.map((s) => ({
      ...s,
      count: venues.filter((v) => v.section === s.key).length,
    })),
    avgRating: venues.length
      ? (venues.reduce((sum, v) => sum + (v.rating || 0), 0) / venues.length).toFixed(1)
      : "0",
    totalReviews: venues.reduce((sum, v) => sum + (v.reviewCount || 0), 0),
  };

  const openAddModal = () => {
    setEditingVenue(null);
    venueForm.resetFields();
    venueForm.setFieldsValue({ status: "active", priorityOrder: 0, section: "best_stays" });
    setModalOpen(true);
  };

  const openEditModal = (venue) => {
    setEditingVenue(venue);
    venueForm.setFieldsValue({
      ...venue,
      lat: venue.lat || undefined,
      lng: venue.lng || undefined,
    });
    setModalOpen(true);
  };

  const handleSaveVenue = async () => {
    try {
      const values = await venueForm.validateFields();
      setSaving(true);
      const url = editingVenue
        ? `${API_BASE}/venue?id=${editingVenue.id}`
        : `${API_BASE}/venues`;
      const method = editingVenue ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.ok) {
        message.success(editingVenue ? "Venue updated" : "Venue created");
        setModalOpen(false);
        fetchData();
      } else {
        message.error(data.error || "Failed to save");
      }
    } catch (err) {
      if (err.errorFields) return;
      message.error("Failed to save venue");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVenue = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/venue?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        message.success("Venue deleted");
        fetchData();
      } else {
        message.error(data.error || "Failed to delete");
      }
    } catch {
      message.error("Failed to delete venue");
    }
  };

  const handleFetchRating = async () => {
    const placeId = venueForm.getFieldValue("googlePlaceId");
    if (!placeId) {
      message.warning("Enter a Google Place ID first");
      return;
    }
    setFetchingRating(true);
    try {
      const res = await fetch(`${API_BASE}/google-rating?placeId=${encodeURIComponent(placeId)}`);
      const data = await res.json();
      if (data.ok) {
        venueForm.setFieldsValue({ rating: data.rating, reviewCount: data.reviewCount });
        message.success(`Rating: ${data.rating} (${data.reviewCount} reviews)`);
      } else {
        message.error(data.error || "Failed to fetch rating");
      }
    } catch {
      message.error("Failed to fetch Google rating");
    } finally {
      setFetchingRating(false);
    }
  };

  const openContentModal = (item) => {
    setEditingContent(item);
    contentForm.setFieldsValue(item);
    setContentModalOpen(true);
  };

  const handleSaveContent = async () => {
    try {
      const values = await contentForm.validateFields();
      setSaving(true);
      const res = await fetch(`${API_BASE}/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionKey: editingContent.sectionKey, ...values }),
      });
      const data = await res.json();
      if (data.ok) {
        message.success("Content updated");
        setContentModalOpen(false);
        fetchData();
      } else {
        message.error(data.error || "Failed to save");
      }
    } catch (err) {
      if (err.errorFields) return;
      message.error("Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  const venueColumns = [
    {
      title: "Venue",
      key: "venue",
      render: (_, r) => (
        <Space>
          {r.image && (
            <Image
              src={r.image}
              width={48}
              height={48}
              style={{ borderRadius: 8, objectFit: "cover" }}
              preview={false}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJhAPiN9pwQQAAAABJRU5ErkJggg=="
            />
          )}
          <div>
            <Text strong style={{ fontSize: 14 }}>{r.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {SECTIONS.find((s) => s.key === r.section)?.label || r.section}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Rating",
      key: "rating",
      width: 120,
      render: (_, r) => (
        <Space size={4}>
          <StarFilled style={{ color: "#E8B84B", fontSize: 14 }} />
          <Text strong>{r.rating || "—"}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>({r.reviewCount || 0})</Text>
        </Space>
      ),
    },
    {
      title: "Coords",
      key: "coords",
      width: 140,
      render: (_, r) => r.lat && r.lng
        ? <Text type="secondary" style={{ fontSize: 12 }}>{r.lat.toFixed(4)}, {r.lng.toFixed(4)}</Text>
        : <Text type="secondary">—</Text>,
    },
    {
      title: "Links",
      key: "links",
      width: 120,
      render: (_, r) => (
        <Space size={8}>
          {r.instagram && (
            <Tooltip title="Instagram">
              <a href={r.instagram} target="_blank" rel="noopener noreferrer">
                <InstagramOutlined style={{ fontSize: 16, color: "#E1306C" }} />
              </a>
            </Tooltip>
          )}
          {r.googleMaps && (
            <Tooltip title="Google Maps">
              <a href={r.googleMaps} target="_blank" rel="noopener noreferrer">
                <EnvironmentOutlined style={{ fontSize: 16, color: "#4285F4" }} />
              </a>
            </Tooltip>
          )}
          {r.website && (
            <Tooltip title="Website">
              <a href={r.website} target="_blank" rel="noopener noreferrer">
                <LinkOutlined style={{ fontSize: 16, color: "#4f6f86" }} />
              </a>
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (s) => (
        <Tag color={s === "active" ? "green" : s === "draft" ? "orange" : "default"}>
          {s?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEditModal(r)} />
          <Popconfirm title="Delete this venue?" onConfirm={() => handleDeleteVenue(r.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="ag-admin">
      <div className="ag-admin-header">
        <div>
          <Title level={3} style={{ margin: 0 }}>Guide Dashboard</Title>
          <Text type="secondary">Manage venues and content for the Ahangama Guide</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>Refresh</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            Add Venue
          </Button>
        </Space>
      </div>

      {/* Stats Row */}
      <Row gutter={[16, 16]} className="ag-stats-row">
        <Col xs={12} sm={6}>
          <Card size="small" className="ag-stat-card">
            <Text type="secondary" style={{ fontSize: 12 }}>Total Venues</Text>
            <div className="ag-stat-value">{stats.total}</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="ag-stat-card">
            <Text type="secondary" style={{ fontSize: 12 }}>Active</Text>
            <div className="ag-stat-value" style={{ color: "#52c41a" }}>{stats.active}</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="ag-stat-card">
            <Text type="secondary" style={{ fontSize: 12 }}>Avg Rating</Text>
            <div className="ag-stat-value" style={{ color: "#E8B84B" }}>
              <StarFilled style={{ fontSize: 14 }} /> {stats.avgRating}
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="ag-stat-card">
            <Text type="secondary" style={{ fontSize: 12 }}>Total Reviews</Text>
            <div className="ag-stat-value">{stats.totalReviews.toLocaleString()}</div>
          </Card>
        </Col>
      </Row>

      {/* Section Badges */}
      <div className="ag-section-badges">
        {stats.sections.map((s) => (
          <Badge
            key={s.key}
            count={s.count}
            showZero
            style={{ backgroundColor: s.color }}
            offset={[-4, 0]}
          >
            <Tag
              className="ag-section-tag"
              style={{
                borderColor: sectionFilter === s.key ? s.color : undefined,
                color: sectionFilter === s.key ? s.color : undefined,
                background: sectionFilter === s.key ? `${s.color}11` : undefined,
              }}
              onClick={() => setSectionFilter(sectionFilter === s.key ? "" : s.key)}
            >
              {s.label}
            </Tag>
          </Badge>
        ))}
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="ag-tabs">
        <TabPane tab={`Venues (${venues.length})`} key="venues">
          <Card bodyStyle={{ padding: 0 }}>
            <div className="ag-toolbar">
              <Input
                placeholder="Search venues..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 280 }}
                allowClear
              />
            </div>
            <Table
              columns={venueColumns}
              dataSource={filteredVenues}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 15, showSizeChanger: true, showTotal: (t) => `${t} venues` }}
              scroll={{ x: 900 }}
              size="middle"
            />
          </Card>
        </TabPane>

        <TabPane tab={`Content (${content.length})`} key="content">
          <Row gutter={[16, 16]}>
            {content.map((item) => (
              <Col xs={24} sm={12} lg={8} key={item.sectionKey}>
                <Card
                  hoverable
                  onClick={() => openContentModal(item)}
                  className="ag-content-card"
                  actions={[<EditOutlined key="edit" />]}
                >
                  <Title level={5} style={{ margin: 0, marginBottom: 8 }}>
                    {item.title || item.sectionKey}
                  </Title>
                  <Paragraph
                    type="secondary"
                    ellipsis={{ rows: 3 }}
                    style={{ margin: 0, fontSize: 13 }}
                  >
                    {item.body || "No content yet"}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </TabPane>
      </Tabs>

      {/* Add/Edit Venue Modal */}
      <Modal
        title={editingVenue ? "Edit Venue" : "Add New Venue"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSaveVenue}
        confirmLoading={saving}
        width={720}
        okText={editingVenue ? "Update" : "Create"}
        destroyOnClose
      >
        <Form form={venueForm} layout="vertical" className="ag-venue-form">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="name" label="Venue Name" rules={[{ required: true }]}>
                <Input placeholder="e.g. Kai Rooftop" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="section" label="Section" rules={[{ required: true }]}>
                <Select>
                  {SECTIONS.map((s) => (
                    <Select.Option key={s.key} value={s.key}>{s.label}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description">
            <TextArea rows={2} placeholder="Short description for the guide card" />
          </Form.Item>

          <Form.Item name="tagline" label="Tagline">
            <Input placeholder="Optional tagline (e.g. Local Woman-Owned)" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="image" label="Image URL">
                <Input
                  prefix={<PictureOutlined />}
                  placeholder="https://res.cloudinary.com/..."
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="lat" label="Latitude">
                <InputNumber style={{ width: "100%" }} placeholder="5.9730" step={0.0001} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="lng" label="Longitude">
                <InputNumber style={{ width: "100%" }} placeholder="80.3628" step={0.0001} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="rating" label="Rating">
                <InputNumber style={{ width: "100%" }} min={0} max={5} step={0.1} placeholder="4.9" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="reviewCount" label="Review Count">
                <InputNumber style={{ width: "100%" }} min={0} placeholder="286" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="priorityOrder" label="Order">
                <InputNumber style={{ width: "100%" }} min={0} placeholder="1" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13, margin: "8px 0 16px" }}>
            Google Place ID & Live Rating
          </Divider>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="googlePlaceId" label="Google Place ID">
                <Input placeholder="ChIJ..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label=" " labelCol={0}>
                <Button
                  icon={<RiseOutlined />}
                  onClick={handleFetchRating}
                  loading={fetchingRating}
                  block
                >
                  Fetch Rating
                </Button>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13, margin: "8px 0 16px" }}>
            Links
          </Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="instagram" label="Instagram URL">
                <Input prefix={<InstagramOutlined />} placeholder="https://instagram.com/..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="googleMaps" label="Google Maps URL">
                <Input prefix={<EnvironmentOutlined />} placeholder="https://maps.app.goo.gl/..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="website" label="Website URL">
                <Input prefix={<LinkOutlined />} placeholder="https://..." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="ownership" label="Ownership">
                <Select allowClear placeholder="Select">
                  <Select.Option value="local">Local</Select.Option>
                  <Select.Option value="foreign">Foreign</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="Status">
                <Select>
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="draft">Draft</Select.Option>
                  <Select.Option value="archived">Archived</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Edit Content Modal */}
      <Modal
        title={`Edit: ${editingContent?.title || ""}`}
        open={contentModalOpen}
        onCancel={() => setContentModalOpen(false)}
        onOk={handleSaveContent}
        confirmLoading={saving}
        width={640}
        okText="Save Changes"
        destroyOnClose
      >
        <Form form={contentForm} layout="vertical">
          <Form.Item name="title" label="Section Title">
            <Input />
          </Form.Item>
          <Form.Item name="body" label="Content Body">
            <TextArea rows={6} />
          </Form.Item>
          <Form.Item name="image" label="Image URL (optional)">
            <Input prefix={<PictureOutlined />} placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminGuidePage;
