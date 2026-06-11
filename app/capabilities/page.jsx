import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import Strip from "@/components/Strip";
import { getCapabilities } from "@/lib/content";

export const metadata = {
  title: "Capabilities — Design, Manufacturing & Vendor Operations",
  description: "Design & creative studio, ten-facility manufacturing with an in-house ISO 17025 laboratory, and door-to-door vendor operations from sourcing to trade compliance."
};

const marks = ["PP","PP","GCP","FS","IGP","IGP","IGP","IGP","IGP","SU"];
const colors = ["#22409E","#22409E","#0D4F31","#9C1F36","#7A0D20","#7A0D20","#7A0D20","#7A0D20","#7A0D20","#17120F"];

export default function Capabilities() {
  const caps = getCapabilities();
  return (
    <>
      <Reveal />
      <PageHero kicker="Capabilities" title={caps.title} intro={caps.intro} />
      {caps.groups.map((g, i) => (
        <section className={`sec ${i % 2 ? "warm" : ""}`} id={g.slug} key={g.slug}>
          <div className="wrap split rv">
            <div className="prose">
              <p className="kicker">{g.num}</p>
              <h2>{g.title}</h2>
              <p>{g.body}</p>
            </div>
            <div>
              <Strip style={{ marginBottom: 26 }} />
              <ul className="points">
                {g.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
            </div>
          </div>
        </section>
      ))}
      <section className="sec">
        <div className="wrap rv">
          <div className="sec-head">
            <h2 className="kicker">Where we make</h2>
            <p className="lede">Ten facilities, Indonesia &amp; China</p>
          </div>
          <div className="fac-grid">
            {caps.facilities.map((f, i) => (
              <div className="fac" key={f.name}>
                <span className="mark" style={{ background: colors[i] }}>{marks[i]}</span>
                <div>
                  <b>{f.name}</b>
                  <span>{f.location}</span>
                  <span className="focus">{f.focus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
