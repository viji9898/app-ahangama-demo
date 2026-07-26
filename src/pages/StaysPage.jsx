import React, { useState } from "react";
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
import {
  ArrowRightOutlined,
  CheckOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import "../styles/stays-page.css";

const { Paragraph, Text, Title } = Typography;
const { RangePicker } = DatePicker;

export const STAYS_PATH = "/stays";

const HERO_IMAGE =
  "https://images.suitcasemag.com/wp-content/uploads/2025/03/05163113/HERO2-TheFind-SouthCoastSriLanka.jpeg";

const STAYS = [
  {
    slug: "the-lighthouse-ahangama",
    name: "The Lighthouse Ahangama",
    bestFor: "Oceanfront living and unforgettable sunsets",
    location: "Ahangama oceanfront",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/lighthouse.jpg",
    description:
      "Set directly above the Indian Ocean with private beach access, The Lighthouse is all about relaxed coastal living. Family-owned and full of character, it pairs comfortable rooms and lush gardens with one of Ahangama's best rooftop terraces.",
    editorNote:
      "Don't miss sunset cocktails from the rooftop overlooking the surf break.",
    otaPrice: 185,
    directPrice: 163,
    tags: ["Beachfront", "Sunsets", "Couples"],
  },
  {
    slug: "trebartha-east-the-roundhouse",
    name: "Trebartha East - The Roundhouse",
    bestFor: "Architecture lovers and nature seekers",
    location: "Cinnamon estate, inland Ahangama",
    image:
      "https://images.suitcasemag.com/wp-content/uploads/2025/03/18160116/Trebartha-Daisy-Wingate-Saul-9234-copy.jpeg",
    description:
      "Hidden within a working cinnamon estate, this intimate retreat is designed around a striking circular form with views across rice fields, tropical forest and the distant ocean.",
    editorNote: "One of Sri Lanka's most distinctive boutique stays.",
    otaPrice: 320,
    directPrice: 278,
    tags: ["Architecture", "Nature", "Retreat"],
  },
  {
    slug: "mosvold-villa",
    name: "Mosvold Villa",
    bestFor: "Barefoot luxury by the sea",
    location: "Kabalana beachfront",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/mosvold.jpg",
    description:
      "A secluded beachfront retreat where every room enjoys uninterrupted Indian Ocean views. Warm hospitality and a peaceful atmosphere make days between the beach, pool and long oceanfront dinners feel effortless.",
    editorNote: "Wake up to the ocean without leaving your bed.",
    otaPrice: 240,
    directPrice: 211,
    tags: ["Beachfront", "Villa", "Pool"],
  },
  {
    slug: "mana-villa",
    name: "Mana Villa",
    bestFor: "Wellness, surfing and slow living",
    location: "Near Kabalana Beach",
    image:
      "https://images.suitcasemag.com/wp-content/uploads/2025/03/12164550/Sola_425-copy.jpeg",
    description:
      "A short walk from Kabalana Beach, Mana combines considered rooms and a tranquil pool with a sauna, ice bath and curated wellness experiences for surfers and slow travellers.",
    editorNote:
      "Perfect if you want to combine surf sessions with wellness and relaxation.",
    otaPrice: 155,
    directPrice: 136,
    tags: ["Wellness", "Surf", "Pool"],
  },
  {
    slug: "the-benison-ahangama",
    name: "The Benison",
    bestFor: "A quiet boutique experience",
    location: "Central Ahangama",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/the_benison.jpeg",
    description:
      "Thoughtfully designed cabanas, personalised hospitality and a calm atmosphere make The Benison an intimate retreat for travellers seeking comfort without compromising on location.",
    editorNote: "Ideal for couples looking for a slower, peaceful escape.",
    otaPrice: 145,
    directPrice: 127,
    tags: ["Boutique", "Couples", "Quiet"],
  },
  {
    slug: "palm-hotel",
    name: "PALM Hotel",
    bestFor: "Design lovers and creative travellers",
    location: "Ahangama jungle",
    image:
      "https://images.suitcasemag.com/wp-content/uploads/2025/03/05162910/6-Palm-SouthSriLankaHotels.jpeg",
    description:
      "Set across four tropical acres, PALM's A-frame cabanas, contemporary architecture, concept store, restaurant, gym and pool make it a design-led lifestyle retreat rather than simply a hotel.",
    editorNote: "One of Ahangama's most recognisable design hotels.",
    otaPrice: 210,
    directPrice: 185,
    tags: ["Design", "Jungle", "Gym"],
  },
  {
    slug: "animals-boutique-hotel",
    name: "Animals Boutique Hotel",
    bestFor: "Stylish stays near Kabalana Beach",
    location: "Kabalana",
    image:
      "https://images.suitcasemag.com/wp-content/uploads/2025/03/05162855/2-TheFind-SouthSriLankaHotels.jpeg",
    description:
      "This adults-only stay is known for its tropical courtyard, stylish pool, vibrant restaurant and relaxed social atmosphere, close to the surf, cafes and nightlife without sitting on the busy beach road.",
    editorNote:
      "Great for couples and friends who enjoy good food, cocktails and boutique design.",
    otaPrice: 135,
    directPrice: 119,
    tags: ["Adults only", "Social", "Pool"],
  },
  {
    slug: "abode-ahangama",
    name: "Abode Ahangama",
    bestFor: "Jungle tranquillity close to the beach",
    location: "Ahangama, two minutes from the ocean",
    image:
      "https://images.suitcasemag.com/wp-content/uploads/2025/03/05162858/3-TheFind-SouthSriLankaHotels.jpeg",
    description:
      "Hidden among palms in a restored Art Deco building, Abode blends boho-luxe interiors, an 18-metre pool and personal hospitality with easy access to Ahangama's cafe and surf scene.",
    editorNote: "A quiet jungle oasis with the beach just around the corner.",
    otaPrice: 175,
    directPrice: 154,
    tags: ["Art Deco", "Pool", "Near beach"],
  },
  {
    slug: "harding-boutique-hotel",
    name: "Harding Boutique Hotel",
    bestFor: "Modern comfort in the heart of Ahangama",
    location: "Central Ahangama",
    image:
      "https://i0.wp.com/images.suitcasemag.com/wp-content/uploads/2025/03/05162919/8-Harding-SouthSriLankaHotels.jpeg?fit=1024%2C683&ssl=1",
    description:
      "Contemporary accommodation, warm service and easy access to beaches, restaurants and surf breaks make Harding an excellent base for travellers who want to explore the south coast.",
    editorNote: "A great choice if you plan to spend your days exploring.",
    otaPrice: 190,
    directPrice: 167,
    tags: ["Central", "Modern", "Ocean views"],
  },
  {
    slug: "casa-tikiri",
    name: "Casa Tikiri Boutique Hotel",
    bestFor: "Design, romance and Italian-inspired hospitality",
    location: "Near Kabalana Beach",
    image:
      "https://i0.wp.com/images.suitcasemag.com/wp-content/uploads/2025/03/05162907/5-CasaTikiri-SouthSriLankaHotels.jpeg?fit=1024%2C683&ssl=1",
    description:
      "Created by an Italian couple, Casa Tikiri brings together curated rooms, a renowned Italian restaurant and a peaceful adults-only jungle setting just 300 metres from Kabalana Beach.",
    editorNote:
      "One of Ahangama's most beautifully designed stays for couples and design enthusiasts.",
    otaPrice: 165,
    directPrice: 145,
    tags: ["Adults only", "Romantic", "Restaurant"],
  },
];

const PROPERTY_OPTIONS = STAYS.map(({ name, slug }) => ({
  label: name,
  value: slug,
}));

function RateComparison({ stay, onEnquire }) {
  const saving = stay.otaPrice - stay.directPrice;
  const percentage = Math.round((saving / stay.otaPrice) * 100);

  return (
    <aside className="stays-rate-panel" aria-label={`${stay.name} example rate`}>
      <Text className="stays-rate-eyebrow">Example nightly rate</Text>
      <div className="stays-rate-row stays-rate-ota">
        <span>Booking.com</span>
        <span>${stay.otaPrice}</span>
      </div>
      <div className="stays-rate-row stays-rate-direct">
        <span>Book with Ahangama</span>
        <strong>${stay.directPrice}</strong>
      </div>
      <div className="stays-saving">
        <CheckOutlined /> Save ${saving} ({percentage}%)
      </div>
      <Button type="primary" size="large" block onClick={onEnquire}>
        Check availability <ArrowRightOutlined />
      </Button>
      <Text className="stays-rate-fineprint">
        Indicative only. We compare the same dates, room and terms before confirming your quote.
      </Text>
    </aside>
  );
}

export default function StaysPage() {
  const [form] = Form.useForm();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedStay, setSelectedStay] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const canonical = absUrl(STAYS_PATH);

  const openEnquiry = (stay = null) => {
    setSubmitted(false);
    setSelectedStay(stay);
    setEnquiryOpen(true);
    form.resetFields();
    form.setFieldsValue({
      property: stay?.slug || "help-me-choose",
      adults: 2,
      children: 0,
    });
  };

  const closeEnquiry = () => {
    setEnquiryOpen(false);
    setSelectedStay(null);
    setSubmitted(false);
  };

  const submitEnquiry = async (values) => {
    setSubmitting(true);

    try {
      const response = await fetch("/.netlify/functions/create-stay-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          checkIn: values.dates?.[0]?.format("YYYY-MM-DD"),
          checkOut: values.dates?.[1]?.format("YYYY-MM-DD"),
          dates: undefined,
          source: "stays-editorial",
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to send your enquiry");
      }

      setSubmitted(true);
      form.resetFields();
    } catch (error) {
      message.error(error.message || "Unable to send your enquiry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Best Stays in Ahangama"
        description="A hand-picked guide to Ahangama's best boutique hotels, beachfront villas and hidden retreats, with locally managed direct-booking enquiries."
        canonical={canonical}
        ogImage={HERO_IMAGE}
        ogType="article"
        author="Ahangama"
        publishDate="2026-07-27T09:00:00.000Z"
      />

      <main className="stays-page">
        <header className="stays-hero">
          <img src={HERO_IMAGE} alt="Boutique stay on Sri Lanka's south coast" />
          <div className="stays-hero-shade" />
          <div className="stays-hero-content">
            <Text className="stays-kicker">The Ahangama edit · July 2026</Text>
            <Title level={1}>Best Stays in Ahangama</Title>
            <Paragraph>
              Boutique hotels, beachfront villas and hidden retreats we would recommend to our own friends.
            </Paragraph>
            <Button type="primary" size="large" onClick={() => openEnquiry()}>
              Find my stay <ArrowRightOutlined />
            </Button>
          </div>
        </header>

        <section className="stays-intro stays-shell">
          <div>
            <Text className="stays-section-label">Stay thoughtfully</Text>
            <Title level={2}>Discover the best places to stay in Ahangama</Title>
          </div>
          <div className="stays-intro-copy">
            <Paragraph>
              Once a quiet fishing village, Ahangama has become one of Sri Lanka's most sought-after coastal destinations, celebrated for world-class surf, vibrant cafes, wellness and laid-back tropical living.
            </Paragraph>
            <Paragraph>
              Rather than large resorts, the town is home to owner-led hotels, villas and retreats with genuine character. We hand-pick the places below, then help you secure a direct rate that aims to beat the equivalent public OTA price by 10-15%.
            </Paragraph>
          </div>
        </section>

        <section className="stays-promise" aria-label="Why enquire with Ahangama">
          <div className="stays-shell stays-promise-grid">
            <div><SafetyCertificateOutlined /><span><strong>Hand-picked</strong>Editorially selected, never an endless directory.</span></div>
            <div><CheckOutlined /><span><strong>Better direct rates</strong>Matched against equivalent public booking terms.</span></div>
            <div><EnvironmentOutlined /><span><strong>Local help</strong>Human recommendations from people who know Ahangama.</span></div>
          </div>
        </section>

        <section className="stays-why stays-shell">
          <Text className="stays-section-label">Why Ahangama</Text>
          <Title level={2}>Relaxed enough to disappear. Connected enough to do everything.</Title>
          <Paragraph>
            Surf breaks, hidden beaches, yoga studios and independent restaurants sit within easy reach. Whether you are travelling solo, as a couple, with family or friends, there is a stay here that fits the rhythm of your trip.
          </Paragraph>
        </section>

        <section className="stays-list stays-shell">
          <div className="stays-list-heading">
            <Text className="stays-section-label">Our favourites</Text>
            <Title level={2}>Ten places worth planning a trip around</Title>
          </div>

          {STAYS.map((stay, index) => (
            <article className={`stays-property ${index % 2 ? "stays-property-reverse" : ""}`} key={stay.slug}>
              <div className="stays-property-image">
                <img src={stay.image} alt={`${stay.name} in Ahangama`} loading="lazy" />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="stays-property-copy">
                <div>
                  <Text className="stays-location"><EnvironmentOutlined /> {stay.location}</Text>
                  <Title level={2}>{stay.name}</Title>
                  <Title level={3}>{stay.bestFor}</Title>
                  <Paragraph>{stay.description}</Paragraph>
                  <div className="stays-tags">{stay.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <blockquote><span>Editor's note</span>{stay.editorNote}</blockquote>
                </div>
                <RateComparison stay={stay} onEnquire={() => openEnquiry(stay)} />
              </div>
            </article>
          ))}
        </section>

        <section className="stays-concierge">
          <div className="stays-shell stays-concierge-inner">
            <div>
              <Text className="stays-section-label">A local pair of eyes</Text>
              <Title level={2}>Not sure where to stay?</Title>
              <Paragraph>
                Tell us your dates, budget and what matters to you. We will shortlist the right places, check availability and return with a matched direct quote.
              </Paragraph>
            </div>
            <Button type="primary" size="large" onClick={() => openEnquiry()}>
              Help me choose <ArrowRightOutlined />
            </Button>
          </div>
        </section>

        <footer className="stays-closing stays-shell">
          <Title level={2}>Wherever you choose to stay, Ahangama promises slow mornings, golden sunsets and memories that last long after you leave.</Title>
        </footer>
      </main>

      <Modal
        className="stays-enquiry-modal"
        open={enquiryOpen}
        onCancel={closeEnquiry}
        footer={null}
        width={680}
        title={submitted ? "Enquiry received" : selectedStay?.name ? `Check ${selectedStay.name}` : "Find my Ahangama stay"}
        destroyOnHidden
      >
        {submitted ? (
          <div className="stays-success">
            <div><CheckOutlined /></div>
            <Title level={3}>We will start checking the right stays.</Title>
            <Paragraph>
              We will compare matching room terms and contact you with availability and the best direct quote we can secure.
            </Paragraph>
            <Button type="primary" onClick={closeEnquiry}>Done</Button>
          </div>
        ) : (
          <Form form={form} layout="vertical" onFinish={submitEnquiry} requiredMark={false}>
            <Alert
              type="info"
              showIcon
              message="No payment is taken. We verify live availability and pricing before sending your quote."
            />
            <div className="stays-form-grid">
              <Form.Item name="property" label="Preferred stay" rules={[{ required: true }]}>
                <Select options={[{ label: "Help me choose", value: "help-me-choose" }, ...PROPERTY_OPTIONS]} />
              </Form.Item>
              <Form.Item name="dates" label="Check-in and check-out" rules={[{ required: true, message: "Select your travel dates" }]}>
                <RangePicker format="DD MMM YYYY" style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="adults" label="Adults" rules={[{ required: true }]}>
                <InputNumber min={1} max={20} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="children" label="Children">
                <InputNumber min={0} max={12} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="budget" label="Budget per night (USD)">
                <Select placeholder="Any budget" options={[
                  { label: "Under $125", value: "under-125" },
                  { label: "$125-$200", value: "125-200" },
                  { label: "$200-$300", value: "200-300" },
                  { label: "$300+", value: "300-plus" },
                ]} />
              </Form.Item>
              <Form.Item name="name" label="Your name" rules={[{ required: true, message: "Enter your name" }]}>
                <Input autoComplete="name" />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Enter a valid email" }]}>
                <Input type="email" autoComplete="email" />
              </Form.Item>
              <Form.Item name="whatsapp" label="WhatsApp number">
                <Input type="tel" autoComplete="tel" placeholder="Include country code" />
              </Form.Item>
            </div>
            <Form.Item name="notes" label="What would make this stay perfect?">
              <Input.TextArea rows={3} maxLength={1000} placeholder="Beachfront, quiet, surf access, a family room, wellness..." />
            </Form.Item>
            <Form.Item name="consent" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error("Please confirm we may contact you")) }]}>
              <Checkbox>I agree that Ahangama may contact me about this stay enquiry.</Checkbox>
            </Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={submitting}>
              Send availability enquiry <ArrowRightOutlined />
            </Button>
          </Form>
        )}
      </Modal>
    </SiteLayout>
  );
}