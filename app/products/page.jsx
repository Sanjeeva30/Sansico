export const revalidate = 30;
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import Arrow from "@/components/Arrow";
import { getProductCategories, getPageSettings, getPageSeo } from "@/lib/content";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  return getPageSeo("products", {
    title: "Products — Our Portfolio",
    description: "Sansico's full product portfolio — developed to customer specification across paper-based packaging, handicrafts and more."
  });
}

export default async function Products() {
  const [cats, settings] = await Promise.all([getProductCategories(), getPageSettings("products")]);
  if (!settings.visible) notFound();

  return (
    <>
      <Reveal />
      <PageHero kicker="Products" title="Our product portfolio" intro="Every product developed to your specification." />

      {/* Category navigation */}
      {cats.length > 1 && (
        <nav className="sec" style={{ paddingTop:0, paddingBottom:0 }}>
          <div className="wrap" style={{ display:"flex", gap:12, flexWrap:"wrap", paddingBottom:8 }}>
            {cats.map((cat) => (
              <a key={cat.slug} href={`#${cat.slug}`} className="chip">{cat.name}</a>
            ))}
          </div>
        </nav>
      )}

      {/* One section per category */}
      {cats.map((cat, i) => (
        <section key={cat.slug} id={cat.slug} className={`sec ${i % 2 ? "warm" : ""}`}>
          <div className="wrap rv">
            <div className="sec-head">
              {cat.coverUrl && (
                <img src={cat.coverUrl} alt={cat.name}
                  style={{ width:"100%", maxHeight:320, objectFit:"cover", borderRadius:8, marginBottom:32 }} />
              )}
              <h2 className="kicker">{cat.name}</h2>
              {cat.description && <p className="lede" style={{ maxWidth:600 }}>{cat.description}</p>}
            </div>

            {cat.products?.length > 0 ? (
              <div className="card-grid">
                {cat.products.map((p) => (
                  <Link key={p.slug} className="card" href={`/products/${p.slug}`}>
                    {p.thumbUrl && (
                      <img src={p.thumbUrl} alt={p.name}
                        style={{ width:"100%", aspectRatio:"4/3", objectFit:"cover", borderRadius:6, marginBottom:14 }} />
                    )}
                    <h3 style={{ fontSize:16, margin:"0 0 8px" }}>{p.name}</h3>
                    {p.description && <p style={{ fontSize:14, margin:0, opacity:0.75 }}>{p.description.slice(0,90)}…</p>}
                    <span className="meta" style={{ marginTop:12 }}>View details <Arrow /></span>
                  </Link>
                ))}
              </div>
            ) : (
              <p style={{ opacity:0.5, fontStyle:"italic" }}>Products coming soon — add them in the Studio.</p>
            )}
          </div>
        </section>
      ))}

      {cats.length === 0 && (
        <section className="sec">
          <div className="wrap rv">
            <p style={{ opacity:0.5 }}>No product categories yet — add them in the Studio under Product Categories.</p>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
