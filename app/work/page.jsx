export const revalidate = 30;
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { getWork, getPageSettings, getPageSeo } from "@/lib/content";
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
      <PageHero kicker="Work" title={w.title} intro={w.intro} />
      <section className="sec">
        <div className="wrap rv">
          <div className="card-grid">
            {w.items.map((it) => (
              <Link className="card" href={it.externalUrl || `/work/${it.slug}`}
                key={it.slug} target={it.externalUrl ? "_blank" : undefined}
                rel={it.externalUrl ? "noopener" : undefined}>
                {it.clientLogoUrl && (
                  <img src={it.clientLogoUrl} alt={it.kicker}
                    style={{ height:32, maxWidth:100, objectFit:"contain", marginBottom:14, filter:"grayscale(1)", opacity:0.7 }} />
                )}
                <span className="kicker">{it.kicker}</span>
                <h3>{it.title}</h3>
                <p>{it.quote}</p>
                <span className="meta">{it.externalUrl ? "View →" : "Read the case study →"}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
