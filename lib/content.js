import { createClient } from "@sanity/client";
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

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "rvghw4zu";
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET    || "production";
const TOKEN      = process.env.SANITY_API_TOKEN;

const client = createClient({
  projectId: PROJECT_ID, dataset: DATASET,
  apiVersion: "2024-01-01", useCdn: false, token: TOKEN,
});

async function sanityFetch(query) {
  if (!TOKEN) { console.warn("[content.js] SANITY_API_TOKEN not set — JSON fallback"); return null; }
  try { return await client.fetch(query); }
  catch (err) { console.error("[content.js] Sanity error:", err.statusCode, err.message); return null; }
}

// ── Page settings ────────────────────────────────────────
export async function getPageSettings(pageId) {
  const d = await sanityFetch(
    `*[_type=="pageSettings" && pageId=="${pageId}"][0]{ visible, seoTitle, seoDescription, "seoImageUrl":seoImage.asset->url }`
  );
  return d || { visible: true };
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
      "videoUrl":heroVideo,"posterUrl":""},
    "manifesto":{"title":manifestoTitle,"body":manifestoBody},
    "stats":stats[]{value,suffix,label,"bgHex":coalesce(bgColor.hex, bgColor),"textHex":coalesce(textColor.hex, textColor)},
    "customers":customers[]{name,"logoUrl":logo.asset->url},
    "featuredWork":featuredWork->slug.current
  }`);
  return d || homeJson;
}

// ── Capabilities ─────────────────────────────────────────
export async function getCapabilities() {
  const d = await sanityFetch(`{
    "title":"Three capabilities, one accountable partner",
    "intro":"From the first trend board to the container at port, Sansico operates as a single accountable partner.",
    "groups":*[_type=="capability"]|order(orderRank asc){
      title,"slug":slug.current,num,summary,body,richBody,points,
      "colorHex":coalesce(colorTheme.hex, colorTheme),
      "imageUrl":image.asset->url,
      "gallery":gallery[]{caption,"url":asset->url},
      "subServices":subServices[]{title,description},
      "proofPoints":proofPoints[]{value,label},
      "customerLogos":customerLogos[]{name,"logoUrl":logo.asset->url}
    },
    "facilities":*[_type=="facility"]|order(orderRank asc){
      name,city,"location":city,focus,"photoUrl":photo.asset->url
    }
  }`);
  return d || capsJson;
}

// ── Markets ──────────────────────────────────────────────
export async function getMarkets() {
  const d = await sanityFetch(`{
    "title":"Land where your category lives",
    "intro":"Buyers don't source from companies; they source for categories.",
    "items":*[_type=="market"]|order(orderRank asc){
      title,"slug":slug.current,color,"colorHex":color.hex,tag,body,proof,
      "imageUrl":image.asset->url
    }
  }`);
  return d || marketsJson;
}
export async function getMarket(slug) {
  const d = await getMarkets(); return d.items.find(m => m.slug === slug);
}

// ── Products (new portfolio) ─────────────────────────────
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
// Legacy compat
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
    "items":*[_type=="caseStudy"]|order(_createdAt asc){
      title,"slug":slug.current,kicker,quote,body,stats,externalUrl,
      "clientLogoUrl":clientLogo.asset->url
    }
  }`);
  return d || workJson;
}
export async function getCase(slug) {
  const d = await getWork(); return d.items.find(w => w.slug === slug);
}

// ── Sustainability ────────────────────────────────────────
export async function getSustainability() {
  const d = await sanityFetch(`{
    "title":"Certified, dated, verifiable — sustainability as a discipline, not an adjective.",
    "intro":"Every certification Sansico holds is published with its scope and holding entity.",
    "pillars":[],
    "stat":{"value":"95%","label":"Minimum recycled content, gift-bag programme"},
    "certifications":*[_type=="certification"]|order(_createdAt asc){
      name,"category":select(category=="custom" => customCategory, category),scope,entity,issued,expires,registration,
      "logoUrl":logo.asset->url,
      "certificateUrl":certificate.asset->url
    },
    "note":"Certificate documents are attached to each entry."
  }`);
  return d || susJson;
}

// ── Company ──────────────────────────────────────────────
export async function getCompany() {
  const d = await sanityFetch(`{
    "title":"An Indonesian group built for the world's shelves",
    "intro":"Sansico Group Indonesia is an internationally recognised design and solutions provider.",
    "vision":*[_id=="siteSettings"][0].mission,
    "culture":"A culture of long-term relationships: with customers measured in decades, with communities measured in livelihoods.",
    "timeline":[],
    "innovation":[],
    "facilities":*[_type=="facility"]|order(orderRank asc){
      name,city,address,focus,capacity,"photoUrl":photo.asset->url
    }
  }`);
  return d || companyJson;
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
  const d = await sanityFetch(`*[_type=="newsPost" && visible!=false]|order(publishedAt desc){
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
  const d = await sanityFetch(`{"title":"Our locations","items":*[_type=="facility"]|order(orderRank asc){name,city,address}}`);
  return d || locJson;
}

export const accentSplit = (s) => s ? s.split("|") : ["","",""];
