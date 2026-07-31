import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default {
  name: "facility", title: "Facilities", type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "facility" }),
    { name: "logo", title: "Facility logo / thumbnail", type: "image", description: "Square logo for the capabilities page thumbnail. Replaces the abbreviation badge. 200×200px recommended.", options: { accept: "image/svg+xml,image/png,image/webp" } },
    { name: "visible",  title: "Visible on site", type: "boolean", initialValue: true },
    { name: "name",     type: "styledString", validation: R => R.required() },
    { name: "city",     type: "styledString", validation: R => R.required() },
    { name: "address",  type: "styledText" },
    { name: "focus",    title: "Production focus", type: "styledString" },
    { name: "facilityGroup", title: "Facility group", type: "string", initialValue: "paper",
      description: "Drives which band this facility appears in on the Company page.",
      options: { list: [
        { title: "Paper Product Facility", value: "paper" },
        { title: "Toy Facility", value: "toy" },
      ], layout: "radio" } },
    { name: "photo",    type: "image", options: { hotspot: true },
      description: "1200×900px or wider, landscape recommended." },
    { name: "capacity", title: "Capacity notes (optional)", type: "styledText" },
  ],
  preview: {
    select: { title: "name.text", subtitle: "city.text", media: "photo", visible: "visible" },
    prepare({ title, subtitle, media, visible }) {
      return { title, subtitle: `${subtitle || ""} ${visible === false ? "· 🔴 Hidden" : ""}`, media };
    }
  }
};
