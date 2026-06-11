import { createClient } from "@sanity/client";
import { readFileSync } from "fs";

const TOKEN = process.env.SANITY_TOKEN;
const client = createClient({ projectId: "rvghw4zu", dataset: "production", apiVersion: "2024-01-01", token: TOKEN, useCdn: false });
const load = (f) => JSON.parse(readFileSync(`/Users/sanjeeva/Documents/sansico/content/${f}.json`, "utf8"));

async function migrate() {
  console.log("\n🚀  Starting migration...\n");
  const t = client.transaction();
  const site = load("site");
  t.createOrReplace({ _id: "siteSettings", _type: "siteSettings", tagline: site.tagline, mission: site.mission, ctaLabel: site.cta.label, email: site.contact.email, whatsapp: site.contact.whatsapp?.number || "", phones: site.contact.phones, nav: site.nav.map((n, i) => ({ _key: `nav${i}`, _type: "navItem", label: n.label, href: n.href })) });
  console.log("✓  Site Settings");
  const home = load("home");
  t.createOrReplace({ _id: "homePage", _type: "homePage", heroType: home.hero.type, heroEyebrow: home.hero.eyebrow, heroTitle: home.hero.title, heroSub: home.hero.sub, manifestoTitle: home.manifesto.title, manifestoBody: home.manifesto.body, stats: home.stats.map((s, i) => ({ _key: `stat${i}`, _type: "object", value: s.value, suffix: s.suffix, label: s.label })), customers: home.customers });
  console.log("✓  Home Page");
  const caps = load("capabilities");
  for (const [i, g] of caps.groups.entries()) { t.createOrReplace({ _id: `capability-${g.slug}`, _type: "capability", title: g.title, slug: { _type: "slug", current: g.slug }, num: g.num, summary: g.summary, body: g.body, points: g.points, order: i + 1 }); }
  console.log("✓  Capabilities (3)");
  const markets = load("markets");
  for (const [i, m] of markets.items.entries()) { t.createOrReplace({ _id: `market-${m.slug}`, _type: "market", title: m.title, slug: { _type: "slug", current: m.slug }, color: m.color, tag: m.tag, body: m.body, proof: m.proof, order: i + 1 }); }
  console.log("✓  Markets (5)");
  const products = load("products");
  for (const [i, p] of products.items.entries()) { t.createOrReplace({ _id: `product-${p.slug}`, _type: "product", title: p.title, slug: { _type: "slug", current: p.slug }, tag: p.tag, body: p.body, specs: p.specs, order: i + 1 }); }
  console.log("✓  Product Families (5)");
  const work = load("work");
  for (const w of work.items) { t.createOrReplace({ _id: `case-${w.slug}`, _type: "caseStudy", title: w.title, slug: { _type: "slug", current: w.slug }, kicker: w.kicker, quote: w.quote, body: w.body, stats: w.stats.map((s, i) => ({ _key: `cs${i}`, _type: "object", value: s.value, label: s.label })) }); }
  console.log("✓  Case Studies (3)");
  const sus = load("sustainability");
  for (const [i, c] of sus.certifications.entries()) { t.createOrReplace({ _id: `cert-${i}`, _type: "certification", name: c.name, category: c.category, scope: c.scope, entity: c.entity }); }
  console.log("✓  Certifications (11)");
  const loc = load("locations");
  for (const [i, f] of loc.items.entries()) { const capFac = caps.facilities.find((c) => c.name === f.name); t.createOrReplace({ _id: `facility-${i}`, _type: "facility", name: f.name, city: f.city, address: f.address, focus: capFac?.focus || "", order: i + 1 }); }
  console.log("✓  Facilities (10)");
  const careers = load("careers");
  t.createOrReplace({ _id: "careersPage", _type: "careersPage", title: careers.title, intro: careers.intro, values: careers.values.map((v, i) => ({ _key: `val${i}`, _type: "object", title: v.title, body: v.body })), openRoles: [] });
  console.log("✓  Careers Page");
  await t.commit();
  console.log("\n✅  Migration complete! Open http://localhost:3333 — everything is populated.\n");
}
migrate().catch((err) => { console.error("\n❌  Error:", err.message, "\n"); process.exit(1); });
