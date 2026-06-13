export const revalidate = 30;
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { getMarkets, getPageSettings, getPageSeo } from "@/lib/content";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  return getPageSeo("markets", {
    title: "Markets — Toys, Cards, Gifting, Home & FMCG Packaging",
    description: "Sansico serves five markets from Indonesia: toys & games, greeting cards & stationery, gifting & seasonal, home & lifestyle, and FMCG & retail packaging."
  });
}

export default async function Markets() {
  const [m, settings] = await Promise.all([getMarkets(), getPageSettings("markets")]);
  if (!settings.visible) notFound();
  return (
    <>
      <Reveal />
      <PageHero kicker="Markets we serve" title={m.title} intro={m.intro} />
      <section className="sec">
        <div className="wrap rv">
          <div className="card-grid">
            {m.items.filter(it => it.visible !== false).map((it) => (
              <Link className="card" href={`/markets/${it.slug}`} key={it.slug}>
                {it.imageUrl && (
                  <div style={{ position:"relative", width:"100%", aspectRatio:"16/9", overflow:"hidden", borderRadius:6, marginBottom:16 }}>
                    <Image src={it.imageUrl} alt={it.title} fill sizes="(max-width:768px) 100vw, 33vw" style={{ objectFit:"cover" }} />
                  </div>
                )}
                {!it.imageUrl && (
                  <span style={{ display:"block", width:10, height:10, borderRadius:"50%",
                    background: it.colorHex || "var(--crimson)", marginBottom:22 }} aria-hidden="true" />
                )}
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
