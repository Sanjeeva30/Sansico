/**
 * Adds SEO descriptions to the nine section-block pages.
 *
 * A crawl of the live site found the homepage and every main page shipping no
 * meta description: v2Metadata falls back to the page's seoDescription, which
 * had never been set. Search engines and link previews were left to invent one.
 * Set here rather than hard-coded so editors keep control of it.
 */
import { createClient } from "@sanity/client";
import { cliToken } from "./_auth.mjs";

const client = createClient({
  projectId: "rvghw4zu", dataset: "v2",
  apiVersion: "2024-01-01", useCdn: false, token: cliToken(),
});

const DESCRIPTIONS = {
  home: "Sansico Group designs and manufactures gifting, toy, handicraft and packaging programmes for the world's most loved brands — FSC, FSSC 22000 and ISO 17025 certified, across ten facilities in Indonesia and China.",
  capabilities: "Three capabilities, one accountable partner: design and creative studio, manufacturing solutions with an in-house ISO 17025 safety lab, and vendor operations covering EXIM, bonded-zone logistics and trade compliance.",
  products: "Gift packaging, party and tableware, FMCG packaging, toys and toy packaging, cut and sew, and handicraft — produced to FSC and FSSC 22000 standards for global retail.",
  company: "Forty years of Indonesian manufacturing: our vision and culture, a timeline from the 1986 West Java workshop to ten certified facilities, and every paper and toy plant across Indonesia and China.",
  sustainability: "Certified, dated and verifiable — FSC forestry, NEST artisan standards, HERproject and circular design, backed by a published certification matrix covering social compliance, quality, laboratory and environmental standards.",
  "why-indonesia": "Why global buyers source from Indonesia: strategic geography and port access, a skilled workforce, raw material depth and trade architecture — with a risk-adjusted ASEAN sourcing scorecard placing Indonesia at 26 of 30.",
  careers: "Build your career with Sansico Group. Open roles across manufacturing, quality assurance, vendor operations and our design studio in Indonesia and China.",
  blog: "Notes on manufacturing, sourcing and sustainable design — recycled-content claims, ISO 17025 safety testing, C-TPAT audits, bonded-zone logistics and seasonal design trends.",
  contact: "Tell us your category, target market and volumes. Our marketing offices in Jakarta and Foshan respond within one business day.",
};

let tx = client.transaction();
let n = 0;
for (const [pageId, description] of Object.entries(DESCRIPTIONS)) {
  tx = tx.patch(`page-${pageId}`, { set: { seoDescription: description } });
  n++;
}
await tx.commit();

const missing = await client.fetch(
  `*[_type=="v2Page" && !defined(seoDescription)]{pageId}`
);
console.log(`Set ${n} SEO descriptions. Pages still missing one: ${missing.length}`);
