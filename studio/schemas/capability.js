export default {
  name: "capability", title: "Capabilities", type: "document",
  fields: [
    { name: "title", type: "string" },
    { name: "slug", type: "slug", options: { source: "title" } },
    { name: "num", title: "Eyebrow (DESIGN / MAKE / DELIVER)", type: "string" },
    { name: "summary", type: "text" },
    { name: "body", type: "text" },
    { name: "points", title: "Bullet points", type: "array", of: [{ type: "string" }] },
    { name: "image", title: "Section image (replaces abstract art when set)", type: "image" },
    { name: "order", title: "Display order", type: "number" }
  ]
};
