import { ColourPicker } from "../components/ColourPicker";

export default {
  name: "siteSettings", title: "Site Settings", type: "document",
  fields: [
    // ── Brand ─────────────────────────────────────────────
    { name: "logo", title: "Brand logo", type: "image",
      description: "SVG or transparent PNG — replaces the text wordmark when set.",
      options: { accept: "image/svg+xml,image/png,image/webp" } },
    { name: "tagline",  title: "Tagline",  type: "string" },
    { name: "mission",  title: "Mission statement (footer)", type: "text" },

    // ── Typography ────────────────────────────────────────
    { name: "headingFont", title: "Heading font", type: "string",
      options: { list: [{ title:"Sans-serif (current)", value:"sans" }, { title:"Serif", value:"serif" }], layout:"radio" },
      initialValue: "sans" },
    { name: "bodySize", title: "Body text size", type: "string",
      options: { list: [{ title:"Small", value:"sm" }, { title:"Medium (current)", value:"md" }, { title:"Large", value:"lg" }], layout:"radio" },
      initialValue: "md" },
    { name: "accentColour", title: "Accent colour", type: "string",
      components: { input: ColourPicker } },

    // ── Navigation ────────────────────────────────────────
    { name: "nav", title: "Header navigation", type: "array", of: [{ type: "navItem" }] },
    { name: "ctaLabel", title: "Header CTA label", type: "string" },

    // ── CTA band ──────────────────────────────────────────
    { name: "ctaBand", title: "CTA band (homepage + bottom of all pages)", type: "object",
      fields: [
        { name: "headline", title: "Headline (italic word in |pipes|)", type: "string",
          description: "e.g. Looking for your |China+1| partner in Indonesia?" },
        { name: "subline",  title: "Subline", type: "text" },
        { name: "btn1Label",title: "Button 1 label", type: "string" },
        { name: "btn1Href", title: "Button 1 URL",   type: "string" },
        { name: "btn2Label",title: "Button 2 label", type: "string" },
        { name: "btn2Href", title: "Button 2 URL",   type: "string" },
      ]
    },

    // ── Sustainability section ───────────────────────────────
    { name: "susSection", title: "Sustainability page", type: "object",
      fields: [
        { name: "pageTitle", title: "Page hero title", type: "string",
          description: "The main heading on the Sustainability page (italic in |pipes|)",
          placeholder: "Certified, dated, |verifiable| — sustainability as a discipline, not an adjective." },
        { name: "pageIntro", title: "Page hero intro", type: "text",
          description: "Short paragraph below the hero title" },
        { name: "heading", title: "Heading (italic in |pipes|)", type: "string",
          description: "e.g. Joy that |gives back| more than it takes." },
        { name: "body",    title: "Body text", type: "text" },
        { name: "statValue", title: "Stat value (e.g. 95%)",  type: "string" },
        { name: "statLabel", title: "Stat label",              type: "string" },
      ]
    },

    // ── Contact ───────────────────────────────────────────
    { name: "email",    title: "Sales email",    type: "string" },
    { name: "whatsapp", title: "WhatsApp number", type: "string" },
    { name: "phones",   title: "Phone numbers",  type: "array",
      of: [{ type: "object", fields: [
        { name: "label",   type: "string" },
        { name: "display", type: "string" },
        { name: "tel",     type: "string" }
      ]}] },
  ]
};
