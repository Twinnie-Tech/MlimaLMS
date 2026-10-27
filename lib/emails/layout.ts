import { env } from "@/lib/env"

export type EmailContent = { subject: string; html: string; text: string }

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function appUrl(path = "/") {
  return new URL(path, env.BETTER_AUTH_URL).toString()
}

export function firstName(name: string | null | undefined) {
  return name?.trim().split(/\s+/)[0] || "there"
}

type Block =
  | { type: "text"; content: string }
  | { type: "code"; content: string }
  | { type: "highlight"; title: string; content: string }
  | { type: "list"; items: string[] }

export function renderEmail({
  subject,
  preheader,
  heading,
  blocks,
  cta,
  footnote,
}: {
  subject: string
  preheader: string
  heading: string
  blocks: Block[]
  cta?: { label: string; href: string }
  footnote?: string
}): EmailContent {
  const htmlBlocks = blocks
    .map((block) => {
      switch (block.type) {
        case "text":
          return `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#475569">${escapeHtml(block.content)}</p>`
        case "code":
          return `<p style="margin:0 0 24px;padding:16px;text-align:center;font-size:32px;font-weight:700;letter-spacing:10px;background:#f0fdf4;border-radius:12px;color:#15803d">${escapeHtml(block.content)}</p>`
        case "highlight":
          return `<div style="margin:0 0 20px;padding:16px;border-radius:12px;background:#f0fdf4;border:1px solid #bbf7d0"><p style="margin:0 0 4px;font-size:13px;color:#15803d">${escapeHtml(block.title)}</p><p style="margin:0;font-size:16px;font-weight:600;color:#0f172a">${escapeHtml(block.content)}</p></div>`
        case "list":
          return `<ul style="margin:0 0 20px;padding-left:20px;font-size:15px;line-height:1.8;color:#475569">${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
      }
    })
    .join("\n")

  const button = cta
    ? `<p style="margin:8px 0 24px"><a href="${escapeHtml(cta.href)}" style="display:inline-block;padding:12px 22px;border-radius:10px;background:#16a34a;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none">${escapeHtml(cta.label)}</a></p>`
    : ""

  const html = `<!doctype html>
<html>
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>
  <body style="margin:0;background:#f4f7f5;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#0f172a">
    <span style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;padding:32px">
          <tr><td>
            <p style="margin:0 0 24px;font-size:18px;font-weight:700;color:#16a34a">⛰ MlimaLMS</p>
            <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3">${escapeHtml(heading)}</h1>
            ${htmlBlocks}
            ${button}
            ${footnote ? `<p style="margin:0;padding-top:16px;border-top:1px solid #e2e8f0;font-size:13px;line-height:1.6;color:#64748b">${escapeHtml(footnote)}</p>` : ""}
          </td></tr>
        </table>
        <p style="margin:16px 0 0;font-size:12px;color:#94a3b8">MlimaLMS · Learn anything. Teach what you know.<br>
          <a href="${appUrl("/support")}" style="color:#94a3b8">Help centre</a></p>
      </td></tr>
    </table>
  </body>
</html>`

  const text = [
    heading,
    ...blocks.map((block) =>
      block.type === "list"
        ? block.items.map((item) => `- ${item}`).join("\n")
        : block.type === "highlight"
          ? `${block.title}: ${block.content}`
          : block.content
    ),
    cta ? `${cta.label}: ${cta.href}` : "",
    footnote ?? "",
    "MlimaLMS · Learn anything. Teach what you know.",
  ]
    .filter(Boolean)
    .join("\n\n")

  return { subject, html, text }
}
