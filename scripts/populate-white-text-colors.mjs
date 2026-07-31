// Sets an explicit white color on every text field that currently renders
// white due to sitting on a dark background (hero, page heroes, CTA band).
// This was previously just CSS, invisible in Studio's color picker since
// white isn't one of the brand preset swatches. SAFE: only fills a color
// if that field doesn't already have one set.
// Run with: SANITY_TOKEN=xxx node scripts/populate-white-text-colors.mjs

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "rvghw4zu",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const WHITE = "#FFFFFF";

function withColor(field, color) {
  if (!field || typeof field !== "object") return field; // nothing to attach color to
  if (field.color) return field; // already has an explicit color — leave it alone
  return { ...field, color };
}

async function safePatch(id, buildPatch) {
  const doc = await client.fetch(`*[_id=="${id}"][0]`);
  if (!doc) { console.log(`  (no document with id "${id}", skipping)`); return; }
  const patch = buildPatch(doc);
  if (!patch || Object.keys(patch).length === 0) {
    console.log(`  (already set, left untouched: ${id})`);
    return;
  }
  await client.patch(id).set(patch).commit();
  console.log(`  ✓ set white on ${id}: ${Object.keys(patch).join(", ")}`);
}

async function main() {
  if (!process.env.SANITY_TOKEN) { console.error("Set SANITY_TOKEN env var first."); process.exit(1); }

  console.log("homePage hero text...");
  await safePatch("homePage", (d) => {
    const p = {};
    if (d.heroEyebrow && !d.heroEyebrow.color) p.heroEyebrow = withColor(d.heroEyebrow, WHITE);
    if (d.heroTitle   && !d.heroTitle.color)   p.heroTitle   = withColor(d.heroTitle, WHITE);
    if (d.heroSub     && !d.heroSub.color)     p.heroSub     = withColor(d.heroSub, WHITE);
    return p;
  });

  console.log("siteSettings — CTA band + sustainability page hero...");
  await safePatch("siteSettings", (d) => {
    const p = {};
    if (d.ctaBand && typeof d.ctaBand === "object") {
      const cb = { ...d.ctaBand };
      let changed = false;
      if (cb.headline  && !cb.headline.color)  { cb.headline  = withColor(cb.headline, WHITE);  changed = true; }
      if (cb.subline   && !cb.subline.color)   { cb.subline   = withColor(cb.subline, WHITE);   changed = true; }
      if (cb.btn1Label && !cb.btn1Label.color) { cb.btn1Label = withColor(cb.btn1Label, WHITE);  changed = true; } // btn-red is also white text
      if (cb.btn2Label && !cb.btn2Label.color) { cb.btn2Label = withColor(cb.btn2Label, WHITE);  changed = true; } // ghost button sits on dark bg too
      if (changed) p.ctaBand = cb;
    }
    if (d.susSection && typeof d.susSection === "object") {
      const s = { ...d.susSection };
      let changed = false;
      if (s.pageTitle && !s.pageTitle.color) { s.pageTitle = withColor(s.pageTitle, WHITE); changed = true; }
      if (s.pageIntro && !s.pageIntro.color) { s.pageIntro = withColor(s.pageIntro, WHITE); changed = true; }
      if (changed) p.susSection = s;
    }
    return p;
  });

  console.log("pageSettings — every page's hero title/intro (ink background = white text)...");
  const pages = await client.fetch(`*[_type=="pageSettings"]`);
  for (const doc of pages) {
    const p = {};
    if (doc.pageTitle && !doc.pageTitle.color) p.pageTitle = withColor(doc.pageTitle, WHITE);
    if (doc.pageIntro && !doc.pageIntro.color) p.pageIntro = withColor(doc.pageIntro, WHITE);
    if (Object.keys(p).length === 0) { console.log(`  (already set or empty, left untouched: ${doc.pageId})`); continue; }
    await client.patch(doc._id).set(p).commit();
    console.log(`  ✓ set white on ${doc.pageId}: ${Object.keys(p).join(", ")}`);
  }

  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
