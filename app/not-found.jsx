import Link from "next/link";
import PageHero from "@/components/PageHero";

export default function NotFound() {
  return (
    <>
      <PageHero kicker="404" title="This page slipped off the press" intro="The address you opened doesn't exist on the new site." />
      <section className="sec">
        <div className="wrap"><Link className="btn btn-crimson" href="/">Back to the home page</Link></div>
      </section>
    </>
  );
}
