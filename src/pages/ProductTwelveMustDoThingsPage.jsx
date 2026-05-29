import React from "react";
import { Card, Col, Divider, List, Row, Space, Tag, Typography, Button } from "antd";
import { CompassOutlined, ReadOutlined, StarOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ProductsWorkspaceLayout from "../components/products/ProductsWorkspaceLayout";
import { PRODUCTS_CATALOG } from "../data/productsCatalog";

const { Paragraph, Text, Title } = Typography;

const sections = [
  { id: "overview", label: "Overview", hint: "What this product is" },
  { id: "guide", label: "Guide", hint: "12 must-do experiences" },
  { id: "who", label: "Who it’s for", hint: "Best-fit travelers" },
  { id: "how", label: "How it works", hint: "Use the shortlist" },
  { id: "pricing", label: "Pricing", hint: "$49–79 USD" },
];

const whoFor = [
  "First-time visitors who want a clear plan",
  "Short stays where you need the best picks fast",
  "Anyone who prefers curated experiences over endless scrolling",
];

const howSteps = [
  "Start at the Master Index to browse recommended experiences.",
  "Pick 2–4 experiences per day (mix food + wellness + activity).",
  "Use the map or category pages to find what’s nearby.",
];

export default function ProductTwelveMustDoThingsPage() {
  return (
    <>
      <Seo
        title="12 Must Do Things in Ahangama"
        description="A curated shortlist that anchors the Ahangama discovery experience."
        canonical={absUrl("/product/12-must-do-things")}
      />

      <ProductsWorkspaceLayout
        products={PRODUCTS_CATALOG}
        sections={sections}
        status="Experience bundle"
        lastUpdated="May 2026"
      >
        <section id="overview" className="concept-section">
          <Card className="concept-card concept-heroCard" bordered={false}>
            <div className="concept-heroGrid">
              <div>
                <Text className="concept-heroEyebrow">12 Must Do Things</Text>
                <Title className="concept-heroTitle">
                  The curated Ahangama experience bundle.
                </Title>
                <Paragraph className="concept-bodyCopy concept-heroParagraph">
                  A premium experience product inspired by city attraction
                  passes — bundling the best activities, wellness, food,
                  movement, and local culture into one curated package.
                </Paragraph>
                <Space wrap>
                  <Tag className="concept-pill">Curated</Tag>
                  <Tag className="concept-pill">Bundle</Tag>
                  <Tag className="concept-pill">Best of Ahangama</Tag>
                </Space>
              </div>

              <div className="concept-focusPanel">
                <Text className="concept-focusLabel">Primary outcome</Text>
                <Title level={4} className="concept-focusTitle">
                  Know what to do next
                </Title>
                <div className="concept-focusList">
                  <div className="concept-focusItem">
                    <StarOutlined />
                    <span>Less research, better picks</span>
                  </div>
                  <div className="concept-focusItem">
                    <CompassOutlined />
                    <span>See what’s nearby</span>
                  </div>
                  <div className="concept-focusItem">
                    <ReadOutlined />
                    <span>Use categories + map</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section id="guide" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">Guide</Text>
            <Title level={2} className="concept-sectionTitle">
              12 Must-Do Experiences in Ahangama
            </Title>

            <Title level={4} className="concept-focusTitle">
              A Curated Guide to Modern Sri Lankan Island Life
            </Title>

            <Paragraph className="concept-bodyCopy">
              There’s a reason travelers from around the world keep finding
              themselves in Ahangama.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              What was once a quiet surf town on Sri Lanka’s southern coast has
              evolved into something far more interesting — a place where
              wellness, creativity, surf culture, slow living, design, food,
              and community all blend together into a unique rhythm of island
              life.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              But the best parts of Ahangama aren’t always obvious.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              They exist in hidden cafés tucked behind jungle roads, early
              morning wellness rituals, conversations with locals, long sunset
              evenings, creative spaces, quiet rivers, roadside tea stops, and
              experiences that feel deeply personal rather than manufactured
              for tourism.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              That’s exactly why we created the Ahangama Pass.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              Not simply as a discount card — but as a curated gateway into the
              experiences, people, and places that define modern coastal Sri
              Lanka.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              From Pilates sessions and tuk-tuk adventures to cooking with Amma
              in a traditional village kitchen, these are the 12 must-do
              experiences in Ahangama.
            </Paragraph>

            <Divider />

            <Title level={3} className="concept-sectionTitle">
              1. Reset Your Body at Pura Pilates
            </Title>
            <Paragraph className="concept-bodyCopy">
              Start your mornings slowly at Pura Pilates — one of Ahangama’s
              most calming wellness spaces.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              Surrounded by tropical greenery and natural light, the studio
              offers reformer and mat pilates sessions designed to strengthen,
              restore, and rebalance the body after long travel days, surf
              sessions, or simply too much time sitting behind a laptop.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              More than just a workout, this is part of Ahangama’s growing
              wellness culture — mindful movement, slow mornings, and
              intentional living.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              With the Ahangama Pass, you unlock exclusive pricing along with
              complimentary collectible postcards to remember the experience
              long after your trip ends.
            </Paragraph>

            <Divider />

            <Title level={3} className="concept-sectionTitle">
              2. Explore the South Coast by Tuk-Tuk with GIK Bike Rentals
            </Title>
            <Paragraph className="concept-bodyCopy">
              There may be no better way to experience Ahangama than driving
              your own tuk-tuk through the south coast.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">No schedules. No rush.</Paragraph>
            <Paragraph className="concept-bodyCopy">
              Just hidden cafés, beach roads, rice fields, surf breaks, roadside
              fruit stalls, and spontaneous discoveries around every corner.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              The self-drive tuk-tuk adventure by GIK Bike Rentals transforms
              transportation into part of the experience itself.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              Along the way, travelers can unlock collectible tea tins,
              postcards, and curated partner experiences through the Ahangama
              Pass — turning the journey into an island-wide discovery trail.
            </Paragraph>

            <Divider />

            <Title level={3} className="concept-sectionTitle">
              3. Play Pickleball at Coconut Court
            </Title>
            <Paragraph className="concept-bodyCopy">
              Pickleball has quietly become one of Ahangama’s most social
              rituals.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              At Coconut Court, travelers and locals gather for relaxed yet
              energetic games surrounded by palm trees and tropical atmosphere.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              It’s fun, beginner-friendly, and unexpectedly addictive.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              More importantly, it captures something central to Ahangama
              itself — connection.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              The Ahangama Pass enhances the experience with exclusive savings
              and collectible rewards, making it one of the most social and
              memorable activities on the south coast.
            </Paragraph>

            <Divider />

            <Title level={3} className="concept-sectionTitle">
              4. Recover with Sauna & Ice Baths at Frosty’s
            </Title>
            <Paragraph className="concept-bodyCopy">
              Wellness in Ahangama goes beyond massages and yoga.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              At Frosty’s, travelers experience contrast therapy through sauna
              and ice bath sessions designed to improve recovery, mental
              clarity, and physical reset.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              Whether you’ve spent the day surfing, traveling, or simply
              unwinding from busy city life, the combination of heat and cold
              immersion creates a grounding ritual that has become increasingly
              popular among the global wellness community.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              This is modern island wellness at its best.
            </Paragraph>

            <Divider />

            <Title level={3} className="concept-sectionTitle">
              5. Cook Traditional Sri Lankan Food at Kumbuk Kitchen
            </Title>
            <Paragraph className="concept-bodyCopy">
              Some of the most meaningful travel experiences happen around
              food.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              At Kumbuk Kitchen, guests are welcomed into a traditional clay
              kitchen where cooking becomes a window into Sri Lankan culture,
              farming, storytelling, and family traditions.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              Prepare authentic curries, roti, sambols, and local desserts using
              fresh ingredients sourced locally and from the surrounding
              gardens.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              This isn’t a commercial cooking class.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              It’s an intimate cultural experience rooted in hospitality and
              connection.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              The Ahangama Pass includes exclusive savings along with curated
              gifts including tea tins and tote bags inspired by Sri Lankan
              island culture.
            </Paragraph>

            <Divider />

            <Title level={3} className="concept-sectionTitle">
              6. Slow Down with a Spa Experience at Spa Station Midigama
            </Title>
            <Paragraph className="concept-bodyCopy">
              Tucked beside jungle greenery near Midigama’s famous surf breaks,
              Spa Station offers a peaceful escape from the heat and movement
              of the south coast.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">Here, the focus is simple:</Paragraph>
            <Paragraph className="concept-bodyCopy">
              slow down.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              Relaxing massages, aromatherapy, tropical surroundings, and
              calming energy make this one of the most restorative wellness
              experiences in the region.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              Perfect after surf sessions, travel days, or simply long
              afternoons in the sun.
            </Paragraph>

            <Divider />

            <Title level={3} className="concept-sectionTitle">
              7. Discover the Backwaters with Sanjeewa’s River Safari
            </Title>
            <Paragraph className="concept-bodyCopy">
              Far from the beaches and cafés lies another side of southern Sri
              Lanka.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              Quiet rivers. Mangroves. Birdlife. Golden sunsets. Stillness.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              Sanjeewa’s handcrafted river journeys through the Polwatta River
              reconnect travelers with the slower rhythm of the island.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              The experience feels deeply grounding — a reminder that some of
              the most unforgettable parts of travel are often the quietest.
            </Paragraph>

            <Divider />

            <Title level={3} className="concept-sectionTitle">
              8. Get Creative at Palm & Paint Kabalana
            </Title>
            <Paragraph className="concept-bodyCopy">
              Ahangama’s creative energy continues to attract artists,
              designers, photographers, and makers from around the world.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              Palm & Paint captures that spirit through relaxed art sessions
              where guests can paint tote bags, jewelry dishes, and
              tropical-inspired keepsakes.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              No pressure. No experience needed.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              Just creativity, conversation, and slow island afternoons.
            </Paragraph>

            <Divider />

            <Title level={3} className="concept-sectionTitle">
              9. Work Remotely at Living Room Ahangama
            </Title>
            <Paragraph className="concept-bodyCopy">
              Ahangama has quietly become one of the world’s emerging remote-
              work destinations.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              At Living Room Ahangama, coworking blends seamlessly with
              tropical lifestyle, design culture, and creative community.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              Work during the day. Surf at sunset. Meet people from around the
              world.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              The space combines productivity with island living in a way that
              perfectly reflects the evolution of modern travel.
            </Paragraph>

            <Divider />

            <Title level={3} className="concept-sectionTitle">
              10. Discover Coastal Design at YIVA Essentials
            </Title>
            <Paragraph className="concept-bodyCopy">
              YIVA Essentials represents the creative and aesthetic side of
              Ahangama.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              Inside the concept store, travelers discover curated fashion,
              design pieces, island-inspired products, and lifestyle essentials
              that reflect the growing creative culture of Sri Lanka’s south
              coast.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              It’s less about shopping and more about taking home a piece of
              the island’s visual identity.
            </Paragraph>

            <Divider />

            <Title level={3} className="concept-sectionTitle">
              11. Experience Sunset Energy at Hakuna Matata
            </Title>
            <Paragraph className="concept-bodyCopy">
              As the sun begins to fall over the Indian Ocean, Ahangama
              transforms.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              Music gets louder. The beaches glow gold. People gather for
              cocktails, conversation, and long tropical evenings.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              Hakuna Matata captures this energy perfectly — combining oceanfront
              sunsets, beach culture, music, and laid-back social atmosphere
              into one of Ahangama’s most iconic sunset experiences.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              This is where strangers become friends and where nights often
              extend longer than planned.
            </Paragraph>

            <Divider />

            <Title level={3} className="concept-sectionTitle">
              12. Unlock the Rhythm of Island Life with the Ahangama Pass
            </Title>
            <Paragraph className="concept-bodyCopy">
              The Ahangama Pass is designed to connect all these experiences
              together.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              Not simply through savings — but through discovery.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">It acts as your gateway into:</Paragraph>
            <List
              dataSource={[
                "curated wellness experiences",
                "hidden local discoveries",
                "creative communities",
                "tropical rituals",
                "cultural moments",
                "modern island living",
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
              className="concept-strategyList"
            />
            <Paragraph className="concept-bodyCopy">
              Whether you’re visiting Sri Lanka for a week or staying for months,
              the Ahangama Pass helps you experience the south coast more deeply,
              more seamlessly, and more meaningfully.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              Because the best parts of Ahangama are rarely found by accident.
            </Paragraph>
            <Paragraph className="concept-bodyCopy">
              They’re unlocked slowly — one experience at a time.
            </Paragraph>
          </Card>
        </section>

        <section id="who" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">Who it’s for</Text>
            <Title level={2} className="concept-sectionTitle">
              Best fit
            </Title>
            <List
              dataSource={whoFor}
              renderItem={(item) => <List.Item>{item}</List.Item>}
              className="concept-strategyList"
            />
          </Card>
        </section>

        <section id="how" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">How it works</Text>
            <Title level={2} className="concept-sectionTitle">
              A simple flow
            </Title>
            <Row gutter={[16, 16]}>
              {howSteps.map((step) => (
                <Col xs={24} md={8} key={step}>
                  <div className="concept-strategyChannel">
                    <CompassOutlined />
                    <span>{step}</span>
                  </div>
                </Col>
              ))}
            </Row>
            <Divider />
            <Paragraph className="concept-bodyCopy">
              If you want discounts and partner perks, you can also explore the
              paid pass options.
            </Paragraph>
            <Space wrap>
              <Link to="/card" style={{ textDecoration: "none" }}>
                <Button type="default">Paid Pass Options</Button>
              </Link>
              <Link to="/map" style={{ textDecoration: "none" }}>
                <Button type="default">Open Map</Button>
              </Link>
            </Space>
          </Card>
        </section>

        <section id="pricing" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">Pricing</Text>
            <Title level={2} className="concept-sectionTitle">
              $49–79 USD
            </Title>
            <Paragraph className="concept-bodyCopy">
              The bundle is designed as a curated package with exclusive
              pricing across multiple partner venues.
            </Paragraph>
          </Card>
        </section>

      </ProductsWorkspaceLayout>
    </>
  );
}
