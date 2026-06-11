export default {
  name: "careersPage", title: "Careers Page", type: "document",
  fields: [
    { name: "title", type: "string" },
    { name: "intro", type: "text" },
    { name: "values", type: "array", of: [{ type: "object", fields: [
      { name: "title", type: "string" }, { name: "body", type: "text" }
    ]}]},
    { name: "openRoles", title: "Open roles (HR adds here)", type: "array", of: [{ type: "object", fields: [
      { name: "title", type: "string" }, { name: "location", type: "string" }, { name: "description", type: "text" }, { name: "applyEmail", type: "string" }
    ]}]}
  ]
};
