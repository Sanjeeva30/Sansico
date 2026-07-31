// Custom colour annotation for Portable Text — adds brand colour picker to toolbar
import { definePlugin } from "sanity";

const BRAND_COLOURS = [
  { title: "Crimson", value: "#7A0D20" },
  { title: "Navy",    value: "#22409E" },
  { title: "Green",   value: "#0D4F31" },
  { title: "Red",     value: "#F3263E" },
  { title: "Citrus",  value: "#BDDA5F" },
];

// The colour mark schema — used in block type definitions
export const colourMark = {
  name: "colour",
  title: "Colour",
  type: "object",
  fields: [
    {
      name: "hex",
      title: "Colour",
      type: "string",
      options: {
        list: BRAND_COLOURS,
        layout: "radio",
      },
    },
  ],
};

// Block type with colour support — import this into schemas
export const richTextBlock = {
  type: "block",
  styles: [
    { title: "Normal",     value: "normal" },
    { title: "Heading 2",  value: "h2" },
    { title: "Heading 3",  value: "h3" },
    { title: "Quote",      value: "blockquote" },
  ],
  marks: {
    decorators: [
      { title: "Bold",   value: "strong" },
      { title: "Italic", value: "em" },
    ],
    annotations: [
      {
        name: "colour",
        type: "object",
        title: "Text colour",
        fields: [
          {
            name: "hex",
            type: "string",
            title: "Colour",
            options: {
              list: BRAND_COLOURS.map(c => ({ title: c.title, value: c.value })),
            },
          },
          {
            name: "customHex",
            title: "Custom hex (overrides above)",
            type: "string",
            placeholder: "#000000",
          },
        ],
      },
      {
        name: "link",
        type: "object",
        title: "Link",
        fields: [{ name: "href", type: "string", title: "URL" }],
      },
    ],
  },
};
