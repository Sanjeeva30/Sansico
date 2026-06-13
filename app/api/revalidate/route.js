import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST() {
  const paths = [
    "/","/capabilities","/markets","/products","/work",
    "/sustainability","/company","/company/facilities",
    "/careers","/contact","/team","/news",
  ];
  try {
    for (const path of paths) revalidatePath(path);
    revalidatePath("/markets/[slug]","page");
    revalidatePath("/products/[slug]","page");
    revalidatePath("/work/[slug]","page");
    revalidatePath("/news/[slug]","page");
    return NextResponse.json({ revalidated:true, at:new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ revalidated:false, error:err.message }, { status:500 });
  }
}
export async function GET() {
  return NextResponse.json({ message:"POST to this endpoint from Sanity webhook to revalidate pages." });
}
