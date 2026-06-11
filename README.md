# Sansico Group — Website v1 (Next.js)

"Joy, sustainably packaged." — the new sansico.com, built to the Section 2 plan:
server-rendered, SEO-complete, brand-system design, EN/ID-ready, Sanity-ready.

---

## 1 · Review it on your laptop (10 minutes)

1. Install Node.js LTS (one download): https://nodejs.org  → choose "LTS".
2. Unzip this folder anywhere (e.g. Desktop/sansico).
3. Open Terminal (Mac) or Command Prompt (Windows), then:

       cd path/to/sansico
       npm install
       npm run dev

4. Open http://localhost:3000 in your browser. That's the full site.
   (Phone preview: on the same Wi-Fi, open http://YOUR-LAPTOP-IP:3000)

Everything runs offline — no accounts needed for review.

## 2 · What's inside

    app/          all pages (home, capabilities, markets, products, work,
                  sustainability, company, facilities, careers, contact, privacy)
    components/   header, footer, hero (ink ⇄ video switch), count-up stats,
                  RFQ + careers forms, CTA band
    content/      ALL words and data as plain JSON — edit these files and
                  the site updates. This is your interim "backend".
    app/fonts/    self-hosted Archivo + Instrument Serif (no Google dependency)
    studio/       the Sanity editing back end (schemas ready — see §4)

Quick edits now, without any CMS: open content/*.json in any text editor.
Example: change the tagline in content/site.json → save → refresh browser.

## 3 · Going live (when approved)

1. Create a free account at https://vercel.com (sign in with email or GitHub).
2. "Add New Project" → import this folder (drag-and-drop via vercel.com/new,
   or push to a GitHub repo and import that — recommended).
3. Vercel detects Next.js automatically. Click Deploy. You get a live URL
   like sansico.vercel.app in ~2 minutes.
4. Staging: in Vercel → Settings → Domains, add new.sansico.com and create
   the CNAME record it shows you at your DNS provider.
5. Cutover: when approved, add sansico.com + www.sansico.com the same way.
   Old URLs (/about-us, /our-service, /our-products, /contact-us,
   /our-locations) already 308-redirect to their new homes.

## 4 · Connecting the Sanity back end (when ready)

1. Create a free project at https://sanity.io → note the Project ID.
2. In /studio: set the ID in sanity.config.js (or env SANITY_STUDIO_PROJECT_ID),
   then `npm install && npm run dev` → editing studio at localhost:3333.
   `npm run deploy` hosts it at yourname.sanity.studio for the whole team.
3. The schemas already model everything: hero (ink/image/video switch),
   navigation (drag to reorder), stats, customers, capabilities, markets,
   products with galleries, case studies, certifications WITH PDF upload +
   dates + registration numbers, facilities, careers with open roles.
4. Final wiring step (small, one-off developer task or ask Claude):
   swap lib/content.js readers for Sanity GROQ fetches + add the publish
   webhook → edits go live in seconds. Page components don't change.

## 5 · The RFQ form

v1 opens the visitor's email client pre-addressed to sales@sansico.com —
zero infrastructure, works immediately. For silent server delivery:
add an email API key (e.g. Resend, free tier) and a 20-line /api/rfq route;
the form markup is already structured for it.

## 6 · Replacing visuals

- Hero film: upload MP4 to Cloudinary → in Sanity set heroType=video +
  paste URL (or, pre-Sanity, set "type":"video","videoUrl":"..." in
  content/home.json). Ink animation remains the reduced-motion fallback.
- Customer logos: drop SVG/PNGs into the logo-wall grid (or Sanity images).
- Facility & product photography: image fields are modelled and waiting.

## 7 · Performance & SEO already in

Static pre-rendering of all 29 pages (~95 kB first load) · unique titles &
meta descriptions everywhere · Organization JSON-LD · sitemap.xml ·
robots.txt · WCAG-conscious (contrast, focus states, reduced-motion,
keyboard nav) · self-hosted fonts · 404 page · privacy page stub.

— Built June 2026. EN live; ID mirror is the next content phase.
