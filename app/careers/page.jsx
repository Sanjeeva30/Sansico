export const revalidate = 30;
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import InterestForm from "@/components/InterestForm";
import { getCareers } from "@/lib/content";

export const metadata = {
  title: "Careers — Make the Things That Make Moments",
  description: "Careers across Sansico's ten facilities in Indonesia and China."
};

export default async function Careers() {
  const c = await getCareers();
  const values = c?.values || [];
  const roles = c?.interestRoles || ["Engineering & Production", "Design & Creative", "Quality & Laboratory", "Supply Chain & Logistics", "Commercial & Marketing", "Finance, IT & Corporate"];
  const title = c?.title || "Make the things that make moments";
  const intro = c?.intro || "Register your interest and we'll reach out when a matching role opens.";
  return (
    <>
      <Reveal />
      <PageHero kicker="Careers" title={title} intro={intro} />
      <section className="sec">
        <div className="wrap rv">
          <div className="card-grid">
            {values.map((v) => (
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
          <InterestForm roles={roles} />
        </div>
      </section>
    </>
  );
}
