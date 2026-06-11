import Link from "next/link";
import Arrow from "./Arrow";

const Reg = ({ pos }) => (
  <span className={`reg ${pos}`} aria-hidden="true">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" /><path d="M12 0v24M0 12h24" /></svg>
  </span>
);

export function InkBands() {
  return (
    <div className="press" aria-hidden="true">
      <div className="band" /><div className="band" /><div className="band" />
      <div className="band" /><div className="band" /><div className="band" />
    </div>
  );
}

export default function Hero({ hero }) {
  const [a, b, c] = hero.title.split("|");
  return (
    <section className="hero" aria-label="Sansico Group">
      {hero.type === "video" && hero.videoUrl ? (
        <video className="hero-video" autoPlay muted loop playsInline poster={hero.posterUrl || undefined}>
          <source src={hero.videoUrl} type="video/mp4" />
        </video>
      ) : (
        <InkBands />
      )}
      <div className="grain" aria-hidden="true" />
      <Reg pos="tl" /><Reg pos="tr" /><Reg pos="bl" /><Reg pos="br" />
      <div className="hero-inner">
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1>{a}<em>{b}</em>{c}</h1>
        <p className="sub">{hero.sub}</p>
        <Link className="btn btn-light" href={hero.primary.href}>{hero.primary.label} <Arrow /></Link>
        <Link className="btn btn-ghost" href={hero.secondary.href}>{hero.secondary.label}</Link>
      </div>
      <div className="scroll-cue" aria-hidden="true">Scroll</div>
    </section>
  );
}
