import Link from "next/link";
import Media from "./Media";
import Strip from "@/components/Strip";
import Arrow from "@/components/Arrow";
import Hero, { InkBands } from "@/components/Hero";
import CustomerStories from "./CustomerStories";
import TimelineScroller from "./TimelineScroller";
import CountStats from "@/components/CountStats";
import { ContactForm } from "./Forms";
import { getStyled } from "@/lib/styledText";
import { sanityImgUrl } from "@/lib/content";

/* ── small shared helpers ─────────────────────────────── */

const S = (v) => getStyled(v);

function Txt({ value, as: Tag = "span", className, style, fallback = null }) {
  const s = S(value);
  if (!s.text) return fallback;
  return <Tag className={className} style={{ ...style, ...s.style }}>{s.text}</Tag>;
}

// Headline supporting the site's "|word|" italic-accent convention.
function Headline({ value, as: Tag = "h2", className = "t-h2", style, accent }) {
  const s = S(value);
  if (!s.text) return null;
  const parts = s.text.split("|");
  return (
    <Tag className={className} style={{ ...style, ...s.style }}>
      {parts.map((p, i) => (i % 2
        ? <em key={i} style={{ fontStyle: "italic", color: accent || "var(--crimson)" }}>{p}</em>
        : p))}
    </Tag>
  );
}

function SectionHead({ head, right }) {
  if (!head) return null;
  const has = S(head.kicker).text || S(head.heading).text || S(head.intro).text;
  if (!has) return null;
  return (
    <div className="v2-head">
      <div>
        <Txt value={head.kicker} as="div" className="t-kicker" />
        <Headline value={head.heading} />
        <Txt value={head.intro} as="p" className="t-body-lg v2-head-intro" />
      </div>
      {right || null}
    </div>
  );
}

function Cta({ link, className = "btn btn-crimson" }) {
  const label = S(link?.label);
  if (!link?.href || !label.text) return null;
  const external = /^https?:\/\//.test(link.href);
  const inner = <>{label.text} <Arrow /></>;
  // Studio colours win over the button's design default.
  const style = {
    background: link.bgColor || undefined,
    color: link.textColor || undefined,
    borderColor: link.bgColor || undefined,
  };
  return external ? (
    <a className={className} style={style} href={link.href} target={link.newTab ? "_blank" : undefined} rel={link.newTab ? "noopener noreferrer" : undefined}>{inner}</a>
  ) : (
    <Link className={className} style={style} href={link.href}>{inner}</Link>
  );
}

/* ── blocks ───────────────────────────────────────────── */

// The live site's full-screen hero, rendered through the existing Hero
// component so the animated press bands, type scale and buttons are identical.
function SiteHeroBlock({ b }) {
  const heading = S(b.heading);
  const primary = b.cta || {};
  const secondary = b.secondaryCta || {};
  return (
    <Hero
      hero={{
        type: b.heroType || "ink",
        eyebrow: b.eyebrow,
        title: heading.text,
        sub: b.sub,
        videoUrl: b.videoUrl || null,
        imageUrl: b.image?.url || null,
        posterUrl: b.poster?.url || null,
        primary: { label: S(primary.label).text || "Start a conversation", href: primary.href || "/contact" },
        secondary: { label: S(secondary.label).text || "Explore capabilities", href: secondary.href || "/capabilities" },
      }}
    />
  );
}

function HeroVideoBlock({ b }) {
  return (
    <div className="v2-hero-band" style={{ aspectRatio: b.ratio || "21/9" }}>
      {b.videoUrl ? (
        <video autoPlay muted loop playsInline poster={b.poster?.url ? sanityImgUrl(b.poster.url, { w: 1920, h: 820 }) : undefined}>
          <source src={b.videoUrl} type="video/mp4" />
        </video>
      ) : b.poster?.url ? (
        <img src={sanityImgUrl(b.poster.url, { w: 1920, h: 820 })} alt={b.poster.alt || ""} />
      ) : (
        // No video and no still: the signature animated press bands, never a hole.
        <InkBands />
      )}
      <Txt value={b.caption} as="div" className="v2-hero-cap" />
    </div>
  );
}

function PageHeroBlock({ b }) {
  return (
    <div className="v2-phero" style={{ background: b.bgColor || undefined }}>
      {b.scrimColor ? (
        <span aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1, background: b.scrimColor }} />
      ) : null}
      {b.background?.url ? <img className="bg" src={sanityImgUrl(b.background.url, { w: 1920, h: 900 })} alt={b.background.alt || ""} /> : <InkBands />}
      <div className="wrap">
        <Txt value={b.kicker} as="div" className="t-kicker" />
        <Headline value={b.heading} as="h1" className="t-h1" style={{ marginTop: 14 }} />
        <Txt value={b.intro} as="p" className="t-body-lg" />
        <div style={{ marginTop: 28 }}><Cta link={b.cta} className="btn btn-light" /></div>
      </div>
    </div>
  );
}

function StatementBlock({ b }) {
  const centred = b.align === "center";
  const box = centred ? { maxWidth: 860, margin: "0 auto", textAlign: "center" } : undefined;
  return (
    <div className="wrap rv" style={box}>
      {b.showStrip !== false ? (
        <Strip style={centred ? { marginBottom: 30, marginLeft: "auto", marginRight: "auto" } : { marginBottom: 30 }} />
      ) : null}
      <Txt value={b.kicker} as="div" className="t-kicker" style={{ marginBottom: 16 }} />
      <Headline value={b.heading} as="h1" className="t-h1"
        style={{ maxWidth: centred ? undefined : 900, marginBottom: 22 }} />
      <Txt value={b.body} as="p" className="t-body-lg"
        style={{ maxWidth: centred ? 640 : 660, ...(centred ? { marginLeft: "auto", marginRight: "auto" } : {}) }} />
      <div style={{ marginTop: 30 }}><Cta link={b.cta} /></div>
      <Txt value={b.note} as="div" className="t-small" style={{ marginTop: 18 }} />
    </div>
  );
}

// The full Why Indonesia research piece, rendered from the whyIndonesia
// document so nothing from the original page is lost.
function WhyIndonesiaDetailBlock({ b }) {
  const r = b.research;
  if (!r) return null;

  const Section = ({ title, intro, children, conclusion }) => (
    <div className="rv" style={{ marginBottom: 72 }}>
      {title ? <h2 className="t-h2" style={{ marginBottom: 18 }}>{title}</h2> : null}
      {intro ? <p className="t-body-lg" style={{ maxWidth: 860, marginBottom: 28 }}>{intro}</p> : null}
      {children}
      {conclusion ? (
        <div className="v2-quote-block" style={{ marginTop: 28, maxWidth: 900 }}>
          <p className="t-body-lg" style={{ margin: 0 }}>{conclusion}</p>
        </div>
      ) : null}
    </div>
  );

  const Cards = ({ items, titleKey = "title", bodyKey = "body", cols = 3 }) => (
    <div className="grid-n" style={{ "--cols": cols }}>
      {(items || []).map((it, i) => (
        <div className="v2-card" key={i}>
          <div className="t-h3" style={{ marginBottom: 10 }}>{it[titleKey]}</div>
          <p className="t-body">{it[bodyKey]}</p>
        </div>
      ))}
    </div>
  );

  const Bullets = ({ items }) => (
    <ul className="t-body-lg" style={{ paddingLeft: 20, listStyle: "disc", maxWidth: 900 }}>
      {(items || []).map((x, i) => <li key={i} style={{ marginBottom: 10 }}>{x}</li>)}
    </ul>
  );

  const sourcesByCategory = (r.sources || []).reduce((m, s2) => {
    (m[s2.category || "References"] ||= []).push(s2);
    return m;
  }, {});

  return (
    <div className="wrap">
      <Section title={r.executiveTitle} intro={r.executiveIntro} conclusion={r.executiveConclusion}>
        <Cards items={r.dimensions} />
      </Section>

      <Section title={r.aseanTitle} intro={r.aseanBody} conclusion={r.aseanConclusion} />

      <Section title={r.javaTitle} intro={r.javaIntro} conclusion={r.javaPlatformNote}>
        <Cards items={r.javaRegions} titleKey="name" bodyKey="description" />
      </Section>

      <Section title={r.sectorsTitle} intro={r.sectorsBody} conclusion={r.sectorsConclusion} />

      <Section title={r.susTitle} intro={r.susBody}>
        <Bullets items={r.susPoints} />
      </Section>

      <Section title={r.tradeTitle} intro={r.tradeBody}>
        <Cards items={r.tradeAgreements} titleKey="name" bodyKey="description" cols={2} />
      </Section>

      <Section title={r.fiberTitle} intro={r.fiberBody}>
        <Cards items={r.fiberPoints} />
      </Section>

      {r.conclusionStatement ? (
        <Section title="Strategic conclusion" intro={r.conclusionStatement}>
          <Bullets items={r.conclusionBullets} />
        </Section>
      ) : null}

      {b.showSources !== false && (r.sources || []).length ? (
        <div className="rv v2-rule" style={{ paddingTop: 32 }}>
          <div className="t-kicker" style={{ marginBottom: 22 }}>Sources</div>
          <div className="grid-n" style={{ "--cols": 3 }}>
            {Object.entries(sourcesByCategory).map(([cat, list]) => (
              <div key={cat}>
                <div className="t-h3" style={{ fontSize: 15, marginBottom: 10 }}>{cat}</div>
                <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {list.map((s2, i) => (
                    <li key={i}>
                      <a className="t-body" href={s2.url} target="_blank" rel="noopener noreferrer"
                         style={{ borderBottom: "1px solid var(--v2-line)" }}>{s2.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Rendered through the live site's CountStats component so the rounded cards,
// shadows and count-up animation are identical. CountStats expects a numeric
// `value` plus a separate `suffix`, so the CMS string ("40+", "500M") is split
// into those parts here.
function StatsBlock({ b }) {
  const stats = (b.stats || []).map((s) => {
    const raw = S(s.value).text || "";
    const m = raw.match(/^([\d.]+)(.*)$/);
    return {
      value: m ? m[1] : raw,
      suffix: m ? m[2] : "",
      label: s.label,
      bgHex: s.bgColor || undefined,
      textHex: s.textColor || undefined,
    };
  });
  return <CountStats stats={stats} />;
}

function CustomerStoriesBlock({ b }) {
  return (
    <div className="wrap rv">
      <SectionHead head={b.head} />
      <CustomerStories stories={b.stories || []} link={b.link} />
    </div>
  );
}

function LogoWallBlock({ b }) {
  return (
    <div className="wrap rv">
      <SectionHead head={b.head} />
      <div className="logo-wall" role="list">
        {(b.logos || []).map((l, i) => {
          const name = S(l.name);
          return (
            <div role="listitem" key={i} title={name.text}>
              {l.logo?.url
                ? <img src={sanityImgUrl(l.logo.url, { w: 200, h: 90, fit: "max" })} alt={l.logo.alt || name.text}
                    style={{ maxHeight: 42, objectFit: "contain", filter: "grayscale(1)", opacity: .72 }} />
                : <span style={name.style}>{name.text}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// The live site's "What we do" gate cards: full-bleed generative art panels
// (.art-design / .art-make / .art-deliver from globals.css) with the copy
// sitting in a gradient scrim at the foot of each card.
const GATE_ART = ["art-design", "art-make", "art-deliver"];

function CapabilityCardsBlock({ b }) {
  const head = b.head || {};
  return (
    <div className="wrap">
      <div className="sec-head rv">
        {b.cta?.href
          ? <Link href={b.cta.href} style={{ cursor: "pointer" }} data-animate>
              <Txt value={head.kicker} as="h2" className="kicker" />
            </Link>
          : <Txt value={head.kicker} as="h2" className="kicker" />}
        <Txt value={head.heading} as="p" className="lede" />
      </div>
      <div className="gate-grid">
        {(b.cards || []).map((c, i) => {
          const tag = S(c.tag), title = S(c.title), desc = S(c.desc);
          const flat = c.bgColor;
          const cardStyle = { background: flat || undefined, color: c.textColor || undefined };
          const inner = (
            <>
              {flat ? null : <div className={`art ${GATE_ART[i % GATE_ART.length]}`} aria-hidden="true" />}
              <div className="inner">
                <span className="num" style={tag.style}>{tag.text}</span>
                <h3 style={title.style}>{title.text}</h3>
                <p style={desc.style}>{desc.text}</p>
                <span className="go">Explore <Arrow /></span>
              </div>
            </>
          );
          return c.cta?.href
            ? <Link className="gate rv" data-animate style={cardStyle} href={c.cta.href} key={i}>{inner}</Link>
            : <div className="gate rv" style={cardStyle} key={i}>{inner}</div>;
        })}
      </div>
    </div>
  );
}

function TileGridBlock({ b }) {
  return (
    <div className="wrap rv">
      <SectionHead head={b.head} />
      <div className="grid-n" style={{ "--cols": b.columns || 3 }}>
        {(b.tiles || []).map((t, i) => {
          const inner = (
            <>
              <Media value={t.image} ratio="4/3" showCaption={false} />
              <Txt value={t.label} as="div" className="v2-tag"
                style={{ marginTop: 16, background: t.bgColor || undefined, color: t.textColor || undefined,
                  borderColor: t.bgColor || undefined }} />
            </>
          );
          return t.cta?.href
            ? <Link href={t.cta.href} key={i} style={{ display: "block" }}>{inner}</Link>
            : <div key={i}>{inner}</div>;
        })}
      </div>
    </div>
  );
}

function IconCardsBlock({ b }) {
  const align = b.align || "center";
  return (
    <div className="wrap rv">
      <SectionHead head={b.head} />
      <div className="grid-n" style={{ "--cols": b.columns || 3 }}>
        {(b.cards || []).map((c, i) => (
          <div className="v2-card" key={i} style={{ textAlign: align,
            background: c.bgColor || undefined, color: c.textColor || undefined,
            borderColor: c.borderColor || undefined }}>
            {c.icon?.url ? (
              <div className="v2-icon" style={align === "center" ? { margin: "0 auto 16px" } : undefined}>
                <img src={sanityImgUrl(c.icon.url, { w: 200, h: 200 })} alt={c.icon.alt || ""} />
              </div>
            ) : (
              <div className="v2-icon" style={align === "center" ? { margin: "0 auto 16px" } : undefined} aria-hidden="true">
                <Strip order={[1, 2, 3]} style={{ width: 30, height: 5 }} />
              </div>
            )}
            <Txt value={c.title} as="div" className="t-h3" style={{ marginBottom: 8 }} />
            <Txt value={c.desc} as="p" className="t-body" />
            <Txt value={c.meta} as="div" className="t-small" style={{ marginTop: 14 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function JourneyBlock({ b }) {
  return (
    <div className="wrap rv">
      <SectionHead head={b.head} />
      <div className="grid-n" style={{ "--cols": Math.min(b.steps?.length || 5, 5) }}>
        {(b.steps || []).map((s, i) => (
          <div className="v2-card" key={i} style={{ minHeight: 160, display: "flex", flexDirection: "column", justifyContent: "space-between",
            background: s.bgColor || undefined, color: s.textColor || undefined }}>
            <Txt value={s.n} as="div" className="t-small" fallback={<div className="t-small">{String(i + 1).padStart(2, "0")}</div>} />
            <div>
              <Txt value={s.title} as="div" className="t-h3" style={{ marginBottom: 6, fontSize: 16 }} />
              <Txt value={s.time} as="div" className="t-body" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SplitFeatureBlock({ b }) {
  const imageFirst = (b.imageSide || "left") === "left";
  const media = <div className="c-6"><Media value={b.image} ratio="4/3" /></div>;
  const text = (
    <div className="c-6">
      <Txt value={b.kicker} as="div" className="t-kicker" style={{ marginBottom: 14 }} />
      <Headline value={b.heading} style={{ marginBottom: 18 }} />
      <Txt value={b.body} as="p" className="t-body-lg" style={{ maxWidth: 520, marginBottom: 20 }} />
      <Txt value={b.meta} as="div" className="t-small" style={{ marginBottom: 24 }} />
      <Cta link={b.cta} className="btn btn-outline" />
    </div>
  );
  return (
    <div className="wrap rv">
      <div className="grid12" style={{ alignItems: "center" }}>
        {imageFirst ? <>{media}{text}</> : <>{text}{media}</>}
      </div>
    </div>
  );
}

function ImageBlock({ b }) {
  return <div className="wrap rv"><Media value={b.image} ratio={b.ratio || "16/9"} w={1800} h={1000} /></div>;
}

function FaqBlock({ b }) {
  return (
    <div className="wrap rv" style={{ maxWidth: 940 }}>
      <SectionHead head={b.head} />
      {(b.faqs || []).map((f, i) => (
        <details className="v2-faq" key={i}>
          <summary>{S(f.q).text}</summary>
          <div className="a t-body">{S(f.a).text}</div>
        </details>
      ))}
    </div>
  );
}

function MissionCardsBlock({ b }) {
  return (
    <div className="wrap rv">
      <SectionHead head={b.head} />
      <div className="grid-n" style={{ "--cols": Math.min(b.items?.length || 2, 3) }}>
        {(b.items || []).map((m, i) => (
          <div className="v2-card" key={i} style={{ background: m.bgColor || undefined, color: m.textColor || undefined }}>
            <Headline value={m.title} style={{ marginBottom: 14 }} />
            <Txt value={m.desc} as="p" className="t-body-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PresenceMapBlock({ b }) {
  return (
    <div className="wrap rv">
      <SectionHead head={b.head} />
      <div style={{ position: "relative" }}>
        <Media value={b.map} ratio="16/7" w={1800} h={790} />
        {(b.pins || []).map((p, i) => (
          <span key={i} title={S(p.label).text} style={{
            position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
            width: 12, height: 12, borderRadius: "50%", background: "var(--crimson)",
            boxShadow: "0 0 0 4px rgba(122,13,32,.25)", transform: "translate(-50%,-50%)",
          }} />
        ))}
      </div>
    </div>
  );
}

function TimelineBlock({ b }) {
  return (
    <>
      <div className="wrap rv">
        <SectionHead head={b.head} right={<div className="t-small">← Scroll to explore →</div>} />
      </div>
      <TimelineScroller
        className="wrap v2-scroller"
        enabled={b.autoScroll !== false}
        speed={b.autoScrollSpeed || 28}
      >
        <div className="v2-timeline">
          {(b.milestones || []).map((m, i) => (
            <div className="v2-timeline-item" key={i}>
              <div className="year">{S(m.year).text}</div>
              <div style={{ marginBottom: 16 }}><Media value={m.image} ratio="4/3" showCaption={false} w={560} h={420} /></div>
              <Txt value={m.title} as="div" className="t-h3" style={{ marginBottom: 8, fontSize: 16 }} />
              <Txt value={m.copy} as="p" className="t-body" />
            </div>
          ))}
        </div>
      </TimelineScroller>
    </>
  );
}

function FacilitiesBlock({ b }) {
  return (
    <div className="wrap rv">
      <SectionHead head={b.head} right={b.link?.href ? <Link className="t-small" href={b.link.href} style={{ color: "var(--crimson)", borderBottom: "1px solid var(--crimson)" }}>{S(b.link.label).text} →</Link> : null} />
      {(b.groups || []).map((g, gi) => (
        <div key={gi} style={{ marginBottom: 56 }}>
          <Txt value={g.label} as="div" className="t-kicker" style={{ marginBottom: 26 }} />
          <div className="grid-n" style={{ "--cols": 3 }}>
            {(g.facilities || []).map((f, i) => (
              <div key={i}>
                <Media value={{ url: f.photoUrl, alt: S(f.name).text }} ratio="4/3" showCaption={false} />
                <div className="t-h3" style={{ marginTop: 16, fontSize: 16 }}>{S(f.name).text}</div>
                <div className="t-small" style={{ marginTop: 6 }}>{S(f.city).text}</div>
                {S(f.focus).text ? <div className="t-body" style={{ marginTop: 8 }}>{S(f.focus).text}</div> : null}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function OfficesBlock({ b }) {
  return (
    <div className="wrap rv">
      <SectionHead head={b.head} />
      <div className="grid12" style={{ alignItems: "start" }}>
        <div className="c-6"><Media value={b.map} ratio="4/3" /></div>
        <div className="c-6" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {(b.offices || []).map((o, i) => (
            <div className="v2-card" key={i}>
              <Txt value={o.label} as="div" className="t-small" style={{ marginBottom: 12 }} />
              <Txt value={o.name} as="div" className="t-h3" style={{ marginBottom: 12 }} />
              <Txt value={o.address} as="p" className="t-body" style={{ marginBottom: 14 }} />
              {o.mapLink?.href ? (
                <a className="t-small" href={o.mapLink.href} target="_blank" rel="noopener noreferrer"
                   style={{ color: "var(--crimson)", borderBottom: "1px solid var(--crimson)" }}>
                  {S(o.mapLink.label).text || "View on Google Maps"} →
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CertificationMatrixBlock({ b }) {
  const groups = b.certGroups || [];
  const col = (n) => groups.filter((g) => (g.column || 1) === n);
  const renderGroup = (g, i) => (
    <div className="v2-certgroup" key={i}>
      <div>
        <Txt value={g.title} as="div" className="t-h3" style={{ fontSize: 16 }} />
        <Txt value={g.sub} as="div" className="t-small" style={{ marginTop: 4, textTransform: "none", letterSpacing: ".04em" }} />
      </div>
      <div className="v2-certlogos">
        {(g.items || []).map((it, k) => {
          const name = S(it.name).text;
          return (
            <div className="v2-certlogo" key={k} title={[name, S(it.scope).text, S(it.entity).text].filter(Boolean).join(" — ")}>
              {it.logoUrl
                ? <img src={sanityImgUrl(it.logoUrl, { w: 260, h: 130, fit: "max" })} alt={name} />
                : <span className="t-small" style={{ letterSpacing: ".06em" }}>{name}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
  return (
    <div className="wrap rv">
      <SectionHead head={b.head} />
      <div className="grid12">
        <div className="c-6">{col(1).map(renderGroup)}</div>
        <div className="c-6">{col(2).map(renderGroup)}</div>
      </div>
    </div>
  );
}

function ScorecardBlock({ b }) {
  const sc = b.scorecard;
  if (!sc) return null;
  const cols = sc.columns || [];
  const grid = { gridTemplateColumns: `2fr repeat(${cols.length}, 1fr) 1fr` };
  return (
    <div className="wrap rv">
      <SectionHead head={b.head} />
      <Txt value={b.subtitle} as="div" className="t-body-lg" style={{ fontStyle: "italic", marginTop: -26, marginBottom: 28 }} />
      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 26 }}>
        {(sc.legend || []).map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="v2-score">{S(l.n).text}</span>
            <span className="t-body">{S(l.label).text}</span>
          </div>
        ))}
      </div>
      <div>
        <div className="v2-table-head" style={grid}>
          <div>Country</div>
          {cols.map((c) => <div key={c} style={{ textAlign: "center" }}>{c}</div>)}
          <div style={{ textAlign: "center" }}>Total</div>
        </div>
        {(sc.rows || []).map((r, i) => (
          <div className="v2-table-row" style={grid} key={i}>
            <div style={{ fontWeight: r.starred ? 700 : 500,
              color: r.starred ? (r.highlightColor || "var(--crimson)") : undefined }}>
              {S(r.country).text}{r.starred ? " ★" : ""}
            </div>
            {(r.scores || []).map((s, k) => <div key={k} style={{ textAlign: "center" }}><span className="v2-score">{s}</span></div>)}
            <div style={{ textAlign: "center" }}><span className="v2-score total">{r.total}</span></div>
          </div>
        ))}
      </div>
      {S(sc.footnote).text ? (
        <p className="t-body" style={{ marginTop: 28, maxWidth: 900 }}>
          <b style={{ color: "var(--ink)" }}>{S(sc.footnoteTitle).text} </b>{S(sc.footnote).text}
        </p>
      ) : null}
      {S(sc.conclusion).text ? (
        <div className="v2-quote-block v2-card" style={{ marginTop: 28, background: "var(--paper-warm)" }}>
          <p className="t-body-lg" style={{ margin: 0 }}>
            <b style={{ color: "var(--ink)" }}>{S(sc.conclusionTitle).text} </b>
            <i>{S(sc.conclusion).text}</i>
          </p>
        </div>
      ) : null}
    </div>
  );
}

function ProductShowcaseBlock({ b }) {
  return (
    <div className="wrap">
      <SectionHead head={b.head} />
      {(b.categories || []).map((cat, i) => (
        <div className="grid12 rv" key={i} style={{ marginBottom: 72 }}>
          <div className="c-3">
            <Link href={`/products/${cat.slug}`}>
              <Txt value={cat.name} as="h3" className="t-h2" style={{ marginBottom: 14 }} />
            </Link>
            <Txt value={cat.blurb || cat.description} as="p" className="t-body" />
          </div>
          <div className="c-9">
            <Link href={`/products/${cat.slug}`} style={{ display: "block", marginBottom: 24 }}>
              <Media value={{ url: cat.coverUrl, alt: S(cat.name).text }} ratio="16/9" w={1600} h={900} showCaption={false} />
            </Link>
            <div className="grid-n" style={{ "--cols": 3 }}>
              {(cat.products || []).slice(0, 3).map((p, k) => (
                <Link href={`/products/${cat.slug}/${p.slug}`} key={k}>
                  <Media value={{ url: p.thumbUrl, alt: S(p.name).text }} ratio="4/3" showCaption={false} />
                  <div className="v2-tag" style={{ marginTop: 14 }}>{S(p.name).text}</div>
                </Link>
              ))}
            </div>
            <Link href={`/products/${cat.slug}`} className="t-small"
              style={{ display: "inline-block", marginTop: 22, color: "var(--crimson)", borderBottom: "1px solid var(--crimson)" }}>
              See all {S(cat.name).text} →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

function OpenRolesBlock({ b }) {
  return (
    <div className="wrap rv">
      <SectionHead head={b.head} />
      <div style={{ borderTop: "2px solid var(--ink)" }}>
        <div className="v2-role-row t-small" style={{ paddingTop: 14, paddingBottom: 14 }}>
          <div>Role</div><div>Department</div><div>Location</div><div />
        </div>
        {(b.roles || []).map((r, i) => (
          <div className="v2-role-row" key={i}>
            <div className="t-h3" style={{ fontSize: 16 }}>{S(r.role).text}</div>
            <div className="t-body">{S(r.dept).text}</div>
            <div className="t-body">{S(r.location).text}</div>
            <div><Link className="btn btn-outline" style={{ padding: "8px 20px", fontSize: 13 }} href={`/careers/${r.slug}`}>Apply</Link></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogGridBlock({ b }) {
  return (
    <div className="wrap rv">
      <SectionHead head={b.head} />
      <div className="grid-n" style={{ "--cols": 3 }}>
        {(b.posts || []).map((p, i) => (
          <Link href={`/blog/${p.slug}`} key={i}>
            <Media value={p.cover} ratio="4/3" showCaption={false} />
            <Txt value={p.tag} as="div" className="v2-tag" style={{ margin: "16px 0 12px" }} />
            <Txt value={p.title} as="div" className="t-h3" style={{ fontSize: 17, marginBottom: 8 }} />
            <Txt value={p.date} as="div" className="t-small" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function ContactFormBlock({ b }) {
  return (
    <div className="wrap rv">
      <div className="grid12">
        <div className="c-7">
          <Headline value={b.heading} as="h1" className="t-h1" style={{ marginBottom: 18 }} />
          <Txt value={b.intro} as="p" className="t-body-lg" style={{ marginBottom: 48 }} />
          <ContactForm block={b} />
        </div>
        <div className="c-5">
          <div className="v2-card" style={{ background: "var(--paper-warm)" }}>
            <Txt value={b.asideTitle} as="div" className="t-kicker" style={{ marginBottom: 24 }} />
            {(b.aside || []).map((a, i) => (
              <div key={i} style={{ marginBottom: 22 }}>
                <Txt value={a.title} as="div" className="t-h3" style={{ fontSize: 15, marginBottom: 5 }} />
                <Txt value={a.body} as="div" className="t-body" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CtaBannerBlock({ b }) {
  return (
    <div className="wrap">
      <Headline value={b.heading} accent={b.accentColor} />
      <Txt value={b.body} as="p" className="t-body" />
      <Cta link={b.cta} className="btn btn-light" />
    </div>
  );
}

/* ── registry + renderer ──────────────────────────────── */

const REGISTRY = {
  siteHeroBlock: SiteHeroBlock,
  heroVideoBlock: HeroVideoBlock,
  pageHeroBlock: PageHeroBlock,
  statementBlock: StatementBlock,
  whyIndonesiaDetailBlock: WhyIndonesiaDetailBlock,
  statsBlock: StatsBlock,
  customerStoriesBlock: CustomerStoriesBlock,
  logoWallBlock: LogoWallBlock,
  capabilityCardsBlock: CapabilityCardsBlock,
  tileGridBlock: TileGridBlock,
  iconCardsBlock: IconCardsBlock,
  journeyBlock: JourneyBlock,
  splitFeatureBlock: SplitFeatureBlock,
  imageBlock: ImageBlock,
  faqBlock: FaqBlock,
  missionCardsBlock: MissionCardsBlock,
  presenceMapBlock: PresenceMapBlock,
  timelineBlock: TimelineBlock,
  facilitiesBlock: FacilitiesBlock,
  officesBlock: OfficesBlock,
  certificationMatrixBlock: CertificationMatrixBlock,
  scorecardBlock: ScorecardBlock,
  productShowcaseBlock: ProductShowcaseBlock,
  openRolesBlock: OpenRolesBlock,
  blogGridBlock: BlogGridBlock,
  contactFormBlock: ContactFormBlock,
  ctaBannerBlock: CtaBannerBlock,
};

// Blocks that own their full-bleed background and so shouldn't be wrapped in
// the standard padded section shell.
const BARE = new Set(["siteHeroBlock", "heroVideoBlock", "pageHeroBlock"]);

export default function Sections({ sections = [] }) {
  return (
    <>
      {sections.map((b) => {
        const Block = REGISTRY[b._type];
        if (!Block || b.visible === false) return null;
        if (BARE.has(b._type)) return <Block b={b} key={b._key} />;
        return (
          <section
            key={b._key}
            id={b.anchorId || undefined}
            className={`v2-section theme-${b.theme || "paper"}`}
            style={{ background: b.bgColor || undefined, color: b.textColor || undefined }}
          >
            <Block b={b} />
          </section>
        );
      })}
    </>
  );
}

export { SectionHead, Txt, Headline, Cta };
