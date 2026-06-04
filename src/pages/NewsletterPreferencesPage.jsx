import React, { useEffect, useState } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Grid, Input, Radio, Space, Typography } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { updateNewsletterSubscriberPreferences } from "../services/newsletter";

const { Paragraph, Text, Title } = Typography;
const { useBreakpoint } = Grid;

const SERIF_FONT = '"Cormorant Garamond", "Libre Baskerville", Georgia, serif';

const AUDIENCE_OPTIONS = [
  "I live in Ahangama",
  "I’m Sri Lankan / local and visit often",
  "I’m currently visiting Ahangama",
  "I’m planning to visit soon",
  "I’m interested in Ahangama / Sri Lanka",
];

const INTEREST_OPTIONS = [
  "Food & cafés",
  "Surf",
  "Wellness",
  "Events",
  "Places to stay",
  "Local deals",
];

export default function NewsletterPreferencesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const email = (searchParams.get("email") || "").trim().toLowerCase();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  async function handleSubmit(values) {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await updateNewsletterSubscriberPreferences({
        email,
        name: values.name,
        audienceType: values.audienceType,
        interests: values.interests,
      });

      setIsComplete(true);
    } catch (error) {
      console.error("newsletter preferences submit error:", error);
      setSubmitError(
        error.message || "Unable to save your preferences right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      <Seo
        title="Newsletter Preferences | The Ahangama Dispatch"
        description="Tell us a little more about yourself so The Ahangama Dispatch can send more relevant local recommendations, openings and editorial notes."
        canonical={absUrl("/newsletter/preferences")}
      />

      <section
        style={{
          padding: "12px 0 32px",
        }}
      >
        <div
          style={{
            maxWidth: 860,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 28,
              padding: isMobile ? 24 : 40,
              border: "1px solid rgba(15, 92, 107, 0.1)",
              boxShadow: "0 20px 48px rgba(15, 92, 107, 0.08)",
            }}
          >
            <Text
              style={{
                display: "block",
                marginBottom: 12,
                color: "#207886",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.8,
                textTransform: "uppercase",
              }}
            >
              The Ahangama Dispatch
            </Text>
            <Title
              level={1}
              style={{
                margin: 0,
                color: "#123942",
                fontFamily: SERIF_FONT,
                fontSize: isMobile ? 38 : 48,
                lineHeight: 0.98,
              }}
            >
              A few details, then you’re in.
            </Title>
            <Paragraph
              style={{
                maxWidth: 620,
                marginTop: 18,
                marginBottom: 0,
                color: "#4E666B",
                fontSize: 17,
                lineHeight: 1.8,
              }}
            >
              Tell us a little about your connection to Ahangama so we can send
              sharper recommendations, new openings and genuinely useful local notes.
            </Paragraph>

            {!email ? (
              <div
                style={{
                  marginTop: 28,
                  padding: 24,
                  borderRadius: 22,
                  background: "#E7DFD1",
                }}
              >
                <Title
                  level={4}
                  style={{ marginTop: 0, color: "#123942", fontFamily: SERIF_FONT }}
                >
                  Missing subscription email
                </Title>
                <Paragraph style={{ marginBottom: 18, color: "#4E666B" }}>
                  Start from the homepage newsletter form first so we can create your
                  subscription record before saving preferences.
                </Paragraph>
                <Button type="primary" size="large" onClick={() => navigate("/")}
                  style={{
                    height: 48,
                    borderRadius: 999,
                    paddingInline: 24,
                    background: "#0F5C6B",
                    borderColor: "#0F5C6B",
                    boxShadow: "none",
                  }}
                >
                  Return Home
                </Button>
              </div>
            ) : isComplete ? (
              <div
                style={{
                  marginTop: 30,
                  padding: 28,
                  borderRadius: 24,
                  background: "#FFFFFF",
                  border: "1px solid rgba(15, 92, 107, 0.1)",
                }}
              >
                <Text
                  style={{
                    display: "block",
                    marginBottom: 10,
                    color: "#207886",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1.8,
                    textTransform: "uppercase",
                  }}
                >
                  Subscription confirmed
                </Text>
                <Title
                  level={2}
                  style={{
                    marginTop: 0,
                    marginBottom: 12,
                    color: "#123942",
                    fontFamily: SERIF_FONT,
                  }}
                >
                  You’re all set. Welcome to The Ahangama Dispatch.
                </Title>
                <Paragraph style={{ maxWidth: 560, color: "#4E666B", fontSize: 16 }}>
                  We’ll keep it thoughtful: local recommendations, new openings,
                  editorial notes and practical guidance from Ahangama.
                </Paragraph>
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  onClick={() => navigate("/")}
                  style={{
                    height: 50,
                    borderRadius: 999,
                    paddingInline: 24,
                    background: "#0F5C6B",
                    borderColor: "#0F5C6B",
                    boxShadow: "none",
                  }}
                >
                  Explore Ahangama
                </Button>
              </div>
            ) : (
              <>
                <div
                  style={{
                    marginTop: 24,
                    marginBottom: 18,
                    padding: "14px 16px",
                    borderRadius: 18,
                    background: "rgba(136, 174, 181, 0.12)",
                  }}
                >
                  <Text style={{ color: "#123942", fontSize: 14 }}>
                    Signing up as <strong>{email}</strong>
                  </Text>
                </div>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  style={{ marginTop: 8 }}
                >
                  <Form.Item
                    label={<span style={{ color: "#123942", fontWeight: 600 }}>Name</span>}
                    name="name"
                    rules={[{ required: true, message: "Please enter your name" }]}
                  >
                    <Input
                      size="large"
                      placeholder="Your name"
                      style={{
                        height: 52,
                        borderRadius: 18,
                        borderColor: "rgba(15, 92, 107, 0.16)",
                        paddingInline: 16,
                      }}
                    />
                  </Form.Item>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile
                        ? "1fr"
                        : "minmax(0, 1fr) minmax(0, 1fr)",
                      gap: isMobile ? 0 : 32,
                      alignItems: "start",
                    }}
                  >
                    <Form.Item
                      label={
                        <span style={{ color: "#123942", fontWeight: 600 }}>
                          Which best describes you?
                        </span>
                      }
                      name="audienceType"
                      rules={[{ required: true, message: "Please choose one option" }]}
                    >
                      <Radio.Group>
                        <Space direction="vertical" size={12} style={{ width: "100%" }}>
                          {AUDIENCE_OPTIONS.map((option) => (
                            <label
                              key={option}
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                color: "#123942",
                                cursor: "pointer",
                              }}
                            >
                              <Radio value={option}>{option}</Radio>
                            </label>
                          ))}
                        </Space>
                      </Radio.Group>
                    </Form.Item>

                    <Form.Item
                      label={
                        <span style={{ color: "#123942", fontWeight: 600 }}>
                          What are you most interested in?
                        </span>
                      }
                      name="interests"
                      rules={[
                        {
                          validator: async (_, value) => {
                            if (Array.isArray(value) && value.length) {
                              return;
                            }

                            throw new Error("Please choose at least one interest");
                          },
                        },
                      ]}
                    >
                      <Checkbox.Group style={{ width: "100%" }}>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: isMobile
                              ? "1fr"
                              : "repeat(2, minmax(0, 1fr))",
                            gap: 12,
                          }}
                        >
                          {INTEREST_OPTIONS.map((option) => (
                            <label
                              key={option}
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                color: "#123942",
                                cursor: "pointer",
                              }}
                            >
                              <Checkbox value={option}>{option}</Checkbox>
                            </label>
                          ))}
                        </div>
                      </Checkbox.Group>
                    </Form.Item>
                  </div>

                  {submitError ? (
                    <Paragraph style={{ color: "#A6452C", marginBottom: 18 }}>
                      {submitError}
                    </Paragraph>
                  ) : null}

                  <Button
                    htmlType="submit"
                    type="primary"
                    size="large"
                    loading={isSubmitting}
                    style={{
                      height: 52,
                      borderRadius: 999,
                      paddingInline: 26,
                      background: "#0F5C6B",
                      borderColor: "#0F5C6B",
                      boxShadow: "none",
                      fontWeight: 600,
                    }}
                  >
                    Save Preferences
                  </Button>
                </Form>
              </>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}