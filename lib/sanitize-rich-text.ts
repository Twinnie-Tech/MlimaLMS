import sanitizeHtml from "sanitize-html"
import { toRichTextHtml } from "@/lib/rich-text"

const options: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "h2", "h3", "strong", "b", "em", "i", "u", "s", "code", "pre",
    "blockquote", "ul", "ol", "li", "hr", "a",
  ],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer nofollow" }),
  },
}

/** Strips anything the rich text editor cannot produce, including scripts and event handlers. */
export function sanitizeRichText(value: string | null | undefined) {
  return sanitizeHtml(toRichTextHtml(value), options)
}

/** Visible text only, for length checks and plain text previews. */
export function richTextToPlain(value: string | null | undefined) {
  return sanitizeHtml(value ?? "", { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}
