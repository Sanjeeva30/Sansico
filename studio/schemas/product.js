export default {
  name: "product", title: "Product Families", type: "document",
  fields: [
    { name: "title", type: "string" },
    { name: "slug", type: "slug", options: { source: "title" } },
    { name: "tag", type: "string" },
    { name: "body", type: "text" },
    { name: "specs", title: "Specification guidance", type: "array", of: [{ type: "string" }] },
    { name: "facilities", title: "Produced at", type: "array", of: [{ type: "reference", to: [{ type: "facility" }] }] },
    { name: "gallery", title: "Product gallery", type: "array", of: [{ type: "image", fields: [{ name: "caption", type: "string" }] }] },
    { name: "order", type: "number" }
  ]
};
