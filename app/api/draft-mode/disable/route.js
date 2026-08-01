import { draftMode } from "next/headers";

export const dynamic = "force-dynamic";

// Lets an editor drop out of preview and see exactly what the public sees.
export async function GET(request) {
  (await draftMode()).disable();
  const url = new URL(request.url);
  return Response.redirect(new URL(url.searchParams.get("redirect") || "/", url.origin), 307);
}
