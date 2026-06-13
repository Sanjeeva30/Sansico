

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
        { name: "bgColor", title: "Background colour", type: "color", options: { disableAlpha: true, colorList: [
  { label: "Crimson",   value: { hex: "#7A0D20" } },
  { label: "Navy",      value: { hex: "#22409E" } },
  { label: "Green",     value: { hex: "#0D4F31" } },
  { label: "Red",       value: { hex: "#F3263E" } },
  { label: "Citrus",    value: { hex: "#BDDA5F" } },
  { label: "Black",     value: { hex: "#1A1A1A" } },
  { label: "White",     value: { hex: "#FFFFFF" } },
  { label: "Off-white", value: { hex: "#F5F0E8" } },
] } } },
  { label: "Navy",      value: { hex: "#22409E" } },
  { label: "Green",     value: { hex: "#0D4F31" } },
  { label: "Red",       value: { hex: "#F3263E" } },
  { label: "Citrus",    value: { hex: "#BDDA5F" } },
  { label: "Black",     value: { hex: "#1A1A1A" } },
  { label: "White",     value: { hex: "#FFFFFF" } },
  { label: "Off-white", value: { hex: "#F5F0E8" } },
] } }, initialValue: "cream" },
        { name: "textColor", title: "Text colour", type: "color", options: { disableAlpha: true, colorList: [
  { label: "Crimson",   value: { hex: "#7A0D20" } },
  { label: "Navy",      value: { hex: "#22409E" } },
  { label: "Green",     value: { hex: "#0D4F31" } },
  { label: "Red",       value: { hex: "#F3263E" } },
  { label: "Citrus",    value: { hex: "#BDDA5F" } },
  { label: "Black",     value: { hex: "#1A1A1A" } },
  { label: "White",     value: { hex: "#FFFFFF" } },
  { label: "Off-white", value: { hex: "#F5F0E8" } },
] } } },
  { label: "Navy",      value: { hex: "#22409E" } },
  { label: "Green",     value: { hex: "#0D4F31" } },
  { label: "Red",       value: { hex: "#F3263E" } },
  { label: "Citrus",    value: { hex: "#BDDA5F" } },
  { label: "Black",     value: { hex: "#1A1A1A" } },
  { label: "White",     value: { hex: "#FFFFFF" } },
  { label: "Off-white", value: { hex: "#F5F0E8" } },
] } }, initialValue: "dark" }
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
