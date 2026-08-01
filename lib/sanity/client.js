import { createClient } from "@sanity/client";
import { draftMode } from "next/headers";

export const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "rvghw4zu";
export const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET    || "v2";
export const API_VERSION = "2024-01-01";

// Where the Studio lives. Used to build the "click this element → open that
// field" links that stega encodes into the content.
export const STUDIO_URL =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "https://sansico-v2.sanity.studio";

// Read token. Only needed to see *unpublished drafts* inside the Presentation
// tool — the v2 dataset is public, so published content needs no auth at all.
const VIEWER_TOKEN = process.env.SANITY_VIEWER_TOKEN;

const base = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: false,
  perspective: "published",
});

/**
 * Returns the right client for the current request.
 *
 * Normal visitors get the plain published client — no token, no stega, so the
 * public HTML is byte-for-byte what it was before visual editing existed.
 *
 * Inside the Presentation tool, Next's draft mode is on. Then we switch to the
 * drafts perspective and turn on stega: invisible metadata is woven into every
 * string telling the overlay which document and field it came from. That is
 * what makes click-to-edit work.
 */
export async function getClient() {
  let isDraft = false;
  try {
    isDraft = (await draftMode()).isEnabled;
  } catch {
    // draftMode() throws outside a request scope (e.g. during static
    // generation) — that is always the published case.
    isDraft = false;
  }

  if (!isDraft) return base;

  return base.withConfig({
    perspective: VIEWER_TOKEN ? "drafts" : "published",
    token: VIEWER_TOKEN || undefined,
    useCdn: false,
    stega: { enabled: true, studioUrl: STUDIO_URL },
  });
}

export { base as publishedClient };
