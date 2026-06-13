export default {
  name: "facility", title: "Facilities", type: "document",
  fields: [
    { name: "name", type: "string" },
    { name: "city", type: "string" },
    { name: "address", type: "text" },
    { name: "focus", title: "Production focus", type: "string" },
    { name: "photo", type: "image" },
    { name: "capacity", title: "Capacity notes (optional)", type: "text" },
    { name: "order", type: "number" }
  ]
};
