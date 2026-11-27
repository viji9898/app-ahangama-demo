import QRCode from "qrcode";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "ahangama-guide-qr-codes-current");
mkdirSync(OUT_DIR, { recursive: true });
const BASE_URL = "https://ahangama.com";
const ENTRIES = [
  { slug: "spice-trails-booking", file: "QR-Advertiser-Spice-Trails-Booking" },
  { slug: "sawan-petals-instagram", file: "QR-Advertiser-Sawan-Petals-Instagram" },
  { slug: "villa-alba-founder-story", file: "QR-Advertiser-Villa-Alba-Founder-Story" },
  { slug: "spa-therapy-instagram", file: "QR-Advertiser-Spa-Therapy-Instagram" },
  { slug: "transport-google-form", file: "QR-Advertiser-Transport-Google-Form" },
  { slug: "continue-route-1", file: "QR-Continue-Route-1" },
  { slug: "continue-route-2", file: "QR-Continue-Route-2" },
  { slug: "continue-route-3", file: "QR-Continue-Route-3" },
  { slug: "continue-route-4", file: "QR-Continue-Route-4" },
  { slug: "continue-route-5", file: "QR-Continue-Route-5" },
];
const SVG_OPTIONS = { type: "svg", errorCorrectionLevel: "H", margin: 4, color: { dark: "#000000", light: "#ffffff" }, width: 1200 };
const PNG_OPTIONS = { type: "png", errorCorrectionLevel: "H", margin: 4, color: { dark: "#000000", light: "#ffffff" }, width: 1200 };
let i=0;
for (const e of ENTRIES) {
  i++;
  const url = `${BASE_URL}/go/${e.slug}`;
  const svg = await QRCode.toString(url, SVG_OPTIONS);
  writeFileSync(join(OUT_DIR, e.file + ".svg"), svg, "utf8");
  const png = await QRCode.toBuffer(url, PNG_OPTIONS);
  writeFileSync(join(OUT_DIR, e.file + ".png"), png);
  console.log(i, e.file);
}
console.log("done");
