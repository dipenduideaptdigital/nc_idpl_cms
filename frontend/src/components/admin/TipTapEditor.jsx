import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';

import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  Subscript as SubIcon, Superscript as SuperIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Undo, Redo, Heading1, Heading2,
  Link as LinkIcon, Unlink, Highlighter, Palette, 
  Table as TableIcon, Trash2, Eraser
} from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter the URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const buttonClass = (isActive) => `
    p-1.5 rounded-md transition-colors flex items-center justify-center
    ${isActive ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'}
  `;

  const labelClass = `p-1.5 rounded-md transition-colors flex items-center justify-center text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 cursor-pointer`;

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 border-b border-zinc-200 bg-zinc-50/80 rounded-t-xl">
      
      {/* 1. History & Clear Formatting */}
      <div className="flex items-center gap-0.5">
        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} className={buttonClass(false)} title="Undo"><Undo className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} className={buttonClass(false)} title="Redo"><Redo className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} className={buttonClass(false)} title="Clear Formatting"><Eraser className="w-4 h-4 text-red-500" /></button>
      </div>

      <div className="w-px h-5 bg-zinc-300 mx-1"></div>

      {/*Text Styles */}
      <div className="flex items-center gap-0.5">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass(editor.isActive('bold'))} title="Bold"><Bold className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass(editor.isActive('italic'))} title="Italic"><Italic className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={buttonClass(editor.isActive('underline'))} title="Underline"><UnderlineIcon className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={buttonClass(editor.isActive('strike'))} title="Strikethrough"><Strikethrough className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleSubscript().run()} className={buttonClass(editor.isActive('subscript'))} title="Subscript"><SubIcon className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleSuperscript().run()} className={buttonClass(editor.isActive('superscript'))} title="Superscript"><SuperIcon className="w-4 h-4" /></button>
      </div>

      <div className="w-px h-5 bg-zinc-300 mx-1"></div>

      {/* Colors */}
      <div className="flex items-center gap-1 relative">
        <label className={labelClass} title="Text Color">
          <Palette className="w-4 h-4" />
          <input 
            type="color" 
            onInput={(event) => editor.chain().focus().setColor(event.target.value).run()} 
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="absolute opacity-0 w-0 h-0"
          />
        </label>
        <label className={labelClass} title="Highlight Color">
          <Highlighter className="w-4 h-4" />
          <input 
            type="color" 
            onInput={(event) => editor.chain().focus().toggleHighlight({ color: event.target.value }).run()} 
            className="absolute opacity-0 w-0 h-0"
          />
        </label>
      </div>

      <div className="w-px h-5 bg-zinc-300 mx-1"></div>

      {/* Headings & Alignment */}
      <div className="flex items-center gap-0.5">
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={buttonClass(editor.isActive('heading', { level: 1 }))} title="Heading 1"><Heading1 className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonClass(editor.isActive('heading', { level: 2 }))} title="Heading 2"><Heading2 className="w-4 h-4" /></button>
        
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={buttonClass(editor.isActive({ textAlign: 'left' }))} title="Align Left"><AlignLeft className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={buttonClass(editor.isActive({ textAlign: 'center' }))} title="Align Center"><AlignCenter className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={buttonClass(editor.isActive({ textAlign: 'right' }))} title="Align Right"><AlignRight className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={buttonClass(editor.isActive({ textAlign: 'justify' }))} title="Justify"><AlignJustify className="w-4 h-4" /></button>
      </div>

      <div className="w-px h-5 bg-zinc-300 mx-1"></div>

      {/* Lists & Links */}
      <div className="flex items-center gap-0.5">
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClass(editor.isActive('bulletList'))} title="Bullet List"><List className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClass(editor.isActive('orderedList'))} title="Numbered List"><ListOrdered className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={buttonClass(editor.isActive('blockquote'))} title="Quote"><Quote className="w-4 h-4" /></button>
        <button type="button" onClick={setLink} className={buttonClass(editor.isActive('link'))} title="Add Link"><LinkIcon className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')} className={buttonClass(false)} title="Remove Link"><Unlink className="w-4 h-4" /></button>
      </div>

      <div className="w-px h-5 bg-zinc-300 mx-1"></div>

      {/*Tables */}
      <div className="flex items-center gap-0.5">
        <button type="button" onClick={insertTable} className={buttonClass(false)} title="Insert Table"><TableIcon className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} disabled={!editor.can().deleteTable()} className={buttonClass(false)} title="Delete Table"><Trash2 className="w-4 h-4 text-red-500" /></button>
      </div>

    </div>
  );
};

const TipTapEditor = ({ value, onChange, placeholder = 'Start typing...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-blue-600 underline cursor-pointer' },
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[200px] p-4 text-zinc-800',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  return (
    <div className="w-full border border-zinc-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-zinc-900 focus-within:border-zinc-900 transition-all overflow-hidden">
      <MenuBar editor={editor} />
      <div className="max-h-[500px] overflow-y-auto bg-white editor-content-area">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TipTapEditor;