import { sanityImgUrl } from "@/lib/image";
import { getStyled } from "@/lib/styledText";

/**
 * Renders a Sanity image at a fixed aspect ratio with an optional caption.
 * The wireframe's grey placeholder boxes all resolve to one of these — if an
 * image is genuinely missing we fall back to the brand colour-strip motif
 * rather than an empty box, so no section ever renders as a hole.
 */
export default function Media({ value, ratio = "4/3", className = "", w = 1200, h = 900, contain = false, showCaption = true }) {
  const url = value?.url;
  const caption = showCaption ? getStyled(value?.caption) : { text: "" };
  const alt = value?.alt || caption.text || "";

  return (
    <div className={`v2-media ${contain ? "contain" : ""} ${className}`} style={{ aspectRatio: ratio }}>
      {url ? (
        <img src={sanityImgUrl(url, { w, h, fit: contain ? "max" : "crop" })} alt={alt} loading="lazy" />
      ) : (
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex" }}>
          {["--crimson", "--navy", "--green", "--red", "--citrus"].map((c) => (
            <div key={c} style={{ flex: 1, background: `var(${c})`, opacity: 0.13 }} />
          ))}
        </div>
      )}
      {caption.text ? <span className="cap" style={caption.style}>{caption.text}</span> : null}
    </div>
  );
}
