import Link from "next/link";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { getCompany } from "@/lib/content";

export const metadata = {
  title: "Company — Four Decades from Indonesia to the World",
  description: "Sansico Group's story: vision, culture, history and innovation across ten facilities in Indonesia and China."
};

export default function Company() {
  const c = getCompany();
  return (
    <>
      <Reveal />
      <PageHero kicker="Company" title={c.title} intro={c.intro} />
      <section className="sec">
        <div className="wrap rv">
          <div className="card-grid cols2">
            <div className="card" style={{ borderTop: "4px solid var(--citrus)" }}>
              <span className="kicker">Vision</span>
              <p style={{ fontSize: 17, color: "var(--ink)", fontWeight: 500 }}>{c.vision}</p>
            </div>
            <div className="card" style={{ borderTop: "4px solid var(--crimson)" }}>
              <span className="kicker">Culture</span>
              <p style={{ fontSize: 17, color: "var(--ink)", fontWeight: 500 }}>{c.culture}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="sec warm">
        <div className="wrap rv">
          <div className="sec-head">
            <h2 className="kicker">Our story</h2>
            <p className="lede">Four decades, one direction</p>
          </div>
          <div className="timeline">
            {c.timeline.map((t) => (
              <div className="tl-item" key={t.year + t.event}>
                <b>{t.year}</b>
                <p>{t.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="wrap rv">
          <div className="sec-head">
            <h2 className="kicker">Innovation</h2>
            <p className="lede">Capturing developing-world value, delivering volume solutions</p>
          </div>
          <div className="card-grid cols4">
            {c.innovation.map((n) => (
              <div className="card" key={n.title}><h3>{n.title}</h3><p>{n.body}</p></div>
            ))}
          </div>
          <p style={{ marginTop: 36 }}>
            <Link className="link-d" href="/company/facilities">See all ten facilities →</Link>
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
