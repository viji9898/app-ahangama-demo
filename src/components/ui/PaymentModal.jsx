import React, { useState } from "react";
import { Modal, Form, Input, Button, Typography, Alert } from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { createCheckoutSession } from "../../services/stripe";

const { Text } = Typography;

export default function PaymentModal({ visible, onCancel, product }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async (values) => {
    setLoading(true);
    setError(null);

    try {
      await createCheckoutSession(product.id, {
        name: values.name,
        email: values.email,
        phone: values.phone,
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Purchase ${product?.name}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={480}
    >
      {product && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ padding: 16, background: "#f5f5f5", borderRadius: 8 }}>
            <Text strong style={{ fontSize: 18 }}>
              {product.name}
            </Text>
            <br />
            <Text style={{ fontSize: 24, fontWeight: "600", color: "#1890ff" }}>
              ${product.priceUsd}
            </Text>
            <Text type="secondary">
              {" "}
              • {product.validityDays} days • {product.maxPeople}{" "}
              {product.maxPeople === 1 ? "person" : "people"}
            </Text>
          </div>
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handlePayment}
        requiredMark={false}
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[
            { required: true, message: "Please enter your full name" },
            { min: 2, message: "Name must be at least 2 characters" },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Enter your full name"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="your@email.com"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="WhatsApp Number"
          rules={[
            { required: true, message: "Please enter your WhatsApp number" },
            {
              pattern: /^\+?[1-9]\d{1,14}$/,
              message: "Please enter a valid phone number with country code",
            },
          ]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="+94 77 123 4567"
            size="large"
          />
        </Form.Item>

        <Text
          type="secondary"
          style={{ fontSize: 12, display: "block", marginBottom: 16 }}
        >
          Your QR code will be sent to your WhatsApp and email after successful
          payment.
        </Text>

        {error && (
          <Alert
            type="error"
            message={error}
            style={{ marginBottom: 16 }}
            showIcon
          />
        )}

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            style={{
              background: product?.isPremium
                ? "linear-gradient(135deg, #FFD700, #FFA500)"
                : undefined,
              border: product?.isPremium ? "none" : undefined,
              color: product?.isPremium ? "#fff" : undefined,
            }}
          >
            {loading
              ? "Processing..."
              : `Pay $${product?.priceUsd} with Stripe`}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
