import PageHero from "@/components/PageHero";

export const metadata = { title: "Privacy", description: "Sansico Group website privacy notice." };

export default function Privacy() {
  return (
    <>
      <PageHero kicker="Legal" title="Privacy notice" />
      <section className="sec">
        <div className="wrap prose" style={{ maxWidth: 760 }}>
          <p>This website collects no personal data beyond what you choose to send us through enquiry forms or email. Enquiries are used solely to respond to you and are not shared with third parties. Analytics, where enabled, is configured without advertising identifiers.</p>
          <p>Full privacy policy text to be supplied by Sansico Group legal during the content phase. Questions: sales@sansico.com.</p>
        </div>
      </section>
    </>
  );
}
