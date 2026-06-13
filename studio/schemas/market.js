export default {
  name: "market", title: "Markets", type: "document",
  fields: [
    { name: "title", type: "string" },
    { name: "slug", type: "slug", options: { source: "title" } },
    { name: "color", title: "Accent colour", type: "color", options: { disableAlpha: true, colorList: [
  { label: "Crimson",   value: { hex: "#7A0D20" } },
  { label: "Navy",      value: { hex: "#22409E" } },
  { label: "Green",     value: { hex: "#0D4F31" } },
  { label: "Red",       value: { hex: "#F3263E" } },
  { label: "Citrus",    value: { hex: "#BDDA5F" } },
  { label: "Black",     value: { hex: "#1A1A1A" } },
  { label: "White",     value: { hex: "#FFFFFF" } },
  { label: "Off-white", value: { hex: "#F5F0E8" } },
] } } },
  { label: "Navy",      value: { hex: "#22409E" } },
  { label: "Green",     value: { hex: "#0D4F31" } },
  { label: "Red",       value: { hex: "#F3263E" } },
  { label: "Citrus",    value: { hex: "#BDDA5F" } },
  { label: "Black",     value: { hex: "#1A1A1A" } },
  { label: "White",     value: { hex: "#FFFFFF" } },
  { label: "Off-white", value: { hex: "#F5F0E8" } },
] } } },
    { name: "tag", title: "One-line tag", type: "string" },
    { name: "body", type: "text" },
    { name: "proof", title: "Proof line", type: "text" },
    { name: "image", type: "image" },
    { name: "order", type: "number" }
  ]
};
