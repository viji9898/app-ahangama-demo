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
import {
  GUIDE_AREAS,
  GUIDE_EDIT_PLACES,
  GUIDE_ITINERARIES,
  GUIDE_KEY_ITEMS,
  GUIDE_MAP_IMAGE,
  GUIDE_MAP_URL,
  GUIDE_TOWN_STORY_CHAPTERS,
} from "../features/print-guide/openingGuideData";
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
  const venueGroups = pages
    .filter(
      (page) =>
        page.pageType !== "section-opener" &&
        !page.commercial.enabled &&
        page.content.venueSlugs?.length,
    )
    .map((page) => ({
      key: page.pageType,
      headline: page.content.headline,
      subheadline: page.content.subheadline,
      venues: page.content.venueSlugs
        .map((slug) => GUIDE_PLACES_BY_SLUG.get(slug))
        .filter(Boolean),
    }))
    .filter((group) => group.venues.length);
  const venueCount = new Set(
    venueGroups.flatMap((group) => group.venues.map((venue) => venue.slug)),
  ).size;

  return {
    key,
    label: GUIDE_SECTIONS[key]?.label || key,
    color: GUIDE_SECTIONS[key]?.color || "#315847",
    headline: opener?.content.headline,
    subheadline: opener?.content.subheadline,
    body: opener?.content.body,
    image: opener?.content.image || GUIDE_IMAGE,
    venueGroups,
    venueCount,
  };
});

const OPENING_PAGES = new Map(
  INITIAL_GUIDE_PAGES.filter(
    ({ pageNumber }) => pageNumber >= 3 && pageNumber <= 11,
  ).map((page) => [page.pageNumber, page]),
);

const GUIDE_PLACES_BY_NAME = new Map(
  [...GUIDE_PLACES_BY_SLUG.values()].map((venue) => [
    venue.name.toLowerCase(),
    venue,
  ]),
);

const GUIDE_EDIT_VENUE_ALIASES = {
  abrazo: "abrazo-ahangama",
  marshmellow: "marshmellow-surf-cafe",
};

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
    <SiteLayout navOverlayHero showNav={false} showFooter={false}>
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
          <img
            src={GUIDE_IMAGE}
            alt="The coast and everyday life in Ahangama"
          />
          <div className="pgo-heroShade" aria-hidden="true" />
          <div className="pgo-heroCopy">
            <span>Ahangama Guide · 2026/27</span>
            <h1>
              The south coast,
              <br />
              selected slowly.
            </h1>
            <p>Stay, eat, surf, move and meet the people shaping Ahangama.</p>
            <a href="#guide-intro">
              Begin the guide <ArrowDownOutlined />
            </a>
          </div>
          <div className="pgo-heroEdition">
            Issue 01 · Independent and local
          </div>
        </header>

        <nav className="pgo-chapterNav" aria-label="Guide chapters">
          <div>
            <a href="#guide-start">Start here</a>
            {ONLINE_SECTIONS.map((section) => (
              <a href={`#guide-${section.key}`} key={section.key}>
                {section.label}
              </a>
            ))}
          </div>
        </nav>

        <section className="pgo-intro" id="guide-intro">
          <span className="pgo-kicker">
            A field guide for curious travellers
          </span>
          <div className="pgo-introGrid">
            <h2>
              Know the place,
              <br />
              not just the postcode.
            </h2>
            <div>
              <p>
                Ahangama rewards people who look beyond the main road. This
                online edition brings together the places, people and useful
                details we would share with a friend arriving tomorrow.
              </p>
              <p>
                Every recommendation is locally edited. Open a place to find its
                pass perk, directions, Instagram and the practical details worth
                having close at hand.
              </p>
            </div>
          </div>
        </section>

        <section className="pgo-opening" id="guide-start">
          <header className="pgo-openingHeader">
            <span className="pgo-kicker">Pages 03–11 · Before you begin</span>
            <h2>{OPENING_PAGES.get(3)?.content.headline}</h2>
            <p>{OPENING_PAGES.get(3)?.content.subheadline}</p>
            <div className="pgo-welcomeCopy">
              <p>{OPENING_PAGES.get(3)?.content.body}</p>
              <p>
                This guide is edited for travellers who would rather know a
                place than simply pass through it. Carry it, mark it, and let it
                lead you off the main road.
              </p>
              <strong>The Ahangama.com editors</strong>
            </div>
          </header>

          <div className="pgo-openingBlock pgo-guideKey">
            <div className="pgo-openingTitle">
              <span>04</span>
              <h3>{OPENING_PAGES.get(4)?.content.headline}</h3>
              <p>{OPENING_PAGES.get(4)?.content.subheadline}</p>
            </div>
            <div className="pgo-guideKeyGrid">
              {GUIDE_KEY_ITEMS.map(([number, title, description]) => (
                <article key={number}>
                  <span>{number}</span>
                  <h4>{title}</h4>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="pgo-openingBlock pgo-neighbourhoods">
            <div className="pgo-openingTitle">
              <span>05</span>
              <h3>{OPENING_PAGES.get(5)?.content.headline}</h3>
              <p>{OPENING_PAGES.get(5)?.content.subheadline}</p>
            </div>
            <div className="pgo-neighbourhoodGrid">
              {GUIDE_AREAS.map(
                ([name, summary, description, bestFor], index) => (
                  <article key={name}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h4>{name}</h4>
                    <strong>{summary}</strong>
                    <p>{description}</p>
                    <small>Best for · {bestFor}</small>
                  </article>
                ),
              )}
            </div>
          </div>

          <div className="pgo-openingBlock pgo-mapFeature">
            <div className="pgo-openingTitle">
              <span>06–07</span>
              <h3>{OPENING_PAGES.get(6)?.content.headline}</h3>
              <p>{OPENING_PAGES.get(6)?.content.subheadline}</p>
            </div>
            <a
              href={GUIDE_MAP_URL}
              target="_blank"
              rel="noreferrer"
              className="pgo-mapImage"
            >
              <img
                src={GUIDE_MAP_IMAGE}
                alt="Illustrated map of the Ahangama coastal corridor from Koggala to Midigama"
              />
              <span>
                <EnvironmentOutlined /> Open the live map
              </span>
            </a>
          </div>

          <div className="pgo-openingBlock pgo-itineraries">
            {[8, 9].map((pageNumber) => (
              <article className="pgo-itinerary" key={pageNumber}>
                <div className="pgo-openingTitle">
                  <span>0{pageNumber}</span>
                  <h3>{OPENING_PAGES.get(pageNumber)?.content.headline}</h3>
                  <p>{OPENING_PAGES.get(pageNumber)?.content.subheadline}</p>
                </div>
                <div>
                  {GUIDE_ITINERARIES[pageNumber].map(
                    ([time, title, description]) => (
                      <section key={time}>
                        <time>{time}</time>
                        <div>
                          <h4>{title}</h4>
                          <p>{description}</p>
                        </div>
                      </section>
                    ),
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="pgo-openingBlock pgo-townStory">
            <div className="pgo-openingTitle">
              <span>10</span>
              <h3>{OPENING_PAGES.get(10)?.content.headline}</h3>
              <p>{OPENING_PAGES.get(10)?.content.subheadline}</p>
            </div>
            <div>
              {GUIDE_TOWN_STORY_CHAPTERS.map(([title, description], index) => (
                <article key={title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h4>{title}</h4>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="pgo-openingBlock pgo-edit">
            <div className="pgo-openingTitle">
              <span>11</span>
              <h3>{OPENING_PAGES.get(11)?.content.headline}</h3>
              <p>{OPENING_PAGES.get(11)?.content.subheadline}</p>
            </div>
            <div className="pgo-editGrid">
              {GUIDE_EDIT_PLACES.map(([name, description], index) => {
                const normalizedName = name.toLowerCase();
                const venue =
                  GUIDE_PLACES_BY_NAME.get(normalizedName) ||
                  GUIDE_PLACES_BY_SLUG.get(
                    GUIDE_EDIT_VENUE_ALIASES[normalizedName],
                  );
                const content = (
                  <>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{name}</strong>
                    <small>{description}</small>
                    {venue ? <RightOutlined /> : null}
                  </>
                );
                return venue ? (
                  <button
                    type="button"
                    key={name}
                    onClick={() => setSelectedVenue(venue)}
                  >
                    {content}
                  </button>
                ) : (
                  <article key={name}>{content}</article>
                );
              })}
            </div>
          </div>
        </section>

        {ONLINE_SECTIONS.map((section, sectionIndex) => (
          <section
            className="pgo-chapter"
            id={`guide-${section.key}`}
            key={section.key}
            style={{ "--pgo-accent": section.color }}
          >
            <header className="pgo-chapterHero">
              <img src={section.image} alt="" loading="lazy" />
              <div className="pgo-chapterShade" aria-hidden="true" />
              <div className="pgo-chapterTitle">
                <span>
                  {String(sectionIndex + 1).padStart(2, "0")} · {section.label}
                </span>
                <h2>{section.headline}</h2>
                <p>{section.subheadline}</p>
              </div>
            </header>

            <div className="pgo-chapterBody">
              <div className="pgo-chapterLead">
                <span>Our edit</span>
                <p>{section.body}</p>
              </div>
              {section.venueGroups.length ? (
                <div className="pgo-venues">
                  {section.venueGroups.map((group, groupIndex) => (
                    <section className="pgo-venueGroup" key={group.key}>
                      <div className="pgo-venuesHeading">
                        <div>
                          <span className="pgo-kicker">
                            {groupIndex === 0
                              ? `${section.venueCount} places in this chapter`
                              : section.label}
                          </span>
                          <h3>{group.headline}</h3>
                          <p>{group.subheadline}</p>
                        </div>
                        <span>{group.venues.length} recommendations</span>
                      </div>
                      <div className="pgo-venueGrid">
                        {group.venues.map((venue) => (
                          <button
                            type="button"
                            className="pgo-venueCard"
                            key={venue.slug}
                            onClick={() => setSelectedVenue(venue)}
                          >
                            <span className="pgo-venueImage">
                              <img
                                src={venue.image || section.image}
                                alt=""
                                loading="lazy"
                              />
                              {venue.cardPerk ? <em>Pass perk</em> : null}
                            </span>
                            <span className="pgo-venueMeta">
                              <span>
                                {venue.area || "Ahangama"}
                                {venue.stars ? (
                                  <>
                                    {" "}
                                    · <StarFilled /> {venue.stars}
                                  </>
                                ) : null}
                              </span>
                              <RightOutlined />
                            </span>
                            <strong>{venue.name}</strong>
                            <small>{venue.excerpt || venue.description}</small>
                          </button>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ))}

        <section className="pgo-closing">
          <span className="pgo-kicker">Keep exploring</span>
          <h2>
            Let the road
            <br />
            change the plan.
          </h2>
          <p>
            The live Ahangama guide is updated as the town changes, with new
            openings, events and local recommendations.
          </p>
          <a href="/">
            Explore all of Ahangama <ArrowRightOutlined />
          </a>
        </section>
      </main>

      <Drawer
        className="pgo-venueDrawer"
        rootClassName="pgo-venueDrawerRoot"
        open={Boolean(selectedVenue)}
        onClose={() => setSelectedVenue(null)}
        width="90vw"
        title={null}
        destroyOnHidden
      >
        {selectedVenue ? (
          <article className="pgo-venueDetail">
            <div className="pgo-detailHero">
              <img
                src={selectedVenue.image || GUIDE_IMAGE}
                alt={selectedVenue.name}
              />
              <span>{selectedVenue.category}</span>
            </div>
            <div className="pgo-detailBody">
              <div className="pgo-detailHeading">
                <div>
                  <span>{selectedVenue.area || "Ahangama"}</span>
                  <h2>{selectedVenue.name}</h2>
                </div>
                {selectedVenue.stars ? (
                  <strong>
                    <StarFilled /> {selectedVenue.stars}
                    <small>
                      {selectedVenue.reviews
                        ? `${selectedVenue.reviews} reviews`
                        : "Guest rating"}
                    </small>
                  </strong>
                ) : null}
              </div>
              <p className="pgo-detailDescription">
                {selectedVenue.description || selectedVenue.excerpt}
              </p>
              {selectedVenue.cardPerk ? (
                <section className="pgo-detailPerk">
                  <span>Ahangama Pass perk</span>
                  <h3>{selectedVenue.cardPerk}</h3>
                  {selectedVenue.howToClaim ? (
                    <p>{selectedVenue.howToClaim}</p>
                  ) : null}
                </section>
              ) : null}
              {selectedVenue.bestFor?.length ? (
                <div className="pgo-detailTags">
                  {selectedVenue.bestFor.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              ) : null}
              <div className="pgo-detailActions">
                {selectedMapUrl ? (
                  <a href={selectedMapUrl} target="_blank" rel="noreferrer">
                    <EnvironmentOutlined /> Google Maps
                  </a>
                ) : null}
                {selectedInstagramUrl ? (
                  <a
                    href={selectedInstagramUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <InstagramOutlined /> Instagram
                  </a>
                ) : null}
              </div>
              <dl className="pgo-detailFacts">
                {selectedVenue.price ? (
                  <div>
                    <dt>Price</dt>
                    <dd>{selectedVenue.price}</dd>
                  </div>
                ) : null}
                {selectedVenue.hours ? (
                  <div>
                    <dt>Hours</dt>
                    <dd>{selectedVenue.hours}</dd>
                  </div>
                ) : null}
                {selectedVenue.restrictions ? (
                  <div>
                    <dt>Good to know</dt>
                    <dd>{selectedVenue.restrictions}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </article>
        ) : null}
      </Drawer>
    </SiteLayout>
  );
}
