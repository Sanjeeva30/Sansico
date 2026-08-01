import { getClient } from "@/lib/sanity/client";
import { getStyled } from "@/lib/styledText";
import siteJson     from "@/content/site.json";
import homeJson     from "@/content/home.json";
import capsJson     from "@/content/capabilities.json";
import marketsJson  from "@/content/markets.json";
import productsJson from "@/content/products.json";
import workJson     from "@/content/work.json";
import susJson      from "@/content/sustainability.json";
import companyJson  from "@/content/company.json";
import careersJson  from "@/content/careers.json";
import locJson      from "@/content/locations.json";

// The v2 dataset has a public ACL, so reads work without a token. Inside the
// Presentation tool getClient() returns a drafts + stega client instead, so
// site-settings-driven chrome (logo, CTA band) is click-to-editable too.
// If the dataset is unreadable we fall back to the bundled JSON below.
async function sanityFetch(query) {
  try {
    const client = await getClient();
    return await client.fetch(query);
  } catch (err) {
    console.error("[content.js] Sanity error:", err.statusCode, err.message);
    return null;
  }
}

// Re-exported for backwards compatibility; the implementation lives in
// lib/image.js so client components can use it without pulling in next/headers.
export { sanityImgUrl } from "@/lib/image";

// ── Page settings ────────────────────────────────────────
export async function getPageSettings(pageId) {
  const d = await sanityFetch(
    `*[_type=="pageSettings" && pageId=="${pageId}"][0]{
      visible, seoTitle, seoDescription, "seoImageUrl":seoImage.asset->url,
      pageTitle, pageIntro,
      "heroType":coalesce(heroType,"ink"),
      "heroImageUrl":heroImage.asset->url,
      "heroVideoUrl":heroVideo,
      "heroPosterUrl":heroPoster.asset->url
    }`
  );
  return d || { visible: true, heroType: "ink" };
}
async function getAllPageSettings() {
  const d = await sanityFetch(`*[_type=="pageSettings"]{ pageId, visible }`);
  return d || [];
}
export async function getPageSeo(pageId, defaults = {}) {
  const s = await getPageSettings(pageId);
  return {
    title:       s.seoTitle       || defaults.title       || undefined,
    description: s.seoDescription || defaults.description || undefined,
    ...(s.seoImageUrl ? { openGraph: { images: [{ url: s.seoImageUrl }] } } : {}),
  };
}

// ── Site / nav ───────────────────────────────────────────
export async function getSite() {
  const [d, pages] = await Promise.all([
    sanityFetch(`*[_id=="siteSettings"][0]{
      tagline, mission, ctaLabel, email, whatsapp, phones, nav,
      "logoUrl": logo.asset->url,
      headingFont, bodySize, "accentHex": coalesce(accentColour.hex, accentColour),
      "cta":{"label":ctaLabel,"href":"/contact"},
      "contact":{"email":email,"whatsapp":{"enabled":true,"number":whatsapp},"phones":phones,
        "presence":[
          {"country":"Indonesia","detail":"9 manufacturing facilities — close to vendor, close to production"},
          {"country":"China","detail":"1 manufacturing facility — close to technology & development"},
          {"country":"USA","detail":"Market representation — close to business"}
        ]
      },
      "ctaBand": ctaBand,
      "social":[
        {"label":"LinkedIn","href":"https://www.linkedin.com/company/sansico"},
        {"label":"Instagram","href":"https://www.instagram.com/sansicogroup"},
        {"label":"TikTok","href":"https://www.tiktok.com/@sansicogroup"}
      ],
      "footerNote":"© 2026 Sansico Group. All rights reserved.",
      "name":"Sansico Group"
    }`),
    getAllPageSettings(),
  ]);
  const result = d || siteJson;
  if (pages.length && result.nav) {
    const hidden = new Set(pages.filter(p => p.visible === false).map(p => p.pageId));
    result.nav = result.nav.filter(n => {
      const id = (n.href || "").replace(/^\//, "").split("/")[0];
      return !hidden.has(id);
    });
  }
  return result;
}

// ── Home ─────────────────────────────────────────────────
export async function getHome() {
  const d = await sanityFetch(`*[_id=="homePage"][0]{
    "hero":{"type":heroType,"eyebrow":heroEyebrow,"title":heroTitle,"sub":heroSub,
      "primary":{"label":"Start a conversation","href":"/contact"},
      "secondary":{"label":"Explore capabilities","href":"/capabilities"},
      "videoUrl":heroVideo,"imageUrl":heroImage.asset->url,"posterUrl":heroPoster.asset->url},
    "manifesto":{"title":manifestoTitle,"body":manifestoBody},
    "stats":stats[]{value,suffix,label,"bgHex":coalesce(bgColor.hex,bgColor),"textHex":coalesce(textColor.hex,textColor)},
    "customers":customers[]{name,"logoUrl":logo.asset->url},
    "featuredWork":featuredWork->slug.current,
    "certSection":*[_id=="siteSettings"][0].susSection{
      certHeadline,certBody,certBadges,
      donutCenterValue,donutCenterLabel,
      donutSegments[]{label,percentage,color}
    }
  }`);
  return d || homeJson;
}

// ── Capabilities ─────────────────────────────────────────
export async function getCapabilities() {
  const d = await sanityFetch(`{
    "title":"Three capabilities, one accountable partner",
    "intro":"From the first trend board to the container at port, Sansico operates as a single accountable partner.",
    "groups":*[_type=="capability" && visible!=false]|order(orderRank asc){
      title,"slug":slug.current,num,summary,body,richBody,points,
      "colorHex":coalesce(colorTheme.hex,colorTheme),
      "imageUrl":image.asset->url,
      "gallery":gallery[]{caption,"url":asset->url},
      "subServices":subServices[]{title,description},
      "proofPoints":proofPoints[]{value,label},
      "customerLogos":customerLogos[]{name,"logoUrl":logo.asset->url}
    },
    "facilities":*[_type=="facility" && visible!=false]|order(orderRank asc){
      name,city,focus,"photoUrl":photo.asset->url,"logoUrl":logo.asset->url
    }
  }`);
  return d || capsJson;
}

// ── Markets ──────────────────────────────────────────────
export async function getMarkets() {
  const d = await sanityFetch(`{
    "title":"Land where your category lives",
    "intro":"Buyers don't source from companies; they source for categories.",
    "items":*[_type=="market" && defined(slug)]|order(orderRank asc){
      title,"slug":slug.current,color,"colorHex":coalesce(color.hex,color),tag,body,proof,
      "imageUrl":image.asset->url,
      visible
    }
  }`);
  if (d?.items) {
    const seen = new Set();
    d.items = d.items.filter(m => m.slug && m.visible !== false && !seen.has(m.slug) && seen.add(m.slug));
  }
  return d || marketsJson;
}

export async function getMarket(slug) {
  const d = await sanityFetch(`*[_type=="market" && slug.current=="${slug}"][0]{
    title,"slug":slug.current,color,"colorHex":coalesce(color.hex,color),tag,body,richBody,proof,
    "imageUrl":image.asset->url,
    "marketStats":marketStats[]{value,label},
    "capabilityRefs":capabilityRefs[]->{title,"slug":slug.current,summary,num},
    "featuredWork":featuredWork->{title,"slug":slug.current,kicker,quote,stats,
      "clientLogoUrl":clientLogo.asset->url},
    "relatedProducts":relatedProducts[]->{name,"slug":slug.current,description,
      "coverUrl":coverImage.asset->url},
    visible
  }`);
  return d || null;
}

// ── Products ─────────────────────────────────────────────
export async function getProductCategories() {
  const d = await sanityFetch(`*[_type=="productCategory" && visible!=false]|order(orderRank asc){
    name,"slug":slug.current,description,"coverUrl":coverImage.asset->url,
    "products":*[_type=="productItem" && references(^._id) && visible!=false]|order(orderRank asc){
      name,"slug":slug.current,description,"thumbUrl":photos[0].asset->url
    }
  }`);
  return d || [];
}
export async function getProductItem(slug) {
  const d = await sanityFetch(`*[_type=="productItem" && slug.current=="${slug}"][0]{
    name,"slug":slug.current,description,moq,
    "photos":photos[]{caption,"url":asset->url},
    "specs":specs[]{label,value},
    "category":category->{name,"slug":slug.current}
  }`);
  return d || null;
}
export async function getProducts() {
  const cats = await getProductCategories();
  return { title:"Product portfolio", intro:"Developed to your specification.", items: cats };
}
export async function getProduct(slug) { return getProductItem(slug); }

// ── Work ─────────────────────────────────────────────────
export async function getWork() {
  const d = await sanityFetch(`{
    "title":"Proof, not promises",
    "intro":"Selected programmes with the numbers that matter.",
    "items":*[_type=="caseStudy"]|order(orderRank asc){
      title,"slug":slug.current,kicker,quote,body,stats,externalUrl,
      "clientLogoUrl":clientLogo.asset->url
    }
  }`);
  return d || workJson;
}
export async function getCase(slug) {
  const data = await getWork(); return data.items.find(w => w.slug === slug);
}

// ── Sustainability ────────────────────────────────────────
export async function getSustainability() {
  const d = await sanityFetch(`{
    "pageTitle":*[_id=="siteSettings"][0].susSection.pageTitle,
    "pageIntro":*[_id=="siteSettings"][0].susSection.pageIntro,
    "pillars":[],
    "susSection":*[_id=="siteSettings"][0].susSection,
    "certifications":*[_type=="certification" && visible!=false]|order(orderRank asc){
      name,"category":select(category=="custom" => customCategory, category),
      scope,entity,issued,expires,registration,
      "logoUrl":logo.asset->url,
      "certificateUrl":certificate.asset->url
    },
    "note":"Certificate documents are attached to each entry."
  }`);
  if (!d) return susJson;
  const titleStyled = getStyled(d.pageTitle) || {};
  const introStyled = getStyled(d.pageIntro) || {};
  // Build the stat object with fallback in plain JS — avoids invalid GROQ ternary syntax
  const stat = {
    value: d.susSection?.statValue || "95%",
    label: d.susSection?.statLabel || "Minimum recycled content, gift-bag programme",
  };
  return {
    ...d,
    title: titleStyled.text || "Certified, dated, verifiable — sustainability as a discipline, not an adjective.",
    titleStyle: titleStyled.style,
    intro: introStyled.text || "Every certification Sansico holds is published with its scope and holding entity.",
    introStyle: introStyled.style,
    stat,
  };
}

// ── Company ──────────────────────────────────────────────
export async function getCompany() {
  const d = await sanityFetch(`{
    "page":*[_id=="companyPage"][0]{title,intro,mission,vision,culture,overviewTitle,overviewBody,timeline,values},
    "facilities":*[_type=="facility" && visible!=false]|order(orderRank asc){
      name,city,address,focus,capacity,"photoUrl":photo.asset->url
    },
    "fallbackVision":*[_id=="siteSettings"][0].mission
  }`);
  if (!d) return companyJson;
  return {
    title:    d.page?.title    || "An Indonesian group built for the world's shelves",
    intro:    d.page?.intro    || "Sansico Group Indonesia is an internationally recognised design and solutions provider.",
    mission:  d.page?.mission  || "We build trusted partnerships with sustainable solutions that elevate daily life.",
    vision:   d.page?.vision   || "To be the partner that sustainably packages joy for people.",
    culture:  d.page?.culture  || "We work hard with honesty and respect for people to make sustainable products, build trusted partnerships and protect our planet.",
    overviewTitle: d.page?.overviewTitle || null,
    overviewBody:  d.page?.overviewBody  || null,
    timeline:      d.page?.timeline      || [],
    values:        d.page?.values?.length ? d.page.values : [
      { title: "Stewardship",    body: "Caring for our planet and its future." },
      { title: "Accountability", body: "Doing what is right and doing what we say." },
      { title: "Noble Execution",body: "Delivering quality, reliability, and consistency." },
      { title: "Safety & People",body: "Protecting our team and helping them grow." },
      { title: "Innovation",     body: "Finding better ways for people and the planet." },
    ],
    facilities:    d.facilities          || [],
  };
}

// ── Team ─────────────────────────────────────────────────
export async function getTeam() {
  const d = await sanityFetch(`*[_type=="person" && visible!=false]|order(orderRank asc){
    name,role,bio,linkedin,email,"photoUrl":photo.asset->url
  }`);
  return d || [];
}

// ── News ─────────────────────────────────────────────────
export async function getNews() {
  const d = await sanityFetch(`*[_type=="newsPost" && visible!=false]|order(orderRank asc){
    title,"slug":slug.current,postType,publishedAt,excerpt,externalUrl,sourceLabel,
    "coverUrl":coverImage.asset->url,
    "author":author->{name,"photoUrl":photo.asset->url}
  }`);
  return d || [];
}
export async function getNewsPost(slug) {
  const d = await sanityFetch(`*[_type=="newsPost" && slug.current=="${slug}"][0]{
    title,postType,publishedAt,excerpt,body,externalUrl,sourceLabel,
    "coverUrl":coverImage.asset->url,
    "author":author->{name,role,"photoUrl":photo.asset->url}
  }`);
  return d || null;
}

// ── Careers / Locations ──────────────────────────────────
export async function getCareers() {
  const d = await sanityFetch(`*[_id=="careersPage"][0]{title,intro,values,openRoles}`);
  return d || careersJson;
}
export async function getLocations() {
  const d = await sanityFetch(`{"title":"Our locations","items":*[_type=="facility" && visible!=false]|order(orderRank asc){name,city,address}}`);
  return d || locJson;
}


// ── Why Indonesia ─────────────────────────────────────────
import whyIdJson from "@/content/why-indonesia.json";
export async function getWhyIndonesia() {
  const d = await sanityFetch(`*[_id=="whyIndonesia"][0]{
    heroTitle,heroSubtitle,heroStats,
    executiveTitle,executiveIntro,dimensions,executiveConclusion,
    aseanTitle,aseanBody,aseanConclusion,
    javaTitle,javaIntro,javaRegions,javaPlatformNote,
    sectorsTitle,sectorsBody,sectorsConclusion,
    susTitle,susBody,susPoints,
    tradeTitle,tradeBody,tradeAgreements,
    fiberTitle,fiberBody,fiberPoints,
    conclusionStatement,conclusionBullets,
    ctaHeadline,ctaSubline,ctaBtnLabel,ctaBtnHref,
    scorecardVietnamNote,scorecardConclusion,
    sources[]{category,label,url}
  }`);
  return d || whyIdJson;
}

export const accentSplit = (s) => {
  const text = typeof s === "object" && s ? s.text : s;
  return text ? text.split("|") : ["", "", ""];
};
