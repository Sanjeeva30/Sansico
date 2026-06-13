export const revalidate = 30;
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import Arrow from "@/components/Arrow";
import { getProductCategories, getProductItem } from "@/lib/content";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const cats = await getProductCategories();
  return cats.flatMap(c => (c.products||[]).map(p => ({ slug: p.slug })));
}
export async function generateMetadata({ params }) {
  const p = await getProductItem(params.slug);
  if (!p) return {};
  return { title:`${p.name} — Sansico Products`, description:p.description?.slice(0,155) };
}

export default async function ProductPage({ params }) {
  const p = await getProductItem(params.slug);
  if (!p) notFound();
  return (
    <>
      <Reveal />
      <PageHero kicker={`Products · ${p.category?.name || "Sansico Group"}`} title={p.name} />
      <section className="sec">
        <div className="wrap split rv">
          <div>
            {/* Photo gallery */}
            {p.photos?.length > 0 && (
              <div style={{ display:"grid", gap:10,
                gridTemplateColumns: p.photos.length === 1 ? "1fr" : "repeat(2,1fr)" }}>
                {p.photos.map((ph, i) => (
                  <figure key={i} style={{ margin:0 }}>
                    <img src={ph.url} alt={ph.caption || p.name}
                      style={{ width:"100%", aspectRatio:"4/3", objectFit:"cover", borderRadius:6 }} />
                    {ph.caption && (
                      <figcaption style={{ fontSize:12.5, marginTop:4, opacity:0.65 }}>{ph.caption}</figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}
          </div>

          <div className="prose">
            {p.description && <p style={{ fontSize:16.5, lineHeight:1.7 }}>{p.description}</p>}

            {/* Specs */}
            {p.specs?.length > 0 && (
              <div className="card" style={{ marginTop:24 }}>
                <span className="kicker">Specifications</span>
                <table style={{ width:"100%", marginTop:12, borderCollapse:"collapse" }}>
                  <tbody>
                    {p.specs.map((s) => (
                      <tr key={s.label} style={{ borderBottom:"1px solid var(--hair)" }}>
                        <td style={{ padding:"8px 0", fontWeight:600, fontSize:13.5, width:"40%" }}>{s.label}</td>
                        <td style={{ padding:"8px 0", fontSize:13.5 }}>{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {p.moq && (
              <div className="card" style={{ marginTop:14 }}>
                <span className="kicker">Minimum order</span>
                <p style={{ margin:"8px 0 0", fontWeight:600 }}>{p.moq}</p>
              </div>
            )}

            <p style={{ marginTop:28 }}>
              <Link className="btn btn-crimson" href={`/contact?interest=${p.slug}`}>
                Enquire about this product <Arrow />
              </Link>
            </p>
            {p.category?.slug && (
              <p style={{ marginTop:14 }}>
                <Link className="link-d" href={`/products#${p.category.slug}`}>← Back to {p.category.name}</Link>
              </p>
            )}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
