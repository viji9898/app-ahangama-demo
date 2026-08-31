import React, { useState } from "react";
import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  EnvironmentOutlined,
  InstagramOutlined,
  RightOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Drawer } from "antd";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import {
  GUIDE_PLACES_BY_SLUG,
  GUIDE_SECTIONS,
  INITIAL_GUIDE_PAGES,
} from "../features/print-guide/guideData";
import SiteLayout from "../components/layout/SiteLayout";
import "../styles/print-guide-online.css";

export const PRINT_GUIDE_ONLINE_PATH = "/print-guide-online";

const GUIDE_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Hero-AhanagamaGuide-SriLanka.webp";

const SECTION_ORDER = [
  "stay",
  "eat-drink",
  "surf",
  "experiences",
  "wellness",
  "shopping",
  "born",
  "essentials",
];

const ONLINE_SECTIONS = SECTION_ORDER.map((key) => {
  const pages = INITIAL_GUIDE_PAGES.filter((page) => page.section === key);
  const opener = pages.find((page) => /Opener/.test(page.template)) || pages[0];
  const venueSlugs = [...new Set(pages.flatMap((page) => page.content.venueSlugs || []))];

  return {
    key,
    label: GUIDE_SECTIONS[key]?.label || key,
    color: GUIDE_SECTIONS[key]?.color || "#315847",
    headline: opener?.content.headline,
    subheadline: opener?.content.subheadline,
    body: opener?.content.body,
    image: opener?.content.image || GUIDE_IMAGE,
    venues: venueSlugs.map((slug) => GUIDE_PLACES_BY_SLUG.get(slug)).filter(Boolean),
  };
});

function instagramUrl(value) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://www.instagram.com/${value.replace(/^@/, "")}/`;
}

function mapUrl(venue) {
  if (venue.mapUrl) return venue.mapUrl;
  if (venue.lat && venue.lng) {
    return `https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`;
  }
  return null;
}

export default function PrintGuideOnlinePage() {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const selectedMapUrl = selectedVenue ? mapUrl(selectedVenue) : null;
  const selectedInstagramUrl = instagramUrl(selectedVenue?.instagram);

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Ahangama Guide 2026/27 | Read Online"
        description="Read the Ahangama Guide online: a mobile-first local guide to the best places to stay, eat, surf, shop and explore on Sri Lanka's south coast."
        canonical={absUrl(PRINT_GUIDE_ONLINE_PATH)}
        ogImage={GUIDE_IMAGE}
        ogImageWidth={1960}
        ogImageHeight={1100}
        author="Ahangama Guide Editorial Team"
      />
      <main className="pgo-webGuide">
        <header className="pgo-hero">
          <img src={GUIDE_IMAGE} alt="The coast and everyday life in Ahangama" />
          <div className="pgo-heroShade" aria-hidden="true" />
          <div className="pgo-heroCopy">
            <span>Ahangama Guide · 2026/27</span>
            <h1>The south coast,<br />selected slowly.</h1>
            <p>Stay, eat, surf, move and meet the people shaping Ahangama.</p>
            <a href="#guide-intro">Begin the guide <ArrowDownOutlined /></a>
          </div>
          <div className="pgo-heroEdition">Issue 01 · Independent and local</div>
        </header>

        <nav className="pgo-chapterNav" aria-label="Guide chapters">
          <div>
            {ONLINE_SECTIONS.map((section) => (
              <a href={`#guide-${section.key}`} key={section.key}>{section.label}</a>
            ))}
          </div>
        </nav>

        <section className="pgo-intro" id="guide-intro">
          <span className="pgo-kicker">A field guide for curious travellers</span>
          <div className="pgo-introGrid">
            <h2>Know the place,<br />not just the postcode.</h2>
            <div>
              <p>Ahangama rewards people who look beyond the main road. This online edition brings together the places, people and useful details we would share with a friend arriving tomorrow.</p>
              <p>Every recommendation is locally edited. Open a place to find its pass perk, directions, Instagram and the practical details worth having close at hand.</p>
            </div>
          </div>
        </section>

        {ONLINE_SECTIONS.map((section, sectionIndex) => (
          <section className="pgo-chapter" id={`guide-${section.key}`} key={section.key} style={{ "--pgo-accent": section.color }}>
            <header className="pgo-chapterHero">
              <img src={section.image} alt="" loading="lazy" />
              <div className="pgo-chapterShade" aria-hidden="true" />
              <div className="pgo-chapterTitle">
                <span>{String(sectionIndex + 1).padStart(2, "0")} · {section.label}</span>
                <h2>{section.headline}</h2>
                <p>{section.subheadline}</p>
              </div>
            </header>

            <div className="pgo-chapterBody">
              <div className="pgo-chapterLead"><span>Our edit</span><p>{section.body}</p></div>
              {section.venues.length ? (
                <div className="pgo-venues">
                  <div className="pgo-venuesHeading">
                    <div><span className="pgo-kicker">In this chapter</span><h3>Places worth knowing</h3></div>
                    <span>{section.venues.length} recommendations</span>
                  </div>
                  <div className="pgo-venueGrid">
                    {section.venues.map((venue) => (
                      <button type="button" className="pgo-venueCard" key={venue.slug} onClick={() => setSelectedVenue(venue)}>
                        <span className="pgo-venueImage"><img src={venue.image || section.image} alt="" loading="lazy" />{venue.cardPerk ? <em>Pass perk</em> : null}</span>
                        <span className="pgo-venueMeta"><span>{venue.area || "Ahangama"}{venue.stars ? <> · <StarFilled /> {venue.stars}</> : null}</span><RightOutlined /></span>
                        <strong>{venue.name}</strong>
                        <small>{venue.excerpt || venue.description}</small>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ))}

        <section className="pgo-closing">
          <span className="pgo-kicker">Keep exploring</span>
          <h2>Let the road<br />change the plan.</h2>
          <p>The live Ahangama guide is updated as the town changes, with new openings, events and local recommendations.</p>
          <a href="/search">Explore all of Ahangama <ArrowRightOutlined /></a>
        </section>
      </main>

      <Drawer className="pgo-venueDrawer" rootClassName="pgo-venueDrawerRoot" open={Boolean(selectedVenue)} onClose={() => setSelectedVenue(null)} width={560} title={null} destroyOnHidden>
        {selectedVenue ? (
          <article className="pgo-venueDetail">
            <div className="pgo-detailHero"><img src={selectedVenue.image || GUIDE_IMAGE} alt={selectedVenue.name} /><span>{selectedVenue.category}</span></div>
            <div className="pgo-detailBody">
              <div className="pgo-detailHeading">
                <div><span>{selectedVenue.area || "Ahangama"}</span><h2>{selectedVenue.name}</h2></div>
                {selectedVenue.stars ? <strong><StarFilled /> {selectedVenue.stars}<small>{selectedVenue.reviews ? `${selectedVenue.reviews} reviews` : "Guest rating"}</small></strong> : null}
              </div>
              <p className="pgo-detailDescription">{selectedVenue.description || selectedVenue.excerpt}</p>
              {selectedVenue.cardPerk ? <section className="pgo-detailPerk"><span>Ahangama Pass perk</span><h3>{selectedVenue.cardPerk}</h3>{selectedVenue.howToClaim ? <p>{selectedVenue.howToClaim}</p> : null}</section> : null}
              {selectedVenue.bestFor?.length ? <div className="pgo-detailTags">{selectedVenue.bestFor.map((item) => <span key={item}>{item}</span>)}</div> : null}
              <div className="pgo-detailActions">
                {selectedMapUrl ? <a href={selectedMapUrl} target="_blank" rel="noreferrer"><EnvironmentOutlined /> Google Maps</a> : null}
                {selectedInstagramUrl ? <a href={selectedInstagramUrl} target="_blank" rel="noreferrer"><InstagramOutlined /> Instagram</a> : null}
              </div>
              <dl className="pgo-detailFacts">
                {selectedVenue.price ? <div><dt>Price</dt><dd>{selectedVenue.price}</dd></div> : null}
                {selectedVenue.hours ? <div><dt>Hours</dt><dd>{selectedVenue.hours}</dd></div> : null}
                {selectedVenue.restrictions ? <div><dt>Good to know</dt><dd>{selectedVenue.restrictions}</dd></div> : null}
              </dl>
            </div>
          </article>
        ) : null}
      </Drawer>
    </SiteLayout>
  );
}