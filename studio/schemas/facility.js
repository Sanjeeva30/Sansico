import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default {
  name: "facility", title: "Facilities", type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "facility" }),
    { name: "visible",  title: "Visible on site", type: "boolean", initialValue: true },
    { name: "name",     type: "string", validation: R => R.required() },
    { name: "city",     type: "string", validation: R => R.required() },
    { name: "address",  type: "text" },
    { name: "focus",    title: "Production focus", type: "string" },
    { name: "photo",    type: "image", options: { hotspot: true } },
    { name: "capacity", title: "Capacity notes (optional)", type: "text" },
  ],
  preview: {
    select: { title: "name", subtitle: "city", media: "photo", visible: "visible" },
    prepare({ title, subtitle, media, visible }) {
      return { title, subtitle: `${subtitle || ""} ${visible === false ? "· 🔴 Hidden" : ""}`, media };
    }
  }
};
