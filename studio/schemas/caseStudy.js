export default {
  name: "caseStudy", title: "Case Studies", type: "document",
  fields: [
    { name: "title",       type: "string" },
    { name: "slug",        type: "slug", options: { source: "title" } },
    { name: "kicker",      title: "Kicker (customer / programme)", type: "string" },
    { name: "clientLogo",  title: "Client logo (transparent PNG/SVG)", type: "image",
      options: { accept: "image/svg+xml,image/png,image/webp" } },
    { name: "externalUrl", title: "External link (optional)",  type: "url",
      description: "Link to client website, press article, or product page. Opens in new tab." },
    { name: "quote",       title: "Pull quote",   type: "text" },
    { name: "body",        title: "Body",         type: "text" },
    {
      name: "stats", type: "array",
      of: [{ type: "object", fields: [
        { name: "value", type: "string" },
        { name: "label", type: "string" }
      ], preview: { select: { title: "value", subtitle: "label" } } }]
    },
    { name: "image",       title: "Hero image",   type: "image" },
    { name: "publishedAt", title: "Published",    type: "datetime" }
  ],
  preview: {
    select: { title: "title", subtitle: "kicker", media: "clientLogo" },
    prepare({ title, subtitle, media }) {
      return { title, subtitle, media };
    }
  }
};
