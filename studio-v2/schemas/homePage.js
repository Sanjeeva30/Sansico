import { ColourPicker } from "../components/ColourPicker";

export default {
  name: "homePage", title: "Home Page", type: "document",
  fields: [
    { name: "heroType",    title: "Hero type",    type: "string", options: { list: ["ink","image","video"], layout: "radio" } },
    { name: "heroImage",   title: "Hero image",   type: "image",  hidden: ({ document: d }) => d?.heroType !== "image",
      description: "1920×1080px or wider, landscape. Full-width background image behind the hero text." },
    { name: "heroVideo",   title: "Hero video URL", type: "url",   hidden: ({ document: d }) => d?.heroType !== "video",
      description: "Direct .mp4 URL, 1920×1080px (16:9) recommended. Keep the file size reasonable — it autoplays on page load." },
    { name: "heroPoster",  title: "Hero video poster (shown while video loads)", type: "image", hidden: ({ document: d }) => d?.heroType !== "video",
      description: "Same size as the video, 1920×1080px or wider landscape — shown as a static frame before playback starts." },
    { name: "heroEyebrow", title: "Hero eyebrow", type: "styledString" },
    { name: "heroTitle",   title: "Hero title (italic word in |pipes|)", type: "styledString" },
    { name: "heroSub",     title: "Hero subline", type: "styledText" },
    { name: "manifestoTitle", title: "Manifesto title (accent in |pipes|)", type: "styledText" },
    { name: "manifestoBody",  title: "Manifesto body", type: "styledText" },
    { name: "stats", title: "Animated stats", type: "array",
      of: [{ type: "object", fields: [
        { name: "value",     title: "Number",             type: "number" },
        { name: "suffix",    title: "Suffix (+, %, blank)", type: "string" },
        { name: "label",     title: "Label",              type: "styledString" },
        { name: "bgColor",   title: "Background colour",  type: "string", components: { input: ColourPicker } },
        { name: "textColor", title: "Text colour",        type: "string", components: { input: ColourPicker } },
      ],
      preview: { select: { title: "label.text", value: "value", suffix: "suffix" },
        prepare({ title, value, suffix }) { return { title: `${value}${suffix||""} — ${title}` }; } }
      }]
    },
    { name: "customers", title: "Customer wall", type: "array",
      of: [{ type: "object", fields: [
        { name: "name", title: "Customer name", type: "styledString" },
        { name: "logo", title: "Logo (transparent SVG/PNG)", type: "image",
          description: "Wide transparent logo, roughly 400×140px works best — displayed small and grayscale in the customer wall.",
          options: { accept: "image/svg+xml,image/png,image/webp" } },
      ], preview: { select: { title: "name.text", media: "logo" } } }]
    },
    { name: "featuredWork", title: "Featured case study", type: "reference", to: [{ type: "caseStudy" }] },
  ]
};
