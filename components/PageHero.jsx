import { InkBands } from "./Hero";

export default function PageHero({ kicker, title, intro }) {
  return (
    <section className="phero">
      <InkBands />
      <div className="wrap">
        <p className="eyebrow">{kicker}</p>
        <h1>{title}</h1>
        {intro ? <p>{intro}</p> : null}
      </div>
    </section>
  );
}
