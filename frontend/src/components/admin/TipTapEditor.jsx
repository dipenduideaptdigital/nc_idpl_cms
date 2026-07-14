import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Heading1, 
  Heading2,
  Link as LinkIcon,
  Unlink
} from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter the URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const buttonClass = (isActive) => `
    p-2 rounded-md transition-colors flex items-center justify-center
    ${isActive ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'}
  `;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-zinc-200 bg-zinc-50/80 rounded-t-xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive('bold'))}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive('italic'))}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={buttonClass(editor.isActive('underline'))}
        title="Underline"
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive('strike'))}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-zinc-300 mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 1 }))}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-zinc-300 mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive('bulletList'))}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive('orderedList'))}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={buttonClass(editor.isActive('blockquote'))}
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-zinc-300 mx-1"></div>

      <button
        type="button"
        onClick={setLink}
        className={buttonClass(editor.isActive('link'))}
        title="Add Link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
        className={buttonClass(false)}
        title="Remove Link"
      >
        <Unlink className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-zinc-300 mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={buttonClass(false)}
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={buttonClass(false)}
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

const TipTapEditor = ({ value, onChange, placeholder = 'Start typing...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[150px] p-4 text-zinc-800',
      },
    },
    onUpdate: ({ editor }) => {
      // Pass the HTML string to the parent component
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Update editor content if external value changes (like when loading data from API)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  return (
    <div className="w-full border border-zinc-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-zinc-900 focus-within:border-zinc-900 transition-all overflow-hidden">
      <MenuBar editor={editor} />
      <div className="max-h-[400px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TipTapEditor;