import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { schemaTypes } from "./schemas";

const structure = (S, context) =>
  S.list()
    .title("Sansico Studio")
    .items([
      S.listItem().title("🎨  Appearance")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Appearance & Brand")),
      S.listItem().title("📄  Pages")
        .child(S.documentTypeList("pageSettings").title("Pages")),
      S.divider(),
      S.listItem().title("🏠  Home Page")
        .child(S.document().schemaType("homePage").documentId("homePage").title("Home Page")),
      orderableDocumentListDeskItem({ type: "capability",      title: "Capabilities",      S, context }),
      orderableDocumentListDeskItem({ type: "market",          title: "Markets",            S, context }),
      S.listItem().title("📦  Products")
        .child(S.list().title("Products").items([
          orderableDocumentListDeskItem({ type: "productCategory", title: "Categories", S, context }),
          orderableDocumentListDeskItem({ type: "productItem",     title: "Products",   S, context }),
        ])),
      orderableDocumentListDeskItem({ type: "caseStudy",       title: "Case Studies",       S, context }),
      orderableDocumentListDeskItem({ type: "certification",   title: "Certifications",     S, context }),
      orderableDocumentListDeskItem({ type: "facility",        title: "Facilities",         S, context }),
      S.divider(),
      S.listItem().title("🌏  Why Indonesia, Why Now")
        .child(S.document().schemaType("whyIndonesia").documentId("whyIndonesia").title("Why Indonesia, Why Now")),
      S.listItem().title("🏢  Company Page")
        .child(S.document().schemaType("companyPage").documentId("companyPage").title("Company Page")),
      S.listItem().title("Careers Page")
        .child(S.document().schemaType("careersPage").documentId("careersPage").title("Careers Page")),
      S.divider(),
      orderableDocumentListDeskItem({ type: "person",          title: "Team",               S, context }),
      orderableDocumentListDeskItem({ type: "newsPost",        title: "News & Press",       S, context }),
    ]);

export default defineConfig({
  name: "sansico",
  title: "Sansico Group",
  projectId: "rvghw4zu",
  dataset: "production",
  plugins: [structureTool({ structure })],
  schema: { types: schemaTypes },
});
