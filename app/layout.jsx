export const revalidate = 30;
import "./globals.css";
import "./animations.css";
import "./v2.css";
import localFont from "next/font/local";
import ScrollObserver from "@/components/ScrollObserver";
import HeaderV2 from "@/components/v2/HeaderV2";
import FooterV2 from "@/components/v2/FooterV2";
import Reveal from "@/components/Reveal";
import VisualEditingBridge from "@/components/v2/VisualEditingBridge";
import PreviewBar from "@/components/v2/PreviewBar";
import { draftMode } from "next/headers";
import { getSite } from "@/lib/content";
import { getV2Site } from "@/lib/v2";

const sans = localFont({
  src: "./fonts/Archivo-Variable.ttf",
  variable: "--font-sans", weight: "100 900", display: "swap"
});
const serif = localFont({
  src: [
    { path: "./fonts/InstrumentSerif-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/InstrumentSerif-Italic.ttf",  weight: "400", style: "italic" }
  ],
  variable: "--font-serif", display: "swap"
});

// Belt-and-braces alongside app/robots.js: preview deployments also emit a
// noindex meta tag, which crawlers honour even if robots.txt is missed.
const isProduction = process.env.VERCEL_ENV === "production";

export const metadata = {
  metadataBase: new URL("https://www.sansico.com"),
  ...(isProduction ? {} : { robots: { index: false, follow: false } }),
  title: { default: "Sansico Group — Joy, sustainably packaged | Indonesia · China · USA", template: "%s | Sansico Group" },
  description: "Sansico Group designs and manufactures gifting, toy, handicraft and packaging programmes for the world's most loved brands — FSC, FSSC 22000 and ISO 17025 certified, from ten facilities in Indonesia and China.",
  openGraph: { siteName: "Sansico Group", type: "website" }
};

const orgJsonLd = {
  "@context": "https://schema.org", "@type": "Organization",
  name: "Sansico Group", url: "https://www.sansico.com",
  slogan: "Joy, sustainably packaged.",
  description: "Indonesian design and manufacturing group: gifting, toys, handicrafts and packaging for global retail.",
  foundingLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressCountry: "ID" } },
  sameAs: ["https://www.linkedin.com/company/sansico"]
};

export default async function RootLayout({ children }) {
  const site = await getSite();
  const v2site = await getV2Site();
  const isDraft = (await draftMode()).isEnabled;
  const headingSerif = site.headingFont === "serif";
  const bodySize = site.bodySize === "lg" ? "18px" : site.bodySize === "sm" ? "14px" : "16px";
  const themeVars = {
    ...(site.accentHex ? { "--accent": site.accentHex } : {}),
    "--body-size": bodySize,
  };
  return (
    // suppressHydrationWarning: the inline script below adds a `js` class to
    // <html> before React hydrates, which React would otherwise flag.
    <html lang="en" suppressHydrationWarning
      className={`${sans.variable} ${serif.variable}${headingSerif ? " heading-serif" : ""} v2`}>
      <body style={themeVars}>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <ScrollObserver />
        <Reveal />
        <HeaderV2 site={v2site} />
        <main>{children}</main>
        <FooterV2 site={v2site} />
        {isDraft ? <><PreviewBar /><VisualEditingBridge /></> : null}
      </body>
    </html>
  );
}
