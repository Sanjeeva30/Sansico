export const revalidate = 30;
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { getWork, getPageSettings, getPageSeo } from "@/lib/content";
import { getStyled } from "@/lib/styledText";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  return getPageSeo("work", {
    title: "Work — Proof, Not Promises",
    description: "Selected Sansico programmes with the numbers that matter."
  });
}

export default async function Work() {
  const [w, settings] = await Promise.all([getWork(), getPageSettings("work")]);
  if (!settings.visible) notFound();
  return (
    <>
      <Reveal />
      <PageHero kicker="Work" title={w.title} intro={w.intro}
        heroType={settings.heroType} heroImageUrl={settings.heroImageUrl}
        heroVideoUrl={settings.heroVideoUrl} heroPosterUrl={settings.heroPosterUrl} />
      <section className="sec">
        <div className="wrap rv">
          <div className="card-grid">
            {w.items.map((it) => {
              const kicker = getStyled(it.kicker);
              const title = getStyled(it.title);
              const quote = getStyled(it.quote);
              return (
              <Link className="card" href={it.externalUrl || `/work/${it.slug}`}
                key={it.slug} target={it.externalUrl ? "_blank" : undefined}
                rel={it.externalUrl ? "noopener" : undefined}>
                {it.clientLogoUrl && (
                  <Image src={it.clientLogoUrl} alt={kicker.text} width={100} height={32} style={{ objectFit: "contain" }} />
                )}
                <span className="kicker" style={kicker.style}>{kicker.text}</span>
                <h3 style={title.style}>{title.text}</h3>
                <p style={quote.style}>{quote.text}</p>
                <span className="meta">{it.externalUrl ? "View →" : "Read the case study →"}</span>
              </Link>
              );
            })}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
