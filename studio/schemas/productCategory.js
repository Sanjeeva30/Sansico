export default {
  name: "productCategory", title: "Product Categories", type: "document",
  fields: [
    { name: "name", title: "Category name", type: "string" },
    { name: "slug", type: "slug", options: { source: "name" } },
    { name: "description", title: "Category description", type: "text", rows: 3 },
    {
      name: "coverImage", title: "Cover image",
      type: "image", options: { hotspot: true },
      description: "Shown on the products index page."
    },
    { name: "order", title: "Display order", type: "number" },
    { name: "visible", title: "Visible on site", type: "boolean", initialValue: true }
  ],
  preview: {
    select: { title: "name", media: "coverImage", visible: "visible" },
    prepare({ title, media, visible }) {
      return { title, subtitle: visible ? "Visible" : "Hidden", media };
    }
  }
};
