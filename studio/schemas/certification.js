import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default {
  name: "certification", title: "Certifications", type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "certification" }),
    { name: "visible",  title: "Visible on site",  type: "boolean", initialValue: true },
    { name: "name",     title: "Certification name", type: "string", validation: R => R.required() },
    { name: "category", type: "string",
      options: { list: ["Forestry","Food Safety","Quality & Testing","Supply Chain Security","Environmental","Social"] } },
    { name: "logo",     title: "Certification body logo / seal", type: "image",
      options: { accept: "image/svg+xml,image/png,image/webp" } },
    { name: "certificate", title: "Certificate document (PDF)", type: "file",
      options: { accept: "application/pdf" } },
    { name: "scope",        title: "Scope",               type: "text" },
    { name: "entity",       title: "Holding entity",      type: "string" },
    { name: "issued",       title: "Issue date",          type: "date" },
    { name: "expires",      title: "Expiry date",         type: "date" },
    { name: "registration", title: "Registration number", type: "string" },
  ],
  preview: {
    select: { title: "name", subtitle: "entity", media: "logo", visible: "visible" },
    prepare({ title, subtitle, media, visible }) {
      return { title, subtitle: `${subtitle || ""} ${visible === false ? "· 🔴 Hidden" : ""}`, media };
    }
  }
};
