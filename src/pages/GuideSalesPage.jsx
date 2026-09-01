import React, { useDeferredValue, useState } from "react";
import {
  InstagramOutlined,
  MailOutlined,
  SearchOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { Input, Select } from "antd";
import { Seo } from "../app/seo";
import { usePlaces } from "../app/placesContext";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import {
  GUIDE_PLACES_BY_SLUG,
  GUIDE_SECTIONS,
  INITIAL_GUIDE_PAGES,
} from "../features/print-guide/guideData";
import { GUIDE_EDIT_PLACES } from "../features/print-guide/openingGuideData";
import "../styles/guide-sales.css";

export const GUIDE_SALES_PATH = "/guide-sales";

const GUIDE_SECTION_KEYS = new Set([
  "stay",
  "eat-drink",
  "surf",
  "experiences",
  "wellness",
  "shopping",
  "born",
  "essentials",
]);

const EDITORIAL_ALIASES = {
  abrazo: "abrazo-ahangama",
  marshmellow: "marshmellow-surf-cafe",
  "the kip": "the-kip-stay",
};

const API_SLUG_ALIASES = {
  "surf club midigama": "surf-club",
  "white lotus spa": "white-lotus-spa-wellness",
};

const venuesByName = new Map(
  [...GUIDE_PLACES_BY_SLUG.values()].map((venue) => [
    venue.name.toLowerCase(),
    venue,
  ]),
);

function normalizeInstagram(value) {
  if (!value) return null;
  const handle = String(value)
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/[/?#].*$/, "");
  return handle || null;
}

function normalizeVenueName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function mergeApiVenues(guideRows, apiVenues) {
  const apiBySlug = new Map(
    apiVenues.map((venue) => [String(venue.slug).toLowerCase(), venue]),
  );
  const apiByName = new Map(
    apiVenues.map((venue) => [normalizeVenueName(venue.name), venue]),
  );

  return guideRows.map((guideRow) => {
    const normalizedName = normalizeVenueName(guideRow.name);
    const apiVenue =
      apiBySlug.get(String(guideRow.slug || "").toLowerCase()) ||
      apiBySlug.get(API_SLUG_ALIASES[normalizedName]) ||
      apiByName.get(normalizedName);

    return {
      ...guideRow,
      ...apiVenue,
      key: guideRow.key,
      name: apiVenue?.name || guideRow.name,
      area: apiVenue?.area || null,
      instagram: apiVenue?.instagram || null,
      email: apiVenue?.email || null,
      whatsApp: apiVenue?.whatsApp || apiVenue?.whatsapp || null,
      guideSections: guideRow.guideSections,
    };
  });
}

function buildGuideSalesRows() {
  const rowsByKey = new Map();

  INITIAL_GUIDE_PAGES.filter(
    (page) =>
      GUIDE_SECTION_KEYS.has(page.section) &&
      page.pageType !== "section-opener" &&
      !page.commercial.enabled,
  ).forEach((page) => {
    page.content.venueSlugs?.forEach((slug) => {
      const venue = GUIDE_PLACES_BY_SLUG.get(slug);
      if (!venue) return;
      const current = rowsByKey.get(slug);
      const section = GUIDE_SECTIONS[page.section]?.label || page.section;

      rowsByKey.set(slug, {
        ...venue,
        key: slug,
        guideSections: [
          ...new Set([...(current?.guideSections || []), section]),
        ],
      });
    });
  });

  GUIDE_EDIT_PLACES.forEach(([name]) => {
    const normalizedName = name.toLowerCase();
    const venue =
      GUIDE_PLACES_BY_SLUG.get(EDITORIAL_ALIASES[normalizedName]) ||
      venuesByName.get(normalizedName);
    const key = venue?.slug || `editorial-${normalizedName}`;
    const current = rowsByKey.get(key);

    rowsByKey.set(key, {
      ...venue,
      key,
      name: venue?.name || name,
      guideSections: [
        ...new Set([...(current?.guideSections || []), "20 Places We Love"]),
      ],
    });
  });

  return [...rowsByKey.values()].sort((first, second) =>
    first.name.localeCompare(second.name),
  );
}

const GUIDE_SALES_ROWS = buildGuideSalesRows();
const SECTION_OPTIONS = [
  { value: "all", label: "All guide sections" },
  ...[...new Set(GUIDE_SALES_ROWS.flatMap((row) => row.guideSections))]
    .sort()
    .map((section) => ({ value: section, label: section })),
];

function ContactLink({ href, icon, children }) {
  if (!href) return <span className="guideSales-empty">Not available</span>;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {icon}
      <span>{children}</span>
    </a>
  );
}

export default function GuideSalesPage() {
  const { places: apiVenues, loading, error } = usePlaces();
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("all");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const apiRows = mergeApiVenues(GUIDE_SALES_ROWS, apiVenues);
  const rows = apiRows.filter((row) => {
    const matchesSection =
      section === "all" || row.guideSections.includes(section);
    const searchText = [
      row.name,
      row.instagram,
      row.email,
      row.whatsApp,
      ...row.guideSections,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return matchesSection && searchText.includes(deferredQuery);
  });
  const contactableCount = apiRows.filter(
    (row) => row.instagram || row.email || row.whatsApp,
  ).length;

  return (
    <SiteLayout showFooter={false}>
      <Seo
        title="Guide Sales Venue Contacts"
        description="Internal sales contact directory for venues included in the Ahangama print guide."
        canonical={absUrl(GUIDE_SALES_PATH)}
        noindex
      />
      <main className="guideSales-page">
        <header className="guideSales-header">
          <div>
            <span>Ahangama Guide · Sales workspace</span>
            <h1>Venue contacts</h1>
            <p>
              Contact details associated with venues included in the online
              print guide.
            </p>
          </div>
          <dl>
            <div>
              <dt>Venues</dt>
              <dd>{GUIDE_SALES_ROWS.length}</dd>
            </div>
            <div>
              <dt>With contact data</dt>
              <dd>{loading ? "—" : contactableCount}</dd>
            </div>
          </dl>
        </header>

        <section className="guideSales-tools" aria-label="Table filters">
          <Input
            allowClear
            aria-label="Search venue or contact"
            prefix={<SearchOutlined />}
            placeholder="Search venue or contact"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Select
            aria-label="Filter by guide section"
            options={SECTION_OPTIONS}
            value={section}
            onChange={setSection}
          />
          <span aria-live="polite">{rows.length} results</span>
        </section>

        {loading ? (
          <div className="guideSales-status" role="status">
            Loading venue contacts from the API…
          </div>
        ) : error ? (
          <div
            className="guideSales-status guideSales-status--error"
            role="alert"
          >
            Unable to load venue contacts from the API: {error.message}
          </div>
        ) : (
          <div className="guideSales-tableWrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Venue</th>
                  <th scope="col">Guide section</th>
                  <th scope="col">Instagram</th>
                  <th scope="col">Email</th>
                  <th scope="col">WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const instagram = normalizeInstagram(row.instagram);
                  const whatsApp = row.whatsApp
                    ? String(row.whatsApp).replace(/\D/g, "")
                    : null;
                  return (
                    <tr key={row.key}>
                      <th scope="row">
                        <strong>{row.name}</strong>
                        <small>{row.area || "Ahangama"}</small>
                      </th>
                      <td>{row.guideSections.join(" · ")}</td>
                      <td>
                        <ContactLink
                          href={
                            instagram
                              ? `https://www.instagram.com/${instagram}/`
                              : null
                          }
                          icon={<InstagramOutlined />}
                        >
                          @{instagram}
                        </ContactLink>
                      </td>
                      <td>
                        <ContactLink
                          href={row.email ? `mailto:${row.email}` : null}
                          icon={<MailOutlined />}
                        >
                          {row.email}
                        </ContactLink>
                      </td>
                      <td>
                        <ContactLink
                          href={whatsApp ? `https://wa.me/${whatsApp}` : null}
                          icon={<WhatsAppOutlined />}
                        >
                          +{whatsApp}
                        </ContactLink>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </SiteLayout>
  );
}
