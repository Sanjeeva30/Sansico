import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { colorInput } from "@sanity/color-input";
import { schemaTypes } from "./schemas";

// ── Custom sidebar structure ─────────────────────────────
const structure = (S) =>
  S.list()
    .title("Sansico Studio")
    .items([
      S.listItem()
        .title("🎨  Appearance")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Appearance & Brand Settings")
        ),
      S.listItem()
        .title("📄  Pages")
        .child(S.documentTypeList("pageSettings").title("Pages")),

      S.divider(),

      S.listItem()
        .title("🏠  Home Page")
        .child(
          S.document()
            .schemaType("homePage")
            .documentId("homePage")
            .title("Home Page")
        ),
      S.documentTypeListItem("capability").title("Capabilities"),
      S.documentTypeListItem("market").title("Markets"),
      S.listItem()
        .title("📦  Products")
        .child(
          S.list()
            .title("Products")
            .items([
              S.documentTypeListItem("productCategory").title("Categories"),
              S.documentTypeListItem("productItem").title("Products"),
            ])
        ),
      S.documentTypeListItem("caseStudy").title("Case Studies"),
      S.documentTypeListItem("certification").title("Certifications"),
      S.documentTypeListItem("facility").title("Facilities"),
      S.listItem()
        .title("Careers Page")
        .child(
          S.document()
            .schemaType("careersPage")
            .documentId("careersPage")
            .title("Careers Page")
        ),

      S.divider(),

      S.documentTypeListItem("person").title("Team"),
      S.documentTypeListItem("newsPost").title("News & Press"),
    ]);

// ── Brand colour palette ─────────────────────────────────
export const BRAND_COLOURS = [
  { label: "Crimson",   value: { hex: "#7A0D20" } },
  { label: "Navy",      value: { hex: "#22409E" } },
  { label: "Green",     value: { hex: "#0D4F31" } },
  { label: "Red",       value: { hex: "#F3263E" } },
  { label: "Citrus",    value: { hex: "#BDDA5F" } },
  { label: "Black",     value: { hex: "#1A1A1A" } },
  { label: "White",     value: { hex: "#FFFFFF" } },
  { label: "Off-white", value: { hex: "#F5F0E8" } },
];

export default defineConfig({
  name: "sansico",
  title: "Sansico Group",
  projectId: "rvghw4zu",
  dataset: "production",
  plugins: [
    structureTool({ structure }),
    colorInput(),
  ],
  schema: { types: schemaTypes },
});
