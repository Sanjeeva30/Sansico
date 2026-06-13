export const revalidate = 30;
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import Arrow from "@/components/Arrow";
import { getWork, getCase } from "@/lib/content";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const d = await getWork(); return d.items.map((w) => ({ slug: w.slug }));
}
export async function generateMetadata({ params }) {
  const c = await getCase(params.slug);
  if (!c) return {};
  return { title:`${c.title} — Case Study`, description:c.quote };
}

export default async function CasePage({ params }) {
  const c = await getCase(params.slug);
  if (!c) notFound();
  return (
    <>
      <Reveal />
      <PageHero kicker={`Case study · ${c.kicker}`} title={c.title} />
      {c.clientLogoUrl && (
        <section className="sec" style={{ paddingBottom:0 }}>
          <div className="wrap rv">
            <img src={c.clientLogoUrl} alt={c.kicker}
              style={{ height:48, objectFit:"contain", filter:"grayscale(1)", opacity:0.6 }} />
          </div>
        </section>
      )}
      <section className="sec proof">
        <div className="wrap rv">
          <blockquote>{c.quote}</blockquote>
          <div className="meta">
            {c.stats.map((s) => <div key={s.label}><b>{s.value}</b><span>{s.label}</span></div>)}
          </div>
          {c.externalUrl && (
            <p style={{ marginTop:24 }}>
              <a className="link-d" href={c.externalUrl} target="_blank" rel="noopener">
                View external reference <Arrow />
              </a>
            </p>
          )}
        </div>
      </section>
      <section className="sec">
        <div className="wrap rv prose" style={{ maxWidth:800 }}>
          <h2>The programme</h2>
          <p>{c.body}</p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
