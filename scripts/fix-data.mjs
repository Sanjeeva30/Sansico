// Run: SANITY_TOKEN=your_editor_token node scripts/fix-data.mjs
import { createClient } from "@sanity/client";

const TOKEN = process.env.SANITY_TOKEN;
if (!TOKEN) { console.error("❌  SANITY_TOKEN not set"); process.exit(1); }

const client = createClient({
  projectId: "rvghw4zu", dataset: "production",
  apiVersion: "2024-01-01", token: TOKEN, useCdn: false,
});

function extractHex(v) {
  if (!v) return null;
  if (typeof v === "string") return v;
  if (typeof v === "object" && v.hex) return v.hex;
  return null;
}

function rankStr(i) { return String(i).padStart(8, "0"); }

async function fixColours() {
  console.log("\n🎨  Fixing colour data (published + drafts)...");

  // Fix both the published doc AND any draft
  const ids = ["homePage", "drafts.homePage"];
  for (const id of ids) {
    const home = await client.fetch(`*[_id=="${id}"][0]{ stats }`);
    if (!home?.stats?.length) { console.log(`  — ${id}: no stats found`); continue; }

    const needsFix = home.stats.some(s =>
      (s.bgColor && typeof s.bgColor !== "string") ||
      (s.textColor && typeof s.textColor !== "string")
    );
    if (!needsFix) { console.log(`  ✓ ${id}: already clean`); continue; }

    const fixed = home.stats.map(s => ({
      ...s,
      bgColor:   extractHex(s.bgColor)   ?? null,
      textColor: extractHex(s.textColor) ?? null,
    }));
    await client.patch(id).set({ stats: fixed }).commit();
    console.log(`  ✓ ${id}: fixed`);
  }

  // Fix siteSettings accentColour
  for (const id of ["siteSettings", "drafts.siteSettings"]) {
    const s = await client.fetch(`*[_id=="${id}"][0]{ accentColour }`);
    if (s?.accentColour && typeof s.accentColour !== "string") {
      await client.patch(id).set({ accentColour: extractHex(s.accentColour) }).commit();
      console.log(`  ✓ ${id}: accentColour fixed`);
    }
  }

  // Fix capabilities colorTheme
  const caps = await client.fetch(`*[_type=="capability"]{ _id, colorTheme }`);
  for (const c of caps) {
    if (c.colorTheme && typeof c.colorTheme !== "string") {
      await client.patch(c._id).set({ colorTheme: extractHex(c.colorTheme) }).commit();
    }
  }
  if (caps.length) console.log(`  ✓ ${caps.length} capabilities colorTheme fixed`);

  // Fix markets color
  const markets = await client.fetch(`*[_type=="market"]{ _id, color }`);
  for (const m of markets) {
    if (m.color && typeof m.color !== "string") {
      await client.patch(m._id).set({ color: extractHex(m.color) }).commit();
    }
  }
  if (markets.length) console.log(`  ✓ ${markets.length} markets color fixed`);
}

async function removeOldOrderField() {
  console.log("\n🧹  Removing old 'order' field from documents...");
  const TYPES = [
    "capability","market","caseStudy","certification",
    "facility","person","newsPost","productCategory","productItem"
  ];
  for (const type of TYPES) {
    const docs = await client.fetch(`*[_type=="${type}" && defined(order)]{ _id }`);
    if (!docs.length) { console.log(`  ✓ ${type}: no old order field`); continue; }
    const tx = client.transaction();
    docs.forEach(d => tx.patch(d._id, { unset: ["order"] }));
    await tx.commit();
    console.log(`  ✓ ${type}: removed 'order' from ${docs.length} documents`);
  }
}

async function initOrderRank() {
  console.log("\n📋  Initialising orderRank...");
  const TYPES = [
    "capability","market","caseStudy","certification",
    "facility","person","newsPost","productCategory","productItem"
  ];
  for (const type of TYPES) {
    const docs = await client.fetch(`*[_type=="${type}" && !defined(orderRank)]|order(_createdAt asc){ _id }`);
    if (!docs.length) { console.log(`  ✓ ${type}: already ordered`); continue; }
    const tx = client.transaction();
    docs.forEach((d, i) => tx.patch(d._id, { set: { orderRank: rankStr(i) } }));
    await tx.commit();
    console.log(`  ✓ ${type}: initialised ${docs.length} documents`);
  }
}

async function run() {
  await fixColours();
  await removeOldOrderField();
  await initOrderRank();
  console.log("\n✅  All done. Discard the homePage draft in Studio then republish.\n");
}
run().catch(err => { console.error("❌", err.message); process.exit(1); });
