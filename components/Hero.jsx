import Link from "next/link";
import Arrow from "./Arrow";
import StyledText from "./StyledText";
import { getStyled } from "@/lib/styledText";

export function InkBands() {
  return (
    <div className="press" aria-hidden="true">
      <div className="band" /><div className="band" /><div className="band" />
      <div className="band" /><div className="band" /><div className="band" />
    </div>
  );
}

export default function Hero({ hero }) {
  const title = getStyled(hero.title);
  const [a, b, c] = (title.text || "").split("|");
  return (
    <section className="hero" aria-label="Sansico Group">
      {hero.type === "video" && hero.videoUrl ? (
        <video className="hero-video" autoPlay muted loop playsInline poster={hero.posterUrl || undefined}>
          <source src={hero.videoUrl} type="video/mp4" />
        </video>
      ) : hero.type === "image" && hero.imageUrl ? (
        <img className="hero-image" src={hero.imageUrl} alt="" />
      ) : (
        <InkBands />
      )}
      <div className="grain" aria-hidden="true" />
      <div className="hero-inner">
        <StyledText as="p" className="eyebrow" value={hero.eyebrow} />
        <h1 style={title.style}>{a}<em>{b}</em>{c}</h1>
        <StyledText as="p" className="sub" value={hero.sub} />
        <Link className="btn btn-light" href={hero.primary.href} {...(hero.primary.edit || {})}>{hero.primary.label} <Arrow /></Link>
        <Link className="btn btn-ghost" href={hero.secondary.href} {...(hero.secondary.edit || {})}>{hero.secondary.label}</Link>
      </div>
      <div className="scroll-cue" aria-hidden="true">Scroll</div>
    </section>
  );
}
