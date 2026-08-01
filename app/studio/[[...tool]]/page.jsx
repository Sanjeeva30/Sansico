"use client";

/**
 * The Studio is a client-only app.
 *
 * It has to be a Client Component: sanity.config.js pulls in React context and
 * browser-only code at module scope, which Next cannot evaluate while
 * collecting server-side page data. Route segment config (`dynamic`) and
 * metadata therefore live in the sibling layout, which is a Server Component.
 */
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
