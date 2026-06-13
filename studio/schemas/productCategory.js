import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default {
  name: "productCategory", title: "Product Categories", type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "productCategory" }),
    { name: "visible",     title: "Visible on site", type: "boolean", initialValue: true },
    { name: "name",        title: "Category name",   type: "string", validation: R => R.required() },
    { name: "slug",        type: "slug", options: { source: "name", validation: R => R.required() } },
    { name: "description", title: "Description",     type: "text", rows: 3 },
    { name: "coverImage",  title: "Cover image",     type: "image", options: { hotspot: true } },
  ],
  preview: {
    select: { title: "name", media: "coverImage", visible: "visible" },
    prepare({ title, media, visible }) {
      return { title, subtitle: visible === false ? "🔴 Hidden" : "✅ Visible", media };
    }
  }
};
