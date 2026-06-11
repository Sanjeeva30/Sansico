import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { getWork, getCase } from "@/lib/content";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getWork().items.map((w) => ({ slug: w.slug }));
}
export function generateMetadata({ params }) {
  const c = getCase(params.slug);
  if (!c) return {};
  return { title: `${c.title} — Case Study`, description: c.quote };
}

export default function CasePage({ params }) {
  const c = getCase(params.slug);
  if (!c) notFound();
  return (
    <>
      <Reveal />
      <PageHero kicker={`Case study · ${c.kicker}`} title={c.title} />
      <section className="sec proof">
        <div className="wrap rv">
          <blockquote>{c.quote}</blockquote>
          <div className="meta">
            {c.stats.map((s) => <div key={s.label}><b>{s.value}</b><span>{s.label}</span></div>)}
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="wrap rv prose" style={{ maxWidth: 800 }}>
          <h2>The programme</h2>
          <p>{c.body}</p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
