import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";
import { ColourPicker } from "../components/ColourPicker";

export default {
  name: "capability", title: "Capabilities", type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "capability" }),
    { name: "visible", title: "Visible on site", type: "boolean", initialValue: true },
    { name: "title",   type: "styledString", validation: R => R.required() },
    { name: "slug",    type: "slug", options: { source: (doc) => doc.title?.text || doc.title || "", validation: R => R.required() } },
    { name: "num",     title: "Eyebrow (DESIGN / MAKE / DELIVER)", type: "styledString", validation: R => R.required() },
    { name: "summary", title: "One-line summary", type: "styledText" },
    { name: "colorTheme", title: "Colour theme", type: "string", components: { input: ColourPicker } },
    { name: "body",    title: "Body (plain text)", type: "styledText" },
    { name: "richBody", title: "Rich body (overrides plain)", type: "array",
      of: [{ type: "block",
        styles: [{ title:"Normal",value:"normal" },{ title:"Heading 2",value:"h2" },{ title:"Heading 3",value:"h3" },{ title:"Quote",value:"blockquote" }],
        marks: {
          decorators: [{ title:"Bold",value:"strong" },{ title:"Italic",value:"em" }],
          annotations: [
            { name:"colour", type:"object", title:"Text colour", fields: [
              { name:"hex", type:"string", title:"Brand colour", options: { list:[
                { title:"Crimson",value:"#7A0D20" },{ title:"Navy",value:"#22409E" },
                { title:"Green",value:"#0D4F31" },{ title:"Red",value:"#F3263E" },
                { title:"Citrus",value:"#BDDA5F" }
              ]}},
              { name:"customHex", title:"Custom hex", type:"string" }
            ]},
            { name:"link", type:"object", title:"Link", fields:[{ name:"href",type:"string" }] }
          ]
        }
      }]
    },
    { name: "points",  title: "Bullet points", type: "array", of: [{ type: "styledString" }] },
    { name: "image",   title: "Primary image", type: "image",
      description: "1600×1000px or wider, landscape recommended." },
    { name: "gallery", title: "Image gallery", type: "array",
      of: [{ type: "image", options: { hotspot: true },
        description: "1200×800px, landscape recommended.",
        fields: [{ name: "caption", title: "Caption", type: "string" }] }]
    },
    { name: "subServices", title: "Sub-services", type: "array",
      of: [{ type: "object", fields: [
        { name: "title", type: "styledString" }, { name: "description", type: "styledText" }
      ], preview: { select: { title: "title.text" } } }]
    },
    { name: "proofPoints", title: "Proof points / stats", type: "array",
      of: [{ type: "object", fields: [
        { name: "value", title: "Stat (e.g. 40+)", type: "styledString" },
        { name: "label", type: "styledString" }
      ], preview: { select: { title: "value.text", subtitle: "label.text" } } }]
    },
    { name: "customerLogos", title: "Customer logos", type: "array",
      of: [{ type: "object", fields: [
        { name: "name", type: "styledString" },
        { name: "logo", type: "image", description: "Wide transparent logo, roughly 400×160px works best.",
          options: { accept: "image/svg+xml,image/png,image/webp" } }
      ], preview: { select: { title: "name.text", media: "logo" } } }]
    },
  ],
  preview: {
    select: { title: "title.text", num: "num.text", visible: "visible" },
    prepare({ title, num, visible }) {
      return { title, subtitle: `${num ? num + " · " : ""}${visible === false ? "🔴 Hidden" : "✅ Visible"}` };
    }
  }
};
