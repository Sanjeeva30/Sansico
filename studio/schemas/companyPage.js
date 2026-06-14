import { orderRankField } from "@sanity/orderable-document-list";

export default {
  name: "companyPage", title: "Company Page", type: "document",
  fields: [
    { name: "title",  title: "Page title",  type: "string",
      initialValue: "An Indonesian group built for the world's shelves" },
    { name: "intro",  title: "Intro paragraph", type: "text" },
    { name: "mission", title: "Mission statement", type: "string" },
    { name: "vision", title: "Vision statement", type: "text",
      description: "Shown in the Vision card" },
    { name: "culture",title: "Culture statement", type: "text",
      description: "Shown in the Culture card" },
    { name: "overviewTitle", title: "Overview heading", type: "string" },
    { name: "overviewBody", title: "Overview body (rich text)", type: "array",
      of: [{ type: "block",
        styles: [{ title:"Normal",value:"normal" },{ title:"Heading 3",value:"h3" }],
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
    { name: "timeline", title: "Company timeline", type: "array",
      of: [{ type: "object", fields: [
        { name: "year",        title: "Year",        type: "string", validation: R => R.required() },
        { name: "event",       title: "Event title", type: "string", validation: R => R.required() },
        { name: "description", title: "Description", type: "text" }
      ], preview: { select: { title: "year", subtitle: "event" } } }]
    },
    { name: "values", title: "Our values", type: "array",
      of: [{ type: "object", fields: [
        { name: "title", type: "string", validation: R => R.required() },
        { name: "body",  type: "text" }
      ], preview: { select: { title: "title" } } }]
    },
  ]
};
