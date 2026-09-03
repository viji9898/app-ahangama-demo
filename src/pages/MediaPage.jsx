import React, { useEffect, useMemo, useState } from "react";
import {
  CopyOutlined,
  LinkOutlined,
  SearchOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import "../styles/media.css";

export const MEDIA_PATH = "/media";

const PAGE_SIZE = 48;
const FILTERS = [
  { value: "all", label: "All images" },
  { value: "owned", label: "Our S3" },
  { value: "local", label: "Local app" },
  { value: "external", label: "External" },
];

const ORIGIN_LABELS = {
  owned: "Our S3",
  local: "Local app",
  external: "External",
};

function greatestCommonDivisor(left, right) {
  let first = left;
  let second = right;

  while (second) {
    [first, second] = [second, first % second];
  }

  return first;
}

function ImageDetailModal({ item, onClose, onCopy, copiedUrl }) {
  const [dimensions, setDimensions] = useState(null);
  const [imageFailed, setImageFailed] = useState(false);

  if (!item) return null;

  const displayUrl = item.url.startsWith("/") ? absUrl(item.url) : item.url;
  const divisor = dimensions
    ? greatestCommonDivisor(dimensions.width, dimensions.height)
    : null;
  const aspectRatio = dimensions
    ? `${dimensions.width / divisor}:${dimensions.height / divisor}`
    : "Loading...";
  const orientation = dimensions
    ? dimensions.width === dimensions.height
      ? "Square"
      : dimensions.width > dimensions.height
        ? "Landscape"
        : "Portrait"
    : "Loading...";

  return (
    <Modal
      className="media-detailModal"
      footer={null}
      onCancel={onClose}
      open
      title="Image details"
      width={900}
    >
      <div className="media-detailGrid">
        <div className="media-detailPreview">
          {!imageFailed ? (
            <img
              alt={item.fileName}
              onError={() => setImageFailed(true)}
              onLoad={(event) =>
                setDimensions({
                  width: event.currentTarget.naturalWidth,
                  height: event.currentTarget.naturalHeight,
                })
              }
              src={item.url}
            />
          ) : (
            <div className="media-detailFailed">
              <WarningOutlined /> Preview unavailable
            </div>
          )}
        </div>

        <div className="media-detailInfo">
          <div className="media-detailTitle">
            <h2>{item.fileName}</h2>
            <span className={`media-origin media-origin--${item.origin}`}>
              {item.origin !== "owned" && <WarningOutlined />}
              {ORIGIN_LABELS[item.origin]}
            </span>
          </div>

          <dl className="media-detailFacts">
            <div><dt>Format</dt><dd>{item.format}</dd></div>
            <div>
              <dt>Dimensions</dt>
              <dd>{dimensions ? `${dimensions.width} × ${dimensions.height} px` : imageFailed ? "Unavailable" : "Loading..."}</dd>
            </div>
            <div><dt>Aspect ratio</dt><dd>{imageFailed ? "Unavailable" : aspectRatio}</dd></div>
            <div><dt>Orientation</dt><dd>{imageFailed ? "Unavailable" : orientation}</dd></div>
            <div><dt>Host</dt><dd>{item.host}</dd></div>
            <div>
              <dt>Designated S3</dt>
              <dd>{item.origin === "owned" ? "Yes" : "No"}</dd>
            </div>
          </dl>

          <div className="media-detailSection">
            <h3>Image URL</h3>
            <p>{displayUrl}</p>
          </div>

          <div className="media-detailSection">
            <h3>References ({item.sources.length})</h3>
            <ul>
              {item.sources.map((source) => {
                const pageRoutes = item.pageRoutes?.[source] || [];

                return (
                  <li key={source}>
                    <span>{source}</span>
                    {pageRoutes.length > 0 && (
                      <div className="media-referenceRoutes">
                        {pageRoutes.map((route) => (
                          <a href={route} key={route} rel="noreferrer" target="_blank">
                            <LinkOutlined /> View {route}
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="media-detailActions">
            <a href={item.url} rel="noreferrer" target="_blank">
              <LinkOutlined /> Open original
            </a>
            <button onClick={() => onCopy(displayUrl)} type="button">
              <CopyOutlined /> {copiedUrl === displayUrl ? "Copied" : "Copy URL"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function MediaRow({ item, onCopy, copiedUrl, onSelect }) {
  const [imageFailed, setImageFailed] = useState(false);
  const displayUrl = item.url.startsWith("/") ? absUrl(item.url) : item.url;

  return (
    <tr
      onClick={() => onSelect(item)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(item);
        }
      }}
      tabIndex={0}
    >
      <td className="media-previewCell">
        <div className="media-thumbnail">
          {!imageFailed ? (
            <img
              alt={item.fileName}
              loading="lazy"
              onError={() => setImageFailed(true)}
              src={item.url}
            />
          ) : (
            <div className="media-thumbnailFailed" title="Preview unavailable">
              <WarningOutlined />
            </div>
          )}
        </div>
      </td>
      <td className="media-nameCell">
        <strong title={item.fileName}>{item.fileName}</strong>
        <span>{item.format}</span>
      </td>
      <td>
        <span className={`media-origin media-origin--${item.origin}`}>
          {item.origin !== "owned" && <WarningOutlined />}
          {ORIGIN_LABELS[item.origin]}
        </span>
      </td>
      <td className="media-hostCell" title={item.host}>{item.host}</td>
      <td className="media-sourceCell" title={item.sources.join(", ")}>
        <strong>{item.sources.length} {item.sources.length === 1 ? "file" : "files"}</strong>
        <span>{item.sources[0]}</span>
      </td>
      <td className="media-linkCell">
        <span title={displayUrl}>{displayUrl}</span>
        <div className="media-actions" onClick={(event) => event.stopPropagation()}>
          <a href={item.url} rel="noreferrer" target="_blank">
            <LinkOutlined /> Open
          </a>
          <button
            aria-label={`Copy URL for ${item.fileName}`}
            onClick={() => onCopy(displayUrl)}
            title="Copy URL"
            type="button"
          >
            <CopyOutlined /> {copiedUrl === displayUrl ? "Copied" : "Copy"}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function MediaPage() {
  const [inventory, setInventory] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [copiedUrl, setCopiedUrl] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    let active = true;

    fetch("/media-inventory.json")
      .then((response) => {
        if (!response.ok) throw new Error("Media inventory unavailable");
        return response.json();
      })
      .then((data) => active && setInventory(data))
      .catch(() => active && setLoadError(true));

    return () => {
      active = false;
    };
  }, []);

  const counts = useMemo(() => {
    const media = inventory?.media || [];
    return media.reduce(
      (result, item) => ({
        ...result,
        [item.origin]: result[item.origin] + 1,
      }),
      { all: media.length, owned: 0, local: 0, external: 0 },
    );
  }, [inventory]);

  const filteredMedia = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return (inventory?.media || []).filter((item) => {
      const matchesOrigin = activeFilter === "all" || item.origin === activeFilter;
      const matchesQuery =
        !normalizedQuery ||
        [item.fileName, item.url, item.host, ...item.sources]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesOrigin && matchesQuery;
    });
  }, [activeFilter, inventory, query]);

  function updateFilter(value) {
    setActiveFilter(value);
    setVisibleCount(PAGE_SIZE);
  }

  function updateQuery(event) {
    setQuery(event.target.value);
    setVisibleCount(PAGE_SIZE);
  }

  async function copyUrl(url) {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    window.setTimeout(() => setCopiedUrl(""), 1600);
  }

  return (
    <SiteLayout>
      <Seo
        title="Media Library | Ahangama"
        description="Browse the images used across Ahangama, inspect their source links and identify media hosted outside the designated Ahangama S3 server."
        canonical={absUrl(MEDIA_PATH)}
      />

      <main className="media-page">
        <header className="media-header">
          <div className="media-inner">
            <span className="media-kicker">Asset inventory</span>
            <div className="media-headerGrid">
              <h1>Media library</h1>
              <p>
                Every image link found in the app, with its storage location,
                source usage and a direct preview.
              </p>
            </div>
          </div>
        </header>

        <section className="media-library" aria-labelledby="media-library-title">
          <div className="media-inner">
            <div className="media-toolbar">
              <div>
                <span className="media-kicker">Browse assets</span>
                <h2 id="media-library-title">Image inventory</h2>
              </div>
              <label className="media-search">
                <SearchOutlined />
                <span className="sr-only">Search images</span>
                <input
                  onChange={updateQuery}
                  placeholder="Search URL, host or source file"
                  type="search"
                  value={query}
                />
              </label>
            </div>

            <div className="media-filters" role="group" aria-label="Filter images by storage">
              {FILTERS.map((filter) => (
                <button
                  aria-pressed={activeFilter === filter.value}
                  className={activeFilter === filter.value ? "is-active" : ""}
                  key={filter.value}
                  onClick={() => updateFilter(filter.value)}
                  type="button"
                >
                  <span>{filter.label}</span>
                  <strong>{inventory ? counts[filter.value] : "-"}</strong>
                </button>
              ))}
            </div>

            {!inventory && !loadError && <p className="media-status">Loading image inventory...</p>}
            {loadError && <p className="media-status media-status--error">The image inventory could not be loaded.</p>}

            {inventory && (
              <>
                <p className="media-resultCount" aria-live="polite">
                  Showing {Math.min(visibleCount, filteredMedia.length)} of {filteredMedia.length} matching images
                </p>

                <div className="media-tableWrap">
                  <table className="media-table">
                    <thead>
                      <tr>
                        <th scope="col">Preview</th>
                        <th scope="col">Asset</th>
                        <th scope="col">Storage</th>
                        <th scope="col">Host</th>
                        <th scope="col">Referenced in</th>
                        <th scope="col">URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMedia.slice(0, visibleCount).map((item) => (
                        <MediaRow
                          copiedUrl={copiedUrl}
                          item={item}
                          key={item.url}
                          onCopy={copyUrl}
                          onSelect={setSelectedItem}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredMedia.length === 0 && (
                  <p className="media-empty">No images match this search.</p>
                )}

                {visibleCount < filteredMedia.length && (
                  <button
                    className="media-loadMore"
                    onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                    type="button"
                  >
                    Load {Math.min(PAGE_SIZE, filteredMedia.length - visibleCount)} more images
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <ImageDetailModal
        copiedUrl={copiedUrl}
        item={selectedItem}
        key={selectedItem?.url || "closed"}
        onClose={() => setSelectedItem(null)}
        onCopy={copyUrl}
      />
    </SiteLayout>
  );
}