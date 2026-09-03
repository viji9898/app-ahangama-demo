import React, { useEffect, useRef, useState, useCallback, useMemo, useId } from "react";
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
  { id: "best-season", label: "Best Season", bg: "cream" },
  { id: "how-long", label: "How Long Do People Usually Stay?", bg: "cream" },
  { id: "transport", label: "Getting Around Ahangama", bg: "white" },
  { id: "best-cafes", label: "Best Cafes", bg: "cream" },
  { id: "best-stays", label: "Best Stays", bg: "white" },
  { id: "best-eats", label: "Best Eats", bg: "cream" },
  { id: "best-experiences", label: "Best Experiences", bg: "cream" },
  { id: "wellness", label: "Wellness", bg: "cream" },
  { id: "night-life", label: "Night Life", bg: "cream" },
  { id: "best-retail-stores", label: "Best Retail Stores", bg: "cream" },
  { id: "transport-guide", label: "Transport", bg: "white" },
  { id: "closing-cta", label: "Closing", bg: "navy" },
];

const TOTAL = CHAPTERS.length;

const GUIDE_MAP_CENTER = [5.9730, 80.3628];

const GUIDE_MAP_CATEGORY_META = {
  all: { label: "All", color: "#00AFD1" },
  stays: { label: "Stays", color: "#6D8967" },
  eats: { label: "Eats", color: "#C3783F" },
  experiences: { label: "Experiences", color: "#3C6F7E" },
  wellness: { label: "Wellness", color: "#8A6E8A" },
  nightlife: { label: "Night Life", color: "#20455C" },
  retail: { label: "Retail Stores", color: "#8C6948" },
  cafes: { label: "Cafes", color: "#AA6846" },
};

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

function InstagramIcon() {
  const gradientId = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`insta-grad-${gradientId}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F58529" />
          <stop offset="40%" stopColor="#DD2A7B" />
          <stop offset="100%" stopColor="#8134AF" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke={`url(#insta-grad-${gradientId})`} strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke={`url(#insta-grad-${gradientId})`} strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.3" fill="#DD2A7B" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s-6.5-5.2-6.5-10a6.5 6.5 0 1113 0c0 4.8-6.5 10-6.5 10z" stroke="#4285F4" strokeWidth="1.8" />
      <circle cx="12" cy="10.6" r="2.3" stroke="#34A853" strokeWidth="1.8" />
    </svg>
  );
}

function WebsiteIcon() {
  const gradientId = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`web-grad-${gradientId}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4A90D9" />
          <stop offset="100%" stopColor="#6C5CE7" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9.5" stroke={`url(#web-grad-${gradientId})`} strokeWidth="1.8" />
      <ellipse cx="12" cy="12" rx="4" ry="9.5" stroke={`url(#web-grad-${gradientId})`} strokeWidth="1.5" />
      <line x1="2.5" y1="12" x2="21.5" y2="12" stroke={`url(#web-grad-${gradientId})`} strokeWidth="1.5" />
      <path d="M4.5 7.5h15M4.5 16.5h15" stroke={`url(#web-grad-${gradientId})`} strokeWidth="1.3" />
    </svg>
  );
}

function mapsUrl(item) {
  if (item.googleMaps && /^https?:\/\//i.test(item.googleMaps)) return item.googleMaps;
  const query = item.lat && item.lng ? `${item.lat},${item.lng}` : encodeURIComponent(`${item.name} Ahangama`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function CardLinks({ item }) {
  const hasMap = Boolean(item.googleMaps || (item.lat && item.lng));
  return (
    <div className="eag-card-links">
      {item.instagram ? (
        <a className="eag-insta" href={item.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${item.name} on Instagram`}>
          <InstagramIcon />
        </a>
      ) : (
        <span className="eag-insta eag-insta--empty" aria-hidden="true"><InstagramIcon /></span>
      )}
      {hasMap ? (
        <a className="eag-map" href={mapsUrl(item)} target="_blank" rel="noopener noreferrer" aria-label={`${item.name} on Google Maps`}>
          <MapPinIcon />
        </a>
      ) : (
        <span className="eag-map eag-map--empty" aria-hidden="true"><MapPinIcon /></span>
      )}
      {item.website && (
        <a className="eag-website" href={item.website} target="_blank" rel="noopener noreferrer" aria-label={`${item.name} website`}>
          <WebsiteIcon />
        </a>
      )}
    </div>
  );
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
            <span className="eag-lightbox-rating"><StarIcon /> {item.rating}{item.reviewCount > 0 ? ` (${item.reviewCount} reviews)` : ""}</span>
          ) : null}
          {item.desc ? (
            <span className="eag-lightbox-desc">{item.desc}</span>
          ) : null}
          <span className="eag-lightbox-social">
            {item.instagram ? (
              <a className="eag-insta eag-lightbox-insta" href={item.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${item.name} on Instagram`}>
                <InstagramIcon />
              </a>
            ) : (
              <span className="eag-insta eag-lightbox-insta eag-insta--empty" aria-hidden="true"><InstagramIcon /></span>
            )}
            {(item.googleMaps || (item.lat && item.lng)) ? (
              <a className="eag-map eag-lightbox-map" href={mapsUrl(item)} target="_blank" rel="noopener noreferrer" aria-label={`${item.name} on Google Maps`}>
                <MapPinIcon />
              </a>
            ) : (
              <span className="eag-map eag-lightbox-map eag-map--empty" aria-hidden="true"><MapPinIcon /></span>
            )}
            {item.website && (
              <a className="eag-website eag-lightbox-website" href={item.website} target="_blank" rel="noopener noreferrer" aria-label={`${item.name} website`}>
                <WebsiteIcon />
              </a>
            )}
          </span>
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
          <span className="eag-eyebrow eag-eyebrow--white">Discover - Things nobody tells you</span>
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
            <a href="https://ahangama.com/comp-pass/" className="eag-pill">Get Your Complimentary Pass</a>
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
    "Overview", "Best For", "Best Season",
    "How Long Do People Usually Stay?", "Getting Around Ahangama",
    "Best Cafes", "Best Stays", "Best Eats", "Best Experiences", "Wellness",
    "Night Life", "Best Retail Stores", "Transport",
  ];

  const sectionIds = [
    "overview", "best-for", "best-season", "how-long",
    "transport", "best-cafes", "best-stays", "best-eats", "best-experiences",
"wellness", "night-life", "best-retail-stores",
    "transport-guide",
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

function GuideMapFitBounds({ places }) {
  const map = useMap();

  useEffect(() => {
    const t = setTimeout(() => {
      map.invalidateSize();

      if (!places.length) {
        map.setView(GUIDE_MAP_CENTER, 12);
        return;
      }

      if (places.length === 1) {
        map.setView([places[0].lat, places[0].lng], 15);
        return;
      }

      map.fitBounds(
        places.map((place) => [place.lat, place.lng]),
        { padding: [28, 28] },
      );
    }, 180);

    return () => clearTimeout(t);
  }, [map, places]);

  return null;
}

function getGuideMapIconSvg(categoryKey) {
  const common = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';

  switch (categoryKey) {
    case "stays":
      return `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${common} d="M4 11.5 12 5l8 6.5"/><path ${common} d="M6.5 10.5V19h11v-8.5"/><path ${common} d="M10 19v-4.5h4V19"/></svg>`;
    case "eats":
      return `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${common} d="M7 4v7"/><path ${common} d="M10 4v7"/><path ${common} d="M7 7h3"/><path ${common} d="M8.5 11v9"/><path ${common} d="M15 4v16"/><path ${common} d="M15 4c2 1.2 3 3.1 3 5.5S17 13.8 15 15"/></svg>`;
    case "experiences":
      return `<svg viewBox="0 0 24 24" aria-hidden="true"><circle ${common} cx="12" cy="12" r="7.5"/><path ${common} d="m12 8 2.2 4.3L18.5 13l-3.4 3.1.8 4.4-3.9-2-3.9 2 .8-4.4L5.5 13l4.3-.7L12 8Z"/></svg>`;
    case "wellness":
      return `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${common} d="M12 20c4.8-3.2 7-6 7-9.3 0-2.4-1.8-4.2-4.1-4.2-1.4 0-2.4.6-2.9 1.6-.5-1-1.5-1.6-2.9-1.6C6.8 6.5 5 8.3 5 10.7 5 14 7.2 16.8 12 20Z"/></svg>`;
    case "nightlife":
      return `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${common} d="M15.5 4.5a6.8 6.8 0 1 0 4 12.4 7.5 7.5 0 1 1-4-12.4Z"/><path ${common} d="m16.8 7.2.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5.5-1.2Z"/></svg>`;
    case "retail":
      return `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${common} d="M7 9V7.5A5 5 0 0 1 12 3a5 5 0 0 1 5 4.5V9"/><path ${common} d="M6 9h12l-1 11H7L6 9Z"/></svg>`;
    case "cafes":
      return `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${common} d="M5 8h10v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z"/><path ${common} d="M15 9h1.5a2.5 2.5 0 0 1 0 5H15"/><path ${common} d="M4 20h13"/></svg>`;
    default:
      return `<svg viewBox="0 0 24 24" aria-hidden="true"><circle ${common} cx="12" cy="12" r="4.5"/></svg>`;
  }
}

function createGuideMapIcon(categoryKey, color) {
  const svg = getGuideMapIconSvg(categoryKey);

  return L.divIcon({
    className: "",
    html: `<div style="width:24px;height:24px;border-radius:999px;background:${color};border:2px solid #fff;color:#fff;display:flex;align-items:center;justify-content:center">` +
      `<div style="width:13px;height:13px;display:flex;align-items:center;justify-content:center">${svg}</div>` +
      `</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function LocatedSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = useMemo(
    () => [
      { key: "stays", ...GUIDE_MAP_CATEGORY_META.stays, items: BEST_STAYS },
      { key: "eats", ...GUIDE_MAP_CATEGORY_META.eats, items: EATS },
      { key: "experiences", ...GUIDE_MAP_CATEGORY_META.experiences, items: EXPERIENCES },
      { key: "wellness", ...GUIDE_MAP_CATEGORY_META.wellness, items: WELLNESS },
      { key: "nightlife", ...GUIDE_MAP_CATEGORY_META.nightlife, items: NIGHT_LIFE },
      { key: "retail", ...GUIDE_MAP_CATEGORY_META.retail, items: BEST_RETAIL_STORES },
      { key: "cafes", ...GUIDE_MAP_CATEGORY_META.cafes, items: BEST_CAFES },
    ],
    [],
  );

  const iconMap = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.key, createGuideMapIcon(category.key, category.color)])),
    [categories],
  );

  const allPlaces = useMemo(
    () => categories.flatMap((category) =>
      category.items.map((item) => ({
        ...item,
        categoryKey: category.key,
        categoryLabel: category.label,
      }))),
    [categories],
  );

  const visiblePlaces = useMemo(() => {
    const items = activeCategory === "all"
      ? allPlaces
      : allPlaces.filter((place) => place.categoryKey === activeCategory);

    return items.filter(
      (place) => typeof place.lat === "number" && typeof place.lng === "number",
    );
  }, [activeCategory, allPlaces]);

  const unresolvedPlaces = useMemo(() => {
    const items = activeCategory === "all"
      ? allPlaces
      : allPlaces.filter((place) => place.categoryKey === activeCategory);

    return items.filter(
      (place) => typeof place.lat !== "number" || typeof place.lng !== "number",
    );
  }, [activeCategory, allPlaces]);

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
          <div className="eag-guide-map-shell">
            <div className="eag-guide-map-filters">
              <button
                type="button"
                className={`eag-pill eag-guide-map-pill ${activeCategory === "all" ? "eag-guide-map-pill--active" : ""}`}
                onClick={() => setActiveCategory("all")}
              >
                {GUIDE_MAP_CATEGORY_META.all.label}
              </button>
              {categories.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  className={`eag-pill eag-guide-map-pill ${activeCategory === category.key ? "eag-guide-map-pill--active" : ""}`}
                  onClick={() => setActiveCategory(category.key)}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className="eag-map-container eag-map-container--guide">
              <MapContainer
                center={GUIDE_MAP_CENTER}
                zoom={12}
                scrollWheelZoom={false}
                attributionControl={false}
                style={{ width: "100%", height: "100%", borderRadius: "14px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapResizer />
                <GuideMapFitBounds places={visiblePlaces} />
                {visiblePlaces.map((place) => (
                  <Marker
                    key={`${place.categoryKey}-${place.name}`}
                    position={[place.lat, place.lng]}
                    icon={iconMap[place.categoryKey]}
                  >
                    <Popup>
                      <div className="eag-guide-map-popup">
                        <strong>{place.name}</strong>
                        {place.rating ? (
                          <span className="eag-guide-map-popup-rating"><StarIcon /> {place.rating}</span>
                        ) : null}
                        {place.desc ? <p>{place.desc}</p> : null}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            <div className="eag-guide-map-meta">
              <span>{visiblePlaces.length} mapped places shown.</span>
              {unresolvedPlaces.length ? (
                <span>Not yet confidently geocoded: {unresolvedPlaces.map((place) => place.name).join(", ")}.</span>
              ) : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const BEST_STAYS = [
  { name: "Ko Lake Villa", rating: "4.4", desc: "A private seven-bedroom lakeside villa made for slow days, sunset gatherings and unforgettable stays in Ahangama.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1787639927/Ko_Lake_Villa_2_i7p3nr.webp", lat: 5.9845509, lng: 80.3373084, instagram: "https://www.instagram.com/kolakevilla.ahangama/", googleMaps: "https://maps.app.goo.gl/jRahAEuMfkCtKUrQ7", ownership: "foreign" , website: "https://www.kolakevilla.com/" , reviewCount: 23 },
  { name: "The Mugatiya Ahangama Luxury Heritage Villa", rating: "4.7", desc: "A private garden retreat in Ahangama, blending the intimacy of a home with the beauty of tropical island living.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1787640178/Mugatiya_shycdl.webp", lat: 5.9845509, lng: 80.3373084, instagram: "https://www.instagram.com/villamugatiya/?hl=en", googleMaps: "https://maps.app.goo.gl/PFjbvXmuvUMmAtq18", ownership: "foreign" , website: "https://mugatiya.com/" , reviewCount: 43 },
  { name: "Sisters Kabalana", rating: "4.9", desc: "Relaxed island stays with the warmth of home, thoughtfully cared for by our team of local women.", image:"https://res.cloudinary.com/dp7in4ulw/image/upload/v1788161176/Sisters_Acc_copy_g55nt7.webp", lat: 5.9779099, lng: 80.3513977, instagram: "https://www.instagram.com/sisterssrilanka/?hl=en", googleMaps: "https://maps.app.goo.gl/3Jix2eNgTmA8CBGT9", ownership: "local" , website: "https://sisterssrilanka.com" , reviewCount: 288 },
  { name: "Casa Samaya", rating: "4.9", desc: "Casa Samaya is a beachfront boutique hotel in Weligama offering modern rooms, a surf school, and a relaxing wellness spa.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1788320283/casa_samaya_kewdtl.webp", lat: 5.973244991042889, lng: 80.43546070822997, instagram: "https://www.instagram.com/casasamaya/?hl=en", googleMaps: "https://maps.app.goo.gl/L7iiybDudDBsUMk47", website: "https://casasamaya.com/" , reviewCount: 191 },
  { name: "Villa Alba", rating: "4.9", desc: "Conceived and styled largely as a private home, Villa Alba Ahangama has smoothly switched to ‘cute boutique hotel’. Don't miss our in room massages overlooking the paddy fields.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1788327862/Alba_d29yn3.webp", lat: 6.004850003281442, lng: 80.34979863779847, instagram: "https://www.instagram.com/villaalba_srilanka/?hl=en", googleMaps: "https://maps.app.goo.gl/Yic1D38GpdQw3kYs8", ownership: "foreign" , website: "https://www.villaalbaahangama.com/" , reviewCount: 114 },
  { name: "Pebble Alma", rating: "3.7", desc: "A minimalist, container-style eco-pod retreat offering couples a secluded private garden oasis in the heart of Ahangama.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1788408665/pebble_alma_kzzjtc.webp", lat: 5.975776677693355, lng: 80.3636174782393, instagram: "https://www.instagram.com/pebble.alma/", googleMaps: "https://maps.app.goo.gl/uYPWvoxNo4rsM79x5", reviewCount: 10},
  { name: "Ebb & Flow Jungalows", rating: "4.6", desc: "A staffed, beachfront boutique retreat offering laid-back luxury and private pools just steps from Midigama's premier surf breaks.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1788409318/ebb_and_flow_jatgto.webp", lat: 5.963341091581912, lng: 80.39707773963637, instagram: "https://www.instagram.com/ebbandflowjungalows/", googleMaps: "https://maps.app.goo.gl/HDdWtK6Sse5jrjqy6", website: "https://ebbandflowjungalows.com/", reviewCount: 41},
  { name: "Surf Club Midigama", rating: "5", desc: "A vibrant beachfront pool club and fusion restaurant in Southern Sri Lanka, blending chic poolside lounging with curated sunset DJ sets and ocean-inspired dining.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1788411397/surfclub_iycmcx.webp", lat: 5.964028072439051, lng: 80.3929395039731, instagram: "https://www.instagram.com/surfclubmidigama/", googleMaps: "https://maps.app.goo.gl/em45fSbqsYBqBv8HA", website: "https://surfclubmidigama.com/", reviewCount: 13},
  { name: "Younger Villas & Resorts", rating: "4.9", desc: "A serene four-star sanctuary in Ahangama blending modern luxury, exceptional hospitality, and tranquil coastal charm.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1788410351/younger_villa_ca6lce.webp", lat: 5.980023716891554, lng: 80.37545424019842, instagram: "https://www.instagram.com/youngervillas/", googleMaps: "https://maps.app.goo.gl/uc4F3nC7kMsCxqhF8", reviewCount: 134},
  { name: "Animals", rating: "4.8", desc: " A sleek pink boutique oasis blending premium co-working and laid back surf culture for adult travelers.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1784783052/colorred_animals_oj6aee.webp", lat: 5.979034944715787, lng: 80.3542700558208, instagram: "https://www.instagram.com/animalsahangama/", googleMaps: "https://maps.app.goo.gl/YwNuhDw4sC6MiBpw9", reviewCount: 137 },
  { name: "Lighthouse", rating: "4.7", desc: "A beautiful beachfront escape with a rooftop spot to enjoy sunsets, good food, and great coastal vibes.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1782832527/light-house-beach-view-hero_mzhrhn.webp", lat: 5.965762, lng: 80.377438, instagram: "https://www.instagram.com/lighthouse_ahangama/", googleMaps: "https://maps.app.goo.gl/qi4E2nWnjq3M9pQP9", ownership: "foreign" , website: "https://www.lighthouseahangama.com/" , reviewCount: 517 },
  { name: "Trebartha East – The Roundhouse", rating: "4.9", desc: "An architectural retreat amidst a cinnamon plantation.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786339767/Threbatha_East_01_yb2dwm.webp", lat: 5.997323316318728, lng: 80.35726862935918, instagram: "https://www.instagram.com/trebarthaeast/?hl=en", googleMaps: "https://maps.app.goo.gl/QMpJ6AvyxnnJv2jy7", ownership: "foreign" , website: "https://trebartha-east.com/" , reviewCount: 101 },
  { name: "The Benison", rating: "4.9", desc: "A hidden retreat designed for slow living.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786339767/The_Benison_02_uzlcpb.webp", lat: 5.9749308289716305, lng: 80.37235731469872, instagram: "https://www.instagram.com/thebenison_ahangama/", googleMaps: "https://maps.app.goo.gl/Pm2h4n6Gr9cr94PA9", ownership: "local" , website: "https://thebenisonhotels.com/" , reviewCount: 121 },
  { name: "Casa Tikiri Boutique Hotel", rating: "4.9", desc: "An adults only boutique hideaway blending authentic Italian soul with tropical surf.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786339766/Casa_Tikiri_02_oe9tj4.webp", lat: 5.9818709, lng: 80.3467529, instagram: "https://www.instagram.com/casatikiri/?hl=en", googleMaps: "https://maps.app.goo.gl/rQJa2yj5y4XbdWXP8", ownership: "foreign" , website: "https://www.casatikiri.com/" , reviewCount: 286 },
];

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
          <div className="eag-season-banner" style={{ backgroundImage: "url(https://res.cloudinary.com/dp7in4ulw/image/upload/v1787647989/howlongpeoplestay_1_sqg1i8.webp)", backgroundPosition: "center center" }} />
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
            <span className="eag-headline-line">Getting Around</span>
            <span className="eag-headline-line">Ahangama</span>
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <div className="eag-transport-block">
            <div className="eag-transport-sub" style={{ color: "var(--eag-teal-dark)" }}>Getting Here</div>
            <p className="eag-body">
              Ahangama is around a 2–3 hour drive from Bandaranaike International Airport (CMB), depending on traffic and your exact destination. Private airport transfers are the most convenient option, with prices varying depending on the vehicle and provider. The train is a beautifully scenic and budget-friendly alternative, but expect a longer journey and additional connections from the airport.
            </p>
          </div>
        </Reveal>
        <Reveal delay={2}>
          <div className="eag-transport-block">
            <div className="eag-transport-sub" style={{ color: "var(--eag-teal-dark)" }}>Getting Around</div>
            <p className="eag-body">
              Renting a scooter is one of the best ways to explore Ahangama and the surrounding coast, with local rentals often starting at around LKR 2,000 per day. Local tuk-tuks are also widely available for shorter journeys—just agree on the price before getting in, or use a ride-hailing app where available.
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
              {BEST_STAYS.map((item) => (
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
                          <span>{item.rating}{item.reviewCount > 0 ? ` (${item.reviewCount})` : ""}</span>
                        </span>
                      )}
                    </div>
                    <CardLinks item={item} />
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
  { name: "Citra", image:"https://res.cloudinary.com/dp7in4ulw/image/upload/v1787500275/main_pic_g5ftha.webp", rating: "4.6", desc: "A Culinary Experience Nestled Between The Palm Trees And The Ocean.",lat: 5.9730175, lng: 80.4349573, instagram: "https://www.instagram.com/citrasrilanka", googleMaps: "https://maps.app.goo.gl/1hoMZCzCh5x8MdFK8?g_st=ic", ownership: "local" , website: "https://www.citra-restaurant.com/" , reviewCount: 655 },
  { name: "RIBS", rating: "4.5", desc:"Smokin’ Hot", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1788173203/RIBS_A_k56cyw.webp", lat: 5.976389786629992, lng: 80.35404190711678, instagram: "https://www.instagram.com/ribs.ahangama/?hl=en", googleMaps: "https://maps.app.goo.gl/A7cjomUMU4UGxT8H6", ownership: "local" , website: "" , reviewCount: 77 },
  { name: "Oyummy", rating: "4.8", desc: "A lush garden eatery blending authentic Lebanese soul food with vibrant tropical surf vibes.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1788408993/oyummy_jwioh8.webp", lat: 5.980115830366081, lng: 80.36750095867284, instagram: "https://www.instagram.com/oyummy.ahangama/", googleMaps: "https://maps.app.goo.gl/uu8ojKTKVCAqr6EB8", reviewCount: 190},
  { name: "Samba Ahangama", rating: "4.8", desc: "A beachside slow-living sanctuary in southern Sri Lanka blending boutique accommodation, vibrant all-day dining, and a thriving co-working hub for surfers and digital nomads.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1788409664/samba_zaegim.webp", lat:5.968549103968692, lng: 80.37512399361225, instagram: "https://www.instagram.com/samba_ahangama/", googleMaps: "https://maps.app.goo.gl/uGQbbDir3Y2V6WY58", reviewCount: 327},
  { name: "Taboo Beach Club", rating: "5", desc: "An upscale, boho-chic oasis where high-energy beach parties meet luxury dining and vibrant Mediterranean vibes.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1788410783/taboo_d4m4ba.webp", lat: 5.999802804861424, lng: 80.2676686235716, instagram: "https://www.instagram.com/taboo.beachclub/", googleMaps: "https://maps.app.goo.gl/RWCsJEPL233JFrUn9", website: "https://www.taboobeachclub.com.mx/" , reviewCount: 17 },
  { name: "Kai Rooftop", rating: "4.6", desc: "Rooftop dining, great cocktails and beautiful ocean views.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426785/Kai_rooftop_ahangama_mcetbs.webp", lat: 5.9723502, lng: 80.3635430, instagram: "https://www.instagram.com/kai_ahangama/", googleMaps: "https://maps.app.goo.gl/eRRmfHJ7uq3ry5VZ7", ownership: "foreign" , website: "" , reviewCount: 1657 },
  { name: "Mermaid’s Kitchen", rating: "4.6", desc: "Fresh, flavourful food served in a relaxed tropical setting.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786427902/Mermaids_cbow9y.webp", lat: 5.9702466, lng: 80.3672881, instagram: "https://www.instagram.com/mermaids_kitchen_ahangama/?hl=en", googleMaps: "https://maps.app.goo.gl/e8BqTHRCjGfq9CDE7", ownership: "local" , website: "" , reviewCount: 750 },
  { name: "Pickled Pelican", rating: "4.4", desc: "Creative dishes, refreshing drinks and a relaxed coastal atmosphere.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426469/Pickled_Pelican_a9llwm.webp", lat: 5.973088216727786, lng: 80.36383532958487, instagram: "https://www.instagram.com/pickledpelican/", googleMaps: "https://maps.app.goo.gl/i5eciTxYdUxBAymt7", ownership: "foreign" , website: "" , reviewCount: 208 },
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
                          <span>{item.rating}{item.reviewCount > 0 ? ` (${item.reviewCount})` : ""}</span>
                        </span>
                      )}
                    </div>
                    <CardLinks item={item} />
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
  { name: "Kumbuk Kitchen & Art Space", rating: "5", desc: "Join hands on Sri Lankan cooking classes and discover local flavours in a creative setting.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426466/Kumbuk_Community_1_tnbbky.webp", lat: 6.0026417, lng: 80.3789287, instagram: "https://www.instagram.com/kumbuk.community/", googleMaps: "https://maps.app.goo.gl/8YGEx37aMgPfmqtTA", ownership: "local" , website: "" , reviewCount: 53 },
  { name: "Coconut Court Pickleball", rating: "5", desc: "Enjoy one of the fastest growing sports in a fun and social setting.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786342540/Coconut_Court_Pickleball_fdenxj.webp", lat: 5.978418297405438, lng: 80.34807776441775, instagram: "https://www.instagram.com/coconutcourt_lk/?hl=en", googleMaps: "https://maps.app.goo.gl/4QpVUnUjjwE3Nbnd9", ownership: "local" , website: "https://coconutcourt.setmore.com/c" , reviewCount: 67 },
  { name: "Pachcha Sanni", rating: "5", desc: "Get inked at one of Ahangama's most creative tattoo studios, specialising in unique custom designs and artistic expression.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786342709/Pachcha_Sanni_ghe4qa.webp", lat: 5.982642872487125, lng: 80.36866349380335, instagram: "https://www.instagram.com/pachchasanni/", googleMaps: "https://maps.app.goo.gl/wc392c7za4CWkUe37", ownership: "foreign" , website: "" , reviewCount: 3 },
  { name: "Qamar by Zan", rating: "5", desc: "Design and create your own jewellery in a hands-on workshop while exploring beautifully curated fashion pieces.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786522279/Qmar_by_zan_niowzn.webp", lat: 5.9817691, lng: 80.3494556, instagram: "https://www.instagram.com/qamar.by.zan/?hl=en", googleMaps: "https://maps.app.goo.gl/mVsQFDsEoLeTXjPo8", ownership: "foreign" , website: "" , reviewCount: 16 },
  { name: "JN Tattoo", rating: "5", desc: "JN Tattoo is a clean, top-rated Ahangama studio specializing in custom, fine-line tattoos for travelers in a relaxed, hygienic setting.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1788156446/JN_Tattoo_mnh8gj.webp", lat: 5.978418297405438, lng: 80.34807776441775, instagram: "https://www.instagram.com/jntattoosri/?hl=en", googleMaps: "https://maps.app.goo.gl/mukDMPB7MiUaSE6q8", ownership: "local" , website: "" , reviewCount: 8 },
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
                          <span>{item.rating}{item.reviewCount > 0 ? ` (${item.reviewCount})` : ""}</span>
                        </span>
                      )}
                    </div>
                    <CardLinks item={item} />
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
  { name: "CrossFit Ceylon Palm gym", rating: "5", desc: "", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1788319710/Crossfit_gym_uvfqll.webp", lat: 5.988804340231071, lng: 80.38237393947473, instagram: "https://www.instagram.com/crossfitceylonpalm?igsi=MWdmNTZ0a3M1dTd4bQ==", googleMaps: "https://maps.app.goo.gl/h5V3AJ9vZKGQ43UN7?g_st=ic", website: "https://crossfitceylon.com/" , reviewCount: 25 },
  { name: "Calma Samaya", rating: "5", desc: "A rooftop wellness sanctuary offering yoga, breathwork, massage, and peaceful ocean views.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426467/Calma_Samaya_ehqfln.webp", lat: 5.9734716, lng: 80.4348467, instagram: "https://www.instagram.com/calmasamaya/", googleMaps: "https://maps.app.goo.gl/D7Dr8h8ReHxvQXC77", ownership: "local" , website: "https://casasamaya.com/wellness.html" , reviewCount: 72 },
  { name: "Pura Pilates", rating: "4.9", desc: "A welcoming Pilates studio helping people build strength, balance, and well-being.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1782813854/01_-_Pura_Pilates__myhaog.webp", lat: 5.980186974839597, lng: 80.36560881118537, instagram: "https://www.instagram.com/purapilatessrilanka/?hl=en", googleMaps: "https://maps.app.goo.gl/gkoHq55mmjMBd9hR8", ownership: "local" , website: "https://purapilatessrilanka.com/" , reviewCount: 189 },
  { name: "White Lotus Spa – Radisson Collection", rating: "4.9", desc: "Luxury spa treatments designed to relax, restore, and rejuvenate.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426471/Couple_Room_edited_1_vssbmp.webp", lat: 5.9996641, lng: 80.2671000, instagram: "https://www.instagram.com/whitelotusgalle/", googleMaps: "https://maps.app.goo.gl/YmG7MZRJVmBHREiR6", ownership: "foreign" , website: "https://whitelotusgalle.com/" , reviewCount: 116 },
  { name: "Banya Steam House", rating: "5", desc: "Hot steam, cold plunges and deep relaxation.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426467/Banya_Steam_House_ac31sy.webp", lat: 5.994568318002994, lng: 80.35071306820878, instagram: "https://www.instagram.com/banyasrilanka/", googleMaps: "https://maps.app.goo.gl/1x6KTQJqBnjfBAya6", ownership: "local" , website: "" , reviewCount: 58 },
  { name: "The Nuga House", rating: "4.5", desc: "A tranquil sanctuary for rest and healing.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426466/Copy_of_Section_2_-_Yoga_in_Nuga_House_b3f1mw.avif", lat: 5.982442203112178, lng: 80.34663320384955, instagram: "https://www.instagram.com/thenugahouse/", googleMaps: "https://maps.app.goo.gl/zhXuGWngQG6t6NFH7", ownership: "local" , website: "https://www.thenugahouse.com/" , reviewCount: 161 },
  { name: "Sellam Gym Ahangama", rating: "4.9", desc: "A modern gym for keeping your routine on track.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786545879/Sellam_Gym2_vxn1mg.webp", lat: 5.9742794466164995, lng: 80.36432653558248, instagram: "https://www.instagram.com/sellamgym/", googleMaps: "https://maps.app.goo.gl/q5VVPC53YaFyWMyXA", ownership: "local" , website: "" , reviewCount: 50 },
  { name: "Spa Station Midigama", rating: "4.8", desc: "Relaxing massages and rejuvenating treatments nearby.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786545710/Spa_Station_midi_yseyx7.webp", lat: 5.965506394775779, lng: 80.39207693710006, instagram: "https://www.instagram.com/spa.station.lk/", googleMaps: "https://maps.app.goo.gl/EyykJFTZHQtUss837", ownership: "local" , website: "" , reviewCount: 246 },
];
const NIGHT_LIFE = [
  { name: "Lamana", rating: "4.4", desc: "A popular late-night hangout with a lively atmosphere, great music, and a skate rink that adds a playful twist to the night.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786620612/Lamana_23_vnrlgv.webp", lat: 5.9723738, lng: 80.3639983, instagram: "https://www.instagram.com/lamana_ahangama/?hl=en", googleMaps: "https://maps.app.goo.gl/jAMYSH9VbaigtUVP7", ownership: "foreign" , website: "" , reviewCount: 336 },
  { name: "Hakuna Matata", rating: "4.6", desc: "Beachfront cocktails, music and DJs.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426473/Hakuna_Matata_ldiwqq.webp", lat: 5.9669647, lng: 80.3748064, instagram: "https://www.instagram.com/hakuna_matata_ahangama/?hl=en", googleMaps: "https://maps.app.goo.gl/TnhsB5gHBBvWB2Yz6", ownership: "foreign" , website: "" , reviewCount: 703 },
  { name: "MONO", rating: "5", desc: "Modern nightlife with a retro soul, creative cocktails, quality drinks, and timeless tunes that keep the night moving.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426470/mono3_c0p2jh.webp", lat: 5.9725588, lng: 80.3635790, instagram: "https://www.instagram.com/find_mono_/", googleMaps: "https://maps.app.goo.gl/hyL2QCdzD6oZWCEt6", ownership: "foreign" , website: "" , reviewCount: 13 },
  { name: "Kurundu", rating: "4.8", desc: "A lively setting for drinks and evening entertainment.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426467/Kurundu2_lzstjp.webp", lat: 5.9723740, lng: 80.3639553, instagram: "https://www.instagram.com/kurundu.ahangama/?hl=en", googleMaps: "https://maps.app.goo.gl/SEVUaahMCe4wsekf6", ownership: "local" , website: "https://kurundurestaurant.com/" , reviewCount: 306 },
  { name: "Kicks Ahangama", rating: "4.5", desc: "Dance, socialise and enjoy the night.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786344638/Kicks_Ahangama_bkuzuq.webp", lat: 5.9723763, lng: 80.3639558, instagram: "https://www.instagram.com/kicks_ahangama/?hl=en", googleMaps: "https://maps.app.goo.gl/ZZcd5BL6RnGqE9xK6", ownership: "foreign" , website: "https://kicks.easyweek.io/" , reviewCount: 53 },
  { name: "Hotel De Uncle’s", rating: "4.7", desc: "A laid-back seaside favourite for golden sunsets, chilled drinks, live bands, and unforgettable evenings by the ocean.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426468/Uncle_2_c3vkpl.webp", lat: 5.9723415, lng: 80.3633269, instagram: "https://www.instagram.com/hoteldeuncles/", googleMaps: "https://maps.app.goo.gl/cpP7BNhzC4bi6pH69", ownership: "local" , website: "https://unclescolombo.lk/" , reviewCount: 372 },
];

const BEST_RETAIL_STORES = [
  { name: "Gusta", rating: "4.6", desc:"Gourmet groceries, fresh produce and artisan products.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786346946/Gusta_01_mnzv6h.webp", lat: 5.978468021160938, lng: 80.34854993743255, instagram: "https://www.instagram.com/gusta.sl/", googleMaps: "https://maps.app.goo.gl/EwBjQhME4L1tuj72A", ownership: "local" , website: "https://www.gusta.lk/" , reviewCount: 31 },
  { name: "Mudra Herbal Spicy Tea Shop", rating: "4.9", desc:"Handcrafted teas, local spices and Sri Lankan flavours.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786346942/Mudra_Herbal_Spicy_Tea_Shop_bzqrm4.webp", lat: 5.973413421402998, lng: 80.3641129182273, instagram: "https://www.instagram.com/gunasekaranalaka033/?hl=en", googleMaps: "https://maps.app.goo.gl/u31u2MqweFkC6dCB6", ownership: "local", reviewCount: 37 },
  { name: "Mint Ceylon", rating: "4.7", desc: "Consciously crafted slow fashion and unique lifestyle pieces, mindfully handmade by local artisans in the heart of Sri Lanka.", image:"https://res.cloudinary.com/dp7in4ulw/image/upload/v1787289095/mint_ceylong_axzbft.webp", lat: 5.973834393620351, lng: 80.36327069432797, instagram: "https://www.instagram.com/mint.ceylon/?hl=en", googleMaps: "https://maps.app.goo.gl/DgphUYpCcKj7AJsf7", ownership: "local" , website: "https://mintceylon.com/a" , reviewCount: 0 },
  { name: "Yiva Essentials", rating: "5", desc:"A lovely place to discover fashion, lifestyle, and unique finds in Ahangama", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426467/Yiva_essentials_ii7doq.webp", lat: 5.9709753, lng: 80.3664319, instagram: "https://www.instagram.com/yivaessentials/", googleMaps: "https://maps.app.goo.gl/KFY41m1dvgeqtdzg6", ownership: "foreign" , website: "" , reviewCount: 13 },
  { name: "Prickly Pear by Cactus", rating: "3.8", desc:" A colorful beachfront concept boutique serving up trendy resort style and sun-soaked cafe vibes.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1786426468/Prickly_Pear_kjkltb.webp", lat: 5.9719583, lng: 80.3644725, instagram: "https://www.instagram.com/pricklypear.ahangama/?hl=en", googleMaps: "https://maps.app.goo.gl/LohJpBb5rVRDeHXi8", ownership: "foreign" , website: "" , reviewCount: 21 },
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
                      <span>{item.rating}{item.reviewCount > 0 ? ` (${item.reviewCount})` : ""}</span>
                    </span>
                  )}
                </div>
                {item.tagline && (
                  <span className="eag-card-tagline">{item.tagline}</span>
                )}
                <CardLinks item={item} />
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

const BEST_CAFES = [
  { name: "Kaffi Ahangama", rating: "4.7", desc: "Brews & Bakes To Save The Day.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1788240082/kafii01_czf6wl.webp", lat: 5.9689078, lng: 80.3706031, instagram: "https://www.instagram.com/kaffi.ahangama/", googleMaps: "https://maps.app.goo.gl/XY9S85T9woSk1bDv7", ownership: "local", reviewCount: 389 },
  { name: "Aliikai Cafe", rating: "4.9", desc: "A cosy beachside cafe serving wholesome bowls, artisan coffee and tropical vibes in Ahangama.", tagline: "Local Woman-Owned", image:"https://res.cloudinary.com/dp7in4ulw/image/upload/v1787554069/Aliikai_2_abmchk.webp", lat: 5.967050478875724, lng: 80.375273031689, instagram: "https://www.instagram.com/aliikai_ahangma_arugambay/?hl=en", googleMaps: "https://maps.app.goo.gl/83eH8u3i7fyih8Ux6", ownership: "local", reviewCount: 176 },
  { name: "Sisters Cafe", rating: "4.9", desc: "Mediterranean flavours with an island twist, exceptional coffee, proudly brought to life by our team of local women.", image:"https://res.cloudinary.com/dp7in4ulw/image/upload/v1788160987/Sisters_Cafe_hunfx4.webp", lat: 5.9779099, lng: 80.3513977, instagram: "https://www.instagram.com/sisterssrilanka/?hl=en", googleMaps: "https://maps.app.goo.gl/Wd8wyGMaVWvMpE478", ownership: "local" , website: "https://sisterssrilanka.com" , reviewCount: 288 },
  { name: "Café Samaya", rating: "4.9", desc: "A serene hillside cafe with panoramic ocean views, traditional Sri Lankan flavours and mindful hospitality.", image:"https://res.cloudinary.com/dp7in4ulw/image/upload/v1787287237/Cafe_Samaya_ufdsjh.png", lat: 5.9730175, lng: 80.4349573, instagram: "https://www.instagram.com/cafesamaya/", googleMaps: "https://maps.app.goo.gl/KYquu5urhA6yuehX7", website: "https://casasamaya.com/restaurant.html" , reviewCount: 467 },
  { name: "Thileni's", rating: "4.6", desc: "A vibrant beachfront cafe and sunset lounge in Ahangama offering front-row surf views, creative coastal fusion cuisine, and an upscale, barefoot-luxury vibe.", image:"https://res.cloudinary.com/dp7in4ulw/image/upload/v1788154644/Thileni_s_mz5rq1.webp", lat: 5.9782004, lng: 80.348526, instagram: "https://www.instagram.com/thilenis_ahangama/?hl=en", googleMaps: "https://maps.app.goo.gl/6v8ZtnzJvpLWvZsc8", reviewCount: 1116 },
  { name: "Daily Dose", rating: "5", desc: "A laid-back coastal café serving great specialty matcha, local bites, and perfect workspace vibes.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1788413091/Daily_Dose_wxycss.webp", lat: 5.978715233126749, lng: 80.34844662172394, instagram: "https://www.instagram.com/dailydosesl/tagged/", googleMaps: "https://maps.app.goo.gl/xnqVRV7NTTaGhcHA6", reviewCount: 64},
  { name: "Living Room Concept Store", rating: "4.9", desc: "A curated Turkish and Sri Lankan designer boutique blended with a cozy café serving specialty coffee, matcha, and fresh pastries in the heart of Ahangama.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1787287267/Living_Room_zleo9f.png", lat: 5.97286120007652, lng: 80.36444339047927, instagram: "https://www.instagram.com/livingroomahangama/", googleMaps: "https://maps.app.goo.gl/pLE6rzg2QdhzkRgx5", reviewCount: 102},
  { name: "Cafe Ceylon", rating: "4.3", desc: "A rustic cafe blending Ceylon tea traditions with modern cafe culture in a relaxed setting.", image:"https://res.cloudinary.com/dp7in4ulw/image/upload/v1787287237/Cafe_Ceylon_wku3on.png", lat: 5.9782004, lng: 80.348526, instagram: "https://www.instagram.com/cafe_ceylon/?hl=en", googleMaps: "https://maps.app.goo.gl/SHJXxj5BLrDB5q8V7", ownership: "local" , website: "https://www.cafeceylon.lk/" , reviewCount: 431 },
  { name: "Petals", rating: "5", desc: "A floral-themed cafe offering artisan lattes, fresh pastries and a peaceful garden atmosphere.", image:"https://res.cloudinary.com/dp7in4ulw/image/upload/v1787287257/Petals_vb8d5g.jpg", lat: 5.9781800860434835, lng: 80.35357067301068, instagram: "https://www.instagram.com/petals.ahangama/", googleMaps: "https://maps.app.goo.gl/sC3rhe4vj3XyYuD99" , reviewCount: 201 },
  { name: "Cafe Wave", rating: "4.8", desc: "A breezy roadside cafe with fresh juices, light bites and a chilled surf-town vibe.", image:"https://res.cloudinary.com/dp7in4ulw/image/upload/v1787287235/cafe_wave_nak6fe.jpg", lat: 5.98254317290508, lng: 80.33695907790974, instagram: "https://www.instagram.com/cafewavesl/", googleMaps: "https://maps.app.goo.gl/F3JsA1KrdsENUUiSA", reviewCount: 209 },
  { name: "Abrazo", rating: "4.8", desc: "A Spanish-inspired cafe serving tapas-style bites, specialty coffee and warm coastal hospitality.", image:"https://res.cloudinary.com/dp7in4ulw/image/upload/v1787287235/Abrazo_h3loxm.jpg", lat: 5.96829229558289, lng: 80.37337977301502, instagram: "https://www.instagram.com/abrazo_trincomalee_ahangama/", googleMaps: "https://maps.app.goo.gl/XNCVfRaERkxBui1o7", reviewCount: 756 },
  { name: "Crave", rating: "4.8", desc: "A popular local cafe known for its flavour-packed brunches, fresh smoothies and vibrant atmosphere.", image:"https://res.cloudinary.com/dp7in4ulw/image/upload/v1787287235/crave_fjckup.jpg", lat: 5.9726530766658374, lng: 80.3631771134925, instagram: "https://www.instagram.com/crave_ahangama/", googleMaps: "https://maps.app.goo.gl/JDJqS6swF9gzUr9q6", reviewCount: 223 },
];

function BestCafesSection({ onImageClick }) {
  return (
    <section id="best-cafes" className="eag-section eag-section--cream">
      <div className="eag-content">
        <Reveal><h2 className="eag-headline"><span className="eag-headline-line">Best Cafes</span></h2></Reveal>
        {cardGrid(BEST_CAFES, onImageClick)}
      </div>
    </section>
  );
}

const TRANSPORT_VENUES = [
  { name: "AK Bike Rentals", rating: "5", desc: "Top-rated scooter rentals and easy local movement around Ahangama.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1787570539/AK_bike_rental_1_jajy1y.webp", instagram: "", googleMaps: "https://maps.app.goo.gl/4i3vmix5xRGhJYzh9", ownership: "local" , website: "" , reviewCount: 21 },
  { name: "Spring Tours", rating: "5", desc: "Experience Sri Lanka seamlessly with Spring Tours' premier private transport and custom island itineraries.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1788260697/Spring_tours_exyfto.webp", lat: 5.982985357231829, lng: 80.37618523338615, instagram: "https://www.instagram.com/manoj.sanjeewa.35912/?hl=en", googleMaps: "https://maps.app.goo.gl/bYxqVSUbbgpTHSjn9", website: "" , reviewCount: 45 },
  { name: "Scooty Rental & Taxi Service", rating: "5", desc: "Quick scooter access and local transport support while staying in the area.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1787287235/scooty_rentals_and_bike_services_gtzqlc.webp", instagram: "", googleMaps: "https://maps.app.goo.gl/hTVAV4kSbLJSvLeQ9", ownership: "local" , website: "" , reviewCount: 497 },
  { name: "Happy Tours", rating: "5", desc: "A practical transport partner for local trips and travel support around the south coast.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1787287234/Happy_Tours_bkh98m.jpg", instagram: "https://www.instagram.com/happy_tours_u/?hl=en", googleMaps: "https://maps.app.goo.gl/gVEjdx1WQRgYF52s7", ownership: "foreign" , website: "" , reviewCount: 134 },
  { name: "Nova Rent a Car", rating: "4.8", desc: "Cars and transport options for visitors looking to explore beyond Ahangama.", image: "https://res.cloudinary.com/dp7in4ulw/image/upload/v1787287258/Nova_Rent_a_Car_wuaos2.png", instagram: "", googleMaps: "https://maps.app.goo.gl/ew4MYxtAefLNsLMR8", ownership: "foreign" , website: "" , reviewCount: 39 },
];

function TransportGuideSection({ onImageClick }) {
  return (
    <section id="transport-guide" className="eag-section eag-section--white">
      <div className="eag-content">
        <Reveal><h2 className="eag-headline"><span className="eag-headline-line">Transport</span></h2></Reveal>
        {cardGrid(TRANSPORT_VENUES, onImageClick)}
      </div>
    </section>
  );
}


function ClosingCTASection() {
  return (
    <section id="closing-cta" className="eag-section eag-section--navy eag-section--closing">
      <div className="eag-orbs" aria-hidden="true">
        <span className="eag-orb eag-orb--1" />
        <span className="eag-orb eag-orb--2" />
        <span className="eag-orb eag-orb--3" />
      </div>
      <div className="eag-content">
        <StaggerReveal className="eag-closing-group">
          <div className="eag-closing-card">
            <div className="eag-closing-glow" />
            <ScooterIllustration />
            <div className="eag-closing-body">
              <h2 className="eag-headline eag-headline--light">
                <span className="eag-headline-line">Want More</span>
                <span className="eag-headline-line">Insider Tips?</span>
              </h2>
              <p className="eag-body eag-body--light">
                Follow <strong>@ahangama.pass</strong> on Instagram for real-time updates, hidden gems, and exclusive local content.
              </p>
            </div>
            <div className="eag-closing-cta-wrap">
              <a
                href="https://instagram.com/ahangama.pass"
                target="_blank"
                rel="noopener noreferrer"
                className="eag-pill eag-pill--closing"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginRight:8}}>
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8"/>
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8"/>
                  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>
                </svg>
                Follow Us
              </a>
              <a
                href="https://www.instagram.com/ahangama.pass"
                target="_blank"
                rel="noopener noreferrer"
                className="eag-closing-handle"
              >
                @ahangama.pass
              </a>
            </div>
          </div>
        </StaggerReveal>
      </div>
    </section>
  );
}

/* ------ TOC Ribbon ------ */

const tocMobileQuery =
  typeof window !== "undefined" ? window.matchMedia("(max-width: 768px)") : null;

function isTocMobile() {
  return tocMobileQuery ? tocMobileQuery.matches : false;
}

function TocRibbon({ currentChapterId }) {
  const [revealed, setRevealed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const ribbonRef = useRef(null);

  const hideAll = useCallback(() => {
    setRevealed(false);
    setExpanded(false);
  }, []);

  const handleNav = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      hideAll();
    }
  }, [hideAll]);

  const handleTabClick = useCallback(() => {
    if (!isTocMobile()) {
      setExpanded((v) => !v);
      return;
    }
    if (!revealed) {
      setRevealed(true);
      return;
    }
    setExpanded((v) => !v);
  }, [revealed]);

  const handleRibbonTap = useCallback(() => {
    if (isTocMobile() && !revealed) setRevealed(true);
  }, [revealed]);

  useEffect(() => {
    if (!isTocMobile()) return;
    const onScroll = () => {
      if (!expanded) setRevealed(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [expanded]);

  useEffect(() => {
    if (!isTocMobile()) return;
    if (!revealed && !expanded) return;
    const onDocPointerDown = (e) => {
      if (ribbonRef.current && !ribbonRef.current.contains(e.target)) hideAll();
    };
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, [revealed, expanded, hideAll]);

  const tocItems = [
    { id: "cover", label: "Cover" },
    { id: "contents", label: "Contents" },
    { id: "overview", label: "Overview" },
    { id: "located", label: "Located" },
    { id: "best-for", label: "Best For" },
    { id: "best-season", label: "Best Season" },
    { id: "how-long", label: "How Long" },
    { id: "transport", label: "Getting Around" },
    { id: "best-cafes", label: "Best Cafes" },
    { id: "best-stays", label: "Best Stays" },
    { id: "best-eats", label: "Best Eats" },
    { id: "best-experiences", label: "Experiences" },
    { id: "wellness", label: "Wellness" },
    { id: "night-life", label: "Night Life" },
    { id: "best-retail-stores", label: "Best Retail Stores" },
    { id: "transport-guide", label: "Transport" },
    { id: "closing-cta", label: "Closing" },
  ];

  return (
    <div
      ref={ribbonRef}
      className={`eag-toc-ribbon ${expanded ? "eag-toc-ribbon--expanded" : ""} ${revealed ? "eag-toc-ribbon--revealed" : ""}`}
      onClick={handleRibbonTap}
      onMouseEnter={() => { if (!isTocMobile()) setExpanded(true); }}
      onMouseLeave={() => { if (!isTocMobile()) setExpanded(false); }}
    >
      <div
        className="eag-toc-tab"
        onClick={handleTabClick}
        role="button"
        tabIndex={0}
        aria-expanded={expanded || revealed}
        onKeyDown={(e) => { if (e.key === "Enter") handleTabClick(); }}
      >
        Contents
      </div>
      <div className="eag-toc-panel">
        <div className="eag-toc-panel-title">Jump to section</div>
        <div className="eag-toc-panel-list">
          {tocItems.map((item) => (
            <div
              key={item.id}
              className={`eag-toc-panel-item ${currentChapterId === item.id ? "eag-toc-panel-item--active" : ""}`}
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
      return localStorage.getItem("eag-dark-mode") !== "0";
    } catch {
      return true;
    }
  });

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = document.querySelector(".eag-scroll-container");
    if (!container) return;
    scrollContainerRef.current = container;

    const sections = Array.from(container.querySelectorAll(".eag-section"));
    if (!sections.length) return;

    let ticking = false;
    const onScroll = () => {
      setShowTopBtn(container.scrollTop > 300);
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const containerTop = container.scrollTop;
        const containerMid = containerTop + container.clientHeight / 2;
        let closest = 0;
        let minDist = Infinity;
        sections.forEach((section, i) => {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top + containerTop;
          const sectionMid = sectionTop + rect.height / 2;
          const dist = Math.abs(sectionMid - containerMid);
          if (dist < minDist) {
            minDist = dist;
            closest = i;
          }
        });
        setCurrentChapter(closest + 1);
        setCurrentBg(CHAPTERS[closest]?.bg || "navy");
        ticking = false;
      });
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => container.removeEventListener("scroll", onScroll);
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
    <div className={darkMode ? "eag-dark-mode" : ""}>
      <Helmet>
        <title>Experience Ahangama, The Insider&rsquo;s Guide to Sri Lanka&rsquo;s Coolest Coast</title>
        <meta name="description" content="The insider's guide to Sri Lanka's coolest coast. Curated chapters on stays, eats, surf, wellness, and slow living in Ahangama." />
        <link rel="canonical" href="https://ahangama.com/guide" />
        <meta property="og:title" content="Experience Ahangama, The Insider's Guide to Sri Lanka's Coolest Coast" />
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

      <TocRibbon currentChapterId={CHAPTERS[currentChapter - 1]?.id} />
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

      <div className="eag-scroll-container">
        <div className="eag-desktop-frame">
          <CoverSection />
          <ContentsSection />
          <OverviewSection />
          <LocatedSection />
          <BestForSection />
          <BestSeasonSection />
          <HowLongSection />
          <TransportSection />
          <BestCafesSection onImageClick={setLightboxItem} />
          <BestStaysSection onImageClick={setLightboxItem} />
          <BestEatsSection onImageClick={setLightboxItem} />
          <BestExperiencesSection onImageClick={setLightboxItem} />
          <WellnessSection onImageClick={setLightboxItem} />
          <NightLifeSection onImageClick={setLightboxItem} />
          <BestRetailStoresSection onImageClick={setLightboxItem} />
          <TransportGuideSection onImageClick={setLightboxItem} />
          <ClosingCTASection />
        </div>
      </div>

      <ImageLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </div>
  );
}
