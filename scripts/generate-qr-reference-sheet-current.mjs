import { writeFileSync, existsSync } from "fs";
import { join } from "path";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

const ROOT = "/Users/eniduoushanamaluddeniya/app-ahangama-demo";
const OUT_DIR = ROOT + "/ahangama-guide-qr-codes-current";
const BASE_URL = "https://ahangama.com";
const EVENT_NAME = "qr_scan";
const QR_SOURCE = "physical_guide";
const QR_MEDIUM = "qr";
const QR_CAMPAIGN = "ahangama_guide_2026_27";

const ENTRIES = [
  { label: "Spice Trails – Official Booking Page", slug: "spice-trails-booking", file: "QR-Advertiser-Spice-Trails-Booking", section: "spice_trails_booking", codeId: "qr_spice_trails_booking", destination: "https://bookdirect.prenohq.com/inst/#home?propertyId=323IjU7IqGlE7WYcTCbyDywODczMiI=&JDRN=Y", planned: "https://bookdirect.prenohq.com/inst/#home?propertyId=323IjU7IqGlE7WYcTCbyDywODczMiI=&JDRN=Y", status: "confirmed", group: "Advertiser Pages", provisionalNote: "" },
  { label: "Sawan – Petals Ahangama (Official Instagram)", slug: "sawan-petals-instagram", file: "QR-Advertiser-Sawan-Petals-Instagram", section: "sawan_petals_instagram", codeId: "qr_sawan_petals_instagram", destination: "https://www.instagram.com/petals.ahangama/", planned: "https://www.instagram.com/petals.ahangama/", status: "confirmed", group: "Advertiser Pages", provisionalNote: "" },
  { label: "Villa Alba – Founder Story", slug: "villa-alba-founder-story", file: "QR-Advertiser-Villa-Alba-Founder-Story", section: "villa_alba_founder_story", codeId: "qr_villa_alba_founder_story", destination: "/villa-alba-a-boutique-hotel-with-a-commitment-to-those-who-built-it", planned: "/villa-alba-a-boutique-hotel-with-a-commitment-to-those-who-built-it", status: "confirmed", group: "Advertiser Pages", provisionalNote: "" },
  { label: "Spa Therapy – Official Instagram", slug: "spa-therapy-instagram", file: "QR-Advertiser-Spa-Therapy-Instagram", section: "spa_therapy_instagram", codeId: "qr_spa_therapy_instagram", destination: "https://www.instagram.com/thespicetrail.ahangama/", planned: "https://www.instagram.com/thespicetrail.ahangama/", status: "confirmed", group: "Advertiser Pages", provisionalNote: "" },
  { label: "Transport – Enquiry / Booking Form", slug: "transport-google-form", file: "QR-Advertiser-Transport-Google-Form", section: "transport_google_form", codeId: "qr_transport_google_form", destination: "/transport-rates", planned: "Google Form URL – to be supplied", status: "provisional", group: "Advertiser Pages", provisionalNote: "PROVISIONAL – GOOGLE FORM URL TO BE SUPPLIED" },
  { label: "Route 1", slug: "continue-route-1", file: "QR-Continue-Route-1", section: "continue_route_1", codeId: "qr_continue_route_1", destination: "https://ahangama.com/guide", planned: "/guide/continue-route-1", status: "provisional", group: "Five Ways to Continue Your Sri Lankan Story", provisionalNote: "PROVISIONAL – DESTINATION TO BE UPDATED" },
  { label: "Route 2", slug: "continue-route-2", file: "QR-Continue-Route-2", section: "continue_route_2", codeId: "qr_continue_route_2", destination: "https://ahangama.com/guide", planned: "/guide/continue-route-2", status: "provisional", group: "Five Ways to Continue Your Sri Lankan Story", provisionalNote: "PROVISIONAL – DESTINATION TO BE UPDATED" },
  { label: "Route 3", slug: "continue-route-3", file: "QR-Continue-Route-3", section: "continue_route_3", codeId: "qr_continue_route_3", destination: "https://ahangama.com/guide", planned: "/guide/continue-route-3", status: "provisional", group: "Five Ways to Continue Your Sri Lankan Story", provisionalNote: "PROVISIONAL – DESTINATION TO BE UPDATED" },
  { label: "Route 4", slug: "continue-route-4", file: "QR-Continue-Route-4", section: "continue_route_4", codeId: "qr_continue_route_4", destination: "https://ahangama.com/guide", planned: "/guide/continue-route-4", status: "provisional", group: "Five Ways to Continue Your Sri Lankan Story", provisionalNote: "PROVISIONAL – DESTINATION TO BE UPDATED" },
  { label: "Route 5", slug: "continue-route-5", file: "QR-Continue-Route-5", section: "continue_route_5", codeId: "qr_continue_route_5", destination: "https://ahangama.com/guide", planned: "/guide/continue-route-5", status: "provisional", group: "Five Ways to Continue Your Sri Lankan Story", provisionalNote: "PROVISIONAL – DESTINATION TO BE UPDATED" },
];

const resolveDestination = (d) => d.startsWith("http") ? d : `${BASE_URL}${d}`;
const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const csvHeader = ["Page Title","Slug","Encoded QR URL","Actual Destination","Actual Destination URL","Planned / Future Destination","Status","Guide Group","QR Section ID","GA4 Event Name","qr_section","qr_code_id","qr_source","qr_medium","qr_campaign","Missing Information","SVG Filename","PNG Filename"];
const csvRows = ENTRIES.map(e => [
  e.label, e.slug, `${BASE_URL}/go/${e.slug}`, e.destination, resolveDestination(e.destination), e.planned,
  e.status === "confirmed" ? "Confirmed" : "Provisional – temporary fallback", e.group, e.codeId, EVENT_NAME, e.section, e.codeId, QR_SOURCE, QR_MEDIUM, QR_CAMPAIGN, e.provisionalNote, e.file+".svg", e.file+".png"
].map(csvCell).join(","));
writeFileSync(join(OUT_DIR, "QR-Reference-Sheet.csv"), [csvHeader.map(csvCell).join(","), ...csvRows].join("\n"), "utf8");
console.log("CSV written");

// PDF
const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });
const PAGE_W=297, PAGE_H=210, MARGIN=12, COLS=3, ROWS=4, PER_PAGE=12, GRID_TOP=26, ROW_H=45, COL_W=(PAGE_W-MARGIN*2)/COLS, QR_SIZE=26, TEXT_X_OFFSET=31, TEXT_W=COL_W-TEXT_X_OFFSET-4;
const qrDataUrls = await Promise.all(ENTRIES.map(e => QRCode.toDataURL(`${BASE_URL}/go/${e.slug}`, { errorCorrectionLevel:"H", margin:4, width:480, color:{dark:"#000000",light:"#ffffff"} })));
function fitTextLine(text,maxWidth){ if(doc.getTextWidth(text)<=maxWidth) return text; let t=text; while(t.length>1 && doc.getTextWidth(t+"…")>maxWidth) t=t.slice(0,-1); return t+"…"; }
function drawPageHeader(){ doc.setFillColor(31,42,36); doc.rect(0,0,PAGE_W,20,"F"); doc.setTextColor(255,255,255); doc.setFontSize(12.5); doc.setFont("helvetica","bold"); doc.text("Ahangama.com — Current Physical Guide QR Codes (10)", MARGIN, 9); doc.setFontSize(7); doc.setFont("helvetica","normal"); doc.text("Campaign: ahangama_guide_2026_27  ·  Event: qr_scan  ·  Source: physical_guide  ·  Medium: qr", MARGIN, 15); }
ENTRIES.forEach((entry,idx)=>{
  if (idx % PER_PAGE === 0) { if (idx>0) doc.addPage(); drawPageHeader(); }
  const pos=idx%PER_PAGE; const row=Math.floor(pos/COLS); const col=pos%COLS;
  const cellX=MARGIN+col*COL_W; const cellY=GRID_TOP+row*ROW_H;
  doc.addImage(qrDataUrls[idx],"PNG",cellX+2,cellY+1,QR_SIZE,QR_SIZE);
  const textX=cellX+TEXT_X_OFFSET; let y=cellY+3.4;
  doc.setTextColor(31,42,36); doc.setFont("helvetica","bold"); doc.setFontSize(6.9);
  doc.splitTextToSize(entry.label,TEXT_W).slice(0,2).forEach(line=>{doc.text(fitTextLine(line,TEXT_W),textX,y); y+=3.1;});
  const isConfirmed=entry.status==="confirmed";
  doc.setFontSize(5.6); doc.setTextColor(isConfirmed?22:156,isConfirmed?112:82,isConfirmed?60:12);
  doc.text(isConfirmed?"CONFIRMED":"PROVISIONAL – DESTINATION TO BE UPDATED",textX,y+0.6); y+=4.2;
  doc.setFont("helvetica","normal"); doc.setTextColor(85,92,88); doc.setFontSize(5.1);
  [`slug: ${entry.slug}`, `QR: ${BASE_URL}/go/${entry.slug}`, `To: ${entry.destination}`, `Section: ${entry.section}  ·  Code: ${entry.codeId}`].forEach(l=>{doc.text(fitTextLine(l,TEXT_W),textX,y); y+=3.0;});
});
doc.save(join(OUT_DIR,"QR-Reference-Sheet.pdf"));
console.log("PDF written");
