import Link from "next/link";
import Arrow from "./Arrow";

export default function CtaBand() {
  return (
    <section className="cta sec" id="contact-cta">
      <div className="wrap rv">
        <h2>Looking for your <em>China+1</em> partner in Indonesia?</h2>
        <p>Tell us your category, target market and volumes — our marketing offices in Jakarta and Foshan respond within one business day.</p>
        <Link className="btn btn-red" href="/contact">Request a quotation <Arrow /></Link>
        <Link className="btn btn-ghost" href="/contact">Talk to our team</Link>
      </div>
    </section>
  );
}
