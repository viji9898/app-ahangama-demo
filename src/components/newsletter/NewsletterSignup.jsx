import React, { useState } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Grid, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { createNewsletterSubscriber } from "../../services/newsletter";

const { Paragraph, Text, Title } = Typography;
const { useBreakpoint } = Grid;

const SERIF_FONT = '"Cormorant Garamond", "Libre Baskerville", Georgia, serif';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_LABEL = "MONTHLY LETTER";
const DEFAULT_TITLE = "The Ahangama Dispatch";
const DEFAULT_DESCRIPTION =
  "A monthly collection of local recommendations, new openings, guides and stories from Ahangama.";

export default function NewsletterSignup({
  label = DEFAULT_LABEL,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  source = "newsletter_component",
  variant = "default",
  placeholder = "Email Address",
}) {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [email, setEmail] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setSubmitError("Please enter your email address.");
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setSubmitError("Please enter a valid email address.");
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      await createNewsletterSubscriber({
        email: trimmedEmail,
        source,
      });

      setIsRedirecting(true);
      navigate(
        `/newsletter/preferences?email=${encodeURIComponent(trimmedEmail)}`,
      );
    } catch (error) {
      console.error("newsletter signup error:", error);
      setSubmitError(
        error.message || "Unable to start your subscription right now.",
      );
      setIsRedirecting(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isBusy = isSubmitting || isRedirecting;
  const buttonLabel = isRedirecting ? "Redirecting..." : "Subscribe";
  const hasLabel = Boolean(label);
  const hasTitle = Boolean(title);
  const hasDescription = Boolean(description);

  if (variant === "footer") {
    return (
      <div
        style={{
          gridColumn: isMobile ? "auto" : "1 / -1",
          marginTop: isMobile ? 0 : 8,
          padding: isMobile ? 20 : 24,
          borderRadius: 24,
          background: "rgba(255,255,255,0.42)",
          border: "1px solid rgba(32, 30, 27, 0.08)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "minmax(0, 1.15fr) minmax(420px, 0.85fr)",
            gap: isMobile ? 20 : 28,
            alignItems: isMobile ? "start" : "center",
          }}
        >
          <div>
            <Text
              style={{
                display: "block",
                marginBottom: 10,
                color: "#B08E62",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.6,
                textTransform: "uppercase",
              }}
            >
              {label}
            </Text>
            <Title
              level={3}
              style={{
                margin: 0,
                color: "#1F1D1A",
                fontFamily: SERIF_FONT,
                fontSize: isMobile ? 28 : 34,
                lineHeight: 1.08,
              }}
            >
              {title}
            </Title>
            <Paragraph
              style={{
                marginTop: 12,
                marginBottom: 0,
                color: "#6D655C",
                fontSize: 15,
                lineHeight: 1.78,
                maxWidth: isMobile ? "100%" : 520,
              }}
            >
              {description}
            </Paragraph>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: isMobile ? "stretch" : "center",
              justifyContent: isMobile ? "stretch" : "center",
            }}
          >
            <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 780 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 10,
                  alignItems: isMobile ? "stretch" : "center",
                  justifyContent: isMobile ? "stretch" : "center",
                  width: "100%",
                }}
              >
                <Input
                  size="large"
                  type="email"
                  required
                  disabled={isBusy}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={placeholder}
                  style={{
                    flex: isMobile ? "1 1 auto" : "1 1 0%",
                    width: isMobile ? "100%" : 0,
                    minWidth: 0,
                    height: 54,
                    borderRadius: 999,
                    borderColor: "rgba(32, 30, 27, 0.12)",
                    background: "rgba(255,255,255,0.9)",
                    color: "#1F1D1A",
                    paddingInline: 22,
                    boxShadow: "0 10px 24px rgba(31, 29, 26, 0.06)",
                  }}
                />
                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  loading={isBusy}
                  style={{
                    height: 54,
                    borderRadius: 999,
                    paddingInline: 30,
                    background: "#211C17",
                    borderColor: "#211C17",
                    boxShadow: "0 14px 30px rgba(33, 28, 23, 0.14)",
                    width: isMobile ? "100%" : "auto",
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                    fontWeight: 600,
                  }}
                >
                  {buttonLabel}
                </Button>
              </div>

              {submitError ? (
                <Text
                  style={{
                    display: "block",
                    marginTop: 12,
                    color: "#A6452C",
                    fontSize: 13,
                    textAlign: isMobile ? "left" : "center",
                  }}
                >
                  {submitError}
                </Text>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 0,
            alignItems: "stretch",
            width: "100%",
          }}
        >
          <Input
            size="large"
            type="email"
            required
            disabled={isBusy}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={placeholder}
            style={{
              flex: isMobile ? "1 1 auto" : "1 1 0%",
              width: isMobile ? "100%" : 0,
              minWidth: 0,
              height: 56,
              borderRadius: 0,
              borderColor: "rgba(34, 31, 28, 0.16)",
              background: "#FFFFFF",
              color: "#111111",
              paddingInline: 18,
              boxShadow: "none",
              fontFamily:
                'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          />
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            loading={isBusy}
            style={{
              height: 56,
              borderRadius: 0,
              paddingInline: 28,
              background: "#221f1c",
              borderColor: "#221f1c",
              boxShadow: "none",
              width: isMobile ? "100%" : "auto",
              flexShrink: 0,
              fontWeight: 500,
              fontFamily:
                'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            {buttonLabel} <ArrowRightOutlined />
          </Button>
        </div>

        {submitError ? (
          <Text
            style={{
              display: "block",
              marginTop: 12,
              color: "#A6452C",
              fontSize: 13,
              fontFamily:
                'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            {submitError}
          </Text>
        ) : null}
      </form>
    );
  }

  const wrapperStyles =
    variant === "compact"
      ? {
          padding: isMobile ? 16 : 18,
          borderRadius: 18,
          border: "1px solid rgba(18, 18, 18, 0.12)",
        }
      : {
          padding: isMobile ? 22 : 26,
          borderRadius: 20,
          border: "1px solid rgba(18, 18, 18, 0.12)",
        };

  const titleSize =
    variant === "compact" ? (isMobile ? 24 : 28) : isMobile ? 30 : 36;

  return (
    <div style={wrapperStyles}>
      {hasLabel ? (
        <Text
          style={{
            display: "block",
            marginBottom: 10,
            color: "#4C4C4C",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.8,
            textTransform: "uppercase",
          }}
        >
          {label}
        </Text>
      ) : null}
      {hasTitle ? (
        <Title
          level={2}
          style={{
            margin: 0,
            color: "#111111",
            fontFamily: SERIF_FONT,
            fontSize: titleSize,
            lineHeight: 1,
          }}
        >
          {title}
        </Title>
      ) : null}
      {hasDescription ? (
        <Paragraph
          style={{
            maxWidth: 680,
            marginTop: 14,
            marginBottom: 0,
            color: "#4A4A4A",
            fontSize: 15,
            lineHeight: 1.8,
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          {description}
        </Paragraph>
      ) : null}

      <form
        onSubmit={handleSubmit}
        style={{ marginTop: hasLabel || hasTitle || hasDescription ? 20 : 0 }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 10,
            alignItems: isMobile ? "stretch" : "center",
            width: "100%",
          }}
        >
          <Input
            size="large"
            type="email"
            required
            disabled={isBusy}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={placeholder}
            style={{
              flex: isMobile ? "1 1 auto" : "1 1 0%",
              width: isMobile ? "100%" : 0,
              minWidth: 0,
              height: 48,
              borderRadius: 999,
              borderColor: "rgba(18, 18, 18, 0.16)",
              background: "#FFFFFF",
              color: "#111111",
              paddingInline: 18,
              boxShadow: "none",
              fontFamily:
                'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          />
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            loading={isBusy}
            style={{
              height: 48,
              borderRadius: 999,
              paddingInline: 22,
              background: "#111111",
              borderColor: "#111111",
              boxShadow: "none",
              width: isMobile ? "100%" : "auto",
              flexShrink: 0,
              fontWeight: 600,
              fontFamily:
                'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            {buttonLabel}
          </Button>
        </div>

        {submitError ? (
          <Text
            style={{
              display: "block",
              marginTop: 12,
              color: "#A6452C",
              fontSize: 13,
              fontFamily:
                'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            {submitError}
          </Text>
        ) : null}
      </form>
    </div>
  );
}