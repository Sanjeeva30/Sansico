export const revalidate = 30;
import { AudienceRoute } from "@/components/v2/V2Page";
import { getAudiencePage } from "@/lib/v2";

export async function generateMetadata() {
  const p = await getAudiencePage("creatives");
  return { title: p?.seoTitle || "For Creatives", description: p?.seoDescription };
}

export default function Page() {
  return <AudienceRoute slug="creatives" />;
}
