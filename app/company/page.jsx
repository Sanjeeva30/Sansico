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

      <section className="sec" style={{ textAlign:"center", padding:"clamp(56px,7vw,88px) 0", borderBottom:"1px solid var(--hair,#E5DFD8)" }}>
        <div className="wrap rv">
          <Strip style={{ margin:"0 auto 32px" }} />
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9A8A80", margin:"0 0 24px" }}>Mission</p>
          <p style={{ fontSize:"clamp(1.3rem,2.8vw,2rem)", fontWeight:300, fontStyle:"italic", lineHeight:1.5, color:"var(--ink,#17120F)", maxWidth:640, margin:"0 auto" }}>
            {(c.mission || "").split("sustainably").map((part, i, arr) =>
              i < arr.length - 1
                ? <span key={i}>{part}<em style={{ fontStyle:"normal", color:"var(--crimson,#7A0D20)", fontWeight:600 }}>sustainably</em></span>
                : <span key={i}>{part}</span>
            )}
          </p>
        </div>
      </section>

      <section className="sec warm">
        <div className="wrap rv">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1px 1fr", gap:"clamp(24px,4vw,56px)", alignItems:"start" }}>
            <div>
              <p style={{ fontSize:10, fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--crimson,#7A0D20)", margin:"0 0 16px" }}>Vision</p>
              <p style={{ fontSize:"clamp(1rem,1.8vw,1.25rem)", lineHeight:1.7, margin:0, color:"var(--ink,#17120F)", fontWeight:300 }}>{c.vision}</p>
            </div>
            <div style={{ background:"var(--hair,#E5DFD8)", alignSelf:"stretch", minHeight:80 }} />
            <div>
              <p style={{ fontSize:10, fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--green,#0D4F31)", margin:"0 0 16px" }}>Culture</p>
              <p style={{ fontSize:"clamp(1rem,1.8vw,1.25rem)", lineHeight:1.7, margin:0, color:"var(--ink,#17120F)", fontWeight:300 }}>{c.culture}</p>
            </div>
          </div>
        </div>
      </section>

      {c.values?.length > 0 && (
        <section className="sec">
          <div className="wrap rv">
            <p style={{ fontSize:10, fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9A8A80", margin:"0 0 40px" }}>Our Values</p>
            <div style={{ borderTop:"1px solid var(--hair,#E5DFD8)" }}>
              {c.values.map((v) => {
                const initial = v.title?.[0] || "";
                const rest = v.title?.slice(1) || "";
                return (
                  <div key={v.title} style={{ display:"grid", gridTemplateColumns:"clamp(48px,7vw,72px) 1fr", gap:"clamp(16px,2.5vw,32px)", padding:"clamp(20px,3vw,32px) 0", borderBottom:"1px solid var(--hair,#E5DFD8)", alignItems:"start" }}>
                    <div style={{ fontSize:"clamp(2rem,5vw,3.2rem)", fontWeight:800, color:"var(--crimson,#7A0D20)", lineHeight:1, fontFamily:"var(--font-serif,Georgia,serif)", paddingTop:2, userSelect:"none" }}>{initial}</div>
                    <div>
                      <h3 style={{ margin:"0 0 6px", fontSize:"clamp(1rem,1.6vw,1.15rem)", fontWeight:600, color:"var(--ink,#17120F)", lineHeight:1.2 }}>
                        <span style={{ color:"var(--crimson,#7A0D20)" }}>{initial}</span>{rest}
                      </h3>
                      <p style={{ margin:0, fontSize:14.5, lineHeight:1.65, color:"#6B5F58" }}>{v.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p style={{ marginTop:20, fontSize:11, letterSpacing:"0.14em", color:"#C5B9B0", textAlign:"right" }}>{c.values.map(v => v.title?.[0]).join("")}</p>
          </div>
        </section>
      )}

      {c.overviewBody?.length > 0 && (
        <section className="sec warm">
          <div className="wrap split rv">
            <div>{c.overviewTitle && <h2>{c.overviewTitle}</h2>}</div>
            <div className="prose"><RichText blocks={c.overviewBody} /></div>
          </div>
        </section>
      )}

      {c.timeline?.length > 0 && (
        <section className="sec warm">
          <div className="wrap rv">
            <p style={{ fontSize:10, fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9A8A80", margin:"0 0 36px" }}>Our Story</p>
            <div style={{ borderLeft:"2px solid var(--hair,#E5DFD8)" }}>
              {c.timeline.map((t) => (
                <div key={t.year} style={{ display:"flex", gap:28, paddingBottom:28, paddingLeft:24, position:"relative" }}>
                  <div style={{ position:"absolute", left:-5, top:4, width:8, height:8, borderRadius:"50%", background:"var(--crimson,#7A0D20)" }} />
                  <b style={{ color:"var(--crimson,#7A0D20)", minWidth:48, flexShrink:0, fontSize:14 }}>{t.year}</b>
                  <div>
                    <b style={{ display:"block", marginBottom:4, fontSize:15 }}>{t.event}</b>
                    {t.description && <p style={{ margin:0, opacity:0.7, fontSize:14 }}>{t.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {c.facilities?.length > 0 && (
        <section className="sec">
          <div className="wrap rv">
            <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:32, flexWrap:"wrap", gap:12 }}>
              <p style={{ fontSize:10, fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9A8A80", margin:0 }}>Our Facilities</p>
              <Link href="/company/facilities" style={{ fontSize:13, color:"var(--crimson,#7A0D20)", textDecoration:"none", fontWeight:600 }}>Full facility details →</Link>
            </div>
            <div className="fac-grid">
              {c.facilities.map((f) => (
                <div key={f.name} className="fac" style={{ flexDirection:"column" }}>
                  {f.photoUrl && (
                    <div style={{ position:"relative", width:"100%", aspectRatio:"16/9", overflow:"hidden", borderRadius:6, marginBottom:12 }}>
                      <Image src={`${f.photoUrl}?w=600&h=338&fit=crop&auto=format`} alt={f.name} fill sizes="(max-width:768px) 100vw, 50vw" style={{ objectFit:"cover" }} />
                    </div>
                  )}
                  <b style={{ fontSize:14 }}>{f.name}</b>
                  <span style={{ fontSize:13, color:"#9A8A80" }}>{f.city}</span>
                  {f.focus && <span className="focus" style={{ fontSize:12 }}>{f.focus}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="sec warm">
        <div className="wrap rv" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div>
            <p style={{ fontSize:10, fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9A8A80", margin:"0 0 8px" }}>Leadership</p>
            <p style={{ fontSize:18, fontWeight:300, margin:0, color:"var(--ink,#17120F)" }}>The people behind the operations</p>
          </div>
          <Link href="/team" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"var(--crimson,#7A0D20)", color:"#fff", borderRadius:999, padding:"12px 28px", fontSize:14, fontWeight:700, textDecoration:"none" }}>Meet the team →</Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
