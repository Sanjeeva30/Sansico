import { notFound } from "next/navigation";
import Sections from "./Sections";
import CtaBandV2 from "./CtaBandV2";
import { getV2Page, getAudiencePage } from "@/lib/v2";

/** Renders a section-block page by route id. */
export default async function V2Page({ pageId }) {
  const page = await getV2Page(pageId);
  if (!page || page.visible === false) notFound();
  return (
    <>
      <Sections sections={page.sections || []} />
      {page.showCtaBanner === false ? null : <CtaBandV2 />}
    </>
  );
}

/** Renders one of the audience pages (buyers / factories / creatives). */
export async function AudienceRoute({ slug }) {
  const page = await getAudiencePage(slug);
  if (!page || page.visible === false) notFound();
  return (
    <>
      <Sections sections={page.sections || []} />
      <CtaBandV2 />
    </>
  );
}

export async function v2Metadata(pageId, fallback = {}) {
  const page = await getV2Page(pageId);
  return {
    title: page?.seoTitle || fallback.title,
    description: page?.seoDescription || fallback.description,
    ...(page?.seoImageUrl ? { openGraph: { images: [{ url: page.seoImageUrl }] } } : {}),
  };
}
