import Link from "next/link";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { getWork } from "@/lib/content";

export const metadata = {
  title: "Work — Proof, Not Promises",
  description: "Selected Sansico programmes with the numbers that matter: FSC rattan with NEST and Target, Mattel toy packaging at Printec, and four decades of US retail seasonal programmes."
};

export default function Work() {
  const w = getWork();
  return (
    <>
      <Reveal />
      <PageHero kicker="Work" title={w.title} intro={w.intro} />
      <section className="sec">
        <div className="wrap rv">
          <div className="card-grid">
            {w.items.map((it) => (
              <Link className="card" href={`/work/${it.slug}`} key={it.slug}>
                <span className="kicker">{it.kicker}</span>
                <h3>{it.title}</h3>
                <p>{it.quote}</p>
                <span className="meta">Read the case study →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
