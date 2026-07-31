import Link from "next/link";
import Image from "next/image";
import { getStyled } from "@/lib/styledText";

const S = (v) => getStyled(v).text;

export default function FooterV2({ site }) {
  const audiences = site.audiences || [];
  const capabilities = site.capabilities || [];

  const Col = ({ title, links }) => (
    <div>
      <h6>{title}</h6>
      <ul>
        {links.map(([label, href]) => (
          <li key={href + label}><Link href={href}>{label}</Link></li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="v2ft">
      <div className="wrap">
        <div className="v2ft-grid">
          <div>
            <div className="v2hd-logo" style={{ marginBottom: 16 }}>
              {site.logoUrl
                ? <Image src={site.logoUrl} alt="Sansico Group" width={140} height={38} style={{ objectFit: "contain" }} />
                : <>SANSICO <em>Group</em></>}
            </div>
            <p className="t-body" style={{ maxWidth: 220 }}>
              {S(site.mission) || "Joy, sustainably packaged. From Indonesia to the world."}
            </p>
          </div>

          <Col title="Company" links={[
            ["About Us", "/company"],
            ["Facilities", "/company#facilities"],
            ["Careers", "/careers"],
            ["Blog", "/blog"],
          ]} />

          <Col title="For" links={audiences.map((a) => [S(a.label).replace(/^For\s+/i, ""), `/${a.slug}`])} />

          <Col title="Capabilities" links={
            capabilities.length
              ? capabilities.map((c) => [S(c.title), `/capabilities#${c.slug}`])
              : [["Capabilities", "/capabilities"]]
          } />

          <Col title="Resources" links={[
            ["Products", "/products"],
            ["Sustainability", "/sustainability"],
            ["Why Indonesia", "/why-indonesia"],
          ]} />

          <div>
            <h6>Contact</h6>
            <ul>
              <li><span className="t-body">Jakarta Office, Indonesia</span></li>
              <li><span className="t-body">Foshan Office, China</span></li>
              {site.email ? <li><a href={`mailto:${site.email}`}>{site.email}</a></li> : null}
              <li style={{ marginTop: 10 }}>
                <Link className="btn btn-outline" style={{ padding: "9px 20px", fontSize: 13 }} href="/contact">
                  {S(site.ctaLabel) || "Start Conversation"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="v2ft-bottom">
          <span>© 2026 Sansico Group. All rights reserved. · <Link href="/privacy">Privacy</Link></span>
          <span>Indonesia · China · USA</span>
        </div>
      </div>
    </footer>
  );
}
