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
  HomeOutlined,
  KeyOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import "../styles/stays-page.css";

const { Paragraph, Text, Title } = Typography;
const { RangePicker } = DatePicker;

export const BEST_AIRBNBS_PATH = "/best-airbnbs";

const HERO_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/pebble_alma.jpg";

const VILLAS = [
  {
    slug: "pebble-alma",
    name: "Pebble Alma",
    location: "Central Ahangama",
    category: "Micro retreat · Central Ahangama",
    editorialTag: "Design-Led Favourite",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/pebble_alma.jpg",
    description:
      "Inspired by the quiet beauty of a pebble, Pebble Alma is Ahangama's first micro retreat: a thoughtfully designed stay that celebrates simplicity, calm and meaningful travel. Clean architecture and natural textures make it easy to slow down without losing touch with town.",
    editorNote:
      "A beautifully designed stay for travellers who appreciate minimalist spaces and a slower pace of life.",
    facts: ["Micro retreat", "Central location", "Minimal design", "Private stay"],
    profile: true,
  },
  {
    slug: "villa-queen-fort",
    name: "Villa Queen Fort",
    location: "Ahangama",
    category: "Private villa · Ahangama",
    editorialTag: "Best for Groups",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/villa_queen_fort.jpeg",
    description:
      "Villa Queen Fort offers the comfort of a private home with generous indoor and outdoor living spaces designed for spending quality time together. It is a relaxed base close to Ahangama's beaches with room to unwind after a day on the coast.",
    editorNote:
      "Perfect for larger groups who want privacy and the flexibility of a private villa.",
    facts: ["Group friendly", "Indoor-outdoor living", "Near beaches", "Private home"],
    profile: true,
  },
  {
    slug: "villa-mugatiya",
    name: "Villa Mugatiya",
    location: "Inland Ahangama",
    category: "Heritage villa · Inland",
    editorialTag: "Heritage Favourite",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/villa_mugatiya.jpeg",
    description:
      "Lovingly restored from a traditional Sri Lankan estate, Villa Mugatiya blends heritage architecture with contemporary comfort across more than an acre of tropical gardens. Original jackwood features and an infinity pool give the house a deep connection to its surroundings.",
    editorNote:
      "One of Ahangama's most beautiful heritage villas, perfect for slowing down.",
    facts: ["Heritage estate", "One-acre garden", "Infinity pool", "Original jackwood"],
    profile: true,
  },
  {
    slug: "naia-ocean-house",
    name: "Naïa Ocean House",
    location: "Ahangama oceanfront",
    category: "Beach house · Oceanfront",
    editorialTag: "Best by the Sea",
    image:
      "https://images.suitcasemag.com/wp-content/uploads/2025/03/05162855/2-TheFind-SouthSriLankaHotels.jpeg",
    description:
      "With uninterrupted views of the Indian Ocean and direct beach access, Naïa Ocean House is centred entirely around the sea. Coffee happens on the terrace, surfers pass below and the sound of the waves follows you to bed.",
    editorNote:
      "Stay here if your dream holiday starts and ends by the beach.",
    facts: ["Direct beach access", "Ocean views", "Private house", "Surf outlook"],
  },
  {
    slug: "younger-villas-resorts",
    name: "Younger Villas & Resorts",
    location: "Jungle edge, Ahangama",
    category: "Colonial villas · Jungle edge",
    editorialTag: "Private Resort Feel",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/younger_villas_resorts.jpeg",
    description:
      "Hidden in a quiet jungle setting, Younger offers restored colonial villas surrounded by tropical gardens. An infinity pool, spa treatments and chef-prepared meals create a sense of resort ease only minutes from Ahangama's beaches and cafés.",
    editorNote:
      "A wonderful balance of privacy, nature and easy access to Ahangama.",
    facts: ["Colonial villas", "Infinity pool", "Spa treatments", "Private chef"],
    profile: true,
  },
  {
    slug: "puffer-fish",
    name: "Puffer Fish Villa",
    location: "Near Kabalana Beach",
    category: "Contemporary villa · Kabalana",
    editorialTag: "Best for Couples",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/puffer_fish.jpeg",
    description:
      "A short walk from Kabalana Beach, Puffer Fish is a contemporary one-bedroom retreat for couples and small groups. Its private pool, open-plan living and calm aesthetic make beach days feel particularly effortless.",
    editorNote:
      "Perfect for couples wanting a stylish private villa close to the surf.",
    facts: ["One bedroom", "Private pool", "Walk to Kabalana", "Open-plan living"],
    profile: true,
  },
  {
    slug: "midigama-plantation",
    name: "Midigama Plantation",
    location: "Midigama countryside",
    category: "Plantation retreat · Midigama",
    editorialTag: "Countryside Escape",
    image:
      "https://images.suitcasemag.com/wp-content/uploads/2025/03/18160112/Trebartha-stories-Daisy-Wingate-Saul-8685-copy.jpeg",
    description:
      "Surrounded by cinnamon trees and rice paddies, Midigama Plantation reveals a quieter side of the south coast. Restored colonial buildings and expansive gardens feel wonderfully secluded, yet the area's famous surf breaks remain only minutes away.",
    editorNote:
      "A favourite for travellers who love nature as much as the beach.",
    facts: ["Cinnamon estate", "Rice-field setting", "Colonial buildings", "Near surf"],
  },
  {
    slug: "art-house",
    name: "Art House",
    location: "Ahangama",
    category: "Creative villa · Ahangama",
    editorialTag: "For Creative Souls",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/art_house.jpeg",
    description:
      "More than a place to stay, Art House is a home inspired by art, craftsmanship and slow living. Carefully selected work and individual design details reflect Ahangama's creative spirit while keeping the atmosphere intimate and peaceful.",
    editorNote:
      "A unique choice for travellers who appreciate creativity and character.",
    facts: ["Curated artwork", "Private villa", "Design details", "Quiet setting"],
    profile: true,
  },
  {
    slug: "ekuku-lake-house",
    name: "Ekuku Lake House",
    location: "Koggala Lake",
    category: "Lake house · Koggala",
    editorialTag: "Best for Nature",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/ekuku_lake_house.jpeg",
    description:
      "Overlooking the calm waters of Koggala Lake, Ekuku offers a peaceful alternative to beachfront accommodation. Mornings begin with birdsong, while kayaks, lush gardens and quiet lake views set an entirely different rhythm.",
    editorNote:
      "Best for couples and nature lovers looking for a quieter side of the south coast.",
    facts: ["Lake views", "Kayaks", "Tropical garden", "Nature setting"],
    profile: true,
  },
];

const CHAPTERS = [
  {
    eyebrow: "Chapter One",
    title: "Editor's Selection",
    introduction:
      "Private homes with a distinctive point of view, chosen for the way design, landscape and hospitality come together.",
    slugs: ["pebble-alma", "villa-mugatiya"],
    quote: "The pleasure of a villa is having nowhere else you need to be.",
  },
  {
    eyebrow: "Chapter Two",
    title: "For Families & Friends",
    introduction:
      "Space to gather, room to disappear and the freedom to let each day find its own rhythm.",
    slugs: ["villa-queen-fort", "younger-villas-resorts"],
    quote: "The best houses make time together feel effortless.",
  },
  {
    eyebrow: "Chapter Three",
    title: "Close to the Water",
    introduction:
      "For travellers who measure the day in tides, surf sessions and barefoot walks home from the beach.",
    slugs: ["naia-ocean-house", "puffer-fish"],
    quote: "Here, the ocean is not a view. It is the rhythm of the stay.",
  },
  {
    eyebrow: "Chapter Four",
    title: "Hidden Retreats",
    introduction:
      "Plantations, art-filled homes and lakeside hideaways that reveal a greener, quieter version of the south coast.",
    slugs: ["midigama-plantation", "art-house", "ekuku-lake-house"],
  },
];

const PROPERTY_OPTIONS = VILLAS.map(({ name, slug }) => ({ label: name, value: slug }));

function VillaHero({ onEnquire }) {
  return (
    <header className="stays-editorial-hero">
      <img src={HERO_IMAGE} alt="Pebble Alma private retreat in Ahangama" />
      <div className="stays-editorial-hero-overlay" aria-hidden="true" />
      <div className="stays-editorial-hero-content">
        <Text className="stays-eyebrow stays-eyebrow-light">The Villa Edit · 2026</Text>
        <Title level={1}><span>The Best</span><span>Private Villas</span><span>in Ahangama</span></Title>
        <Paragraph>Private villas, beach houses and hidden retreats for an unforgettable stay on Sri Lanka's south coast.</Paragraph>
        <Button className="stays-text-action stays-text-action-light" type="link" onClick={onEnquire}>Ask the editors <ArrowRightOutlined /></Button>
      </div>
    </header>
  );
}

function VillaEditorsLetter() {
  return (
    <section className="stays-letter stays-editorial-shell" aria-labelledby="villa-editors-note">
      <div className="stays-letter-heading"><Text className="stays-eyebrow">A private way to stay</Text><Title level={2} id="villa-editors-note">Editor's Note</Title></div>
      <div className="stays-letter-copy">
        <Paragraph>A private villa changes the pace of a trip. Breakfast can last until lunch, wet swimwear can remain by the pool and nobody needs to agree on when the day should begin.</Paragraph>
        <Paragraph>We selected these homes for more than privacy. Each has a strong sense of place, whether that comes through inherited architecture, a direct relationship with the ocean or a garden that makes the coast feel very far away.</Paragraph>
        <Paragraph>This is not a complete inventory. It is the list we share with couples, families and groups who want the freedom of a home with the character of somewhere memorable.</Paragraph>
        <Text className="stays-letter-signature">— The Ahangama.com Editorial Team</Text>
      </div>
    </section>
  );
}

function VillaCriteria() {
  const criteria = [
    { icon: <KeyOutlined />, title: "Privacy", copy: "A genuine sense that the house and its rhythm belong to you." },
    { icon: <TeamOutlined />, title: "Space", copy: "Comfortable places to gather, retreat and spend unhurried time together." },
    { icon: <CompassOutlined />, title: "Setting", copy: "Beach, jungle, paddy or lake: surroundings that shape the stay." },
    { icon: <HomeOutlined />, title: "Character", copy: "A clear identity rooted in architecture, craft and the south coast." },
  ];
  return (
    <section className="stays-criteria" aria-labelledby="villa-selection-title"><div className="stays-editorial-shell">
      <Text className="stays-eyebrow">Our Method</Text><Title level={2} id="villa-selection-title">How We Select</Title>
      <div className="stays-criteria-grid">{criteria.map((item) => <article key={item.title}><span className="stays-criterion-icon" aria-hidden="true">{item.icon}</span><Title level={3}>{item.title}</Title><Paragraph>{item.copy}</Paragraph></article>)}</div>
    </div></section>
  );
}

function VillaFeature({ villa, index, onEnquire }) {
  return (
    <article className={`stays-hotel-feature ${index % 2 ? "stays-hotel-feature-reverse" : ""}`}>
      <figure className="stays-hotel-figure"><img src={villa.image} alt={`${villa.name}, ${villa.location}`} loading="lazy" /><figcaption>{String(index + 1).padStart(2, "0")} · {villa.location}</figcaption></figure>
      <div className="stays-hotel-editorial">
        <div><Text className="stays-eyebrow">{villa.category}</Text><Title level={3}>{villa.name}</Title><Text className="stays-editorial-tag">{villa.editorialTag}</Text><Paragraph>{villa.description}</Paragraph><blockquote>{villa.editorNote}</blockquote></div>
        <div><ul className="stays-hotel-facts" aria-label={`${villa.name} highlights`}>{villa.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
          <div className="stays-hotel-actions">{villa.profile ? <Button href={`/stays/${villa.slug}`}>View Villa</Button> : null}<Button type="primary" onClick={() => onEnquire(villa)}>Book Direct</Button></div>
          <Text className="stays-direct-note">We check the equivalent public rate before confirming a direct quote.</Text>
        </div>
      </div>
    </article>
  );
}

function EditorialQuote({ children }) {
  return <aside className="stays-editorial-quote"><blockquote>“{children}”</blockquote></aside>;
}

function FinalThoughts({ onEnquire }) {
  return (
    <footer className="stays-final-thoughts stays-editorial-shell"><Text className="stays-eyebrow">Final Thoughts</Text><Title level={2}>Find a private corner of Ahangama to make your own.</Title><Paragraph>Whether you are travelling as a couple, family or group, leave space in the plan for long breakfasts, late swims and the particular pleasure of staying in.</Paragraph><Text className="stays-letter-signature">— The Ahangama.com Editorial Team</Text><Button className="stays-text-action" type="link" onClick={onEnquire}>Ask us to find your villa <ArrowRightOutlined /></Button></footer>
  );
}

export default function BestAirbnbsPage() {
  const [form] = Form.useForm();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedVilla, setSelectedVilla] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const openEnquiry = (villa = null) => {
    setSelectedVilla(villa);
    setSubmitted(false);
    setEnquiryOpen(true);
    form.resetFields();
    form.setFieldsValue({ property: villa?.slug || "help-me-choose", adults: 2, children: 0 });
  };

  const closeEnquiry = () => {
    setEnquiryOpen(false);
    setSelectedVilla(null);
    setSubmitted(false);
  };

  const submitEnquiry = async (values) => {
    setSubmitting(true);
    try {
      const response = await fetch("/.netlify/functions/create-stay-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, checkIn: values.dates?.[0]?.format("YYYY-MM-DD"), checkOut: values.dates?.[1]?.format("YYYY-MM-DD"), dates: undefined, source: "best-airbnbs-editorial" }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to send your enquiry");
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
      <Seo title="Best Airbnbs & Private Villas in Ahangama" description="A hand-picked editorial guide to Ahangama's best private villas, beach houses and hidden retreats for couples, families and groups." canonical={absUrl(BEST_AIRBNBS_PATH)} ogImage={HERO_IMAGE} ogType="article" author="Ahangama" publishDate="2026-07-27T09:00:00.000Z" />
      <main className="stays-page">
        <VillaHero onEnquire={() => openEnquiry()} />
        <VillaEditorsLetter />
        <VillaCriteria />
        <section className="stays-hotel-chapters" aria-label="The best private villas in Ahangama">
          {CHAPTERS.map((chapter, chapterIndex) => {
            const offset = CHAPTERS.slice(0, chapterIndex).reduce((total, item) => total + item.slugs.length, 0);
            return <section className="stays-chapter" key={chapter.title} aria-labelledby={`villa-chapter-${chapterIndex}`}>
              <header className="stays-chapter-heading stays-editorial-shell"><Text className="stays-eyebrow">{chapter.eyebrow}</Text><Title level={2} id={`villa-chapter-${chapterIndex}`}>{chapter.title}</Title><Paragraph>{chapter.introduction}</Paragraph></header>
              <div className="stays-feature-list">{chapter.slugs.map((slug, index) => <VillaFeature key={slug} villa={VILLAS.find((villa) => villa.slug === slug)} index={offset + index} onEnquire={openEnquiry} />)}</div>
              {chapter.quote ? <EditorialQuote>{chapter.quote}</EditorialQuote> : null}
            </section>;
          })}
        </section>
        <FinalThoughts onEnquire={() => openEnquiry()} />
      </main>

      <Modal className="stays-enquiry-modal" open={enquiryOpen} onCancel={closeEnquiry} footer={null} width={680} title={submitted ? "Enquiry received" : selectedVilla?.name ? `Check ${selectedVilla.name}` : "Find my private villa"} destroyOnHidden>
        {submitted ? <div className="stays-success"><div><CheckOutlined /></div><Title level={3}>We will start checking the right villas.</Title><Paragraph>We will compare matching terms and contact you with availability and the best direct quote we can secure.</Paragraph><Button type="primary" onClick={closeEnquiry}>Done</Button></div> :
          <Form form={form} layout="vertical" onFinish={submitEnquiry} requiredMark={false}>
            <Alert type="info" showIcon message="No payment is taken. We verify live availability and pricing before sending your quote." />
            <div className="stays-form-grid">
              <Form.Item name="property" label="Preferred villa" rules={[{ required: true }]}><Select options={[{ label: "Help me choose", value: "help-me-choose" }, ...PROPERTY_OPTIONS]} /></Form.Item>
              <Form.Item name="dates" label="Check-in and check-out" rules={[{ required: true, message: "Select your travel dates" }]}><RangePicker format="DD MMM YYYY" style={{ width: "100%" }} /></Form.Item>
              <Form.Item name="adults" label="Adults" rules={[{ required: true }]}><InputNumber min={1} max={20} style={{ width: "100%" }} /></Form.Item>
              <Form.Item name="children" label="Children"><InputNumber min={0} max={12} style={{ width: "100%" }} /></Form.Item>
              <Form.Item name="budget" label="Budget per night (USD)"><Select placeholder="Any budget" options={[{ label: "Under $200", value: "under-200" }, { label: "$200-$350", value: "200-350" }, { label: "$350-$500", value: "350-500" }, { label: "$500+", value: "500-plus" }]} /></Form.Item>
              <Form.Item name="name" label="Your name" rules={[{ required: true, message: "Enter your name" }]}><Input autoComplete="name" /></Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Enter a valid email" }]}><Input type="email" autoComplete="email" /></Form.Item>
              <Form.Item name="whatsapp" label="WhatsApp number"><Input type="tel" autoComplete="tel" placeholder="Include country code" /></Form.Item>
            </div>
            <Form.Item name="notes" label="What would make this villa perfect?"><Input.TextArea rows={3} maxLength={1000} placeholder="Bedrooms, beachfront, chef, surf access, family facilities..." /></Form.Item>
            <Form.Item name="consent" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error("Please confirm we may contact you")) }]}><Checkbox>I agree that Ahangama may contact me about this villa enquiry.</Checkbox></Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={submitting}>Send villa enquiry <ArrowRightOutlined /></Button>
          </Form>}
      </Modal>
    </SiteLayout>
  );
}