import Link from "next/link";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { getProducts } from "@/lib/content";

export const metadata = {
  title: "Products — Paper, Packaging, Circular Design, Handicrafts, Cut & Sew",
  description: "Five product families developed to customer specification: paper products, box & rigid packaging, circular design, handicrafts and cut & sew."
};

export default function Products() {
  const p = getProducts();
  return (
    <>
      <Reveal />
      <PageHero kicker="Products" title={p.title} intro={p.intro} />
      <section className="sec">
        <div className="wrap rv">
          <div className="card-grid">
            {p.items.map((it) => (
              <Link className="card" href={`/products/${it.slug}`} key={it.slug}>
                <span className="kicker">{it.tag}</span>
                <h3>{it.title}</h3>
                <p>{it.body.slice(0, 110)}…</p>
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
