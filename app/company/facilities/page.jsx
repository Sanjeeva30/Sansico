export const revalidate = 30;
import Image from "next/image";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { getCompany, getSite, getPageSettings, getPageSeo } from "@/lib/content";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  return getPageSeo("company", {
    title: "Facilities & Locations — Ten Plants, Three Countries",
    description: "Sansico Group facilities across Java, Jakarta, Tangerang, Cikarang, Yogyakarta and Foshan — with full addresses and production focus."
  });
}

export default async function Facilities() {
  const [company, site, settings] = await Promise.all([getCompany(), getSite(), getPageSettings("company")]);
  if (!settings.visible) notFound();
  const facilities = company.facilities || [];
  return (
    <>
      <Reveal />
      <PageHero kicker="Company · Facilities" title="Ten facilities, three countries, one standard"
        intro="Close to vendor, close to production in Indonesia; close to technology in China; close to business in the USA." />
      <section className="sec">
        <div className="wrap rv">
          <div className="presence" style={{ marginBottom:60 }}>
            {site.contact.presence.map((p) => (
              <div className="pres" key={p.country}><b>{p.country}</b><p>{p.detail}</p></div>
            ))}
          </div>
          <div className="card-grid cols2">
            {facilities.map((f) => (
              <div className="card" key={f.name}>
                {f.photoUrl && (
                  <div style={{ position:"relative", width:"100%", aspectRatio:"16/9", overflow:"hidden", borderRadius:6, marginBottom:14 }}>
                    <Image src={f.photoUrl} alt={f.name} fill sizes="(max-width:768px) 100vw, 50vw" style={{ objectFit:"cover" }} />
                  </div>
                )}
                <h3>{f.name}</h3>
                {f.focus && <span className="kicker" style={{ display:"block", margin:"6px 0 10px" }}>{f.focus}</span>}
                <p>{f.address}</p>
                {f.capacity && <p style={{ fontSize:13, opacity:0.65, marginTop:8 }}>{f.capacity}</p>}
                <p style={{ marginTop:14 }}>
                  <a className="link-d" href={`https://maps.google.com/?q=${encodeURIComponent(f.name+" "+f.city)}`}
                    target="_blank" rel="noopener noreferrer">Open in Maps →</a>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
