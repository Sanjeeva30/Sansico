import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default {
  name: "productCategory", title: "Product Categories", type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "productCategory" }),
    { name: "visible",     title: "Visible on site", type: "boolean", initialValue: true },
    { name: "name",        title: "Category name",   type: "styledString", validation: R => R.required() },
    { name: "slug",        type: "slug", options: { source: (doc) => doc.name?.text || doc.name || "", validation: R => R.required() } },
    { name: "description", title: "Description",     type: "styledText" },
    { name: "coverImage", description: "Category hero — 1200×400px or wider landscape image works best.",  title: "Cover image",     type: "image", options: { hotspot: true } },
  ],
  preview: {
    select: { title: "name.text", media: "coverImage", visible: "visible" },
    prepare({ title, media, visible }) {
      return { title, subtitle: visible === false ? "🔴 Hidden" : "✅ Visible", media };
    }
  }
};
