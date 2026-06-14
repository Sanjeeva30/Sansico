export const revalidate = 30;
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Strip from "@/components/Strip";
import CtaBand from "@/components/CtaBand";
import { getWhyIndonesia } from "@/lib/content";

export async function generateMetadata() {
  return {
    title: "Why Indonesia, Why Now — Indonesia Sourcing Intelligence Brief | Sansico Group",
    description: "A data-driven sourcing intelligence brief on Indonesia's manufacturing credentials for US retail — cost, scale, materials, compliance and resilience across ASEAN.",
  };
}

// ── Score cell colour mapping — brand palette ─────────────
function scoreStyle(score, isIndonesia = false) {
  const base = {
    5: { bg: "rgba(122,13,32,0.10)", color: "#7A0D20", fw: 700 },
    4: { bg: "rgba(34,64,158,0.09)", color: "#22409E", fw: 700 },
    3: { bg: "rgba(189,218,95,0.30)", color: "#4A5C00", fw: 600 },
    2: { bg: "#F5EFE6",              color: "#8C7B6E", fw: 400 },
    1: { bg: "#FAF8F4",              color: "#B0A090", fw: 400 },
  }[score] || { bg: "#fff", color: "#333", fw: 400 };
  if (isIndonesia) return {
    ...base,
    bg: base.bg.replace("0.10","0.18").replace("0.09","0.16").replace("0.30","0.45")
  };
  return base;
}

// ── Section label pill ────────────────────────────────────
function Label({ n, children }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
      <span style={{ fontSize:10, fontWeight:800, letterSpacing:"0.15em",
        textTransform:"uppercase", color:"#7A0D20",
        background:"rgba(122,13,32,0.08)", borderRadius:4,
        padding:"3px 9px" }}>{String(n).padStart(2,"0")}</span>
      <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em",
        textTransform:"uppercase", color:"#9A8A80" }}>{children}</span>
    </div>
  );
}

// ── Scorecard data (hardcoded — research data) ────────────
const SCORECARD_HEADERS = ["Cost corridor","Scale","Materials","Infrastructure","Compliance","Trade risk","Total"];
const SCORECARD_ROWS = [
  { country:"Indonesia", star:true,  scores:[4,5,5,4,4,4], total:26 },
  { country:"Vietnam",   star:false, scores:[4,4,3,4,3,2], total:20 },
  { country:"Cambodia",  star:false, scores:[5,2,1,2,3,3], total:16 },
  { country:"Thailand",  star:false, scores:[2,3,3,5,4,4], total:21 },
  { country:"Malaysia",  star:false, scores:[2,3,4,5,4,4], total:22 },
  { country:"Philippines",star:false,scores:[3,2,2,3,3,4], total:17 },
];
const SCORE_LEGEND = [
  { score:5, label:"Strongest" },
  { score:4, label:"Strong" },
  { score:3, label:"Moderate" },
  { score:2, label:"Limited" },
  { score:1, label:"Weakest" },
];

export default async function WhyIndonesia() {
  const d = await getWhyIndonesia();

  // Group sources by category
  const sourcesGrouped = {};
  (d.sources || []).forEach((s) => {
    const cat = s.category || "Other";
    if (!sourcesGrouped[cat]) sourcesGrouped[cat] = [];
    sourcesGrouped[cat].push(s);
  });

  return (
    <>
      <Reveal />

      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{ background:"var(--paper,#FAF8F4)",
        paddingTop:"clamp(100px,14vw,160px)",
        paddingBottom:"clamp(40px,5vw,64px)",
        borderBottom:"1px solid var(--hair,#E5DFD8)" }}>
        <div className="wrap rv">
          {/* Brand strip at top */}
          <Strip style={{ marginBottom:32 }} />

          <p style={{ fontSize:11, letterSpacing:"0.14em",
            textTransform:"uppercase", color:"#9A8A80",
            margin:"0 0 20px" }}>
            Indonesia Sourcing Intelligence Brief · 2025–2026
          </p>

          <h1 style={{ fontSize:"clamp(2.4rem,5.5vw,4rem)",
            fontWeight:300, lineHeight:1.1,
            margin:"0 0 20px", letterSpacing:"-0.02em",
            color:"var(--ink,#17120F)", maxWidth:680 }}>
            {d.heroTitle}
          </h1>

          <p style={{ fontSize:15, color:"#9A8A80", maxWidth:540,
            lineHeight:1.65, margin:"0 0 48px" }}>
            {d.heroSubtitle}
          </p>

          {/* Stats bar */}
          <div style={{ display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",
            gap:0, borderTop:"1px solid var(--hair,#E5DFD8)" }}>
            {d.heroStats?.map((s, i) => (
              <div key={s.label} style={{
                padding:"24px 0 20px",
                borderRight: i < d.heroStats.length-1
                  ? "1px solid var(--hair,#E5DFD8)" : "none",
                paddingRight:24, paddingLeft: i > 0 ? 24 : 0
              }}>
                <div style={{ fontSize:"clamp(1.5rem,2.5vw,2rem)",
                  fontWeight:700, color:"#7A0D20",
                  lineHeight:1, marginBottom:6 }}>
                  {s.value}
                </div>
                <div style={{ fontSize:11, color:"#9A8A80",
                  letterSpacing:"0.07em", textTransform:"uppercase" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXECUTIVE POSITION ──────────────────────── */}
      <section className="sec">
        <div className="wrap rv">
          <Label n={1}>Executive Position</Label>
          <div className="split" style={{ marginBottom:40, alignItems:"start" }}>
            <h2 style={{ fontSize:"clamp(1.3rem,2.2vw,1.8rem)",
              fontWeight:400, lineHeight:1.3, margin:0 }}>
              {d.executiveTitle}
            </h2>
            <p style={{ fontSize:15.5, lineHeight:1.75, margin:0,
              color:"#6B5F58" }}>
              {d.executiveIntro}
            </p>
          </div>

          {/* Six dimension cards */}
          <div style={{ display:"grid",
            gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",
            gap:0, border:"1px solid var(--hair,#E5DFD8)" }}>
            {d.dimensions?.map((dim, i) => (
              <div key={dim.title} style={{
                padding:"24px 24px 28px",
                borderRight: (i+1) % 2 === 0
                  ? "none" : "1px solid var(--hair,#E5DFD8)",
                borderBottom:"1px solid var(--hair,#E5DFD8)",
                background:"#fff"
              }}>
                <div style={{ display:"flex", alignItems:"center",
                  gap:8, marginBottom:10 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%",
                    background:"#7A0D20", flexShrink:0 }} />
                  <b style={{ fontSize:12, fontWeight:700,
                    letterSpacing:"0.08em", textTransform:"uppercase",
                    color:"#7A0D20" }}>
                    {dim.title}
                  </b>
                </div>
                <p style={{ fontSize:14, lineHeight:1.65, margin:0,
                  color:"#17120F" }}>
                  {dim.body}
                </p>
              </div>
            ))}
          </div>

          {/* Conclusion */}
          <div style={{ marginTop:32, padding:"20px 24px",
            background:"rgba(122,13,32,0.05)",
            borderLeft:"3px solid #7A0D20", borderRadius:"0 6px 6px 0" }}>
            <p style={{ fontSize:15, lineHeight:1.75, margin:0,
              fontStyle:"italic", color:"#17120F" }}>
              <strong style={{ fontStyle:"normal", color:"#7A0D20" }}>
                Positioning conclusion:{" "}
              </strong>
              {d.executiveConclusion}
            </p>
          </div>
        </div>
      </section>

      {/* ── ASEAN CONTEXT ──────────────────────────── */}
      <section className="sec warm">
        <div className="wrap rv">
          <Label n={2}>ASEAN Peer Context</Label>
          <div className="split" style={{ alignItems:"start",
            gap:"clamp(32px,5vw,72px)" }}>
            <div>
              <h2 style={{ fontSize:"clamp(1.3rem,2.2vw,1.8rem)",
                fontWeight:400, lineHeight:1.3, margin:"0 0 20px" }}>
                {d.aseanTitle}
              </h2>
              <p style={{ fontSize:15, lineHeight:1.78, margin:0,
                color:"#17120F" }}>
                {d.aseanBody}
              </p>
            </div>
            <div style={{ background:"#fff", borderRadius:8,
              padding:"28px 28px 32px",
              border:"1px solid var(--hair,#E5DFD8)",
              borderTop:"3px solid #7A0D20" }}>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em",
                textTransform:"uppercase", color:"#7A0D20",
                margin:"0 0 12px" }}>
                Balanced conclusion
              </p>
              <p style={{ fontSize:16, lineHeight:1.7, fontStyle:"italic",
                margin:0, color:"#17120F" }}>
                "{d.aseanConclusion}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ASEAN COP SCORECARD ─────────────────────── */}
      <section className="sec">
        <div className="wrap rv">
          <Label n={3}>ASEAN COP Scorecard</Label>
          <h2 style={{ fontSize:"clamp(1.3rem,2.2vw,1.8rem)",
            fontWeight:400, lineHeight:1.3, margin:"0 0 8px" }}>
            Risk-adjusted balanced sourcing value
          </h2>
          <p style={{ fontSize:14, color:"#9A8A80", fontStyle:"italic",
            margin:"0 0 28px" }}>
            Indonesia scores strongest overall
          </p>

          {/* Legend */}
          <div style={{ display:"flex", gap:20, flexWrap:"wrap",
            marginBottom:20 }}>
            {SCORE_LEGEND.map(({ score, label }) => {
              const s = scoreStyle(score);
              return (
                <div key={score} style={{ display:"flex",
                  alignItems:"center", gap:6 }}>
                  <div style={{ width:20, height:20, borderRadius:4,
                    background:s.bg, display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:11, fontWeight:s.fw,
                    color:s.color }}>
                    {score}
                  </div>
                  <span style={{ fontSize:12, color:"#9A8A80" }}>
                    — {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Table — responsive wrapper */}
          <div style={{ overflowX:"auto", borderRadius:8,
            border:"1px solid var(--hair,#E5DFD8)" }}>
            <table style={{ width:"100%", borderCollapse:"collapse",
              minWidth:640, fontFamily:"inherit" }}>
              <thead>
                <tr style={{ background:"#17120F" }}>
                  <th style={{ padding:"12px 16px", textAlign:"left",
                    fontSize:11, fontWeight:700, letterSpacing:"0.08em",
                    textTransform:"uppercase", color:"#fff",
                    borderRight:"1px solid rgba(255,255,255,0.1)" }}>
                    Country
                  </th>
                  {SCORECARD_HEADERS.map((h) => (
                    <th key={h} style={{ padding:"12px 12px",
                      textAlign:"center", fontSize:10, fontWeight:700,
                      letterSpacing:"0.07em", textTransform:"uppercase",
                      color:"rgba(255,255,255,0.8)",
                      borderRight:"1px solid rgba(255,255,255,0.1)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SCORECARD_ROWS.map((row, ri) => {
                  const isIndo = row.star;
                  return (
                    <tr key={row.country} style={{
                      background: isIndo ? "rgba(122,13,32,0.04)" : (ri % 2 ? "#FAF8F4" : "#fff"),
                      borderBottom:"1px solid var(--hair,#E5DFD8)"
                    }}>
                      {/* Country name */}
                      <td style={{ padding:"12px 16px",
                        fontSize:14, fontWeight: isIndo ? 700 : 400,
                        color: isIndo ? "#7A0D20" : "#17120F",
                        borderRight:"1px solid var(--hair,#E5DFD8)",
                        whiteSpace:"nowrap" }}>
                        {row.country}{row.star ? " ★" : ""}
                      </td>
                      {/* Score cells */}
                      {row.scores.map((score, si) => {
                        const s = scoreStyle(score, isIndo);
                        return (
                          <td key={si} style={{ padding:"10px 12px",
                            textAlign:"center",
                            borderRight:"1px solid var(--hair,#E5DFD8)" }}>
                            <span style={{ display:"inline-flex",
                              alignItems:"center", justifyContent:"center",
                              width:28, height:28, borderRadius:6,
                              background:s.bg, fontSize:13,
                              fontWeight:s.fw, color:s.color }}>
                              {score}
                            </span>
                          </td>
                        );
                      })}
                      {/* Total */}
                      <td style={{ padding:"10px 12px", textAlign:"center" }}>
                        <span style={{ display:"inline-flex",
                          alignItems:"center", justifyContent:"center",
                          width:36, height:28, borderRadius:6,
                          background: isIndo ? "#7A0D20" : "var(--hair,#E5DFD8)",
                          fontSize:13, fontWeight:700,
                          color: isIndo ? "#fff" : "#17120F" }}>
                          {row.total}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Vietnam NME note */}
          {d.scorecardVietnamNote && (
            <p style={{ fontSize:13.5, lineHeight:1.7, margin:"20px 0 0",
              color:"#6B5F58" }}>
              <strong>Vietnam NME risk</strong>{" "}
              {d.scorecardVietnamNote.replace("Vietnam NME risk as a sourcing consideration: ","")}
            </p>
          )}

          {/* Balanced conclusion */}
          {d.scorecardConclusion && (
            <div style={{ marginTop:16, padding:"16px 20px",
              background:"rgba(122,13,32,0.05)",
              borderLeft:"3px solid #7A0D20",
              borderRadius:"0 6px 6px 0" }}>
              <p style={{ margin:0, fontSize:14, lineHeight:1.7,
                fontStyle:"italic", color:"#17120F" }}>
                <strong style={{ fontStyle:"normal" }}>Balanced conclusion: </strong>
                {d.scorecardConclusion}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── JAVA GEOGRAPHY ─────────────────────────── */}
      <section className="sec warm">
        <div className="wrap rv">
          <Label n={4}>Java Production Geography</Label>
          <div className="split" style={{ alignItems:"start",
            gap:"clamp(32px,5vw,72px)", marginBottom:36 }}>
            <div>
              <h2 style={{ fontSize:"clamp(1.3rem,2.2vw,1.8rem)",
                fontWeight:400, lineHeight:1.3, margin:"0 0 16px" }}>
                {d.javaTitle}
              </h2>
              <p style={{ fontSize:15, lineHeight:1.75, margin:0,
                color:"#6B5F58" }}>
                {d.javaIntro}
              </p>
            </div>
            <div style={{ padding:"20px 24px", background:"#fff",
              border:"1px solid var(--hair,#E5DFD8)", borderRadius:8 }}>
              <p style={{ fontSize:13.5, lineHeight:1.7, margin:0,
                color:"#6B5F58", fontStyle:"italic" }}>
                {d.javaPlatformNote}
              </p>
            </div>
          </div>

          {/* Region rows */}
          <div style={{ borderTop:"1px solid var(--hair,#E5DFD8)" }}>
            {d.javaRegions?.map((r, i) => (
              <div key={r.name} style={{ display:"grid",
                gridTemplateColumns:"clamp(160px,25%,220px) 1fr",
                gap:24, padding:"18px 0",
                borderBottom:"1px solid var(--hair,#E5DFD8)",
                alignItems:"start" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%",
                    background:"#7A0D20", flexShrink:0 }} />
                  <b style={{ fontSize:13, color:"#17120F" }}>{r.name}</b>
                </div>
                <p style={{ margin:0, fontSize:14, lineHeight:1.65,
                  color:"#6B5F58" }}>
                  {r.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIORITY SECTORS ────────────────────────── */}
      <section className="sec">
        <div className="wrap rv">
          <Label n={5}>Priority Sectors</Label>
          <div className="split" style={{ alignItems:"start",
            gap:"clamp(32px,5vw,72px)" }}>
            <h2 style={{ fontSize:"clamp(1.3rem,2.2vw,1.8rem)",
              fontWeight:400, lineHeight:1.3, margin:0 }}>
              {d.sectorsTitle}
            </h2>
            <div>
              <p style={{ fontSize:15, lineHeight:1.78,
                margin:"0 0 24px", color:"#17120F" }}>
                {d.sectorsBody}
              </p>
              <div style={{ padding:"16px 20px",
                background:"rgba(122,13,32,0.05)",
                borderLeft:"3px solid #7A0D20",
                borderRadius:"0 6px 6px 0" }}>
                <p style={{ margin:0, fontSize:14.5, lineHeight:1.7,
                  fontStyle:"italic", color:"#17120F" }}>
                  {d.sectorsConclusion}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUSTAINABILITY ──────────────────────────── */}
      <section className="sec warm">
        <div className="wrap rv">
          <Label n={6}>Sustainability &amp; ESG Direction</Label>
          <div className="split" style={{ alignItems:"start",
            gap:"clamp(32px,5vw,72px)" }}>
            <div>
              <h2 style={{ fontSize:"clamp(1.3rem,2.2vw,1.8rem)",
                fontWeight:400, lineHeight:1.3, margin:"0 0 20px" }}>
                {d.susTitle}
              </h2>
              <p style={{ fontSize:15, lineHeight:1.78, margin:0,
                color:"#17120F" }}>
                {d.susBody}
              </p>
            </div>
            <div>
              <p style={{ fontSize:11, fontWeight:700,
                letterSpacing:"0.1em", textTransform:"uppercase",
                color:"var(--green,#0D4F31)", margin:"0 0 16px" }}>
                Key policy anchors
              </p>
              <ul style={{ margin:0, padding:0, listStyle:"none",
                display:"flex", flexDirection:"column", gap:10 }}>
                {d.susPoints?.map((pt, i) => (
                  <li key={i} style={{ display:"flex", gap:10,
                    alignItems:"start", fontSize:14, lineHeight:1.65,
                    color:"#17120F" }}>
                    <span style={{ color:"var(--green,#0D4F31)",
                      flexShrink:0, fontWeight:700, marginTop:1 }}>
                      ✓
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRADE ARCHITECTURE ─────────────────────── */}
      <section className="sec">
        <div className="wrap rv">
          <Label n={7}>Trade Architecture &amp; Market Access</Label>
          <div style={{ marginBottom:32 }}>
            <h2 style={{ fontSize:"clamp(1.3rem,2.2vw,1.8rem)",
              fontWeight:400, lineHeight:1.3, margin:"0 0 16px",
              maxWidth:580 }}>
              {d.tradeTitle}
            </h2>
            <p style={{ fontSize:15, lineHeight:1.78, margin:0,
              color:"#6B5F58", maxWidth:640 }}>
              {d.tradeBody}
            </p>
          </div>
          <div style={{ display:"grid",
            gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",
            gap:1, background:"var(--hair,#E5DFD8)" }}>
            {d.tradeAgreements?.map((a) => (
              <div key={a.name} style={{ background:"#fff",
                padding:"24px 24px 28px" }}>
                <p style={{ fontSize:18, fontWeight:700,
                  color:"#17120F", margin:"0 0 10px" }}>
                  {a.name}
                </p>
                <p style={{ fontSize:13.5, lineHeight:1.65,
                  margin:0, color:"#6B5F58" }}>
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FIBER-BASED SEASONAL ────────────────────── */}
      <section className="sec warm">
        <div className="wrap rv">
          <Label n={8}>Fiber-Based Seasonal Goods</Label>
          <div style={{ marginBottom:32 }}>
            <h2 style={{ fontSize:"clamp(1.3rem,2.2vw,1.8rem)",
              fontWeight:400, lineHeight:1.3, margin:"0 0 16px",
              maxWidth:600 }}>
              {d.fiberTitle}
            </h2>
            <p style={{ fontSize:15, lineHeight:1.78, margin:0,
              color:"#17120F", maxWidth:640 }}>
              {d.fiberBody}
            </p>
          </div>
          <div style={{ display:"grid",
            gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",
            gap:16 }}>
            {d.fiberPoints?.map((pt, i) => (
              <div key={pt.title} style={{ padding:"20px 20px 24px",
                background:"#fff", borderRadius:8,
                border:"1px solid var(--hair,#E5DFD8)",
                borderTop:`2px solid ${["#7A0D20","#22409E","#0D4F31"][i]}` }}>
                <p style={{ fontSize:12, fontWeight:700,
                  letterSpacing:"0.07em", textTransform:"uppercase",
                  color:["#7A0D20","#22409E","#0D4F31"][i],
                  margin:"0 0 10px" }}>
                  {pt.title}
                </p>
                <p style={{ fontSize:14, lineHeight:1.65,
                  margin:0, color:"#17120F" }}>
                  {pt.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STRATEGIC CONCLUSION ────────────────────── */}
      <section className="sec">
        <div className="wrap rv">
          <Label n={9}>Strategic Sourcing Implication</Label>
          <Strip style={{ marginBottom:32 }} />
          <p style={{ fontSize:"clamp(1.1rem,2vw,1.5rem)",
            fontWeight:300, fontStyle:"italic",
            lineHeight:1.65, color:"#17120F",
            maxWidth:780, margin:"0 0 40px" }}>
            "{d.conclusionStatement}"
          </p>
          <ul style={{ margin:0, padding:0, listStyle:"none",
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",
            gap:12 }}>
            {d.conclusionBullets?.map((b, i) => (
              <li key={i} style={{ display:"flex", gap:10,
                alignItems:"start" }}>
                <span style={{ color:"#7A0D20", flexShrink:0,
                  fontWeight:700, fontSize:16, marginTop:-1 }}>—</span>
                <span style={{ fontSize:14.5, lineHeight:1.6,
                  color:"#6B5F58" }}>
                  {b}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── SANSICO CTA ─────────────────────────────── */}
      <section className="sec warm"
        style={{ borderTop:"1px solid var(--hair,#E5DFD8)" }}>
        <div className="wrap rv" style={{ textAlign:"center",
          padding:"clamp(48px,6vw,72px) 0" }}>
          <Strip style={{ margin:"0 auto 28px" }} />
          <h2 style={{ fontSize:"clamp(1.6rem,3vw,2.4rem)",
            fontWeight:300, margin:"0 0 16px", color:"#17120F" }}>
            {d.ctaHeadline}
          </h2>
          <p style={{ fontSize:15.5, lineHeight:1.7, maxWidth:480,
            margin:"0 auto 32px", color:"#6B5F58" }}>
            {d.ctaSubline}
          </p>
          <Link href={d.ctaBtnHref || "/contact"}
            style={{ display:"inline-flex", alignItems:"center", gap:10,
              background:"#7A0D20", color:"#fff", borderRadius:999,
              padding:"14px 36px", fontSize:15, fontWeight:700,
              textDecoration:"none" }}>
            {d.ctaBtnLabel} →
          </Link>
          <p style={{ marginTop:20, fontSize:11, color:"#C5B9B0",
            letterSpacing:"0.1em", textTransform:"uppercase" }}>
            Sansico Group · Indonesia
          </p>
        </div>
      </section>

      {/* ── SOURCES ─────────────────────────────────── */}
      {d.sources?.length > 0 && (
        <section style={{ background:"#FAF8F4",
          borderTop:"1px solid var(--hair,#E5DFD8)",
          padding:"clamp(40px,5vw,64px) 0" }}>
          <div className="wrap rv">
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em",
              textTransform:"uppercase", color:"#9A8A80",
              margin:"0 0 28px" }}>
              Sources &amp; References
            </p>
            {Object.entries(sourcesGrouped).map(([cat, items]) => (
              <div key={cat} style={{ marginBottom:28 }}>
                <p style={{ fontSize:10, fontWeight:700,
                  letterSpacing:"0.12em", textTransform:"uppercase",
                  color:"#7A0D20", margin:"0 0 10px" }}>
                  {cat}
                </p>
                <div style={{ display:"grid",
                  gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",
                  gap:"4px 24px" }}>
                  {items.map((s, i) => (
                    <div key={i} style={{ fontSize:12, lineHeight:1.5 }}>
                      {s.url ? (
                        <a href={s.url} target="_blank" rel="noopener noreferrer"
                          style={{ color:"#7A0D20", textDecoration:"none",
                            borderBottom:"1px solid rgba(122,13,32,0.2)" }}>
                          {s.label}
                        </a>
                      ) : (
                        <span style={{ color:"#9A8A80" }}>{s.label}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <p style={{ fontSize:11, color:"#B0A090", margin:"24px 0 0",
              lineHeight:1.6 }}>
              All sources are public and were accessed between 2024 and 2026.
              Exchange-rate conversions are indicative. Legal or tax items
              require professional verification.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
