/**
 * Creates the `navigation` singleton so the header and footer stop rendering
 * from hardcoded arrays in HeaderV2/FooterV2 and become editable in Studio.
 * Seeded with exactly today's content — this is a hand-off of existing values
 * into Sanity, not a content change. Capabilities/Products dropdowns and the
 * footer's For/Capabilities columns stay auto-generated from their own
 * documents and are intentionally not included here.
 */
import { createClient } from "@sanity/client";
import { cliToken } from "./_auth.mjs";
import { randomUUID } from "node:crypto";

const client = createClient({
  projectId: "rvghw4zu", dataset: "v2",
  apiVersion: "2024-01-01", useCdn: false, token: cliToken(),
});

const key = () => randomUUID().slice(0, 8);

const doc = {
  _id: "navigation",
  _type: "navigation",
  mainNav: [
    { _key: key(), label: "Capabilities", href: "/capabilities", autoMenu: "capabilities" },
    { _key: key(), label: "Products", href: "/products", autoMenu: "products" },
    { _key: key(), label: "Company", href: "/company", autoMenu: "none", children: [
      { _key: key(), label: "About Us", href: "/company" },
      { _key: key(), label: "Facilities", href: "/company#facilities" },
    ] },
    { _key: key(), label: "Sustainability", href: "/sustainability", autoMenu: "none" },
    { _key: key(), label: "Why Indonesia", href: "/why-indonesia", autoMenu: "none" },
    { _key: key(), label: "Careers", href: "/careers", autoMenu: "none" },
    { _key: key(), label: "Blog", href: "/blog", autoMenu: "none" },
  ],
  footerColumns: [
    { _key: key(), title: "Company", links: [
      { _key: key(), label: "About Us", href: "/company" },
      { _key: key(), label: "Facilities", href: "/company#facilities" },
      { _key: key(), label: "Careers", href: "/careers" },
      { _key: key(), label: "Blog", href: "/blog" },
    ] },
    { _key: key(), title: "Resources", links: [
      { _key: key(), label: "Products", href: "/products" },
      { _key: key(), label: "Sustainability", href: "/sustainability" },
      { _key: key(), label: "Why Indonesia", href: "/why-indonesia" },
    ] },
  ],
};

const existing = await client.getDocument("navigation");
if (existing) {
  console.log("navigation document already exists — leaving it untouched. Delete it in Studio first if you want to reseed.");
  process.exit(0);
}

await client.createIfNotExists(doc);
console.log("Created navigation singleton with today's header and footer content.");
