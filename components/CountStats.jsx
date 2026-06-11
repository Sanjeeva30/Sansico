"use client";
import { useEffect, useRef } from "react";

export default function CountStats({ stats }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = root.querySelectorAll("[data-count]");
    if (reduced) { els.forEach((el) => (el.textContent = el.dataset.count + el.dataset.suffix)); return; }
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const target = +e.target.dataset.count;
        const suffix = e.target.dataset.suffix;
        const dur = 1400;
        const t0 = performance.now();
        const tick = (t) => {
          const k = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - k, 3);
          e.target.textContent = Math.round(target * eased) + (k === 1 ? suffix : "");
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <section className="warm" aria-label="Group at a glance">
      <div className="wrap">
        <div className="stats-row" ref={ref}>
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <b data-count={s.value} data-suffix={s.suffix}>0</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
