import React, { useCallback, useDeferredValue, useEffect, useState } from "react";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Select } from "antd";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import "../styles/guide-sizes.css";

export const GUIDE_SIZES_PATH = "/guide/sizes";

function formatBytes(bytes) {
  if (!bytes) return "Unavailable";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatAuditDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(value));
}

export default function GuideSizesPage() {
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("all");
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const loadAudit = useCallback(async (refresh = false) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/guide/image-sizes${refresh ? "?refresh=1" : ""}`,
      );
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to load image audit");
      }
      setAudit(data);
    } catch (loadError) {
      setError(loadError.message || "Unable to load image audit");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAudit();
  }, [loadAudit]);

  const images = audit?.images || [];
  const sectionOptions = [
    { value: "all", label: "All sections" },
    ...[...new Set(images.map((image) => image.section))].map((label) => ({
      value: label,
      label,
    })),
  ];
  const rows = images
    .filter((image) => {
      const matchesSection = section === "all" || image.section === section;
      const matchesQuery = `${image.name} ${image.section}`
        .toLowerCase()
        .includes(deferredQuery);
      return matchesSection && matchesQuery;
    })
    .sort((first, second) => (second.bytes || -1) - (first.bytes || -1));
  const summary = audit?.summary || {
    images: 0,
    measured: 0,
    unavailable: 0,
    totalBytes: 0,
  };

  return (
    <SiteLayout showFooter={false}>
      <Seo
        title="Guide Image Size Audit"
        description="Image dimensions and delivered file sizes for the Ahangama guide."
        canonical={absUrl(GUIDE_SIZES_PATH)}
        noindex
      />
      <main className="guideSizes-page">
        <header className="guideSizes-header">
          <div>
            <span>Ahangama Guide / Media audit</span>
            <h1>Image sizes</h1>
            <p>
              Live intrinsic resolutions and delivered file sizes
              {audit?.generatedAt ? ` measured ${formatAuditDate(audit.generatedAt)}.` : "."}
            </p>
          </div>
          <dl>
            <div><dt>Images</dt><dd>{summary.images}</dd></div>
            <div><dt>Measured</dt><dd>{summary.measured}</dd></div>
            <div><dt>Unavailable</dt><dd>{summary.unavailable}</dd></div>
            <div><dt>Measured total</dt><dd>{formatBytes(summary.totalBytes)}</dd></div>
          </dl>
        </header>

        <aside className="guideSizes-notice">
          Unavailable files returned HTTP 401 because their Cloudinary account
          was disabled. Map tiles, SVG interface icons, and the Open Graph image
          are excluded.
        </aside>

        <section className="guideSizes-tools" aria-label="Table filters">
          <Input
            allowClear
            aria-label="Search images"
            prefix={<SearchOutlined />}
            placeholder="Search image or section"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Select
            aria-label="Filter by guide section"
            options={sectionOptions}
            value={section}
            onChange={setSection}
          />
          <div className="guideSizes-toolsEnd">
            <span aria-live="polite">{rows.length} results</span>
            <Button
              icon={<ReloadOutlined />}
              loading={loading}
              onClick={() => loadAudit(true)}
            >
              Refresh audit
            </Button>
          </div>
        </section>

        {error ? (
          <div className="guideSizes-message is-error" role="alert">
            {error}
          </div>
        ) : loading && !audit ? (
          <div className="guideSizes-message" role="status">
            Inspecting current guide images…
          </div>
        ) : (
          <div className="guideSizes-tableWrap">
          <table>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Section</th>
                <th scope="col">Image</th>
                <th scope="col">Resolution</th>
                <th scope="col">File size</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((image) => (
                <tr key={image.id}>
                  <td>{image.id}</td>
                  <td>{image.section}</td>
                  <th scope="row">{image.name}</th>
                  <td>{image.width ? `${image.width} x ${image.height}` : "Not available"}</td>
                  <td>{formatBytes(image.bytes)}</td>
                  <td>
                    <span
                      className={`guideSizes-status ${
                        image.status === "Available" ? "is-available" : "is-error"
                      }`}
                    >
                      {image.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </main>
    </SiteLayout>
  );
}