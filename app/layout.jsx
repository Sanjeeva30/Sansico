import "./globals.css";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSite } from "@/lib/content";

const sans = localFont({
  src: "./fonts/Archivo-Variable.ttf",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap"
});
const serif = localFont({
  src: [
    { path: "./fonts/InstrumentSerif-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/InstrumentSerif-Italic.ttf", weight: "400", style: "italic" }
  ],
  variable: "--font-serif",
  display: "swap"
});

export const metadata = {
  metadataBase: new URL("https://www.sansico.com"),
  title: { default: "Sansico Group — Joy, sustainably packaged | Indonesia · China · USA", template: "%s | Sansico Group" },
  description: "Sansico Group designs and manufactures gifting, toy, handicraft and packaging programmes for the world's most loved brands — FSC, FSSC 22000 and ISO 17025 certified, from ten facilities in Indonesia and China.",
  openGraph: { siteName: "Sansico Group", type: "website" }
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Sansico Group",
  url: "https://www.sansico.com",
  slogan: "Joy, sustainably packaged.",
  description: "Indonesian design and manufacturing group: gifting, toys, handicrafts and packaging for global retail.",
  foundingLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressCountry: "ID" } },
  numberOfEmployees: undefined,
  sameAs: ["https://www.linkedin.com/company/sansico"]
};

export default async function RootLayout({ children }) {
  const site = await getSite();
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <Header site={site} />
        <main>{children}</main>
        <Footer site={site} />
      </body>
    </html>
  );
}
