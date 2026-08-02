// Makes the header's static top-level items and Company's dropdown, plus the
// footer's Company/Resources columns, editable from the Studio. The Capabilities
// and Products dropdowns stay auto-generated from those documents (reordering a
// capability or category already reorders its menu) — duplicating that content
// here would just be a second place to keep in sync, so it isn't included.
// Similarly "For Buyers/Factories/Creatives" stays sourced from Audience pages.
const navChild = {
  name: "navChild", title: "Submenu item", type: "object",
  fields: [
    { name: "label", title: "Label", type: "string", validation: (r) => r.required() },
    { name: "href", title: "Link", type: "string", validation: (r) => r.required() },
  ],
  preview: { select: { title: "label", subtitle: "href" } },
};

const navTopItem = {
  name: "navTopItem", title: "Menu item", type: "object",
  fields: [
    { name: "label", title: "Label", type: "string", validation: (r) => r.required() },
    { name: "href", title: "Link", type: "string", validation: (r) => r.required() },
    { name: "autoMenu", title: "Dropdown source", type: "string",
      description: "Capabilities and Products build their dropdown from those documents automatically, in the order set on their own list. Choose \"None\" to add manual submenu items instead.",
      options: { list: [
        { title: "None", value: "none" },
        { title: "Capabilities (auto)", value: "capabilities" },
        { title: "Products (auto)", value: "products" },
      ], layout: "radio" },
      initialValue: "none" },
    { name: "children", title: "Submenu items", type: "array", of: [{ type: "navChild" }],
      hidden: ({ parent }) => parent?.autoMenu && parent.autoMenu !== "none",
      description: "Only used when Dropdown source is \"None\"." },
  ],
  preview: { select: { title: "label", subtitle: "href" },
    prepare({ title, subtitle }) { return { title, subtitle }; } },
};

const footerLink = {
  name: "footerLink", title: "Footer link", type: "object",
  fields: [
    { name: "label", title: "Label", type: "string", validation: (r) => r.required() },
    { name: "href", title: "Link", type: "string", validation: (r) => r.required() },
  ],
  preview: { select: { title: "label", subtitle: "href" } },
};

const footerColumn = {
  name: "footerColumn", title: "Footer column", type: "object",
  fields: [
    { name: "title", title: "Column title", type: "string", validation: (r) => r.required() },
    { name: "links", title: "Links", type: "array", of: [{ type: "footerLink" }] },
  ],
  preview: { select: { title: "title", count: "links.length" },
    prepare({ title, count }) { return { title, subtitle: `${count || 0} link(s)` }; } },
};

const navigation = {
  name: "navigation", title: "Navigation & Footer", type: "document",
  fields: [
    { name: "mainNav", title: "Header — top-level menu", type: "array", of: [{ type: "navTopItem" }],
      description: "Order here is the order shown in the header and the mobile menu." },
    { name: "footerColumns", title: "Footer — columns", type: "array", of: [{ type: "footerColumn" }],
      description: "The \"For\" and \"Capabilities\" columns stay auto-generated from Audience pages and Capabilities; add other columns here (e.g. Company, Resources)." },
  ],
};

export { navChild, navTopItem, footerLink, footerColumn, navigation };
