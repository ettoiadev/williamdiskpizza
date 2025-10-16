/**
 * Rich Text Editor Component
 * 
 * Editor de texto rico usando Tiptap.
 * Suporta formatação básica: negrito, itálico, sublinhado, listas, etc.
 * Sem warnings de deprecation e compatível com Vercel.
 * 
 * @module components/RichTextEditor
 */

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  List, 
  ListOrdered,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

/**
 * RichTextEditor - Editor de texto com formatação (Tiptap)
 */
export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Digite aqui...',
  minHeight = '200px'
}: RichTextEditorProps) {
  
  // ✅ Ref para prevenir loops infinitos
  const isUpdatingRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      // ✅ Prevenir loop: só chamar onChange se não estiver atualizando externamente
      if (!isUpdatingRef.current) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[' + minHeight + '] p-4',
      },
    },
  });

  // ✅ Atualizar conteúdo quando value mudar externamente (sem causar loop)
  useEffect(() => {
    if (!editor) return;
    
    // Normalizar HTML para comparação (remover espaços extras)
    const normalizeHtml = (html: string) => {
      return html
        .replace(/\s+/g, ' ')  // Múltiplos espaços -> 1 espaço
        .replace(/> </g, '><')  // Remover espaços entre tags
        .trim();
    };

    const currentContent = normalizeHtml(editor.getHTML());
    const newContent = normalizeHtml(value || '');
    
    // Só atualizar se realmente diferente
    if (currentContent !== newContent) {
      isUpdatingRef.current = true;
      
      // Salvar posição do cursor
      const { from, to } = editor.state.selection;
      
      // Atualizar conteúdo sem emitir evento de update
      editor.commands.setContent(value || '', false);
      
      // Tentar restaurar posição do cursor (se possível)
      try {
        if (from <= editor.state.doc.content.size) {
          editor.commands.setTextSelection({ from: Math.min(from, editor.state.doc.content.size), to: Math.min(to, editor.state.doc.content.size) });
        }
      } catch {
        // Ignorar erro se posição inválida
      }
      
      // Resetar flag após um pequeno delay
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  }, [value]);  // ✅ Remover editor das dependências

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const url = window.prompt('URL do link:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b">
        {/* Headings */}
        <Button
          type="button"
          variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Título 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Título 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Título 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text formatting */}
        <Button
          type="button"
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Negrito (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Itálico (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('underline') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Sublinhado (Ctrl+U)"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('strike') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Tachado"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <Button
          type="button"
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Lista não ordenada"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Lista ordenada"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Alignment */}
        <Button
          type="button"
          variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Alinhar à esquerda"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Centralizar"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="Alinhar à direita"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          title="Justificar"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Link */}
        <Button
          type="button"
          variant={editor.isActive('link') ? 'default' : 'ghost'}
          size="sm"
          onClick={setLink}
          title="Inserir link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent 
        editor={editor} 
        className="prose prose-sm max-w-none"
        style={{ minHeight }}
      />
    </div>
  );
}
