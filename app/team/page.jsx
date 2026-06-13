export const revalidate = 30;
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { getTeam, getPageSettings, getPageSeo } from "@/lib/content";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  return getPageSeo("team", { title:"Team — Sansico Group", description:"Meet the leadership team behind Sansico Group." });
}

export default async function Team() {
  const [team, settings] = await Promise.all([getTeam(), getPageSettings("team")]);
  if (!settings.visible) notFound();

  return (
    <>
      <Reveal />
      <PageHero kicker="Our team" title="The people behind the operations" />
      <section className="sec">
        <div className="wrap rv">
          {team.length === 0 ? (
            <p style={{ opacity:0.5 }}>Team profiles coming soon — add them in the Studio under Team.</p>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:32 }}>
              {team.map((p) => (
                <div key={p.name} style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {p.photoUrl ? (
                    <img src={p.photoUrl} alt={p.name}
                      style={{ width:"100%", aspectRatio:"1/1", objectFit:"cover", borderRadius:8 }} />
                  ) : (
                    <div style={{ width:"100%", aspectRatio:"1/1", background:"var(--hair)", borderRadius:8,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:40, fontWeight:700, color:"var(--ink)", opacity:0.2 }}>
                      {p.name?.[0]}
                    </div>
                  )}
                  <div>
                    <b style={{ display:"block", fontSize:17 }}>{p.name}</b>
                    <span style={{ display:"block", color:"var(--crimson)", fontSize:13.5, fontWeight:500, marginBottom:8 }}>{p.role}</span>
                    {p.bio && <p style={{ margin:0, fontSize:14, lineHeight:1.65, opacity:0.8 }}>{p.bio}</p>}
                    {p.linkedin && (
                      <a href={p.linkedin} target="_blank" rel="noopener"
                        style={{ display:"inline-block", marginTop:10, fontSize:13, color:"var(--navy)", fontWeight:600 }}>
                        LinkedIn →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
