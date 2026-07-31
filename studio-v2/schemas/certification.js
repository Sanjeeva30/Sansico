import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

const STANDARD_CATEGORIES = [
  { title: "Forestry",              value: "Forestry" },
  { title: "Food Safety",           value: "Food Safety" },
  { title: "Quality & Testing",     value: "Quality & Testing" },
  { title: "Supply Chain Security", value: "Supply Chain Security" },
  { title: "Environmental",         value: "Environmental" },
  { title: "Social",                value: "Social" },
  { title: "Other — fill in below", value: "custom" },
];

export default {
  name: "certification", title: "Certifications", type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "certification" }),
    { name: "visible", title: "Visible on site", type: "boolean", initialValue: true },
    { name: "name", title: "Certification name", type: "styledString",
      validation: R => R.required() },
    { name: "category", title: "Category", type: "string",
      options: { list: STANDARD_CATEGORIES, layout: "dropdown" },
      description: "Select a standard category or choose 'Other' to enter a custom one below."
    },
    { name: "customCategory", title: "Custom category", type: "string",
      description: "Only fill this if you selected 'Other' above.",
      hidden: ({ document: d }) => d?.category !== "custom"
    },
    { name: "logo", title: "Certification body logo / seal", type: "image",
      description: "Square works best, 400×400px minimum. Logos with very different proportions will be padded to fit a square frame.",
      options: { accept: "image/svg+xml,image/png,image/webp" }
    },
    { name: "certificate", title: "Certificate document (PDF)", type: "file",
      options: { accept: "application/pdf" }
    },
    { name: "scope",        title: "Scope",               type: "styledText" },
    { name: "entity",       title: "Holding entity",      type: "styledString" },
    { name: "issued",       title: "Issue date",          type: "date" },
    { name: "expires",      title: "Expiry date",         type: "date" },
    { name: "registration", title: "Registration number", type: "styledString" },
  ],
  preview: {
    select: { title: "name.text", subtitle: "entity.text", media: "logo", visible: "visible" },
    prepare({ title, subtitle, media, visible }) {
      return { title, subtitle: `${subtitle || ""} ${visible === false ? "· 🔴 Hidden" : ""}`, media };
    }
  }
};
