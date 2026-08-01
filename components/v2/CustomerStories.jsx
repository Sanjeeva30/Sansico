"use client";
import { useState } from "react";
import Link from "next/link";
import Media from "./Media";
import { getStyled } from "@/lib/styledText";
import { editAttr } from "@/lib/sanity/edit";

// The homepage "Long-Term Partnerships" band: a row of customer names that
// swaps the quote and photo beneath it.
export default function CustomerStories({ stories = [], link, editable = false }) {
  const [i, setI] = useState(0);
  if (!stories.length) return null;

  // Inside Presentation, clicks select elements for editing rather than
  // reaching the page, so the tabs cannot be used to browse and four of the
  // five stories would be unreachable. Show them all stacked there instead —
  // every photo and quote is then visible and directly clickable. Visitors
  // still get the tabbed design.
  if (editable) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
        {stories.map((c, idx) => {
          const q = getStyled(c.quote), nm = getStyled(c.name), loc = getStyled(c.location);
          return (
            <div className="grid12" key={c._id || idx} style={{ alignItems: "center" }}>
              <div className="c-6">
                <Media value={c.image} ratio="4/3"
                  edit={editAttr({ id: c._id, type: c._type, path: "image" })} />
              </div>
              <div className="c-6">
                <blockquote className="t-quote" style={{ margin: "0 0 24px", ...q.style }}>{q.text}</blockquote>
                <div className="t-body">
                  <b style={nm.style}>{nm.text}</b>
                  {loc.text ? <span style={loc.style}> — {loc.text}</span> : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

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
          {/* The photo belongs to the customerStory document, so it points at
              that document's own image field rather than the page. */}
          <Media value={s.image} ratio="4/3"
            edit={editable ? editAttr({ id: s._id, type: s._type, path: "image" }) : undefined} />
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
