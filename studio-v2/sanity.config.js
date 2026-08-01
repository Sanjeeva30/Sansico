import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { schemaTypes } from "./schemas";
import { locations, mainDocuments } from "./lib/resolve";

// Where Presentation loads the site from. Point at localhost while developing,
// at the deployed branch otherwise.
const PREVIEW_ORIGIN =
  process.env.SANITY_STUDIO_PREVIEW_URL || "https://sansico.sanjeeva.world";

const PAGES = [
  ["🏠", "Home", "home"],
  ["⚙️", "Capabilities", "capabilities"],
  ["📦", "Products", "products"],
  ["🏢", "Company", "company"],
  ["🌱", "Sustainability", "sustainability"],
  ["🌏", "Why Indonesia", "why-indonesia"],
  ["💼", "Careers", "careers"],
  ["📝", "Blog", "blog"],
  ["✉️", "Contact", "contact"],
];

const structure = (S, context) =>
  S.list()
    .title("Sansico Studio — v2")
    .items([
      S.listItem().title("🎨  Appearance & Brand")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Appearance & Brand")),
      S.divider(),

      S.listItem().title("📄  Pages").child(
        S.list().title("Pages").items(
          PAGES.map(([icon, label, id]) =>
            S.listItem().title(`${icon}  ${label}`).child(
              S.document().schemaType("v2Page").documentId(`page-${id}`).title(label)
            )
          )
        )
      ),
      orderableDocumentListDeskItem({ type: "audiencePage", title: "👥  Audience pages", S, context }),
      S.divider(),

      S.listItem().title("📦  Products").child(
        S.list().title("Products").items([
          orderableDocumentListDeskItem({ type: "productCategory", title: "Categories", S, context }),
          orderableDocumentListDeskItem({ type: "productItem", title: "Products", S, context }),
        ])
      ),
      orderableDocumentListDeskItem({ type: "capability", title: "⚙️  Capabilities", S, context }),
      orderableDocumentListDeskItem({ type: "facility", title: "🏭  Facilities", S, context }),
      orderableDocumentListDeskItem({ type: "certificationGroup", title: "🏅  Certification groups", S, context }),
      orderableDocumentListDeskItem({ type: "milestone", title: "📅  Timeline milestones", S, context }),
      orderableDocumentListDeskItem({ type: "customerStory", title: "💬  Customer stories", S, context }),
      orderableDocumentListDeskItem({ type: "jobRole", title: "💼  Job roles", S, context }),
      orderableDocumentListDeskItem({ type: "blogPost", title: "📝  Blog posts", S, context }),
      orderableDocumentListDeskItem({ type: "person", title: "🧑  People", S, context }),
      S.divider(),

      S.listItem().title("📊  Sourcing scorecard")
        .child(S.document().schemaType("sourcingScorecard").documentId("sourcingScorecard").title("Sourcing scorecard")),
      S.listItem().title("🌏  Why Indonesia (research data)")
        .child(S.document().schemaType("whyIndonesia").documentId("whyIndonesia").title("Why Indonesia")),
    ]);

export default defineConfig({
  name: "sansico-v2",
  title: "Sansico Group — v2",
  projectId: "rvghw4zu",
  dataset: "v2",
  plugins: [
    // Presentation first, so it is the tab editors land on: the real site on
    // one side, the form on the other, click any element to edit it.
    presentationTool({
      title: "Edit site",
      previewUrl: {
        origin: PREVIEW_ORIGIN,
        previewMode: {
          enable: "/api/draft-mode/enable",
          disable: "/api/draft-mode/disable",
        },
      },
      resolve: { locations, mainDocuments },
    }),
    structureTool({ structure }),

    // Vision is a developer query console — editors never use it, and it drags
    // in CodeMirror plus refractor's syntax highlighting for ~290 languages,
    // which was a large share of the deployed bundle and of build time. Load it
    // only when running `sanity dev` locally.
    ...(process.env.NODE_ENV === "development"
      ? [visionTool({ defaultApiVersion: "2024-01-01", defaultDataset: "v2" })]
      : []),
  ],
  schema: { types: schemaTypes },
});
