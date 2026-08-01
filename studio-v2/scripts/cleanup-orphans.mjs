/**
 * Removes documents inherited from the production clone that the v2 schema no
 * longer defines. All were verified unreferenced before deletion:
 *
 *  - `product` (5 docs, created 2026-06-11): predates productCategory /
 *    productItem. The type does not exist in the v2 schema, so these are
 *    invisible in Studio and unreachable from the site.
 *  - a titleless `newsPost` draft: v2 uses blogPost; there are zero published
 *    newsPost documents left.
 *
 * Both surfaced as warnings from `sanity documents validate`.
 */
import { createClient } from "@sanity/client";
import { cliToken } from "./_auth.mjs";

const client = createClient({
  projectId: "rvghw4zu", dataset: "v2",
  apiVersion: "2024-01-01", useCdn: false, token: cliToken(),
});

const orphans = await client.fetch(`*[_type == "product" || _type == "newsPost"]{
  _id, _type, "refs": count(*[references(^._id)])
}`);

if (!orphans.length) {
  console.log("Nothing to clean up.");
  process.exit(0);
}

const referenced = orphans.filter((d) => d.refs > 0);
if (referenced.length) {
  console.error("Refusing to delete — these are still referenced:");
  for (const d of referenced) console.error(`  ${d._id} (${d.refs} refs)`);
  process.exit(1);
}

let tx = client.transaction();
for (const d of orphans) {
  console.log(`  delete ${d._type.padEnd(10)} ${d._id}`);
  tx = tx.delete(d._id);
}
await tx.commit();

const left = await client.fetch(`count(*[_type == "product" || _type == "newsPost"])`);
console.log(`\nDeleted ${orphans.length}. Remaining: ${left}`);
