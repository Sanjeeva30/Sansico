// Sanity webhook — clears the Next.js page cache immediately after a Studio publish
// Set this as a webhook in sanity.io/manage → API → Webhooks
// URL: https://sansico.vercel.app/api/revalidate
// Trigger: on Create, Update, Delete → all document types
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  // Revalidate every page that depends on Sanity content
  const paths = [
    "/",
    "/capabilities",
    "/markets",
    "/products",
    "/work",
    "/sustainability",
    "/company",
    "/company/facilities",
    "/careers",
    "/contact",
  ];

  try {
    for (const path of paths) {
      revalidatePath(path);
    }
    // Also revalidate dynamic routes
    revalidatePath("/markets/[slug]", "page");
    revalidatePath("/products/[slug]", "page");
    revalidatePath("/work/[slug]", "page");

    console.log("[revalidate] Cache cleared at", new Date().toISOString());
    return NextResponse.json({ revalidated: true, paths, at: new Date().toISOString() });
  } catch (err) {
    console.error("[revalidate] Error:", err.message);
    return NextResponse.json({ revalidated: false, error: err.message }, { status: 500 });
  }
}

// Allow GET so you can test it manually in browser too
export async function GET() {
  return NextResponse.json({ message: "POST to this endpoint from Sanity webhook to revalidate pages." });
}
