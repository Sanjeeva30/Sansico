export default {
  name: "caseStudy", title: "Case Studies", type: "document",
  fields: [
    { name: "title", type: "string" },
    { name: "slug", type: "slug", options: { source: "title" } },
    { name: "kicker", title: "Kicker (customer/programme)", type: "string" },
    { name: "quote", title: "Pull quote", type: "text" },
    { name: "body", type: "text" },
    { name: "stats", type: "array", of: [{ type: "object", fields: [
      { name: "value", type: "string" }, { name: "label", type: "string" }
    ]}]},
    { name: "image", type: "image" },
    { name: "publishedAt", type: "datetime" }
  ]
};
