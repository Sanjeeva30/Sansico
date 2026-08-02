"use client";
// next-sanity's VisualEditing, not the generic @sanity/visual-editing/react one.
// The Next-aware version wires the App Router's history into Presentation, so a
// client-side navigation inside the preview (clicking "For Buyers", a product,
// an article) is reported back to the Studio. With the generic component the
// page navigated but the Studio never heard about it, so its URL bar and the
// document panel stayed on whatever page you started from.
import { VisualEditing } from "next-sanity/visual-editing";

/**
 * Draws the click-to-edit overlays on top of the page when it is viewed inside
 * the Studio's Presentation tool, and keeps the preview live as fields change.
 *
 * Only ever mounted in draft mode, so the public site ships none of this.
 */
export default function VisualEditingBridge() {
  return <VisualEditing />;
}
