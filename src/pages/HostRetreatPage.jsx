import React, { useState } from "react";
import { Button, Checkbox, DatePicker, Form, Input, InputNumber, Select, Typography, message } from "antd";
import { ArrowRightOutlined, CheckOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import "../styles/host-retreat-page.css";

const { Paragraph, Text, Title } = Typography;
const { RangePicker } = DatePicker;

export const HOST_RETREAT_PATH = "/host-a-retreat-ahangama";

const VENUES = [
  {
    slug: "kurulu-bay",
    name: "Kurulu Bay",
    location: "Koggala Lake",
    statement: "For immersive wellness retreats.",
    description: "Private. Quiet. Designed around the lake. Kurulu Bay feels purpose-built for transformational retreats. The dedicated yoga shala, Ayurvedic philosophy and exclusive-use model allow facilitators to completely shape the guest experience.",
    ideal: ["Yoga", "Meditation", "Breathwork", "Women's Retreats", "Sound Healing"],
    highlights: ["30 Guests", "Dedicated Yoga Shala", "Ayurveda", "Spa", "Exclusive Estate", "Boat Experiences"],
    images: [
      "https://images.openai.com/static-rsc-4/dH7shEGk1uXluF2Jir2c0DGDyYL3Z1kIo7mtn_Fdm219IbR2HYzMwWZJYukJ89v_3Ndbo64q64fWu883O89hVuDk9nHpEKl8N9MnPcbePkvJsC0tOD_JN_5upPYy1qJeOVhQOa9CHEJ67Xjjr1h7N200gaHbZs10vAIJSwWklPk?purpose=inline",
      "https://images.openai.com/static-rsc-4/JXCnjEfm-Ie99SK4z3SSTNdsq4mIMeSmle9gQZaPqKd4MlPQ0YhVq6fpcvzpEZ5LaChTq5_sinda48tCj6NhYv5y6MQ_knQQ-MgXyVdNAtVG9_MP3mFAM3utI-BEq_UvUuIP_k0-j_uFs6jR_f2Od721XxN-IkEMTRa-x2rqwiY?purpose=inline",
      "https://images.openai.com/static-rsc-4/s8tsX09G03BkcAD0W0bAlhcLIIB2CNydRhuMgYpCns22Em0jsnXyq2o6yFUSF8TUJs6c_TzR37iFyEzf6FbL9euBvAYtNd75-X_yYGWPRG6We_yv_-wLxjfw5rhseYCIGHbgFfEke96rnIO5EuLzu25SSwn4cTxv0hQiumgplV8?purpose=inline",
    ],
  },
  {
    slug: "the-palm",
    name: "The PALM",
    location: "Jungle meets ocean",
    statement: "Connection, with room to breathe.",
    description: "The PALM offers a contemporary boutique setting with an energetic atmosphere that naturally suits creative retreats, founders' offsites and wellness experiences. Its design encourages connection while remaining intimate enough for private groups.",
    ideal: ["Corporate Retreats", "Lifestyle Retreats", "Surf Retreats", "Creative Workshops"],
    highlights: ["24 Guests", "Pool", "Restaurant", "Private Villa", "Gym", "Surf Partnerships"],
    images: [
      "https://images.openai.com/static-rsc-4/5xs9G1VTy6HN1m4rkAAynS5q56rGzSVLsBlwxLwe8ipL2z5UZ5BOjRl2GCDHM7RrYw64DWtt7mgSokBM9To7xLKBuFSq1SEo9ZcjgLnA7xFZLgiPo0McNMVXy9gbMJPN6CXXV1rpU0b5WxmTT3KxdPpmtbvTFlZ0FahQkn4_gYk?purpose=inline",
      "https://images.openai.com/static-rsc-4/MvH0R3WsA8mKHlViEfZX1QYZyCIhVR0gXvbjiKGx4UxMppv1naAq7i2BDe6Jp-tmYarPMEcZZONH2-Mridhp3U6QUYGTmDQLcGsAmAyQu817G9nEkpaRtV-6NS94cAKBLz4mQ6Opd8pBSppzHFXDsPxW1SJU77SAR-JVfd6Yj2k?purpose=inline",
      "https://images.openai.com/static-rsc-4/UbQpzjBI0M3jakcx7fwwWmotlUYgyDmah_3ugQmN_pUTY0By6LZwddPyKoo5NPZlX97fnKxvvErJ-tgb_yAthucNlSRIykiul7NR_IBJyf7RlVjXsIGACsH_-M96uOEAPcPFwjoxJAgU3k-6eIl2hs9qAkrOC0_o3_mj_lNkdwg?purpose=inline",
    ],
  },
  {
    slug: "makahiya",
    name: "Makahiya",
    location: "Ahangama",
    statement: "Built around movement.",
    description: "Rather than beginning with stillness, Makahiya begins with energy. Purpose-built for fitness retreats, athletic camps and high-performance coaching, it combines boutique accommodation with professional training facilities in the heart of Ahangama.",
    ideal: ["Fitness Retreats", "Performance Camps", "Longevity", "Hybrid Wellness"],
    highlights: ["8 Rooms", "Performance Gym", "Recovery", "Coaching", "Healthy Dining"],
    images: [
      "https://images.openai.com/static-rsc-4/co4LiNRNJnk99Ui4eO8igr2wUZJXmoTZ1PZvUgDkc0o3xF_wjOfaclTwPPf6MDulc5FyDzgNa19cPkXTjnvOtZrPlQpYs2AaDVgt_M4QhmwU_OaJDf61ffU53vLrMxf9cHg428B60fFtsNmOFT4Ez3wphKim-F1UZdcxQBPY8eU?purpose=inline",
      "https://images.openai.com/static-rsc-4/--En2JxPc7SDTGMnw9Yk-agCvT-UidPXLoQuRUkUEnfFY9hnrDAlBrS9gpAHMYn0La7Y9VNETQAHExiuwU9Xh0B924N95NWVw7d706AFqFQ1RyO06j1FdejW6z15W8CgjdHzQdQzJzwd_n9jdqyUQ4YPDST6plgOo_4tdmcqzBE?purpose=inline",
      "https://images.openai.com/static-rsc-4/V7eaeb0Lq_wf3ti41WGMqwwYBm4gGzH-O673AHSbixyPnYNT1jGF1-RcUCAz995-u5gaQ3OId3ZYQVc2_yEwolLwd30l-0CubiDm_PK-O8XxsJ2OJ2SExLt9tF8zOWPvgeHub7VhcszbOKJmaSrs9vc8lYCz72Ctn3DbZexmSoM?purpose=inline",
    ],
  },
];

const COMPARISON = [
  ["Setting", "Lake", "Jungle", "Fitness campus"], ["Capacity", "30 guests", "24 guests", "8 rooms"],
  ["Exclusive hire", "Yes", "Yes", "Yes"], ["Yoga", "Excellent", "Strong", "Available"],
  ["Fitness", "Available", "Strong", "Excellent"], ["Spa / recovery", "Spa", "Available", "Recovery"],
  ["Pool", "Yes", "Yes", "Yes"], ["Best for", "Wellness", "Creative / corporate", "Performance"],
];

function VenueChapter({ venue, index, onEnquire }) {
  return <section className="retreat-venue" aria-labelledby={`retreat-venue-${index}`}>
    <div className="retreat-gallery">
      {venue.images.map((image, imageIndex) => <img key={image} src={image} alt={`${venue.name} retreat venue ${imageIndex + 1}`} loading={index ? "lazy" : "eager"} />)}
    </div>
    <div className="retreat-shell retreat-venue-copy">
      <div className="retreat-venue-title"><Text className="retreat-kicker">0{index + 1} · {venue.location}</Text><Title level={2} id={`retreat-venue-${index}`}>{venue.name}</Title><em>{venue.statement}</em></div>
      <div className="retreat-venue-details"><Paragraph>{venue.description}</Paragraph><div className="retreat-list-pair"><div><Text>Ideal for</Text><ul>{venue.ideal.map((item) => <li key={item}>{item}</li>)}</ul></div><div><Text>Highlights</Text><ul>{venue.highlights.map((item) => <li key={item}>{item}</li>)}</ul></div></div><Button type="text" onClick={() => onEnquire(venue.slug)}>Plan at {venue.name} <ArrowRightOutlined /></Button></div>
    </div>
  </section>;
}

export default function HostRetreatPage() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const canonical = absUrl(HOST_RETREAT_PATH);

  const scrollToForm = (preferredVenue = "help-me-choose") => {
    form.setFieldValue("preferredVenue", preferredVenue);
    document.getElementById("retreat-enquiry")?.scrollIntoView({ behavior: "smooth" });
  };

  const submitEnquiry = async (values) => {
    setSubmitting(true);
    try {
      const response = await fetch("/.netlify/functions/create-retreat-enquiry", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, startDate: values.dates?.[0]?.format("YYYY-MM-DD"), endDate: values.dates?.[1]?.format("YYYY-MM-DD"), dates: undefined, source: "host-a-retreat" }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to send your retreat enquiry");
      setSubmitted(true); form.resetFields();
    } catch (error) { message.error(error.message || "Unable to send your retreat enquiry"); }
    finally { setSubmitting(false); }
  };

  return <SiteLayout navOverlayHero>
    <Seo title="Host a Retreat in Ahangama" description="Plan a yoga retreat, leadership offsite, creative gathering or fitness camp in Ahangama with trusted local venue and concierge support." canonical={canonical} ogImage={VENUES[0].images[0]} />
    <main className="retreat-page">
      <header className="retreat-hero">
        <img src={VENUES[0].images[0]} alt="Kurulu Bay on Koggala Lake" />
        <div className="retreat-hero-shade" aria-hidden="true" />
        <div className="retreat-hero-content"><Text>Retreats · Ahangama, Sri Lanka</Text><Title level={1}><span>Host a retreat</span><span>shaped by the</span><span>south coast.</span></Title><Paragraph>A slower rhythm. Warm waters. World-class hospitality.</Paragraph><Button type="link" onClick={() => document.getElementById("why-ahangama")?.scrollIntoView({ behavior: "smooth" })}>Explore the venues <ArrowRightOutlined /></Button></div>
      </header>

      <section className="retreat-intro retreat-shell" id="why-ahangama"><Text className="retreat-kicker">Why Ahangama?</Text><div><Title level={2}>There are places that accommodate retreats, and places that shape them.</Title><Paragraph>Ahangama has quietly become one of Sri Lanka's leading destinations for wellness, creativity and meaningful gatherings. Within a few kilometres you will find boutique hotels, yoga teachers, surf breaks, Ayurvedic practitioners, private chefs and a thriving creative community.</Paragraph><Paragraph>Whether you are planning a yoga retreat, leadership offsite or fitness camp, the destination offers everything needed to create an unforgettable experience.</Paragraph></div></section>
      <blockquote className="retreat-quote">“The venue defines the rhythm of a retreat.”</blockquote>
      {VENUES.map((venue, index) => <VenueChapter key={venue.slug} venue={venue} index={index} onEnquire={scrollToForm} />)}

      <section className="retreat-comparison retreat-shell"><Text className="retreat-kicker">At a glance</Text><Title level={2}>Compare the venues.</Title><div className="retreat-table-wrap"><table><thead><tr><th>Detail</th>{VENUES.map((venue) => <th key={venue.slug}>{venue.name}</th>)}</tr></thead><tbody>{COMPARISON.map(([label, ...values]) => <tr key={label}><th>{label}</th>{values.map((value, index) => <td key={`${label}-${VENUES[index].slug}`}>{value}</td>)}</tr>)}</tbody></table></div></section>

      <section className="retreat-process"><div className="retreat-shell"><Text className="retreat-kicker">Planning a retreat</Text><Title level={2}>From first idea to arrival.</Title><ol>{["Choose your venue.", "Design your programme.", "We'll coordinate accommodation.", "We'll organise excursions.", "Guests arrive."].map((step, index) => <li key={step}><span>0{index + 1}</span><strong>{step}</strong></li>)}</ol></div></section>

      <section className="retreat-concierge"><div className="retreat-shell"><Text className="retreat-kicker">Local support</Text><Title level={2}>Retreat Concierge</Title><Paragraph>Planning a retreat from overseas can be complex. We work with organisers to compare venues, coordinate accommodation, arrange local experiences, organise transport and introduce trusted partners across Sri Lanka.</Paragraph><strong>One conversation. Everything organised.</strong><Button type="text" onClick={() => scrollToForm()}>Start the conversation <ArrowRightOutlined /></Button></div></section>

      <section className="retreat-enquiry" id="retreat-enquiry"><div className="retreat-shell retreat-enquiry-layout"><div><Text className="retreat-kicker">Start planning</Text><Title level={2}>Tell us about your retreat.</Title><Paragraph>Expected guests. Dates. Retreat style. We will recommend the venue that best fits your vision.</Paragraph></div><div className="retreat-form-wrap">{submitted ? <div className="retreat-success"><CheckOutlined /><Title level={3}>Your retreat starts here.</Title><Paragraph>We have received your enquiry and will be in touch to discuss the right venue and next steps.</Paragraph><Button onClick={() => setSubmitted(false)}>Plan another retreat</Button></div> : <Form form={form} layout="vertical" requiredMark={false} onFinish={submitEnquiry} initialValues={{ preferredVenue: "help-me-choose", expectedGuests: 12 }}>
          <div className="retreat-form-grid"><Form.Item name="preferredVenue" label="Preferred venue" rules={[{ required: true }]}><Select options={[{ label: "Help me choose", value: "help-me-choose" }, ...VENUES.map((venue) => ({ label: venue.name, value: venue.slug }))]} /></Form.Item><Form.Item name="retreatStyle" label="Retreat style" rules={[{ required: true, message: "Choose a retreat style" }]}><Select placeholder="Select one" options={["Yoga & wellness", "Fitness & performance", "Leadership & corporate", "Creative workshop", "Surf retreat", "Other"].map((value) => ({ label: value, value }))} /></Form.Item><Form.Item name="dates" label="Proposed dates" rules={[{ required: true, message: "Select proposed dates" }]}><RangePicker format="DD MMM YYYY" style={{ width: "100%" }} /></Form.Item><Form.Item name="expectedGuests" label="Expected guests" rules={[{ required: true }]}><InputNumber min={1} max={200} style={{ width: "100%" }} /></Form.Item><Form.Item name="name" label="Your name" rules={[{ required: true, message: "Enter your name" }]}><Input autoComplete="name" /></Form.Item><Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Enter a valid email" }]}><Input type="email" autoComplete="email" /></Form.Item><Form.Item name="whatsapp" label="WhatsApp number"><Input type="tel" autoComplete="tel" placeholder="Include country code" /></Form.Item></div>
          <Form.Item name="notes" label="Tell us about the retreat"><Input.TextArea rows={4} maxLength={1000} placeholder="The experience you want to create, programme ideas, accommodation needs..." /></Form.Item><Form.Item name="consent" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error("Please confirm we may contact you")) }]}><Checkbox>I agree that Ahangama may contact me about this retreat enquiry.</Checkbox></Form.Item><Button type="primary" htmlType="submit" size="large" block loading={submitting}>Send retreat enquiry <ArrowRightOutlined /></Button>
        </Form>}</div></div></section>
    </main>
  </SiteLayout>;
}