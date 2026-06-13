import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";
import { ColourPicker } from "../components/ColourPicker";

export default {
  name: "capability", title: "Capabilities", type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "capability" }),
    { name: "visible", title: "Visible on site", type: "boolean", initialValue: true },
    { name: "title",   type: "string", validation: R => R.required() },
    { name: "slug",    type: "slug", options: { source: "title", validation: R => R.required() } },
    { name: "num",     title: "Eyebrow (DESIGN / MAKE / DELIVER)", type: "string", validation: R => R.required() },
    { name: "summary", title: "One-line summary", type: "text", rows: 2 },
    { name: "colorTheme", title: "Colour theme", type: "string", components: { input: ColourPicker } },
    { name: "body",    title: "Body (plain text)", type: "text" },
    { name: "richBody", title: "Rich body (overrides plain)", type: "array",
      of: [{ type: "block",
        styles: [{ title:"Normal",value:"normal" },{ title:"Heading 2",value:"h2" },{ title:"Heading 3",value:"h3" },{ title:"Quote",value:"blockquote" }],
        marks: { decorators: [{ title:"Bold",value:"strong" },{ title:"Italic",value:"em" }] }
      }]
    },
    { name: "points",  title: "Bullet points", type: "array", of: [{ type: "string" }] },
    { name: "image",   title: "Primary image", type: "image" },
    { name: "gallery", title: "Image gallery", type: "array",
      of: [{ type: "image", options: { hotspot: true },
        fields: [{ name: "caption", title: "Caption", type: "string" }] }]
    },
    { name: "subServices", title: "Sub-services", type: "array",
      of: [{ type: "object", fields: [
        { name: "title", type: "string" }, { name: "description", type: "text", rows: 2 }
      ], preview: { select: { title: "title" } } }]
    },
    { name: "proofPoints", title: "Proof points / stats", type: "array",
      of: [{ type: "object", fields: [
        { name: "value", title: "Stat (e.g. 40+)", type: "string" },
        { name: "label", type: "string" }
      ], preview: { select: { title: "value", subtitle: "label" } } }]
    },
    { name: "customerLogos", title: "Customer logos", type: "array",
      of: [{ type: "object", fields: [
        { name: "name", type: "string" },
        { name: "logo", type: "image", options: { accept: "image/svg+xml,image/png,image/webp" } }
      ], preview: { select: { title: "name", media: "logo" } } }]
    },
  ],
  preview: {
    select: { title: "title", num: "num", visible: "visible" },
    prepare({ title, num, visible }) {
      return { title, subtitle: `${num ? num + " · " : ""}${visible === false ? "🔴 Hidden" : "✅ Visible"}` };
    }
  }
};
