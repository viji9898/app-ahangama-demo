import React from "react";
import { Layout } from "antd";
import TopNav from "./TopNav";
import FooterBar from "./FooterBar";

const { Content } = Layout;

export default function SiteLayout({
  children,
  showFooter = true,
  navOverlayHero = false,
}) {
  return (
    <Layout style={{ minHeight: "100vh", background: "transparent" }}>
      <TopNav overlayHero={navOverlayHero} />
      <Content style={{ padding: navOverlayHero ? "0 16px 0" : "24px 16px 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>{children}</div>
      </Content>
      {showFooter ? <FooterBar /> : null}
    </Layout>
  );
}
