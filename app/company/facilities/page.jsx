import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { getCapabilities, getLocations, getSite } from "@/lib/content";

export const metadata = {
  title: "Facilities & Locations — Ten Plants, Three Countries",
  description: "Sansico Group facilities across Java, Jakarta, Tangerang, Cikarang, Yogyakarta and Foshan — with full addresses and production focus."
};

export default function Facilities() {
  const caps = getCapabilities();
  const loc = getLocations();
  const site = getSite();
  const focusByName = Object.fromEntries(caps.facilities.map((f) => [f.name, f.focus]));
  return (
    <>
      <Reveal />
      <PageHero kicker="Company · Facilities" title="Ten facilities, three countries, one standard" intro="Close to vendor, close to production in Indonesia; close to technology in China; close to business in the USA." />
      <section className="sec">
        <div className="wrap rv">
          <div className="presence" style={{ marginBottom: 60 }}>
            {site.contact.presence.map((p) => (
              <div className="pres" key={p.country}><b>{p.country}</b><p>{p.detail}</p></div>
            ))}
          </div>
          <div className="card-grid cols2">
            {loc.items.map((l) => (
              <div className="card" key={l.name}>
                <h3>{l.name}</h3>
                {focusByName[l.name] ? <span className="kicker" style={{ display: "block", margin: "6px 0 10px" }}>{focusByName[l.name]}</span> : null}
                <p>{l.address}</p>
                <p style={{ marginTop: 14 }}>
                  <a className="link-d" href={`https://maps.google.com/?q=${encodeURIComponent(l.name + " " + l.address)}`} target="_blank" rel="noopener noreferrer">Open in Maps →</a>
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
