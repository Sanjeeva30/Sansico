"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Horizontal auto-scroll for the company timeline.
 *
 * Drifts the track sideways at a steady pace and reverses at each end, so the
 * milestones read as a slow ticker rather than a jump-cut loop. Deliberately
 * yields to the reader: it pauses on hover, on focus, while dragging or
 * touching, and whenever the section is off-screen. Honours
 * prefers-reduced-motion by not moving at all.
 */
export default function TimelineScroller({ children, speed = 28, enabled = true, className = "", style }) {
  const ref = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!enabled) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = 0;
    let direction = 1;
    let visible = true;
    let userScrolling = 0;

    // Pause while the section is off-screen so we don't animate needlessly.
    const io = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.15 })
      : null;
    io?.observe(el);

    // Any manual scroll hands control back to the reader for a moment.
    const onUserScroll = () => { userScrolling = performance.now(); };
    el.addEventListener("wheel", onUserScroll, { passive: true });
    el.addEventListener("touchmove", onUserScroll, { passive: true });

    // Position is accumulated here rather than read back from the element each
    // frame: at these speeds a frame advances well under a pixel, and reading
    // el.scrollLeft returns a rounded value, so the fraction was being thrown
    // away every frame and the track never moved.
    let pos = el.scrollLeft;

    const step = (now) => {
      raf = requestAnimationFrame(step);
      if (!last) { last = now; return; }
      const dt = Math.min((now - last) / 1000, 0.05); // clamp after tab-switch
      last = now;

      const max = el.scrollWidth - el.clientWidth;
      if (max <= 1) return;

      if (paused || !visible || now - userScrolling < 1600) {
        pos = el.scrollLeft; // stay in sync while the reader is in control
        return;
      }

      pos += direction * speed * dt;
      if (pos >= max) { pos = max; direction = -1; }
      else if (pos <= 0) { pos = 0; direction = 1; }
      el.scrollLeft = pos;
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      el.removeEventListener("wheel", onUserScroll);
      el.removeEventListener("touchmove", onUserScroll);
    };
  }, [paused, speed, enabled]);

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
    >
      {children}
    </div>
  );
}
