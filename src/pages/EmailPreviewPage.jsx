import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Spin, Typography } from "antd";
import { MailOutlined, ReloadOutlined } from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";

const { Paragraph, Text, Title } = Typography;

const EMAIL_PREVIEW_PATH = "/email-preview";
const EMAIL_PREVIEW_ENDPOINT =
  "/.netlify/functions/guest-welcome-email-preview";
const EMAIL_PREVIEW_WIDTH = 390;
const EMAIL_PREVIEW_HEIGHT = 760;

function PreviewPhone({ title, preview, isLoadingPreview }) {
  return (
    <section
      aria-label={title}
      style={{
        flex: "1 1 320px",
        width: `min(100%, ${EMAIL_PREVIEW_WIDTH + 40}px)`,
        margin: "0 auto",
        padding: 12,
        border: "1px solid #171717",
        borderRadius: 34,
        background: "#171717",
        boxShadow: "0 28px 70px rgba(40, 32, 20, 0.28)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "0 0 10px",
        }}
      >
        <Text
          style={{
            color: "#f4f0e8",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 1.2,
            textTransform: "uppercase",
          }}
        >
          {title} / {EMAIL_PREVIEW_WIDTH}px
        </Text>
      </div>
      <div
        style={{
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 72,
            height: 5,
            borderRadius: 99,
            background: "#2e2e2e",
          }}
        />
      </div>
      <div
        style={{
          overflow: "hidden",
          width: `min(100%, ${EMAIL_PREVIEW_WIDTH}px)`,
          height: `min(${EMAIL_PREVIEW_HEIGHT}px, calc(100vh - 128px))`,
          minHeight: 520,
          margin: "0 auto",
          borderRadius: 24,
          background: "#fff",
        }}
      >
        {isLoadingPreview ? (
          <div
            style={{
              display: "grid",
              minHeight: "100%",
              placeItems: "center",
            }}
          >
            <Spin />
          </div>
        ) : preview?.html ? (
          <iframe
            title={title}
            srcDoc={preview.html}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              border: 0,
              background: "#fff",
            }}
          />
        ) : (
          <div
            style={{
              display: "grid",
              minHeight: "100%",
              placeItems: "center",
              padding: 24,
              textAlign: "center",
            }}
          >
            <Text type="secondary">Preview unavailable</Text>
          </div>
        )}
      </div>
    </section>
  );
}

export default function EmailPreviewPage() {
  const [preview, setPreview] = useState(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(true);
  const [previewError, setPreviewError] = useState(null);
  const [sendingType, setSendingType] = useState(null);
  const [sendResult, setSendResult] = useState(null);
  const [sendError, setSendError] = useState(null);

  const loadPreview = useCallback(async () => {
    setIsLoadingPreview(true);
    setPreviewError(null);

    try {
      const response = await fetch(EMAIL_PREVIEW_ENDPOINT);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to load email preview");
      }

      setPreview(data);
    } catch (error) {
      setPreviewError(error.message || "Unable to load email preview");
    } finally {
      setIsLoadingPreview(false);
    }
  }, []);

  useEffect(() => {
    loadPreview();
  }, [loadPreview]);

  const sendTestEmail = async (emailType) => {
    setSendingType(emailType);
    setSendResult(null);
    setSendError(null);

    try {
      const response = await fetch(EMAIL_PREVIEW_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailType }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to send test email");
      }

      setSendResult(data);
    } catch (error) {
      setSendError(error.message || "Unable to send test email");
    } finally {
      setSendingType(null);
    }
  };

  const guestWelcomePreview = preview?.guestWelcome || preview;
  const venueNotificationPreview = preview?.venueNotification;
  const otherVenueNotificationPreview = preview?.otherVenueNotification;

  return (
    <SiteLayout>
      <Seo
        title="Email Preview | Ahangama"
        description="Mobile preview and test sender for the Ahangama guest welcome email."
        canonical={absUrl(EMAIL_PREVIEW_PATH)}
      />

      <main
        style={{
          minHeight: "100vh",
          padding: "28px 16px 72px",
          background: "#f4f0e8",
          color: "#111",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 28,
            maxWidth: 980,
            margin: "0 auto",
          }}
        >
          <section
            style={{
              flex: "1 1 320px",
              maxWidth: 420,
              alignSelf: "start",
              paddingTop: 18,
              textAlign: "left",
            }}
          >
            <Text
              style={{
                display: "block",
                marginBottom: 12,
                color: "#ff6f61",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1.8,
                textTransform: "uppercase",
              }}
            >
              Guest + Lighthouse Venue Emails
            </Text>
            <Title
              level={1}
              style={{
                margin: 0,
                color: "#111",
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: 42,
                lineHeight: 0.98,
                fontWeight: 700,
              }}
            >
              Email previews
            </Title>
            <Paragraph
              style={{
                maxWidth: 360,
                margin: "18px 0 0",
                color: "#3b352d",
                fontSize: 15,
                lineHeight: 1.65,
              }}
            >
              Guest subject:{" "}
              <strong>{guestWelcomePreview?.subject || "Loading..."}</strong>
              <br />
              Venue subject:{" "}
              <strong>
                {venueNotificationPreview?.subject || "Loading..."}
              </strong>
            </Paragraph>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 24,
              }}
            >
              <Button
                type="primary"
                icon={<MailOutlined />}
                loading={sendingType === "guest-welcome"}
                onClick={() => sendTestEmail("guest-welcome")}
                style={{
                  minHeight: 42,
                  background: "#111",
                  borderColor: "#111",
                  fontWeight: 700,
                }}
              >
                Send guest test
              </Button>
              <Button
                icon={<MailOutlined />}
                loading={sendingType === "venue-notification"}
                onClick={() => sendTestEmail("venue-notification")}
                style={{ minHeight: 42, fontWeight: 700 }}
              >
                Send Lighthouse test
              </Button>
              <Button
                icon={<MailOutlined />}
                loading={sendingType === "other-venue-notification"}
                onClick={() => sendTestEmail("other-venue-notification")}
                style={{ minHeight: 42, fontWeight: 700 }}
              >
                Send other venue test
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadPreview}
                disabled={isLoadingPreview}
                style={{ minHeight: 42, fontWeight: 700 }}
              >
                Refresh
              </Button>
            </div>

            {sendResult ? (
              <Alert
                type="success"
                showIcon
                style={{ marginTop: 18, maxWidth: 390 }}
                message={`Test email sent to ${sendResult.recipient}`}
                description={sendResult.subject}
              />
            ) : null}
            {sendError ? (
              <Alert
                type="error"
                showIcon
                style={{ marginTop: 18, maxWidth: 390 }}
                message={sendError}
              />
            ) : null}
            {previewError ? (
              <Alert
                type="error"
                showIcon
                style={{ marginTop: 18, maxWidth: 390 }}
                message={previewError}
              />
            ) : null}
          </section>

          <PreviewPhone
            title="Guest welcome email"
            preview={guestWelcomePreview}
            isLoadingPreview={isLoadingPreview}
          />

          <PreviewPhone
            title="Lighthouse venue email"
            preview={venueNotificationPreview}
            isLoadingPreview={isLoadingPreview}
          />

          <PreviewPhone
            title="Kaffi / Gusta venue email"
            preview={otherVenueNotificationPreview}
            isLoadingPreview={isLoadingPreview}
          />
        </div>
      </main>
    </SiteLayout>
  );
}
