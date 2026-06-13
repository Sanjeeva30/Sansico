// Seeds one pageSettings document per page in Sanity.
// Run: SANITY_TOKEN=your_editor_token node scripts/seed-page-settings.mjs

import { createClient } from "@sanity/client";

const TOKEN = process.env.SANITY_TOKEN;
if (!TOKEN) {
  console.error("❌  SANITY_TOKEN not set.");
  console.error("   SANITY_TOKEN=your_token node scripts/seed-page-settings.mjs");
  process.exit(1);
}

const client = createClient({
  projectId: "rvghw4zu", dataset: "production",
  apiVersion: "2024-01-01", token: TOKEN, useCdn: false,
});

const PAGES = [
  { id: "home",          label: "Home" },
  { id: "capabilities",  label: "Capabilities" },
  { id: "markets",       label: "Markets" },
  { id: "products",      label: "Products" },
  { id: "work",          label: "Work / Case Studies" },
  { id: "sustainability",label: "Sustainability" },
  { id: "company",       label: "Company" },
  { id: "careers",       label: "Careers" },
  { id: "contact",       label: "Contact" },
  { id: "team",          label: "Team" },
  { id: "news",          label: "News & Press" },
];

// Default SEO values (existing hardcoded ones) — Studio overrides these when filled
const SEO_DEFAULTS = {
  home:           { seoTitle: "Sansico Group — Joy, sustainably packaged | Indonesia · China · USA", seoDescription: "Sansico Group designs and manufactures gifting, toy, handicraft and packaging programmes for the world's most loved brands." },
  capabilities:   { seoTitle: "Capabilities — Design, Make, Deliver | Sansico Group" },
  markets:        { seoTitle: "Markets — Toys, Gifting, FMCG & More | Sansico Group" },
  products:       { seoTitle: "Products — Paper-based & Handicraft Portfolio | Sansico Group" },
  work:           { seoTitle: "Work — Case Studies | Sansico Group" },
  sustainability: { seoTitle: "Sustainability & Certifications | Sansico Group" },
  company:        { seoTitle: "Company & Facilities | Sansico Group" },
  careers:        { seoTitle: "Careers | Sansico Group" },
  contact:        { seoTitle: "Contact | Sansico Group" },
  team:           { seoTitle: "Team | Sansico Group" },
  news:           { seoTitle: "News & Press | Sansico Group" },
};

async function seed() {
  console.log("\n🌱  Seeding pageSettings documents...\n");
  const t = client.transaction();

  for (const page of PAGES) {
    const seo = SEO_DEFAULTS[page.id] || {};
    t.createOrReplace({
      _id:     `pageSettings-${page.id}`,
      _type:   "pageSettings",
      pageId:  page.id,
      label:   page.label,
      visible: true,
      ...seo,
    });
    console.log(`  ✓ pageSettings-${page.id}`);
  }

  await t.commit();
  console.log("\n✅  Done. Refresh your Studio to see Pages in the sidebar.\n");
}

seed().catch(err => { console.error("❌", err.message); process.exit(1); });
