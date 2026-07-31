"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Adds `.in` to `.rv` elements as they scroll into view.
//
// This component lives in the root layout, so it does NOT remount on client-side
// navigation. Without re-running per route, elements rendered by the next page
// were never observed and stayed at opacity 0 — the page looked blank. Keying
// the effect on the pathname fixes that.
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const reveal = (el) => el.classList.add("in");

    // No IntersectionObserver (or the user prefers reduced motion): show
    // everything immediately rather than risk hiding content.
    if (typeof IntersectionObserver === "undefined" ||
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".rv").forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );

    // Run after paint so the incoming route's nodes are in the DOM.
    const t = setTimeout(() => {
      document.querySelectorAll(".rv:not(.in)").forEach((el) => io.observe(el));
    }, 0);

    // Safety net: anything still hidden and already within the viewport after a
    // beat gets revealed regardless, so content can never be stranded.
    const sweep = setTimeout(() => {
      document.querySelectorAll(".rv:not(.in)").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) reveal(el);
      });
    }, 400);

    return () => { clearTimeout(t); clearTimeout(sweep); io.disconnect(); };
  }, [pathname]);

  return null;
}
