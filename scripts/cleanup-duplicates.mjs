/**
 * SANSICO — CLEANUP DUPLICATE DOCUMENTS
 * Deletes ONLY the exact duplicate documents created by seed-all.mjs.
 * Does NOT touch your original Capability/Market/Certification/Facility/
 * Case Study documents — those have different IDs and are untouched.
 * Run: SANITY_TOKEN=your_token node scripts/cleanup-duplicates.mjs
 */
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "rvghw4zu",
  dataset:   "production",
  apiVersion:"2024-01-01",
  token:     process.env.SANITY_TOKEN,
  useCdn:    false,
});

// Exact IDs created by seed-all.mjs — nothing else is touched.
const DUPLICATE_IDS = [
  // Capabilities
  "cap-cap1","cap-cap2","cap-cap3","cap-cap4","cap-cap5","cap-cap6",
  // Markets
  "market-mk1","market-mk2","market-mk3","market-mk4","market-mk5",
  // Certifications
  "cert-c1","cert-c2","cert-c3","cert-c4","cert-c5","cert-c6","cert-c7","cert-c8",
  // Facilities
  "facility-f1","facility-f2","facility-f3",
  // Case Studies
  "case-cs1","case-cs2","case-cs3",
  // Team (placeholder person doc)
  "person-sg",
];

async function deleteBoth(id) {
  const ids = [id, `drafts.${id}`];
  for (const docId of ids) {
    try {
      await client.delete(docId);
      console.log(`  ✓ deleted ${docId}`);
    } catch (e) {
      // Not found is fine — means it never existed in that state
      if (e.statusCode === 404 || /not found/i.test(e.message)) {
        console.log(`  · ${docId} not found (already clean)`);
      } else {
        console.error(`  ✗ ${docId}: ${e.message}`);
      }
    }
  }
}

async function run() {
  console.log(`\n🧹 Removing ${DUPLICATE_IDS.length} duplicate documents...\n`);
  for (const id of DUPLICATE_IDS) {
    await deleteBoth(id);
  }
  console.log(`\n✅ Cleanup complete. Refresh Sanity Studio — your original`);
  console.log(`   Capabilities, Markets, Certifications, Facilities and Case`);
  console.log(`   Studies should now be the only entries in each list.\n`);
  console.log(`⚠️  Home Page, Company Page, Careers Page and Site Settings were`);
  console.log(`   NOT touched by this script — those need to be restored via`);
  console.log(`   Sanity's History panel (see instructions).\n`);
}

run().catch(e => { console.error("Fatal:", e); process.exit(1); });
