export const revalidate = 30;
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { getMarkets, getMarket, getPageSeo } from "@/lib/content";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const d = await getMarkets();
  return d.items.map((m) => ({ slug: m.slug }));
}
export async function generateMetadata({ params }) {
  const m = await getMarket(params.slug);
  if (!m) return {};
  return getPageSeo("markets", {
    title: `${m.title} — Manufacturing from Indonesia`,
    description: m.body?.slice(0, 155),
  });
}

export default async function MarketPage({ params }) {
  const m = await getMarket(params.slug);
  if (!m || m.visible === false) notFound();
  return (
    <>
      <Reveal />
      {m.imageUrl ? (
        <div style={{ position:"relative", width:"100%", height:"60vh", minHeight:340, maxHeight:520 }}>
          <Image src={m.imageUrl} alt={m.title} fill priority
            sizes="100vw" style={{ objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)" }} />
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"flex-end", padding:"40px 5%" }}>
            <div>
              <p style={{ color:"rgba(255,255,255,0.7)", fontSize:13, textTransform:"uppercase",
                letterSpacing:"0.1em", marginBottom:10 }}>Markets · Sansico Group</p>
              <h1 style={{ color:"#fff", fontSize:"clamp(2rem,5vw,3.5rem)", margin:0 }}>{m.title}</h1>
            </div>
          </div>
        </div>
      ) : (
        <PageHero kicker="Markets · Sansico Group" title={m.title} intro={m.tag} />
      )}
      <section className="sec">
        <div className="wrap split rv">
          <div className="prose">
            <h2>How we serve this market</h2>
            <p>{m.body}</p>
          </div>
          <div className="card" style={{ borderLeft:`4px solid ${m.colorHex || "var(--crimson)"}` }}>
            <span className="kicker">Proof</span>
            <p style={{ fontSize:16, color:"var(--ink)" }}>{m.proof}</p>
            <p style={{ marginTop:18 }}><Link className="link-d" href="/work">See the work →</Link></p>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
