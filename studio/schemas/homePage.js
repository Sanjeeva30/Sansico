const BG_COLOURS = [
  { title: "Off-white (default)", value: "cream" },
  { title: "Crimson",            value: "crimson" },
  { title: "Navy",               value: "navy" },
  { title: "Green",              value: "green" },
  { title: "Citrus",             value: "citrus" },
  { title: "Black",              value: "black" },
];
const TEXT_COLOURS = [
  { title: "Black (default)", value: "dark" },
  { title: "White",           value: "white" },
  { title: "Citrus",          value: "citrus" },
  { title: "Crimson",         value: "crimson" },
];

export default {
  name: "homePage", title: "Home Page", type: "document",
  fields: [
    // ── Hero ───────────────────────────────────────────────
    { name: "heroType", title: "Hero type", type: "string", options: { list: ["ink","image","video"], layout: "radio" }, description: "Switch to video the day the brand film is ready." },
    { name: "heroVideo", title: "Hero video (MP4 or Cloudinary URL)", type: "url", hidden: ({ document }) => document?.heroType !== "video" },
    { name: "heroPoster", title: "Hero poster image", type: "image", hidden: ({ document }) => document?.heroType === "ink" },
    { name: "heroEyebrow", title: "Hero eyebrow", type: "string" },
    { name: "heroTitle", title: "Hero title (wrap italic word in |pipes|)", type: "string" },
    { name: "heroSub", title: "Hero subline", type: "text" },

    // ── Manifesto ──────────────────────────────────────────
    { name: "manifestoTitle", title: "Manifesto (accent word in |pipes|)", type: "text" },
    { name: "manifestoBody", title: "Manifesto body", type: "text" },

    // ── Stats ──────────────────────────────────────────────
    {
      name: "stats", title: "Animated stats", type: "array",
      of: [{ type: "object", fields: [
        { name: "value",  title: "Number",          type: "number" },
        { name: "suffix", title: "Suffix (+, %, blank)", type: "string" },
        { name: "label",  title: "Label",           type: "string" },
        { name: "bgColor", title: "Background colour", type: "string",
          options: { list: BG_COLOURS }, initialValue: "cream" },
        { name: "textColor", title: "Text colour", type: "string",
          options: { list: TEXT_COLOURS }, initialValue: "dark" }
      ],
      preview: {
        select: { title: "label", value: "value", suffix: "suffix" },
        prepare({ title, value, suffix }) { return { title: `${value}${suffix || ""} — ${title}` }; }
      }
      }]
    },

    // ── Customer wall ──────────────────────────────────────
    {
      name: "customers", title: "Customer wall", type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "name", title: "Customer name", type: "string" },
          { name: "logo", title: "Logo (transparent SVG or PNG)", type: "image",
            options: { accept: "image/svg+xml,image/png,image/webp" } }
        ],
        preview: { select: { title: "name", media: "logo" } }
      }]
    },

    // ── Featured work ──────────────────────────────────────
    { name: "featuredWork", title: "Featured case study", type: "reference", to: [{ type: "caseStudy" }] }
  ]
};
