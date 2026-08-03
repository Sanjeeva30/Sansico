import Link from "next/link";
import Image from "next/image";
import { getStyled } from "@/lib/styledText";
import { editAttr, clean } from "@/lib/sanity/edit";

const S = (v) => getStyled(v).text;
// See HeaderV2: link labels are stripped of stega so the visual-editing overlay
// doesn't claim the click and stop the preview from navigating.
const NAV = (v) => clean(S(v));

export default function FooterV2({ site, isDraft = false }) {
  // site chrome lives on siteSettings, so it points there rather than at a page
  const chrome = (path) => (isDraft ? editAttr({ id: "siteSettings", type: "siteSettings", path }) : undefined);
  const audiences = site.audiences || [];
  const capabilities = site.capabilities || [];

  // navigation.footerColumns is the editable source once seeded. "For" and
  // "Capabilities" stay generated from Audience pages and Capabilities
  // documents no matter what — matched by title so an editor customising
  // "Company" or "Resources" can't accidentally shadow those.
  const navDoc = site.nav;
  const navEdit = (path) => (isDraft && navDoc?._id ? editAttr({ id: navDoc._id, type: navDoc._type || "navigation", path }) : undefined);
  const findCol = (title) => (navDoc?.footerColumns || []).find((c) => c.title?.toLowerCase() === title);
  const companyCol = findCol("company");
  const resourcesCol = findCol("resources");

  const Col = ({ title, links, edit }) => (
    <div>
      <h6 {...(edit || {})}>{title}</h6>
      <ul>
        {links.map(([label, href, linkEdit]) => (
          <li key={href + label}><Link href={href} {...(linkEdit || {})}>{label}</Link></li>
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

          {companyCol ? (
            <Col title={companyCol.title} edit={navEdit(`footerColumns[_key=="${companyCol._key}"].title`)}
              links={(companyCol.links || [])
                // Same guard as HeaderV2: a link row an editor hasn't finished
                // typing yet has no href, and Presentation re-renders live.
                .filter((l) => l.label && l.href)
                .map((l) => [l.label, l.href, navEdit(`footerColumns[_key=="${companyCol._key}"].links[_key=="${l._key}"].label`)])} />
          ) : (
            <Col title="Company" links={[
              ["About Us", "/company"],
              ["Facilities", "/company#facilities"],
              ["Careers", "/careers"],
              ["Blog", "/blog"],
            ]} />
          )}

          <Col title="For" links={audiences.map((a) => [NAV(a.label).replace(/^For\s+/i, ""), `/${a.slug}`])} />

          <Col title="Capabilities" links={
            capabilities.length
              ? capabilities.map((c) => [NAV(c.title), `/capabilities#${c.slug}`])
              : [["Capabilities", "/capabilities"]]
          } />

          {resourcesCol ? (
            <Col title={resourcesCol.title} edit={navEdit(`footerColumns[_key=="${resourcesCol._key}"].title`)}
              links={(resourcesCol.links || [])
                .filter((l) => l.label && l.href)
                .map((l) => [l.label, l.href, navEdit(`footerColumns[_key=="${resourcesCol._key}"].links[_key=="${l._key}"].label`)])} />
          ) : (
            <Col title="Resources" links={[
              ["Products", "/products"],
              ["Sustainability", "/sustainability"],
              ["Why Indonesia", "/why-indonesia"],
            ]} />
          )}

          <div>
            <h6>Contact</h6>
            <ul>
              <li><span className="t-body">Jakarta Office, Indonesia</span></li>
              <li><span className="t-body">Foshan Office, China</span></li>
              {site.email ? <li><a href={`mailto:${site.email}`}>{site.email}</a></li> : null}
              <li style={{ marginTop: 10 }}>
                <Link className="btn btn-outline" style={{ padding: "9px 20px", fontSize: 13 }} href="/contact" {...(chrome("ctaLabel") || {})}>
                  {NAV(site.ctaLabel) || "Start Conversation"}
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
