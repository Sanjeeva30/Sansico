import Link from "next/link";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { getMarkets } from "@/lib/content";

export const metadata = {
  title: "Markets — Toys, Cards, Gifting, Home & FMCG Packaging",
  description: "Sansico serves five markets from Indonesia: toys & games, greeting cards & stationery, gifting & seasonal, home & lifestyle, and FMCG & retail packaging."
};

export default function Markets() {
  const m = getMarkets();
  return (
    <>
      <Reveal />
      <PageHero kicker="Markets we serve" title={m.title} intro={m.intro} />
      <section className="sec">
        <div className="wrap rv">
          <div className="card-grid">
            {m.items.map((it) => (
              <Link className="card" href={`/markets/${it.slug}`} key={it.slug}>
                <span className={`dot dot-${it.color}`} style={{ display: "block", width: 10, height: 10, borderRadius: "50%", marginBottom: 22 }} aria-hidden="true" />
                <h3>{it.title}</h3>
                <p>{it.tag}</p>
                <span className="meta">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
