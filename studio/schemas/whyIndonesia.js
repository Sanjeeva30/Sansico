export default {
  name: "whyIndonesia", title: "Why Indonesia, Why Now", type: "document",
  fields: [
    // ── Hero ─────────────────────────────────────────────
    { name: "heroTitle",    title: "Hero title",    type: "string" },
    { name: "heroSubtitle", title: "Hero subtitle", type: "text" },
    { name: "heroStats", title: "Hero stats (4 key figures)", type: "array",
      of: [{ type: "object", fields: [
        { name: "value", title: "Value (e.g. 288M)", type: "string", validation: R => R.required() },
        { name: "label", title: "Label",             type: "string", validation: R => R.required() },
      ], preview: { select: { title: "value", subtitle: "label" } } }]
    },

    // ── Executive Position ────────────────────────────────
    { name: "executiveTitle",      title: "Executive position — section title", type: "string" },
    { name: "executiveIntro",      title: "Executive position — intro",         type: "text" },
    { name: "dimensions", title: "Six dimensions (cards)", type: "array",
      of: [{ type: "object", fields: [
        { name: "title", type: "string", validation: R => R.required() },
        { name: "body",  type: "text",   validation: R => R.required() }
      ], preview: { select: { title: "title" } } }]
    },
    { name: "executiveConclusion", title: "Positioning conclusion",             type: "text" },

    // ── ASEAN Context ─────────────────────────────────────
    { name: "aseanTitle",      title: "ASEAN context — title",      type: "string" },
    { name: "aseanBody",       title: "ASEAN context — body",       type: "text" },
    { name: "aseanConclusion", title: "ASEAN context — conclusion", type: "text" },

    // ── Java Geography ────────────────────────────────────
    { name: "javaTitle",       title: "Java geography — title",         type: "string" },
    { name: "javaIntro",       title: "Java geography — intro",         type: "text" },
    { name: "javaRegions", title: "Regions (5 cards)", type: "array",
      of: [{ type: "object", fields: [
        { name: "name",        type: "string", validation: R => R.required() },
        { name: "description", type: "text",   validation: R => R.required() }
      ], preview: { select: { title: "name" } } }]
    },
    { name: "javaPlatformNote", title: "Java — platform logic closing note", type: "text" },

    // ── Priority Sectors ──────────────────────────────────
    { name: "sectorsTitle",      title: "Priority sectors — title",      type: "string" },
    { name: "sectorsBody",       title: "Priority sectors — body",       type: "text" },
    { name: "sectorsConclusion", title: "Priority sectors — conclusion", type: "text" },

    // ── Sustainability ────────────────────────────────────
    { name: "susTitle",  title: "Sustainability — title", type: "string" },
    { name: "susBody",   title: "Sustainability — body",  type: "text" },
    { name: "susPoints", title: "Sustainability — key points", type: "array",
      of: [{ type: "string" }]
    },

    // ── Trade Architecture ────────────────────────────────
    { name: "tradeTitle", title: "Trade architecture — title", type: "string" },
    { name: "tradeBody",  title: "Trade architecture — body",  type: "text" },
    { name: "tradeAgreements", title: "Trade agreements (3 cards)", type: "array",
      of: [{ type: "object", fields: [
        { name: "name",        type: "string", validation: R => R.required() },
        { name: "description", type: "text",   validation: R => R.required() }
      ], preview: { select: { title: "name" } } }]
    },

    // ── Fiber-Based Seasonal ──────────────────────────────
    { name: "fiberTitle",  title: "Fiber-based seasonal — title", type: "string" },
    { name: "fiberBody",   title: "Fiber-based seasonal — body",  type: "text" },
    { name: "fiberPoints", title: "Fiber-based — sub-points",     type: "array",
      of: [{ type: "object", fields: [
        { name: "title", type: "string" },
        { name: "body",  type: "text" }
      ], preview: { select: { title: "title" } } }]
    },

    // ── Strategic Conclusion ──────────────────────────────
    { name: "conclusionStatement", title: "Closing statement",  type: "text" },
    { name: "conclusionBullets",   title: "Four closing bullets", type: "array",
      of: [{ type: "string" }]
    },

    // ── CTA ───────────────────────────────────────────────
    { name: "ctaHeadline", title: "CTA — headline",      type: "string" },
    { name: "ctaSubline",  title: "CTA — subline",       type: "text" },
    { name: "ctaBtnLabel", title: "CTA — button label",  type: "string" },
    { name: "ctaBtnHref",  title: "CTA — button URL",    type: "string" },
  ]
};
