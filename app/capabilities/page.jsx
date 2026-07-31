export const revalidate = 30;
import V2Page, { v2Metadata } from "@/components/v2/V2Page";

export async function generateMetadata() {
  return v2Metadata("capabilities", { title: "Capabilities" });
}

export default function Page() {
  return <V2Page pageId="capabilities" />;
}
