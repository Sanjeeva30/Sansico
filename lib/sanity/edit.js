import { createDataAttribute } from "next-sanity";

// Read the public env vars directly rather than importing from ./client — that
// module uses next/headers and is therefore server-only, while this helper is
// also used by client components such as the customer-story carousel.
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "rvghw4zu";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "v2";

/**
 * Builds the `data-sanity` attribute that makes an element click-to-edit.
 *
 * Text is already clickable without this: stega weaves invisible metadata into
 * every string, so Presentation can trace it back to its field. That trick
 * cannot work for anything that isn't rendered text — an image is a URL, and
 * hiding characters in a URL would break it. Images, cards, tiles, stats and
 * buttons therefore need the mapping stated explicitly, which is what this does.
 *
 * `id`/`type` identify the document that owns the value. That is usually the
 * page, but sections often render *referenced* documents (a customer story, a
 * milestone, a facility) — those own their own fields, so pass their id/type
 * and a path relative to them.
 *
 * Returns undefined when identity is missing, so callers can spread it
 * unconditionally and it simply becomes a no-op outside Presentation.
 */
export function editAttr({ id, type, path }) {
  if (!id || !path) return undefined;
  return {
    "data-sanity": createDataAttribute({
      projectId: PROJECT_ID,
      dataset: DATASET,
      id,
      type,
      path,
    }).toString(),
  };
}

/** Path to a section inside a page's `sections` array. */
export const sectionPath = (key) => `sections[_key=="${key}"]`;

/** Path to an item inside an array field on a section, e.g. cards or tiles. */
export const itemPath = (key, field, itemKey) =>
  `${sectionPath(key)}.${field}[_key=="${itemKey}"]`;
