import React from "react";
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import "../styles/midigama-development.css";

export const MIDIGAMA_DEVELOPMENT_PATH = "/midigama";

const HERO_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/the_stables.jpeg";
const SITE_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=5.9666389%2C80.3913333";

const marketSignals = [
  {
    value: "200 m",
    label: "Mapped walk to Midigama Beach",
    note: "Google route estimate; verify the exact gate-to-beach walk on site.",
  },
  {
    value: "6.5",
    label: "Perches advertised",
    note: "The stated 8.07 × 20 m dimensions calculate to about 6.38 perches.",
  },
  {
    value: "20+",
    label: "Plots in the subdivision",
    note: "A demand signal, but also a future privacy, drainage and supply risk.",
  },
  {
    value: "2 keys",
    label: "Recommended product",
    note: "A private two-bedroom villa for four guests, not a mini hotel.",
  },
];

const competitorSet = [
  {
    name: "The Stables",
    type: "Quiet Midigama stay",
    proof: "4.7 rating · 62 reviews",
    lesson: "Breakfast and a low-key stay proposition create useful everyday value.",
  },
  {
    name: "Fi Midigama",
    type: "Surf-town rooms",
    proof: "4.9 rating · 60 reviews",
    lesson: "Accommodation paired with recovery and massage fits the surf audience.",
  },
  {
    name: "Cozy Cocos",
    type: "Stay and café",
    proof: "4.4 rating · 249 reviews",
    lesson: "A social food component generates visibility, but is not practical on this plot.",
  },
  {
    name: "Ebb & Flow Jungalows",
    type: "Private-pool retreat",
    proof: "4.6 rating · 41 reviews",
    lesson: "Design, privacy and a pool support a more premium Midigama position.",
  },
];

const dueDiligence = [
  "Licensed survey confirming area, boundaries and the 8.07 m frontage",
  "Written planning opinion covering setbacks, height, site coverage and parking",
  "Approved subdivision plan and clear legal title for the individual lot",
  "Registered access rights and confirmed road width for guests and construction",
  "Engineered stormwater plan for the full 20-plot subdivision",
  "Flood observations after heavy rain and a site-level elevation survey",
  "Water source, electricity capacity, wastewater and septic design",
  "Morning, evening and overnight road and railway noise readings",
];

function SectionHeading({ eyebrow, title, copy }) {
  return (
    <header className="md-sectionHeading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {copy ? <p>{copy}</p> : null}
    </header>
  );
}

export default function MidigamaDevelopmentPage() {
  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Midigama Two-Bedroom Villa | Market & Development Study"
        description="A preliminary market study and development proposal for a compact two-bedroom pool villa on a 6.5-perch plot near Midigama Beach."
        canonical={absUrl(MIDIGAMA_DEVELOPMENT_PATH)}
        ogImage={HERO_IMAGE}
      />

      <main className="md-page">
        <section className="md-hero">
          <img src={HERO_IMAGE} alt="Tropical villa setting in Midigama" />
          <div className="md-heroShade" />
          <div className="md-heroContent">
            <div className="md-kicker">Pre-feasibility study · October 2026</div>
            <h1>A small plot with a clear point of view.</h1>
            <p>
              A two-bedroom private-pool villa designed around Midigama's surf
              rhythm, walkable beach access and growing short-stay market.
            </p>
            <a href={SITE_MAP_URL} target="_blank" rel="noreferrer">
              <EnvironmentOutlined /> View the proposed site
            </a>
          </div>
        </section>

        <section className="md-verdict">
          <div>
            <span className="md-label">Preliminary verdict</span>
            <h2>Proceed to test-fit and due diligence.</h2>
          </div>
          <p>
            The location and guest proposition are credible. The narrow frontage,
            shared subdivision infrastructure and unknown planning envelope are
            the constraints that must determine the land decision.
          </p>
        </section>

        <section className="md-section">
          <SectionHeading
            eyebrow="01 · Site reading"
            title="What we know today"
            copy="These are observable or supplied facts, not a valuation. Every dimension and access claim should be reconciled against the deed and survey."
          />
          <div className="md-signalGrid">
            {marketSignals.map((signal) => (
              <article key={signal.label} className="md-signal">
                <strong>{signal.value}</strong>
                <h3>{signal.label}</h3>
                <p>{signal.note}</p>
              </article>
            ))}
          </div>
          <div className="md-plotDiagram" aria-label="Indicative 8.07 by 20 metre plot diagram">
            <div className="md-plotRoad">Access road / arrival</div>
            <div className="md-plotShell">
              <span className="md-width">8.07 m frontage</span>
              <div className="md-parking">Arrival court</div>
              <div className="md-building">Two-storey villa footprint</div>
              <div className="md-pool">Plunge pool</div>
              <div className="md-garden">Private tropical edge</div>
              <span className="md-length">20 m depth</span>
            </div>
          </div>
          <p className="md-caption">
            Illustrative massing only. Setbacks, septic placement, parking and
            site coverage have not been confirmed by an architect or authority.
          </p>
        </section>

        <section className="md-section md-sectionDark">
          <SectionHeading
            eyebrow="02 · Market"
            title="The demand is surf-led, but the product should not be basic."
            copy="Midigama is identified in the Ahangama Guide as a surf-first neighbouring community. Existing stays show demand across hostel, guesthouse and private-pool formats."
          />
          <div className="md-audienceGrid">
            <article>
              <span>Primary guest</span>
              <h3>Two couples or a small surf group</h3>
              <p>Four guests who value privacy, board storage, outdoor showers and an easy beach routine.</p>
            </article>
            <article>
              <span>Secondary guest</span>
              <h3>Small families and slow travellers</h3>
              <p>Guests choosing a self-contained base between Weligama and Ahangama for five to fourteen nights.</p>
            </article>
            <article>
              <span>Positioning gap</span>
              <h3>Compact design-led privacy</h3>
              <p>More private and resolved than a guesthouse, more attainable and efficient than a large staffed villa.</p>
            </article>
          </div>
          <div className="md-competitors">
            {competitorSet.map((competitor, index) => (
              <article key={competitor.name}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{competitor.name}</h3>
                  <p>{competitor.type}</p>
                </div>
                <strong>{competitor.proof}</strong>
                <p>{competitor.lesson}</p>
              </article>
            ))}
          </div>
          <p className="md-sourceNote">
            Ratings and review counts are a snapshot from the project's existing
            place dataset, not a complete accommodation census. Occupancy, ADR and
            room inventory still require direct market research.
          </p>
        </section>

        <section className="md-section">
          <SectionHeading
            eyebrow="03 · Development brief"
            title="Build one excellent villa, not too much building."
            copy="The 8.07 m frontage rewards vertical planning, controlled views and efficient circulation. The commercial advantage should come from design and privacy rather than room count."
          />
          <div className="md-programme">
            <div className="md-programmeLead">
              <span>Recommended concept</span>
              <h3>The Midigama Courtyard House</h3>
              <p>
                A compact two-storey villa with two equal ensuite bedrooms, a
                shaded living pavilion and a narrow plunge pool protected from
                neighbouring plots by planting and textured walls.
              </p>
            </div>
            <div className="md-floor">
              <span>Ground floor</span>
              <ul>
                <li>One-car arrival court and concealed service area</li>
                <li>Open kitchen, dining and living room</li>
                <li>Covered terrace facing a 2.5–3 m wide plunge pool</li>
                <li>Outdoor shower, board rack and lockable owner storage</li>
              </ul>
            </div>
            <div className="md-floor">
              <span>Upper floor</span>
              <ul>
                <li>Two similarly sized ensuite bedrooms</li>
                <li>Acoustic glazing and solid walls toward noise sources</li>
                <li>Filtered garden outlooks instead of exposed balconies</li>
                <li>Natural cross-ventilation with efficient air conditioning</li>
              </ul>
            </div>
          </div>
          <div className="md-designRules">
            <h3>Non-negotiable design rules</h3>
            <div>
              <p><CheckCircleOutlined /> Preserve one genuinely private outdoor room.</p>
              <p><CheckCircleOutlined /> Give both bedrooms equal guest value.</p>
              <p><CheckCircleOutlined /> Design drainage before landscape styling.</p>
              <p><CheckCircleOutlined /> Separate guest, owner and housekeeping storage.</p>
              <p><CheckCircleOutlined /> Treat railway and road noise architecturally.</p>
              <p><CheckCircleOutlined /> Keep operations simple enough for one local team.</p>
            </div>
          </div>
        </section>

        <section className="md-section md-economics">
          <SectionHeading
            eyebrow="04 · Investment case"
            title="Underwrite three scenarios before fixing the specification."
            copy="No responsible return estimate can be made yet without the land price, local build quotations, operating model and verified comparable revenue."
          />
          <div className="md-scenarioGrid">
            <article>
              <span>Downside</span>
              <h3>Seasonal demand, price pressure</h3>
              <p>Use conservative occupancy, include a full low-season closure or discount period, and assume higher maintenance.</p>
            </article>
            <article className="md-scenarioPrimary">
              <span>Base case</span>
              <h3>Well-reviewed private villa</h3>
              <p>Model a differentiated two-bedroom product with professional distribution and disciplined operating costs.</p>
            </article>
            <article>
              <span>Upside</span>
              <h3>Design premium achieved</h3>
              <p>Only credit a rate premium after testing the concept against comparable private-pool villas and operators.</p>
            </article>
          </div>
          <div className="md-formula">
            <span>Required model</span>
            <strong>Annual room revenue = nightly rate × 365 × occupancy</strong>
            <p>Then deduct channel fees, management, housekeeping, utilities, maintenance, insurance, taxes and a replacement reserve.</p>
          </div>
        </section>

        <section className="md-section md-riskSection">
          <SectionHeading
            eyebrow="05 · Decision gate"
            title="Resolve these before paying a non-refundable deposit."
          />
          <div className="md-checklist">
            {dueDiligence.map((item, index) => (
              <div key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
          <div className="md-stopRule">
            <WarningOutlined />
            <div>
              <span>Stop rule</span>
              <p>
                Do not proceed if legal access, subdivision drainage or a viable
                planning test-fit remains unresolved. Those are project-level
                risks, not details to solve after purchase.
              </p>
            </div>
          </div>
        </section>

        <section className="md-nextStep">
          <span>Recommended next step</span>
          <h2>Commission a measured survey and a one-week architect test-fit.</h2>
          <p>
            The output should show setbacks, two floor plans, parking, pool,
            septic and stormwater strategy, then attach a preliminary elemental
            cost plan. That package is the minimum basis for a land decision.
          </p>
          <a href={SITE_MAP_URL} target="_blank" rel="noreferrer">
            Reopen site location <ArrowRightOutlined />
          </a>
        </section>
      </main>
    </SiteLayout>
  );
}