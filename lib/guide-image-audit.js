import { Buffer } from "node:buffer";
import { imageSize } from "image-size";
import { listGuideVenues } from "./guide-db.js";

const CACHE_TTL_MS = 15 * 60 * 1000;
const RANGE_END = 262143;
const CONCURRENCY = 20;

const SECTION_LABELS = {
  best_stays: "Best Stays",
  best_eats: "Best Eats",
  best_cafes: "Best Cafes",
  best_experiences: "Experiences",
  wellness: "Wellness",
  night_life: "Night Life",
  best_retail_stores: "Retail",
  surf_schools: "Surf Schools",
  transport: "Transport",
};

const EDITORIAL_IMAGES = [
  ["Overview", "https://res.cloudinary.com/dp7in4ulw/image/upload/q_auto/v1784788406/overview_image_ukm5or.webp"],
  ["Best For: Wellness", "https://res.cloudinary.com/dp7in4ulw/image/upload/v1784779727/Soul_Spa_Colored736923392_Topaz_Gigapixel_4x_scale_iklhr8.webp"],
  ["Best For: Surfers", "https://res.cloudinary.com/dp7in4ulw/image/upload/v1784779727/coloredgood-story-surf-school-1400_1_Topaz_Gigapixel_4x_scale_dr6h6l.webp"],
  ["Best For: Digital Nomads", "https://res.cloudinary.com/dp7in4ulw/image/upload/v1784779727/Colored_Kalatmaka1_Topaz_Gigapixel_4x_scale_wavbpv.webp"],
  ["Best For: Cafe Lovers", "https://res.cloudinary.com/dp7in4ulw/image/upload/v1784779727/Kaffi946318185961736_7826978568551728722_n_Topaz_Gigapixel_4x_scale_iz1aop.webp"],
  ["Best For: Souvenirs", "https://res.cloudinary.com/dp7in4ulw/image/upload/q_auto/v1784793489/souvenir_qrb9cl.webp"],
  ["Best For: Nightlife", "https://res.cloudinary.com/dp7in4ulw/image/upload/v1784779729/Hakuna_ColoredImage_ji8d1dji8d1dji8d_Topaz_Gigapixel_2x_scale_bxi6wt.webp"],
  ["Best Season", "https://res.cloudinary.com/dp7in4ulw/image/upload/q_auto/v1784783799/colored-4247572_jezkyb.webp"],
  ["How Long People Stay", "https://res.cloudinary.com/dp7in4ulw/image/upload/v1787647989/howlongpeoplestay_1_sqg1i8.webp"],
  ["Getting Around Ahangama", "https://res.cloudinary.com/dp7in4ulw/image/upload/q_auto/v1784784926/44yfmcvyf_zqm5q1.webp"],
].map(([name, url]) => ({ section: "Editorial", name, url }));

let cachedAudit = null;
let auditPromise = null;

function parseTotalBytes(response, receivedBytes) {
  const contentRange = response.headers.get("content-range");
  const rangeTotal = contentRange?.match(/\/(\d+)$/)?.[1];
  const contentLength = response.headers.get("content-length");
  return Number(rangeTotal || contentLength || receivedBytes) || null;
}

async function inspectImage(image) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(image.url, {
      headers: { Range: `bytes=0-${RANGE_END}` },
      signal: controller.signal,
    });
    if (!response.ok && response.status !== 206) {
      throw new Error(`HTTP ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const dimensions = imageSize(buffer);
    return {
      ...image,
      width: dimensions.width,
      height: dimensions.height,
      bytes: parseTotalBytes(response, buffer.length),
      format: dimensions.type?.toUpperCase() || "",
      status: "Available",
    };
  } catch (error) {
    return {
      ...image,
      width: null,
      height: null,
      bytes: null,
      format: "",
      status: error.name === "AbortError" ? "Timed out" : error.message,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function inspectInBatches(images) {
  const inspected = [];
  for (let index = 0; index < images.length; index += CONCURRENCY) {
    inspected.push(
      ...(await Promise.all(images.slice(index, index + CONCURRENCY).map(inspectImage))),
    );
  }
  return inspected;
}

async function createAudit() {
  const venues = await listGuideVenues({ status: "active" });
  const venueImages = venues
    .filter((venue) => venue.image)
    .map((venue) => ({
      section: SECTION_LABELS[venue.section] || venue.section,
      name: venue.name,
      url: venue.image,
    }));
  const images = await inspectInBatches([...EDITORIAL_IMAGES, ...venueImages]);
  const totalBytes = images.reduce((total, image) => total + (image.bytes || 0), 0);
  const unavailable = images.filter((image) => image.status !== "Available").length;

  return {
    generatedAt: new Date().toISOString(),
    images: images.map((image, index) => ({ id: index + 1, ...image })),
    summary: {
      images: images.length,
      measured: images.length - unavailable,
      unavailable,
      totalBytes,
    },
  };
}

export async function getGuideImageAudit({ refresh = false } = {}) {
  if (!refresh && cachedAudit && Date.now() - cachedAudit.createdAt < CACHE_TTL_MS) {
    return cachedAudit.value;
  }
  if (!refresh && auditPromise) return auditPromise;

  auditPromise = createAudit();
  try {
    const value = await auditPromise;
    cachedAudit = { createdAt: Date.now(), value };
    return value;
  } finally {
    auditPromise = null;
  }
}