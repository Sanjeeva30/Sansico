export const revalidate = 30;
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplyForm } from "@/components/v2/Forms";
import { getRole, getRoles } from "@/lib/v2";
import { getStyled } from "@/lib/styledText";
import { draftMode } from "next/headers";
import { editAttr } from "@/lib/sanity/edit";

const S = (v) => getStyled(v);

export async function generateStaticParams() {
  const roles = await getRoles();
  return roles.map((r) => ({ role: r.slug }));
}

export async function generateMetadata({ params }) {
  const { role } = await params;
  const r = await getRole(role);
  return { title: r?.seoTitle || S(r?.role).text || "Role", description: r?.seoDescription || S(r?.summary).text };
}

function List({ title, items }) {
  if (!items?.length) return null;
  return (
    <div style={{ marginBottom: 52 }}>
      <div className="t-kicker" style={{ marginBottom: 14 }}>{title}</div>
      <ul className="t-body-lg" style={{ paddingLeft: 20, listStyle: "disc" }}>
        {items.map((i, k) => <li key={k} style={{ marginBottom: 10 }}>{S(i).text}</li>)}
      </ul>
    </div>
  );
}

export default async function RolePage({ params }) {
  const { role } = await params;
  const r = await getRole(role);
  if (!r) notFound();

  const title = S(r.role);
  // Click-to-edit for the role's own fields. Gated on draft mode so the public
  // page carries no document ids or field paths.
  const isDraft = (await draftMode()).isEnabled;
  const at = (path) => (isDraft ? editAttr({ id: r._id, type: r._type, path }) : undefined);

  return (
    <>
      <div className="wrap v2-crumb">
        <Link href="/careers">← Back to Careers</Link>
      </div>

      <div className="wrap grid12" style={{ paddingTop: 24 }}>
        <div className="c-7">
          <h1 className="t-h1" style={{ marginBottom: 22, ...title.style }}>{title.text}</h1>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 40 }}>
            {[["dept", r.dept], ["location", r.location], ["type", r.type]].map(([f, t], i) => {
              const v = S(t);
              return v.text ? <span className="v2-tag" key={i} {...(at(f) || {})}>{v.text}</span> : null;
            })}
          </div>
          <a className="btn btn-crimson" href="#apply" style={{ marginBottom: 64, display: "inline-flex" }}>Apply for this role →</a>

          <div style={{ marginBottom: 52 }}>
            <div className="t-kicker" style={{ marginBottom: 14 }}>The Role</div>
            <p className="t-body-lg">{S(r.summary).text}</p>
          </div>

          <List title="You Will" items={r.willDo} />
          <List title="You Are" items={r.youAre} />
          <List title="You Have" items={r.youHave} />

          {S(r.compensation).text ? (
            <div className="v2-rule" style={{ paddingTop: 24, marginBottom: 52 }}>
              <div className="t-kicker" style={{ marginBottom: 14 }}>Compensation</div>
              <p className="t-body">{S(r.compensation).text}</p>
            </div>
          ) : null}

          {S(r.aboutCompany).text ? (
            <div className="v2-rule" style={{ paddingTop: 24 }}>
              <div className="t-kicker" style={{ marginBottom: 14 }}>About Sansico Group</div>
              <p className="t-body">{S(r.aboutCompany).text}</p>
            </div>
          ) : null}
        </div>

        <div className="c-5">
          <div className="v2-card" style={{ background: "var(--paper-warm)", position: "sticky", top: 120 }}>
            <div className="t-kicker" style={{ marginBottom: 22 }}>Job Snapshot</div>
            {[["Department", r.dept, "dept"], ["Location", r.location, "location"], ["Employment type", r.type, "type"]].map(([l, v, f], i) => {
              const val = S(v);
              return val.text ? (
                <div key={i} style={{ marginBottom: 20 }} {...(at(f) || {})}>
                  <div className="t-small">{l}</div>
                  <div className="t-body" style={{ color: "var(--ink)" }}>{val.text}</div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>

      <section className="v2-section" id="apply">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <h2 className="t-h2" style={{ marginBottom: 40 }}>Apply for {title.text}</h2>
          <ApplyForm roleTitle={title.text} />
        </div>
      </section>
    </>
  );
}
