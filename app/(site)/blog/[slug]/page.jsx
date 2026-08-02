export const revalidate = 30;
import Link from "next/link";
import { notFound } from "next/navigation";
import Media from "@/components/v2/Media";
import CtaBandV2 from "@/components/v2/CtaBandV2";
import { getPost, getPosts } from "@/lib/v2";
import { draftMode } from "next/headers";
import { getStyled } from "@/lib/styledText";
import { editAttr } from "@/lib/sanity/edit";

const S = (v) => getStyled(v);

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await getPost(slug);
  return { title: p?.seoTitle || S(p?.title).text || "Article", description: p?.seoDescription || S(p?.excerpt).text };
}

// Body is a mixed array: portable-text blocks, images, and pull quotes.
function Body({ body = [], at }) {
  // Each node addresses itself by _key so clicking an in-article image or pull
  // quote opens that exact block rather than the whole body field.
  const node = (n) => (n._key ? at?.(`body[_key=="${n._key}"]`) : undefined);
  return body.map((n, i) => {
    if (n._type === "richImage") {
      return <div key={i} style={{ margin: "0 0 32px" }}><Media value={n} ratio="16/9" w={1400} h={790} edit={node(n)} /></div>;
    }
    if (n._type === "pullQuote") {
      return (
        <div className="v2-quote-block" key={i} style={{ margin: "0 0 32px" }} {...(node(n) || {})}>
          <div className="t-quote">“{S(n.quote).text}”</div>
        </div>
      );
    }
    const text = (n.children || []).map((c) => c.text).join("");
    if (!text) return null;
    return <p className="t-body-lg" key={i} style={{ margin: "0 0 28px" }}>{text}</p>;
  });
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const isDraft = (await draftMode()).isEnabled;
  const at = (path) => (isDraft ? editAttr({ id: post._id, type: post._type, path }) : undefined);

  const all = await getPosts();
  const others = all.filter((p) => p.slug !== post.slug).slice(0, 3);
  const title = S(post.title);

  return (
    <>
      <div className="wrap v2-crumb" style={{ maxWidth: 900 }}>
        <Link href="/blog">← Back to Blog</Link>
      </div>

      <div className="wrap" style={{ maxWidth: 900, paddingTop: 24 }}>
        <div className="v2-tag" style={{ marginBottom: 18 }} {...(at("tag") || {})}>{S(post.tag).text}</div>
        <h1 className="t-h1" style={{ marginBottom: 16, ...title.style }}>{title.text}</h1>
        <div className="t-small">
          {S(post.date).text}{S(post.readTime).text ? ` · ${S(post.readTime).text} read` : ""}
        </div>
      </div>

      <div className="wrap" style={{ maxWidth: 1080, paddingTop: 48 }}>
        <Media value={post.cover} ratio="16/9" w={1800} h={1010} edit={at("cover")} />
      </div>

      <section className="v2-section">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <Body body={post.body} at={at} />
        </div>
      </section>

      {others.length ? (
        <section className="v2-section theme-warm">
          <div className="wrap rv">
            <div className="v2-head">
              <h2 className="t-h2">Related reading</h2>
              <Link className="t-small" href="/blog" style={{ color: "var(--crimson)", borderBottom: "1px solid var(--crimson)" }}>See all →</Link>
            </div>
            <div className="grid-n" style={{ "--cols": 3 }}>
              {others.map((p) => (
                <Link href={`/blog/${p.slug}`} key={p.slug}>
                  <Media value={p.cover} ratio="4/3" showCaption={false}
                    edit={isDraft ? editAttr({ id: p._id, type: p._type, path: "cover" }) : undefined} />
                  <div className="v2-tag" style={{ margin: "16px 0 12px" }}
                    {...(isDraft ? editAttr({ id: p._id, type: p._type, path: "tag" }) : {})}>{S(p.tag).text}</div>
                  <div className="t-h3" style={{ fontSize: 17, marginBottom: 8 }}>{S(p.title).text}</div>
                  <div className="t-small">{S(p.date).text}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBandV2 />
    </>
  );
}
