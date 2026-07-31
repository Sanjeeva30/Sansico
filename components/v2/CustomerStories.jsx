"use client";
import { useState } from "react";
import Link from "next/link";
import Media from "./Media";
import { getStyled } from "@/lib/styledText";

// The homepage "Long-Term Partnerships" band: a row of customer names that
// swaps the quote and photo beneath it.
export default function CustomerStories({ stories = [], link }) {
  const [i, setI] = useState(0);
  if (!stories.length) return null;
  const s = stories[Math.min(i, stories.length - 1)];
  const quote = getStyled(s.quote);
  const name = getStyled(s.name);
  const location = getStyled(s.location);
  const linkLabel = getStyled(link?.label);

  return (
    <>
      <div className="v2-rule" style={{ display: "flex", gap: 34, flexWrap: "wrap", paddingTop: 16, marginBottom: 44 }}>
        {stories.map((c, idx) => {
          const n = getStyled(c.name);
          const active = idx === i;
          return (
            <button
              key={c._key || n.text || idx}
              onClick={() => setI(idx)}
              aria-pressed={active}
              style={{
                background: "none", border: "none", cursor: "pointer", padding: "0 0 12px",
                borderBottom: `2px solid ${active ? "var(--crimson)" : "transparent"}`,
                color: active ? "var(--crimson)" : "var(--ink-soft)",
                fontWeight: active ? 700 : 500,
                fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase",
                transition: "color .2s, border-color .2s",
              }}
            >
              {n.text}
            </button>
          );
        })}
      </div>

      <div className="grid12" style={{ alignItems: "center" }}>
        <div className="c-6">
          <Media value={s.image} ratio="4/3" />
        </div>
        <div className="c-6">
          <blockquote className="t-quote" style={{ margin: "0 0 24px", ...quote.style }}>{quote.text}</blockquote>
          <div className="t-body" style={{ marginBottom: 28 }}>
            <b style={name.style}>{name.text}</b>
            {location.text ? <span style={location.style}> — {location.text}</span> : null}
          </div>
          {link?.href ? (
            <Link href={link.href} className="t-small" style={{ borderBottom: "1px solid var(--crimson)", color: "var(--crimson)", paddingBottom: 3, ...linkLabel.style }}>
              {linkLabel.text || "Read more"} →
            </Link>
          ) : null}
        </div>
      </div>
    </>
  );
}
