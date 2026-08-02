"use client";
import { usePathname } from "next/navigation";

// Small persistent marker so nobody mistakes a draft preview for the live site
// — the single most common confusion once preview mode exists.
export default function PreviewBar() {
  // Exiting drops the draft cookie and comes back to the page you were reading,
  // rather than bouncing to the homepage.
  const path = usePathname();
  return (
    <div
      style={{
        position: "fixed", bottom: 16, left: 16, zIndex: 10000,
        display: "flex", alignItems: "center", gap: 12,
        background: "var(--ink, #17120F)", color: "#fff",
        padding: "10px 16px", borderRadius: 999,
        font: "600 12px/1 var(--font-sans), sans-serif",
        letterSpacing: ".08em", textTransform: "uppercase",
        boxShadow: "0 8px 28px rgba(0,0,0,.28)",
      }}
    >
      <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--citrus, #BDDA5F)" }} />
      Draft preview
      <a
        href={`/api/draft-mode/disable?redirect=${encodeURIComponent(path || "/")}`}
        style={{ color: "var(--citrus, #BDDA5F)", borderBottom: "1px solid currentColor", paddingBottom: 1 }}
      >
        Exit
      </a>
    </div>
  );
}
