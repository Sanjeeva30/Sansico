// The v2 section-block library. Every page is an ordered array of these, so an
// editor can reorder, hide or duplicate any band of any page from Studio.
import { block, colourField } from "./primitives";

const C = colourField;

const S = (name, title, opts = {}) => ({ name, title, type: "styledString", ...opts });
const T = (name, title, opts = {}) => ({ name, title, type: "styledText", ...opts });
const IMG = (name = "image", title = "Image", description) => ({ name, title, type: "richImage", description });
const LINK = (name = "cta", title = "Button") => ({ name, title, type: "linkField" });
const HEAD = { name: "head", title: "Section heading", type: "sectionHead" };

/* ─────────── hero / opening bands ─────────── */

// The full-height hero used on the live site: animated press bands (or a
// video/image), eyebrow, big serif headline, sub-line and two buttons.
export const siteHeroBlock = block({
  name: "siteHeroBlock",
  title: "Hero — full screen (live site style)",
  fields: [
    S("eyebrow", "Eyebrow"),
    S("heading", "Headline", { description: 'Wrap a word in pipes to italicise it, e.g. "Joy, |Sustainably,| Packaged".' }),
    T("sub", "Sub-line"),
    {
      name: "heroType", title: "Background", type: "string", initialValue: "ink",
      options: { list: [
        { title: "Ink — animated press bands", value: "ink" },
        { title: "Image", value: "image" },
        { title: "Video", value: "video" },
      ], layout: "radio" },
      description: "Ink is the signature rotating colour-band background.",
    },
    IMG("image", "Background image", "Full-screen background when Background is set to Image. 1920×1080px or wider, landscape."),
    { name: "videoUrl", title: "Background video URL (.mp4)", type: "url" },
    IMG("poster", "Video poster", "Shown before the video starts playing, and if it fails to load. Same size as the video, 1920×1080px or wider."),
    LINK("cta", "Primary button"),
    LINK("secondaryCta", "Secondary button"),
    C("scrimColor", "Overlay tint", "Darkens the background so the headline stays readable."),
  ],
});

export const heroVideoBlock = block({
  name: "heroVideoBlock",
  title: "Hero video band",
  fields: [
    {
      name: "videoUrl", title: "Video URL (.mp4)", type: "url",
      description: "Direct .mp4 link. Leave blank to fall back to the animated press bands.",
    },
    IMG("poster", "Poster / fallback image", "Shown while no video is set, or before it loads. 2400×1000px (21:9) or wider, to match the band's aspect ratio."),
    S("caption", "Caption overlay"),
    { name: "ratio", title: "Aspect ratio", type: "string", initialValue: "21/9",
      options: { list: ["21/9", "16/9", "3/1"] } },
  ],
});

export const pageHeroBlock = block({
  name: "pageHeroBlock",
  title: "Page hero (dark)",
  fields: [S("kicker", "Kicker"), S("heading", "Heading"), T("intro", "Intro"),
    IMG("background", "Background image", "Full-bleed behind the dark page hero. 1920×1080px or wider, landscape — a dark overlay is applied automatically so the heading stays readable."), LINK(),
    C("scrimColor", "Overlay tint")],
});

export const statementBlock = block({
  name: "statementBlock",
  title: "Statement (colour strip + headline + lede)",
  fields: [
    { name: "showStrip", title: "Show colour strip", type: "boolean", initialValue: true },
    { name: "align", title: "Alignment", type: "string", initialValue: "left",
      options: { list: ["left", "center"], layout: "radio" } },
    // A page must have exactly one H1. This block is used both as a page's main
    // heading (the audience pages) and as a sub-heading under a hero (home,
    // capabilities), so the level is explicit and defaults to the safe H2.
    { name: "headingLevel", title: "Heading level", type: "string", initialValue: "h2",
      description: "Use H1 only when this is the page's main heading and there is no hero above it.",
      options: { list: [
        { title: "H1 — the page's main heading", value: "h1" },
        { title: "H2 — a section heading", value: "h2" },
      ], layout: "radio" } },
    S("kicker", "Kicker"),
    S("heading", "Headline"),
    T("body", "Lede paragraph"),
    LINK(),
    S("note", "Small note under the button"),
  ],
});

// Renders the deep Why Indonesia research document (executive position, ASEAN
// context, Java geography, priority sectors, ESG, trade architecture, fibre
// advantage, conclusion and sources) beneath the wireframe's summary sections.
export const whyIndonesiaDetailBlock = block({
  name: "whyIndonesiaDetailBlock",
  title: "Why Indonesia — full research sections",
  fields: [
    { name: "showSources", title: "Show the sources list", type: "boolean", initialValue: true },
  ],
});

/* ─────────── stats / proof ─────────── */

export const statsBlock = block({
  name: "statsBlock",
  title: "Stat tiles",
  fields: [
    {
      name: "stats", title: "Stats", type: "array",
      of: [{
        type: "object",
        fields: [
          S("value", "Value"), S("label", "Label"),
          C("bgColor", "Tile background"),
          C("textColor", "Tile text colour"),
        ],
        preview: { select: { title: "value.text", subtitle: "label.text" } },
      }],
    },
  ],
});

export const customerStoriesBlock = block({
  name: "customerStoriesBlock",
  title: "Customer stories (tabbed quotes)",
  fields: [
    HEAD,
    {
      name: "stories", title: "Customers", type: "array",
      of: [{ type: "reference", to: [{ type: "customerStory" }] }],
    },
    LINK("link", "Link under the quote"),
  ],
});

export const logoWallBlock = block({
  name: "logoWallBlock",
  title: "Customer logo wall",
  fields: [
    HEAD,
    {
      name: "logos", title: "Logos", type: "array",
      of: [{
        type: "object",
        fields: [S("name", "Name"), IMG("logo", "Logo", "Transparent PNG/SVG, roughly 400×140px — shown small and grayscale in the logo wall.")],
        preview: { select: { title: "name.text", media: "logo.image" } },
      }],
    },
  ],
});

/* ─────────── cards & grids ─────────── */

export const capabilityCardsBlock = block({
  name: "capabilityCardsBlock",
  title: "Capability cards (3 dark cards)",
  fields: [
    HEAD,
    // Turns the section's kicker into a link (the homepage's "What we do ↗").
    // The renderer already honoured this; it was missing from the schema, so
    // the value existed in the data but was invisible and uneditable in Studio.
    LINK("cta", "Make the kicker a link"),
    {
      name: "cards", title: "Cards", type: "array",
      of: [{
        type: "object",
        fields: [
          S("tag", "Tag"), S("title", "Title"), T("desc", "Description"),
          LINK(), IMG("image", "Card image", "Sits behind the card at low opacity as a textured backdrop. 1000×1000px square works best; will be cropped to fill the card."),
          C("bgColor", "Card background", "Replaces the generative art panel with a flat colour."),
          C("textColor", "Card text colour"),
        ],
        preview: { select: { title: "title.text", subtitle: "tag.text" } },
      }],
    },
  ],
});

export const tileGridBlock = block({
  name: "tileGridBlock",
  title: "Image tile grid",
  fields: [
    HEAD,
    { name: "columns", title: "Columns", type: "number", initialValue: 3, options: { list: [2, 3, 4, 5] } },
    {
      name: "tiles", title: "Tiles", type: "array",
      of: [{
        type: "object",
        fields: [S("label", "Label"), IMG("image", "Image", "Shown at a 4:3 ratio. 1200×900px recommended."), LINK(),
          C("bgColor", "Label background"), C("textColor", "Label text colour")],
        preview: { select: { title: "label.text", media: "image.image" } },
      }],
    },
  ],
});

export const iconCardsBlock = block({
  name: "iconCardsBlock",
  title: "Icon cards (reasons / values / topics)",
  fields: [
    HEAD,
    { name: "columns", title: "Columns", type: "number", initialValue: 3, options: { list: [2, 3, 4] } },
    { name: "align", title: "Alignment", type: "string", initialValue: "center", options: { list: ["center", "left"] } },
    {
      name: "cards", title: "Cards", type: "array",
      of: [{
        type: "object",
        fields: [S("title", "Title"), T("desc", "Description"),
          IMG("icon", "Icon or image", "Square icon or small photo. 400×400px recommended."), S("meta", "Meta line"),
          C("bgColor", "Card background"), C("textColor", "Card text colour"), C("borderColor", "Card border colour")],
        preview: { select: { title: "title.text", subtitle: "desc.text", media: "icon.image" } },
      }],
    },
  ],
});

export const journeyBlock = block({
  name: "journeyBlock",
  title: "Journey steps",
  fields: [
    HEAD,
    {
      name: "steps", title: "Steps", type: "array",
      of: [{
        type: "object",
        fields: [S("n", "Step number"), S("title", "Title"), S("time", "Duration"),
          C("bgColor", "Step background"), C("textColor", "Step text colour")],
        preview: { select: { title: "title.text", subtitle: "time.text" } },
      }],
    },
  ],
});

/* ─────────── split / editorial ─────────── */

export const splitFeatureBlock = block({
  name: "splitFeatureBlock",
  title: "Split feature (image + text)",
  fields: [
    { name: "imageSide", title: "Image side", type: "string", initialValue: "left", options: { list: ["left", "right"] } },
    IMG("image", "Image", "Shown at a 4:3 ratio next to the text. 1200×900px recommended."),
    S("kicker", "Kicker"), S("heading", "Heading"), T("body", "Body"), S("meta", "Meta line"), LINK(),
  ],
});

export const richTextBlock = block({
  name: "richTextBlock",
  title: "Rich text",
  fields: [HEAD, { name: "body", title: "Body", type: "array", of: [{ type: "block" }] }],
});

export const imageBlock = block({
  name: "imageBlock",
  title: "Full-width image",
  fields: [
    IMG("image", "Image", "Full-width image — upload at least 1800px wide and match the aspect ratio chosen below (21:9, 16:9, 16:7 or 4:3) so it isn't awkwardly cropped."),
    { name: "ratio", title: "Aspect ratio", type: "string", initialValue: "16/9", options: { list: ["21/9", "16/9", "16/7", "4/3"] } },
  ],
});

export const ctaBannerBlock = block({
  name: "ctaBannerBlock",
  title: "CTA banner",
  fields: [S("heading", "Heading"), T("body", "Body"), LINK(),
    C("accentColor", "Accent colour", "Colours the italic word inside |pipes| in the heading.")],
});

export const faqBlock = block({
  name: "faqBlock",
  title: "FAQs",
  fields: [
    HEAD,
    {
      name: "faqs", title: "Questions", type: "array",
      of: [{
        type: "object",
        fields: [S("q", "Question"), T("a", "Answer")],
        preview: { select: { title: "q.text" } },
      }],
    },
  ],
});

/* ─────────── company ─────────── */

export const missionCardsBlock = block({
  name: "missionCardsBlock",
  title: "Mission / vision / culture cards",
  fields: [
    HEAD,
    {
      name: "items", title: "Cards", type: "array",
      of: [{
        type: "object",
        fields: [S("title", "Title"), T("desc", "Body"),
          C("bgColor", "Card background"), C("textColor", "Card text colour")],
        preview: { select: { title: "title.text", subtitle: "desc.text" } },
      }],
    },
  ],
});

export const presenceMapBlock = block({
  name: "presenceMapBlock",
  title: "Presence map",
  fields: [
    HEAD, IMG("map", "Map image", "Wide map graphic or illustration, shown at a 16:7 ratio. 1800×790px recommended."),
    {
      name: "pins", title: "Pins", type: "array",
      of: [{
        type: "object",
        fields: [S("label", "Label"),
          { name: "x", title: "X %", type: "number" }, { name: "y", title: "Y %", type: "number" }],
        preview: { select: { title: "label.text" } },
      }],
    },
  ],
});

export const timelineBlock = block({
  name: "timelineBlock",
  title: "Timeline (horizontal scroll)",
  fields: [
    HEAD,
    { name: "milestones", title: "Milestones", type: "array", of: [{ type: "reference", to: [{ type: "milestone" }] }] },
    { name: "autoScroll", title: "Auto-scroll the timeline", type: "boolean", initialValue: true,
      description: "Drifts the milestones sideways on their own. Pauses on hover, on focus and while the reader scrolls." },
    { name: "autoScrollSpeed", title: "Auto-scroll speed (px per second)", type: "number", initialValue: 28,
      hidden: ({ parent }) => parent?.autoScroll === false,
      validation: (R) => R.min(4).max(200) },
  ],
});

export const facilitiesBlock = block({
  name: "facilitiesBlock",
  title: "Facilities",
  fields: [
    HEAD,
    {
      name: "groups", title: "Groups", type: "array",
      of: [{
        type: "object",
        fields: [
          S("label", "Group label"),
          { name: "facilities", title: "Facilities", type: "array", of: [{ type: "reference", to: [{ type: "facility" }] }] },
        ],
        preview: { select: { title: "label.text" } },
      }],
    },
    LINK("link", "Link"),
  ],
});

export const officesBlock = block({
  name: "officesBlock",
  title: "Offices (map + address cards)",
  fields: [
    HEAD, IMG("map", "Map image", "Shown at a 4:3 ratio next to the office address cards. 1200×900px recommended."),
    {
      name: "offices", title: "Offices", type: "array",
      of: [{
        type: "object",
        fields: [S("label", "Label"), S("name", "Name"), T("address", "Address"), LINK("mapLink", "Map link")],
        preview: { select: { title: "name.text", subtitle: "label.text" } },
      }],
    },
  ],
});

/* ─────────── sustainability ─────────── */

export const certificationMatrixBlock = block({
  name: "certificationMatrixBlock",
  title: "Certification matrix",
  fields: [
    HEAD,
    { name: "certGroups", title: "Groups", type: "array", of: [{ type: "reference", to: [{ type: "certificationGroup" }] }] },
  ],
});

/* ─────────── why indonesia ─────────── */

export const scorecardBlock = block({
  name: "scorecardBlock",
  title: "Sourcing scorecard table",
  fields: [
    HEAD, S("subtitle", "Italic subtitle"),
    { name: "scorecard", title: "Scorecard", type: "reference", to: [{ type: "sourcingScorecard" }] },
  ],
});

/* ─────────── products / careers / blog listings ─────────── */

export const productShowcaseBlock = block({
  name: "productShowcaseBlock",
  title: "Product category showcase",
  fields: [
    HEAD,
    { name: "categories", title: "Categories (blank = all, in Studio order)", type: "array",
      of: [{ type: "reference", to: [{ type: "productCategory" }] }] },
  ],
});

export const openRolesBlock = block({
  name: "openRolesBlock",
  title: "Open roles table",
  fields: [
    HEAD,
    { name: "roles", title: "Roles (blank = all visible roles)", type: "array", of: [{ type: "reference", to: [{ type: "jobRole" }] }] },
  ],
});

export const blogGridBlock = block({
  name: "blogGridBlock",
  title: "Blog post grid",
  fields: [
    HEAD,
    { name: "limit", title: "How many posts", type: "number", initialValue: 6 },
    { name: "posts", title: "Posts (blank = latest)", type: "array", of: [{ type: "reference", to: [{ type: "blogPost" }] }] },
  ],
});

export const contactFormBlock = block({
  name: "contactFormBlock",
  title: "Contact form",
  fields: [
    S("heading", "Heading"), T("intro", "Intro"),
    S("submitLabel", "Submit button label"),
    S("successHeading", "Success heading"), T("successBody", "Success message"),
    {
      name: "fields", title: "Form fields", type: "array",
      of: [{
        type: "object",
        fields: [
          S("label", "Label"), S("placeholder", "Placeholder"),
          { name: "name", title: "Field name", type: "string" },
          { name: "type", title: "Type", type: "string", initialValue: "text",
            options: { list: ["text", "email", "select", "textarea"] } },
          { name: "required", title: "Required", type: "boolean", initialValue: false },
          { name: "options", title: "Select options", type: "array", of: [{ type: "string" }] },
        ],
        preview: { select: { title: "label.text", subtitle: "type" } },
      }],
    },
    {
      name: "asideTitle", title: "Sidebar title", type: "styledString",
    },
    {
      name: "aside", title: "Sidebar items", type: "array",
      of: [{
        type: "object",
        fields: [S("title", "Title"), T("body", "Body")],
        preview: { select: { title: "title.text", subtitle: "body.text" } },
      }],
    },
  ],
});

export const blocks = [
  siteHeroBlock, heroVideoBlock, whyIndonesiaDetailBlock, pageHeroBlock, statementBlock,
  statsBlock, customerStoriesBlock, logoWallBlock,
  capabilityCardsBlock, tileGridBlock, iconCardsBlock, journeyBlock,
  splitFeatureBlock, richTextBlock, imageBlock, ctaBannerBlock, faqBlock,
  missionCardsBlock, presenceMapBlock, timelineBlock, facilitiesBlock, officesBlock,
  certificationMatrixBlock, scorecardBlock,
  productShowcaseBlock, openRolesBlock, blogGridBlock, contactFormBlock,
];

// Convenience: every block name, for pages that should accept the full library.
export const allBlockTypes = blocks.map((b) => ({ type: b.name }));
