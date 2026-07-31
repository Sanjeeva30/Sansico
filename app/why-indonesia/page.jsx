export const revalidate = 30;
import V2Page, { v2Metadata } from "@/components/v2/V2Page";

export async function generateMetadata() {
  return v2Metadata("why-indonesia", { title: "Why Indonesia" });
}

export default function Page() {
  return <V2Page pageId="why-indonesia" />;
}
