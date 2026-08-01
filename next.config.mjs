/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async redirects() {
    return [
      // legacy v1 URLs
      { source: "/about-us",      destination: "/company",            permanent: true },
      { source: "/our-service",   destination: "/capabilities",       permanent: true },
      { source: "/our-products",  destination: "/products",           permanent: true },
      { source: "/contact-us",    destination: "/contact",            permanent: true },
      { source: "/our-locations", destination: "/company",            permanent: true },

      // routes retired in v2 — the wireframe folds these into other pages
      { source: "/company/facilities", destination: "/company#facilities", permanent: true },
      { source: "/markets",            destination: "/products",           permanent: true },
      { source: "/markets/:slug",      destination: "/products",           permanent: true },
      { source: "/work",               destination: "/",                   permanent: true },
      { source: "/work/:slug",         destination: "/",                   permanent: true },
      { source: "/team",               destination: "/company",            permanent: true },
      { source: "/news",               destination: "/blog",               permanent: true },
      { source: "/news/:slug",         destination: "/blog/:slug",         permanent: true },
    ];
  },
  async headers() {
    // The Presentation tool renders the site inside an iframe, so framing has
    // to be allowed — but only from the Studio. This is stricter than the
    // previous default, which allowed any site to frame ours.
    const STUDIO_ORIGINS = [
      "https://sansico-v2.sanity.studio",
      "https://sansico.sanity.studio",
      "https://*.sanity.studio",
      "http://localhost:3333",
    ].join(" ");
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: `frame-ancestors 'self' ${STUDIO_ORIGINS};` },
        ],
      },
    ];
  },
};
export default nextConfig;
