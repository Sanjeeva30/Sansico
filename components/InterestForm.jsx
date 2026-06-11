"use client";
import { useState } from "react";

export default function InterestForm({ roles }) {
  const [sent, setSent] = useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const body = encodeURIComponent(`Name: ${d.name}\nEmail: ${d.email}\nArea of interest: ${d.area}\nLocation preference: ${d.location}\n\n${d.message}`);
    window.location.href = `mailto:careers@sansico.com?subject=${encodeURIComponent("Career interest — " + d.area)}&body=${body}`;
    setSent(true);
  };
  if (sent) return <div className="form-ok">Thank you — your email client has opened with your registration. We&rsquo;ll reach out when a matching role opens.</div>;
  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="field"><label htmlFor="cname">Your name</label><input id="cname" name="name" required autoComplete="name" /></div>
      <div className="field"><label htmlFor="cemail">Email</label><input id="cemail" name="email" type="email" required autoComplete="email" /></div>
      <div className="field">
        <label htmlFor="area">Area of interest</label>
        <select id="area" name="area">{roles.map((r) => <option key={r}>{r}</option>)}</select>
      </div>
      <div className="field"><label htmlFor="cloc">Preferred location</label><input id="cloc" name="location" placeholder="e.g. Yogyakarta, Cikarang, Foshan" /></div>
      <div className="field full"><label htmlFor="cmsg">A line about you</label><textarea id="cmsg" name="message" /></div>
      <div className="full"><button className="btn btn-crimson" type="submit">Register interest</button></div>
    </form>
  );
}
