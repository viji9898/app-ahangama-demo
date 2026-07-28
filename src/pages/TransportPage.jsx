import React, { useState } from "react";
import {
  ArrowRightOutlined,
  CarOutlined,
  CheckOutlined,
  CompassOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  SendOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Typography,
  message,
} from "antd";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import "../styles/transport-page.css";

const { Paragraph, Text, Title } = Typography;

export const TRANSPORT_PATH = "/transport";

const HERO_IMAGE =
  "https://images.suitcasemag.com/wp-content/uploads/2025/03/21082617/SurfTrip_2042-copy-2.jpeg";

const SERVICES = [
  {
    value: "scooter",
    number: "01",
    title: "Rent a scooter",
    shortTitle: "Scooter rental",
    detail:
      "Daily and weekly rentals for easy movement between beaches, cafes, surf breaks, and town.",
    note: "From around LKR 2,500 per day",
    Icon: DashboardOutlined,
  },
  {
    value: "tuk_tuk",
    number: "02",
    title: "Book a tuk-tuk",
    shortTitle: "Tuk-tuk rental or ride",
    detail:
      "A local ride, a driver for the day, or help arranging a self-drive tuk-tuk adventure.",
    note: "Local rides and longer hires",
    Icon: CarOutlined,
  },
  {
    value: "airport_transfer",
    number: "03",
    title: "Airport transfer",
    shortTitle: "Airport transfer",
    detail:
      "Pre-book a private pickup between Ahangama and Bandaranaike International Airport.",
    note: "Cars and vans for luggage or boards",
    Icon: EnvironmentOutlined,
  },
  {
    value: "private_transfer",
    number: "04",
    title: "Travel further",
    shortTitle: "Private transfer",
    detail:
      "Comfortable private travel from Ahangama to Colombo, Galle, Hiriketiya, or elsewhere.",
    note: "One-way trips and day drivers",
    Icon: SwapOutlined,
  },
];

const SERVICE_OPTIONS = SERVICES.map(({ value, shortTitle }) => ({
  value,
  label: shortTitle,
}));

const DESTINATION_OPTIONS = [
  { value: "Bandaranaike International Airport", label: "Colombo airport (CMB)" },
  { value: "Colombo", label: "Colombo" },
  { value: "Hiriketiya", label: "Hiriketiya" },
  { value: "Galle", label: "Galle" },
  { value: "Weligama", label: "Weligama" },
  { value: "Ahangama local journey", label: "Around Ahangama" },
  { value: "Other", label: "Somewhere else" },
];

const QUICK_ROUTES = [
  { route: "Ahangama → Colombo airport", time: "Approx. 2.5–3 hours", destination: "Bandaranaike International Airport", serviceType: "airport_transfer" },
  { route: "Ahangama → Colombo", time: "Approx. 2–2.5 hours", destination: "Colombo", serviceType: "private_transfer" },
  { route: "Ahangama → Hiriketiya", time: "Approx. 1 hour", destination: "Hiriketiya", serviceType: "private_transfer" },
  { route: "Ahangama → Galle", time: "Approx. 35 minutes", destination: "Galle", serviceType: "private_transfer" },
];

export default function TransportPage() {
  const [form] = Form.useForm();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serviceType, setServiceType] = useState("private_transfer");

  const openEnquiry = (nextService = "private_transfer", destination = "") => {
    setSubmitted(false);
    setServiceType(nextService);
    setEnquiryOpen(true);
    form.resetFields();
    form.setFieldsValue({
      serviceType: nextService,
      destination: destination || undefined,
      passengers: 1,
      rentalDays: ["scooter", "tuk_tuk"].includes(nextService) ? 1 : undefined,
    });
  };

  const closeEnquiry = () => {
    setEnquiryOpen(false);
    setSubmitted(false);
  };

  const submitEnquiry = async (values) => {
    setSubmitting(true);

    try {
      const response = await fetch("/.netlify/functions/create-transport-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          journeyDate: values.journeyDate?.format("YYYY-MM-DD"),
          source: "transport-page",
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to send your transport request");
      }

      setSubmitted(true);
      form.resetFields();
    } catch (error) {
      message.error(error.message || "Unable to send your transport request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Transport & Travel in Ahangama"
        description="Request scooter rentals, tuk-tuks, airport pickups, and private transfers from Ahangama to Colombo, Hiriketiya, Galle, and beyond."
        canonical={absUrl(TRANSPORT_PATH)}
        ogImage={HERO_IMAGE}
      />

      <main className="transport-page">
        <header className="transport-hero">
          <img src={HERO_IMAGE} alt="Travelling along Sri Lanka's southern coast" />
          <div className="transport-heroShade" aria-hidden="true" />
          <div className="transport-heroContent">
            <Text className="transport-eyebrow transport-eyebrowLight">Transport & travel</Text>
            <Title>Move around the south, simply.</Title>
            <Paragraph>
              Rent a scooter, arrange a tuk-tuk, or request a private transfer to the airport, Colombo, Hiriketiya, and beyond.
            </Paragraph>
            <Button type="primary" size="large" onClick={() => openEnquiry()}>
              Request transport <ArrowRightOutlined />
            </Button>
          </div>
        </header>

        <section className="transport-intro transport-shell">
          <div>
            <Text className="transport-eyebrow">Choose your ride</Text>
            <Title level={2}>What do you need?</Title>
          </div>
          <Paragraph>
            Tell us where you are going and when. We will check the right local option and come back with availability and a direct quote before anything is confirmed.
          </Paragraph>
        </section>

        <section className="transport-services" aria-label="Transport services">
          {SERVICES.map(({ value, number, title, detail, note, Icon }) => (
            <article className="transport-service" key={value}>
              <div className="transport-serviceTop">
                <Text>{number}</Text>
                {React.createElement(Icon, { "aria-hidden": true })}
              </div>
              <Title level={3}>{title}</Title>
              <Paragraph>{detail}</Paragraph>
              <Text className="transport-serviceNote">{note}</Text>
              <Button type="link" onClick={() => openEnquiry(value)}>
                Request this <ArrowRightOutlined />
              </Button>
            </article>
          ))}
        </section>

        <section className="transport-routes">
          <div className="transport-shell transport-routesInner">
            <div className="transport-routesIntro">
              <Text className="transport-eyebrow">Popular routes</Text>
              <Title level={2}>Start in Ahangama. Go anywhere.</Title>
              <Paragraph>
                Journey times are planning estimates. Your quote will reflect pickup details, vehicle size, luggage, surfboards, and current availability.
              </Paragraph>
            </div>
            <div className="transport-routeList">
              {QUICK_ROUTES.map((item) => (
                <button
                  type="button"
                  key={item.route}
                  onClick={() => openEnquiry(item.serviceType, item.destination)}
                >
                  <span><strong>{item.route}</strong><Text>{item.time}</Text></span>
                  <ArrowRightOutlined />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="transport-assurance transport-shell">
          <div><CompassOutlined /><Title level={3}>Local options</Title><Paragraph>Matched to established drivers and rental providers around the south coast.</Paragraph></div>
          <div><SafetyCertificateOutlined /><Title level={3}>Quote first</Title><Paragraph>Availability and pricing are confirmed before you make a decision.</Paragraph></div>
          <div><SendOutlined /><Title level={3}>One request</Title><Paragraph>Send the trip once and the Ahangama team will help organise the details.</Paragraph></div>
        </section>

        <section className="transport-final">
          <Text className="transport-eyebrow">Ready when you are</Text>
          <Title level={2}>Tell us where you need to go.</Title>
          <Button type="primary" size="large" onClick={() => openEnquiry()}>
            Request a quote <ArrowRightOutlined />
          </Button>
        </section>
      </main>

      <Modal
        className="transport-enquiryModal"
        open={enquiryOpen}
        onCancel={closeEnquiry}
        footer={null}
        width={680}
        title={submitted ? "Request received" : "Request transport"}
        destroyOnHidden
        forceRender
      >
        {submitted ? (
          <div className="transport-success">
            <div className="transport-successIcon"><CheckOutlined /></div>
            <Title level={3}>We will start checking the right option.</Title>
            <Paragraph>
              The Ahangama team will contact you with availability and a direct quote for your journey.
            </Paragraph>
            <Button type="primary" onClick={closeEnquiry}>Done</Button>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={submitEnquiry}
            requiredMark={false}
            onValuesChange={(changedValues) => {
              if (changedValues.serviceType) setServiceType(changedValues.serviceType);
            }}
          >
            <Alert
              type="info"
              showIcon
              title="No payment is taken. We confirm availability and pricing first."
            />
            <div className="transport-formGrid">
              <Form.Item name="serviceType" label="What do you need?" rules={[{ required: true }]}>
                <Select options={SERVICE_OPTIONS} />
              </Form.Item>
              <Form.Item name="journeyDate" label={serviceType === "scooter" ? "Rental start date" : "Travel date"} rules={[{ required: true, message: "Select a date" }]}>
                <DatePicker format="DD MMM YYYY" style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="pickupLocation" label="Pickup location">
                <Input placeholder="Hotel, villa, airport, or area" />
              </Form.Item>
              <Form.Item name="destination" label="Destination">
                <Select
                  allowClear
                  showSearch
                  placeholder="Choose or type a route"
                  options={DESTINATION_OPTIONS}
                  optionFilterProp="label"
                />
              </Form.Item>
              <Form.Item name="passengers" label="Travellers" rules={[{ required: true }]}>
                <InputNumber min={1} max={20} style={{ width: "100%" }} />
              </Form.Item>
              {["scooter", "tuk_tuk"].includes(serviceType) ? (
                <Form.Item name="rentalDays" label="Rental days" rules={[{ required: true }]}>
                  <InputNumber min={1} max={90} style={{ width: "100%" }} />
                </Form.Item>
              ) : null}
              <Form.Item name="name" label="Your name" rules={[{ required: true, message: "Enter your name" }]}>
                <Input autoComplete="name" />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Enter a valid email" }]}>
                <Input type="email" autoComplete="email" />
              </Form.Item>
              <Form.Item name="whatsapp" label="WhatsApp number" rules={[{ required: true, message: "Enter your WhatsApp number" }]}>
                <Input type="tel" autoComplete="tel" placeholder="Include country code" />
              </Form.Item>
            </div>
            <Form.Item name="notes" label="Anything we should know?">
              <Input.TextArea rows={3} maxLength={1000} placeholder="Flight number, luggage, surfboards, vehicle preference, or timing..." />
            </Form.Item>
            <Form.Item name="consent" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error("Please confirm we may contact you")) }]}>
              <Checkbox>I agree that Ahangama may contact me about this transport request.</Checkbox>
            </Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={submitting}>
              Send transport request <ArrowRightOutlined />
            </Button>
          </Form>
        )}
      </Modal>
    </SiteLayout>
  );
}