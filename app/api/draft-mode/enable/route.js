import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { publishedClient } from "@/lib/sanity/client";

export const dynamic = "force-dynamic";

/**
 * Presentation opens the site through this route.
 *
 * The URL it sends carries a single-use secret that Sanity itself issued. We
 * hand that to validatePreviewUrl, which checks it against the dataset — so
 * only someone who is already signed in to the Studio can turn draft mode on.
 * Without this check the endpoint would let anyone on the internet read
 * unpublished content.
 */
export async function GET(request) {
  const token = process.env.SANITY_VIEWER_TOKEN;

  if (!token) {
    return new Response(
      "Draft mode needs SANITY_VIEWER_TOKEN to be set. Published content still previews without it.",
      { status: 401 }
    );
  }

  const { isValid, redirectTo = "/" } = await validatePreviewUrl(
    publishedClient.withConfig({ token }),
    request.url
  );

  if (!isValid) {
    return new Response("Invalid preview secret", { status: 401 });
  }

  (await draftMode()).enable();
  redirect(redirectTo);
}
