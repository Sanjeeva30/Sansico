export default {
  name: "certification", title: "Certifications", type: "document",
  fields: [
    { name: "name", type: "string" },
    { name: "category", type: "string", options: { list: ["Forestry","Food Safety","Quality & Testing","Supply Chain Security","Environmental","Social"] } },
    { name: "scope", type: "text" },
    { name: "entity", title: "Holding entity", type: "string" },
    { name: "issued", title: "Issue date", type: "date" },
    { name: "expires", title: "Expiry date", type: "date" },
    { name: "registration", title: "Registration number", type: "string" },
    { name: "certificate", title: "Certificate PDF", type: "file" }
  ]
};
