export const revalidate = 30;
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import Strip from "@/components/Strip";
import { getCompany, getPageSettings, getPageSeo } from "@/lib/content";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  return getPageSeo("company", {
    title: "Company — Sansico Group",
    description: "Four decades of Indonesian manufacturing — our mission, vision, culture, values and facilities."
  });
}

const SANSI_COLORS = ["#7A0D20","#22409E","#0D4F31","#F3263E","#BDDA5F"];

function RichText({ blocks }) {
  if (!blocks?.length) return null;
  return blocks.map((b, i) => {
    const text = b.children?.map(c => c.text).join("") || "";
    if (b.style === "h3") return <h3 key={i}>{text}</h3>;
    return <p key={i}>{text}</p>;
  });
}

export default async function Company() {
  const [c, settings] = await Promise.all([getCompany(), getPageSettings("company")]);
  if (!settings.visible) notFound();

  return (
    <>
      <Reveal />
      <PageHero kicker="Company" title={c.title} intro={c.intro} />

      <section className="sec warm" style={{ padding:"clamp(40px,5vw,56px) 0" }}>
        <div className="wrap rv">
          <div style={{ marginBottom:"clamp(24px,3.5vw,36px)", paddingBottom:"clamp(24px,3.5vw,36px)", borderBottom:"1px solid var(--hair,#E5DFD8)" }}>
            <p style={{ fontSize:"clamp(1.8rem,3.5vw,2.4rem)", fontWeight:800, color:"#7A0D20", margin:"0 0 10px", lineHeight:1, fontFamily:"Georgia,serif" }}>Vision</p>
            <p style={{ fontSize:"clamp(1.1rem,2.2vw,1.5rem)", fontWeight:300, lineHeight:1.55, margin:0, color:"var(--ink,#17120F)", maxWidth:640 }}>{c.vision}</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1px 1fr", gap:"clamp(20px,3.5vw,48px)", alignItems:"start" }}>
            <div>
              <p style={{ fontSize:"clamp(1.8rem,3.5vw,2.4rem)", fontWeight:800, color:"#22409E", margin:"0 0 10px", lineHeight:1, fontFamily:"Georgia,serif" }}>Mission</p>
              <p style={{ fontSize:"clamp(0.95rem,1.5vw,1.1rem)", lineHeight:1.6, margin:0, color:"var(--ink,#17120F)", fontWeight:300, fontStyle:"italic" }}>{c.mission}</p>
            </div>
            <div style={{ background:"var(--hair,#E5DFD8)", alignSelf:"stretch", minHeight:60 }} />
            <div>
              <p style={{ fontSize:"clamp(1.8rem,3.5vw,2.4rem)", fontWeight:800, color:"#0D4F31", margin:"0 0 10px", lineHeight:1, fontFamily:"Georgia,serif" }}>Culture</p>
              <p style={{ fontSize:"clamp(0.95rem,1.5vw,1.1rem)", lineHeight:1.6, margin:0, color:"var(--ink,#17120F)", fontWeight:300 }}>{c.culture}</p>
            </div>
          </div>
        </div>
      </section>

      {c.values?.length > 0 && (
        <section className="sec" style={{ padding:"clamp(32px,4vw,48px) 0" }}>
          <div className="wrap rv">
            <p style={{ fontSize:"clamp(1.8rem,3.5vw,2.4rem)", fontWeight:800, color:"#17120F", margin:"0 0 20px", lineHeight:1, fontFamily:"Georgia,serif" }}>Our Values</p>
            <div style={{ borderTop:"1px solid var(--hair,#E5DFD8)" }}>
              {c.values.map((v, i) => {
                const initial = v.title?.[0] || "";
                const rest = v.title?.slice(1) || "";
                const color = SANSI_COLORS[i] || "#7A0D20";
                return (
                  <div key={v.title} style={{ display:"grid", gridTemplateColumns:"clamp(40px,5vw,56px) 1fr", gap:"clamp(14px,2vw,24px)", padding:"clamp(12px,1.8vw,18px) 0", borderBottom:"1px solid var(--hair,#E5DFD8)", alignItems:"center" }}>
                    <div style={{ fontSize:"clamp(1.8rem,3.5vw,2.4rem)", fontWeight:800, color, lineHeight:1, fontFamily:"Georgia,serif", userSelect:"none" }}>{initial}</div>
                    <div style={{ display:"flex", alignItems:"baseline", gap:"clamp(8px,1.5vw,16px)", flexWrap:"wrap" }}>
                      <h3 style={{ margin:0, fontSize:"clamp(0.95rem,1.4vw,1.05rem)", fontWeight:600, color:"var(--ink,#17120F)", lineHeight:1.2, flexShrink:0 }}>
                        <span style={{ color }}>{initial}</span>{rest}
                      </h3>
                      <p style={{ margin:0, fontSize:14, lineHeight:1.5, color:"#6B5F58" }}>{v.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {c.overviewBody?.length > 0 && (
        <section className="sec warm" style={{ padding:"clamp(28px,4vw,44px) 0" }}>
          <div className="wrap split rv">
            <div>{c.overviewTitle && <h2>{c.overviewTitle}</h2>}</div>
            <div className="prose"><RichText blocks={c.overviewBody} /></div>
          </div>
        </section>
      )}

      {c.timeline?.length > 0 && (
        <section className="sec" style={{ padding:"clamp(28px,4vw,44px) 0" }}>
          <div className="wrap rv">
            <p style={{ fontSize:10, fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9A8A80", margin:"0 0 20px" }}>Our Story</p>
            <div style={{ borderLeft:"2px solid var(--hair,#E5DFD8)" }}>
              {c.timeline.map((t) => (
                <div key={t.year} style={{ display:"flex", gap:20, paddingBottom:18, paddingLeft:20, position:"relative" }}>
                  <div style={{ position:"absolute", left:-5, top:4, width:8, height:8, borderRadius:"50%", background:"#7A0D20" }} />
                  <b style={{ color:"#7A0D20", minWidth:44, flexShrink:0, fontSize:13 }}>{t.year}</b>
                  <div>
                    <b style={{ display:"block", marginBottom:2, fontSize:14 }}>{t.event}</b>
                    {t.description && <p style={{ margin:0, opacity:0.7, fontSize:13 }}>{t.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {c.facilities?.length > 0 && (
        <section className="sec warm" style={{ padding:"clamp(28px,4vw,44px) 0" }}>
          <div className="wrap rv">
            <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:10 }}>
              <p style={{ fontSize:10, fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9A8A80", margin:0 }}>Our Facilities</p>
              <Link href="/company/facilities" style={{ fontSize:13, color:"#7A0D20", textDecoration:"none", fontWeight:600 }}>Full details →</Link>
            </div>
            <div className="fac-grid">
              {c.facilities.map((f) => (
                <div key={f.name} className="fac" style={{ flexDirection:"column" }}>
                  {f.photoUrl && (
                    <div style={{ position:"relative", width:"100%", aspectRatio:"16/9", overflow:"hidden", borderRadius:6, marginBottom:10 }}>
                      <Image src={`${f.photoUrl}?w=600&h=338&fit=crop&auto=format`} alt={f.name} fill sizes="(max-width:768px) 100vw, 50vw" style={{ objectFit:"cover" }} />
                    </div>
                  )}
                  <b style={{ fontSize:13 }}>{f.name}</b>
                  <span style={{ fontSize:12, color:"#9A8A80" }}>{f.city}</span>
                  {f.focus && <span className="focus" style={{ fontSize:11 }}>{f.focus}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="sec" style={{ padding:"clamp(24px,3.5vw,40px) 0" }}>
        <div className="wrap rv" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
          <div>
            <p style={{ fontSize:10, fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9A8A80", margin:"0 0 6px" }}>Leadership</p>
            <p style={{ fontSize:17, fontWeight:300, margin:0, color:"var(--ink,#17120F)" }}>The people behind the operations</p>
          </div>
          <Link href="/team" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#7A0D20", color:"#fff", borderRadius:999, padding:"11px 24px", fontSize:13, fontWeight:700, textDecoration:"none" }}>Meet the team →</Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
