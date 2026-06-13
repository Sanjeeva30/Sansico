export default {
  name: "market", title: "Markets", type: "document",
  fields: [
    { name: "title", type: "string" },
    { name: "slug", type: "slug", options: { source: "title" } },
    { name: "color", title: "Accent", type: "string", options: { list: ["red","navy","crimson","citrus","green"] } },
    { name: "tag", title: "One-line tag", type: "string" },
    { name: "body", type: "text" },
    { name: "proof", title: "Proof line", type: "text" },
    { name: "image", type: "image" },
    { name: "order", type: "number" }
  ]
};
