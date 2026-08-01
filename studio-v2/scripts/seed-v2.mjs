/**
 * Seeds the v2 dataset to match the design team's wireframe.
 *
 * Sources, in priority order:
 *   1. Real Sansico content already in the dataset (facilities, product photos,
 *      customer logos, certification logos) — reused, never replaced.
 *   2. The wireframe's copy — used for everything it specifies.
 *   3. Written here — only where neither of the above has anything.
 *
 * Idempotent: every document has a stable id and is created-or-replaced.
 *
 * Run from studio-v2/:  node scripts/seed-v2.mjs
 */
import fs from "node:fs";
import { createClient } from "@sanity/client";
import { cliToken } from "./_auth.mjs";

const client = createClient({
  projectId: "rvghw4zu", dataset: "v2",
  apiVersion: "2024-01-01", useCdn: false, token: cliToken(),
});

const certMap = JSON.parse(fs.readFileSync(process.env.CERT_MAP, "utf8"));

/* ── helpers ─────────────────────────────────────────── */
let keySeq = 0;
const k = () => `k${(++keySeq).toString(36)}${Date.now().toString(36).slice(-4)}`;

const s = (text, extra = {}) => (text == null ? undefined : { _type: "styledString", text, ...extra });
const t = (text, extra = {}) => (text == null ? undefined : { _type: "styledText", text, ...extra });
const imgRef = (id) => (id ? { _type: "image", asset: { _type: "reference", _ref: id } } : undefined);
const rimg = (id, alt, caption) =>
  id ? { _type: "richImage", _key: k(), image: imgRef(id), alt, caption: caption ? s(caption) : undefined } : undefined;
const link = (label, href, newTab = false) => ({ _type: "linkField", label: s(label), href, newTab });
const ref = (id) => ({ _type: "reference", _ref: id, _key: k() });
const head = (kicker, heading, intro) => ({ _type: "sectionHead", kicker: s(kicker), heading: s(heading), intro: t(intro) });

// Section-block factory: stamps _type/_key and the shared visible/theme fields.
const B = (type, fields = {}, { theme = "paper", anchorId } = {}) => ({
  _type: type, _key: k(), visible: true, theme, anchorId, ...fields,
});

/* ── asset lookup ────────────────────────────────────── */
const assets = await client.fetch(`*[_type=="sanity.imageAsset"]{_id, originalFilename}`);
const byName = new Map();
for (const a of assets) if (a.originalFilename) byName.set(a.originalFilename.toLowerCase(), a._id);
const A = (filename) => {
  const id = byName.get(filename.toLowerCase());
  if (!id) console.warn("  ! missing asset:", filename);
  return id;
};
const CERT = (name) => certMap[name];

/* ── real facilities already in the dataset ──────────── */
const facilities = await client.fetch(
  `*[_type=="facility"]|order(orderRank asc){_id, "name": name.text, "focus": focus.text}`
);
const facByName = (frag) => facilities.find((f) => (f.name || "").toLowerCase().includes(frag.toLowerCase()));

// The wireframe splits facilities into "Paper Product Facility" and "Toy
// Facilities". Sansico's real estate has one dedicated toy plant (Printec
// Perkasa II, Cikarang); everything else is paper/handicraft/cut-and-sew.
const TOY_FACILITIES = ["Printec Perkasa II"];

const docs = [];
const push = (d) => { docs.push(d); return d._id; };

/* ═══════════════════ 1. Facilities: add group ═══════════════════ */
const facilityPatches = facilities.map((f) => ({
  patch: {
    id: f._id,
    set: { facilityGroup: TOY_FACILITIES.some((n) => (f.name || "").includes(n)) ? "toy" : "paper" },
  },
}));

/* ═══════════════════ 2. Product categories ═══════════════════ */
// Wireframe's six categories. Real Sansico category docs are reused where they
// exist (keeping their photos); Party & Tableware is new.
const existingCats = await client.fetch(`*[_type=="productCategory"]{_id, "name": name.text}`);
const catId = (frag, fallbackId) =>
  existingCats.find((c) => (c.name || "").toLowerCase().includes(frag.toLowerCase()))?._id || fallbackId;

const CATS = [
  { id: catId("Gift Packaging", "cat-gift-packaging"), slug: "gift-packaging", name: "Gift Packaging",
    blurb: "FSC-certified paper bags, wrapping paper and tissue engineered for retail gifting programmes.",
    cover: A("Gift Packaging.png") },
  { id: "cat-party-tableware", slug: "party-tableware", name: "Party & Tableware",
    blurb: "Paper cups, plates and napkins produced to FSSC 22000 food-safety standards.",
    cover: A("Products Photo 1200 x 400.png") },
  { id: catId("FMCG", "cat-fmcg-packaging"), slug: "fmcg-packaging", name: "FMCG Packaging",
    blurb: "Folding cartons and flexible packaging produced for fast-moving consumer goods brands.",
    cover: A("FMCG Packaging & Packaging for Export Industry.png") },
  { id: catId("Toys", "cat-toys"), slug: "toys", name: "Toys & Toy Packaging",
    blurb: "Safety-tested toy production and packaging, certified against international toy safety standards.",
    cover: A("Gemini_Generated_Image_a7tzxpa7tzxpa7tz.png") || A("25.png") },
  { id: catId("Cut & Sew", "cat-cut-sew"), slug: "cut-sew", name: "Cut & Sew",
    blurb: "Costumes, pouches and soft accessories produced in-house with full material traceability.",
    cover: A("image.png") },
  { id: catId("Handicraft", "cat-handicraft"), slug: "handicraft", name: "Handicraft",
    blurb: "Rattan, water hyacinth and woven home decor made through NEST-certified artisan programmes.",
    cover: A("Handicraft.png") },
];

CATS.forEach((c, i) => push({
  _id: c.id, _type: "productCategory", visible: true,
  orderRank: `0|${(i + 1).toString().padStart(6, "0")}:`,
  name: s(c.name), slug: { _type: "slug", current: c.slug },
  blurb: t(c.blurb), description: t(c.blurb),
  coverImage: imgRef(c.cover),
}));

/* ═══════════════════ 3. Products + variants ═══════════════════ */
// Product photography here is all real Sansico product shots from the dataset.
const PRODUCTS = [
  { cat: "gift-packaging", slug: "paper-bags", name: "Paper Bags", material: "120gsm White Kraft",
    variants: [
      { img: A("_MG_0807.jpg"), cap: "Kraft gift bag with ribbon handle", material: "120gsm White Kraft", technique: "Foil Stamping", moq: "10,000 units", designer: "Sansico Design Studio" },
      { img: A("_MG_0230.jpg"), cap: "Printed holiday gift bag", material: "120gsm White Kraft", technique: "Offset + Glitter", moq: "10,000 units", designer: "Sansico Design Studio" },
      { img: A("240-02-2945_12.jpg"), cap: "Seasonal gift bag assortment", material: "120gsm White Kraft", technique: "Foil + Die-Cut Handle", moq: "10,000 units", designer: "Sansico Design Studio" },
    ] },
  { cat: "gift-packaging", slug: "gift-wrap", name: "Gift Wrap", material: "80gsm Recycled Paper",
    variants: [
      { img: A("_MG_0818.jpg"), cap: "Roll-fed printed gift wrap", material: "80gsm Recycled Paper", technique: "Offset Print", moq: "20,000 units", designer: "Sansico Design Studio" },
      { img: A("_MG_7862.png"), cap: "Rollwrap range, kraft and coated stocks", material: "80gsm Recycled Paper", technique: "Flexo Print", moq: "20,000 units", designer: "Sansico Design Studio" },
    ] },
  { cat: "gift-packaging", slug: "gift-tissue", name: "Gift Tissue", material: "17gsm Acid-Free Tissue",
    variants: [
      { img: A("Tissue paper (1).png"), cap: "Printed tissue sheets, folded", material: "17gsm Acid-Free Tissue", technique: "Flexo Print", moq: "25,000 units", designer: "Sansico Design Studio" },
      { img: A("Tissue paper (2).png"), cap: "Two-tone tissue, banded", material: "17gsm Acid-Free Tissue", technique: "Flexo Print", moq: "25,000 units", designer: "Sansico Design Studio" },
      { img: A("tissue production-01.png"), cap: "Tissue production line", material: "17gsm Acid-Free Tissue", technique: "In-line Converting", moq: "25,000 units", designer: "—" },
    ] },
  { cat: "gift-packaging", slug: "rigid-box", name: "Rigid Box", material: "Greyboard + Wrap",
    variants: [
      { img: A("IMG_4747.jpg"), cap: "Novelty rigid gift box", material: "Greyboard + Printed Wrap", technique: "Hand-Wrapped Rigid", moq: "5,000 units", designer: "Sansico Design Studio" },
    ] },

  { cat: "party-tableware", slug: "paper-cups", name: "Paper Cups", material: "PE-Coated Paperboard",
    variants: [
      { img: A("10.png"), cap: "Printed party cup, 9oz", material: "PE-Coated Paperboard", technique: "Offset + PE Coating", moq: "30,000 units", designer: "Sansico Design Studio" },
      { img: A("12.png"), cap: "Monochrome print party cup", material: "PE-Coated Paperboard", technique: "Offset + PE Coating", moq: "30,000 units", designer: "Sansico Design Studio" },
      { img: A("13.png"), cap: "Patterned party cup", material: "PE-Coated Paperboard", technique: "Offset + PE Coating", moq: "30,000 units", designer: "Sansico Design Studio" },
    ] },
  { cat: "party-tableware", slug: "paper-plates", name: "Paper Plates", material: "Bagasse / Kraft Board",
    variants: [
      { img: A("5.png"), cap: "Die-cut seasonal party plate", material: "Bagasse / Kraft Board", technique: "Die-Cut & Print", moq: "30,000 units", designer: "Sansico Design Studio" },
      { img: A("7.png"), cap: "Printed round party plate", material: "Bagasse / Kraft Board", technique: "Die-Cut & Print", moq: "30,000 units", designer: "Sansico Design Studio" },
    ] },
  { cat: "party-tableware", slug: "party-accessories", name: "Party Accessories", material: "Mixed Paper Stock",
    variants: [
      { img: A("Products Photo 1200 x 400.png"), cap: "Coordinated party range", material: "Mixed Paper Stock", technique: "Offset + Die-Cut", moq: "20,000 units", designer: "Sansico Design Studio" },
      { img: A("6.png"), cap: "Die-cut seasonal accessory", material: "300gsm Board", technique: "Die-Cut & Print", moq: "20,000 units", designer: "Sansico Design Studio" },
    ] },

  { cat: "fmcg-packaging", slug: "folding-cartons", name: "Folding Cartons", material: "GMI-Certified Board",
    variants: [
      { img: A("14.png"), cap: "Printed FMCG folding carton", material: "GMI-Certified Board", technique: "Offset + Die-Cut", moq: "20,000 units", designer: "Customer artwork" },
      { img: A("FMCG Packaging & Packaging for Export Industry.png"), cap: "FMCG packaging programme range", material: "GMI-Certified Board", technique: "Offset + Die-Cut", moq: "20,000 units", designer: "Customer artwork" },
    ] },
  { cat: "fmcg-packaging", slug: "export-packaging", name: "Export Packaging", material: "Corrugated + Litho Laminate",
    variants: [
      { img: A("18.png"), cap: "Retail-ready export pack", material: "Corrugated + Litho Laminate", technique: "Litho Lamination", moq: "15,000 units", designer: "Customer artwork" },
    ] },

  { cat: "toys", slug: "blister-packs", name: "Blister Packaging", material: "PET Blister + Printed Card",
    variants: [
      { img: A("25.png"), cap: "Toy blister pack on printed card", material: "PET Blister + Printed Card", technique: "Thermoforming", moq: "15,000 units", designer: "Customer artwork" },
      { img: A("24.png"), cap: "Multi-pack blister carded set", material: "PET Blister + Printed Card", technique: "Thermoforming", moq: "15,000 units", designer: "Customer artwork" },
    ] },
  { cat: "toys", slug: "toy-boxes", name: "Toy Boxes", material: "Folding Carton, GMI-Certified",
    variants: [
      { img: A("21.png"), cap: "Printed retail toy box with window", material: "Folding Carton, GMI-Certified", technique: "Offset + Die-Cut", moq: "10,000 units", designer: "Customer artwork" },
    ] },
  { cat: "toys", slug: "dolls-plush", name: "Dolls & Soft Toys", material: "Polyester Plush + PP Filling",
    variants: [
      { img: A("15.png"), cap: "Soft-bodied doll range, safety-tested filling", material: "Polyester Plush + PP Filling", technique: "Cut & Sew", moq: "5,000 units", designer: "Sansico Design Studio" },
    ] },

  { cat: "cut-sew", slug: "costumes", name: "Costumes", material: "Mixed Textile",
    variants: [
      { img: A("image.png"), cap: "Dress-up costume assortment", material: "Mixed Textile", technique: "Cut & Sew", moq: "5,000 units", designer: "Sansico Design Studio" },
      { img: A("29.png"), cap: "Costume dress range", material: "Mixed Textile", technique: "Cut & Sew", moq: "5,000 units", designer: "Sansico Design Studio" },
    ] },
  { cat: "cut-sew", slug: "doll-clothing", name: "Doll Clothing", material: "Cotton Blend",
    variants: [
      { img: A("26.png"), cap: "Doll outfit sets", material: "Cotton Blend", technique: "Cut & Sew", moq: "8,000 units", designer: "Sansico Design Studio" },
    ] },
  { cat: "cut-sew", slug: "soft-accessories", name: "Soft Accessories", material: "Non-Woven / Canvas",
    variants: [
      { img: A("_MG_2535.JPG"), cap: "Structured fabric storage tote", material: "Non-Woven Polypropylene", technique: "Cut & Sew", moq: "8,000 units", designer: "Sansico Design Studio" },
      { img: A("gaji_pillow.jpg"), cap: "Woven cushion cover", material: "Natural Fibre Blend", technique: "Hand-Woven & Sewn", moq: "3,000 units", designer: "Sansico Design Studio" },
    ] },

  { cat: "handicraft", slug: "rattan-baskets", name: "Rattan Baskets", material: "FSC-Certified Rattan",
    variants: [
      { img: A("31.png"), cap: "Woven rattan storage basket", material: "FSC-Certified Rattan", technique: "Hand-Woven", moq: "2,000 units", designer: "Cirebon artisan workshop" },
      { img: A("IMG_6226.JPG"), cap: "Rattan basket with handles", material: "FSC-Certified Rattan", technique: "Hand-Woven", moq: "2,000 units", designer: "Cirebon artisan workshop" },
      { img: A("_MG_2536.JPG"), cap: "Lidded woven storage basket", material: "FSC-Certified Rattan", technique: "Hand-Woven", moq: "2,000 units", designer: "Cirebon artisan workshop" },
    ] },
  { cat: "handicraft", slug: "water-hyacinth", name: "Water Hyacinth", material: "Water Hyacinth Fibre",
    variants: [
      { img: A("enceng1.jpg"), cap: "Water hyacinth fibre, prepared for weaving", material: "Water Hyacinth Fibre", technique: "Hand-Woven", moq: "2,000 units", designer: "Yogyakarta artisan programme" },
      { img: A("IMG_5646.jpg"), cap: "Woven water hyacinth homeware", material: "Water Hyacinth Fibre", technique: "Hand-Woven", moq: "2,000 units", designer: "Yogyakarta artisan programme" },
    ] },
  { cat: "handicraft", slug: "woven-home-decor", name: "Woven Home Decor", material: "Natural Fibre Blend",
    variants: [
      { img: A("Header 1440x810 Productss.jpg"), cap: "Woven homeware collection", material: "Natural Fibre Blend", technique: "Hand-Woven", moq: "2,000 units", designer: "Sansico Design Studio" },
      { img: A("32.png"), cap: "Woven decorative piece", material: "Natural Fibre Blend", technique: "Hand-Woven", moq: "2,000 units", designer: "Sansico Design Studio" },
      { img: A("IMG_1312.JPG"), cap: "Woven basket with fabric lining", material: "Natural Fibre Blend", technique: "Hand-Woven", moq: "2,000 units", designer: "Sansico Design Studio" },
    ] },
];

const catIdBySlug = Object.fromEntries(CATS.map((c) => [c.slug, c.id]));

PRODUCTS.forEach((p, i) => push({
  _id: `prod-${p.slug}`, _type: "productItem", visible: true,
  orderRank: `0|${(i + 1).toString().padStart(6, "0")}:`,
  name: s(p.name), slug: { _type: "slug", current: p.slug },
  category: { _type: "reference", _ref: catIdBySlug[p.cat] },
  material: s(p.material),
  moq: s(p.variants[0]?.moq),
  description: t(`${p.name} produced across Sansico's certified facilities in Indonesia and China.`),
  photos: p.variants.filter((v) => v.img).map((v) => ({
    _type: "image", _key: k(), asset: { _type: "reference", _ref: v.img }, caption: v.cap,
  })),
  variants: p.variants.filter((v) => v.img).map((v) => ({
    _type: "productVariant", _key: k(),
    image: rimg(v.img, v.cap, v.cap),
    material: s(v.material), technique: s(v.technique), moq: s(v.moq), designer: s(v.designer),
  })),
}));

/* ═══════════════════ 4. Customer stories ═══════════════════ */
const CUSTOMERS = [
  { id: "cust-mattel", name: "Mattel", location: "El Segundo, USA", logo: A("mattel.png"),
    img: A("25.png"), cap: "Mattel toy packaging programme",
    quote: "Sansico's safety-tested toy packaging and in-house lab give us one less thing to worry about across every product line we ship with them." },
  { id: "cust-target", name: "Target", location: "Minneapolis, USA", logo: A("target logo.png"),
    img: A("_MG_0230.jpg"), cap: "Target seasonal gift packaging programme",
    quote: "Sansico has grown with us for over fifteen years, scaling gift packaging programmes across every major holiday reset without missing a delivery window." },
  { id: "cust-hallmark", name: "Hallmark", location: "Kansas City, USA", logo: A("hallmark logo.png"),
    img: A("_MG_0807.jpg"), cap: "Hallmark gift bag and wrap production",
    quote: "Their design studio understands our brand as well as our internal team does — samples arrive production-ready, season after season." },
  { id: "cust-american-greetings", name: "American Greetings", location: "Cleveland, USA", logo: A("13.png"),
    img: A("Products Photo 1200 x 400.png"), cap: "American Greetings party goods line",
    quote: "We've expanded from gift wrap into tableware and toys with Sansico, and every category meets the same bar for safety and finish." },
  { id: "cust-walmart", name: "Walmart", location: "Bentonville, USA", logo: A("walmart-logo.png"),
    img: A("Sasnico.png"), cap: "Walmart private-label packaging programme",
    quote: "Verified compliance and a single accountable partner across ten facilities made Sansico an easy choice for our private-label rollout." },
];
CUSTOMERS.forEach((c, i) => push({
  _id: c.id, _type: "customerStory", visible: true,
  orderRank: `0|${(i + 1).toString().padStart(6, "0")}:`,
  name: s(c.name), location: s(c.location), quote: t(c.quote),
  image: rimg(c.img, c.cap, c.cap), logo: imgRef(c.logo),
  link: link("Our story", "/company"),
}));

/* ═══════════════════ 5. Timeline milestones ═══════════════════ */
const MILESTONES = [
  { year: "1986", title: "Founded in West Java", copy: "A single paper-converting workshop begins producing gift wrap for the local market.", img: A("Sasnico.png") },
  { year: "1991", title: "PT Printec Perkasa, Tangerang", copy: "First dedicated handicraft and paper-twisted production facility opens.", img: A("PP Tangerang.jpg") },
  { year: "1993", title: "PT Grafitecindo Ciptaprima", copy: "Box and GMI-certified packaging facility added to serve FMCG customers.", img: A("Grafitec.jpg") },
  { year: "1997", title: "PT Printec Perkasa II, Cikarang", copy: "Toy production and toy packaging line opens to serve global toy brands.", img: A("PT. Printec Perkasa-Cikarang.png") },
  { year: "1998", title: "Foshan Sansico", copy: "First China facility opens, adding gift bags, tags and rigid box production.", img: A("Foshan.jpg") },
  { year: "2010", title: "ISO 17025 Laboratory", copy: "In-house safety laboratory accredited for heavy metals and phthalates testing.", img: A("iso-17025-grahita-indonesia.png") },
  { year: "2018", title: "Handicraft Expansion", copy: "Yogyakarta workshops scale up under NEST-certified artisan programmes.", img: A("IGP Piyungan.jpg") },
  { year: "2024", title: "Ten Facilities, Two Hubs", copy: "Group reaches ten certified facilities, shipping to 500 million homes a year.", img: A("IGP Bantul.jpg") },
];
MILESTONES.forEach((m, i) => push({
  _id: `ms-${m.year}`, _type: "milestone", visible: true,
  orderRank: `0|${(i + 1).toString().padStart(6, "0")}:`,
  year: s(m.year), title: s(m.title), copy: t(m.copy),
  image: rimg(m.img, `${m.year} — ${m.title}`),
}));

/* ═══════════════════ 6. Certification groups ═══════════════════ */
// Exactly the 14 groups and two columns from the deck and the wireframe.
const CERT_GROUPS = [
  { col: 1, title: "Social Compliance", items: ["Sedex", "ICTI CARE", "amfori Trade with Purpose", "Social & Labor Convergence"] },
  { col: 1, title: "Social Compliance", sub: "(Customer Certifications)", items: ["Michaels", "Costco Wholesale", "Mattel", "Inditex", "Walt Disney FAMA", "ERSA"] },
  { col: 1, title: "C-TPAT", items: ["SCAN"] },
  { col: 1, title: "C-TPAT", sub: "(Customer Certifications)", items: ["Costco Wholesale (C-TPAT)", "Walgreens"] },
  { col: 1, title: "Quality", items: ["Supplier Qualification Program", "ISO 9001:2015"] },
  { col: 1, title: "Quality", sub: "(Customer Certifications)", items: ["Michaels", "Mattel", "Walmart FCCA", "Quality Assurance Factory Assessment (QAFA)", "Capability & Capacity Validation"] },
  { col: 1, title: "Laboratory", items: ["KAN", "Mattel", "SGS"] },
  { col: 2, title: "Printing", items: ["GMI", "Master Colorspace G7"] },
  { col: 2, title: "Food Safety", items: ["FSSC 22000"] },
  { col: 2, title: "Forestry", items: ["FSC", "Indonesian Legal Wood"] },
  { col: 2, title: "Environmental", items: ["Higg Index", "amfori BEPI", "Target"] },
  { col: 2, title: "Sustainability", items: ["WWF / LCMP", "CDP", "Science Based Targets"] },
  { col: 2, title: "Recycled", items: ["Global Recycled Standard"] },
  { col: 2, title: "Beyond Compliance", items: ["Ethically Handcrafted"] },
];
const certGroupIds = CERT_GROUPS.map((g, i) => push({
  _id: `certgrp-${i}`, _type: "certificationGroup", visible: true,
  orderRank: `0|${(i + 1).toString().padStart(6, "0")}:`,
  title: s(g.title), sub: g.sub ? s(g.sub) : undefined, column: g.col,
  items: g.items.map((name) => ({
    _type: "object", _key: k(),
    name: s(name.replace(/ \(C-TPAT\)$/, "")),
    logo: imgRef(CERT(name)),
  })),
}));

/* ═══════════════════ 7. Sourcing scorecard ═══════════════════ */
push({
  _id: "sourcingScorecard", _type: "sourcingScorecard",
  title: "ASEAN risk-adjusted sourcing scorecard",
  legend: [["5", "Strongest"], ["4", "Strong"], ["3", "Moderate"], ["2", "Limited"], ["1", "Weakest"]]
    .map(([n, l]) => ({ _type: "object", _key: k(), n: s(n), label: s(l) })),
  columns: ["Cost Corridor", "Scale", "Materials", "Infrastructure", "Compliance", "Trade Risk"],
  rows: [
    { c: "Indonesia", star: true, sc: [4, 5, 5, 4, 4, 4], tot: 26 },
    { c: "Vietnam", sc: [4, 4, 3, 4, 3, 2], tot: 20 },
    { c: "Cambodia", sc: [5, 2, 1, 2, 3, 3], tot: 16 },
    { c: "Thailand", sc: [2, 3, 3, 5, 4, 4], tot: 21 },
    { c: "Malaysia", sc: [2, 3, 4, 5, 4, 4], tot: 22 },
    { c: "Philippines", sc: [3, 2, 2, 3, 3, 4], tot: 17 },
  ].map((r) => ({ _type: "object", _key: k(), country: s(r.c), starred: !!r.star, scores: r.sc, total: r.tot,
    highlightColor: r.star ? "#7A0D20" : undefined })),
  footnoteTitle: s("Vietnam NME risk"),
  footnote: t("USTR has not revoked Vietnam's NME status. US CBP anti-circumvention investigations targeting Vietnam-origin goods with Chinese inputs remain active. Retailers with >40% Vietnam concentration face material tariff exposure in a stress scenario."),
  conclusionTitle: s("Balanced conclusion:"),
  conclusion: t("Indonesia scores 26/30 on a risk-adjusted ASEAN sourcing evaluation, outperforming Vietnam (20), Thailand (21), Malaysia (22), Cambodia (16) and Philippines (17). The gap is widest on Materials and Scale — Indonesia's structurally differentiated strengths."),
});

/* ═══════════════════ 8. Job roles ═══════════════════ */
const ABOUT = "For forty years, Sansico has been the manufacturing partner behind the seasonal aisle — gift bags, wraps, boxes, handicrafts and toys that reach 500 million homes each year, produced across ten certified facilities in Indonesia and China.";
const ROLES = [
  { slug: "production-supervisor", role: "Production Supervisor", dept: "Manufacturing", location: "Jakarta, Indonesia", type: "Full-Time", img: A("Sasnico.png"),
    summary: "The Production Supervisor oversees a dedicated line within our Jakarta paper-products facility, ensuring output, safety and quality targets are met across every shift. Reporting to the Plant Manager, you will be the first point of accountability for the people and process on your line.",
    willDo: ["Plan and supervise daily production schedules across assigned lines", "Monitor output, waste and downtime, escalating issues before they affect delivery", "Enforce safety procedures and PPE compliance on the factory floor", "Coordinate with QA to hold products to ISO and FSSC standards", "Train, schedule and evaluate line operators", "Report shift performance to the Plant Manager"],
    youAre: ["Comfortable managing a team of 20+ operators in a fast-paced plant", "Calm under pressure during peak seasonal production runs", "Data-driven — comfortable reading output and downtime reports", "Fluent in Bahasa Indonesia; working English a plus"],
    youHave: ["3+ years supervising a manufacturing line, ideally in packaging or paper converting", "Working knowledge of ISO 9001 and FSSC 22000 practices", "A diploma or degree in industrial/manufacturing engineering or equivalent experience"],
    comp: "Compensation is benchmarked to Jakarta manufacturing-sector supervisory roles and includes shift allowances and annual performance bonus." },
  { slug: "quality-assurance-engineer", role: "Quality Assurance Engineer", dept: "Manufacturing Solutions", location: "Foshan, China", type: "Full-Time", img: A("iso-17025-grahita-indonesia.png"),
    summary: "The QA Engineer supports our Foshan facility's in-house testing programme, verifying incoming materials and finished goods against ISO 17025 and customer-specific safety standards before a shipment ever leaves the dock.",
    willDo: ["Run heavy-metal and phthalate screening on incoming materials", "Maintain calibration and traceability records for lab equipment", "Investigate and document non-conformances with production", "Support customer and third-party compliance audits", "Partner with Manufacturing Solutions to correct issues upstream, not after shipment"],
    youAre: ["Detail-oriented, comfortable with structured lab documentation", "A clear communicator across engineering and production teams", "Able to prioritise testing queues during high-volume seasons"],
    youHave: ["2+ years in a QA/QC or materials-testing laboratory role", "Familiarity with ISO 17025 or an equivalent accredited lab standard", "A degree in chemistry, materials science or a related field"],
    comp: "Compensation is benchmarked to Foshan quality-engineering roles and includes an annual lab-accreditation training allowance." },
  { slug: "compliance-trade-analyst", role: "Compliance & Trade Analyst", dept: "Vendor Operations", location: "Jakarta HQ", type: "Full-Time", img: A("CTPAT.png"),
    summary: "Based at our Jakarta HQ, the Compliance & Trade Analyst supports Vendor Operations in keeping every group facility's certifications, audits and export documentation current and audit-ready for our buyers' compliance teams.",
    willDo: ["Track certification renewal dates across all ten group facilities (FSC, FSSC, C-TPAT, Higg, amfori BEPI)", "Prepare audit-ready documentation packages for customer compliance reviews", "Coordinate with external auditors and certification bodies", "Flag compliance gaps to Vendor Operations leadership ahead of shipment", "Maintain the internal certification and scope registry"],
    youAre: ["Organised, precise, and comfortable owning a recurring compliance calendar", "Confident communicating with both auditors and internal stakeholders", "Interested in trade compliance and sustainable-sourcing standards"],
    youHave: ["2+ years in compliance, trade or supply-chain administration", "Exposure to social or environmental certification schemes a plus", "Strong written English for customer-facing documentation"],
    comp: "Compensation is benchmarked to Jakarta HQ compliance-analyst roles and includes an annual review bonus tied to audit outcomes." },
  { slug: "product-designer", role: "Product Designer", dept: "Design & Creative Studio", location: "Jakarta, Indonesia", type: "Full-Time", img: A("Capabilities - 1600x1000px.png"),
    summary: "Our Design & Creative Studio is looking for a Product Designer to develop artwork and structural packaging concepts across gift, party and toy categories — from trend research through production-ready files.",
    willDo: ["Research seasonal trends and translate them into concept boards", "Develop artwork and structural packaging designs for volume manufacture", "Engineer designs to fit approved materials, MOQs and production techniques", "Partner with Manufacturing Solutions on prototyping and pre-production samples", "Present concepts to customers alongside the account team"],
    youAre: ["A strong visual storyteller with an eye for retail-ready design", "Comfortable adapting creative concepts to manufacturing constraints", "Collaborative across design, manufacturing and account teams"],
    youHave: ["3+ years in product, packaging or surface-pattern design", "A portfolio demonstrating retail or consumer packaged goods work", "Proficiency in Adobe Illustrator and structural packaging software"],
    comp: "Compensation is benchmarked to Jakarta creative-studio roles and includes a project-based design bonus." },
  { slug: "logistics-coordinator", role: "Logistics Coordinator", dept: "Vendor Operations", location: "Foshan, China", type: "Full-Time", img: A("Foshan.jpg"),
    summary: "The Logistics Coordinator supports Vendor Operations in our Foshan office, managing EXIM documentation, bonded-zone consolidation and delivery scheduling so customer shipments move door-to-door without delay.",
    willDo: ["Coordinate export documentation and customs filings for outbound shipments", "Manage bonded-zone consolidation across multiple product lines", "Track shipment status and resolve delays with freight partners", "Maintain delivery schedules against customer Incoterms", "Support demand planning with shipment forecasts"],
    youAre: ["Organised and responsive under shipment deadlines", "Comfortable coordinating with freight forwarders and customs agents", "Fluent in Mandarin and working English"],
    youHave: ["2+ years in logistics, freight forwarding or EXIM coordination", "Familiarity with bonded-zone or free-trade-zone operations a plus", "A degree in logistics, supply chain or international trade preferred"],
    comp: "Compensation is benchmarked to Foshan logistics-coordinator roles and includes a quarterly on-time-delivery bonus." },
];
const roleIds = ROLES.map((r, i) => push({
  _id: `role-${r.slug}`, _type: "jobRole", visible: true,
  orderRank: `0|${(i + 1).toString().padStart(6, "0")}:`,
  role: s(r.role), slug: { _type: "slug", current: r.slug },
  dept: s(r.dept), location: s(r.location), type: s(r.type),
  summary: t(r.summary),
  willDo: r.willDo.map((x) => ({ ...s(x), _key: k() })),
  youAre: r.youAre.map((x) => ({ ...s(x), _key: k() })),
  youHave: r.youHave.map((x) => ({ ...s(x), _key: k() })),
  compensation: t(r.comp), aboutCompany: t(ABOUT),
  image: rimg(r.img, r.role),
}));

/* ═══════════════════ 9. Blog posts ═══════════════════ */
const para = (text) => ({ _type: "block", _key: k(), style: "normal", markDefs: [], children: [{ _type: "span", _key: k(), text, marks: [] }] });
const pull = (quote) => ({ _type: "pullQuote", _key: k(), quote: t(quote) });

const POSTS = [
  { slug: "recycled-content-claims", tag: "SUSTAINABILITY", title: "What a verified recycled-content claim actually requires", date: "Jun 2026", read: "4 min", cover: A("_MG_7862.png"), inline: A("Tissue paper (2).png"),
    body: ["A recycled-content claim is only as strong as the chain of custody behind it. For flagship gift-bag programmes carrying a 95% minimum recycled content figure, that number has to trace back through mill certificates, batch testing and a documented blend ratio — not a marketing assumption.", "Sansico's laboratory verifies incoming pulp composition before it enters production, and every claim published to a customer is tied to a specific facility and production run, not a company-wide average.", "For buyers, the practical takeaway is simple: ask for the certificate, the scope, and the entity it covers. A claim without those three things is a claim you can't show your board."],
    quote: "A recycled-content number is only useful to a buyer if it can survive an audit." },
  { slug: "iso-17025-lab", tag: "MANUFACTURING", title: "Inside our ISO 17025 safety laboratory", date: "May 2026", read: "5 min", cover: A("iso-17025-grahita-indonesia.png"), inline: A("Sasnico.png"),
    body: ["Product safety testing usually happens at the end of a supply chain, adding weeks of delay if a batch fails. Sansico's in-house, government-accredited ISO 17025 laboratory moves that testing upstream, screening incoming materials for heavy metals and phthalates before they reach the production line.", "This matters most for toy and food-contact packaging categories, where a single failed test at a third-party lab can hold a shipment at port. Testing internally, on the same production timeline, catches issues early enough to correct them.", "The lab also supports continuous improvement: thirty years of testing data feed back into material sourcing decisions across all ten facilities."],
    quote: "Testing before the container ships is testing that actually prevents a recall." },
  { slug: "ctpat-audit", tag: "TRADE & COMPLIANCE", title: "Reading a C-TPAT audit report as a buyer", date: "Apr 2026", read: "4 min", cover: A("CTPAT.png"), inline: A("Foshan.jpg"),
    body: ["A Customs-Trade Partnership Against Terrorism (C-TPAT) audit covers physical security, personnel screening, and documentation integrity across a facility. For a buyer evaluating a new vendor, the scope and date of the most recent audit matter more than the certification badge itself.", "Sansico publishes audit scope and holding entity for every group facility, so a buyer's compliance team can verify coverage against their own import programme rather than taking a logo at face value.", "Combined with bonded-zone operations, a current C-TPAT/SCAN status materially reduces inspection risk at US ports of entry."],
    quote: "A badge without a scope and a date is not a compliance answer." },
  { slug: "seasonal-gifting-trends", tag: "DESIGN TRENDS", title: "Seasonal gifting: what performed at retail this year", date: "Mar 2026", read: "3 min", cover: A("240-02-2945_12.jpg"), inline: A("_MG_0230.jpg"),
    body: ["Our studio tracks sell-through data alongside trend research, and this season's gifting aisle rewarded restraint: simpler foil treatments, fewer competing finishes per bag, and stronger tie-ins to core seasonal colourways.", "Ribbon-handle bags in matte kraft outperformed glitter-finish alternatives in mid-tier price points, while glitter and foil combinations held share only in premium gifting sets.", "For brands planning next season's programme, the studio's recommendation is to commit early to one hero finish per line rather than spreading development across several."],
    quote: "Restraint in finish selection outperformed novelty this season." },
  { slug: "bonded-zone-logistics", tag: "MANUFACTURING", title: "Bonded-zone logistics, explained for first-time buyers", date: "Feb 2026", read: "4 min", cover: A("Grafitec.jpg"), inline: A("PP Tangerang.jpg"),
    body: ["A bonded zone allows goods to be manufactured, stored and consolidated before duties are assessed, which changes both cost and timing for an international buyer. For first-time importers, the practical benefit is deferred duty payment until goods actually leave the zone for their final destination.", "Sansico's Vendor Operations team manages bonded-zone status across group facilities, consolidating multiple product lines into a single export shipment rather than several partial ones.", "For a buyer building a multi-category order — packaging, tableware and toys in one container — this consolidation is often the difference between one clean customs entry and three separate ones."],
    quote: "Consolidation at the bonded zone is where landed cost is actually won or lost." },
  { slug: "circular-design-handicraft", tag: "SUSTAINABILITY", title: "Circular design in handicraft: a Yogyakarta case study", date: "Jan 2026", read: "5 min", cover: A("enceng1.jpg"), inline: A("IMG_5646.jpg"),
    body: ["Circular design in handicraft looks different from circularity in paper or plastic packaging — the raw materials are already natural fibres, but the challenge is designing joinery and finishes that can be disassembled and recovered at end of life.", "At our Yogyakarta workshops, artisans working under NEST-certified programmes have piloted water-based finishes and mechanical (rather than adhesive) joinery on a water hyacinth homeware line, cutting material loss during rework by a meaningful margin.", "The pilot is now informing material standards across the group's broader handicraft category, alongside continued HERproject workplace programmes for the artisans involved."],
    quote: "Circularity in handicraft starts with how a piece comes apart, not just what it is made of." },
];
const postIds = POSTS.map((p, i) => push({
  _id: `post-${p.slug}`, _type: "blogPost", visible: true,
  orderRank: `0|${(i + 1).toString().padStart(6, "0")}:`,
  title: s(p.title), slug: { _type: "slug", current: p.slug },
  tag: s(p.tag), date: s(p.date), readTime: s(p.read),
  excerpt: t(p.body[0].slice(0, 180) + "…"),
  cover: rimg(p.cover, p.title),
  body: [para(p.body[0]), rimg(p.inline, p.title), para(p.body[1]), pull(p.quote), para(p.body[2])].filter(Boolean),
}));

/* ═══════════════════ 10. Audience pages ═══════════════════ */
const OFFICES = B("officesBlock", {
  head: head(null, "Visit our offices"),
  map: rimg(A("Gemini_Generated_Image_4tidd34tidd34tid.png") || A("Foshan.jpg"), "Jakarta and Foshan office locations"),
  offices: [
    { _type: "object", _key: k(), label: s("Office 01"), name: s("PT Printec Perkasa I (Headquarters)"),
      address: t("Jl. Pergudangan Kosambi Permai, Blok G No. 3-5, Kosambi, Tangerang 15213, Banten, Indonesia"),
      mapLink: link("View on Google Maps", "https://maps.google.com/?q=PT+Printec+Perkasa+I+Tangerang+Indonesia", true) },
    { _type: "object", _key: k(), label: s("Office 02"), name: s("Foshan Sansico"),
      address: t("NanHai Song Xia Industrial Park, SongGang, NanHai, Foshan, Guangdong 528225, China"),
      mapLink: link("View on Google Maps", "https://maps.google.com/?q=Foshan+Sansico+Nanhai+Guangdong+China", true) },
  ],
});

const AUDIENCES = [
  { slug: "buyers", label: "For Buyers", order: 1,
    heading: "Are you a buyer looking for a vendor or factory for your products?",
    hero: A("Sasnico.png"), heroCap: "Buyer walking a factory floor with a Sansico representative",
    sub: "Why buyers choose Sansico Group", offices: true,
    reasons: [
      ["Manufacturing Excellence", "Ten ISO-and-FSSC-certified facilities across Indonesia and China, with an in-house safety laboratory.", A("Sasnico.png")],
      ["Strategic Partnerships", "Multi-decade relationships built on dependability, not one-off transactions.", A("_MG_0807.jpg")],
      ["Verified Sustainability", "FSC, Higg Index and amfori BEPI certifications you can show your board.", A("HiggIndex.png")],
    ],
    journey: [["01", "Request quotation", "1-2 days"], ["02", "Sample making", "3-4 weeks"], ["03", "Production & QA", "4-8 weeks"], ["04", "Trade compliance", "1-2 weeks"], ["05", "Door-to-door delivery", "Per Incoterm"]],
    faqs: [
      ["I'm a buyer based in the US — can Sansico ship directly to my warehouse?", "Yes. Our Vendor Operations team manages EXIM, bonded-zone logistics and door-to-door delivery under standard Incoterms."],
      ["What is the MOQ (Minimum Order Quantity) to be eligible to apply?", "MOQs vary by product line and material; most gift packaging and tableware programmes start at 5,000-10,000 units."],
      ["How long does sampling take?", "Physical samples typically take 3-4 weeks from an approved design, including material sourcing and safety testing."],
    ] },
  { slug: "factories", label: "For Factories", order: 2,
    heading: "Have production capacity? Let's put it to work for global brands.",
    hero: A("PP Tangerang.jpg"), heroCap: "Factory floor, production line in operation",
    sub: "Why factories partner with Sansico Group", offices: true,
    reasons: [
      ["Market Access", "Reach global retail brands sourcing 500 million homes a year, without building your own sales network.", A("Grafitec.jpg")],
      ["Steady Demand Planning", "Multi-season forecasting and purchase orders that keep production lines running year-round.", A("KLATEN.png")],
      ["Trade Compliance Handled", "EXIM, bonded-zone and export documentation managed centrally by our Vendor Operations team.", A("CTPAT.png")],
    ],
    journey: [["01", "Capability assessment", "1 week"], ["02", "Compliance audit", "2-3 weeks"], ["03", "Onboarding", "1-2 weeks"], ["04", "First purchase order", "Per programme"], ["05", "Ongoing vendor management", "Continuous"]],
    faqs: [
      ["What production capabilities are you looking for?", "Printing & converting, injection moulding, thermoforming, cut-and-sew and handicraft assembly across Indonesia and China."],
      ["Is there a minimum facility size or capacity?", "We evaluate case by case, but most partner facilities run at least one dedicated production line with 50+ staff."],
      ["What compliance standards must we meet?", "ISO 9001 as a baseline; ISO 17025, FSSC 22000, C-TPAT/SCAN or Higg Index depending on product category."],
    ] },
  { slug: "creatives", label: "For Creatives", order: 3,
    heading: "Are you a creative? See your work on shelves worldwide.",
    hero: A("Capabilities - 1600x1000px.png"), heroCap: "Designer developing artwork in the Sansico studio",
    sub: "Why creatives partner with Sansico Group", offices: false,
    reasons: [
      ["Global Distribution", "Your designs manufactured at scale and placed on shelves across the US, Europe and Asia.", A("_MG_0230.jpg")],
      ["Improve Your Skills", "We have experts who can direct your designs toward the right market.", A("_MG_0818.jpg")],
      ["Design-to-Production Support", "Our studio engineers your artwork for volume manufacture without losing its intent.", A("Capabilities - 1600x1000px.png")],
    ],
    journey: [["01", "Portfolio submission", "15 min"], ["02", "Design review", "1-2 weeks"], ["03", "Licensing agreement", "1 week"], ["04", "Product development", "3-6 weeks"], ["05", "Retail launch", "Per season"]],
    faqs: [
      ["What kind of work are you looking for?", "Surface pattern, illustration and character design suited to gift packaging, tableware, toys and stationery."],
      ["How are royalties structured?", "Typically a per-unit royalty on top of a flat licensing fee, paid quarterly — details vary by programme."],
      ["Can I submit as an agency or studio?", "Yes — we work directly with individual artists as well as design agencies and licensing studios."],
    ] },
];

AUDIENCES.forEach((a) => push({
  _id: `audience-${a.slug}`, _type: "audiencePage", visible: true,
  orderRank: `0|${a.order.toString().padStart(6, "0")}:`,
  label: s(a.label), slug: { _type: "slug", current: a.slug },
  seoTitle: `${a.label} — Sansico Group`,
  seoDescription: a.heading,
  sections: [
    B("statementBlock", {
      align: "center", showStrip: false,
      kicker: s(a.label), heading: s(a.heading),
      cta: link("Start Conversation", "/contact"),
      note: s("We'll get back to you in 3-5 business days."),
    }),
    B("imageBlock", { image: rimg(a.hero, a.heroCap, a.heroCap), ratio: "16/9" }),
    B("iconCardsBlock", {
      head: head(null, a.sub), columns: 3, align: "center",
      cards: a.reasons.map(([title, desc, img]) => ({ _type: "object", _key: k(), title: s(title), desc: t(desc), icon: rimg(img, title) })),
    }, { theme: "warm" }),
    B("journeyBlock", {
      head: head(null, "Every step of the journey"),
      steps: a.journey.map(([n, title, time]) => ({ _type: "object", _key: k(), n: s(`Step ${n}`), title: s(title), time: s(time) })),
    }),
    ...(a.offices ? [{ ...OFFICES, _key: k() }] : []),
    B("faqBlock", {
      head: head(null, "FAQs"),
      faqs: a.faqs.map(([q, ans]) => ({ _type: "object", _key: k(), q: s(q), a: t(ans) })),
    }, { theme: "warm" }),
  ],
}));

/* ═══════════════════ 11. Pages ═══════════════════ */
const paperFacs = facilities.filter((f) => !TOY_FACILITIES.some((n) => (f.name || "").includes(n)));
const toyFacs = facilities.filter((f) => TOY_FACILITIES.some((n) => (f.name || "").includes(n)));

const page = (pageId, title, sections, opts = {}) => push({
  _id: `page-${pageId}`, _type: "v2Page", pageId, title, visible: true,
  showCtaBanner: opts.cta !== false, sections,
  seoTitle: opts.seoTitle, seoDescription: opts.seoDescription,
});

/* ---- Home ---- */
page("home", "Home", [
  // The live site's full-screen hero, carried over verbatim.
  B("siteHeroBlock", {
    heroType: "ink",
    eyebrow: s("Indonesia \u00b7 China \u00b7 USA"),
    heading: s("Joy, |Sustainably,| Packaged"),
    sub: t("Sansico Group designs and manufactures gifting, toy, handicraft and packaging programmes for the world's most loved brands — FSC, FSSC 22000 and ISO 17025 certified, from ten facilities in Indonesia and China."),
    cta: link("Start a conversation", "/contact"),
    secondaryCta: link("Explore capabilities", "/capabilities"),
  }),
  B("statementBlock", {
    showStrip: true,
    heading: s("We make things that matter, for brands that |care|."),
    body: t("For forty years, Sansico has been the manufacturing partner behind the seasonal aisle — gift bags, wraps, boxes, handicrafts and toys that reach 500 million homes each year. Every programme is built on certified materials, verified labour standards and a supply chain you can show your board."),
  }),
  // Values and tile colours copied verbatim from the live homePage document.
  B("statsBlock", {
    stats: [
      { _type: "object", _key: k(), value: s("40+"),  label: s("Years in manufacturing"),          bgColor: "#7A0D20", textColor: "#FFFFFF" },
      { _type: "object", _key: k(), value: s("10"),   label: s("Certified facilities"),            bgColor: "#22409E", textColor: "#FFFFFF" },
      { _type: "object", _key: k(), value: s("500M"), label: s("Homes reached each year"),         bgColor: "#0D4F31", textColor: "#FFFFFF" },
      { _type: "object", _key: k(), value: s("95%"),  label: s("Min. recycled content, gift bags"), bgColor: "#BDDA5F", textColor: "#FFFFFF" },
    ],
  }),
  B("customerStoriesBlock", {
    head: head(null, "Long-Term Partnerships"),
    stories: CUSTOMERS.map((c) => ref(c.id)),
    link: link("Our story", "/company"),
  }, { theme: "warm" }),
  B("capabilityCardsBlock", {
    head: head("What we do \u2197", "Three capabilities, one accountable partner"),
    cta: link("What we do", "/capabilities"),
    cards: [
      { _type: "object", _key: k(), tag: s("DESIGN"), title: s("Design & Creative Studio"), desc: t("Trend, artwork and product development that lives and breathes consumer brands."), cta: link("Explore", "/capabilities#design-creative"), image: rimg(A("Capabilities - 1600x1000px.png"), "Design studio work") },
      { _type: "object", _key: k(), tag: s("MAKE"), title: s("Manufacturing Solutions"), desc: t("Printing, packaging, moulding, forming and sewing — with an ISO 17025 safety laboratory in-house."), cta: link("Explore", "/capabilities#manufacturing"), image: rimg(A("Sasnico.png"), "Manufacturing floor") },
      { _type: "object", _key: k(), tag: s("DELIVER"), title: s("Vendor Operations"), desc: t("Sourcing, EXIM, bonded-zone logistics, planning and trade compliance — door to door."), cta: link("Explore", "/capabilities#vendor-operations"), image: rimg(A("Foshan.jpg"), "Vendor operations") },
    ],
  }),
  B("tileGridBlock", {
    head: head("Products", "Markets we serve"),
    columns: 3,
    tiles: [
      { _type: "object", _key: k(), label: s("FMCG & Retail Packaging"), image: rimg(A("FMCG Packaging & Packaging for Export Industry.png"), "FMCG packaging"), cta: link("View", "/products/fmcg-packaging") },
      { _type: "object", _key: k(), label: s("Gifting & Seasonal"), image: rimg(A("Gift Packaging.png"), "Gift packaging"), cta: link("View", "/products/gift-packaging") },
      { _type: "object", _key: k(), label: s("Party & Tableware"), image: rimg(A("Products Photo 1200 x 400.png"), "Party and tableware"), cta: link("View", "/products/party-tableware") },
      { _type: "object", _key: k(), label: s("Toys & Toy Packaging"), image: rimg(A("25.png"), "Toy packaging"), cta: link("View", "/products/toys") },
      { _type: "object", _key: k(), label: s("Handicraft & Home"), image: rimg(A("Handicraft.png"), "Handicraft"), cta: link("View", "/products/handicraft") },
    ],
  }, { theme: "warm" }),
  B("splitFeatureBlock", {
    imageSide: "left",
    image: rimg(A("_MG_7862.png"), "FSC-certified paper stock", "FSC-certified paper and rattan supply chains"),
    kicker: s("Sustainability"),
    heading: s("FSC-certified, from forest to |finished product|"),
    body: t("Our paper and rattan supply chains are FSC-certified for responsible forest management, backed by Higg Index and amfori BEPI environmental and social compliance — sustainability you can verify, not just claim."),
    cta: link("See our certifications", "/sustainability#certifications"),
  }),
], { seoTitle: "Sansico Group — Joy, sustainably packaged | Indonesia · China · USA" });

/* ---- Capabilities ---- */
const CAP_PILLARS = [
  { anchor: "design-creative", tag: "Design", title: "Design & Creative Studio",
    desc: "From Indonesia to the world, our studio blends tradition and global influence to develop artwork, structural packaging and product designs that perform at retail. We work inside customers' seasonal calendars — trend research, concept boards, artwork engineering, prototyping and pre-production samples — so designs arrive production-ready, in the right materials and configurations for volume manufacture.",
    features: [["Trend Research", "Seasonal colour and material forecasting", A("_MG_0818.jpg")], ["Design & Artwork", "Concept boards and artwork engineering", A("Capabilities - 1600x1000px.png")], ["Prototyping", "Pre-production samples for approval", A("_MG_0807.jpg")]],
    prompt: "Are you a creative? Would you like your work featured in international markets?", link: "/creatives" },
  { anchor: "manufacturing", tag: "Make", title: "Manufacturing Solutions",
    desc: "Ten facilities across Indonesia and China deliver one-stop-shop printing and converting, GMI-certified packaging, injection moulding, thermo vacuum forming and cut-and-sew production. Quality is engineered in: an in-house, government-accredited ISO 17025 laboratory tests for heavy metals and phthalates, and over thirty years of continuous factory innovation keep quality and value moving in the right direction.",
    features: [["Printing", "Offset, flexo and digital print lines", A("tissue production-01.png")], ["GMI-Certified", "Certified packaging for global brands", A("FMCG Packaging & Packaging for Export Industry.png")], ["Injection Moulding", "High-volume plastic component moulding", A("25.png")]],
    prompt: "Do you have a factory? Are you looking for a vendor to serve international markets?", link: "/factories" },
  { anchor: "vendor-operations", tag: "Deliver", title: "Vendor Operations",
    desc: "Global supply-chain optimisation from sourcing through trade compliance: logistics and export-import management, bonded-zone operations, demand planning and order management, sourcing-system development, product safety and QA, training, finance and legal support. We carry the operational load so customers see one clean interface from purchase order to delivery.",
    features: [["Logistics & EXIM", "Export documentation and freight coordination", A("Foshan.jpg")], ["Bonded Zone", "Consolidated, duty-deferred shipping", A("Grafitec.jpg")], ["Demand Planning", "Forecasting and order management", A("CTPAT.png")]],
    prompt: "Are you a buyer? Are you looking for a vendor partner to serve your brand?", link: "/buyers" },
];
page("capabilities", "Capabilities", [
  B("pageHeroBlock", { heading: s("Three capabilities, one accountable partner"), background: rimg(A("Sasnico.png"), "Sansico manufacturing floor") }),
  B("imageBlock", { image: rimg(A("Capabilities - 1600x1000px.png"), "Design–Make–Deliver", "Design · Make · Deliver — one accountable partner"), ratio: "16/9" }),
  ...CAP_PILLARS.flatMap((p, i) => [
    B("statementBlock", { showStrip: true, heading: s(p.title), body: t(p.desc) }, { anchorId: p.anchor, theme: i % 2 ? "warm" : "paper" }),
    B("iconCardsBlock", {
      head: head(p.tag, null), columns: 3, align: "center",
      cards: p.features.map(([name, cap, img]) => ({ _type: "object", _key: k(), title: s(name), desc: t(cap), icon: rimg(img, name) })),
    }, { theme: i % 2 ? "warm" : "paper" }),
    B("ctaBannerBlock", { heading: s(p.prompt), cta: link("Find out more", p.link) }, { theme: i % 2 ? "warm" : "paper" }),
  ]),
]);

/* ---- Products ---- */
page("products", "Products", [
  B("pageHeroBlock", { heading: s("Our product portfolio"), background: rimg(A("Header 1440x810 Productss.jpg"), "Sansico product range") }),
  B("productShowcaseBlock", { head: head(null, null), categories: CATS.map((c) => ref(c.id)) }),
]);

/* ---- Company ---- */
page("company", "Company", [
  B("pageHeroBlock", { heading: s("Sansico Group of Companies"), background: rimg(A("Sasnico.png"), "Sansico group facilities") }),
  B("splitFeatureBlock", {
    imageSide: "right", image: rimg(A("IMG-20251215-WA0069.jpg"), "Sansico Jakarta headquarters", "Jakarta headquarters"),
    kicker: s("Vision"), heading: s("To be the partner that sustainably |packages joy| for people."),
  }),
  B("missionCardsBlock", {
    items: [
      { _type: "object", _key: k(), title: s("Mission"), desc: t("We build trusted partnerships with sustainable solutions that elevate daily life.") },
      { _type: "object", _key: k(), title: s("Culture"), desc: t("We work hard with honesty and respect for people to make sustainable products, build trusted partnerships and protect our planet.") },
    ],
  }, { theme: "warm" }),
  B("presenceMapBlock", {
    head: head(null, "Our presence"),
    map: rimg(A("Gemini_Generated_Image_4tidd34tidd34tid.png") || A("Foshan.jpg"), "Indonesia and China facility locations"),
    pins: [
      { _type: "object", _key: k(), label: s("Jakarta"), x: 24, y: 58 },
      { _type: "object", _key: k(), label: s("Tangerang"), x: 28, y: 62 },
      { _type: "object", _key: k(), label: s("Yogyakarta"), x: 34, y: 60 },
      { _type: "object", _key: k(), label: s("Foshan"), x: 74, y: 40 },
    ],
  }),
  B("timelineBlock", { head: head(null, "Our story"), milestones: MILESTONES.map((m) => ref(`ms-${m.year}`)) }),
  B("facilitiesBlock", {
    head: head(null, "Our facilities"),
    link: link("View certifications", "/sustainability#certifications"),
    groups: [
      { _type: "object", _key: k(), label: s("Paper product facilities"), facilities: paperFacs.map((f) => ref(f._id)) },
      ...(toyFacs.length ? [{ _type: "object", _key: k(), label: s("Toy facilities"), facilities: toyFacs.map((f) => ref(f._id)) }] : []),
    ],
  }, { theme: "warm", anchorId: "facilities" }),
]);

/* ---- Sustainability ---- */
const SUS_PILLARS = [
  ["FSC-Certified", "Responsible forest management and certified paper sourcing across our supply chain.", "Group facilities", A("_MG_7862.png")],
  ["NEST", "Ethical artisan and homeworker production standards across our handicraft programmes.", "PT IGP Internasional, Yogyakarta", A("IMG_5646.jpg")],
  ["HERproject", "Women's workplace empowerment programmes across our group workforce, backed by BSR.", "PT Grafitecindo Ciptaprima, Cikarang", A("HerProject.png")],
  ["Circular Economy", "Increasing recycled content and designing for end-of-life recovery across product lines.", "Group facilities", A("enceng1.jpg")],
];
page("sustainability", "Sustainability", [
  B("pageHeroBlock", { heading: s("Certified, dated, verifiable — sustainability as a discipline, not an adjective."), background: rimg(A("enceng1.jpg"), "Natural fibre sourcing") }),
  ...SUS_PILLARS.map(([title, desc, loc, img], i) =>
    B("splitFeatureBlock", {
      imageSide: i % 2 ? "right" : "left",
      image: rimg(img, `${title} certification`, `${title} — ${loc}`),
      heading: s(title), body: t(desc), meta: s(loc),
      cta: link("Learn more", "/blog/recycled-content-claims"),
    }, { theme: i % 2 ? "warm" : "paper" })
  ),
  B("certificationMatrixBlock", {
    head: head(null, "Our certifications", "Every certification is published with its scope and holding entity."),
    certGroups: certGroupIds.map((id) => ref(id)),
  }, { anchorId: "certifications" }),
]);

/* ---- Why Indonesia ---- */
const ID_TOPICS = [
  ["Strategic Geography & Port Access", "Positioned on major Asia-Pacific shipping lanes with direct container access to US, European and Asian markets."],
  ["Skilled & Scalable Workforce", "A large, trainable manufacturing workforce supports both high-volume runs and detailed handicraft production."],
  ["Raw Material Access", "Domestic access to paper pulp, rattan and timber reduces material lead times and import dependency."],
  ["Trade Agreements & Tariffs", "Regional and bilateral trade agreements support competitive duty treatment into key export markets."],
  ["Government Incentives", "Bonded-zone status and export-oriented incentives streamline customs and reduce landed cost."],
  ["Time Zone Alignment", "Business-hours overlap with both US and European teams keeps communication fast during a client's working day."],
];
page("why-indonesia", "Why Indonesia", [
  B("pageHeroBlock", { heading: s("Strategic geography. Skilled hands. Verified compliance."), background: rimg(A("HAMPANGEN.png"), "Indonesian production geography") }),
  B("statsBlock", {
    stats: [
      { _type: "object", _key: k(), value: s("270M+"), label: s("Population, skilled labour pool"), bgColor: "#7A0D20", textColor: "#FFFFFF" },
      { _type: "object", _key: k(), value: s("10"), label: s("Certified facilities"), bgColor: "#22409E", textColor: "#FFFFFF" },
      { _type: "object", _key: k(), value: s("500M"), label: s("Homes reached each year"), bgColor: "#0D4F31", textColor: "#FFFFFF" },
      { _type: "object", _key: k(), value: s("2"), label: s("Strategic hubs — Jakarta & Foshan"), bgColor: "#5A0915", textColor: "#FFFFFF" },
    ],
  }),
  B("imageBlock", { image: rimg(A("Gemini_Generated_Image_4tidd34tidd34tid.png") || A("HAMPANGEN.png"), "Indonesia and China facilities with export lanes", "Facilities and export lanes to US / EU / Asia"), ratio: "16/9" }),
  B("iconCardsBlock", {
    head: head(null, "Six reasons global buyers source from Indonesia"),
    columns: 3, align: "left",
    cards: ID_TOPICS.map(([title, desc]) => ({ _type: "object", _key: k(), title: s(title), desc: t(desc) })),
  }, { theme: "warm" }),
  B("scorecardBlock", {
    head: head("ASEAN COP Scorecard", "Risk-adjusted balanced sourcing value"),
    subtitle: s("Indonesia scores strongest overall"),
    scorecard: { _type: "reference", _ref: "sourcingScorecard" },
  }),
  B("whyIndonesiaDetailBlock", { showSources: true }),
]);

/* ---- Careers ---- */
const VALUES = [
  ["Innovation", "Forward-thinking approaches to material science, circular design and production workflows."],
  ["Sustainability", "Verifiable environmental discipline across every facility and product line."],
  ["Integrity", "Transparent operations, certified holding entities and audit-ready supply chains."],
  ["Collaboration", "Valuing long-term strategic partnership over transactional sales."],
  ["Excellence", "ISO, FSSC and FSC-certified precision across all manufacturing outputs."],
  ["Customer Success", "Empowering clients to show their board a fully verified, resilient supply chain."],
];
page("careers", "Careers", [
  B("pageHeroBlock", { heading: s("Build your career with Sansico Group"), background: rimg(A("Sasnico.png"), "Sansico team at work") }),
  B("iconCardsBlock", {
    head: head(null, "Our values"), columns: 3, align: "left",
    cards: VALUES.map(([title, desc]) => ({ _type: "object", _key: k(), title: s(title), desc: t(desc) })),
  }),
  B("openRolesBlock", { head: head(null, "Open roles"), roles: roleIds.map((id) => ref(id)) }, { theme: "warm" }),
  B("ctaBannerBlock", {
    heading: s("Don't see a fit?"),
    body: t("Send us your portfolio or CV and we'll keep you in mind for the next opening."),
    cta: link("Start a conversation", "/contact"),
  }),
], { cta: false });

/* ---- Blog ---- */
page("blog", "Blog", [
  B("pageHeroBlock", { heading: s("Notes on manufacturing, sourcing and sustainable design"), background: rimg(A("_MG_0818.jpg"), "Printed gift wrap detail") }),
  B("blogGridBlock", { head: head(null, null), limit: 12, posts: postIds.map((id) => ref(id)) }),
]);

/* ---- Contact ---- */
page("contact", "Contact", [
  B("contactFormBlock", {
    heading: s("Start a conversation"),
    intro: t("We'll get back to you within 3-5 business days."),
    submitLabel: s("Submit"),
    successHeading: s("Message sent."),
    successBody: t("Thanks — our team will respond within 3-5 business days."),
    fields: [
      { _type: "object", _key: k(), label: s("Name"), placeholder: s("Your full name"), name: "name", type: "text", required: true },
      { _type: "object", _key: k(), label: s("Company"), placeholder: s("Company name"), name: "company", type: "text", required: false },
      { _type: "object", _key: k(), label: s("Email"), placeholder: s("you@company.com"), name: "email", type: "email", required: true },
      { _type: "object", _key: k(), label: s("I am a..."), name: "audience", type: "select", required: false, options: ["Buyer", "Factory", "Creative"] },
      { _type: "object", _key: k(), label: s("Message"), placeholder: s("Tell us about your category, target market and volumes"), name: "message", type: "textarea", required: false },
    ],
    asideTitle: s("Offices"),
    aside: [
      { _type: "object", _key: k(), title: s("Jakarta, Indonesia"), body: t("Marketing & sourcing office") },
      { _type: "object", _key: k(), title: s("Foshan, China"), body: t("Marketing & sourcing office") },
      { _type: "object", _key: k(), title: s("General enquiries"), body: t("hello@sansico.com") },
    ],
  }),
]);

/* ═══════════════════ 12. Site-wide CTA band ═══════════════════ */
// siteSettings is a singleton shared across every page (not part of `docs`
// below, since it's patched rather than replaced — production's nav/logo/etc.
// on it must survive). Bring its CTA band copy and colours in line with the
// wireframe and the live .v2-cta CSS defaults, so Studio shows the true
// current values instead of leaving them blank.
const ctaBandPatch = {
  headline: s("Looking for your |partner| in Indonesia?"),
  subline: t("Tell us your category, target market and volumes — our marketing offices in Jakarta and Foshan respond within one business day."),
  btn1Label: s("Start Conversation"),
  btn1Href: "/contact",
  bgColor: "#17120F",
  textColor: "#FFFFFF",
  accentColor: "#BDDA5F",
  btnBgColor: "#FFFFFF",
  btnTextColor: "#7A0D20",
};

/* ═══════════════════ commit ═══════════════════ */
const strip = (o) => JSON.parse(JSON.stringify(o, (_, v) => (v === undefined ? undefined : v)));

let tx = client.transaction();
for (const d of docs) tx = tx.createOrReplace(strip(d));
for (const p of facilityPatches) tx = tx.patch(p.patch.id, { set: p.patch.set });
tx = tx.patch("siteSettings", { set: { ctaBand: strip(ctaBandPatch) } });
await tx.commit();

const counts = docs.reduce((m, d) => ({ ...m, [d._type]: (m[d._type] || 0) + 1 }), {});
console.log("\nSeeded:");
for (const [type, n] of Object.entries(counts).sort()) console.log(`  ${n.toString().padStart(3)}  ${type}`);
console.log(`  ${facilityPatches.length.toString().padStart(3)}  facility (grouped paper/toy)`);
console.log(`\n${docs.length} documents written to dataset "v2".`);
