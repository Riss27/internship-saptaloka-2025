import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Code,
  Link as LinkIcon,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  RefreshCw,
  Strikethrough,
  ListOrdered,
} from "lucide-react";

const RichTextEditor = ({ content, onUpdate, maxLength }) => {
  const [charCount, setCharCount] = React.useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-brand-400 underline",
        },
      }),
      Subscript,
      Superscript,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      setCharCount(text.length);

      // Jika ada maxLength dan melebihi batas, jangan update
      if (maxLength && text.length > maxLength) {
        return;
      }

      onUpdate(html);
    },
    editorProps: {
      attributes: {
        class: "max-w-none p-4 min-h-[150px] focus:outline-none ",
      },
    },
  });

  React.useEffect(() => {
    // Guard: @tiptap bisa menyerahkan instance yang sudah di-destroy (schema null)
    // pada race mount — getHTML() melempar TypeError di kondisi itu.
    if (!editor || editor.isDestroyed || !editor.schema) return;
    if (content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
      const text = editor.getText();
      setCharCount(text.length);
    }
  }, [content, editor]);

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Masukkan URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="bg-brand-800 border border-border rounded-md">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-3 bg-brand-700 rounded-t-md border-b border-border">
        {/* Basic Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 min-h-11 min-w-11 grid place-items-center rounded bg-brand-700 transition-colors ${
            editor.isActive("bold")
              ? "bg-brand-600 text-cream"
              : "text-cream/80"
          }`}
          title="Tebal"
          aria-label="Tebal"
        >
          <Bold aria-hidden="true" className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 min-h-11 min-w-11 grid place-items-center rounded bg-brand-700 transition-colors ${
            editor.isActive("italic")
              ? "bg-brand-600 text-cream"
              : "text-cream/80"
          }`}
          title="Miring"
          aria-label="Miring"
        >
          <Italic aria-hidden="true" className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 min-h-11 min-w-11 grid place-items-center rounded bg-brand-700 transition-colors ${
            editor.isActive("underline")
              ? "bg-brand-600 text-cream"
              : "text-cream/80"
          }`}
          title="Garis bawahi"
          aria-label="Garis bawahi"
        >
          <UnderlineIcon aria-hidden="true" className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 min-h-11 min-w-11 grid place-items-center rounded bg-brand-700 transition-colors ${
            editor.isActive("strike")
              ? "bg-brand-600 text-cream"
              : "text-cream/80"
          }`}
          title="Coret"
          aria-label="Coret"
        >
          <Strikethrough aria-hidden="true" className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 min-h-11 min-w-11 grid place-items-center rounded bg-brand-700 transition-colors ${
            editor.isActive("code")
              ? "bg-brand-600 text-cream"
              : "text-cream/80"
          }`}
          title="Kode"
          aria-label="Kode"
        >
          <Code aria-hidden="true" className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-brand-700 mx-1"></div>

        {/* Link */}
        <button
          type="button"
          onClick={addLink}
          className={`p-2 min-h-11 min-w-11 grid place-items-center rounded bg-brand-700 transition-colors ${
            editor.isActive("link")
              ? "bg-brand-600 text-cream"
              : "text-cream/80"
          }`}
          title="Tambah tautan"
          aria-label="Tambah tautan"
        >
          <LinkIcon aria-hidden="true" className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-brand-700 mx-1"></div>

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 min-h-11 min-w-11 grid place-items-center rounded bg-brand-700 transition-colors ${
            editor.isActive("bulletList")
              ? "bg-brand-600 text-cream"
              : "text-cream/80"
          }`}
          title="Daftar berbutir"
          aria-label="Daftar berbutir"
        >
          <List aria-hidden="true" className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 min-h-11 min-w-11 grid place-items-center rounded bg-brand-700 transition-colors ${
            editor.isActive("orderedList")
              ? "bg-brand-600 text-cream"
              : "text-cream/80"
          }`}
          title="Daftar bernomor"
          aria-label="Daftar bernomor"
        >
          <ListOrdered aria-hidden="true" className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-brand-700 mx-1"></div>

        {/* Subscript & Superscript */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={`p-2 min-h-11 min-w-11 grid place-items-center rounded bg-brand-700 transition-colors text-xs ${
            editor.isActive("subscript")
              ? "bg-brand-600 text-cream"
              : "text-cream/80"
          }`}
          title="Subscript"
        >
          x₂
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={`p-2 min-h-11 min-w-11 grid place-items-center rounded bg-brand-700 transition-colors text-xs ${
            editor.isActive("superscript")
              ? "bg-brand-600 text-cream"
              : "text-cream/80"
          }`}
          title="Superscript"
        >
          x²
        </button>

        <div className="w-px h-8 bg-brand-700 mx-1"></div>

        {/* Text Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 min-h-11 min-w-11 grid place-items-center rounded bg-brand-700 transition-colors ${
            editor.isActive({ textAlign: "left" })
              ? "bg-brand-600 text-cream"
              : "text-cream/80"
          }`}
          title="Rata kiri"
          aria-label="Rata kiri"
        >
          <AlignLeft aria-hidden="true" className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 min-h-11 min-w-11 grid place-items-center rounded bg-brand-700 transition-colors ${
            editor.isActive({ textAlign: "center" })
              ? "bg-brand-600 text-cream"
              : "text-cream/80"
          }`}
          title="Rata tengah"
          aria-label="Rata tengah"
        >
          <AlignCenter aria-hidden="true" className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 min-h-11 min-w-11 grid place-items-center rounded bg-brand-700 transition-colors ${
            editor.isActive({ textAlign: "right" })
              ? "bg-brand-600 text-cream"
              : "text-cream/80"
          }`}
          title="Rata kanan"
          aria-label="Rata kanan"
        >
          <AlignRight aria-hidden="true" className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`p-2 min-h-11 min-w-11 grid place-items-center rounded bg-brand-700 transition-colors ${
            editor.isActive({ textAlign: "justify" })
              ? "bg-brand-600 text-cream"
              : "text-cream/80"
          }`}
          title="Rata kiri-kanan"
          aria-label="Rata kiri-kanan"
        >
          <AlignJustify aria-hidden="true" className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-brand-700 mx-1"></div>

        {/* Clear Formatting */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          className="p-2 min-h-11 min-w-11 grid place-items-center rounded bg-brand-700 transition-colors text-cream/80"
          title="Hapus formatan"
          aria-label="Hapus formatan"
        >
          <RefreshCw aria-hidden="true" className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content */}
      <div className="rich-text-editor-content">
        <EditorContent editor={editor} />
      </div>

      {/* Character Counter */}
      {maxLength && (
        <div
          className={`text-sm px-4 py-2 border-t border-border ${
            charCount >= maxLength ? "text-red-400" : "text-cream/60"
          }`}
        >
          {charCount}/{maxLength} karakter
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
 .rich-text-editor-content .ProseMirror ul {
 list-style-type: disc;
 padding-left: 1.5rem;
 margin: 0.5rem 0;
 }
 .rich-text-editor-content .ProseMirror ol {
 list-style-type: decimal;
 padding-left: 1.5rem;
 margin: 0.5rem 0;
 }
 .rich-text-editor-content .ProseMirror li {
 margin: 0.25rem 0;
 display: list-item;
 }
 .rich-text-editor-content .ProseMirror p {
 margin: 0.5rem 0;
 }
 .rich-text-editor-content .ProseMirror strong {
 font-weight: bold;
 }
 .rich-text-editor-content .ProseMirror em {
 font-style: italic;
 }
 .rich-text-editor-content .ProseMirror u {
 text-decoration: underline;
 }
 .rich-text-editor-content .ProseMirror s {
 text-decoration: line-through;
 }
 .rich-text-editor-content .ProseMirror code {
 background-color: rgba(255, 255, 255, 0.1);
 padding: 0.125rem 0.25rem;
 border-radius: 0.25rem;
 font-family: monospace;
 font-size: 0.875rem;
 }
 .rich-text-editor-content .ProseMirror a {
 color: #06b6d4;
 text-decoration: underline;
 }
 .rich-text-editor-content .ProseMirror sub {
 vertical-align: sub;
 font-size: 0.75rem;
 }
 .rich-text-editor-content .ProseMirror sup {
 vertical-align: super;
 font-size: 0.75rem;
 }
 .rich-text-editor-content .ProseMirror[style*="text-align: center"] {
 text-align: center;
 }
 .rich-text-editor-content .ProseMirror[style*="text-align: right"] {
 text-align: right;
 }
 .rich-text-editor-content .ProseMirror[style*="text-align: justify"] {
 text-align: justify;
 }
 `,
        }}
      />
    </div>
  );
};

export default RichTextEditor;
