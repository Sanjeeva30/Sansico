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

      {/* ── HERO — Indonesia: map · flag · brand ───────── */}
      <section style={{
        position:"relative", overflow:"hidden",
        background:"linear-gradient(150deg,#060A10 0%,#0C1220 45%,#070B14 100%)",
        paddingTop:"clamp(96px,13vw,152px)",
        paddingBottom:"clamp(72px,9vw,108px)"
      }}>

        {/* ═══ INDONESIAN FLAG — bold right-side geometry ═══ */}
        {/* Full-height flag stripe on far right */}
        <div aria-hidden="true" style={{
          position:"absolute", right:0, top:0, bottom:0, width:12, zIndex:5,
          background:"linear-gradient(to bottom, #CE1126 50%, #F5F5F0 50%)"
        }}/>
        {/* Large diagonal flag wash — right 40% of hero */}
        <div aria-hidden="true" style={{
          position:"absolute", right:0, top:0, bottom:0, width:"42%", zIndex:1,
          background:"linear-gradient(to bottom, rgba(206,17,38,0.06) 50%, rgba(245,245,240,0.03) 50%)",
          clipPath:"polygon(8% 0,100% 0,100% 100%,0 100%)"
        }}/>
        {/* Thin flag line — horizontal midpoint accent */}
        <div aria-hidden="true" style={{
          position:"absolute", right:12, top:"50%", width:"38%", height:"1px", zIndex:3,
          background:"linear-gradient(to right, transparent, rgba(206,17,38,0.4) 30%, rgba(245,245,240,0.3) 50%, transparent)"
        }}/>

        {/* ═══ INDONESIA ARCHIPELAGO MAP — SVG watermark ═══ */}
        <svg aria-hidden="true"
          viewBox="0 0 1080 300"
          preserveAspectRatio="xMaxYMid meet"
          style={{
            position:"absolute", right:"-2%", top:"50%",
            transform:"translateY(-50%)",
            width:"65%", height:"90%",
            zIndex:2, pointerEvents:"none"
          }}>
          <defs>
            <linearGradient id="islandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#CE1126" stopOpacity="0.20"/>
              <stop offset="60%" stopColor="#CE1126" stopOpacity="0.12"/>
              <stop offset="100%" stopColor="#CE1126" stopOpacity="0.05"/>
            </linearGradient>
            <filter id="islandGlow">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* ── SUMATRA – elongated NW-SE ── */}
          <path filter="url(#islandGlow)"
            d="M 10,85 C 18,58 46,36 80,22 110,10 140,9 162,20
               178,32 184,52 180,74 172,98 152,120 122,138
               88,156 54,160 30,146 12,132 6,110 10,85 Z"
            fill="url(#islandGrad)" stroke="#CE1126" strokeWidth="1.2" strokeOpacity="0.5"
          />
          {/* ── JAVA – narrow east-west ── */}
          <path filter="url(#islandGlow)"
            d="M 176,188 C 192,180 222,174 264,171 306,168
               352,170 394,177 424,184 436,195 428,206
               410,215 374,218 334,218 294,217 256,212
               220,204 192,194 176,188 Z"
            fill="url(#islandGrad)" stroke="#CE1126" strokeWidth="1.2" strokeOpacity="0.5"
          />
          {/* ── BALI + LOMBOK – dots ── */}
          <ellipse cx="448" cy="200" rx="13" ry="8"
            fill="#CE1126" fillOpacity="0.15" stroke="#CE1126" strokeWidth="1" strokeOpacity="0.4"/>
          <ellipse cx="470" cy="202" rx="9" ry="7"
            fill="#CE1126" fillOpacity="0.12" stroke="#CE1126" strokeWidth="1" strokeOpacity="0.4"/>
          <ellipse cx="490" cy="208" rx="7" ry="6"
            fill="#CE1126" fillOpacity="0.10" stroke="#CE1126" strokeWidth="1" strokeOpacity="0.3"/>
          {/* ── KALIMANTAN – large oval ── */}
          <path filter="url(#islandGlow)"
            d="M 264,22 C 290,4 338,-4 390,-2 444,0 496,14 532,34
               560,52 568,82 560,114 548,144 522,166 486,180
               444,192 396,192 352,176 314,160 282,134 264,104
               250,78 252,44 264,22 Z"
            fill="url(#islandGrad)" stroke="#CE1126" strokeWidth="1.2" strokeOpacity="0.5"
          />
          {/* ── SULAWESI – distinctive orchid K-shape ── */}
          {/* North arm */}
          <path filter="url(#islandGlow)"
            d="M 594,44 C 606,26 626,18 646,24 660,30 668,48 664,68
               656,88 638,100 622,96 606,90 596,72 594,52 594,44 Z"
            fill="url(#islandGrad)" stroke="#CE1126" strokeWidth="1.2" strokeOpacity="0.5"
          />
          {/* NE arm */}
          <path filter="url(#islandGlow)"
            d="M 654,28 C 670,12 692,6 708,14 720,24 720,44 708,58
               694,70 676,70 664,58 654,46 654,36 654,28 Z"
            fill="url(#islandGrad)" stroke="#CE1126" strokeWidth="1.2" strokeOpacity="0.4"
          />
          {/* SE arm */}
          <path filter="url(#islandGlow)"
            d="M 628,90 C 644,100 662,120 666,148 668,170 656,188
               638,192 620,192 606,178 602,160 600,140 610,118
               622,104 628,96 628,90 Z"
            fill="url(#islandGrad)" stroke="#CE1126" strokeWidth="1.2" strokeOpacity="0.4"
          />
          {/* East arm */}
          <path filter="url(#islandGlow)"
            d="M 662,70 C 680,80 700,100 706,126 708,148 696,166
               676,168 658,166 644,150 644,130 644,110 654,92
               662,78 662,70 Z"
            fill="url(#islandGrad)" stroke="#CE1126" strokeWidth="1.2" strokeOpacity="0.4"
          />
          {/* ── MALUKU – scattered islands ── */}
          {[[762,80,13,9],[790,108,10,7],[768,132,9,6],[812,72,8,6],[800,150,7,5]].map(([cx,cy,rx,ry],i)�)=>(
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
              fill="#CE1126" fillOpacity="0.12" stroke="#CE1126"
              strokeWidth="0.8" strokeOpacity="0.35"/>
          ))}
          {/* ── PAPUA – large teardrop east ── */}
          <path filter="url(#islandGlow)"
            d="M 840,44 C 868,24 916,14 968,18 1020,24 1068,44
               1092,72 1100,100 1092,132 1068,156 1032,174
               984,182 936,178 892,162 856,142 830,114
               820,86 824,62 840,44 Z"
            fill="url(#islandGrad)" stroke="#CE1126" strokeWidth="1.2" strokeOpacity="0.5"
          />
          {/* ── Subtle lat/lon grid behind islands ── */}
          <g strokeOpacity="0.06" stroke="#ffffff" strokeWidth="0.6" fill="none">
            {[60,120,180,240].map(y=>(
              <line key={y} x1="0" y1={y} x2="1080" y2={y}/>
            ))}
            {[135,270,405,540,675,810,945].map(x=>(
              <line key={x} x1={x} y1="0" x2={x} y2="300"/>
            ))}
          </g>
          {/* ── Country label beneath map ── */}
          <text x="540" y="280" textAnchor="middle"
            fill="#ffffff" fillOpacity="0.08"
            fontSize="11" fontWeight="800" letterSpacing="0.3em"
            fontFamily="system-ui,sans-serif">
            INDONESIA
          </text>
        </svg>

        {/* ═══ SUNRISE GLOW — top right radial ═══ */}
        <div aria-hidden="true" style={{
          position:"absolute", top:"-30%", right:"15%",
          width:560, height:560, borderRadius:"50%", zIndex:1,
          background:"radial-gradient(circle, rgba(206,17,38,0.10) 0%, rgba(122,13,32,0.05) 40%, transparent 70%)"
        }}/>
        {/* Deep ocean bottom glow — blue */}
        <div aria-hidden="true" style={{
          position:"absolute", bottom:"-20%", left:"5%",
          width:400, height:400, borderRadius:"50%", zIndex:1,
          background:"radial-gradient(circle, rgba(34,64,158,0.08) 0%, transparent 70%)"
        }}/>

        {/* ═══ CONTENT ═══ */}
        <div className="wrap" style={{ position:"relative", zIndex:4 }}>
          {/* Brand 5-colour strip */}
          <div style={{ display:"flex", gap:3, marginBottom:28, maxWidth:160 }}>
            {["#7A0D20","#22409E","#0D4F31","#F3263E","#BDDA5F"].map(c=>(
              <div key={c} style={{ height:3, flex:1, background:c, borderRadius:2 }}/>
            ))}
          </div>

          <p style={{ fontSize:11, letterSpacing:"0.16em",
            textTransform:"uppercase",
            color:"rgba(255,255,255,0.45)", margin:"0 0 18px" }}>
            Indonesia Sourcing Intelligence Brief · 2025–2026
          </p>

          <h1 style={{ fontSize:"clamp(2.2rem,5vw,3.8rem)",
            fontWeight:300, lineHeight:1.1, letterSpacing:"-0.02em",
            color:"#ffffff", margin:"0 0 18px", maxWidth:600 }}>
            {d.heroTitle}
          </h1>

          <p style={{ fontSize:15, lineHeight:1.65, margin:0,
            color:"rgba(255,255,255,0.50)", maxWidth:480 }}>
            {d.heroSubtitle}
          </p>
        </div>
      </section>

      {/* ── Stats — elevated white cards overlapping hero base ── */}
      <div className="wrap" style={{
        transform:"translateY(-44px)",
        position:"relative", zIndex:10,
        marginBottom:"-8px"
      }}>
        <div style={{ display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(172px,1fr))",
          gap:14 }}>
          {d.heroStats?.map((s, i) => (
            <div key={s.label} className="card" style={{
              background:"#ffffff",
              borderRadius:10,
              padding:"clamp(18px,2.5vw,26px)",
              borderTop:"2px solid #7A0D20"
            }}>
              <div style={{ fontSize:"clamp(1.3rem,2.2vw,1.9rem)",
                fontWeight:700, color:"#7A0D20",
                lineHeight:1, marginBottom:8, fontVariantNumeric:"tabular-nums" }}>
                {s.value}
              </div>
              <div style={{ fontSize:10, color:"#9A8A80",
                letterSpacing:"0.1em", textTransform:"uppercase",
                lineHeight:1.5 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

