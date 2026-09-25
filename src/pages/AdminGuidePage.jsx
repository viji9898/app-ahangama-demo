import React, { useState, useEffect, useCallback } from "react";
import {
  Table, Typography, Space, Tag, Button, Modal, Form,
  Input, Select, InputNumber, Tabs, Tooltip, Popconfirm,
  message, Image, Divider, Badge, Row, Col, Spin,
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, StarFilled,
  ReloadOutlined, SearchOutlined, EnvironmentOutlined,
  InstagramOutlined, LinkOutlined,
  PictureOutlined, RiseOutlined, SettingOutlined,
  FileTextOutlined, DashboardOutlined, AppstoreOutlined,
} from "@ant-design/icons";
import "../styles/admin-guide.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const API_BASE = "/api/guide";
const ADMIN_PASSWORD_STORAGE_KEY = "ahangama-guide-admin-password";

const SECTIONS = [
  { key: "best_stays", label: "Best Stays", color: "#6D8967", icon: "\u{1F3E8}" },
  { key: "best_eats", label: "Best Eats", color: "#C3783F", icon: "\u{1F37D}" },
  { key: "best_cafes", label: "Best Cafes", color: "#AA6846", icon: "\u2615" },
  { key: "best_experiences", label: "Experiences", color: "#3C6F7E", icon: "\u{1F3AF}" },
  { key: "wellness", label: "Wellness", color: "#8A6E8A", icon: "\u{1F9D8}" },
  { key: "night_life", label: "Night Life", color: "#20455C", icon: "\u{1F303}" },
  { key: "best_retail_stores", label: "Retail", color: "#8C6948", icon: "\u{1F6CD}" },
  { key: "surf_schools", label: "Surf Schools", color: "#2E86AB", icon: "\u{1F3C4}" },
  { key: "transport", label: "Transport", color: "#5A7A6B", icon: "\u{1F6F2}" },
];

const AdminGuidePage = () => {
  const [adminPassword, setAdminPassword] = useState(() => {
    try {
      return sessionStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });
  const [loginPassword, setLoginPassword] = useState("");
  const [authenticating, setAuthenticating] = useState(false);
  const [venues, setVenues] = useState([]);
  const [canonicalVenues, setCanonicalVenues] = useState([]);
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
  const selectedVenueId = Form.useWatch("venueId", venueForm);
  const selectedCanonicalVenue = canonicalVenues.find(
    (venue) => venue.id === selectedVenueId,
  );

  const adminFetch = useCallback((url, options = {}) => {
    const headers = new Headers(options.headers || {});
    headers.set("X-Admin-Password", adminPassword);
    return fetch(url, { ...options, headers });
  }, [adminPassword]);

  const fetchData = useCallback(async () => {
    if (!adminPassword) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [venuesRes, contentRes, canonicalVenuesRes] = await Promise.all([
        adminFetch(`${API_BASE}/venues`),
        adminFetch(`${API_BASE}/content`),
        adminFetch("/api/venues?destinationSlug=ahangama"),
      ]);
      if (venuesRes.status === 401 || contentRes.status === 401) {
        try {
          sessionStorage.removeItem(ADMIN_PASSWORD_STORAGE_KEY);
        } catch {
          // Ignore storage failures in restricted browsing modes.
        }
        setAdminPassword("");
        throw new Error("Unauthorized");
      }
      const venuesData = await venuesRes.json();
      const contentData = await contentRes.json();
      const canonicalVenuesData = await canonicalVenuesRes.json();
      if (venuesData.ok) setVenues(venuesData.venues);
      if (contentData.ok) setContent(contentData.content);
      if (canonicalVenuesData.ok) setCanonicalVenues(canonicalVenuesData.venues);
    } catch {
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [adminFetch, adminPassword]);

  useEffect(() => {
    if (adminPassword) fetchData();
  }, [adminPassword, fetchData]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setAuthenticating(true);
    try {
      const response = await fetch(`${API_BASE}/venues`, {
        headers: { "X-Admin-Password": loginPassword },
      });
      if (!response.ok) throw new Error("Invalid password");
      try {
        sessionStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, loginPassword);
      } catch {
        // The active React state still keeps the session usable.
      }
      setAdminPassword(loginPassword);
      setLoginPassword("");
    } catch {
      message.error("Incorrect admin password");
    } finally {
      setAuthenticating(false);
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(ADMIN_PASSWORD_STORAGE_KEY);
    } catch {
      // Ignore storage failures in restricted browsing modes.
    }
    setAdminPassword("");
    setVenues([]);
    setCanonicalVenues([]);
    setContent([]);
  };

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
      canonicalName: venue.canonicalName,
      nameOverride: venue.nameOverride,
      lat: venue.lat || undefined,
      lng: venue.lng || undefined,
    });
    setModalOpen(true);
  };

  const handleSaveVenue = async () => {
    try {
      const values = await venueForm.validateFields();
      setSaving(true);
      const url = editingVenue ? `${API_BASE}/venue?id=${editingVenue.id}` : `${API_BASE}/venues`;
      const method = editingVenue ? "PUT" : "POST";
      const payload = editingVenue
        ? values
        : { ...values, name: selectedCanonicalVenue?.name };
      const res = await adminFetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.ok) { message.success(editingVenue ? "Venue updated" : "Venue added to category"); setModalOpen(false); fetchData(); }
      else { message.error(data.error || "Failed to save"); }
    } catch (err) { if (err.errorFields) return; message.error("Failed to save venue"); }
    finally { setSaving(false); }
  };

  const handleDeleteVenue = async (id) => {
    try {
      const res = await adminFetch(`${API_BASE}/venue?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) { message.success("Venue deleted"); fetchData(); }
      else { message.error(data.error || "Failed to delete"); }
    } catch { message.error("Failed to delete venue"); }
  };

  const handleFetchRating = async () => {
    const placeId = venueForm.getFieldValue("googlePlaceId");
    if (!placeId) { message.warning("Enter a Google Place ID first"); return; }
    setFetchingRating(true);
    try {
      const res = await adminFetch(`${API_BASE}/google-rating?placeId=${encodeURIComponent(placeId)}`);
      const data = await res.json();
      if (data.ok) { venueForm.setFieldsValue({ rating: data.rating, reviewCount: data.reviewCount }); message.success(`Rating: ${data.rating} (${data.reviewCount} reviews)`); }
      else { message.error(data.error || "Failed to fetch rating"); }
    } catch { message.error("Failed to fetch Google rating"); }
    finally { setFetchingRating(false); }
  };

  const openContentModal = (item) => { setEditingContent(item); contentForm.setFieldsValue(item); setContentModalOpen(true); };

  const handleSaveContent = async () => {
    try {
      const values = await contentForm.validateFields();
      setSaving(true);
      const res = await adminFetch(`${API_BASE}/content`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sectionKey: editingContent.sectionKey, ...values }) });
      const data = await res.json();
      if (data.ok) { message.success("Content updated"); setContentModalOpen(false); fetchData(); }
      else { message.error(data.error || "Failed to save"); }
    } catch (err) { if (err.errorFields) return; message.error("Failed to save content"); }
    finally { setSaving(false); }
  };

  if (!adminPassword) {
    return (
      <div className="ag-admin">
        <div className="ag-main-card" style={{ maxWidth: 440, margin: "15vh auto 0", padding: 32 }}>
          <div className="ag-modal-header">
            <div>
              <h1 className="ag-title">Guide Dashboard</h1>
              <p className="ag-subtitle">Enter the admin password to continue.</p>
            </div>
          </div>
          <form onSubmit={handleLogin}>
            <Input.Password
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              placeholder="Admin password"
              autoComplete="current-password"
              size="large"
              autoFocus
            />
            <button
              type="submit"
              className="ag-btn ag-btn--primary ag-btn--full"
              style={{ marginTop: 16 }}
              disabled={!loginPassword || authenticating}
            >
              {authenticating ? "Checking..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const venueColumns = [
    {
      title: "Venue",
      key: "venue",
      render: (_, r) => (
        <div className="ag-venue-cell">
          {r.image && (
            <Image
              src={r.image}
              width={44}
              height={44}
              style={{ borderRadius: 10, objectFit: "cover", flexShrink: 0 }}
              preview={false}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJhAPiN9pwQQAAAABJRU5ErkJggg=="
            />
          )}
          <div className="ag-venue-cell-text">
            <span className="ag-venue-name">{r.name}</span>
            <span className="ag-venue-section">{SECTIONS.find((s) => s.key === r.section)?.label || r.section}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Rating",
      key: "rating",
      width: 110,
      render: (_, r) => (
        <div className="ag-rating-cell">
          <StarFilled className="ag-star" />
          <span className="ag-rating-num">{r.rating || "\u2014"}</span>
          <span className="ag-rating-count">({r.reviewCount || 0})</span>
        </div>
      ),
    },
    {
      title: "Location",
      key: "coords",
      width: 130,
      render: (_, r) => r.lat && r.lng
        ? <span className="ag-coords">{r.lat.toFixed(4)}, {r.lng.toFixed(4)}</span>
        : <span className="ag-empty">\u2014</span>,
    },
    {
      title: "Links",
      key: "links",
      width: 100,
      render: (_, r) => (
        <Space size={10}>
          {r.instagram && (
            <Tooltip title="Instagram"><a href={r.instagram} target="_blank" rel="noopener noreferrer" className="ag-link ag-link--insta"><InstagramOutlined /></a></Tooltip>
          )}
          {r.googleMaps && (
            <Tooltip title="Google Maps"><a href={r.googleMaps} target="_blank" rel="noopener noreferrer" className="ag-link ag-link--maps"><EnvironmentOutlined /></a></Tooltip>
          )}
          {r.website && (
            <Tooltip title="Website"><a href={r.website} target="_blank" rel="noopener noreferrer" className="ag-link ag-link--web"><LinkOutlined /></a></Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 90,
      render: (s) => <span className={`ag-status ag-status--${s}`}>{s?.toUpperCase()}</span>,
    },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, r) => (
        <Space size={4}>
          <button className="ag-action-btn" onClick={() => openEditModal(r)}><EditOutlined /></button>
          <Popconfirm title="Delete this venue?" onConfirm={() => handleDeleteVenue(r.id)} okText="Delete" cancelText="Cancel">
            <button className="ag-action-btn ag-action-btn--danger"><DeleteOutlined /></button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="ag-admin">
      <div className="ag-bg-orbs" aria-hidden="true">
        <span className="ag-orb ag-orb--1" />
        <span className="ag-orb ag-orb--2" />
        <span className="ag-orb ag-orb--3" />
      </div>

      <header className="ag-header">
        <div className="ag-header-left">
          <div className="ag-header-icon">
            <DashboardOutlined />
          </div>
          <div>
            <h1 className="ag-title">Guide Dashboard</h1>
            <p className="ag-subtitle">Manage venues and content for the Ahangama Guide</p>
          </div>
        </div>
        <div className="ag-header-actions">
          <button className="ag-btn ag-btn--ghost" onClick={handleLogout}>
            Sign Out
          </button>
          <button className="ag-btn ag-btn--ghost" onClick={fetchData} disabled={loading}>
            <ReloadOutlined className={loading ? "ag-spin" : ""} /> Refresh
          </button>
          <button className="ag-btn ag-btn--primary" onClick={openAddModal}>
            <PlusOutlined /> Add Venue
          </button>
        </div>
      </header>

      <div className="ag-stats-grid">
        <div className="ag-stat-card ag-stat-card--total">
          <div className="ag-stat-icon"><AppstoreOutlined /></div>
          <div className="ag-stat-body">
            <span className="ag-stat-label">Total Venues</span>
            <span className="ag-stat-value">{stats.total}</span>
          </div>
        </div>
        <div className="ag-stat-card ag-stat-card--active">
          <div className="ag-stat-icon"><SettingOutlined /></div>
          <div className="ag-stat-body">
            <span className="ag-stat-label">Active</span>
            <span className="ag-stat-value">{stats.active}</span>
          </div>
        </div>
        <div className="ag-stat-card ag-stat-card--rating">
          <div className="ag-stat-icon"><StarFilled /></div>
          <div className="ag-stat-body">
            <span className="ag-stat-label">Avg Rating</span>
            <span className="ag-stat-value">{stats.avgRating}</span>
          </div>
        </div>
        <div className="ag-stat-card ag-stat-card--reviews">
          <div className="ag-stat-icon"><FileTextOutlined /></div>
          <div className="ag-stat-body">
            <span className="ag-stat-label">Total Reviews</span>
            <span className="ag-stat-value">{stats.totalReviews.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="ag-section-filter-bar">
        <span className="ag-filter-label">Filter by section</span>
        <div className="ag-filter-pills">
          {stats.sections.map((s) => (
            <button
              key={s.key}
              className={`ag-pill ${sectionFilter === s.key ? "ag-pill--active" : ""}`}
              style={sectionFilter === s.key ? { "--pill-color": s.color } : undefined}
              onClick={() => setSectionFilter(sectionFilter === s.key ? "" : s.key)}
            >
              <span className="ag-pill-icon">{s.icon}</span>
              {s.label}
              <span className="ag-pill-count">{s.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="ag-main-card">
        <Tabs activeKey={activeTab} onChange={setActiveTab} className="ag-tabs">
          <TabPane tab={<span><AppstoreOutlined /> Venues ({venues.length})</span>} key="venues">
            <div className="ag-toolbar">
              <div className="ag-search-box">
                <SearchOutlined className="ag-search-icon" />
                <input
                  className="ag-search-input"
                  placeholder="Search venues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="ag-search-clear" onClick={() => setSearchTerm("")}>&times;</button>
                )}
              </div>
              <div className="ag-toolbar-meta">
                Showing <strong>{filteredVenues.length}</strong> of {venues.length} venues
              </div>
            </div>
            <div className="ag-table-wrap">
              <Table
                columns={venueColumns}
                dataSource={filteredVenues}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 15, showSizeChanger: false, showTotal: (t) => `${t} total` }}
                scroll={{ x: 800 }}
                size="middle"
                className="ag-table"
              />
            </div>
          </TabPane>

          <TabPane tab={<span><FileTextOutlined /> Content ({content.length})</span>} key="content">
            <div className="ag-content-grid">
              {content.map((item) => (
                <div key={item.sectionKey} className="ag-content-card" onClick={() => openContentModal(item)}>
                  <div className="ag-content-card-header">
                    <h3 className="ag-content-card-title">{item.title || item.sectionKey}</h3>
                    <EditOutlined className="ag-content-card-edit" />
                  </div>
                  <p className="ag-content-card-body">{item.body || "No content yet"}</p>
                  <div className="ag-content-card-footer">
                    Click to edit
                  </div>
                </div>
              ))}
            </div>
          </TabPane>
        </Tabs>
      </div>

      <Modal
        title={null}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSaveVenue}
        confirmLoading={saving}
        width={720}
        okText={editingVenue ? "Update" : "Add to Category"}
        destroyOnClose
        className="ag-modal"
        closable={false}
        footer={
          <div className="ag-modal-footer">
            <button className="ag-btn ag-btn--ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="ag-btn ag-btn--primary" onClick={handleSaveVenue} disabled={saving}>
              {saving ? "Saving..." : editingVenue ? "Update Venue" : "Add to Category"}
            </button>
          </div>
        }
      >
        <div className="ag-modal-header">
          <h2 className="ag-modal-title">{editingVenue ? "Edit Venue" : "Add Venue to Category"}</h2>
          <button className="ag-modal-close" onClick={() => setModalOpen(false)}>&times;</button>
        </div>
        <Form form={venueForm} layout="vertical" className="ag-venue-form">
          <div className="ag-form-section">
            <h4 className="ag-form-section-title">Basic Info</h4>
            {!editingVenue ? (
              <Form.Item
                name="venueId"
                label="Venue"
                extra="Venue details come from the canonical venues table."
                rules={[{ required: true, message: "Select a venue" }]}
              >
                <Select
                  showSearch
                  placeholder="Search by venue name, ID, or slug"
                  className="ag-select"
                  popupClassName="ag-select-dropdown"
                  optionFilterProp="label"
                  options={canonicalVenues.map((venue) => ({
                    value: venue.id,
                    label: `${venue.name} (${venue.slug}) - ${venue.id}`,
                  }))}
                />
              </Form.Item>
            ) : null}
            {editingVenue ? (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Venue ID" extra="Read-only canonical venue identifier.">
                    <Input
                      value={editingVenue.venueId || "Not assigned"}
                      readOnly
                      className="ag-input"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Venue slug" extra="Read-only public venue slug.">
                    <Input
                      value={editingVenue.venueSlug || editingVenue.slug || "Not assigned"}
                      readOnly
                      className="ag-input"
                    />
                  </Form.Item>
                </Col>
              </Row>
            ) : selectedCanonicalVenue ? (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Venue ID">
                    <Input value={selectedCanonicalVenue.id} readOnly className="ag-input" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Venue slug">
                    <Input value={selectedCanonicalVenue.slug} readOnly className="ag-input" />
                  </Form.Item>
                </Col>
              </Row>
            ) : null}
            <Row gutter={16}>
              <Col span={16}>
                {editingVenue ? (
                  <Form.Item name="canonicalName" label="Canonical Venue Name" rules={[{ required: true }]}>
                    <Input placeholder="e.g. Kai Rooftop" className="ag-input" />
                  </Form.Item>
                ) : (
                  <Form.Item
                    name="nameOverride"
                    label="Guide Display Name"
                    extra="Optional. Leave blank to use the canonical venue name."
                  >
                    <Input placeholder={selectedCanonicalVenue?.name} className="ag-input" />
                  </Form.Item>
                )}
              </Col>
              <Col span={8}>
                <Form.Item name="section" label="Section" rules={[{ required: true }]}>
                  <Select className="ag-select" popupClassName="ag-select-dropdown">
                    {SECTIONS.map((s) => (
                      <Select.Option key={s.key} value={s.key}>{s.icon} {s.label}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            {editingVenue ? (
              <Form.Item
                name="nameOverride"
                label="Guide Display Name"
                extra="Leave blank to use the canonical venue name."
              >
                <Input placeholder={editingVenue.canonicalName} className="ag-input" />
              </Form.Item>
            ) : null}
            <Form.Item name="description" label="Description">
              <TextArea rows={2} placeholder="Guide-specific description for this category" className="ag-input" />
            </Form.Item>
            <Form.Item name="tagline" label="Tagline">
              <Input placeholder="Optional tagline (e.g. Local Woman-Owned)" className="ag-input" />
            </Form.Item>
          </div>

          <div className="ag-form-section">
            <h4 className="ag-form-section-title">Image</h4>
            <Form.Item name="image" label="Image URL">
              <Input prefix={<PictureOutlined />} placeholder="https://res.cloudinary.com/..." className="ag-input" />
            </Form.Item>
          </div>

          {editingVenue ? <div className="ag-form-section">
            <h4 className="ag-form-section-title">Coordinates</h4>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="lat" label="Latitude">
                  <InputNumber className="ag-input" style={{ width: "100%" }} placeholder="5.9730" step={0.0001} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="lng" label="Longitude">
                  <InputNumber className="ag-input" style={{ width: "100%" }} placeholder="80.3628" step={0.0001} />
                </Form.Item>
              </Col>
            </Row>
          </div> : null}

          {editingVenue ? <div className="ag-form-section">
            <h4 className="ag-form-section-title">Ratings</h4>
            <Row gutter={16}>
              <Col span={10}>
                <Form.Item name="rating" label="Rating">
                  <InputNumber className="ag-input" style={{ width: "100%" }} min={0} max={5} step={0.1} placeholder="4.9" />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item name="reviewCount" label="Review Count">
                  <InputNumber className="ag-input" style={{ width: "100%" }} min={0} placeholder="286" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label=" " labelCol={0}>
                  <button type="button" className="ag-btn ag-btn--accent ag-btn--sm ag-btn--full" onClick={handleFetchRating} disabled={fetchingRating}>
                    <RiseOutlined /> {fetchingRating ? "..." : "Fetch"}
                  </button>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="googlePlaceId" label="Google Place ID">
              <Input placeholder="ChIJ..." className="ag-input" />
            </Form.Item>
          </div> : null}

          {editingVenue ? <div className="ag-form-section">
            <h4 className="ag-form-section-title">Links</h4>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="instagram" label="Instagram">
                  <Input prefix={<InstagramOutlined />} placeholder="https://instagram.com/..." className="ag-input" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="googleMaps" label="Google Maps">
                  <Input prefix={<EnvironmentOutlined />} placeholder="https://maps.app.goo.gl/..." className="ag-input" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="website" label="Website">
                  <Input prefix={<LinkOutlined />} placeholder="https://..." className="ag-input" />
                </Form.Item>
              </Col>
            </Row>
          </div> : null}

          <div className="ag-form-section">
            <h4 className="ag-form-section-title">Settings</h4>
            <Row gutter={16}>
              {editingVenue ? <Col span={8}>
                <Form.Item name="ownership" label="Ownership">
                  <Select allowClear placeholder="Select" className="ag-select" popupClassName="ag-select-dropdown">
                    <Select.Option value="local">Local</Select.Option>
                    <Select.Option value="foreign">Foreign</Select.Option>
                  </Select>
                </Form.Item>
              </Col> : null}
              <Col span={editingVenue ? 8 : 12}>
                <Form.Item name="priorityOrder" label="Order">
                  <InputNumber className="ag-input" style={{ width: "100%" }} min={0} placeholder="1" />
                </Form.Item>
              </Col>
              <Col span={editingVenue ? 8 : 12}>
                <Form.Item name="status" label="Status">
                  <Select className="ag-select" popupClassName="ag-select-dropdown">
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="draft">Draft</Select.Option>
                    <Select.Option value="archived">Archived</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>

      <Modal
        title={null}
        open={contentModalOpen}
        onCancel={() => setContentModalOpen(false)}
        onOk={handleSaveContent}
        confirmLoading={saving}
        width={640}
        destroyOnClose
        className="ag-modal"
        closable={false}
        footer={
          <div className="ag-modal-footer">
            <button className="ag-btn ag-btn--ghost" onClick={() => setContentModalOpen(false)}>Cancel</button>
            <button className="ag-btn ag-btn--primary" onClick={handleSaveContent} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        }
      >
        <div className="ag-modal-header">
          <h2 className="ag-modal-title">Edit: {editingContent?.title || ""}</h2>
          <button className="ag-modal-close" onClick={() => setContentModalOpen(false)}>&times;</button>
        </div>
        <Form form={contentForm} layout="vertical" className="ag-venue-form">
          <Form.Item name="title" label="Section Title">
            <Input className="ag-input" />
          </Form.Item>
          <Form.Item name="body" label="Content Body">
            <TextArea rows={6} className="ag-input" />
          </Form.Item>
          <Form.Item name="image" label="Image URL (optional)">
            <Input prefix={<PictureOutlined />} placeholder="https://..." className="ag-input" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminGuidePage;
