import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default {
  name: "caseStudy", title: "Case Studies", type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "caseStudy" }),
    { name: "visible",     title: "Visible on site",    type: "boolean", initialValue: true },
    { name: "title",       type: "string", validation: R => R.required() },
    { name: "slug",        type: "slug", options: { source: "title", validation: R => R.required() } },
    { name: "kicker",      title: "Kicker (customer / programme)", type: "string", validation: R => R.required() },
    { name: "clientLogo",  title: "Client logo (transparent PNG/SVG)", type: "image",
      options: { accept: "image/svg+xml,image/png,image/webp" } },
    { name: "externalUrl", title: "External link (optional)", type: "url",
      description: "Links to client website or press article — opens in new tab." },
    { name: "quote",       title: "Pull quote",   type: "text" },
    { name: "body",        title: "Body",         type: "text" },
    { name: "stats", type: "array",
      of: [{ type: "object", fields: [
        { name: "value", type: "string" }, { name: "label", type: "string" }
      ], preview: { select: { title: "value", subtitle: "label" } } }]
    },
    { name: "image",       title: "Hero image",   type: "image" },
    { name: "publishedAt", title: "Published",    type: "datetime" },
  ],
  preview: {
    select: { title: "title", subtitle: "kicker", media: "clientLogo", visible: "visible" },
    prepare({ title, subtitle, media, visible }) {
      return { title, subtitle: `${subtitle || ""} ${visible === false ? "· 🔴 Hidden" : ""}`, media };
    }
  }
};
