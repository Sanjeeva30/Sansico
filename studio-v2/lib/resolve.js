import { defineLocations, defineDocuments } from "sanity/presentation";

/**
 * Teaches Presentation how documents and URLs map to each other.
 *
 * `locations` powers the "Used on these pages" panel when editing a shared
 * document, so an editor changing a facility can see it appears on /company.
 * `mainDocuments` makes navigating the preview to a URL select the right
 * document automatically.
 */

const PAGE_PATHS = {
  home: "/",
  capabilities: "/capabilities",
  products: "/products",
  company: "/company",
  sustainability: "/sustainability",
  "why-indonesia": "/why-indonesia",
  careers: "/careers",
  blog: "/blog",
  contact: "/contact",
};

export const locations = {
  v2Page: defineLocations({
    select: { title: "title", pageId: "pageId" },
    resolve: (doc) => ({
      locations: [
        { title: doc?.title || "Page", href: PAGE_PATHS[doc?.pageId] || "/" },
      ],
    }),
  }),

  audiencePage: defineLocations({
    select: { title: "label.text", slug: "slug.current" },
    resolve: (doc) => ({
      locations: [{ title: doc?.title || "Audience page", href: `/${doc?.slug}` }],
    }),
  }),

  blogPost: defineLocations({
    select: { title: "title.text", slug: "slug.current" },
    resolve: (doc) => ({
      locations: [
        { title: doc?.title || "Post", href: `/blog/${doc?.slug}` },
        { title: "Blog index", href: "/blog" },
      ],
    }),
  }),

  jobRole: defineLocations({
    select: { title: "role.text", slug: "slug.current" },
    resolve: (doc) => ({
      locations: [
        { title: doc?.title || "Role", href: `/careers/${doc?.slug}` },
        { title: "Careers", href: "/careers" },
      ],
    }),
  }),

  productCategory: defineLocations({
    select: { title: "name.text", slug: "slug.current" },
    resolve: (doc) => ({
      locations: [
        { title: doc?.title || "Category", href: `/products/${doc?.slug}` },
        { title: "All products", href: "/products" },
      ],
    }),
  }),

  // Documents that appear inside other pages rather than owning a route.
  facility: defineLocations({
    select: { title: "name.text" },
    resolve: (doc) => ({
      locations: [{ title: `${doc?.title || "Facility"} — on Company`, href: "/company#facilities" }],
    }),
  }),

  certificationGroup: defineLocations({
    resolve: () => ({
      locations: [{ title: "Sustainability — certifications", href: "/sustainability#certifications" }],
    }),
  }),

  milestone: defineLocations({
    select: { title: "title.text" },
    resolve: (doc) => ({
      locations: [{ title: `${doc?.title || "Milestone"} — on Company timeline`, href: "/company" }],
    }),
  }),

  customerStory: defineLocations({
    select: { title: "name.text" },
    resolve: (doc) => ({
      locations: [{ title: `${doc?.title || "Customer"} — on Home`, href: "/" }],
    }),
  }),

  siteSettings: defineLocations({
    resolve: () => ({
      locations: [{ title: "Site-wide (header, footer, CTA band)", href: "/" }],
    }),
  }),
};

export const mainDocuments = defineDocuments([
  { route: "/", filter: `_type == "v2Page" && pageId == "home"` },
  { route: "/:slug", filter: `_type == "audiencePage" && slug.current == $slug` },
  { route: "/blog/:slug", filter: `_type == "blogPost" && slug.current == $slug` },
  { route: "/careers/:slug", filter: `_type == "jobRole" && slug.current == $slug` },
  { route: "/products/:slug", filter: `_type == "productCategory" && slug.current == $slug` },
  { route: "/products/:category/:slug", filter: `_type == "productItem" && slug.current == $slug` },
]);
