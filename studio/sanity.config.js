// Sansico Studio — the editing back end.
// Setup (once): create a free project at sanity.io, paste its ID below,
// then `npm install && npm run dev` in this folder. Studio opens at localhost:3333.
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "sansico",
  title: "Sansico Group",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "YOUR_PROJECT_ID",
  dataset: "production",
  plugins: [structureTool()],
  schema: { types: schemaTypes }
});
