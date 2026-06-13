import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default {
  name: "person", title: "Team", type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "person" }),
    { name: "visible",  title: "Visible on site", type: "boolean", initialValue: true },
    { name: "name",     title: "Full name",        type: "string", validation: R => R.required() },
    { name: "role",     title: "Job title / role", type: "string", validation: R => R.required() },
    { name: "bio",      title: "Biography",        type: "text", rows: 5 },
    { name: "photo",    title: "Photo",            type: "image", options: { hotspot: true } },
    { name: "linkedin", title: "LinkedIn URL",     type: "url" },
    { name: "email",    title: "Email (optional)", type: "string" },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo", visible: "visible" },
    prepare({ title, subtitle, media, visible }) {
      return { title, subtitle: `${subtitle || ""} ${visible === false ? "· 🔴 Hidden" : ""}`, media };
    }
  }
};
