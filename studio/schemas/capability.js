

export default {
  name: "capability", title: "Capabilities", type: "document",
  fields: [
    // ── Identity ───────────────────────────────────────────
    { name: "title", type: "string" },
    { name: "slug",  type: "slug", options: { source: "title" } },
    { name: "num",   title: "Eyebrow (DESIGN / MAKE / DELIVER)", type: "string" },
    { name: "summary", title: "One-line summary (homepage card)", type: "text", rows: 2 },
    { name: "colorTheme", title: "Colour theme", type: "color", options: { disableAlpha: true, colorList: [
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
] } }, initialValue: "default" },
    { name: "order", title: "Display order", type: "number" },

    // ── Body copy ──────────────────────────────────────────
    { name: "body", title: "Body (plain text — quick entry)", type: "text" },
    {
      name: "richBody", title: "Rich body (formatted — overrides plain text when set)",
      type: "array",
      of: [{
        type: "block",
        styles: [
          { title: "Normal", value: "normal" },
          { title: "Heading 2", value: "h2" },
          { title: "Heading 3", value: "h3" },
          { title: "Quote", value: "blockquote" }
        ],
        marks: { decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" }
        ]}
      }]
    },
    { name: "points", title: "Bullet points", type: "array", of: [{ type: "string" }] },

    // ── Images ─────────────────────────────────────────────
    { name: "image", title: "Primary image", type: "image",
      description: "Replaces the abstract art block on the capability section." },
    {
      name: "gallery", title: "Image gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true },
        fields: [{ name: "caption", title: "Caption", type: "string" }] }],
      description: "Additional images shown in a carousel or grid on the capability detail."
    },

    // ── Sub-services ───────────────────────────────────────
    {
      name: "subServices", title: "Sub-services",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "title", title: "Service name", type: "string" },
          { name: "description", title: "Short description", type: "text", rows: 2 }
        ],
        preview: { select: { title: "title", subtitle: "description" } }
      }],
      description: "e.g. under DESIGN: Trend research, Artwork, Sampling"
    },

    // ── Proof points ───────────────────────────────────────
    {
      name: "proofPoints", title: "Proof points / stats",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "value", title: "Stat value (e.g. 40+)", type: "string" },
          { name: "label", title: "Label",                  type: "string" }
        ],
        preview: { select: { title: "value", subtitle: "label" } }
      }]
    },

    // ── Customer logos ─────────────────────────────────────
    {
      name: "customerLogos", title: "Customers using this capability",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "name", title: "Customer name", type: "string" },
          { name: "logo", title: "Logo (transparent PNG/SVG)", type: "image",
            options: { accept: "image/svg+xml,image/png,image/webp" } }
        ],
        preview: { select: { title: "name", media: "logo" } }
      }]
    }
  ]
};
