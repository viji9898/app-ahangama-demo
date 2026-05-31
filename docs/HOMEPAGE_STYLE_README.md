# Homepage Style README

This document describes the current visual system of the site based on the homepage and its shared shell components. Treat the homepage as the source of truth for styling decisions unless a page has a deliberate editorial variant.

## Source files

- `src/pages/Home.jsx`
- `src/components/layout/FooterBar.jsx`
- `src/components/home/GettingAroundSection.jsx`
- `src/components/home/WellnessGuideSection.jsx`
- `src/components/home/PassPartnersStrip.jsx`
- `src/components/home/HeroSectionMobile.jsx`
- `src/components/layout/TopNav.jsx`
- `src/components/layout/SiteLayout.jsx`
- `src/styles/globals.css`

## Visual direction

The site uses a warm editorial travel-magazine look rather than a startup or app-dashboard style.

- Mood: calm, premium, coastal, lightly nostalgic
- Surface treatment: warm sand backgrounds, cream cards, low-contrast borders
- Contrast: soft overall, with dark ink used for hierarchy and calls to action
- Shape language: rounded cards, pill buttons, soft shadows, large hero radii
- Composition: generous whitespace, wide wrappers, strong hero typography, restrained accent colors

## Editorial north star

The current direction should feel like the back pages of a premium travel magazine, not a SaaS product, tourism portal, or dashboard.

Use these references as the mental model:

- Monocle
- Cereal Magazine
- Suitcase Magazine
- Kinfolk
- High-end independent travel publications

When designing or editing homepage sections, optimize for:

- editorial hierarchy over widget hierarchy
- serif-led feature titles rather than generic UI headings
- quiet luxury rather than loud conversion styling
- discoverability through composition and copy, not badges and hard-sell UI
- soft, premium surfaces instead of stark white cards

Do not introduce:

- corporate multi-column footer patterns
- app-dashboard filter bars unless the section genuinely needs them
- bright marketing gradients or glossy button treatments
- dense navigation blocks pretending to be editorial content

## Layout shell

The shell is defined by `SiteLayout` and the homepage wrappers.

- Main site content max width: `1180px` in `SiteLayout`
- Homepage inner wrapper: `1100px` via `.dm-wrap`
- Navbar max width: `1440px`
- Content padding in `SiteLayout`: `24px 16px 0`
- Homepage canvas: `var(--bg-sand)` with a rounded top cut using `.dm-heroCut` and `.dm-canvas`

Use these wrappers when building new homepage-like sections:

- `.dm-heroCut`
- `.dm-canvas`
- `.dm-wrap`

## Core colors

There are two overlapping token groups in `globals.css`. The homepage currently leans most heavily on the `dm` tokens plus a few direct inline values.

### Primary neutrals

- Background sand: `#f4f1ec` via `--bg-sand`
- Cream canvas: `#f6f0e6` via `--dm-cream`
- Card surface: `#fbf7ef` via `--dm-card`
- Hero panel background: `#f7f2ea`
- Main ink: `#1F1D1A` or `#201E1B`
- Secondary text: `#49443D`, `#5F574E`, `#6D655C`
- Soft border: `rgba(32,30,27,0.08)` or `var(--dm-line)`

### Accent colors

- Gold accent for eyebrow text: `#B08E62`
- Ocean blue token: `#4f6f86`
- Food accent: `#c46a3a`
- Surf accent: `#3e5f73`
- Stays accent: `#6b7c5a`
- Wellness accent: `#7a6a86`

### Shadow language

- Homepage hero shadow: `0 24px 60px rgba(47,62,58,0.08)`
- Standard warm card shadow: `0 14px 32px rgba(32,30,27,0.05)`
- Soft system shadow token: `0 14px 40px rgba(31, 42, 36, 0.08)`

## Typography

### Display serif

The homepage display face is:

`"Cormorant Garamond", "Iowan Old Style", Georgia, serif`

Use it for:

- Homepage hero headline
- Navbar wordmark
- Large editorial titles
- Footer brand treatments
- Homepage story modules like `Perfect Day in Ahangama`, `3 Days in Ahangama`, `What is the Ahangama Pass?`, and `12 Things to Do in Ahangama`

### Editorial serif fallback used in newer sections

Some of the newer homepage and footer work also uses:

`"Cormorant Garamond", "Libre Baskerville", Georgia, serif`

This is acceptable for newer editorial modules. If touching an existing section, preserve the current serif stack already used in that section rather than mixing multiple new serif recipes.

### Body / UI text

The body stack comes primarily from the app and Ant Design defaults. Visually, the site uses clean sans serif UI text for navigation, buttons, tags, supporting copy, and metadata. Avoid introducing a new default sans stack unless the whole system is being updated.

## Homepage typography scale

These are the current homepage values worth reusing.

### Hero desktop

- Eyebrow: `13px`, `700`, `letterSpacing: 2.2`, uppercase, color `#B08E62`
- H1: `clamp(62px, 7.2vw, 86px)`, line-height `0.9`, weight `500`, letter-spacing `-2.6`
- Supporting paragraph: `clamp(16px, 1.65vw, 18px)`, line-height `1.65`, max width `430px`

### Hero mobile

- Eyebrow: `12px`, `700`, `letterSpacing: 2`, uppercase
- H1: `40px`, line-height `0.95`, letter-spacing `-1.2`
- Supporting paragraph: `16px`, line-height `1.6`

### Navbar

- Brand wordmark desktop: `29px`
- Brand wordmark mobile: `20px`
- Brand wordmark letter spacing desktop: `1.8`
- Brand wordmark letter spacing mobile: `1.1`
- Nav links: `14px`, `600`, active state `700`

### Feature cards on homepage

- Card headline: Ant `Title level={2}` with custom line-height `1.08`, dark ink
- Card paragraph: `16px`, line-height `1.75`, color `#5F574E`
- Tags / pills: compact, rounded, uppercase-adjacent feel, generally `11px` to `13px`

### Editorial module typography

This is the current preferred recipe for feature modules and footer blocks.

- Eyebrow / metadata label: `11px`, `700`, `letterSpacing: 1.6`, uppercase, color `#B08E62`
- Metadata chips: `11px`, `700`, uppercase, color `#8B7B63`, with subtle cream/white background
- Major editorial title: serif, dark ink, line-height close to `1.02`
- Editorial body copy: `15px` to `16px`, line-height `1.75` to `1.8`, color `#5F574E` or `#6D655C`
- Bottom-bar or utility metadata: `12px`, restrained letter spacing, muted brown-gray

## Spacing system

The homepage uses relatively restrained but consistent spacing.

- Major section spacing in `Home.jsx`: `32px`
- Hero left column padding desktop: `clamp(52px, 7vw, 88px) clamp(28px, 4.5vw, 56px) 44px`
- Standard card body padding: `28px`
- Small UI gaps: `8px`, `10px`, `12px`, `14px`
- Medium layout gaps: `18px`, `20px`, `22px`, `24px`

When extending the homepage, start from `32px` vertical separation between major modules and `20px` to `28px` internal padding.

## Radius system

The site consistently uses rounded geometry.

- Hero outer radius: `30px`
- Large cards: `26px`
- New editorial cards / footer shell: `28px` to `36px`
- Secondary panels / media blocks: `22px`
- Editorial media blocks: `24px` to `26px`
- Large token in globals: `--dm-radius-xl: 26px`
- Medium token in globals: `--dm-radius-lg: 18px`
- Small token in globals: `--dm-radius-md: 14px`
- Pill buttons / tags: `999px`
- Primary CTA buttons: usually `16px` radius or pill-shaped depending on context

## Buttons and links

### Primary homepage buttons

Current homepage CTA styling uses:

- Height: `44px` or `54px` depending on prominence
- Padding inline: `18px` to `28px`
- Radius: `16px` or `999px`
- Primary background: `#201E1B` or `var(--dm-ink-2)`
- Border: usually matching fill or removed
- Shadow: `none`
- Weight: `600`

### Editorial CTA recipe

For the newer homepage story modules and footer:

- Height: `42px` to `48px`
- Radius: `999px`
- Background: `#2F3E3A`
- Border: `#2F3E3A`
- Text color: `#FFFFFF`
- Shadow: `none`

Use this for:

- `Read the story`
- `Read the guide`
- `Subscribe`
- `Get the Card`

If a CTA is intentionally secondary, use a light cream/white translucent button with muted brown-gray text rather than default Ant secondary styling.

### Pass logo treatment

The Ahangama Pass call to action has been standardized to the logo rather than a text button in several places.

- Hero desktop logo height: `54px`
- Hero mobile logo height: `48px`
- Navbar desktop logo height: `52px`
- Navbar mobile logo height: `44px`
- Pass holders strip logo height: `44px`

Use the logo link pattern for pass-focused CTAs where the brand should feel like a product mark rather than a generic button.

## Cards and surfaces

### Homepage feature card recipe

Used for editorial cards like `3 Days in Ahangama` and `12 Things to Do in Ahangama`.

- Radius: `26px`
- Border: `1px solid rgba(32,30,27,0.08)`
- Background: `linear-gradient(180deg, rgba(251,248,242,0.98) 0%, rgba(247,243,236,0.98) 100%)`
- Shadow: `0 14px 32px rgba(32,30,27,0.05)`
- Body padding: `28px`

### Current editorial feature recipe

This is now the preferred recipe for homepage editorial modules and the footer shell.

- Border: `1px solid rgba(32,30,27,0.08)`
- Background: `linear-gradient(180deg, rgba(244,241,236,0.98) 0%, rgba(249,245,239,0.98) 100%)`
- Shadow: `0 18px 40px rgba(32,30,27,0.05)`
- Outer radius: `30px` for major modules
- Inner media radius: `24px` to `26px`
- Padding: `30px` to `40px` depending on module scale

Use this for:

- homepage editorial story cards
- the editorial footer shell
- premium narrative CTAs that are part of content rather than utility UI

Avoid reverting new editorial sections back to the older flatter `26px / 28px` card recipe unless you are working inside an untouched older module and intentionally preserving that look.

### Footer-specific recipe

The footer is now a major editorial surface, not a standard utility footer.

- Outer background: transparent page background
- Footer shell: warm off-white `#F4F1EC`
- Outer radius: `28px` mobile, `36px` desktop
- Shadow: `0 18px 44px rgba(32,30,27,0.05)`
- Internal sections separated by subtle top borders only
- Use editorial blocks, lists, and story cards rather than columns of corporate links

The footer should feel like the final pages of a travel publication.

### Hero card recipe

- Outer radius: `30px`
- Background: `#f7f2ea`
- Shadow: `0 24px 60px rgba(47,62,58,0.08)`
- Left content panel uses a translucent cream gradient overlay
- Image side uses soft atmospheric overlays rather than hard black gradients

## Homepage imagery rules

- Imagery should feel editorial and warm, not saturated travel-brochure bright
- Use soft overlays with low-opacity black or warm neutral gradients
- Hero image blocks keep rounded corners and restrained shadow depth
- Mosaic or collage layouts are acceptable when they support an editorial story
- Avoid harsh borders or high-contrast drop shadows around images
- Video and image panels should feel like story art direction, not media widgets
- Imagery containers in editorial modules should usually be larger, softer, and more atmospheric than utility cards

## Responsive behavior

### Desktop

- Desktop hero uses a split layout with text left and imagery right
- The left column is information-heavy and can hold large typography
- Navigation stays horizontal at `xl` breakpoints

### Mobile

- Mobile hero image stacks above copy
- Hero type scales down to `40px`
- Pass CTA becomes centered logo treatment
- Metrics wrap and center below the logo
- Navbar becomes a stacked shell with condensed controls
- Editorial buttons should generally become full width when they sit alone in a mobile column
- Footer editorial blocks should stack vertically with generous spacing rather than compressing into small columns
- Discovery links can become a two-column text grid on mobile

## Homepage editorial sections to treat as the source of truth

For the current visual direction, these modules are the strongest references:

- `Perfect Day in Ahangama - Denitsa` in `src/pages/Home.jsx`
- `3 Days in Ahangama: My Wellness Stay at Samba` in `src/pages/Home.jsx`
- `What is the Ahangama Pass?` in `src/pages/Home.jsx`
- `12 Things to Do in Ahangama` in `src/pages/Home.jsx`
- `GettingAroundSection.jsx`
- `WellnessGuideSection.jsx`
- `PassPartnersStrip.jsx`
- `FooterBar.jsx`

When creating a new homepage section, copy the feel of one of these before inventing a new visual pattern.

## Styling principles to keep

- Prefer warm neutrals over pure white
- Prefer editorial serif display moments over generic sans-only layouts
- Keep shadows soft and low-contrast
- Use rounded corners generously but consistently
- Use uppercase eyebrow labels with increased letter spacing for hierarchy
- Keep buttons visually restrained; avoid glossy or overly app-like treatment
- Use inline styles for page-specific visual tuning when that is already the pattern
- Use `globals.css` tokens and shared classes for system-level consistency
- Make sections feel like pages or spreads from a magazine, not components from a UI kit
- Use metadata labels, story framing, and image composition to create hierarchy
- Keep link groups elegant and text-led rather than boxed and over-structured

## Styling principles to avoid

- Pure black and pure white pairings
- Neon accent colors
- Tight, cramped section spacing
- Sharp `4px` to `8px` corners on major homepage modules
- Generic blue primary buttons that ignore the ink-and-cream system
- Overusing purple, especially outside wellness contexts
- Introducing a new font stack without aligning the rest of the homepage
- Corporate footers with many equal-weight link columns
- Generic product-card grids when the content should read as editorial
- Over-badging, over-labeling, or using too many app-like pills in one module
- Hard conversion UX in sections that are meant to feel narrative and premium

## Suggested default recipe for new homepage-like sections

If you need to add a new section that feels native to the current homepage, start with:

- Wrapper inside `.dm-canvas > .dm-wrap`
- Top margin: `32px`
- Major card radius: `30px`
- Card padding: `30px` to `32px`
- Border: `1px solid rgba(32,30,27,0.08)`
- Background: `linear-gradient(180deg, rgba(244,241,236,0.98) 0%, rgba(249,245,239,0.98) 100%)`
- Eyebrow: `11px`, uppercase, gold-brown metadata style
- Title: serif, dark ink, line-height around `1.02`
- Supporting copy: `15px` to `16px`, line-height `1.75` to `1.8`, muted brown-gray
- CTA: dark editorial pill button or pass logo, depending on the destination
- Media block: `24px` to `26px` radius with soft overlay or warm translucent background

## Implementation note

The current system is still mostly inline-style driven. For consistency:

- reuse the exact values already established in `Home.jsx`, `FooterBar.jsx`, `GettingAroundSection.jsx`, `WellnessGuideSection.jsx`, and `PassPartnersStrip.jsx`
- prefer copying an existing editorial section and adapting content over inventing a new component recipe
- if you later centralize tokens, preserve the visual output first and refactor second

## Maintenance notes

- The homepage styling currently mixes CSS tokens in `globals.css` with substantial inline styling in `Home.jsx`
- There are overlapping token groups in `globals.css`, especially the generic tokens and the `dm` tokens
- If the design system is formalized later, the first cleanup should be consolidating color, radius, and shadow tokens into one canonical set
- Until then, reuse existing homepage values rather than inventing adjacent ones
