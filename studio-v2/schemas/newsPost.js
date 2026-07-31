import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default {
  name: "newsPost", title: "News & Press", type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "newsPost" }),
    { name: "visible",   title: "Published / visible", type: "boolean", initialValue: true },
    { name: "title",     title: "Headline",   type: "styledString", validation: R => R.required() },
    { name: "slug",      type: "slug", options: { source: (doc) => doc.title?.text || doc.title || "", validation: R => R.required() } },
    { name: "postType",  title: "Type", type: "string",
      options: { list: [
        { title: "📝 Article (written on this site)", value: "article", validation: R => R.required() },
        { title: "📰 Press mention (external article)", value: "press" },
        { title: "📱 Social post (external link)", value: "social" }
      ], layout: "radio" }, initialValue: "article"
    },
    { name: "publishedAt", title: "Published date", type: "datetime" },
    { name: "coverImage",  title: "Cover image", type: "image", options: { hotspot: true },
      description: "1200×675px (16:9) recommended." },
    { name: "excerpt",     title: "Excerpt / teaser", type: "styledText" },
    { name: "body", title: "Body (for articles)", type: "array",
      of: [{ type: "block",
        styles: [{ title:"Normal",value:"normal" },{ title:"Heading 2",value:"h2" },{ title:"Heading 3",value:"h3" },{ title:"Quote",value:"blockquote" }],
        marks: { decorators: [{ title:"Bold",value:"strong" },{ title:"Italic",value:"em" }] }
      },
      { type: "image", options: { hotspot: true }, description: "1200×800px, landscape recommended.",
        fields: [{ name: "caption", type: "string" }] }],
      hidden: ({ document: d }) => d?.postType !== "article"
    },
    { name: "externalUrl", title: "External URL", type: "url",
      description: "Required for Press and Social types.",
      hidden: ({ document: d }) => d?.postType === "article"
    },
    { name: "sourceLabel", title: "Source (e.g. Reuters, LinkedIn)", type: "styledString",
      hidden: ({ document: d }) => d?.postType === "article"
    },
    { name: "author", title: "Author", type: "reference", to: [{ type: "person" }] },
  ],
  preview: {
    select: { title: "title.text", subtitle: "postType", media: "coverImage", visible: "visible" },
    prepare({ title, subtitle, media, visible }) {
      const icons = { article:"📝", press:"📰", social:"📱" };
      return { title, subtitle: `${icons[subtitle]||""} ${subtitle||""} ${visible===false?"· 🔴 Hidden":""}`, media };
    }
  }
};
