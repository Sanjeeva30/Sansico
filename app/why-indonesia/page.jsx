export const revalidate = 30;
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Strip from "@/components/Strip";
import CtaBand from "@/components/CtaBand";
import { getWhyIndonesia } from "@/lib/content";
import { InkBands } from "@/components/Hero";

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

      {/* ── HERO: Indonesia map · flag · brand ─────────── */}
      <section style={{
        position:"relative", overflow:"hidden",
        background:"linear-gradient(150deg,#060A10 0%,#0C1220 45%,#070B14 100%)",
        paddingTop:"clamp(96px,13vw,152px)",
        paddingBottom:"clamp(72px,9vw,108px)"
      }}>

        {/* Flag stripe — right edge, red top / white bottom */}
        <div aria-hidden="true" style={{
          position:"absolute", right:0, top:0, bottom:0, width:12, zIndex:5,
          background:"linear-gradient(to bottom,#CE1126 50%,#F5F5F0 50%)"
        }}/>
        {/* Flag diagonal wash — right 42% */}
        <div aria-hidden="true" style={{
          position:"absolute", right:0, top:0, bottom:0, width:"42%", zIndex:1,
          background:"linear-gradient(to bottom,rgba(206,17,38,0.06) 50%,rgba(245,245,240,0.03) 50%)",
          clipPath:"polygon(8% 0,100% 0,100% 100%,0 100%)"
        }}/>
        {/* Thin flag midline */}
        <div aria-hidden="true" style={{
          position:"absolute", right:12, top:"50%", width:"38%", height:"1px", zIndex:3,
          background:"linear-gradient(to right,transparent,rgba(206,17,38,0.4) 30%,rgba(245,245,240,0.3) 50%,transparent)"
        }}/>

        {/* Indonesia archipelago SVG watermark */}
        <svg aria-hidden="true" viewBox="0 0 1080 300"
          preserveAspectRatio="xMaxYMid meet"
          style={{
            position:"absolute", right:"-2%", top:"50%",
            transform:"translateY(-50%)",
            width:"65%", height:"90%", zIndex:2, pointerEvents:"none"
          }}>
          <defs>
            <linearGradient id="ig" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#CE1126" stopOpacity="0.22"/>
              <stop offset="55%"  stopColor="#CE1126" stopOpacity="0.13"/>
              <stop offset="100%" stopColor="#CE1126" stopOpacity="0.04"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* lat/lon grid */}
          <g stroke="#fff" strokeOpacity="0.05" strokeWidth="0.6" fill="none">
            {[60,120,180,240].map(y=><line key={y} x1="0" y1={y} x2="1080" y2={y}/>)}
            {[135,270,405,540,675,810,945].map(x=><line key={x} x1={x} y1="0" x2={x} y2="300"/>)}
          </g>
          {/* SUMATRA – NW-SE elongated */}
          <path filter="url(#glow)"
            d="M10,85 C18,58 46,36 80,22 110,10 140,9 162,20 178,32 184,52 180,74 172,98 152,120 122,138 88,156 54,160 30,146 12,132 6,110 10,85Z"
            fill="url(#ig)" stroke="#CE1126" strokeWidth="1.2" strokeOpacity="0.55"/>
          {/* JAVA – narrow E-W */}
          <path filter="url(#glow)"
            d="M176,188 C192,180 222,174 264,171 306,168 352,170 394,177 424,184 436,195 428,206 410,215 374,218 334,218 294,217 256,212 220,204 192,194 176,188Z"
            fill="url(#ig)" stroke="#CE1126" strokeWidth="1.2" strokeOpacity="0.55"/>
          {/* Bali + Lombok */}
          <ellipse cx="448" cy="200" rx="13" ry="8" fill="#CE1126" fillOpacity="0.15" stroke="#CE1126" strokeWidth="1" strokeOpacity="0.4"/>
          <ellipse cx="470" cy="202" rx="9"  ry="7" fill="#CE1126" fillOpacity="0.12" stroke="#CE1126" strokeWidth="1" strokeOpacity="0.35"/>
          <ellipse cx="490" cy="208" rx="7"  ry="6" fill="#CE1126" fillOpacity="0.09" stroke="#CE1126" strokeWidth="1" strokeOpacity="0.3"/>
          {/* KALIMANTAN – large */}
          <path filter="url(#glow)"
            d="M264,22 C290,4 338,-4 390,-2 444,0 496,14 532,34 560,52 568,82 560,114 548,144 522,166 486,180 444,192 396,192 352,176 314,160 282,134 264,104 250,78 252,44 264,22Z"
            fill="url(#ig)" stroke="#CE1126" strokeWidth="1.2" strokeOpacity="0.55"/>
          {/* SULAWESI – K-shape (4 arms) */}
          <path filter="url(#glow)"
            d="M594,44 C606,26 626,18 646,24 660,30 668,48 664,68 656,88 638,100 622,96 606,90 596,72 594,52Z"
            fill="url(#ig)" stroke="#CE1126" strokeWidth="1.2" strokeOpacity="0.5"/>
          <path filter="url(#glow)"
            d="M654,28 C670,12 692,6 708,14 720,24 720,44 708,58 694,70 676,70 664,58 654,46Z"
            fill="url(#ig)" stroke="#CE1126" strokeWidth="1.1" strokeOpacity="0.45"/>
          <path filter="url(#glow)"
            d="M628,90 C644,100 662,120 666,148 668,170 656,188 638,192 620,192 606,178 602,160 600,140 610,118 622,104Z"
            fill="url(#ig)" stroke="#CE1126" strokeWidth="1.1" strokeOpacity="0.45"/>
          <path filter="url(#glow)"
            d="M662,70 C680,80 700,100 706,126 708,148 696,166 676,168 658,166 644,150 644,130 644,110 654,92Z"
            fill="url(#ig)" stroke="#CE1126" strokeWidth="1.1" strokeOpacity="0.45"/>
          {/* MALUKU – scattered */}
          {[[762,80,13,9],[790,108,10,7],[768,132,9,6],[812,72,8,6],[800,150,7,5]].map(([cx,cy,rx,ry],i)=>(
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
              fill="#CE1126" fillOpacity="0.12" stroke="#CE1126" strokeWidth="0.8" strokeOpacity="0.32"/>
          ))}
          {/* PAPUA – large E teardrop */}
          <path filter="url(#glow)"
            d="M840,44 C868,24 916,14 968,18 1020,24 1068,44 1092,72 1100,100 1092,132 1068,156 1032,174 984,182 936,178 892,162 856,142 830,114 820,86 824,62 840,44Z"
            fill="url(#ig)" stroke="#CE1126" strokeWidth="1.2" strokeOpacity="0.55"/>
          {/* INDONESIA label ghost */}
          <text x="540" y="280" textAnchor="middle"
            fill="#fff" fillOpacity="0.07" fontSize="10" fontWeight="800"
            letterSpacing="0.32em" fontFamily="system-ui,sans-serif">INDONESIA</text>
        </svg>

        {/* Sunrise glow — top right */}
        <div aria-hidden="true" style={{
          position:"absolute", top:"-30%", right:"12%",
          width:520, height:520, borderRadius:"50%", zIndex:1,
          background:"radial-gradient(circle,rgba(206,17,38,0.11) 0%,rgba(122,13,32,0.04) 40%,transparent 70%)"
        }}/>
        {/* Ocean glow — bottom left */}
        <div aria-hidden="true" style={{
          position:"absolute", bottom:"-20%", left:"5%",
          width:380, height:380, borderRadius:"50%", zIndex:1,
          background:"radial-gradient(circle,rgba(34,64,158,0.08) 0%,transparent 70%)"
        }}/>

        {/* Content */}
        <div className="wrap" style={{ position:"relative", zIndex:4 }}>
          {/* 5-colour brand strip */}
          <div style={{ display:"flex", gap:3, marginBottom:28, maxWidth:160 }}>
            {["#7A0D20","#22409E","#0D4F31","#F3263E","#BDDA5F"].map(c=>(
              <div key={c} style={{ height:3, flex:1, background:c, borderRadius:2 }}/>
            ))}
          </div>
          <p style={{ fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase",
            color:"rgba(255,255,255,0.45)", margin:"0 0 18px" }}>
            Indonesia Sourcing Intelligence Brief · 2025–2026
          </p>
          <h1 style={{ fontSize:"clamp(2.2rem,5vw,3.8rem)", fontWeight:300,
            lineHeight:1.1, letterSpacing:"-0.02em", color:"#fff",
            margin:"0 0 18px", maxWidth:600 }}>
            {d.heroTitle}
          </h1>
          <p style={{ fontSize:15, lineHeight:1.65, margin:0,
            color:"rgba(255,255,255,0.50)", maxWidth:480 }}>
            {d.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Stats — floating white cards, overlap hero bottom */}
      <div className="wrap" style={{
        transform:"translateY(-44px)", position:"relative",
        zIndex:10, marginBottom:"-8px"
      }}>
        <div style={{ display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(172px,1fr))", gap:14 }}>
          {d.heroStats?.map((s,i) => (
            <div key={s.label} className="card" style={{
              background:"#fff", borderRadius:10,
              padding:"clamp(18px,2.5vw,26px)",
              borderTop:"2px solid #7A0D20"
            }}>
              <div style={{ fontSize:"clamp(1.3rem,2.2vw,1.9rem)", fontWeight:700,
                color:"#7A0D20", lineHeight:1, marginBottom:8,
                fontVariantNumeric:"tabular-nums" }}>
                {s.value}
              </div>
              <div style={{ fontSize:10, color:"#9A8A80", letterSpacing:"0.1em",
                textTransform:"uppercase", lineHeight:1.5 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

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
              <div key={dim.title} data-animate style={{
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
          <div data-animate style={{ marginTop:32, padding:"20px 24px",
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
            border:"1px solid var(--hair,#E5DFD8)" }}
          className="scorecard-wrap" data-animate>
            <table className="scorecard" style={{ width:"100%", borderCollapse:"collapse",
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
            <div data-animate className="card" style={{ marginTop:16, padding:"16px 20px",
              background:"rgba(122,13,32,0.04)",
              borderLeft:"4px solid #7A0D20",
              borderRadius:"0 8px 8px 0" }}>
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
              <div key={r.name} data-animate style={{ display:"grid",
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
                  <li key={i} data-animate style={{ display:"flex", gap:10,
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
            gap:14 }}>
            {d.tradeAgreements?.map((a) => (
              <div key={a.name} data-animate style={{ background:"#fff",
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
              <div key={pt.title} data-animate style={{ padding:"20px 20px 24px",
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
              <li key={i} data-animate style={{ display:"flex", gap:10,
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
          padding:"clamp(28px,4vw,44px) 0" }}>
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
          padding:"clamp(28px,3.5vw,44px) 0" }}>
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
