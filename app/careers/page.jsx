export const revalidate = 30;
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import InterestForm from "@/components/InterestForm";
import { getCareers, getPageSettings, getPageSeo } from "@/lib/content";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  return getPageSeo("careers", {
    title: "Careers — Make the Things That Make Moments",
    description: "Careers across Sansico's ten facilities in Indonesia and China."
  });
}

export default async function Careers() {
  const [c, settings] = await Promise.all([getCareers(), getPageSettings("careers")]);
  if (!settings.visible) notFound();
  const values = c?.values || [];
  const roles = c?.openRoles?.map(r => r.title) || ["Engineering & Production","Design & Creative","Quality & Laboratory","Supply Chain & Logistics","Commercial & Marketing","Finance, IT & Corporate"];
  return (
    <>
      <Reveal />
      <PageHero kicker="Careers" title={c?.title || "Make the things that make moments"} intro={c?.intro || "Register your interest and we'll reach out when a matching role opens."} />
      {values.length > 0 && (
        <section className="sec">
          <div className="wrap rv">
            <div className="card-grid">
              {values.map((v) => (
                <div className="card" key={v.title}><h3>{v.title}</h3><p>{v.body}</p></div>
              ))}
            </div>
          </div>
        </section>
      )}
      {c?.openRoles?.length > 0 && (
        <section className="sec warm">
          <div className="wrap rv">
            <div className="sec-head">
              <h2 className="kicker">Open roles</h2>
              <p className="lede">Current opportunities across our operations</p>
            </div>
            <div className="card-grid">
              {c.openRoles.map((r) => (
                <div className="card" key={r.title}>
                  <h3>{r.title}</h3>
                  <span className="kicker">{r.location}</span>
                  {r.description && <p style={{ marginTop:10 }}>{r.description}</p>}
                  {r.applyEmail && (
                    <p style={{ marginTop:14 }}>
                      <a className="link-d" href={`mailto:${r.applyEmail}?subject=Application: ${r.title}`}>Apply →</a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
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
