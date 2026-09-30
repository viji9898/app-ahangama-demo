import React from "react";
import { ArrowRightOutlined, MailOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import "../styles/diversity-and-inclusion.css";

const { Paragraph, Text, Title } = Typography;

export const DIVERSITY_AND_INCLUSION_PATH = "/diversity-and-inclusion";

const DESCRIPTION =
  "How Ahangama.com approaches diversity, inclusion, fair participation and responsibility to the wider Ahangama community.";
const OG_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/ogimage-diversity-and-inclusion+.jpeg";

const expectations = [
  "Treat people fairly and respectfully.",
  "Avoid discrimination, harassment and hate speech.",
  "Respect Sri Lankan laws, local customs and the surrounding community.",
  "Be properly registered with the relevant authorities.",
  "Hold all licences, permits and approvals required to operate their business.",
  "Complete required statutory filings, including annual returns where applicable.",
  "Declare their income accurately and pay all taxes lawfully due.",
  "Conduct their activities responsibly and honestly.",
  "Avoid behaviour that causes demonstrable harm to people, the community or the local environment.",
];

function PolicySection({ number, title, children }) {
  return (
    <section
      className="diversity-section"
      aria-labelledby={`diversity-section-${number}`}
    >
      <Text className="diversity-sectionNumber">{number}</Text>
      <div className="diversity-sectionBody">
        <Title level={2} id={`diversity-section-${number}`}>
          {title}
        </Title>
        {children}
      </div>
    </section>
  );
}

export default function DiversityAndInclusionPage() {
  const canonical = absUrl(DIVERSITY_AND_INCLUSION_PATH);

  return (
    <SiteLayout>
      <Seo
        title="Diversity, Inclusion and Community Responsibility"
        description={DESCRIPTION}
        canonical={canonical}
        ogImage={OG_IMAGE}
      />

      <main className="diversity-page">
        <header className="diversity-hero">
          <div className="diversity-heroInner">
            <Text className="diversity-eyebrow">Our public commitment</Text>
            <Title level={1}>
              Diversity, Inclusion and Community Responsibility
            </Title>
            <Paragraph className="diversity-heroSummary">
              A clear statement of how Ahangama.com approaches participation,
              concerns and responsibility to the wider community.
            </Paragraph>
          </div>
        </header>

        <div className="diversity-content">
          <PolicySection number="01" title="What Ahangama.com Is Building">
            <Paragraph>
              Ahangama.com is an independent destination and community platform
              created to help people discover Ahangama while supporting the
              people and businesses that make it special.
            </Paragraph>
            <Paragraph>
              We work with local residents, business owners, hospitality
              operators, community organisations and public bodies to promote
              Ahangama responsibly, share useful information and contribute to a
              welcoming, connected and sustainable destination.
            </Paragraph>
            <Paragraph>
              Our platform brings together a diverse community of Sri Lankans,
              international residents, visitors and entrepreneurs. We believe
              this diversity strengthens Ahangama and should be approached with
              openness, mutual respect and shared responsibility.
            </Paragraph>
          </PolicySection>

          <PolicySection
            number="02"
            title="Our Commitment to Diversity and Inclusion"
          >
            <Paragraph>
              Sri Lanka&apos;s modern history includes nearly three decades of
              civil war, during which ethnic and political divisions contributed
              to immense suffering across our country. As a Sri Lankan platform,
              we understand too well the consequences of allowing mistrust,
              exclusion and separation to grow between communities—or of using
              a person&apos;s identity to determine whether they belong.
            </Paragraph>
            <Paragraph>
              We do not refer to this history to compare different conflicts,
              dismiss present-day suffering or discourage legitimate criticism.
              Instead, it reinforces our responsibility to resist discrimination,
              encourage dialogue and treat every person with fairness and
              humanity.
            </Paragraph>
            <Paragraph className="diversity-leadQuote">
              For us, acceptance and tolerance do not mean indifference to
              suffering or injustice. They mean refusing to answer division with
              further division. Guided by the principle that hatred cannot
              overcome hatred, we seek to approach difficult issues with
              compassion, wisdom and fairness.
            </Paragraph>
            <Paragraph>
              Ahangama.com will not exclude a person or business solely because
              of nationality, ethnicity, religion, cultural background or
              assumed political beliefs. Businesses featured on our platform are
              assessed according to their conduct, the services they provide
              and how they treat their customers, employees, neighbours and the
              wider community.
            </Paragraph>
            <Paragraph>
              Inclusion on Ahangama.com does not represent an endorsement of
              every personal, religious or political belief held by the owners,
              employees or customers of a listed business.
            </Paragraph>
            <Text className="diversity-listIntro">
              We expect businesses and individuals participating in our platform
              to:
            </Text>
            <ul className="diversity-expectations">
              {expectations.map((expectation) => (
                <li key={expectation}>{expectation}</li>
              ))}
            </ul>
          </PolicySection>

          <PolicySection number="03" title="Raising a Concern">
            <Paragraph>
              We recognise that we may not always have complete information
              about every person or business included on our platform.
            </Paragraph>
            <Paragraph>
              If you have a credible concern that a featured business is
              discriminating against others, exploiting people, engaging in
              harmful or unlawful conduct, or negatively affecting the Ahangama
              community, we would like to hear from you.
            </Paragraph>

            <div className="diversity-contactBand">
              <MailOutlined aria-hidden="true" />
              <div>
                <Text>Share specific details and relevant evidence</Text>
                <a href="mailto:hello@ahangama.com">
                  hello@ahangama.com <ArrowRightOutlined aria-hidden="true" />
                </a>
              </div>
            </div>

            <Paragraph>
              We will consider concerns carefully, fairly and without prejudice.
              Where appropriate, we may seek further information, speak with the
              relevant parties, correct inaccurate information, or suspend or
              remove a business from the platform.
            </Paragraph>
            <Paragraph>
              We will not make decisions based solely on rumours,
              generalisations, nationality, ethnicity, religion or assumptions
              about a person's political views.
            </Paragraph>
          </PolicySection>

          <PolicySection number="04" title="Our Approach">
            <Paragraph>
              Ahangama is home to people with different histories, identities,
              beliefs and perspectives. We may not always agree, but
              disagreement does not remove our responsibility to listen, act
              fairly and treat one another with humanity.
            </Paragraph>
            <Paragraph className="diversity-closingStatement">
              Our aim is to help build an Ahangama in which people can
              participate without discrimination, legitimate concerns are taken
              seriously, and the wellbeing of the wider community remains
              central to our decisions.
            </Paragraph>
          </PolicySection>
        </div>
      </main>
    </SiteLayout>
  );
}
