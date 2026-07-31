import { ColourPicker } from "../components/ColourPicker";

export default {
  name: "siteSettings", title: "Site Settings", type: "document",
  fields: [
    // ── Brand ─────────────────────────────────────────────
    { name: "logo", title: "Brand logo", type: "image",
      description: "SVG or transparent PNG — replaces the text wordmark when set. Wide format, roughly 800×180px works best; will be scaled down in the header and footer.",
      options: { accept: "image/svg+xml,image/png,image/webp" } },
    { name: "tagline",  title: "Tagline",  type: "styledString" },
    { name: "mission",  title: "Mission statement (footer)", type: "styledText" },

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
    { name: "ctaLabel", title: "Header CTA label", type: "styledString" },

    // ── CTA band ──────────────────────────────────────────
    { name: "ctaBand", title: "CTA band (bottom of all pages)", type: "object",
      fields: [
        { name: "headline", title: "Headline (italic word in |pipes|)", type: "styledString",
          description: "e.g. Looking for your |China+1| partner in Indonesia?" },
        { name: "subline",  title: "Subline", type: "styledText" },
        { name: "btn1Label",title: "Button 1 label", type: "styledString" },
        { name: "btn1Href", title: "Button 1 URL",   type: "string" },
        { name: "btn2Label",title: "Button 2 label", type: "styledString" },
        { name: "btn2Href", title: "Button 2 URL",   type: "string" },
      ]
    },

    // ── Sustainability / Certifications section ───────────
    { name: "susSection", title: "Sustainability section (homepage + sustainability page)", type: "object",
      fields: [
        // Certification section on homepage
        { name: "certHeadline", title: "Certification headline", type: "styledString",
          description: "Wrap the italic word in |pipes|. e.g. Certified, dated, |verifiable| — sustainability as a discipline, not an adjective." },
        { name: "certBody", title: "Certification body paragraph", type: "styledText" },
        { name: "certBadges", title: "Certification badge chips", type: "array",
          of: [{ type: "styledString" }],
          description: "Short labels shown as pill buttons, e.g. FSC®, FSSC 22000" },
        // Donut / pie chart
        { name: "donutCenterValue", title: "Donut chart — centre value (e.g. 95%)", type: "styledString" },
        { name: "donutCenterLabel", title: "Donut chart — centre label", type: "styledString" },
        { name: "donutSegments", title: "Donut chart segments (must total 100%)", type: "array",
          of: [{ type: "object", fields: [
            { name: "label",      title: "Segment label",        type: "styledString" },
            { name: "percentage", title: "Percentage (0–100)",   type: "number" },
            { name: "color",      title: "Colour (CSS variable)", type: "string",
              options: { list: [
                { title: "Green (#0D4F31)",  value: "var(--green,#0D4F31)" },
                { title: "Citrus (#BDDA5F)", value: "var(--citrus,#BDDA5F)" },
                { title: "Cream/Beige",      value: "var(--hair,#E5DFD8)" },
                { title: "Crimson (#7A0D20)",value: "var(--crimson,#7A0D20)" },
                { title: "Navy (#22409E)",   value: "var(--navy,#22409E)" },
              ]}
            },
          ],
          preview: { select: { title: "label.text", subtitle: "percentage" },
            prepare({ title, subtitle }) { return { title: `${title} — ${subtitle}%` }; }
          }}]
        },
        // Sustainability page
        { name: "pageTitle", title: "Sustainability page — hero title (italic in |pipes|)", type: "styledString" },
        { name: "pageIntro", title: "Sustainability page — hero intro", type: "styledText" },
        { name: "heading",   title: "Sustainability section heading (italic in |pipes|)", type: "styledString" },
        { name: "body",      title: "Sustainability section body", type: "styledText" },
        { name: "statValue", title: "Stat value (legacy — use Donut fields above)", type: "string" },
        { name: "statLabel", title: "Stat label (legacy)", type: "string" },
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
