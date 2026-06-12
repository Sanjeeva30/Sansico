export default {
  name: "certification", title: "Certifications", type: "document",
  fields: [
    { name: "name",     title: "Certification name", type: "string" },
    {
      name: "category", type: "string",
      options: { list: ["Forestry","Food Safety","Quality & Testing","Supply Chain Security","Environmental","Social"] }
    },
    {
      name: "logo", title: "Certification body logo / seal",
      type: "image",
      options: { accept: "image/svg+xml,image/png,image/webp" },
      description: "Shown on the sustainability page alongside the certification name."
    },
    {
      name: "certificate", title: "Certificate document (PDF)",
      type: "file",
      options: { accept: "application/pdf" },
      description: "Becomes a download link on the sustainability page."
    },
    { name: "scope",        title: "Scope",              type: "text" },
    { name: "entity",       title: "Holding entity",     type: "string" },
    { name: "issued",       title: "Issue date",         type: "date" },
    { name: "expires",      title: "Expiry date",        type: "date" },
    { name: "registration", title: "Registration number", type: "string" }
  ],
  preview: {
    select: { title: "name", subtitle: "entity", media: "logo" }
  }
};
