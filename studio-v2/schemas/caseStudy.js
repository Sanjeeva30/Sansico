import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default {
  name: "caseStudy", title: "Case Studies", type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "caseStudy" }),
    { name: "visible",     title: "Visible on site",    type: "boolean", initialValue: true },
    { name: "title",       type: "styledString", validation: R => R.required() },
    { name: "slug",        type: "slug", options: { source: (doc) => doc.title?.text || doc.title || "", validation: R => R.required() } },
    { name: "kicker",      title: "Kicker (customer / programme)", type: "styledString", validation: R => R.required() },
    { name: "clientLogo",  title: "Client logo (transparent PNG/SVG)", type: "image",
      description: "Wide transparent logo, roughly 400×160px works best.",
      options: { accept: "image/svg+xml,image/png,image/webp" } },
    { name: "externalUrl", title: "External link (optional)", type: "url",
      description: "Links to client website or press article — opens in new tab." },
    { name: "quote",       title: "Pull quote",   type: "styledText" },
    { name: "body",        title: "Body",         type: "styledText" },
    { name: "stats", type: "array",
      of: [{ type: "object", fields: [
        { name: "value", type: "styledString" }, { name: "label", type: "styledString" }
      ], preview: { select: { title: "value.text", subtitle: "label.text" } } }]
    },
    { name: "image",       title: "Hero image",   type: "image",
      description: "1600×1000px or wider, landscape recommended." },
    { name: "publishedAt", title: "Published",    type: "datetime" },
  ],
  preview: {
    select: { title: "title.text", subtitle: "kicker.text", media: "clientLogo", visible: "visible" },
    prepare({ title, subtitle, media, visible }) {
      return { title, subtitle: `${subtitle || ""} ${visible === false ? "· 🔴 Hidden" : ""}`, media };
    }
  }
};
