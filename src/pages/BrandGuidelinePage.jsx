import React from "react";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import { GUIDE_SECTIONS } from "../features/print-guide/guideData";
import "../styles/brand-guideline.css";

export const BRAND_GUIDELINE_PATH = "/brand-guideline";

const GUIDE_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Hero-AhanagamaGuide-SriLanka.webp";

const CORE_COLORS = [
  ["Ink", "#171714", "Primary text and deep backgrounds"],
  ["Paper", "#F7F4ED", "Primary print ground"],
  ["Soft paper", "#F0EEE7", "Digital sections and panels"],
  ["Guide red", "#A64838", "Links, markers and key actions"],
  ["Quiet grey", "#64665E", "Secondary text and captions"],
];

const PRINCIPLES = [
  ["Local, not generic", "Lead with specific places, people and useful detail."],
  ["Editorial, not glossy", "Use restraint, honest imagery and confident white space."],
  ["Warm, not rustic", "Natural colour and texture should still feel precise and current."],
  ["Useful, not crowded", "Every label, rule and image should help someone navigate."],
];

const TYPE_SCALE = [
  ["Display", "64–126 px", "0.82–0.96", "Hero and chapter statements"],
  ["Section title", "40–72 px", "0.95–1.02", "Major editorial sections"],
  ["Card title", "22–30 px", "1.0–1.1", "Places and recommendations"],
  ["Body", "15–18 px", "1.55–1.75", "Reading copy"],
  ["Label", "9–11 px", "1.0–1.2", "Navigation, kickers and metadata"],
];

const sectionColors = Object.entries(GUIDE_SECTIONS).filter(
  ([key]) => !["opening", "closing"].includes(key),
);

function SectionHeading({ number, eyebrow, title, children }) {
  return (
    <header className="bg-sectionHeading">
      <span>{number}</span>
      <div>
        <small>{eyebrow}</small>
        <h2>{title}</h2>
        {children ? <p>{children}</p> : null}
      </div>
    </header>
  );
}

function ColorSwatch({ name, value, use }) {
  return (
    <article className="bg-swatch">
      <div style={{ background: value }} aria-hidden="true" />
      <strong>{name}</strong>
      <code>{value}</code>
      <p>{use}</p>
    </article>
  );
}

export default function BrandGuidelinePage() {
  return (
    <SiteLayout showNav={false} showFooter={false}>
      <Seo
        title="Ahangama Brand Guideline"
        description="The shared visual and editorial system for the Ahangama print guide and digital guide."
        canonical={absUrl(BRAND_GUIDELINE_PATH)}
        ogImage={GUIDE_IMAGE}
        noindex
      />

      <main className="bg-guide">
        <header className="bg-hero" id="brand-top">
          <img src={GUIDE_IMAGE} alt="Ahangama coastline and everyday life" />
          <div className="bg-heroShade" aria-hidden="true" />
          <div className="bg-heroCopy">
            <span>Brand guideline · 2026/27</span>
            <h1>Ahangama</h1>
            <p>One visual language for the guide, in print and online.</p>
          </div>
          <small>Internal reference · Version 1.0</small>
        </header>

        <nav className="bg-nav" aria-label="Brand guideline sections">
          <a href="#foundations">Foundations</a>
          <a href="#colour">Colour</a>
          <a href="#type">Typography</a>
          <a href="#layout">Layout</a>
          <a href="#imagery">Imagery</a>
          <a href="#application">Application</a>
        </nav>

        <section className="bg-intro" id="foundations">
          <p className="bg-introLead">
            Ahangama should feel <em>observed, selected and lived in</em>. The
            identity pairs a literary serif with a practical sans serif, warm
            paper tones with coastal chapter colours, and generous editorial
            layouts with concise local intelligence.
          </p>
          <div className="bg-principles">
            {PRINCIPLES.map(([title, copy], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-section" id="colour">
          <SectionHeading number="01" eyebrow="Visual foundation" title="Colour">
            Warm neutrals do most of the work. Red signals action; chapter
            colours organise content and should never become decoration.
          </SectionHeading>
          <div className="bg-swatches">
            {CORE_COLORS.map(([name, value, use]) => (
              <ColorSwatch key={name} name={name} value={value} use={use} />
            ))}
          </div>
          <div className="bg-chapterPalette">
            <div>
              <small>Chapter system</small>
              <h3>One colour per subject</h3>
              <p>
                Use each accent for section labels, numbers, map markers and
                fine rules. Keep body text in ink or quiet grey.
              </p>
            </div>
            <div className="bg-chapterColors">
              {sectionColors.map(([key, section]) => (
                <div key={key} style={{ "--swatch": section.color }}>
                  <span aria-hidden="true" />
                  <strong>{section.label}</strong>
                  <code>{section.color.toUpperCase()}</code>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-section bg-typeSection" id="type">
          <SectionHeading number="02" eyebrow="Voice in type" title="Typography">
            The contrast is the system: Iowan Old Style brings character;
            Avenir Next brings clarity. Do not introduce a third typeface.
          </SectionHeading>
          <div className="bg-typeSpecimens">
            <article className="bg-serifSpecimen">
              <span>Primary serif · Iowan Old Style</span>
              <p>The south coast, selected slowly.</p>
              <small>Headlines, pull quotes, place names and editorial moments.</small>
            </article>
            <article className="bg-sansSpecimen">
              <span>Primary sans · Avenir Next</span>
              <p>STAY · EAT &amp; DRINK · SURF · WELLNESS</p>
              <small>Body copy, navigation, metadata, captions and utility.</small>
            </article>
          </div>
          <div className="bg-typeScale" aria-label="Recommended type scale">
            {TYPE_SCALE.map(([role, size, leading, use]) => (
              <div key={role}>
                <strong>{role}</strong>
                <span>{size}</span>
                <span>Leading {leading}</span>
                <p>{use}</p>
              </div>
            ))}
          </div>
          <div className="bg-rulePair">
            <article>
              <span>Do</span>
              <p>Use sentence case for headlines and calm, compact uppercase for labels.</p>
            </article>
            <article>
              <span>Avoid</span>
              <p>Do not use all-caps display headlines, condensed fonts or decorative scripts.</p>
            </article>
          </div>
        </section>

        <section className="bg-section" id="layout">
          <SectionHeading number="03" eyebrow="Editorial rhythm" title="Layout">
            Build pages with strong hierarchy, visible margins and a limited
            number of alignments. Let important images and titles breathe.
          </SectionHeading>
          <div className="bg-layoutDemo">
            <div className="bg-layoutPage">
              <span>06 · Wellness</span>
              <h3>Room to reset.</h3>
              <p>Ancient practice, modern movement and a slower coastal rhythm.</p>
              <div className="bg-layoutRule" />
              <small>Ahangama Guide · 2026/27</small>
            </div>
            <div className="bg-layoutNotes">
              <article><b>01</b><p>Use an 8% outer margin as the baseline for print pages.</p></article>
              <article><b>02</b><p>Anchor compositions to a simple two- or four-column grid.</p></article>
              <article><b>03</b><p>Use thin rules to separate information, not boxed panels.</p></article>
              <article><b>04</b><p>Prefer asymmetry with a clear reading order over centred layouts.</p></article>
            </div>
          </div>
        </section>

        <section className="bg-section bg-imageSection" id="imagery">
          <SectionHeading number="04" eyebrow="A sense of place" title="Imagery">
            Show the actual place, person, food or experience. Images should
            feel naturally lit, specific and close enough to be useful.
          </SectionHeading>
          <div className="bg-imageFeature">
            <img src={GUIDE_IMAGE} alt="Coastal life in Ahangama" loading="lazy" />
            <div>
              <small>Image direction</small>
              <h3>Present, warm, unforced.</h3>
              <p>
                Favour documentary moments, tactile details and wide scenes
                that establish location. Keep colour natural and shadows open.
              </p>
            </div>
          </div>
          <div className="bg-imageRules">
            <article><strong>Choose</strong><p>People in context, real venues, local details, movement and weather.</p></article>
            <article><strong>Crop</strong><p>Protect the subject and leave intentional clear space for overlaid copy.</p></article>
            <article><strong>Avoid</strong><p>Generic stock scenes, heavy presets, blurred atmosphere and staged luxury.</p></article>
          </div>
        </section>

        <section className="bg-section" id="application">
          <SectionHeading number="05" eyebrow="Before publishing" title="Application">
            Print and digital share the same identity, but each medium keeps
            the controls and constraints its audience needs.
          </SectionHeading>
          <div className="bg-applicationGrid">
            <article>
              <span>Print</span>
              <h3>Designed to keep</h3>
              <ul>
                <li>Use warm paper as the default page ground.</li>
                <li>Keep text comfortably inside trim and binding margins.</li>
                <li>Use chapter colour consistently across a complete section.</li>
                <li>Check small labels and fine rules at final physical size.</li>
              </ul>
              <a href="/print-guide">View print guide</a>
            </article>
            <article>
              <span>Digital</span>
              <h3>Designed to explore</h3>
              <ul>
                <li>Keep body copy readable and navigation predictably placed.</li>
                <li>Use full-bleed chapter images as moments of orientation.</li>
                <li>Preserve the serif/sans hierarchy at every breakpoint.</li>
                <li>Meet contrast, focus, alt text and touch-target requirements.</li>
              </ul>
              <a href="/print-guide-online">View online guide</a>
            </article>
          </div>
        </section>

        <footer className="bg-footer">
          <span>Ahangama · Brand guideline</span>
          <a href="#brand-top">Back to top</a>
        </footer>
      </main>
    </SiteLayout>
  );
}