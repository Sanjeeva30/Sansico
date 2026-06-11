import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import Strip from "@/components/Strip";
import { getSustainability } from "@/lib/content";

export const metadata = {
  title: "Sustainability & Impact — Certified, Dated, Verifiable",
  description: "Sansico's sustainability discipline: FSC, FSSC 22000, ISO 17025, C-TPAT/SCAN, Higg, amfori BEPI, HERproject and NEST — published with scope and entity, certificates attached."
};

const badgeColor = { Forestry: "green", "Food Safety": "green", Environmental: "green", "Quality & Testing": "navy", "Supply Chain Security": "navy", Social: "crimson" };

export default function Sustainability() {
  const s = getSustainability();
  return (
    <>
      <Reveal />
      <PageHero kicker="Sustainability & Impact" title={s.title} intro={s.intro} />
      <section className="sec">
        <div className="wrap rv">
          <div className="card-grid cols4">
            {s.pillars.map((pl) => (
              <div className="card" key={pl.title}>
                <h3>{pl.title}</h3>
                <p>{pl.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="sec warm" id="certifications">
        <div className="wrap rv">
          <div className="sec-head">
            <h2 className="kicker">Certifications centre</h2>
            <p className="lede">Every mark, written out and verifiable</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="cert-table">
              <thead>
                <tr><th>Certification</th><th>Category</th><th>Scope</th><th>Holding entity</th><th>Certificate</th></tr>
              </thead>
              <tbody>
                {s.certifications.map((c) => (
                  <tr key={c.name}>
                    <td className="nm">{c.name}</td>
                    <td><span className={`badge ${badgeColor[c.category] || ""}`}>{c.category}</span></td>
                    <td>{c.scope}</td>
                    <td>{c.entity}</td>
                    <td>{c.certificate ? <a className="link-d" href={c.certificate}>Download</a> : <span style={{ color: "#9A918A", fontSize: 13 }}>Being attached</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="logo-note" style={{ marginTop: 22 }}>{s.note}</p>
        </div>
      </section>
      <section className="sec">
        <div className="wrap sus-grid rv">
          <div>
            <Strip order={[3,5,1,2,4]} style={{ marginBottom: 30 }} />
            <h2>Joy that <em>gives back</em> more than it takes.</h2>
            <p className="body">Through HERproject we invest in the women who power our workforce; through NEST and our FSC rattan supply chain we bring audited, fair artisan livelihoods into global retail — measured, certified and improving every year.</p>
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
