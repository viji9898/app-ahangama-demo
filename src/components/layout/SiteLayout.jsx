import React from "react";
import { Layout } from "antd";
import TopNav from "./TopNav";
import FooterBar from "./FooterBar";

const { Content } = Layout;

export default function SiteLayout({ children }) {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <TopNav />
      <Content style={{ padding: 16 }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>{children}</div>
      </Content>
      <FooterBar />
    </Layout>
  );
}
