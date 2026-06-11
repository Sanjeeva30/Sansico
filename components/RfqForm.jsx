"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function FormInner({ categories, email }) {
  const [sent, setSent] = useState(false);
  const params = useSearchParams();
  const preselect = params.get("interest") || "";

  const onSubmit = (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    // v1 transport: opens the visitor's email client pre-filled to sales@.
    // Production swap: POST to /api/rfq wired to Resend/SMTP or a form service — markup unchanged.
    const body = encodeURIComponent(
      `Name: ${d.name}\nCompany: ${d.company}\nCountry: ${d.country}\nCategory: ${d.category}\nEstimated annual volume: ${d.volume}\nTimeline: ${d.timeline}\n\n${d.message}`
    );
    window.location.href = `mailto:${email}?subject=${encodeURIComponent("RFQ — " + d.category + " — " + d.company)}&body=${body}`;
    setSent(true);
  };

  if (sent) return <div className="form-ok">Thank you — your email client has opened with your enquiry. If it didn&rsquo;t, write to us directly at {email}.</div>;

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" required autoComplete="name" /></div>
      <div className="field"><label htmlFor="company">Company</label><input id="company" name="company" required autoComplete="organization" /></div>
      <div className="field"><label htmlFor="country">Country / market</label><input id="country" name="country" required /></div>
      <div className="field">
        <label htmlFor="category">Product category</label>
        <select id="category" name="category" defaultValue={categories.find((c) => c.toLowerCase().includes(preselect.replace(/-/g, " ").split(" ")[0] || "")) || categories[0]}>
          {categories.map((c) => <option key={c}>{c}</option>)}
          <option>Other / multiple</option>
        </select>
      </div>
      <div className="field"><label htmlFor="volume">Estimated annual volume</label><input id="volume" name="volume" placeholder="e.g. 500,000 units" /></div>
      <div className="field"><label htmlFor="timeline">Timeline</label><input id="timeline" name="timeline" placeholder="e.g. Spring 2027 programme" /></div>
      <div className="field full"><label htmlFor="message">Tell us about the programme</label><textarea id="message" name="message" required /></div>
      <div className="full">
        <button className="btn btn-crimson" type="submit">Send enquiry</button>
        <p className="form-note">Submitting opens your email client addressed to our sales team. Direct server delivery is enabled at deployment with an email API key.</p>
      </div>
    </form>
  );
}

export default function RfqForm(props) {
  return <Suspense fallback={null}><FormInner {...props} /></Suspense>;
}
