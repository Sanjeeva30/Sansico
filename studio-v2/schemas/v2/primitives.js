// Shared building blocks used by every v2 section block.
import { ColourPicker } from "../../components/ColourPicker";

// Every single-colour field in the Studio goes through this, so the brand
// swatches + custom hex picker are identical everywhere. Leaving a colour blank
// always means "use the design default for this element".
export const colourField = (name, title, description) => ({
  name,
  title,
  type: "string",
  components: { input: ColourPicker },
  description: description || "Leave blank to use this element's normal design colour.",
});

// Image with alt text, caption and focal-point cropping — the wireframe's grey
// placeholders all become one of these.
export const richImage = {
  name: "richImage",
  title: "Image",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    { name: "image", title: "Image", type: "image", options: { hotspot: true } },
    {
      name: "alt", title: "Alt text", type: "string",
      description: "Describes the image for screen readers and search engines. Required if the image carries meaning.",
    },
    { name: "caption", title: "Caption", type: "styledString", description: "Optional caption shown under or over the image." },
  ],
  preview: {
    select: { media: "image", title: "alt", subtitle: "caption.text" },
    prepare: ({ media, title, subtitle }) => ({ media, title: title || "Image", subtitle }),
  },
};

// A link that can point at an internal route or an external URL.
export const linkField = {
  name: "linkField",
  title: "Link",
  type: "object",
  fields: [
    { name: "label", title: "Label", type: "styledString" },
    { name: "href", title: "URL or path", type: "string", description: "e.g. /contact or https://example.com" },
    { name: "newTab", title: "Open in new tab", type: "boolean", initialValue: false },
    colourField("bgColor", "Button background"),
    colourField("textColor", "Button text colour"),
  ],
  preview: {
    select: { title: "label.text", subtitle: "href" },
  },
};

// Reusable "kicker + heading" pairing that opens most sections in the wireframe.
export const sectionHead = {
  name: "sectionHead",
  title: "Section heading",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    { name: "kicker", title: "Kicker (small label above)", type: "styledString" },
    { name: "heading", title: "Heading", type: "styledString" },
    { name: "intro", title: "Intro paragraph", type: "styledText" },
  ],
  preview: { select: { title: "heading.text", subtitle: "kicker.text" } },
};

// Every section block spreads these in, so an editor can hide or re-theme any
// section without a developer.
export const blockCommonFields = [
  {
    name: "visible", title: "Show this section", type: "boolean", initialValue: true,
    description: "Turn off to hide this section from the page without deleting it.",
  },
  {
    name: "theme", title: "Background", type: "string", initialValue: "paper",
    options: {
      list: [
        { title: "Paper (white)", value: "paper" },
        { title: "Warm (off-white)", value: "warm" },
        { title: "Ink (dark)", value: "ink" },
        { title: "Crimson", value: "crimson" },
      ],
    },
  },
  {
    name: "anchorId", title: "Anchor ID", type: "string",
    description: "Optional. Lets other pages link straight to this section, e.g. #certifications.",
  },
  colourField("bgColor", "Section background colour", "Overrides the Background choice above."),
  colourField("textColor", "Section text colour", "Sets the default text colour for everything in this section."),
];

// Little helper so each block file stays readable.
export const block = ({ name, title, icon, fields, preview }) => ({
  name,
  title,
  type: "object",
  fields: [...blockCommonFields, ...fields],
  preview: preview || {
    select: { headText: "head.heading.text", ownHeading: "heading.text", visible: "visible" },
    prepare: ({ headText, ownHeading, visible }) => ({
      title: `${visible === false ? "🔴 " : ""}${title}`,
      subtitle: headText || ownHeading || (visible === false ? "Hidden" : ""),
    }),
  },
});

export const primitives = [richImage, linkField, sectionHead];
