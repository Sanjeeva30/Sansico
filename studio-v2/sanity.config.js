import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { media } from "sanity-plugin-media";
import { schemaTypes } from "./schemas";

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
      S.listItem().title("🧭  Navigation & Footer")
        .child(S.document().schemaType("navigation").documentId("navigation").title("Navigation & Footer")),
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
    // No Presentation here on purpose. This Studio is served from
    // sansico-v2.sanity.studio, a different origin from the site, so the
    // draft-mode cookie Presentation needs is third-party and browsers block
    // it — the preview pane just renders blank. Visual editing lives in the
    // Studio embedded at /studio on the site itself, which is same-origin.
    structureTool({ structure }),

    // Tags, folder-like filtering, and a usage panel on every asset showing
    // which documents reference it, so nobody deletes an image that's still
    // live on the site, out of 160+ assets in this dataset.
    media(),

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
