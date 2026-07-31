"use client";
import { useState } from "react";
import { getStyled } from "@/lib/styledText";

// NOTE: front-end only for now, by design. Validation and the success state are
// real; nothing is transmitted. Wire `deliver()` to a provider when you're ready
// — it is the single place a submission handler needs to be added.
async function deliver(formName, payload) {
  console.info(`[v2 form: ${formName}] submission captured (no delivery configured)`, payload);
  return { ok: true };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({ f }) {
  const label = getStyled(f.label);
  const placeholder = getStyled(f.placeholder).text;
  const common = { id: f.name, name: f.name, placeholder: placeholder || undefined };
  return (
    <div className="v2-field">
      <label className="t-small" htmlFor={f.name} style={label.style}>
        {label.text}{f.required ? " *" : ""}
      </label>
      {f.type === "textarea" ? (
        <textarea {...common} />
      ) : f.type === "select" ? (
        <select {...common} defaultValue="">
          <option value="">Select one</option>
          {(f.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={f.type === "email" ? "email" : "text"} {...common} />
      )}
    </div>
  );
}

function useSubmit(fields, formName) {
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    for (const f of fields) {
      const v = (data[f.name] || "").toString().trim();
      if (f.required && !v) {
        setError(`Please complete ${getStyled(f.label).text || "this field"}.`);
        return;
      }
      if (f.type === "email" && v && !EMAIL.test(v)) {
        setError("Please enter a valid email address.");
        return;
      }
    }
    setError("");
    await deliver(formName, data);
    setSent(true);
  };

  return { error, sent, onSubmit };
}

export function ContactForm({ block }) {
  const fields = block.fields || [];
  const { error, sent, onSubmit } = useSubmit(fields, "contact");
  const submitLabel = getStyled(block.submitLabel).text || "Submit";
  const successHeading = getStyled(block.successHeading).text || "Message sent.";
  const successBody = getStyled(block.successBody).text || "Thanks — our team will be in touch.";

  if (sent) {
    return (
      <div className="v2-card" style={{ borderColor: "var(--crimson)", maxWidth: 520 }}>
        <div className="t-h3" style={{ marginBottom: 8 }}>{successHeading}</div>
        <p className="t-body">{successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 520 }} noValidate>
      {fields.map((f) => <Field key={f.name} f={f} />)}
      {error ? <div className="v2-error" role="alert">{error}</div> : null}
      <button type="submit" className="btn btn-crimson" style={{ width: "fit-content" }}>{submitLabel} →</button>
    </form>
  );
}

export function ApplyForm({ roleTitle }) {
  const fields = [
    { name: "name", label: "Full name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "cover", label: "Cover letter (optional)", type: "textarea" },
  ];
  const { error, sent, onSubmit } = useSubmit(fields, `application:${roleTitle}`);

  if (sent) {
    return (
      <div className="v2-card" style={{ borderColor: "var(--crimson)" }}>
        <div className="t-h3" style={{ marginBottom: 8 }}>Application received.</div>
        <p className="t-body">Thanks for applying to {roleTitle} — our talent team will review and follow up within 5–7 business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }} noValidate>
      <div className="v2-field">
        <label className="t-small" htmlFor="name">Full name *</label>
        <input id="name" name="name" placeholder="Your full name" />
      </div>
      <div className="v2-field">
        <label className="t-small" htmlFor="email">Email *</label>
        <input id="email" name="email" type="email" placeholder="you@example.com" />
      </div>
      <div className="v2-field">
        <span className="t-small" style={{ display: "block", marginBottom: 6 }}>Resume / CV *</span>
        <label className="v2-dropzone" htmlFor="cv" style={{ display: "block", cursor: "pointer" }}>
          <span className="t-small">Drop a file here or click to upload (PDF, DOC)</span>
          <input id="cv" name="cv" type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} />
        </label>
      </div>
      <div className="v2-field">
        <label className="t-small" htmlFor="cover">Cover letter (optional)</label>
        <textarea id="cover" name="cover" placeholder="Tell us why you're a fit for this role" />
      </div>
      {error ? <div className="v2-error" role="alert">{error}</div> : null}
      <button type="submit" className="btn btn-crimson" style={{ width: "fit-content" }}>Submit application →</button>
    </form>
  );
}
