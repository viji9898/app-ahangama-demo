import React from "react";
import {
  COMMERCIAL_LABELS,
  GUIDE_PLACES_BY_SLUG,
  GUIDE_SECTIONS,
} from "./guideData";
import { formatCurrency } from "./guideUtils";

function getVenues(page) {
  return (page.content.venueSlugs || [])
    .map((slug) => GUIDE_PLACES_BY_SLUG.get(slug))
    .filter(Boolean);
}

function PageFurniture({ page, inverse = false }) {
  return (
    <footer className={`pg-page-furniture${inverse ? " is-inverse" : ""}`}>
      <span>AHANGAMA GUIDE · 2026/27</span>
      <span>{String(page.pageNumber).padStart(2, "0")}</span>
    </footer>
  );
}

function EditorialLabel({ page, inverse = false }) {
  return (
    <span className={`pg-editorial-label${inverse ? " is-inverse" : ""}`}>
      {GUIDE_SECTIONS[page.section]?.label || page.section}
    </span>
  );
}

function CoverPage({ page }) {
  return (
    <div className="pg-template pg-cover">
      <img src={page.content.image} alt="Ahangama coast" />
      <div className="pg-cover-shade" />
      <div className="pg-cover-copy">
        <span>Independent · Local · South Coast</span>
        <h1>{page.content.headline}</h1>
        <p>{page.content.subheadline}</p>
      </div>
      <span className="pg-cover-edition">A5 FIELD GUIDE · ISSUE 01</span>
    </div>
  );
}

function IntroductionPage({ page }) {
  return (
    <div className="pg-template pg-introduction pg-safe-area">
      <EditorialLabel page={page} />
      <h1>{page.content.headline}</h1>
      <p className="pg-standfirst">{page.content.subheadline}</p>
      <div className="pg-intro-rule" />
      <p className="pg-body-copy">{page.content.body}</p>
      <p className="pg-body-copy">
        This guide is edited for travellers who would rather know a place than
        simply pass through it. Carry it, mark it, and let it lead you off the
        main road.
      </p>
      <div className="pg-signoff">The Ahangama.com editors</div>
      <PageFurniture page={page} />
    </div>
  );
}

function ContentsPage({ page }) {
  const sections = [
    ["10", "Stay"],
    ["18", "Eat & Drink"],
    ["30", "Beaches & Surf"],
    ["36", "Experiences"],
    ["44", "Wellness"],
    ["50", "Shopping & Local"],
    ["54", "Field Notes"],
    ["58", "Maps & Essentials"],
  ];
  return (
    <div className="pg-template pg-contents pg-safe-area">
      <EditorialLabel page={page} />
      <h1>{page.content.headline}</h1>
      <div className="pg-contents-list">
        {sections.map(([number, title]) => (
          <div key={title}>
            <span>{number}</span>
            <strong>{title}</strong>
          </div>
        ))}
      </div>
      <p>{page.content.subheadline}</p>
      <PageFurniture page={page} />
    </div>
  );
}

function SectionOpener({ page }) {
  const partner = page.commercial.partner;
  return (
    <div
      className="pg-template pg-section-opener"
      style={{ "--section-color": GUIDE_SECTIONS[page.section]?.color }}
    >
      <img src={page.content.image} alt="" />
      <div className="pg-section-copy">
        <EditorialLabel page={page} inverse />
        <h1>{page.content.headline}</h1>
        <p>{page.content.subheadline}</p>
        <div className="pg-sponsor-print">
          <span>In partnership with</span>
          <strong>{partner || "Ahangama.com"}</strong>
        </div>
      </div>
      <PageFurniture page={page} inverse />
    </div>
  );
}

function EditorialFeature({ page }) {
  return (
    <div className="pg-template pg-editorial-feature pg-safe-area">
      <EditorialLabel page={page} />
      <h1>{page.content.headline}</h1>
      <p className="pg-standfirst">{page.content.subheadline}</p>
      <img src={page.content.image} alt="" />
      <div className="pg-feature-columns">
        <p>{page.content.body}</p>
        <p>
          The details matter here. Go early, ask what is good today, and leave
          enough room in the plan for an unexpected turn.
        </p>
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function VenueFeature({ page }) {
  const [venue] = getVenues(page);
  return (
    <div className="pg-template pg-venue-feature">
      <div className="pg-venue-feature-image">
        <img src={venue?.image || page.content.image} alt={venue?.name || ""} />
        <span>01 / Local address</span>
      </div>
      <div className="pg-venue-feature-copy">
        <EditorialLabel page={page} />
        <h1>{venue?.name || page.content.headline}</h1>
        <p className="pg-standfirst">{page.content.subheadline}</p>
        <p>{venue?.description || page.content.body}</p>
        <div className="pg-venue-facts">
          <span>{venue?.area || "Ahangama"}</span>
          <span>Selected by locals</span>
        </div>
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function VenueGrid({ page }) {
  const venues = getVenues(page).slice(0, 4);
  return (
    <div className="pg-template pg-venue-grid pg-safe-area">
      <EditorialLabel page={page} />
      <h1>{page.content.headline}</h1>
      <p className="pg-standfirst">{page.content.subheadline}</p>
      <div className="pg-venue-grid-items">
        {venues.map((venue, index) => (
          <article key={venue.slug}>
            <img src={venue.image} alt="" />
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{venue.name}</h2>
            <p>{venue.area || "Ahangama"}</p>
          </article>
        ))}
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function VenueList({ page }) {
  const venues = getVenues(page);
  return (
    <div className="pg-template pg-venue-list pg-safe-area">
      <EditorialLabel page={page} />
      <h1>{page.content.headline}</h1>
      <p className="pg-standfirst">{page.content.subheadline}</p>
      <div className="pg-address-list">
        {venues.map((venue, index) => (
          <article key={venue.slug}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{venue.name}</h2>
              <p>{venue.excerpt || venue.description}</p>
            </div>
            <small>{venue.area || "Ahangama"}</small>
          </article>
        ))}
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function PhotoEssay({ page }) {
  return (
    <div className="pg-template pg-photo-essay">
      <img className="pg-photo-main" src={page.content.image} alt="" />
      <img className="pg-photo-inset" src={page.content.secondaryImage} alt="" />
      <div className="pg-photo-caption">
        <EditorialLabel page={page} inverse />
        <h1>{page.content.headline}</h1>
        <p>{page.content.subheadline}</p>
      </div>
      <PageFurniture page={page} inverse />
    </div>
  );
}

function MapPage({ page }) {
  const labels = ["Ahangama", "Kabalana", "Kathaluwa", "Midigama", "Koggala"];
  return (
    <div className="pg-template pg-map pg-safe-area">
      <EditorialLabel page={page} />
      <h1>{page.content.headline}</h1>
      <p>{page.content.subheadline}</p>
      <div className="pg-map-art" aria-label="Stylised guide map">
        <div className="pg-map-coast" />
        <div className="pg-map-road" />
        {labels.map((label, index) => (
          <span key={label} style={{ left: `${13 + index * 16}%`, top: `${60 - (index % 2) * 15}%` }}>
            <i />{label}
          </span>
        ))}
      </div>
      <div className="pg-map-key">Coast road · Railway · Beaches · Guide selections</div>
      <PageFurniture page={page} />
    </div>
  );
}

function EssentialInfoPage({ page }) {
  const items = [
    ["Move", "Agree tuk-tuk fares before setting off or use a local ride app."],
    ["Pay", "Carry cash for smaller places; ATMs are clustered around town."],
    ["Connect", "Local SIMs are inexpensive and coverage is generally reliable."],
    ["Respect", "Dress modestly at temples and ask before photographing people."],
    ["Ocean", "Conditions change quickly. Swim and surf within your ability."],
  ];
  return (
    <div className="pg-template pg-essential pg-safe-area">
      <EditorialLabel page={page} />
      <h1>{page.content.headline}</h1>
      <p className="pg-standfirst">{page.content.subheadline}</p>
      <div className="pg-essential-list">
        {items.map(([title, copy], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function DirectoryPage({ page }) {
  const venues = Array.from(GUIDE_PLACES_BY_SLUG.values()).slice(0, 18);
  return (
    <div className="pg-template pg-directory pg-safe-area">
      <EditorialLabel page={page} />
      <h1>{page.content.headline}</h1>
      <div className="pg-directory-columns">
        {venues.map((venue) => (
          <div key={venue.slug}>
            <strong>{venue.name}</strong>
            <span>{venue.category} · {venue.area || "Ahangama"}</span>
          </div>
        ))}
      </div>
      <div className="pg-directory-qr">
        <div className="pg-faux-qr" aria-hidden="true" />
        <div><strong>Continue online</strong><span>ahangama.com</span></div>
      </div>
      <PageFurniture page={page} />
    </div>
  );
}

function FullPageAd({ page }) {
  const partner = page.commercial.partner || "Your story in Ahangama";
  return (
    <div className="pg-template pg-full-ad">
      <img src={page.content.image} alt="" />
      <div className="pg-full-ad-copy">
        <span>Guide partner</span>
        <h1>{partner}</h1>
        <p>{page.content.subheadline}</p>
      </div>
      <PageFurniture page={page} inverse />
    </div>
  );
}

function PartialPageAd({ page }) {
  const isQuarter = page.commercial.type === "quarterPage";
  return (
    <div className={`pg-template pg-partial-page${isQuarter ? " is-quarter" : ""}`}>
      <div className="pg-partial-editorial pg-safe-area">
        <EditorialLabel page={page} />
        <h1>{page.content.headline}</h1>
        <p>{page.content.subheadline}</p>
        <p className="pg-body-copy">{page.content.body}</p>
      </div>
      <div className="pg-partial-ad-print">
        <img src={page.content.image} alt="" />
        <div><span>In partnership with</span><strong>{page.commercial.partner || "Ahangama.com"}</strong></div>
      </div>
      <PageFurniture page={page} inverse />
    </div>
  );
}

const TEMPLATE_COMPONENTS = {
  CoverPage,
  InsideCoverAd: FullPageAd,
  ContentsPage,
  IntroductionPage,
  SectionOpener,
  EditorialFeature,
  VenueFeature,
  VenueGrid,
  VenueList,
  PhotoEssay,
  MapPage,
  EssentialInfoPage,
  DirectoryPage,
  FullPageAd,
  HalfPageEditorialAd: PartialPageAd,
  QuarterPageEditorialAd: PartialPageAd,
  SponsoredSection: SectionOpener,
  BackCoverAd: FullPageAd,
};

function ManagementOverlay({ page }) {
  if (!page.commercial.enabled) return null;
  const type = page.commercial.type;
  const partialClass =
    type === "halfPage"
      ? " is-half"
      : type === "quarterPage"
        ? " is-quarter"
        : " is-full";

  return (
    <div className={`pg-commercial-overlay${partialClass}`}>
      <span>Commercial</span>
      <strong>{COMMERCIAL_LABELS[type]}</strong>
      <b>{formatCurrency(page.commercial.rate)}</b>
      <em className={`is-${page.commercial.status}`}>
        {page.commercial.status}
      </em>
      <small>Page {page.pageNumber} · {GUIDE_SECTIONS[page.section]?.label}</small>
    </div>
  );
}

export default function GuidePage({
  page,
  managementMode = false,
  thumbnail = false,
  onEdit,
}) {
  const Template = TEMPLATE_COMPONENTS[page.template] || EditorialFeature;

  return (
    <div
      className={`pg-page-shell${thumbnail ? " is-thumbnail" : ""}${managementMode ? " has-management" : ""}`}
      style={{ "--page-section-color": GUIDE_SECTIONS[page.section]?.color }}
    >
      <div className="pg-print-canvas">
        <Template page={page} />
      </div>
      {managementMode ? (
        <div className="pg-management-layer">
          <div className="pg-page-meta">
            <span>P{String(page.pageNumber).padStart(2, "0")}</span>
            <span>{page.template}</span>
          </div>
          <ManagementOverlay page={page} />
          {!thumbnail && onEdit ? (
            <button type="button" className="pg-edit-page" onClick={() => onEdit(page)}>
              Edit page
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}