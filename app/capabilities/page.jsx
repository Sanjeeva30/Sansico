export const revalidate = 30;
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import Strip from "@/components/Strip";
import { getCapabilities, getPageSettings, getPageSeo } from "@/lib/content";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  return getPageSeo("capabilities", {
    title: "Capabilities — Design, Manufacturing & Vendor Operations",
    description: "Design & creative studio, ten-facility manufacturing with an in-house ISO 17025 laboratory, and door-to-door vendor operations from sourcing to trade compliance."
  });
}

function RichBlocks({ blocks }) {
  if (!blocks?.length) return null;
  return blocks.map((b, i) => {
    const text = b.children?.map(c => c.text).join("") || "";
    if (b.style === "h2") return <h2 key={i}>{text}</h2>;
    if (b.style === "h3") return <h3 key={i}>{text}</h3>;
    if (b.style === "blockquote") return <blockquote key={i}>{text}</blockquote>;
    return <p key={i}>{text}</p>;
  });
}

const marks  = ["PP","PP","GCP","FS","IGP","IGP","IGP","IGP","IGP","SU"];
const colors = ["#22409E","#22409E","#0D4F31","#9C1F36","#7A0D20","#7A0D20","#7A0D20","#7A0D20","#7A0D20","#17120F"];

export default async function Capabilities() {
  const [caps, settings] = await Promise.all([getCapabilities(), getPageSettings("capabilities")]);
  if (!settings.visible) notFound();

  return (
    <>
      <Reveal />
      <PageHero kicker="Capabilities" title={caps.title} intro={caps.intro} />

      {caps.groups.map((g, i) => (
        <section
          key={g.slug}
          id={g.slug}
          className={`sec ${i % 2 ? "warm" : ""}`}
          style={g.colorHex ? { background: g.colorHex, color: "#fff" } : undefined}
        >
          <div className="wrap rv">
            {/* Hero image */}
            {g.imageUrl && (
              <img src={g.imageUrl} alt={g.title}
                style={{ width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: 8, marginBottom: 40 }} />
            )}

            <div className="split">
              <div className="prose">
                <p className="kicker">{g.num}</p>
                <h2>{g.title}</h2>
                {g.richBody?.length
                  ? <RichBlocks blocks={g.richBody} />
                  : <p>{g.body}</p>
                }
                {/* Proof points */}
                {g.proofPoints?.length > 0 && (
                  <div className="stats-row" style={{ marginTop: 32 }}>
                    {g.proofPoints.map((pt) => (
                      <div className="stat" key={pt.label}>
                        <b>{pt.value}</b><span>{pt.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Strip style={{ marginBottom: 26 }} />
                {/* Bullet points */}
                {g.points?.length > 0 && (
                  <ul className="points">
                    {g.points.map((pt) => <li key={pt}>{pt}</li>)}
                  </ul>
                )}
                {/* Sub-services */}
                {g.subServices?.length > 0 && (
                  <div style={{ marginTop: 28 }}>
                    <p className="kicker" style={{ marginBottom: 14 }}>Services</p>
                    {g.subServices.map((s) => (
                      <div key={s.title} style={{ marginBottom: 16 }}>
                        <b style={{ display: "block", marginBottom: 4 }}>{s.title}</b>
                        <p style={{ margin: 0, fontSize: 14.5, opacity: 0.8 }}>{s.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Customer logos */}
            {g.customerLogos?.length > 0 && (
              <div style={{ marginTop: 40 }}>
                <p className="kicker" style={{ marginBottom: 16 }}>Used by</p>
                <div className="logo-wall">
                  {g.customerLogos.map((c) => (
                    <div key={c.name} title={c.name}>
                      {c.logoUrl
                        ? <img src={c.logoUrl} alt={c.name}
                            style={{ maxHeight: 36, maxWidth: 110, objectFit: "contain", filter: "grayscale(1)", opacity: 0.7 }} />
                        : <span>{c.name}</span>
                      }
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {g.gallery?.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14, marginTop: 40 }}>
                {g.gallery.map((img, idx) => (
                  <figure key={idx} style={{ margin: 0 }}>
                    <img src={img.url} alt={img.caption || g.title}
                      style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 6 }} />
                    {img.caption && <figcaption style={{ fontSize: 12.5, marginTop: 6, opacity: 0.7 }}>{img.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      {/* Facilities */}
      <section className="sec">
        <div className="wrap rv">
          <div className="sec-head">
            <h2 className="kicker">Where we make</h2>
            <p className="lede">Ten facilities, Indonesia &amp; China</p>
          </div>
          <div className="fac-grid">
            {caps.facilities.map((f, i) => (
              <div className="fac" key={f.name}>
                {f.photoUrl
                  ? <img src={f.photoUrl} alt={f.name}
                      style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 6, marginBottom: 10 }} />
                  : <span className="mark" style={{ background: colors[i] }}>{marks[i]}</span>
                }
                <div>
                  <b>{f.name}</b>
                  <span>{f.location}</span>
                  <span className="focus">{f.focus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
