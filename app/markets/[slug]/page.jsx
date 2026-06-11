import Link from "next/link";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { getMarkets, getMarket } from "@/lib/content";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getMarkets().items.map((m) => ({ slug: m.slug }));
}
export function generateMetadata({ params }) {
  const m = getMarket(params.slug);
  if (!m) return {};
  return { title: `${m.title} — Manufacturing from Indonesia`, description: m.body.slice(0, 155) };
}

export default function MarketPage({ params }) {
  const m = getMarket(params.slug);
  if (!m) notFound();
  return (
    <>
      <Reveal />
      <PageHero kicker="Markets · Sansico Group" title={m.title} intro={m.tag} />
      <section className="sec">
        <div className="wrap split rv">
          <div className="prose">
            <h2>How we serve this market</h2>
            <p>{m.body}</p>
          </div>
          <div className="card" style={{ borderLeft: "4px solid var(--crimson)" }}>
            <span className="kicker">Proof</span>
            <p style={{ fontSize: 16, color: "var(--ink)" }}>{m.proof}</p>
            <p style={{ marginTop: 18 }}><Link className="link-d" href="/work">See the work →</Link></p>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
