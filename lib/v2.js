import { getClient } from "./sanity/client";

// The v2 dataset is public, so published reads need no token. Inside the
// Presentation tool getClient() swaps in a drafts-perspective, stega-enabled
// client so every string carries "which field did this come from" metadata.
async function q(query, params = {}) {
  try {
    const client = await getClient();
    return await client.fetch(query, params);
  } catch (err) {
    console.error("[v2] Sanity error:", err.statusCode, err.message);
    return null;
  }
}

/* Every image field is projected the same way, so blocks can rely on the shape. */
const IMG = `{ "url": image.asset->url, alt, "caption": caption }`;
const LINK = `{ label, href, newTab, bgColor, textColor }`;

// The blocks are heterogeneous, so we project the union of every field they use.
// GROQ returns null for fields a given block doesn't have, which the renderer
// simply ignores.
const SECTIONS = `sections[]{
  _key, _type, visible, theme, anchorId, bgColor, textColor, scrimColor, accentColor,
  head{ kicker, heading, intro },
  kicker, eyebrow, heading, subtitle, body, intro, meta, caption, label,
  showStrip, imageSide, ratio, columns, align, limit, videoUrl, heroType, sub, note, showSources, headingLevel,
  autoScroll, autoScrollSpeed,
  image${IMG}, poster${IMG}, background${IMG}, icon${IMG}, map${IMG},
  cta${LINK}, link${LINK}, secondaryCta${LINK},
  stats[]{ _key, value, label, bgColor, textColor },
  cards[]{ _key, tag, title, desc, meta, cta${LINK}, image${IMG}, icon${IMG}, bgColor, textColor, borderColor },
  tiles[]{ _key, label, image${IMG}, cta${LINK}, bgColor, textColor },
  steps[]{ _key, n, title, time, bgColor, textColor },
  faqs[]{ _key, q, a },
  items[]{ _key, title, desc, bgColor, textColor },
  logos[]{ _key, name, logo${IMG} },
  pins[]{ label, x, y },
  offices[]{ _key, label, name, address, mapLink${LINK} },
  submitLabel, successHeading, successBody, asideTitle,
  fields[]{ label, placeholder, name, type, required, options },
  aside[]{ _key, title, body },
  stories[]->{ _id, _type, name, location, quote, image${IMG}, "logoUrl": logo.asset->url, link${LINK} },
  milestones[]->{ _id, _type, year, title, copy, image${IMG} },
  groups[]{
    _key, label,
    facilities[]->{ _id, _type, name, city, focus, address, "photoUrl": photo.asset->url, "logoUrl": logo.asset->url }
  },
  certGroups[]->{ _id, _type, title, sub, column, accentColor, items[]{ _key, name, "logoUrl": logo.asset->url, scope, entity } },
  categories[]->{ _id, _type, name, "slug": slug.current, blurb, description, "coverUrl": coverImage.asset->url,
    "products": *[_type=="productItem" && references(^._id) && visible != false && defined(slug.current)]|order(orderRank asc){
      _id, _type, name, "slug": slug.current, material, "thumbUrl": photos[0].asset->url } },
  roles[]->{ _id, _type, role, "slug": slug.current, dept, location, type },
  posts[]->{ _id, _type, title, "slug": slug.current, tag, date, readTime, cover${IMG} },
  scorecard->{ _id, _type, legend[]{ _key, n, label }, columns,
    rows[]{ _key, country, starred, scores, total, highlightColor },
    footnoteTitle, footnote, conclusionTitle, conclusion },
  _type == "whyIndonesiaDetailBlock" => {
    "research": *[_id=="whyIndonesia"][0]{
      _id, _type,
      executiveTitle, executiveIntro, dimensions[]{_key, title, body}, executiveConclusion,
      aseanTitle, aseanBody, aseanConclusion,
      javaTitle, javaIntro, javaRegions[]{_key, name, description}, javaPlatformNote,
      sectorsTitle, sectorsBody, sectorsConclusion,
      susTitle, susBody, susPoints,
      tradeTitle, tradeBody, tradeAgreements[]{_key, name, description},
      fiberTitle, fiberBody, fiberPoints[]{_key, title, body},
      conclusionStatement, conclusionBullets,
      sources[]{category, label, url}
    }
  }
}`;

export async function getV2Page(pageId) {
  return q(
    `*[_type=="v2Page" && pageId==$pageId][0]{
      _id, _type,
      title, pageId, visible, showCtaBanner, seoTitle, seoDescription,
      "seoImageUrl": seoImage.asset->url,
      ${SECTIONS}
    }`,
    { pageId }
  );
}

export async function getAudiencePage(slug) {
  return q(
    `*[_type=="audiencePage" && slug.current==$slug][0]{
      _id, _type,
      label, "slug": slug.current, visible, seoTitle, seoDescription,
      ${SECTIONS}
    }`,
    { slug }
  );
}

export async function getAudienceNav() {
  return (await q(
    `*[_type=="audiencePage" && visible != false]|order(orderRank asc){ label, "slug": slug.current }`
  )) || [];
}

/* ── Products ───────────────────────────────────────────── */
export async function getCategories() {
  return (await q(
    `*[_type=="productCategory" && visible != false && defined(slug.current)]|order(orderRank asc){
      name, "slug": slug.current, blurb, description, "coverUrl": coverImage.asset->url,
      "products": *[_type=="productItem" && references(^._id) && visible != false && defined(slug.current)]|order(orderRank asc){
        name, "slug": slug.current, material, "thumbUrl": photos[0].asset->url
      }
    }`
  )) || [];
}

export async function getCategory(slug) {
  return q(
    `*[_type=="productCategory" && slug.current==$slug][0]{
      name, "slug": slug.current, blurb, description, "coverUrl": coverImage.asset->url,
      "products": *[_type=="productItem" && references(^._id) && visible != false && defined(slug.current)]|order(orderRank asc){
        name, "slug": slug.current, material, moq, "thumbUrl": photos[0].asset->url
      }
    }`,
    { slug }
  );
}

export async function getProduct(slug) {
  return q(
    `*[_type=="productItem" && slug.current==$slug][0]{
      name, "slug": slug.current, description, material, moq,
      "category": category->{ name, "slug": slug.current },
      "photos": photos[]{ caption, "url": asset->url },
      specs[]{ label, value },
      variants[]{ material, technique, moq, designer,
        image{ "url": image.asset->url, alt, caption } }
    }`,
    { slug }
  );
}

/* ── Careers ────────────────────────────────────────────── */
export async function getRoles() {
  return (await q(
    `*[_type=="jobRole" && visible != false && defined(slug.current)]|order(orderRank asc){
      role, "slug": slug.current, dept, location, type
    }`
  )) || [];
}

export async function getRole(slug) {
  return q(
    `*[_type=="jobRole" && slug.current==$slug][0]{
      role, "slug": slug.current, dept, location, type, summary,
      willDo, youAre, youHave, compensation, aboutCompany,
      image{ "url": image.asset->url, alt, caption },
      seoTitle, seoDescription
    }`,
    { slug }
  );
}

/* ── Blog ───────────────────────────────────────────────── */
export async function getPosts() {
  return (await q(
    `*[_type=="blogPost" && visible != false && defined(slug.current)]|order(orderRank asc){
      title, "slug": slug.current, tag, date, readTime, excerpt,
      cover{ "url": image.asset->url, alt, caption }
    }`
  )) || [];
}

export async function getPost(slug) {
  return q(
    `*[_type=="blogPost" && slug.current==$slug][0]{
      title, "slug": slug.current, tag, date, readTime, excerpt,
      cover{ "url": image.asset->url, alt, caption },
      body[]{ ..., _type == "richImage" => { "url": image.asset->url, alt, caption } },
      "author": author->{ name, role, "photoUrl": photo.asset->url },
      seoTitle, seoDescription
    }`,
    { slug }
  );
}

/* ── Site chrome ────────────────────────────────────────── */
export async function getV2Site() {
  const [site, audiences, categories] = await Promise.all([
    q(`*[_id=="siteSettings"][0]{
      tagline, mission, ctaLabel, email, whatsapp, phones,
      "logoUrl": logo.asset->url,
      ctaBand{ headline, subline, btn1Label, btn1Href, btn2Label, btn2Href,
        bgColor, textColor, accentColor, btnBgColor, btnTextColor }
    }`),
    getAudienceNav(),
    q(`*[_type=="productCategory" && visible != false && defined(slug.current)]|order(orderRank asc){ name, "slug": slug.current }`),
    ]);
  const caps = await q(
    `*[_type=="capability" && visible != false]|order(orderRank asc){ title, "slug": slug.current }`
  );
  return {
    ...(site || {}),
    audiences: audiences || [],
    categories: categories || [],
    capabilities: caps || [],
  };
}
