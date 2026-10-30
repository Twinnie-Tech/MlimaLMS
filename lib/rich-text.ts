const htmlTag = /<\/?[a-z][\s\S]*>/i

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/**
 * Content saved before the rich text editor is plain text. Turns it into
 * paragraphs so it keeps its line breaks in the editor and on the page.
 */
export function toRichTextHtml(value: string | null | undefined) {
  if (!value) return ""
  if (htmlTag.test(value)) return value
  return value
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.trim()).replace(/\n/g, "<br>")}</p>`)
    .join("")
}
