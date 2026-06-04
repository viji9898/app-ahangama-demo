import React from "react";
import {
  FacebookFilled,
  MailOutlined,
  ShareAltOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { Typography, message } from "antd";

const { Text } = Typography;

export default function ShareRow({
  url,
  title,
  text = "",
  label = "Share",
  className = "",
}) {
  const encodedShareUrl = encodeURIComponent(url);
  const encodedShareTitle = encodeURIComponent(title);
  const rowClassName = ["editorial-shareRow", className].filter(Boolean).join(" ");

  async function handleShareAction() {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);
      message.success("Link copied");
    } catch (error) {
      if (error?.name === "AbortError") return;
      message.error("Unable to share right now");
    }
  }

  return (
    <div className={rowClassName}>
      <Text className="editorial-shareLabel">{label}</Text>
      <a
        className="editorial-shareLink"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share ${title} on Facebook`}
      >
        <FacebookFilled />
      </a>
      <a
        className="editorial-shareLink editorial-shareLink--x"
        href={`https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedShareTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share ${title} on X`}
      >
        <span className="editorial-shareX">X</span>
      </a>
      <a
        className="editorial-shareLink"
        href={`https://wa.me/?text=${encodedShareTitle}%20${encodedShareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share ${title} on WhatsApp`}
      >
        <WhatsAppOutlined />
      </a>
      <a
        className="editorial-shareLink"
        href={`mailto:?subject=${encodedShareTitle}&body=${encodedShareUrl}`}
        aria-label={`Share ${title} by email`}
      >
        <MailOutlined />
      </a>
      <button
        type="button"
        className="editorial-shareLink editorial-shareButton"
        onClick={handleShareAction}
        aria-label={`Share ${title}`}
      >
        <ShareAltOutlined />
      </button>
    </div>
  );
}