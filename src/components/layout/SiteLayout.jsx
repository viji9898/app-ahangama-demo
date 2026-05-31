import React from "react";
import { Layout } from "antd";
import TopNav from "./TopNav";
import FooterBar from "./FooterBar";

const { Content } = Layout;

export default function SiteLayout({ children }) {
  return (
    <Layout style={{ minHeight: "100vh", background: "transparent" }}>
      <TopNav />
      <Content style={{ padding: "24px 16px 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>{children}</div>
      </Content>
      <FooterBar />
    </Layout>
  );
}
