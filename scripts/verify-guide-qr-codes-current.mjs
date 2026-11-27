import fs from "fs";
import { join } from "path";
import { PNG } from "pngjs";
import jsQR from "jsqr";
const ROOT = "/Users/eniduoushanamaluddeniya/app-ahangama-demo";
const OUT_DIR = ROOT + "/ahangama-guide-qr-codes-current";
const BASE_URL = "https://ahangama.com";
const entries = [
  "QR-Advertiser-Spice-Trails-Booking",
  "QR-Advertiser-Sawan-Petals-Instagram",
  "QR-Advertiser-Villa-Alba-Founder-Story",
  "QR-Advertiser-Spa-Therapy-Instagram",
  "QR-Advertiser-Transport-Google-Form",
  "QR-Continue-Route-1",
  "QR-Continue-Route-2",
  "QR-Continue-Route-3",
  "QR-Continue-Route-4",
  "QR-Continue-Route-5",
];
const slugs = [
  "spice-trails-booking","sawan-petals-instagram","villa-alba-founder-story","spa-therapy-instagram","transport-google-form",
  "continue-route-1","continue-route-2","continue-route-3","continue-route-4","continue-route-5"
];
let passed=0; const failures=[];
for (let i=0;i<entries.length;i++){
  const f=entries[i];
  const expected=`${BASE_URL}/go/${slugs[i]}`;
  const pngPath=OUT_DIR+"/"+f+".png";
  const svgPath=OUT_DIR+"/"+f+".svg";
  if(!fs.existsSync(pngPath)){failures.push(f+": missing PNG");continue;}
  if(!fs.existsSync(svgPath)){failures.push(f+": missing SVG");continue;}
  const png=PNG.sync.read(fs.readFileSync(pngPath));
  if(png.width!==1200||png.height!==1200){failures.push(f+": size");continue;}
  const decoded=jsQR(new Uint8ClampedArray(png.data),png.width,png.height);
  if(!decoded){failures.push(f+": no decode");continue;}
  if(decoded.data!==expected){failures.push(f+": "+decoded.data);continue;}
  passed++;
}
console.log("Decoded OK:", passed, "/", entries.length);
if(failures.length){console.error(failures); process.exit(1);}
console.log("All current QR images decode.");
