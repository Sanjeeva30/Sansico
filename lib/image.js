/**
 * Sanity CDN image resizing — appends transformation params to any Sanity CDN URL.
 *
 * Deliberately kept in its own module with no server-only imports, because
 * client components (Media, CustomerStories) need it. Importing it from
 * lib/content.js would drag `next/headers` into the browser bundle.
 */
export function sanityImgUrl(url, { w = 800, h = 600, fit = "crop" } = {}) {
  if (!url) return null;
  return `${url}?w=${w}&h=${h}&fit=${fit}&auto=format`;
}
