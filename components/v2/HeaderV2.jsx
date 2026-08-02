"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getStyled } from "@/lib/styledText";
import { editAttr, clean } from "@/lib/sanity/edit";

const S = (v) => getStyled(v).text;
// Navigation labels only. Sanity strings carry invisible stega metadata, and the
// visual-editing overlay treats any stega-bearing text as a click-to-edit target
// — which swallows the click before the <Link> ever sees it, so the preview never
// navigates. Nav labels are stripped so the links stay links; they are still
// edited from their own document (Audience page → Label, Capability → Title).
const NAV = (v) => clean(S(v));

export default function HeaderV2({ site, isDraft = false }) {
  const chrome = (path) => (isDraft ? editAttr({ id: "siteSettings", type: "siteSettings", path }) : undefined);
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const active = (href) => (href === "/" ? path === "/" : path.startsWith(href));

  const capabilities = site.capabilities || [];
  const categories = site.categories || [];
  const audiences = site.audiences || [];

  // navigation.mainNav is the editable source once seeded (Studio → Navigation
  // & Footer). Falls back to the original hardcoded menu so the header still
  // renders correctly before that document is ever populated.
  const navDoc = site.nav;
  const navEdit = (path) => (isDraft && navDoc?._id ? editAttr({ id: navDoc._id, type: navDoc._type || "navigation", path }) : undefined);
  const FALLBACK_MAIN = [
    { label: "Capabilities", href: "/capabilities", menu: capabilities.map((c) => ({ label: NAV(c.title), href: `/capabilities#${c.slug}` })) },
    { label: "Products", href: "/products", menu: categories.map((c) => ({ label: NAV(c.name), href: `/products/${c.slug}` })) },
    { label: "Company", href: "/company", menu: [{ label: "About Us", href: "/company" }, { label: "Facilities", href: "/company#facilities" }] },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Why Indonesia", href: "/why-indonesia" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
  ];
  const MAIN = navDoc?.mainNav?.length
    ? navDoc.mainNav.map((n, i) => ({
        label: n.label,
        href: n.href,
        edit: navEdit(`mainNav[${i}].label`),
        menu: n.autoMenu === "capabilities"
          ? capabilities.map((c) => ({ label: NAV(c.title), href: `/capabilities#${c.slug}` }))
          : n.autoMenu === "products"
          ? categories.map((c) => ({ label: NAV(c.name), href: `/products/${c.slug}` }))
          : (n.children || []).map((c) => ({ label: c.label, href: c.href, edit: navEdit(`mainNav[${i}].children[_key=="${c._key}"].label`) })),
      }))
    : FALLBACK_MAIN;

  return (
    <>
      <header className="v2hd">
        {/* utility strip — the wireframe's For Buyers / Factories / Creatives row */}
        <div className="v2hd-utility">
          <div className="wrap">
            {audiences.map((a) => (
              <Link key={a.slug} href={`/${a.slug}`} aria-current={active(`/${a.slug}`) ? "page" : undefined}>
                {NAV(a.label)}
              </Link>
            ))}
          </div>
        </div>

        <div className="v2hd-main">
          <div className="wrap">
            <Link className="v2hd-logo" href="/">
              {site.logoUrl
                ? <Image src={site.logoUrl} alt="Sansico Group" width={150} height={34} style={{ objectFit: "contain" }} />
                : <>SANSICO <em>Group</em></>}
            </Link>

            <nav className="v2hd-nav" aria-label="Primary">
              {MAIN.map((n) => (
                <div key={n.href} className={n.menu?.length ? "v2hd-drop" : undefined}>
                  {/* edit attribute goes on the <Link> itself, not a nested span —
                      these labels are plain strings (no stega), and the header CTA
                      proved a data-sanity attribute on the link doesn't block its
                      own click; nesting it on inner text is what breaks navigation. */}
                  <Link className="navlink" href={n.href} aria-current={active(n.href) ? "page" : undefined} {...(n.edit || {})}>{n.label}</Link>
                  {n.menu?.length ? (
                    <div className="v2hd-menu">
                      {n.menu.map((m) => <Link key={m.href} href={m.href} {...(m.edit || {})}>{m.label}</Link>)}
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>

            <Link className="v2hd-cta" href="/contact" {...(chrome("ctaLabel") || {})}>{NAV(site.ctaLabel) || "Start Conversation"}</Link>

            <button className="v2hd-burger" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "var(--paper-warm)", display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ display: "flex", height: 5, flexShrink: 0 }}>
            {["#7A0D20", "#22409E", "#0D4F31", "#F3263E", "#BDDA5F"].map((c) => <div key={c} style={{ flex: 1, background: c }} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 6%", borderBottom: "1px solid var(--hair)" }}>
            <Link href="/" className="v2hd-logo" onClick={() => setOpen(false)}>SANSICO <em>Group</em></Link>
            <button className="v2hd-burger" style={{ display: "block" }} onClick={() => setOpen(false)}>Close ×</button>
          </div>
          <nav style={{ flex: 1, padding: "24px 6%" }}>
            {MAIN.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} {...(n.edit || {})}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: "clamp(1.5rem, 6.5vw, 2.2rem)",
                  color: active(n.href) ? "var(--crimson)" : "var(--ink)",
                  padding: "clamp(10px,2.2vw,16px) 0", borderBottom: "1px solid var(--hair)",
                }}>
                {n.label}<span style={{ fontSize: "1rem", color: "var(--hair)" }}>→</span>
              </Link>
            ))}
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 26 }}>
              {audiences.map((a) => (
                <Link key={a.slug} href={`/${a.slug}`} onClick={() => setOpen(false)} className="t-small" style={{ color: "var(--ink-soft)" }}>
                  {NAV(a.label)}
                </Link>
              ))}
            </div>
            <div style={{ marginTop: 28 }}>
              <Link className="btn btn-crimson" href="/contact" onClick={() => setOpen(false)}>
                {NAV(site.ctaLabel) || "Start Conversation"} →
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
