"use client"

import { useEffect, useState } from "react"
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
  BoldIcon,
  CodeIcon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  QuoteIcon,
  Redo2Icon,
  SquareCodeIcon,
  StrikethroughIcon,
  UnderlineIcon,
  Undo2Icon,
  type LucideIcon,
} from "lucide-react"
import { cn } from "cn"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"

type RichTextEditorProps = {
  /** Form field name. When set, the HTML is submitted through a hidden input. */
  name?: string
  id?: string
  defaultValue?: string
  onChange?: (html: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function RichTextEditor({
  name,
  id,
  defaultValue = "",
  onChange,
  placeholder = "Start writing...",
  disabled = false,
  className,
}: RichTextEditorProps) {
  const [html, setHtml] = useState(defaultValue)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
    ],
    content: defaultValue,
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        class: "rich-text min-h-40 px-3 py-2.5 outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const next = editor.isEmpty ? "" : editor.getHTML()
      setHtml(next)
      onChange?.(next)
    },
  })

  const isEmpty = useEditorState({
    editor,
    selector: ({ editor }) => editor?.isEmpty ?? true,
  })

  useEffect(() => {
    editor?.setEditable(!disabled)
  }, [editor, disabled])

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-input transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <Toolbar editor={editor} disabled={disabled} />
      <div className="relative">
        {isEmpty && (
          <p className="pointer-events-none absolute top-2.5 left-3 text-sm text-muted-foreground">
            {placeholder}
          </p>
        )}
        <EditorContent editor={editor} />
      </div>
      {name && <input type="hidden" name={name} value={html} />}
    </div>
  )
}

function Toolbar({ editor, disabled }: { editor: Editor | null; disabled: boolean }) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor
        ? {
            bold: editor.isActive("bold"),
            italic: editor.isActive("italic"),
            underline: editor.isActive("underline"),
            strike: editor.isActive("strike"),
            code: editor.isActive("code"),
            h2: editor.isActive("heading", { level: 2 }),
            h3: editor.isActive("heading", { level: 3 }),
            bulletList: editor.isActive("bulletList"),
            orderedList: editor.isActive("orderedList"),
            blockquote: editor.isActive("blockquote"),
            codeBlock: editor.isActive("codeBlock"),
            link: editor.isActive("link"),
            canUndo: editor.can().undo(),
            canRedo: editor.can().redo(),
          }
        : null,
  })

  if (!editor || !state) {
    return <div className="h-10 border-b bg-muted/40" />
  }

  const chain = () => editor.chain().focus()

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined
    const url = window.prompt("Link URL", previous ?? "https://")
    if (url === null) return
    if (url.trim() === "") {
      chain().extendMarkRange("link").unsetLink().run()
      return
    }
    chain().extendMarkRange("link").setLink({ href: url.trim() }).run()
  }

  const groups: ToolbarItem[][] = [
    [
      { label: "Bold", icon: BoldIcon, active: state.bold, run: () => chain().toggleBold().run() },
      { label: "Italic", icon: ItalicIcon, active: state.italic, run: () => chain().toggleItalic().run() },
      { label: "Underline", icon: UnderlineIcon, active: state.underline, run: () => chain().toggleUnderline().run() },
      { label: "Strikethrough", icon: StrikethroughIcon, active: state.strike, run: () => chain().toggleStrike().run() },
      { label: "Inline code", icon: CodeIcon, active: state.code, run: () => chain().toggleCode().run() },
      { label: "Link", icon: LinkIcon, active: state.link, run: setLink },
    ],
    [
      { label: "Heading 2", icon: Heading2Icon, active: state.h2, run: () => chain().toggleHeading({ level: 2 }).run() },
      { label: "Heading 3", icon: Heading3Icon, active: state.h3, run: () => chain().toggleHeading({ level: 3 }).run() },
    ],
    [
      { label: "Bullet list", icon: ListIcon, active: state.bulletList, run: () => chain().toggleBulletList().run() },
      { label: "Numbered list", icon: ListOrderedIcon, active: state.orderedList, run: () => chain().toggleOrderedList().run() },
      { label: "Quote", icon: QuoteIcon, active: state.blockquote, run: () => chain().toggleBlockquote().run() },
      { label: "Code block", icon: SquareCodeIcon, active: state.codeBlock, run: () => chain().toggleCodeBlock().run() },
      { label: "Divider", icon: MinusIcon, run: () => chain().setHorizontalRule().run() },
    ],
    [
      { label: "Undo", icon: Undo2Icon, disabled: !state.canUndo, run: () => chain().undo().run() },
      { label: "Redo", icon: Redo2Icon, disabled: !state.canRedo, run: () => chain().redo().run() },
    ],
  ]

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-1"
    >
      {groups.map((group, index) => (
        <div key={index} className="flex items-center gap-1">
          {index > 0 && <Separator orientation="vertical" className="mx-1 h-5" />}
          {group.map((item) => (
            <Toggle
              key={item.label}
              size="sm"
              aria-label={item.label}
              title={item.label}
              pressed={item.active ?? false}
              disabled={disabled || item.disabled}
              onPressedChange={item.run}
            >
              <item.icon />
            </Toggle>
          ))}
        </div>
      ))}
    </div>
  )
}

type ToolbarItem = {
  label: string
  icon: LucideIcon
  active?: boolean
  disabled?: boolean
  run: () => void
}
