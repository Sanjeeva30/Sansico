import { set, unset } from "sanity";
import { useState } from "react";

const BRAND = [
  { label: "Crimson",   hex: "#7A0D20" },
  { label: "Navy",      hex: "#22409E" },
  { label: "Green",     hex: "#0D4F31" },
  { label: "Red",       hex: "#F3263E" },
  { label: "Citrus",    hex: "#BDDA5F" },
  { label: "Black",     hex: "#1A1A1A" },
  { label: "White",     hex: "#FFFFFF" },
  { label: "Off-white", hex: "#F5F0E8" },
];

// Safely extract hex string from any value format
function toHex(v) {
  if (!v) return null;
  if (typeof v === "string") return v;
  if (typeof v === "object" && v.hex) return v.hex;
  return null;
}

export function ColourPicker({ value, onChange }) {
  const safeValue = toHex(value);
  const isCustom = safeValue && !BRAND.find(b => b.hex.toLowerCase() === safeValue.toLowerCase());
  const [showCustom, setShowCustom] = useState(isCustom || false);
  const [customHex, setCustomHex] = useState(isCustom ? safeValue : "#000000");

  const select = (hex) => { onChange(set(hex)); setShowCustom(false); };
  const clear   = ()    => { onChange(unset()); };
  const applyHex = (v) => {
    setCustomHex(v);
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChange(set(v));
  };

  const selectedBrand = BRAND.find(b => safeValue && b.hex.toLowerCase() === safeValue.toLowerCase());

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
        {BRAND.map(({ label, hex }) => {
          const active = safeValue?.toLowerCase() === hex.toLowerCase();
          return (
            <button key={hex} type="button" title={label} onClick={() => select(hex)}
              style={{ width:36, height:36, borderRadius:"50%", background:hex, cursor:"pointer",
                border: active ? "3px solid #fff" : "2px solid rgba(255,255,255,0.15)",
                boxShadow: active ? `0 0 0 2px ${hex}` : "none",
                flexShrink:0, transition:"transform 0.1s" }}
            />
          );
        })}
        <button type="button" onClick={() => setShowCustom(!showCustom)}
          style={{ padding:"6px 14px", borderRadius:20, fontSize:12.5, cursor:"pointer",
            border:"1px solid rgba(255,255,255,0.25)",
            background: showCustom || isCustom ? "rgba(255,255,255,0.12)" : "transparent",
            color:"#fff", fontWeight:500 }}>
          {showCustom ? "Hide custom" : "+ Custom"}
        </button>
        {safeValue && (
          <button type="button" onClick={clear}
            style={{ padding:"6px 10px", borderRadius:20, fontSize:12, cursor:"pointer",
              border:"1px solid rgba(255,100,100,0.4)", background:"transparent", color:"#ff8888" }}>
            Clear
          </button>
        )}
      </div>

      {safeValue && (
        <div style={{ display:"flex", alignItems:"center", gap:10, fontSize:12.5, opacity:0.65 }}>
          <div style={{ width:18, height:18, borderRadius:4, background:safeValue,
            border:"1px solid rgba(255,255,255,0.2)", flexShrink:0 }} />
          <span>{selectedBrand ? selectedBrand.label : "Custom"} — {safeValue.toUpperCase()}</span>
        </div>
      )}

      {showCustom && (
        <div style={{ display:"flex", gap:10, alignItems:"center", padding:14,
          background:"rgba(255,255,255,0.06)", borderRadius:8,
          border:"1px solid rgba(255,255,255,0.12)" }}>
          <input type="color" value={customHex || "#000000"}
            onChange={(e) => applyHex(e.target.value)}
            style={{ width:44, height:44, padding:2, cursor:"pointer",
              border:"1px solid rgba(255,255,255,0.2)", borderRadius:6, background:"transparent" }}
          />
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:11, opacity:0.5, textTransform:"uppercase", letterSpacing:"0.06em" }}>Hex code</label>
            <input type="text" value={customHex} placeholder="#000000" maxLength={7}
              onChange={(e) => applyHex(e.target.value)}
              style={{ padding:"6px 10px", borderRadius:6, width:110,
                border:"1px solid rgba(255,255,255,0.2)",
                background:"rgba(255,255,255,0.08)", color:"#fff", fontSize:13, fontFamily:"monospace" }}
            />
          </div>
          {/^#[0-9A-Fa-f]{6}$/.test(customHex) && (
            <div style={{ width:36, height:36, borderRadius:6, background:customHex, flexShrink:0,
              border:"1px solid rgba(255,255,255,0.2)" }} />
          )}
        </div>
      )}
    </div>
  );
}
