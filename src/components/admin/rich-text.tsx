"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";
import {
  ArrowArcLeftIcon,
  ArrowArcRightIcon,
  CodeIcon,
  ImageIcon,
  LinkIcon,
  ListBulletsIcon,
  ListNumbersIcon,
  QuotesIcon,
  TableIcon,
  TextBolderIcon,
  TextHThreeIcon,
  TextHTwoIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@phosphor-icons/react";
import { useToast } from "@/components/toast";
import { uploadImage } from "./upload";

export function RichText({ value, onChange, folder, invalid }: { value: string; onChange: (html: string) => void; folder: string; invalid?: boolean }) {
  const [source, setSource] = useState(false);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] }, link: { openOnClick: false, autolink: true } }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TableKit.configure({ table: { resizable: false } }),
    ],
    content: value,
    editorProps: { attributes: { class: "prose-app min-h-[320px] px-4 py-4 outline-none md:px-6" } },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
  });

  // The document loads after the editor mounts on edit screens; sync it in once.
  const synced = useRef(false);
  useEffect(() => {
    if (!editor || synced.current || !value) return;
    if (editor.isEmpty) editor.commands.setContent(value, { emitUpdate: false });
    synced.current = true;
  }, [editor, value]);

  return (
    <div className={`overflow-hidden rounded-[20px] bg-paper ring-1 ${invalid ? "ring-brand" : "ring-line"} focus-within:ring-2 focus-within:ring-ink`}>
      {editor && <Toolbar editor={editor} folder={folder} source={source} onToggleSource={() => setSource((s) => !s)} />}
      {source ? (
        <textarea
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            editor?.commands.setContent(e.target.value, { emitUpdate: false });
          }}
          spellCheck={false}
          className="block min-h-[320px] w-full resize-y bg-ink px-4 py-4 font-mono text-[13px] leading-relaxed text-white outline-none"
          aria-label="HTML source"
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
}

function Toolbar({ editor, folder, source, onToggleSource }: { editor: Editor; folder: string; source: boolean; onToggleSource: () => void }) {
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      link: e.isActive("link"),
      table: e.isActive("table"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  function setLink() {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link address (leave empty to remove)", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "") editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  async function insertImage(file: File) {
    try {
      const url = await uploadImage(file, folder);
      const alt = window.prompt("Describe the image (for accessibility)") ?? "";
      editor.chain().focus().setImage({ src: url, alt }).run();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Upload failed");
    }
  }

  const sep = <span className="mx-1 h-5 w-px shrink-0 bg-line" />;

  return (
    <div className="sticky top-0 z-10 flex items-center gap-0.5 overflow-x-auto border-b border-line bg-paper/95 px-2 py-1.5 backdrop-blur [scrollbar-width:none]">
      <Btn label="Bold" active={state.bold} disabled={source} onClick={() => editor.chain().focus().toggleBold().run()}>
        <TextBolderIcon size={18} weight="bold" />
      </Btn>
      <Btn label="Italic" active={state.italic} disabled={source} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <TextItalicIcon size={18} weight="bold" />
      </Btn>
      <Btn label="Underline" active={state.underline} disabled={source} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <TextUnderlineIcon size={18} weight="bold" />
      </Btn>
      {sep}
      <Btn label="Heading" active={state.h2} disabled={source} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <TextHTwoIcon size={18} weight="bold" />
      </Btn>
      <Btn label="Subheading" active={state.h3} disabled={source} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <TextHThreeIcon size={18} weight="bold" />
      </Btn>
      {sep}
      <Btn label="Bulleted list" active={state.bullet} disabled={source} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <ListBulletsIcon size={18} weight="bold" />
      </Btn>
      <Btn label="Numbered list" active={state.ordered} disabled={source} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListNumbersIcon size={18} weight="bold" />
      </Btn>
      <Btn label="Quote" active={state.quote} disabled={source} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <QuotesIcon size={18} weight="bold" />
      </Btn>
      {sep}
      <Btn label="Link" active={state.link} disabled={source} onClick={setLink}>
        <LinkIcon size={18} weight="bold" />
      </Btn>
      <Btn label="Image" disabled={source} onClick={() => fileRef.current?.click()}>
        <ImageIcon size={18} weight="bold" />
      </Btn>
      <Btn
        label={state.table ? "Remove table" : "Table"}
        active={state.table}
        disabled={source}
        onClick={() =>
          state.table
            ? editor.chain().focus().deleteTable().run()
            : editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
      >
        <TableIcon size={18} weight="bold" />
      </Btn>
      {state.table && (
        <>
          <TextBtn onClick={() => editor.chain().focus().addRowAfter().run()}>+ Row</TextBtn>
          <TextBtn onClick={() => editor.chain().focus().addColumnAfter().run()}>+ Col</TextBtn>
          <TextBtn onClick={() => editor.chain().focus().deleteRow().run()}>− Row</TextBtn>
          <TextBtn onClick={() => editor.chain().focus().deleteColumn().run()}>− Col</TextBtn>
        </>
      )}
      {sep}
      <Btn label="Undo" disabled={source || !state.canUndo} onClick={() => editor.chain().focus().undo().run()}>
        <ArrowArcLeftIcon size={18} weight="bold" />
      </Btn>
      <Btn label="Redo" disabled={source || !state.canRedo} onClick={() => editor.chain().focus().redo().run()}>
        <ArrowArcRightIcon size={18} weight="bold" />
      </Btn>
      <span className="flex-1" />
      <Btn label={source ? "Back to editor" : "Edit HTML"} active={source} onClick={onToggleSource}>
        <CodeIcon size={18} weight="bold" />
      </Btn>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void insertImage(file);
        }}
      />
    </div>
  );
}

function Btn({ label, active, disabled, onClick, children }: { label: string; active?: boolean; disabled?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`grid size-9 shrink-0 place-items-center rounded-xl transition-colors disabled:opacity-30 ${
        active ? "bg-ink text-white" : "text-ink-2 hover:bg-mist hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function TextBtn({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="h-8 shrink-0 rounded-lg bg-mist px-2 text-[12px] font-bold text-ink-2 hover:bg-fog"
    >
      {children}
    </button>
  );
}
