const PAGES = [
  { id: "home",           label: "Home" },
  { id: "capabilities",  label: "Capabilities" },
  { id: "markets",       label: "Markets" },
  { id: "products",      label: "Products" },
  { id: "work",          label: "Work / Case Studies" },
  { id: "sustainability",label: "Sustainability" },
  { id: "company",       label: "Company" },
  { id: "careers",       label: "Careers" },
  { id: "contact",       label: "Contact" },
  { id: "team",          label: "Team" },
  { id: "news",          label: "News & Press" },
];

export default {
  name: "pageSettings", title: "Pages", type: "document",
  fields: [
    {
      name: "pageId", title: "Page", type: "string", readOnly: true,
      options: { list: PAGES.map(p => ({ title: p.label, value: p.id })) }
    },
    { name: "label", title: "Page name", type: "string", readOnly: true },
    {
      name: "visible", title: "Visible", type: "boolean",
      initialValue: true,
      description: "Off = nav link disappears and page returns 404"
    },
    { name: "navLabel", title: "Nav label override (leave blank to use page name)", type: "string" },
    {
      name: "heroType", title: "Hero background", type: "string",
      options: { list: ["ink", "image", "video"], layout: "radio" },
      initialValue: "ink",
      description: "Ink = the default animated band pattern. Image or video sit behind the page title."
    },
    {
      name: "heroImage", title: "Hero image", type: "image",
      hidden: ({ document: d }) => d?.heroType !== "image",
      description: "1920×1080px or wider, landscape. Full-width background image behind the page title."
    },
    {
      name: "heroVideo", title: "Hero video URL", type: "url",
      hidden: ({ document: d }) => d?.heroType !== "video",
      description: "Direct .mp4 URL, 1920×1080px (16:9) recommended. Keep the file size reasonable — it autoplays on page load."
    },
    {
      name: "heroPoster", title: "Hero video poster (shown while video loads)", type: "image",
      hidden: ({ document: d }) => d?.heroType !== "video",
      description: "Same size as the video, 1920×1080px or wider landscape — shown as a static frame before playback starts."
    },
    { name: "seoTitle", title: "SEO title", type: "string", description: "Overrides the default. Keep under 60 characters." },
    { name: "seoDescription", title: "SEO description", type: "text", rows: 3, description: "Overrides the default. Keep under 155 characters." },
    { name: "seoImage", title: "Social share image (OG image)", type: "image", description: "1200×630px recommended. Overrides the default." },
    { name: "pageTitle", title: "Page hero heading", type: "styledString",
      description: "The big heading shown at the top of this page." },
    { name: "pageIntro", title: "Page hero intro", type: "styledText",
      description: "The short paragraph shown under the heading." },
  ],
  preview: {
    select: { title: "label", visible: "visible" },
    prepare({ title, visible }) {
      return { title, subtitle: visible ? "✅ Visible" : "🔴 Hidden" };
    }
  }
};
