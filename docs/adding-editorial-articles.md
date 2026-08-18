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

## Final Checklist

- Page component exists in `src/pages/`.
- Route constant is exported from the page component.
- Route is imported and registered in `src/app/routes.jsx`.
- `Seo` metadata is present in the page.
- Static route metadata is added in `scripts/generate-route-meta-html.mjs`.
- Sitemap source route is added in `scripts/generate-seo.mjs`.
- The article is added to the start of `WEEKLY_PICKS` in `src/pages/Home.jsx` and its card is verified on the homepage.
- All remote image URLs return `200`.
- `npm run build` passes.
- Generated `public/sitemap.xml` and `public/robots.txt` churn is restored unless intentionally needed.
