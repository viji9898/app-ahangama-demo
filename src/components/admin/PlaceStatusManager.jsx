import React, { useState, useMemo } from "react";
import {
  Card,
  Table,
  Select,
  Tag,
  Button,
  Space,
  Typography,
  Input,
  Modal,
  Form,
  message,
} from "antd";
import { SearchOutlined, EditOutlined } from "@ant-design/icons";
import { usePlaces } from "../../app/placesContext";
import {
  PLACE_STATUS,
  PLACE_STATUS_LABELS,
  PLACE_STATUS_COLORS,
} from "../../data/placeStatus";

const { Title, Text } = Typography;
const { Option } = Select;

export default function PlaceStatusManager() {
  const { places: allPlaces } = usePlaces();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editModal, setEditModal] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [form] = Form.useForm();

  // Filter places based on search and status
  const filteredPlaces = useMemo(() => {
    let filtered = allPlaces.filter(
      (place) =>
        place.destinationSlug === "ahangama" &&
        place.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (place) => (place.status || "active") === statusFilter,
      );
    }

    return filtered;
  }, [allPlaces, searchTerm, statusFilter]);

  const handleEditStatus = (place) => {
    setEditingPlace(place);
    form.setFieldsValue({
      status: place.status || "active",
    });
    setEditModal(true);
  };

  const handleSaveStatus = async (values) => {
    // In a real app, this would update the database
    // For now, we'll just show a success message
    message.success(`Status updated for ${editingPlace.name}`);
    setEditModal(false);
    setEditingPlace(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Place",
      key: "place",
      render: (_, record) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.area} • {record.category}
          </Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const currentStatus = status || "active";
        return (
          <Tag color={PLACE_STATUS_COLORS[currentStatus]}>
            {PLACE_STATUS_LABELS[currentStatus]}
          </Tag>
        );
      },
    },
    {
      title: "Offer",
      dataIndex: "offer",
      key: "offer",
      render: (offer) => (
        <div>
          {Array.isArray(offer) ? (
            offer.map((o, i) => (
              <Tag key={i} style={{ marginBottom: 4 }}>
                {o}
              </Tag>
            ))
          ) : (
            <Text type="secondary">No offer</Text>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => handleEditStatus(record)}
          size="small"
        >
          Edit
        </Button>
      ),
    },
  ];

  const getStatusCounts = () => {
    const counts = {
      total: filteredPlaces.length,
      active: 0,
      inactive: 0,
      coming_soon: 0,
    };

    filteredPlaces.forEach((place) => {
      const status = place.status || "active";
      counts[status]++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Title level={4}>Place Status Management</Title>
          <Text type="secondary">
            Control which venues are visible to users and track vendor
            onboarding progress
          </Text>
        </div>

        {/* Status Overview */}
        <div style={{ marginBottom: 20 }}>
          <Space size="large">
            <div>
              <Text type="secondary">Total Places:</Text>
              <br />
              <Text strong style={{ fontSize: "18px" }}>
                {statusCounts.total}
              </Text>
            </div>
            <div>
              <Text type="secondary">Active:</Text>
              <br />
              <Tag
                color="green"
                style={{ fontSize: "14px", padding: "4px 8px" }}
              >
                {statusCounts.active}
              </Tag>
            </div>
            <div>
              <Text type="secondary">Coming Soon:</Text>
              <br />
              <Tag
                color="orange"
                style={{ fontSize: "14px", padding: "4px 8px" }}
              >
                {statusCounts.coming_soon}
              </Tag>
            </div>
            <div>
              <Text type="secondary">Inactive:</Text>
              <br />
              <Tag color="red" style={{ fontSize: "14px", padding: "4px 8px" }}>
                {statusCounts.inactive}
              </Tag>
            </div>
          </Space>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Input
              placeholder="Search places..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Option value="all">All Status</Option>
              <Option value="active">Active</Option>
              <Option value="coming_soon">Coming Soon</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Space>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredPlaces}
          rowKey="id"
          pagination={{ pageSize: 20 }}
          size="small"
        />
      </Card>

      {/* Edit Status Modal */}
      <Modal
        title={`Update Status - ${editingPlace?.name}`}
        open={editModal}
        onCancel={() => setEditModal(false)}
        onOk={() => form.submit()}
        okText="Update Status"
      >
        <Form form={form} onFinish={handleSaveStatus} layout="vertical">
          <Form.Item
            name="status"
            label="Vendor Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select>
              <Option value="active">
                <Tag color="green">Active</Tag> - Live and visible to users
              </Option>
              <Option value="coming_soon">
                <Tag color="orange">Coming Soon</Tag> - Signed but not ready to
                go live
              </Option>
              <Option value="inactive">
                <Tag color="red">Inactive</Tag> - Hidden from users
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
