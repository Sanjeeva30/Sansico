// Diagnostic endpoint — visit /api/debug to see exactly what's wrong
// DELETE this file once everything is confirmed working
import { createClient } from "@sanity/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "rvghw4zu";
  const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET    || "production";
  const token     = process.env.SANITY_API_TOKEN;

  const result = {
    env: {
      NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "NOT SET (using hardcoded fallback rvghw4zu)",
      NEXT_PUBLIC_SANITY_DATASET:    process.env.NEXT_PUBLIC_SANITY_DATASET    || "NOT SET (using fallback: production)",
      SANITY_API_TOKEN:              token ? `SET (${token.slice(0,6)}…${token.slice(-4)})` : "❌ NOT SET — this is the problem",
    },
    sanityTest: null,
    error: null,
  };

  if (!token) {
    result.error = "SANITY_API_TOKEN is missing. Add it in Vercel → Settings → Environment Variables, then redeploy.";
    return NextResponse.json(result, { status: 200 });
  }

  try {
    const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });
    const data = await client.fetch(`{
      "homePage": *[_id == "homePage"][0]{ _id, heroTitle },
      "siteSettings": *[_id == "siteSettings"][0]{ _id, tagline },
      "markets": count(*[_type == "market"]),
      "products": count(*[_type == "product"]),
      "caseStudies": count(*[_type == "caseStudy"]),
      "capabilities": count(*[_type == "capability"]),
      "certifications": count(*[_type == "certification"]),
      "facilities": count(*[_type == "facility"])
    }`);
    result.sanityTest = { status: "✅ CONNECTED", data };
  } catch (err) {
    result.sanityTest = { status: "❌ FAILED" };
    result.error = `${err.statusCode || ""} ${err.message}`;
  }

  return NextResponse.json(result, { status: 200 });
}
