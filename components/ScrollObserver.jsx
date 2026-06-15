"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollObserver() {
  useEffect(() => {
    document.documentElement.classList.add("scroll-ready");
  }, []);

  const path = usePathname();

  useEffect(() => {
    const t = setTimeout(() => {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in-view");
            } else {
              e.target.classList.remove("in-view");
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
      );
      document.querySelectorAll("[data-animate]:not(.in-view), .card:not(.in-view), .fac:not(.in-view), .stat:not(.in-view), .market:not(.in-view), .gate:not(.in-view), .elevate:not(.in-view), .points li:not(.in-view)").forEach((el) => io.observe(el));
      return () => io.disconnect();
    }, 60);
    return () => clearTimeout(t);
  }, [path]);

  return null;
}
