// Fixes two things in one command:
// 1. Converts old colour objects {hex:"#..."} → plain hex strings
// 2. Initialises orderRank on all orderable document types
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
  console.log("\n🎨  Fixing colour data...");

  // Fix homePage stats bgColor + textColor
  const home = await client.fetch(`*[_id=="homePage"][0]{ stats }`);
  if (home?.stats?.length) {
    const fixed = home.stats.map(s => ({
      ...s,
      bgColor:   extractHex(s.bgColor)   || null,
      textColor: extractHex(s.textColor) || null,
    }));
    await client.patch("homePage").set({ stats: fixed }).commit();
    console.log("  ✓ homePage stats");
  }

  // Fix siteSettings accentColour
  const settings = await client.fetch(`*[_id=="siteSettings"][0]{ accentColour }`);
  if (settings?.accentColour && typeof settings.accentColour !== "string") {
    await client.patch("siteSettings").set({ accentColour: extractHex(settings.accentColour) }).commit();
    console.log("  ✓ siteSettings accentColour");
  }

  // Fix capabilities colorTheme
  const caps = await client.fetch(`*[_type=="capability"]{ _id, colorTheme }`);
  for (const c of caps) {
    if (c.colorTheme && typeof c.colorTheme !== "string") {
      await client.patch(c._id).set({ colorTheme: extractHex(c.colorTheme) }).commit();
    }
  }
  if (caps.length) console.log(`  ✓ ${caps.length} capabilities`);

  // Fix markets color
  const markets = await client.fetch(`*[_type=="market"]{ _id, color }`);
  for (const m of markets) {
    if (m.color && typeof m.color !== "string") {
      await client.patch(m._id).set({ color: extractHex(m.color) }).commit();
    }
  }
  if (markets.length) console.log(`  ✓ ${markets.length} markets`);
}

async function initOrderRank() {
  console.log("\n📋  Initialising order ranks...");
  const TYPES = [
    "capability","market","caseStudy","certification",
    "facility","person","newsPost","productCategory","productItem"
  ];
  for (const type of TYPES) {
    const docs = await client.fetch(`*[_type=="${type}" && !defined(orderRank)]|order(_createdAt asc){ _id }`);
    if (!docs.length) { console.log(`  ✓ ${type} — already ordered`); continue; }
    const tx = client.transaction();
    docs.forEach((d, i) => tx.patch(d._id, { set: { orderRank: rankStr(i) } }));
    await tx.commit();
    console.log(`  ✓ ${type} — set order on ${docs.length} documents`);
  }
}

async function run() {
  await fixColours();
  await initOrderRank();
  console.log("\n✅  All done. Refresh the Studio.\n");
}
run().catch(err => { console.error("❌", err.message); process.exit(1); });
