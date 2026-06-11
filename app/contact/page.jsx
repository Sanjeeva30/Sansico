import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import RfqForm from "@/components/RfqForm";
import { getSite, getProducts } from "@/lib/content";

export const metadata = {
  title: "Contact — Request a Quotation",
  description: "Start a conversation with Sansico Group: request a quotation, email sales@sansico.com, or call our Jakarta and Foshan marketing offices."
};

export default function Contact() {
  const site = getSite();
  const products = getProducts();
  return (
    <>
      <Reveal />
      <PageHero kicker="Contact" title="Tell us what you're making" intro="Category, target market, estimated volumes and timeline — our marketing offices in Jakarta and Foshan respond within one business day." />
      <section className="sec">
        <div className="wrap split rv">
          <div>
            <h2 className="kicker" style={{ marginBottom: 24 }}>Request a quotation</h2>
            <RfqForm categories={products.items.map((p) => p.title)} email={site.contact.email} />
          </div>
          <div>
            <h2 className="kicker" style={{ marginBottom: 24 }}>Reach us directly</h2>
            <div className="card" style={{ marginBottom: 16 }}>
              <span className="kicker">Email</span>
              <p style={{ fontSize: 17, fontWeight: 600, color: "var(--ink)" }}><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></p>
            </div>
            {site.contact.phones.map((p) => (
              <div className="card" style={{ marginBottom: 16 }} key={p.tel}>
                <span className="kicker">{p.label}</span>
                <p style={{ fontSize: 17, fontWeight: 600, color: "var(--ink)" }}><a href={`tel:${p.tel}`}>{p.display}</a></p>
              </div>
            ))}
            <div className="card">
              <span className="kicker">WhatsApp Business</span>
              <p>Coming online shortly — use email or phone in the meantime.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="sec warm">
        <div className="wrap rv">
          <div className="presence">
            {site.contact.presence.map((p) => (
              <div className="pres" key={p.country}><b>{p.country}</b><p>{p.detail}</p></div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
