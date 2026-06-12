export default {
  name: "person", title: "Team", type: "document",
  fields: [
    { name: "name", title: "Full name", type: "string" },
    { name: "role", title: "Job title / role", type: "string" },
    { name: "bio", title: "Biography", type: "text", rows: 5 },
    {
      name: "photo", title: "Photo", type: "image",
      options: { hotspot: true },
      description: "Square or portrait crop recommended."
    },
    { name: "linkedin", title: "LinkedIn URL", type: "url" },
    { name: "email", title: "Email (optional — shown on team page)", type: "string" },
    { name: "order", title: "Display order", type: "number" }
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" }
  }
};
