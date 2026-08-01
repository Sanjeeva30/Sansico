/**
 * A page must have exactly one H1.
 *
 * statementBlock now defaults to H2. On the three audience pages it IS the
 * page's main heading (there is no hero above it), so those are set to H1.
 * Home and Capabilities already have a hero H1, so their statement blocks
 * correctly fall through to the H2 default.
 */
import { createClient } from "@sanity/client";
import { cliToken } from "./_auth.mjs";

const client = createClient({
  projectId: "rvghw4zu", dataset: "v2",
  apiVersion: "2024-01-01", useCdn: false, token: cliToken(),
});

const pages = await client.fetch(
  `*[_type=="audiencePage"]{_id, "slug": slug.current, sections[]{_key, _type}}`
);

let tx = client.transaction();
let n = 0;
for (const p of pages) {
  const first = (p.sections || []).find((s) => s._type === "statementBlock");
  if (!first) continue;
  tx = tx.patch(p._id, { set: { [`sections[_key=="${first._key}"].headingLevel`]: "h1" } });
  console.log(`  /${p.slug} → statement block is H1`);
  n++;
}
if (!n) { console.log("Nothing to change."); process.exit(0); }
await tx.commit();
console.log(`\nSet H1 on ${n} audience page(s).`);
