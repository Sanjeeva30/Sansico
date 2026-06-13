import marketsJson  from "@/content/markets.json";
import productsJson from "@/content/products.json";
import workJson     from "@/content/work.json";

export default function sitemap() {
  const base = "https://www.sansico.com";
  const statics = [
    "", "/capabilities", "/markets", "/products", "/work",
    "/sustainability", "/company", "/company/facilities",
    "/careers", "/contact", "/team", "/news"
  ];
  const dyn = [
    ...(marketsJson.items  || []).map(m => `/markets/${m.slug}`),
    ...(productsJson.items || []).map(p => `/products/${p.slug}`),
    ...(workJson.items     || []).map(w => `/work/${w.slug}`),
  ];
  return [...statics, ...dyn].map(p => ({
    url: base + p,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.7
  }));
}
