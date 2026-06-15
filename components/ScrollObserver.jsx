"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollObserver() {
  // Mark document ready
  useEffect(() => {
    document.documentElement.classList.add("scroll-ready");
  }, []);

  // JS-driven rotating border — works in ALL browsers, no @property needed
  useEffect(() => {
    let angle = 0;
    let raf;
    const spin = () => {
      angle = (angle + 0.8) % 360; // ~4.5s per full rotation at 60fps
      document.documentElement.style.setProperty("--ba", angle + "deg");
      raf = requestAnimationFrame(spin);
    };
    raf = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Scroll reveal — replays every scroll
  const path = usePathname();
  useEffect(() => {
    const t = setTimeout(() => {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            e.isIntersecting
              ? e.target.classList.add("in-view")
              : e.target.classList.remove("in-view");
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -28px 0px" }
      );
      document
        .querySelectorAll(
          "[data-animate]:not(.in-view),.card:not(.in-view)," +
          ".fac:not(.in-view),.stat:not(.in-view),.marker:not(.in-view)," +
          ".gate:not(.in-view),.elevate:not(.in-view),.points li:not(.in-view)"
        )
        .forEach((el) => io.observe(el));
      return () => io.disconnect();
    }, 60);
    return () => clearTimeout(t);
  }, [path]);

  return null;
}
