// Renders a field that may be either a plain string (legacy/unmigrated content)
// or a { text, sizePx, color } object from Studio's new styled-text fields.
// Unset sizePx/color fall through to whatever className/style the caller already uses,
// so pages keep their normal design by default — only explicit Studio choices override it.
function toPlainText(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        if (item?.text) return toPlainText(item.text);
        if (Array.isArray(item?.children)) return toPlainText(item.children);
        return "";
      })
      .filter(Boolean)
      .join("\n");
  }
  if (typeof value === "object") {
    if (value.text != null) return toPlainText(value.text);
    if (Array.isArray(value.children)) return toPlainText(value.children);
  }
  return "";
}

export default function StyledText({ value, as: Tag = "span", className, style, fallback = null }) {
  if (value == null || value === "") return fallback;
  const isObj = typeof value === "object";
  const text = toPlainText(isObj ? value.text : value);
  if (!text) return fallback;

  const override = {};
  if (isObj && value.sizePx) override.fontSize = `${value.sizePx}px`;
  if (isObj && value.color) override.color = value.color;

  return (
    <Tag className={className} style={{ ...style, ...override }}>
      {text}
    </Tag>
  );
}
