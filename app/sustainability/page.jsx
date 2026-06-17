export const revalidate = 30;
import PageHero from "@/components/PageHero";
import Image from "next/image";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import Strip from "@/components/Strip";
import { getSustainability, getPageSettings, getPageSeo } from "@/lib/content";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  return getPageSeo("sustainability", {
    title: "Sustainability & Impact — Certified, Dated, Verifiable",
    description: "Sansico's sustainability discipline: FSC, FSSC 22000, ISO 17025, C-TPAT/SCAN, Higg, amfori BEPI, HERproject and NEST."
  });
}

const badgeColor = { Forestry:"green","Food Safety":"green",Environmental:"green","Quality & Testing":"navy","Supply Chain Security":"navy",Social:"crimson" };

export default async function Sustainability() {
  const [s, settings] = await Promise.all([getSustainability(), getPageSettings("sustainability")]);
  if (!settings.visible) notFound();
  return (
    <>
      <Reveal />
      <PageHero kicker="Sustainability & Impact" title={s.title} intro={s.intro} />
      <section className="sec warm" id="certifications">
        <div className="wrap rv">
          <div className="sec-head">
            <h2 className="kicker">Certifications centre</h2>
            <p className="lede">Every mark, written out and verifiable</p>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table className="cert-table">
              <thead>
                <tr><th>Certification</th><th>Category</th><th>Scope</th><th>Entity</th><th>Certificate</th></tr>
              </thead>
              <tbody>
                {s.certifications.map((c) => (
                  <tr key={c.name}>
                    <td className="nm" style={{ display:"flex", alignItems:"center", gap:10 }}>
                      {c.logoUrl && (
                        <Image src={c.logoUrl} alt={c.name} width={28} height={28} style={{ objectFit: "contain" }} />
                      )}
                      {c.name}
                    </td>
                    <td><span className={`badge ${badgeColor[c.category]||""}`}>{c.category}</span></td>
                    <td>{c.scope}</td>
                    <td>{c.entity}</td>
                    <td>
                      {c.certificateUrl
                        ? <a className="link-d" href={c.certificateUrl} target="_blank" rel="noopener">Download PDF</a>
                        : <span style={{ color:"#9A918A", fontSize:13 }}>Being attached</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="wrap sus-grid rv">
          <div>
            <Strip order={[3,5,1,2,4]} style={{ marginBottom:30 }} />
            <h2>{s.susSection?.heading ? (
              <>
                {s.susSection.heading.split("|")[0]}
                <em style={{color:"var(--green)"}}>{s.susSection.heading.split("|")[1]}</em>
                {s.susSection.heading.split("|")[2]}
              </>
            ) : <>Joy that <em>gives back</em> more than it takes.</>}
            </h2>
            <p className="body">{s.susSection?.body || "Through HERproject we invest in the women who power our workforce; through NEST and our FSC rattan supply chain we bring audited, fair artisan livelihoods into global retail — measured, certified and improving every year."}</p>
          </div>
          <div className="loop" role="img" aria-label={`${s.stat.value} ${s.stat.label}`}>
            <div className="core"><b>{s.stat.value}</b><span>{s.stat.label}</span></div>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
