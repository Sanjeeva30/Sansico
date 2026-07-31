// The v2 dataset was seeded from a copy of production, so the pre-wireframe
// productItem documents came along with it. They have no slugs and no variants,
// and their photography has already been re-attached to the new canonical
// products, so they only create duplicate/broken listings. Remove them.
import { createClient } from "@sanity/client";
import { cliToken } from "./_auth.mjs";

const client = createClient({
  projectId: "rvghw4zu", dataset: "v2",
  apiVersion: "2024-01-01", useCdn: false, token: cliToken(),
});

const legacy = await client.fetch(
  `*[_type=="productItem" && !(_id match "prod-*")]{_id, "name": name.text}`
);
console.log(`Removing ${legacy.length} legacy product items:`);
for (const d of legacy) console.log("  -", d.name || d._id);

let tx = client.transaction();
for (const d of legacy) tx = tx.delete(d._id);
await tx.commit();

const remaining = await client.fetch(`count(*[_type=="productItem"])`);
console.log(`\n${remaining} product items remain.`);
