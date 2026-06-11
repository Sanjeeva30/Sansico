import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import InterestForm from "@/components/InterestForm";
import { getCareers } from "@/lib/content";

export const metadata = {
  title: "Careers — Make the Things That Make Moments",
  description: "Careers across Sansico's ten facilities in Indonesia and China. Register your interest and we'll reach out when a matching role opens."
};

export default function Careers() {
  const c = getCareers();
  return (
    <>
      <Reveal />
      <PageHero kicker="Careers" title={c.title} intro={c.intro} />
      <section className="sec">
        <div className="wrap rv">
          <div className="card-grid">
            {c.values.map((v) => (
              <div className="card" key={v.title}><h3>{v.title}</h3><p>{v.body}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section className="sec warm">
        <div className="wrap rv">
          <div className="sec-head">
            <h2 className="kicker">Register your interest</h2>
            <p className="lede">Open roles will be published here</p>
          </div>
          <InterestForm roles={c.interestRoles} />
        </div>
      </section>
    </>
  );
}
