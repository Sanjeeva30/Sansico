import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default {
  name: "careersPage", title: "Careers Page", type: "document",
  fields: [
    { name: "visible", title: "Visible on site", type: "boolean", initialValue: true,
      description: "Off = page hidden from nav and returns 404" },
    { name: "title", type: "styledString", validation: R => R.required() },
    { name: "intro", type: "styledText", validation: R => R.required() },
    { name: "values", title: "Our values", type: "array",
      of: [{ type: "object", fields: [
        { name: "title", type: "styledString", validation: R => R.required() },
        { name: "body",  type: "styledText"   }
      ], preview: { select: { title: "title.text" } } }]
    },
    { name: "openRoles", title: "Open roles", type: "array",
      of: [{ type: "object", fields: [
        { name: "title",       type: "styledString", validation: R => R.required() },
        { name: "location",    type: "styledString" },
        { name: "description", type: "styledText"   },
        { name: "applyEmail",  title: "Apply email", type: "string" }
      ], preview: { select: { title: "title.text", subtitle: "location.text" } } }]
    },
  ]
};
