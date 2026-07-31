import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";
import { ColourPicker } from "../components/ColourPicker";

export default {
  name: "market", title: "Markets", type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "market" }),
    { name: "visible", title: "Visible on site", type: "boolean", initialValue: true },
    { name: "title", type: "styledString", validation: R => R.required() },
    { name: "slug",  type: "slug", options: { source: (doc) => doc.title?.text || doc.title || "" }, validation: R => R.required() },
    { name: "color", title: "Accent colour", type: "string", components: { input: ColourPicker } },
    { name: "tag",   title: "One-line tag (shown on index card)", type: "styledString" },

    // ── Page content ──────────────────────────────────────
    { name: "image", title: "Hero image (full-width)", type: "image", options: { hotspot: true },
      description: "1920×1080px or wider, landscape. Full-width background image." },
    { name: "body",  title: "Body (plain text, quick entry)", type: "styledText" },
    { name: "richBody", title: "Rich body (overrides plain when set)", type: "array",
      of: [{ type: "block",
        styles: [{ title:"Normal",value:"normal" },{ title:"Heading 2",value:"h2" },{ title:"Heading 3",value:"h3" },{ title:"Quote",value:"blockquote" }],
        marks: {
          decorators: [{ title:"Bold",value:"strong" },{ title:"Italic",value:"em" }],
          annotations: [
            { name:"colour", type:"object", title:"Text colour", fields: [
              { name:"hex", type:"string", options: { list:[
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
    { name: "proof", title: "Proof / quote line", type: "styledText" },

    // ── Market stats ──────────────────────────────────────
    { name: "marketStats", title: "Market stats", type: "array",
      description: "e.g. 40+ years serving this category",
      of: [{ type: "object", fields: [
        { name: "value", title: "Value (e.g. 40+)", type: "styledString" },
        { name: "label", title: "Label",            type: "styledString" }
      ], preview: { select: { title: "value.text", subtitle: "label.text" } } }]
    },

    // ── Linked content ────────────────────────────────────
    { name: "capabilityRefs", title: "Relevant capabilities", type: "array",
      description: "Which of Sansico's capabilities serve this market",
      of: [{ type: "reference", to: [{ type: "capability" }] }]
    },
    { name: "featuredWork", title: "Featured case study", type: "reference",
      to: [{ type: "caseStudy" }]
    },
    { name: "relatedProducts", title: "Related product categories", type: "array",
      of: [{ type: "reference", to: [{ type: "productCategory" }] }]
    },
  ],
  preview: {
    select: { title: "title.text", visible: "visible" },
    prepare({ title, visible }) {
      return { title, subtitle: visible === false ? "🔴 Hidden" : "✅ Visible" };
    }
  }
};
