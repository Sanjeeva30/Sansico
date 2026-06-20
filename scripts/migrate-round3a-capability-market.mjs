// Round 3a: converts plain-string values on Capability and Market documents
// (which are collections, not singletons) into the new {_type, text} shape.
// Run with: SANITY_TOKEN=xxx node scripts/migrate-round3a-capability-market.mjs

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "rvghw4zu",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

function wrap(value, type) {
  if (value == null) return value;
  if (typeof value === "object") return value;
  return { _type: type, text: value };
}

async function migrateCapability(doc) {
  const patch = {
    title: wrap(doc.title, "styledString"),
    num:   wrap(doc.num,   "styledString"),
    summary: wrap(doc.summary, "styledText"),
    body:    wrap(doc.body,    "styledText"),
  };
  if (Array.isArray(doc.points)) patch.points = doc.points.map((p) => wrap(p, "styledString"));
  if (Array.isArray(doc.subServices)) {
    patch.subServices = doc.subServices.map((s) => ({ ...s, title: wrap(s.title, "styledString"), description: wrap(s.description, "styledText") }));
  }
  if (Array.isArray(doc.proofPoints)) {
    patch.proofPoints = doc.proofPoints.map((p) => ({ ...p, value: wrap(p.value, "styledString"), label: wrap(p.label, "styledString") }));
  }
  if (Array.isArray(doc.customerLogos)) {
    patch.customerLogos = doc.customerLogos.map((c) => ({ ...c, name: wrap(c.name, "styledString") }));
  }
  await client.patch(doc._id).set(patch).commit();
  console.log(`  ✓ migrated capability "${typeof doc.title === "string" ? doc.title : doc.title?.text}" (${doc._id})`);
}

async function migrateMarket(doc) {
  const patch = {
    title: wrap(doc.title, "styledString"),
    tag:   wrap(doc.tag,   "styledString"),
    body:  wrap(doc.body,  "styledText"),
    proof: wrap(doc.proof, "styledText"),
  };
  if (Array.isArray(doc.marketStats)) {
    patch.marketStats = doc.marketStats.map((s) => ({ ...s, value: wrap(s.value, "styledString"), label: wrap(s.label, "styledString") }));
  }
  await client.patch(doc._id).set(patch).commit();
  console.log(`  ✓ migrated market "${typeof doc.title === "string" ? doc.title : doc.title?.text}" (${doc._id})`);
}

async function main() {
  if (!process.env.SANITY_TOKEN) { console.error("Set SANITY_TOKEN env var first."); process.exit(1); }

  console.log("Migrating capability documents...");
  const caps = await client.fetch(`*[_type=="capability"]`);
  for (const doc of caps) await migrateCapability(doc);
  if (caps.length === 0) console.log("  (none found)");

  console.log("Migrating market documents...");
  const markets = await client.fetch(`*[_type=="market"]`);
  for (const doc of markets) await migrateMarket(doc);
  if (markets.length === 0) console.log("  (none found)");

  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
