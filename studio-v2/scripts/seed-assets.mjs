// Uploads the 36 certification logos extracted from "Sansico Certifications.pptx"
// into the v2 dataset, and writes a filename -> assetId map for the main seed.
//
// Run with:  npx sanity exec scripts/v2/seed-assets.mjs --with-user-token
// (from studio-v2/, which is configured for the v2 dataset)
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { cliToken } from "./_auth.mjs";

const client = createClient({
  projectId: "rvghw4zu", dataset: "v2",
  apiVersion: "2024-01-01", useCdn: false, token: cliToken(),
});
const MEDIA_DIR = process.env.CERT_MEDIA_DIR;
const OUT = process.env.CERT_MAP_OUT;

if (!MEDIA_DIR || !OUT) {
  console.error("Set CERT_MEDIA_DIR and CERT_MAP_OUT");
  process.exit(1);
}

// image<n> from the deck -> the certification it depicts, read off the slide.
const NAMES = {
  image4: "FSSC 22000", image5: "WWF / LCMP", image6: "CDP",
  image7: "Higg Index", image8: "amfori BEPI", image9: "Indonesian Legal Wood",
  image10: "FSC", image11: "GMI", image12: "Ethically Handcrafted",
  image13: "Global Recycled Standard", image14: "Master Colorspace G7",
  image15: "Target", image16: "Science Based Targets", image17: "Sedex",
  image18: "ICTI CARE", image19: "amfori Trade with Purpose",
  image20: "Social & Labor Convergence", image21: "ERSA",
  image22: "Walt Disney FAMA", image23: "Michaels", image24: "Costco Wholesale",
  image25: "Mattel", image26: "Inditex", image27: "Walmart FCCA",
  image28: "SGS", image29: "Supplier Qualification Program",
  image30: "ISO 9001:2015", image31: "Quality Assurance Factory Assessment (QAFA)",
  image32: "Capability & Capacity Validation", image33: "SCAN",
  image34: "Walgreens", image35: "Costco Wholesale (C-TPAT)", image36: "KAN",
};

const files = fs.readdirSync(MEDIA_DIR).filter((f) => /^image\d+\.(png|jpe?g)$/i.test(f));
const map = {};

for (const f of files) {
  const key = f.replace(/\.(png|jpe?g)$/i, "");
  const label = NAMES[key];
  if (!label) continue; // images 1-3 are slide decoration, not logos
  const asset = await client.assets.upload("image", fs.createReadStream(path.join(MEDIA_DIR, f)), {
    filename: `cert-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`,
    label,
  });
  map[label] = asset._id;
  console.log("uploaded", label, "->", asset._id);
}

fs.writeFileSync(OUT, JSON.stringify(map, null, 2));
console.log(`\n${Object.keys(map).length} certification logos uploaded.`);
