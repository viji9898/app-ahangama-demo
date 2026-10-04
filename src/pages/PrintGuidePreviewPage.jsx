import React, { useState } from "react";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import GuidePage from "../features/print-guide/GuidePage";
import {
  GUIDE_SECTIONS,
  INITIAL_GUIDE_PAGES,
} from "../features/print-guide/guideData";
import "../styles/print-guide.css";
import "../styles/print-guide-preview.css";

export const PRINT_GUIDE_PREVIEW_PATH = "/print-guide/preview";

export default function PrintGuidePreviewPage() {
  const [contentsOpen, setContentsOpen] = useState(() =>
    typeof window === "undefined" ? true : window.innerWidth > 520,
  );
  const interiorPages = INITIAL_GUIDE_PAGES.slice(1, -1);
  const spreads = [
    [INITIAL_GUIDE_PAGES[0]],
    ...Array.from(
      { length: Math.ceil(interiorPages.length / 2) },
      (_, index) => interiorPages.slice(index * 2, index * 2 + 2),
    ),
    [INITIAL_GUIDE_PAGES.at(-1)],
  ];
  const spreadByPage = new Map(
    spreads.flatMap((spread) =>
      spread.map((page) => [page.pageNumber, spread[0].pageNumber]),
    ),
  );
  const contents = Object.entries(GUIDE_SECTIONS)
    .map(([key, section]) => ({
      key,
      label: section.label,
      pages: INITIAL_GUIDE_PAGES.filter((page) => page.section === key),
    }))
    .filter((section) => section.pages.length);

  return (
    <main
      className={`pg-preview${contentsOpen ? " has-contents" : ""}`}
      style={{
        "--page-width-mm": 176,
        "--page-height-mm": 250,
        "--page-print-width": "176mm",
        "--page-print-height": "250mm",
      }}
    >
      <Seo
        title="Ahangama Guide 2026/27 Preview"
        description="Preview every page of the Ahangama Guide 2026/27."
        canonical={absUrl(PRINT_GUIDE_PREVIEW_PATH)}
        noindex
      />
      <button
        className="pg-preview-contents-toggle"
        type="button"
        aria-expanded={contentsOpen}
        aria-controls="pg-preview-contents"
        aria-label="Open table of contents"
        title="Open table of contents"
        onClick={() => setContentsOpen(true)}
      >
        <MenuOutlined />
      </button>
      <aside
        className="pg-preview-contents"
        id="pg-preview-contents"
        aria-label="Table of contents"
      >
        <header>
          <div>
            <span>Ahangama Guide</span>
            <h1>Contents</h1>
          </div>
          <button
            type="button"
            title="Close table of contents"
            aria-label="Close table of contents"
            onClick={() => setContentsOpen(false)}
          >
            <CloseOutlined />
          </button>
        </header>
        <nav>
          {contents.map((section) => (
            <section key={section.key}>
              <h2>{section.label}</h2>
              {section.pages.map((page) => (
                <a
                  href={`#spread-${spreadByPage.get(page.pageNumber)}`}
                  key={page.pageNumber}
                  onClick={() => {
                    if (window.innerWidth <= 520) setContentsOpen(false);
                  }}
                >
                  <span>{String(page.pageNumber).padStart(2, "0")}</span>
                  <strong>{page.content.headline}</strong>
                </a>
              ))}
            </section>
          ))}
        </nav>
      </aside>
      <section className="pg-preview-spreads" aria-label="Ahangama Guide pages">
        {spreads.map((spread) => (
          <div
            className={`pg-preview-spread${spread.length === 1 ? " is-single" : ""}`}
            id={`spread-${spread[0].pageNumber}`}
            key={spread[0].pageNumber}
            aria-label={`Pages ${spread.map((page) => page.pageNumber).join(" and ")}`}
          >
            {spread.map((page) => (
              <GuidePage key={page.pageNumber} page={page} />
            ))}
          </div>
        ))}
      </section>
    </main>
  );
}