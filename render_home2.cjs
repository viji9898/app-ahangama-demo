const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:5174/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector(".weekly-picks-card", { timeout: 30000 }).catch(() => null);
  // Scroll the weekly picks rail into view
  await page.evaluate(() => {
    const rail = document.querySelector(".weekly-picks-railWrap");
    if (rail) rail.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await page.screenshot({ path: "/tmp/home-weekly-picks.png", fullPage: false });

  const cards = await page.$$eval(".weekly-picks-card", (els) =>
    els.map((el) => {
      const before = getComputedStyle(el, "::before");
      const title = el.querySelector(".weekly-picks-title")?.textContent || "";
      const inlineVar = el.style.getPropertyValue("--weekly-picks-image");
      return {
        title: title.slice(0, 45),
        beforeBg: before.backgroundImage.slice(0, 130),
        beforeContent: before.content,
        inlineVar: inlineVar.slice(0, 110),
      };
    })
  );
  console.log("=== weekly-picks ::before inspection (first 6) ===");
  cards.slice(0, 6).forEach((c, i) => console.log(i + 1, JSON.stringify(c)));
  await browser.close();
})().catch((e) => { console.error("FATAL:", e.message); process.exit(1); });