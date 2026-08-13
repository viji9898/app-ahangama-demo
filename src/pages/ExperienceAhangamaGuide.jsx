import React, { useEffect, useRef, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/experience-ahangama-guide.css";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

/* ===================================================================
   Content status note (not visible to users):
   Sections marked as PLACEHOLDER — Best Eats, Best Experiences,
   Wellness, Night Life, and Souvenir Shops — are pending real
   content from the source guide. These sections use empty template
   cards ready to receive actual data once the source material is
   available.
   =================================================================== */

const CHAPTERS = [
  { id: "cover", label: "Cover", bg: "navy" },
  { id: "contents", label: "Contents", bg: "navy" },
  { id: "overview", label: "Overview", bg: "cream" },
  { id: "located", label: "Located", bg: "cream" },
  { id: "best-for", label: "Best For", bg: "white" },
  { id: "reality-check", label: "The Reality Check", bg: "cream" },
  { id: "best-season", label: "Best Season", bg: "cream" },
  { id: "how-long", label: "How Long Do People Usually Stay?", bg: "cream" },
  { id: "transport", label: "Transport Reality Check", bg: "white" },
  { id: "best-stays", label: "Best Stays", bg: "white" },
  { id: "best-eats", label: "Best Eats", bg: "cream" },
  { id: "best-experiences", label: "Best Experiences", bg: "cream" },
  { id: "wellness", label: "Wellness", bg: "cream" },
  { id: "night-life", label: "Night Life", bg: "cream" },
  { id: "best-retail-stores", label: "Best Retail Stores", bg: "cream" },
  { id: "closing-cta", label: "Closing", bg: "navy" },
];

const TOTAL = CHAPTERS.length;

function Reveal({ delay = 0, children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          ob.unobserve(el);
        }
      },
      { threshold: 0, rootMargin: "0px" },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  const delayClass = delay > 0 ? `eag-reveal-delay-${Math.min(delay, 5)}` : "";

  return (
    <div
      ref={ref}
      className={`eag-reveal ${visible ? "eag-reveal--visible" : ""} ${delayClass}`}
    >
      {children}
    </div>
  );
}

function StaggerReveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          ob.unobserve(el);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -30px 0px" },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`eag-stagger ${visible ? "eag-stagger--visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function ChevronDown() {
  return (
    <svg className="eag-scroll-cue-arrow" viewBox="0 0 18 18" fill="none">
      <path d="M9 3v12M5 11l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon({ className = "" }) {
  return <span className={className} style={{ color: "var(--eag-gold)" }}>★</span>;
}

function ImageLightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const container = document.querySelector(".eag-scroll-container");
    const prevOverflow = container ? container.style.overflow : "";
    if (container) container.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      if (container) container.style.overflow = prevOverflow;
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="eag-lightbox"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
    >
      <button className="eag-lightbox-close" onClick={onClose} aria-label="Close preview">&times;</button>
      <figure className="eag-lightbox-figure" onClick={(e) => e.stopPropagation()}>
        <img src={item.image} alt={item.name} />
        <figcaption className="eag-lightbox-caption">
          <span className="eag-lightbox-name">{item.name}</span>
          {item.rating ? (
            <span className="eag-lightbox-rating"><StarIcon /> {item.rating}</span>
          ) : null}
          {item.desc ? (
            <span className="eag-lightbox-desc">{item.desc}</span>
          ) : null}
        </figcaption>
      </figure>
    </div>
  );
}

function SunIcon() {
  return (
    <svg className="eag-temp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function BestForIcon({ type }) {
  const svgProps = { width: 28, height: 28, viewBox: "0 0 28 28", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" };
  switch (type) {
    case "wellness": return <svg {...svgProps}><path d="M14 6c-4 0-6 2-6 5s2 5 6 8c4-3 6-5 6-8s-2-5-6-5z"/></svg>;
    case "surfers": return <svg {...svgProps}><path d="M5 18c2-4 6-5 9-3s5 4 7 2"/><path d="M3 23c2-4 6-5 9-3"/><path d="M2 12c6-4 12-2 16 2"/></svg>;
    case "nomads": return <svg {...svgProps}><rect x="5" y="7" width="18" height="13" rx="2"/><path d="M20 20v3M8 20v3M12 17l2 2 4-4"/><circle cx="14" cy="13" r="2"/></svg>;
    case "cafe": return <svg {...svgProps}><path d="M5 7h14l-2 13H7L5 7z"/><path d="M19 7c2 0 4 2 4 4s-2 4-4 4"/><path d="M2 7h22"/></svg>;
    case "souvenirs": return <svg {...svgProps}><rect x="7" y="7" width="14" height="16" rx="2"/><path d="M10 7V5a4 4 0 018 0v2"/><path d="M7 13h14"/></svg>;
    case "nightlife": return <svg {...svgProps}><path d="M18 10a7 7 0 11-7-7"/><path d="M20 3v14"/><path d="M16 3h8"/><path d="M12 18h12"/></svg>;
    default: return null;
  }
}

function ScooterIllustration() {
  return (
    <svg className="eag-closing-illustration" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="50" cy="74" r="12" />
      <circle cx="50" cy="74" r="5" fill="currentColor" opacity="0.3" />
      <circle cx="140" cy="74" r="12" />
      <circle cx="140" cy="74" r="5" fill="currentColor" opacity="0.3" />
      <path d="M50 60c0-10 6-18 14-24 5-4 12-6 19-6h16c5 0 10 2 14 5l16 12c3 2 5 6 5 9v10" />
      <path d="M100 32l-8-12c-2-3-5-4-8-4H70" />
      <path d="M112 42l10 22H70c-8 0-14-4-14-10v-6c0-4 3-7 7-7h49z" fill="currentColor" opacity="0.06" />
      <path d="M146 46l8 4c3 2 5 5 5 9" />
      <path d="M36 66c-4-2-6-6-4-10" />
      <circle cx="165" cy="56" r="3" fill="currentColor" opacity="0.4" />
      <path d="M80 40l-4 12" strokeWidth="1.5" opacity="0.5" />
      <path d="M86 38c4-2 8-2 12 0" opacity="0.5" />
    </svg>
  );
}

/* ------ Section Components ------ */

function CoverSection() {
  const bgRef = useRef(null);

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY || document.documentElement.scrollTop;
          el.style.transform = `translateY(${scrolled * 0.06}px)`;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="cover" className="eag-section eag-section--navy">
      <div className="eag-cover-bg eag-cover-parallax" ref={bgRef}>
        <div className="eag-cover-gradient" />
      </div>
      <div className="eag-content eag-cover-content">
        <Reveal>
          <span className="eag-guide-badge">The Guide</span>
        </Reveal>
        <Reveal delay={1}>
          <span className="eag-eyebrow">Discover &mdash; Things nobody tells you</span>
        </Reveal>
        <Reveal delay={2}>
          <h1 className="eag-headline eag-headline--xl eag-headline--light">
            <span className="eag-headline-line">Experience</span>
            <span className="eag-headline-line">Ahangama</span>
          </h1>
        </Reveal>
        <Reveal delay={3}>
          <p className="eag-subheadline">
            The insider&rsquo;s <strong className="eag-subheadline-em">guide</strong> to Sri Lanka&rsquo;s coolest coast.
          </p>
        </Reveal>
        <Reveal delay={4}>
          <div className="eag-cover-cta">
            <a href="#best-stays" className="eag-pill">Get Your Complimentary Pass</a>
          </div>
          <span className="eag-cover-tag">Ahangama Season 2026/2027</span>
        </Reveal>
      </div>
      <div className="eag-scroll-cue" aria-hidden="true">
        <span className="eag-scroll-cue-text">Scroll</span>
        <ChevronDown />
      </div>
    </section>
  );
}

function ContentsSection() {
  const handleClick = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const contents = [
    "Overview", "Best For", "The Reality Check", "Best Season",
    "How Long Do People Usually Stay?", "Transport Reality Check",
    "Best Stays", "Best Eats", "Best Experiences", "Wellness",
    "Night Life", "Best Retail Stores",
  ];

  const sectionIds = [
    "overview", "best-for", "reality-check", "best-season", "how-long",
    "transport", "best-stays", "best-eats", "best-experiences",
    "more-chapters", "more-chapters", "more-chapters",
  ];

  return (
    <section id="contents" className="eag-section eag-section--navy">
      <div className="eag-content">
        <Reveal>
          <h2 className="eag-headline eag-headline--light">
            <span className="eag-headline-line">Contents</span>
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <div className="eag-contents-list">
            {contents.map((item, i) => (
              <div
                key={item}
                className="eag-contents-item"
                onClick={() => handleClick(sectionIds[i])}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") handleClick(sectionIds[i]); }}
              >
                <span className="eag-contents-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="eag-contents-label">{item}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function OverviewSection() {
  return (
    <section id="overview" className="eag-section eag-section--cream">
      <div className="eag-content">
        <Reveal>
          <span className="eag-eyebrow">Discover</span>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="eag-headline">
            <span className="eag-headline-line">Overview</span>
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="eag-body">
            Once a sleepy stretch of local fishing shacks, Ahangama has quietly evolved into the South Coast&rsquo;s coolest, most curated coastal hub. It has successfully dodged the overdeveloped chaos of other global surf towns, maintaining a delicate balance between slow island living and a thriving, modern aesthetic. If you are looking for barefoot luxury, world-class waves, and jungle-fringed cafes, you have found your spot.
          </p>
        </Reveal>
        <Reveal delay={3}>
          <div className="eag-overview-photo">
            <div className="eag-overlay-teal" />
            <img
              src="https://res.cloudinary.com/dp7in4ulw/image/upload/q_auto/v1784788406/overview_image_ukm5or.webp"
              alt="Jungle coastal cafe, Ahangama"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const tealIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#00AFD1;border:2px solid #fff;box-shadow:0 0 6px rgba(0,175,209,0.4)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const highlightIcon = L.divIcon({
  className: "",
  html: `<div style="width:24px;height:24px;border-radius:50%;background:#00AFD1;border:3px solid #fff;box-shadow:0 0 14px rgba(0,175,209,0.6)"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 400);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

function LocatedSection() {
  return (
    <section id="located" className="eag-section eag-section--cream">
      <div className="eag-content">
        <Reveal>
          <h2 className="eag-headline">
            <span className="eag-headline-line">Located</span>
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="eag-body">
            on the sun-drenched southern coast of Sri Lanka, perfectly wedged between the historic, colonial streets of Galle (about 20 minutes away) and the bustling, beginner-friendly surf bay of Weligama.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <div className="eag-map-container">
            <MapContainer
              center={[5.9730, 80.3628]}
              zoom={11}
              scrollWheelZoom={false}
              zoomControl={false}
              attributionControl={false}
              style={{ width: "100%", height: "100%", borderRadius: "14px" }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
              />
              <MapResizer />
              <Marker position={[6.0323, 80.2171]} icon={tealIcon}>
                <Popup><strong>Galle</strong></Popup>
              </Marker>
              <Marker position={[5.9730, 80.3628]} icon={highlightIcon}>
                <Popup><strong>Ahangama</strong></Popup>
              </Marker>
              <Marker position={[5.9764, 80.4253]} icon={tealIcon}>
                <Popup><strong>Weligama</strong></Popup>
              </Marker>
            </MapContainer>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function BestForSection() {
  const items = [
    { key: "wellness", label: "Wellness", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1784779727/Soul_Spa_Colored736923392_Topaz_Gigapixel_4x_scale_iklhr8.webp" },
    { key: "surfers", label: "Surfers", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1784779727/coloredgood-story-surf-school-1400_1_Topaz_Gigapixel_4x_scale_dr6h6l.webp" }, 
    { key: "nomads", label: "Digital Nomads", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1784779727/Colored_Kalatmaka1_Topaz_Gigapixel_4x_scale_wavbpv.webp" },
    { key: "cafe", label: "Café Lovers", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1784779727/Kaffi946318185961736_7826978568551728722_n_Topaz_Gigapixel_4x_scale_iz1aop.webp" },
    { key: "souvenirs", label: "Souvenirs", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/q_auto/v1784793489/souvenir_qrb9cl.webp" },
    { key: "nightlife", label: "Nightlife", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1784779729/Hakuna_ColoredImage_ji8d1dji8d1dji8d_Topaz_Gigapixel_2x_scale_bxi6wt.webp" },
  ];

  return (
    <section id="best-for" className="eag-section eag-section--white">
      <div className="eag-content">
        <Reveal>
          <h2 className="eag-headline">
            <span className="eag-headline-line">Best</span>
            <span className="eag-headline-line">For</span>
          </h2>
        </Reveal>
        <StaggerReveal>
          <div className="eag-bestfor-grid">
            {items.map((item) => (
              <div key={item.key} className="eag-bestfor-card">
                <div
                  className="eag-bestfor-photo"
                  style={item.image ? { backgroundImage: `url(${item.image})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                >
                  <BestForIcon type={item.key} />
                  {!item.image && <span className="eag-bestfor-photo-label">[PHOTO: {item.label}]</span>}
                </div>
                <span className="eag-bestfor-label">{item.label}</span>
              </div>
            ))}
          </div>
        </StaggerReveal>
      </div>
    </section>
  );
}

function RealityCheckSection() {
  const tiers = [
    { price: "$30\u2013$50", name: "Backpacker / Budget", desc: "Hostel beds, local kottu/rice &amp; curry, walking or taking the bus." },
    { price: "$70\u2013$150", name: "Mid-Range / Nomad", desc: "Boutique guesthouses, specialty coffee, scooter rental, sunset cocktails." },
    { price: "$200+", name: "Luxury", desc: "Beachfront villas, high-end dining, private surf coaching, and spa days." },
  ];

  return (
    <section id="reality-check" className="eag-section eag-section--cream">
      <div className="eag-content">
        <Reveal>
          <h2 className="eag-headline">
            <span className="eag-headline-line">The Reality</span>
            <span className="eag-headline-line">Check</span>
          </h2>
        </Reveal>
        <StaggerReveal>
          <div className="eag-pricing-cards">
            {tiers.map((tier) => (
              <div key={tier.name} className="eag-pricing-card">
                <div className="eag-pricing-price">{tier.price}</div>
                <div className="eag-pricing-name">{tier.name}</div>
                <div className="eag-pricing-desc" dangerouslySetInnerHTML={{ __html: tier.desc }} />
              </div>
            ))}
          </div>
        </StaggerReveal>
      </div>
    </section>
  );
}

function BestSeasonSection() {
  return (
    <section id="best-season" className="eag-section eag-section--cream">
      <div className="eag-content">
        <Reveal>
          <h2 className="eag-headline">
            <span className="eag-headline-line">Best</span>
            <span className="eag-headline-line">Season</span>
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="eag-body">
            The undisputed prime time to visit is late October through April. During these months, the weather is hot and sunny (averaging around 29&deg;C to 31&deg;C), the rainfall is minimal, and the ocean is calm and glassy, creating pristine surfing conditions.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <div className="eag-temp-badge">
            <SunIcon />
            <span>29&ndash;31&deg;C</span>
          </div>
        </Reveal>
        <Reveal delay={3}>
          <div className="eag-season-banner" style={{ backgroundImage: "url(https://res.cloudinary.com/dp7in4ulw/image/upload/q_auto/v1784783799/colored-4247572_jezkyb.webp)" }} />
        </Reveal>
      </div>
    </section>
  );
}

function HowLongSection() {
  return (
    <section id="how-long" className="eag-section eag-section--cream">
      <div className="eag-content">
        <Reveal>
          <h2 className="eag-headline eag-headline--lg">
            <span className="eag-headline-line">How Long</span>
            <span className="eag-headline-line">Do People</span>
            <span className="eag-headline-line">Usually Stay?</span>
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="eag-body">
            Vacationers typically carve out 5 to 10 days to soak up the surf and food scene. However, because of the infectious &ldquo;slow living&rdquo; rhythm, digital nomads and slow-travelers frequently end up extending their stays for 1 to 3 months.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <div className="eag-season-banner" style={{ backgroundImage: "url(https://res.cloudinary.com/dp7in4ulw/image/upload/q_auto/v1784784340/color_graded_qfwaik.webp)", backgroundPosition: "bottom" }} />
        </Reveal>
      </div>
    </section>
  );
}

function TransportSection() {
  return (
    <section id="transport" className="eag-section eag-section--white">
      <div className="eag-content">
        <Reveal>
          <h2 className="eag-headline">
            <span className="eag-headline-line">Transport</span>
            <span className="eag-headline-line">Reality Check</span>
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <div className="eag-transport-block">
            <div className="eag-transport-sub" style={{ color: "var(--eag-teal-dark)" }}>Getting Here</div>
            <p className="eag-body">
              Ahangama is roughly a 90-minute drive down the highway from Colombo Airport. A private taxi will run you about $40 to $70 depending on the season. The train is a beautifully scenic, dirt-cheap alternative, but expect delays and crowds.
            </p>
          </div>
        </Reveal>
        <Reveal delay={2}>
          <div className="eag-transport-block">
            <div className="eag-transport-sub" style={{ color: "var(--eag-teal-dark)" }}>Getting Around</div>
            <p className="eag-body">
              Renting a scooter (around $5 a day) is the ultimate way to explore the coast. If you aren&rsquo;t comfortable riding, local tuk-tuks are everywhere&mdash;just be sure to agree on a price before getting in.
            </p>
          </div>
        </Reveal>
        <Reveal delay={3}>
          <div className="eag-season-banner" style={{ backgroundImage: "url(https://res.cloudinary.com/dp7in4ulw/image/upload/q_auto/v1784784926/44yfmcvyf_zqm5q1.webp)", backgroundPosition: "bottom" }} />
        </Reveal>
      </div>
    </section>
  );
}

function BestStaysSection({ onImageClick }) {
  const stays = [
    { name: "Animals", rating: "4.8", desc: " A sleek pink boutique oasis blending premium co-working and laid back surf culture for adult travelers.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1784783052/colorred_animals_oj6aee.webp" },
    { name: "Ko Lake Villa", rating: "4.4", desc: "A peaceful lakeside escape surrounded by nature, luxury and tranquility.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1783921928/Ko_Lake_Villa_nqxg16.webp" },
    { name: "Mana Villa", rating: "4.8", desc: "A peaceful nature retreat with sauna, ice baths and pools.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1784783566/manavilla_ctqgqj.webp" },
    { name: "Sola Hotel", rating: "4.4", desc: "A nature-led escape in the heart of Ahangama", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1783921928/Sola_Hotel_t86nt4.webp" },
    { name: "Lighthouse", rating: "4.4", desc: "A beautiful beachfront escape with a rooftop spot to enjoy sunsets, good food, and great coastal vibes.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1782832527/light-house-beach-view-hero_mzhrhn.webp" },
    { name: "Trebartha East – The Roundhouse", rating: "5.0", desc: "An architectural retreat amidst a cinnamon plantation", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786339767/Threbatha_East_01_yb2dwm.webp" },
    { name: "Mosvold Villa", rating: "4.5", desc: "A boutique beachfront escape known for its charm, comfort, and personalised hospitality.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786339766/Mosvold_imdadl.webp" },
    { name: "The Benison", rating: "4.9", desc: "A hidden retreat designed for slow living.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786339767/The_Benison_02_uzlcpb.webp" },
    { name: "Palm Hotel", rating: "4.6", desc: "A modern tropical retreat among the palms", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786339767/Palm_Hotel_02_t78i4y.webp" },
    { name: "Abode by the Beach", rating: "4.5", desc: "The ultimate beachfront hotspot for design lovers and surfers.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786339766/Abode_01_rorwfz.webp" },
    { name: "Harding Boutique Hotel", rating: "4.6", desc: "An architectural oceanfront masterpiece with a romantic rooftop vibe", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786339766/Harding_Hotel_02_qwxzlc.webp" },
    { name: "Casa Tikiri Boutique Hotel", rating: "4.7", desc: "An adults only boutique hideaway blending authentic Italian soul with tropical surf.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786339766/Casa_Tikiri_02_oe9tj4.webp" },
    { name: "SĀMA", rating: "4.9", desc: "A beautiful coastal retreat to slow down,relax, and enjoy thoughtful stays, great food, and the charm of Ahangama.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786339767/Sama_01_mwposq.webp" },
  ];

  return (
    <section id="best-stays" className="eag-section eag-section--white">
      <div className="eag-content">
        <Reveal>
          <h2 className="eag-headline">
            <span className="eag-headline-line">Best</span>
            <span className="eag-headline-line">Stays</span>
          </h2>
        </Reveal>
        <div className="eag-section-body">
          <StaggerReveal>
            <div className="eag-cards-grid">
              {stays.map((stay) => (
                <div key={stay.name} className="eag-card-item">
                  <div className="eag-card-img-wrap">
                    <div
                      className="eag-card-img--placeholder"
                      style={stay.image ? { backgroundImage: `url(${stay.image})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                      onClick={() => stay.image && onImageClick?.(stay)}
                      role="button"
                      tabIndex={0}
                      aria-label={`View larger image of ${stay.name}`}
                      onKeyDown={(e) => { if (e.key === "Enter") stay.image && onImageClick?.(stay); }}
                    >
                      {!stay.image && <span className="eag-card-img-label">[PHOTO: {stay.name}]</span>}
                    </div>
                  </div>
                  <div className="eag-card-body">
                    <p className="eag-card-desc">{stay.desc}</p>
                    <div className="eag-card-meta">
                      <span className="eag-card-meta-name">{stay.name}</span>
                      {stay.rating && (
                        <span className="eag-card-meta-rating">
                          <StarIcon className="eag-star-icon" />
                          <span>{stay.rating}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}

/* ------ Placeholder sections ------ */
/*
 * Best Eats — content gathered from public travel sources as of mid-2026.
 * Venue hours, ownership, and open/closed status in small beach towns
 * change often — worth a quick verification pass before going live.
 */

const EATS = [
  { name: "Kai Rooftop", rating: "4.7", desc: "Rooftop dining, great cocktails and beautiful ocean views.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426785/Kai_rooftop_ahangama_mcetbs.webp" },
  { name: "Mermaid’s Kitchen", rating: "4.6", desc: "Fresh, flavourful food served in a relaxed tropical setting.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786427902/Mermaids_cbow9y.webp" },
  { name: "Maria Bonita", rating: "4.8", desc: "Colourful breakfasts and excellent coffee.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786341115/Maria_Bonita_02_my5zby.webp" },
  { name: "SAMA Restaurant", rating: "4.9", desc: "Refined dining featuring fresh, locally sourced ingredients", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426469/Sama_image_uxmbzj.webp" },
  { name: "Pickled Pelican", rating: "4.7", desc: "Creative dishes, refreshing drinks and a relaxed coastal atmosphere.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426469/Pickled_Pelican_a9llwm.webp" },
];

function BestEatsSection({ onImageClick }) {
  return (
    <section id="best-eats" className="eag-section eag-section--cream">
      <div className="eag-content">
        <Reveal>
          <h2 className="eag-headline">
            <span className="eag-headline-line">Best</span>
            <span className="eag-headline-line">Eats</span>
          </h2>
        </Reveal>
        <div className="eag-section-body">
          <StaggerReveal>
            <div className="eag-cards-grid">
              {EATS.map((item) => (
                <div key={item.name} className="eag-card-item">
                  <div className="eag-card-img-wrap">
                    {item.image ? (
                      <img src={item.image} alt={item.name} loading="lazy" className="eag-card-img"
                        onClick={() => onImageClick?.(item)}
                        role="button"
                        tabIndex={0}
                        aria-label={`View larger image of ${item.name}`}
                        onKeyDown={(e) => { if (e.key === "Enter") onImageClick?.(item); }}
                      />
                    ) : (
                      <div className="eag-card-img--placeholder">
                        <span className="eag-card-img-label">[PHOTO: {item.name}]</span>
                      </div>
                    )}
                  </div>
                  <div className="eag-card-body">
                    <p className="eag-card-desc">{item.desc}</p>
                    <div className="eag-card-meta">
                      <span className="eag-card-meta-name">{item.name}</span>
                      {item.rating && (
                        <span className="eag-card-meta-rating">
                          <StarIcon className="eag-star-icon" />
                          <span>{item.rating}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}

const EXPERIENCES = [
  { name: "Kumbuk Kitchen & Art Space", rating: "4.8", desc: "Join hands on Sri Lankan cooking classes and discover local flavours in a creative setting.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426466/Kumbuk_Community_1_tnbbky.webp" },
  { name: "Coconut Court Pickleball", rating: "4.5", desc: "Enjoy one of the fastest growing sports in a fun and social setting.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786342540/Coconut_Court_Pickleball_fdenxj.webp" },
  { name: "Palm & Paint", rating: "4.7", desc: "Relax with guided painting sessions in a beautiful tropical atmosphere.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786342540/Palm_Paint_tfdtou.webp" },
  { name: "Aggala", rating: "4.6", desc: "A charming café where you can enjoy traditional Sri Lankan sweets, coffee, and local flavours.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786427733/Aggala_2_djqa9c.webp" },
  { name: "Qamar by Zan", rating: "4.7", desc: "Design and create your own jewellery in a hands-on workshop while exploring beautifully curated fashion pieces.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786522279/Qmar_by_zan_niowzn.webp" },
  { name: "Olive Yu", rating: "4.8", desc: "Craft your own handmade jewellery in a creative workshop overlooking the coast.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786535255/Olive_yu_new_fkqs75.webp" },
  { name: "Frostys", rating: "4.9", desc: "Refresh your body and mind with invigorating ice baths, sauna sessions, and guided recovery experiences.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786342539/Frosty_s_01_w92lyq.webp" },
  { name: "Pachcha Sanni", rating: "4.5", desc: "Get inked at one of Ahangama's most creative tattoo studios, specialising in unique custom designs and artistic expression.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786342709/Pachcha_Sanni_ghe4qa.webp" },
];

function BestExperiencesSection({ onImageClick }) {
  return (
    <section id="best-experiences" className="eag-section eag-section--cream">
      <div className="eag-content">
        <Reveal>
          <h2 className="eag-headline">
            <span className="eag-headline-line">Best</span>
            <span className="eag-headline-line">Experiences</span>
          </h2>
        </Reveal>
        <div className="eag-section-body">
          <StaggerReveal>
            <div className="eag-cards-grid">
              {EXPERIENCES.map((item) => (
                <div key={item.name} className="eag-card-item">
                  <div className="eag-card-img-wrap">
                    {item.image ? (
                      <img src={item.image} alt={item.name} loading="lazy" className="eag-card-img"
                        onClick={() => onImageClick?.(item)}
                        role="button"
                        tabIndex={0}
                        aria-label={`View larger image of ${item.name}`}
                        onKeyDown={(e) => { if (e.key === "Enter") onImageClick?.(item); }}
                      />
                    ) : (
                      <div className="eag-card-img--placeholder">
                        <span className="eag-card-img-label">[PHOTO: {item.name}]</span>
                      </div>
                    )}
                  </div>
                  <div className="eag-card-body">
                    <p className="eag-card-desc">{item.desc}</p>
                    <div className="eag-card-meta">
                      <span className="eag-card-meta-name">{item.name}</span>
                      {item.rating && (
                        <span className="eag-card-meta-rating">
                          <StarIcon className="eag-star-icon" />
                          <span>{item.rating}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}

const WELLNESS = [
  { name: "Pura Pilates", rating: "4.8", desc: "A welcoming Pilates studio helping people build strength, balance, and well-being.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1782813854/01_-_Pura_Pilates__myhaog.webp" },
  { name: "White Lotus Spa – Radisson Collection", rating: "4.9", desc: "Luxury spa treatments designed to relax, restore, and rejuvenate.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426471/Couple_Room_edited_1_vssbmp.webp" },
  { name: "Banya Steam House", rating: "4.7", desc: "Hot steam, cold plunges and deep relaxation.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426467/Banya_Steam_House_ac31sy.webp" },
  { name: "The Nuga House", rating: "4.8", desc: "A tranquil sanctuary for rest and healing.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426466/Copy_of_Section_2_-_Yoga_in_Nuga_House_b3f1mw.avif" },
  { name: "Sellam Gym Ahangama", rating: "4.4", desc: "A modern gym for keeping your routine on track.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786545879/Sellam_Gym2_vxn1mg.webp" },
  { name: "Spa Station Midigama", rating: "4.6", desc: "Relaxing massages and rejuvenating treatments nearby.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786545710/Spa_Station_midi_yseyx7.webp" },
  { name: "Calma Samaya", rating: "4.8", desc: "A rooftop wellness sanctuary offering yoga, breathwork, massage, and peaceful ocean views.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426467/Calma_Samaya_ehqfln.webp" },
  { name: "Ayurveda Palm Garden Resort", rating: "4.9", desc: "A tranquil Ayurvedic sanctuary dedicated to deep traditional healing and holistic rejuvenation.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786546309/ayurvedha_palm2_ipnbov.webp" },
];
const NIGHT_LIFE = [
  { name: "Lamana", rating: "4.6", desc: "A popular late-night hangout with a lively atmosphere, great music, and a skate rink that adds a playful twist to the night.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786620612/Lamana_23_vnrlgv.webp" },
  { name: "Hakuna Matata", rating: "4.5", desc: "Beachfront cocktails, music and DJs.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426473/Hakuna_Matata_ldiwqq.webp" },
  { name: "MONO", rating: "4.7", desc: "Modern nightlife with a retro soul, creative cocktails, quality drinks, and timeless tunes that keep the night moving.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426470/mono3_c0p2jh.webp" },
  { name: "Kurundu", rating: "4.4", desc: "A lively setting for drinks and evening entertainment.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426467/Kurundu2_lzstjp.webp" },
  { name: "Kicks Ahangama", rating: "4.5", desc: "Dance, socialise and enjoy the night.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786344638/Kicks_Ahangama_bkuzuq.webp" },
  { name: "Hotel De Uncle’s", rating: "4.6", desc: "A laid-back seaside favourite for golden sunsets, chilled drinks, live bands, and unforgettable evenings by the ocean.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426468/Uncle_2_c3vkpl.webp" },
];

const BEST_RETAIL_STORES = [
  { name: "Gusta", rating: "4.7", desc:"Gourmet groceries, fresh produce and artisan products.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786346946/Gusta_01_mnzv6h.webp" },
  { name: "Mudra Herbal Spicy Tea Shop", rating: "4.8", desc:"Handcrafted teas, local spices and Sri Lankan flavours.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786346942/Mudra_Herbal_Spicy_Tea_Shop_bzqrm4.webp" },
  { name: "Yiva Essentials", rating: "4.6", desc:"A lovely place to discover fashion, lifestyle, and unique finds in Ahangama", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426467/Yiva_essentials_ii7doq.webp" },
  { name: "Daydream", rating: "4.7", desc:"A thoughtfully curated lifestyle boutique featuring fashion, homeware, gifts, and unique coastal finds.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786346949/DayDream_izgfon.webp" },
  { name: "Prickly Pear by Cactus", rating: "4.5", desc:" A colorful beachfront concept boutique serving up trendy resort style and sun-soaked cafe vibes.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426468/Prickly_Pear_kjkltb.webp" },
  { name: "Mana Boutique", rating: "4.7", desc:"A beautifully curated boutique showcasing stylish fashion, accessories, and coastal-inspired pieces.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426472/mana_boutique_gbkpcm.webp" },
];

function cardGrid(items, onImageClick) {
  return (
    <div className="eag-section-body">
      <StaggerReveal>
        <div className="eag-cards-grid">
          {items.map((item) => (
            <div key={item.name} className="eag-card-item">
                  <div className="eag-card-img-wrap">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="eag-card-img"
                        onClick={() => onImageClick?.(item)}
                        role="button"
                        tabIndex={0}
                        aria-label={`View larger image of ${item.name}`}
                        onKeyDown={(e) => { if (e.key === "Enter") onImageClick?.(item); }}
                      />
                    ) : (
                      <div className="eag-card-img--placeholder">
                        <span className="eag-card-img-label">[PHOTO: {item.name}]</span>
                      </div>
                    )}
                  </div>
              <div className="eag-card-body">
                <p className="eag-card-desc">{item.desc}</p>
                <div className="eag-card-meta">
                  <span className="eag-card-meta-name">{item.name}</span>
                  {item.rating && (
                    <span className="eag-card-meta-rating">
                      <StarIcon className="eag-star-icon" />
                      <span>{item.rating}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </StaggerReveal>
    </div>
  );
}

function WellnessSection({ onImageClick }) {
  return (
    <section id="wellness" className="eag-section eag-section--cream">
      <div className="eag-content">
        <Reveal><h2 className="eag-headline"><span className="eag-headline-line">Wellness</span></h2></Reveal>
        {cardGrid(WELLNESS, onImageClick)}
      </div>
    </section>
  );
}

function NightLifeSection({ onImageClick }) {
  return (
    <section id="night-life" className="eag-section eag-section--cream">
      <div className="eag-content">
        <Reveal><h2 className="eag-headline"><span className="eag-headline-line">Night Life</span></h2></Reveal>
        {cardGrid(NIGHT_LIFE, onImageClick)}
      </div>
    </section>
  );
}

function BestRetailStoresSection({ onImageClick }) {
  return (
    <section id="best-retail-stores" className="eag-section eag-section--cream">
      <div className="eag-content">
        <Reveal><h2 className="eag-headline"><span className="eag-headline-line">Best Retail Stores</span></h2></Reveal>
        {cardGrid(BEST_RETAIL_STORES, onImageClick)}
      </div>
    </section>
  );
}


function ClosingCTASection() {
  return (
    <section id="closing-cta" className="eag-section eag-section--navy">
      <div className="eag-content">
        <StaggerReveal className="eag-closing-group">
          <ScooterIllustration />
          <div className="eag-closing-body">
            <h2 className="eag-headline eag-headline--light">
              <span className="eag-headline-line">Want More</span>
              <span className="eag-headline-line">Insider Tips?</span>
            </h2>
            <p className="eag-body eag-body--light">
              Follow @NewDirection.lk on Instagram for real-time updates, hidden gems, and exclusive local content.
            </p>
          </div>
          <div className="eag-closing-cta-wrap">
            <a
              href="https://instagram.com/NewDirection.lk"
              target="_blank"
              rel="noopener noreferrer"
              className="eag-pill eag-pill--closing"
            >
              Follow Us
            </a>
          </div>
        </StaggerReveal>
      </div>
    </section>
  );
}

/* ------ TOC Ribbon ------ */

function TocRibbon({ currentChapter }) {
  const [expanded, setExpanded] = useState(false);

  const handleNav = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setExpanded(false);
    }
  }, []);

  const tocItems = [
    { id: "cover", label: "Cover" },
    { id: "contents", label: "Contents" },
    { id: "overview", label: "Overview" },
    { id: "located", label: "Located" },
    { id: "best-for", label: "Best For" },
    { id: "reality-check", label: "Reality Check" },
    { id: "best-season", label: "Best Season" },
    { id: "how-long", label: "How Long" },
    { id: "transport", label: "Transport" },
    { id: "best-stays", label: "Best Stays" },
    { id: "best-eats", label: "Best Eats" },
    { id: "best-experiences", label: "Experiences" },
    { id: "wellness", label: "Wellness" },
    { id: "night-life", label: "Night Life" },
    { id: "best-retail-stores", label: "Best Retail Stores" },
    { id: "closing-cta", label: "Closing" },
  ];

  return (
    <div
      className={`eag-toc-ribbon ${expanded ? "eag-toc-ribbon--expanded" : ""}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="eag-toc-tab" onClick={() => setExpanded((v) => !v)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") setExpanded((v) => !v); }}>
        Contents
      </div>
      <div className="eag-toc-panel">
        <div className="eag-toc-panel-title">Jump to section</div>
        <div className="eag-toc-panel-list">
          {tocItems.map((item) => (
            <div
              key={item.id}
              className={`eag-toc-panel-item ${currentChapter === item.id ? "eag-toc-panel-item--active" : ""}`}
              onClick={() => handleNav(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") handleNav(item.id); }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------ Chapter Progress ------ */

function ChapterProgress({ current, bg }) {
  const isCream = bg === "cream" || bg === "white";
  return (
    <div className={`eag-chapter-progress ${isCream ? "eag-chapter-progress--cream" : ""}`}>
      {String(current).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
    </div>
  );
}

/* ------ Main Component ------ */

export default function ExperienceAhangamaGuide() {
  const [currentChapter, setCurrentChapter] = useState(1);
  const [currentBg, setCurrentBg] = useState("navy");
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [lightboxItem, setLightboxItem] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("eag-dark-mode") === "1";
    } catch {
      return false;
    }
  });

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const sections = document.querySelectorAll(".eag-section");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Array.from(sections).indexOf(entry.target);
            if (idx >= 0) {
              setCurrentChapter(idx + 1);
              setCurrentBg(CHAPTERS[idx]?.bg || "navy");
            }
          }
        }
      },
      { threshold: 0.4 },
    );

    for (const section of sections) {
      observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = document.querySelector(".eag-scroll-container");
    if (!container) return;
    scrollContainerRef.current = container;

    const onScroll = () => {
      setShowTopBtn(container.scrollTop > 300);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("eag-dark-mode", next ? "1" : "0");
      } catch {
        // Ignore storage failures in restricted browsing modes.
      }
      return next;
    });
  };

  return (
    <>
      <Helmet>
        <title>Experience Ahangama &mdash; The Insider&rsquo;s Guide to Sri Lanka&rsquo;s Coolest Coast</title>
        <meta name="description" content="The insider's guide to Sri Lanka's coolest coast. Curated chapters on stays, eats, surf, wellness, and slow living in Ahangama." />
        <link rel="canonical" href="https://ahangama.com/online-guide" />
        <meta property="og:title" content="Experience Ahangama — The Insider's Guide to Sri Lanka's Coolest Coast" />
        <meta property="og:description" content="The insider's guide to Sri Lanka's coolest coast. Curated chapters on stays, eats, surf, wellness, and slow living in Ahangama." />
        <meta property="og:image" content="https://res.cloudinary.com/dp7in4ulw/image/upload/v1786550110/Guide_OG_Image_kbrjmt.webp" />
        <meta property="og:image:secure_url" content="https://res.cloudinary.com/dp7in4ulw/image/upload/v1786550110/Guide_OG_Image_kbrjmt.webp" />
      </Helmet>

      <button
        className={`eag-dark-toggle ${darkMode ? "eag-dark-toggle--on" : ""}`}
        onClick={toggleDarkMode}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </button>

      <TocRibbon currentChapter={CHAPTERS[currentChapter - 1]?.id} />
      <ChapterProgress current={currentChapter} bg={currentBg} />

      <button
        className={`eag-top-btn ${showTopBtn ? "eag-top-btn--visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>

      <div className={`eag-scroll-container ${darkMode ? "eag-dark-mode" : ""}`}>
        <div className="eag-desktop-frame">
          <CoverSection />
          <ContentsSection />
          <OverviewSection />
          <LocatedSection />
          <BestForSection />
          <RealityCheckSection />
          <BestSeasonSection />
          <HowLongSection />
          <TransportSection />
          <BestStaysSection onImageClick={setLightboxItem} />
          <BestEatsSection onImageClick={setLightboxItem} />
          <BestExperiencesSection onImageClick={setLightboxItem} />
          <WellnessSection onImageClick={setLightboxItem} />
          <NightLifeSection onImageClick={setLightboxItem} />
          <BestRetailStoresSection onImageClick={setLightboxItem} />
          <ClosingCTASection />
        </div>
      </div>

      <ImageLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  );
}
