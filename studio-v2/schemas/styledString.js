import { ColourPicker } from "../components/ColourPicker";

export default {
  name: "styledString",
  title: "Text",
  type: "object",
  fields: [
    { name: "text", title: "Text", type: "string" },
    {
      name: "sizePx", title: "Font size (px)", type: "number",
      description: "Leave blank to use this element's normal design size.",
      validation: (R) => R.min(8).max(160),
    },
    {
      name: "color", title: "Color", type: "string",
      components: { input: ColourPicker },
      description: "Leave blank to use this element's normal design color.",
    },
    {
      name: "weight", title: "Font weight", type: "number",
      description: "Leave blank to use this element's normal design weight.",
      options: { list: [
        { title: "Light (300)", value: 300 }, { title: "Regular (400)", value: 400 },
        { title: "Medium (500)", value: 500 }, { title: "Semibold (600)", value: 600 },
        { title: "Bold (700)", value: 700 }, { title: "Extra bold (800)", value: 800 },
      ]},
    },
    { name: "italic", title: "Italic", type: "boolean", initialValue: false },
  ],
  preview: { select: { title: "text" } },
};
