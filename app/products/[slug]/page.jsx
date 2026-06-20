export const revalidate = 30;
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import Arrow from "@/components/Arrow";
import { getProductCategories, getProductItem } from "@/lib/content";
import { getStyled } from "@/lib/styledText";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const cats = await getProductCategories();
  return cats.flatMap(c => (c.products||[]).map(p => ({ slug: p.slug })));
}
export async function generateMetadata({ params }) {
  const p = await getProductItem(params.slug);
  if (!p) return {};
  const name = getStyled(p.name);
  const desc = getStyled(p.description);
  return { title:`${name.text} — Sansico Products`, description: desc.text?.slice(0,155) };
}

export default async function ProductPage({ params }) {
  const p = await getProductItem(params.slug);
  if (!p) notFound();
  const name = getStyled(p.name);
  const description = getStyled(p.description);
  const moq = getStyled(p.moq);
  const categoryName = getStyled(p.category?.name);
  return (
    <>
      <Reveal />
      <PageHero kicker={`Products · ${categoryName.text || "Sansico Group"}`} title={name.text} titleStyle={name.style} />
      <section className="sec">
        <div className="wrap split rv">
          <div>
            {/* Photo gallery */}
            {p.photos?.length > 0 && (
              <div style={{ display:"grid", gap:10,
                gridTemplateColumns: p.photos.length === 1 ? "1fr" : "repeat(2,1fr)" }}>
                {p.photos.map((ph, i) => (
                  <figure key={i} style={{ margin:0 }}>
                    <div style={{ position:"relative", width:"100%", aspectRatio:"4/3", overflow:"hidden", borderRadius:6 }}>
  <Image src={ph.url ? `${ph.url}?w=800&h=600&fit=crop&auto=format` : ph.url} alt={ph.caption || name.text} fill sizes="(max-width:768px) 100vw, 50vw" style={{ objectFit:"cover" }} />
</div>
                    {ph.caption && (
                      <figcaption style={{ fontSize:12.5, marginTop:4, opacity:0.65 }}>{ph.caption}</figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}
          </div>

          <div className="prose">
            {description.text && <p style={{ fontSize:16.5, lineHeight:1.7, ...description.style }}>{description.text}</p>}

            {/* Specs */}
            {p.specs?.length > 0 && (
              <div className="card" style={{ marginTop:24 }}>
                <span className="kicker">Specifications</span>
                <table style={{ width:"100%", marginTop:12, borderCollapse:"collapse" }}>
                  <tbody>
                    {p.specs.map((s, si) => {
                      const sLabel = getStyled(s.label);
                      const sValue = getStyled(s.value);
                      return (
                        <tr key={si} style={{ borderBottom:"1px solid var(--hair)" }}>
                          <td style={{ padding:"8px 0", fontWeight:600, fontSize:13.5, width:"40%", ...sLabel.style }}>{sLabel.text}</td>
                          <td style={{ padding:"8px 0", fontSize:13.5, ...sValue.style }}>{sValue.text}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {moq.text && (
              <div className="card" style={{ marginTop:14 }}>
                <span className="kicker">Minimum order</span>
                <p style={{ margin:"8px 0 0", fontWeight:600, ...moq.style }}>{moq.text}</p>
              </div>
            )}

            <p style={{ marginTop:28 }}>
              <Link className="btn btn-crimson" href={`/contact?interest=${p.slug}`}>
                Enquire about this product <Arrow />
              </Link>
            </p>
            {p.category?.slug && (
              <p style={{ marginTop:14 }}>
                <Link className="link-d" href={`/products#${p.category.slug}`}>← Back to {categoryName.text}</Link>
              </p>
            )}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
