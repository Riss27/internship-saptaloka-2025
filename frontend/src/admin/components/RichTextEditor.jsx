import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiCode,
  FiLink,
  FiList,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiAlignJustify,
  FiRefreshCw,
} from "react-icons/fi";
import { MdFormatStrikethrough, MdFormatListNumbered } from "react-icons/md";

const RichTextEditor = ({ content, onUpdate, maxLength, placeholder }) => {
  const [charCount, setCharCount] = React.useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-cyan-400 underline",
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
        class: "prose prose-invert max-w-none p-4 min-h-[150px] focus:outline-none prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4",
      },
    },
  });

  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
      const text = editor.getText();
      setCharCount(text.length);
    }
  }, [content, editor]);

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-600 rounded-md">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-3 bg-slate-700/50 rounded-t-md border-b border-slate-600">
        {/* Basic Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-slate-600 transition-colors ${
            editor.isActive("bold") ? "bg-cyan-600 text-white" : "text-slate-300"
          }`}
          title="Bold"
        >
          <FiBold size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-slate-600 transition-colors ${
            editor.isActive("italic") ? "bg-cyan-600 text-white" : "text-slate-300"
          }`}
          title="Italic"
        >
          <FiItalic size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-slate-600 transition-colors ${
            editor.isActive("underline") ? "bg-cyan-600 text-white" : "text-slate-300"
          }`}
          title="Underline"
        >
          <FiUnderline size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-slate-600 transition-colors ${
            editor.isActive("strike") ? "bg-cyan-600 text-white" : "text-slate-300"
          }`}
          title="Strikethrough"
        >
          <MdFormatStrikethrough size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-slate-600 transition-colors ${
            editor.isActive("code") ? "bg-cyan-600 text-white" : "text-slate-300"
          }`}
          title="Code"
        >
          <FiCode size={16} />
        </button>

        <div className="w-px h-8 bg-slate-600 mx-1"></div>

        {/* Link */}
        <button
          type="button"
          onClick={addLink}
          className={`p-2 rounded hover:bg-slate-600 transition-colors ${
            editor.isActive("link") ? "bg-cyan-600 text-white" : "text-slate-300"
          }`}
          title="Add Link"
        >
          <FiLink size={16} />
        </button>

        <div className="w-px h-8 bg-slate-600 mx-1"></div>

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-slate-600 transition-colors ${
            editor.isActive("bulletList") ? "bg-cyan-600 text-white" : "text-slate-300"
          }`}
          title="Bullet List"
        >
          <FiList size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-slate-600 transition-colors ${
            editor.isActive("orderedList") ? "bg-cyan-600 text-white" : "text-slate-300"
          }`}
          title="Numbered List"
        >
          <MdFormatListNumbered size={16} />
        </button>

        <div className="w-px h-8 bg-slate-600 mx-1"></div>

        {/* Subscript & Superscript */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={`p-2 rounded hover:bg-slate-600 transition-colors text-xs ${
            editor.isActive("subscript") ? "bg-cyan-600 text-white" : "text-slate-300"
          }`}
          title="Subscript"
        >
          x₂
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={`p-2 rounded hover:bg-slate-600 transition-colors text-xs ${
            editor.isActive("superscript") ? "bg-cyan-600 text-white" : "text-slate-300"
          }`}
          title="Superscript"
        >
          x²
        </button>

        <div className="w-px h-8 bg-slate-600 mx-1"></div>

        {/* Text Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded hover:bg-slate-600 transition-colors ${
            editor.isActive({ textAlign: "left" }) ? "bg-cyan-600 text-white" : "text-slate-300"
          }`}
          title="Align Left"
        >
          <FiAlignLeft size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded hover:bg-slate-600 transition-colors ${
            editor.isActive({ textAlign: "center" }) ? "bg-cyan-600 text-white" : "text-slate-300"
          }`}
          title="Align Center"
        >
          <FiAlignCenter size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded hover:bg-slate-600 transition-colors ${
            editor.isActive({ textAlign: "right" }) ? "bg-cyan-600 text-white" : "text-slate-300"
          }`}
          title="Align Right"
        >
          <FiAlignRight size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`p-2 rounded hover:bg-slate-600 transition-colors ${
            editor.isActive({ textAlign: "justify" }) ? "bg-cyan-600 text-white" : "text-slate-300"
          }`}
          title="Justify"
        >
          <FiAlignJustify size={16} />
        </button>

        <div className="w-px h-8 bg-slate-600 mx-1"></div>

        {/* Clear Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="p-2 rounded hover:bg-slate-600 transition-colors text-slate-300"
          title="Clear Formatting"
        >
          <FiRefreshCw size={16} />
        </button>
      </div>

      {/* Editor Content */}
      <div className="rich-text-editor-content">
        <EditorContent editor={editor} />
      </div>
      
      {/* Character Counter */}
      {maxLength && (
        <div className={`text-sm px-4 py-2 border-t border-slate-600 ${
          charCount >= maxLength ? "text-red-400" : "text-slate-400"
        }`}>
          {charCount}/{maxLength} karakter
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{
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
        `
      }} />
    </div>
  );
};

export default RichTextEditor;