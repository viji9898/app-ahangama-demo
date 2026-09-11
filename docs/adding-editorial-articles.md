# Adding Editorial Articles

Use `src/pages/StaffPickExperienceAhangamaPage.jsx` as the prototype for new editorial article pages.

Prototype route:

`/staff-pick-experience-a-day-that-slowly-erases-your-plan-in-ahangama`

## What To Create

Each article should have one dedicated page component in `src/pages/`.

Recommended naming pattern:

```text
src/pages/ArticleTitlePage.jsx
```

Recommended route constant pattern:

```jsx
export const ARTICLE_TITLE_PATH = "/article-title-slug";
```

The page should usually include:

- `SiteLayout navOverlayHero`
- `Seo` with article metadata
- A full-bleed hero using `home-hero-image` / `home-hero-titleLine` classes
- Intro paragraphs in `articleIntroduction`
- Body sections in `articleSections`
- Optional pull quote on a section
- Editorial image grids using local helper components
- A `Places Mentioned` section when venues are named
- `EditorialNextArticle` at the bottom

## Page Structure

Start from the staff-pick article shape:

```jsx
import React from "react";
import { Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Paragraph, Text, Title } = Typography;

export const ARTICLE_PATH = "/your-article-slug";

const HERO_IMAGE = "https://...";
const publishDate = "2026-06-30T09:00:00.000Z";

const articleIntroduction = ["Opening paragraph.", "Second paragraph."];

const articleSections = [
  {
    title: "Section Title",
    body: ["Paragraph one.", "Paragraph two."],
    quote: "Optional pull quote.",
  },
];

export default function ArticlePage() {
  const canonical = absUrl(ARTICLE_PATH);

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Article Title"
        description="Short article description."
        canonical={canonical}
        ogImage={HERO_IMAGE}
        ogType="article"
        author="Ahangama Guide Editorial Team"
        publishDate={publishDate}
      />
      {/* Hero, article body, places mentioned, next article */}
    </SiteLayout>
  );
}
```

Keep article copy in arrays near the top of the file. This makes long editorial pages easier to review and keeps JSX focused on layout.

## Images

For S3-hosted article images, use a base URL constant and derive each image from it:

```jsx
const BASE_IMAGE_URL =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/article-slug";

const HERO_IMAGE = `${BASE_IMAGE_URL}/Hero+image.webp`;
const FEATURE_IMAGE = `${BASE_IMAGE_URL}/Feature+Image.webp`;
```

Use descriptive `alt` text for every image.

### Temporary Placeholder Images

When final photography is not ready, use `https://placehold.co/` with dimensions
that match the intended image slot. Put the width and height directly in the URL:

```text
https://placehold.co/{width}x{height}
```

Use these standard editorial placeholders:

```jsx
const HERO_IMAGE = "https://placehold.co/1600x900";
const LANDSCAPE_IMAGE = "https://placehold.co/1200x800";
const PORTRAIT_IMAGE = "https://placehold.co/800x1000";
```

- Use `1600x900` for a full-bleed hero.
- Use `1200x800` for a desktop `3 / 2` editorial image.
- Use `800x1000` for a `4 / 5` portrait image.
- Add a label when several placeholders need to be distinguishable, for example
  `https://placehold.co/800x1000?text=Portrait+1`. Use `+` for spaces in the
  label.
- Do not use one placeholder size for every slot. The URL dimensions should
  represent the source image that will eventually replace it.
- Keep the hero URL identical in the page `Seo`, `EDITORIAL_ARTICLES`, static
  route metadata and `WEEKLY_PICKS`.
- Replace all placeholder URLs with final image URLs before publication.

### Responsive Image Arrangement

Desktop and mobile use different editorial image arrangements:

- Landscape images display at `3 / 2` on desktop and switch to a centered
  `4 / 5` portrait frame at `640px` and below.
- Portrait pairs display side by side in two equal columns on desktop.
- On mobile, portrait pairs stack into one column and appear one after the
  other in source order.
- Keep `objectFit: "cover"` so each image fills its stable frame without
  changing the page layout.

Give the image wrappers page-scoped class names so the mobile rules can
override their inline desktop geometry:

```jsx
function EditorialImage({ src, alt }) {
  return (
    <div
      className="article-landscape-image"
      style={{
        width: "100%",
        aspectRatio: "3 / 2",
        overflow: "hidden",
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}

function PortraitPair({ images }) {
  return (
    <div
      className="article-portrait-pair"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 24,
      }}
    >
      {images.map((image) => (
        <PortraitImage key={image.src} {...image} />
      ))}
    </div>
  );
}
```

Add the responsive rules to the relevant stylesheet. Use a page-specific
prefix instead of the generic `article-` prefix when the styles should apply to
only one article:

```css
@media (max-width: 640px) {
  .article-landscape-image {
    width: min(100%, 680px) !important;
    aspect-ratio: 4 / 5 !important;
  }

  .article-portrait-pair {
    grid-template-columns: minmax(0, 1fr) !important;
  }
}
```

Preferred layout helpers from the prototype:

```jsx
function PortraitImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        display: "block",
        width: "100%",
        aspectRatio: "4 / 5",
        objectFit: "cover",
        boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
      }}
    />
  );
}

function ImageGrid({ children, columns = 2 }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: 24,
        margin: "0 auto 28px",
        width: "100%",
        maxWidth: 1224,
      }}
    >
      {children}
    </div>
  );
}
```

## Places Mentioned

When the article mentions venues, add linked venue names in the body and a `Places Mentioned` section near the end.

Use the staff-pick article as the reference:

- `MENTIONED_PLACE_LINKS` controls inline venue links in article paragraphs.
- `FEATURED_VENUES` controls the end-of-article venue list and editorial notes.
- `renderVenueLinkedText(paragraph)` is applied wherever article copy renders.

Keep the end section styled like `/12-things`: compact heading, muted links, arrow icon, and short editorial notes.

Example entry:

```jsx
const FEATURED_VENUES = [
  {
    label: "Kaffi Ahangama",
    href: "https://www.instagram.com/kaffi.ahangama/?hl=en",
    note: "The soft start: coffee, coast air and the first loose decision of the day.",
  },
];
```

## Wire The Route

Update `src/app/routes.jsx`.

Add the import:

```jsx
import ArticlePage, { ARTICLE_PATH } from "../pages/ArticlePage";
```

Add the route near the other editorial routes:

```jsx
{
  path: ARTICLE_PATH,
  element: <ArticlePage />,
},
```

## Add To The Articles Index

Every new editorial article must be added to `src/data/editorialArticles.js`.
This registry powers the complete public index at `/articles`; do not maintain a
second article list inside the page component.

Add the newest article at the beginning of `EDITORIAL_ARTICLES`:

```js
{
  category: "Editorial",
  title: "Article Title",
  href: "/your-article-slug",
  description: "Short article description.",
  image: "https://customer-apps-techhq.s3.../Hero+image.webp",
  publishDate: "2026-06-30T09:00:00.000Z",
},
```

Use the same route, title, description, image and publish date as the article's
`Seo` component and static route metadata. Keep the array ordered newest first.
After adding it, verify the card image loads, the category filter includes it,
and the card opens the correct article route.

## Add Static Route Metadata

Update `scripts/generate-route-meta-html.mjs` so the built route gets correct title, description, canonical, Open Graph tags, Twitter tags, and article schema.

Add a `routeMeta` entry:

```js
{
  route: "/your-article-slug",
  title: "Article Title",
  description: "Short article description.",
  publishDate: "2026-06-30T09:00:00.000Z",
  author: "Ahangama Guide Editorial Team",
  image: "https://customer-apps-techhq.s3.../Hero+image.webp",
},
```

Use the same title, description, date, author, and hero image as the page `Seo` component.

## Add Sitemap Source

Update `scripts/generate-seo.mjs`.

Add the route to `publicRoutes`:

```js
{
  path: "/your-article-slug",
  changefreq: "monthly",
  priority: "0.7",
},
```

Do not manually edit `public/sitemap.xml` unless the generated file itself is intentionally part of the change. The build regenerates it.

## Add To Homepage Weekly Picks

Update the `WEEKLY_PICKS` array in `src/pages/Home.jsx` so the new article appears in the homepage `2. Weekly Picks` rail.

Add the newest article at the start of the array:

```jsx
const WEEKLY_PICKS = [
  {
    category: "Editorial",
    title: "Article Title",
    date: "This Week",
    href: "/your-article-slug",
    image: "https://customer-apps-techhq.s3.../Hero+image.webp",
  },
  // Existing weekly picks...
];
```

Use the article route and hero image exactly as registered elsewhere. Choose a concise category that matches the story, such as `Editorial`, `Cafe Story`, `Community`, `Shop Guide`, or `Staff Pick`.

After updating the array, verify that the card displays its background image and opens the new article. The Weekly Picks rail repeats its source list to create the continuous carousel, so seeing multiple copies in the rendered DOM is expected.

## Add Article Analytics

Every editorial article must use the shared anonymous GA4 article analytics. Do not
send names, email addresses, booking details, pass IDs, or other personally
identifiable information. Identified guest interactions belong in the separate
email/pass tracking flow, not these browser events.

Define stable analytics metadata near the article constants:

```jsx
const CONTENT_ID = "your-article-slug";
const CONTENT_TITLE = "Article Title";
const ARTICLE_CATEGORY = "editorial";
const AUTHOR_NAME = "Ahangama Guide Editorial Team";
```

`CONTENT_ID` must equal the route without the leading slash. Keep
`ARTICLE_CATEGORY` lowercase and snake-cased so reports do not split one category
across several spellings.

Attach `useArticleEngagement` to a ref around the article body. Exclude the hero
and next-article card so they do not inflate reading progress:

```jsx
const articleBodyRef = useRef(null);

useArticleEngagement({
  articleRef: articleBodyRef,
  contentId: CONTENT_ID,
  contentTitle: CONTENT_TITLE,
  articleCategory: ARTICLE_CATEGORY,
  authorName: AUTHOR_NAME,
});

return <div ref={articleBodyRef}>{/* Article body */}</div>;
```

The hook emits:

- `article_view` once when the article renders.
- `article_progress` once at 25%, 50%, and 75% body depth.
- `article_engaged_read` after 15 active seconds and at least 25% depth.
- `article_complete` after 30 active seconds and at least 90% depth.

Active reading time pauses when the page is hidden or the browser is not focused.
Do not replace these qualification rules with bare scroll or timer events.

Give every body section a durable lowercase kebab-case `id`, such as
`what-people-take-home`. Use `useTrackedImpression` with 50% visibility for one
continuous second and emit `article_section_view` through `trackArticleEvent`.
De-duplicate section IDs with one `useRef(new Set())` per article render.

All external links in article copy and `Places Mentioned` must emit
`article_outbound_click` before navigation with:

- `content_id`, `content_title`, `article_category`, and `author_name`
- `article_section` and `component_location`
- `destination_url`
- `link_type`, such as `instagram`, `map`, or `external`

Pass an `onClick` handler to `EditorialNextArticle` that emits
`article_next_select`. Include `target_content_id` for the destination article
and use `component_location: "article_footer"`.

The shared `TrackedArticleLink` component already measures qualified
`article_card_impression` and `article_select` events on `/articles` and in
homepage Weekly Picks. Adding a complete article entry to both registries is
therefore sufficient. The homepage carousel de-duplicates repeated copies by
content ID and placement.

GA4 should register these event-scoped custom dimensions:

- `content_id`
- `content_title`
- `article_category`
- `author_name`
- `component_location`
- `article_section`
- `progress_percent`
- `target_content_id`
- `link_type`

Register `active_read_seconds` as an event-scoped custom metric. Useful report
rates are engaged reads divided by views, completions divided by engaged reads,
article selections divided by card impressions, outbound clicks divided by
engaged reads, and next-article selections divided by completions.

## Validate

Run:

```sh
npm run build
```

Expected signs:

- Vite build completes.
- `meta:routes` reports one more generated route when adding a new article.
- `seo:gen` reports one more URL when adding the route to sitemap generation.

After building, clean generated churn if the final diff should only include source files:

```sh
git restore public/sitemap.xml public/robots.txt
```

Check final status:

```sh
git --no-pager status --short --branch
git --no-pager diff --stat
```

Optional image check for remote images:

```sh
node --input-type=module -e 'const urls = ["https://example.com/image.webp"]; for (const url of urls) { const response = await fetch(url, { method: "HEAD" }); console.log(`${url.split("/").pop()} ${response.status} ${response.headers.get("content-type") || ""}`); }'
```

Validate analytics in GA4 DebugView or temporarily capture `window.gtag` calls
in the browser. Confirm each event fires once per intended interaction, progress
milestones do not repeat, hidden-tab time is excluded, and card impressions
require 50% visibility for one second. Also confirm the initial route produces
one `page_view`; `index.html` disables the automatic config page view because
`AnalyticsTracker` owns initial and SPA route views.

## Final Checklist

- Page component exists in `src/pages/`.
- Route constant is exported from the page component.
- Route is imported and registered in `src/app/routes.jsx`.
- Article is added to `EDITORIAL_ARTICLES` in `src/data/editorialArticles.js`.
- Article appears and opens correctly from `/articles`.
- `Seo` metadata is present in the page.
- Static route metadata is added in `scripts/generate-route-meta-html.mjs`.
- Sitemap source route is added in `scripts/generate-seo.mjs`.
- The article is added to the start of `WEEKLY_PICKS` in `src/pages/Home.jsx` and its card is verified on the homepage.
- Stable article analytics metadata and body ref are configured.
- Every article section has a durable ID and a qualified `article_section_view`.
- Outbound and next-article links emit the required events without PII.
- `/articles` and homepage cards emit one qualified impression per placement and a selection event.
- Reading milestones, qualified engagement, completion, and the single route `page_view` are verified.
- Landscape images render at `3 / 2` on desktop and `4 / 5` on mobile.
- Portrait pairs sit side by side on desktop and stack in source order on mobile.
- Placeholder URLs use dimensions appropriate to each slot and are replaced before publication.
- All remote image URLs return `200`.
- `npm run build` passes.
- Generated `public/sitemap.xml` and `public/robots.txt` churn is restored unless intentionally needed.
