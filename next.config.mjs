/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/about-us', destination: '/company', permanent: true },
      { source: '/our-service', destination: '/capabilities', permanent: true },
      { source: '/our-products', destination: '/products', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/our-locations', destination: '/company/facilities', permanent: true }
    ];
  }
};
export default nextConfig;
