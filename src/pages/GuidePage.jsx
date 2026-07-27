import React, { useEffect, useRef } from "react";
import { Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import AnimalsWebImage from "../assets/animals4x scale copy.webp";
import TrebathaWebImage from "../assets/Trebatha 4x scale copy.webp";
import "../styles/guide-page.css";

const { Paragraph, Text, Title } = Typography;

const GUIDE_HERO_IMAGE =
  "https://content.r9cdn.net/rimg/dimg/09/d4/c553223f-city-304822-172c638b4d6.jpg?crop=true&width=1366&height=768&xhint=1254&yhint=1207";

const GUIDE_CONTENT_IMAGE =
  "https://stokedsurfadventures.com/wp-content/uploads/2024/05/Gota-Dagua-sri-lanka-surf-camp-ahangama-learn-to-surf-coaching-kabalana-stoked-surf-adventures-14-copy.jpg";

const GUIDE_OVERVIEW_IMAGE =
  "https://bookinglayer-cdn.ams3.cdn.digitaloceanspaces.com/uploads/businesses/944/images/1440_6e0-1635949941.webp";

const GUIDE_BEST_STAYS_INTRO_IMAGE =
  "https://res.cloudinary.com/xmybcqyi/image/upload/v1783675102/Screenshot_2026-07-10_at_14.48.09_btwioa.png";

const GUIDE_BEST_STAYS_IMAGE = TrebathaWebImage;
const GUIDE_ANIMALS_IMAGE = AnimalsWebImage;
const GUIDE_KO_LAKE_VILLA_IMAGE = "https://res.cloudinary.com/dp7in4ulw/image/upload/v1783921928/Ko_Lake_Villa_nqxg16.webp"
const GUIDE_SOLA_HOTEL_IMAGE = "https://res.cloudinary.com/dp7in4ulw/image/upload/v1783921928/Sola_Hotel_t86nt4.webp"
const GUIDE_Kelly_IMAGE = "https://res.cloudinary.com/dp7in4ulw/image/upload/v1783921928/Kelly_Ahangama_ydgnq0.webp"

const GUIDE_EXTRA_STAYS = [
];

const GUIDE_CONTENT_LINKS = [
  "Ahangama Overview",
  "Area Map",
  "Where to Stay ?",
  "Eat & Drink",
  "Experiences & Surf Breaks",
  "Wellness & Healing",
  "Nightlife",
  "Retail & Concept Stores",
  "Wildlife & Nature",
  "Local Culture & Etiquette",
  "Essential Travel Info",
  "Suggested Itineraries",
  "Insider Tips (Things Nobody Tells You)",
  "Connect With Us",
];

function InstagramLabel({ text, justify = "flex-end", className = "" }) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: justify,
        gap: 8,
      }}
    >
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="#FFFFFF"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="4.2" stroke="#FFFFFF" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="#FFFFFF" />
      </svg>
      <span>{text}</span>
    </span>
  );
}

function DirectionLabel({ text = "Direction", justify = "flex-end", className = "" }) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: justify,
        gap: 8,
      }}
    >
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 21s6-5.55 6-10a6 6 0 1 0-12 0c0 4.45 6 10 6 10Z"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="11" r="2.2" fill="#FFFFFF" />
      </svg>
      <span>{text}</span>
    </span>
  );
}

function FullBleedSection({ children, className = "" }) {
  return (
    <div className="dm-canvas" style={{ marginTop: 0, paddingTop: 0 }}>
      <div className="dm-wrap">
        <section
          className={`${className}`}
          style={{
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
            borderRadius: 0,
            background: "#FFFFFF",
            boxShadow: "none",
          }}
        >
          {children}
        </section>
      </div>
    </div>
  );
}

function ScrollReveal({ children, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("gp-revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`gp-scrollReveal ${className}`}>
      {children}
    </div>
  );
}

export default function GuidePage() {
  const canonical = absUrl("/guide");
  const heroMediaRef = useRef(null);

  useEffect(() => {
    const el = heroMediaRef.current;
    if (!el) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const translateY = scrolled * 0.3;
          el.style.transform = `translateY(${translateY}px) scale(1.05)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <SiteLayout navOverlayHero showFooter={false} showNav>
      <Seo
        title="Ahangama 2026/2027 Season Guide"
        description="Ahangama 2026/2027 Season Guide."
        canonical={canonical}
        ogImage={GUIDE_HERO_IMAGE}
      />

      {/* ---- HERO ---- */}
      <section
        style={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
        }}
      >
        <div className="gp-hero">
          <div aria-hidden="true" className="gp-hero-media" ref={heroMediaRef}>
            <div className="gp-hero-overlay" />
            <img src={GUIDE_HERO_IMAGE} alt="Ahangama coastline" />
          </div>
          <div className="gp-hero-content">
            <h1 className="gp-hero-title">
              <span className="gp-hero-titleLine">Ahangama</span>
              <span className="gp-hero-titleLine">2026/2027</span>
              <span className="gp-hero-titleLine">Season Guide</span>
            </h1>
            <p className="gp-hero-sub">Your curated guide to the south coast&rsquo;s most captivating destination</p>
            <div className="gp-hero-actions">
              <a href="#guide-contents" className="gp-btn gp-btn-outline">
                <span>Begin the journey</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="gp-hero-scroll" aria-hidden="true">
            <span className="gp-hero-scrollText">Scroll</span>
            <svg className="gp-hero-scrollArrow" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 3v12M5 11l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </section>

      {/* ---- GUIDE CONTENTS ---- */}
      <FullBleedSection>
        <div className="gp-sec gp-sec-warm" id="guide-contents">
          <div className="gp-sec-inner">
            <ScrollReveal>
              <div className="gp-contents-grid">
                <div className="gp-contents-titleCol-glass">
                  <span className="gp-label-glass">Content</span>
                  <h2 className="gp-contents-title">Guide<br />Contents</h2>
                  <p className="gp-contents-desc">Everything you need to know about Ahangama, curated for the 2026/2027 season.</p>
                </div>
                <div className="gp-contents-list">
                  {GUIDE_CONTENT_LINKS.map((item, index) => (
                    <a
                      key={item}
                      href={`#guide-section-${index + 1}`}
                      className="gp-contents-link"
                    >
                      <span className="gp-contents-linkNum">{String(index + 1).padStart(2, '0')}</span>
                      <span>{item}</span>
                      <span className="gp-contents-linkArrow">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </FullBleedSection>

      {/* ---- OVERVIEW ---- */}
      <FullBleedSection>
        <div className="gp-sec gp-sec-cream">
          <div className="gp-sec-inner">
            <ScrollReveal>
              <div className="gp-overview-grid">
                <div className="gp-overview-imageWrap">
                  <img src={GUIDE_OVERVIEW_IMAGE} alt="Ahangama coastal landscape" />
                </div>
                <div className="gp-overview-textCol">
                  <span className="gp-label">Overview</span>
                  <h2 className="gp-serif-title gp-overview-title">
                    Ahangama<br />Overview
                  </h2>
                  <p className="gp-body">
                    Once a sleepy stretch of local fishing shacks, Ahangama has quietly evolved into the South Coast&apos;s coolest, most curated coastal hub. It has successfully dodged the overdeveloped chaos of other global surf towns, maintaining a delicate balance between slow island living and a thriving, modern aesthetic. If you are looking for barefoot luxury, world-class waves, and jungle-fringed cafes, you have found your spot.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </FullBleedSection>

      {/* ---- BEST STAYS INTRO ---- */}
      <FullBleedSection>
        <ScrollReveal>
          <div className="gp-staysIntro">
            <div aria-hidden="true" className="gp-staysIntro-imageWrap">
              <div className="gp-staysIntro-overlay" />
              <img src={GUIDE_BEST_STAYS_INTRO_IMAGE} alt="Best stays in guide" />
            </div>
            <div className="gp-staysIntro-content">
              <div className="gp-staysIntro-contentInner">
                <span className="gp-label-glass" style={{ color: "rgba(255,255,255,0.7)" }}>Stays</span>
                <h2 className="gp-serif-title-light gp-staysIntro-title">Best Stays</h2>
                <p className="gp-staysIntro-text">
                  A handpicked list of standout stays in and around Ahangama, from design-led villas to coastal hideaways.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </FullBleedSection>

      {/* ---- BEST STAYS CARDS ---- */}
      <FullBleedSection>
        <div className="gp-stays">
          <div className="gp-stays-inner">
            <ScrollReveal>
              <div className="gp-stays-grid">
                <article className="gp-stayCard">
                  <div className="gp-stayCard-imageWrap">
                    <img src={GUIDE_BEST_STAYS_IMAGE} alt="Trebartha East the Round House" />
                  </div>
                  <div className="gp-stayCard-body">
                    <div className="gp-stayCard-header">
                      <h3 className="gp-stayCard-name">Trebartha East</h3>
                      <span className="gp-stayCard-rating">4.8 ★</span>
                    </div>
                    <p className="gp-stayCard-desc">
                      Trebartha East: A spectacular, design-led oasis nestled high in the Ahangama jungle.
                    </p>
                  </div>
                </article>

                <article className="gp-stayCard">
                  <div className="gp-stayCard-imageWrap">
                    <img src={GUIDE_ANIMALS_IMAGE} alt="Animals hotel pool and courtyard" />
                  </div>
                  <div className="gp-stayCard-body">
                    <div className="gp-stayCard-header">
                      <h3 className="gp-stayCard-name">Non Animals</h3>
                      <span className="gp-stayCard-rating">4.8 ★</span>
                    </div>
                    <p className="gp-stayCard-desc">
                      A chic, minimalist oasis just a short walk from Kabalana Beach.
                    </p>
                  </div>
                </article>

                <article className="gp-stayCard">
                  <div className="gp-stayCard-imageWrap">
                    <img src={GUIDE_KO_LAKE_VILLA_IMAGE} alt="Ko Lake Villa" />
                  </div>
                  <div className="gp-stayCard-body">
                    <div className="gp-stayCard-header">
                      <h3 className="gp-stayCard-name">Ko Lake Villa</h3>
                      <span className="gp-stayCard-rating">4.8 ★</span>
                    </div>
                    <p className="gp-stayCard-desc">
                      A chic, minimalist oasis just a short walk from Kabalana Beach.
                    </p>
                  </div>
                </article>

                <article className="gp-stayCard">
                  <div className="gp-stayCard-imageWrap">
                    <img src={GUIDE_SOLA_HOTEL_IMAGE} alt="Sola Hotel" />
                  </div>
                  <div className="gp-stayCard-body">
                    <div className="gp-stayCard-header">
                      <h3 className="gp-stayCard-name">Solar Hotel</h3>
                      <span className="gp-stayCard-rating">4.8 ★</span>
                    </div>
                    <p className="gp-stayCard-desc">
                      A chic, minimalist oasis just a short walk from Kabalana Beach.
                    </p>
                  </div>
                </article>

                <article className="gp-stayCard">
                  <div className="gp-stayCard-imageWrap">
                    <img src={GUIDE_Kelly_IMAGE} alt="Kelly Ahangama" />
                  </div>
                  <div className="gp-stayCard-body">
                    <div className="gp-stayCard-header">
                      <h3 className="gp-stayCard-name">Kelly</h3>
                      <span className="gp-stayCard-rating">4.8 ★</span>
                    </div>
                    <p className="gp-stayCard-desc">
                      A sleek, contemporary getaway featuring a vibrant evening ambience and a beautifully illuminated pool.
                    </p>
                  </div>
                </article>

                <article className="gp-stayCard">
                  <div className="gp-stayCard-imageWrap">
                    <img src={GUIDE_ANIMALS_IMAGE} alt="Animals hotel pool and courtyard" />
                  </div>
                  <div className="gp-stayCard-body">
                    <div className="gp-stayCard-header">
                      <h3 className="gp-stayCard-name">Animals</h3>
                      <span className="gp-stayCard-rating">4.8 ★</span>
                    </div>
                    <p className="gp-stayCard-desc">
                      A chic, minimalist oasis just a short walk from Kabalana Beach.
                    </p>
                  </div>
                </article>

                <article className="gp-stayCard">
                  <div className="gp-stayCard-imageWrap">
                    <img src={GUIDE_ANIMALS_IMAGE} alt="Animals hotel pool and courtyard" />
                  </div>
                  <div className="gp-stayCard-body">
                    <div className="gp-stayCard-header">
                      <h3 className="gp-stayCard-name">Animals</h3>
                      <span className="gp-stayCard-rating">4.8 ★</span>
                    </div>
                    <p className="gp-stayCard-desc">
                      A chic, minimalist oasis just a short walk from Kabalana Beach.
                    </p>
                  </div>
                </article>

                <article className="gp-stayCard">
                  <div className="gp-stayCard-imageWrap">
                    <img src={GUIDE_ANIMALS_IMAGE} alt="Animals hotel pool and courtyard" />
                  </div>
                  <div className="gp-stayCard-body">
                    <div className="gp-stayCard-header">
                      <h3 className="gp-stayCard-name">Animals</h3>
                      <span className="gp-stayCard-rating">4.8 ★</span>
                    </div>
                    <p className="gp-stayCard-desc">
                      A chic, minimalist oasis just a short walk from Kabalana Beach.
                    </p>
                  </div>
                </article>

                <article className="gp-stayCard">
                  <div className="gp-stayCard-imageWrap">
                    <img src={GUIDE_ANIMALS_IMAGE} alt="Animals hotel pool and courtyard" />
                  </div>
                  <div className="gp-stayCard-body">
                    <div className="gp-stayCard-header">
                      <h3 className="gp-stayCard-name">Animals</h3>
                      <span className="gp-stayCard-rating">4.8 ★</span>
                    </div>
                    <p className="gp-stayCard-desc">
                      A chic, minimalist oasis just a short walk from Kabalana Beach.
                    </p>
                  </div>
                </article>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </FullBleedSection>

      {GUIDE_EXTRA_STAYS.map((stay) => (
        <FullBleedSection key={stay.title}>
          <div className="gp-hero">
            <div aria-hidden="true" className="gp-hero-media">
              <div className="gp-hero-overlay" />
              <img src={stay.image || GUIDE_OVERVIEW_IMAGE} alt={stay.title} />
            </div>
            <div className="gp-hero-content">
              <h2 className="gp-serif-title-light" style={{ fontSize: "clamp(40px, 6vw, 80px)", margin: 0 }}>
                {stay.title}
              </h2>
              <p className="gp-body-light" style={{ marginTop: 24 }}>
                {stay.description}
              </p>
            </div>
            <div
              style={{
                position: "absolute",
                right: "clamp(32px, 4.8vw, 72px)",
                bottom: "clamp(28px, 4vw, 48px)",
                zIndex: 4,
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <a
                href="#"
                style={{
                  color: "#FFFFFF",
                  textDecoration: "none",
                  fontSize: "clamp(16px, 1.45vw, 19px)",
                  lineHeight: 1.72,
                  borderBottom: "1px solid rgba(255,255,255,0.65)",
                  paddingBottom: 6,
                }}
              >
                <InstagramLabel text={stay.instagramLabel} justify="flex-end" className="gp-caption" />
              </a>
              <a
                href="#"
                style={{
                  color: "#FFFFFF",
                  textDecoration: "none",
                  fontSize: "clamp(16px, 1.45vw, 19px)",
                  lineHeight: 1.72,
                }}
              >
                <DirectionLabel text="Direction" justify="flex-end" className="gp-caption" />
              </a>
            </div>
          </div>
        </FullBleedSection>
      ))}
    </SiteLayout>
  );
}
