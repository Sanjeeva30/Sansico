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

  useEffect(() => { setOpen(false); }, [path]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const Logo = ({ dark }) => site.logoUrl
    ? <Image src={site.logoUrl} alt="Sansico Group" width={160} height={36}
        style={{ objectFit:"contain", filter: dark ? "none" : "brightness(0) invert(1)" }} />
    : <span style={{ color: dark ? "var(--ink)" : "#fff", fontWeight:700, letterSpacing:"0.08em", fontSize:15 }}>
        SANSICO{" "}<em style={{ fontWeight:300, fontStyle:"italic" }}>Group</em>
      </span>;

  return (
    <>
      <header className={`hd ${solid || open ? "solid" : ""}`}
        style={!onHome && !solid && !open ? { background:"rgba(16,12,10,.35)", backdropFilter:"blur(6px)" } : undefined}>
        <div className="wrap bar">
          <Link className="logo" href="/"><Logo dark={solid || open} /></Link>
          <nav className="nav-main" aria-label="Primary">
            {site.nav.map((n) => (
              <Link key={n.href} href={n.href} aria-current={path.startsWith(n.href) ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
            <Link className="nav-cta" href={site.cta.href}>{site.cta.label}</Link>
          </nav>
          <button className="menu-btn" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(v => !v)}>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {open && (
        <div style={{ position:"fixed", inset:0, zIndex:9999, background:"var(--paper-warm,#FAF8F4)", display:"flex", flexDirection:"column", overflowY:"auto" }}>
          <div style={{ display:"flex", height:5, flexShrink:0 }}>
            {["#7A0D20","#22409E","#0D4F31","#F3263E","#BDDA5F"].map((c) => (
              <div key={c} style={{ flex:1, background:c }} />
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 6%", borderBottom:"1px solid var(--hair,#E5DFD8)", flexShrink:0 }}>
            <Link href="/" onClick={() => setOpen(false)} style={{ textDecoration:"none" }}>
              <span style={{ color:"var(--ink)", fontWeight:700, letterSpacing:"0.08em", fontSize:15 }}>
                SANSICO{" "}<em style={{ fontWeight:300, fontStyle:"italic" }}>Group</em>
              </span>
            </Link>
            <button onClick={() => setOpen(false)} style={{ background:"none", border:"1.5px solid var(--hair,#E5DFD8)", borderRadius:999, padding:"7px 20px", color:"var(--ink-soft,#4A423D)", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600, cursor:"pointer" }}>
              Close ×
            </button>
          </div>
          <nav style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"24px 6%" }}>
            {site.nav.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:"clamp(1.6rem,7vw,2.4rem)", fontWeight:400, fontFamily:"var(--font-serif,Georgia,serif)", color:path.startsWith(n.href) ? "var(--crimson,#7A0D20)" : "var(--ink,#17120F)", textDecoration:"none", padding:"clamp(12px,2.5vw,18px) 0", borderBottom:"1px solid var(--hair,#E5DFD8)", letterSpacing:"-0.01em", lineHeight:1.1 }}>
                <span>{n.label}</span>
                <span style={{ fontSize:"1rem", color:"var(--hair,#E5DFD8)", fontFamily:"sans-serif" }}>→</span>
              </Link>
            ))}
            <div style={{ marginTop:"clamp(20px,4vw,32px)" }}>
              <Link href={site.cta.href} onClick={() => setOpen(false)}
                style={{ display:"inline-flex", alignItems:"center", gap:10, background:"var(--crimson,#7A0D20)", color:"#fff", borderRadius:999, padding:"14px 32px", fontSize:15, fontWeight:700, textDecoration:"none" }}>
                {site.cta.label}<span style={{ fontSize:18 }}>→</span>
              </Link>
            </div>
          </nav>
          <div style={{ padding:"16px 6% 24px", borderTop:"1px solid var(--hair,#E5DFD8)", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
            <span style={{ fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--ink-soft,#4A423D)", opacity:0.6 }}>Indonesia · China · USA</span>
            <div style={{ display:"flex", gap:4 }}>
              {["#7A0D20","#22409E","#0D4F31"].map(c => (
                <div key={c} style={{ width:8, height:8, borderRadius:"50%", background:c, opacity:0.5 }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
