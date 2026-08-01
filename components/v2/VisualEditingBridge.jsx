"use client";
import { VisualEditing } from "@sanity/visual-editing/react";
import { useRouter } from "next/navigation";

/**
 * Draws the click-to-edit overlays on top of the page when it is viewed inside
 * the Studio's Presentation tool, and re-renders the route whenever the editor
 * changes something so the preview stays live.
 *
 * Only ever mounted in draft mode, so the public site ships none of this.
 */
export default function VisualEditingBridge() {
  const router = useRouter();
  return <VisualEditing refresh={() => Promise.resolve(router.refresh())} />;
}
