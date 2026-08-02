import { draftMode } from "next/headers";

export const dynamic = "force-dynamic";

// Lets an editor drop out of preview and see exactly what the public sees.
export async function GET(request) {
  (await draftMode()).disable();
  const url = new URL(request.url);
  // Same-site paths only — "//evil.com" and "https://evil.com" both parse as
  // another origin, which would turn this into an open redirect.
  const wanted = url.searchParams.get("redirect") || "/";
  const to = /^\/(?!\/)/.test(wanted) ? wanted : "/";
  return Response.redirect(new URL(to, url.origin), 307);
}
