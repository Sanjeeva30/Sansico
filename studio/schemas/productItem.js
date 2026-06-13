import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default {
  name: "productItem", title: "Products", type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "productItem" }),
    { name: "visible",     title: "Visible on site", type: "boolean", initialValue: true },
    { name: "name",        title: "Product name",    type: "string", validation: R => R.required() },
    { name: "slug",        type: "slug", options: { source: "name", validation: R => R.required() } },
    { name: "category",    title: "Category", type: "reference", to: [{ type: "productCategory" }] },
    { name: "description", title: "Description",     type: "text", rows: 4 },
    { name: "photos",      title: "Product photos",  type: "array",
      of: [{ type: "image", options: { hotspot: true },
        fields: [{ name: "caption", title: "Caption", type: "string" }] }],
      description: "First photo is the thumbnail. Add multiple for a gallery."
    },
    { name: "specs",       title: "Specifications",  type: "array",
      of: [{ type: "object", fields: [
        { name: "label", title: "Label (e.g. Material)", type: "string" },
        { name: "value", title: "Value (e.g. 300gsm C1S)", type: "string" }
      ], preview: { select: { title: "label", subtitle: "value" } } }]
    },
    { name: "moq",         title: "Minimum order quantity", type: "string" },
  ],
  preview: {
    select: { title: "name", subtitle: "category.name", media: "photos.0", visible: "visible" },
    prepare({ title, subtitle, media, visible }) {
      return { title, subtitle: `${subtitle||"No category"} ${visible===false?"· 🔴 Hidden":""}`, media };
    }
  }
};
