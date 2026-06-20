export const revalidate = 30;
import PageHero from "@/components/PageHero";
import Image from "next/image";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import Arrow from "@/components/Arrow";
import { getWork, getCase } from "@/lib/content";
import { getStyled } from "@/lib/styledText";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const d = await getWork(); return d.items.map((w) => ({ slug: w.slug }));
}
export async function generateMetadata({ params }) {
  const c = await getCase(params.slug);
  if (!c) return {};
  const title = getStyled(c.title);
  const quote = getStyled(c.quote);
  return { title:`${title.text} — Case Study`, description: quote.text };
}

export default async function CasePage({ params }) {
  const c = await getCase(params.slug);
  if (!c) notFound();
  const title = getStyled(c.title);
  const kicker = getStyled(c.kicker);
  const quote = getStyled(c.quote);
  const body = getStyled(c.body);
  return (
    <>
      <Reveal />
      <PageHero kicker={`Case study · ${kicker.text}`} title={title.text} titleStyle={title.style} />
      {c.clientLogoUrl && (
        <section className="sec" style={{ paddingBottom:0 }}>
          <div className="wrap rv">
            <Image src={c.clientLogoUrl} alt={kicker.text} width={120} height={48} style={{ objectFit: "contain" }} />
          </div>
        </section>
      )}
      <section className="sec proof">
        <div className="wrap rv">
          <blockquote style={quote.style}>{quote.text}</blockquote>
          <div className="meta">
            {c.stats.map((s, si) => {
              const sValue = getStyled(s.value);
              const sLabel = getStyled(s.label);
              return <div key={si}><b style={sValue.style}>{sValue.text}</b><span style={sLabel.style}>{sLabel.text}</span></div>;
            })}
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
          <p style={body.style}>{body.text}</p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
