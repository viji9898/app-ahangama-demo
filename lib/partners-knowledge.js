function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeJsonForScript(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

function compactList(values) {
  return Array.isArray(values)
    ? values.filter((value) => value !== null && value !== undefined && value !== "")
    : [];
}

function toIsoString(value) {
  if (!value) return null;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function toPublicPartnerUrl(baseUrl, venue) {
  const category = String(venue.category || "").trim().toLowerCase();
  const slug = String(venue.slug || "").trim();

  if (!baseUrl || !category || !slug) {
    return null;
  }

  return `${baseUrl}/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`;
}

function formatBoolean(value) {
  return value ? "Yes" : "No";
}

function formatList(values) {
  const items = compactList(values);
  return items.length ? items.join(", ") : "—";
}

function formatScalar(value) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function renderDefinitionRow(label, value) {
  return `<div class="field"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`;
}

export function buildPartnersKnowledgeRecords(venues, { baseUrl = "" } = {}) {
  return venues.map((venue) => ({
    id: venue.id,
    name: venue.name,
    slug: venue.slug,
    destinationSlug: venue.destinationSlug,
    publicUrl: toPublicPartnerUrl(baseUrl, venue),
    category: venue.category,
    categories: compactList(venue.categories),
    area: venue.area,
    description: venue.description || venue.excerpt || "",
    excerpt: venue.excerpt || "",
    offer: venue.offer,
    offers: compactList(venue.offers),
    cardPerk: venue.cardPerk,
    howToClaim: venue.howToClaim,
    restrictions: venue.restrictions,
    bestFor: compactList(venue.bestFor),
    tags: compactList(venue.tags),
    editorialTags: compactList(venue.editorialTags),
    status: venue.status,
    live: Boolean(venue.live),
    isPassVenue: Boolean(venue.isPassVenue),
    staffPick: Boolean(venue.staffPick),
    isFeatured: Boolean(venue.isFeatured),
    priorityScore: venue.priorityScore,
    passPriority: venue.passPriority,
    stars: venue.stars,
    reviews: venue.reviews,
    discount: venue.discount,
    price: venue.price,
    hours: venue.hours,
    lat: venue.lat,
    lng: venue.lng,
    mapUrl: venue.mapUrl,
    googlePlaceId: venue.googlePlaceId,
    image: venue.image,
    logo: venue.logo,
    ogImage: venue.ogImage,
    instagram: venue.instagram,
    instagramUrl: venue.instagramUrl,
    whatsapp: venue.whatsapp,
    email: venue.email,
    source: venue.source,
    lastVerifiedAt: toIsoString(venue.lastVerifiedAt),
    updatedAt: toIsoString(venue.updatedAt),
    createdAt: toIsoString(venue.createdAt),
  }));
}

export function renderPartnersKnowledgeHtml({
  title,
  description,
  canonicalUrl,
  jsonUrl,
  generatedAt,
  destinationSlug,
  query,
  category,
  records,
}) {
  const itemList = records
    .map(
      (record, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: record.name,
        url: record.publicUrl || canonicalUrl,
      }),
    );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: canonicalUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: records.length,
      itemListElement: itemList,
    },
  };

  const summaryRows = [
    ["Destination", destinationSlug],
    ["Category filter", category || "All"],
    ["Search query", query || "None"],
    ["Partner count", String(records.length)],
    ["Generated at", generatedAt],
    ["JSON export", jsonUrl],
  ];

  const partnerMarkup = records
    .map((record) => {
      const fields = [
        renderDefinitionRow("Partner ID", formatScalar(record.id)),
        renderDefinitionRow("Name", formatScalar(record.name)),
        renderDefinitionRow("Slug", formatScalar(record.slug)),
        renderDefinitionRow("Public URL", formatScalar(record.publicUrl)),
        renderDefinitionRow("Destination", formatScalar(record.destinationSlug)),
        renderDefinitionRow("Primary category", formatScalar(record.category)),
        renderDefinitionRow("All categories", formatList(record.categories)),
        renderDefinitionRow("Area", formatScalar(record.area)),
        renderDefinitionRow("Status", formatScalar(record.status)),
        renderDefinitionRow("Live", formatBoolean(record.live)),
        renderDefinitionRow("Pass venue", formatBoolean(record.isPassVenue)),
        renderDefinitionRow("Featured", formatBoolean(record.isFeatured)),
        renderDefinitionRow("Staff pick", formatBoolean(record.staffPick)),
        renderDefinitionRow("Priority score", formatScalar(record.priorityScore)),
        renderDefinitionRow("Pass priority", formatScalar(record.passPriority)),
        renderDefinitionRow("Stars", formatScalar(record.stars)),
        renderDefinitionRow("Reviews", formatScalar(record.reviews)),
        renderDefinitionRow("Discount", formatScalar(record.discount)),
        renderDefinitionRow("Excerpt", formatScalar(record.excerpt)),
        renderDefinitionRow("Description", formatScalar(record.description)),
        renderDefinitionRow("Primary offer", formatScalar(record.offer)),
        renderDefinitionRow("All offers", formatList(record.offers)),
        renderDefinitionRow("Card perk", formatScalar(record.cardPerk)),
        renderDefinitionRow("How to claim", formatScalar(record.howToClaim)),
        renderDefinitionRow("Restrictions", formatScalar(record.restrictions)),
        renderDefinitionRow("Best for", formatList(record.bestFor)),
        renderDefinitionRow("Tags", formatList(record.tags)),
        renderDefinitionRow("Editorial tags", formatList(record.editorialTags)),
        renderDefinitionRow("Price", formatScalar(record.price)),
        renderDefinitionRow("Hours", formatScalar(record.hours)),
        renderDefinitionRow("Latitude", formatScalar(record.lat)),
        renderDefinitionRow("Longitude", formatScalar(record.lng)),
        renderDefinitionRow("Map URL", formatScalar(record.mapUrl)),
        renderDefinitionRow("Google Place ID", formatScalar(record.googlePlaceId)),
        renderDefinitionRow("Image", formatScalar(record.image)),
        renderDefinitionRow("Logo", formatScalar(record.logo)),
        renderDefinitionRow("Open Graph image", formatScalar(record.ogImage)),
        renderDefinitionRow("Instagram handle", formatScalar(record.instagram)),
        renderDefinitionRow("Instagram URL", formatScalar(record.instagramUrl)),
        renderDefinitionRow("WhatsApp", formatScalar(record.whatsapp)),
        renderDefinitionRow("Email", formatScalar(record.email)),
        renderDefinitionRow("Source", formatScalar(record.source)),
        renderDefinitionRow("Last verified at", formatScalar(record.lastVerifiedAt)),
        renderDefinitionRow("Updated at", formatScalar(record.updatedAt)),
        renderDefinitionRow("Created at", formatScalar(record.createdAt)),
      ].join("");

      return `
        <article id="partner-${escapeHtml(record.slug || String(record.id))}" class="partner">
          <header>
            <p class="eyebrow">Partner ${escapeHtml(String(record.id))}</p>
            <h2>${escapeHtml(record.name)}</h2>
            <p class="lede">${escapeHtml(record.excerpt || record.description || "No summary available.")}</p>
          </header>
          <dl>${fields}</dl>
        </article>
      `;
    })
    .join("\n");

  const toc = records
    .map(
      (record) =>
        `<li><a href="#partner-${escapeHtml(record.slug || String(record.id))}">${escapeHtml(record.name)}</a></li>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index,follow" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta name="twitter:card" content="summary" />
    <script type="application/ld+json">${escapeJsonForScript(jsonLd)}</script>
    <script id="partners-knowledge-json" type="application/json">${escapeJsonForScript(records)}</script>
    <style>
      :root {
        color-scheme: light;
        --bg: #fbf8f1;
        --panel: #fffdf8;
        --ink: #1d1d1b;
        --muted: #665f55;
        --line: #d8d0c2;
        --accent: #0c6d62;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Georgia, "Times New Roman", serif;
        background: linear-gradient(180deg, #f6f1e6 0%, var(--bg) 100%);
        color: var(--ink);
        line-height: 1.55;
      }
      main {
        width: min(1100px, calc(100% - 32px));
        margin: 0 auto;
        padding: 32px 0 64px;
      }
      h1, h2 { line-height: 1.15; margin: 0; }
      p { margin: 0; }
      a { color: var(--accent); }
      .hero, .panel, .partner {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 18px;
        box-shadow: 0 10px 30px rgba(29, 29, 27, 0.05);
      }
      .hero {
        padding: 28px;
        margin-bottom: 20px;
      }
      .hero p + p { margin-top: 10px; }
      .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 12px;
        color: var(--muted);
        margin-bottom: 10px;
      }
      .summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
        margin: 20px 0;
      }
      .panel {
        padding: 16px;
      }
      .panel strong {
        display: block;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--muted);
        margin-bottom: 6px;
      }
      .toc {
        margin: 0 0 24px;
        padding: 20px 24px;
      }
      .toc ul {
        margin: 12px 0 0;
        columns: 2;
        padding-left: 18px;
      }
      .partners {
        display: grid;
        gap: 18px;
      }
      .partner {
        padding: 24px;
      }
      .partner .lede {
        margin-top: 10px;
        color: var(--muted);
      }
      dl {
        display: grid;
        gap: 10px;
        margin: 20px 0 0;
      }
      .field {
        display: grid;
        grid-template-columns: minmax(180px, 240px) 1fr;
        gap: 12px;
        padding-top: 10px;
        border-top: 1px solid var(--line);
      }
      dt {
        font-weight: 700;
      }
      dd {
        margin: 0;
        color: var(--muted);
        white-space: pre-wrap;
        word-break: break-word;
      }
      @media (max-width: 720px) {
        .toc ul { columns: 1; }
        .field { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <p class="eyebrow">Ahangama partner knowledge base</p>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(description)}</p>
      </section>

      <section class="summary">
        ${summaryRows
          .map(
            ([label, value]) =>
              `<div class="panel"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span></div>`,
          )
          .join("")}
      </section>

      <section class="panel toc">
        <strong>Jump to partner</strong>
        <ul>${toc}</ul>
      </section>

      <section class="partners">
        ${partnerMarkup}
      </section>
    </main>
  </body>
</html>`;
}