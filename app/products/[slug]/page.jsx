import Link from "next/link";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import Arrow from "@/components/Arrow";
import { getProducts, getProduct } from "@/lib/content";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getProducts().items.map((p) => ({ slug: p.slug }));
}
export function generateMetadata({ params }) {
  const p = getProduct(params.slug);
  if (!p) return {};
  return { title: `${p.title} — Made in Indonesia to Specification`, description: p.body.slice(0, 155) };
}

export default function ProductPage({ params }) {
  const p = getProduct(params.slug);
  if (!p) notFound();
  return (
    <>
      <Reveal />
      <PageHero kicker="Products · Sansico Group" title={p.title} intro={p.tag} />
      <section className="sec">
        <div className="wrap split rv">
          <div className="prose">
            <h2>What we make</h2>
            <p>{p.body}</p>
            <p style={{ marginTop: 26 }}>
              <Link className="btn btn-crimson" href={`/contact?interest=${p.slug}`}>Enquire about {p.title} <Arrow /></Link>
            </p>
          </div>
          <div>
            <div className="card" style={{ marginBottom: 18 }}>
              <span className="kicker">Specification guidance</span>
              <ul className="points" style={{ marginTop: 14 }}>
                {p.specs.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
            <div className="card">
              <span className="kicker">Produced at</span>
              <ul style={{ marginTop: 8 }}>
                {p.facilities.map((f) => (
                  <li key={f} style={{ padding: "8px 0", borderBottom: "1px solid var(--hair)", fontWeight: 600, fontSize: 14.5 }}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
