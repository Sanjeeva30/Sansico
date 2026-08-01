// New v2 document types. Existing types (facility, productCategory, capability,
// certification…) are extended in place in their own files.
import { allBlockTypes } from "./blocks";
import { colourField } from "./primitives";

const S = (name, title, opts = {}) => ({ name, title, type: "styledString", ...opts });
const T = (name, title, opts = {}) => ({ name, title, type: "styledText", ...opts });
const ORDER = { name: "orderRank", title: "Order", type: "string", hidden: true };

const SECTIONS = {
  name: "sections",
  title: "Page sections",
  type: "array",
  of: allBlockTypes,
  description: "Drag to reorder. Each section can be hidden without deleting it.",
};

const SEO = [
  { name: "seoTitle", title: "SEO title", type: "string" },
  { name: "seoDescription", title: "SEO description", type: "text", rows: 3 },
  { name: "seoImage", title: "Social share image", type: "image",
    description: "1200×630px recommended — shown when this page is shared on social media (Facebook, LinkedIn, X)." },
];

/* ── One flexible page document powers every v2 page ── */
export const v2Page = {
  name: "v2Page",
  title: "Page",
  type: "document",
  fields: [
    { name: "title", title: "Page name (internal)", type: "string", validation: (R) => R.required() },
    {
      name: "pageId", title: "Route", type: "string",
      description: "Which route this page renders. One page document per route.",
      options: {
        list: [
          "home", "capabilities", "products", "company", "sustainability",
          "why-indonesia", "careers", "blog", "contact",
          "buyers", "factories", "creatives",
        ],
      },
      validation: (R) => R.required(),
    },
    { name: "visible", title: "Visible", type: "boolean", initialValue: true },
    { name: "showCtaBanner", title: "Show the global CTA banner at the foot of this page", type: "boolean", initialValue: true },
    SECTIONS,
    ...SEO,
  ],
  preview: {
    select: { title: "title", subtitle: "pageId", visible: "visible" },
    prepare: ({ title, subtitle, visible }) => ({ title: `${visible === false ? "🔴 " : ""}${title}`, subtitle: `/${subtitle}` }),
  },
};

/* ── Audience pages (For Buyers / Factories / Creatives) ── */
export const audiencePage = {
  name: "audiencePage",
  title: "Audience page",
  type: "document",
  fields: [
    S("label", "Label (e.g. For Buyers)"),
    {
      name: "slug", title: "Slug", type: "slug",
      options: { source: "label.text" }, validation: (R) => R.required(),
    },
    { name: "visible", title: "Visible", type: "boolean", initialValue: true },
    ORDER,
    SECTIONS,
    ...SEO,
  ],
  preview: { select: { title: "label.text", subtitle: "slug.current" } },
};

/* ── Customer stories (the tabbed quotes on the homepage) ── */
export const customerStory = {
  name: "customerStory",
  title: "Customer story",
  type: "document",
  fields: [
    S("name", "Customer name"),
    S("location", "Location"),
    T("quote", "Quote"),
    { name: "image", title: "Photo", type: "richImage",
      description: "Customer or product photo shown beside their quote. 1200×900px (4:3) landscape works best." },
    { name: "logo", title: "Logo", type: "image",
      description: "Transparent PNG/SVG, roughly 300×120px — shown small and grayscale in the customer tab list." },
    { name: "link", title: "Link", type: "linkField" },
    { name: "visible", title: "Visible", type: "boolean", initialValue: true },
    ORDER,
  ],
  preview: { select: { title: "name.text", subtitle: "location.text", media: "logo" } },
};

/* ── Company timeline ── */
export const milestone = {
  name: "milestone",
  title: "Milestone",
  type: "document",
  fields: [
    S("year", "Year"),
    S("title", "Title"),
    T("copy", "Description"),
    { name: "image", title: "Image", type: "richImage",
      description: "Shown at a 4:3 ratio in the horizontal timeline. 800×600px or larger." },
    { name: "visible", title: "Visible", type: "boolean", initialValue: true },
    ORDER,
  ],
  preview: { select: { title: "year.text", subtitle: "title.text", media: "image.image" } },
};

/* ── Certification groups (the 2-column matrix) ── */
export const certificationGroup = {
  name: "certificationGroup",
  title: "Certification group",
  type: "document",
  fields: [
    S("title", "Group title"),
    S("sub", "Sub-label", { description: 'e.g. "(Customer Certifications)"' }),
    colourField("accentColor", "Group accent colour"),
    { name: "column", title: "Column", type: "number", initialValue: 1, options: { list: [1, 2] } },
    {
      name: "items", title: "Certifications", type: "array",
      of: [{
        type: "object",
        fields: [
          S("name", "Name"),
          { name: "logo", title: "Logo", type: "image",
            description: "Transparent PNG/SVG on a white or neutral background, roughly 300×150px — shown at a fixed small size in the certification grid." },
          { name: "certificate", title: "Certificate document", type: "file" },
          S("scope", "Scope"), S("entity", "Holding entity"),
        ],
        preview: { select: { title: "name.text", media: "logo" } },
      }],
    },
    { name: "visible", title: "Visible", type: "boolean", initialValue: true },
    ORDER,
  ],
  preview: {
    select: { title: "title.text", sub: "sub.text", col: "column" },
    prepare: ({ title, sub, col }) => ({ title: `${title || "Group"} ${sub || ""}`.trim(), subtitle: `Column ${col || 1}` }),
  },
};

/* ── ASEAN sourcing scorecard ── */
export const sourcingScorecard = {
  name: "sourcingScorecard",
  title: "Sourcing scorecard",
  type: "document",
  fields: [
    { name: "title", title: "Title (internal)", type: "string" },
    {
      name: "legend", title: "Legend", type: "array",
      of: [{
        type: "object",
        fields: [S("n", "Score"), S("label", "Meaning")],
        preview: { select: { title: "n.text", subtitle: "label.text" } },
      }],
    },
    { name: "columns", title: "Columns", type: "array", of: [{ type: "string" }] },
    {
      name: "rows", title: "Rows", type: "array",
      of: [{
        type: "object",
        fields: [
          S("country", "Country"),
          { name: "starred", title: "Highlight this row", type: "boolean", initialValue: false },
          colourField("highlightColor", "Highlight colour"),
          { name: "scores", title: "Scores", type: "array", of: [{ type: "number" }] },
          { name: "total", title: "Total", type: "number" },
        ],
        preview: { select: { title: "country.text", subtitle: "total" } },
      }],
    },
    S("footnoteTitle", "Footnote title"), T("footnote", "Footnote"),
    S("conclusionTitle", "Conclusion title"), T("conclusion", "Conclusion"),
  ],
  preview: { select: { title: "title" } },
};

/* ── Careers: a role with full detail page ── */
export const jobRole = {
  name: "jobRole",
  title: "Job role",
  type: "document",
  fields: [
    S("role", "Role title"),
    { name: "slug", title: "Slug", type: "slug", options: { source: "role.text" }, validation: (R) => R.required() },
    S("dept", "Department"), S("location", "Location"), S("type", "Employment type"),
    T("summary", "The role"),
    { name: "willDo", title: "You will", type: "array", of: [{ type: "styledString" }] },
    { name: "youAre", title: "You are", type: "array", of: [{ type: "styledString" }] },
    { name: "youHave", title: "You have", type: "array", of: [{ type: "styledString" }] },
    T("compensation", "Compensation"),
    T("aboutCompany", "About Sansico Group"),
    { name: "image", title: "Image", type: "richImage",
      description: "Shown at the top of this role's detail page. 1600×1000px (16:10) or wider, landscape." },
    { name: "visible", title: "Visible", type: "boolean", initialValue: true },
    ORDER,
    ...SEO,
  ],
  preview: { select: { title: "role.text", subtitle: "dept.text" } },
};

/* ── Blog ── */
export const blogPost = {
  name: "blogPost",
  title: "Blog post",
  type: "document",
  fields: [
    S("title", "Title"),
    { name: "slug", title: "Slug", type: "slug", options: { source: "title.text" }, validation: (R) => R.required() },
    S("tag", "Tag"), S("date", "Date label"), S("readTime", "Read time"),
    { name: "publishedAt", title: "Published at", type: "datetime" },
    { name: "cover", title: "Cover image", type: "richImage",
      description: "Featured image shown on the blog index and at the top of the article. 1600×900px (16:9) recommended." },
    T("excerpt", "Excerpt"),
    {
      name: "body", title: "Body", type: "array",
      of: [
        { type: "block" },
        { type: "richImage", title: "Image",
          description: "Shown full-width inside the article body. 1400×790px (16:9) recommended." },
        {
          type: "object", name: "pullQuote", title: "Pull quote",
          fields: [T("quote", "Quote")],
          preview: { select: { title: "quote.text" } },
        },
      ],
    },
    { name: "author", title: "Author", type: "reference", to: [{ type: "person" }] },
    { name: "visible", title: "Visible", type: "boolean", initialValue: true },
    ORDER,
    ...SEO,
  ],
  preview: { select: { title: "title.text", subtitle: "tag.text", media: "cover.image" } },
};

export const v2Documents = [
  v2Page, audiencePage, customerStory, milestone,
  certificationGroup, sourcingScorecard, jobRole, blogPost,
];
