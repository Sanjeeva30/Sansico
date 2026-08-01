/**
 * The Studio is its own root layout — deliberately bare.
 *
 * It sits in a separate route group from the site, so it never inherits the
 * site's header, footer, fonts or global CSS. Sanity ships its own styling and
 * expects to own the full viewport.
 */
export const dynamic = "force-static";

export const metadata = {
  title: "Sansico Studio",
  // Keep the Studio out of search results even though the site is noindexed
  // today — this must stay true if the site is ever indexed.
  robots: { index: false, follow: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function StudioRootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
