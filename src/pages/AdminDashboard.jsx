import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Typography,
  Space,
  Tag,
  Button,
  Modal,
  Descriptions,
  Alert,
  Input,
  Select,
  Spin,
} from "antd";
import {
  EyeOutlined,
  QrcodeOutlined,
  UserOutlined,
  CalendarOutlined,
  ShopOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { listCards, listRedemptions, seedDemoData } from "../app/cardStore";

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [purchases, setPurchases] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const seedDatabase = async () => {
    try {
      setSeeding(true);
      const result = seedDemoData();
      Modal.success({
        title: "Demo Data Added",
        content: (
          <div>
            <p>✅ {result.purchasesCreated} purchases created</p>
            <p>✅ {result.redemptionsCreated} redemptions created</p>
            <p>✅ {result.customers} customers added</p>
            <p>💰 Total revenue: ${result.summary.totalRevenue}</p>
          </div>
        ),
      });
      await fetchData();
    } catch (error) {
      Modal.error({
        title: "Unable to add demo data",
        content: error.message,
      });
    } finally {
      setSeeding(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setPurchases(listCards());
      setRedemptions(listRedemptions());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter and search purchases
  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      !searchTerm ||
      (purchase.customerName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (purchase.customerEmail || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (purchase.qrCode || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" &&
        purchase.isActive &&
        new Date(purchase.expiryDate) > new Date()) ||
      (statusFilter === "expired" &&
        new Date(purchase.expiryDate) < new Date()) ||
      (statusFilter === "inactive" && !purchase.isActive);

    return matchesSearch && matchesStatus;
  });

  // Get redemption count for a purchase
  const getRedemptionCount = (purchaseId) => {
    return redemptions.filter((r) => r.purchaseId === purchaseId).length;
  };

  // Show purchase details modal
  const showPurchaseDetails = (purchase) => {
    setSelectedPurchase(purchase);
    setDetailModalVisible(true);
  };

  // Purchase table columns
  const purchaseColumns = [
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text strong>
            <UserOutlined /> {record.customerName}
          </Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.customerEmail}
          </Text>
          {record.customerPhone && (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.customerPhone}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Pass Details",
      key: "pass",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text strong>{record.productName}</Text>
          <Tag color="blue">${record.priceUsd}</Tag>
          <Text style={{ fontSize: "12px" }}>
            Max {record.maxPeople} people • {record.validityDays} days
          </Text>
        </Space>
      ),
    },
    {
      title: "QR Code",
      dataIndex: "qrCode",
      key: "qrCode",
      render: (qrCode) => (
        <Space direction="vertical" size="small">
          <Text code copyable={{ text: qrCode }} style={{ fontSize: "11px" }}>
            {qrCode ? qrCode.substring(0, 20) + "..." : "N/A"}
          </Text>
          <Button
            size="small"
            icon={<QrcodeOutlined />}
            onClick={() => {
              Modal.info({
                title: "QR Code",
                content: (
                  <Text code copyable>
                    {qrCode}
                  </Text>
                ),
                width: 500,
              });
            }}
          >
            View Full
          </Button>
        </Space>
      ),
    },
    {
      title: "Validity",
      key: "validity",
      render: (_, record) => {
        const isExpired = new Date(record.expiryDate) < new Date();
        const isActive = record.isActive;

        return (
          <Space direction="vertical" size="small">
            <Tag
              color={
                isActive && !isExpired ? "green" : isExpired ? "red" : "orange"
              }
            >
              {!isActive ? "INACTIVE" : isExpired ? "EXPIRED" : "ACTIVE"}
            </Tag>
            <Text style={{ fontSize: "12px" }}>
              <CalendarOutlined />{" "}
              {new Date(record.expiryDate).toLocaleDateString()}
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Used: {getRedemptionCount(record.id)} times
            </Text>
          </Space>
        );
      },
    },
    {
      title: "Purchase Info",
      key: "purchase",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text style={{ fontSize: "12px" }}>
            Purchased: {new Date(record.purchaseDate).toLocaleDateString()}
          </Text>
          <Text style={{ fontSize: "12px" }}>
            Start:{" "}
            {record.startDate
              ? new Date(record.startDate).toLocaleDateString()
              : "N/A"}
          </Text>
          <Text style={{ fontSize: "11px" }} type="secondary">
            {record.sessionId
              ? record.sessionId.substring(0, 20) + "..."
              : "N/A"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => showPurchaseDetails(record)}
          size="small"
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      <Title level={2}>Admin Dashboard - Pass Management</Title>

      {/* No data alert */}
      {!loading && purchases.length === 0 && (
        <Alert
          message="No Purchase Data Found"
          description="No locally stored passes were found in this browser. Click 'Seed Test Data' to populate sample cards for testing."
          type="info"
          showIcon
          action={
            <Button
              onClick={seedDatabase}
              loading={seeding}
              type="primary"
              size="small"
            >
              🌱 Seed Test Data
            </Button>
          }
          style={{ marginBottom: "24px" }}
        />
      )}

      <Card style={{ marginBottom: "24px" }}>
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Title level={4}>Search & Filters</Title>

          <Space wrap>
            <Input
              placeholder="Search by name, email, or QR code"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 300 }}
            />

            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Select.Option value="all">All Status</Select.Option>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="expired">Expired</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>

            <Button onClick={fetchData} loading={loading}>
              Refresh Data
            </Button>

            <Button
              onClick={seedDatabase}
              loading={seeding}
              type="dashed"
              style={{ color: "#1890ff" }}
            >
              🌱 Seed Test Data
            </Button>
          </Space>
        </Space>
      </Card>

      {/* Summary Cards */}
      <Space size="large" style={{ marginBottom: "24px" }}>
        <Card size="small">
          <Title level={4}>{purchases.length}</Title>
          <Text>Total Passes Sold</Text>
        </Card>
        <Card size="small">
          <Title level={4}>{redemptions.length}</Title>
          <Text>Total Redemptions</Text>
        </Card>
        <Card size="small">
          <Title level={4}>
            $
            {purchases
              .reduce((sum, p) => sum + parseFloat(p.priceUsd || 0), 0)
              .toFixed(2)}
          </Title>
          <Text>Total Revenue</Text>
        </Card>
        <Card size="small">
          <Title level={4}>
            {
              purchases.filter(
                (p) => p.isActive && new Date(p.expiryDate) > new Date(),
              ).length
            }
          </Title>
          <Text>Active Passes</Text>
        </Card>
      </Space>

      <Card>
        <Spin spinning={loading}>
          <Table
            columns={purchaseColumns}
            dataSource={filteredPurchases}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} passes`,
            }}
            scroll={{ x: 1200 }}
          />
        </Spin>
      </Card>

      {/* Purchase Detail Modal */}
      <Modal
        title={`Pass Details - ${selectedPurchase?.customerName}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={null}
      >
        {selectedPurchase && (
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <Descriptions title="Customer Information" bordered column={2}>
              <Descriptions.Item label="Name">
                {selectedPurchase.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedPurchase.customerEmail}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {selectedPurchase.customerPhone || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Pass Type">
                {selectedPurchase.productName}
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                ${selectedPurchase.priceUsd}
              </Descriptions.Item>
              <Descriptions.Item label="Max People">
                {selectedPurchase.maxPeople}
              </Descriptions.Item>
              <Descriptions.Item label="Validity">
                {selectedPurchase.validityDays} days
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    selectedPurchase.isActive &&
                    new Date(selectedPurchase.expiryDate) > new Date()
                      ? "green"
                      : "red"
                  }
                >
                  {selectedPurchase.isActive &&
                  new Date(selectedPurchase.expiryDate) > new Date()
                    ? "ACTIVE"
                    : "EXPIRED/INACTIVE"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="QR Code & Dates" bordered column={1}>
              <Descriptions.Item label="QR Code">
                <Text code copyable>
                  {selectedPurchase.qrCode}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Purchase Date">
                {new Date(selectedPurchase.purchaseDate).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Start Date">
                {selectedPurchase.startDate
                  ? new Date(selectedPurchase.startDate).toLocaleString()
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Expiry Date">
                {new Date(selectedPurchase.expiryDate).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Stripe Session">
                <Text code>{selectedPurchase.sessionId}</Text>
              </Descriptions.Item>
            </Descriptions>

            <Card
              title={
                <>
                  <ShopOutlined /> Redemption History
                </>
              }
              size="small"
            >
              {redemptions.filter((r) => r.purchaseId === selectedPurchase.id)
                .length === 0 ? (
                <Text type="secondary">No redemptions yet</Text>
              ) : (
                <Table
                  size="small"
                  columns={[
                    { title: "Venue", dataIndex: "venueName", key: "venue" },
                    {
                      title: "Category",
                      dataIndex: "venueCategory",
                      key: "category",
                    },
                    {
                      title: "Offer Used",
                      dataIndex: "offerUsed",
                      key: "offer",
                    },
                    {
                      title: "Date",
                      dataIndex: "redeemedAt",
                      key: "date",
                      render: (date) => new Date(date).toLocaleString(),
                    },
                  ]}
                  dataSource={redemptions.filter(
                    (r) => r.purchaseId === selectedPurchase.id,
                  )}
                  pagination={false}
                  rowKey="id"
                />
              )}
            </Card>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
