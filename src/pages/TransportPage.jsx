import React, { useState } from "react";
import {
  ArrowRightOutlined,
  CarOutlined,
  CheckOutlined,
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

export const TRANSPORT_PATH = "/transport-rates";

const HERO_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/surf-trip.webp";

const SERVICES = [
  {
    value: "scooter",
    number: "01",
    title: "Honda Dio",
    shortTitle: "Scooter rental",
    detail:
      "A practical daily rental for beaches, cafes, surf breaks, and short trips around town.",
    note: "LKR 1,640 per day",
    Icon: DashboardOutlined,
  },
  {
    value: "scooter",
    number: "02",
    title: "TVS Ntorq",
    shortTitle: "Scooter rental",
    detail:
      "A larger scooter option for comfortable day-to-day travel along the south coast.",
    note: "LKR 2,296 per day",
    Icon: DashboardOutlined,
  },
  {
    value: "airport_transfer",
    number: "03",
    title: "Airport by car",
    shortTitle: "Airport transfer",
    detail:
      "A private one-way car between Ahangama and Bandaranaike International Airport.",
    note: "LKR 13,120 one way",
    Icon: EnvironmentOutlined,
  },
  {
    value: "private_transfer",
    number: "04",
    title: "Colombo by car",
    shortTitle: "Private transfer",
    detail: "A private one-way transfer from Ahangama to central Colombo.",
    note: "LKR 13,120 one way",
    Icon: SwapOutlined,
  },
];

const SERVICE_OPTIONS = SERVICES.filter(
  (service, index, services) =>
    services.findIndex(({ value }) => value === service.value) === index,
).map(({ value, shortTitle }) => ({ value, label: shortTitle }));

const DESTINATION_OPTIONS = [
  {
    value: "Bandaranaike International Airport",
    label: "Colombo airport (CMB)",
  },
  { value: "Colombo", label: "Colombo" },
  { value: "Hiriketiya", label: "Hiriketiya" },
  { value: "Udawalawe", label: "Udawalawe" },
  { value: "Arugam Bay", label: "Arugam Bay" },
  { value: "Ella", label: "Ella" },
  { value: "Sigiriya", label: "Sigiriya" },
  { value: "Kandy", label: "Kandy" },
  { value: "Tangalle", label: "Tangalle" },
  { value: "Galle", label: "Galle" },
  { value: "Weligama", label: "Weligama" },
  { value: "Ahangama local journey", label: "Around Ahangama" },
  { value: "Other", label: "Somewhere else" },
];

const TRANSFER_RATES = [
  {
    destination: "Colombo airport",
    formDestination: "Bandaranaike International Airport",
    car: 13120,
    van: 18860,
    featured: true,
  },
  { destination: "Colombo", car: 13120, van: 15580, featured: true },
  { destination: "Hiriketiya", car: 7280, van: 9100, featured: true },
  { destination: "Ella", car: 15580, van: 20500, featured: true },
  { destination: "Udawalawe", car: 11480, van: 15580 },
  { destination: "Tangalle", car: 8645, van: 10010 },
  { destination: "Kandy", car: 20500, van: 25420 },
  { destination: "Arugam Bay", car: 23780, van: 29520 },
  { destination: "Sigiriya", car: 25420, van: 30340 },
];

const formatLkr = (value) =>
  `LKR ${new Intl.NumberFormat("en-LK").format(value)}`;

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
      const response = await fetch(
        "/.netlify/functions/create-transport-enquiry",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            journeyDate: values.journeyDate?.format("YYYY-MM-DD"),
            source: "transport-page",
          }),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to send your transport request",
        );
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
        title="Ahangama Pass Transport Rates | Cars, Vans & Scooters"
        description="Exclusive scooter, car and van rates for Ahangama Pass and Ahangama Circle holders, including transfers to Colombo airport, Ella and beyond."
        canonical={absUrl(TRANSPORT_PATH)}
        ogImage={HERO_IMAGE}
        ogImageWidth={1920}
        ogImageHeight={1087}
      />

      <main className="transport-page">
        <header className="transport-hero">
          <img
            src={HERO_IMAGE}
            alt="Travelling along Sri Lanka's southern coast"
          />
          <div className="transport-heroShade" aria-hidden="true" />
          <div className="transport-heroContent">
            <Text className="transport-eyebrow transport-eyebrowLight">
              Ahangama transport rates
            </Text>
            <Title>Know the rate before you ride.</Title>
            <Paragraph>
              Clear customer prices for scooter hire and private one-way
              transfers from Ahangama, with cars and vans for longer journeys.
            </Paragraph>
            <Button type="primary" size="large" onClick={() => openEnquiry()}>
              Check availability <ArrowRightOutlined />
            </Button>
          </div>
        </header>

        <section className="transport-intro transport-shell">
          <div>
            <Text className="transport-eyebrow">Key prices</Text>
            <Title level={2}>The rates most travellers need.</Title>
          </div>
          <Paragraph>
            These discounted rates are exclusively for Ahangama Pass and
            Ahangama Circle pass holders. Prices are in Sri Lankan rupees, and
            transfers are one way from Ahangama and include the vehicle, not a
            per-person charge.
          </Paragraph>
        </section>

        <section className="transport-services" aria-label="Transport services">
          {SERVICES.map(({ value, number, title, detail, note, Icon }) => (
            <article className="transport-service" key={`${value}-${number}`}>
              <div className="transport-serviceTop">
                <Text>{number}</Text>
                {React.createElement(Icon, { "aria-hidden": true })}
              </div>
              <Title level={3}>{title}</Title>
              <Paragraph>{detail}</Paragraph>
              <Text className="transport-serviceNote">{note}</Text>
              <Button type="link" onClick={() => openEnquiry(value)}>
                Check availability <ArrowRightOutlined />
              </Button>
            </article>
          ))}
        </section>

        <section className="transport-routes">
          <div className="transport-shell transport-routesInner">
            <div className="transport-routesIntro">
              <Text className="transport-eyebrow">One-way transfers</Text>
              <Title level={2}>Compare car and van rates.</Title>
              <Paragraph>
                Rates shown are the best available customer price in the
                supplied rate card. A van is the practical choice for larger
                groups, extra luggage, or surfboards.
              </Paragraph>
            </div>
            <div
              className="transport-rateTable"
              role="table"
              aria-label="One-way transfer rates from Ahangama"
            >
              <div
                className="transport-rateRow transport-rateHeader"
                role="row"
              >
                <span role="columnheader">Destination</span>
                <span role="columnheader">Car</span>
                <span role="columnheader">Van</span>
                <span aria-hidden="true" />
              </div>
              {TRANSFER_RATES.map((item) => (
                <div
                  className={`transport-rateRow${item.featured ? " transport-rateFeatured" : ""}`}
                  role="row"
                  key={item.destination}
                >
                  <strong role="cell">{item.destination}</strong>
                  <Text role="cell">{formatLkr(item.car)}</Text>
                  <Text role="cell">{formatLkr(item.van)}</Text>
                  <Button
                    type="text"
                    aria-label={`Request transport to ${item.destination}`}
                    onClick={() =>
                      openEnquiry(
                        item.destination === "Colombo airport"
                          ? "airport_transfer"
                          : "private_transfer",
                        item.formDestination || item.destination,
                      )
                    }
                  >
                    <ArrowRightOutlined />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="transport-assurance transport-shell">
          <div>
            <CarOutlined />
            <Title level={3}>Private vehicle</Title>
            <Paragraph>
              Transfer prices cover the car or van, rather than charging each
              passenger separately.
            </Paragraph>
          </div>
          <div>
            <SafetyCertificateOutlined />
            <Title level={3}>Quote first</Title>
            <Paragraph>
              Availability and pricing are confirmed before you make a decision.
            </Paragraph>
          </div>
          <div>
            <SendOutlined />
            <Title level={3}>Special journey?</Title>
            <Paragraph>
              Send one request for return trips, multiple stops, luggage,
              boards, or a destination not listed.
            </Paragraph>
          </div>
        </section>

        <section className="transport-final">
          <Text className="transport-eyebrow">Dates make the difference</Text>
          <Title level={2}>Check your vehicle is available.</Title>
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
            <div className="transport-successIcon">
              <CheckOutlined />
            </div>
            <Title level={3}>We will start checking the right option.</Title>
            <Paragraph>
              The Ahangama team will contact you with availability and a direct
              quote for your journey.
            </Paragraph>
            <Button type="primary" onClick={closeEnquiry}>
              Done
            </Button>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={submitEnquiry}
            requiredMark={false}
            onValuesChange={(changedValues) => {
              if (changedValues.serviceType)
                setServiceType(changedValues.serviceType);
            }}
          >
            <Alert
              type="info"
              showIcon
              title="No payment is taken. We confirm availability and pricing first."
            />
            <div className="transport-formGrid">
              <Form.Item
                name="serviceType"
                label="What do you need?"
                rules={[{ required: true }]}
              >
                <Select options={SERVICE_OPTIONS} />
              </Form.Item>
              <Form.Item
                name="journeyDate"
                label={
                  serviceType === "scooter"
                    ? "Rental start date"
                    : "Travel date"
                }
                rules={[{ required: true, message: "Select a date" }]}
              >
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
              <Form.Item
                name="passengers"
                label="Travellers"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} max={20} style={{ width: "100%" }} />
              </Form.Item>
              {["scooter", "tuk_tuk"].includes(serviceType) ? (
                <Form.Item
                  name="rentalDays"
                  label="Rental days"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} max={90} style={{ width: "100%" }} />
                </Form.Item>
              ) : null}
              <Form.Item
                name="name"
                label="Your name"
                rules={[{ required: true, message: "Enter your name" }]}
              >
                <Input autoComplete="name" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Enter a valid email",
                  },
                ]}
              >
                <Input type="email" autoComplete="email" />
              </Form.Item>
              <Form.Item
                name="whatsapp"
                label="WhatsApp number"
                rules={[
                  { required: true, message: "Enter your WhatsApp number" },
                ]}
              >
                <Input
                  type="tel"
                  autoComplete="tel"
                  placeholder="Include country code"
                />
              </Form.Item>
            </div>
            <Form.Item name="notes" label="Anything we should know?">
              <Input.TextArea
                rows={3}
                maxLength={1000}
                placeholder="Flight number, luggage, surfboards, vehicle preference, or timing..."
              />
            </Form.Item>
            <Form.Item
              name="consent"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Please confirm we may contact you"),
                        ),
                },
              ]}
            >
              <Checkbox>
                I agree that Ahangama may contact me about this transport
                request.
              </Checkbox>
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={submitting}
            >
              Send transport request <ArrowRightOutlined />
            </Button>
          </Form>
        )}
      </Modal>
    </SiteLayout>
  );
}
