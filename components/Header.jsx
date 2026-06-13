"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header({ site }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen]   = useState(false);
  const path   = usePathname();
  const onHome = path === "/";

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > (onHome ? window.innerHeight * 0.72 : 40));
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [onHome]);

  useEffect(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, [path]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const Logo = ({ dark }) => site.logoUrl
    ? <Image src={site.logoUrl} alt="Sansico Group" width={160} height={36}
        style={{ objectFit:"contain", filter: dark ? "none" : "brightness(0) invert(1)" }} />
    : <span style={{ color: dark ? "var(--ink)" : "#fff" }}>
        <span style={{ letterSpacing:"0.1em", fontWeight:700 }}>SANSICO</span>
        {" "}<em style={{ fontWeight:400, fontStyle:"italic" }}>Group</em>
      </span>;

  return (
    <>
      <header className={`hd ${solid || open ? "solid" : ""}`}
        style={!onHome && !solid && !open ? { background:"rgba(16,12,10,.35)", backdropFilter:"blur(6px)" } : undefined}>
        <div className="wrap bar">
          <Link className="logo" href="/" aria-label="Sansico Group home">
            <Logo dark={solid || open} />
          </Link>
          <nav className="nav-main" aria-label="Primary">
            {site.nav.map((n) => (
              <Link key={n.href} href={n.href}
                aria-current={path.startsWith(n.href) ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
            <Link className="nav-cta" href={site.cta.href}>{site.cta.label}</Link>
          </nav>
          <button className="menu-btn" aria-expanded={open} aria-label="Toggle menu"
            onClick={() => setOpen(!open)}>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {/* ── Elegant dark mobile overlay ──────────────── */}
      <div
        role="dialog" aria-modal="true" aria-label="Navigation"
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(12, 8, 6, 0.97)",
          display: "flex", flexDirection: "column",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.35s ease",
        }}>

        {/* Top bar */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"24px 6%" }}>
          <Link href="/" onClick={() => setOpen(false)}
            style={{ textDecoration:"none", color:"#fff", letterSpacing:"0.1em",
              fontWeight:700, fontSize:15 }}>
            SANSICO <em style={{ fontWeight:300, fontStyle:"italic" }}>Group</em>
          </Link>
          <button onClick={() => setOpen(false)}
            style={{ background:"none", border:"1.5px solid rgba(255,255,255,0.3)",
              borderRadius:999, padding:"7px 20px", color:"rgba(255,255,255,0.85)",
              fontSize:13, letterSpacing:"0.08em", cursor:"pointer",
              textTransform:"uppercase", fontWeight:600, transition:"all 0.2s" }}>
            Close
          </button>
        </div>

        {/* Nav items — centered, generous spacing */}
        <nav style={{ flex:1, display:"flex", flexDirection:"column",
          justifyContent:"center", padding:"0 8%" }}>
          {site.nav.map((n, i) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
              style={{
                fontSize:"clamp(1.8rem, 8vw, 3rem)", fontWeight:300,
                color: path.startsWith(n.href) ? "var(--crimson, #7A0D20)" : "rgba(255,255,255,0.92)",
                textDecoration:"none",
                padding:"clamp(8px,1.5vw,14px) 0",
                borderBottom:"1px solid rgba(255,255,255,0.08)",
                letterSpacing:"-0.01em",
                transition:"color 0.2s, padding-left 0.2s",
                display:"block",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.paddingLeft = "8px";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = path.startsWith(n.href)
                  ? "var(--crimson, #7A0D20)" : "rgba(255,255,255,0.92)";
                e.currentTarget.style.paddingLeft = "0";
              }}>
              {n.label}
            </Link>
          ))}

          {/* CTA */}
          <Link href={site.cta.href} onClick={() => setOpen(false)}
            style={{ marginTop:"clamp(20px,4vw,40px)", display:"inline-block",
              background:"var(--crimson, #7A0D20)", color:"#fff",
              borderRadius:999, padding:"16px 36px",
              fontSize:15, fontWeight:700, textDecoration:"none",
              letterSpacing:"0.02em", textAlign:"center",
              alignSelf:"flex-start" }}>
            {site.cta.label} →
          </Link>
        </nav>

        {/* Footer hint */}
        <p style={{ padding:"20px 6%", color:"rgba(255,255,255,0.25)",
          fontSize:12, letterSpacing:"0.08em", textTransform:"uppercase" }}>
          Indonesia · China · USA
        </p>
      </div>
    </>
  );
}
