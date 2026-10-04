import React from "react";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import GuidePage from "../features/print-guide/GuidePage";
import { INITIAL_GUIDE_PAGES } from "../features/print-guide/guideData";
import "../styles/print-guide.css";
import "../styles/print-guide-preview.css";

export const PRINT_GUIDE_PREVIEW_PATH = "/print-guide/preview";

export default function PrintGuidePreviewPage() {
  const interiorPages = INITIAL_GUIDE_PAGES.slice(1, -1);
  const spreads = [
    [INITIAL_GUIDE_PAGES[0]],
    ...Array.from(
      { length: Math.ceil(interiorPages.length / 2) },
      (_, index) => interiorPages.slice(index * 2, index * 2 + 2),
    ),
    [INITIAL_GUIDE_PAGES.at(-1)],
  ];

  return (
    <main
      className="pg-preview"
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
      <section className="pg-preview-spreads" aria-label="Ahangama Guide pages">
        {spreads.map((spread) => (
          <div
            className={`pg-preview-spread${spread.length === 1 ? " is-single" : ""}`}
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