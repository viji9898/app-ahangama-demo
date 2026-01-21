import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Checkbox,
  Radio,
  Space,
  Row,
  Col,
  DatePicker,
  message,
  Divider,
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function PartnerSignUp() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [venueType, setVenueType] = useState([]);
  const [discountType, setDiscountType] = useState({});

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Format the form data for email
      const formData = {
        ...values,
        venueType: venueType.join(", "),
      };

      // Send email via netlify function (you'll need to create this)
      const response = await fetch("/.netlify/functions/send-partner-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        message.success(
          "🎉 Welcome to the Ahangama Pass Partner Network! Your venue is now live as a partner."
        );
        form.resetFields();
        setVenueType([]);
        setDiscountType({});
      } else {
        throw new Error("Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error(
        "Unable to complete sign-up. Please try again or contact us at hello@ahangama.com"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVenueTypeChange = (checkedValues) => {
    setVenueType(checkedValues);
  };

  return (
    <SiteLayout>
      <Seo
        title="Partner Sign-Up - Ahangama Pass"
        description="Join the Ahangama Pass destination network and reach travelers exploring Ahangama. Simple sign-up, no fees, immediate go-live."
        keywords="Ahangama Pass, partner network, Sri Lanka tourism, destination partners"
      />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
        <Card>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <Title level={2}>Ahangama Pass — Partner Sign-Up</Title>
            <Paragraph>
              <Text type="secondary">
                A simple sign-up to join the Ahangama Pass destination network.
              </Text>
            </Paragraph>
            <div
              style={{
                background: "#f0f8ff",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <Text strong style={{ color: "#1890ff" }}>
                ✓ By submitting this form, your venue will go live as an
                Ahangama Pass partner and agree to the terms outlined below.
              </Text>
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
          >
            <Divider orientation="left">1. Venue Details</Divider>

            {/* Venue Information */}
            <Form.Item
              label="Venue Name"
              name="venueName"
              rules={[{ required: true, message: "Please enter venue name" }]}
            >
              <Input placeholder="Enter venue name" />
            </Form.Item>

            <Form.Item
              label="Location / Area"
              name="location"
              rules={[{ required: true, message: "Please select location" }]}
            >
              <Input placeholder="e.g., Ahangama, Kabalana, Midigama" />
            </Form.Item>

            <Form.Item
              label="Venue Type"
              name="venueType"
              rules={[
                {
                  required: true,
                  message: "Please select at least one venue type",
                },
              ]}
            >
              <Checkbox.Group onChange={handleVenueTypeChange}>
                <Space direction="vertical">
                  <Checkbox value="food-beverage">Food & Beverage</Checkbox>
                  <Checkbox value="accommodation">
                    Accommodation (Direct Bookings)
                  </Checkbox>
                  <Checkbox value="experiences">
                    Experiences / Wellness / Retail
                  </Checkbox>
                  <Checkbox value="other">Other</Checkbox>
                </Space>
              </Checkbox.Group>
            </Form.Item>

            {venueType.includes("other") && (
              <Form.Item
                label="Other Venue Type (Please Specify)"
                name="otherVenueType"
                rules={[
                  {
                    required: true,
                    message: "Please specify other venue type",
                  },
                ]}
              >
                <Input placeholder="Please specify..." />
              </Form.Item>
            )}

            {/* Contact Information */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Contact Name"
                  name="contactName"
                  rules={[
                    { required: true, message: "Please enter contact name" },
                  ]}
                >
                  <Input placeholder="Full name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Role/Position"
                  name="contactRole"
                  rules={[
                    { required: true, message: "Please enter role/position" },
                  ]}
                >
                  <Input placeholder="e.g., Manager, Owner" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter email address" },
                    { type: "email", message: "Please enter valid email" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="email@example.com"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Phone/WhatsApp Number"
                  name="phone"
                  rules={[
                    { required: true, message: "Please enter phone number" },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="+94 77 123 4567"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Instagram Handle" name="instagram">
                  <Input
                    prefix={<InstagramOutlined />}
                    placeholder="@yourvenue"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Website URL" name="website">
                  <Input placeholder="https://yourwebsite.com" />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">2. Customer Offer</Divider>

            <Form.Item
              label="Offer Type"
              name="offerType"
              rules={[{ required: true, message: "Please select offer type" }]}
            >
              <Checkbox.Group>
                <Space direction="vertical">
                  <Checkbox value="percentage">Percentage discount</Checkbox>
                  <Checkbox value="fixed">Fixed offer</Checkbox>
                  <Checkbox value="complimentary">
                    Complimentary item / upgrade
                  </Checkbox>
                </Space>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item
              label="Describe the offer clearly (shown to customers)"
              name="offerDescription"
              rules={[
                { required: true, message: "Please describe your offer" },
              ]}
            >
              <TextArea
                rows={3}
                placeholder="e.g., '10% off total bill', 'Buy 2 get 1 free on mains', 'Complimentary welcome drink'"
              />
            </Form.Item>

            <Form.Item
              label="Offer applies to"
              name="offerAppliesTo"
              rules={[
                {
                  required: true,
                  message: "Please select what the offer applies to",
                },
              ]}
            >
              <Checkbox.Group>
                <Space direction="vertical">
                  <Checkbox value="food-beverage">Food & Beverage</Checkbox>
                  <Checkbox value="accommodation">
                    Direct accommodation bookings
                  </Checkbox>
                  <Checkbox value="experiences">Experiences / Retail</Checkbox>
                </Space>
              </Checkbox.Group>
            </Form.Item>

            <Divider orientation="left">3. How Guests Redeem the Offer</Divider>

            <div
              style={{
                background: "#f9f9f9",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "8px",
                border: "1px solid #d9d9d9",
              }}
            >
              <Paragraph>
                <Text strong>
                  Guests can redeem your offer in several ways:
                </Text>
              </Paragraph>

              <ul style={{ marginBottom: "16px" }}>
                <li>
                  <Text strong>Show Ahangama Pass at venue:</Text> Guests
                  present their digital pass (on phone or printed) when ordering
                  or checking in
                </li>
                <li>
                  <Text strong>Mention when booking directly:</Text> Guests can
                  mention "Ahangama Pass" when making reservations by phone or
                  in person
                </li>
                <li>
                  <Text strong>QR code verification:</Text> Staff can scan the
                  guest's pass QR code to verify and log the redemption
                </li>
                <li>
                  <Text strong>Staff verification:</Text> Your team can manually
                  verify the pass and note the redemption
                </li>
              </ul>

              <Paragraph>
                <Text>
                  The redemption process is designed to be simple and flexible
                  for both your staff and guests. You choose what works best for
                  your venue operations.
                </Text>
              </Paragraph>
            </div>

            <Divider orientation="left">4. Marketing & Branding</Divider>

            <Paragraph>
              <Text strong>
                We keep all branding minimal and respectful of your venue's
                aesthetic.
              </Text>
            </Paragraph>

            <Paragraph>
              The venue agrees to display small, tasteful Ahangama Pass
              branding, such as:
            </Paragraph>

            <ul>
              <li>A small sticker at the counter or entrance</li>
              <li>A QR card at the cashier or reception</li>
              <li>A digital mention where appropriate</li>
            </ul>

            <Form.Item label="Additional Marketing Notes" name="marketingNotes">
              <TextArea
                rows={2}
                placeholder="Any specific preferences for branding or marketing materials"
              />
            </Form.Item>

            <Divider orientation="left">5. Partner Terms (Summary)</Divider>

            <div
              style={{
                background: "#f5f5f5",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "8px",
              }}
            >
              <ul style={{ fontSize: "16px", lineHeight: "1.8" }}>
                <li>No fees or commissions</li>
                <li>Non-exclusive partnership</li>
                <li>
                  Offers must be honoured when the Ahangama Pass is presented
                  before payment
                </li>
                <li>Accommodation offers apply to direct bookings only</li>
                <li>Either party may terminate with 30 days written notice</li>
                <li>No penalties or obligations upon termination</li>
                <li>Minimal branding required</li>
              </ul>
            </div>

            <Divider orientation="left">Confirmation</Divider>

            <div
              style={{
                background: "#f0f8ff",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
            >
              <Text strong style={{ color: "#1890ff" }}>
                By submitting this form, your venue will go live as an Ahangama
                Pass partner.
              </Text>
            </div>

            <Form.Item
              name="agreeToTerms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "Please confirm your authorization and agreement"
                          )
                        ),
                },
              ]}
            >
              <Checkbox style={{ fontSize: "16px" }}>
                <strong>
                  I confirm that I am authorized to represent this venue and
                  agree to the Ahangama Pass Partner Terms. By submitting this
                  form, my venue will go live as an Ahangama Pass partner.
                </strong>
              </Checkbox>
            </Form.Item>

            <Form.Item name="agreeToMarketing" valuePropName="checked">
              <Checkbox>
                I'd like to receive updates, insights, and opportunities from
                Ahangama Pass.
              </Checkbox>
            </Form.Item>

            <Form.Item style={{ textAlign: "center", marginTop: 30 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                style={{ minWidth: 200, fontSize: "16px", height: "50px" }}
              >
                Submit & Go Live
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </SiteLayout>
  );
}
