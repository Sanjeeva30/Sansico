// For components that need custom JSX around the text (e.g. splitting on "|" for
// an italic word) and so can't use <StyledText> directly. Returns plain text plus
// a style object with only the overrides Studio actually set.
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

export function getStyled(value) {
  if (value == null) return { text: "", style: {} };
  const isObj = typeof value === "object";
  const text = toPlainText(isObj ? value.text : value);
  const style = {};
  if (isObj && value.sizePx) style.fontSize = `${value.sizePx}px`;
  if (isObj && value.color) style.color = value.color;
  return { text, style };
}
