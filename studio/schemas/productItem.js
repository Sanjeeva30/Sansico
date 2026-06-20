import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default {
  name: "productItem", title: "Products", type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "productItem" }),
    { name: "visible",     title: "Visible on site", type: "boolean", initialValue: true },
    { name: "name",        title: "Product name",    type: "styledString", validation: R => R.required() },
    { name: "slug",        type: "slug", options: { source: (doc) => doc.name?.text || doc.name || "", validation: R => R.required() } },
    { name: "category",    title: "Category", type: "reference", to: [{ type: "productCategory" }] },
    { name: "description", title: "Description",     type: "styledText" },
    { name: "photos",      title: "Product photos",  type: "array",
      of: [{ type: "image", options: { hotspot: true },
        description: "1200×1200px square, or 1200×900px landscape — plain background works best.",
        fields: [{ name: "caption", title: "Caption", type: "string" }] }],
      description: "First photo is the thumbnail. Add multiple for a gallery."
    },
    { name: "specs",       title: "Specifications",  type: "array",
      of: [{ type: "object", fields: [
        { name: "label", title: "Label (e.g. Material)", type: "styledString" },
        { name: "value", title: "Value (e.g. 300gsm C1S)", type: "styledString" }
      ], preview: { select: { title: "label.text", subtitle: "value.text" } } }]
    },
    { name: "moq",         title: "Minimum order quantity", type: "styledString" },
  ],
  preview: {
    select: { title: "name.text", subtitle: "category.name.text", media: "photos.0", visible: "visible" },
    prepare({ title, subtitle, media, visible }) {
      return { title, subtitle: `${subtitle||"No category"} ${visible===false?"· 🔴 Hidden":""}`, media };
    }
  }
};
