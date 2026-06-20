export const revalidate = 30;
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Image from "next/image";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import Strip from "@/components/Strip";
import { getCapabilities, getPageSettings, getPageSeo } from "@/lib/content";
import { getStyled } from "@/lib/styledText";
import StyledText from "@/components/StyledText";
import RichText from "@/components/RichText";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  return getPageSeo("capabilities", {
    title: "Capabilities — Design, Make, Deliver | Sansico Group",
    description: "Design & creative studio, ten-facility manufacturing with an in-house ISO 17025 laboratory, and door-to-door vendor operations from sourcing to trade compliance."
  });
}

// Fallback abbreviations and colours for facility badges
const FAC_MARKS  = ["PP","PP","GCP","GCP","FS","IGP","IGP","IGP","IGP","IGP","SU"];
const FAC_COLORS = ["#22409E","#22409E","#0D4F31","#0D4F31","#9C1F36","#7A0D20","#7A0D20","#7A0D20","#7A0D20","#7A0D20","#17120F"];

export default async function Capabilities() {
  const [caps, settings] = await Promise.all([getCapabilities(), getPageSettings("capabilities")]);
  if (!settings.visible) notFound();

  return (
    <>
      <Reveal />
      <PageHero kicker="Capabilities" title={caps.title} intro={caps.intro}
        heroType={settings.heroType} heroImageUrl={settings.heroImageUrl}
        heroVideoUrl={settings.heroVideoUrl} heroPosterUrl={settings.heroPosterUrl} />

      {caps.groups.map((g, i) => {
        const num = getStyled(g.num);
        const title = getStyled(g.title);
        const body = getStyled(g.body);
        return (
        <section key={g.slug} id={g.slug} className={`sec ${i % 2 ? "warm" : ""}`}>
          <div className="wrap rv">

            {/* ── Strip + full-width heading ── */}
            <div style={{ marginBottom: 48 }} data-animate>
              <Strip style={{ marginBottom: 20 }} />
              <p className="kicker" style={{ marginBottom: 8, ...num.style }}>{num.text}</p>
              <h2 style={{ margin: 0, fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", ...title.style }}>{title.text}</h2>
            </div>

            {/* ── Two-column: body LEFT, bullets RIGHT ── */}
            <div className="split" style={{ alignItems: "start" }} data-animate data-delay="1">

              {/* LEFT — body text */}
              <div className="prose">
                {g.richBody?.length
                  ? <RichText blocks={g.richBody} />
                  : <p style={body.style}>{body.text}</p>
                }
                {g.proofPoints?.length > 0 && (
                  <div className="stats-row" style={{ marginTop: 32 }}>
                    {g.proofPoints.map((pt, pi) => {
                      const ptValue = getStyled(pt.value);
                      const ptLabel = getStyled(pt.label);
                      return (
                        <div className="stat" key={ptLabel.text || pi}>
                          <b style={ptValue.style}>{ptValue.text}</b><span style={ptLabel.style}>{ptLabel.text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* RIGHT — bullet points + sub-services */}
              <div>
                {g.points?.length > 0 && (
                  <ul className="points">
                    {g.points.map((pt, pi) => {
                      const point = getStyled(pt);
                      return <li key={pi} style={{ color: "var(--ink)", ...point.style }}>{point.text}</li>;
                    })}
                  </ul>
                )}
                {g.subServices?.length > 0 && (
                  <div style={{ marginTop: g.points?.length ? 32 : 0 }}>
                    <p className="kicker" style={{ marginBottom: 14 }}>Services</p>
                    {g.subServices.map((s, si) => {
                      const sTitle = getStyled(s.title);
                      const sDesc = getStyled(s.description);
                      return (
                        <div key={si} style={{ marginBottom: 16 }}>
                          <b style={{ display: "block", marginBottom: 4, ...sTitle.style }}>{sTitle.text}</b>
                          <p style={{ margin: 0, fontSize: 14.5, opacity: 0.8, ...sDesc.style }}>{sDesc.text}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
                {g.customerLogos?.length > 0 && (
                  <div style={{ marginTop: 32 }}>
                    <p className="kicker" style={{ marginBottom: 16 }}>Used by</p>
                    <div className="logo-wall">
                      {g.customerLogos.map((cl, cli) => {
                        const clName = getStyled(cl.name);
                        return cl.logoUrl && (
                          <Image key={cli} src={cl.logoUrl} alt={clName.text}
                            width={80} height={28} style={{ objectFit:"contain", filter:"grayscale(1)", opacity:0.6 }} />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery */}
            {g.gallery?.length > 0 && (
              <div className="gallery" style={{ marginTop: 48 }}>
                {g.gallery.map((ph) => ph.url && (
                  <div key={ph.url} style={{ position:"relative", aspectRatio:"4/3", overflow:"hidden", borderRadius:6 }}>
                    <Image src={`${ph.url}?w=600&h=450&fit=crop&auto=format`}
                      alt={ph.caption || title.text} fill sizes="(max-width:768px) 100vw, 33vw"
                      style={{ objectFit:"cover" }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        );
      })}

      {/* ── Facilities ── */}
      {caps.facilities?.length > 0 && (
        <section className="sec warm">
          <div className="wrap rv">
            <div className="sec-head">
              <Link href="/company/facilities" style={{ cursor:"pointer" }}>
                <h2 className="kicker">Where we make ↗</h2>
              </Link>
              <p className="lede">Ten facilities, Indonesia &amp; China</p>
            </div>
            <div className="fac-grid">
              {caps.facilities.map((f, i) => (
                <div key={f.name} className="fac" data-animate>
                  {f.logoUrl ? (
                    <div style={{ width:56, height:56, borderRadius:12, overflow:"hidden",
                      background:"#f5f5f5", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Image src={f.logoUrl} alt={f.name} width={48} height={48}
                        style={{ objectFit:"contain" }} />
                    </div>
                  ) : f.photoUrl ? (
                    <div style={{ position:"relative", width:56, height:56, borderRadius:12,
                      overflow:"hidden", flexShrink:0 }}>
                      <Image src={`${f.photoUrl}?w=112&h=112&fit=crop&auto=format`}
                        alt={f.name} fill sizes="56px" style={{ objectFit:"cover" }} />
                    </div>
                  ) : (
                    <span className="mark"
                      style={{ background: FAC_COLORS[i % FAC_COLORS.length] }}>
                      {FAC_MARKS[i % FAC_MARKS.length]}
                    </span>
                  )}
                  <div>
                    <b>{f.name}</b>
                    <span>{f.city}</span>
                    {f.focus && <span className="focus">{f.focus}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
