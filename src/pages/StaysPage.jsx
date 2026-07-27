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
  CompassOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  HomeOutlined,
  SkinOutlined,
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

const HOTEL_DETAILS = {
  "the-lighthouse-ahangama": { category: "Boutique hotel · Oceanfront", editorialTag: "Editor's Pick", facts: ["Private beach access", "Rooftop", "Restaurant", "Sunset views"] },
  "trebartha-east-the-roundhouse": { category: "Architectural retreat · Inland", editorialTag: "Quiet Escape", facts: ["Cinnamon estate", "Pool", "Restaurant", "Limited rooms"], profile: true },
  "mosvold-villa": { category: "Beachfront villa · Kabalana", editorialTag: "Best for Couples", facts: ["Beachfront", "Pool", "Ocean-view rooms", "Restaurant"], profile: true },
  "mana-villa": { category: "Wellness villa · Kabalana", editorialTag: "Surf Favourite", facts: ["Walk to Kabalana", "Pool", "Sauna", "Ice bath"] },
  "the-benison-ahangama": { category: "Boutique cabanas · Central Ahangama", editorialTag: "Quiet Escape", facts: ["Private cabanas", "Central location", "Restaurant", "Couples"], profile: true },
  "palm-hotel": { category: "Design hotel · Inland Ahangama", editorialTag: "Design Hotel", facts: ["Four acres", "Pool", "Gym", "Restaurant"], profile: true },
  "animals-boutique-hotel": { category: "Adults-only hotel · Kabalana", editorialTag: "Social Favourite", facts: ["Adults only", "Pool", "Restaurant", "Walk to beach"] },
  "abode-ahangama": { category: "Art Deco retreat · Ahangama", editorialTag: "Long Stay Favourite", facts: ["18-metre pool", "Two minutes to ocean", "Tropical garden", "Restored villa"] },
  "harding-boutique-hotel": { category: "Contemporary hotel · Central Ahangama", editorialTag: "Best Base", facts: ["Central location", "Ocean views", "Rooftop", "Restaurant"] },
  "casa-tikiri": { category: "Adults-only hotel · Kabalana", editorialTag: "Best for Couples", facts: ["Adults only", "300m to beach", "Pool", "Italian restaurant"] },
};

const CHAPTERS = [
  { eyebrow: "Chapter One", title: "Editor's Picks", introduction: "The places that best express where Ahangama is today: independent, thoughtful and inseparable from the landscape around them.", slugs: ["the-lighthouse-ahangama", "trebartha-east-the-roundhouse"], quote: "Good hotels become part of the journey." },
  { eyebrow: "Chapter Two", title: "By the Water", introduction: "For mornings shaped by the tide, sandy walks home and the particular calm that comes from sleeping within earshot of the Indian Ocean.", slugs: ["mosvold-villa", "mana-villa"], quote: "The best mornings in Ahangama begin slowly." },
  { eyebrow: "Chapter Three", title: "Small & Characterful", introduction: "Intimate stays where the welcome is personal, the pace is unhurried and every room feels connected to the life of the house.", slugs: ["the-benison-ahangama", "animals-boutique-hotel", "abode-ahangama"], quote: "Luxury here is measured in space, stillness and time." },
  { eyebrow: "Chapter Four", title: "Design-Led Stays", introduction: "Architecture with a point of view, from bold tropical modernism to quiet Italian restraint, without losing the warmth of the south coast.", slugs: ["palm-hotel", "harding-boutique-hotel", "casa-tikiri"] },
];

const NEIGHBOURHOODS = [
  { name: "Kabalana", description: "The centre of Ahangama's surf life. Stay here for an easy walk to the beach, excellent waves and a growing collection of restaurants and cafes." },
  { name: "Midigama", description: "A little looser and more surf-led, with reef breaks, small guesthouses and a slower rhythm west of town." },
  { name: "Central Ahangama", description: "Best for travellers who want to move easily between coffee, dinner, the station and the coast while keeping everything close at hand." },
  { name: "Goviyapana", description: "A quieter stretch towards the eastern edge of Ahangama, known for ocean views, rocky coves and a welcome sense of distance from the centre." },
];

export function EditorialHero({ onEnquire }) {
  return (
    <header className="stays-editorial-hero">
      <img src={HERO_IMAGE} alt="A design-led stay overlooking the Indian Ocean in Ahangama" />
      <div className="stays-editorial-hero-overlay" aria-hidden="true" />
      <div className="stays-editorial-hero-content">
        <Text className="stays-eyebrow stays-eyebrow-light">Editor's Selection · 2026</Text>
        <Title level={1}><span>The Best</span><span>Stays in</span><span>Ahangama</span></Title>
        <Paragraph>Only a handful of places truly capture the spirit of Ahangama. These are the hotels we'd confidently recommend to friends and family.</Paragraph>
        <Button className="stays-text-action stays-text-action-light" type="link" onClick={onEnquire}>Ask the editors <ArrowRightOutlined /></Button>
      </div>
    </header>
  );
}

export function EditorsLetter() {
  return (
    <section className="stays-letter stays-editorial-shell" aria-labelledby="editors-note-title">
      <div className="stays-letter-heading"><Text className="stays-eyebrow">A letter from Ahangama</Text><Title level={2} id="editors-note-title">Editor's Note</Title></div>
      <div className="stays-letter-copy">
        <Paragraph>A good hotel can change the way you understand a place. It introduces you to a neighbourhood, gives shape to the first hour of the morning and becomes the setting for stories you did not expect to bring home.</Paragraph>
        <Paragraph>We chose these stays by visiting, listening and returning. They are not ranked, and this is not an exhaustive directory. Each one has a clear point of view, generous hospitality and a relationship with Ahangama that feels genuine rather than manufactured.</Paragraph>
        <Paragraph>Some sit directly above the ocean; others disappear into cinnamon and palms. What connects them is a sense of care. These are the places we mention when someone asks where they should really stay.</Paragraph>
        <Text className="stays-letter-signature">— The Ahangama.com Editorial Team</Text>
      </div>
    </section>
  );
}

export function SelectionCriteria() {
  const criteria = [
    { icon: <SkinOutlined />, title: "Design", copy: "Architecture and interiors with intention, not decoration for its own sake." },
    { icon: <HeartOutlined />, title: "Hospitality", copy: "Warm, observant service that makes a stay feel personal." },
    { icon: <CompassOutlined />, title: "Location", copy: "A setting that helps you experience the rhythm of Ahangama." },
    { icon: <HomeOutlined />, title: "Sense of Place", copy: "A property that could only feel at home on Sri Lanka's south coast." },
  ];
  return (
    <section className="stays-criteria" aria-labelledby="selection-title"><div className="stays-editorial-shell">
      <Text className="stays-eyebrow">Our Method</Text><Title level={2} id="selection-title">How We Select</Title>
      <div className="stays-criteria-grid">{criteria.map((item) => <article key={item.title}><span className="stays-criterion-icon" aria-hidden="true">{item.icon}</span><Title level={3}>{item.title}</Title><Paragraph>{item.copy}</Paragraph></article>)}</div>
    </div></section>
  );
}

export function HotelFeature({ stay, index, onEnquire }) {
  const details = HOTEL_DETAILS[stay.slug];
  return (
    <article className={`stays-hotel-feature ${index % 2 ? "stays-hotel-feature-reverse" : ""}`}>
      <figure className="stays-hotel-figure"><img src={stay.image} alt={`${stay.name}, ${stay.location}`} loading="lazy" /><figcaption>{String(index + 1).padStart(2, "0")} · {stay.location}</figcaption></figure>
      <div className="stays-hotel-editorial">
        <div><Text className="stays-eyebrow">{details.category}</Text><Title level={3}>{stay.name}</Title><Text className="stays-editorial-tag">{details.editorialTag}</Text><Paragraph>{stay.description}</Paragraph><blockquote>{stay.editorNote}</blockquote></div>
        <div><ul className="stays-hotel-facts" aria-label={`${stay.name} highlights`}>{details.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
          <div className="stays-hotel-actions">{details.profile ? <Button href={`/stays/${stay.slug}`}>View Hotel</Button> : null}<Button type="primary" onClick={() => onEnquire(stay)}>Book Direct</Button></div>
          <Text className="stays-direct-note">We check the equivalent public rate before confirming a direct quote.</Text>
        </div>
      </div>
    </article>
  );
}

export function EditorialQuote({ children }) {
  return <aside className="stays-editorial-quote"><blockquote>“{children}”</blockquote></aside>;
}

export function NeighbourhoodGuide() {
  return (
    <section className="stays-neighbourhoods" aria-labelledby="neighbourhood-title"><div className="stays-editorial-shell">
      <div className="stays-neighbourhood-heading"><Text className="stays-eyebrow">Where to base yourself</Text><Title level={2} id="neighbourhood-title">Ahangama, Neighbourhood by Neighbourhood</Title></div>
      <div className="stays-neighbourhood-grid">{NEIGHBOURHOODS.map((area, index) => <article key={area.name}><Text>{String(index + 1).padStart(2, "0")}</Text><Title level={3}>{area.name}</Title><Paragraph>{area.description}</Paragraph></article>)}</div>
    </div></section>
  );
}

export function FinalThoughts({ onEnquire }) {
  return (
    <footer className="stays-final-thoughts stays-editorial-shell"><Text className="stays-eyebrow">Final Thoughts</Text><Title level={2}>Wherever you stay in Ahangama, the best experiences are rarely planned.</Title><Paragraph>Leave time for long breakfasts, slow afternoons and conversations with locals. The town reveals itself in the spaces between the itinerary.</Paragraph><Text className="stays-letter-signature">— The Ahangama.com Editorial Team</Text><Button className="stays-text-action" type="link" onClick={onEnquire}>Ask us where to stay <ArrowRightOutlined /></Button></footer>
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
        <EditorialHero onEnquire={() => openEnquiry()} />
        <EditorsLetter />
        <SelectionCriteria />
        <section className="stays-hotel-chapters" aria-label="The best stays in Ahangama">
          {CHAPTERS.map((chapter, chapterIndex) => {
            const chapterOffset = CHAPTERS.slice(0, chapterIndex).reduce((total, item) => total + item.slugs.length, 0);
            return (
              <section className="stays-chapter" key={chapter.title} aria-labelledby={`chapter-${chapterIndex}`}>
                <header className="stays-chapter-heading stays-editorial-shell"><Text className="stays-eyebrow">{chapter.eyebrow}</Text><Title level={2} id={`chapter-${chapterIndex}`}>{chapter.title}</Title><Paragraph>{chapter.introduction}</Paragraph></header>
                <div className="stays-feature-list">{chapter.slugs.map((slug, hotelIndex) => <HotelFeature key={slug} stay={STAYS.find((stay) => stay.slug === slug)} index={chapterOffset + hotelIndex} onEnquire={openEnquiry} />)}</div>
                {chapter.quote ? <EditorialQuote>{chapter.quote}</EditorialQuote> : null}
              </section>
            );
          })}
        </section>
        <NeighbourhoodGuide />
        <FinalThoughts onEnquire={() => openEnquiry()} />
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