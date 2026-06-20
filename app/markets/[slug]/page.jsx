export const revalidate = 30;
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import RichText from "@/components/RichText";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import Arrow from "@/components/Arrow";
import { getMarkets, getMarket, getPageSeo } from "@/lib/content";
import { getStyled } from "@/lib/styledText";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const d = await getMarkets();
  return (d.items || []).map((m) => ({ slug: m.slug }));
}
export async function generateMetadata({ params }) {
  const m = await getMarket(params.slug);
  if (!m) return {};
  return getPageSeo("markets", {
    title: `${m.title} — Sansico Group`,
    description: m.tag || m.body?.slice(0, 155),
  });
}

export default async function MarketPage({ params }) {
  const m = await getMarket(params.slug);
  if (!m || m.visible === false) notFound();
  const accent = m.colorHex || "var(--crimson)";
  const title = getStyled(m.title);
  const tag = getStyled(m.tag);
  const body = getStyled(m.body);
  const proof = getStyled(m.proof);

  return (
    <>
      <Reveal />

      {/* ── HERO ─────────────────────────────────────── */}
      {m.imageUrl ? (
        <div style={{ position:"relative", width:"100%", height:"60vh", minHeight:360, maxHeight:540 }}>
          <Image src={m.imageUrl} alt={title.text} fill priority sizes="100vw"
            style={{ objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.65))" }} />
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column",
            justifyContent:"flex-end", padding:"48px 5%" }}>
            <p style={{ color:accent, fontSize:13, textTransform:"uppercase",
              letterSpacing:"0.1em", marginBottom:12, fontWeight:700 }}>
              Markets · Sansico Group
            </p>
            <h1 style={{ color:"#fff", fontSize:"clamp(2rem,5vw,3.5rem)", margin:0, lineHeight:1.1, ...title.style }}>
              {title.text}
            </h1>
            {tag.text && <p style={{ color:"rgba(255,255,255,0.8)", marginTop:12, fontSize:17, ...tag.style }}>{tag.text}</p>}
          </div>
        </div>
      ) : (
        <PageHero kicker="Markets · Sansico Group" title={title.text} intro={tag.text}
          titleStyle={title.style} introStyle={tag.style}
          style={{ borderTop:`6px solid ${accent}` }} />
      )}

      {/* ── BODY + STATS ─────────────────────────────── */}
      <section className="sec">
        <div className="wrap rv">
          <div className="split" data-animate>
            <div className="prose">
              {m.richBody?.length
                ? <RichText blocks={m.richBody} />
                : <p style={body.style}>{body.text}</p>
              }
              {proof.text && (
                <blockquote style={{ borderLeft:`4px solid ${accent}`, paddingLeft:20, marginTop:32, ...proof.style }}>
                  {proof.text}
                </blockquote>
              )}
            </div>
            {m.marketStats?.length > 0 && (
              <div>
                <div className="stats-row" style={{ flexDirection:"column", gap:2 }}>
                  {m.marketStats.map((s, si) => {
                    const sValue = getStyled(s.value);
                    const sLabel = getStyled(s.label);
                    return (
                      <div className="stat" key={si}
                        style={{ background:`${accent}15`, borderLeft:`3px solid ${accent}` }}>
                        <b style={{ color:accent, ...sValue.style }}>{sValue.text}</b>
                        <span style={sLabel.style}>{sLabel.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ─────────────────────────────── */}
      {m.capabilityRefs?.length > 0 && (
        <section className="sec warm">
          <div className="wrap rv">
            <div className="sec-head">
              <h2 className="kicker">How we serve this market</h2>
              <p className="lede">Our three capabilities, applied to {title.text.toLowerCase()}</p>
            </div>
            <div className="card-grid">
              {m.capabilityRefs.map((cap) => {
                const capNum = getStyled(cap.num);
                const capTitle = getStyled(cap.title);
                const capSummary = getStyled(cap.summary);
                return (
                  <Link className="card" href={`/capabilities#${cap.slug}`} key={cap.slug}>
                    <span className="kicker" style={capNum.style}>{capNum.text}</span>
                    <h3 style={capTitle.style}>{capTitle.text}</h3>
                    <p style={capSummary.style}>{capSummary.text}</p>
                    <span className="meta">Explore <Arrow /></span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED WORK ─────────────────────────────── */}
      {m.featuredWork && (
        <section className="sec">
          <div className="wrap rv">
            <h2 className="kicker">Featured work</h2>
            <Link className="card" href={`/work/${m.featuredWork.slug}`}
              style={{ display:"block", maxWidth:640 }}>
              {m.featuredWork.clientLogoUrl && (
                <Image src={m.featuredWork.clientLogoUrl} alt={m.featuredWork.kicker}
                  width={100} height={32} style={{ objectFit:"contain", filter:"grayscale(1)",
                    opacity:0.6, marginBottom:14 }} />
              )}
              <span className="kicker">{m.featuredWork.kicker}</span>
              <h3>{m.featuredWork.title}</h3>
              {m.featuredWork.quote && <p>{m.featuredWork.quote}</p>}
              {m.featuredWork.stats?.length > 0 && (
                <div style={{ display:"flex", gap:24, marginTop:16 }}>
                  {m.featuredWork.stats.map((s) => (
                    <div key={s.label}>
                      <b style={{ display:"block", fontSize:22, color:accent }}>{s.value}</b>
                      <span style={{ fontSize:12, opacity:0.65 }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
              <span className="meta" style={{ marginTop:16 }}>Read the case study <Arrow /></span>
            </Link>
          </div>
        </section>
      )}

      {/* ── RELATED PRODUCTS ─────────────────────────── */}
      {m.relatedProducts?.length > 0 && (
        <section className="sec warm">
          <div className="wrap rv">
            <div className="sec-head">
              <h2 className="kicker">Related products</h2>
              <Link href="/products" className="link-d" style={{ fontSize:13 }}>View full portfolio →</Link>
            </div>
            <div className="card-grid">
              {m.relatedProducts.map((cat) => (
                <Link className="card" href={`/products#${cat.slug}`} key={cat.slug}>
                  {cat.coverUrl && (
                    <div style={{ position:"relative", width:"100%", aspectRatio:"16/9",
                      overflow:"hidden", borderRadius:6, marginBottom:14 }}>
                      <Image src={`${cat.coverUrl}?w=600&h=338&fit=crop&auto=format`}
                        alt={cat.name} fill sizes="(max-width:768px) 100vw, 33vw"
                        style={{ objectFit:"cover" }} />
                    </div>
                  )}
                  <h3 style={{ fontSize:16 }}>{cat.name}</h3>
                  {cat.description && <p style={{ fontSize:14, opacity:0.75, margin:"6px 0 0" }}>
                    {cat.description.slice(0,80)}…
                  </p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
