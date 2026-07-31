import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST() {
  const paths = [
    "/","/capabilities","/products","/sustainability","/company",
    "/why-indonesia","/careers","/blog","/contact",
    "/buyers","/factories","/creatives",
  ];
  try {
    for (const path of paths) revalidatePath(path);
    revalidatePath("/products/[category]","page");
    revalidatePath("/products/[category]/[product]","page");
    revalidatePath("/careers/[role]","page");
    revalidatePath("/blog/[slug]","page");
    return NextResponse.json({ revalidated:true, at:new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ revalidated:false, error:err.message }, { status:500 });
  }
}
export async function GET() {
  return NextResponse.json({ message:"POST to this endpoint from Sanity webhook to revalidate pages." });
}
