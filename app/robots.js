// Only the real production deployment is crawlable. Preview deployments — such
// as the v2-wireframe branch on sansico.sanjeeva.world — are disallowed so the
// unfinished site can never be indexed or compete with sansico.com in search.
// Driven by VERCEL_ENV rather than a hardcoded flag, so merging this branch to
// main cannot accidentally carry a noindex into production.
const isProduction = process.env.VERCEL_ENV === "production";

export default function robots() {
  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.sansico.com/sitemap.xml",
  };
}
