# Homepage Style README

This document describes the current visual system of the site based on the homepage and its shared shell components. Treat the homepage as the source of truth for styling decisions unless a page has a deliberate editorial variant.

## Source files

- `src/pages/Home.jsx`
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
- Secondary panels / media blocks: `22px`
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

## Styling principles to keep

- Prefer warm neutrals over pure white
- Prefer editorial serif display moments over generic sans-only layouts
- Keep shadows soft and low-contrast
- Use rounded corners generously but consistently
- Use uppercase eyebrow labels with increased letter spacing for hierarchy
- Keep buttons visually restrained; avoid glossy or overly app-like treatment
- Use inline styles for page-specific visual tuning when that is already the pattern
- Use `globals.css` tokens and shared classes for system-level consistency

## Styling principles to avoid

- Pure black and pure white pairings
- Neon accent colors
- Tight, cramped section spacing
- Sharp `4px` to `8px` corners on major homepage modules
- Generic blue primary buttons that ignore the ink-and-cream system
- Overusing purple, especially outside wellness contexts
- Introducing a new font stack without aligning the rest of the homepage

## Suggested default recipe for new homepage-like sections

If you need to add a new section that feels native to the current homepage, start with:

- Wrapper inside `.dm-canvas > .dm-wrap`
- Top margin: `32px`
- Card radius: `26px`
- Card padding: `24px` to `28px`
- Border: `1px solid rgba(32,30,27,0.08)`
- Background: warm cream gradient surface
- Title: dark ink, serif only if it is a major editorial moment
- Supporting copy: `16px`, line-height `1.7` to `1.8`, muted brown-gray
- CTA: ink button or pass logo, depending on the destination

## Maintenance notes

- The homepage styling currently mixes CSS tokens in `globals.css` with substantial inline styling in `Home.jsx`
- There are overlapping token groups in `globals.css`, especially the generic tokens and the `dm` tokens
- If the design system is formalized later, the first cleanup should be consolidating color, radius, and shadow tokens into one canonical set
- Until then, reuse existing homepage values rather than inventing adjacent ones
