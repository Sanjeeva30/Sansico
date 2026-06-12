export default {
  name: "newsPost", title: "News & Press", type: "document",
  fields: [
    { name: "title", title: "Headline", type: "string" },
    { name: "slug", type: "slug", options: { source: "title" } },
    {
      name: "postType", title: "Type", type: "string",
      options: { list: [
        { title: "Article (written on this site)", value: "article" },
        { title: "Press mention (links to external article)", value: "press" },
        { title: "Social post (links to social media)", value: "social" }
      ], layout: "radio" },
      initialValue: "article"
    },
    { name: "publishedAt", title: "Published date", type: "datetime" },
    { name: "coverImage", title: "Cover image", type: "image", options: { hotspot: true } },
    { name: "excerpt", title: "Excerpt / teaser", type: "text", rows: 3 },
    {
      name: "body", title: "Body (for articles)",
      type: "array",
      of: [
        { type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Quote", value: "blockquote" }
          ],
          marks: { decorators: [
            { title: "Bold", value: "strong" },
            { title: "Italic", value: "em" }
          ]}
        },
        { type: "image", options: { hotspot: true }, fields: [{ name: "caption", type: "string" }] }
      ],
      hidden: ({ document }) => document?.postType !== "article"
    },
    {
      name: "externalUrl", title: "External URL",
      type: "url",
      description: "Required for Press and Social types. Card will link here instead of an internal page.",
      hidden: ({ document }) => document?.postType === "article"
    },
    {
      name: "sourceLabel", title: "Source label",
      type: "string",
      description: "e.g. Reuters, The Jakarta Post, LinkedIn, Instagram",
      hidden: ({ document }) => document?.postType === "article"
    },
    { name: "author", title: "Author", type: "reference", to: [{ type: "person" }] },
    { name: "visible", title: "Published / visible", type: "boolean", initialValue: true }
  ],
  orderings: [{ title: "Date (newest first)", name: "dateDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", subtitle: "postType", media: "coverImage" },
    prepare({ title, subtitle, media }) {
      const icons = { article: "📝", press: "📰", social: "📱" };
      return { title, subtitle: `${icons[subtitle] || ""} ${subtitle || ""}`, media };
    }
  }
};
