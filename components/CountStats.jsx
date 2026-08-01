"use client";
import { useEffect, useRef } from "react";
import { getStyled } from "@/lib/styledText";

export default function CountStats({ stats }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = root.querySelectorAll("[data-count]");
    if (reduced) { els.forEach((el) => (el.textContent = el.dataset.count + el.dataset.suffix)); return; }

    const animate = (el) => {
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix;
      const dur = 1400;
      const t0 = performance.now();
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(target * eased) + (k === 1 ? suffix : "");
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) {
          // Reset to 0 when scrolled out so animation replays next time
          e.target.textContent = "0";
          return;
        }
        animate(e.target);
      });
    }, { threshold: 0.4 });

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section aria-label="Group at a glance">
      <div className="wrap">
        <div className="stats-row" ref={ref}>
          {stats.map((s, i) => {
            const label = getStyled(s.label);
            // A specific label color (from the new styled field) wins over the whole-card text color;
            // otherwise fall back to the card's textHex exactly as before.
            const labelColor = label.style.color || s.textHex || undefined;
            return (
              <div className="stat" key={label.text || i}
                {...(s.edit || {})}
                style={{ background: s.bgHex || undefined }}>
                <b data-count={s.value} data-suffix={s.suffix || ""}
                  style={{ color: s.textHex || undefined }}>0</b>
                <span style={{ color: labelColor, fontSize: label.style.fontSize || undefined }}>{label.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
