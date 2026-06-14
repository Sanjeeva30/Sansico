export default {
  name: "whyIndonesia", title: "Why Indonesia, Why Now", type: "document",
  fields: [
    { name: "heroTitle",    title: "Hero title",    type: "string" },
    { name: "heroSubtitle", title: "Hero subtitle", type: "text" },
    { name: "heroStats", title: "Hero stats", type: "array",
      of: [{ type: "object", fields: [
        { name: "value", title: "Value (e.g. 288M)", type: "string", validation: R => R.required() },
        { name: "label", title: "Label",             type: "string", validation: R => R.required() },
      ], preview: { select: { title: "value", subtitle: "label" } } }]
    },
    { name: "executiveTitle",      title: "Executive position — title",      type: "string" },
    { name: "executiveIntro",      title: "Executive position — intro",       type: "text" },
    { name: "dimensions", title: "Six dimensions", type: "array",
      of: [{ type: "object", fields: [
        { name: "title", type: "string", validation: R => R.required() },
        { name: "body",  type: "text",   validation: R => R.required() }
      ], preview: { select: { title: "title" } } }]
    },
    { name: "executiveConclusion", title: "Positioning conclusion",           type: "text" },
    { name: "aseanTitle",          title: "ASEAN context — title",            type: "string" },
    { name: "aseanBody",           title: "ASEAN context — body",             type: "text" },
    { name: "aseanConclusion",     title: "ASEAN context — conclusion",       type: "text" },
    { name: "scorecardVietnamNote",title: "Scorecard — Vietnam NME note",     type: "text" },
    { name: "scorecardConclusion", title: "Scorecard — balanced conclusion",  type: "text" },
    { name: "javaTitle",           title: "Java geography — title",           type: "string" },
    { name: "javaIntro",           title: "Java geography — intro",           type: "text" },
    { name: "javaRegions", title: "Regions", type: "array",
      of: [{ type: "object", fields: [
        { name: "name",        type: "string", validation: R => R.required() },
        { name: "description", type: "text",   validation: R => R.required() }
      ], preview: { select: { title: "name" } } }]
    },
    { name: "javaPlatformNote",    title: "Java — platform logic note",       type: "text" },
    { name: "sectorsTitle",        title: "Priority sectors — title",         type: "string" },
    { name: "sectorsBody",         title: "Priority sectors — body",          type: "text" },
    { name: "sectorsConclusion",   title: "Priority sectors — conclusion",    type: "text" },
    { name: "susTitle",            title: "Sustainability — title",           type: "string" },
    { name: "susBody",             title: "Sustainability — body",            type: "text" },
    { name: "susPoints",           title: "Sustainability — key points",      type: "array",
      of: [{ type: "string" }]
    },
    { name: "tradeTitle",          title: "Trade architecture — title",       type: "string" },
    { name: "tradeBody",           title: "Trade architecture — body",        type: "text" },
    { name: "tradeAgreements", title: "Trade agreements", type: "array",
      of: [{ type: "object", fields: [
        { name: "name",        type: "string", validation: R => R.required() },
        { name: "description", type: "text",   validation: R => R.required() }
      ], preview: { select: { title: "name" } } }]
    },
    { name: "fiberTitle",          title: "Fiber-based seasonal — title",     type: "string" },
    { name: "fiberBody",           title: "Fiber-based seasonal — body",      type: "text" },
    { name: "fiberPoints", title: "Fiber-based — sub-points", type: "array",
      of: [{ type: "object", fields: [
        { name: "title", type: "string" },
        { name: "body",  type: "text" }
      ], preview: { select: { title: "title" } } }]
    },
    { name: "conclusionStatement", title: "Closing statement",                type: "text" },
    { name: "conclusionBullets",   title: "Closing bullets",                  type: "array",
      of: [{ type: "string" }]
    },
    { name: "ctaHeadline",         title: "CTA — headline",                   type: "string" },
    { name: "ctaSubline",          title: "CTA — subline",                    type: "text" },
    { name: "ctaBtnLabel",         title: "CTA — button label",               type: "string" },
    { name: "ctaBtnHref",          title: "CTA — button URL",                 type: "string" },
    { name: "sources", title: "Sources (listed at bottom with hyperlinks)",
      type: "array",
      description: "Add, edit or remove sources. Each will appear as a numbered reference with a clickable link.",
      of: [{ type: "object", fields: [
        { name: "category", title: "Category heading",        type: "string" },
        { name: "label",    title: "Source label / citation", type: "string", validation: R => R.required() },
        { name: "url",      title: "URL",                     type: "url" }
      ], preview: { select: { title: "label", subtitle: "category" } } }]
    },
  ]
};
