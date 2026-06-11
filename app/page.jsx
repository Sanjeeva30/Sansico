import Link from "next/link";
import Hero from "@/components/Hero";
import Strip from "@/components/Strip";
import CountStats from "@/components/CountStats";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import Arrow from "@/components/Arrow";
import { getHome, getCapabilities, getMarkets, getCase } from "@/lib/content";

export default function Home() {
  const home = getHome();
  const caps = getCapabilities();
  const markets = getMarkets();
  const featured = getCase(home.featuredWork);
  const [m1, m2, m3] = home.manifesto.title.split("|");
  const arts = ["art-design", "art-make", "art-deliver"];

  return (
    <>
      <Reveal />
      <Hero hero={home.hero} />

      <section className="sec manifesto">
        <div className="wrap rv">
          <Strip />
          <h2>{m1}<span className="joy">{m2}</span>{m3}</h2>
          <p>{home.manifesto.body}</p>
        </div>
      </section>

      <CountStats stats={home.stats} />

      <section className="sec">
        <div className="wrap rv">
          <div className="sec-head">
            <h2 className="kicker">Long-term relationships</h2>
            <p className="lede">Trusted for decades by the world&rsquo;s shelves</p>
          </div>
          <div className="logo-wall" role="list">
            {home.customers.map((c) => <div role="listitem" key={c}>{c}</div>)}
          </div>
          <p className="logo-note">Customer logo artwork drops into this grid in the content phase.</p>
        </div>
      </section>

      <section className="sec-tight" id="capabilities">
        <div className="wrap">
          <div className="sec-head rv">
            <h2 className="kicker">What we do</h2>
            <p className="lede">Three capabilities, one accountable partner</p>
          </div>
          <div className="gate-grid">
            {caps.groups.map((g, i) => (
              <Link className="gate rv" href={`/capabilities#${g.slug}`} key={g.slug}>
                <div className={`art ${arts[i]}`} aria-hidden="true" />
                <div className="inner">
                  <span className="num">{g.num}</span>
                  <h3>{g.title}</h3>
                  <p>{g.summary}</p>
                  <span className="go">Explore <Arrow /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec warm" id="markets" style={{ marginTop: "70px" }}>
        <div className="wrap rv">
          <div className="sec-head">
            <h2 className="kicker">Markets we serve</h2>
            <p className="lede">Land where your category lives</p>
          </div>
          <div className="market-grid">
            {markets.items.map((m) => (
              <Link className="market" href={`/markets/${m.slug}`} key={m.slug}>
                <span className={`dot dot-${m.color}`} aria-hidden="true" />
                <h3>{m.title}</h3>
                <p>{m.tag}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featured ? (
        <section className="sec proof">
          <div className="wrap rv">
            <p className="kicker">Featured work — {featured.kicker}</p>
            <blockquote>{featured.quote}</blockquote>
            <div className="meta">
              {featured.stats.map((s) => (
                <div key={s.label}><b>{s.value}</b><span>{s.label}</span></div>
              ))}
            </div>
            <br />
            <Link className="link-u" href={`/work/${featured.slug}`}>Read the case study <Arrow /></Link>
          </div>
        </section>
      ) : null}

      <section className="sec">
        <div className="wrap sus-grid rv">
          <div>
            <Strip order={[3,5,1,2,4]} style={{ marginBottom: 30 }} />
            <h2>Certified, dated, <em>verifiable</em> — sustainability as a discipline, not an adjective.</h2>
            <p className="body">Every certification we hold is published with its scope and holding entity, and backed by a downloadable certificate. Forestry to food safety, security to social compliance — verification is the point.</p>
            <div className="chips">
              {["FSC®","FSSC 22000","ISO 17025","C-TPAT / SCAN","Higg Index","amfori BEPI","HERproject","NEST"].map((c) => (
                <Link className="chip" href="/sustainability#certifications" key={c}>{c}</Link>
              ))}
            </div>
          </div>
          <div className="loop" role="img" aria-label="95 percent minimum recycled paper content in the gift-bag programme">
            <div className="core"><b>95%</b><span>Minimum recycled content, gift-bag programme</span></div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
