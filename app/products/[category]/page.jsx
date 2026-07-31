export const revalidate = 30;
import Link from "next/link";
import { notFound } from "next/navigation";
import Media from "@/components/v2/Media";
import CtaBandV2 from "@/components/v2/CtaBandV2";
import { getCategory, getCategories } from "@/lib/v2";
import { getStyled } from "@/lib/styledText";

const S = (v) => getStyled(v);

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const cat = await getCategory(category);
  return { title: S(cat?.name).text || "Products", description: S(cat?.blurb || cat?.description).text };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const cat = await getCategory(category);
  if (!cat) notFound();

  const name = S(cat.name);
  const blurb = S(cat.blurb || cat.description);

  return (
    <>
      <div className="wrap v2-crumb">
        <Link href="/products">Products</Link> / {name.text}
      </div>

      <div className="wrap" style={{ paddingTop: 24 }}>
        <h1 className="t-h1" style={{ marginBottom: 18, ...name.style }}>{name.text}</h1>
        <p className="t-body-lg" style={{ maxWidth: 620, ...blurb.style }}>{blurb.text}</p>
      </div>

      <section className="v2-section">
        <div className="wrap rv">
          <div className="grid-n" style={{ "--cols": 3 }}>
            {(cat.products || []).map((p) => {
              const pn = S(p.name);
              return (
                <Link href={`/products/${cat.slug}/${p.slug}`} key={p.slug}>
                  <Media value={{ url: p.thumbUrl, alt: pn.text }} ratio="4/3" showCaption={false} />
                  <div className="t-h3" style={{ margin: "16px 0 6px", fontSize: 17 }}>{pn.text}</div>
                  <div className="t-small">{S(p.material).text}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBandV2 />
    </>
  );
}
