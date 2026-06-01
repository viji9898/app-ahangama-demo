import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, Button, Card, Col, Row, Tag, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
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

const MUKTI_FEATURE_IMAGE =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80";

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
    thumbnail: MUKTI_FEATURE_IMAGE,
  },
  {
    number: "04",
    slug: "why-ahangama-might-be-sri-lankas-most-interesting-coastal-town-right-now",
    category: "OPINION",
    title:
      "Why Ahangama Might Be Sri Lanka's Most Interesting Coastal Town Right Now",
    filters: ["guides", "food-drink", "wellness", "pass-guides"],
    articleIssue: "ISSUE 04",
  },
  {
    number: "05",
    slug: "why-ahangama-works-best-when-you-explore-it-slowly",
    category: "TRAVEL FEATURE",
    title: "Why Ahangama Works Best When You Explore It Slowly",
    filters: ["guides", "food-drink", "wellness"],
    articleIssue: "ISSUE 05",
  },
  {
    number: "06",
    slug: "ahangama-for-first-time-visitors-where-to-eat-stay-and-reset",
    category: "VISITOR GUIDE",
    title: "Ahangama for First-Time Visitors",
    filters: ["guides", "food-drink", "wellness", "pass-guides"],
    articleIssue: "ISSUE 06",
  },
  {
    number: "07",
    slug: "the-best-way-to-use-a-day-in-ahangama-without-overplanning-it",
    category: "ITINERARY",
    title: "The Best Way to Use a Day in Ahangama Without Overplanning It",
    filters: ["guides", "food-drink"],
    articleIssue: "ISSUE 07",
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
        MUKTI_FEATURE_IMAGE,
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

function ExperienceSection({ experience }) {
  const layoutClass = `blog-experience blog-experience--${experience.layout}`;

  return (
    <section className={layoutClass}>
      <div className="blog-experienceMedia">
        <EditorialImage src={experience.image} alt={experience.title} />
      </div>

      <div className="blog-experienceBody">
        <Text className="blog-experienceIndex">{experience.index}</Text>
        <Title level={2} className="blog-experienceTitle">
          {experience.title}
        </Title>
        <Text className="blog-experienceVenue">{experience.venue}</Text>
        <Paragraph className="blog-sectionCopy">
          {experience.description}
        </Paragraph>

        <div className="blog-pricingStrip">
          <div className="blog-pricingMeta">
            <Text className="blog-pricingLabel">Average experience price</Text>
            <Text className="blog-pricingValue">{experience.retailPrice}</Text>
          </div>
          <div className="blog-pricingDivider" />
          <div className="blog-pricingMeta">
            <Text className="blog-pricingLabel">With the Ahangama Pass</Text>
            <Text className="blog-pricingValue blog-pricingValueAccent">
              {experience.passPrice}
            </Text>
          </div>
        </div>

        <div className="blog-experienceActions">
          <Tag className="blog-passBadge">{experience.passLabel}</Tag>
          <Button className="blog-secondaryButton" href="/partners">
            View Venue
          </Button>
        </div>
      </div>
    </section>
  );
}

function JournalExperienceSection({ experience }) {
  return (
    <section className="blog-journalSection blog-journalExperienceSection">
      <div className="blog-journalExperienceHeader">
        <Text className="blog-journalSectionEyebrow">{`${experience.index} · ${experience.venue}`}</Text>
        <Title level={2} className="blog-journalSectionTitle">
          {experience.title}
        </Title>
      </div>

      <figure className="blog-journalFigure">
        <EditorialImage src={experience.image} alt={experience.title} />
      </figure>

      <Paragraph className="blog-journalCopy">
        {experience.description}
      </Paragraph>

      <div className="blog-journalPriceRow">
        <div className="blog-journalPriceItem">
          <Text className="blog-pricingLabel">Average experience price</Text>
          <Text className="blog-pricingValue">{experience.retailPrice}</Text>
        </div>
        <div className="blog-journalPriceItem">
          <Text className="blog-pricingLabel">With the Ahangama Pass</Text>
          <Text className="blog-pricingValue blog-pricingValueAccent">
            {experience.passPrice}
          </Text>
        </div>
      </div>

      <div className="blog-journalExperienceFooter">
        <Tag className="blog-passBadge">{experience.passLabel}</Tag>
        <Button className="blog-secondaryButton" href="/partners">
          View Venue
        </Button>
      </div>
    </section>
  );
}

function FeaturedEditorialPost({ post }) {
  return (
    <article className="blog-editorialPage blog-journalPage">
      <section className="blog-heroPanel blog-journalHero">
        <img
          className="blog-heroImage"
          src={post.heroImage}
          alt={post.title}
          loading="eager"
        />
        <div className="blog-heroOverlay" />
        <div className="blog-heroContent blog-journalHeroContent">
          <div className="blog-heroMetaRow">
            <Tag className="blog-heroPill">Blog</Tag>
            <Tag className="blog-heroPill">2026 Guide</Tag>
          </div>
          <Title
            level={1}
            className="blog-editorialTitle blog-editorialTitleWide"
          >
            {post.title}
          </Title>
          <Paragraph className="blog-editorialSubtitle">
            {post.heroSubtitle}
          </Paragraph>
          <div className="blog-journalMetaBar">
            <Text>{formatDate(post.publishDate)}</Text>
            <span className="blog-journalMetaDot" />
            <Text>{post.readingTime}</Text>
            <span className="blog-journalMetaDot" />
            <Text>{post.author}</Text>
          </div>
        </div>
      </section>

      <Card
        className="blog-card blog-introCard blog-journalIntroCard"
        bordered={false}
      >
        <Breadcrumb className="blog-breadcrumb">
          <Breadcrumb.Item>
            <a href="/">Ahangama</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/blogs">Blogs</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{post.shortTitle || post.title}</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[30, 30]} align="middle">
          <Col xs={24} md={14}>
            <Text className="blog-articleEyebrow">From the journal</Text>
            <Title level={2} className="blog-introTitle">
              {post.introTitle}
            </Title>
            {post.introColumns.map((paragraph) => (
              <Paragraph key={paragraph} className="blog-journalCopy">
                {paragraph}
              </Paragraph>
            ))}
          </Col>
          <Col xs={24} md={10}>
            <EditorialImage
              src={post.introImage}
              alt={post.introTitle}
              className="blog-introImage blog-journalIntroImage"
            />
          </Col>
        </Row>

        {post.pullQuote ? (
          <div className="blog-pullQuote blog-journalPullQuote">
            {post.pullQuote}
          </div>
        ) : null}
      </Card>

      <div className="blog-journalBody">
        {post.experiences.map((experience) => (
          <JournalExperienceSection
            key={experience.index}
            experience={experience}
          />
        ))}
      </div>

      <section className="blog-journalAside">
        <Text className="blog-journalAsideEyebrow">Ahangama Pass</Text>
        <Title level={3} className="blog-journalAsideTitle">
          {post.passSection.title}
        </Title>
        <Paragraph className="blog-journalCopy">
          {post.passSection.body}
        </Paragraph>
        <Paragraph className="blog-journalCopy">
          {post.passSection.supporting}
        </Paragraph>
        <Button type="link" className="blog-journalLinkButton" href="/card">
          {post.passSection.ctaLabel}
        </Button>
      </section>

      <section className="blog-journalClosing">
        <Text className="blog-journalSectionEyebrow">Closing thought</Text>
        <Title level={2} className="blog-journalSectionTitle">
          {post.closingSection.title}
        </Title>
        {post.closingSection.body.map((paragraph) => (
          <Paragraph key={paragraph} className="blog-journalCopy">
            {paragraph}
          </Paragraph>
        ))}
        <div className="blog-journalClosingActions">
          <Button className="blog-primaryButton" href="/">
            {post.closingSection.ctaLabel}
          </Button>
          <Button className="blog-secondaryButton" href="/blogs">
            More articles
          </Button>
        </div>
      </section>

      <footer className="blog-editorialFooter blog-journalFooter">
        <Text className="blog-footerBrand">Ahangama.com</Text>
        <div className="blog-footerLinks">
          {post.footerLinks.map((link) => (
            <a key={link.label} href={link.href} className="blog-footerLink">
              {link.label}
            </a>
          ))}
        </div>
      </footer>
    </article>
  );
}

function StorySection({ section }) {
  const layoutClass = `blog-storySection blog-storySection--${section.layout}`;

  return (
    <section className={layoutClass}>
      {section.image ? (
        <div className="blog-storyMedia">
          <EditorialImage src={section.image} alt={section.title} />
        </div>
      ) : null}

      <div className="blog-storyBody">
        <Text className="blog-articleEyebrow">{section.eyebrow}</Text>
        <Title level={2} className="blog-storyTitle">
          {section.title}
        </Title>

        {section.paragraphs.map((paragraph) => (
          <Paragraph key={paragraph} className="blog-sectionCopy">
            {paragraph}
          </Paragraph>
        ))}

        {section.quote ? (
          <blockquote className="blog-storyQuote">{section.quote}</blockquote>
        ) : null}

        {section.stats?.length ? (
          <div className="blog-storyStats">
            {section.stats.map((stat) => (
              <div key={stat} className="blog-storyStatCard">
                {stat}
              </div>
            ))}
          </div>
        ) : null}

        {section.gallery?.length ? (
          <div className="blog-storyGallery">
            {section.gallery.map((item) => (
              <figure key={item.label} className="blog-storyGalleryItem">
                <EditorialImage src={item.image} alt={item.label} />
                <figcaption>{item.label}</figcaption>
              </figure>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function JournalStorySection({ section }) {
  return (
    <section className="blog-journalSection">
      <Text className="blog-journalSectionEyebrow">{section.eyebrow}</Text>
      <Title level={2} className="blog-journalSectionTitle">
        {section.title}
      </Title>

      {section.videoUrl ? (
        <figure className="blog-journalFigure blog-journalVideoFigure">
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
        <figure className="blog-journalFigure">
          <EditorialImage src={section.image} alt={section.title} />
        </figure>
      ) : null}

      {section.paragraphs.map((paragraph) => (
        <Paragraph key={paragraph} className="blog-journalCopy">
          {paragraph}
        </Paragraph>
      ))}

      {section.quote ? (
        <blockquote className="blog-journalQuote">{section.quote}</blockquote>
      ) : null}

      {section.stats?.length ? (
        <div className="blog-journalNotes">
          <Text className="blog-journalNotesLabel">Scene notes</Text>
          <p className="blog-journalNotesCopy">{section.stats.join(" · ")}</p>
        </div>
      ) : null}

      {section.featuredPlaces?.length ? (
        <div className="blog-journalPlaces">
          <Text className="blog-journalNotesLabel">Places featured</Text>
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
        <div className="blog-journalGallery">
          {section.gallery.map((item) => (
            <figure key={item.label} className="blog-journalGalleryItem">
              <EditorialImage src={item.image} alt={item.label} />
              <figcaption>{item.label}</figcaption>
            </figure>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function CoastalTownEditorialPost({ post }) {
  return (
    <article className="blog-editorialPage blog-journalPage">
      <section className="blog-heroPanel blog-journalHero">
        <img
          className="blog-heroImage"
          src={post.heroImage}
          alt={post.title}
          loading="eager"
        />
        <div className="blog-heroOverlay" />
        <div className="blog-heroContent blog-journalHeroContent">
          <div className="blog-heroMetaRow">
            <Tag className="blog-heroPill">Blog</Tag>
            <Tag className="blog-heroPill">Ahangama Journal</Tag>
          </div>
          <Title
            level={1}
            className="blog-editorialTitle blog-editorialTitleWide"
          >
            {post.title}
          </Title>
          <Paragraph className="blog-editorialSubtitle">
            {post.heroSubtitle}
          </Paragraph>
          <div className="blog-journalMetaBar">
            <Text>{formatDate(post.publishDate)}</Text>
            <span className="blog-journalMetaDot" />
            <Text>{post.readingTime}</Text>
            <span className="blog-journalMetaDot" />
            <Text>{post.author}</Text>
          </div>
        </div>
      </section>

      <Card
        className="blog-card blog-introCard blog-journalIntroCard"
        bordered={false}
      >
        <Breadcrumb className="blog-breadcrumb">
          <Breadcrumb.Item>
            <a href="/">Ahangama</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/blogs">Blogs</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{post.shortTitle || post.title}</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[30, 30]} align="middle">
          <Col xs={24} md={14}>
            <Text className="blog-articleEyebrow">From the journal</Text>
            <Title level={2} className="blog-introTitle">
              {post.introTitle}
            </Title>
            {post.introColumns.map((paragraph) => (
              <Paragraph key={paragraph} className="blog-journalCopy">
                {paragraph}
              </Paragraph>
            ))}
          </Col>
          <Col xs={24} md={10}>
            <EditorialImage
              src={post.introImage}
              alt={post.introTitle}
              className="blog-introImage blog-journalIntroImage"
            />
          </Col>
        </Row>

        <div className="blog-pullQuote blog-journalPullQuote">
          {post.pullQuote}
        </div>
      </Card>

      <div className="blog-journalBody">
        {post.storySections.map((section) => (
          <JournalStorySection key={section.title} section={section} />
        ))}
      </div>

      <section className="blog-journalAside">
        <Text className="blog-journalAsideEyebrow">Ahangama Pass</Text>
        <Title level={3} className="blog-journalAsideTitle">
          {post.passSection.title}
        </Title>
        <Paragraph className="blog-journalCopy">
          {post.passSection.body}
        </Paragraph>
        <Paragraph className="blog-journalCopy">
          {post.passSection.supporting}
        </Paragraph>
        <Button type="link" className="blog-journalLinkButton" href="/card">
          {post.passSection.ctaLabel}
        </Button>
      </section>

      <section className="blog-journalClosing">
        <Text className="blog-journalSectionEyebrow">Closing thought</Text>
        <Title level={2} className="blog-journalSectionTitle">
          {post.closingSection.title}
        </Title>
        {post.closingSection.body.map((paragraph) => (
          <Paragraph key={paragraph} className="blog-journalCopy">
            {paragraph}
          </Paragraph>
        ))}
        <div className="blog-journalClosingActions">
          <Button className="blog-primaryButton" href="/">
            {post.closingSection.ctaLabel}
          </Button>
          <Button className="blog-secondaryButton" href="/blogs">
            More articles
          </Button>
        </div>
      </section>

      <footer className="blog-editorialFooter blog-journalFooter">
        <Text className="blog-footerBrand">Ahangama.com</Text>
        <div className="blog-footerLinks">
          {post.footerLinks.map((link) => (
            <a key={link.label} href={link.href} className="blog-footerLink">
              {link.label}
            </a>
          ))}
        </div>
      </footer>
    </article>
  );
}

function StandardBlogPost({ activePost }) {
  return (
    <article>
      <Card className="blog-card blog-heroCard" bordered={false}>
        <Breadcrumb style={{ marginBottom: 18 }}>
          <Breadcrumb.Item>
            <a href="/">Ahangama</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/blogs">Blogs</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{activePost.title}</Breadcrumb.Item>
        </Breadcrumb>

        <Text className="blog-articleEyebrow">{activePost.category}</Text>
        <Title level={1} className="blog-articleTitle">
          {activePost.title}
        </Title>
        <Paragraph className="blog-articleCopy">{activePost.excerpt}</Paragraph>

        <div className="blog-pillRow">
          <Tag className="blog-pill">{formatDate(activePost.publishDate)}</Tag>
          <Tag className="blog-pill">{activePost.readingTime}</Tag>
          <Tag className="blog-pill">{activePost.author}</Tag>
        </div>
      </Card>

      {activePost.sections.map((section, index) => (
        <section key={section.heading} className="blog-section">
          <Card className="blog-card blog-sectionCard" bordered={false}>
            <Text className="blog-articleEyebrow">Section {index + 1}</Text>
            <Title level={2} className="blog-sectionTitle">
              {section.heading}
            </Title>

            {section.paragraphs.map((paragraph) => (
              <Paragraph key={paragraph} className="blog-sectionCopy">
                {paragraph}
              </Paragraph>
            ))}

            {section.bullets?.length ? (
              <ul className="blog-bulletList">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </Card>
        </section>
      ))}
    </article>
  );
}

function PlainStoryPost({ post }) {
  return (
    <article>
      <Card className="blog-card blog-heroCard" bordered={false}>
        <Breadcrumb style={{ marginBottom: 18 }}>
          <Breadcrumb.Item>
            <a href="/">Ahangama</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/blogs">Blogs</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{post.title}</Breadcrumb.Item>
        </Breadcrumb>

        <Text className="blog-articleEyebrow">{post.category}</Text>
        <Title level={1} className="blog-articleTitle">
          {post.title}
        </Title>
        <Paragraph className="blog-articleCopy">{post.excerpt}</Paragraph>

        <div className="blog-pillRow">
          <Tag className="blog-pill">{formatDate(post.publishDate)}</Tag>
          <Tag className="blog-pill">{post.readingTime}</Tag>
          <Tag className="blog-pill">{post.author}</Tag>
        </div>
      </Card>

      <section className="blog-section">
        <Card className="blog-card blog-sectionCard" bordered={false}>
          {post.bodyParagraphs.map((paragraph) => (
            <Paragraph key={paragraph} className="blog-sectionCopy">
              {paragraph}
            </Paragraph>
          ))}

          {post.visitTitle ? (
            <>
              <Title level={3} className="blog-sectionTitle">
                {post.visitTitle}
              </Title>

              {post.visitDetails.map((line) => (
                <Paragraph key={line} className="blog-sectionCopy">
                  {line}
                </Paragraph>
              ))}
            </>
          ) : null}
        </Card>
      </section>
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
        <Paragraph className="blog-featureIntro">{post.bodyParagraphs[0]}</Paragraph>

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
            <Button type="primary" icon={<ArrowLeftOutlined />} href="/blogs">
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
          <PlainStoryPost post={activePost} />
        ) : activePost.editorialType === "coastal-town-story" ||
          activePost.editorialType === "perfect-day-story" ? (
          <CoastalTownEditorialPost post={activePost} />
        ) : activePost.experiences ? (
          <FeaturedEditorialPost post={activePost} />
        ) : (
          <StandardBlogPost activePost={activePost} />
        )}
      </BlogWorkspaceLayout>
    </>
  );
}
