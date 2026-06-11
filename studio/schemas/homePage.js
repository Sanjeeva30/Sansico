export default {
  name: "homePage", title: "Home Page", type: "document",
  fields: [
    { name: "heroType", title: "Hero type", type: "string", options: { list: ["ink", "image", "video"], layout: "radio" }, description: "Switch to video the day the brand film is ready." },
    { name: "heroVideo", title: "Hero video (MP4 upload or Cloudinary URL)", type: "url", hidden: ({ document }) => document?.heroType !== "video" },
    { name: "heroPoster", title: "Hero poster image", type: "image", hidden: ({ document }) => document?.heroType === "ink" },
    { name: "heroEyebrow", title: "Hero eyebrow", type: "string" },
    { name: "heroTitle", title: "Hero title (wrap the italic word in |pipes|)", type: "string" },
    { name: "heroSub", title: "Hero subline", type: "text" },
    { name: "manifestoTitle", title: "Manifesto (accent word in |pipes|)", type: "text" },
    { name: "manifestoBody", title: "Manifesto body", type: "text" },
    { name: "stats", title: "Animated stats", type: "array", of: [{ type: "object", fields: [
      { name: "value", title: "Number", type: "number" },
      { name: "suffix", title: "Suffix (+, %, blank)", type: "string" },
      { name: "label", title: "Label", type: "string" }
    ]}]},
    { name: "customers", title: "Customer wall (names or upload logos later)", type: "array", of: [{ type: "string" }] },
    { name: "featuredWork", title: "Featured case study", type: "reference", to: [{ type: "caseStudy" }] }
  ]
};
