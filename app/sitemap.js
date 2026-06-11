import { getMarkets, getProducts, getWork } from "@/lib/content";

export default function sitemap() {
  const base = "https://www.sansico.com";
  const statics = ["", "/capabilities", "/markets", "/products", "/work", "/sustainability", "/company", "/company/facilities", "/careers", "/contact", "/privacy"];
  const dyn = [
    ...getMarkets().items.map((m) => `/markets/${m.slug}`),
    ...getProducts().items.map((p) => `/products/${p.slug}`),
    ...getWork().items.map((w) => `/work/${w.slug}`)
  ];
  return [...statics, ...dyn].map((p) => ({ url: base + p, changeFrequency: "monthly", priority: p === "" ? 1 : 0.7 }));
}
