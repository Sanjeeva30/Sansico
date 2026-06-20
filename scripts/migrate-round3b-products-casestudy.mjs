// Round 3b: converts plain-string values on Product Category, Product Item,
// and Case Study documents into the new {_type, text} shape.
// Run with: SANITY_TOKEN=xxx node scripts/migrate-round3b-products-casestudy.mjs

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

async function migrateProductCategory(doc) {
  const patch = {
    name: wrap(doc.name, "styledString"),
    description: wrap(doc.description, "styledText"),
  };
  await client.patch(doc._id).set(patch).commit();
  console.log(`  ✓ migrated category "${typeof doc.name === "string" ? doc.name : doc.name?.text}" (${doc._id})`);
}

async function migrateProductItem(doc) {
  const patch = {
    name: wrap(doc.name, "styledString"),
    description: wrap(doc.description, "styledText"),
    moq: wrap(doc.moq, "styledString"),
  };
  if (Array.isArray(doc.specs)) {
    patch.specs = doc.specs.map((s) => ({ ...s, label: wrap(s.label, "styledString"), value: wrap(s.value, "styledString") }));
  }
  await client.patch(doc._id).set(patch).commit();
  console.log(`  ✓ migrated product "${typeof doc.name === "string" ? doc.name : doc.name?.text}" (${doc._id})`);
}

async function migrateCaseStudy(doc) {
  const patch = {
    title: wrap(doc.title, "styledString"),
    kicker: wrap(doc.kicker, "styledString"),
    quote: wrap(doc.quote, "styledText"),
    body: wrap(doc.body, "styledText"),
  };
  if (Array.isArray(doc.stats)) {
    patch.stats = doc.stats.map((s) => ({ ...s, value: wrap(s.value, "styledString"), label: wrap(s.label, "styledString") }));
  }
  await client.patch(doc._id).set(patch).commit();
  console.log(`  ✓ migrated case study "${typeof doc.title === "string" ? doc.title : doc.title?.text}" (${doc._id})`);
}

async function main() {
  if (!process.env.SANITY_TOKEN) { console.error("Set SANITY_TOKEN env var first."); process.exit(1); }

  console.log("Migrating productCategory documents...");
  const cats = await client.fetch(`*[_type=="productCategory"]`);
  for (const doc of cats) await migrateProductCategory(doc);
  if (cats.length === 0) console.log("  (none found)");

  console.log("Migrating productItem documents...");
  const items = await client.fetch(`*[_type=="productItem"]`);
  for (const doc of items) await migrateProductItem(doc);
  if (items.length === 0) console.log("  (none found)");

  console.log("Migrating caseStudy documents...");
  const cases = await client.fetch(`*[_type=="caseStudy"]`);
  for (const doc of cases) await migrateCaseStudy(doc);
  if (cases.length === 0) console.log("  (none found)");

  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
