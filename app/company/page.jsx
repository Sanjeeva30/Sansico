export const revalidate = 30;
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import Arrow from "@/components/Arrow";
import { getCompany, getPageSettings, getPageSeo } from "@/lib/content";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  return getPageSeo("company", {
    title: "Company — Four Decades from Indonesia to the World",
    description: "Sansico Group's story: vision, culture, history and innovation across ten facilities in Indonesia and China."
  });
}

export default async function Company() {
  const [c, settings] = await Promise.all([getCompany(), getPageSettings("company")]);
  if (!settings.visible) notFound();
  return (
    <>
      <Reveal />
      <PageHero kicker="Company" title={c.title} intro={c.intro} />
      <section className="sec">
        <div className="wrap rv">
          <div className="card-grid cols2">
            <div className="card" style={{ borderTop:"4px solid var(--citrus)" }}>
              <span className="kicker">Vision</span>
              <p style={{ fontSize:17, color:"var(--ink)", fontWeight:500 }}>{c.vision}</p>
            </div>
            <div className="card" style={{ borderTop:"4px solid var(--crimson)" }}>
              <span className="kicker">Culture</span>
              <p style={{ fontSize:17, color:"var(--ink)", fontWeight:500 }}>{c.culture}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities with photos */}
      {c.facilities?.length > 0 && (
        <section className="sec warm">
          <div className="wrap rv">
            <div className="sec-head">
              <h2 className="kicker">Our facilities</h2>
              <p className="lede">Ten locations, Indonesia &amp; China</p>
            </div>
            <div className="fac-grid">
              {c.facilities.map((f) => (
                <div key={f.name} className="fac" style={{ flexDirection:"column" }}>
                  {f.photoUrl && (
                    <img src={f.photoUrl} alt={f.name}
                      style={{ width:"100%", aspectRatio:"16/9", objectFit:"cover", borderRadius:6, marginBottom:12 }} />
                  )}
                  <b>{f.name}</b>
                  <span>{f.city}</span>
                  {f.focus && <span className="focus">{f.focus}</span>}
                  {f.capacity && <span style={{ fontSize:13, opacity:0.65, marginTop:4 }}>{f.capacity}</span>}
                </div>
              ))}
            </div>
            <p style={{ marginTop:32 }}>
              <Link className="link-d" href="/company/facilities">Full facility details →</Link>
            </p>
          </div>
        </section>
      )}

      {/* Team link */}
      <section className="sec">
        <div className="wrap rv">
          <div className="sec-head">
            <h2 className="kicker">Leadership</h2>
            <p className="lede">The people behind the operations</p>
          </div>
          <p>
            <Link className="btn btn-crimson" href="/team">Meet the team <Arrow /></Link>
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
