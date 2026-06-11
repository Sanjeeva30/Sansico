import Link from "next/link";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import Arrow from "@/components/Arrow";
import { getProducts, getProduct } from "@/lib/content";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const d = await getProducts();
  return (d?.items || []).map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }) {
  const p = await getProduct(params.slug);
  if (!p) return {};
  return { title: `${p.title} — Made in Indonesia to Specification`, description: p.body?.slice(0, 155) };
}

export default async function ProductPage({ params }) {
  const p = await getProduct(params.slug);
  if (!p) notFound();
  const specs = p?.specs || [];
  const facilities = p?.facilities || [];
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
                {specs.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
            <div className="card">
              <span className="kicker">Produced at</span>
              <ul style={{ marginTop: 8 }}>
                {facilities.map((f) => (
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
