import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default {
  name: "careersPage", title: "Careers Page", type: "document",
  fields: [
    { name: "visible", title: "Visible on site", type: "boolean", initialValue: true,
      description: "Off = page hidden from nav and returns 404" },
    { name: "title", type: "string", validation: R => R.required() },
    { name: "intro", type: "text", validation: R => R.required() },
    { name: "values", title: "Our values", type: "array",
      of: [{ type: "object", fields: [
        { name: "title", type: "string", validation: R => R.required() },
        { name: "body",  type: "text"   }
      ], preview: { select: { title: "title" } } }]
    },
    { name: "openRoles", title: "Open roles", type: "array",
      of: [{ type: "object", fields: [
        { name: "title",       type: "string", validation: R => R.required() },
        { name: "location",    type: "string" },
        { name: "description", type: "text"   },
        { name: "applyEmail",  title: "Apply email", type: "string" }
      ], preview: { select: { title: "title", subtitle: "location" } } }]
    },
  ]
};
