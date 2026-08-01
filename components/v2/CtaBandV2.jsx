import Link from "next/link";
import Arrow from "@/components/Arrow";
import { getV2Site } from "@/lib/v2";
import { getStyled } from "@/lib/styledText";
import { draftMode } from "next/headers";
import { editAttr } from "@/lib/sanity/edit";

// The wireframe's black banner. Shown at the foot of every page except Careers
// — controlled per page by `showCtaBanner` in Studio.
export default async function CtaBandV2() {
  const site = await getV2Site();
  const isDraft = (await draftMode()).isEnabled;
  const chrome = (path) => (isDraft ? editAttr({ id: "siteSettings", type: "siteSettings", path }) : undefined);
  const cta = site.ctaBand || {};

  const headlineStyled = getStyled(cta.headline);
  const headline = headlineStyled.text || "Looking for your |partner| in Indonesia?";
  const subline = getStyled(cta.subline).text
    || "Tell us your category, target market and volumes — our marketing offices in Jakarta and Foshan respond within one business day.";
  const btnLabel = getStyled(cta.btn1Label).text || getStyled(site.ctaLabel).text || "Start Conversation";
  const btnHref = cta.btn1Href || "/contact";

  const parts = headline.split("|");

  return (
    <section className="v2-cta" style={{ background: cta.bgColor || undefined, color: cta.textColor || undefined }}>
      <div className="wrap">
        <h2 className="t-h2" style={{ ...headlineStyled.style, color: cta.textColor || undefined }}>
          {parts.map((p, i) => (i % 2
            ? <em key={i} style={{ color: cta.accentColor || undefined }}>{p}</em>
            : p))}
        </h2>
        <p className="t-body" style={{ color: cta.textColor || undefined }}>{subline}</p>
        <Link className="btn btn-light" href={btnHref}
          {...(chrome("ctaBand.btn1Label") || {})}
          style={{ background: cta.btnBgColor || undefined, color: cta.btnTextColor || undefined }}>
          {btnLabel} <Arrow />
        </Link>
      </div>
    </section>
  );
}
