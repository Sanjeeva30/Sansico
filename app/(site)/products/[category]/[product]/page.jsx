export const revalidate = 30;
import Link from "next/link";
import { notFound } from "next/navigation";
import Media from "@/components/v2/Media";
import CtaBandV2 from "@/components/v2/CtaBandV2";
import { getProduct, getCategories } from "@/lib/v2";
import { draftMode } from "next/headers";
import { getStyled } from "@/lib/styledText";
import { editAttr } from "@/lib/sanity/edit";

const S = (v) => getStyled(v);

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.flatMap((c) => (c.products || []).map((p) => ({ category: c.slug, product: p.slug })));
}

export async function generateMetadata({ params }) {
  const { product } = await params;
  const p = await getProduct(product);
  return { title: S(p?.name).text || "Product", description: S(p?.description).text };
}

function SpecRow({ label, value }) {
  const v = S(value);
  if (!v.text) return null;
  return (
    <div className="v2-rule" style={{ padding: "14px 0" }}>
      <div className="t-small">{label}</div>
      <div className="t-body" style={{ color: "var(--ink)", ...v.style }}>{v.text}</div>
    </div>
  );
}

export default async function ProductPage({ params }) {
  const { category, product } = await params;
  const p = await getProduct(product);
  if (!p) notFound();
  const isDraft = (await draftMode()).isEnabled;
  const at = (path) => (isDraft ? editAttr({ id: p._id, type: p._type, path }) : undefined);

  const name = S(p.name);
  const catName = S(p.category?.name);
  const catSlug = p.category?.slug || category;

  // Variants are the richer model; fall back to the photo gallery for products
  // that have not had variants filled in yet.
  const variants = p.variants?.length
    ? p.variants
    : (p.photos || []).map((ph) => ({
        image: { url: ph.url, caption: ph.caption, alt: ph.caption },
        material: p.material, moq: p.moq,
      }));

  return (
    <>
      <div className="wrap v2-crumb">
        <Link href="/products">Products</Link> / <Link href={`/products/${catSlug}`}>{catName.text}</Link> / {name.text}
      </div>

      <div className="wrap" style={{ paddingTop: 24 }}>
        <h1 className="t-h1" style={{ marginBottom: 18, ...name.style }}>{name.text}</h1>
        {S(p.description).text ? (
          <p className="t-body-lg" style={{ maxWidth: 640 }}>{S(p.description).text}</p>
        ) : null}
      </div>

      <section className="v2-section">
        <div className="wrap">
          {variants.map((v, i) => (
            <div className="grid12 rv" key={i} style={{ marginBottom: 64, alignItems: "start" }}>
              <div className="c-8"><Media value={v.image} ratio="16/9" w={1600} h={900}
                edit={at(v._key ? `variants[_key=="${v._key}"].image` : "photos")} /></div>
              <div className="c-4">
                <SpecRow label="Material" value={v.material || p.material} />
                <SpecRow label="Technique" value={v.technique} />
                <SpecRow label="MOQ" value={v.moq || p.moq} />
                <SpecRow label="Designer" value={v.designer} />
                {(p.specs || []).map((s, k) => (
                  <SpecRow key={k} label={S(s.label).text} value={s.value} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBandV2 />
    </>
  );
}
