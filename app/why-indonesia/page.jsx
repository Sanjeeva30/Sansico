export const revalidate = 30;
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import Strip from "@/components/Strip";
import { getWhyIndonesia } from "@/lib/content";

export async function generateMetadata() {
  return {
    title: "Why Indonesia, Why Now — Indonesia Sourcing Intelligence Brief | Sansico Group",
    description: "A data-driven sourcing intelligence brief on Indonesia's manufacturing credentials for US retail senior leadership — cost, scale, materials, compliance and resilience.",
  };
}

const ACCENT = "#7A0D20";
const INK    = "#17120F";
const WARM   = "#FAF8F4";
const HAIR   = "#E5DFD8";

function SectionLabel({ number, children }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
      <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.14em",
        textTransform:"uppercase", color:ACCENT, background:`${ACCENT}15`,
        borderRadius:4, padding:"3px 10px" }}>
        {String(number).padStart(2,"0")}
      </span>
      <span style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em",
        textTransform:"uppercase", color:"var(--ink-soft,#6B5F58)" }}>
        {children}
      </span>
    </div>
  );
}

function Divider() {
  return <Strip style={{ marginBottom:0 }} />;
}

export default async function WhyIndonesia() {
  const d = await getWhyIndonesia();

  return (
    <>
      <Reveal />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{
        background: INK, color:"#fff",
        paddingTop:"clamp(100px,14vw,160px)",
        paddingBottom:"clamp(48px,6vw,80px)",
      }}>
        <div className="wrap rv">
          <p style={{ fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase",
            color:"rgba(255,255,255,0.45)", marginBottom:24 }}>
            Indonesia Sourcing Intelligence Brief · 2025–2026
          </p>
          <h1 style={{
            fontSize:"clamp(2.4rem,6vw,4.5rem)", fontWeight:300,
            lineHeight:1.08, margin:"0 0 24px",
            maxWidth:720, letterSpacing:"-0.02em",
          }}>
            {d.heroTitle?.split(",").map((part, i) => (
              <span key={i}>
                {i > 0 && <span style={{ color:ACCENT }}>,</span>}
                {i > 0 ? part : part}
              </span>
            )) || d.heroTitle}
          </h1>
          <p style={{ fontSize:14.5, color:"rgba(255,255,255,0.55)",
            maxWidth:560, lineHeight:1.6, margin:"0 0 56px" }}>
            {d.heroSubtitle}
          </p>

          {/* Stats row */}
          <div style={{ display:"grid",
            gridTemplateColumns:"repeat(auto-fit, minmax(140px,1fr))",
            gap:2, borderTop:`1px solid rgba(255,255,255,0.1)`,
            paddingTop:32 }}>
            {d.heroStats?.map((s) => (
              <div key={s.label} style={{ paddingRight:32, paddingBottom:8 }}>
                <div style={{ fontSize:"clamp(1.6rem,3vw,2.4rem)",
                  fontWeight:700, color:"#fff", lineHeight:1, marginBottom:8 }}>
                  {s.value}
                </div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)",
                  letterSpacing:"0.06em", textTransform:"uppercase" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <Divider />
      </section>

      {/* ── EXECUTIVE POSITION ─────────────────────────── */}
      <section className="sec">
        <div className="wrap rv">
          <SectionLabel number={1}>Executive Position</SectionLabel>
          <div className="split" style={{ marginBottom:48, alignItems:"start" }}>
            <div>
              <h2 style={{ fontSize:"clamp(1.4rem,2.5vw,2rem)", fontWeight:400,
                margin:"0 0 20px", lineHeight:1.25 }}>
                {d.executiveTitle}
              </h2>
            </div>
            <div>
              <p style={{ fontSize:16, lineHeight:1.7, color:"var(--ink-soft,#6B5F58)",
                margin:0 }}>
                {d.executiveIntro}
              </p>
            </div>
          </div>

          {/* 6 dimension cards */}
          <div style={{ display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))", gap:2,
            marginBottom:40 }}>
            {d.dimensions?.map((dim, i) => (
              <div key={dim.title} style={{
                padding:"28px 28px 32px",
                borderLeft:`3px solid ${ACCENT}`,
                background:i % 2 === 0 ? "#fff" : WARM,
              }}>
                <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em",
                  textTransform:"uppercase", color:ACCENT, margin:"0 0 10px" }}>
                  {dim.title}
                </p>
                <p style={{ fontSize:14.5, lineHeight:1.65, margin:0,
                  color:"var(--ink,#17120F)" }}>
                  {dim.body}
                </p>
              </div>
            ))}
          </div>

          {/* Positioning conclusion */}
          <div style={{ borderTop:`1px solid ${HAIR}`, paddingTop:32 }}>
            <p style={{ fontSize:16, lineHeight:1.75, fontStyle:"italic",
              color:"var(--ink-soft,#6B5F58)", maxWidth:760, margin:0 }}>
              <strong style={{ color:INK, fontStyle:"normal" }}>Positioning conclusion: </strong>
              {d.executiveConclusion}
            </p>
          </div>
        </div>
      </section>

      {/* ── ASEAN CONTEXT ──────────────────────────────── */}
      <section className="sec warm">
        <div className="wrap rv">
          <SectionLabel number={2}>ASEAN Peer Context</SectionLabel>
          <div className="split" style={{ alignItems:"start", gap:"clamp(32px,5vw,80px)" }}>
            <div>
              <h2 style={{ fontSize:"clamp(1.3rem,2.2vw,1.8rem)", fontWeight:400,
                margin:"0 0 24px", lineHeight:1.3 }}>
                {d.aseanTitle}
              </h2>
              <p style={{ fontSize:15.5, lineHeight:1.75, margin:"0 0 28px",
                color:"var(--ink,#17120F)" }}>
                {d.aseanBody}
              </p>
            </div>
            <div style={{ background:"#fff", borderRadius:8,
              padding:"clamp(24px,3vw,40px)",
              borderLeft:`4px solid ${ACCENT}` }}>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em",
                textTransform:"uppercase", color:ACCENT, margin:"0 0 14px" }}>
                Balanced conclusion
              </p>
              <p style={{ fontSize:17, lineHeight:1.7, fontStyle:"italic",
                margin:0, color:INK }}>
                "{d.aseanConclusion}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── JAVA GEOGRAPHY ─────────────────────────────── */}
      <section className="sec">
        <div className="wrap rv">
          <SectionLabel number={3}>Java Production Geography</SectionLabel>
          <div className="split" style={{ alignItems:"start", marginBottom:40,
            gap:"clamp(32px,5vw,80px)" }}>
            <div>
              <h2 style={{ fontSize:"clamp(1.3rem,2.2vw,1.8rem)", fontWeight:400,
                margin:"0 0 16px", lineHeight:1.3 }}>
                {d.javaTitle}
              </h2>
              <p style={{ fontSize:15.5, lineHeight:1.75, margin:0,
                color:"var(--ink-soft,#6B5F58)" }}>
                {d.javaIntro}
              </p>
            </div>
            <div style={{ padding:"28px 32px", background:WARM,
              borderRadius:8, alignSelf:"start" }}>
              <p style={{ fontSize:13, lineHeight:1.7, margin:0,
                color:"var(--ink-soft,#6B5F58)", fontStyle:"italic" }}>
                {d.javaPlatformNote}
              </p>
            </div>
          </div>

          {/* Region cards */}
          <div style={{ display:"flex", flexDirection:"column", gap:0,
            borderTop:`1px solid ${HAIR}` }}>
            {d.javaRegions?.map((r, i) => (
              <div key={r.name} style={{
                display:"grid",
                gridTemplateColumns:"200px 1fr",
                gap:24, padding:"24px 0",
                borderBottom:`1px solid ${HAIR}`,
                alignItems:"start"
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%",
                    background:ACCENT, flexShrink:0 }} />
                  <b style={{ fontSize:14, color:INK }}>{r.name}</b>
                </div>
                <p style={{ margin:0, fontSize:14.5, lineHeight:1.65,
                  color:"var(--ink-soft,#6B5F58)" }}>
                  {r.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIORITY SECTORS ───────────────────────────── */}
      <section className="sec warm">
        <div className="wrap rv">
          <SectionLabel number={4}>Priority Sectors</SectionLabel>
          <div className="split" style={{ alignItems:"start",
            gap:"clamp(32px,5vw,80px)" }}>
            <h2 style={{ fontSize:"clamp(1.3rem,2.2vw,1.8rem)", fontWeight:400,
              lineHeight:1.3, margin:0 }}>
              {d.sectorsTitle}
            </h2>
            <div>
              <p style={{ fontSize:15.5, lineHeight:1.75, margin:"0 0 28px",
                color:"var(--ink,#17120F)" }}>
                {d.sectorsBody}
              </p>
              <div style={{ padding:"20px 24px", background:`${ACCENT}0d`,
                borderLeft:`3px solid ${ACCENT}`, borderRadius:"0 6px 6px 0" }}>
                <p style={{ margin:0, fontSize:14.5, lineHeight:1.7,
                  fontStyle:"italic", color:INK }}>
                  {d.sectorsConclusion}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUSTAINABILITY ──────────────────────────────── */}
      <section className="sec">
        <div className="wrap rv">
          <SectionLabel number={5}>Sustainability &amp; ESG Direction</SectionLabel>
          <div className="split" style={{ alignItems:"start",
            gap:"clamp(32px,5vw,80px)", marginBottom:40 }}>
            <div>
              <h2 style={{ fontSize:"clamp(1.3rem,2.2vw,1.8rem)", fontWeight:400,
                margin:"0 0 20px", lineHeight:1.3 }}>
                {d.susTitle}
              </h2>
              <p style={{ fontSize:15.5, lineHeight:1.75, margin:0,
                color:"var(--ink,#17120F)" }}>
                {d.susBody}
              </p>
            </div>
            <div>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em",
                textTransform:"uppercase", color:"var(--green,#0D4F31)",
                margin:"0 0 20px" }}>
                Key policy anchors
              </p>
              <ul style={{ margin:0, padding:0, listStyle:"none",
                display:"flex", flexDirection:"column", gap:12 }}>
                {d.susPoints?.map((pt, i) => (
                  <li key={i} style={{ display:"flex", gap:12, alignItems:"start",
                    fontSize:14.5, lineHeight:1.6, color:INK }}>
                    <span style={{ color:"var(--green,#0D4F31)", flexShrink:0,
                      marginTop:2, fontWeight:700 }}>✓</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRADE ARCHITECTURE ─────────────────────────── */}
      <section className="sec warm">
        <div className="wrap rv">
          <SectionLabel number={6}>Trade Architecture</SectionLabel>
          <div style={{ marginBottom:40 }}>
            <h2 style={{ fontSize:"clamp(1.3rem,2.2vw,1.8rem)", fontWeight:400,
              margin:"0 0 20px", lineHeight:1.3, maxWidth:600 }}>
              {d.tradeTitle}
            </h2>
            <p style={{ fontSize:15.5, lineHeight:1.75, margin:0,
              color:"var(--ink-soft,#6B5F58)", maxWidth:680 }}>
              {d.tradeBody}
            </p>
          </div>
          <div style={{ display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(260px,1fr))", gap:16 }}>
            {d.tradeAgreements?.map((a) => (
              <div key={a.name} style={{ background:"#fff", borderRadius:8,
                padding:"28px 28px 32px",
                border:`1px solid ${HAIR}` }}>
                <p style={{ fontSize:20, fontWeight:700, color:INK,
                  margin:"0 0 12px" }}>
                  {a.name}
                </p>
                <p style={{ fontSize:14, lineHeight:1.65, margin:0,
                  color:"var(--ink-soft,#6B5F58)" }}>
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FIBER-BASED SEASONAL ───────────────────────── */}
      <section className="sec">
        <div className="wrap rv">
          <SectionLabel number={7}>Fiber-Based Seasonal Goods</SectionLabel>
          <div style={{ marginBottom:40 }}>
            <h2 style={{ fontSize:"clamp(1.3rem,2.2vw,1.8rem)", fontWeight:400,
              margin:"0 0 20px", lineHeight:1.3, maxWidth:640 }}>
              {d.fiberTitle}
            </h2>
            <p style={{ fontSize:15.5, lineHeight:1.75, margin:0,
              color:"var(--ink,#17120F)", maxWidth:680 }}>
              {d.fiberBody}
            </p>
          </div>
          <div style={{ display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))", gap:2 }}>
            {d.fiberPoints?.map((pt, i) => (
              <div key={pt.title} style={{
                padding:"28px 28px 32px",
                background:i % 2 === 0 ? WARM : "#fff",
                borderTop:`3px solid ${ACCENT}`
              }}>
                <p style={{ fontSize:13, fontWeight:700, letterSpacing:"0.06em",
                  textTransform:"uppercase", color:ACCENT, margin:"0 0 12px" }}>
                  {pt.title}
                </p>
                <p style={{ fontSize:14.5, lineHeight:1.65, margin:0,
                  color:INK }}>
                  {pt.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STRATEGIC CONCLUSION ───────────────────────── */}
      <section style={{ background:INK, color:"#fff",
        padding:"clamp(56px,8vw,100px) 0" }}>
        <div className="wrap rv">
          <SectionLabel number={8}>
            <span style={{ color:"rgba(255,255,255,0.4)" }}>Strategic Sourcing Implication</span>
          </SectionLabel>
          <p style={{ fontSize:"clamp(1.2rem,2.2vw,1.7rem)", fontWeight:300,
            lineHeight:1.6, color:"rgba(255,255,255,0.9)",
            maxWidth:760, margin:"0 0 48px" }}>
            {d.conclusionStatement}
          </p>
          <ul style={{ margin:0, padding:0, listStyle:"none",
            display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px,1fr))",
            gap:16 }}>
            {d.conclusionBullets?.map((b, i) => (
              <li key={i} style={{ display:"flex", gap:12, alignItems:"start" }}>
                <span style={{ color:ACCENT, flexShrink:0, fontWeight:700,
                  fontSize:18, marginTop:-2 }}>—</span>
                <span style={{ fontSize:14.5, lineHeight:1.6,
                  color:"rgba(255,255,255,0.75)" }}>
                  {b}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── SANSICO CTA ────────────────────────────────── */}
      <section className="sec warm">
        <div className="wrap rv" style={{ textAlign:"center",
          padding:"clamp(48px,7vw,80px) 0" }}>
          <Strip style={{ margin:"0 auto 32px" }} />
          <h2 style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:300,
            margin:"0 0 20px", lineHeight:1.2 }}>
            {d.ctaHeadline}
          </h2>
          <p style={{ fontSize:16, lineHeight:1.7, maxWidth:540,
            margin:"0 auto 36px", color:"var(--ink-soft,#6B5F58)" }}>
            {d.ctaSubline}
          </p>
          <Link href={d.ctaBtnHref || "/contact"}
            style={{ display:"inline-flex", alignItems:"center", gap:10,
              background:ACCENT, color:"#fff", borderRadius:999,
              padding:"16px 40px", fontSize:15, fontWeight:700,
              textDecoration:"none", letterSpacing:"0.01em" }}>
            {d.ctaBtnLabel} →
          </Link>
          <p style={{ marginTop:24, fontSize:12, color:"var(--hair,#C5B9B0)",
            letterSpacing:"0.08em", textTransform:"uppercase" }}>
            Sansico Group · Indonesia
          </p>
        </div>
      </section>
    </>
  );
}
