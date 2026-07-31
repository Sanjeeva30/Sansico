import { getCategories, getPosts, getRoles, getAudienceNav } from "@/lib/v2";

export default async function sitemap() {
  const base = "https://www.sansico.com";

  const [cats, posts, roles, audiences] = await Promise.all([
    getCategories(), getPosts(), getRoles(), getAudienceNav(),
  ]);

  const statics = [
    "", "/capabilities", "/products", "/sustainability", "/company",
    "/why-indonesia", "/careers", "/blog", "/contact",
  ];

  const dyn = [
    ...audiences.map((a) => `/${a.slug}`),
    ...cats.flatMap((c) => [
      `/products/${c.slug}`,
      ...(c.products || []).map((p) => `/products/${c.slug}/${p.slug}`),
    ]),
    ...posts.map((p) => `/blog/${p.slug}`),
    ...roles.map((r) => `/careers/${r.slug}`),
  ];

  return [...statics, ...dyn].map((p) => ({
    url: base + p,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.7,
  }));
}
