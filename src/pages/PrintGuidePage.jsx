import React, { useEffect, useMemo, useState } from "react";
import { Drawer, Input, InputNumber, Select, Switch } from "antd";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import GuidePage from "../features/print-guide/GuidePage";
import {
  COMMERCIAL_LABELS,
  GUIDE_RATE_CARD,
  GUIDE_SECTIONS,
  INITIAL_GUIDE_PAGES,
} from "../features/print-guide/guideData";
import {
  calculateGuideMetrics,
  clampPageNumber,
  formatCurrency,
  getCommercialInventory,
  getSpreadStart,
} from "../features/print-guide/guideUtils";
import "../styles/print-guide.css";

export const PRINT_GUIDE_PATH = "/print-guide";

const PRINT_GUIDE_META = {
  title: "Ahangama Guide 2026/27 | 68-Page South Coast Guide",
  description:
    "Preview the 68-page Ahangama Guide 2026/27, locally edited for the best places to stay, eat, surf, shop and explore on Sri Lanka's south coast.",
  image:
    "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Hero-AhanagamaGuide-SriLanka.webp",
};

const VIEW_OPTIONS = [
  ["spread", "Spread"],
  ["overview", "All pages"],
  ["commercial", "Commercial"],
];

const PAGE_FORMATS = Object.freeze({
  A4: { label: "A4", width: 210, height: 297, viewScale: 1.18 },
  A5: { label: "A5", width: 148, height: 210, viewScale: 1 },
  B5: { label: "B5", width: 176, height: 250, viewScale: 1.08 },
});

const TEMPLATE_OPTIONS = [
  "CoverPage",
  "InsideCoverAd",
  "ContentsPage",
  "HowToUsePage",
  "AreaGlancePage",
  "EssentialMapSpreadPage",
  "ItineraryPage",
  "TownStoryPage",
  "AhangamaEditPage",
  "PeopleSpreadPage",
  "OpeningPartnerPage",
  "StayOpenerPage",
  "StayCollectionPage",
  "StayFinderPage",
  "StayNeighbourhoodPage",
  "StayStoryPage",
  "EatDrinkOpenerPage",
  "EatDrinkRecommendationsPage",
  "FoodCulturePage",
  "SurfOpenerPage",
  "BeachComparisonPage",
  "BeachesWeLovePage",
  "SurfAhangamaPage",
  "SurfServicesPage",
  "DawnPatrolPage",
  "ExperienceOpenerPage",
  "ThingsToDoPage",
  "BeyondBeachPage",
  "HalfDayTripsPage",
  "WholeDayPage",
  "ExperienceYourWayPage",
  "InlandFeaturePage",
  "WellnessOpenerPage",
  "WellnessVenuesPage",
  "WellnessExperiencesPage",
  "ShopLocalOpenerPage",
  "ShopRecommendationsPage",
  "TakeHomePage",
  "BornAhangamaOpenerPage",
  "BornCategoryPage",
  "BornBrandsPage",
  "RainyDayPage",
  "WhatsOnPage",
  "UsefulAhangamaPage",
  "GettingAroundPage",
  "KnowBeforeYouGoPage",
  "AhangamaDirectoryPage",
  "IntroductionPage",
  "SectionOpener",
  "EditorialFeature",
  "VenueFeature",
  "VenueGrid",
  "VenueList",
  "PhotoEssay",
  "MapPage",
  "EssentialInfoPage",
  "DirectoryPage",
  "FullPageAd",
  "HalfPageEditorialAd",
  "QuarterPageEditorialAd",
  "SponsoredSection",
  "BackCoverAd",
];

function useMobilePageView() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth < 760,
  );

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 760);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return isMobile;
}

function GuideDashboard({ metrics, pageFormat }) {
  const items = [
    ["Pages", metrics.pageCount],
    ["Editorial", metrics.editorialPages],
    ["Commercial", metrics.commercialPages],
    ["Other", metrics.otherPages],
    ["Available", metrics.availableCount],
    ["Reserved", metrics.reservedCount],
    ["Sold", metrics.soldCount],
  ];

  return (
    <section className="pg-dashboard" aria-label="Guide dashboard">
      <div className="pg-dashboard-title">
        <span>Ahangama Guide</span>
        <strong>2026/27</strong>
        <em>
          {pageFormat.label} · {pageFormat.width} × {pageFormat.height} mm
        </em>
      </div>
      <div className="pg-dashboard-counts">
        {items.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="pg-dashboard-revenue">
        <div>
          <span>Potential revenue</span>
          <strong>{formatCurrency(metrics.potentialRevenue)}</strong>
        </div>
        <div>
          <span>Sold revenue</span>
          <strong>{formatCurrency(metrics.soldRevenue)}</strong>
        </div>
        <div className="pg-utilisation">
          <span>Commercial utilisation</span>
          <strong>{metrics.commercialPercentage.toFixed(1)}%</strong>
          <i>
            <b style={{ width: `${metrics.commercialPercentage}%` }} />
          </i>
        </div>
      </div>
    </section>
  );
}

function GuideToolbar({
  view,
  onViewChange,
  pageFormatKey,
  onPageFormatChange,
  managementMode,
  onManagementChange,
  zoom,
  onZoomChange,
}) {
  return (
    <nav className="pg-toolbar" aria-label="Guide workspace controls">
      <div className="pg-toolbar-selectors">
        <div className="pg-view-switcher" aria-label="Guide view">
          {VIEW_OPTIONS.map(([value, label]) => (
            <button
              type="button"
              className={view === value ? "is-active" : ""}
              key={value}
              onClick={() => onViewChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="pg-format-switcher" aria-label="Page size">
          <span>Page size</span>
          {Object.entries(PAGE_FORMATS).map(([key, format]) => (
            <button
              type="button"
              className={pageFormatKey === key ? "is-active" : ""}
              key={key}
              title={`${format.label} · ${format.width} × ${format.height} mm`}
              onClick={() => onPageFormatChange(key)}
            >
              {format.label}
            </button>
          ))}
        </div>
      </div>
      <div className="pg-toolbar-actions">
        <span className="pg-zoom-controls">
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => onZoomChange(Math.max(0.65, zoom - 0.1))}
          >
            −
          </button>
          <b>{Math.round(zoom * 100)}%</b>
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => onZoomChange(Math.min(1.4, zoom + 0.1))}
          >
            +
          </button>
          <button type="button" onClick={() => onZoomChange(1)}>
            Fit
          </button>
        </span>
        <label className="pg-management-toggle">
          <span>Management overlays</span>
          <Switch
            size="small"
            checked={managementMode}
            onChange={onManagementChange}
          />
        </label>
      </div>
    </nav>
  );
}

function SpreadView({
  pages,
  currentPage,
  onPageChange,
  zoom,
  managementMode,
  onEdit,
  isMobile,
}) {
  const spreadStart = isMobile
    ? currentPage
    : getSpreadStart(currentPage, pages.length);
  const visiblePages = isMobile
    ? [pages[currentPage - 1]]
    : pages.slice(spreadStart - 1, spreadStart + 1);
  const step = isMobile ? 1 : 2;
  const lastVisible = visiblePages.at(-1)?.pageNumber || spreadStart;

  return (
    <section className="pg-spread-view">
      <div className="pg-spread-stage" style={{ "--guide-zoom": zoom }}>
        <div className="pg-spread-pages">
          {visiblePages.map((page) => (
            <GuidePage
              key={page.pageNumber}
              page={page}
              managementMode={managementMode}
              onEdit={onEdit}
            />
          ))}
        </div>
      </div>
      <div className="pg-page-navigation">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, spreadStart - step))}
        >
          <span aria-hidden="true">←</span> Previous
        </button>
        <label>
          <span>
            {isMobile
              ? `Page ${currentPage}`
              : `Pages ${spreadStart}–${lastVisible}`}
          </span>
          <input
            aria-label="Jump to page"
            type="number"
            min="1"
            max={pages.length}
            value={currentPage}
            onChange={(event) =>
              onPageChange(clampPageNumber(event.target.value, pages.length))
            }
          />
        </label>
        <button
          type="button"
          disabled={lastVisible >= pages.length}
          onClick={() =>
            onPageChange(Math.min(pages.length, spreadStart + step))
          }
        >
          Next <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}

function GuideOverview({ pages, managementMode, onOpenPage }) {
  return (
    <section className="pg-overview">
      <header>
        <span>Publication flatplan</span>
        <h1>All {pages.length} pages</h1>
        <p>
          Review pacing, section rhythm and commercial distribution at a glance.
        </p>
      </header>
      <div className="pg-thumbnail-grid">
        {pages.map((page) => (
          <button
            type="button"
            className={`pg-thumbnail is-${page.commercial.status}`}
            key={page.pageNumber}
            onClick={() => onOpenPage(page.pageNumber)}
          >
            <GuidePage page={page} managementMode={managementMode} thumbnail />
            <span className="pg-thumbnail-caption">
              <b>{String(page.pageNumber).padStart(2, "0")}</b>
              <span>{GUIDE_SECTIONS[page.section]?.label}</span>
              {page.commercial.enabled ? <i>{page.commercial.status}</i> : null}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function CommercialInventory({ pages, metrics, onOpenPage }) {
  const inventory = getCommercialInventory(pages);
  const summary = [
    ["Total inventory value", metrics.potentialRevenue],
    ["Sold revenue", metrics.soldRevenue],
    ["Reserved revenue", metrics.reservedRevenue],
    ["Available value", metrics.availableRevenue],
  ];

  return (
    <section className="pg-inventory">
      <header>
        <div>
          <span>Revenue workspace</span>
          <h1>Commercial inventory</h1>
        </div>
        <p>
          {metrics.inventoryCount} positions ·{" "}
          {metrics.commercialPageEquivalent.toFixed(2)} full-page equivalents
        </p>
      </header>
      <div className="pg-inventory-summary">
        {summary.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{formatCurrency(value)}</strong>
          </div>
        ))}
      </div>
      <div className="pg-inventory-table-wrap">
        <table className="pg-inventory-table">
          <thead>
            <tr>
              <th>Page</th>
              <th>Section</th>
              <th>Position</th>
              <th>Rate</th>
              <th>Status</th>
              <th>Partner</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((position) => (
              <tr
                key={position.pageNumber}
                onClick={() => onOpenPage(position.pageNumber)}
              >
                <td>{String(position.pageNumber).padStart(2, "0")}</td>
                <td>{position.section}</td>
                <td>{position.position}</td>
                <td>{formatCurrency(position.rate)}</td>
                <td>
                  <span className={`pg-status is-${position.status}`}>
                    {position.status}
                  </span>
                </td>
                <td>{position.partner || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PageEditor({ page, open, onClose, onChange }) {
  if (!page) return null;
  const update = (path, value) => onChange(page.pageNumber, path, value);
  const commercialTypes = Object.keys(COMMERCIAL_LABELS);

  return (
    <Drawer
      className="pg-editor-drawer"
      title={`Edit page ${String(page.pageNumber).padStart(2, "0")}`}
      size={440}
      open={open}
      onClose={onClose}
    >
      <div className="pg-editor-form">
        <div className="pg-editor-grid">
          <label>
            <span>Page number</span>
            <InputNumber
              min={1}
              max={INITIAL_GUIDE_PAGES.length}
              value={page.pageNumber}
              onChange={(value) => update("pageNumber", value)}
            />
          </label>
          <label>
            <span>Section</span>
            <Select
              value={page.section}
              options={Object.entries(GUIDE_SECTIONS).map(([value, item]) => ({
                value,
                label: item.label,
              }))}
              onChange={(value) => update("section", value)}
            />
          </label>
        </div>
        <label>
          <span>Page type</span>
          <Input
            value={page.pageType}
            onChange={(event) => update("pageType", event.target.value)}
          />
        </label>
        <label>
          <span>Template</span>
          <Select
            value={page.template}
            options={TEMPLATE_OPTIONS.map((value) => ({ value, label: value }))}
            onChange={(value) => update("template", value)}
          />
        </label>
        <hr />
        <label>
          <span>Headline</span>
          <Input
            value={page.content.headline}
            onChange={(event) => update("content.headline", event.target.value)}
          />
        </label>
        <label>
          <span>Subheadline</span>
          <Input.TextArea
            rows={2}
            value={page.content.subheadline}
            onChange={(event) =>
              update("content.subheadline", event.target.value)
            }
          />
        </label>
        <label>
          <span>Body</span>
          <Input.TextArea
            rows={5}
            value={page.content.body}
            onChange={(event) => update("content.body", event.target.value)}
          />
        </label>
        <label>
          <span>Image URL</span>
          <Input
            value={page.content.image}
            onChange={(event) => update("content.image", event.target.value)}
          />
        </label>
        <hr />
        <label className="pg-editor-switch">
          <span>Commercial enabled</span>
          <Switch
            checked={page.commercial.enabled}
            onChange={(value) => update("commercial.enabled", value)}
          />
        </label>
        <label>
          <span>Commercial type</span>
          <Select
            value={page.commercial.type}
            options={commercialTypes.map((value) => ({
              value,
              label: COMMERCIAL_LABELS[value],
            }))}
            onChange={(value) => {
              update("commercial.type", value);
              update("commercial.rate", GUIDE_RATE_CARD[value]);
            }}
          />
        </label>
        <div className="pg-editor-grid">
          <label>
            <span>Rate</span>
            <InputNumber
              min={0}
              prefix="$"
              value={page.commercial.rate}
              onChange={(value) => update("commercial.rate", value)}
            />
          </label>
          <label>
            <span>Status</span>
            <Select
              value={page.commercial.status}
              options={[
                "available",
                "reserved",
                "sold",
                "editorial",
                "house",
              ].map((value) => ({ value, label: value }))}
              onChange={(value) => update("commercial.status", value)}
            />
          </label>
        </div>
        <label>
          <span>Partner</span>
          <Input
            value={page.commercial.partner || ""}
            onChange={(event) =>
              update("commercial.partner", event.target.value || null)
            }
          />
        </label>
        <label>
          <span>Internal notes</span>
          <Input.TextArea
            rows={3}
            value={page.commercial.internalNotes}
            onChange={(event) =>
              update("commercial.internalNotes", event.target.value)
            }
          />
        </label>
      </div>
    </Drawer>
  );
}

export default function PrintGuidePage() {
  const [pages, setPages] = useState(INITIAL_GUIDE_PAGES);
  const [view, setView] = useState("spread");
  const [pageFormatKey, setPageFormatKey] = useState("A5");
  const [currentPage, setCurrentPage] = useState(1);
  const [managementMode, setManagementMode] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [editingPageNumber, setEditingPageNumber] = useState(null);
  const isMobile = useMobilePageView();
  const metrics = useMemo(() => calculateGuideMetrics(pages), [pages]);
  const pageFormat = PAGE_FORMATS[pageFormatKey];
  const editingPage = pages.find(
    (page) => page.pageNumber === editingPageNumber,
  );

  const openPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    setView("spread");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updatePage = (pageNumber, path, value) => {
    const keys = path.split(".");
    setPages((current) =>
      current.map((page) => {
        if (page.pageNumber !== pageNumber) return page;
        if (keys.length === 1) return { ...page, [keys[0]]: value };
        return {
          ...page,
          [keys[0]]: { ...page[keys[0]], [keys[1]]: value },
        };
      }),
    );
    if (path === "pageNumber") setEditingPageNumber(value);
  };

  return (
    <main
      className="pg-workspace"
      style={{
        "--page-width-mm": pageFormat.width,
        "--page-height-mm": pageFormat.height,
        "--page-print-width": `${pageFormat.width}mm`,
        "--page-print-height": `${pageFormat.height}mm`,
        "--page-view-scale": pageFormat.viewScale,
      }}
    >
      <Seo
        title={PRINT_GUIDE_META.title}
        description={PRINT_GUIDE_META.description}
        canonical={absUrl(PRINT_GUIDE_PATH)}
        ogImage={PRINT_GUIDE_META.image}
        ogImageWidth={1960}
        ogImageHeight={1100}
        author="Ahangama Guide Editorial Team"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: PRINT_GUIDE_META.title,
          description: PRINT_GUIDE_META.description,
          image: PRINT_GUIDE_META.image,
          url: absUrl(PRINT_GUIDE_PATH),
          creator: {
            "@type": "Organization",
            name: "Ahangama.com",
            url: "https://ahangama.com",
          },
        }}
        noindex
      />
      <header className="pg-workspace-header">
        <GuideDashboard metrics={metrics} pageFormat={pageFormat} />
        <GuideToolbar
          view={view}
          onViewChange={setView}
          pageFormatKey={pageFormatKey}
          onPageFormatChange={setPageFormatKey}
          managementMode={managementMode}
          onManagementChange={setManagementMode}
          zoom={zoom}
          onZoomChange={setZoom}
        />
      </header>

      {view === "spread" ? (
        <SpreadView
          pages={pages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          zoom={zoom}
          managementMode={managementMode}
          onEdit={(page) => setEditingPageNumber(page.pageNumber)}
          isMobile={isMobile}
        />
      ) : null}
      {view === "overview" ? (
        <GuideOverview
          pages={pages}
          managementMode={managementMode}
          onOpenPage={openPage}
        />
      ) : null}
      {view === "commercial" ? (
        <CommercialInventory
          pages={pages}
          metrics={metrics}
          onOpenPage={openPage}
        />
      ) : null}

      <PageEditor
        page={editingPage}
        open={Boolean(editingPage)}
        onClose={() => setEditingPageNumber(null)}
        onChange={updatePage}
      />
    </main>
  );
}
