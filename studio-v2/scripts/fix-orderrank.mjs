/**
 * Normalises legacy orderRank values.
 *
 * Documents cloned from the production dataset carry values like "00000003",
 * which are not valid LexoRank. @sanity/orderable-document-list logs
 * "Unknown bucket" for each one and drag-ordering breaks for those types.
 * Rewrites them to the same "0|00000n:" shape the v2 seed uses, preserving
 * existing relative order.
 */
import { createClient } from "@sanity/client";
import { cliToken } from "./_auth.mjs";

const client = createClient({
  projectId: "rvghw4zu", dataset: "v2",
  apiVersion: "2024-01-01", useCdn: false, token: cliToken(),
});

const docs = await client.fetch(`*[defined(orderRank)]{_id, _type, orderRank}`);
const bad = docs.filter((d) => !String(d.orderRank ?? "").startsWith("0|"));

if (!bad.length) {
  console.log("Nothing to fix — all orderRank values are valid LexoRank.");
  process.exit(0);
}

// Keep each type's existing order, just re-express it in a valid format.
const byType = {};
for (const d of bad) (byType[d._type] ||= []).push(d);

let tx = client.transaction();
let n = 0;
for (const [type, list] of Object.entries(byType)) {
  list.sort((a, b) => String(a.orderRank).localeCompare(String(b.orderRank)));
  list.forEach((d, i) => {
    tx = tx.patch(d._id, { set: { orderRank: `0|${(i + 1).toString().padStart(6, "0")}:` } });
    n++;
  });
  console.log(`  ${type}: ${list.length} document(s)`);
}
await tx.commit();

const still = (await client.fetch(`*[defined(orderRank)]{orderRank}`))
  .filter((d) => !String(d.orderRank ?? "").startsWith("0|")).length;
console.log(`\nRewrote ${n} orderRank values. Remaining malformed: ${still}`);
