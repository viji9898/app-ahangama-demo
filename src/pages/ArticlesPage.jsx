import React, { useMemo, useState } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { EDITORIAL_ARTICLES } from "../data/editorialArticles";
import "../styles/articles.css";

export const ARTICLES_PATH = "/articles";

const ALL_CATEGORIES = "All articles";
const HERO_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/ariel-view-ahangama-beach-coastline.jpg";

function formatDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const featuredArticle = EDITORIAL_ARTICLES[0];
  const categories = useMemo(
    () => [
      ALL_CATEGORIES,
      ...new Set(EDITORIAL_ARTICLES.map((article) => article.category)),
    ],
    [],
  );
  const visibleArticles = useMemo(
    () =>
      EDITORIAL_ARTICLES.filter(
        (article) =>
          activeCategory === ALL_CATEGORIES ||
          article.category === activeCategory,
      ),
    [activeCategory],
  );

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Articles | Ahangama Editorial Guides & Stories"
        description="Browse every Ahangama editorial article, including local guides, interviews, community stories and practical notes for Sri Lanka's south coast."
        canonical={absUrl(ARTICLES_PATH)}
        ogImage={HERO_IMAGE}
      />

      <main className="articles-page">
        <header className="articles-hero">
          <img
            src={HERO_IMAGE}
            alt="Aerial view of Ahangama beach and coastline"
          />
          <div className="articles-heroCopy">
            <span>Ahangama editorial</span>
            <h1>Articles</h1>
            <p>
              Local guides, interviews and field notes for understanding
              Ahangama and Sri Lanka&apos;s south coast beyond a list of places.
            </p>
          </div>
        </header>

        <section className="articles-intro">
          <div className="articles-inner articles-introGrid">
            <div>
              <span className="articles-kicker">Latest story</span>
              <h2>{featuredArticle.title}</h2>
            </div>
            <div>
              <p>{featuredArticle.description}</p>
              <a href={featuredArticle.href}>
                Read the latest <ArrowRightOutlined />
              </a>
            </div>
          </div>
        </section>

        <section className="articles-index" aria-labelledby="articles-index-title">
          <div className="articles-inner">
            <div className="articles-indexHead">
              <div>
                <span className="articles-kicker">The complete index</span>
                <h2 id="articles-index-title">All articles</h2>
              </div>
              <p>{EDITORIAL_ARTICLES.length} stories and guides</p>
            </div>

            <div
              className="articles-filters"
              role="group"
              aria-label="Filter articles by category"
            >
              {categories.map((category) => (
                <button
                  aria-pressed={activeCategory === category}
                  className={activeCategory === category ? "is-active" : ""}
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  type="button"
                >
                  {category}
                </button>
              ))}
            </div>

            <p className="articles-resultCount" aria-live="polite">
              Showing {visibleArticles.length} {visibleArticles.length === 1 ? "article" : "articles"}
            </p>

            <div className="articles-grid">
              {visibleArticles.map((article, index) => (
                <article
                  className={index === 0 && activeCategory === ALL_CATEGORIES ? "articles-card articles-card--lead" : "articles-card"}
                  key={article.href}
                >
                  <a href={article.href}>
                    <div className="articles-cardImage">
                      <img src={article.image} alt="" />
                    </div>
                    <div className="articles-cardCopy">
                      <div className="articles-cardMeta">
                        <span>{article.category}</span>
                        <time dateTime={article.publishDate}>
                          {formatDate(article.publishDate)}
                        </time>
                      </div>
                      <h3>{article.title}</h3>
                      <p>{article.description}</p>
                      <strong>
                        Read article <ArrowRightOutlined />
                      </strong>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}