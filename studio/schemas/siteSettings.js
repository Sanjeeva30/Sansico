export default {
  name: "siteSettings", title: "Site Settings", type: "document",
  fields: [
    { name: "tagline", title: "Tagline", type: "string" },
    { name: "mission", title: "Mission statement", type: "text" },
    { name: "nav", title: "Header navigation (drag to reorder)", type: "array", of: [{ type: "navItem" }] },
    { name: "ctaLabel", title: "Header CTA label", type: "string" },
    { name: "email", title: "Sales email", type: "string" },
    { name: "whatsapp", title: "WhatsApp number (with country code)", type: "string" },
    { name: "phones", title: "Phone numbers", type: "array", of: [{ type: "object", fields: [
      { name: "label", type: "string" }, { name: "display", type: "string" }, { name: "tel", type: "string" }
    ]}]}
  ]
};
