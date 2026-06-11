"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ site }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const onHome = path === "/";

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > (onHome ? window.innerHeight * 0.72 : 40));
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [onHome]);

  useEffect(() => { setOpen(false); }, [path]);

  return (
    <header className={`hd ${solid || open ? "solid" : ""}`} style={!onHome && !solid && !open ? { background: "rgba(16,12,10,.35)", backdropFilter: "blur(6px)" } : undefined}>
      <div className="wrap bar">
        <Link className="logo" href="/">SANSICO <em>Group</em></Link>
        <nav className="nav-main" aria-label="Primary">
          {site.nav.map((n) => (
            <Link key={n.href} href={n.href} aria-current={path.startsWith(n.href) ? "page" : undefined}>{n.label}</Link>
          ))}
          <Link className="nav-cta" href={site.cta.href}>{site.cta.label}</Link>
        </nav>
        <button className="menu-btn" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
      </div>
      <nav className={`mobile-nav ${open ? "open" : ""}`} aria-label="Mobile">
        {site.nav.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
        <Link href={site.cta.href}>{site.cta.label}</Link>
      </nav>
    </header>
  );
}
