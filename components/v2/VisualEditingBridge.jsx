"use client";
// next-sanity's VisualEditing, not the generic @sanity/visual-editing/react one.
// The Next-aware version wires the App Router's history into Presentation, so a
// client-side navigation inside the preview (clicking "For Buyers", a product,
// an article) is reported back to the Studio. With the generic component the
// page navigated but the Studio never heard about it, so its URL bar and the
// document panel stayed on whatever page you started from.
import { useEffect, useState } from "react";
import { VisualEditing } from "next-sanity/visual-editing";

/**
 * Draws the click-to-edit overlays on top of the page when it is viewed inside
 * the Studio's Presentation tool, and keeps the preview live as fields change.
 *
 * Only ever mounted in draft mode, so the public site ships none of this — but
 * the draft cookie outlives a Presentation session, so browsing the site
 * top-level afterwards used to show "Open in Studio" buttons over ordinary
 * content. The overlays only mean anything inside the Studio's iframe, so that
 * is the only place they are drawn. Outside it you still get draft content and
 * the "Draft preview / Exit" pill, just no editing chrome.
 */
export default function VisualEditingBridge() {
  const [framed, setFramed] = useState(false);

  useEffect(() => {
    try {
      setFramed(window.self !== window.top);
    } catch {
      // Cross-origin parent — throwing at all means we are framed.
      setFramed(true);
    }
  }, []);

  if (!framed) return null;
  return <VisualEditing />;
}
