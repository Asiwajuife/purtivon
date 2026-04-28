"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import EditorToolbar from "./EditorToolbar";

interface RichTextEditorProps {
  value: object | null;
  onChange: (json: object) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image.configure({
        HTMLAttributes: {
          style: "max-width:100%;height:auto;border-radius:3px;",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Write your article…",
      }),
    ],
    content: value ?? undefined,
    onUpdate({ editor }) {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor-content",
      },
    },
  });

  return (
    <div style={{
      border: "1px solid var(--border-dim)",
      borderRadius: 4,
      background: "var(--surface-subtle)",
      overflow: "hidden",
    }}>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
      <style>{`
        .tiptap-editor-content {
          min-height: 380px;
          padding: 1.25rem 1.4rem;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          line-height: 1.8;
          color: #f0ede6;
        }
        .tiptap-editor-content h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 300;
          line-height: 1.15;
          color: #f0ede6;
          margin: 1.5rem 0 0.75rem;
        }
        .tiptap-editor-content h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 300;
          line-height: 1.2;
          color: #f0ede6;
          margin: 1.4rem 0 0.65rem;
        }
        .tiptap-editor-content h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 400;
          color: #f0ede6;
          margin: 1.2rem 0 0.5rem;
        }
        .tiptap-editor-content p {
          margin: 0 0 0.85rem;
        }
        .tiptap-editor-content ul,
        .tiptap-editor-content ol {
          padding-left: 1.5rem;
          margin: 0 0 0.85rem;
        }
        .tiptap-editor-content li {
          margin-bottom: 0.25rem;
        }
        .tiptap-editor-content blockquote {
          border-left: 2px solid #c9a84c;
          margin: 1rem 0;
          padding: 0.75rem 1.25rem;
          background: rgba(201,168,76,0.03);
          font-style: italic;
          color: rgba(240,237,230,0.8);
        }
        .tiptap-editor-content a {
          color: #c9a84c;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .tiptap-editor-content img {
          max-width: 100%;
          height: auto;
          border-radius: 3px;
          margin: 0.75rem 0;
          display: block;
        }
        .tiptap-editor-content p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--text-4);
          pointer-events: none;
          height: 0;
        }
        .tiptap-editor-content:focus {
          outline: none;
        }
        .tiptap-editor-content code {
          background: var(--border-faint);
          padding: 0.1em 0.35em;
          border-radius: 3px;
          font-size: 0.85em;
          font-family: 'Fira Code', monospace;
        }
        .tiptap-editor-content pre {
          background: var(--border-faint);
          border: 1px solid var(--border-dim);
          border-radius: 4px;
          padding: 1rem 1.25rem;
          overflow-x: auto;
          margin: 0.85rem 0;
        }
        .tiptap-editor-content pre code {
          background: none;
          padding: 0;
        }
        .tiptap-editor-content hr {
          border: none;
          border-top: 1px solid var(--border-dim);
          margin: 1.5rem 0;
        }
      `}</style>
    </div>
  );
}
