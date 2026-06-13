export const revalidate = 30;
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { getNews, getNewsPost } from "@/lib/content";
import { notFound, redirect } from "next/navigation";

export async function generateStaticParams() {
  const posts = await getNews();
  return posts.filter(p => p.postType === "article").map(p => ({ slug: p.slug }));
}
export async function generateMetadata({ params }) {
  const p = await getNewsPost(params.slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt };
}

function RichBlocks({ blocks }) {
  if (!blocks?.length) return null;
  return blocks.map((b, i) => {
    const text = b.children?.map(c => c.text).join("") || "";
    if (b.style === "h2") return <h2 key={i}>{text}</h2>;
    if (b.style === "h3") return <h3 key={i}>{text}</h3>;
    if (b.style === "blockquote") return <blockquote key={i}>{text}</blockquote>;
    if (b._type === "image") return (
      <figure key={i} style={{ margin:"32px 0" }}>
        <img src={b.asset?.url} alt={b.caption || ""} style={{ width:"100%", borderRadius:6 }} />
        {b.caption && <figcaption style={{ fontSize:13, marginTop:8, opacity:0.6 }}>{b.caption}</figcaption>}
      </figure>
    );
    return <p key={i}>{text}</p>;
  });
}

function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" });
}

export default async function NewsPostPage({ params }) {
  const p = await getNewsPost(params.slug);
  if (!p) notFound();
  if (p.postType !== "article" && p.externalUrl) redirect(p.externalUrl);

  return (
    <>
      <Reveal />
      <PageHero kicker="News & Press" title={p.title} intro={p.excerpt} />
      {p.coverUrl && (
        <section className="sec" style={{ paddingBottom:0 }}>
          <div className="wrap rv">
            <img src={p.coverUrl} alt={p.title}
              style={{ width:"100%", maxHeight:480, objectFit:"cover", borderRadius:8 }} />
          </div>
        </section>
      )}
      <section className="sec">
        <div className="wrap rv" style={{ maxWidth:760 }}>
          <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:32, fontSize:13.5, opacity:0.6 }}>
            {p.author?.name && (
              <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                {p.author.photoUrl && (
                  <img src={p.author.photoUrl} alt={p.author.name}
                    style={{ width:28, height:28, borderRadius:"50%", objectFit:"cover" }} />
                )}
                {p.author.name}
              </span>
            )}
            <span>{fmtDate(p.publishedAt)}</span>
          </div>
          <div className="prose">
            <RichBlocks blocks={p.body} />
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
