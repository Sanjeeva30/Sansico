import Link from "next/link";

export default function Footer({ site }) {
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="f-grid">
          <div>
            <div className="f-logo">
              <span className="s1">S</span><span className="s2">A</span><span className="s3">N</span>
              <span className="s4">S</span><span className="s5">I</span><span className="s6">C</span>
              <span className="s7">O</span><em>Group</em>
            </div>
            <p className="blurb">{site.mission}</p>
          </div>
          <div>
            <h6>Company</h6>
            <ul>
              <li><Link href="/company">About &amp; history</Link></li>
              <li><Link href="/company/facilities">Facilities</Link></li>
              <li><Link href="/work">Work</Link></li>
              <li><Link href="/careers">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h6>Offer</h6>
            <ul>
              <li><Link href="/capabilities">Capabilities</Link></li>
              <li><Link href="/markets">Markets</Link></li>
              <li><Link href="/products">Products</Link></li>
              <li><Link href="/sustainability">Sustainability</Link></li>
            </ul>
          </div>
          <div>
            <h6>Contact</h6>
            <ul>
              {site.contact.phones.map((p) => <li key={p.tel}><a href={`tel:${p.tel}`}>{p.label.split(" ")[0]} {p.display}</a></li>)}
              <li><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></li>
              <li><Link href="/contact">Request a quotation</Link></li>
            </ul>
          </div>
        </div>
        <div className="f-bottom">
          <span>{site.footerNote} · <Link href="/privacy">Privacy</Link></span>
          <span className="lang"><b>EN</b> | ID</span>
        </div>
      </div>
    </footer>
  );
}
