/**
 * Studio config for the Studio embedded at /studio inside the Next.js app.
 *
 * Why embedded: Presentation puts the site in an iframe and turns on Next's
 * draft mode with a cookie. When the Studio lives on a different origin
 * (sansico-v2.sanity.studio) that cookie is third-party, and browsers block it
 * — draft mode never switches on inside the frame, so the preview renders
 * blank and click-to-edit never connects. Serving the Studio from the same
 * origin as the site makes the cookie first-party and the whole problem
 * disappears.
 *
 * Schemas and the Presentation resolver are shared with studio-v2 rather than
 * duplicated, so there is still exactly one definition of each.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

import { schemaTypes } from "./studio-v2/schemas";
import { locations, mainDocuments } from "./studio-v2/lib/resolve";

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
  name: "sansico-v2-embedded",
  title: "Sansico Group — v2",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "rvghw4zu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "v2",

  // Served from within the site itself.
  basePath: "/studio",

  plugins: [
    presentationTool({
      title: "Edit site",
      // Same origin as the Studio, so the draft-mode cookie is first-party.
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
          disable: "/api/draft-mode/disable",
        },
      },
      resolve: { locations, mainDocuments },
    }),
    structureTool({ structure }),
  ],

  schema: { types: schemaTypes },
});
