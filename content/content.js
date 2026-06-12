import { createClient } from "@sanity/client";
import siteJson from "@/content/site.json";
import homeJson from "@/content/home.json";
import capsJson from "@/content/capabilities.json";
import marketsJson from "@/content/markets.json";
import productsJson from "@/content/products.json";
import workJson from "@/content/work.json";
import susJson from "@/content/sustainability.json";
import companyJson from "@/content/company.json";
import careersJson from "@/content/careers.json";
import locJson from "@/content/locations.json";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "rvghw4zu";
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET    || "production";
const TOKEN      = process.env.SANITY_API_TOKEN;

// Token is required because the Sanity dataset is set to private.
// Without it every fetch returns 403 and the site falls back to JSON.
const client = createClient({
  projectId: PROJECT_ID,
  dataset:   DATASET,
  apiVersion: "2024-01-01",
  useCdn:    false,   // false = always fresh data after a Studio publish
  token:     TOKEN,   // viewer token stored in Vercel env
});

async function sanityFetch(query) {
  if (!TOKEN) {
    // No token available — warn once and skip Sanity entirely
    console.warn("[content.js] SANITY_API_TOKEN not set — serving JSON fallback");
    return null;
  }
  try {
    return await client.fetch(query);
  } catch (err) {
    console.error("[content.js] Sanity fetch failed:", err.statusCode, err.message);
    return null;
  }
}

export async function getSite() {
  const d = await sanityFetch(`*[_id == "siteSettings"][0]{ tagline, mission, ctaLabel, email, whatsapp, phones, nav, "cta":{"label":ctaLabel,"href":"/contact"}, "contact":{"email":email,"whatsapp":{"enabled":true,"number":whatsapp},"phones":phones,"presence":[{"country":"Indonesia","detail":"9 manufacturing facilities — close to vendor, close to production"},{"country":"China","detail":"1 manufacturing facility — close to technology & development"},{"country":"USA","detail":"Market representation — close to business"}]}, "social":[{"label":"LinkedIn","href":"https://www.linkedin.com/company/sansico"},{"label":"Instagram","href":"https://www.instagram.com/sansicogroup"},{"label":"TikTok","href":"https://www.tiktok.com/@sansicogroup"}], "footerNote":"© 2026 Sansico Group. All rights reserved.", "name":"Sansico Group" }`);
  return d || siteJson;
}

export async function getHome() {
  const d = await sanityFetch(`*[_id == "homePage"][0]{ "hero":{"type":heroType,"eyebrow":heroEyebrow,"title":heroTitle,"sub":heroSub,"primary":{"label":"Start a conversation","href":"/contact"},"secondary":{"label":"Explore capabilities","href":"/capabilities"},"videoUrl":heroVideo,"posterUrl":""}, "manifesto":{"title":manifestoTitle,"body":manifestoBody}, stats, customers, "featuredWork":featuredWork->slug.current }`);
  return d || homeJson;
}

export async function getCapabilities() {
  const d = await sanityFetch(`{"title":"Three capabilities, one accountable partner","intro":"From the first trend board to the container at port, Sansico operates as a single accountable partner.","groups":*[_type=="capability"]|order(order asc){title,"slug":slug.current,num,summary,body,points},"facilities":*[_type=="facility"]|order(order asc){name,city,"location":city,focus}}`);
  return d || capsJson;
}

export async function getMarkets() {
  const d = await sanityFetch(`{"title":"Land where your category lives","intro":"Buyers don't source from companies; they source for categories.","items":*[_type=="market"]|order(order asc){title,"slug":slug.current,color,tag,body,proof}}`);
  return d || marketsJson;
}

export async function getMarket(slug) {
  const data = await getMarkets();
  return data.items.find(m => m.slug === slug);
}

export async function getProducts() {
  const d = await sanityFetch(`{"title":"Five product families, developed to your specification","intro":"Everything below is made to order inside customers' own programmes.","items":*[_type=="product"]|order(order asc){title,"slug":slug.current,tag,body,specs}}`);
  return d || productsJson;
}

export async function getProduct(slug) {
  const data = await getProducts();
  return data.items.find(p => p.slug === slug);
}

export async function getWork() {
  const d = await sanityFetch(`{"title":"Proof, not promises","intro":"Selected programmes with the numbers that matter.","items":*[_type=="caseStudy"]|order(_createdAt asc){title,"slug":slug.current,kicker,quote,body,stats}}`);
  return d || workJson;
}

export async function getCase(slug) {
  const data = await getWork();
  return data.items.find(w => w.slug === slug);
}

export async function getSustainability() {
  const d = await sanityFetch(`{"title":"Certified, dated, verifiable — sustainability as a discipline, not an adjective.","intro":"Every certification Sansico holds is published with its scope and holding entity.","pillars":[],"stat":{"value":"95%","label":"Minimum recycled content, gift-bag programme"},"certifications":*[_type=="certification"]|order(_createdAt asc){name,category,scope,entity,"certificate":""},"note":"Certificate documents are being attached to each entry."}`);
  return d || susJson;
}

export async function getCompany() {
  const d = await sanityFetch(`*[_id=="siteSettings"][0]{"title":"An Indonesian group built for the world's shelves","intro":"Sansico Group Indonesia is an internationally recognised design and solutions provider.","vision":mission,"culture":"A culture of long-term relationships: with customers measured in decades, with communities measured in livelihoods.","timeline":[],"innovation":[],"leadership":{"note":"Leadership profiles to be added."}}`);
  return d || companyJson;
}

export async function getCareers() {
  const d = await sanityFetch(`*[_id=="careersPage"][0]{title,intro,values,openRoles}`);
  return d || careersJson;
}

export async function getLocations() {
  const d = await sanityFetch(`{"title":"Our locations","items":*[_type=="facility"]|order(order asc){name,city,address}}`);
  return d || locJson;
}

export const accentSplit = (s) => s ? s.split("|") : ["","",""];
