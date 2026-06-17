"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

const BASE = 72;   // visible size in the table at rest
const ZOOM = 260;  // max dimension of the floating zoomed preview
const STAGGER_MS = 70; // delay step per row, "one by one" on scroll-in

export default function CertLogo({ src, alt, index = 0 }) {
  const boxRef = useRef(null);
  const timeoutRef = useRef(null);
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, flip: false });
  const [entered, setEntered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    if (mq.matches) { setEntered(true); return; } // skip animation entirely, just show it

    const el = boxRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timeoutRef.current);
        if (entry.isIntersecting) {
          // staggered "fly in" delay, capped so later rows don't lag too far behind
          const delay = Math.min(index * STAGGER_MS, 560);
          timeoutRef.current = setTimeout(() => setEntered(true), delay);
        } else {
          // leaving viewport — reset so it replays next time it scrolls in
          setEntered(false);
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(timeoutRef.current); };
  }, [index]);

  function handleEnter() {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    const spaceRight = window.innerWidth - r.right;
    const flip = spaceRight < ZOOM + 32;
    setPos({
      top: Math.max(16, r.top + r.height / 2 - ZOOM / 2),
      left: flip ? r.left - ZOOM - 16 : r.right + 16,
      flip,
    });
    setHover(true);
  }

  if (!src) return <div style={{ width: BASE, height: BASE, flexShrink: 0 }} />;

  return (
    <>
      <div
        ref={boxRef}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setHover(false)}
        style={{
          width: BASE, height: BASE, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#fff", border: "1px solid var(--hair,#E5DFD8)",
          borderRadius: 10, padding: 10, cursor: "zoom-in",
          boxShadow: hover ? "0 4px 12px rgba(23,18,15,0.14)" : "0 1px 3px rgba(23,18,15,0.08)",
          borderColor: hover ? "#C5B9B0" : "var(--hair,#E5DFD8)",
          opacity: entered ? 1 : 0,
          transform: entered ? "scale(1) translateY(0)" : "scale(2.6) translateY(14px)",
          transition: reducedMotion
            ? "box-shadow 0.15s ease, border-color 0.15s ease"
            : "opacity 0.5s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1), box-shadow 0.15s ease, border-color 0.15s ease",
        }}
      >
        <Image src={src} alt={alt} width={56} height={56}
          style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto" }} />
      </div>

      {hover && typeof document !== "undefined" && createPortal(
        <div
          style={{
            position: "fixed", top: pos.top, left: pos.left,
            width: ZOOM, height: ZOOM, zIndex: 9999,
            background: "#fff", borderRadius: 16,
            border: "1px solid var(--hair,#E5DFD8)",
            boxShadow: "0 16px 48px rgba(23,18,15,0.28)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 28, pointerEvents: "none",
            animation: "certZoomIn 0.12s ease-out",
          }}
        >
          <Image src={src} alt={alt} width={200} height={200}
            style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto" }} />
        </div>,
        document.body
      )}

      <style jsx global>{`
        @keyframes certZoomIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
