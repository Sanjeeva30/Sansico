const PALETTE = [
  { title: "Crimson #7A0D20", value: "#7A0D20" },
  { title: "Navy #22409E",    value: "#22409E" },
  { title: "Green #0D4F31",   value: "#0D4F31" },
  { title: "Red #F3263E",     value: "#F3263E" },
  { title: "Citrus #BDDA5F",  value: "#BDDA5F" },
];

export default {
  name: "siteSettings", title: "Site Settings", type: "document",
  fields: [
    // ── Brand ──────────────────────────────────────────────
    {
      name: "logo", title: "Brand logo",
      type: "image",
      description: "Upload an SVG or transparent PNG. Replaces the text wordmark in the header when set.",
      options: { accept: "image/svg+xml,image/png,image/webp" }
    },
    { name: "tagline", title: "Tagline", type: "string" },
    { name: "mission", title: "Mission statement (footer)", type: "text" },

    // ── Typography ─────────────────────────────────────────
    {
      name: "headingFont", title: "Heading font", type: "string",
      options: { list: [
        { title: "Sans-serif (current)", value: "sans" },
        { title: "Serif", value: "serif" }
      ], layout: "radio" },
      initialValue: "sans"
    },
    {
      name: "bodySize", title: "Body text size", type: "string",
      options: { list: [
        { title: "Small", value: "sm" },
        { title: "Medium (current)", value: "md" },
        { title: "Large (accessibility)", value: "lg" }
      ], layout: "radio" },
      initialValue: "md"
    },
    { name: "accentColour", title: "Accent colour", type: "color", options: { disableAlpha: true, colorList: [
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
] } },
      description: "Used for highlights, active states and key UI elements.",
      initialValue: "#7A0D20"
    },

    // ── Navigation ─────────────────────────────────────────
    { name: "nav", title: "Header navigation (drag to reorder)", type: "array", of: [{ type: "navItem" }] },
    { name: "ctaLabel", title: "Header CTA label", type: "string" },

    // ── Contact ────────────────────────────────────────────
    { name: "email", title: "Sales email", type: "string" },
    { name: "whatsapp", title: "WhatsApp number (with country code)", type: "string" },
    {
      name: "phones", title: "Phone numbers", type: "array",
      of: [{ type: "object", fields: [
        { name: "label", type: "string" },
        { name: "display", type: "string" },
        { name: "tel", type: "string" }
      ]}]
    }
  ]
};
