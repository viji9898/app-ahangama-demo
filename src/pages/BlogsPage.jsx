import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, Button, Card, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import BlogWorkspaceLayout from "../components/layout/BlogWorkspaceLayout";
import { BLOG_POSTS, getBlogPostBySlug } from "../data/blogs";

const { Paragraph, Text, Title } = Typography;

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const STORY_FILTERS = [
  { key: "all", label: "All Stories" },
  { key: "guides", label: "Guides" },
  { key: "local-profiles", label: "Local Profiles" },
  { key: "visitor-journals", label: "Visitor Journals" },
  { key: "food-drink", label: "Food & Drink" },
  { key: "wellness", label: "Wellness" },
  { key: "transport", label: "Transport" },
  { key: "pass-guides", label: "Pass Guides" },
];

const MUKTI_THUMBNAIL_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/mukti/cover_imageavif.avif";

const MUKTI_FEATURE_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/mukti/shop.avif";

const MUKTI_SECONDARY_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/mukti/cover_image_shops.avif";

const ISSUE_INDEX = [
  {
    number: "01",
    slug: "12-must-do-things-in-ahangama-2026-guide",
    category: "FEATURE GUIDE",
    title: "12 Must-Do Things in Ahangama",
    filters: ["guides", "food-drink", "wellness", "transport", "pass-guides"],
    articleIssue: "ISSUE 01",
  },
  {
    number: "02",
    slug: "perfect-day-in-ahangama",
    category: "VISITOR JOURNAL",
    title: "Perfect Day in Ahangama",
    filters: ["visitor-journals", "food-drink", "wellness"],
    articleIssue: "ISSUE 02",
  },
  {
    number: "03",
    slug: "mukti-studio-and-the-new-face-of-ahangama",
    category: "LOCAL PROFILE",
    title: "Mukti Studio and the New Face of Ahangama",
    filters: ["local-profiles"],
    articleIssue: "ISSUE 01",
    thumbnail: MUKTI_THUMBNAIL_IMAGE,
  },
  {
    number: "04",
    slug: "the-ultimate-wellness-guide-to-ahangama-yoga-gyms-pilates-ice-baths-spas",
    category: "WELLNESS GUIDE",
    title: "The Ultimate Wellness Guide to Ahangama",
    filters: ["guides", "wellness"],
    articleIssue: "ISSUE 04",
  },
  {
    number: "05",
    slug: "why-ahangama-might-be-sri-lankas-most-interesting-coastal-town-right-now",
    category: "OPINION",
    title:
      "Why Ahangama Might Be Sri Lanka's Most Interesting Coastal Town Right Now",
    filters: ["guides", "food-drink", "wellness", "pass-guides"],
    articleIssue: "ISSUE 05",
  },
  {
    number: "06",
    slug: "why-ahangama-works-best-when-you-explore-it-slowly",
    category: "TRAVEL FEATURE",
    title: "Why Ahangama Works Best When You Explore It Slowly",
    filters: ["guides", "food-drink", "wellness"],
    articleIssue: "ISSUE 06",
  },
  {
    number: "07",
    slug: "ahangama-for-first-time-visitors-where-to-eat-stay-and-reset",
    category: "VISITOR GUIDE",
    title: "Ahangama for First-Time Visitors",
    filters: ["guides", "food-drink", "wellness", "pass-guides"],
    articleIssue: "ISSUE 07",
  },
  {
    number: "08",
    slug: "the-best-way-to-use-a-day-in-ahangama-without-overplanning-it",
    category: "ITINERARY",
    title: "The Best Way to Use a Day in Ahangama Without Overplanning It",
    filters: ["guides", "food-drink"],
    articleIssue: "ISSUE 08",
  },
];

const READ_NEXT_SLUGS = [
  "perfect-day-in-ahangama",
  "12-must-do-things-in-ahangama-2026-guide",
  "ahangama-for-first-time-visitors-where-to-eat-stay-and-reset",
];

function formatDate(value) {
  return dateFormatter.format(new Date(value));
}

function buildIssueItems() {
  return ISSUE_INDEX.map((item) => {
    const post = getBlogPostBySlug(item.slug);

    if (!post) {
      return null;
    }

    return {
      ...item,
      post,
      thumbnail:
        item.thumbnail ||
        post.introImage ||
        post.heroImage ||
        MUKTI_THUMBNAIL_IMAGE,
      filters: ["all", ...(item.filters || [])],
    };
  }).filter(Boolean);
}

function EditorialImage({ src, alt, className = "" }) {
  return (
    <div className={`blog-editorialImage ${className}`.trim()}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}

function StoriesArchiveHome({ issueItems, onSelectPost, activeFilterLabel }) {
  const [leadStory, ...otherStories] = issueItems;

  if (!leadStory) {
    return (
      <Card className="blog-card blog-emptyCard" bordered={false}>
        <Text className="blog-articleEyebrow">Ahangama Stories</Text>
        <Title level={1} className="blog-articleTitle">
          No stories in this section yet
        </Title>
      </Card>
    );
  }

  return (
    <article className="stories-archive">
      <section className="stories-archiveHero blog-card">
        <div className="stories-archiveLeadCopy">
          <Text className="blog-articleEyebrow">Ahangama Stories</Text>
          <Title level={1} className="stories-archiveTitle">
            A travel publication style archive of Ahangama features, journals,
            local profiles, and slower guides.
          </Title>
          <Paragraph className="stories-archiveLead">
            Built more like a magazine contents page than a blog, this archive
            brings together visitor journals, local profiles, field notes, and
            editorial travel features from across Ahangama.
          </Paragraph>
          <div className="stories-archiveMetaRow">
            <span className="stories-archiveMetaPill">{activeFilterLabel}</span>
            <span className="stories-archiveMetaPill">
              {`${issueItems.length}`.padStart(2, "0")} stories
            </span>
            <span className="stories-archiveMetaPill">Editorial archive</span>
          </div>
        </div>

        <button
          type="button"
          className="stories-archiveLeadCard"
          onClick={() => onSelectPost(leadStory.slug)}
        >
          <EditorialImage
            src={leadStory.thumbnail}
            alt={leadStory.title}
            className="stories-archiveLeadImage"
          />
          <div className="stories-archiveLeadBody">
            <Text className="stories-archiveLeadKicker">
              {leadStory.number} {leadStory.category}
            </Text>
            <Title level={2} className="stories-archiveLeadTitle">
              {leadStory.title}
            </Title>
            <Paragraph className="stories-archiveLeadExcerpt">
              {leadStory.post.excerpt}
            </Paragraph>
            <span className="stories-archiveLeadLink">Open feature</span>
          </div>
        </button>
      </section>

      <section className="stories-archiveGridSection">
        <div className="stories-archiveGridHeader">
          <div>
            <Text className="blog-articleEyebrow">Issue archive</Text>
            <Title level={2} className="stories-archiveSectionTitle">
              Browse the current issue index
            </Title>
          </div>
        </div>

        <div className="stories-archiveGrid">
          {otherStories.map((story) => (
            <button
              key={story.slug}
              type="button"
              className="stories-archiveCard"
              onClick={() => onSelectPost(story.slug)}
            >
              <img src={story.thumbnail} alt="" aria-hidden="true" />
              <div className="stories-archiveCardBody">
                <Text className="stories-archiveCardKicker">
                  {story.number} {story.category}
                </Text>
                <Title level={3} className="stories-archiveCardTitle">
                  {story.title}
                </Title>
                <Paragraph className="stories-archiveCardExcerpt">
                  {story.post.excerpt}
                </Paragraph>
                <div className="stories-archiveCardMeta">
                  <Text>{formatDate(story.post.publishDate)}</Text>
                  <Text>{story.post.readingTime}</Text>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </article>
  );
}

function EditorialLeadSection({ post }) {
  const leadImage = post.introImage || post.heroImage;

  return (
    <section className="blog-featureLeadGrid">
      <div className="blog-featureLeadBody">
        {post.introTitle ? (
          <>
            <Text className="blog-featureSectionLabel">Opening note</Text>
            <Title level={2} className="blog-featureSectionTitle">
              {post.introTitle}
            </Title>
          </>
        ) : null}

        {(post.introColumns || []).map((paragraph) => (
          <Paragraph key={paragraph} className="blog-featureCopy">
            {paragraph}
          </Paragraph>
        ))}
      </div>

      {leadImage ? (
        <figure className="blog-featureFigure blog-featureLeadFigure">
          <EditorialImage src={leadImage} alt={post.introTitle || post.title} />
        </figure>
      ) : null}
    </section>
  );
}

function EditorialExperienceSection({ experience }) {
  return (
    <section className="blog-featureSection blog-featureModule">
      <Text className="blog-featureSectionLabel">{`${experience.index} / ${experience.venue}`}</Text>
      <Title level={2} className="blog-featureSectionTitle">
        {experience.title}
      </Title>

      {experience.image ? (
        <figure className="blog-featureFigure">
          <EditorialImage src={experience.image} alt={experience.title} />
        </figure>
      ) : null}

      <Paragraph className="blog-featureCopy">
        {experience.description}
      </Paragraph>

      <div className="blog-featureFactGrid">
        <div className="blog-featureFactCard">
          <Text className="blog-fieldNotesLabel">Average price</Text>
          <Paragraph className="blog-fieldNotesValue">
            {experience.retailPrice}
          </Paragraph>
        </div>
        <div className="blog-featureFactCard">
          <Text className="blog-fieldNotesLabel">With the pass</Text>
          <Paragraph className="blog-fieldNotesValue">
            {experience.passPrice}
          </Paragraph>
        </div>
        <div className="blog-featureFactCard blog-featureFactCardWide">
          <Text className="blog-fieldNotesLabel">Pass note</Text>
          <Paragraph className="blog-fieldNotesValue">
            {experience.passLabel}
          </Paragraph>
        </div>
      </div>
    </section>
  );
}

function EditorialStorySection({ section }) {
  return (
    <section className="blog-featureSection blog-featureModule">
      <Text className="blog-featureSectionLabel">{section.eyebrow}</Text>
      <Title level={2} className="blog-featureSectionTitle">
        {section.title}
      </Title>

      {section.videoUrl ? (
        <figure className="blog-featureFigure blog-featureVideoFigure">
          <video
            className="blog-journalVideo"
            src={section.videoUrl}
            poster={section.posterImage}
            controls
            muted
            loop
            playsInline
          />
        </figure>
      ) : null}

      {section.image ? (
        <figure className="blog-featureFigure">
          <EditorialImage src={section.image} alt={section.title} />
        </figure>
      ) : null}

      {section.paragraphs.map((paragraph) => (
        <Paragraph key={paragraph} className="blog-featureCopy">
          {paragraph}
        </Paragraph>
      ))}

      {section.quote ? (
        <blockquote className="blog-featurePullQuote blog-featurePullQuoteInline">
          {section.quote}
        </blockquote>
      ) : null}

      {section.stats?.length ? (
        <div className="blog-featureFactGrid">
          {section.stats.map((stat) => (
            <div key={stat} className="blog-featureFactCard">
              <Paragraph className="blog-fieldNotesValue">{stat}</Paragraph>
            </div>
          ))}
        </div>
      ) : null}

      {section.featuredPlaces?.length ? (
        <div className="blog-journalPlaces">
          <Text className="blog-fieldNotesLabel">Places featured</Text>
          <div className="blog-journalPlacesList">
            {section.featuredPlaces.map((place) => (
              <span key={place} className="blog-journalPlacePill">
                {place}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {section.gallery?.length ? (
        <div className="blog-readNextGrid blog-featureGalleryGrid">
          {section.gallery.map((item) => (
            <figure key={item.label} className="blog-readNextCard">
              <img src={item.image} alt={item.label} />
              <figcaption className="blog-readNextBody">
                {item.label}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function EditorialPassSection({ passSection }) {
  if (!passSection) {
    return null;
  }

  return (
    <aside className="blog-fieldNotes blog-featurePassSection">
      <Text className="blog-featureKicker">Ahangama Pass</Text>
      <Title level={3} className="blog-fieldNotesTitle">
        {passSection.title}
      </Title>
      <Paragraph className="blog-featureCopy">{passSection.body}</Paragraph>
      <Paragraph className="blog-featureCopy">
        {passSection.supporting}
      </Paragraph>
      <div className="blog-fieldNotesActions">
        <Button className="blog-primaryButton" href="/card">
          {passSection.ctaLabel}
        </Button>
      </div>
    </aside>
  );
}

function EditorialClosingSection({ closingSection }) {
  if (!closingSection) {
    return null;
  }

  return (
    <section className="blog-featureClosing">
      <Text className="blog-featureSectionLabel">Closing thought</Text>
      <Title level={2} className="blog-featureSectionTitle">
        {closingSection.title}
      </Title>
      {closingSection.body.map((paragraph) => (
        <Paragraph key={paragraph} className="blog-featureCopy">
          {paragraph}
        </Paragraph>
      ))}
      <div className="blog-journalClosingActions">
        <Button className="blog-primaryButton" href="/">
          {closingSection.ctaLabel}
        </Button>
        <Button className="blog-secondaryButton" href="/blogs">
          More articles
        </Button>
      </div>
    </section>
  );
}

function EditorialFeaturePost({ post, issueItem, issueItems, onSelectPost }) {
  return (
    <article className="blog-featureArticle">
      <EditorialMetaHeader
        issueItem={issueItem}
        standfirst={post.heroSubtitle || post.excerpt}
      />

      <section className="blog-featureBody">
        <EditorialLeadSection post={post} />

        {post.pullQuote ? (
          <blockquote className="blog-featurePullQuote">
            {post.pullQuote}
          </blockquote>
        ) : null}

        {post.experiences?.map((experience) => (
          <EditorialExperienceSection
            key={experience.index}
            experience={experience}
          />
        ))}

        {post.storySections?.map((section) => (
          <EditorialStorySection key={section.title} section={section} />
        ))}

        <EditorialPassSection passSection={post.passSection} />
        <EditorialClosingSection closingSection={post.closingSection} />
      </section>

      <ReadNextCards issueItems={issueItems} onSelectPost={onSelectPost} />
    </article>
  );
}

function EditorialGuidePost({ post, issueItem, issueItems, onSelectPost }) {
  const guideImage = issueItem.thumbnail || post.heroImage || post.introImage;

  return (
    <article className="blog-featureArticle">
      <EditorialMetaHeader issueItem={issueItem} standfirst={post.excerpt} />

      <section className="blog-featureBody">
        {guideImage ? (
          <figure className="blog-featureImageBlock">
            <EditorialImage src={guideImage} alt={post.title} />
          </figure>
        ) : null}

        {post.sections.map((section, index) => (
          <section
            key={section.heading}
            className="blog-featureSection blog-featureModule"
          >
            <Text className="blog-featureSectionLabel">
              {`Section ${String(index + 1).padStart(2, "0")}`}
            </Text>
            <Title level={2} className="blog-featureSectionTitle">
              {section.heading}
            </Title>

            {section.paragraphs.map((paragraph) => (
              <Paragraph key={paragraph} className="blog-featureCopy">
                {paragraph}
              </Paragraph>
            ))}

            {section.bullets?.length ? (
              <ul className="blog-featureBulletList">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </section>

      <ReadNextCards issueItems={issueItems} onSelectPost={onSelectPost} />
    </article>
  );
}

function EditorialMetaHeader({ issueItem, standfirst }) {
  return (
    <header className="blog-featureHeader">
      <Breadcrumb className="blog-breadcrumb">
        <Breadcrumb.Item>
          <a href="/">Ahangama</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/blogs">Stories</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{issueItem.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Text className="blog-featureKicker">
        {`AHANGAMA STORIES / ${issueItem.category} / ${issueItem.articleIssue}`}
      </Text>
      <Title level={1} className="blog-featureTitle">
        {issueItem.title}
      </Title>
      <Paragraph className="blog-featureStandfirst">{standfirst}</Paragraph>
      <div className="blog-featureMeta">
        <Text>{formatDate(issueItem.post.publishDate)}</Text>
        <span className="blog-topbarDivider" />
        <Text>{issueItem.post.readingTime}</Text>
        <span className="blog-topbarDivider" />
        <Text>{issueItem.post.author}</Text>
      </div>
      <Text className="blog-featureByline">Written by Ahangama.com</Text>
    </header>
  );
}

function ReadNextCards({ issueItems, onSelectPost }) {
  const cards = READ_NEXT_SLUGS.map((slugValue) =>
    issueItems.find((item) => item.slug === slugValue),
  ).filter(Boolean);

  return (
    <section className="blog-readNextSection">
      <Text className="blog-featureKicker">Read Next</Text>
      <div className="blog-readNextGrid">
        {cards.map((item) => (
          <button
            key={item.slug}
            type="button"
            className="blog-readNextCard"
            onClick={() => onSelectPost(item.slug)}
          >
            <img src={item.thumbnail} alt="" aria-hidden="true" />
            <div className="blog-readNextBody">
              <Text className="blog-readNextKicker">{item.category}</Text>
              <Title level={3} className="blog-readNextTitle">
                {item.title}
              </Title>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function MuktiFeaturePost({ post, issueItem, issueItems, onSelectPost }) {
  const [studioName, location, hours, instagram, whyGo] = post.visitDetails;

  return (
    <article className="blog-featureArticle">
      <EditorialMetaHeader issueItem={issueItem} standfirst={post.excerpt} />

      <section className="blog-featureBody">
        <Paragraph className="blog-featureIntro">
          {post.bodyParagraphs[0]}
        </Paragraph>

        <blockquote className="blog-featurePullQuote">
          "At first glance it is a clothing store. Look closer and it becomes
          part creative studio, part community project, part social enterprise."
        </blockquote>

        <figure className="blog-featureImageBlock">
          <EditorialImage src={MUKTI_FEATURE_IMAGE} alt={post.title} />
          <figcaption className="blog-featureCaption">
            Mukti Studio reflects the new blend of design, community, and slow
            entrepreneurship shaping Ahangama.
          </figcaption>
        </figure>

        <section className="blog-featureSection">
          <Text className="blog-featureSectionLabel">Section</Text>
          <Title level={2} className="blog-featureSectionTitle">
            A Studio Built Around Community
          </Title>
          {post.bodyParagraphs.slice(1, 7).map((paragraph) => (
            <Paragraph key={paragraph} className="blog-featureCopy">
              {paragraph}
            </Paragraph>
          ))}

          <figure className="blog-featureImageBlock">
            <EditorialImage
              src={MUKTI_SECONDARY_IMAGE}
              alt="Mukti Studio storefront in Ahangama"
            />
            <figcaption className="blog-featureCaption">
              Mukti's storefront has become part of the new visual language of
              Ahangama.
            </figcaption>
          </figure>
        </section>

        <section className="blog-featureSection">
          <Text className="blog-featureSectionLabel">Section</Text>
          <Title level={2} className="blog-featureSectionTitle">
            Why It Matters
          </Title>
          {post.bodyParagraphs.slice(7).map((paragraph) => (
            <Paragraph key={paragraph} className="blog-featureCopy">
              {paragraph}
            </Paragraph>
          ))}
        </section>

        <aside className="blog-fieldNotes">
          <Text className="blog-featureKicker">Field Notes</Text>
          <Title level={3} className="blog-fieldNotesTitle">
            {studioName}
          </Title>
          <div className="blog-fieldNotesGrid">
            <div>
              <Text className="blog-fieldNotesLabel">Location</Text>
              <Paragraph className="blog-fieldNotesValue">{location}</Paragraph>
            </div>
            <div>
              <Text className="blog-fieldNotesLabel">Open daily</Text>
              <Paragraph className="blog-fieldNotesValue">
                {hours.replace("Open daily from ", "")}
              </Paragraph>
            </div>
            <div>
              <Text className="blog-fieldNotesLabel">Instagram</Text>
              <Paragraph className="blog-fieldNotesValue">
                {instagram.replace("Instagram: ", "")}
              </Paragraph>
            </div>
            <div>
              <Text className="blog-fieldNotesLabel">Why go</Text>
              <Paragraph className="blog-fieldNotesValue">
                {whyGo.replace("What to expect: ", "")}
              </Paragraph>
            </div>
          </div>
          <div className="blog-fieldNotesActions">
            <a
              href="https://www.instagram.com/studio.mukti"
              target="_blank"
              rel="noreferrer"
              className="blog-fieldNotesLink"
            >
              Open Instagram →
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Mukti%20Studio%20Ahangama"
              target="_blank"
              rel="noreferrer"
              className="blog-fieldNotesLink"
            >
              Open Map →
            </a>
          </div>
        </aside>
      </section>

      <ReadNextCards issueItems={issueItems} onSelectPost={onSelectPost} />
    </article>
  );
}

export default function BlogsPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [activeFilter, setActiveFilter] = useState("all");
  const issueItems = useMemo(() => buildIssueItems(), []);
  const defaultPost = BLOG_POSTS[0] || null;
  const activePost = slug ? getBlogPostBySlug(slug) : null;
  const isNotFound = Boolean(slug && !activePost);
  const isCollectionHome = !slug;
  const filteredIssueItems = useMemo(() => {
    if (activeFilter === "all") {
      return issueItems;
    }

    return issueItems.filter((item) => item.filters.includes(activeFilter));
  }, [activeFilter, issueItems]);
  const activeIssueItem =
    issueItems.find((item) => item.slug === activePost?.slug) || null;
  const activeFilterLabel =
    STORY_FILTERS.find((filter) => filter.key === activeFilter)?.label ||
    "All Stories";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  const handleSelectPost = (nextSlug) => {
    navigate(`/blogs/${nextSlug}`);
  };

  if (!defaultPost) {
    return null;
  }

  const canonical =
    !slug || !activePost
      ? absUrl("/blogs")
      : absUrl(`/blogs/${activePost.slug}`);

  const jsonLd =
    slug && activePost
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: activePost.title,
          description: activePost.description,
          datePublished: activePost.publishDate,
          dateModified: activePost.publishDate,
          mainEntityOfPage: canonical,
          url: canonical,
          articleSection: activePost.category,
          author: {
            "@type": activePost.authorType || "Person",
            name: activePost.author,
          },
          publisher: {
            "@type": "Organization",
            name: "ahangama.com",
          },
        }
      : null;

  return (
    <>
      <Seo
        title={
          slug && activePost
            ? `${activePost.title} — Ahangama Blogs`
            : "Ahangama Blogs — Real Visitor Stories, Guides, and Experiences"
        }
        description={
          slug && activePost
            ? activePost.description
            : "A collection of Ahangama blog posts shaped by real visitor experiences, return trips, slow stays, surf mornings, food notes, and local discoveries."
        }
        canonical={canonical}
        jsonLd={jsonLd}
      />

      <SiteLayout showFooter={false}>
        <BlogWorkspaceLayout
          issueItems={issueItems}
          filteredIssueItems={filteredIssueItems}
          activeSlug={activePost?.slug || null}
          filters={STORY_FILTERS}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          onSelectPost={handleSelectPost}
          lastUpdated={formatDate(defaultPost.publishDate)}
        >
          {isCollectionHome ? (
            <StoriesArchiveHome
              issueItems={filteredIssueItems}
              onSelectPost={handleSelectPost}
              activeFilterLabel={activeFilterLabel}
            />
          ) : isNotFound ? (
            <Card className="blog-card blog-emptyCard" bordered={false}>
              <Text className="blog-articleEyebrow">Blogs</Text>
              <Title level={1} className="blog-articleTitle">
                Article not found
              </Title>
              <Paragraph className="blog-emptyCopy">
                The article you tried to open does not exist. Choose a post from
                the left navigation or return to the main blog hub.
              </Paragraph>
              <Button
                type="primary"
                icon={<ArrowLeftOutlined />}
                href="/blogs"
              >
                Back to blogs
              </Button>
            </Card>
          ) : activePost.slug === "mukti-studio-and-the-new-face-of-ahangama" &&
            activeIssueItem ? (
            <MuktiFeaturePost
              post={activePost}
              issueItem={activeIssueItem}
              issueItems={issueItems}
              onSelectPost={handleSelectPost}
            />
          ) : activePost.editorialType === "plain-story" ? (
            activeIssueItem ? (
              <EditorialGuidePost
                post={activePost}
                issueItem={activeIssueItem}
                issueItems={issueItems}
                onSelectPost={handleSelectPost}
              />
            ) : null
          ) : activePost.editorialType === "coastal-town-story" ||
            activePost.editorialType === "perfect-day-story" ||
            activePost.experiences ? (
            activeIssueItem ? (
              <EditorialFeaturePost
                post={activePost}
                issueItem={activeIssueItem}
                issueItems={issueItems}
                onSelectPost={handleSelectPost}
              />
            ) : null
          ) : (
            activeIssueItem ? (
              <EditorialGuidePost
                post={activePost}
                issueItem={activeIssueItem}
                issueItems={issueItems}
                onSelectPost={handleSelectPost}
              />
            ) : null
          )}
        </BlogWorkspaceLayout>
      </SiteLayout>
    </>
  );
}
