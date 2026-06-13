export default {
  name: "productItem", title: "Products", type: "document",
  fields: [
    { name: "name", title: "Product name", type: "string" },
    { name: "slug", type: "slug", options: { source: "name" } },
    {
      name: "category", title: "Category",
      type: "reference", to: [{ type: "productCategory" }]
    },
    { name: "description", title: "Description", type: "text", rows: 4 },
    {
      name: "photos", title: "Product photos",
      type: "array",
      of: [{
        type: "image", options: { hotspot: true },
        fields: [{ name: "caption", title: "Caption", type: "string" }]
      }],
      description: "First photo is used as the thumbnail. Add multiple for a gallery."
    },
    {
      name: "specs", title: "Specifications",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "label", title: "Spec label (e.g. Material)", type: "string" },
          { name: "value", title: "Spec value (e.g. 300gsm C1S)", type: "string" }
        ],
        preview: { select: { title: "label", subtitle: "value" } }
      }]
    },
    { name: "moq", title: "Minimum order quantity", type: "string" },
    { name: "order", title: "Display order within category", type: "number" },
    { name: "visible", title: "Visible on site", type: "boolean", initialValue: true }
  ],
  preview: {
    select: { title: "name", subtitle: "category.name", media: "photos.0" },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle || "No category", media };
    }
  }
};
